// produs.js - Script pentru pagina de produs

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script pagina produs incarcat");
    
    // Buton pentru afiSarea/ascunderea detaliilor
    const btnDetalii = document.querySelector('.btn-detalii');
    const detaliiProdus = document.querySelector('.detalii-produs');
    
    if (btnDetalii && detaliiProdus) {
        // IniTial butonul aratA "Ascunde detalii" deoarece detaliile sunt vizibile
        btnDetalii.textContent = 'Ascunde detalii';
        
        btnDetalii.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle clasa pentru afiSarea detaliilor
            detaliiProdus.classList.toggle('show-details');
            
            // VerificAm clasa pentru a determina dacA detaliile sunt afiSate
            if (detaliiProdus.classList.contains('show-details')) {
                btnDetalii.textContent = 'Ascunde detalii';
                // SetAm max-height pentru a permite afiSarea completA
                detaliiProdus.style.maxHeight = '1000px';
            } else {
                btnDetalii.textContent = 'AratA detalii';
                // SetAm max-height pentru a ascunde detaliile
                detaliiProdus.style.maxHeight = '0';
                detaliiProdus.style.padding = '0';
            }
            
            // AdaugA animaTie de pulsare pentru buton
            btnDetalii.classList.add('pulsating');
            setTimeout(() => {
                btnDetalii.classList.remove('pulsating');
            }, 500);
        });
    }
    
    // Buton pentru adAugare In coS
    const btnAdauga = document.querySelector('.btn-adauga');
    
    if (btnAdauga) {
        btnAdauga.addEventListener('click', function(e) {
            e.preventDefault();
            
            // ObTine ID-ul produsului din atributul data-id
            const idProdus = this.getAttribute('data-id');
            const numeProdus = document.querySelector('#art-produs h2').textContent;
            
            // SimulAm adAugarea In coS (aici ar trebui implementatA logica realA)
            console.log(`AdAugare produs In coS: ID=${idProdus}, Nume=${numeProdus}`);
            
            // AfiSAm un mesaj de confirmare
            const mesaj = `Produsul "${numeProdus}" a fost adAugat In coS!`;
            alert(mesaj);
            
            // AdaugA animaTie de pulsare pentru buton
            btnAdauga.classList.add('pulsating');
            setTimeout(() => {
                btnAdauga.classList.remove('pulsating');
            }, 500);
        });
    }
    
    // FuncTionalitate pentru imaginea produsului (zoom la click)
    const imagineProdus = document.querySelector('.imag-produs img');
    
    if (imagineProdus) {
        imagineProdus.addEventListener('click', function() {
            this.classList.toggle('zoom');
        });
    }
});