# 🍽️ Neyesek - AI Destekli Yemek Tarifleri

Modern, kullanıcı dostu ve yapay zeka destekli yemek tarifi platformu. Kullanıcılar 20+ özel tarifimize göz atabilir veya AI asistanımız ile istedikleri herhangi bir yemeğin tarifini anında bulabilirler.

## ✨ Özellikler

- 🎨 **Modern ve Çekici Tasarım** - Responsive, gradient tabanlı modern UI/UX
- 🤖 **AI Tarif Asistanı** - Groq API ile ücretsiz yapay zeka entegrasyonu
- 💾 **Otomatik Tarif Kaydetme** - AI'dan alınan tarifler otomatik olarak koleksiyona eklenir
- 📖 **20+ Özel Tarif** - Türk mutfağından özenle seçilmiş tarifler
- 📝 **Çok Detaylı Tarifler** - Her tarif şunları içerir:
  - ⏱️ Hazırlık, pişirme ve dinlenme süreleri
  - 🌡️ Fırın derecesi ve ısı ayarları
  - 📏 Kesin malzeme ölçüleri
  - 👨‍🍳 Adım adım detaylı yapılış (her adımda süre ve ısı)
  - 💡 Püf noktaları ve ipuçları
- 🔥 **Popüler Tarifler** - En çok görüntülenen tarifleri takip edin
- 🏷️ **Kategori Filtreleme** - Ana yemekler, çorbalar, tatlılar ve daha fazlası
- 📊 **Görüntülenme İstatistikleri** - JSON dosyasında tutulan kullanım verileri
- 💰 **Google AdSense Hazır** - Reklam alanları önceden tasarlandı
- 🚀 **Hızlı ve Hafif** - Veritabanı yok, saf Node.js ve JSON tabanlı
- 🌐 **Türkçe AI Desteği** - AI tariflerinde tam Türkçe dil desteği

## 🛠️ Teknolojiler

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI Integration**: Groq API (ücretsiz katman)
- **Data Storage**: JSON dosyaları
- **Styling**: Modern CSS, Gradients, Animations
- **Fonts**: Google Fonts (Poppins, Playfair Display)

## 📦 Kurulum

### 1. Projeyi İndirin

```bash
cd /Users/nadide/Desktop/neyesek
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın (ÖNEMLİ - AI Özelliği İçin)

AI özelliğini kullanmak için `.env` dosyası oluşturun:

```bash
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

**🤖 Ücretsiz AI API Key Alma (Detaylı Rehber):**

👉 **[AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md) dosyasını okuyun** - Adım adım ekran görüntüleri ile anlatım!

