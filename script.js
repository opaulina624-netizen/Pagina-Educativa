/**
 * ==============================================================================
 * DÍA DE MUERTOS EN MÉXICO - LÓGICA INTERACTIVA Y NAVEGACIÓN
 * Universidad Bancaria de México | LIAF1001
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCarousel();
  initPetalsEffect();
  initImageModal();
  initScrollTop();
  initDynamicYear();
});

/* ==============================================================================
 * 1. NAVEGACIÓN ENTRE PÁGINAS (VISTAS DINÁMICAS Y ENLACES)
 * ============================================================================== */
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const pageViews = document.querySelectorAll('.page-view');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  // Función para cambiar de página
  function switchPage(targetId) {
    if (!targetId) return;

    // Actualizar botones de navegación
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Actualizar vista visible
    pageViews.forEach(view => {
      if (view.id === targetId) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // Cerrar menú móvil si está abierto
    if (navLinks && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      if (mobileToggle) mobileToggle.classList.remove('active');
    }

    // Scroll suave hacia el inicio del contenido
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Actualizar hash de URL sin recargar
    if (window.location.hash !== `#${targetId}`) {
      history.pushState(null, null, `#${targetId}`);
    }
  }

  // Eventos de clic en botones de navegación
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      switchPage(targetId);
    });
  });

  // Botón del logo (conduce a Inicio)
  const brandLogo = document.getElementById('brand-logo-btn');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('inicio');
    });
  }

  // Soporte para menú móvil hamburguesa
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    // Cerrar al hacer clic fuera del menú móvil
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // Cargar sección según el hash de la URL (soporte de recarga y enlaces directos)
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    switchPage(currentHash);
  } else {
    switchPage('inicio');
  }

  // Escuchar botón de atrás/adelante del navegador
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || 'inicio';
    if (document.getElementById(hash)) {
      switchPage(hash);
    }
  });
}

/* ==============================================================================
 * 2. CARRUSEL DE IMÁGENES REALES (PÁGINA PRINCIPAL)
 * ============================================================================== */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicatorsContainer = document.getElementById('carousel-indicators');
  const carouselContainer = document.querySelector('.carousel-container');

  if (!slides.length || !indicatorsContainer) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideCount = slides.length;

  // Generar puntos indicadores dinámicamente
  indicatorsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Ir a foto ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    indicatorsContainer.appendChild(dot);
  });

  const dots = indicatorsContainer.querySelectorAll('.indicator-dot');

  function updateSlideClasses() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active-slide', idx === currentIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    updateSlideClasses();
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Autoplay cada 5 segundos
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pausar al pasar el ratón sobre el carrusel
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Soporte para gestos táctiles (Swipe en móviles)
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  }

  // Teclas de flecha izquierda/derecha
  document.addEventListener('keydown', (e) => {
    const inicioView = document.getElementById('inicio');
    if (inicioView && inicioView.classList.contains('active-view')) {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    }
  });

  startAutoplay();
}

/* ==============================================================================
 * 3. EFECTO FLOTANTE DE PÉTALOS DE CEMPASÚCHIL
 * ============================================================================== */
function initPetalsEffect() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const petalCount = 12; // Cantidad óptima y ligera para gran rendimiento

  for (let i = 0; i < petalCount; i++) {
    createPetal(container);
  }
}

function createPetal(container) {
  const petal = document.createElement('div');
  petal.className = 'petal';

  const size = Math.random() * 12 + 10; // 10px a 22px
  const left = Math.random() * 100; // 0% a 100% de ancho
  const duration = Math.random() * 8 + 6; // 6s a 14s
  const delay = Math.random() * 5; // 0s a 5s

  petal.style.width = `${size}px`;
  petal.style.height = `${size * 0.75}px`;
  petal.style.left = `${left}%`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;

  container.appendChild(petal);
}

/* ==============================================================================
 * 4. MODAL / LIGHTBOX PARA AMPLIAR IMÁGENES
 * ============================================================================== */
function initImageModal() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  if (!modal || !modalImg) return;

  // Hacer clickeables todas las imágenes con clase inspectable
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.inspectable-img');
    if (target) {
      const src = target.getAttribute('src');
      const alt = target.getAttribute('alt') || 'Fotografía de Día de Muertos';
      modalImg.src = src;
      modalCaption.textContent = alt;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==============================================================================
 * 5. BOTÓN FLOTANTE "VOLVER ARRIBA"
 * ============================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==============================================================================
 * 6. AÑO DINÁMICO EN EL PIE DE PÁGINA
 * ============================================================================== */
function initDynamicYear() {
  const yearElement = document.getElementById('year-span');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
  }
}
