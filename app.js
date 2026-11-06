const menu = document.querySelector('#menu');
const brief = document.querySelector('#brief');
const menuTrigger = document.querySelector('.menu-trigger');

menuTrigger?.addEventListener('click', () => {
  menu?.showModal();
  menuTrigger.setAttribute('aria-expanded', 'true');
});
menu?.addEventListener('close', () => menuTrigger.setAttribute('aria-expanded', 'false'));

document.querySelectorAll('[data-open-brief]').forEach(button => {
  button.addEventListener('click', () => brief?.showModal());
});
document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog').close());
});
menu?.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    menu.close();
    const destination = document.querySelector(link.getAttribute('href'));
    if (!destination) return;
    history.replaceState(null, '', link.getAttribute('href'));
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
    destination.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
  });
});
// The draft stays in memory only. No endpoint or recipient has been provided.
document.querySelector('#brief-form')?.addEventListener('submit', event => event.preventDefault());
const serviceItems = [...document.querySelectorAll('.service')];
const serviceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const setServiceState = (service, shouldOpen) => {
  if (service.open === shouldOpen || service.dataset.animating) return;
  const summary = service.querySelector('summary');
  if (serviceMotion.matches) { service.open = shouldOpen; return; }
  const startHeight = service.getBoundingClientRect().height;
  if (shouldOpen) service.open = true;
  const endHeight = shouldOpen ? service.scrollHeight : summary.getBoundingClientRect().height;
  service.dataset.animating = 'true';
  service.style.overflow = 'hidden';
  service.style.height = `${startHeight}px`;
  requestAnimationFrame(() => {
    service.style.transition = 'height 360ms cubic-bezier(.22,1,.36,1)';
    service.style.height = `${endHeight}px`;
  });
  let completed = false;
  const finish = event => {
    if (event && event.propertyName !== 'height') return;
    if (completed) return;
    completed = true;
    service.removeEventListener('transitionend', finish);
    clearTimeout(fallback);
    if (!shouldOpen) service.open = false;
    service.style.height = '';
    service.style.overflow = '';
    service.style.transition = '';
    delete service.dataset.animating;
  };
  service.addEventListener('transitionend', finish);
  const fallback = setTimeout(finish, 440);
};
serviceItems.forEach(service => {
  service.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    const shouldOpen = !service.open;
    if (shouldOpen) serviceItems.filter(item => item !== service && item.open).forEach(item => setServiceState(item, false));
    setServiceState(service, shouldOpen);
  });
});
document.querySelectorAll('.capability-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const service = document.querySelector(chip.getAttribute('href'));
    if (service) {
      serviceItems.filter(item => item !== service && item.open).forEach(item => setServiceState(item, false));
      setServiceState(service, true);
    }
  });
});
matchMedia('(min-width: 701px)').addEventListener('change', event => {
  if (event.matches && menu?.open) menu.close();
});

// Animate on entry without hiding content before JavaScript or intercepting scroll.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll('.section-heading, .project, .studio-intro, .service, .contact .section-space, .case-section');
const revealed = new WeakSet();
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    revealObserver.unobserve(entry.target);
    if (revealed.has(entry.target)) return;
    revealed.add(entry.target);
    if (reducedMotion.matches) return;
    entry.target.animate([
      { opacity: 0.15, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
  });
}, { threshold: 0.08 });
revealTargets.forEach(target => revealObserver.observe(target));
reducedMotion.addEventListener('change', event => {
  if (event.matches) document.getAnimations().forEach(animation => animation.cancel());
});
