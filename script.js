// Variables globales para el carrusel
let currentSlide = 0;
let slideInterval;
let slides = [];
let indicators = [];
let totalSlides = 0;

// Navegación móvil
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar variables del carrusel después de que el DOM esté cargado
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    totalSlides = slides.length;

    console.log('Carrusel inicializado:', {
        slides: slides.length,
        indicators: indicators.length,
        totalSlides: totalSlides
    });

    // Asegurar que el primer slide esté activo
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    if (indicators.length > 0) {
        indicators[0].classList.add('active');
    }
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Formulario de reservas
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const nombre = formData.get('nombre');
            const fecha = formData.get('fecha');
            const destino = formData.get('destino');
            const personas = formData.get('personas');
            const presupuesto = formData.get('presupuesto');

            // Crear mensaje para WhatsApp
            const mensaje = `¡Hola! Me interesa hacer una reserva con los siguientes datos:

📝 *Información de la Reserva:*
• Nombre: ${nombre}
• Fecha del viaje: ${fecha}
• Destino: ${destino}
• Número de personas: ${personas}
• Presupuesto: ${presupuesto}

¿Podrían enviarme más información y la cotización completa?

¡Gracias!`;

            const whatsappURL = `https://wa.me/573103776685?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappURL, '_blank');
        });
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const nombre = formData.get('nombre');
            const email = formData.get('email');
            const mensaje = formData.get('mensaje');

            // Crear mensaje para WhatsApp
            const whatsappMessage = `¡Hola! Me pongo en contacto desde la página web:

👤 *Datos de contacto:*
• Nombre: ${nombre}
• Email: ${email}

💬 *Mensaje:*
${mensaje}

¡Espero su respuesta!`;

            const whatsappURL = `https://wa.me/573103776685?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappURL, '_blank');

            // Mostrar mensaje de confirmación
            showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
            this.reset();
        });
    }

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.plan-card, .feature, .blog-post, .gallery-item').forEach(el => {
        observer.observe(el);
    });

    // Galería con lightbox simple
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function () {
            openLightbox(this.src, this.alt);
        });
    });

    // Validación de formularios en tiempo real
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function () {
            validateField(this);
        });

        field.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Inicializar carrusel de imágenes
    initializeCarousel();
});

// Funciones del carrusel de imágenes (globales para que funcionen con onclick)
function showSlide(index) {
    console.log('showSlide llamado con índice:', index);

    if (!slides || slides.length === 0) {
        console.log('No hay slides disponibles');
        return;
    }

    // Asegurar que el índice esté en rango
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    // Remover clase active de todos los slides e indicadores
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Agregar clase active al slide e indicador actual
    if (slides[index]) slides[index].classList.add('active');
    if (indicators[index]) indicators[index].classList.add('active');

    currentSlide = index;
    console.log('Slide cambiado a:', currentSlide);
}

function changeSlide(direction) {
    console.log('changeSlide llamado con dirección:', direction);

    if (totalSlides === 0) {
        console.log('No hay slides para cambiar');
        return;
    }

    let newSlide;
    if (direction === 1) {
        newSlide = (currentSlide + 1) % totalSlides;
    } else {
        newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    }

    showSlide(newSlide);

    // Reiniciar el intervalo automático
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    startSlideShow();
}

function goToSlide(index) {
    showSlide(index);

    // Reiniciar el intervalo automático
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    startSlideShow();
}

function startSlideShow() {
    if (totalSlides <= 1) return; // No iniciar si hay 1 o menos slides

    slideInterval = setInterval(() => {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }, 3000); // Cambiar cada 3 segundos
}

function initializeCarousel() {
    if (totalSlides === 0) return; // No hay slides

    // Agregar event listeners a los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Iniciar el slideshow automático
    startSlideShow();

    // Pausar el slideshow cuando el mouse está sobre el hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        heroSection.addEventListener('mouseleave', () => {
            startSlideShow();
        });
    }

    // Soporte para navegación con teclado
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Función para validar campos
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Validaciones específicas
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email no válido';
            }
            break;
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Teléfono no válido';
            }
            break;
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            if (value && selectedDate <= today) {
                isValid = false;
                errorMessage = 'La fecha debe ser futura';
            }
            break;
    }

    // Validación de campos requeridos
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }

    // Aplicar estilos de validación
    if (isValid) {
        field.classList.remove('error');
        removeErrorMessage(field);
    } else {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }

    return isValid;
}

// Función para mostrar mensaje de error
function showErrorMessage(field, message) {
    removeErrorMessage(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    `;

    field.parentNode.appendChild(errorDiv);
}

// Función para remover mensaje de error
function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Función para lightbox simple
function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close">&times;</button>
        </div>
    `;

    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;

    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    `;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 5px;
    `;

    document.body.appendChild(lightbox);

    // Cerrar lightbox
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => lightbox.remove(), 300);
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.parentElement) {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => lightbox.remove(), 300);
        }
    });
}

// Agregar estilos de animación para notificaciones y lightbox
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
`;

document.head.appendChild(style);

// Precargar las imágenes para una transición más suave
function preloadImages() {
    const imageUrls = [
        'imagenes/01.jpg', 'imagenes/02.jpg', 'imagenes/03.jpg', 'imagenes/04.jpg',
        'imagenes/05.jpg', 'imagenes/06.jpg', 'imagenes/07.jpg', 'imagenes/08.jpg',
        'imagenes/09.jpg', 'imagenes/10.jpg', 'imagenes/11.jpg', 'imagenes/12.jpg'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Precargar imágenes cuando se carga la página
window.addEventListener('load', preloadImages);