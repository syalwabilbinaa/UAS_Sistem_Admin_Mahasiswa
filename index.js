const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public'), {
    etag: false,
    maxAge: '1d'
}));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/version', (req, res) => {
    res.json({ version: '1.0.0', name: 'SiNilai' });
});

// Static file routes - explicitly serve files
app.get('/index.html', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ error: 'index.html not found' });
    }
});

app.get('/app.js', (req, res) => {
    const appPath = path.join(__dirname, 'public', 'app.js');
    if (fs.existsSync(appPath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(appPath);
    } else {
        res.status(404).json({ error: 'app.js not found' });
    }
});

// Catch-all: Serve index.html for SPA routing
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ 
            error: 'Not found',
            path: req.url,
            method: req.method,
            publicPath: path.join(__dirname, 'public'),
            exists: fs.existsSync(path.join(__dirname, 'public'))
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Export for Vercel serverless functions
module.exports = app;

// Start server if running locally
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'vercel') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server berjalan di http://localhost:${port}`);
        console.log(`📁 Public folder: ${path.join(__dirname, 'public')}`);
        console.log(`📄 index.html exists: ${fs.existsSync(path.join(__dirname, 'public', 'index.html'))}`);
    });
}

