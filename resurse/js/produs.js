// produs.js - Script pentru pagina de produs

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script pagina produs incarcat");
    
    // Functionalitate pentru imaginea produsului (zoom la click)
    const imagineProdus = document.querySelector('.imag-produs img');
    
    if (imagineProdus) {
        imagineProdus.addEventListener('click', function() {
            this.classList.toggle('zoom');
            
            if (this.classList.contains('zoom')) {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
                this.style.transition = 'transform 0.3s ease';
                this.style.zIndex = '100';
                this.style.position = 'relative';
            } else {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
                this.style.zIndex = '1';
                this.style.position = 'static';
            }
        });
        
        // Adaugam cursor zoom-in initial
        imagineProdus.style.cursor = 'zoom-in';
    }
    
    // Event listener pentru butonul de adaugare in cos
    const btnAdaugaCos = document.querySelector('.btn-adauga-cos');
    
    if (btnAdaugaCos) {
        btnAdaugaCos.addEventListener('click', function() {
            // Animatie pentru buton
            this.classList.add('pulsating');
            
            // Efecte vizuale pentru feedback
            this.style.transform = 'scale(0.95)';
            this.style.backgroundColor = '#C05F3E';
            
            setTimeout(() => {
                this.classList.remove('pulsating');
                this.style.transform = 'scale(1)';
                this.style.backgroundColor = '#6B3E31';
                
                // Mesaj de confirmare
                showNotification('Produs adaugat in cos!', 'success');
            }, 200);
        });
    }
    
    // Event listeners pentru butoanele de adaugare set in cos
    const btnsAdaugaSet = document.querySelectorAll('.btn-add-set-to-cart');
    
    if (btnsAdaugaSet.length > 0) {
        btnsAdaugaSet.forEach(btn => {
            btn.addEventListener('click', function() {
                // Animatie pentru buton
                this.classList.add('pulsating');
                this.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.classList.remove('pulsating');
                    this.style.transform = 'scale(1)';
                    showNotification('Set adaugat in cos!', 'success');
                }, 200);
            });
        });
    }
    
    // BONUS 16: Efecte de animatie pentru cardurile de produse similare
    const cardurileProduseSimile = document.querySelectorAll('.card-produs-similar');
    
    if (cardurileProduseSimile.length > 0) {
        cardurileProduseSimile.forEach((card, index) => {
            // Animatie de aparitie cu delay
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
            
            // Efecte la hover
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.2)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                // Animatie pentru imaginea din card
                const img = this.querySelector('.imagine-similar img');
                if (img) {
                    img.style.transform = 'scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                
                // Reset animatie imagine
                const img = this.querySelector('.imagine-similar img');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // Efecte de animatie pentru cardurile de seturi
    const setCards = document.querySelectorAll('.set-card-small, .set-box');
    
    if (setCards.length > 0) {
        setCards.forEach((card, index) => {
            // Animatie de aparitie
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            });
        });
    }
    
    // BONUS 16: Functionalitate pentru scroll smooth catre produse similare
    const linkuriProduseSimile = document.querySelectorAll('.btn-vezi-toate-similare, .btn-vezi-similare');
    
    linkuriProduseSimile.forEach(link => {
        link.addEventListener('click', function(e) {
            // Adaugam un efect de loading
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se incarca...';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
    
    // BONUS 18: Verificare si afisare marcaj produs nou
    function checkAndDisplayNewProductBadge() {
        const badgeNou = document.querySelector('.badge-nou');
        if (badgeNou) {
            // Adaugam o animatie speciala pentru badge-ul nou
            badgeNou.style.animation = 'pulse-nou-badge 2s infinite';
            
            // Afisam o notificare ca produsul este nou
            setTimeout(() => {
                showNotification('🌟 Acest produs este nou pe site!', 'info', 3000);
            }, 1000);
        }
    }
    
    // BONUS 12.4: Verificare si afisare notificare pentru produse cu oferta
    function checkAndDisplayOfferBadge() {
        const ofertaContainer = document.querySelector('.pret-oferta-container');
        if (ofertaContainer) {
            // Adaugam o animatie speciala pentru containerul ofertei
            ofertaContainer.style.animation = 'pulse-oferta 2s infinite';
            
            // Afisam o notificare ca produsul este la oferta
            setTimeout(() => {
                const badgeOferta = ofertaContainer.querySelector('.badge-oferta');
                if (badgeOferta) {
                    const reducere = badgeOferta.textContent;
                    showNotification(`🔥 Acest produs este la oferta cu ${reducere} reducere!`, 'success', 4000);
                }
            }, 1500);
        }
    }
    
    // Functie pentru afisarea notificarilor
    function showNotification(message, type = 'info', duration = 2000) {
        // Eliminam notificarea existenta daca exista
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = message;
        
        // Stilizare notificare
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '10000';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Culori in functie de tip
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#5CB85C';
                notification.style.color = 'white';
                break;
            case 'info':
                notification.style.backgroundColor = '#5BC0DE';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.backgroundColor = '#F0AD4E';
                notification.style.color = 'white';
                break;
            default:
                notification.style.backgroundColor = '#6B3E31';
                notification.style.color = '#F7F3E8';
        }
        
        document.body.appendChild(notification);
        
        // Animatie de aparitie
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Eliminare automata
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
    
    // Functionalitate pentru smooth scroll catre sectiuni
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Functionalitate pentru lazy loading imagini in produse similare
    function initLazyLoading() {
        const images = document.querySelectorAll('.imagine-similar img, .set-image img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Functionalitate pentru animatia tabelului cu specificatii
    function initTableAnimations() {
        const table = document.querySelector('.detalii-tehnice table');
        if (table) {
            const rows = table.querySelectorAll('tr');
            
            rows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }
    }
    
    // Functionalitate pentru animatia caracteristicilor
    function initCharacteristicsAnimation() {
        const caracteristici = document.querySelectorAll('.caracteristici-lista li');
        
        caracteristici.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, index * 50);
        });
    }
    
    // BONUS 12.4: Animatii speciale pentru produsele cu oferta
    function initOfferAnimations() {
        const pretOferta = document.querySelectorAll('.pret-nou');
        pretOferta.forEach(pret => {
            pret.style.animation = 'glow-pret 2s ease-in-out infinite alternate';
        });
        
        const badgeOferta = document.querySelectorAll('.badge-oferta');
        badgeOferta.forEach(badge => {
            badge.style.animation = 'pulse-badge-oferta 1.5s ease-in-out infinite';
        });
    }
    
    // Adaugam CSS pentru animatii oferta
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-oferta {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.4); }
            50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(255, 107, 53, 0); }
        }
        
        @keyframes glow-pret {
            0% { text-shadow: 0 0 5px rgba(255, 107, 53, 0.5); }
            100% { text-shadow: 0 0 20px rgba(255, 107, 53, 0.8), 0 0 30px rgba(255, 107, 53, 0.6); }
        }
        
        @keyframes pulse-badge-oferta {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
    
    // Initializare functionalitati
    initSmoothScroll();
    initLazyLoading();
    initTableAnimations();
    initCharacteristicsAnimation();
    initOfferAnimations();
    checkAndDisplayNewProductBadge();
    checkAndDisplayOfferBadge();
    
    // Animatie pentru container-ul principal
    const produsContainer = document.querySelector('.produs-container');
    if (produsContainer) {
        produsContainer.style.opacity = '0';
        produsContainer.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            produsContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            produsContainer.style.opacity = '1';
            produsContainer.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // BONUS 12.4: Efecte speciale pentru hover pe preturile cu oferta
    const preturiCuOferta = document.querySelectorAll('.pret-oferta-container');
    preturiCuOferta.forEach(pretContainer => {
        pretContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
            
            const pretNou = this.querySelector('.pret-nou');
            if (pretNou) {
                pretNou.style.fontSize = '2rem';
                pretNou.style.transition = 'font-size 0.3s ease';
            }
        });
        
        pretContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            
            const pretNou = this.querySelector('.pret-nou');
            if (pretNou) {
                pretNou.style.fontSize = '1.8rem';
            }
        });
    });
    
    // Log pentru debugging
    console.log("Functionalitati produs initializate:", {
        imagineProdus: !!imagineProdus,
        btnAdaugaCos: !!btnAdaugaCos,
        cardurileProduseSimile: cardurileProduseSimile.length,
        setCards: setCards.length,
        badgeNou: !!document.querySelector('.badge-nou'),
        ofertaContainer: !!document.querySelector('.pret-oferta-container')
    });
});