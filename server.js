const express = require('express');
const apiApp = require('./api/index.js');
const path = require('path');

const app = express();
const PORT = 8181;

// Serve static files from the current directory FIRST
app.use(express.static(__dirname));

// Default route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin panel route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Mount the API app (this contains the DB connection middleware)
app.use('/', apiApp);

app.listen(PORT, () => {
    console.log(`Local Development Server running at http://localhost:${PORT}`);
});
