# 🤖 Ücretsiz AI API Key Alma Rehberi

Bu rehber, **Groq AI** kullanarak tamamen **ÜCRETSIZ** API key almanızı anlatır. Groq, aylık **14,400 ücretsiz istek** hakkı verir ve kredi kartı gerektirmez!

---

## 📋 İçindekiler

1. [Groq Nedir?](#groq-nedir)
2. [Adım Adım API Key Alma](#adım-adım-api-key-alma)
3. [API Key'i Projeye Ekleme](#api-keyi-projeye-ekleme)
4. [Test Etme](#test-etme)
5. [Alternatif Ücretsiz AI Servisleri](#alternatif-ücretsiz-ai-servisleri)
6. [Sorun Giderme](#sorun-giderme)

---

## 🚀 Groq Nedir?

**Groq**, dünyanın en hızlı AI inference platformudur. Meta'nın **Llama 3.1** modelini kullanır ve:

- ✅ **Tamamen Ücretsiz**: Kredi kartı gerekmez
- ✅ **Hızlı**: Saniyeler içinde yanıt
- ✅ **Cömert Limit**: Aylık 14,400 istek (günde ~480 istek)
- ✅ **Kolay Entegrasyon**: OpenAI uyumlu API

---

## 📝 Adım Adım API Key Alma

### 1️⃣ Groq Console'a Git

Tarayıcınızda şu adresi açın:

👉 **[https://console.groq.com](https://console.groq.com)**

![Groq Ana Sayfa](https://console.groq.com/og-image.png)

---

### 2️⃣ Hesap Oluştur

Sağ üst köşedeki **"Sign Up"** butonuna tıklayın.

**3 farklı yöntemle kayıt olabilirsiniz:**
- 🔵 **Google** ile giriş (Önerilen - En hızlı)
- 🔵 **GitHub** ile giriş
- ✉️ **Email** ile kayıt

> **Tavsiye**: Google hesabınızla giriş yapmanız en hızlı ve kolay yoldur.

![Groq Login](https://i.imgur.com/placeholder.png)

---

### 3️⃣ Email Doğrulama (Email ile kayıt yaptıysanız)

Email ile kayıt olduysan:
1. Gelen kutunuzu kontrol edin
2. Groq'tan gelen doğrulama emailini açın
3. **"Verify Email"** linkine tıklayın

> **Not**: Google/GitHub ile giriş yaptıysanız bu adım yok!

---

### 4️⃣ API Keys Sayfasına Git

Giriş yaptıktan sonra:

1. Sol menüden **"API Keys"** seçeneğine tıklayın
2. Veya direkt şu linke gidin: [https://console.groq.com/keys](https://console.groq.com/keys)

![API Keys Menu](https://i.imgur.com/placeholder2.png)

---

### 5️⃣ Yeni API Key Oluştur

1. **"Create API Key"** butonuna tıklayın
2. API Key'inize bir isim verin (örn: "Neyesek Project")
3. **"Submit"** butonuna tıklayın

![Create API Key](https://i.imgur.com/placeholder3.png)

---

### 6️⃣ API Key'i Kopyala

⚠️ **ÇOK ÖNEMLİ**: API Key yalnızca bir kez gösterilir!

1. Ekranda görünen API Key'i **kopyalayın**
2. Güvenli bir yere kaydedin (Not Defteri, şifre yöneticisi, vb.)
3. API Key şuna benzer görünür:
   ```
   gsk_abcdef123456789ABCDEF
   ```

![Copy API Key](https://i.imgur.com/placeholder4.png)

> ⚠️ **Uyarı**: Sayfayı kapattıktan sonra bir daha göremezsiniz!

---

## 💻 API Key'i Projeye Ekleme

### Yöntem 1: `.env` Dosyası (Önerilen)

1. **Proje klasörünüze gidin:**
   ```bash
   cd /Users/nadide/Desktop/neyesek
   ```

2. **`.env` dosyası oluşturun:**
   
   **Mac/Linux:**
   ```bash
   touch .env
   nano .env
   ```
   
   **Windows:**
   ```bash
   notepad .env
   ```

3. **Şu satırı ekleyin** (kendi API key'inizi yazın):
   ```env
   GROQ_API_KEY=gsk_YOUR_ACTUAL_API_KEY_HERE
   PORT=3000
   ```

4. **Kaydedin ve çıkın**:
   - `nano` kullanıyorsanız: `CTRL+X`, sonra `Y`, sonra `Enter`
   - `notepad` kullanıyorsanız: `File > Save`

5. **Sunucuyu yeniden başlatın:**
   ```bash
   npm start
   ```

### Yöntem 2: Sistem Ortam Değişkeni

**Mac/Linux (Geçici):**
```bash
export GROQ_API_KEY="gsk_YOUR_API_KEY_HERE"
npm start
```

**Windows (Geçici):**
```cmd
set GROQ_API_KEY=gsk_YOUR_API_KEY_HERE
npm start
```

---

## ✅ Test Etme

### 1. Sunucuyu Başlatın

```bash
npm start
```

Şöyle bir mesaj görmelisiniz:
```
🍽️  Neyesek sunucusu http://localhost:3000 adresinde çalışıyor!
```

### 2. Tarayıcıda Test Edin

1. **http://localhost:3000** adresini açın
2. **"AI Tarif Asistanı"** bölümüne gidin
3. Bir yemek adı yazın (örn: "Tiramisu")
4. **"Tarif Bul"** butonuna tıklayın

### 3. Sonucu Kontrol Edin

✅ **Başarılı**: AI tarafından oluşturulmuş detaylı bir tarif görürseniz API çalışıyordur!

❌ **Hata**: Eğer "API bağlantısı yapılamadı" mesajı görürseniz:
- `.env` dosyasının doğru oluşturulduğunu kontrol edin
- API key'i doğru kopyaladığınızdan emin olun
- Sunucuyu yeniden başlatın

---

## 🌐 Alternatif Ücretsiz AI Servisleri

Eğer Groq çalışmazsa veya daha fazla limit isterseniz:

### 1. **Hugging Face (Ücretsiz)**
- 🔗 [https://huggingface.co](https://huggingface.co)
- ✅ Tamamen ücretsiz
- ✅ Birçok model seçeneği
- 📊 Limit: Dakikada 30 istek

### 2. **Cohere (Ücretsiz Katman)**
- 🔗 [https://cohere.ai](https://cohere.ai)
- ✅ Aylık 100 istek ücretsiz
- ✅ Türkçe desteği iyi

### 3. **OpenAI (Ücretli - $5 başlangıç kredisi)**
- 🔗 [https://platform.openai.com](https://platform.openai.com)
- ⚠️ Kredi kartı gerekir
- ✅ En kaliteli sonuçlar

---

## 🔧 Sorun Giderme

### ❌ "API Error: 401 Unauthorized"

**Çözüm:**
- API key'inizi kontrol edin
- `.env` dosyasında `GROQ_API_KEY=` kısmından sonra boşluk olmadığından emin olun
- API key'i tırnak işaretleri olmadan yazın

### ❌ "API Error: 429 Rate Limit"

**Çözüm:**
- Günlük limitiniz dolmuş
- Yarın tekrar deneyin veya yeni bir hesap açın

### ❌ ".env dosyası okunmuyor"

**Çözüm:**
1. `.env` dosyasının proje kök dizininde olduğundan emin olun
2. `npm install dotenv` komutunu çalıştırın
3. `server.js` dosyasının başına ekleyin:
   ```javascript
   require('dotenv').config();
   ```

### ❌ "API çalışıyor ama yanıt yavaş"

**Normal:**
- İlk istek biraz yavaş olabilir (5-10 saniye)
- Sonraki istekler daha hızlıdır
- Groq genelde çok hızlıdır (1-3 saniye)

---

## 📊 Groq Limitleri

| Özellik | Ücretsiz Plan |
|---------|---------------|
| Aylık İstek | 14,400 |
| Günlük İstek | ~480 |
| Saniyede İstek | 30 RPM |
| Token Limiti | 8,000/istek |
| Fiyat | **$0** |

---

## 🎓 Ek Kaynaklar

- 📖 **Groq Dokümantasyonu**: [https://console.groq.com/docs](https://console.groq.com/docs)
- 💬 **Groq Discord**: [https://discord.gg/groq](https://discord.gg/groq)
- 🎥 **Video Tutorial**: [YouTube'da aratın: "Groq API setup"](https://youtube.com)

---

## ✨ Başarı İpuçları

1. **API Key'i Güvende Tutun**: GitHub'a yüklemeyin, `.gitignore` dosyasında `.env` olduğundan emin olun
2. **Limit Takibi**: [https://console.groq.com/settings/limits](https://console.groq.com/settings/limits) adresinden kullanımınızı takip edin
3. **Birden Fazla Hesap**: Farklı email'lerle birden fazla hesap açabilirsiniz

---

## 🎉 Tebrikler!

Artık ücretsiz AI destekli yemek tarifi platformunuz hazır! 

Sorularınız için: [GitHub Issues](https://github.com/yourusername/neyesek/issues)

**Afiyet olsun! 🍽️**

