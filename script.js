// Jasabyte Revamp - Interactive behaviors
(function () {
  const doc = document.documentElement;

  // Theme toggle with persistence
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(theme) {
    if (theme === 'dark') {
      doc.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.innerHTML = '<span aria-hidden="true">Light</span>';
    } else {
      doc.removeAttribute('data-theme');
      if (themeToggle) themeToggle.innerHTML = '<span aria-hidden="true">Dark</span>';
    }
    localStorage.setItem('jasabyte-theme', theme);
  }

  const savedTheme = localStorage.getItem('jasabyte-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark.matches) {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = doc.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Mobile menu
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navMenu = document.querySelector('[data-menu]');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Tab system for services
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      button.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // Solution filters
  const filterButtons = document.querySelectorAll('.filter-button');
  const solutionCards = document.querySelectorAll('.solution-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      solutionCards.forEach(card => {
        if (filter === 'all') {
          card.hidden = false;
        } else {
          const cats = card.getAttribute('data-category') || '';
          card.hidden = !cats.includes(filter);
        }
      });
    });
  });

  // FAQ accordions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen);
    });
  });

  // Contact form -> mailto
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const org = formData.get('organisation') || '';
      const message = formData.get('message') || '';

      const subject = encodeURIComponent('Jasabyte Enquiry from ' + name);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nOrganisation: ${org}\n\n${message}`
      );

      window.location.href = `mailto:hello@jasabyte.com?subject=${subject}&body=${body}`;
    });
  }

  // Copy email buttons
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-copy-email');
      navigator.clipboard.writeText(email).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = original; }, 1800);
      });
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Footer year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Service jump links in footer
  document.querySelectorAll('[data-service-jump]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-service-jump');
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        // Trigger the correct tab
        const tabBtn = document.querySelector(`[data-tab="${target}"]`);
        if (tabBtn) {
          tabBtn.click();
        }
      }
    });
  });
})();