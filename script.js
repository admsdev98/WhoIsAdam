// Función mejorada para manejar la timeline de experiencia
function toggleDetails(button) {
    const details = button.parentElement.querySelector('.job-details');
    const isExpanded = details.classList.contains('expanded');
    
    // Cerrar todos los demás detalles
    document.querySelectorAll('.job-details').forEach(detail => {
        detail.classList.remove('expanded');
    });
    
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.innerHTML = 'Más información ▼';
    });
    
    // Alternar el actual
    if (!isExpanded) {
        details.classList.add('expanded');
        button.innerHTML = 'Menos información ▲';
    }
}

// Función original para compatibilidad (por si se usa en otro lugar)
function toggleExpDetail(btn) {
    const detail = btn.nextElementSibling;
    const isOpen = detail.style.display === 'block';
    document.querySelectorAll('.event-detail').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.event-toggle').forEach(b => b.classList.remove('active'));
    if (!isOpen) {
        detail.style.display = 'block';
        btn.classList.add('active');
    }
}

// Función legacy para timeline anterior
function toggleTimelineDetail(btn) {
    const detail = btn.nextElementSibling;
    const isOpen = detail.style.display === 'block';
    
    // Cerrar todos los detalles abiertos
    document.querySelectorAll('.timeline-details').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.timeline-toggle').forEach(b => b.textContent = 'Más información');
    
    if (!isOpen) {
        detail.style.display = 'block';
        btn.textContent = 'Menos información';
    }
}
// Estado de la aplicación
let currentSection = 'home';
let isClassicMode = true;

// Toggle entre modo dinámico y clásico
function toggleMode() {
    isClassicMode = !isClassicMode;
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const toggleText = modeToggle.querySelector('.toggle-text');
    
    if (isClassicMode) {
        body.classList.add('classic-mode');
        modeToggle.classList.add('active');
        toggleText.textContent = 'Modo Clásico';
        
        // Smooth scroll para enlaces en modo clásico
        setupClassicNavigation();
    } else {
        body.classList.remove('classic-mode');
        modeToggle.classList.remove('active');
        toggleText.textContent = 'Modo Dinámico';
        
        // Volver al estado inicial del modo dinámico
        navigateToHome();
    }
    
    // Guardar preferencia
    localStorage.setItem('portfolioMode', isClassicMode ? 'classic' : 'dynamic');
}

// Configurar navegación para modo clásico
function setupClassicNavigation() {
    // Remover event listeners anteriores para evitar duplicados
    document.querySelectorAll('.classic-nav .nav-link, .home-link').forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
    });
    
    // Agregar nuevos event listeners
    document.querySelectorAll('.classic-nav .nav-link, .home-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Cargar preferencia de modo al iniciar
function loadModePreference() {
    const savedMode = localStorage.getItem('portfolioMode');
    
    // Si la preferencia guardada es diferente al modo por defecto (clásico), cambiar
    if (savedMode === 'dynamic') {
        // Cambiar a dinámico ya que por defecto es clásico
        toggleMode();
    }
    // Si no hay preferencia o es 'classic', ya está en modo clásico por defecto
}

// Inicializar modo clásico por defecto
function initializeClassicMode() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const toggleText = modeToggle.querySelector('.toggle-text');
    
    body.classList.add('classic-mode');
    modeToggle.classList.add('active');
    toggleText.textContent = 'Modo Clásico';
    setupClassicNavigation();
}

// Elementos del DOM
const mainContainer = document.querySelector('.main-container');
const themeToggle = document.getElementById('theme-toggle');
const homeBtn = document.getElementById('home-btn');
const body = document.body;

// Animación del nombre
const nameElement = document.getElementById('name-animation');
const cursorElement = document.getElementById('name-cursor');
const names = ['Adan...', 'Adán...', 'Adam!'];
let currentNameIndex = 0;
let isAnimating = false;

// Estado para controlar si la animación ya se ejecutó
let hasAnimationRun = false;



// Animación del nombre
function startNameAnimation() {
    if (isAnimating || hasAnimationRun) return; // Evitar que se ejecute nuevamente
    isAnimating = true;
    hasAnimationRun = true; // Marcar como ejecutada
    
    // Comenzar con el primer nombre incorrecto
    currentNameIndex = 0;
    animateToNextName();
}

function animateToNextName() {
    if (currentNameIndex >= names.length) {
        isAnimating = false;
        return;
    }
    
    const targetName = names[currentNameIndex];
    
    // Escribir el nuevo nombre
    typeText(targetName, () => {
        if (currentNameIndex < names.length - 1) {
            // Si no es el último nombre, esperar y luego borrar
            setTimeout(() => {
                deleteText(() => {
                    currentNameIndex++;
                    setTimeout(() => {
                        animateToNextName();
                    }, 300);
                });
            }, 1500);
        } else {
            // Es el último nombre (Adam!), mantenerlo
            cursorElement.classList.add('hide');
            isAnimating = false;
        }
    });
}

