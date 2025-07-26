/**
 * Portfolio Script - Optimizado
 * Maneja las interacciones y efectos del portafolio
 */

// Configuración global
const CONFIG = {
  preloader: {
    minDisplayTime: 1500, // 1.5 seg
    fadeOutTime: 500      // 0.5 seg
  },
  scroll: {
    headerHeight: 80,
    threshold: 0.1
  },
  form: {
    messageTimeout: 5000  // 5 seg
  }
};

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollEffects();
  initNavbar();
  loadProjects();
  initContactForm();
});

/**
 * Maneja la animación y desaparición del preloader
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressFill = document.querySelector('.progress-fill');
  
  if (!preloader || !progressFill) return;

  // Animación de progreso simulada
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      clearInterval(progressInterval);
      progressFill.style.width = '100%';
    } else {
      progressFill.style.width = `${progress}%`;
    }
  }, 300);

  // Ocultar preloader después del tiempo mínimo
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      clearInterval(progressInterval);
    }, CONFIG.preloader.fadeOutTime);
  }, CONFIG.preloader.minDisplayTime);
}

/**
 * Activa animaciones cuando los elementos son visibles al hacer scroll
 */
function initScrollEffects() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: CONFIG.scroll.threshold });

  sections.forEach(section => observer.observe(section));
}

/**
 * Configura la navbar dinámica y el menú hamburguesa
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (!navbar || !menuToggle || !navMenu) return;

  // Efecto de scroll en la navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Menú hamburguesa
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('open');
    navMenu.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  });

  // Cerrar menú al hacer clic en enlaces (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Scroll suave con offset para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        window.scrollTo({
          top: target.offsetTop - CONFIG.scroll.headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Carga y muestra los proyectos desde el JSON
 */
function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

  // Imagen predeterminada
    const DEFAULT_PROJECT_IMAGE = 'assets/img/projects/default-project.jpg';

    fetch('assets/data/projects.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(projects => {
        container.innerHTML = projects.map(project => `
            <div class="project-card">
            <div class="project-header">
                <img src="${project.image || DEFAULT_PROJECT_IMAGE}" 
                    alt="${project.name}" 
                    class="project-image" 
                    loading="lazy"
                    onerror="this.src='${DEFAULT_PROJECT_IMAGE}'">
                <div class="project-badge ${project.type}">${project.type.toUpperCase()}</div>
            </div>
            <div class="project-content">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
            <div class="project-footer">
                ${project.links.map(link => `
                <a href="${link.url}" target="_blank" class="project-link ${link.type}">
                    ${getLinkIcon(link.type)} ${formatLinkType(link.type)}
                </a>
                `).join('')}
            </div>
            </div>
        `).join('');
    })
        .catch(error => {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p class="error-message">No se pudieron cargar los proyectos. Por favor, inténtalo más tarde.</p>';
    });
}

/**
 * Inicializa el formulario de contacto
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formResponse = document.getElementById('formResponse');
  
  if (!contactForm || !formResponse) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    try {
      // Mostrar estado de carga
      submitBtn.disabled = true;
      btnText.textContent = 'Enviando...';
      
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        showFormResponse(formResponse, 'success', '¡Mensaje enviado con éxito! Me pondré en contacto pronto.');
        contactForm.reset();
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      showFormResponse(formResponse, 'error', 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = originalText;
    }
  });
}

/**
 * Muestra un mensaje de respuesta del formulario
 */
function showFormResponse(element, type, message) {
  if (!element) return;
  
  element.className = `form-response ${type}`;
  element.textContent = message;
  element.style.display = 'block';
  
  setTimeout(() => {
    element.style.display = 'none';
  }, CONFIG.form.messageTimeout);
}

/**
 * Helper: Obtiene el icono correspondiente para un tipo de enlace
 */
function getLinkIcon(type) {
  const icons = {
    github: '<i class="fab fa-github"></i>',
    youtube: '<i class="fab fa-youtube"></i>',
    demo: '<i class="fas fa-external-link-alt"></i>',
    documentation: '<i class="fas fa-book"></i>'
  };
  return icons[type] || '';
}

/**
 * Helper: Formatea el tipo de enlace para mostrarlo
 */
function formatLinkType(type) {
  const names = {
    github: 'Código',
    youtube: 'Video',
    demo: 'Demo',
    documentation: 'Docs'
  };
  return names[type] || type;
}