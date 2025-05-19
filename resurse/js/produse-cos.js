document.addEventListener("DOMContentLoaded", function() {
    console.log("Script cos de cumparaturi incarcat");
    
    // Initializare
    initializareCos();
    
    // Functia principala de initializare a cosului
    function initializareCos() {
        // Initializare variabile
        let cos = getCos();
        
        // Initializare interfata
        initInterfataCos();
        
        // Adaugare event listeners pentru butoane si checkboxuri
        adaugaEventListeners();
        
        // Actualizare contor cos
        actualizeazaContorCos();
        
        // Initializare checkboxuri din cosul existent
        initCheckboxuriDinCos();
    }
    
    // Functie pentru a obtine cosul din localStorage
    function getCos() {
        let cos = localStorage.getItem("cos");
        return cos ? JSON.parse(cos) : [];
    }
    
    // Functie pentru a salva cosul în localStorage
    function salveazaCos(cos) {
        localStorage.setItem("cos", JSON.stringify(cos));
    }
    
    // Functie pentru initializarea interfetei cosului
    function initInterfataCos() {
        // Verificam daca exista containerul cosului în pagina
        if (!document.getElementById('container-cos')) {
            // Cream fundalul
            const fundalCos = document.createElement('div');
            fundalCos.id = 'container-cos-fundal';
            fundalCos.className = 'container-cos-fundal';
            document.body.appendChild(fundalCos);
            
            // Cream containerul cosului
            const containerCos = document.createElement('div');
            containerCos.id = 'container-cos';
            containerCos.className = 'container-cos';
            document.body.appendChild(containerCos);
            
            // Adaugam event listener pentru fundal
            fundalCos.addEventListener('click', function() {
                ascundeCos();
            });
        }
    }
    
    // Functie pentru actualizarea contorului cosului
    function actualizeazaContorCos() {
        const cos = getCos();
        const contorCos = document.querySelector(".icon .fa-shopping-cart");
        
        if (contorCos) {
            // Daca avem produse în cos, adaugam un badge cu numarul lor
            if (cos.length > 0) {
                // Verificam daca exista deja un badge
                let badge = document.querySelector(".cos-badge");
                
                if (!badge) {
                    // Daca nu exista, cream unul nou
                    badge = document.createElement("span");
                    badge.classList.add("cos-badge");
                    contorCos.parentElement.appendChild(badge);
                    
                    // Adaugam event listener pentru click pe iconul cosului
                    contorCos.parentElement.addEventListener('click', function(e) {
                        e.preventDefault();
                        afiseazaCos();
                    });
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
    
    // Functie pentru afisarea cosului
    function afiseazaCos() {
        const cos = getCos();
        const containerCos = document.getElementById('container-cos');
        const fundalCos = document.getElementById('container-cos-fundal');
        
        if (!containerCos || !fundalCos) return;
        
        // Construim continutul cosului
        let continutCos = `
            <h2>Cosul meu de cumparaturi</h2>
        `;
        
        if (cos.length === 0) {
            continutCos += `
                <div class="cos-gol">
                    <p>Cosul dumneavoastra este gol.</p>
                    <p>Adaugati produse pentru a continua cumparaturile.</p>
                </div>
                <div class="cos-butoane">
                    <button id="btn-cos-inchide" class="btn-cos-inchide">Închide</button>
                </div>
            `;
        } else {
            // Calculam totalul
            let total = cos.reduce((sum, produs) => sum + (produs.pret * produs.cantitate), 0);
            
            continutCos += `
                <ul class="lista-produse-cos">
            `;
            
            cos.forEach(produs => {
                continutCos += `
                    <li class="produs-cos" data-id="${produs.id}">
                        <img src="${produs.imagine}" alt="${produs.nume}" class="imagine-produs-cos">
                        <div class="info-produs-cos">
                            <p class="nume-produs-cos">${produs.nume}</p>
                            <p class="pret-produs-cos">${produs.pret} RON</p>
                        </div>
                        <div class="cantitate-produs-cos">
                            <button class="btn-cantitate btn-minus" data-id="${produs.id}">-</button>
                            <span>${produs.cantitate}</span>
                            <button class="btn-cantitate btn-plus" data-id="${produs.id}">+</button>
                        </div>
                        <button class="btn-sterge-cos" data-id="${produs.id}">sterge</button>
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
                    <button id="btn-cos-continua-cumparaturi" class="btn-cos-continua-cumparaturi">Continua cumparaturile</button>
                    <button id="btn-cos-finalizeaza" class="btn-cos-finalizeaza">Finalizeaza comanda</button>
                </div>
            `;
        }
        
        // Actualizam continutul containerului
        containerCos.innerHTML = continutCos;
        
        // Adaugam event listeners pentru butoane
        containerCos.querySelector('#btn-cos-inchide').addEventListener('click', ascundeCos);
        
        if (cos.length > 0) {
            containerCos.querySelector('#btn-cos-continua-cumparaturi').addEventListener('click', ascundeCos);
            
            // Event listeners pentru butoanele de cantitate si stergere
            containerCos.querySelectorAll('.btn-minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    actualizeazaCantitateProdus(this.getAttribute('data-id'), -1);
                });
            });
            
            containerCos.querySelectorAll('.btn-plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    actualizeazaCantitateProdus(this.getAttribute('data-id'), 1);
                });
            });
            
            containerCos.querySelectorAll('.btn-sterge-cos').forEach(btn => {
                btn.addEventListener('click', function() {
                    stergeProdus(this.getAttribute('data-id'));
                });
            });
        }
        
        // Afisam containerul si fundalul
        fundalCos.style.display = 'block';
        containerCos.style.display = 'block';
    }
    
    // Functie pentru ascunderea cosului
    function ascundeCos() {
        const containerCos = document.getElementById('container-cos');
        const fundalCos = document.getElementById('container-cos-fundal');
        
        if (containerCos && fundalCos) {
            // Ascundem containerul si fundalul cu animatie
            containerCos.style.opacity = '0';
            fundalCos.style.opacity = '0';
            
            // Dupa ce animatia se încheie, ascundem complet elementele
            setTimeout(function() {
                containerCos.style.display = 'none';
                fundalCos.style.display = 'none';
                containerCos.style.opacity = '1';
                fundalCos.style.opacity = '1';
            }, 300);
        }
    }
    
    // Functie pentru actualizarea cantitatii unui produs
    function actualizeazaCantitateProdus(idProdus, delta) {
        let cos = getCos();
        
        const produsIndex = cos.findIndex(produs => produs.id === idProdus);
        
        if (produsIndex !== -1) {
            cos[produsIndex].cantitate += delta;
            
            // Verificam daca cantitatea a ajuns la 0
            if (cos[produsIndex].cantitate <= 0) {
                stergeProdus(idProdus);
                return;
            }
            
            // Salvam cosul actualizat si reafisam
            salveazaCos(cos);
            actualizeazaContorCos();
            afiseazaCos();
            
            // Afisam notificare
            afiseazaNotificare(`Cantitate actualizata: ${cos[produsIndex].cantitate} bucati`, "success");
        }
    }
    
    // Functie pentru stergerea unui produs
    function stergeProdus(idProdus) {
        let cos = getCos();
        
        // Gasim produsul pentru a afisa notificarea
        const produs = cos.find(p => p.id === idProdus);
        
        // Filtram lista pentru a elimina produsul
        cos = cos.filter(p => p.id !== idProdus);
        
        // Salvam cosul actualizat
        salveazaCos(cos);
        actualizeazaContorCos();
        
        // Daca suntem în containerul cosului, reafisam
        if (document.getElementById('container-cos').style.display === 'block') {
            afiseazaCos();
        }
        
        // Debifam checkbox-ul pentru produs
        const checkbox = document.querySelector(`.select-cos[value="${idProdus}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
        
        // Afisam notificare
        if (produs) {
            afiseazaNotificare(`Produsul "${produs.nume}" a fost eliminat din cos!`, "error");
        }
    }
    
    // Initializare checkboxuri din cosul existent
    function initCheckboxuriDinCos() {
        const cos = getCos();
        const checkboxuriProduse = document.querySelectorAll(".select-cos");
        
        checkboxuriProduse.forEach(checkbox => {
            const idProdus = checkbox.value;
            const produsInCos = cos.find(produs => produs.id === idProdus);
            
            if (produsInCos) {
                checkbox.checked = true;
            }
        });
    }
    
    // Adaugare event listeners
    function adaugaEventListeners() {
        // Event listeners pentru checkboxuri
        const checkboxuriProduse = document.querySelectorAll(".select-cos");
        checkboxuriProduse.forEach(checkbox => {
            checkbox.addEventListener("change", function() {
                const idProdus = this.value;
                adaugaInCos(idProdus, this);
            });
        });
        
        // Event listener pentru butonul din pagina produs
        const btnAdaugaProdus = document.querySelector(".btn-adauga-cos");
        if (btnAdaugaProdus) {
            btnAdaugaProdus.addEventListener("click", function() {
                adaugaProdusInPaginaProdus();
            });
        }
    }
    
    // Functie pentru adaugarea unui produs în cos din pagina de lista
    function adaugaInCos(idProdus, checkbox) {
        let cos = getCos();
        
        // Verificam daca produsul este deja în cos
        const produsExistent = cos.find(produs => produs.id === idProdus);
        
        if (produsExistent) {
            // Daca produsul este deja în cos si checkbox-ul este debifat, îl eliminam
            if (!checkbox.checked) {
                cos = cos.filter(produs => produs.id !== idProdus);
                afiseazaNotificare(`Produsul a fost eliminat din cos!`, "error");
            }
        } else {
            // Daca produsul nu este în cos si checkbox-ul este bifat, îl adaugam
            if (checkbox.checked) {
                // Obtinem informatiile produsului
                const articolProdus = checkbox.closest(".produs");
                const numeProdus = articolProdus.querySelector(".val-nume").textContent;
                const pretProdus = parseFloat(articolProdus.querySelector(".val-pret").textContent);
                const imagineProdus = articolProdus.querySelector("figure img").getAttribute("src");
                
                // Adaugam produsul în cos
                cos.push({
                    id: idProdus,
                    nume: numeProdus,
                    pret: pretProdus,
                    imagine: imagineProdus,
                    cantitate: 1
                });
                
                afiseazaNotificare(`Produsul "${numeProdus}" a fost adaugat în cos!`, "success");
            }
        }
        
        // Salvam cosul în localStorage
        salveazaCos(cos);
        
        // Actualizam contorul din interfata
        actualizeazaContorCos();
    }
    
    // Functie pentru adaugarea unui produs în cos din pagina de produs individual
    function adaugaProdusInPaginaProdus() {
        let cos = getCos();
        
        // Obtinem ID-ul produsului din URL
        const url = window.location.pathname;
        const idProdus = url.substring(url.lastIndexOf('/') + 1);
        
        // Verificam daca produsul este deja în cos
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
            
            // Adaugam produsul în cos
            cos.push({
                id: idProdus,
                nume: numeProdus,
                pret: pretProdus,
                imagine: imagineProdus,
                cantitate: 1
            });
            
            afiseazaNotificare(`Produsul "${numeProdus}" a fost adaugat în cos!`, "success");
        }
        
        // Salvam cosul în localStorage
        salveazaCos(cos);
        
        // Actualizam contorul din interfata
        actualizeazaContorCos();
    }
    
    // Functie pentru afisarea notificarilor
    function afiseazaNotificare(mesaj, tip) {
        // Verificam daca exista deja o notificare
        let notificareExistenta = document.querySelector('.notificare');
        if (notificareExistenta) {
            notificareExistenta.remove();
        }
        
        // Cream div-ul pentru notificare
        const notificare = document.createElement("div");
        notificare.classList.add("notificare", `notificare-${tip}`);
        notificare.innerHTML = `<p>${mesaj}</p>`;
        
        // Adaugam notificarea în pagina
        document.body.appendChild(notificare);
        
        // Eliminam notificarea dupa 3 secunde
        setTimeout(() => {
            notificare.style.opacity = "0";
            setTimeout(() => {
                notificare.remove();
            }, 300);
        }, 3000);
    }
});