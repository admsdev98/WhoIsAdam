/*
 * Logic for Adam's Portfolio
 * Handles: Theme, Animation, Navigation Highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        theme: localStorage.getItem('theme') || 'dark'
    };

    // --- DOM Elements ---
    const elements = {
        themeToggle: document.getElementById('theme-toggle'),
        navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
        sections: document.querySelectorAll('section'),
        nameElement: document.getElementById('name-animation'),
        cursorElement: document.querySelector('.cursor')
    };

    // --- Initialization ---
    init();

    function init() {
        setTheme(state.theme);
        setupEventListeners();
        setupScrollObserver();
        startNameAnimation();
    }

    // --- Theme Handling ---
    function setTheme(theme) {
        state.theme = theme;
        localStorage.setItem('theme', theme);

        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            elements.themeToggle.textContent = '🌙'; // Moon icon for dark mode switch
        } else {
            document.documentElement.removeAttribute('data-theme');
            elements.themeToggle.textContent = '☀'; // Sun icon for light mode switch
        }
    }

    function toggleTheme() {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // --- Name Animation ---
    function startNameAnimation() {
        const sequence = [
            { text: "Adan...", delay: 0 },
            { text: "Alam...", delay: 1500 },
            { text: "Adam!", delay: 3000 }
        ];

        let currentIndex = 0;

        function playNext() {
            if (currentIndex >= sequence.length) {
                elements.cursorElement.style.display = 'none'; // Hide cursor at end
                return;
            }

            const item = sequence[currentIndex];
            typeText(item.text, () => {
                if (currentIndex < sequence.length - 1) {
                    setTimeout(() => {
                        deleteText(() => {
                            currentIndex++;
                            playNext();
                        });
                    }, 1000);
                } else {
                    // Final state
                    currentIndex++;
                    playNext();
                }
            });
        }

        playNext();
    }

    function typeText(text, callback) {
        elements.nameElement.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            elements.nameElement.textContent += text.charAt(i);
            i++;
            if (i > text.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 100);
    }

    function deleteText(callback) {
        let text = elements.nameElement.textContent;
        const interval = setInterval(() => {
            text = text.slice(0, -1);
            elements.nameElement.textContent = text;
            if (text.length === 0) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50);
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Theme Toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }
    }

    // --- Scroll Observer (Active Link Highlighting) ---
    function setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateActiveLink(id);
                }
            });
        }, { threshold: 0.5 });

        elements.sections.forEach(section => observer.observe(section));
    }

    function updateActiveLink(id) {
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
});
