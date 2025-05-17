// tema.js - Script complet pentru fortarea temei intunecate pe tot site-ul

document.addEventListener('DOMContentLoaded', function() {
    // Forteaza tema intunecata imediat - pentru a preveni clipirea temei luminoase la inceput
    document.documentElement.classList.add('theme-dark');
    document.body.classList.add('theme-dark');
    
    // Verifica daca exista deja butonul pentru tema
    let themeToggleBtn = document.getElementById('theme-toggle');
    let toggleContainer;
    
    // Daca nu exista, il cream
    if (!themeToggleBtn) {
        themeToggleBtn = document.createElement('button');
        themeToggleBtn.id = 'theme-toggle';
        themeToggleBtn.className = 'theme-toggle-btn';
        themeToggleBtn.setAttribute('aria-label', 'Schimba tema');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Iconita soare pentru tema dark
        
        // Cream un container pentru buton in stanga jos
        toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle-container';
        toggleContainer.appendChild(themeToggleBtn);
        
        // Adaugam containerul la body
        document.body.appendChild(toggleContainer);
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
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            
            // Salvam tema in localStorage
            localStorage.setItem('theme', 'dark');
        } else {
            // Eliminam tema intunecata
            document.documentElement.classList.remove('theme-dark');
            document.body.classList.remove('theme-dark');
            
            // Eliminam tema intunecata de la toate elementele
            removeDarkFromElements();
            
            // Schimbam iconita
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            
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
            '#filtrare-produse',
            '#produse',
            '.grid-produse',
            'section',
            'article.produs'
        ];
        
        // Aplicam tema dark la fiecare element
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('theme-dark');
            });
        });
    }
    
    // Functie pentru eliminarea temei intunecate de pe toate elementele
    function removeDarkFromElements() {
        // Elemente de la care eliminam tema dark
        const selectors = [
            'main',
            'header', 
            'footer',
            '#filtrare-produse',
            '#produse',
            '.grid-produse',
            'section',
            'article.produs'
        ];
        
        // Eliminam tema dark de la fiecare element
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.remove('theme-dark');
            });
        });
    }
    
    // Adaugam event listener pentru butonul de schimbare a temei
    themeToggleBtn.addEventListener('click', function() {
        if (document.body.classList.contains('theme-dark')) {
            applyTheme('light');
            showThemeChangeMessage(false);
        } else {
            applyTheme('dark');
            showThemeChangeMessage(true);
        }
    });
    
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
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
    
    // FORtaM aplicarea temei intunecate indiferent de preferintele anterioare
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');
    
    // Verifica si reaplica tema intunecata periodic (pentru a preveni pierderea stilurilor)
    setInterval(function() {
        if (localStorage.getItem('theme') === 'dark' && !document.body.classList.contains('theme-dark')) {
            applyTheme('dark');
        }
    }, 1000);
    
    // Aplica tema intunecata si la incarcarea DOMului si la modificari ulterioare
    applyDarkToElements();
    
    // Un observer pentru a detecta adaugarea de noi elemente si a le aplica tema
    const observer = new MutationObserver(function(mutations) {
        if (localStorage.getItem('theme') === 'dark') {
            applyDarkToElements();
        }
    });
    
    // Pornim observarea pentru modificari in DOM
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Aplica clasa 'theme-dark' direct pe containerul de produse
    const gridProduse = document.querySelector('.grid-produse');
    if (gridProduse) {
        gridProduse.classList.add('theme-dark');
    }
    
    // Aplica clasa 'theme-dark' pe toate articolele de produs
    const produse = document.querySelectorAll('.produs');
    produse.forEach(produs => {
        produs.classList.add('theme-dark');
    });
    
    // Verifica daca exista elemente care nu au primit clasa theme-dark dupa 500ms
    setTimeout(function() {
        // Reaplica tema intunecata la toate elementele
        applyDarkToElements();
        
        // Verifica si forteaza stilul si pe elemente secundare
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            table.style.backgroundColor = 'var(--bg-color-medium)';
            table.style.color = 'var(--text-color)';
        });
        
        const ths = document.querySelectorAll('th');
        ths.forEach(th => {
            th.style.backgroundColor = 'var(--maro-deschis-dark)';
            th.style.color = 'var(--crem-deschis-dark)';
        });
        
        const trs = document.querySelectorAll('tr');
        trs.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            tds.forEach(td => {
                td.style.color = 'var(--crem-deschis-dark)';
            });
        });
    }, 500);
});