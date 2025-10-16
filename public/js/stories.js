let allStories = [];
let currentStory = null;

// Sayfa yüklendiğinde masalları al
document.addEventListener('DOMContentLoaded', () => {
    loadStories();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // AI Masal butonu
    const aiBtn = document.getElementById('ai-masal-btn');
    const aiInput = document.getElementById('ai-masal-input');
    
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            const query = aiInput.value.trim();
            const ageGroup = document.getElementById('age-group').value;
            if (query) {
                searchStory(query, ageGroup);
            }
        });
    }

    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = aiInput.value.trim();
                const ageGroup = document.getElementById('age-group').value;
                if (query) {
                    searchStory(query, ageGroup);
                }
            }
        });
    }

    // Kategori filtreleme
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterStories(category);
        });
    });
}

// Masalları yükle
async function loadStories() {
    try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        allStories = data.stories;
        
        displayAllStories();
        displayPopularStories();
    } catch (error) {
        console.error('Masalları yüklerken hata:', error);
    }
}

// Tüm masalları göster
function displayAllStories() {
    const container = document.getElementById('all-stories');
    if (!container) return;

    container.innerHTML = allStories.map(story => createStoryCard(story)).join('');
}

// Popüler masalları göster (en çok görüntülenen 6)
function displayPopularStories() {
    const container = document.getElementById('popular-stories');
    if (!container) return;

    const popular = [...allStories]
        .sort((a, b) => b.views - a.views)
        .slice(0, 6);

    container.innerHTML = popular.map(story => createStoryCard(story)).join('');
}

// Masal kartı oluştur
function createStoryCard(story) {
    const badge = story.isAI ? '<span class="recipe-badge ai-badge">✨ AI</span>' : '';
    
    return `
        <div class="recipe-card" onclick="openStoryModal(${story.id})">
            <div class="recipe-card__header">
                ${badge}
                <div class="recipe-card__icon">${story.icon || '📖'}</div>
            </div>
            <div class="recipe-card__content">
                <div class="recipe-card__body">
                    <span class="recipe-card__category">${story.category}</span>
                    <h3 class="recipe-card__title">${story.title}</h3>
                    <p class="recipe-card__description">${story.summary}</p>
                </div>
                <div class="recipe-card__meta">
                    <div class="meta-item">
                        <span class="meta-icon">👁️</span>
                        <span class="meta-text">${story.views} okuma</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">👶</span>
                        <span class="meta-text">${story.ageGroup}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">📚</span>
                        <span class="meta-text">${story.category}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Masalları kategoriye göre filtrele
function filterStories(category) {
    const container = document.getElementById('all-stories');
    if (!container) return;

    let filtered = allStories;
    if (category !== 'all') {
        filtered = allStories.filter(story => story.category === category);
    }

    container.innerHTML = filtered.map(story => createStoryCard(story)).join('');
}

// Masal modal'ını aç
async function openStoryModal(storyId) {
    const story = allStories.find(s => s.id === storyId);
    if (!story) return;

    currentStory = story;
    const modal = document.getElementById('story-modal');
    const modalBody = document.getElementById('story-modal-body');

    modalBody.innerHTML = `
        <div class="recipe-detail">
            <div class="recipe-detail__header">
                <div class="recipe-detail__icon">${story.icon || '📖'}</div>
                <div class="recipe-detail__title-group">
                    <h2 class="recipe-detail__title">${story.title}</h2>
                    <div class="recipe-detail__meta">
                        <span class="meta-badge">📚 ${story.category}</span>
                        <span class="meta-badge">👶 ${story.ageGroup}</span>
                        <span class="meta-badge">👁️ ${story.views} okuma</span>
                    </div>
                </div>
            </div>

            <div class="recipe-detail__section">
                <h3 class="recipe-detail__section-title">📝 Özet</h3>
                <p class="recipe-detail__summary">${story.summary}</p>
            </div>

            <div class="recipe-detail__section">
                <h3 class="recipe-detail__section-title">🎭 Karakterler</h3>
                <div class="characters-list">
                    ${story.characters.map(char => `
                        <span class="character-tag">${char}</span>
                    `).join('')}
                </div>
            </div>

            <div class="recipe-detail__section">
                <h3 class="recipe-detail__section-title">📖 Hikaye</h3>
                <div class="story-content">
                    ${story.content.map((paragraph, idx) => `
                        <p class="story-paragraph">${paragraph}</p>
                    `).join('')}
                </div>
            </div>

            <div class="recipe-detail__section">
                <h3 class="recipe-detail__section-title">💡 Hikayenin Mesajı</h3>
                <p class="story-moral">${story.moral}</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Görüntüleme sayısını artır
    try {
        await fetch(`/api/stories/${storyId}/view`, { method: 'POST' });
        story.views++;
        displayAllStories();
        displayPopularStories();
    } catch (error) {
        console.error('Görüntüleme sayısı artırılamadı:', error);
    }
}

// Modal'ı kapat
function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentStory = null;
}

