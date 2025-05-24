// produse-noi.js - JavaScript pentru funcționalitățile produselor noi

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script produse noi încărcat');
    
    // Selectare elemente principale
    const butoaneAdaugaCos = document.querySelectorAll('.btn-adauga-cos-nou');
    const carduri = document.querySelectorAll('.card-produs-nou');
    const imaginiProduse = document.querySelectorAll('.imagine-produs-nou img');
    const sectiuneProduse = document.querySelector('.sectiune-produse-noi');
    
    // BONUS 18: Funcționalitate pentru marcarea produselor noi - INTERVAL REDUS LA 2 ZILE
    function initNewProductsFeatures() {
        // Verificăm intervalul pentru produse noi (2 zile în loc de 30)
        const intervalProdusNou = 2 * 24 * 60 * 60 * 1000; // 2 zile în milisecunde
        const acum = new Date();
        
        // Parcurgem toate cardurile și aplicăm efecte pentru produse noi
        carduri.forEach((card, index) => {
            // Verificăm dacă produsul este cu adevărat nou
            const timeElement = card.querySelector('time');
            if (timeElement) {
                const dataAdaugare = new Date(timeElement.getAttribute('datetime'));
                const diferentaTimp = acum - dataAdaugare;
                const esteNou = diferentaTimp <= intervalProdusNou;
                
                if (esteNou) {
                    // Adăugăm efecte speciale pentru produse noi
                    card.classList.add('produs-foarte-nou');
                    
                    // Animație de pulsare pentru marcaj
                    const marcaj = card.querySelector('.marcaj-nou-homepage');
                    if (marcaj) {
                        setInterval(() => {
                            marcaj.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                marcaj.style.transform = 'scale(1)';
                            }, 200);
                        }, 3000);
                    }
                }
            }
            
            // Animație de apariție cu delay progresiv
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    // Funcționalitate pentru butoanele de adăugare în coș
    function initAddToCartButtons() {
        butoaneAdaugaCos.forEach(buton => {
            buton.addEventListener('click', function() {
                const produsId = this.getAttribute('data-produs-id');
                
                // Animație buton
                this.classList.add('pulsating');
                this.style.transform = 'scale(0.95)';
                
                // Simulare adăugare în coș
                setTimeout(() => {
                    this.classList.remove('pulsating');
                    this.style.transform = 'scale(1)';
                    
                    // Afișare notificare specială pentru produse noi
                    showNewProductNotification('Produs nou adăugat în coș! 🎉✨', 'success');
                    
                    // Schimbare temporară a iconului
                    const icon = this.querySelector('i');
                    const originalClass = icon.className;
                    icon.className = 'fas fa-check';
                    icon.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        icon.className = originalClass;
                        icon.style.color = '';
                    }, 1500);
                    
                    // Actualizăm contorul din header (dacă există)
                    updateCartCounter();
                    
                }, 300);
            });
            
            // Efect hover special
            buton.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, #ff8e53, #ffab7a)';
                this.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.5)';
            });
            
            buton.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, #ff6b35, #ff8e53)';
                this.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
            });
        });
    }
    
    // Funcție pentru notificări speciale pentru produse noi
    function showNewProductNotification(message, type = 'success') {
        // Eliminăm notificarea existentă
        const existingNotification = document.querySelector('.notification-nou');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification-nou ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-star notification-icon"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Stilizare notificare avansată
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            zIndex: '10000',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(120%) scale(0.8)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #5CB85C, #4CAF50)' 
                : 'linear-gradient(135deg, #ff6b35, #ff8e53)',
            color: 'white',
            minWidth: '300px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
        });
        
        // Stiluri pentru conținut
        const content = notification.querySelector('.notification-content');
        Object.assign(content.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
        });
        
        const icon = notification.querySelector('.notification-icon');
        Object.assign(icon.style, {
            fontSize: '1.2rem',
            animation: 'sparkle-notification 1s ease-in-out infinite'
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        document.body.appendChild(notification);
        
        // Animație apariție
        setTimeout(() => {
            notification.style.transform = 'translateX(0) scale(1)';
        }, 10);
        
        // Event listener pentru butonul de închidere
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
        
        // Eliminare automată după 4 secunde
        setTimeout(() => {
            hideNotification(notification);
        }, 4000);
    }
    
    // Funcție pentru ascunderea notificării
    function hideNotification(notification) {
        notification.style.transform = 'translateX(120%) scale(0.8)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }
    
    // Funcție pentru actualizarea contorului de coș
    function updateCartCounter() {
        const counter = document.querySelector('.cart-counter, .cos-counter');
        if (counter) {
            let currentCount = parseInt(counter.textContent) || 0;
            counter.textContent = currentCount + 1;
            
            // Animație pentru contor
            counter.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                counter.style.animation = '';
            }, 600);
        }
    }
    
    // Animații avansate pentru carduri
    function initAdvancedCardAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    
                    // Efect de undă pentru imagine
                    const img = card.querySelector('.imagine-produs-nou img');
                    if (img) {
                        setTimeout(() => {
                            img.style.transform = 'scale(1.05)';
                            setTimeout(() => {
                                img.style.transform = 'scale(1)';
                            }, 300);
                        }, 200);
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        carduri.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Efecte hover avansate pentru imagini
    function initImageEffects() {
        imaginiProduse.forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
                this.style.transform = 'scale(1.1) rotate(1deg)';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))';
                this.style.transform = 'scale(1) rotate(0deg)';
            });
            
            // Efect click pentru zoom
            img.addEventListener('click', function(e) {
                e.preventDefault();
                createImageModal(this);
            });
        });
    }
    
    // Funcție pentru crearea modalului de imagine
    function createImageModal(img) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: '20000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            cursor: 'pointer'
        });
        
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        
        Object.assign(modalImg.style, {
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            transform: 'scale(0.8)',
            transition: 'transform 0.3s ease'
        });
        
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
        
        // Animație apariție
        setTimeout(() => {
            modal.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        }, 10);
        
        // Inchidere modal
        modal.addEventListener('click', () => {
            modal.style.opacity = '0';
            modalImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Închidere cu ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.click();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    // Efect parallax pentru secțiune
    function initParallaxEffect() {
        if (!sectiuneProduse) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rect = sectiuneProduse.getBoundingClientRect();
            const speed = 0.3;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                sectiuneProduse.style.transform = `translateY(${scrolled * speed}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Funcție pentru statistici și analytics
    function trackNewProductsInteraction() {
        // Tracking click-uri pe produse noi
        const linkuriProduse = document.querySelectorAll('.btn-vezi-produs-nou');
        linkuriProduse.forEach(link => {
            link.addEventListener('click', () => {
                console.log('📊 Click pe produs nou:', link.getAttribute('href'));
            });
        });
        
        // Tracking timp petrecut în secțiune
        let timeSpent = 0;
        const startTime = Date.now();
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Utilizatorul vede secțiunea
                    console.log('👁️ Secțiunea produse noi este vizibilă');
                }
            });
        });
        
        if (sectiuneProduse) {
            observer.observe(sectiuneProduse);
        }
    }
    
    // Funcție pentru lazy loading îmbunătățit
    function initAdvancedLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Simulare loading
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    // Placeholder blur effect
                    img.style.filter = 'blur(5px)';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                        img.style.filter = 'blur(0px)';
                        img.style.transform = 'scale(1)';
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        imaginiProduse.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Inițializare toate funcționalitățile
    function initializeAll() {
        initNewProductsFeatures();
        initAddToCartButtons();
        initAdvancedCardAnimations();
        initImageEffects();
        initParallaxEffect();
        initAdvancedLazyLoading();
        trackNewProductsInteraction();
        
        console.log('✅ Toate funcționalitățile pentru produse noi au fost inițializate cu interval 2 zile');
    }
    
    // CSS animații adăugate dinamic
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle-notification {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .produs-foarte-nou {
            position: relative;
        }
        
        .produs-foarte-nou::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #ff6b35, #ff8e53, #ff6b35);
            border-radius: 14px;
            z-index: -1;
            animation: gradient-rotate 3s linear infinite;
        }
        
        @keyframes gradient-rotate {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    
    // Start inițializare
    initializeAll();
    
    // Log pentru debugging
    console.log('🚀 Produse noi script complet încărcat cu interval 2 zile:', {
        carduri: carduri.length,
        butoane: butoaneAdaugaCos.length,
        imagini: imaginiProduse.length,
        sectiune: !!sectiuneProduse
    });
});