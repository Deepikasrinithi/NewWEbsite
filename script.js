/* =====================================================
   PRAPANJA FOUNDATION - ANBUM ARAMUM
   Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Set current year in footer ----------
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ---------- Navbar shadow + back-to-top on scroll ----------
  var mainNav = document.getElementById('mainNav');
  var backToTop = document.querySelector('.back-to-top');

  function handleScroll() {
    if (window.scrollY > 40) {
      mainNav.style.boxShadow = '0 4px 18px rgba(92, 26, 38, 0.15)';
    } else {
      mainNav.style.boxShadow = '0 1px 0 rgba(92, 26, 38, 0.08)';
    }

    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // run once on load

  // ---------- Close mobile menu after clicking a link ----------
  var navLinks = document.querySelectorAll('#navMenu .nav-link');
  var navMenu = document.getElementById('navMenu');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('show')) {
        var bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
        bsCollapse.hide();
      }
    });
  });

  // ---------- Scroll reveal animation ----------
  // Sections fade/slide into view once, the first time they are scrolled to.
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: just show everything if IntersectionObserver isn't supported
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Gallery filtering ----------
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var galleryEmptyMsg = document.querySelector('.gallery-empty');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;

      galleryItems.forEach(function (item) {
        var categories = item.getAttribute('data-category');
        var matches = filter === 'all' || categories.indexOf(filter) !== -1;
        item.classList.toggle('hidden', !matches);
        if (matches) visibleCount++;
      });

      if (galleryEmptyMsg) {
        galleryEmptyMsg.classList.toggle('d-none', visibleCount !== 0);
      }
    });
  });

  // ---------- Gallery lightbox ----------
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var galleryFrames = document.querySelectorAll('.gallery-frame');

  galleryFrames.forEach(function (frame) {
    frame.addEventListener('click', function () {
      var fullSrc = frame.getAttribute('data-full');
      var caption = frame.getAttribute('data-caption') || '';
      lightboxImg.src = fullSrc;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      // Close when clicking the dark backdrop, not the image itself
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeLightbox();
  });

  // ---------- Request Help form validation ----------
  var helpForm = document.getElementById('helpForm');
  var helpSuccess = document.getElementById('helpSuccess');
  var helpAnotherBtn = document.getElementById('helpAnother');

  if (helpForm) {
    helpForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      // Extra check: phone must be exactly 10 digits
      var phoneInput = document.getElementById('helpPhone');
      var phoneValue = phoneInput.value.trim();
      var phonePattern = /^[0-9]{10}$/;

      if (!phonePattern.test(phoneValue)) {
        phoneInput.setCustomValidity('Please enter a valid 10-digit phone number.');
      } else {
        phoneInput.setCustomValidity('');
      }

      if (helpForm.checkValidity() === false) {
        helpForm.classList.add('was-validated');
        var firstInvalid = helpForm.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Form is valid -- this is a frontend-only demo, so we simply
      // show a success message instead of sending data anywhere.
      helpForm.classList.add('d-none');
      helpSuccess.classList.remove('d-none');
      helpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Clear custom validity message as the user types a fresh phone number
    document.getElementById('helpPhone').addEventListener('input', function () {
      this.setCustomValidity('');
    });
  }

  // ---------- Allow submitting another request ----------
  if (helpAnotherBtn) {
    helpAnotherBtn.addEventListener('click', function () {
      helpForm.reset();
      helpForm.classList.remove('was-validated');
      helpForm.classList.remove('d-none');
      helpSuccess.classList.add('d-none');
      helpForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
