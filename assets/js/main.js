// Ocultar preloader cuando todo cargue
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // Retraso para asegurar que la animación termine
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // Coincide con la transición CSS
    }, 1500); // Tiempo mínimo de visualización
});

// Simular progreso (opcional, para pruebas)
document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.querySelector('.progress-fill');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressFill.style.width = `${progress}%`;
    }, 300);
});



// Activar animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});



// Navbar Dinámica
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Efecto al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    // Scroll suave con offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerHeight = document.querySelector('header').offsetHeight;
    
    window.scrollTo({
      top: target.offsetTop - headerHeight,
      behavior: 'smooth'
    });
  });
});
    
    // Menú Hamburguesa
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('active');
        
        // Bloquear scroll cuando el menú está abierto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar menú al hacer clic en un enlace (móvil)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
});




// Cargar proyectos desde JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const container = document.getElementById('projects-container');
            
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                projectCard.innerHTML = `
                    <div class="project-header">
                        <img src="${project.image}" alt="${project.name}" class="project-image">
                        <div class="project-badge ${project.type}">${project.type.toUpperCase()}</div>
                    </div>
                    <div class="project-body">
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
                `;
                
                container.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error loading projects:', error));
});

// Helpers para iconos y formato
function getLinkIcon(type) {
    const icons = {
        github: '<i class="fab fa-github"></i>',
        youtube: '<i class="fab fa-youtube"></i>',
        demo: '<i class="fas fa-external-link-alt"></i>',
        documentation: '<i class="fas fa-book"></i>'
    };
    return icons[type] || '';
}

function formatLinkType(type) {
    const names = {
        github: 'Código',
        youtube: 'Video',
        demo: 'Demo',
        documentation: 'Docs'
    };
    return names[type] || type;
}




// Formulario de Contacto
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');
    
    if (contactForm) {
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
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formResponse.className = 'form-response success';
                    formResponse.textContent = '¡Mensaje enviado con éxito! Me pondré en contacto pronto.';
                    contactForm.reset();
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                formResponse.className = 'form-response error';
                formResponse.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 5000);
            }
        });
    }
});