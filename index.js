const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware Utama
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging untuk melacak permintaan masuk di Vercel Logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// PENTING: Sajikan aset statis dari folder public di bagian paling atas middleware
app.use(express.static(path.join(__dirname, 'public'), {
    etag: false,
    maxAge: '1d'
}));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running perfectly',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

app.get('/api/version', (req, res) => {
    res.json({ version: '1.0.0', name: 'SiNilai' });
});

// Penanganan Rute Utama / Landing Page
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Fallback jika arsitektur Vercel memisahkan direktori aset statis
        res.sendFile(path.resolve('public/index.html'));
    }
});

// Eksplisit Router untuk index.html & app.js demi menghindari konflik 404 Vercel
app.get('/index.html', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.sendFile(path.resolve('public/index.html'));
    }
});

app.get('/app.js', (req, res) => {
    const appPath = path.join(__dirname, 'public', 'app.js');
    if (fs.existsSync(appPath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(appPath);
    } else {
        res.sendFile(path.resolve('public/app.js'));
    }
});

// Catch-all: Mengarahkan semua rute SPA ke index.html
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(indexPath);
    } else {
        const fallbackPath = path.resolve('public/index.html');
        if (fs.existsSync(fallbackPath)) {
            res.setHeader('Content-Type', 'text/html');
            res.sendFile(fallbackPath);
        } else {
            res.status(404).json({ 
                error: 'Not found',
                message: 'Silakan pastikan struktur folder public Anda sudah di-push dengan benar ke GitHub.',
                path: req.url
            });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

// Export untuk kebutuhan Vercel Serverless Engine
module.exports = app;

// Jalankan server jika dijalankan secara lokal di komputer
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server berjalan di http://localhost:${port}`);
        console.log(`📁 Public folder: ${path.join(__dirname, 'public')}`);
        console.log(`📄 index.html exists: ${fs.existsSync(path.join(__dirname, 'public', 'index.html'))}`);
    });
}