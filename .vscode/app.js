// --- Data Management & Endpoints ---
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzNxzoDw-okWNlR7wg4AUGZBk4kaj4aRNpRCS5C0gS6b_Tw9upH1eexnHEoe1waswJfdQ/exec';

let appData = { users: [], dosen: {}, mataKuliah: {}, students: {} };
let currentUser = null;
let analyticsChart = null;

const scale = {
    'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D': 1.0, 'E': 0.0
};

// --- TOMBOL INTERMEDIATE DAN LOGIN REGISTER MANUAL ---
function toggleAuthBox(box) {
    if(box === 'register') {
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('register-box').classList.remove('hidden');
    } else {
        document.getElementById('register-box').classList.add('hidden');
        document.getElementById('login-box').classList.remove('hidden');
    }
}

function handleManualLogin(event) {
    event.preventDefault();
    const userInp = document.getElementById('login-username').value.trim();
    const passInp = document.getElementById('login-password').value.trim();

    const matchedUser = appData.users.find(u => u.username.toLowerCase() === userInp.toLowerCase() && u.password === passInp);

    if (matchedUser) {
        currentUser = matchedUser;
        document.getElementById('dashboard-user-name').innerText = currentUser.nama;
        document.getElementById('user-role-badge').innerText = currentUser.role;
        document.getElementById('auth-portal').classList.add('hidden');
        
        const rootAdminElements = document.querySelectorAll('.root-admin');
        const rootDosenElements = document.querySelectorAll('.root-dosen');
        
        if (currentUser.role === 'MAHASISWA') {
            rootAdminElements.forEach(el => el.classList.add('hidden'));
            rootDosenElements.forEach(el => el.classList.add('hidden'));
            switchTab('view');
        } else if (currentUser.role === 'DOSEN') {
            rootAdminElements.forEach(el => el.classList.add('hidden'));
            rootDosenElements.forEach(el => el.classList.remove('hidden'));
            switchTab('input');
        } else {
            rootAdminElements.forEach(el => el.classList.remove('hidden'));
            rootDosenElements.forEach(el => el.classList.remove('hidden'));
            switchTab('dashboard');
        }
        showToast(`Selamat datang ${currentUser.nama}`, "success");
    } else {
        showToast("Nama Pengguna atau Kata Sandi Salah!", "error");
    }
}

async function handleManualRegister(event) {
    event.preventDefault();
    const nama = document.getElementById('reg-nama').value.trim();
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value.trim();
    const role = document.getElementById('reg-role').value;
    
    document.getElementById('loading-overlay').classList.remove('opacity-0', 'hidden');

    const payload = { 
        id: Date.now(), 
        action: "register_user", 
        username: user, 
        password: pass, 
        role: role, 
        namaLengkap: nama 
    };

    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        document.getElementById('loading-overlay').classList.add('hidden');
        
        if (result && result.status === "exists") {
            showToast("Username sudah digunakan!", "error");
        } else {
            showToast("Registrasi Akun Baru Berhasil!", "success");
            toggleAuthBox('login');
            fetchDataFromGoogleSheets();
        }
    } catch(err) {
        document.getElementById('loading-overlay').classList.add('hidden');
        showToast("Koneksi Pendaftaran Gagal!", "error");
    }
}

function logoutGateway() {
    currentUser = null;
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('auth-portal').classList.remove('hidden');
    closeDetail();
}

// --- Sinkronisasi Cloud Server Pipeline ---
function sendToGoogleSheets(payload) {
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
    });
}

function sendToWhatsApp(payload) {
    fetch('http://localhost:3000/send-wa', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
    }).catch(() => console.log("WA local gateway bypass."));
}

