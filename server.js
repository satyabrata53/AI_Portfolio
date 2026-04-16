require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit payload size for security

// 1. API Routes — registered FIRST so they take priority over static files
app.use('/api', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// 2. Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// 3. Explicit page routes (fallback for direct navigation)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// 4. 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// 5. Global error handler
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err.message || err);
    res.status(500).json({ answer: 'Unable to process the request at the moment.' });
});

// Start Server
app.listen(PORT, () => {
    if (!process.env.GROQ_API_KEY) {
        console.warn('⚠️  WARNING: GROQ_API_KEY is not set. The /api/ask-ai endpoint will fail until it is configured.');
    }
    console.log(`✅ Server running → http://localhost:${PORT}`);
});
