document.addEventListener("DOMContentLoaded", function() {
    console.log("Script produse incarcat");
    
    // SELECTARE ELEMENTE DOM
    const inpNume = document.getElementById("inp-nume");
    const inpPret = document.getElementById("inp-pret");
    const infoRange = document.getElementById("infoRange");
    const inpCategorie = document.getElementById("inp-categorie");
    const inpDescriere = document.getElementById("inp-descriere");
    const inpTipProdus = document.getElementById("inp-tip-produs");
    const inpBrand = document.getElementById("inp-brand");
    const radioButtons = document.getElementsByName("gr_rad");
    const caracteristiciCheckboxes = document.getElementsByName("caracteristici");
    
    // BONUS 8: Selectori pentru sortare multiplă
    const selectCheia1 = document.getElementById("select-cheie1");
    const selectCheia2 = document.getElementById("select-cheie2");
    const selectOrdine = document.getElementById("select-ordine");
    
    const btnFiltrare = document.getElementById("filtrare");
    const btnResetare = document.getElementById("resetare");
    const btnSortCrescNume = document.getElementById("sortCrescNume");
    const btnSortDescrescNume = document.getElementById("sortDescrescNume");
    const btnCalculeazaSuma = document.getElementById("calculeaza-suma");
    
    // BONUS 8: Buton pentru sortare multiplă
    const btnSortareMultipla = document.getElementById("sortare-multipla");
    
    let produse = document.getElementsByClassName("produs");
    
    // DEBUG INITIAL
    console.log("Numar produse gasite:", produse.length);
    if (produse.length > 0) {
        console.log("Primul produs:", produse[0]);
    }
    
    // VERIFICARE STARE INITIALA CHECKBOX-URI
    console.log("Stare initiala checkbox-uri caracteristici:");
    for (const checkbox of caracteristiciCheckboxes) {
        console.log(`${checkbox.value}: ${checkbox.checked}`);
    }
    
    // ACTUALIZARE IN TIMP REAL A VALORII SLIDERULUI DE PRET
    if (inpPret && infoRange) {
        inpPret.addEventListener("input", function() {
            infoRange.textContent = `(${this.value} RON)`;
        });
    }
    
    // BONUS 15: Funcție pentru actualizarea contorului de produse
    function actualizeazaContorProduse(numarVizibile, numarTotal) {
        let contorElement = document.getElementById('contor-produse');
        
        // Creează elementul dacă nu există
        if (!contorElement) {
            contorElement = document.createElement('div');
            contorElement.id = 'contor-produse';
            contorElement.className = 'contor-produse';
            
            // Inserează înaintea gridului de produse
            const sectiuneProduse = document.getElementById('produse');
            const gridContainer = document.querySelector('.grid-produse');
            if (sectiuneProduse && gridContainer) {
                sectiuneProduse.insertBefore(contorElement, gridContainer);
            }
        }
        
        contorElement.innerHTML = `
            <div class="info-produse">
                <i class="fas fa-list"></i>
                <span class="numar-afisat">${numarVizibile}</span> din 
                <span class="numar-total">${numarTotal}</span> produse afișate
                ${numarVizibile !== numarTotal ? `<span class="filtru-activ">(filtru activ)</span>` : ''}
            </div>
        `;
        
        // Animație de actualizare
        contorElement.classList.add('updating');
        setTimeout(() => {
            contorElement.classList.remove('updating');
        }, 300);
    }
    
    // BONUS 3: Funcție pentru afișarea mesajului când nu există produse
    function afiseazaMesajLipsaProduse() {
        const gridContainer = document.querySelector('.grid-produse');
        if (gridContainer) {
            gridContainer.innerHTML = `
                <div class="mesaj-no-produse">
                    <i class="fas fa-search" style="font-size: 3rem; color: #C05F3E; margin-bottom: 1rem;"></i>
                    <h3>Nu există produse conform filtrării curente</h3>
                    <p>Încercați să modificați criteriile de filtrare pentru a găsi produse.</p>
                    <button onclick="resetareFiltre()" class="btn btn-primary">
                        <i class="fas fa-undo"></i> Resetează filtrele
                    </button>
                </div>
            `;
        }
    }
    
    // BONUS 3: Funcție pentru restaurarea gridului de produse
    function restaureazaGridProduse() {
        const gridContainer = document.querySelector('.grid-produse');
        const mesajNoProduse = gridContainer.querySelector('.mesaj-no-produse');
        
        if (mesajNoProduse) {
            // Elimină mesajul și restaurează produsele
            gridContainer.innerHTML = '';
            
            // Re-adaugă toate produsele în DOM
            for (const produs of produse) {
                gridContainer.appendChild(produs);
            }
        }
    }
    
    // FUNCTIE DE VALIDARE INPUTURI
    function validateInputs() {
        let isValid = true;
        let errorMessage = "";
        
        // Validare nume (fara caractere speciale)
        if (inpNume && inpNume.value.trim() !== "" && !/^[a-zA-Z0-9\s]+$/.test(inpNume.value)) {
            isValid = false;
            errorMessage += "Numele trebuie sa contina doar litere, cifre si spatii.\n";
            inpNume.classList.add("input-error");
        } else if (inpNume) {
            inpNume.classList.remove("input-error");
        }
        
        // Validare textarea descriere (nu poate contine <script>)
        if (inpDescriere && inpDescriere.value.includes("<script>")) {
            isValid = false;
            errorMessage += "Descrierea contine un tag script nevalid.\n";
            inpDescriere.classList.add("input-error");
        } else if (inpDescriere) {
            inpDescriere.classList.remove("input-error");
        }
        
        // Validare brand (trebuie sa fie unul din lista sau gol)
        if (inpBrand && inpBrand.value.trim() !== "") {
            const datalistOptions = Array.from(document.getElementById("lista-branduri").options);
            const brands = datalistOptions.map(opt => opt.value.toLowerCase());
            
            if (!brands.includes(inpBrand.value.toLowerCase())) {
                isValid = false;
                errorMessage += "Selectati un brand din lista disponibila.\n";
                inpBrand.classList.add("input-error");
            } else {
                inpBrand.classList.remove("input-error");
            }
        }
        
        if (!isValid) {
            alert("Verificati urmatoarele erori:\n" + errorMessage);
        }
        
        return isValid;
    }
    
    // FUNCTIE DE DEBUG PENTRU VERIFICAREA CONDITIILOR
    function debugConditii(produs, conditii, caracteristiciProdus, caracteristiciSelectate) {
        const numeProdus = produs.querySelector(".val-nume")?.textContent || "Necunoscut";
        console.log(`Produs: ${numeProdus}`);
        console.log(`  Caracteristici produs: ${JSON.stringify(caracteristiciProdus)}`);
        console.log(`  Caracteristici selectate: ${JSON.stringify(caracteristiciSelectate)}`);
        Object.keys(conditii).forEach(key => {
            console.log(`  - ${key}: ${conditii[key]}`);
        });
        console.log(`  => Vizibil: ${Object.values(conditii).every(val => val)}`);
    }
    
    // BONUS 14 & 18: FUNCTII HELPER PENTRU MARCAJE
    function updateMarcaje() {
        // Calculam cele mai ieftine produse din fiecare categorie
        const produsePeCategorie = {};
        
        // Grupam produsele vizibile pe categorii
        for (const produs of produse) {
            if (produs.style.display !== "none") {
                const categorieElement = produs.querySelector(".val-categorie");
                const pretElement = produs.querySelector(".val-pret");
                
                if (categorieElement && pretElement) {
                    const categorie = categorieElement.textContent.toLowerCase().trim();
                    
                    // Luam pretul normal al produsului
                    let pret = parseFloat(pretElement.textContent.replace(/[^\d.-]/g, ''));
                    
                    if (!produsePeCategorie[categorie]) {
                        produsePeCategorie[categorie] = [];
                    }
                    produsePeCategorie[categorie].push({ element: produs, pret: pret });
                }
            }
        }
        
        // Eliminam toate marcajele existente
        document.querySelectorAll('.marcaj-ieftin').forEach(marcaj => marcaj.remove());
        
        // Aplicam marcajele pentru cele mai ieftine produse
        Object.keys(produsePeCategorie).forEach(categorie => {
            const produseCat = produsePeCategorie[categorie];
            if (produseCat.length > 1) { // Aplicam marcajul doar daca exista mai multe produse in categorie
                const celMaiIeftin = produseCat.reduce((min, prod) => 
                    prod.pret < min.pret ? prod : min
                );
                
                // Cream marcajul pentru cel mai ieftin
                const marcajIeftin = document.createElement('div');
                marcajIeftin.className = 'marcaj-ieftin';
                marcajIeftin.innerHTML = `
                    <i class="fas fa-trophy"></i> 
                    CEL MAI IEFTIN DIN CATEGORIA ${categorie.toUpperCase()}
                `;
                
                celMaiIeftin.element.appendChild(marcajIeftin);
            }
        });
    }
    
    function checkProdusNou(produs) {
        // BONUS 18: Verificam daca produsul este nou (ultimele 30 zile pentru demo)
        const intervalProdusNou = 6 * 24 * 60 * 60 * 1000; // 30 zile
        const acum = new Date();
        
        const timeElement = produs.querySelector('time');
        if (timeElement) {
            const dataAdaugare = new Date(timeElement.getAttribute('datetime'));
            const diferentaTimp = acum - dataAdaugare;
            const esteNou = diferentaTimp <= intervalProdusNou;
            
            // Adaugam clasa si marcajul daca produsul este nou
            if (esteNou && !produs.classList.contains('produs-nou')) {
                produs.classList.add('produs-nou');
                
                // Verificam daca marcajul nu exista deja
                if (!produs.querySelector('.marcaj-nou')) {
                    const marcajNou = document.createElement('div');
                    marcajNou.className = 'marcaj-nou';
                    marcajNou.innerHTML = '<i class="fas fa-star"></i> NOU';
                    produs.appendChild(marcajNou);
                }
            }
        }
    }
    
    // BONUS 8: Funcție pentru sortarea după două chei
    function sorteazaMultiplu() {
        if (!validateInputs()) {
            return;
        }
        
        const cheie1 = selectCheia1 ? selectCheia1.value : 'nume';
        const cheie2 = selectCheia2 ? selectCheia2.value : 'pret';
        const ordine = selectOrdine ? selectOrdine.value : 'crescator';
        const crescator = ordine === 'crescator';
        
        console.log(`Sortare multiplă: ${cheie1} -> ${cheie2} (${ordine})`);
        
        const produseArray = Array.from(produse);
        
        produseArray.sort((a, b) => {
            // Funcție helper pentru extragerea valorii
            function extrageValoare(produs, cheie) {
                switch(cheie) {
                    case 'nume':
                        return produs.querySelector(".val-nume")?.textContent.toLowerCase() || '';
                    case 'pret':
                        const pretElement = produs.querySelector(".val-pret");
                        if (pretElement) {
                            const textPret = pretElement.textContent;
                            return parseFloat(textPret.replace(/[^\d.-]/g, '')) || 0;
                        }
                        return 0;
                    case 'greutate':
                        const greutateElement = produs.querySelector(".val-greutate");
                        return greutateElement ? parseInt(greutateElement.textContent.replace(/[^\d.-]/g, '')) || 0 : 0;
                    case 'categorie':
                        return produs.querySelector(".val-categorie")?.textContent.toLowerCase() || '';
                    case 'tip':
                        return produs.querySelector(".val-tip")?.textContent.toLowerCase() || '';
                    case 'data':
                        const timeElement = produs.querySelector('time');
                        return timeElement ? new Date(timeElement.getAttribute('datetime')).getTime() : 0;
                    default:
                        return '';
                }
            }
            
            const valoareA1 = extrageValoare(a, cheie1);
            const valoareB1 = extrageValoare(b, cheie1);
            const valoareA2 = extrageValoare(a, cheie2);
            const valoareB2 = extrageValoare(b, cheie2);
            
            // Sortăm mai întâi după prima cheie
            let comparatie1;
            if (typeof valoareA1 === 'string') {
                comparatie1 = crescator ? valoareA1.localeCompare(valoareB1) : valoareB1.localeCompare(valoareA1);
            } else {
                comparatie1 = crescator ? valoareA1 - valoareB1 : valoareB1 - valoareA1;
            }
            
            // Dacă valorile sunt egale, sortăm după a doua cheie
            if (comparatie1 === 0) {
                if (typeof valoareA2 === 'string') {
                    return crescator ? valoareA2.localeCompare(valoareB2) : valoareB2.localeCompare(valoareA2);
                } else {
                    return crescator ? valoareA2 - valoareB2 : valoareB2 - valoareA2;
                }
            }
            
            return comparatie1;
        });
        
        // Reordonam DOM-ul
        const container = document.querySelector(".grid-produse");
        if (container) {
            produseArray.forEach(produs => {
                container.appendChild(produs);
            });
            console.log(`Sortare multiplă aplicată: ${cheie1} -> ${cheie2} (${ordine})`);
            updateMarcaje();
            
            // Afișăm notificare
            showSortNotification(`Sortare aplicată: ${cheie1} → ${cheie2} (${ordine})`);
        }
    }
    
    // BONUS 8: Funcție pentru afișarea notificării de sortare
    function showSortNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'sort-notification';
        notification.innerHTML = `
            <i class="fas fa-sort"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6B3E31, #C05F3E);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // FUNCTIE PRINCIPALA DE FILTRARE PRODUSE - ACTUALIZATĂ CU BONUSURILE
    function filtrareProduse() {
        // Verificam validitatea inputurilor
        if (!validateInputs()) {
            return;
        }
        
        // BONUS 3: Restaurează gridul înainte de filtrare
        restaureazaGridProduse();
        
        console.log("Aplicam filtrarea...");
        
        // Obtinem valorile din inputuri si le tratam corespunzator
        const numeFiltru = (inpNume ? inpNume.value : "").toLowerCase().trim();
        const pretMinim = inpPret ? parseInt(inpPret.value) : 0;
        
        // Obtinem valoarea selectata pentru intervalul de greutate
        let greutateMin = 0;
        let greutateMax = Infinity;
        let radioSelectat = false;
        for (const radio of radioButtons) {
            if (radio.checked) {
                radioSelectat = true;
                if (radio.value !== "toate") {
                    const intervale = radio.value.split(":");
                    greutateMin = parseInt(intervale[0]) || 0;
                    greutateMax = parseInt(intervale[1]) || Infinity;
                }
                break;
            }
        }
        
        if (!radioSelectat) {
            console.warn("Niciun radio button selectat pentru greutate!");
        }
        
        // Obtinem cuvintele cheie pentru descriere
        const cuvinteDescriere = inpDescriere ? 
            inpDescriere.value
                .toLowerCase()
                .split(",")
                .map(cuvant => cuvant.trim())
                .filter(cuvant => cuvant !== "")
            : [];
        
        // VERIFICAM CHECKBOXURILE PENTRU CARACTERISTICI
        // Daca toate sunt debifate sau toate sunt bifate, consideram ca nu aplicam filtrul
        const caracteristiciSelectate = [];
        let toateSelectate = true;
        let niciunaSelectata = true;
        
        for (const checkbox of caracteristiciCheckboxes) {
            if (checkbox.checked) {
                caracteristiciSelectate.push(checkbox.value.toLowerCase().trim());
                niciunaSelectata = false;
            } else {
                toateSelectate = false;
            }
        }
        
        // Obtinem categoria selectata
        const categorieSelectata = (inpCategorie ? inpCategorie.value : "toate").toLowerCase().trim();
        
        // Obtinem tipurile de produse selectate
        const tipuriSelectate = [];
        let toateTipurileSelectate = true;
        
        if (inpTipProdus) {
            for (const option of inpTipProdus.options) {
                if (option.selected) {
                    tipuriSelectate.push(option.value.toLowerCase().trim());
                } else {
                    toateTipurileSelectate = false;
                }
            }
        }
        
        // Obtinem brandul introdus
        const brandFiltru = (inpBrand ? inpBrand.value : "").toLowerCase().trim();
        
        // Parcurgem toate produsele si aplicam filtrele
        let produseVizibile = 0;
        const numarTotalProduse = produse.length;
        
        // Verificam daca avem produse
        if (produse.length === 0) {
            console.error("Nu s-au gasit produse pentru filtrare!");
            return;
        }
        
        for (let i = 0; i < produse.length; i++) {
            const produs = produse[i];
            
            // Verificam daca elementele necesare exista
            const numeElement = produs.querySelector(".val-nume");
            const pretElement = produs.querySelector(".val-pret");
            const greutateElement = produs.querySelector(".val-greutate");
            const descriereElement = produs.querySelector(".descriere");
            const categorieElement = produs.querySelector(".val-categorie");
            const tipElement = produs.querySelector(".val-tip");
            
            if (!numeElement || !pretElement || !greutateElement || !descriereElement || !categorieElement || !tipElement) {
                console.error("Elementele necesare lipsesc pentru produsul", i);
                continue;
            }
            
            // Extragem valorile din produs
            const numeProdus = numeElement.textContent.toLowerCase().trim();
            let pretProdus = 0;
            
            // Luam pretul normal al produsului
            try {
                pretProdus = parseFloat(pretElement.textContent.replace(/[^\d.-]/g, ''));
            } catch (e) {
                console.error("Eroare la parsarea pretului:", pretElement.textContent);
            }
            
            let greutateProdus = 0;
            try {
                greutateProdus = parseInt(greutateElement.textContent.replace(/[^\d.-]/g, ''));
            } catch (e) {
                console.error("Eroare la parsarea greutatii:", greutateElement.textContent);
            }
            
            const descriereProdus = descriereElement.textContent.toLowerCase().trim();
            const categorieProdus = categorieElement.textContent.toLowerCase().trim();
            const tipProdus = tipElement.textContent.toLowerCase().trim();
            
            // Obtinem caracteristicile produsului din elementele li
            const caracteristiciProdus = [];
            const listaCaracteristici = produs.querySelectorAll(".caracteristici li");
            if (listaCaracteristici.length > 0) {
                for (const caracteristica of listaCaracteristici) {
                    const textCaracteristica = caracteristica.textContent.trim();
                    if (textCaracteristica !== "Nu sunt specificate") {
                        caracteristiciProdus.push(textCaracteristica.toLowerCase());
                    }
                }
            }
            
            // Verificam conditiile de filtrare
            const conditii = {
                nume: numeFiltru === "" || numeProdus.includes(numeFiltru),
                pret: pretProdus >= pretMinim,
                greutate: greutateProdus >= greutateMin && greutateProdus <= greutateMax,
                descriere: true,
                caracteristici: true,
                categorie: categorieSelectata === "toate" || categorieProdus === categorieSelectata,
                tip: toateTipurileSelectate || tipuriSelectate.includes(tipProdus),
                brand: brandFiltru === "" || numeProdus.includes(brandFiltru)
            };
            
            // Verificare pentru cuvinte cheie in descriere (trebuie sa contina cel putin unul)
            if (cuvinteDescriere.length > 0) {
                conditii.descriere = cuvinteDescriere.some(cuvant => descriereProdus.includes(cuvant));
            }
            
            // VERIFICARE PENTRU CARACTERISTICI - FIXAT COMPLET
            // Daca toate sunt selectate sau niciuna nu e selectata, ignoram acest filtru
            if (!toateSelectate && !niciunaSelectata) {
                if (caracteristiciProdus.length === 0) {
                    // Daca produsul nu are caracteristici, nu il afisam decat daca toate caracteristicile sunt selectate
                    conditii.caracteristici = false;
                } else {
                    // Verificam daca produsul are cel putin una din caracteristicile selectate
                    conditii.caracteristici = caracteristiciSelectate.some(caracteristicaSelectata => {
                        return caracteristiciProdus.some(caracteristicaProdus => {
                            return caracteristicaProdus.includes(caracteristicaSelectata);
                        });
                    });
                }
            }
            
            // Debug pentru primele 3 produse
            if (i < 3) {
                debugConditii(produs, conditii, caracteristiciProdus, caracteristiciSelectate);
            }
            
            // Afisam sau ascundem produsul in functie de toate conditiile
            const esteVizibil = Object.values(conditii).every(val => val);
            
            if (esteVizibil) {
                produs.style.display = "flex";
                produseVizibile++;
                
                // BONUS 18: Verificam daca este produs nou
                checkProdusNou(produs);
            } else {
                produs.style.display = "none";
            }
        }
        
        console.log("Filtrare aplicata. Produse vizibile:", produseVizibile);
        
        // BONUS 15: Actualizăm contorul de produse
        actualizeazaContorProduse(produseVizibile, numarTotalProduse);
        
        // BONUS 14: Actualizam marcajele pentru cel mai ieftin dupa filtrare
        updateMarcaje();
        
        // BONUS 3: Afisam mesaj daca nu avem produse vizibile
        if (produseVizibile === 0) {
            afiseazaMesajLipsaProduse();
        }
    }
    
    // BONUS 4: Funcție pentru activarea filtrării automate
    function activeazaFiltrareAutomata() {
        console.log("Activez filtrarea automată la onchange...");
        
        // INPUT TEXT pentru nume (0.05p)
        if (inpNume) {
            inpNume.addEventListener('input', function() {
                console.log("Auto-filtrare: nume schimbat");
                setTimeout(filtrareProduse, 300); // Debounce pentru performanță
            });
        }
        
        // INPUT RANGE pentru preț (0.05p)
        if (inpPret) {
            inpPret.addEventListener('input', function() {
                console.log("Auto-filtrare: preț schimbat");
                filtrareProduse();
            });
        }
        
        // RADIO BUTTONS pentru greutate (0.05p)
        for (const radio of radioButtons) {
            radio.addEventListener('change', function() {
                console.log("Auto-filtrare: greutate schimbată");
                filtrareProduse();
            });
        }
        
        // TEXTAREA pentru descriere (0.05p)
        if (inpDescriere) {
            inpDescriere.addEventListener('input', function() {
                console.log("Auto-filtrare: descriere schimbată");
                setTimeout(filtrareProduse, 500); // Debounce mai lung pentru textarea
            });
        }
        
        // CHECKBOXURI pentru caracteristici (0.05p)
        for (const checkbox of caracteristiciCheckboxes) {
            checkbox.addEventListener('change', function() {
                console.log("Auto-filtrare: caracteristici schimbate");
                filtrareProduse();
            });
        }
        
        // SELECT pentru categorie (0.05p)
        if (inpCategorie) {
            inpCategorie.addEventListener('change', function() {
                console.log("Auto-filtrare: categorie schimbată");
                filtrareProduse();
            });
        }
        
        // SELECT MULTIPLU pentru tip produs (0.05p)
        if (inpTipProdus) {
            inpTipProdus.addEventListener('change', function() {
                console.log("Auto-filtrare: tip produs schimbat");
                filtrareProduse();
            });
        }
        
        // DATALIST pentru brand (0.05p)
        if (inpBrand) {
            inpBrand.addEventListener('input', function() {
                console.log("Auto-filtrare: brand schimbat");
                setTimeout(filtrareProduse, 300); // Debounce pentru performanță
            });
        }
    }
    
    // FUNCTIE PENTRU SORTARE PRODUSE
    function sorteazaProduse(crescator = true) {
        if (!validateInputs()) {
            return;
        }
        
        console.log("Aplicam sortarea...");
        
        // Obtinem lista de produse ca array pentru a putea sorta
        const produseArray = Array.from(produse);
        
        // Sortam produsele dupa nume
        produseArray.sort((a, b) => {
            const numeElementA = a.querySelector(".val-nume");
            const numeElementB = b.querySelector(".val-nume");
            const pretElementA = a.querySelector(".val-pret");
            const pretElementB = b.querySelector(".val-pret");
            
            if (!numeElementA || !numeElementB || !pretElementA || !pretElementB) {
                console.error("Elemente lipsa pentru sortare");
                return 0;
            }
            
            const numeA = numeElementA.textContent.toLowerCase();
            const numeB = numeElementB.textContent.toLowerCase();
            
            let pretA = 0, pretB = 0;
            
            try {
                // Luam pretul normal pentru sortare
                pretA = parseFloat(pretElementA.textContent.replace(/[^\d.-]/g, ''));
                pretB = parseFloat(pretElementB.textContent.replace(/[^\d.-]/g, ''));
            } catch (e) {
                console.error("Eroare la parsarea preturilor pentru sortare");
            }
            
            // Sortam intai dupa pret, apoi dupa nume in caz de egalitate
            if (pretA === pretB) {
                return crescator ? numeA.localeCompare(numeB) : numeB.localeCompare(numeA);
            }
            
            return crescator ? pretA - pretB : pretB - pretA;
        });
        
        // Reordonam DOM-ul in functie de sortare
        const container = document.querySelector(".grid-produse");
        if (container) {
            produseArray.forEach(produs => {
                container.appendChild(produs);
            });
            console.log("Sortare aplicata:", crescator ? "crescator" : "descrescator");
            
            // BONUS 14: Actualizam marcajele dupa sortare
            updateMarcaje();
        } else {
            console.error("Container grid-produse nu a fost gasit");
        }
    }
    
    // FUNCTIE PENTRU CALCUL SUMA PRETURI - Actualizat
    function calculeazaSuma() {
        let suma = 0;
        let contor = 0;
        
        // Calculam suma preturilor produselor vizibile
        for (const produs of produse) {
            if (produs.style.display !== "none") {
                const pretElement = produs.querySelector(".val-pret");
                if (pretElement) {
                    try {
                        // Luam pretul normal al produsului
                        const pret = parseFloat(pretElement.textContent.replace(/[^\d.-]/g, ''));
                        suma += pret;
                        contor++;
                    } catch (e) {
                        console.error("Eroare la parsarea pretului pentru suma");
                    }
                }
            }
        }
        
        // Cream div-ul pentru afisarea sumei
        const divRezultat = document.createElement("div");
        divRezultat.classList.add("rezultat-calcul");
        
        if (contor > 0) {
            divRezultat.innerHTML = `
                <p>Suma preturilor pentru cele ${contor} produse afisate: <strong>${suma.toFixed(2)} RON</strong></p>
                <p>Pret mediu: <strong>${(suma / contor).toFixed(2)} RON</strong></p>
            `;
        } else {
            divRezultat.innerHTML = `
                <p>Nu exista produse vizibile pentru a calcula suma.</p>
            `;
        }
        
        // Stilizam div-ul
        divRezultat.style.position = "fixed";
        divRezultat.style.top = "50%";
        divRezultat.style.left = "50%";
        divRezultat.style.transform = "translate(-50%, -50%)";
        divRezultat.style.backgroundColor = "#3D2823";
        divRezultat.style.color = "#F7E9D7";
        divRezultat.style.padding = "1.5rem";
        divRezultat.style.borderRadius = "10px";
        divRezultat.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.5)";
        divRezultat.style.zIndex = "1000";
        divRezultat.style.textAlign = "center";
        divRezultat.style.border = "2px solid #6B3E31";
        
        // Adaugam div-ul in pagina
        document.body.appendChild(divRezultat);
        
        // Stergem div-ul dupa 3 secunde
        setTimeout(() => {
            divRezultat.remove();
        }, 3000);
        
        console.log("Suma calculata:", suma, "pentru", contor, "produse");
    }
    
    // FUNCTIE PENTRU RESETARE FILTRE
    function resetareFiltre() {
        console.log("Resetam filtrele...");
        
        // BONUS 3: Restaurează gridul înainte de resetare
        restaureazaGridProduse();
        
        // Resetam valorile din inputuri
        if (inpNume) inpNume.value = "";
        
        if (inpPret) {
            inpPret.value = 0;
            if (infoRange) infoRange.textContent = "(0 RON)";
        }
        
        // Resetam radio buttonurile (selectam "toate")
        for (const radio of radioButtons) {
            radio.checked = radio.value === "toate";
        }
        
        // Resetam textarea-ul pentru descriere
        if (inpDescriere) inpDescriere.value = "";
        
        // Resetam checkboxurile pentru caracteristici (toate bifate)
        for (const checkbox of caracteristiciCheckboxes) {
            checkbox.checked = true;
        }
        
        // Resetam selectul pentru categorie (selectam "toate")
        if (inpCategorie) inpCategorie.value = "toate";
        
        // Resetam selectul multiplu pentru tip produs (toate selectate)
        if (inpTipProdus) {
            for (const option of inpTipProdus.options) {
                option.selected = true;
            }
        }
        
        // Resetam input-ul pentru brand
        if (inpBrand) inpBrand.value = "";
        
        // BONUS 8: Resetăm și selectoarele pentru sortare multiplă
        if (selectCheia1) selectCheia1.value = "nume";
        if (selectCheia2) selectCheia2.value = "pret";
        if (selectOrdine) selectOrdine.value = "crescator";
        
        // Afisam toate produsele
        for (const produs of produse) {
            produs.style.display = "flex";
            // BONUS 18: Verificam marcajele pentru produse noi
            checkProdusNou(produs);
        }
        
        // Eliminam clasele de eroare pentru inputuri
        if (inpNume) inpNume.classList.remove("input-error");
        if (inpDescriere) inpDescriere.classList.remove("input-error");
        if (inpBrand) inpBrand.classList.remove("input-error");
        
        // BONUS 15: Actualizăm contorul
        const numarTotalProduse = produse.length;
        actualizeazaContorProduse(numarTotalProduse, numarTotalProduse);
        
        // BONUS 14: Actualizam marcajele pentru cel mai ieftin
        updateMarcaje();
        
        console.log("Filtre resetate");
    }
    
    // Facem resetareFiltre disponibilă global pentru butonul din mesajul de lipsa produse
    window.resetareFiltre = resetareFiltre;
    
    // INITIALIZARE LA INCARCARE - BONUS 14 & 18
    function initializareMarcaje() {
        console.log("Initializam marcajele pentru produse...");
        
        // Verificam toate produsele pentru marcaje noi
        for (const produs of produse) {
            checkProdusNou(produs);
        }
        
        // Aplicam marcajele pentru cel mai ieftin
        updateMarcaje();
        
        console.log("Marcaje initializate");
    }
    
    // ADAUGARE EVENIMENTE PENTRU BUTOANE
    if (btnFiltrare) {
        btnFiltrare.addEventListener("click", filtrareProduse);
        console.log("Eveniment adaugat pentru butonul de filtrare");
    } else {
        console.error("Butonul de filtrare nu a fost gasit!");
    }
    
    if (btnSortCrescNume) {
        btnSortCrescNume.addEventListener("click", function() {
            sorteazaProduse(true); // Sortare crescatoare
        });
        console.log("Eveniment adaugat pentru butonul de sortare crescatoare");
    }
    
    if (btnSortDescrescNume) {
        btnSortDescrescNume.addEventListener("click", function() {
            sorteazaProduse(false); // Sortare descrescatoare
        });
        console.log("Eveniment adaugat pentru butonul de sortare descrescatoare");
    }
    
    if (btnCalculeazaSuma) {
        btnCalculeazaSuma.addEventListener("click", calculeazaSuma);
        console.log("Eveniment adaugat pentru butonul de calcul suma");
    }
    
    if (btnResetare) {
        btnResetare.addEventListener("click", function() {
            if (confirm("Esti sigur ca vrei sa resetezi toate filtrele?")) {
                resetareFiltre();
            }
        });
        console.log("Eveniment adaugat pentru butonul de resetare");
    }
    
    // BONUS 8: Event listener pentru sortarea multiplă
    if (btnSortareMultipla) {
        btnSortareMultipla.addEventListener("click", sorteazaMultiplu);
        console.log("Eveniment adaugat pentru butonul de sortare multiplă");
    }
    
    // EVENIMENT PENTRU TASTATURA (ALT + C pentru calcul suma)
    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key.toLowerCase() === "c") {
            calculeazaSuma();
            console.log("Scurtatura ALT+C folosita pentru calcul suma");
        }
    });
    
    // BONUS 4: Activăm filtrarea automată
    activeazaFiltrareAutomata();
    
    // BONUS 15: Inițializăm contorul de produse
    const numarTotalProduse = produse.length;
    actualizeazaContorProduse(numarTotalProduse, numarTotalProduse);
    
    // INITIALIZARE MARCAJE LA INCARCARE PAGINA
    initializareMarcaje();
    
    // BONUS: FUNCTIONALITATE EXTRA - Highlight produse noi la hover
    document.addEventListener('mouseover', function(event) {
        if (event.target.closest('.produs-nou')) {
            const produs = event.target.closest('.produs-nou');
            produs.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
        }
    });
    
    document.addEventListener('mouseout', function(event) {
        if (event.target.closest('.produs-nou')) {
            const produs = event.target.closest('.produs-nou');
            produs.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.2)';
        }
    });
    
});