document.addEventListener('DOMContentLoaded', function() {
    console.log("Script comparare produse incarcat");
    
    // Verificam daca suntem pe o pagina relevanta
    const estePaginaProduse = document.querySelector('.grid-produse') !== null;
    const estePaginaProdus = document.querySelector('#art-produs') !== null;
    const esteProduseSimilare = document.querySelector('.grid-produse-similare') !== null;
    
    if (estePaginaProduse || estePaginaProdus || esteProduseSimilare) {
        // Initializam sistemul de comparare
        initComparare();
        restaureazaStare();
        verificaDataUltimaActiune();
    }
    
    // Functie principala de initializare
    function initComparare() {
        // Cream containerul daca nu exista
        let containerComparare = document.getElementById('container-comparare');
        if (!containerComparare) {
            containerComparare = document.createElement('div');
            containerComparare.id = 'container-comparare';
            containerComparare.classList.add('container-comparare');
            containerComparare.style.display = 'none'; // IMPORTANT: Ascuns complet inițial
            
            // Structura HTML pentru container
            containerComparare.innerHTML = `
                <h3>Produse de comparat</h3>
                <ul id="lista-comparare" class="lista-comparare">
                    <!-- Produsele selectate vor fi adăugate aici -->
                </ul>
                <button id="btn-afiseaza-comparatie" class="btn-afiseaza-comparatie" style="display: none;">
                    <i class="fas fa-balance-scale"></i> Afișează comparația
                </button>
            `;
            
            document.body.appendChild(containerComparare);
        } else {
            // Dacă există deja, ne asigurăm că este ascuns
            containerComparare.style.display = 'none';
        }
        
        // Adaugam butoanele de comparare pentru diferite tipuri de pagini
        if (estePaginaProduse) {
            adaugaButoaneProduse();
        } else if (estePaginaProdus) {
            adaugaButonProdus();
        }
        
        // Adaugam event listeners pentru butoanele din produse similare
        if (esteProduseSimilare) {
            adaugaEventListenersProduseSimilare();
        }
        
        // Event listener pentru butonul de afișare comparație
        const btnAfiseazaComparatie = document.getElementById('btn-afiseaza-comparatie');
        if (btnAfiseazaComparatie) {
            btnAfiseazaComparatie.addEventListener('click', afiseazaComparatie);
        }
    }
    
    // Adauga event listeners pentru butoanele din produse similare
    function adaugaEventListenersProduseSimilare() {
        console.log("Adaugam event listeners pentru produse similare");
        document.querySelectorAll('.btn-compara-similar').forEach(buton => {
            buton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const id = this.getAttribute('data-id');
                const nume = this.getAttribute('data-nume');
                console.log("Buton comparare apăsat pentru:", nume, "ID:", id);
                adaugaProdusComparare(id, nume, this);
            });
        });
    }
    
    // Adauga butoane de comparare pentru lista de produse
    function adaugaButoaneProduse() {
        document.querySelectorAll('.produs').forEach(produs => {
            if (produs.querySelector('.btn-compara')) return;
            
            const idProdus = produs.id.replace('ent', '');
            const numeProdus = produs.querySelector('.val-nume').textContent.trim();
            
            const buton = creeazaButonCompara(idProdus, numeProdus);
            
            // Adauga butonul in produs
            const selectareContainer = produs.querySelector('.selecteaza-cos');
            if (selectareContainer) {
                selectareContainer.parentNode.insertBefore(buton, selectareContainer.nextSibling);
            } else {
                produs.appendChild(buton);
            }
        });
    }
    
    // Adauga buton de comparare pentru pagina de produs individual
    function adaugaButonProdus() {
        const articolProdus = document.querySelector('#art-produs');
        if (articolProdus.querySelector('.btn-compara')) return;
        
        const url = window.location.pathname;
        const idProdus = url.substring(url.lastIndexOf('/') + 1);
        const numeProdus = articolProdus.querySelector('h3 .nume').textContent.trim();
        
        const buton = creeazaButonCompara(idProdus, numeProdus, true);
        
        // Adauga butonul in pagina
        const btnAdaugaCos = articolProdus.querySelector('.btn-adauga-cos');
        if (btnAdaugaCos && btnAdaugaCos.parentNode) {
            // Cream un container pentru butoane daca nu exista
            let containerButoane = btnAdaugaCos.parentNode.querySelector('.container-butoane-produs');
            if (!containerButoane) {
                containerButoane = document.createElement('div');
                containerButoane.className = 'container-butoane-produs';
                containerButoane.style.display = 'flex';
                containerButoane.style.gap = '1rem';
                containerButoane.style.alignItems = 'center';
                
                // Mutam butonul de adaugare in cos in noul container
                btnAdaugaCos.parentNode.insertBefore(containerButoane, btnAdaugaCos);
                containerButoane.appendChild(btnAdaugaCos);
            }
            
            containerButoane.appendChild(buton);
        }
    }
    
    // Creeaza un buton de comparare
    function creeazaButonCompara(id, nume, isPaginaProdus = false) {
        const buton = document.createElement('button');
        buton.classList.add('btn-compara');
        
        if (isPaginaProdus) {
            buton.classList.add('btn-compara-produs');
            buton.style.backgroundColor = '#C05F3E';
            buton.style.color = 'white';
            buton.style.border = 'none';
            buton.style.padding = '0.8rem 1.2rem';
            buton.style.borderRadius = '6px';
            buton.style.cursor = 'pointer';
            buton.style.fontWeight = 'bold';
            buton.style.transition = 'all 0.3s ease';
            buton.style.display = 'flex';
            buton.style.alignItems = 'center';
            buton.style.gap = '0.5rem';
            buton.innerHTML = '<i class="fas fa-balance-scale"></i> Compară';
        } else {
            buton.innerHTML = '<i class="fas fa-balance-scale"></i>';
            buton.title = 'Adaugă la comparare';
        }
        
        buton.setAttribute('data-id', id);
        buton.setAttribute('data-nume', nume);
        
        buton.addEventListener('click', function(e) {
            e.preventDefault();
            adaugaProdusComparare(id, nume, this);
        });
        
        return buton;
    }
    
    // Adauga un produs la comparare
    function adaugaProdusComparare(id, nume, buton) {
        console.log("Încercăm să adăugăm produs la comparare:", nume, "ID:", id);
        
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        if (produseComparare.find(p => p.id === id)) {
            showNotification('Acest produs este deja în lista de comparare.', 'warning');
            return;
        }
        
        if (produseComparare.length >= 2) {
            showNotification('Nu puteți compara mai mult de 2 produse. Ștergeți un produs din lista de comparare.', 'warning');
            return;
        }
        
        // Adauga produsul
        produseComparare.push({
            id: id,
            nume: nume,
            dataAdaugare: new Date().toISOString()
        });
        
        console.log("Produs adăugat la comparare. Total produse:", produseComparare.length);
        
        // Salveaza si actualizeaza
        localStorage.setItem('produseComparare', JSON.stringify(produseComparare));
        localStorage.setItem('ultimaActiuneComparare', new Date().toISOString());
        actualizeazaContainerComparare();
        actualizeazaButoane();
        
        // Feedback vizual pentru buton
        const originalBg = buton.style.backgroundColor || getComputedStyle(buton).backgroundColor;
        const originalContent = buton.innerHTML;
        
        buton.style.backgroundColor = '#5CB85C';
        buton.innerHTML = buton.classList.contains('btn-compara-produs') ? 
            '<i class="fas fa-check"></i> Adăugat' : 
            '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            buton.style.backgroundColor = originalBg;
            buton.innerHTML = originalContent;
        }, 1500);
        
        showNotification('Produs adăugat la comparare!', 'success');
    }
    
    // Sterge un produs din comparare
    function stergeProdusComparare(id) {
        console.log("Ștergem produs din comparare:", id);
        
        let produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        produseComparare = produseComparare.filter(p => p.id !== id);
        
        localStorage.setItem('produseComparare', JSON.stringify(produseComparare));
        localStorage.setItem('ultimaActiuneComparare', new Date().toISOString());
        actualizeazaContainerComparare();
        actualizeazaButoane();
        showNotification('Produs eliminat din comparare.', 'info');
    }
    
    // Actualizeaza containerul de comparare
    function actualizeazaContainerComparare() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        const container = document.getElementById('container-comparare');
        const lista = document.getElementById('lista-comparare');
        const butonComparatie = document.getElementById('btn-afiseaza-comparatie');
        
        if (!container || !lista || !butonComparatie) {
            console.error("Nu am găsit elementele containerului de comparare");
            return;
        }
        
        console.log("Actualizăm container comparare. Produse:", produseComparare.length);
        
        // IMPORTANT: Golim lista
        lista.innerHTML = '';
        
        // Daca nu avem produse, ASCUNDEM COMPLET containerul
        if (produseComparare.length === 0) {
            container.style.display = 'none';
            container.classList.remove('visible');
            activeazaButoanele();
            console.log("Container ascuns - nu există produse de comparat");
            return;
        }
        
        // AFIȘĂM containerul când avem produse
        container.style.display = 'block';
        container.classList.add('visible');
        console.log("Container afișat - există produse de comparat");
        
        // Adauga produsele in lista
        produseComparare.forEach(produs => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="nume-produs-comparare">${produs.nume}</span>
                <button class="btn-sterge-comparare" data-id="${produs.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Adaugam event listener pentru butonul de stergere
            const butonSterge = li.querySelector('.btn-sterge-comparare');
            butonSterge.addEventListener('click', () => stergeProdusComparare(produs.id));
            
            lista.appendChild(li);
        });
        
        // Afisam butonul de comparatie daca avem 2 produse
        if (produseComparare.length === 2) {
            butonComparatie.style.display = 'block';
            dezactiveazaButoanele();
        } else {
            butonComparatie.style.display = 'none';
            activeazaButoanele();
        }
    }
    
    // Actualizeaza starea butoanelor
    function actualizeazaButoane() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        const butoane = document.querySelectorAll('.btn-compara, .btn-compara-similar');
        
        butoane.forEach(buton => {
            const id = buton.getAttribute('data-id');
            const esteAdaugat = produseComparare.find(p => p.id === id);
            const listaPlinaPentruAltele = produseComparare.length >= 2 && !esteAdaugat;
            
            if (listaPlinaPentruAltele) {
                buton.disabled = true;
                buton.style.opacity = '0.5';
                buton.style.cursor = 'not-allowed';
                buton.title = 'Ștergeți un produs din listă pentru a adăuga altul';
            } else {
                buton.disabled = false;
                buton.style.opacity = '1';
                buton.style.cursor = 'pointer';
                buton.title = esteAdaugat ? 'Produs adăugat la comparare' : 'Adaugă la comparare';
            }
        });
    }
    
    // Afiseaza comparatia
    function afiseazaComparatie() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        if (produseComparare.length !== 2) {
            showNotification('Trebuie să selectați exact 2 produse pentru comparație.', 'warning');
            return;
        }
        
        // Cream popup-ul
        const popup = document.createElement('div');
        popup.classList.add('popup-comparatie');
        
        const continut = document.createElement('div');
        continut.classList.add('continut-popup');
        
        // Buton inchidere
        const butonInchide = document.createElement('button');
        butonInchide.className = 'btn-inchide-popup';
        butonInchide.innerHTML = '<i class="fas fa-times"></i>';
        butonInchide.addEventListener('click', () => popup.remove());
        continut.appendChild(butonInchide);
        
        // Titlu
        const titlu = document.createElement('h2');
        titlu.textContent = 'Comparație Produse';
        titlu.style.textAlign = 'center';
        titlu.style.marginBottom = '1rem';
        titlu.style.color = '#2D1A19';
        continut.appendChild(titlu);
        
        // Obtinem datele si cream tabelul
        obtineSiComparaProdusele(produseComparare[0].id, produseComparare[1].id, continut);
        
        popup.appendChild(continut);
        document.body.appendChild(popup);
        
        // Inchidere la click pe fundal
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
        
        // Inchidere cu ESC
        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                popup.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        });
    }
    
    // Functii helper
    function activeazaButoanele() {
        const butoane = document.querySelectorAll('.btn-compara, .btn-compara-similar');
        butoane.forEach(buton => {
            if (!buton.disabled) {
                buton.style.opacity = '1';
                buton.style.cursor = 'pointer';
                buton.title = 'Adaugă la comparare';
            }
        });
    }
    
    function dezactiveazaButoanele() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        const butoane = document.querySelectorAll('.btn-compara, .btn-compara-similar');
        
        butoane.forEach(buton => {
            const id = buton.getAttribute('data-id');
            const esteAdaugat = produseComparare.find(p => p.id === id);
            
            if (!esteAdaugat) {
                buton.disabled = true;
                buton.style.opacity = '0.5';
                buton.style.cursor = 'not-allowed';
                buton.title = 'Ștergeți un produs din listă pentru a adăuga altul';
            }
        });
    }
    
    function restaureazaStare() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        if (produseComparare.length > 0) {
            actualizeazaContainerComparare();
            actualizeazaButoane();
        } else {
            // Ne asigurăm că containerul este ascuns dacă nu există produse
            const container = document.getElementById('container-comparare');
            if (container) {
                container.style.display = 'none';
                container.classList.remove('visible');
            }
        }
    }
    
    function verificaDataUltimaActiune() {
        const ultimaActiune = localStorage.getItem('ultimaActiuneComparare');
        if (!ultimaActiune) return;
        
        const dataUltimaActiune = new Date(ultimaActiune);
        const dataActuala = new Date();
        
        // Verifica daca a trecut o zi (24 ore)
        if (dataActuala - dataUltimaActiune > 86400000) {
            localStorage.removeItem('produseComparare');
            localStorage.removeItem('ultimaActiuneComparare');
            const container = document.getElementById('container-comparare');
            if (container) {
                container.style.display = 'none';
                container.classList.remove('visible');
            }
        }
    }
    
    // Functia pentru obtinerea datelor produselor si crearea tabelului de comparatie
    function obtineSiComparaProdusele(id1, id2, container) {
        // Incercam mai intai sa gasim produsele in pagina curenta
        let produs1Data = gasesteProdusDupaId(id1);
        let produs2Data = gasesteProdusDupaId(id2);
        
        // Daca am gasit ambele produse, cream tabelul de comparatie
        if (produs1Data && produs2Data) {
            creeazaTabelComparatie(produs1Data, produs2Data, container);
        } else {
            // Daca nu am gasit produsele, afisam un mesaj de eroare
            const mesajEroare = document.createElement('p');
            mesajEroare.textContent = 'Nu am putut obține datele complete ale produselor pentru comparație.';
            mesajEroare.style.color = '#A52A2A';
            mesajEroare.style.fontWeight = 'bold';
            mesajEroare.style.textAlign = 'center';
            mesajEroare.style.marginTop = '20px';
            container.appendChild(mesajEroare);
            
            // Incercam sa folosim datele pe care le avem
            const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
            const produs1 = produseComparare.find(p => p.id === id1) || {nume: 'Produs 1'};
            const produs2 = produseComparare.find(p => p.id === id2) || {nume: 'Produs 2'};
            
            creeazaTabelComparatie(
                produs1Data || {nume: produs1.nume, categorie: 'N/A', pret: 'N/A', greutate: 'N/A', tip_produs: 'N/A', pentru_incepatori: 'N/A', data_adaugare: 'N/A', caracteristici: []}, 
                produs2Data || {nume: produs2.nume, categorie: 'N/A', pret: 'N/A', greutate: 'N/A', tip_produs: 'N/A', pentru_incepatori: 'N/A', data_adaugare: 'N/A', caracteristici: []}, 
                container
            );
        }
    }
    
    // Functie pentru a gasi un produs in pagina curenta dupa ID
    function gasesteProdusDupaId(id) {
        // Verificam daca suntem pe pagina de lista produse
        const produseElements = document.querySelectorAll('.produs');
        for (const element of produseElements) {
            const produsId = element.id.replace('ent', '');
            if (produsId === id) {
                return extrageDataDinElementProdus(element, produsId);
            }
        }
        
        // Verificam daca suntem pe pagina de produs individual
        const articolProdus = document.querySelector('#art-produs');
        if (articolProdus) {
            const url = window.location.pathname;
            const produsId = url.substring(url.lastIndexOf('/') + 1);
            
            if (produsId === id) {
                return extrageDataDinPaginaProdus(articolProdus, produsId);
            }
        }
        
        // Verificam in produsele similare
        const produseSimilare = document.querySelectorAll('.card-produs-similar');
        for (const element of produseSimilare) {
            const butonCompara = element.querySelector('.btn-compara-similar');
            if (butonCompara && butonCompara.getAttribute('data-id') === id) {
                return extrageDataDinCardSimilar(element, id);
            }
        }
        
        return null;
    }
    
    // Extrage date din element produs (lista produse)
    function extrageDataDinElementProdus(element, id) {
        return {
            id: id,
            nume: element.querySelector('.val-nume')?.textContent.trim() || 'N/A',
            categorie: element.querySelector('.val-categorie')?.textContent.trim() || 'N/A',
            pret: element.querySelector('.val-pret')?.textContent.trim() || 'N/A',
            greutate: element.querySelector('.val-greutate')?.textContent.trim() || 'N/A',
            tip_produs: element.querySelector('.val-tip')?.textContent.trim() || 'N/A',
            pentru_incepatori: element.querySelector('.val-incepatori i.fa-check') ? 'Da' : 'Nu',
            data_adaugare: element.querySelector('time')?.textContent.trim() || 'N/A',
            descriere: element.querySelector('.descriere')?.textContent.trim() || 'N/A',
            caracteristici: Array.from(element.querySelectorAll('.caracteristici li')).map(li => li.textContent.trim())
        };
    }
    
    // Extrage date din pagina de produs individual
    function extrageDataDinPaginaProdus(articol, id) {
        return {
            id: id,
            nume: articol.querySelector('h3 .nume')?.textContent.trim() || 'N/A',
            categorie: articol.querySelector('.badge-categorie')?.textContent.trim() || 'N/A',
            pret: articol.querySelector('.pret')?.textContent.trim() || 'N/A',
            greutate: getValueFromTable(articol, 'Greutate:') || 'N/A',
            tip_produs: getValueFromTable(articol, 'Tip produs:') || 'N/A',
            pentru_incepatori: getValueFromTable(articol, 'Pentru începători:')?.includes('Da') ? 'Da' : 'Nu',
            data_adaugare: getValueFromTable(articol, 'Data adăugare:') || 'N/A',
            descriere: articol.querySelector('.descriere')?.textContent.trim() || 'N/A',
            caracteristici: Array.from(articol.querySelectorAll('.caracteristici-lista li')).map(li => li.textContent.trim())
        };
    }
    
    // Extrage date din card produs similar
    function extrageDataDinCardSimilar(element, id) {
        const butonCompara = element.querySelector('.btn-compara-similar');
        const nume = butonCompara?.getAttribute('data-nume') || 'N/A';
        
        return {
            id: id,
            nume: nume,
            categorie: 'N/A',
            pret: element.querySelector('.pret-similar')?.textContent.trim() || 'N/A',
            greutate: 'N/A',
            tip_produs: element.querySelector('.tip-similar')?.textContent.trim() || 'N/A',
            pentru_incepatori: element.querySelector('.badge-incepatori') ? 'Da' : 'Nu',
            data_adaugare: 'N/A',
            descriere: 'N/A',
            caracteristici: Array.from(element.querySelectorAll('.caracteristici-similare li')).map(li => li.textContent.trim())
        };
    }
    
    // Functie pentru a extrage o valoare din tabelul de specificatii tehnice
    function getValueFromTable(container, label) {
        const rows = container.querySelectorAll('.detalii-tehnice table tr');
        for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');
            if (th && td && th.textContent.trim() === label) {
                return td.textContent.trim();
            }
        }
        return null;
    }
    
    // Functie pentru a crea tabelul de comparatie cu datele reale ale produselor
    function creeazaTabelComparatie(produs1, produs2, container) {
        // Cream tabelul
        const tabel = document.createElement('table');
        tabel.classList.add('tabel-comparatie');
        
        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        ['Caracteristica', produs1.nume || 'Produs 1', produs2.nume || 'Produs 2'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        tabel.appendChild(thead);
        
        // Corpul tabelului
        const tbody = document.createElement('tbody');
        
        // Caracteristicile de comparat
        const caracteristici = [
            { nume: 'Categorie', p1: produs1.categorie, p2: produs2.categorie },
            { nume: 'Preț', p1: produs1.pret, p2: produs2.pret },
            { nume: 'Greutate', p1: produs1.greutate, p2: produs2.greutate },
            { nume: 'Tip produs', p1: produs1.tip_produs, p2: produs2.tip_produs },
            { nume: 'Pentru începători', p1: produs1.pentru_incepatori, p2: produs2.pentru_incepatori },
            { nume: 'Data adăugare', p1: produs1.data_adaugare, p2: produs2.data_adaugare }
        ];
        
        // Adaugam descrierea daca exista
        if (produs1.descriere !== 'N/A' || produs2.descriere !== 'N/A') {
            caracteristici.push({ nume: 'Descriere', p1: produs1.descriere, p2: produs2.descriere });
        }
        
        // Adaugam caracteristicile principale
        if (produs1.caracteristici.length > 0 || produs2.caracteristici.length > 0) {
            caracteristici.push({ 
                nume: 'Caracteristici', 
                p1: produs1.caracteristici.join(', ') || 'N/A', 
                p2: produs2.caracteristici.join(', ') || 'N/A' 
            });
        }
        
        // Cream randurile
        caracteristici.forEach((caracteristica, index) => {
            const row = document.createElement('tr');
            
            // Celula nume caracteristica
            const tdNume = document.createElement('td');
            tdNume.textContent = caracteristica.nume;
            tdNume.style.fontWeight = 'bold';
            row.appendChild(tdNume);
            
            // Celula valoare produs 1
            const tdP1 = document.createElement('td');
            tdP1.textContent = caracteristica.p1 || 'N/A';
            row.appendChild(tdP1);
            
            // Celula valoare produs 2
            const tdP2 = document.createElement('td');
            tdP2.textContent = caracteristica.p2 || 'N/A';
            row.appendChild(tdP2);
            
            tbody.appendChild(row);
        });
        
        tabel.appendChild(tbody);
        container.appendChild(tabel);
        
        // Adauga nota daca e cazul
        if (produs1.categorie === 'N/A' || produs2.categorie === 'N/A') {
            const nota = document.createElement('p');
            nota.textContent = 'Notă: Unele date pot fi incomplete sau indisponibile pentru comparație.';
            nota.style.fontStyle = 'italic';
            nota.style.textAlign = 'center';
            nota.style.marginTop = '1rem';
            nota.style.color = '#666';
            container.appendChild(nota);
        }
    }
    
    // Functie pentru afisarea notificarilor
    function showNotification(message, type = 'info', duration = 3000) {
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
        notification.style.zIndex = '10001';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        notification.style.maxWidth = '300px';
        
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
            case 'error':
                notification.style.backgroundColor = '#D9534F';
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
});