function typeText(text, callback) {
    nameElement.textContent = '';
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
            nameElement.textContent += text[charIndex];
            charIndex++;
        } else {
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, 100);
}

function deleteText(callback) {
    const currentText = nameElement.textContent;
    let charIndex = currentText.length;
    
    const deleteInterval = setInterval(() => {
        if (charIndex > 0) {
            nameElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            clearInterval(deleteInterval);
            if (callback) callback();
        }
    }, 80);
}

// Gestión del tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}



// Función principal de navegación
function navigateToSection(sectionId) {
    if (currentSection === sectionId) {
        return;
    }
    
    currentSection = sectionId;
    updateBodyClass();
    updateContainerPosition();
}

// Actualizar posición del contenedor
function updateContainerPosition() {
    // Remover todas las clases de vista
    mainContainer.classList.remove('view-home', 'view-about', 'view-projects', 'view-experience');
    
    // Agregar la clase correspondiente a la sección actual
    mainContainer.classList.add(`view-${currentSection}`);
}

// Actualizar la clase del body para mostrar/ocultar flechas
function updateBodyClass() {
    body.className = body.className.replace(/section-\w+/g, '');
    body.classList.add(`section-${currentSection}`);
}

// Funciones específicas de navegación desde HOME
function navigateToAbout() {
    if (currentSection === 'home') {
        navigateToSection('about');
    }
}

function navigateToProjects() {
    if (currentSection === 'home') {
        navigateToSection('projects');
    }
}

function navigateToExperience() {
    if (currentSection === 'home') {
        navigateToSection('experience');
    }
}

// Función para volver al home
function navigateToHome() {
    if (currentSection !== 'home') {
        navigateToSection('home');
        
        // Reiniciar animación del nombre cuando se vuelve al home
        setTimeout(() => {
            if (currentSection === 'home' && !isAnimating) {
                // Resetear estado
                nameElement.textContent = 'Adam!';
                cursorElement.classList.remove('hide');
                currentNameIndex = 0;
                
                // Reiniciar animación después de un breve delay
                setTimeout(() => {
                    startNameAnimation();
                }, 1000);
            }
        }, 600); // Esperar a que termine la transición
    }
}

// Navegación con teclado
document.addEventListener('keydown', function(e) {
    // Solo funcionar en modo dinámico
    if (isClassicMode) return;
    
    switch(e.key) {
        // Flechas del teclado
        case 'ArrowLeft':
            e.preventDefault();
            if (currentSection === 'home') {
                navigateToAbout();
            } else if (currentSection === 'projects') {
                navigateToHome();
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (currentSection === 'home') {
                navigateToProjects();
            } else if (currentSection === 'about') {
                navigateToHome();
            }
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (currentSection === 'home') {
                navigateToExperience();
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (currentSection === 'experience') {
                navigateToHome();
            }
            break;
        // Teclas WASD
        case 'w':
        case 'W':
            e.preventDefault();
            if (currentSection === 'experience') {
                navigateToHome();
            }
            break;
        case 'a':
        case 'A':
            e.preventDefault();
            if (currentSection === 'home') {
                navigateToAbout();
            } else if (currentSection === 'projects') {
                navigateToHome();
            }
            break;
        case 's':
        case 'S':
            e.preventDefault();
            if (currentSection === 'home') {
                navigateToExperience();
            }
            break;
        case 'd':
        case 'D':
            e.preventDefault();
            if (currentSection === 'home') {
                navigateToProjects();
            } else if (currentSection === 'about') {
                navigateToHome();
            }
            break;
        case 'Escape':
            e.preventDefault();
            navigateToHome();
            break;
    }
});

// Efectos 3D en tarjetas
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.project-card, .experience-item, .home-intro');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modo clásico por defecto
    initializeClassicMode();
    
    // Cargar preferencia de modo (puede cambiar el modo si está guardado como dinámico)
    loadModePreference();
    
    // Event listener para toggle de modo
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', toggleMode);
    }
    
    // Inicializar otras funcionalidades
    initializeTheme();
    updateBodyClass();
    updateContainerPosition();
    
    // Event listener para botón home
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isClassicMode) {
                navigateToHome();
            } else {
                // En modo clásico, hacer scroll al home
                const homeElement = document.getElementById('home');
                if (homeElement) {
                    homeElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
    
    // Event listener para toggle de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Iniciar animación del nombre después de un breve delay
    setTimeout(() => {
        startNameAnimation();
    }, 2000);
});
