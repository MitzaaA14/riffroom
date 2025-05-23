// produse-cos.js - Script pentru funcționalitatea coșului de cumpărături

document.addEventListener("DOMContentLoaded", function() {
    console.log("Script coș de cumpărături încărcat");
    
    // Inițializare
    initializareCos();
    
    // Funcția principală de inițializare a coșului
    function initializareCos() {
        // Inițializare variabile
        let cos = getCos();
        
        // Inițializare interfață
        initInterfataCos();
        
        // Adăugare event listeners pentru butoane
        adaugaEventListeners();
        
        // Actualizare contor coș
        actualizeazaContorCos();
        
        // Inițializare checkboxuri din coșul existent (pentru pagina de produse)
        initCheckboxuriDinCos();
    }
    
    // Funcție pentru a obține coșul din localStorage
    function getCos() {
        let cos = localStorage.getItem("cos");
        return cos ? JSON.parse(cos) : [];
    }
    
    // Funcție pentru a salva coșul în localStorage
    function salveazaCos(cos) {
        localStorage.setItem("cos", JSON.stringify(cos));
    }
    
    // Funcție pentru inițializarea interfeței coșului
    function initInterfataCos() {
        // Verificăm dacă există containerul coșului în pagină
        if (!document.getElementById('container-cos')) {
            // Creăm fundalul
            const fundalCos = document.createElement('div');
            fundalCos.id = 'container-cos-fundal';
            fundalCos.className = 'container-cos-fundal';
            document.body.appendChild(fundalCos);
            
            // Creăm containerul coșului
            const containerCos = document.createElement('div');
            containerCos.id = 'container-cos';
            containerCos.className = 'container-cos';
            document.body.appendChild(containerCos);
            
            // Adăugăm event listener pentru fundal
            fundalCos.addEventListener('click', function() {
                ascundeCos();
            });
        }
    }
    
    // Funcție pentru actualizarea contorului coșului
    function actualizeazaContorCos() {
        const cos = getCos();
        const contorCos = document.querySelector(".icon .fa-shopping-cart");
        
        if (contorCos) {
            // Calculăm numărul total de produse (cantitate)
            const totalProduse = cos.reduce((total, item) => total + item.cantitate, 0);
            
            // Dacă avem produse în coș, adăugăm un badge cu numărul lor
            if (totalProduse > 0) {
                // Verificăm dacă există deja un badge
                let badge = document.querySelector(".cos-badge");
                
                if (!badge) {
                    // Dacă nu există, creăm unul nou
                    badge = document.createElement("span");
                    badge.classList.add("cos-badge");
                    contorCos.parentElement.appendChild(badge);
                    
                    // Adăugăm event listener pentru click pe iconul coșului
                    contorCos.parentElement.addEventListener('click', function(e) {
                        e.preventDefault();
                        afiseazaCos();
                    });
                }
                
                // Actualizăm textul badge-ului
                badge.textContent = totalProduse;
            } else {
                // Dacă nu avem produse, eliminăm badge-ul dacă există
                const badge = document.querySelector(".cos-badge");
                if (badge) {
                    badge.remove();
                }
            }
        }
    }
    
    // Funcție pentru afișarea coșului
    function afiseazaCos() {
        const cos = getCos();
        const containerCos = document.getElementById('container-cos');
        const fundalCos = document.getElementById('container-cos-fundal');
        
        if (!containerCos || !fundalCos) return;
        
        // Construim conținutul coșului
        let continutCos = `
            <h2>Coșul meu de cumpărături</h2>
        `;
        
        if (cos.length === 0) {
            continutCos += `
                <div class="cos-gol">
                    <p>Coșul dumneavoastră este gol.</p>
                    <p>Adăugați produse pentru a continua cumpărăturile.</p>
                </div>
                <div class="cos-butoane">
                    <button id="btn-cos-inchide" class="btn-cos-inchide">Închide</button>
                </div>
            `;
        } else {
            // Calculăm totalul
            let total = cos.reduce((sum, item) => sum + (item.pret * item.cantitate), 0);
            
            continutCos += `
                <ul class="lista-produse-cos">
            `;
            
            cos.forEach(item => {
                // Determinăm tipul (produs sau set)
                const tipText = item.tip === 'set' ? 'Set' : 'Produs';
                
                continutCos += `
                    <li class="produs-cos" data-id="${item.id}" data-tip="${item.tip}">
                        <img src="${item.imagine}" alt="${item.nume}" class="imagine-produs-cos">
                        <div class="info-produs-cos">
                            <p class="nume-produs-cos">${item.nume}</p>
                            <p class="tip-produs-cos">${tipText}</p>
                            <p class="pret-produs-cos">${item.pret} RON</p>
                        </div>
                        <div class="cantitate-produs-cos">
                            <button class="btn-cantitate btn-minus" data-id="${item.id}" data-tip="${item.tip}">-</button>
                            <span>${item.cantitate}</span>
                            <button class="btn-cantitate btn-plus" data-id="${item.id}" data-tip="${item.tip}">+</button>
                        </div>
                        <button class="btn-sterge-cos" data-id="${item.id}" data-tip="${item.tip}">sterge</button>
                    </li>
                `;
            });
            
            continutCos += `
                </ul>
                <div class="cos-total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)} RON</span>
                </div>
                <div class="cos-butoane">
                    <button id="btn-cos-inchide" class="btn-cos-inchide">Închide</button>
                    <button id="btn-cos-continua-cumparaturi" class="btn-cos-continua-cumparaturi">Continuă cumpărăturile</button>
                    <button id="btn-cos-finalizeaza" class="btn-cos-finalizeaza">Finalizează comanda</button>
                </div>
            `;
        }
        
        // Actualizăm conținutul containerului
        containerCos.innerHTML = continutCos;
        
        // Adăugăm event listeners pentru butoane
        containerCos.querySelector('#btn-cos-inchide').addEventListener('click', ascundeCos);
        
        if (cos.length > 0) {
            containerCos.querySelector('#btn-cos-continua-cumparaturi').addEventListener('click', ascundeCos);
            containerCos.querySelector('#btn-cos-finalizeaza').addEventListener('click', finalizeazaComanda);
            
            // Event listeners pentru butoanele de cantitate și ștergere
            containerCos.querySelectorAll('.btn-minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const tip = this.getAttribute('data-tip');
                    actualizeazaCantitateItem(id, tip, -1);
                });
            });
            
            containerCos.querySelectorAll('.btn-plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const tip = this.getAttribute('data-tip');
                    actualizeazaCantitateItem(id, tip, 1);
                });
            });
            
            containerCos.querySelectorAll('.btn-sterge-cos').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const tip = this.getAttribute('data-tip');
                    stergeItem(id, tip);
                });
            });
        }
        
        // Afișăm containerul și fundalul
        fundalCos.style.display = 'block';
        containerCos.style.display = 'block';
        
        // Adăugăm o mică animație de intrare
        setTimeout(function() {
            containerCos.style.opacity = '1';
            containerCos.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }
    
    // Funcție pentru finalizarea comenzii
    function finalizeazaComanda() {
        afiseazaNotificare("Comanda a fost plasată cu succes! Mulțumim pentru achiziție.", "success");
        
        // Golim coșul
        salveazaCos([]);
        actualizeazaContorCos();
        
        // Ascundem coșul
        ascundeCos();
        
        // Resetăm checkboxurile
        const checkboxuriProduse = document.querySelectorAll(".select-cos");
        checkboxuriProduse.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    // Funcție pentru ascunderea coșului
    function ascundeCos() {
        const containerCos = document.getElementById('container-cos');
        const fundalCos = document.getElementById('container-cos-fundal');
        
        if (containerCos && fundalCos) {
            // Ascundem containerul și fundalul cu animație
            containerCos.style.opacity = '0';
            containerCos.style.transform = 'translate(-50%, -50%) scale(0.95)';
            fundalCos.style.opacity = '0';
            
            // După ce animația se încheie, ascundem complet elementele
            setTimeout(function() {
                containerCos.style.display = 'none';
                fundalCos.style.display = 'none';
                containerCos.style.opacity = '1';
                containerCos.style.transform = 'translate(-50%, -50%) scale(1)';
                fundalCos.style.opacity = '1';
            }, 300);
        }
    }
    
    // Funcție pentru actualizarea cantității unui item (produs sau set)
    function actualizeazaCantitateItem(id, tip, delta) {
        let cos = getCos();
        
        const itemIndex = cos.findIndex(item => item.id === id && item.tip === tip);
        
        if (itemIndex !== -1) {
            cos[itemIndex].cantitate += delta;
            
            // Verificăm dacă cantitatea a ajuns la 0
            if (cos[itemIndex].cantitate <= 0) {
                stergeItem(id, tip);
                return;
            }
            
            // Salvăm coșul actualizat și reafișăm
            salveazaCos(cos);
            actualizeazaContorCos();
            afiseazaCos();
            
            // Afișăm notificare
            afiseazaNotificare(`Cantitate actualizată: ${cos[itemIndex].cantitate} bucăți`, "success");
        }
    }
    
    // Funcție pentru ștergerea unui item (produs sau set)
    function stergeItem(id, tip) {
        let cos = getCos();
        
        // Găsim itemul pentru a afișa notificarea
        const item = cos.find(i => i.id === id && i.tip === tip);
        
        // Filtrăm lista pentru a elimina itemul
        cos = cos.filter(i => !(i.id === id && i.tip === tip));
        
        // Salvăm coșul actualizat
        salveazaCos(cos);
        actualizeazaContorCos();
        
        // Dacă suntem în containerul coșului, reafișăm
        if (document.getElementById('container-cos').style.display === 'block') {
            afiseazaCos();
        }
        
        // Debifăm checkbox-ul pentru produs (dacă există)
        if (tip === 'produs') {
            const checkbox = document.querySelector(`.select-cos[value="${id}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
        
        // Afișăm notificare
        if (item) {
            afiseazaNotificare(`"${item.nume}" a fost eliminat din coș!`, "error");
        }
    }
    
    // Inițializare checkboxuri din coșul existent
    function initCheckboxuriDinCos() {
        const cos = getCos();
        const checkboxuriProduse = document.querySelectorAll(".select-cos");
        
        checkboxuriProduse.forEach(checkbox => {
            const idProdus = checkbox.value;
            const produsInCos = cos.find(item => item.id === idProdus && item.tip === 'produs');
            
            if (produsInCos) {
                checkbox.checked = true;
            }
        });
    }
    
    // Adăugare event listeners
    function adaugaEventListeners() {
        // Event listeners pentru checkboxuri (pe pagina de produse)
        const checkboxuriProduse = document.querySelectorAll(".select-cos");
        checkboxuriProduse.forEach(checkbox => {
            checkbox.addEventListener("change", function() {
                const idProdus = this.value;
                adaugaInCos(idProdus, this);
            });
        });
        
        // Event listener pentru butonul de coș din header
        const btnCos = document.querySelector(".icon .fa-shopping-cart");
        if (btnCos) {
            btnCos.parentElement.addEventListener('click', function(e) {
                e.preventDefault();
                afiseazaCos();
            });
        }
        
        // Event listener pentru butonul din pagina produs
        const btnAdaugaProdus = document.querySelector(".btn-adauga-cos");
        if (btnAdaugaProdus) {
            btnAdaugaProdus.addEventListener("click", function() {
                adaugaProdusInPaginaProdus();
            });
        }
        
        // Event listener pentru butonul din pagina set
        const btnAdaugaSet = document.querySelector(".btn-add-to-cart");
        if (btnAdaugaSet) {
            btnAdaugaSet.addEventListener("click", function() {
                adaugaSetInPaginaSet();
            });
        }
        
        // Event listeners pentru butoanele de adăugare set din alte pagini
        const btnsAdaugaSet = document.querySelectorAll('.btn-add-set-to-cart');
        if (btnsAdaugaSet.length > 0) {
            btnsAdaugaSet.forEach(btn => {
                btn.addEventListener('click', function() {
                    const idSet = this.getAttribute('data-id');
                    const numeSet = this.getAttribute('data-nume');
                    const pretSet = parseFloat(this.getAttribute('data-pret'));
                    const imagineSet = this.getAttribute('data-imagine');
                    
                    adaugaSetInCos(idSet, numeSet, pretSet, imagineSet);
                });
            });
        }
        
        // Event listeners pentru butoanele de adăugare produs individual din set
        const btnsAdaugaProdusIndividual = document.querySelectorAll('.btn-add-single-product');
        if (btnsAdaugaProdusIndividual.length > 0) {
            btnsAdaugaProdusIndividual.forEach(btn => {
                btn.addEventListener('click', function() {
                    const idProdus = this.getAttribute('data-id');
                    const numeProdus = this.getAttribute('data-nume');
                    const pretProdus = parseFloat(this.getAttribute('data-pret'));
                    const imagineProdus = this.getAttribute('data-imagine');
                    
                    adaugaProdusIndividualInCos(idProdus, numeProdus, pretProdus, imagineProdus);
                });
            });
        }
    }
    
    // Funcție pentru adăugarea unui produs în coș din pagina de listă
    function adaugaInCos(idProdus, checkbox) {
        let cos = getCos();
        
        // Verificăm dacă produsul este deja în coș
        const produsExistent = cos.find(item => item.id === idProdus && item.tip === 'produs');
        
        if (produsExistent) {
            // Dacă produsul este deja în coș și checkbox-ul este debifat, îl eliminăm
            if (!checkbox.checked) {
                cos = cos.filter(item => !(item.id === idProdus && item.tip === 'produs'));
                afiseazaNotificare(`Produsul a fost eliminat din coș!`, "error");
            }
        } else {
            // Dacă produsul nu este în coș și checkbox-ul este bifat, îl adăugăm
            if (checkbox.checked) {
                // Obținem informațiile produsului
                const articolProdus = checkbox.closest(".produs");
                const numeProdus = articolProdus.querySelector(".val-nume").textContent;
                const pretProdus = parseFloat(articolProdus.querySelector(".val-pret").textContent);
                const imagineProdus = articolProdus.querySelector("figure img").getAttribute("src");
                
                // Adăugăm produsul în coș
                cos.push({
                    id: idProdus,
                    nume: numeProdus,
                    pret: pretProdus,
                    imagine: imagineProdus,
                    cantitate: 1,
                    tip: 'produs'
                });
                
                afiseazaNotificare(`Produsul "${numeProdus}" a fost adăugat în coș!`, "success");
            }
        }
        
        // Salvăm coșul în localStorage
        salveazaCos(cos);
        
        // Actualizăm contorul din interfață
        actualizeazaContorCos();
    }
    
    // Funcție pentru adăugarea unui produs în coș din pagina de produs individual
    function adaugaProdusInPaginaProdus() {
        let cos = getCos();
        
        // Obținem ID-ul produsului din URL
        const url = window.location.pathname;
        const idProdus = url.substring(url.lastIndexOf('/') + 1);
        
        // Verificăm dacă produsul este deja în coș
        const produsExistent = cos.find(item => item.id === idProdus && item.tip === 'produs');
        
        if (produsExistent) {
            // Dacă produsul există deja, incrementăm cantitatea
            produsExistent.cantitate += 1;
            afiseazaNotificare(`Cantitatea a fost actualizată: ${produsExistent.cantitate} bucăți`, "success");
        } else {
            // Obținem informațiile produsului
            const numeProdus = document.querySelector(".nume").textContent;
            const pretText = document.querySelector(".pret").textContent;
            const pretProdus = parseFloat(pretText.replace(/[^\d.-]/g, ''));
            const imagineProdus = document.querySelector(".imag-produs img").getAttribute("src");
            
            // Adăugăm produsul în coș
            cos.push({
                id: idProdus,
                nume: numeProdus,
                pret: pretProdus,
                imagine: imagineProdus,
                cantitate: 1,
                tip: 'produs'
            });
            
            afiseazaNotificare(`Produsul "${numeProdus}" a fost adăugat în coș!`, "success");
        }
        
        // Salvăm coșul în localStorage
        salveazaCos(cos);
        
        // Actualizăm contorul din interfață
        actualizeazaContorCos();
    }
    
    // Funcție pentru adăugarea unui produs individual din pagina de set
    function adaugaProdusIndividualInCos(idProdus, numeProdus, pretProdus, imagineProdus) {
        let cos = getCos();
        
        // Verificăm dacă produsul este deja în coș
        const produsExistent = cos.find(item => item.id === idProdus && item.tip === 'produs');
        
        if (produsExistent) {
            // Dacă produsul există deja, incrementăm cantitatea
            produsExistent.cantitate += 1;
            afiseazaNotificare(`Cantitatea a fost actualizată: ${produsExistent.cantitate} bucăți`, "success");
        } else {
            // Adăugăm produsul în coș
            cos.push({
                id: idProdus,
                nume: numeProdus,
                pret: pretProdus,
                imagine: `/resurse/imagini/produse/${imagineProdus}`,
                cantitate: 1,
                tip: 'produs'
            });
            
            afiseazaNotificare(`Produsul "${numeProdus}" a fost adăugat în coș!`, "success");
        }
        
        // Salvăm coșul în localStorage
        salveazaCos(cos);
        
        // Actualizăm contorul din interfață
        actualizeazaContorCos();
    }
    
    // Funcție pentru adăugarea unui set în coș din pagina de set individual
    function adaugaSetInPaginaSet() {
        let cos = getCos();
        
        // Obținem ID-ul setului din URL
        const url = window.location.pathname;
        const idSet = url.substring(url.lastIndexOf('/') + 1);
        
        // Verificăm dacă setul este deja în coș
        const setExistent = cos.find(item => item.id === idSet && item.tip === 'set');
        
        if (setExistent) {
            // Dacă setul există deja, incrementăm cantitatea
            setExistent.cantitate += 1;
            afiseazaNotificare(`Cantitatea a fost actualizată: ${setExistent.cantitate} bucăți`, "success");
        } else {
            // Obținem informațiile setului
            const numeSet = document.querySelector(".set-detail-header h2").textContent;
            const pretSetText = document.querySelector(".discount-price").textContent;
            const pretSet = parseFloat(pretSetText.replace(/[^\d.-]/g, ''));
            const imagineSet = document.querySelector(".product-card:first-child .product-image img").getAttribute("src");
            
            // Adăugăm setul în coș
            cos.push({
                id: idSet,
                nume: numeSet,
                pret: pretSet,
                imagine: imagineSet,
                cantitate: 1,
                tip: 'set'
            });
            
            afiseazaNotificare(`Setul "${numeSet}" a fost adăugat în coș!`, "success");
        }
        
        // Salvăm coșul în localStorage
        salveazaCos(cos);
        
        // Actualizăm contorul din interfață
        actualizeazaContorCos();
    }
    
    // Funcție pentru adăugarea unui set în coș din alte pagini
    function adaugaSetInCos(idSet, numeSet, pretSet, imagineSet) {
        let cos = getCos();
        
        // Verificăm dacă setul este deja în coș
        const setExistent = cos.find(item => item.id === idSet && item.tip === 'set');
        
        if (setExistent) {
            // Dacă setul există deja, incrementăm cantitatea
            setExistent.cantitate += 1;
            afiseazaNotificare(`Cantitatea pentru "${numeSet}" a fost actualizată: ${setExistent.cantitate} bucăți`, "success");
        } else {
            // Adăugăm setul în coș
            cos.push({
                id: idSet,
                nume: numeSet,
                pret: pretSet,
                imagine: `/resurse/imagini/produse/${imagineSet}`,
                cantitate: 1,
                tip: 'set'
            });
            
            afiseazaNotificare(`Setul "${numeSet}" a fost adăugat în coș!`, "success");
        }
        
        // Salvăm coșul în localStorage
        salveazaCos(cos);
        
        // Actualizăm contorul din interfață
        actualizeazaContorCos();
    }
    
    // Funcție pentru afișarea notificărilor
    function afiseazaNotificare(mesaj, tip) {
        // Verificăm dacă există deja o notificare
        let notificareExistenta = document.querySelector('.notificare');
        if (notificareExistenta) {
            notificareExistenta.remove();
        }
        
        // Creăm div-ul pentru notificare
        const notificare = document.createElement("div");
        notificare.classList.add("notificare", `notificare-${tip}`);
        notificare.innerHTML = `<p>${mesaj}</p>`;
        
        // Adăugăm notificarea în pagină
        document.body.appendChild(notificare);
        
        // Eliminăm notificarea după 3 secunde
        setTimeout(() => {
            notificare.style.opacity = "0";
            setTimeout(() => {
                notificare.remove();
            }, 300);
        }, 3000);
    }
});