// AI ile masal ara
async function searchStory(query, ageGroup = null) {
    const aiBtn = document.getElementById('ai-masal-btn');
    const resultContainer = document.getElementById('ai-masal-result');
    
    if (!ageGroup) {
        ageGroup = document.getElementById('age-group')?.value || '6-8';
    }

    // Butonu devre dışı bırak ve loading göster
    aiBtn.disabled = true;
    aiBtn.innerHTML = '<span class="btn-text">Masal Oluşturuluyor...</span><span class="btn-icon">⏳</span>';
    
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <div class="ai-loading">
            <div class="loading-spinner"></div>
            <p>Yapay zeka sizin için özel bir masal yazıyor...</p>
            <p class="loading-subtitle">Bu birkaç saniye sürebilir ✨</p>
        </div>
    `;

    try {
        const response = await fetch('/api/stories/search-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, ageGroup })
        });

        const data = await response.json();

        if (data.success) {
            displayAIStoryResult(data.story, data.message);
            // Masalları yeniden yükle (yeni masal eklendiyse)
            await loadStories();
        } else {
            resultContainer.innerHTML = `
                <div class="ai-error">
                    <div class="error-icon">😢</div>
                    <h3>Üzgünüz!</h3>
                    <p>${data.message}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('AI arama hatası:', error);
        resultContainer.innerHTML = `
            <div class="ai-error">
                <div class="error-icon">⚠️</div>
                <h3>Bir Hata Oluştu</h3>
                <p>Masal oluşturulurken bir sorun yaşandı. Lütfen tekrar deneyin.</p>
            </div>
        `;
    } finally {
        // Butonu tekrar aktif et
        aiBtn.disabled = false;
        aiBtn.innerHTML = '<span class="btn-text">Masal Oluştur</span><span class="btn-icon">✨</span>';
    }
}

// AI masal sonucunu göster
function displayAIStoryResult(story, message) {
    const resultContainer = document.getElementById('ai-masal-result');
    
    let statusMessage = '';
    if (message) {
        if (message.includes('kaydedildi')) {
            statusMessage = `<div class="save-status success">✅ ${message}</div>`;
        } else if (message.includes('zaten mevcut')) {
            const storyId = allStories.find(s => 
                s.title.toLowerCase() === story.title.toLowerCase()
            )?.id;
            statusMessage = `
                <div class="save-status info">
                    ℹ️ ${message}
                    ${storyId ? `<a href="#" onclick="openStoryModal(${storyId}); return false;">Masalı görüntüle</a>` : ''}
                </div>
            `;
        } else {
            statusMessage = `<div class="save-status info">ℹ️ ${message}</div>`;
        }
    }

    resultContainer.innerHTML = `
        ${statusMessage}
        <div class="ai-result-card">
            <div class="ai-result-header">
                <div class="ai-badge-large">✨ AI Tarafından Oluşturuldu</div>
            </div>

            <div class="recipe-detail">
                <div class="recipe-detail__header">
                    <div class="recipe-detail__icon">${story.icon || '📖'}</div>
                    <div class="recipe-detail__title-group">
                        <h2 class="recipe-detail__title">${story.title}</h2>
                        <div class="recipe-detail__meta">
                            <span class="meta-badge">📚 ${story.category}</span>
                            <span class="meta-badge">👶 ${story.ageGroup}</span>
                        </div>
                    </div>
                </div>

                <div class="recipe-detail__section">
                    <h3 class="recipe-detail__section-title">📝 Özet</h3>
                    <p class="recipe-detail__summary">${story.summary}</p>
                </div>

                <div class="recipe-detail__section">
                    <h3 class="recipe-detail__section-title">🎭 Karakterler</h3>
                    <div class="characters-list">
                        ${story.characters.map(char => `
                            <span class="character-tag">${char}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="recipe-detail__section">
                    <h3 class="recipe-detail__section-title">📖 Hikaye</h3>
                    <div class="story-content">
                        ${story.content.map((paragraph, idx) => `
                            <p class="story-paragraph">${paragraph}</p>
                        `).join('')}
                    </div>
                </div>

                <div class="recipe-detail__section">
                    <h3 class="recipe-detail__section-title">💡 Hikayenin Mesajı</h3>
                    <p class="story-moral">${story.moral}</p>
                </div>
            </div>
        </div>
    `;

    // Sonuca scroll yap
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Bölüme scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC tuşu ile modal'ı kapat
    if (e.key === 'Escape') {
        const modal = document.getElementById('story-modal');
        if (!modal.classList.contains('hidden')) {
            closeStoryModal();
        }
    }
});

// CSS eklentileri için
const style = document.createElement('style');
style.textContent = `
    .characters-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 12px;
    }

    .character-tag {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .story-content {
        margin-top: 16px;
        line-height: 1.8;
    }

    .story-paragraph {
        margin-bottom: 16px;
        font-size: 1.05rem;
        color: var(--text-color);
        text-align: justify;
    }

    .story-moral {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 20px;
        border-radius: 12px;
        font-size: 1.05rem;
        font-style: italic;
        color: #333;
        margin-top: 12px;
    }

    .ai-badge-large {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.95rem;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 24px;
    }
`;
document.head.appendChild(style);

