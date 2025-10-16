const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const RECIPES_FILE = path.join(__dirname, '..', 'data', 'recipes.json');

// Tarifler verisini oku
function readRecipes() {
  const data = fs.readFileSync(RECIPES_FILE, 'utf8');
  return JSON.parse(data);
}

// Tarifler verisini yaz
function writeRecipes(data) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Tüm tarifleri getir
router.get('/', (req, res) => {
  try {
    const data = readRecipes();
    res.json(data.recipes);
  } catch (error) {
    res.status(500).json({ error: 'Tarifler yüklenirken hata oluştu' });
  }
});

// Belirli bir tarifi ID'ye göre getir
router.get('/:id', (req, res) => {
  try {
    const data = readRecipes();
    const recipe = data.recipes.find(r => r.id === parseInt(req.params.id));
    
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'Tarif bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Tarif detayları alınamadı' });
  }
});

// Belirli bir tarifi getir ve görüntülenme sayısını artır
router.post('/:id/view', (req, res) => {
  try {
    const data = readRecipes();
    const recipe = data.recipes.find(r => r.id === parseInt(req.params.id));
    
    if (recipe) {
      recipe.views++;
      writeRecipes(data);
      res.json({ success: true, views: recipe.views });
    } else {
      res.status(404).json({ error: 'Tarif bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Görüntülenme sayısı güncellenirken hata oluştu' });
  }
});

// AI ile tarif ara
router.post('/search-ai', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Lütfen bir yemek adı girin' 
      });
    }

    // Groq API isteği
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Sen Türk mutfağı uzmanı bir AI asistanısın. Sadece JSON formatında cevap ver, başka hiçbir şey yazma. JSON yapısı şöyle olmalı: {"name": "...", "category": "...", "servings": 4, "cookTime": "... dk", "totalTime": "... dk", "restTime": "... dk veya yok", "ovenTemp": "... °C veya yok", "difficulty": "Kolay/Orta/Zor", "description": "...", "ingredients": [{"item": "...", "amount": "... gr/adet/su bardağı"}], "instructions": [{"step": 1, "text": "... (süre ve ısı bilgisi ile)", "time": "... dk", "heat": "... ısı"}], "tips": ["..."], "image": "emoji"}. Instructions detaylı olmalı, her adımda süre ve ısı belirtilmeli.'
          },
          {
            role: 'user',
            content: 'Tarif: ' + query + ' | Lütfen bu yemeğin ÇOOK detaylı tarifini ver. Category değeri şunlardan biri olmalı: "Ana Yemekler", "Çorbalar", "Tatlılar", "Mezeler", "Salatalar", "Kahvaltılıklar". Ingredients tam ölçülerle (gr, adet, su bardağı gibi). Instructions her adımda pişirme süresi ve ısı belirtilmeli. Tips en az 3 püf noktası içermeli. Image için uygun bir yemek emojisi seç.'
          }
        ],
        temperature: 0.5,
        max_tokens: 2500,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    let recipeData = response.data.choices[0].message.content;
    
    // JSON temizleme
    recipeData = recipeData.trim();
    if (recipeData.startsWith('```json')) {
      recipeData = recipeData.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    }
    if (recipeData.startsWith('```')) {
      recipeData = recipeData.replace(/```\n?/g, '');
    }
    
    const jsonMatch = recipeData.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      recipeData = jsonMatch[0];
    }

    const recipe = JSON.parse(recipeData);

    // Tarifi kaydet
    const recipesData = readRecipes();
    
    // Aynı tarif var mı kontrol et
    const existingRecipe = recipesData.recipes.find(
      r => r.name.toLowerCase().trim() === recipe.name.toLowerCase().trim()
    );

    let message = '';
    
    if (!existingRecipe) {
      // Yeni tarif ekle
      const newRecipe = {
        id: recipesData.recipes.length + 1,
        ...recipe,
        views: 0,
        isAI: true
      };
      
      recipesData.recipes.push(newRecipe);
      writeRecipes(recipesData);
      message = 'Tarif başarıyla kaydedildi! 🎉';
    } else {
      message = 'Bu tarif zaten mevcut.';
    }

    res.json({
      success: true,
      recipe: recipe,
      message: message
    });

  } catch (error) {
    console.error('AI tarif arama hatası:', error.response?.data || error.message);
    
    // Fallback: Basit bir örnek tarif döndür
    res.json({
      success: true,
      recipe: {
        name: query + ' Tarifi',
        category: 'Ana Yemekler',
        servings: 4,
        cookTime: '30 dk',
        totalTime: '45 dk',
        difficulty: 'Orta',
        description: 'Bu tarif ' + query + ' için basit bir örnektir.',
        ingredients: [
          { item: 'Ana malzeme', amount: '500 gr' },
          { item: 'Tuz', amount: '1 çay kaşığı' },
          { item: 'Karabiber', amount: 'Yarım çay kaşığı' }
        ],
        instructions: [
          { step: 1, text: 'Malzemeleri hazırlayın.', time: '10 dk', heat: '-' },
          { step: 2, text: 'Pişirin.', time: '20 dk', heat: 'Orta ateş' }
        ],
        tips: ['Taze malzeme kullanın', 'Ölçülere dikkat edin'],
        image: '🍽️'
      },
      message: 'AI geçici olarak kullanılamıyor. Örnek bir tarif gösteriliyor.'
    });
  }
});

// En çok görüntülenen tarifler
router.get('/popular', (req, res) => {
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
router.get('/category/:category', (req, res) => {
  try {
    const data = readRecipes();
    const filtered = data.recipes.filter(r => r.category === req.params.category);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Tarifler yüklenirken hata oluştu' });
  }
});

module.exports = router;

