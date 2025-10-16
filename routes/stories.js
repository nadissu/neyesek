const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const STORIES_FILE = path.join(__dirname, '..', 'data', 'stories.json');

// Masallar verisini oku
function readStories() {
  const data = fs.readFileSync(STORIES_FILE, 'utf8');
  return JSON.parse(data);
}

// Masallar verisini yaz
function writeStories(data) {
  fs.writeFileSync(STORIES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Tüm masalları getir
router.get('/', (req, res) => {
  try {
    const data = readStories();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Masallar yüklenirken hata oluştu' });
  }
});

// Belirli bir masalı ID'ye göre getir
router.get('/:id', (req, res) => {
  try {
    const data = readStories();
    const story = data.stories.find(s => s.id === parseInt(req.params.id));
    
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ error: 'Masal bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Masal detayları alınamadı' });
  }
});

// Belirli bir masalın görüntülenme sayısını artır
router.post('/:id/view', (req, res) => {
  try {
    const data = readStories();
    const story = data.stories.find(s => s.id === parseInt(req.params.id));
    
    if (story) {
      story.views++;
      writeStories(data);
      res.json({ success: true, views: story.views });
    } else {
      res.status(404).json({ error: 'Masal bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Görüntülenme sayısı güncellenirken hata oluştu' });
  }
});

// AI ile masal ara ve oluştur
router.post('/search-ai', async (req, res) => {
  try {
    const { query, ageGroup } = req.body;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Lütfen bir konu girin' 
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
            content: 'Sen çocuklar için eğitici ve eğlenceli masallar yazan bir AI asistanısın. Sadece JSON formatında cevap ver, başka hiçbir şey yazma. JSON yapısı şöyle olmalı: {"title": "...", "category": "...", "ageGroup": "...", "icon": "...", "summary": "...", "characters": ["..."], "content": ["..."], "moral": "..."}. Content alanı en az 8 paragraf olmalı. Characters dizisinde 3-5 karakter olmalı. Masal çocuklar için uygun, eğitici ve eğlenceli olmalı.'
          },
          {
            role: 'user',
            content: 'Konu: ' + query + ' | Yaş grubu: ' + ageGroup + ' | Lütfen bu konu ve yaş grubuna uygun detaylı bir masal oluştur. Category değeri şunlardan biri olmalı: "Klasik Masallar", "Türk Masalları", "Fabl Masallar", "Doğu Masalları" veya "Modern Masallar". Icon için uygun bir emoji seç. Summary kısa olsun (2-3 cümle). Content en az 8 paragraf olmalı ve akıcı bir hikaye anlatmalı.'
          }
        ],
        temperature: 0.7,
        max_tokens: 3500,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    let storyData = response.data.choices[0].message.content;
    
    // JSON temizleme
    storyData = storyData.trim();
    if (storyData.startsWith('```json')) {
      storyData = storyData.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    }
    if (storyData.startsWith('```')) {
      storyData = storyData.replace(/```\n?/g, '');
    }
    
    const jsonMatch = storyData.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      storyData = jsonMatch[0];
    }

    const story = JSON.parse(storyData);

    // Masalı kaydet
    const storiesData = readStories();
    
    // Aynı masal var mı kontrol et
    const existingStory = storiesData.stories.find(
      s => s.title.toLowerCase().trim() === story.title.toLowerCase().trim()
    );

    let message = '';
    
    if (!existingStory) {
      // Yeni masal ekle
      const newStory = {
        id: storiesData.stories.length + 1,
        ...story,
        views: 0,
        isAI: true
      };
      
      storiesData.stories.push(newStory);
      writeStories(storiesData);
      message = 'Masal başarıyla kaydedildi! ✨';
    } else {
      message = 'Bu masal zaten mevcut.';
    }

    res.json({
      success: true,
      story: story,
      message: message
    });

  } catch (error) {
    console.error('AI masal oluşturma hatası:', error.response?.data || error.message);
    
    // Fallback: Basit bir örnek masal döndür
    res.json({
      success: true,
      story: {
        title: query + ' Masalı',
        category: 'Modern Masallar',
        ageGroup: ageGroup,
        icon: '📖',
        summary: 'Bu masal ' + query + ' hakkında güzel bir hikaye anlatır.',
        characters: ['Ana Karakter', 'Yardımcı Karakter', 'Bilge İhtiyar'],
        content: [
          'Bir zamanlar, uzak diyarlarda güzel bir ülke varmış.',
          'Bu ülkede yaşayan insanlar çok mutlu ve huzurluymuş.',
          'Bir gün, genç bir kahramanımız ortaya çıkmış.',
          'Karşısına çıkan zorlukları cesaretle aşmış.',
          'Yolculuğu boyunca pek çok şey öğrenmiş.',
          'Dostlarıyla birlikte engelleri aşmış.',
          'Sonunda amacına ulaşmayı başarmış.',
          'Ve sonsuza kadar mutlu yaşamışlar.'
        ],
        moral: 'Bu hikaye bize cesaretin, dostluğun ve azmin önemini öğretir.'
      },
      message: 'AI geçici olarak kullanılamıyor. Örnek bir masal gösteriliyor.'
    });
  }
});

// En çok okunan masallar
router.get('/popular', (req, res) => {
  try {
    const data = readStories();
    const popular = data.stories
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
    res.json(popular);
  } catch (error) {
    res.status(500).json({ error: 'Popüler masallar yüklenirken hata oluştu' });
  }
});

// Kategoriye göre masallar
router.get('/category/:category', (req, res) => {
  try {
    const data = readStories();
    const filtered = data.stories.filter(s => s.category === req.params.category);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Masallar yüklenirken hata oluştu' });
  }
});

module.exports = router;