// --- Fetch & Object Reconstitution Pipeline ---
async function fetchDataFromGoogleSheets() {
    const overlay = document.getElementById('loading-overlay');
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        
        appData = { users: data.users || [], dosen: {}, mataKuliah: {}, students: {} };
        
        if (data.dosen) {
            data.dosen.forEach(dsn => appData.dosen[dsn.nidn] = { id: dsn.id, nidn: dsn.nidn, nama: dsn.nama });
        }
        if (data.mataKuliah) {
            data.mataKuliah.forEach(mk => {
                appData.mataKuliah[mk.kode] = { id: mk.id, kode: mk.kode, nama: mk.nama, sks: parseInt(mk.sks) };
            });
        }
        if (data.students) {
            data.students.forEach(row => {
                const nim = row.nim;
                const semester = row.semester;
                if (!appData.students[nim]) {
                    appData.students[nim] = { nim: nim, nama: row.nama, semesters: {} };
                }
                if (!appData.students[nim].semesters[semester]) {
                    appData.students[nim].semesters[semester] = [];
                }
                appData.students[nim].semesters[semester].push({
                    id: row.id, kode: row.kodeMk || '-', matkul: row.matkul, sks: parseInt(row.sks), nilaiHuruf: row.nilaiHuruf, nilaiAngka: scale[row.nilaiHuruf] || 0
                });
            });
        }
        
        updateDashboard();
        updateDosenView();
        updateMasterView();
        populateMatkulDropdown();
        updateView();
        
        overlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => overlay.classList.add('hidden'), 500);
    } catch (error) {
        console.error("Gagal melakukan penarikan data cloud:", error);
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
}

function switchTab(tabId) {
    const sections = ['dashboard', 'dosen', 'master', 'input', 'view'];
    sections.forEach(sec => {
        const el = document.getElementById(`sec-${sec}`);
        if(el) el.classList.add('hidden');
        const navEl = document.getElementById(`nav-${sec}`);
        if(navEl) navEl.classList.remove('nav-active');
    });
    document.getElementById(`sec-${tabId}`).classList.remove('hidden');
    document.getElementById(`nav-${tabId}`).classList.add('nav-active');
    if (tabId === 'dashboard') updateDashboard();
    if (tabId === 'view') updateView();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    const iconEl = document.getElementById('toast-icon');
    msgEl.innerText = message.toUpperCase();
    
    iconEl.innerHTML = type === 'error' ? '<i class="fas fa-circle-exclamation text-red-400"></i>' : '<i class="fas fa-circle-check text-[#c5a872]"></i>';
    
    toast.classList.remove('translate-y-full', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-full', 'opacity-0'), 3500);
}

// --- INPUT DATA MASTER DOSEN ---
function handleDosenSubmit(event) {
    event.preventDefault();
    const nidn = document.getElementById('dosen-nidn').value.trim();
    const nama = document.getElementById('dosen-nama').value.trim();
    const uniqueId = Date.now();
    appData.dosen[nidn] = { id: uniqueId, nidn, nama };
    sendToGoogleSheets({ id: uniqueId, action: 'master_dosen', nidn, namaDosen: nama });
    document.getElementById('dosen-nidn').value = '';
    document.getElementById('dosen-nama').value = '';
    updateDosenView();
    updateDashboard();
    showToast("Data Dosen Berhasil Direkam");
}

function updateDosenView() {
    const tbody = document.getElementById('table-dosen-body');
    tbody.innerHTML = '';
    Object.values(appData.dosen).forEach(dsn => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50/50 transition-colors';
        tr.innerHTML = `<td class="p-3.5 pl-5 font-mono font-semibold text-slate-700">${dsn.nidn}</td><td class="p-3.5 font-medium">${dsn.nama}</td><td class="p-3.5 text-center pr-5 text-slate-400 italic">Terverifikasi Aman</td>`;
        tbody.appendChild(tr);
    });
}

