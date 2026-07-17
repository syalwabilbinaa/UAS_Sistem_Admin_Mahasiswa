# 🚀 Panduan Deployment Lengkap

## 📋 Informasi Aplikasi

| Aspek | Detail |
|-------|--------|
| **Nama Aplikasi** | SiNilai - Sistem Admin Mahasiswa |
| **Repository** | https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa |
| **URL Deployment** | https://uas-sistem-admin-mahasiswa.vercel.app |
| **Google Sheets DB** | AKfycbx5GzBIYR_qS5tzw9b-7pj_4DzcXWKSxEwT2U9PCvdFRLI1OYE8oKMbe7A0QpIMasAEaw |

## 🏗️ Struktur Folder

```
UAS_Sistem_Admin_Mahasiswa/
├── public/                    # Static files (HTML, JS)
│   ├── index.html            # Main UI
│   └── app.js                # Frontend logic + Google Sheets integration
├── index.js                   # Express server entry point
├── package.json              # Dependencies
├── vercel.json               # Vercel configuration
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── README.md                 # User documentation
└── DEPLOYMENT.md             # This file
```

## ✅ Status Synchronisasi

### Google Sheets URL
- **Lama**: `AKfycbzNxzoDw-okWNlR7wg4AUGZBk4kaj4aRNpRCS5C0gS6b_Tw9upH1eexnHEoe1waswJfdQ`
- **Baru**: `AKfycbx5GzBIYR_qS5tzw9b-7pj_4DzcXWKSxEwT2U9PCvdFRLI1OYE8oKMbe7A0QpIMasAEaw` ✅

### File yang Updated
- ✅ `public/app.js` - Konstanta `GOOGLE_SHEETS_URL` sudah diperbarui
- ✅ `.env.example` - Template environment sudah lengkap
- ✅ Struktur folder - Sudah dibersihkan dari duplikasi

### Testing
- ✅ Server lokal: `http://localhost:3000` (Status 200 OK)
- ✅ API Health Check: `http://localhost:3000/api/health` (Response: OK)
- ✅ Home Page: Rendered correctly (28,740 bytes)

## 🌐 Deployment ke Vercel

### Automatic Deployment
- **Branch**: `main`
- **Trigger**: Setiap push ke GitHub
- **Status**: Aktif dan berjalan di https://uas-sistem-admin-mahasiswa.vercel.app

### Manual Deployment
Jika ingin redeploy manual di Vercel:
1. Login ke https://vercel.com
2. Pilih project "uas-sistem-admin-mahasiswa"
3. Klik "Deployments"
4. Klik "Redeploy" pada latest deployment

## 🔐 Environment Variables di Vercel

Sudah dikonfigurasi di project settings:

```bash
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycbx5GzBIYR_qS5tzv9b-7pj_4DzcXWKSxEwT2U9PCvdFRLI1OYE8oKMbe7A0QpIMasAEaw/exec
NODE_ENV=production
PORT=3000
```

## 📱 Default Credentials untuk Testing

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| dosen | dosen123 | DOSEN |
| mahasiswa | mhs123 | MAHASISWA |

## 🔍 Debugging & Monitoring

### View Logs di Vercel
1. Buka https://vercel.com/projects
2. Pilih project "uas-sistem-admin-mahasiswa"
3. Klik "Deployments"
4. Klik pada deployment yang ingin di-inspect
5. Lihat "Build Logs" atau "Runtime Logs"

### Local Development
```bash
# Install dependencies
npm install

# Run locally
npm start

# Server akan berjalan di http://localhost:3000
```

## 🛠️ Troubleshooting

### 404 Not Found
**Solusi**:
1. Pastikan file sudah di folder `public/`
2. Check routing di `index.js`
3. Vercel.json routing configuration

### Google Sheets tidak sync
**Solusi**:
1. Verifikasi URL di `public/app.js` line 2
2. Check browser console untuk error details
3. Pastikan Google Apps Script endpoint berfungsi

### Build gagal di Vercel
**Solusi**:
1. Check build logs di Vercel dashboard
2. Pastikan `package.json` dependencies benar
3. Run `npm install` lokal dan test

## 📞 Quick Links

| Link | Tujuan |
|------|--------|
| [🌐 Live App](https://uas-sistem-admin-mahasiswa.vercel.app) | Aplikasi yang sudah di-deploy |
| [📚 GitHub Repo](https://github.com/syalwabilbinaa/UAS_Sistem_Admin_Mahasiswa) | Source code |
| [📊 Vercel Dashboard](https://vercel.com/projects) | Project management |
| [💾 Google Sheets](https://docs.google.com/spreadsheets) | Database |

## 📝 Last Updated
**Date**: 2026-07-17  
**Status**: ✅ Production Ready  
**Version**: 1.0.0

---

**Need Help?** Buka GitHub Issues atau contact development team.
