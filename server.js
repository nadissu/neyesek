const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3091;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes Import
const recipesRoutes = require('./routes/recipes');
const storiesRoutes = require('./routes/stories');

// Routes
// Ana sayfa (Landing Page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Neyesek App Sayfası
app.get('/neyesek', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'neyesek.html'));
});

// Yapay Masal App Sayfası
app.get('/yapaymasal', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'yapaymasal.html'));
});

// API Routes
app.use('/api/recipes', recipesRoutes);
app.use('/api/stories', storiesRoutes);

// Server başlat
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Server çalışıyor!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Ana Sayfa:       http://localhost:${PORT}/`);
  console.log(`🍽️  Neyesek:         http://localhost:${PORT}/neyesek`);
  console.log(`📖 Yapay Masal:     http://localhost:${PORT}/yapaymasal`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📁 Veri Dosyaları:`);
  console.log(`   - Tarifler: data/recipes.json`);
  console.log(`   - Masallar: data/stories.json`);
  console.log(`${'='.repeat(60)}\n`);
});
