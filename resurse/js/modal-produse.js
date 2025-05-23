/* ========================================
   BONUS 11: JAVASCRIPT PENTRU MODAL BOX PRODUSE
   Click pe container = modal box
   Click pe nume/imagine = pagina separata
   ======================================== */

document.addEventListener("DOMContentLoaded", function() {
    console.log("BONUS 11: Modal box pentru produse incarcat");
    
    // Selectam toate containerele de produse
    const produse = document.querySelectorAll('.produs');
    
    // Creeam modal-ul o singura data
    createModalBox();
    
    // Adaugam event listeners pentru fiecare produs
    produse.forEach(produs => {
        initProductModal(produs);
    });
    
    // BONUS 11: Functie pentru crearea modal-ului
    function createModalBox() {
        // Verificam daca modal-ul exists deja
        if (document.getElementById('modal-produs')) {
            return;
        }
        
        const modalHTML = `
            <div id="modal-produs" class="modal-overlay" style="display: none;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 id="modal-nume-produs">Nume Produs</h3>
                        <button class="modal-close-btn" id="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-content-grid">
                            <div class="modal-imagine-container">
                                <img id="modal-imagine" src="" alt="Imagine produs">
                                <div id="modal-badges-container" class="modal-badges"></div>
                            </div>
                            <div class="modal-detalii">
                                <div class="modal-pret-container">
                                    <p class="modal-pret">Pret: <span id="modal-pret">0</span> RON</p>
                                    <div class="modal-buttons">
                                        <button class="btn-modal-cos">
                                            <i class="fas fa-cart-plus"></i> Adauga in cos
                                        </button>
                                        <a id="modal-link-produs" href="#" class="btn-modal-detalii">
                                            <i class="fas fa-eye"></i> Vezi pagina produsului
                                        </a>
                                    </div>
                                </div>
                                <div class="modal-info-grid">
                                    <div class="modal-info-item">
                                        <strong>Greutate:</strong>
                                        <span id="modal-greutate">-</span> g
                                    </div>
                                    <div class="modal-info-item">
                                        <strong>Tip produs:</strong>
                                        <span id="modal-tip">-</span>
                                    </div>
                                    <div class="modal-info-item">
                                        <strong>Categorie:</strong>
                                        <span id="modal-categorie" class="modal-badge">-</span>
                                    </div>
                                    <div class="modal-info-item">
                                        <strong>Pentru incepatori:</strong>
                                        <span id="modal-incepatori">-</span>
                                    </div>
                                    <div class="modal-info-item">
                                        <strong>Data adaugarii:</strong>
                                        <span id="modal-data">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-descriere">
                            <h4>Descriere:</h4>
                            <p id="modal-descriere-text">Descriere produs...</p>
                        </div>
                        <div class="modal-caracteristici">
                            <h4>Caracteristici:</h4>
                            <ul id="modal-caracteristici-lista">
                                <!-- Caracteristicile vor fi adaugate dinamic -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Adaugam event listeners pentru inchiderea modal-ului
        initModalEvents();
    }
    
    // BONUS 11: Functie pentru initializarea event-urilor modal-ului
    function initModalEvents() {
        const modal = document.getElementById('modal-produs');
        const closeBtn = document.getElementById('modal-close');
        const overlay = modal;
        
        // Inchidere cu butonul X
        closeBtn.addEventListener('click', closeModal);
        
        // Inchidere cand se da click pe overlay (in afara containerului)
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        // Inchidere cu tasta Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
        
        // Prevenim propagarea click-ului in container
        const modalContainer = modal.querySelector('.modal-container');
        modalContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Event listener pentru butonul de adaugare in cos din modal
        const btnModalCos = modal.querySelector('.btn-modal-cos');
        btnModalCos.addEventListener('click', function() {
            // Animatie pentru buton
            this.classList.add('pulsating');
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.classList.remove('pulsating');
                this.style.transform = 'scale(1)';
                showModalNotification('Produs adaugat in cos!', 'success');
            }, 200);
        });
    }
    
    // BONUS 11: Functie pentru initializarea modal-ului pentru fiecare produs
    function initProductModal(produs) {
        // Adaugam event listener pentru click pe container
        produs.addEventListener('click', function(e) {
            // BONUS 11: Verificam daca click-ul a fost pe nume, imagine, link-uri sau buton comparare
            const isNameClick = e.target.closest('h3 a') || e.target.closest('figure a') || e.target.closest('.product-link');
            const isCheckboxClick = e.target.closest('.selecteaza-cos');
            const isCompareClick = e.target.closest('.btn-compara-similar') || e.target.closest('[data-id]') || e.target.closest('.btn-comparare') || e.target.closest('.compare-btn');
            
            // Daca click-ul a fost pe nume/imagine, checkbox sau buton comparare, nu deschidem modal-ul
            if (isNameClick || isCheckboxClick || isCompareClick) {
                return;
            }
            
            // Prevenim propagarea click-ului
            e.preventDefault();
            e.stopPropagation();
            
            // Extragem datele produsului si deschidem modal-ul
            openModalWithProductData(produs);
        });
    }
    
    // BONUS 11: Functie pentru deschiderea modal-ului cu datele produsului
    function openModalWithProductData(produs) {
        // Extragem datele din elementele DOM
        const nume = produs.querySelector('.val-nume')?.textContent || 'Nume indisponibil';
        const imagine = produs.querySelector('figure img')?.src || '';
        const altImagine = produs.querySelector('figure img')?.alt || 'Imagine produs';
        const pret = produs.querySelector('.val-pret')?.textContent || '0';
        const greutate = produs.querySelector('.val-greutate')?.textContent || '0';
        const tip = produs.querySelector('.val-tip')?.textContent || 'Nedefinit';
        const categorie = produs.querySelector('.val-categorie')?.textContent || 'Necunoscuta';
        const descriere = produs.querySelector('.descriere')?.textContent || 'Descriere indisponibila';
        
        // Extragem data adaugarii
        const timeElement = produs.querySelector('time');
        let dataAdaugare = 'Nedefinita';
        if (timeElement) {
            const datetime = timeElement.getAttribute('datetime');
            const date = new Date(datetime);
            dataAdaugare = date.toLocaleDateString('ro-RO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            });
        }
        
        // Extragem informatia pentru incepatori
        const incepatorElement = produs.querySelector('.val-incepatori i');
        let pentruIncepatori = 'Nedefinit';
        if (incepatorElement) {
            if (incepatorElement.classList.contains('fa-check')) {
                pentruIncepatori = '<i class="fas fa-check text-success"></i> Da';
            } else if (incepatorElement.classList.contains('fa-times')) {
                pentruIncepatori = '<i class="fas fa-times text-danger"></i> Nu';
            }
        }
        
        // Extragem caracteristicile
        const caracteristiciElements = produs.querySelectorAll('.caracteristici li');
        const caracteristici = Array.from(caracteristiciElements).map(li => li.textContent.trim());
        
        // Extragem ID-ul produsului pentru link
        const produsId = produs.id.replace('ent', '');
        
        // Verificam marcajele existente
        const esteNou = produs.querySelector('.marcaj-nou') !== null;
        const esteCelMaiIeftin = produs.querySelector('.marcaj-ieftin') !== null;
        
        // Populam modal-ul cu datele
        populateModal({
            nume,
            imagine,
            altImagine,
            pret,
            greutate,
            tip,
            categorie,
            descriere,
            dataAdaugare,
            pentruIncepatori,
            caracteristici,
            produsId,
            esteNou,
            esteCelMaiIeftin
        });
        
        // Deschidem modal-ul
        openModal();
    }
    
    // BONUS 11: Functie pentru popularea modal-ului cu date
    function populateModal(data) {
        // Populam elementele modal-ului
        document.getElementById('modal-nume-produs').textContent = data.nume;
        
        const modalImagine = document.getElementById('modal-imagine');
        modalImagine.src = data.imagine;
        modalImagine.alt = data.altImagine;
        
        document.getElementById('modal-pret').textContent = data.pret;
        document.getElementById('modal-greutate').textContent = data.greutate.replace(' g', '');
        document.getElementById('modal-tip').textContent = data.tip;
        document.getElementById('modal-categorie').textContent = data.categorie;
        document.getElementById('modal-data').textContent = data.dataAdaugare;
        document.getElementById('modal-incepatori').innerHTML = data.pentruIncepatori;
        document.getElementById('modal-descriere-text').textContent = data.descriere;
        
        // Setam link-ul catre pagina produsului
        document.getElementById('modal-link-produs').href = `/produs/${data.produsId}`;
        
        // Populam caracteristicile
        const caracteristiciLista = document.getElementById('modal-caracteristici-lista');
        caracteristiciLista.innerHTML = '';
        
        if (data.caracteristici.length > 0 && !data.caracteristici.includes('Nu sunt specificate')) {
            data.caracteristici.forEach(caracteristica => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle"></i> ${caracteristica}`;
                caracteristiciLista.appendChild(li);
            });
        } else {
            caracteristiciLista.innerHTML = '<li class="no-caracteristici">Nu sunt specificate caracteristici pentru acest produs.</li>';
        }
        
        // Adaugam badge-urile pentru produs nou si cel mai ieftin
        const badgesContainer = document.getElementById('modal-badges-container');
        badgesContainer.innerHTML = '';
        
        if (data.esteNou) {
            const badgeNou = document.createElement('div');
            badgeNou.className = 'modal-badge-nou';
            badgeNou.innerHTML = '<i class="fas fa-star"></i> NOU';
            badgesContainer.appendChild(badgeNou);
        }
        
        if (data.esteCelMaiIeftin) {
            const badgeIeftin = document.createElement('div');
            badgeIeftin.className = 'modal-badge-ieftin';
            badgeIeftin.innerHTML = '<i class="fas fa-trophy"></i> CEL MAI IEFTIN';
            badgesContainer.appendChild(badgeIeftin);
        }
        
        // Aplicam clasa pentru categorie pe badge
        const modalBadge = document.getElementById('modal-categorie');
        modalBadge.className = `modal-badge ${data.categorie.replace(/\s+/g, '-').toLowerCase()}`;
    }
    
    // BONUS 11: Functie pentru deschiderea modal-ului
    function openModal() {
        const modal = document.getElementById('modal-produs');
        modal.style.display = 'block';
        
        // Prevenim scroll-ul pe body
        document.body.style.overflow = 'hidden';
        
        // Adaugam animatia de deschidere
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
        
        // Focus pe modal pentru accesibilitate
        modal.focus();
        
        console.log('BONUS 11: Modal deschis pentru produs');
    }
    
    // BONUS 11: Functie pentru inchiderea modal-ului
    function closeModal() {
        const modal = document.getElementById('modal-produs');
        modal.classList.remove('modal-open');
        
        // Restauram scroll-ul pe body
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        console.log('BONUS 11: Modal inchis');
    }
    
    // BONUS 11: Functie pentru afisarea notificarilor
    function showModalNotification(message, type = 'info', duration = 2000) {
        // Eliminam notificarea existenta daca exists
        const existingNotification = document.querySelector('.modal-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `modal-notification ${type}`;
        notification.innerHTML = message;
        
        // Stilizare notificare
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '10001'; // Mai mare decat modal-ul
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
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
    
    console.log('BONUS 11: Functionalitate modal box pentru produse initializata cu succes');
});