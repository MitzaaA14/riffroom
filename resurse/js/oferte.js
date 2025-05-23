// Script pentru sistemul de oferte - BONUS 12 - TOATE CATEGORIILE
// Fara diacritice conform cererii

class SistemOferte {
    constructor() {
        this.oferteActive = [];
        this.timerInterval = null;
        this.checkInterval = null;
        this.soundEnabled = true;
        
        this.init();
    }
    
    // BONUS 12.1 - Initializare sistem oferte pentru toate categoriile
    async init() {
        console.log("Initializam sistemul de oferte pentru toate categoriile...");
        
        try {
            await this.incarcaOferteActive();
            this.startTimer();
            this.startPeriodicCheck();
            
            // Aplicam ofertele pe produse daca suntem pe pagina de produse
            if (window.location.pathname.includes('/produse') || 
                window.location.pathname.includes('/produs/')) {
                this.aplicaOfertePeProduse();
            }
            
            console.log("Sistem oferte initializat cu succes pentru toate categoriile");
        } catch (error) {
            console.error("Eroare la initializarea sistemului de oferte:", error);
        }
    }
    
    // BONUS 12.2 - Incarca toate ofertele active din JSON
    async incarcaOferteActive() {
        try {
            const response = await fetch('/resurse/json/oferte.json');
            if (!response.ok) {
                throw new Error('Nu s-au putut incarca ofertele');
            }
            
            const data = await response.json();
            
            if (data.oferte && data.oferte.length > 0) {
                // Filtram ofertele care sunt inca valide
                const acum = new Date();
                this.oferteActive = data.oferte.filter(oferta => {
                    const dataFinalizare = new Date(oferta.data_finalizare);
                    return dataFinalizare > acum;
                });
                
                if (this.oferteActive.length > 0) {
                    this.afiseazaOferte();
                    console.log("Oferte active incarcate:", this.oferteActive.length);
                } else {
                    console.log("Toate ofertele au expirat, se genereaza oferte noi...");
                    await this.genereazaOferteNoi();
                }
            } else {
                console.log("Nu exista oferte, se genereaza primele oferte...");
                await this.genereazaOferteNoi();
            }
        } catch (error) {
            console.error("Eroare la incarcarea ofertelor:", error);
            this.afiseazaEroare();
        }
    }
    
    // BONUS 12.1 - Genereaza oferte noi pentru toate categoriile
    async genereazaOferteNoi() {
        try {
            // Simulam generarea oferelor noi (in realitate ar trebui sa fie pe server)
            const categorii = [
                "Chitare electrice",
                "Chitare acustice", 
                "Amplificatoare",
                "Accesorii chitara",
                "Pedale",
                "Corzi chitara"
            ];
            
            const reduceri = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
            
            const acum = new Date();
            const dataFinalizare = new Date(acum.getTime() + (2 * 60 * 1000)); // 2 minute pentru demo
            
            // Generam oferte pentru toate categoriile
            const oferteNoi = [];
            
            for (const categorie of categorii) {
                const reducereAleatoare = reduceri[Math.floor(Math.random() * reduceri.length)];
                
                const ofertaNoua = {
                    categorie: categorie,
                    data_incepere: acum.toISOString(),
                    data_finalizare: dataFinalizare.toISOString(),
                    reducere: reducereAleatoare
                };
                
                oferteNoi.push(ofertaNoua);
            }
            
            this.oferteActive = oferteNoi;
            this.afiseazaOferte();
            this.afiseazaNotificareOferteNoi();
            
            console.log("Oferte noi generate pentru toate categoriile:", oferteNoi.length);
            
            // In implementarea reala, aici am trimite ofertele la server pentru salvare
            
        } catch (error) {
            console.error("Eroare la generarea ofertelor noi:", error);
        }
    }
    
    // BONUS 12.2 - Afiseaza ofertele pe pagina
    afiseazaOferte() {
        if (!this.oferteActive || this.oferteActive.length === 0) return;
        
        // Cautam container-ul pentru oferte
        let container = document.getElementById('oferte-container');
        
        if (!container) {
            // Cream container-ul daca nu exista
            container = document.createElement('div');
            container.id = 'oferte-container';
            container.className = 'oferte-container-multiple';
            
            // Inseram in locul potrivit in functie de pagina
            this.inserareContainerOferte(container);
        }
        
        container.innerHTML = this.genereazaHTMLOferte();
        container.classList.remove('expired');
        
        // Aplicam ofertele pe produse
        if (window.location.pathname.includes('/produse') || 
            window.location.pathname.includes('/produs/')) {
            this.aplicaOfertePeProduse();
        }
    }
    