// --- INPUT DATA MASTER MATKUL ---
function handleMasterSubmit(event) {
    event.preventDefault();
    const kode = document.getElementById('master-kode').value.trim().toUpperCase();
    const nama = document.getElementById('master-nama').value.trim();
    const sks = parseInt(document.getElementById('master-sks').value);
    const uniqueId = Date.now();
    appData.mataKuliah[kode] = { id: uniqueId, kode, nama, sks };
    sendToGoogleSheets({ id: uniqueId, action: 'master_matkul', kode, namaMK: nama, sks });
    document.getElementById('master-kode').value = '';
    document.getElementById('master-nama').value = '';
    document.getElementById('master-sks').value = '';
    updateMasterView();
    updateDashboard();
    populateMatkulDropdown();
    showToast("Mata Kuliah Katalog Berhasil");
}

function updateMasterView() {
    const tbody = document.getElementById('table-master-body');
    tbody.innerHTML = '';
    Object.values(appData.mataKuliah).forEach(mk => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50/50 transition-colors';
        tr.innerHTML = `<td class="p-3.5 pl-5 font-mono font-semibold text-slate-700">${mk.kode}</td><td class="p-3.5 font-medium">${mk.nama}</td><td class="p-3.5 text-center font-mono">${mk.sks} SKS</td><td class="p-3.5 text-center pr-5 text-slate-400 italic">Locked</td>`;
        tbody.appendChild(tr);
    });
}

function populateMatkulDropdown() {
    const select = document.getElementById('input-matkul');
    select.innerHTML = '<option value="" disabled selected>-- Pilih Acuan Kurikulum --</option>';
    Object.values(appData.mataKuliah).forEach(mk => {
        const opt = document.createElement('option');
        opt.value = mk.kode; opt.text = `${mk.kode} - ${mk.nama}`;
        opt.setAttribute('data-sks', mk.sks); opt.setAttribute('data-nama', mk.nama);
        select.appendChild(opt);
    });
}

function updateSksDisplay() {
    const select = document.getElementById('input-matkul');
    if (select.selectedIndex > 0) {
        const sks = select.options[select.selectedIndex].getAttribute('data-sks');
        document.getElementById('input-sks').value = sks;
    }
}

function convertScoreToGrade(score) {
    if (score >= 85) return 'A'; if (score >= 80) return 'B+'; if (score >= 70) return 'B';
    if (score >= 65) return 'C+'; if (score >= 55) return 'C'; if (score >= 45) return 'D';
    return 'E';
}

// --- INPUT NILAI MAHASISWA & PROTEKSI PARAMETER KETAT ---
function handleFormSubmit(event) {
    event.preventDefault();
    const tugas = parseFloat(document.getElementById('num-tugas').value) || 0;
    const kuis = parseFloat(document.getElementById('num-kuis').value) || 0;
    const uts = parseFloat(document.getElementById('num-uts').value) || 0;
    const uas = parseFloat(document.getElementById('num-uas').value) || 0;

    if ([tugas, kuis, uts, uas].some(val => val > 100 || val < 0)) {
        showToast("Proteksi Nilai: Input Parameter Melebihi Batas 100!", "error");
        return;
    }

    const nim = document.getElementById('input-nim').value.trim();
    const nama = document.getElementById('input-nama').value.trim();
    const semester = document.getElementById('input-semester').value;
    const select = document.getElementById('input-matkul');
    
    if (select.selectedIndex <= 0) {
        showToast("Pilih mata kuliah terlebih dahulu!", "error");
        return;
    }
    
    const kodeMk = select.value;
    const namaMk = select.options[select.selectedIndex].getAttribute('data-nama');
    const sks = parseInt(document.getElementById('input-sks').value);

    const totalScore = (tugas * 0.2) + (kuis * 0.1) + (uts * 0.3) + (uas * 0.4);
    const nilaiHuruf = convertScoreToGrade(totalScore);

    if (!appData.students[nim]) appData.students[nim] = { nim, nama, semesters: {} };
    if (!appData.students[nim].semesters[semester]) appData.students[nim].semesters[semester] = [];
    
    if (appData.students[nim].semesters[semester].some(mk => mk.kode === kodeMk)) {
        showToast("Mata kuliah sudah terekam di semester ini", "error"); return;
    }

    const uniqueId = Date.now();
    appData.students[nim].semesters[semester].push({ id: uniqueId, kode: kodeMk, matkul: namaMk, sks, nilaiHuruf, nilaiAngka: scale[nilaiHuruf] });
    const currentIpk = calculateIPK(appData.students[nim]).toFixed(2);
    
    sendToGoogleSheets({ id: uniqueId, action: 'input_nilai', nim, nama, semester, kodeMk, matkul: namaMk, sks, nilaiHuruf, ipk: currentIpk });
    sendToWhatsApp({ id: uniqueId, action: 'input_nilai', nim, nama, matkul: namaMk, nilaiHuruf, ipk: currentIpk });
    
    ['num-tugas', 'num-kuis', 'num-uts', 'num-uas', 'input-matkul'].forEach(id => document.getElementById(id).value = '');
    updateDashboard(); updateView();
    showToast("Kalkulasi & Sinkronisasi Selesai");
}