**Hızlı Özet:**
1. [https://console.groq.com](https://console.groq.com) adresine git
2. Google/GitHub ile giriş yap (ücretsiz, kredi kartı yok)
3. Sol menüden "API Keys" seç
4. "Create API Key" butonuna tıkla
5. API key'i kopyala
6. Proje klasöründe `.env` dosyası oluştur
7. `GROQ_API_KEY=kopyaladığın_key` şeklinde kaydet
8. Sunucuyu yeniden başlat

**Groq Özellikleri:**
- ✅ **Tamamen Ücretsiz** (kredi kartı gerekmez)
- ✅ **Aylık 14,400 istek** (~günde 480)
- ✅ **Çok hızlı** (1-3 saniye yanıt)
- ✅ **Türkçe desteği mükemmel**

> **Not:** Groq API key'i olmadan da çalışır, ancak AI özelliği basit bir fallback mesajı gösterir. Detaylı tarifler için mutlaka API key ekleyin!

### 4. Sunucuyu Başlatın

```bash
npm start
```

veya development modunda (nodemon ile):

```bash
npm run dev
```

Tarayıcınızda **http://localhost:3000** adresine gidin.

## 📁 Proje Yapısı

```
neyesek/
├── server.js              # Express sunucusu
├── package.json           # Bağımlılıklar
├── data/
│   └── recipes.json      # Yemek tarifleri ve istatistikler
├── public/
│   ├── index.html        # Ana sayfa
│   ├── css/
│   │   └── style.css     # Tüm stiller
│   └── js/
│       └── main.js       # Frontend JavaScript
└── README.md             # Bu dosya
```

## 🎯 Kullanım

### Tarifleri Görüntüleme

1. Ana sayfada tüm tarifleri görüntüleyin
2. Kategorilere göre filtreleyin (Ana Yemekler, Çorbalar, Tatlılar, vb.)
3. Popüler tarifleri keşfedin
4. Tarif kartına tıklayarak **çok detaylı** bilgi alın:
   - Hazırlık süresi, pişirme süresi, dinlenme süresi
   - Fırın derecesi (varsa)
   - Malzemeler (kesin ölçülerle)
   - Adım adım yapılış (süre ve ısı bilgileriyle)
   - Püf noktaları ve ipuçları

### AI ile Tarif Arama

1. "AI Tarif Asistanı" bölümüne gidin
2. Aradığınız yemeğin adını yazın (örn: "Tiramisu", "Künefe", "Sushi")
3. "Tarif Bul" butonuna tıklayın
4. AI tarafından oluşturulan **çok detaylı** tarifi görüntüleyin:
   - Tüm zamanlamalar (hazırlık, pişirme, dinlenme)
   - Fırın derecesi ve ısı ayarları
   - Ölçülü malzemeler
   - Her adımda ne kadar süre ve ısı
   - Püf noktaları
5. **🎉 YENİ**: AI tarifleri otomatik olarak `recipes.json` dosyanıza kaydedilir!
   - ✅ Yeni tarif → Koleksiyonunuza eklenir
   - ℹ️ Mevcut tarif → "Zaten mevcut" mesajı gösterilir
   - 🔍 Kaydedilen tarifleri ana sayfada görebilirsiniz

> **İpucu**: AI, JSON tariflerimizle aynı formatta detaylı tarifler üretir ve otomatik kaydeder!

## 🔌 API Endpoints

### GET `/api/recipes`
Tüm tarifleri getirir.

### GET `/api/recipes/:id`
Belirli bir tarifi getirir ve görüntülenme sayısını artırır.

### GET `/api/popular`
En çok görüntülenen 6 tarifi getirir.

### GET `/api/recipes/category/:category`
Kategoriye göre tarifleri filtreler.

### POST `/api/search-ai`
AI ile yemek tarifi arar ve **otomatik olarak `recipes.json`'a kaydeder**.

**Request Body:**
```json
{
  "query": "Tiramisu"
}
```

**Response:**
```json
{
  "id": 21,
  "name": "Tiramisu",
  "category": "Tatlılar",
  "prepTime": "30 dakika",
  "cookTime": "0 dakika",
  "totalTime": "30 dakika",
  "restTime": "4 saat",
  "difficulty": "Orta",
  "servings": 6,
  "ovenTemp": null,
  "ingredients": ["..."],
  "instructions": ["..."],
  "tips": ["..."],
  "image": "🍰",
  "isAI": true,
  "saved": true,
  "views": 0
}
```

**Özellikler:**
- ✅ Yeni tarif → `saved: true` ve yeni ID ile kaydedilir
- ℹ️ Mevcut tarif → `saved: false` ve `existingId` döner
- ⚠️ Hata → `saved: false` ve `saveError` mesajı döner

## 💰 Google AdSense Entegrasyonu

Projede AdSense için hazır alanlar bulunmaktadır:

1. **Horizontal Banners (728x90)**: İçerik bölümleri arasında
2. **Vertical Sidebars (160x600)**: Sayfanın sol ve sağ kenarlarında (desktop)

AdSense kodlarınızı eklemek için `index.html` dosyasındaki şu yerleri düzenleyin:

```html
<!-- Google AdSense kodu buraya gelecek -->
<div class="ad-demo">
  728 x 90 Banner Reklamı
</div>
```

Bu kısımları AdSense kod snippet'lerinizle değiştirin.

## 🎨 Tasarım Özellikleri

- ✅ Fully Responsive (Mobil, Tablet, Desktop)
- ✅ Modern Gradient Backgrounds
- ✅ Smooth Animations
- ✅ Card-based Layout
- ✅ Modal Popups
- ✅ Custom Color Palette
- ✅ Professional Typography
- ✅ Hover Effects
- ✅ Loading States

## 🔧 Özelleştirme

### Renk Şemasını Değiştirme

`public/css/style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #FF6B6B;
    --secondary-color: #4ECDC4;
    --accent-color: #FFE66D;
    /* ... */
}
```

### Yeni Tarif Ekleme

`data/recipes.json` dosyasına yeni tarif ekleyin. **Detaylı format:**

```json
{
  "id": 21,
  "name": "Yeni Tarif",
  "category": "Ana Yemekler",
  "prepTime": "20 dakika",
  "cookTime": "45 dakika",
  "totalTime": "65 dakika",
  "restTime": "30 dakika",
  "difficulty": "Orta",
  "servings": 4,
  "views": 0,
  "ovenTemp": "180°C",
  "ingredients": [
    "500g kıyma",
    "2 adet soğan (ince doğranmış)",
    "1 tatlı kaşığı tuz"
  ],
  "instructions": [
    "Tavayı orta ateşte ısıtın (2-3 dakika).",
    "Kıymayı ekleyin, 8-10 dakika kavurun.",
    "Fırında 180°C'de 30 dakika pişirin."
  ],
  "tips": [
    "Kıyma taze olmalı.",
    "Soğanları çok ince doğrayın."
  ],
  "image": "🍕"
}
```

**Önemli Alanlar:**
- `prepTime`: Hazırlık süresi
- `cookTime`: Pişirme süresi
- `totalTime`: Toplam süre
- `restTime`: Dinlenme süresi (null olabilir)
- `ovenTemp`: Fırın derecesi (null olabilir)
- `tips`: Püf noktaları dizisi (opsiyonel)

## 🚀 Production Deployment

### Heroku

```bash
# Heroku CLI yükleyin
npm install -g heroku

# Giriş yapın
heroku login

# App oluşturun
heroku create neyesek

# Deploy edin
git push heroku main
```

### Vercel / Netlify

`vercel.json` veya `netlify.toml` yapılandırma dosyaları ekleyin ve deploy edin.

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📧 İletişim

Sorularınız için: [GitHub Issues](https://github.com/yourusername/neyesek/issues)

## 🌟 Özellik İstekleri

- [ ] Kullanıcı hesapları
- [ ] Favori tarifler
- [ ] Tarif paylaşma
- [ ] Yorum sistemi
- [ ] Yemek fotoğrafları
- [ ] Video tarifler
- [ ] Mobil uygulama

---

**Afiyet olsun! 🍽️**

