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

// Yasal Sayfalar
app.get('/gizlilik-politikasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gizlilik-politikasi.html'));
});

app.get('/kullanim-sartlari', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kullanim-sartlari.html'));
});

app.get('/cerez-politikasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cerez-politikasi.html'));
});

// Kurumsal Sayfalar
app.get('/hakkimizda', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hakkimizda.html'));
});

app.get('/iletisim', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'iletisim.html'));
});

// İçerik Sayfaları
app.get('/sss', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sss.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
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
