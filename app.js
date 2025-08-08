// Fake News Detector Application JavaScript

// Sample news data and detection criteria
const sampleNews = [
    {
        id: 1,
        type: "fake",
        category: "politics",
        headline: "BREAKING: Scientists Discover Miracle Cure That Big Pharma Doesn't Want You to Know About!",
        content: "A group of independent researchers has allegedly discovered a simple home remedy that can cure virtually any disease. The pharmaceutical industry is supposedly trying to suppress this information because it would destroy their profits. This revolutionary treatment involves common household items and costs less than $5 to make!",
        explanation: "This text contains multiple red flags typical of fake news: sensational language, conspiracy theories about 'Big Pharma', unrealistic claims about miracle cures, and lack of specific details or credible sources."
    },
    {
        id: 2,
        type: "real",
        category: "health",
        headline: "New Study Shows Promising Results for Alzheimer's Treatment",
        content: "Researchers at Johns Hopkins University published findings in the Journal of Alzheimer's Disease showing that a new experimental drug reduced cognitive decline by 22% in early-stage patients during a 12-month clinical trial. The study involved 240 participants and will require larger trials before FDA approval consideration.",
        explanation: "This appears to be legitimate news with specific details: named institution, published journal, specific statistics, appropriate caveats about further research needed, and realistic claims."
    },
    {
        id: 3,
        type: "fake",
        category: "technology",
        headline: "SHOCKING: Your Smartphone is Secretly Recording Everything You Say 24/7!",
        content: "Tech insiders reveal that ALL smartphones are constantly listening and recording every conversation, even when turned off! Government agencies and corporations are building massive databases of private conversations. Delete this app immediately to protect yourself! Share this before it gets BANNED!",
        explanation: "Classic fake news characteristics: alarmist language, vague sources ('tech insiders'), conspiracy theories, urgent calls to action, and claims that are technologically implausible."
    },
    {
        id: 4,
        type: "real",
        category: "science",
        headline: "Climate Scientists Report Record Antarctic Ice Loss in 2023",
        content: "According to data released by the National Snow and Ice Data Center, Antarctica lost approximately 150 billion tons of ice in 2023, contributing to a 3.2mm rise in global sea levels. The findings, published in Nature Climate Change, represent the third-highest annual ice loss since satellite monitoring began in 1979.",
        explanation: "Legitimate scientific reporting with specific data sources, measurable statistics, peer-reviewed publication, and historical context for comparison."
    },
    {
        id: 5,
        type: "fake",
        category: "politics",
        headline: "URGENT: New Law Will Make It ILLEGAL to Grow Your Own Food!",
        content: "Congress is secretly passing legislation that will criminalize home gardens and force all Americans to buy food only from government-approved sources! This is part of a global agenda to control the food supply. Act NOW before it's too late! Call your representatives TODAY!",
        explanation: "Contains fear-mongering language, secretive government conspiracy theories, unrealistic claims about legislation, and urgent calls to action without specific bill numbers or legitimate sources."
    },
    {
        id: 6,
        type: "real",
        category: "economics",
        headline: "Federal Reserve Raises Interest Rates by 0.25 Percentage Points",
        content: "The Federal Open Market Committee voted 7-5 to increase the federal funds rate to 5.5%, citing persistent inflation concerns despite recent economic data showing slower price growth. Fed Chair Jerome Powell indicated this may be the final rate increase of the current cycle, depending on upcoming employment and inflation reports.",
        explanation: "Factual economic reporting with specific details about voting, exact figures, named officials, and appropriate context about economic conditions."
    }
];

const detectionCriteria = {
    sensationalLanguage: ["BREAKING", "SHOCKING", "URGENT", "MIRACLE", "BANNED", "SECRET", "HIDDEN"],
    emotionalTriggers: ["HATE", "FEAR", "ANGER", "OUTRAGE", "SCANDAL", "CRISIS"],
    credibilityIndicators: ["study", "research", "university", "journal", "data", "statistics"],
    sourceQuality: ["published", "peer-reviewed", "official", "documented", "verified"],
    conspiracyTerms: ["cover-up", "they don't want you to know", "secretly", "hidden agenda", "conspiracy"]
};

const tips = [
    "Check if the source is reputable and well-known",
    "Look for author credentials and contact information",
    "Verify claims with multiple independent sources",
    "Be skeptical of sensational headlines with ALL CAPS",
    "Check the publication date - old news may be recirculated",
    "Look for specific details rather than vague claims",
    "Be wary of emotional language designed to provoke reactions",
    "Check if other credible news outlets are reporting the same story"
];

