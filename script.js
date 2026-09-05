const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const projectMenu = document.querySelector('.project-menu');
if (projectMenu) {
  const trigger = projectMenu.querySelector('summary');
  const panel = projectMenu.querySelector('.project-menu__panel');
  const shade = projectMenu.querySelector('.project-menu__shade');
  const cards = [...projectMenu.querySelectorAll('.project-menu__cards>a')];
  const close = projectMenu.querySelector('.menu-close');
  let motion;
  let expanded = false;
  close.hidden = false;
  const setMenu = open => {
    expanded = open;
    motion?.kill();
    if (!window.gsap) {
      projectMenu.open = open;
      [panel, shade, ...cards].forEach(element => element.removeAttribute('style'));
      return;
    }
    if (reducedMotion.matches) {
      if (open) projectMenu.open = true;
      gsap.set([panel, ...cards], { clearProps: 'transform,opacity' });
      motion = gsap.to([panel, shade], {
        opacity: open ? 1 : 0, startAt: open ? { opacity: 0 } : undefined,
        duration: open ? .2 : .13, ease: 'power2.out',
        onComplete: () => { if (!open) projectMenu.open = false; }
      });
      return;
    }
    if (open) {
      const wasOpen = projectMenu.open;
      projectMenu.open = true;
      motion = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (!wasOpen) gsap.set([panel, shade, ...cards], { clearProps: 'all' });
      motion.fromTo(shade, { opacity: wasOpen ? gsap.getProperty(shade, 'opacity') : 0 }, { opacity: 1, duration: .22 })
        .fromTo(panel, { opacity: wasOpen ? gsap.getProperty(panel, 'opacity') : 0, y: wasOpen ? gsap.getProperty(panel, 'y') : -16 }, { opacity: 1, y: 0, duration: .32 }, 0)
        .fromTo(cards, { opacity: wasOpen ? 1 : 0, y: wasOpen ? 0 : 22 }, { opacity: 1, y: 0, stagger: .04, duration: .32 }, .05);
    } else {
      motion = gsap.timeline({ onComplete: () => { projectMenu.open = false; } })
        .to(panel, { opacity: 0, y: -10, duration: .14, ease: 'power2.in' })
        .to(shade, { opacity: 0, duration: .14 }, 0);
    }
  };
  trigger.addEventListener('click', event => {
    event.preventDefault();
    setMenu(!expanded);
  });
  close.addEventListener('click', () => { setMenu(false); trigger.focus(); });
  document.addEventListener('click', event => {
    if (expanded && (!projectMenu.contains(event.target) || event.target === shade)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && expanded) { setMenu(false); trigger.focus(); }
  });
  document.addEventListener('focusin', event => {
    if (expanded && !projectMenu.contains(event.target)) setMenu(false);
  });
  reducedMotion.addEventListener('change', () => setMenu(expanded));
  window.addEventListener('pagehide', () => { motion?.kill(); projectMenu.open = false; expanded = false; });
}
// Keep navigation native; only ordinary links between local HTML routes fade out.
const pageContent = document.querySelector('main');
if (window.gsap && pageContent) {
  const enterPage = () => gsap.fromTo(pageContent, { opacity: 0 }, { opacity: 1, duration: .28, clearProps: 'opacity' });
  enterPage();
  window.addEventListener('pageshow', event => { if (event.persisted) enterPage(); });
  let navigating = false;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const destination = new URL(link.href);
    if (destination.origin !== location.origin || destination.pathname === location.pathname || !(/\/$|\.html$/.test(destination.pathname))) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    const leaving = projectMenu?.open ? [pageContent, projectMenu.querySelector('.project-menu__panel'), projectMenu.querySelector('.project-menu__shade')] : [pageContent];
    gsap.to(leaving, { opacity: 0, duration: .12, onComplete: () => location.assign(destination.href) });
  });
  window.addEventListener('pageshow', () => { navigating = false; });
}
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
  }, { passive: true });
});
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    element.classList.add('reveal-ready');
    observer.observe(element);
  });
}

const gallery = document.querySelector('.gallery');
if (gallery) {
  const previous = document.querySelector('[data-gallery-prev]');
  const next = document.querySelector('[data-gallery-next]');
  document.querySelector('.gallery-actions').hidden = false;
  const updateButtons = () => {
    previous.disabled = gallery.scrollLeft <= 2;
    next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
  };
  const scrollGallery = direction => {
    const step = gallery.querySelector('figure').getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).gap);
    gallery.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => scrollGallery(-1));
  next.addEventListener('click', () => scrollGallery(1));
  gallery.addEventListener('scroll', updateButtons, { passive: true });
  new ResizeObserver(updateButtons).observe(gallery);
  updateButtons();

  const dialog = document.querySelector('.lightbox');
  const close = document.querySelector('[data-close-lightbox]');
  let savedOverflow = '';
  if (typeof dialog.showModal === 'function') {
    gallery.addEventListener('click', event => {
      const link = event.target.closest('[data-gallery-image]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const image = link.querySelector('img');
      dialog.querySelector('img').src = link.href;
      dialog.querySelector('img').alt = image.alt;
      dialog.querySelector('p').textContent = link.closest('figure').querySelector('figcaption').textContent;
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { document.body.style.overflow = savedOverflow; });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  }
}
