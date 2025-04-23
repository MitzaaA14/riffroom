document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const menuContainer = document.querySelector('nav > ul');
  const menuItems = document.querySelectorAll('nav > ul > li');

  if (!navToggle || !menuContainer) {
    console.error("Elemente lipsă în pagină:", {
      navToggle: !!navToggle,
      menuContainer: !!menuContainer
    });
    return; 
  }

  console.log("Elementele au fost găsite corect");
  
  navToggle.addEventListener('click', function (e) {
    console.log("Click pe navToggle");
    
    this.classList.toggle('active');

    if (!menuContainer.classList.contains('show')) {
      // deschide meniul
      document.body.classList.add('menu-open');
      
      menuContainer.style.cssText = 'width: 0; height: 0; opacity: 0;';
      menuContainer.classList.add('show');
      
      // pornește animația
      let step = 0;
      const totalSteps = 20;
      
      function animate() {
        step++;
        if (step <= totalSteps) {
          const progress = step / totalSteps;
          
          menuContainer.style.width = (progress * 100) + 'vw';
          menuContainer.style.height = (progress * Math.max(350, menuContainer.scrollHeight)) + 'px'; 
          menuContainer.style.opacity = 0.3 + (progress * 0.7);
          
          requestAnimationFrame(animate);
        } else {
          menuContainer.classList.add('animation-completed');
          menuContainer.style.height = 'auto';
          menuContainer.style.maxHeight = '80vh';
        }
      }
      
      requestAnimationFrame(animate);
    } else {
      menuContainer.classList.remove('show', 'animation-completed');
      document.body.classList.remove('menu-open');
      
      setTimeout(function() {
        menuContainer.style.cssText = '';
      }, 50);
    }
  });

  // adaugă tranzițiile și animațiile 
  menuItems.forEach(function(item) {
    const submenu = item.querySelector('ul');
    
    if (submenu) {
      item.addEventListener('mouseenter', function() {
        if (window.innerWidth <= 768) {
          if (menuContainer.classList.contains('animation-completed')) {
            const link = item.querySelector('a');
            if (link) link.classList.add('hover');
            
            submenu.style.display = 'block';
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
            submenu.style.opacity = '1';
            
            setTimeout(() => {
              if (menuContainer.classList.contains('show')) {
                menuContainer.style.height = 'auto';
              }
            }, 300);
          }
        }
      });
      
      item.addEventListener('mouseleave', function() {
        if (window.innerWidth <= 768) {
          const link = item.querySelector('a');
          if (link) link.classList.remove('hover');
          
          submenu.style.maxHeight = '0';
          submenu.style.opacity = '0';
        }
      });
    }
  });
  
  // efectul săgeților
  if (window.innerWidth > 768) {
    const submenuLinks = document.querySelectorAll('nav ul li ul li a');
    
    submenuLinks.forEach(function(link) {
      link.addEventListener('mouseenter', function() {
        const arrow = this.querySelector('.arrow');
        if (arrow) {
          arrow.style.opacity = '1';
          arrow.style.transform = 'translateX(0)';
        }
      });
      
      link.addEventListener('mouseleave', function() {
        const arrow = this.querySelector('.arrow');
        if (arrow) {
          arrow.style.opacity = '0';
          arrow.style.transform = 'translateX(-10px)';
        }
      });
    });
  }
  
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (menuContainer.classList.contains('show')) {
        navToggle.click();
      }
      
      // resetează toate stilurile inline
      menuContainer.removeAttribute('style');
      menuItems.forEach(function(item) {
        const link = item.querySelector('a');
        if (link) link.classList.remove('hover');
        
        const submenu = item.querySelector('ul');
        if (submenu) {
          submenu.removeAttribute('style');
          
          const submenuItems = submenu.querySelectorAll('li');
          submenuItems.forEach(function(subItem) {
            subItem.removeAttribute('style');
            
            // resetează submeniurile de nivelul 2
            const nestedSubmenu = subItem.querySelector('ul');
            if (nestedSubmenu) {
              nestedSubmenu.removeAttribute('style');
            }
          });
        }
      });
    }
  });
});