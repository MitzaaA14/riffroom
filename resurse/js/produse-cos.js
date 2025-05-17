/*
 * JAVASCRIPT PENTRU COSUL DE CUMPARATURI
 * Gestioneaza adaugarea produselor in cos
 */

document.addEventListener("DOMContentLoaded", function() {
    // SELECTARE ELEMENTE DOM
    const checkboxuriProduse = document.querySelectorAll(".select-cos");
    const btnAdaugaInCos = document.querySelectorAll(".selecteaza-cos");
    
    // Verificam daca exista un cos salvat in localStorage
    let cos = localStorage.getItem("cos");
    cos = cos ? JSON.parse(cos) : [];
    
    // FUNCTIE PENTRU ACTUALIZARE CONTOR COS
    function actualizeazaContorCos() {
        const contorCos = document.querySelector(".icon .fa-shopping-cart");
        
        if (contorCos) {
            // Daca avem produse in cos, adaugam un badge cu numarul lor
            if (cos.length > 0) {
                // Verificam daca exista deja un badge
                let badge = document.querySelector(".cos-badge");
                
                if (!badge) {
                    // Daca nu exista, cream unul nou
                    badge = document.createElement("span");
                    badge.classList.add("cos-badge");
                    contorCos.parentElement.appendChild(badge);
                }
                
                // Actualizam textul badge-ului
                badge.textContent = cos.length;
            } else {
                // Daca nu avem produse, eliminam badge-ul daca exista
                const badge = document.querySelector(".cos-badge");
                if (badge) {
                    badge.remove();
                }
            }
        }
    }
    
    // FUNCTIE PENTRU ADAUGARE PRODUS IN COS
    function adaugaInCos(id, checkbox) {
        // Verificam daca produsul este deja in cos
        const produsExistent = cos.find(produs => produs.id === id);
        
        if (produsExistent) {
            // Daca produsul este deja in cos si checkbox-ul este debifat, il eliminam
            if (!checkbox.checked) {
                cos = cos.filter(produs => produs.id !== id);
                afiseazaNotificare(`Produsul a fost eliminat din cos!`, "error");
            }
        } else {
            // Daca produsul nu este in cos si checkbox-ul este bifat, il adaugam
            if (checkbox.checked) {
                // Obtinem informatiile produsului
                const articolProdus = checkbox.closest(".produs");
                const numeProdus = articolProdus.querySelector(".val-nume").textContent;
                const pretProdus = parseFloat(articolProdus.querySelector(".val-pret").textContent);
                const imagineProdus = articolProdus.querySelector("figure img").getAttribute("src");
                
                // Adaugam produsul in cos
                cos.push({
                    id: id,
                    nume: numeProdus,
                    pret: pretProdus,
                    imagine: imagineProdus,
                    cantitate: 1
                });
                
                afiseazaNotificare(`Produsul "${numeProdus}" a fost adaugat in cos!`, "success");
            }
        }
        
        // Salvam cosul in localStorage
        localStorage.setItem("cos", JSON.stringify(cos));
        
        // Actualizam contorul din interfata
        actualizeazaContorCos();
    }
    
    // FUNCTIE PENTRU AFISARE NOTIFICARE
    function afiseazaNotificare(mesaj, tip) {
        // Cream div-ul pentru notificare
        const notificare = document.createElement("div");
        notificare.classList.add("notificare", `notificare-${tip}`);
        notificare.innerHTML = `<p>${mesaj}</p>`;
        
        // Stilizam notificarea
        notificare.style.position = "fixed";
        notificare.style.bottom = "20px";
        notificare.style.right = "20px";
        notificare.style.padding = "15px 20px";
        notificare.style.borderRadius = "6px";
        notificare.style.color = "#FFF";
        notificare.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        notificare.style.zIndex = "9999";
        notificare.style.maxWidth = "300px";
        notificare.style.transition = "opacity 0.3s ease";
        
        // Aplicam stiluri in functie de tip
        if (tip === "success") {
            notificare.style.backgroundColor = "#5CB85C";
        } else if (tip === "error") {
            notificare.style.backgroundColor = "#D9534F";
        }
        
        // Adaugam notificarea in pagina
        document.body.appendChild(notificare);
        
        // Eliminam notificarea dupa 3 secunde
        setTimeout(() => {
            notificare.style.opacity = "0";
            setTimeout(() => {
                notificare.remove();
            }, 300);
        }, 3000);
    }
    
    // INITIALIZARE CHECKBOXURI DIN COsUL EXISTENT
    function initCheckboxuriDinCos() {
        checkboxuriProduse.forEach(checkbox => {
            const idProdus = checkbox.value;
            const produsInCos = cos.find(produs => produs.id === idProdus);
            
            if (produsInCos) {
                checkbox.checked = true;
            }
        });
    }
    
    // ADAUGARE EVENIMENTE PENTRU CHECKBOXURI
    checkboxuriProduse.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const idProdus = this.value;
            adaugaInCos(idProdus, this);
        });
    });
    
    // ADAUGARE EVENIMENT PENTRU BUTONUL DIN PAGINA PRODUS
    const btnAdaugaProdus = document.querySelector(".btn-adauga-cos");
    if (btnAdaugaProdus) {
        btnAdaugaProdus.addEventListener("click", function() {
            // Obtinem ID-ul produsului din URL
            const url = window.location.pathname;
            const idProdus = url.substring(url.lastIndexOf('/') + 1);
            
            // Verificam daca produsul este deja in cos
            const produsExistent = cos.find(produs => produs.id === idProdus);
            
            if (produsExistent) {
                // Daca produsul exista deja, incrementam cantitatea
                produsExistent.cantitate += 1;
                afiseazaNotificare(`Cantitatea a fost actualizata: ${produsExistent.cantitate} bucati`, "success");
            } else {
                // Obtinem informatiile produsului
                const numeProdus = document.querySelector(".nume").textContent;
                const pretProdus = parseFloat(document.querySelector(".pret").textContent);
                const imagineProdus = document.querySelector(".imag-produs img").getAttribute("src");
                
                // Adaugam produsul in cos
                cos.push({
                    id: idProdus,
                    nume: numeProdus,
                    pret: pretProdus,
                    imagine: imagineProdus,
                    cantitate: 1
                });
                
                afiseazaNotificare(`Produsul "${numeProdus}" a fost adaugat in cos!`, "success");
            }
            
            // Salvam cosul in localStorage
            localStorage.setItem("cos", JSON.stringify(cos));
            
            // Actualizam contorul din interfata
            actualizeazaContorCos();
        });
    }
    
    // STILIZARE PENTRU BADGE-UL COSULUI
    const style = document.createElement("style");
    style.innerHTML = `
        .cos-badge {
            position: absolute;
            top: -10px;
            right: -10px;
            background-color: #D9534F;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .icon {
            position: relative;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
    
    // Initializare la incarcarea paginii
    initCheckboxuriDinCos();
    actualizeazaContorCos();
});