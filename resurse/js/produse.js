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
    
    const btnFiltrare = document.getElementById("filtrare");
    const btnResetare = document.getElementById("resetare");
    const btnSortCrescNume = document.getElementById("sortCrescNume");
    const btnSortDescrescNume = document.getElementById("sortDescrescNume");
    const btnCalculeazaSuma = document.getElementById("calculeaza-suma");
    
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
    
    // FUNCTIE DE VALIDARE INPUTURI
    function validateInputs() {
        let isValid = true;
        let errorMessage = "";
        
        // Validare nume (fără caractere speciale)
        if (inpNume && inpNume.value.trim() !== "" && !/^[a-zA-Z0-9\s]+$/.test(inpNume.value)) {
            isValid = false;
            errorMessage += "Numele trebuie să conțină doar litere, cifre și spații.\n";
            inpNume.classList.add("input-error");
        } else if (inpNume) {
            inpNume.classList.remove("input-error");
        }
        
        // Validare textarea descriere (nu poate conține <script>)
        if (inpDescriere && inpDescriere.value.includes("<script>")) {
            isValid = false;
            errorMessage += "Descrierea conține un tag script nevalid.\n";
            inpDescriere.classList.add("input-error");
        } else if (inpDescriere) {
            inpDescriere.classList.remove("input-error");
        }
        
        // Validare brand (trebuie să fie unul din listă sau gol)
        if (inpBrand && inpBrand.value.trim() !== "") {
            const datalistOptions = Array.from(document.getElementById("lista-branduri").options);
            const brands = datalistOptions.map(opt => opt.value.toLowerCase());
            
            if (!brands.includes(inpBrand.value.toLowerCase())) {
                isValid = false;
                errorMessage += "Selectați un brand din lista disponibilă.\n";
                inpBrand.classList.add("input-error");
            } else {
                inpBrand.classList.remove("input-error");
            }
        }
        
        if (!isValid) {
            alert("Verificați următoarele erori:\n" + errorMessage);
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
    
    // FUNCTIE PRINCIPALA DE FILTRARE PRODUSE - FIXATA
    function filtrareProduse() {
        // Verificam validitatea inputurilor
        if (!validateInputs()) {
            return;
        }
        
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
        
        // Debug pentru valori filtre
        console.log("Filtrare dupa nume:", numeFiltru);
        console.log("Pret minim:", pretMinim);
        console.log("Interval greutate:", greutateMin, "-", greutateMax);
        console.log("Cuvinte descriere:", cuvinteDescriere);
        console.log("Caracteristici selectate:", caracteristiciSelectate);
        console.log("Toate caracteristicile selectate:", toateSelectate);
        console.log("Nicio caracteristica selectata:", niciunaSelectata);
        console.log("Categorie:", categorieSelectata);
        console.log("Tipuri produse:", tipuriSelectate);
        console.log("Toate tipurile selectate:", toateTipurileSelectate);
        console.log("Brand:", brandFiltru);
        
        // Parcurgem toate produsele si aplicam filtrele
        let produseVizibile = 0;
        
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
            } else {
                produs.style.display = "none";
            }
        }
        
        console.log("Filtrare aplicata. Produse vizibile:", produseVizibile);
        
        // Afisam un mesaj daca nu avem produse vizibile
        if (produseVizibile === 0) {
            alert("Nu s-a găsit niciun produs care să îndeplinească criteriile de filtrare. Încercați criterii mai puțin restrictive.");
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
        } else {
            console.error("Container grid-produse nu a fost gasit");
        }
    }
    
    // FUNCTIE PENTRU CALCULARE SUMA PRETURI
    function calculeazaSuma() {
        let suma = 0;
        let contor = 0;
        
        // Calculam suma preturilor produselor vizibile
        for (const produs of produse) {
            if (produs.style.display !== "none") {
                const pretElement = produs.querySelector(".val-pret");
                if (pretElement) {
                    try {
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
        
        // Afisam toate produsele
        for (const produs of produse) {
            produs.style.display = "flex";
        }
        
        // Eliminam clasele de eroare pentru inputuri
        if (inpNume) inpNume.classList.remove("input-error");
        if (inpDescriere) inpDescriere.classList.remove("input-error");
        if (inpBrand) inpBrand.classList.remove("input-error");
        
        console.log("Filtre resetate");
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
    
    // EVENIMENT PENTRU TASTATURA (ALT + C pentru calcul suma)
    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key.toLowerCase() === "c") {
            calculeazaSuma();
            console.log("Scurtatura ALT+C folosita pentru calcul suma");
        }
    });
});