document.addEventListener('DOMContentLoaded', function() {
    // Verifica daca exista deja butonul pentru tema
    initializeThemeToggle();
    
    // Verificam tema salvata in localStorage
    let savedTheme = localStorage.getItem('theme');
    
    // Verificam daca exista o tema salvata
    if (!savedTheme) {
        // Daca nu exista, folosim tema intunecata ca default
        savedTheme = 'dark';
        localStorage.setItem('theme', savedTheme);
    }
    
    // Aplicam tema salvata
    applyTheme(savedTheme);
    
    // Reinitializam toggle-ul la fiecare 500ms pentru a ne asigura ca apare
    // Uneori alte scripturi pot elimina sau modifica DOM-ul
    setInterval(function() {
        if (!document.getElementById('theme-toggle')) {
            initializeThemeToggle();
        }
    }, 500);
    
    // Functie pentru initializarea butonului de toggle
    function initializeThemeToggle() {
        // Verificam daca exista deja containerul
        let toggleContainer = document.querySelector('.theme-toggle-container');
        if (toggleContainer) {
            return; // Daca exista deja, nu facem nimic
        }
        
        // Cream containerul pentru buton
        toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle-container';
        
        // Cream butonul
        let themeToggleBtn = document.createElement('button');
        themeToggleBtn.id = 'theme-toggle';
        themeToggleBtn.className = 'theme-toggle-btn';
        themeToggleBtn.setAttribute('aria-label', 'Schimba tema');
        
        // Setam iconita corecta in functie de tema curenta
        const currentTheme = localStorage.getItem('theme') || 'dark';
        themeToggleBtn.innerHTML = currentTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Adaugam event listener pentru buton
        themeToggleBtn.addEventListener('click', function() {
            if (document.body.classList.contains('theme-dark')) {
                applyTheme('light');
                showThemeChangeMessage(false);
            } else {
                applyTheme('dark');
                showThemeChangeMessage(true);
            }
        });
        
        // Adaugam butonul in container
        toggleContainer.appendChild(themeToggleBtn);
        
        // Adaugam containerul la body
        document.body.appendChild(toggleContainer);
        
        // Aplicam stilurile inline pentru a ne asigura ca butonul este vizibil
        Object.assign(toggleContainer.style, {
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            zIndex: '1000'
        });
        
        Object.assign(themeToggleBtn.style, {
            backgroundColor: currentTheme === 'dark' ? '#854C39' : '#6B3E31',
            color: currentTheme === 'dark' ? '#D8C9A7' : '#F7F3E8',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer'
        });
    }
    
    // Functie pentru aplicarea temei
    function applyTheme(theme) {
        if (theme === 'dark') {
            // Aplicam tema intunecata la elementele principale
            document.documentElement.classList.add('theme-dark');
            document.body.classList.add('theme-dark');
            
            // Aplicam tema intunecata la toate elementele importante
            applyDarkToElements();
            
            // Schimbam iconita butonului
            const themeToggleBtn = document.getElementById('theme-toggle');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggleBtn.style.backgroundColor = '#854C39';
                themeToggleBtn.style.color = '#D8C9A7';
            }
            
            // Salvam tema in localStorage
            localStorage.setItem('theme', 'dark');
        } else {
            // Eliminam tema intunecata
            document.documentElement.classList.remove('theme-dark');
            document.body.classList.remove('theme-dark');
            
            // Eliminam tema intunecata de la toate elementele
            removeDarkFromElements();
            
            // Schimbam iconita
            const themeToggleBtn = document.getElementById('theme-toggle');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggleBtn.style.backgroundColor = '#6B3E31';
                themeToggleBtn.style.color = '#F7F3E8';
            }
            
            // Salvam tema in localStorage
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Functie pentru aplicarea temei intunecate pe toate elementele importante
    function applyDarkToElements() {
        // Elemente care trebuie sa aiba tema dark aplicata direct
        const selectors = [
            'main',
            'header', 
            'footer',
            'nav',
            '#filtrare-produse',
            '#produse',
            '.grid-produse',
            'section',
            'article',
            '.container',
            '.row',
            '.col',
            '.card',
            '.navbar',
            '.team-tabs',
            '.tab-content'
        ];
        
        // Aplicam tema dark la fiecare element
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('theme-dark');
            });
        });
        
        // Fix pentru meniuri cu fundal negru
        const blackElements = document.querySelectorAll('[style*="background: rgb(0, 0, 0)"], [style*="background-color: rgb(0, 0, 0)"], [style*="background: #000"], [style*="background-color: #000"]');
        blackElements.forEach(el => {
            el.style.backgroundColor = 'var(--bg-color-dark)';
        });
    }
    
    // Functie pentru eliminarea temei intunecate de pe toate elementele
    function removeDarkFromElements() {
        // Selectam toate elementele care au clasa theme-dark
        const darkElements = document.querySelectorAll('.theme-dark');
        
        // Eliminam clasa de la toate elementele
        darkElements.forEach(element => {
            element.classList.remove('theme-dark');
        });
    }
    
    // Functie pentru afisarea unui mesaj de confirmare
    function showThemeChangeMessage(isDark) {
        // Verificam daca exista deja un mesaj
        let messageElement = document.getElementById('theme-change-message');
        
        // Daca exista, il eliminam
        if (messageElement) {
            messageElement.remove();
        }
        
        // Cream noul mesaj
        messageElement = document.createElement('div');
        messageElement.id = 'theme-change-message';
        messageElement.textContent = isDark ? 'Tema intunecata activata' : 'Tema luminoasa activata';
        
        // Stilizare mesaj
        Object.assign(messageElement.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: isDark ? '#6B3E31' : '#F7E9D7',
            color: isDark ? '#F7F3E8' : '#2D1A19',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            transition: 'opacity 0.3s ease',
            opacity: '0',
            fontWeight: 'bold'
        });
        
        // Adaugam mesajul in document
        document.body.appendChild(messageElement);
        
        // Facem mesajul vizibil dupa un scurt delay
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 10);
        
        // Eliminam mesajul dupa 2 secunde
        setTimeout(() => {
            messageElement.style.opacity = '0';
            
            // Eliminam elementul din DOM dupa ce animatia de fade-out s-a incheiat
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 2000);
    }
    
    // Observer pentru a aplica tema la elementele adaugate dinamic
    const observer = new MutationObserver(function(mutations) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            applyDarkToElements();
        }
        
        // Verifica daca butonul de toggle exista inca
        if (!document.getElementById('theme-toggle')) {
            initializeThemeToggle();
        }
    });
    
    // Pornirea observer-ului
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Fix suplimentar: verifica si aplica tema la fiecare 1 secunda pentru elementele care pot fi adaugate dinamic
    setInterval(function() {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark' && !document.body.classList.contains('theme-dark')) {
            applyTheme('dark');
        }
    }, 1000);
    
    // Fix special pentru meniuri si elemente problematice
    setTimeout(function() {
        if (localStorage.getItem('theme') === 'dark') {
            // Verifica si aplica tema pentru meniuri negre
            const blackMenus = document.querySelectorAll('[style*="background: rgb(0, 0, 0)"], [style*="background-color: rgb(0, 0, 0)"]');
            blackMenus.forEach(menu => {
                menu.style.backgroundColor = 'var(--bg-color-dark)';
                menu.style.color = 'var(--text-color)';
                
                // Gaseste si stilizeaza link-urile din meniu
                const links = menu.querySelectorAll('a');
                links.forEach(link => {
                    link.style.color = 'var(--text-color)';
                });
            });
            
            // Verifica si stilizeaza tabelele
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                table.style.backgroundColor = 'var(--bg-color-medium)';
                table.style.color = 'var(--text-color)';
            });
        }
        
        // Asigura-te ca butonul de toggle exista si este vizibil
        if (!document.getElementById('theme-toggle')) {
            initializeThemeToggle();
        }
    }, 500);
});