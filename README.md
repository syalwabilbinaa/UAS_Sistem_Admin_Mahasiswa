"# SiNilai - Sistem Admin Mahasiswa

**Sistem manajemen nilai akademik untuk mahasiswa dan dosen**

> **🌐 Live Application**: https://uas-sistem-admin-mahasiswa.vercel.app  
> **📚 Source Code**: https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa  
> **📊 Database**: Google Sheets API Integration

---

## 🚀 Quick Start

### 1️⃣ Online Access
Akses aplikasi langsung tanpa setup:
```
https://uas-sistem-admin-mahasiswa.vercel.app
```

### 2️⃣ Local Development
```bash
# Clone repository
git clone https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa.git
cd UAS_Sistem_Admin_Mahasiswa

# Install dependencies
npm install

# Run server
npm start

# Akses di browser
# http://localhost:3000
```

---

## ✨ Fitur Utama

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| 🔐 **Authentication** | Login dengan role-based access | ✅ |
| 📊 **Dashboard** | Analytics dengan chart interaktif | ✅ |
| 📝 **Manajemen Nilai** | Input dan kelola nilai mahasiswa | ✅ |
| 📚 **Manajemen Mata Kuliah** | CRUD untuk mata kuliah | ✅ |
| 💾 **Google Sheets Sync** | Real-time data synchronization | ✅ |
| 📱 **Responsive Design** | Mobile-friendly interface | ✅ |
| 🔔 **Notifikasi** | System notifications | ✅ |

---

## 👥 Default Users untuk Testing

```javascript
// ADMIN
Username: admin
Password: admin123

// DOSEN
Username: dosen
Password: dosen123

// MAHASISWA
Username: mahasiswa
Password: mhs123
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, Vanilla JavaScript, Tailwind CSS |
| **Backend** | Express.js 4.18.2, Node.js 18+ |
| **Database** | Google Sheets API |
| **Hosting** | Vercel (Serverless) |
| **Visualization** | Chart.js 3.x |

---

## 📁 Project Structure

```
UAS_Sistem_Admin_Mahasiswa/
├── public/                     # Static files
│   ├── index.html             # Main UI (28KB)
│   └── app.js                 # Frontend + Google Sheets logic (20KB)
├── index.js                    # Express server (1KB)
├── package.json               # Dependencies
├── vercel.json                # Vercel configuration
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
└── DEPLOYMENT.md              # Deployment guide
```

---

## 🌐 Environment Configuration

### Google Sheets URL
**Status**: ✅ Configured  
**ID**: `AKfycbx5GzBIYR_qS5tzw9b-7pj_4DzcXWKSxEwT2U9PCvdFRLI1OYE8oKMbe7A0QpIMasAEaw`

Lokasi di kode:
- `public/app.js` (Line 2): `const GOOGLE_SHEETS_URL = '...'`

### Environment Variables
```bash
# Production (Vercel)
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycbx5GzBIYR_qS5tzv9b-7pj_4DzcXWKSxEwT2U9PCvdFRLI1OYE8oKMbe7A0QpIMasAEaw/exec
NODE_ENV=production
PORT=3000

# Development (Local)
NODE_ENV=development
PORT=3000
```

---

## 🔧 API Endpoints

### Health Check
```http
GET /api/health
```

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Static Files
```
GET /                  → index.html
GET /api/health       → Health check
```

---

## 📊 Data Flow

```
Browser (Frontend)
    ↓
    ├─→ HTML/CSS/JS dari public/ folder
    ├─→ App.js logic
    └─→ Google Sheets API calls

Express Server (Backend)
    ↓
    ├─→ Serve static files
    ├─→ API endpoints
    └─→ CORS handling

Google Sheets (Database)
    ↓
    ├─→ Users data
    ├─→ Students data
    ├─→ Courses data
    └─→ Grades data
```

---

## 🚀 Deployment

### Automatic Deployment
- **Platform**: Vercel
- **Trigger**: Push ke branch `main`
- **Status**: Live di https://uas-sistem-admin-mahasiswa.vercel.app

### Manual Redeploy
1. Buka https://vercel.com
2. Pilih project "uas-sistem-admin-mahasiswa"
3. Klik "Deployments" → "Redeploy"

---

## ✅ Testing Checklist

- [x] Local server running at port 3000
- [x] API health check responding
- [x] Static files serving correctly
- [x] Google Sheets URL updated
- [x] Folder structure cleaned
- [x] GitHub push successful
- [x] Vercel deployment active

---

## 📝 Recent Updates

### Version 1.0.0 (2026-07-17)
- ✨ Updated Google Sheets URL
- 🗂️ Cleaned folder structure
- 🔧 Optimized for Vercel deployment
- 📚 Added comprehensive documentation

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **404 Not Found** | Pastikan file di folder `public/`, check routing |
| **Google Sheets error** | Verify URL di `public/app.js`, check Apps Script endpoint |
| **Build gagal Vercel** | Check build logs, pastikan dependencies benar |
| **Port 3000 sudah terpakai** | `npm start -- --port 3001` atau kill process yang memakai 3000 |

---

## 📞 Support & Links

| Kategori | Link |
|----------|------|
| 🌐 **Live Application** | https://uas-sistem-admin-mahasiswa.vercel.app |
| 📚 **GitHub Repository** | https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa |
| 📊 **Vercel Dashboard** | https://vercel.com |
| 💾 **Google Sheets** | https://docs.google.com/spreadsheets |
| 📖 **Deployment Guide** | Buka file `DEPLOYMENT.md` |

---

## 📄 License

ISC

---

## 👨‍💻 Developed By

**SiNilai Development Team**  
Last Updated: **2026-07-17**  
Status: **✅ Production Ready**

---

**Questions?** Buka GitHub Issues atau hubungi development team."
