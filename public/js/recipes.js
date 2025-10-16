// ==================== GLOBAL STATE ====================
let allRecipes = [];
let currentCategory = 'all';

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    await loadRecipes();
    await loadPopularRecipes();
    setupEventListeners();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // AI search button
    const searchBtn = document.getElementById('ai-search-btn');
    const searchInput = document.getElementById('ai-search-input');
    
    searchBtn.addEventListener('click', handleAISearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAISearch();
        }
    });

    // Category filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterRecipes(currentCategory);
        });
    });
}

// ==================== API CALLS ====================
async function loadRecipes() {
    try {
        const response = await fetch('/api/recipes');
        allRecipes = await response.json();
        displayRecipes(allRecipes);
    } catch (error) {
        console.error('Tarifler yüklenemedi:', error);
        showError('Tarifler yüklenirken bir hata oluştu.');
    }
}

async function loadPopularRecipes() {
    try {
        const response = await fetch('/api/popular');
        const popular = await response.json();
        displayPopularRecipes(popular);
    } catch (error) {
        console.error('Popüler tarifler yüklenemedi:', error);
    }
}

async function getRecipeDetails(id) {
    try {
        const response = await fetch(`/api/recipes/${id}`);
        const recipe = await response.json();
        return recipe;
    } catch (error) {
        console.error('Tarif detayları alınamadı:', error);
        return null;
    }
}

async function searchAIRecipe(query) {
    try {
        const response = await fetch('/api/recipes/search-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error('AI arama başarısız');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('AI arama hatası:', error);
        throw error;
    }
}

// ==================== DISPLAY FUNCTIONS ====================
function displayRecipes(recipes) {
    const container = document.getElementById('all-recipes');
    container.innerHTML = '';

    if (recipes.length === 0) {
        container.innerHTML = '<p class="text-center">Bu kategoride tarif bulunamadı.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        container.appendChild(card);
    });
}

function displayPopularRecipes(recipes) {
    const container = document.getElementById('popular-recipes');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        container.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => showRecipeModal(recipe.id);

    const difficultyClass = getDifficultyClass(recipe.difficulty);

    card.innerHTML = `
        <div class="recipe-card__icon">${recipe.image || '🍽️'}</div>
        <div class="recipe-card__content">
            <span class="recipe-card__category">${recipe.category}</span>
            <h3 class="recipe-card__title">${recipe.name}</h3>
            <div class="recipe-card__meta">
                <div class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    <span>${recipe.prepTime}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">👥</span>
                    <span>${recipe.servings} kişilik</span>
                </div>
            </div>
            <div class="recipe-card__difficulty ${difficultyClass}">
                ${recipe.difficulty}
            </div>
        </div>
    `;

    return card;
}

function getDifficultyClass(difficulty) {
    const map = {
        'Kolay': 'difficulty-easy',
        'Çok Kolay': 'difficulty-easy',
        'Orta': 'difficulty-medium',
        'Zor': 'difficulty-hard'
    };
    return map[difficulty] || 'difficulty-medium';
}