function calculateIPK(student) {
    let totalBobot = 0, totalSKS = 0;
    for (const sem in student.semesters) {
        student.semesters[sem].forEach(mk => { totalBobot += (mk.sks * mk.nilaiAngka); totalSKS += mk.sks; });
    }
    return totalSKS === 0 ? 0 : (totalBobot / totalSKS);
}

function calculateIPS(semesterData) {
    let totalBobot = 0, totalSKS = 0;
    semesterData.forEach(mk => { totalBobot += (mk.sks * mk.nilaiAngka); totalSKS += mk.sks; });
    return totalSKS === 0 ? 0 : (totalBobot / totalSKS);
}

// --- ANALYTICS DASHBOARD STATISTIK GRAPH ---
function renderAnalyticsChart(labels, dataValues) {
    const ctx = document.getElementById('chart-nilai-analytics').getContext('2d');
    if (analyticsChart) analyticsChart.destroy();
    analyticsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ 
                data: dataValues, 
                backgroundColor: 'rgba(197, 168, 114, 0.4)', 
                borderColor: '#a38247', 
                borderWidth: 1.2, 
                borderRadius: 4, 
                barThickness: 20 
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                y: { min: 0, max: 4, grid: { color: '#f1f1f1' }, ticks: { color: '#94a3b8', font: { size: 10 } } }, 
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } } 
            }
        }
    });
}

function updateDashboard() {
    let totalDosen = Object.keys(appData.dosen).length;
    let totalMhs = Object.keys(appData.students).length;
    let totalMatkulMaster = Object.keys(appData.mataKuliah).length;
    let totalNilai = 0, chartLabels = [], chartData = [];

    Object.values(appData.students).forEach(student => {
        chartLabels.push(student.nama.split(' ')[0]); chartData.push(calculateIPK(student));
        for (const sem in student.semesters) totalNilai += student.semesters[sem].length;
    });

    document.getElementById('stat-dosen').innerText = totalDosen;
    document.getElementById('stat-mhs').innerText = totalMhs;
    document.getElementById('stat-matkul-master').innerText = totalMatkulMaster;
    document.getElementById('stat-nilai').innerText = totalNilai;
    if(chartLabels.length > 0) renderAnalyticsChart(chartLabels, chartData);
}

