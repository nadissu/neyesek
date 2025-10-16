const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3091;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// JSON dosya yolu
const RECIPES_FILE = path.join(__dirname, 'data', 'recipes.json');

// Tarifler verisini oku
function readRecipes() {
  const data = fs.readFileSync(RECIPES_FILE, 'utf8');
  return JSON.parse(data);
}

// Tarifler verisini yaz
function writeRecipes(data) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tüm tarifleri getir
app.get('/api/recipes', (req, res) => {
  try {
    const data = readRecipes();
    res.json(data.recipes);
  } catch (error) {
    res.status(500).json({ error: 'Tarifler yüklenirken hata oluştu' });
  }
});

// Belirli bir tarifi getir ve görüntülenme sayısını artır
app.get('/api/recipes/:id', (req, res) => {
  try {
    const data = readRecipes();
    const recipe = data.recipes.find(r => r.id === parseInt(req.params.id));
    
    if (recipe) {
      // Görüntülenme sayısını artır
      recipe.views++;
      writeRecipes(data);
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'Tarif bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Tarif yüklenirken hata oluştu' });
  }
});

// AI ile yemek tarifi ara
app.post('/api/search-ai', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Arama sorgusu gerekli' });
    }

    // Groq API kullanarak tarif al (ücretsiz)
    // Alternatif: Hugging Face, Cohere gibi ücretsiz API'ler de kullanılabilir
    const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_demo_key'; // .env dosyasından alınmalı
    
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: "Sen profesyonel bir aşçı asistanısın. Kullanıcının istediği yemek tarifini Türkçe olarak çok detaylı şekilde ver.\n\n" +
              "KRİTİK KURALLAR:\n" +
              "1. Yanıtın SADECE valid JSON olmalı\n" +
              "2. JSON dışında HİÇBİR metin yazma (açıklama, yorum, markdown yok)\n" +
              "3. Başına veya sonuna BAŞKA bir şey ekleme\n" +
              "4. Markdown code block kullanma (üç tırnak kullanma)\n" +
              "5. Doğrudan JSON objesi ile başla ve bitir\n\n" +
              "JSON formatı TAM OLARAK şöyle olmalı:\n\n" +
              "{\n" +
              '  "name": "Yemek Adı",\n' +
              '  "category": "Ana Yemekler",\n' +
              '  "prepTime": "20 dakika",\n' +
              '  "cookTime": "45 dakika",\n' +
              '  "totalTime": "65 dakika",\n' +
              '  "restTime": null,\n' +
              '  "difficulty": "Orta",\n' +
              '  "servings": 4,\n' +
              '  "ovenTemp": null,\n' +
              '  "ingredients": ["250g malzeme", "2 adet soğan"],\n' +
              '  "instructions": ["Adım 1: Orta ateşte 5 dakika kavurun", "Adım 2: ..."],\n' +
              '  "tips": ["Püf noktası 1", "Püf noktası 2"],\n' +
              '  "image": "🍽️",\n' +
              '  "isAI": true\n' +
              "}\n\n" +
              "ZORUNLU ALANLAR:\n" +
              "- category: Ana Yemekler, Çorbalar, Tatlılar, Salatalar, Mezeler veya Kahvaltılıklar\n" +
              "- difficulty: Çok Kolay, Kolay, Orta veya Zor\n" +
              "- restTime ve ovenTemp: Yoksa null yaz (string değil!)\n" +
              '- ingredients: Her satırda ölçü + malzeme (örn: "500g kıyma")\n' +
              "- instructions: Her adımda süre ve ısı bilgisi ver\n" +
              "- tips: En az 2 püf noktası ekle\n" +
              "- image: Yemeğe uygun emoji\n\n" +
              "SADECE JSON DÖNDÜR!"
            },
            {
              role: 'user',
              content: `${query} tarifini detaylı ver. SADECE JSON formatında yanıt döndür, başka hiçbir metin ekleme.`
            }
          ],
          temperature: 0.5,
          max_tokens: 2500,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let aiResponse = response.data.choices[0].message.content;
      
      // JSON parse etmeye çalış, başarısız olursa düz metin olarak döndür
      let recipeData;
      try {
        // AI response'unu temizle (markdown code block varsa kaldır)
        let cleanedResponse = aiResponse.trim();
        
        // Başındaki ve sonundaki markdown code block'ları kaldır
        cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '');
        cleanedResponse = cleanedResponse.replace(/^```\s*/i, '');
        cleanedResponse = cleanedResponse.replace(/\s*```\s*$/i, '');
        cleanedResponse = cleanedResponse.trim();
        
        // Eğer başında veya sonunda ekstra metin varsa, sadece JSON kısmını al
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }
        
        // JSON parse et
        recipeData = JSON.parse(cleanedResponse);
        
        // Gerekli alanları kontrol et
        if (!recipeData.name || !recipeData.ingredients || !recipeData.instructions) {
          throw new Error('JSON eksik alanlar içeriyor');
        }
        
        console.log(`✅ AI JSON başarıyla parse edildi: ${recipeData.name}`);
      } catch (parseError) {
        // JSON değilse, düz metin olarak formatla
        console.error('JSON parse hatası:', parseError.message);
        console.log('Raw AI Response:', aiResponse.substring(0, 200) + '...');
        
        recipeData = {
          name: query,
          category: "Genel",
          prepTime: "Değişken",
          cookTime: null,
          totalTime: "Değişken",
          restTime: null,
          difficulty: "Orta",
          servings: 4,
          ovenTemp: null,
          ingredients: ["AI tarafından oluşturuldu"],
          instructions: [aiResponse],
          tips: [],
          image: "🤖",
          isAI: true
        };
      }

      // AI tarifini otomatik olarak recipes.json'a kaydet
      try {
        const data = readRecipes();
        
        // Aynı isimde tarif var mı kontrol et
        const existingRecipe = data.recipes.find(r => 
          r.name.toLowerCase() === recipeData.name.toLowerCase()
        );
        
        if (!existingRecipe) {
          // Yeni ID oluştur (en yüksek ID + 1)
          const maxId = Math.max(...data.recipes.map(r => r.id), 0);
          const newRecipe = {
            id: maxId + 1,
            ...recipeData,
            views: 0,
            isAI: true
          };
          
          // Tariflere ekle
          data.recipes.push(newRecipe);
          
          // Dosyaya kaydet
          writeRecipes(data);
          
          console.log(`✅ AI Tarifi kaydedildi: ${newRecipe.name} (ID: ${newRecipe.id})`);
          
          // ID'yi yanıta ekle
          recipeData.id = newRecipe.id;
          recipeData.saved = true;
        } else {
          console.log(`ℹ️  "${recipeData.name}" zaten mevcut, kaydetmedi.`);
          recipeData.saved = false;
          recipeData.existingId = existingRecipe.id;
        }
      } catch (saveError) {
        console.error('Tarif kaydedilemedi:', saveError.message);
        recipeData.saved = false;
        recipeData.saveError = 'Tarif kaydedilemedi';
      }

      res.json(recipeData);
    } catch (apiError) {
      // API hatası varsa, fallback olarak basit bir tarif şablonu döndür
      console.error('API Error:', apiError.message);
      
      res.json({
        name: query,
        category: "Genel",
        prepTime: "15 dakika",
        cookTime: "30 dakika",
        totalTime: "45 dakika",
        restTime: null,
        difficulty: "Orta",
        servings: 4,
        ovenTemp: null,
        ingredients: [
          "Ana malzemeler (tarife göre değişir)",
          "Baharatlar (tuz, karabiber, kimyon)",
          "Zeytinyağı veya tereyağı (2-3 yemek kaşığı)"
        ],
        instructions: [
          `${query} hazırlamak için önce tüm malzemeleri tezgaha hazırlayın.`,
          "Malzemeleri uygun şekilde temizleyin, yıkayın ve doğrayın.",
          "Tencere veya tavayı orta ateşte ısıtın (2-3 dakika).",
          "Yağı ekleyin ve ısınınca ana malzemeleri ekleyin.",
          "Baharatları ekleyip 5-10 dakika karıştırarak pişirin.",
          "Malzemeler yumuşayana ve tam kıvamına gelene kadar pişirin.",
          "Ateşten alıp sıcak olarak servis yapın."
        ],
        tips: [
          "Bu basit bir tarif şablonudur.",
          "Daha detaylı tarif için lütfen API key ekleyin."
        ],
        note: "⚠️ Not: AI API bağlantısı yapılamadı. Ücretsiz AI özelliğini kullanmak için lütfen aşağıdaki adımları takip edin:\n\n1. https://console.groq.com adresine gidin\n2. Ücretsiz hesap oluşturun (Google ile giriş yapabilirsiniz)\n3. Sol menüden 'API Keys' seçeneğine tıklayın\n4. 'Create API Key' butonuna basın\n5. Oluşan anahtarı kopyalayın\n6. Proje klasöründe .env dosyası oluşturun\n7. GROQ_API_KEY=your_key_here şeklinde ekleyin\n8. Sunucuyu yeniden başlatın (npm start)\n\nGroq API tamamen ücretsizdir ve aylık 14,400 istek hakkı verir!",
        isAI: true
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Arama sırasında hata oluştu',
      message: error.message 
    });
  }
});

// En çok görüntülenen tarifler
app.get('/api/popular', (req, res) => {
  try {
    const data = readRecipes();
    const popular = data.recipes
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
    res.json(popular);
  } catch (error) {
    res.status(500).json({ error: 'Popüler tarifler yüklenirken hata oluştu' });
  }
});

// Kategoriye göre tarifler
app.get('/api/recipes/category/:category', (req, res) => {
  try {
    const data = readRecipes();
    const filtered = data.recipes.filter(r => r.category === req.params.category);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Tarifler yüklenirken hata oluştu' });
  }
});

app.listen(PORT, () => {
  console.log(`🍽️  Neyesek sunucusu http://localhost:${PORT} adresinde çalışıyor!`);
  console.log(`📁 Tarifler: ${RECIPES_FILE}`);
});

