// program.js - Script simplificat pentru afisarea orarului de functionare

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script orar incarcat");
    
    // Initializare
    initializareOrar();
    
    // Functia principala de initializare
    function initializareOrar() {
        // Verificam daca exista butonul de orar
        const butonOrar = document.getElementById('btn-orar');
        if (!butonOrar) {
            // Cream butonul pentru orar si il adaugam in header
            adaugaButonOrar();
        }
        
        // Verificam daca exista containerul orarului
        if (!document.getElementById('container-orar')) {
            // Încarcam template-ul orar.ejs in pagina
            incarcaTemplateOrar();
        } else {
            // Adaugam event listeners
            adaugaEventListeners();
        }
    }
    
    // Functia pentru adaugarea butonului de orar in header
    function adaugaButonOrar() {
        const headerIcons = document.querySelector('.header-icons');
        
        if (headerIcons) {
            const butonOrar = document.createElement('a');
            butonOrar.href = '#program';
            butonOrar.id = 'btn-orar';
            butonOrar.className = 'icon';
            butonOrar.innerHTML = '<i class="fas fa-clock"></i>';
            
            // Adaugam event listener pentru buton
            butonOrar.addEventListener('click', function(e) {
                e.preventDefault();
                afiseazaOrar();
            });
            
            // Adaugam butonul in header
            headerIcons.appendChild(butonOrar);
            
            console.log("Buton orar adaugat in header");
        } else {
            console.error("Nu s-a gasit containerul pentru iconuri in header");
        }
    }
    
    // Functia pentru incarcarea template-ului orar.ejs
    function incarcaTemplateOrar() {
        // Folosim fetch pentru a incarca template-ul
        fetch('/templates/orar.ejs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nu s-a putut incarca template-ul orar.ejs');
                }
                return response.text();
            })
            .then(html => {
                // Adaugam template-ul in pagina
                const template = document.createElement('div');
                template.innerHTML = html;
                document.body.appendChild(template);
                
                // Dupa incarcare, adaugam event listeners
                adaugaEventListeners();
                
                console.log("Template orar incarcat");
            })
            .catch(error => {
                console.error("Eroare la incarcarea template-ului:", error);
                
                // Daca nu putem incarca template-ul, folosim structura din fisierul HTML direct
                const orarHTML = `
                <div id="container-orar-fundal" class="container-orar-fundal"></div>
                <div id="container-orar" class="container-orar">
                    <h2>Program de functionare</h2>
                    <table id="tabel-orar">
                        <thead>
                            <tr>
                                <th>Ziua</th>
                                <th>Interval orar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr data-zi="1">
                                <td>Luni</td>
                                <td>09:00 - 18:00</td>
                            </tr>
                            <tr data-zi="2">
                                <td>Marti</td>
                                <td>09:00 - 18:00</td>
                            </tr>
                            <tr data-zi="3">
                                <td>Miercuri</td>
                                <td>09:00 - 18:00</td>
                            </tr>
                            <tr data-zi="4">
                                <td>Joi</td>
                                <td>09:00 - 20:00</td>
                            </tr>
                            <tr data-zi="5">
                                <td>Vineri</td>
                                <td>09:00 - 20:00</td>
                            </tr>
                            <tr data-zi="6">
                                <td>Sambata</td>
                                <td>10:00 - 16:00</td>
                            </tr>
                            <tr data-zi="0">
                                <td>Duminica</td>
                                <td>Inchis</td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="status-orar" class="status"></div>
                    <button id="btn-inchide-orar" class="btn-inchide">Inchide</button>
                </div>
                `;
                
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = orarHTML;
                
                while (tempContainer.firstChild) {
                    document.body.appendChild(tempContainer.firstChild);
                }
                
                adaugaEventListeners();
                console.log("Template orar creat manual");
            });
    }
    
    // Functia pentru adaugarea event listeners
    function adaugaEventListeners() {
        const butonInchide = document.getElementById('btn-inchide-orar');
        const fundal = document.getElementById('container-orar-fundal');
        
        if (butonInchide) {
            butonInchide.addEventListener('click', ascundeOrar);
        }
        
        if (fundal) {
            fundal.addEventListener('click', ascundeOrar);
        }
        
        // Adaugam tooltips pentru randurile din tabel
        adaugaTooltips();
    }
    
    // Functia pentru adaugarea tooltips
    function adaugaTooltips() {
        // Am eliminat adaugarea tooltip-urilor conform cerintelor
        console.log("Tooltips dezactivate conform cerintelor");
    }
    
    // Functia pentru afisarea orarului
    function afiseazaOrar() {
        const containerOrar = document.getElementById('container-orar');
        const fundal = document.getElementById('container-orar-fundal');
        
        if (containerOrar && fundal) {
            // Evidentiem ziua curenta si verificam statusul
            evidentiazaZiuaCurenta();
            verificaStatusDeschis();
            
            // Afisam containerul si fundalul
            fundal.style.display = 'block';
            containerOrar.style.display = 'block';
            
            // Setam un timer pentru ascunderea automata dupa 10 secunde
            setTimeout(function() {
                ascundeOrar();
            }, 10000);
            
            console.log("Orar afisat");
        } else {
            console.error("Containerul de orar nu a fost gasit");
        }
    }
    
    // Functia pentru ascunderea orarului
    function ascundeOrar() {
        const containerOrar = document.getElementById('container-orar');
        const fundal = document.getElementById('container-orar-fundal');
        
        if (containerOrar && fundal) {
            // Ascundem containerul si fundalul cu animatie
            containerOrar.style.opacity = '0';
            fundal.style.opacity = '0';
            
            // Dupa ce animatia se incheie, ascundem complet elementele
            setTimeout(function() {
                containerOrar.style.display = 'none';
                fundal.style.display = 'none';
                containerOrar.style.opacity = '1';
                fundal.style.opacity = '1';
            }, 300);
            
            console.log("Orar ascuns");
        }
    }
    
    // Functia pentru evidentierea zilei curente
    function evidentiazaZiuaCurenta() {
        // Obtinem ziua curenta (0 = Duminica, 1 = Luni, etc.)
        const dataCurenta = new Date();
        const ziuaCurenta = dataCurenta.getDay();
        
        // Gasim toate randurile din tabel
        const randuri = document.querySelectorAll('#tabel-orar tbody tr');
        
        // Parcurgem randurile si evidentiem ziua curenta
        randuri.forEach(rand => {
            // Eliminam clasa zi-curenta de la toate randurile
            rand.classList.remove('zi-curenta');
            
            // Verificam daca randul corespunde zilei curente
            const zi = parseInt(rand.getAttribute('data-zi'));
            if (zi === ziuaCurenta) {
                // Adaugam clasa zi-curenta pentru evidentiere
                rand.classList.add('zi-curenta');
            }
        });
    }
    
    // Functia pentru verificarea statusului magazinului (deschis/inchis)
    function verificaStatusDeschis() {
        // Obtinem data si ora curenta
        const dataCurenta = new Date();
        const ziuaCurenta = dataCurenta.getDay();
        const oraCurenta = dataCurenta.getHours();
        const minuteCurente = dataCurenta.getMinutes();
        
        // Obtinem randul corespunzator zilei curente
        const randZiCurenta = document.querySelector(`#tabel-orar tbody tr[data-zi="${ziuaCurenta}"]`);
        
        // Obtinem containerul pentru status
        const statusContainer = document.getElementById('status-orar');
        
        // Daca nu exista randul sau containerul, ne oprim
        if (!randZiCurenta || !statusContainer) {
            return;
        }
        
        // Obtinem intervalul orar
        const intervalOrar = randZiCurenta.querySelector('td:nth-child(2)').textContent;
        
        // Verificam daca magazinul este inchis in aceasta zi
        if (intervalOrar.toLowerCase() === 'inchis') {
            statusContainer.textContent = 'Magazinul este INCHIS astazi';
            statusContainer.className = 'status inchis';
            return;
        }
        
        // Extragem orele de deschidere si inchidere
        const regex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
        const match = intervalOrar.match(regex);
        
        if (match) {
            const oraStart = parseInt(match[1]);
            const minuteStart = parseInt(match[2]);
            const oraStop = parseInt(match[3]);
            const minuteStop = parseInt(match[4]);
            
            // Calculam ora curenta in minute de la inceputul zilei
            const oraCurentaInMinute = oraCurenta * 60 + minuteCurente;
            
            // Calculam ora de start si stop in minute de la inceputul zilei
            const oraStartInMinute = oraStart * 60 + minuteStart;
            const oraStopInMinute = oraStop * 60 + minuteStop;
            
            // Verificam daca ora curenta este in intervalul de functionare
            if (oraCurentaInMinute >= oraStartInMinute && oraCurentaInMinute < oraStopInMinute) {
                // Magazinul este deschis
                statusContainer.textContent = 'Magazinul este DESCHIS acum';
                statusContainer.className = 'status deschis';
                
                // Calculam cate minute mai raman pana la inchidere
                const minuteRamase = oraStopInMinute - oraCurentaInMinute;
                
                if (minuteRamase <= 60) {
                    // Daca mai avem mai putin de o ora pana la inchidere, afisam un mesaj special
                    statusContainer.textContent += ` (se inchide in ${minuteRamase} minute)`;
                }
            } else {
                // Magazinul este inchis
                statusContainer.textContent = 'Magazinul este INCHIS acum';
                statusContainer.className = 'status inchis';
                
                // Verificam daca ora curenta este inainte de deschidere in ziua curenta
                if (oraCurentaInMinute < oraStartInMinute) {
                    // Calculam cate minute mai sunt pana la deschidere
                    const minutePanaLaDeschidere = oraStartInMinute - oraCurentaInMinute;
                    
                    // Afisam un mesaj cu ora la care se deschide
                    statusContainer.textContent += ` (se deschide in ${minutePanaLaDeschidere} minute)`;
                }
            }
        } else {
            // Daca nu am putut extrage orele din interval, afisam un mesaj generic
            statusContainer.textContent = 'Nu putem determina daca magazinul este deschis acum';
            statusContainer.className = 'status';
        }
    }
});