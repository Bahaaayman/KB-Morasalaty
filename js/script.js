// Language toggle functionality
function toggleLanguage() {
    const path = window.location.pathname;
    let filename = path.substring(path.lastIndexOf('/') + 1);
    
    // Handle root path
    if (!filename) {
        filename = 'index.html';
    }

    if (filename.includes('-en.html')) {
        // Switch to Arabic
        const newFilename = filename.replace('-en.html', '.html');
        window.location.href = newFilename;
    } else {
        // Switch to English
        const newFilename = filename.replace('.html', '-en.html');
        // Handle root index case if filename is empty or just '/'
        if (filename === 'index.html') {
            window.location.href = 'index-en.html';
        } else {
            window.location.href = newFilename;
        }
    }
}

// Search functionality
let searchTimeout;
let currentSuggestions = [];

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        const isEnglish = document.documentElement.lang === 'en';
        alert(isEnglish ? 'Please enter at least 2 words to search' : 'يرجى إدخال كلمتين على الأقل للبحث');
        return;
    }
    
    // Store search query in sessionStorage
    sessionStorage.setItem('searchQuery', query);
    
    // Navigate to search results page
    const path = window.location.pathname;
    if (path.includes('-en.html') || document.documentElement.lang === 'en') {
        window.location.href = 'search-results-en.html';
    } else {
        window.location.href = 'search-results.html';
    }
}

function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!query || query.length < 1) {
        suggestionsContainer.classList.remove('show');
        return;
    }
    
    if (typeof getSearchSuggestions === 'function') {
        const suggestions = getSearchSuggestions(query);
        
        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}')">
                    <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span class="suggestion-text">${suggestion.text}</span>
                    <span class="suggestion-category">${suggestion.category}</span>
                </div>
            `).join('');
            
            suggestionsContainer.classList.add('show');
            currentSuggestions = suggestions;
        } else {
            suggestionsContainer.classList.remove('show');
        }
    }
}

function selectSuggestion(text) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = text;
    document.getElementById('searchSuggestions').classList.remove('show');
    performSearch();
}

function hideSuggestions() {
    setTimeout(() => {
        document.getElementById('searchSuggestions').classList.remove('show');
    }, 200);
}

// Search results page functionality
function displaySearchResults() {
    const query = sessionStorage.getItem('searchQuery');
    const isEnglish = document.documentElement.lang === 'en';

    if (!query) {
        window.location.href = isEnglish ? 'index-en.html' : 'index.html';
        return;
    }
    
    // Update search input with query
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = query;
    }
    
    // Update search query display
    const searchQueryElement = document.getElementById('searchQuery');
    if (searchQueryElement) {
        searchQueryElement.textContent = query;
    }
    
    // Perform search
    if (typeof performSearchInData === 'function') {
        const results = performSearchInData(query);
        
        // Update results count
        const resultsCountElement = document.getElementById('resultsCount');
        if (resultsCountElement) {
            resultsCountElement.textContent = results.length;
        }
        
        // Display results
        const searchResultsContainer = document.getElementById('searchResults');
        const noResultsContainer = document.getElementById('noResults');
        
        if (results.length > 0) {
            const btnText = isEnglish ? 'Go to section' : 'الانتقال إلى القسم';
            const linkText = isEnglish ? 'View page' : 'عرض الصفحة';

            searchResultsContainer.innerHTML = results.map(result => {
                let pageLink = result.page;
                if (isEnglish) {
                    pageLink = pageLink.replace('.html', '-en.html');
                }

                return `
                <div class="search-result-item">
                    <div class="result-header">
                        <div>
                            <h3 class="result-title">${result.highlightedTitle}</h3>
                        </div>
                        <span class="result-category">${result.category}</span>
                    </div>
                    <p class="result-snippet">${result.snippet}</p>
                    <div class="result-actions">
                        <button class="go-to-section-btn" onclick="goToSection('${result.page}', '${result.section}')">
                            ${btnText}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                        </button>
                        <a href="${pageLink}" class="result-page-link">${linkText}</a>
                    </div>
                </div>
            `}).join('');
            
            searchResultsContainer.style.display = 'block';
            noResultsContainer.style.display = 'none';
        } else {
            searchResultsContainer.style.display = 'none';
            noResultsContainer.style.display = 'block';
        }
    }
}

function goToSection(page, sectionId) {
    const isEnglish = document.documentElement.lang === 'en';
    let targetPage = page;

    if (isEnglish && !targetPage.includes('-en.html')) {
        targetPage = targetPage.replace('.html', '-en.html');
    }

    // Navigate to the page with section anchor
    window.location.href = `${targetPage}#${sectionId}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the page starts with Arabic (RTL) as default ONLY if lang is not set to en
    const html = document.documentElement;
    const body = document.body;
    
    if (!html.getAttribute('lang') && !html.getAttribute('dir')) {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
        body.classList.remove('ltr');
    }
    
    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Add search input event listeners
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(e.target.value);
            }, 300);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        
        searchInput.addEventListener('blur', hideSuggestions);
        
        searchInput.addEventListener('focus', function(e) {
            if (e.target.value.length > 0) {
                showSearchSuggestions(e.target.value);
            }
        });
    }
    
    // Check if we're on search results page
    if (window.location.pathname.includes('search-results')) {
        displaySearchResults();
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle direct section navigation from URL hash
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Highlight the section briefly
                target.style.backgroundColor = '#fff3e0';
                setTimeout(() => {
                    target.style.backgroundColor = '';
                }, 2000);
            }
        }, 500);
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click animation to buttons
    const buttons = document.querySelectorAll('button, .service-card');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.search-container');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (searchContainer && suggestionsContainer && !searchContainer.contains(e.target)) {
        suggestionsContainer.classList.remove('show');
    }
});

// Hamburger menu toggle for mobile
const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', function(e) {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}
