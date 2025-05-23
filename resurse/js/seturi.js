// seturi.js - Script pentru funcționalitatea seturilor

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script seturi incarcat");
    
    // Buton pentru adaugare set in cos
    const btnAdaugaSet = document.querySelector('.btn-add-to-cart');
    
    if (btnAdaugaSet) {
        btnAdaugaSet.addEventListener('click', function() {
            // Obtinem ID-ul setului din URL
            const urlPath = window.location.pathname;
            const idSet = urlPath.split('/').pop();
            
            // Simulam adaugarea in cos
            console.log(`Adaugare set in cos: ID=${idSet}`);
            
            // Afisam mesaj de confirmare
            const numeSet = document.querySelector('.set-detail-header h2').textContent;
            alert(`Setul "${numeSet}" a fost adaugat in cos!`);
            
            // Animatie pentru buton
            btnAdaugaSet.classList.add('pulsating');
            setTimeout(() => {
                btnAdaugaSet.classList.remove('pulsating');
            }, 500);
        });
    }
    
    // Efect hover pentru imaginile produselor
    const produsImagini = document.querySelectorAll('.product-card .product-image img');
    
    if (produsImagini.length > 0) {
        produsImagini.forEach(imagine => {
            imagine.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            imagine.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Efect la hover pentru cardurile de set pe pagina de seturi
    const setCards = document.querySelectorAll('.set-card, .set-card-small');
    
    if (setCards.length > 0) {
        setCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
            });
        });
    }
    
    // Animatie de highlight pentru pretul cu reducere
    const discountPrices = document.querySelectorAll('.discount-price');
    
    if (discountPrices.length > 0) {
        discountPrices.forEach(price => {
            // Optional - adaugam o animatie subtila pentru pretul cu reducere
            price.addEventListener('mouseenter', function() {
                this.style.color = '#C05F3E';
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'color 0.3s ease, transform 0.3s ease';
            });
            
            price.addEventListener('mouseleave', function() {
                this.style.color = '';
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Efect hover pentru cardurile de set simplificate (nou adaugat)
    const setBoxes = document.querySelectorAll('.set-box');
    
    if (setBoxes.length > 0) {
        console.log("Initializare efecte pentru", setBoxes.length, "carduri de set simplificate");
        
        // Adaugam efecte hover pentru fiecare card
        setBoxes.forEach(box => {
            box.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
            
            box.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
            });
            
            // Adaugam efect pentru imagine la hover
            const imagine = box.querySelector('.set-image img');
            if (imagine) {
                imagine.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                imagine.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            }
            
            // Adaugam efect pentru buton la hover
            const buton = box.querySelector('.btn-view-set');
            if (buton) {
                buton.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
                });
                
                buton.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            }
        });
    }
    
    // Buton pentru produse din seturile simplificate
    const produsButoane = document.querySelectorAll('.set-box .product-link');
    
    if (produsButoane.length > 0) {
        produsButoane.forEach(buton => {
            buton.addEventListener('click', function(e) {
                e.stopPropagation(); // Previne declansarea click-ului pe card
            });
        });
    }
});