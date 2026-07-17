"# SiNilai - Sistem Admin Mahasiswa

**Sistem manajemen nilai akademik untuk mahasiswa dan dosen**

## 🚀 Fitur

- 🔐 Login dengan role-based access (Admin, Dosen, Mahasiswa)
- 📊 Dashboard analytics dengan chart interaktif
- 📝 Input nilai dan management mata kuliah
- 💾 Data synchronization dengan Google Sheets
- 📱 Responsive design dengan Tailwind CSS
- 🔔 Notifikasi sistem

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS
- **Backend**: Express.js, CORS
- **Data**: Google Sheets API
- **Deployment**: Vercel
- **Charts**: Chart.js

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa.git
cd UAS_Sistem_Admin_Mahasiswa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` dan tambahkan URL Google Sheets Anda:
```
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Run Locally
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🌐 Deployment ke Vercel

### Langkah 1: Push ke GitHub
```bash
git add .
git commit -m "Fix: Restructure for Vercel deployment"
git push origin main
```

### Langkah 2: Deploy di Vercel
1. Kunjungi [vercel.com](https://vercel.com)
2. Click "New Project"
3. Pilih repository GitHub Anda
4. Klik "Import"
5. Environment variables sudah dikonfigurasi di `vercel.json`
6. Klik "Deploy"

### Langkah 3: Configure Environment Variables di Vercel
1. Buka project settings di Vercel
2. Buka "Environment Variables"
3. Tambahkan:
   - Key: `GOOGLE_SHEETS_URL`
   - Value: URL Google Sheets Anda

## 👥 Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| dosen | dosen123 | DOSEN |
| mahasiswa | mhs123 | MAHASISWA |

## 📝 API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🐛 Troubleshooting

### 404: NOT_FOUND di Vercel
- ✅ Pastikan file sudah di folder `public/`
- ✅ Check `vercel.json` configuration
- ✅ Restart deployment

### Environment Variables tidak terbaca
- ✅ Pastikan sudah di-set di Vercel project settings
- ✅ Redeploy project setelah menambah variables

## 📄 Project Structure

```
UAS_Sistem_Admin_Mahasiswa/
├── public/
│   ├── index.html
│   └── app.js
├── index.js
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

## 📞 Support

Untuk pertanyaan atau issue, buat di [GitHub Issues](https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa/issues)

## 📄 License

ISC

---

**Created by**: SiNilai Team
**Last Updated**: 2026-07-17" 