// ==================== MODAL ====================
async function showRecipeModal(recipeId) {
    const recipe = await getRecipeDetails(recipeId);
    if (!recipe) return;

    const modal = document.getElementById('recipe-modal');
    const modalBody = document.getElementById('modal-body');

    // Modal meta bilgileri oluştur
    const modalMetaItems = [
        `<div class="meta-item"><span class="meta-icon">📂</span><span>${recipe.category}</span></div>`,
        recipe.prepTime ? `<div class="meta-item"><span class="meta-icon">🔪</span><span>Hazırlık: ${recipe.prepTime}</span></div>` : '',
        recipe.cookTime ? `<div class="meta-item"><span class="meta-icon">🔥</span><span>Pişirme: ${recipe.cookTime}</span></div>` : '',
        recipe.totalTime ? `<div class="meta-item"><span class="meta-icon">⏱️</span><span>Toplam: ${recipe.totalTime}</span></div>` : '',
        recipe.restTime ? `<div class="meta-item"><span class="meta-icon">💤</span><span>Dinlenme: ${recipe.restTime}</span></div>` : '',
        `<div class="meta-item"><span class="meta-icon">👥</span><span>${recipe.servings} kişilik</span></div>`,
        `<div class="meta-item"><span class="meta-icon">📊</span><span>${recipe.difficulty}</span></div>`,
        recipe.ovenTemp ? `<div class="meta-item"><span class="meta-icon">🌡️</span><span>Fırın: ${recipe.ovenTemp}</span></div>` : '',
        `<div class="meta-item"><span class="meta-icon">👁️</span><span>${recipe.views} görüntülenme</span></div>`
    ].filter(item => item !== '').join('');

    modalBody.innerHTML = `
        <div class="modal__icon">${recipe.image || '🍽️'}</div>
        <h2 class="modal__title">${recipe.name}</h2>
        
        <div class="modal__meta">
            ${modalMetaItems}
        </div>

        <div class="modal__section">
            <h3>🛒 Malzemeler</h3>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>

        <div class="modal__section">
            <h3>👨‍🍳 Yapılışı</h3>
            <ol>
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>

        ${recipe.tips && recipe.tips.length > 0 ? `
            <div class="modal__section">
                <h3>💡 Püf Noktaları</h3>
                <ul>
                    ${recipe.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${recipe.note ? `
            <div class="modal__section">
                <h3>ℹ️ Not</h3>
                <p style="line-height: 1.8;">${recipe.note}</p>
            </div>
        ` : ''}
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ==================== AI SEARCH ====================
async function handleAISearch() {
    const input = document.getElementById('ai-search-input');
    const query = input.value.trim();

    if (!query) {
        alert('Lütfen aramak istediğiniz yemeğin adını girin.');
        return;
    }

    const searchBtn = document.getElementById('ai-search-btn');
    const resultDiv = document.getElementById('ai-result');

    // Show loading
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<span class="spinner"></span> <span>Arıyor...</span>';

    try {
        const result = await searchAIRecipe(query);
        displayAIResult(result);
        
        // Eğer tarif kaydedildiyse, tarifleri yenile
        if (result.saved === true) {
            await loadRecipes();
            console.log('✅ Tarifler yenilendi, yeni AI tarifi listeye eklendi!');
        }
        
        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        showError('AI araması sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<span class="btn-text">Tarif Bul</span><span class="btn-icon">🔍</span>';
    }
}

function displayAIResult(recipe) {
    const resultDiv = document.getElementById('ai-result');
    
    // Meta bilgileri oluştur
    const metaItems = [
        recipe.category ? `<div class="meta-item"><span class="meta-icon">📂</span><span>${recipe.category}</span></div>` : '',
        recipe.prepTime ? `<div class="meta-item"><span class="meta-icon">🔪</span><span>Hazırlık: ${recipe.prepTime}</span></div>` : '',
        recipe.cookTime ? `<div class="meta-item"><span class="meta-icon">🔥</span><span>Pişirme: ${recipe.cookTime}</span></div>` : '',
        recipe.totalTime ? `<div class="meta-item"><span class="meta-icon">⏱️</span><span>Toplam: ${recipe.totalTime}</span></div>` : '',
        recipe.restTime ? `<div class="meta-item"><span class="meta-icon">💤</span><span>Dinlenme: ${recipe.restTime}</span></div>` : '',
        `<div class="meta-item"><span class="meta-icon">👥</span><span>${recipe.servings} kişilik</span></div>`,
        `<div class="meta-item"><span class="meta-icon">📊</span><span>${recipe.difficulty}</span></div>`,
        recipe.ovenTemp ? `<div class="meta-item"><span class="meta-icon">🌡️</span><span>Fırın: ${recipe.ovenTemp}</span></div>` : ''
    ].filter(item => item !== '').join('');
    
    // Kayıt durumu mesajı
    let saveStatusHTML = '';
    if (recipe.saved === true) {
        saveStatusHTML = `
            <div class="save-status success">
                <span class="status-icon">✅</span>
                <span class="status-text">Tarif koleksiyonunuza kaydedildi! (ID: ${recipe.id})</span>
            </div>
        `;
    } else if (recipe.saved === false && recipe.existingId) {
        saveStatusHTML = `
            <div class="save-status info">
                <span class="status-icon">ℹ️</span>
                <span class="status-text">Bu tarif zaten koleksiyonunuzda mevcut. 
                <a href="#" onclick="showRecipeModal(${recipe.existingId}); return false;" class="recipe-link">Görüntüle</a>
                </span>
            </div>
        `;
    } else if (recipe.saved === false && recipe.saveError) {
        saveStatusHTML = `
            <div class="save-status error">
                <span class="status-icon">⚠️</span>
                <span class="status-text">${recipe.saveError}</span>
            </div>
        `;
    }
    
    resultDiv.innerHTML = `
        ${saveStatusHTML}
        
        <div class="ai-result__header">
            <div class="ai-result__icon">${recipe.image || '🤖'}</div>
            <div>
                <h3 class="ai-result__title">${recipe.name}</h3>
                ${recipe.isAI ? '<span class="ai-result__badge">AI ile Oluşturuldu</span>' : ''}
            </div>
        </div>

        <div class="ai-result__meta">
            ${metaItems}
        </div>

        <div class="ai-result__section">
            <h3>🛒 Malzemeler</h3>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>

        <div class="ai-result__section">
            <h3>👨‍🍳 Yapılışı</h3>
            <ol>
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>

        ${recipe.tips && recipe.tips.length > 0 ? `
            <div class="ai-result__section">
                <h3>💡 Püf Noktaları</h3>
                <ul>
                    ${recipe.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${recipe.note ? `
            <div class="ai-result__section">
                <h3>ℹ️ Bilgi</h3>
                <p style="color: var(--dark-light); line-height: 1.8; white-space: pre-line;">${recipe.note}</p>
            </div>
        ` : ''}
    `;

    resultDiv.classList.remove('hidden');
}

// Window function for suggestion tags
window.searchAI = function(query) {
    document.getElementById('ai-search-input').value = query;
    handleAISearch();
};

// ==================== FILTER ====================
function filterRecipes(category) {
    if (category === 'all') {
        displayRecipes(allRecipes);
    } else {
        const filtered = allRecipes.filter(r => r.category === category);
        displayRecipes(filtered);
    }
}

// ==================== UTILITIES ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showError(message) {
    alert(message);
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;
window.closeModal = closeModal;
window.showRecipeModal = showRecipeModal;

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

