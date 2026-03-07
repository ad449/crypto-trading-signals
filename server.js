const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files from public directory
app.use(express.static('public'));

// Proxy API requests to the Next.js backend
app.use('/api', (req, res) => {
    const url = `http://localhost:3000${req.url}`;
    const http = require('http');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    
    const proxy = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });
    
    proxy.on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Backend API unavailable' });
    });
    
    req.pipe(proxy);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Vanilla frontend server running at http://localhost:${PORT}`);
    console.log('Make sure Next.js backend is running on port 3000');
});
