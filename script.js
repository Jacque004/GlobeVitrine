// Navigation mobile améliorée
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Fermer le menu en cliquant sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Fermer le menu en cliquant à l'extérieur
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Fermer le menu mobile quand on clique sur un lien
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navigation sticky améliorée
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Ajouter/supprimer la classe scrolled
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Cacher/afficher la navbar au scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Smooth scrolling pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Ajustement pour la navbar fixe
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animation d'apparition des éléments au scroll optimisée
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animation en cascade optimisée pour les éléments en grille
            const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 50;
            entry.target.style.animationDelay = `${delay}ms`;
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe fade-in
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .contact-item, .section-header');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Animation des cartes en cascade optimisée
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 50}ms`;
    });
});


// Gestion du formulaire de contact améliorée
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    // Validation en temps réel
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation complète
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
            return;
        }
        
        // Animation de chargement
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulation d'envoi
        setTimeout(() => {
            showNotification('Message envoyé avec succès ! Nous vous recontacterons bientôt.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Supprimer les erreurs précédentes
    clearFieldError(e);
    
    // Validation selon le type de champ
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Le nom est requis';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
                isValid = false;
            }
            break;
        case 'email':
            if (!value) {
                errorMessage = 'L\'email est requis';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Veuillez entrer une adresse email valide';
                isValid = false;
            }
            break;
        case 'message':
            if (!value) {
                errorMessage = 'Le message est requis';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Le message doit contenir au moins 10 caractères';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorElement);
}

// Validation d'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Ajouter les styles CSS pour les notifications
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.75rem;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success i {
                color: #10b981;
            }
            
            .notification-error i {
                color: #ef4444;
            }
            
            .notification-info i {
                color: #3b82f6;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                margin-left: auto;
            }
            
            .notification-close:hover {
                color: #374151;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
    
    // Gérer la fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Effet de parallaxe léger pour la section hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Animation des cartes au survol
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Gestion des liens du portfolio
document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Vérifier si le lien a un href spécifique (comme cleanik.html)
        if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
            // Laisser le comportement par défaut pour les liens avec href spécifique
            return;
        }
        
        // Empêcher le comportement par défaut seulement pour les liens sans href
        e.preventDefault();
        showNotification('Projet en cours de développement. Contactez-nous pour plus d\'informations !', 'info');
    });
});

// Fonction pour changer l'image de fond d'une carte portfolio
function setPortfolioImage(portfolioItem, imageUrl, altText = '') {
    const portfolioImage = portfolioItem.querySelector('.portfolio-image');
    if (portfolioImage) {
        portfolioImage.classList.add('has-image');
        
        // Vérifier s'il y a déjà une image
        let imgElement = portfolioImage.querySelector('.portfolio-bg-image');
        
        if (imgElement) {
            // Mettre à jour l'image existante
            imgElement.src = imageUrl;
            if (altText) {
                imgElement.alt = altText;
            }
        } else {
            // Créer une nouvelle image
            imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = altText || '';
            imgElement.className = 'portfolio-bg-image';
            portfolioImage.insertBefore(imgElement, portfolioImage.firstChild);
        }
        
        // Ajouter un attribut alt pour l'accessibilité
        if (altText) {
            portfolioImage.setAttribute('aria-label', altText);
        }
    }
}

// Fonction pour supprimer l'image de fond et revenir au dégradé
function removePortfolioImage(portfolioItem) {
    const portfolioImage = portfolioItem.querySelector('.portfolio-image');
    if (portfolioImage) {
        portfolioImage.classList.remove('has-image');
        portfolioImage.style.backgroundImage = '';
        portfolioImage.removeAttribute('aria-label');
        
        // Supprimer l'élément img s'il existe
        const imgElement = portfolioImage.querySelector('.portfolio-bg-image');
        if (imgElement) {
            imgElement.remove();
        }
    }
}

// Animation de typing pour le titre principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Appliquer l'effet de typing au chargement de la page (optimisé)
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        // Délai réduit pour un chargement plus rapide
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 30);
        }, 200);
    }
});

// Gestion du changement de plan dans le formulaire
const serviceSelect = document.querySelector('#service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
        const messageField = document.querySelector('#message');
        const currentMessage = messageField.value;
        
        if (this.value && !currentMessage.includes('Plan sélectionné:')) {
            const planText = this.options[this.selectedIndex].text;
            messageField.value = `Plan sélectionné: ${planText}\n\n${currentMessage}`;
        }
    });
}

// Préchargement des images optimisé
function preloadImages() {
    const imageUrls = [
        // Ajouter ici les URLs des images si nécessaire
    ];
    
    // Précharger seulement si il y a des images à précharger
    if (imageUrls.length > 0) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
}

// Initialisation optimisée
document.addEventListener('DOMContentLoaded', () => {
    // Charger les images en arrière-plan sans bloquer
    setTimeout(preloadImages, 0);
    
    // Effet de chargement plus rapide et fluide
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.2s ease';
    
    // Utiliser requestAnimationFrame pour un rendu plus fluide
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
    
    // Exemple d'utilisation des fonctions d'image portfolio
    // Vous pouvez utiliser ces fonctions pour changer l'image de fond :
    // const cleanikCard = document.querySelector('.portfolio-item:nth-child(3)');
    // setPortfolioImage(cleanikCard, 'img/votre-image.jpg', 'Description de l\'image');
});

// Gestion des erreurs JavaScript
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // Optionnel: envoyer l'erreur à un service de monitoring
});

// Performance: Lazy loading pour les images (si ajoutées plus tard)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