function updateView() {
    const tbody = document.getElementById('table-mhs-body'); tbody.innerHTML = '';
    Object.values(appData.students).forEach(student => {
        let totalSKS = 0;
        for (const sem in student.semesters) student.semesters[sem].forEach(mk => totalSKS += mk.sks);
        const ipk = calculateIPK(student).toFixed(2);
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50/40 transition-colors text-slate-600';
        tr.innerHTML = `
            <td class="p-4 pl-5"><div><p class="font-bold text-slate-700">${student.nama}</p><p class="text-[10px] text-slate-400 font-mono">${student.nim}</p></div></td>
            <td class="p-4 text-center font-mono font-semibold">${totalSKS}</td>
            <td class="p-4 text-center"><span class="border border-amber-200/60 text-[#94753c] px-2.5 py-0.5 bg-amber-50/40 rounded-lg font-bold font-mono text-xs">${ipk}</span></td>
            <td class="p-4 text-center pr-5"><button onclick="viewDetail('${student.nim}')" class="bg-white border border-slate-200 hover:border-[#c5a872] text-xs px-3.5 py-1.5 rounded-xl font-medium shadow-sm transition-all">Lihat KHS</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function viewDetail(nim) {
    const student = appData.students[nim]; if (!student) return;
    document.getElementById('detail-nim').innerText = student.nim;
    document.getElementById('detail-nama').innerText = student.nama;
    document.getElementById('detail-ipk').innerText = calculateIPK(student).toFixed(2);

    const semestersContainer = document.getElementById('detail-semesters'); semestersContainer.innerHTML = '';
    Object.keys(student.semesters).sort((a, b) => parseInt(a) - parseInt(b)).forEach(sem => {
        const mkData = student.semesters[sem]; let sksSem = 0, rows = '';
        mkData.forEach(mk => {
            sksSem += mk.sks;
            rows += `<tr class="border-b border-slate-100 text-slate-600"><td class="py-2.5 px-4"><p class="font-semibold text-slate-700">${mk.matkul}</p><p class="text-[10px] text-slate-400 font-mono">${mk.kode}</p></td><td class="py-2.5 px-4 text-center font-mono">${mk.sks}</td><td class="py-2.5 px-4 text-center font-bold text-[#94753c]">${mk.nilaiHuruf}</td><td class="py-2.5 px-4 text-center font-mono text-slate-400">${mk.nilaiAngka.toFixed(2)}</td></tr>`;
        });
        semestersContainer.innerHTML += `
            <div class="border border-slate-200/80 rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
                <div class="bg-slate-50/60 p-3.5 flex justify-between items-center border-b border-slate-200/60"><h4 class="font-bold text-slate-700 text-xs">Semester ${sem}</h4><div class="text-[10px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-slate-500 font-semibold">SKS: <span class="text-[#94753c] font-bold">${sksSem}</span> | IPS: <span class="text-emerald-600 font-bold">${calculateIPS(mkData).toFixed(2)}</span></div></div>
                <table class="w-full text-left"><thead class="bg-slate-50/30 text-slate-400 text-[9px] uppercase tracking-wider border-b border-slate-200/60"><tr><th class="py-2.5 px-4">Matkul</th><th class="py-2.5 px-4 text-center w-20">SKS</th><th class="py-2.5 px-4 text-center w-24">Grade</th><th class="py-2.5 px-4 text-center w-24">Bobot</th></tr></thead><tbody>${rows}</tbody></table>
            </div>`;
    });
    document.getElementById('detail-view').classList.remove('hidden');
    document.getElementById('detail-view').scrollIntoView({ behavior: 'smooth' });
}

// --- FITUR EKSTRA: UNDUH PDF KHS LANGSUNG MASUK KE FILE LAPTOP ---
function downloadTranscriptPDF() {
    const element = document.getElementById('detail-view');
    
    const options = {
        margin:       0.5,
        filename:     `KHS_Resmi_${document.getElementById('detail-nim').innerText}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    const actionButtons = document.getElementById('pdf-action-buttons');
    actionButtons.style.display = 'none';

    html2pdf().set(options).from(element).save().then(() => {
        actionButtons.style.display = 'flex';
        showToast("PDF Berhasil Diunduh ke Laptop Anda!", "success");
    });
}

function closeDetail() { document.getElementById('detail-view').classList.add('hidden'); }
window.onload = () => { fetchDataFromGoogleSheets(); };