// Application state
let analysisHistory = [];
let currentAnalysis = null;

// DOM Elements
let newsTextarea, analyzeBtn, clearBtn, sampleGrid, resultsContainer, historyContainer, historyList, toast, heroCta, navLinks, navToggle, navMenu;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    initializeApp();
});

function initializeDOM() {
    // Get DOM elements with error checking
    newsTextarea = document.getElementById('newsText');
    analyzeBtn = document.getElementById('analyzeBtn');
    clearBtn = document.getElementById('clearBtn');
    sampleGrid = document.getElementById('sampleGrid');
    resultsContainer = document.getElementById('resultsContainer');
    historyContainer = document.getElementById('historyContainer');
    historyList = document.getElementById('historyList');
    toast = document.getElementById('toast');
    heroCta = document.querySelector('.hero-cta');
    navLinks = document.querySelectorAll('.nav-link');
    navToggle = document.querySelector('.nav-toggle');
    navMenu = document.querySelector('.nav-menu');
}

function initializeApp() {
    setupEventListeners();
    populateSampleArticles();
    populateEducationTips();
    setupSmoothScrolling();
    updateTextStats();
}

function setupEventListeners() {
    // Text analysis
    if (newsTextarea) {
        newsTextarea.addEventListener('input', updateTextStats);
    }
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeNews);
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', clearText);
    }
    
    // Navigation
    if (heroCta) {
        heroCta.addEventListener('click', () => scrollToSection('analyze'));
    }
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Results actions
    const saveResultBtn = document.getElementById('saveResult');
    const shareResultBtn = document.getElementById('shareResult');
    if (saveResultBtn) {
        saveResultBtn.addEventListener('click', saveResult);
    }
    if (shareResultBtn) {
        shareResultBtn.addEventListener('click', shareResult);
    }
    
    // Toast close
    const toastClose = document.getElementById('toastClose');
    if (toastClose) {
        toastClose.addEventListener('click', hideToast);
    }
    
    // Navigation links
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                scrollToSection(target);
                setActiveNavLink(link);
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });
    }
}

function populateSampleArticles() {
    if (!sampleGrid) return;
    
    sampleGrid.innerHTML = '';
    sampleNews.forEach(article => {
        const sampleItem = document.createElement('div');
        sampleItem.className = 'sample-item';
        sampleItem.innerHTML = `
            <div class="sample-type ${article.type}">${article.type.toUpperCase()}</div>
            <div class="sample-headline">${article.headline}</div>
            <div class="sample-category">${article.category}</div>
        `;
        
        sampleItem.addEventListener('click', () => {
            if (newsTextarea) {
                newsTextarea.value = `${article.headline}\n\n${article.content}`;
                updateTextStats();
                showToast('Sample article loaded! Click "Analyze News" to test.', 'success');
                scrollToSection('analyze');
            }
        });
        
        sampleGrid.appendChild(sampleItem);
    });
}

function populateEducationTips() {
    const tipsList = document.getElementById('tipsList');
    if (tipsList) {
        tipsList.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'tips-list';
        
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            ul.appendChild(li);
        });
        
        tipsList.appendChild(ul);
    }
}

function updateTextStats() {
    if (!newsTextarea) return;
    
    const text = newsTextarea.value;
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    const charCountEl = document.querySelector('.char-count');
    const wordCountEl = document.querySelector('.word-count');
    
    if (charCountEl) charCountEl.textContent = `${charCount} characters`;
    if (wordCountEl) wordCountEl.textContent = `${wordCount} words`;
    
    // Enable/disable analyze button
    if (analyzeBtn) {
        analyzeBtn.disabled = text.trim().length < 10;
    }
}

function clearText() {
    if (newsTextarea) {
        newsTextarea.value = '';
        updateTextStats();
        hideResults();
        showToast('Text cleared successfully', 'success');
    }
}

