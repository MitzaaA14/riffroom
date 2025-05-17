/*
 * JAVASCRIPT ACTUALIZAT PENTRU FUNCȚIONALITATEA PAGINII DE PRODUSE
 * Implementarea filtrării, sortării și calculelor cu corectarea filtrului de caracteristici
 */

document.addEventListener("DOMContentLoaded", function() {
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
    
    // ACTUALIZARE VALOARE SLIDER PRET
    if (inpPret && infoRange) {
        inpPret.addEventListener("input", function() {
            infoRange.textContent = `(${this.value} RON)`;
        });
    }
    
    // FUNCTIE VALIDARE INPUTURI
    function validateInputs() {
        let isValid = true;
        let errorMessage = "";
        
        // Validare nume (fără caractere speciale)
        if (inpNume.value.trim() !== "" && !/^[a-zA-Z0-9\s]+$/.test(inpNume.value)) {
            isValid = false;
            errorMessage += "Numele trebuie să conțină doar litere, cifre și spații.\n";
            inpNume.classList.add("input-error");
        } else {
            inpNume.classList.remove("input-error");
        }
        
        // Validare textarea descriere (nu poate conține <script>)
        if (inpDescriere.value.includes("<script>")) {
            isValid = false;
            errorMessage += "Descrierea conține un tag script nevalid.\n";
            inpDescriere.classList.add("input-error");
        } else {
            inpDescriere.classList.remove("input-error");
        }
        
        // Validare brand (trebuie să fie unul din listă sau gol)
        if (inpBrand.value.trim() !== "") {
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
    
    // FUNCTIE PENTRU FILTRARE PRODUSE - CORECTATĂ PENTRU FILTRAREA CARACTERISTICILOR
    function filtrareProduse() {
        // Verificăm validitatea inputurilor
        if (!validateInputs()) {
            return;
        }
        
        // Obținem valorile din inputuri
        const numeFiltru = inpNume.value.toLowerCase();
        const pretMinim = parseInt(inpPret.value);
        
        // Obținem valoarea selectată pentru intervalul de greutate
        let greutateMin = 0;
        let greutateMax = Infinity;
        for (const radio of radioButtons) {
            if (radio.checked) {
                if (radio.value !== "toate") {
                    [greutateMin, greutateMax] = radio.value.split(":").map(Number);
                }
                break;
            }
        }
        
        // Obținem cuvintele cheie pentru descriere
        const cuvinteDescriere = inpDescriere.value
            .toLowerCase()
            .split(",")
            .map(cuvant => cuvant.trim())
            .filter(cuvant => cuvant !== "");
        
        // Obținem caracteristicile selectate
        const caracteristiciSelectate = [];
        for (const checkbox of caracteristiciCheckboxes) {
            if (checkbox.checked) {
                caracteristiciSelectate.push(checkbox.value.toLowerCase());
            }
        }
        
        // Obținem categoria selectată
        const categorieSelectata = inpCategorie.value;
        
        // Obținem tipurile de produse selectate
        const tipuriSelectate = Array.from(inpTipProdus.selectedOptions).map(option => option.value.toLowerCase());
        
        // Obținem brandul introdus
        const brandFiltru = inpBrand.value.toLowerCase();
        
        // Parcurgem toate produsele și aplicăm filtrele
        for (const produs of produse) {
            const numeProdus = produs.querySelector(".val-nume").textContent.toLowerCase();
            const pretProdus = parseFloat(produs.querySelector(".val-pret").textContent);
            const greutateProdus = parseInt(produs.querySelector(".val-greutate").textContent);
            const descriereProdus = produs.querySelector(".descriere").textContent.toLowerCase();
            const categorieProdus = produs.querySelector(".val-categorie").textContent.toLowerCase();
            const tipProdus = produs.querySelector(".val-tip").textContent.toLowerCase();
            
            // CORECTARE: Obținem caracteristicile produsului din clasa elementelor li
            const caracteristiciProdus = [];
            const listaCaracteristici = produs.querySelectorAll(".caracteristici li");
            for (const caracteristica of listaCaracteristici) {
                caracteristiciProdus.push(caracteristica.textContent.toLowerCase());
            }
            
            // Debug pentru a vedea caracteristicile
            console.log("Caracteristici pentru produsul", numeProdus, ":", caracteristiciProdus);
            console.log("Caracteristici selectate:", caracteristiciSelectate);
            
            // Verificăm dacă produsul trece de toate filtrele
            let conditieNume = numeProdus.includes(numeFiltru);
            let conditiePret = pretProdus >= pretMinim;
            let conditieGreutate = greutateProdus >= greutateMin && greutateProdus <= greutateMax;
            
            // Verificare pentru cuvinte cheie în descriere (trebuie să conțină cel puțin unul)
            let conditieDescriere = true;
            if (cuvinteDescriere.length > 0) {
                conditieDescriere = cuvinteDescriere.some(cuvant => descriereProdus.includes(cuvant));
            }
            
            // CORECTARE: Verificare pentru caracteristici (trebuie să conțină TOATE caracteristicile selectate)
            let conditieCaracteristici = true;
            if (caracteristiciSelectate.length > 0) {
                conditieCaracteristici = caracteristiciSelectate.every(caracteristicaSelectata => {
                    // Verificăm dacă cel puțin o caracteristică a produsului conține caracteristica selectată
                    return caracteristiciProdus.some(caracteristicaProdus => 
                        caracteristicaProdus.includes(caracteristicaSelectata)
                    );
                });
            }
            
            // Verificare pentru categorie
            let conditieCategorie = categorieSelectata === "toate" || categorieProdus === categorieSelectata;
            
            // Verificare pentru tip produs
            let conditieTip = tipuriSelectate.length === 0 || tipuriSelectate.includes(tipProdus);
            
            // Verificare pentru brand
            let conditieBrand = brandFiltru === "" || numeProdus.includes(brandFiltru);
            
            // Afișăm sau ascundem produsul în funcție de toate condițiile
            if (conditieNume && conditiePret && conditieGreutate && conditieDescriere && 
                conditieCaracteristici && conditieCategorie && conditieTip && conditieBrand) {
                produs.style.display = "flex";
            } else {
                produs.style.display = "none";
            }
        }
    }
    
    // FUNCTIE PENTRU SORTARE PRODUSE
    function sorteazaProduse(crescator = true) {
        if (!validateInputs()) {
            return;
        }
        
        // Obținem lista de produse ca array pentru a putea sorta
        const produseArray = Array.from(produse);
        
        // Sortăm produsele după preț și nume
        produseArray.sort((a, b) => {
            const pretA = parseFloat(a.querySelector(".val-pret").textContent);
            const pretB = parseFloat(b.querySelector(".val-pret").textContent);
            
            // Dacă prețurile sunt egale, sortăm după nume
            if (pretA === pretB) {
                const numeA = a.querySelector(".val-nume").textContent.toLowerCase();
                const numeB = b.querySelector(".val-nume").textContent.toLowerCase();
                
                return crescator ? numeA.localeCompare(numeB) : numeB.localeCompare(numeA);
            }
            
            // Sortăm după preț
            return crescator ? pretA - pretB : pretB - pretA;
        });
        
        // Reordonăm DOM-ul în funcție de sortare
        const container = document.querySelector(".grid-produse");
        produseArray.forEach(produs => {
            container.appendChild(produs);
        });
    }
    
    // FUNCTIE PENTRU CALCULARE SUMA PRETURI
    function calculeazaSuma() {
        let suma = 0;
        let contor = 0;
        
        // Calculăm suma prețurilor produselor vizibile
        for (const produs of produse) {
            if (produs.style.display !== "none") {
                const pret = parseFloat(produs.querySelector(".val-pret").textContent);
                suma += pret;
                contor++;
            }
        }
        
        // Creăm div-ul pentru afișarea sumei
        const divRezultat = document.createElement("div");
        divRezultat.classList.add("rezultat-calcul");
        divRezultat.innerHTML = `
            <p>Suma prețurilor pentru cele ${contor} produse afișate: <strong>${suma.toFixed(2)} RON</strong></p>
            <p>Preț mediu: <strong>${(suma / contor).toFixed(2)} RON</strong></p>
        `;
        
        // Stilizăm div-ul
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
        
        // Adăugăm div-ul în pagină
        document.body.appendChild(divRezultat);
        
        // Ștergem div-ul după 2 secunde
        setTimeout(() => {
            divRezultat.remove();
        }, 2000);
    }
    
    // FUNCTIE PENTRU RESETARE FILTRE
    function resetareFiltre() {
        // Resetăm valoarea din input-ul de nume
        inpNume.value = "";
        
        // Resetăm valoarea din range slider
        inpPret.value = 0;
        infoRange.textContent = "(0 RON)";
        
        // Resetăm radio button-urile (selectăm "toate")
        for (const radio of radioButtons) {
            radio.checked = radio.value === "toate";
        }
        
        // Resetăm textarea-ul pentru descriere
        inpDescriere.value = "";
        
        // Resetăm checkboxurile pentru caracteristici (toate bifate)
        for (const checkbox of caracteristiciCheckboxes) {
            checkbox.checked = true;
        }
        
        // Resetăm selectul pentru categorie (selectăm "toate")
        inpCategorie.value = "toate";
        
        // Resetăm selectul multiplu pentru tip produs (toate selectate)
        for (const option of inpTipProdus.options) {
            option.selected = true;
        }
        
        // Resetăm input-ul pentru brand
        inpBrand.value = "";
        
        // Afișăm toate produsele
        for (const produs of produse) {
            produs.style.display = "flex";
        }
        
        // Eliminăm clasele de eroare pentru inputuri
        inpNume.classList.remove("input-error");
        inpDescriere.classList.remove("input-error");
        inpBrand.classList.remove("input-error");
    }
    
    // EVENIMENT PENTRU FILTRARE
    if (btnFiltrare) {
        btnFiltrare.addEventListener("click", filtrareProduse);
    }
    
    // EVENIMENT PENTRU SORTARE CRESCĂTOARE
    if (btnSortCrescNume) {
        btnSortCrescNume.addEventListener("click", function() {
            sorteazaProduse(true); // Sortare crescătoare
        });
    }
    
    // EVENIMENT PENTRU SORTARE DESCRESCĂTOARE
    if (btnSortDescrescNume) {
        btnSortDescrescNume.addEventListener("click", function() {
            sorteazaProduse(false); // Sortare descrescătoare
        });
    }
    
    // EVENIMENT PENTRU CALCUL SUMĂ
    if (btnCalculeazaSuma) {
        btnCalculeazaSuma.addEventListener("click", calculeazaSuma);
    }
    
    // EVENIMENT PENTRU RESETARE
    if (btnResetare) {
        btnResetare.addEventListener("click", function() {
            if (confirm("Ești sigur că vrei să resetezi toate filtrele?")) {
                resetareFiltre();
            }
        });
    }
    
    // EVENIMENT PENTRU TASTATURA (ALT + C pentru calcul sumă)
    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key.toLowerCase() === "c") {
            calculeazaSuma();
        }
    });
});