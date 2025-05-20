document.addEventListener('DOMContentLoaded', function() {
    console.log("Script comparare produse incarcat");
    
    // Verificam daca suntem pe o pagina relevanta
    const estePaginaProduse = document.querySelector('.grid-produse') !== null;
    const estePaginaProdus = document.querySelector('#art-produs') !== null;
    
    if (estePaginaProduse || estePaginaProdus) {
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
            document.body.appendChild(containerComparare);
        }
        
        // Adaugam butoanele de comparare
        if (estePaginaProduse) {
            adaugaButoaneProduse();
        } else if (estePaginaProdus) {
            adaugaButonProdus();
        }
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
        
        const buton = creeazaButonCompara(idProdus, numeProdus);
        
        // Adauga butonul in pagina
        const btnAdaugaCos = articolProdus.querySelector('.btn-adauga-cos');
        if (btnAdaugaCos && btnAdaugaCos.parentNode) {
            btnAdaugaCos.parentNode.insertBefore(buton, btnAdaugaCos);
        } else {
            const headerProdus = articolProdus.querySelector('.produs-header');
            if (headerProdus) {
                headerProdus.appendChild(buton);
            }
        }
    }
    
    // Creeaza un buton de comparare
    function creeazaButonCompara(id, nume) {
        const buton = document.createElement('button');
        buton.classList.add('btn-compara');
        buton.setAttribute('data-id', id);
        buton.setAttribute('data-nume', nume);
        buton.textContent = 'Compara';
        
        buton.addEventListener('click', function(e) {
            e.preventDefault();
            adaugaProdusComparare(id, nume);
        });
        
        return buton;
    }
    
    // Adauga un produs la comparare
    function adaugaProdusComparare(id, nume) {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        if (produseComparare.find(p => p.id === id)) {
            alert('Acest produs este deja in lista de comparare.');
            return;
        }
        
        if (produseComparare.length >= 2) {
            alert('Nu puteti compara mai mult de 2 produse. Stergeti un produs din lista de comparare.');
            return;
        }
        
        // Adauga produsul
        produseComparare.push({
            id: id,
            nume: nume,
            dataAdaugare: new Date().toISOString()
        });
        
        // Salveaza si actualizeaza
        localStorage.setItem('produseComparare', JSON.stringify(produseComparare));
        localStorage.setItem('ultimaActiuneComparare', new Date().toISOString());
        actualizeazaContainerComparare();
    }
    
    // Sterge un produs din comparare
    function stergeProdusComparare(id) {
        let produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        produseComparare = produseComparare.filter(p => p.id !== id);
        
        localStorage.setItem('produseComparare', JSON.stringify(produseComparare));
        localStorage.setItem('ultimaActiuneComparare', new Date().toISOString());
        actualizeazaContainerComparare();
    }
    
    // Actualizeaza containerul de comparare
    function actualizeazaContainerComparare() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        const container = document.getElementById('container-comparare');
        
        if (!container) return;
        
        // Goleste containerul
        container.innerHTML = '';
        
        // Daca nu avem produse, ascunde containerul
        if (produseComparare.length === 0) {
            container.style.display = 'none';
            activeazaButoanele();
            return;
        }
        
        // Adauga titlu
        const titlu = document.createElement('h3');
        titlu.textContent = 'Produse de comparat';
        container.appendChild(titlu);
        
        // Adauga lista produse
        const lista = document.createElement('ul');
        produseComparare.forEach(produs => {
            const item = document.createElement('li');
            
            const numeProdus = document.createElement('span');
            numeProdus.textContent = produs.nume;
            item.appendChild(numeProdus);
            
            const butonSterge = document.createElement('button');
            butonSterge.textContent = 'Sterge';
            butonSterge.setAttribute('data-id', produs.id);
            butonSterge.addEventListener('click', () => stergeProdusComparare(produs.id));
            item.appendChild(butonSterge);
            
            lista.appendChild(item);
        });
        container.appendChild(lista);
        
        // Adauga butonul de comparare daca avem 2 produse
        if (produseComparare.length === 2) {
            const butonAfiseaza = document.createElement('button');
            butonAfiseaza.textContent = 'Afiseaza comparatie';
            butonAfiseaza.addEventListener('click', afiseazaComparatie);
            container.appendChild(butonAfiseaza);
            dezactiveazaButoanele();
        } else {
            activeazaButoanele();
        }
        
        // Afiseaza containerul
        container.style.display = 'block';
    }
    
    // Afiseaza comparatia
    function afiseazaComparatie() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        if (produseComparare.length !== 2) {
            alert('Trebuie sa selectati exact 2 produse pentru comparatie.');
            return;
        }
        
        // Cream popup-ul
        const popup = document.createElement('div');
        popup.classList.add('popup-comparatie');
        
        const continut = document.createElement('div');
        continut.classList.add('continut-popup');
        
        // Buton inchidere
        const butonInchide = document.createElement('button');
        butonInchide.textContent = 'X';
        butonInchide.addEventListener('click', () => popup.remove());
        continut.appendChild(butonInchide);
        
        // Titlu
        const titlu = document.createElement('h2');
        titlu.textContent = 'Comparatie Produse';
        continut.appendChild(titlu);
        
        // Numele produselor
        const headerProduse = document.createElement('div');
        headerProduse.style.display = 'flex';
        headerProduse.style.justifyContent = 'space-between';
        headerProduse.style.marginBottom = '20px';
        
        const numeProdus1 = document.createElement('h3');
        numeProdus1.textContent = produseComparare[0].nume;
        numeProdus1.style.flex = '1';
        numeProdus1.style.textAlign = 'center';
        headerProduse.appendChild(numeProdus1);
        
        const numeProdus2 = document.createElement('h3');
        numeProdus2.textContent = produseComparare[1].nume;
        numeProdus2.style.flex = '1';
        numeProdus2.style.textAlign = 'center';
        headerProduse.appendChild(numeProdus2);
        
        continut.appendChild(headerProduse);
        
        // Obtinem datele si cream tabelul
        obtineSiComparaProdusele(produseComparare[0].id, produseComparare[1].id, continut);
        
        popup.appendChild(continut);
        document.body.appendChild(popup);
    }
    
    // Functii helper
    function activeazaButoanele() {
        document.querySelectorAll('.btn-compara').forEach(buton => {
            buton.disabled = false;
            buton.style.opacity = '1';
            buton.style.cursor = 'pointer';
            buton.title = '';
        });
    }
    
    function dezactiveazaButoanele() {
        document.querySelectorAll('.btn-compara').forEach(buton => {
            buton.disabled = true;
            buton.style.opacity = '0.5';
            buton.style.cursor = 'not-allowed';
            buton.title = 'Stergeti un produs din lista de comparare';
        });
    }
    
    function restaureazaStare() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        if (produseComparare.length > 0) {
            actualizeazaContainerComparare();
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
            const container = document.getElementById('container-comparare');
            if (container) {
                container.style.display = 'none';
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
            mesajEroare.textContent = 'Nu am putut obtine datele complete ale produselor pentru comparatie.';
            mesajEroare.style.color = '#A52A2A';
            mesajEroare.style.fontWeight = 'bold';
            mesajEroare.style.textAlign = 'center';
            mesajEroare.style.marginTop = '20px';
            container.appendChild(mesajEroare);
            
            // Incercam sa folosim datele pe care le avem
            creeazaTabelComparatie(
                produs1Data || {nume: 'Produs 1', categorie: 'N/A', pret: 'N/A', greutate: 'N/A', tip_produs: 'N/A', pentru_incepatori: 'N/A', data_adaugare: 'N/A', caracteristici: []}, 
                produs2Data || {nume: 'Produs 2', categorie: 'N/A', pret: 'N/A', greutate: 'N/A', tip_produs: 'N/A', pentru_incepatori: 'N/A', data_adaugare: 'N/A', caracteristici: []}, 
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
                // Am gasit produsul, extragem datele
                return {
                    id: produsId,
                    nume: element.querySelector('.val-nume').textContent.trim(),
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
        }
        
        // Verificam daca suntem pe pagina de produs individual
        const articolProdus = document.querySelector('#art-produs');
        if (articolProdus) {
            const url = window.location.pathname;
            const produsId = url.substring(url.lastIndexOf('/') + 1);
            
            if (produsId === id) {
                // Extragem datele din pagina de produs individual
                return {
                    id: produsId,
                    nume: articolProdus.querySelector('h3 .nume')?.textContent.trim() || 'N/A',
                    categorie: articolProdus.querySelector('.badge-categorie')?.textContent.trim() || 'N/A',
                    pret: articolProdus.querySelector('.pret')?.textContent.trim() || 'N/A',
                    greutate: getValueFromTable(articolProdus, 'Greutate:') || 'N/A',
                    tip_produs: getValueFromTable(articolProdus, 'Tip produs:') || 'N/A',
                    pentru_incepatori: getValueFromTable(articolProdus, 'Pentru incepatori:')?.includes('Da') ? 'Da' : 'Nu',
                    data_adaugare: getValueFromTable(articolProdus, 'Data adaugare:') || 'N/A',
                    descriere: articolProdus.querySelector('.descriere')?.textContent.trim() || 'N/A',
                    caracteristici: Array.from(articolProdus.querySelectorAll('.caracteristici-lista li')).map(li => li.textContent.trim())
                };
            }
        }
        
        // Incercam sa obtinem datele din localStorage
        try {
            const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
            const produsStorat = produseComparare.find(p => p.id === id);
            if (produsStorat) {
                return {
                    id: produsStorat.id,
                    nume: produsStorat.nume,
                    categorie: 'N/A',
                    pret: 'N/A',
                    greutate: 'N/A',
                    tip_produs: 'N/A',
                    pentru_incepatori: 'N/A',
                    data_adaugare: 'N/A',
                    caracteristici: []
                };
            }
        } catch (error) {
            console.error("Eroare la obtinerea datelor din localStorage:", error);
        }
        
        return null;
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
            { nume: 'Pret', p1: produs1.pret, p2: produs2.pret },
            { nume: 'Greutate', p1: produs1.greutate, p2: produs2.greutate },
            { nume: 'Tip produs', p1: produs1.tip_produs, p2: produs2.tip_produs },
            { nume: 'Pentru incepatori', p1: produs1.pentru_incepatori, p2: produs2.pentru_incepatori },
            { nume: 'Data adaugare', p1: produs1.data_adaugare, p2: produs2.data_adaugare },
            { nume: 'Material', 
              p1: (produs1.caracteristici || []).filter(c => 
                  c.toLowerCase().includes('mahon') || 
                  c.toLowerCase().includes('artar') || 
                  c.toLowerCase().includes('molid') || 
                  c.toLowerCase().includes('palisandru')).join(', ') || 'N/A',
              p2: (produs2.caracteristici || []).filter(c => 
                  c.toLowerCase().includes('mahon') || 
                  c.toLowerCase().includes('artar') || 
                  c.toLowerCase().includes('molid') || 
                  c.toLowerCase().includes('palisandru')).join(', ') || 'N/A'
            },
            { nume: 'Pickups', 
              p1: (produs1.caracteristici || []).filter(c => 
                  c.toLowerCase().includes('humbucker') || 
                  c.toLowerCase().includes('pickup')).join(', ') || 'N/A',
              p2: (produs2.caracteristici || []).filter(c => 
                  c.toLowerCase().includes('humbucker') || 
                  c.toLowerCase().includes('pickup')).join(', ') || 'N/A'
            }
        ];
        
        // Adaugam descrierea daca exista
        if (produs1.descriere !== 'N/A' || produs2.descriere !== 'N/A') {
            caracteristici.push({ nume: 'Descriere', p1: produs1.descriere, p2: produs2.descriere });
        }
        
        // Cream randurile
        caracteristici.forEach((caracteristica, index) => {
            const row = document.createElement('tr');
            
            // Celula nume caracteristica
            const tdNume = document.createElement('td');
            tdNume.textContent = caracteristica.nume;
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
            nota.textContent = 'Nota: Unele date pot fi incomplete sau indisponibile pentru comparatie.';
            nota.classList.add('nota-comparatie');
            container.appendChild(nota);
        }
    }
});