    // BONUS 12.2 - Determina unde sa insereze container-ul ofertelor
    inserareContainerOferte(container) {
        if (window.location.pathname === '/' || window.location.pathname === '/index') {
            // Pe pagina principala, inseram in sectiunea de anunturi
            const anunturiSection = document.querySelector('#anunturi') || 
                                   document.querySelector('main section:first-child') ||
                                   document.querySelector('main');
            
            if (anunturiSection) {
                anunturiSection.appendChild(container);
            } else {
                document.body.appendChild(container);
            }
        } else if (window.location.pathname.includes('/produse')) {
            // Pe pagina de produse, inseram inaintea sectiunii de produse
            const produseSection = document.getElementById('produse');
            if (produseSection) {
                produseSection.parentNode.insertBefore(container, produseSection);
            } else {
                const main = document.querySelector('main');
                if (main) {
                    main.insertBefore(container, main.firstChild);
                }
            }
        } else if (window.location.pathname.includes('/produs/')) {
            // Pe pagina de produs individual, inseram in detaliile produsului
            const pretContainer = document.querySelector('.pret-container');
            if (pretContainer) {
                pretContainer.parentNode.insertBefore(container, pretContainer.nextSibling);
            } else {
                const main = document.querySelector('main');
                if (main) {
                    main.insertBefore(container, main.firstChild);
                }
            }
        } else {
            // Pentru alte pagini, inseram in main
            const main = document.querySelector('main');
            if (main) {
                main.insertBefore(container, main.firstChild);
            } else {
                document.body.appendChild(container);
            }
        }
    }
    
