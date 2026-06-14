const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

navToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const setActiveNav = () => {
  const scrollPosition = window.scrollY + 140;
  let current = sections[0]?.id || 'beranda';

  sections.forEach(section => {
    if (section.offsetTop <= scrollPosition) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActiveNav);
setActiveNav();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const mockups = [
  {
    title: 'Dashboard & Monitoring',
    image: 'images/monitoring.png',
    alt: 'Dashboard dan monitoring aplikasi Smart Drip',
    desc: 'Menampilkan ringkasan kondisi sistem, data sensor, status pompa, nilai ETc, dan prakiraan cuaca harian.'
  },
  {
    title: 'Kontrol Sistem',
    image: 'images/kontrol.png',
    alt: 'Kontrol sistem aplikasi Smart Drip',
    desc: 'Digunakan untuk mengatur mode sistem, mengontrol penyiraman, serta menjalankan fungsi manual dan otomatis.'
  },
  {
    title: 'Log Irigasi',
    image: 'images/log.png',
    alt: 'Log irigasi aplikasi Smart Drip',
    desc: 'Menyajikan riwayat aktivitas penyiraman, waktu eksekusi, status sistem, dan catatan irigasi secara terstruktur.'
  },
  {
    title: 'Konfigurasi Tanaman',
    image: 'images/konfigurasi.png',
    alt: 'Konfigurasi tanaman aplikasi Smart Drip',
    desc: 'Digunakan untuk mengatur parameter tanaman, kebutuhan air, dan konfigurasi sistem irigasi tetes.'
  }
];

const mockupImage = document.getElementById('mockupImage');
const mockupTitle = document.getElementById('mockupTitle');
const mockupDesc = document.getElementById('mockupDesc');
const mockupPreview = document.querySelector('.mockup-preview');

document.querySelectorAll('.mockup-tab').forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.mockup);
    const data = mockups[index];
    if (!data || !mockupImage || !mockupTitle || !mockupDesc) return;

    document.querySelectorAll('.mockup-tab').forEach(item => item.classList.remove('active'));
    button.classList.add('active');

    mockupPreview?.classList.add('is-changing');

    window.setTimeout(() => {
      mockupImage.src = data.image;
      mockupImage.alt = data.alt;
      mockupTitle.textContent = data.title;
      mockupDesc.textContent = data.desc;
      mockupPreview?.classList.remove('is-changing');
    }, 160);
  });
});

const magicBento = document.querySelector('[data-magic-bento]');
const magicCards = [...document.querySelectorAll('.magic-bento-card')];
const isSmallScreen = () => window.matchMedia('(max-width: 768px)').matches;

function updateMagicGlow(card, clientX, clientY, intensity = 1) {
  const rect = card.getBoundingClientRect();
  const relativeX = ((clientX - rect.left) / rect.width) * 100;
  const relativeY = ((clientY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', String(intensity));
}

magicBento?.addEventListener('mousemove', event => {
  if (isSmallScreen()) return;

  magicCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const proximity = 260;
    const intensity = Math.max(0, 1 - distance / proximity);
    updateMagicGlow(card, event.clientX, event.clientY, intensity);
  });
});

magicBento?.addEventListener('mouseleave', () => {
  magicCards.forEach(card => {
    card.style.setProperty('--glow-intensity', '0');
  });
});

magicCards.forEach(card => {
  card.addEventListener('mousemove', event => {
    if (isSmallScreen()) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    card.style.setProperty('--tilt-x', `${((y - centerY) / centerY) * -7}deg`);
    card.style.setProperty('--tilt-y', `${((x - centerX) / centerX) * 7}deg`);
    card.style.setProperty('--magnet-x', `${(x - centerX) * 0.035}px`);
    card.style.setProperty('--magnet-y', `${(y - centerY) * 0.035}px`);
    updateMagicGlow(card, event.clientX, event.clientY, 1);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--magnet-x', '0px');
    card.style.setProperty('--magnet-y', '0px');
    card.style.setProperty('--glow-intensity', '0');
  });

  card.addEventListener('click', event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement('span');
    ripple.className = 'magic-ripple';
    ripple.style.width = `${maxDistance * 2}px`;
    ripple.style.height = `${maxDistance * 2}px`;
    ripple.style.left = `${x - maxDistance}px`;
    ripple.style.top = `${y - maxDistance}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
});

const phoneMockup = document.querySelector('[data-phone-tilt]');

phoneMockup?.addEventListener('mousemove', event => {
  const bounds = phoneMockup.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;

  phoneMockup.style.setProperty('--tilt-y', `${x * 7}deg`);
  phoneMockup.style.setProperty('--tilt-x', `${y * -6}deg`);
});

phoneMockup?.addEventListener('mouseleave', () => {
  phoneMockup.style.setProperty('--tilt-y', '0deg');
  phoneMockup.style.setProperty('--tilt-x', '0deg');
});