async function analyzeNews() {
    if (!newsTextarea) return;
    
    const text = newsTextarea.value.trim();
    
    if (text.length < 10) {
        showToast('Please enter at least 10 characters to analyze', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Perform analysis
    const analysis = performTextAnalysis(text);
    currentAnalysis = analysis;
    
    // Display results
    displayResults(analysis);
    
    // Add to history
    addToHistory(text, analysis);
    
    // Hide loading state
    setLoadingState(false);
    
    // Show success toast
    showToast(`Analysis complete! Prediction: ${analysis.prediction}`, 'success');
}

function performTextAnalysis(text) {
    const textUpper = text.toUpperCase();
    const textLower = text.toLowerCase();
    
    // Calculate various scores
    const sensationalScore = calculateSensationalScore(textUpper);
    const credibilityScore = calculateCredibilityScore(textLower);
    const emotionalScore = calculateEmotionalScore(textUpper);
    const conspiracyScore = calculateConspiracyScore(textLower);
    
    // Determine overall prediction
    const fakeIndicators = sensationalScore + emotionalScore + conspiracyScore;
    const realIndicators = credibilityScore;
    
    const isFake = fakeIndicators > realIndicators;
    const confidence = Math.min(95, Math.max(55, Math.round(
        isFake ? 
        (fakeIndicators / (fakeIndicators + realIndicators)) * 100 :
        (realIndicators / (fakeIndicators + realIndicators)) * 100
    )));
    
    // Generate explanation
    const explanation = generateExplanation(text, {
        sensationalScore,
        credibilityScore,
        emotionalScore,
        conspiracyScore,
        isFake
    });
    
    return {
        prediction: isFake ? 'fake' : 'real',
        confidence,
        sensationalScore: Math.min(100, sensationalScore * 10),
        credibilityScore: Math.min(100, credibilityScore * 15),
        emotionalScore: Math.min(100, emotionalScore * 12),
        explanation,
        timestamp: new Date(),
        text: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    };
}

function calculateSensationalScore(text) {
    let score = 0;
    detectionCriteria.sensationalLanguage.forEach(word => {
        const matches = (text.match(new RegExp(word, 'g')) || []).length;
        score += matches * 2;
    });
    
    // Check for excessive punctuation
    const exclamationMarks = (text.match(/!/g) || []).length;
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    
    score += exclamationMarks * 0.5;
    score += capsRatio > 0.3 ? 3 : 0;
    
    return score;
}

function calculateCredibilityScore(text) {
    let score = 0;
    detectionCriteria.credibilityIndicators.forEach(word => {
        const matches = (text.match(new RegExp(word, 'g')) || []).length;
        score += matches;
    });
    
    detectionCriteria.sourceQuality.forEach(word => {
        const matches = (text.match(new RegExp(word, 'g')) || []).length;
        score += matches * 1.5;
    });
    
    // Check for specific data and numbers
    const numberMatches = (text.match(/\d+/g) || []).length;
    score += numberMatches > 3 ? 2 : 0;
    
    return score;
}

function calculateEmotionalScore(text) {
    let score = 0;
    detectionCriteria.emotionalTriggers.forEach(word => {
        const matches = (text.match(new RegExp(word, 'g')) || []).length;
        score += matches * 1.5;
    });
    return score;
}

function calculateConspiracyScore(text) {
    let score = 0;
    detectionCriteria.conspiracyTerms.forEach(term => {
        if (text.includes(term)) {
            score += 2;
        }
    });
    return score;
}

function generateExplanation(text, scores) {
    const explanations = [];
    
    if (scores.isFake) {
        if (scores.sensationalScore > 20) {
            explanations.push("The text contains excessive sensational language and emotional triggers typical of fake news.");
        }
        if (scores.conspiracyScore > 0) {
            explanations.push("The content includes conspiracy-related terminology that raises credibility concerns.");
        }
        if (scores.credibilityScore < 10) {
            explanations.push("The text lacks credible sources, specific data, or authoritative references.");
        }
        if (text.toUpperCase().includes('BREAKING') || text.toUpperCase().includes('URGENT')) {
            explanations.push("Uses urgent language designed to bypass critical thinking.");
        }
    } else {
        if (scores.credibilityScore > 15) {
            explanations.push("The text contains multiple credibility indicators such as specific data, sources, or research references.");
        }
        if (scores.sensationalScore < 10) {
            explanations.push("The language is measured and factual rather than sensational or emotional.");
        }
        if (text.match(/\d+%|\d+\.\d+/)) {
            explanations.push("Includes specific statistics and numerical data that can be verified.");
        }
    }
    
    if (explanations.length === 0) {
        explanations.push(scores.isFake ? 
            "The analysis suggests this may be unreliable based on language patterns and lack of credible sources." :
            "The content appears to follow journalistic standards with factual reporting style."
        );
    }
    
    return explanations.join(' ');
}

function displayResults(analysis) {
    if (!resultsContainer) return;
    
    // Update prediction result
    const predictionLabel = document.getElementById('predictionLabel');
    const confidenceScore = document.getElementById('confidenceScore');
    const resultTimestamp = document.getElementById('resultTimestamp');
    const explanationText = document.getElementById('explanationText');
    
    if (predictionLabel) {
        predictionLabel.textContent = analysis.prediction.toUpperCase();
        predictionLabel.className = `prediction-label ${analysis.prediction}`;
    }
    
    if (confidenceScore) {
        confidenceScore.textContent = `${analysis.confidence}%`;
    }
    
    if (resultTimestamp) {
        resultTimestamp.textContent = `Analyzed on ${analysis.timestamp.toLocaleString()}`;
    }
    
    if (explanationText) {
        explanationText.textContent = analysis.explanation;
    }
    
    // Update progress bars
    updateProgressBar('sensationalScore', analysis.sensationalScore);
    updateProgressBar('credibilityScore', analysis.credibilityScore);
    updateProgressBar('emotionalScore', analysis.emotionalScore);
    
    // Show results container
    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateProgressBar(id, score) {
    const progressFill = document.getElementById(id);
    if (progressFill) {
        progressFill.style.width = `${Math.min(100, score)}%`;
        
        // Color based on score
        if (score > 70) {
            progressFill.style.backgroundColor = 'var(--color-error)';
        } else if (score > 40) {
            progressFill.style.backgroundColor = 'var(--color-warning)';
        } else {
            progressFill.style.backgroundColor = 'var(--color-success)';
        }
    }
}

function hideResults() {
    if (resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
}

function addToHistory(text, analysis) {
    const historyItem = {
        id: Date.now(),
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        prediction: analysis.prediction,
        confidence: analysis.confidence,
        timestamp: analysis.timestamp
    };
    
    analysisHistory.unshift(historyItem);
    
    // Keep only last 10 items
    if (analysisHistory.length > 10) {
        analysisHistory = analysisHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (!historyList) return;
    
    if (analysisHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No analysis history yet. Start by analyzing some news!</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    analysisHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-text">${item.text}</div>
            <div class="history-result">
                <span class="history-prediction ${item.prediction}">${item.prediction.toUpperCase()}</span>
                <span class="confidence-score">${item.confidence}%</span>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

function saveResult() {
    if (!currentAnalysis) return;
    
    const resultData = {
        text: newsTextarea.value,
        ...currentAnalysis
    };
    
    // In a real app, this would save to a database
    // For now, we'll just show a success message
    showToast('Analysis result saved successfully!', 'success');
}

function shareResult() {
    if (!currentAnalysis) return;
    
    const shareText = `Fake News Analysis Result: ${currentAnalysis.prediction.toUpperCase()} (${currentAnalysis.confidence}% confidence)`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Fake News Analysis Result',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Result copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Unable to share result', 'error');
        });
    }
}

function setLoadingState(loading) {
    if (!analyzeBtn) return;
    
    const btnText = analyzeBtn.querySelector('.btn-text');
    const spinner = analyzeBtn.querySelector('.loading-spinner');
    
    if (loading) {
        if (btnText) btnText.textContent = 'Analyzing...';
        if (spinner) spinner.classList.remove('hidden');
        analyzeBtn.disabled = true;
    } else {
        if (btnText) btnText.textContent = 'Analyze News';
        if (spinner) spinner.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
}

function showToast(message, type = 'success') {
    if (!toast) return;
    
    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(hideToast, 5000);
}

function hideToast() {
    if (toast) {
        toast.classList.add('hidden');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function setActiveNavLink(activeLink) {
    if (navLinks) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
}

function toggleMobileNav() {
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    }
}

function setupSmoothScrolling() {
    // Handle scroll-based navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = ['home', 'analyze', 'education', 'about'];
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeLink && !activeLink.classList.contains('active')) {
                        setActiveNavLink(activeLink);
                    }
                }
            }
        });
    });
}

// Add mobile navigation styles
const mobileNavStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--color-surface);
            border-top: 1px solid var(--color-border);
            flex-direction: column;
            padding: var(--space-16);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-normal) var(--ease-standard);
            z-index: 1000;
        }
        
        .nav-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-menu li {
            margin: var(--space-8) 0;
        }
    }
`;

// Inject mobile styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileNavStyles;
document.head.appendChild(styleSheet);

// Initialize intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card, .stat-card, .sample-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});