    // BONUS 12.2 - Genereaza HTML-ul pentru afisarea tuturor ofertelor
    genereazaHTMLOferte() {
        if (!this.oferteActive || this.oferteActive.length === 0) return '';
        
        const totalOferte = this.oferteActive.length;
        const mediaReducere = Math.round(this.oferteActive.reduce((sum, oferta) => sum + oferta.reducere, 0) / totalOferte);
        
        let ofertePeRanduri = '';
        this.oferteActive.forEach((oferta, index) => {
            ofertePeRanduri += `
                <div class="oferta-individuala">
                    <span class="categorie-oferta">${oferta.categorie}</span>
                    <span class="reducere-oferta">-${oferta.reducere}%</span>
                </div>
            `;
        });
        
        return `
            <div class="oferte-header">
                <h3 class="oferte-titlu">🔥 OFERTE SPECIALE PENTRU TOATE CATEGORIILE!</h3>
                <div class="oferte-sumar">
                    <span class="total-oferte">${totalOferte} categorii</span>
                    <span class="reducere-medie">Reducere medie: ${mediaReducere}%</span>
                </div>
            </div>
            <div class="oferte-detalii">
                <div class="oferte-grid">
                    ${ofertePeRanduri}
                </div>
                <div class="oferte-timer" id="timer-oferte">
                    <div>Ofertele expira in:</div>
                    <div class="timer-cifre">
                        <div class="timer-unitate">
                            <div class="timer-valoare" id="timer-ore">00</div>
                            <div class="timer-label">Ore</div>
                        </div>
                        <div class="timer-unitate">
                            <div class="timer-valoare" id="timer-minute">00</div>
                            <div class="timer-label">Min</div>
                        </div>
                        <div class="timer-unitate">
                            <div class="timer-valoare" id="timer-secunde">00</div>
                            <div class="timer-label">Sec</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // BONUS 12.3 - Porneste temporizatorul
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.actualizeazaTimer();
        }, 1000);
        
        // Actualizam imediat
        this.actualizeazaTimer();
    }
    
    // BONUS 12.3 - Actualizeaza afisarea temporizatorului
    actualizeazaTimer() {
        if (!this.oferteActive || this.oferteActive.length === 0) return;
        
        const acum = new Date();
        // Folosim prima oferta pentru timer (toate au aceeasi data de expirare)
        const dataFinalizare = new Date(this.oferteActive[0].data_finalizare);
        const diferenta = dataFinalizare - acum;
        
        if (diferenta <= 0) {
            // Ofertele au expirat
            this.expiraOferte();
            return;
        }
        
        const ore = Math.floor(diferenta / (1000 * 60 * 60));
        const minute = Math.floor((diferenta % (1000 * 60 * 60)) / (1000 * 60));
        const secunde = Math.floor((diferenta % (1000 * 60)) / 1000);
        
        // Actualizam afisarea
        const timerOre = document.getElementById('timer-ore');
        const timerMinute = document.getElementById('timer-minute');
        const timerSecunde = document.getElementById('timer-secunde');
        const timerContainer = document.getElementById('timer-oferte');
        
        if (timerOre) timerOre.textContent = String(ore).padStart(2, '0');
        if (timerMinute) timerMinute.textContent = String(minute).padStart(2, '0');
        if (timerSecunde) timerSecunde.textContent = String(secunde).padStart(2, '0');
        
        // BONUS 12.3 - Ultimele 10 secunde - efecte speciale
        if (diferenta <= 10000 && timerContainer) { // 10 secunde
            timerContainer.classList.add('urgent');
            
            // Efect sonor pentru ultimele 3 secunde
            if (diferenta <= 3000 && this.soundEnabled) {
                this.redareEfectSonor();
            }
        } else if (timerContainer) {
            timerContainer.classList.remove('urgent');
        }
    }
    
    // BONUS 12.3 - Efect sonor pentru ultimele secunde
    redareEfectSonor() {
        try {
            // Cream un sunet simplu folosind Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // Frecventa sunetului
            gainNode.gain.value = 0.1; // Volum
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1); // Sunet scurt
        } catch (error) {
            console.log("Nu s-a putut reda sunetul:", error);
        }
    }
    
    // BONUS 12.3 - Expirarea ofertelor
    async expiraOferte() {
        console.log("Ofertele au expirat, se genereaza oferte noi...");
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Animatie de disparitie
        const container = document.getElementById('oferte-container');
        if (container) {
            container.classList.add('expired');
            
            setTimeout(async () => {
                await this.genereazaOferteNoi();
                this.startTimer();
            }, 500);
        } else {
            await this.genereazaOferteNoi();
            this.startTimer();
        }
    }
    
    // BONUS 12.4 - Aplica ofertele pe produsele din pagina
    aplicaOfertePeProduse() {
        if (!this.oferteActive || this.oferteActive.length === 0) return;
        
        console.log("Aplicam ofertele pe produse pentru toate categoriile:", this.oferteActive.length);
        
        // Pentru pagina de produse multiple
        const produse = document.querySelectorAll('.produs');
        
        produse.forEach(produs => {
            const categorieElement = produs.querySelector('.val-categorie');
            const pretElement = produs.querySelector('.val-pret');
            
            if (categorieElement && pretElement) {
                const categorieProdus = categorieElement.textContent.trim();
                
                // Cautam o oferta pentru categoria acestui produs
                const ofertaGasita = this.oferteActive.find(oferta => 
                    this.categoriiCompatibile(categorieProdus, oferta.categorie)
                );
                
                if (ofertaGasita) {
                    this.aplicaOfertaPeProdus(produs, pretElement, ofertaGasita);
                } else {
                    this.eliminaOfertaDinProdus(produs, pretElement);
                }
            }
        });
        
        // Pentru pagina de produs individual
        const pretContainerIndividual = document.querySelector('.pret-container .pret');
        if (pretContainerIndividual) {
            // Cautam categoria produsului individual
            const categorieIndividuala = document.querySelector('.badge-categorie');
            if (categorieIndividuala) {
                const categorieProdus = categorieIndividuala.textContent.trim();
                
                const ofertaGasita = this.oferteActive.find(oferta => 
                    this.categoriiCompatibile(categorieProdus, oferta.categorie)
                );
                
                if (ofertaGasita) {
                    this.aplicaOfertaPeProdusIndividual(pretContainerIndividual, ofertaGasita);
                }
            }
        }
    }
    
    // BONUS 12.4 - Verifica daca categoriile sunt compatibile
    categoriiCompatibile(categorieProdus, categorieOferta) {
        // Normalizam categoriile pentru comparatie
        const categorieProdusNormalizata = categorieProdus.toLowerCase().trim();
        const categorieOfertaNormalizata = categorieOferta.toLowerCase().trim();
        
        // Mapari pentru compatibilitate
        const mapariCategorii = {
            'chitare electrice': ['chitara electrica', 'chitare electrice'],
            'chitare acustice': ['chitara acustica', 'chitare acustice'],
            'amplificatoare': ['amplificator', 'amplificatoare'],
            'accesorii chitara': ['accesorii', 'accesorii chitara']
        };
        
        // Verificam compatibilitatea directa
        if (categorieProdusNormalizata === categorieOfertaNormalizata) {
            return true;
        }
        
        // Verificam mapari
        for (const [categorieOfertaKey, categoriiProduse] of Object.entries(mapariCategorii)) {
            if (categorieOfertaNormalizata === categorieOfertaKey.toLowerCase()) {
                return categoriiProduse.includes(categorieProdusNormalizata);
            }
        }
        
        return false;
    }
    
    // BONUS 12.4 - Aplica oferta pe un produs din lista
    aplicaOfertaPeProdus(produs, pretElement, oferta) {
        // Marcam produsul ca fiind cu oferta
        produs.classList.add('cu-oferta');
        
        // Obtinem pretul original
        const pretOriginal = parseFloat(pretElement.textContent.replace(/[^\d.-]/g, ''));
        const pretRedus = pretOriginal * (1 - oferta.reducere / 100);
        
        // Cream structura pentru afisarea pretului redus
        if (!pretElement.classList.contains('cu-oferta')) {
            pretElement.classList.add('cu-oferta');
            
            const pretVechi = document.createElement('span');
            pretVechi.className = 'pret-vechi';
            pretVechi.textContent = pretOriginal.toFixed(2);
            
            const pretNou = document.createElement('span');
            pretNou.className = 'pret-nou';
            pretNou.textContent = pretRedus.toFixed(2);
            
            const badgeOferta = document.createElement('span');
            badgeOferta.className = 'badge-oferta';
            badgeOferta.textContent = `-${oferta.reducere}%`;
            
            // Inlocuim continutul
            pretElement.innerHTML = '';
            pretElement.appendChild(pretVechi);
            pretElement.appendChild(pretNou);
            pretElement.appendChild(badgeOferta);
        }
    }
    
    // BONUS 12.4 - Elimina oferta din produs
    eliminaOfertaDinProdus(produs, pretElement) {
        produs.classList.remove('cu-oferta');
        pretElement.classList.remove('cu-oferta');
        
        // Restauram pretul original daca era modificat
        const pretVechi = pretElement.querySelector('.pret-vechi');
        if (pretVechi) {
            pretElement.innerHTML = pretVechi.textContent;
        }
    }
    
    // BONUS 12.4 - Aplica oferta pe produsul individual
    aplicaOfertaPeProdusIndividual(pretElement, oferta) {
        const pretContainer = pretElement.parentElement;
        
        // Verificam daca nu am aplicat deja oferta
        if (pretContainer.querySelector('.pret-oferta-container')) {
            return;
        }
        
        const pretOriginal = parseFloat(pretElement.textContent.replace(/[^\d.-]/g, ''));
        const pretRedus = pretOriginal * (1 - oferta.reducere / 100);
        
        // Cream container pentru pretul cu oferta
        const containerOferta = document.createElement('div');
        containerOferta.className = 'pret-oferta-container';
        
        containerOferta.innerHTML = `
            <span class="pret-vechi">${pretOriginal.toFixed(2)} RON</span>
            <span class="pret-nou">${pretRedus.toFixed(2)} RON</span>
            <span class="badge-oferta">-${oferta.reducere}%</span>
        `;
        
        // Inlocuim elementul pretului
        pretElement.parentNode.replaceChild(containerOferta, pretElement);
        
        // Adaugam mini-timer pentru produsul individual
        this.adaugaMiniTimer(containerOferta);
    }
    
    // BONUS 12.3 - Adauga mini-timer pentru produsul individual
    adaugaMiniTimer(container) {
        const miniTimer = document.createElement('div');
        miniTimer.className = 'mini-timer';
        miniTimer.id = 'mini-timer-produs';
        
        container.appendChild(miniTimer);
        
        // Actualizam mini-timer-ul
        const updateMiniTimer = () => {
            if (!this.oferteActive || this.oferteActive.length === 0) return;
            
            const acum = new Date();
            const dataFinalizare = new Date(this.oferteActive[0].data_finalizare);
            const diferenta = dataFinalizare - acum;
            
            if (diferenta <= 0) {
                miniTimer.textContent = 'Ofertele au expirat';
                return;
            }
            
            const ore = Math.floor(diferenta / (1000 * 60 * 60));
            const minute = Math.floor((diferenta % (1000 * 60 * 60)) / (1000 * 60));
            const secunde = Math.floor((diferenta % (1000 * 60)) / 1000);
            
            miniTimer.textContent = `Ofertele expira in: ${String(ore).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(secunde).padStart(2, '0')}`;
        };
        
        updateMiniTimer();
        setInterval(updateMiniTimer, 1000);
    }
    
    // BONUS 12.2 - Afiseaza notificare pentru ofertele noi
    afiseazaNotificareOferteNoi() {
        // Eliminam notificarea existenta daca exista
        const notificareExistenta = document.querySelector('.notificare-oferte');
        if (notificareExistenta) {
            notificareExistenta.remove();
        }
        
        const notificare = document.createElement('div');
        notificare.className = 'notificare-oferte';
        
        const totalOferte = this.oferteActive.length;
        const categoriiText = this.oferteActive.map(o => o.categorie).join(', ');
        
        notificare.innerHTML = `
            <h4>🎉 Oferte Noi pentru Toate Categoriile!</h4>
            <p>${totalOferte} categorii cu reduceri: ${categoriiText.substring(0, 100)}${categoriiText.length > 100 ? '...' : ''}!</p>
        `;
        
        document.body.appendChild(notificare);
        
        // Eliminam notificarea dupa 6 secunde
        setTimeout(() => {
            notificare.classList.add('fade-out');
            setTimeout(() => {
                if (notificare.parentNode) {
                    notificare.remove();
                }
            }, 500);
        }, 6000);
    }
    
    // BONUS 12.1 - Verificare periodica pentru noi oferte
    startPeriodicCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        
        // Verificam la fiecare 30 de secunde daca trebuie sa generam oferte noi
        this.checkInterval = setInterval(async () => {
            if (!this.oferteActive || this.oferteActive.length === 0) {
                await this.genereazaOferteNoi();
                this.startTimer();
            }
        }, 30000); // 30 secunde
    }
    
    // BONUS 12.2 - Afiseaza eroare daca nu se pot incarca ofertele
    afiseazaEroare() {
        const container = document.getElementById('oferte-container') || 
                         document.createElement('div');
        
        container.id = 'oferte-container';
        container.className = 'oferte-container-multiple';
        container.innerHTML = `
            <div class="oferte-header">
                <h3 class="oferte-titlu">⚠️ Ofertele nu sunt disponibile momentan</h3>
            </div>
            <div class="oferte-detalii">
                <p>Ne cerem scuze pentru inconvenient. Reincarcati pagina pentru a verifica din nou.</p>
            </div>
        `;
        
        if (!document.getElementById('oferte-container')) {
            this.inserareContainerOferte(container);
        }
    }
    
    // BONUS 12.5 - Curatare oferte expirate (simulare)
    async curataOferteleExpirate() {
        // In implementarea reala, aceasta functie ar face o cerere la server
        // pentru a sterge ofertele expirate conform intervalului T2
        console.log("Curatam ofertele expirate...");
        
        // Simulam curatarea
        const intervalStergere = 10 * 60 * 1000; // 10 minute
        const acum = new Date();
        
        console.log(`Ofertele mai vechi de ${intervalStergere / 60000} minute vor fi sterse`);
        
        // In implementarea reala, aici am face o cerere POST/DELETE la server
    }
    
    // Cleanup la inchiderea paginii
    destructor() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}

// Stiluri CSS pentru afisarea ofertelor multiple
const stiluriOferte = document.createElement('style');
stiluriOferte.textContent = `
    .oferte-container-multiple {
        background: linear-gradient(135deg, #ff6b35, #ff8e53);
        color: white;
        padding: 2rem;
        margin: 1rem 0;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        position: relative;
        overflow: hidden;
        animation: slideInFromTop 0.6s ease-out;
    }

    .oferte-container-multiple::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: shimmer-oferte-multiple 4s infinite;
    }

    @keyframes shimmer-oferte-multiple {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .oferte-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        position: relative;
        z-index: 2;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .oferte-titlu {
        font-size: 1.8rem;
        font-weight: bold;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        flex: 1;
        min-width: 300px;
    }

    .oferte-sumar {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
    }

    .total-oferte, .reducere-medie {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: bold;
        backdrop-filter: blur(10px);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }

    .oferte-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
        position: relative;
        z-index: 2;
    }

    .oferta-individuala {
        background: rgba(255, 255, 255, 0.15);
        padding: 1rem;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;
    }

    .oferta-individuala:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, 0.25);
    }

    .categorie-oferta {
        font-weight: 600;
        flex: 1;
    }

    .reducere-oferta {
        background: rgba(255, 255, 255, 0.3);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-weight: bold;
        font-size: 1.1rem;
    }

    .oferte-timer {
        background: rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        font-family: 'Courier New', monospace;
        font-size: 1.2rem;
        font-weight: bold;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;
    }

    .oferte-timer.urgent {
        background: rgba(220, 20, 60, 0.8);
        animation: pulse-urgent-multiple 1s infinite;
        box-shadow: 0 0 30px rgba(220, 20, 60, 0.6);
    }

    @keyframes pulse-urgent-multiple {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }

    .timer-cifre {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
    }

    .timer-unitate {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 60px;
    }

    .timer-valoare {
        font-size: 2.5rem;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        line-height: 1;
    }

    .timer-label {
        font-size: 0.9rem;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 0.5rem;
    }

    .oferte-container-multiple.expired {
        animation: fadeOutAndSlide 0.6s ease-in forwards;
    }

    .notificare-oferte {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #ff8e53);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        z-index: 10000;
        animation: slideInFromRight 0.5s ease-out;
        max-width: 400px;
    }

    .notificare-oferte h4 {
        margin: 0 0 0.8rem 0;
        font-size: 1.2rem;
    }

    .notificare-oferte p {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.4;
    }

    .notificare-oferte.fade-out {
        animation: fadeOutToRight 0.5s ease-in forwards;
    }

    /* Responsive design */
    @media screen and (max-width: 768px) {
        .oferte-header {
            flex-direction: column;
            text-align: center;
        }
        
        .oferte-sumar {
            align-items: center;
        }
        
        .oferte-grid {
            grid-template-columns: 1fr;
        }
        
        .timer-cifre {
            gap: 1rem;
        }
        
        .timer-valoare {
            font-size: 2rem;
        }
        
        .oferte-titlu {
            font-size: 1.5rem;
        }
        
        .notificare-oferte {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }

    /* Tema intunecata */
    .theme-dark .oferte-container-multiple {
        background: linear-gradient(135deg, #C05F3E, #A54E34);
        box-shadow: 0 8px 25px rgba(192, 95, 62, 0.5);
    }

    .theme-dark .oferte-timer {
        background: rgba(255, 255, 255, 0.1);
        color: #D8C9A7;
    }

    .theme-dark .oferte-timer.urgent {
        background: rgba(139, 0, 0, 0.8);
        color: #FFE4E1;
    }

    .theme-dark .notificare-oferte {
        background: linear-gradient(135deg, #C05F3E, #A54E34);
    }
`;

document.head.appendChild(stiluriOferte);

// BONUS 12 - Initializare sistem oferte la incarcarea paginii
let sistemOferte = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializam sistemul de oferte pentru toate categoriile...");
    
    // Cream instanta sistemului de oferte
    sistemOferte = new SistemOferte();
    
    // Event listener pentru inchiderea paginii
    window.addEventListener('beforeunload', function() {
        if (sistemOferte) {
            sistemOferte.destructor();
        }
    });
    
    // Event listener pentru schimbarea vizibilitatii paginii
    document.addEventListener('visibilitychange', function() {
        if (sistemOferte) {
            if (document.hidden) {
                // Pagina nu mai este vizibila, oprim sunetele
                sistemOferte.soundEnabled = false;
            } else {
                // Pagina este din nou vizibila
                sistemOferte.soundEnabled = true;
                // Reincarcam ofertele curente pentru a verifica daca au expirat
                sistemOferte.incarcaOferteActive();
            }
        }
    });
});

// Export pentru utilizare in alte module daca este necesar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemOferte;
}