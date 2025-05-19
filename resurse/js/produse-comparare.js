document.addEventListener('DOMContentLoaded', function() {
    console.log("Script comparare produse incarcat");
    
    // Verificam daca suntem pe o pagina de produse sau pagina de produs
    const estePaginaProduse = document.querySelector('.grid-produse') !== null;
    const estePaginaProdus = document.querySelector('#art-produs') !== null;
    
    if (estePaginaProduse || estePaginaProdus) {
        // Initializam containerul de comparare daca suntem pe pagina de produse
        initializareContainerComparare();
        
        // Adaugam butoanele de comparare
        if (estePaginaProduse) {
            adaugaButoaneProduse();
        } else if (estePaginaProdus) {
            adaugaButonProdus();
        }
        
        // Verifica si restaureaza starea din localStorage
        restaureazaStare();
        
        // Verifica daca a trecut o zi de la ultima actiune
        verificaDataUltimaActiune();
    }
    
    // BONUS 20 (0.2p) - Functia pentru initializarea containerului de comparare
    function initializareContainerComparare() {
        // Verifica daca containerul exista deja
        let containerComparare = document.getElementById('container-comparare');
        
        // Daca nu exista, creeaza-l
        if (!containerComparare) {
            containerComparare = document.createElement('div');
            containerComparare.id = 'container-comparare';
            containerComparare.classList.add('container-comparare');
            
            // Stil pentru container
            Object.assign(containerComparare.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '300px',
                backgroundColor: '#6B3E31',
                color: '#F7F3E8',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                zIndex: '1000',
                display: 'none'
            });
            
            // Adauga container la body
            document.body.appendChild(containerComparare);
            console.log("Container comparare creat");
        }
    }
    
    // BONUS 20 (0.1p) - Functia pentru adaugarea butoanelor de comparare pe pagina cu toate produsele
    function adaugaButoaneProduse() {
        const produse = document.querySelectorAll('.produs');
        
        produse.forEach(produs => {
            // Verifica daca exista deja un buton de comparare
            if (produs.querySelector('.btn-compara')) {
                return;
            }
            
            // Obtine ID-ul produsului
            const idProdus = produs.id.replace('ent', '');
            const numeProdus = produs.querySelector('.val-nume').textContent.trim();
            
            // Creaza butonul de comparare
            const butonCompara = document.createElement('button');
            butonCompara.classList.add('btn-compara');
            butonCompara.setAttribute('data-id', idProdus);
            butonCompara.setAttribute('data-nume', numeProdus);
            butonCompara.textContent = 'Compara';
            
            // Stil pentru buton
            Object.assign(butonCompara.style, {
                backgroundColor: '#6B3E31',
                color: '#F7F3E8',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease'
            });
            
            // Event listener pentru buton
            butonCompara.addEventListener('click', function(e) {
                e.preventDefault();
                adaugaProdusComparare(idProdus, numeProdus);
            });
            
            // Adauga butonul dupa checkboxul de selectie din cos
            const selectareContainer = produs.querySelector('.selecteaza-cos');
            if (selectareContainer) {
                selectareContainer.parentNode.insertBefore(butonCompara, selectareContainer.nextSibling);
            } else {
                // Alternativa: adauga butonul la sfarsitul produsului
                produs.appendChild(butonCompara);
            }
        });
        
        console.log("Butoane comparare adaugate pentru lista de produse");
    }
    
    // BONUS 20 (0.1p) - Functia pentru adaugarea butonului de comparare pe pagina unui produs individual
    function adaugaButonProdus() {
        const articolProdus = document.querySelector('#art-produs');
        
        // Verifica daca exista deja un buton de comparare
        if (articolProdus.querySelector('.btn-compara')) {
            return;
        }
        
        // Obtine ID-ul produsului din URL (format: /produs/ID)
        const url = window.location.pathname;
        const idProdus = url.substring(url.lastIndexOf('/') + 1);
        
        // Obtine numele produsului
        const numeProdus = articolProdus.querySelector('h3 .nume').textContent.trim();
        
        // Creaza butonul de comparare
        const butonCompara = document.createElement('button');
        butonCompara.classList.add('btn-compara');
        butonCompara.setAttribute('data-id', idProdus);
        butonCompara.setAttribute('data-nume', numeProdus);
        butonCompara.textContent = 'Compara';
        
        // Stil pentru buton
        Object.assign(butonCompara.style, {
            backgroundColor: '#6B3E31',
            color: '#F7F3E8',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
            marginBottom: '10px',  // Adauga spatiu sub buton
            display: 'block',      // Pozitioneaza butonul pe propria linie
            width: 'fit-content'   // Seteaza latimea dupa continut
        });
        
        // Event listener pentru buton
        butonCompara.addEventListener('click', function(e) {
            e.preventDefault();
            adaugaProdusComparare(idProdus, numeProdus);
        });
        
        // Adauga butonul DEASUPRA butonului "Adauga in cos"
        const btnAdaugaCos = articolProdus.querySelector('.btn-adauga-cos');
        if (btnAdaugaCos && btnAdaugaCos.parentNode) {
            // Inseram butonul inaintea containerului care contine butonul de adaugare in cos
            btnAdaugaCos.parentNode.insertBefore(butonCompara, btnAdaugaCos);
        } else {
            // Alternativa: adauga butonul in header-ul produsului
            const headerProdus = articolProdus.querySelector('.produs-header');
            if (headerProdus) {
                headerProdus.appendChild(butonCompara);
            }
        }
        
        console.log("Buton comparare adaugat pentru pagina de produs individual");
    }
    
    // BONUS 20 (0.2p) - Functia pentru adaugarea unui produs la comparare
    function adaugaProdusComparare(idProdus, numeProdus) {
        // Obtine produsele salvate sau initializeaza un array gol
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        // Verifica daca produsul exista deja
        const produsExistent = produseComparare.find(produs => produs.id === idProdus);
        
        if (!produsExistent) {
            // Verifica daca avem deja 2 produse
            if (produseComparare.length >= 2) {
                alert('Nu puteti compara mai mult de 2 produse. Stergeti un produs din lista de comparare.');
                return;
            }
            
            // Adauga produsul la lista
            produseComparare.push({
                id: idProdus,
                nume: numeProdus,
                dataAdaugare: new Date().toISOString()
            });
            
            // Salveaza lista in localStorage
            localStorage.setItem('produseComparare', JSON.stringify(produseComparare));
            
            // Actualizeaza data ultimei actiuni
            localStorage.setItem('ultimaActiuneComparare', new Date().toISOString());
            
            // Actualizeaza afisarea
            actualizeazaContainerComparare();
            
            console.log(`Produs adaugat la comparare: ${numeProdus} (ID: ${idProdus})`);
        } else {
            alert('Acest produs este deja in lista de comparare.');
        }
    }
    
    // BONUS 20 (0.2p) - Functia pentru actualizarea containerului de comparare (vizibil pe orice pagina)
    function actualizeazaContainerComparare() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        const containerComparare = document.getElementById('container-comparare');
        
        if (!containerComparare) {
            console.error("Containerul de comparare nu a fost gasit!");
            return;
        }
        
        // Goleste containerul
        containerComparare.innerHTML = '';
        
        // Verifica daca avem produse de afisat
        if (produseComparare.length === 0) {
            containerComparare.style.display = 'none';
            // Activeaza toate butoanele de comparare
            activeazaButoanele();
            return;
        }
        
        // Creeaza titlul containerului
        const titlu = document.createElement('h3');
        titlu.textContent = 'Produse de comparat';
        titlu.style.marginTop = '0';
        titlu.style.marginBottom = '15px';
        titlu.style.fontSize = '1.2rem';
        containerComparare.appendChild(titlu);
        
        // Creeaza lista de produse
        const listaProduse = document.createElement('ul');
        listaProduse.style.listStyle = 'none';
        listaProduse.style.padding = '0';
        listaProduse.style.margin = '0';
        
        produseComparare.forEach(produs => {
            const itemLista = document.createElement('li');
            itemLista.style.display = 'flex';
            itemLista.style.justifyContent = 'space-between';
            itemLista.style.alignItems = 'center';
            itemLista.style.marginBottom = '10px';
            
            const numeProdus = document.createElement('span');
            numeProdus.textContent = produs.nume;
            itemLista.appendChild(numeProdus);
            
            // BONUS 20 (0.3p) - Buton pentru stergerea unui produs din comparare
            const butonSterge = document.createElement('button');
            butonSterge.textContent = 'Sterge';
            butonSterge.setAttribute('data-id', produs.id);
            
            // Stil pentru butonul de stergere
            Object.assign(butonSterge.style, {
                backgroundColor: '#C05F3E',
                color: '#F7F3E8',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                marginLeft: '10px',
                fontSize: '0.8rem'
            });
            
            butonSterge.addEventListener('click', function() {
                stergeProdusComparare(produs.id);
            });
            
            itemLista.appendChild(butonSterge);
            listaProduse.appendChild(itemLista);
        });
        
        containerComparare.appendChild(listaProduse);
        
        // BONUS 20 (0.1p) - Adauga butonul de afisare comparatie daca avem 2 produse si dezactiveaza butoanele
        if (produseComparare.length === 2) {
            const butonAfiseaza = document.createElement('button');
            butonAfiseaza.textContent = 'Afiseaza comparatie';
            
            // Stil pentru butonul de afisare
            Object.assign(butonAfiseaza.style, {
                backgroundColor: '#2D7A4F',
                color: '#F7F3E8',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '15px',
                width: '100%',
                fontWeight: 'bold'
            });
            
            butonAfiseaza.addEventListener('click', function() {
                afiseazaComparatie();
            });
            
            containerComparare.appendChild(butonAfiseaza);
            
            // BONUS 20 (0.2p) - Dezactiveaza toate butoanele de comparare
            dezactiveazaButoanele();
        } else {
            // Activeaza toate butoanele de comparare
            activeazaButoanele();
        }
        
        // Afiseaza containerul
        containerComparare.style.display = 'block';
    }
    
    // BONUS 20 (0.3p) - Functia pentru stergerea unui produs din comparare
    function stergeProdusComparare(idProdus) {
        // Obtine produsele salvate
        let produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        // Filtreaza lista pentru a elimina produsul
        produseComparare = produseComparare.filter(produs => produs.id !== idProdus);
        
        // Salveaza lista actualizata
        localStorage.setItem('produseComparare', JSON.stringify(produseComparare));
        
        // Actualizeaza data ultimei actiuni
        localStorage.setItem('ultimaActiuneComparare', new Date().toISOString());
        
        // Actualizeaza afisarea
        actualizeazaContainerComparare();
        
        console.log(`Produs sters din comparare (ID: ${idProdus})`);
    }
    
    // BONUS 20 (0.3p) - Functia pentru afisarea comparatiei intre produse in fereastra noua
    function afiseazaComparatie() {
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        if (produseComparare.length !== 2) {
            alert('Trebuie sa selectati exact 2 produse pentru comparatie.');
            return;
        }
        
        // Alternativ, putem crea o fereastra proprie cu comparatia
        creazaFereastraComparatie(produseComparare[0], produseComparare[1]);
    }
    
    // BONUS 20 (0.3p) - Functia pentru crearea unei ferestre de comparatie
    function creazaFereastraComparatie(produs1, produs2) {
        // Cream containerul de comparatie
        const popup = document.createElement('div');
        popup.classList.add('popup-comparatie');
        
        // Stil pentru popup
        Object.assign(popup.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '2000'
        });
        
        // Creaza continutul popup-ului
        const continutPopup = document.createElement('div');
        continutPopup.classList.add('continut-popup');
        
        // Stil pentru continut
        Object.assign(continutPopup.style, {
            backgroundColor: '#F7F3E8',
            color: '#2D1A19',
            padding: '30px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '1000px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
        });
        
        // Adauga butonul de inchidere
        const butonInchide = document.createElement('button');
        butonInchide.textContent = 'X';
        
        // Stil pentru butonul de inchidere
        Object.assign(butonInchide.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#C05F3E',
            color: '#F7F3E8',
            border: 'none',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });
        
        butonInchide.addEventListener('click', function() {
            popup.remove();
        });
        
        continutPopup.appendChild(butonInchide);
        
        // Adauga titlu
        const titlu = document.createElement('h2');
        titlu.textContent = 'Comparatie Produse';
        titlu.style.marginTop = '0';
        titlu.style.marginBottom = '20px';
        titlu.style.textAlign = 'center';
        titlu.style.color = '#6B3E31';
        continutPopup.appendChild(titlu);
        
        // Adauga numele produselor
        const headerProduse = document.createElement('div');
        headerProduse.style.display = 'flex';
        headerProduse.style.justifyContent = 'space-between';
        headerProduse.style.marginBottom = '20px';
        
        const numeProdus1 = document.createElement('h3');
        numeProdus1.textContent = produs1.nume;
        numeProdus1.style.flex = '1';
        numeProdus1.style.textAlign = 'center';
        numeProdus1.style.color = '#6B3E31';
        headerProduse.appendChild(numeProdus1);
        
        const numeProdus2 = document.createElement('h3');
        numeProdus2.textContent = produs2.nume;
        numeProdus2.style.flex = '1';
        numeProdus2.style.textAlign = 'center';
        numeProdus2.style.color = '#6B3E31';
        headerProduse.appendChild(numeProdus2);
        
        continutPopup.appendChild(headerProduse);
        
        // Obtinem datele produselor si cream tabelul de comparatie
        obtineȘiComparaProdusele(produs1.id, produs2.id, continutPopup);
        
        // Adauga popup-ul la pagina
        popup.appendChild(continutPopup);
        document.body.appendChild(popup);
    }
    
    // Functia pentru obtinerea datelor produselor si crearea tabelului de comparatie
    function obtineȘiComparaProdusele(id1, id2, container) {
        // Pentru acest exemplu, vom folosi datele produselor existente in pagina
        // În mod normal, ar trebui facuta o cerere AJAX catre server
        
        // Vom crea un tabel de comparatie cu date fictive
        const tabelComparatie = document.createElement('table');
        tabelComparatie.style.width = '100%';
        tabelComparatie.style.borderCollapse = 'collapse';
        tabelComparatie.style.marginTop = '20px';
        
        // Creaza headerul tabelului
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const thCaracteristica = document.createElement('th');
        thCaracteristica.textContent = 'Caracteristica';
        thCaracteristica.style.backgroundColor = '#6B3E31';
        thCaracteristica.style.color = '#F7F3E8';
        thCaracteristica.style.padding = '10px';
        thCaracteristica.style.textAlign = 'left';
        thCaracteristica.style.border = '1px solid #ddd';
        headerRow.appendChild(thCaracteristica);
        
        const thProdus1 = document.createElement('th');
        thProdus1.textContent = 'Produs 1';
        thProdus1.style.backgroundColor = '#6B3E31';
        thProdus1.style.color = '#F7F3E8';
        thProdus1.style.padding = '10px';
        thProdus1.style.textAlign = 'center';
        thProdus1.style.border = '1px solid #ddd';
        headerRow.appendChild(thProdus1);
        
        const thProdus2 = document.createElement('th');
        thProdus2.textContent = 'Produs 2';
        thProdus2.style.backgroundColor = '#6B3E31';
        thProdus2.style.color = '#F7F3E8';
        thProdus2.style.padding = '10px';
        thProdus2.style.textAlign = 'center';
        thProdus2.style.border = '1px solid #ddd';
        headerRow.appendChild(thProdus2);
        
        thead.appendChild(headerRow);
        tabelComparatie.appendChild(thead);
        
        // Creaza corpul tabelului
        const tbody = document.createElement('tbody');
        
        // Caracteristici de comparat (acestea ar trebui obtinute dinamic)
        const caracteristici = [
            { nume: 'Categorie', p1: 'Chitare Electrice', p2: 'Chitare Acustice' },
            { nume: 'Pret', p1: '8.999 RON', p2: '4.599 RON' },
            { nume: 'Greutate', p1: '3800 g', p2: '2200 g' },
            { nume: 'Tip produs', p1: 'chitara electrica', p2: 'chitara acustica' },
            { nume: 'Pentru incepatori', p1: 'Nu', p2: 'Da' },
            { nume: 'Data adaugare', p1: '15 martie 2025', p2: '20 aprilie 2025' },
            { nume: 'Material', p1: 'Mahon, artar', p2: 'Molid, palisandru' },
            { nume: 'Pickups', p1: 'Humbucker', p2: 'N/A' },
            { nume: 'Numar corzi', p1: '6', p2: '6' },
            { nume: 'Putere', p1: 'N/A', p2: 'N/A' }
        ];
        
        caracteristici.forEach((caracteristica, index) => {
            const row = document.createElement('tr');
            
            // Celula pentru numele caracteristicii
            const tdNume = document.createElement('td');
            tdNume.textContent = caracteristica.nume;
            tdNume.style.fontWeight = 'bold';
            tdNume.style.padding = '10px';
            tdNume.style.border = '1px solid #ddd';
            tdNume.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : '#fff';
            row.appendChild(tdNume);
            
            // Celula pentru valoarea caracteristicii produsului 1
            const tdP1 = document.createElement('td');
            tdP1.textContent = caracteristica.p1;
            tdP1.style.padding = '10px';
            tdP1.style.textAlign = 'center';
            tdP1.style.border = '1px solid #ddd';
            tdP1.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : '#fff';
            row.appendChild(tdP1);
            
            // Celula pentru valoarea caracteristicii produsului 2
            const tdP2 = document.createElement('td');
            tdP2.textContent = caracteristica.p2;
            tdP2.style.padding = '10px';
            tdP2.style.textAlign = 'center';
            tdP2.style.border = '1px solid #ddd';
            tdP2.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : '#fff';
            row.appendChild(tdP2);
            
            tbody.appendChild(row);
        });
        
        tabelComparatie.appendChild(tbody);
        container.appendChild(tabelComparatie);
        
        // Adauga o nota
        const nota = document.createElement('p');
        nota.textContent = 'Nota: Aceste date sunt pentru exemplificare. In implementarea reala, datele ar trebui preluate dinamic din baza de date.';
        nota.style.marginTop = '20px';
        nota.style.fontStyle = 'italic';
        nota.style.fontSize = '0.9rem';
        nota.style.textAlign = 'center';
        container.appendChild(nota);
    }
    
    // BONUS 20 (0.2p) - Functia pentru activarea tuturor butoanelor de comparare
    function activeazaButoanele() {
        const butoane = document.querySelectorAll('.btn-compara');
        
        butoane.forEach(buton => {
            buton.disabled = false;
            buton.style.opacity = '1';
            buton.style.cursor = 'pointer';
            buton.title = '';
        });
    }
    
    // BONUS 20 (0.2p) - Functia pentru dezactivarea tuturor butoanelor de comparare
    function dezactiveazaButoanele() {
        const butoane = document.querySelectorAll('.btn-compara');
        
        butoane.forEach(buton => {
            buton.disabled = true;
            buton.style.opacity = '0.5';
            buton.style.cursor = 'not-allowed';
            buton.title = 'Stergeti un produs din lista de comparare';
        });
    }
    
    // Functia pentru restaurarea starii din localStorage
    function restaureazaStare() {
        // Verifica daca exista produse salvate
        const produseComparare = JSON.parse(localStorage.getItem('produseComparare')) || [];
        
        if (produseComparare.length > 0) {
            // Actualizeaza afisarea
            actualizeazaContainerComparare();
            console.log("Stare restaurata din localStorage");
        }
    }
    
    // BONUS 20 (0.1p) - Functia pentru verificarea datei ultimei actiuni (ascundere dupa o zi)
    function verificaDataUltimaActiune() {
        const ultimaActiune = localStorage.getItem('ultimaActiuneComparare');
        
        if (!ultimaActiune) {
            return;
        }
        
        const dataUltimaActiune = new Date(ultimaActiune);
        const dataActuala = new Date();
        
        // Calculeaza diferenta in milisecunde
        const diferenta = dataActuala - dataUltimaActiune;
        
        // Verifica daca a trecut o zi (24 de ore = 86400000 milisecunde)
        if (diferenta > 86400000) {
            // Șterge produsele salvate si ascunde containerul
            localStorage.removeItem('produseComparare');
            
            const containerComparare = document.getElementById('container-comparare');
            if (containerComparare) {
                containerComparare.style.display = 'none';
            }
            
            console.log("Au trecut 24 de ore de la ultima actiune. Produsele de comparare au fost sterse.");
        }
    }
});