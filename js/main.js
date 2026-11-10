(function () {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.banner-prev');
  const nextBtn = document.querySelector('.banner-next');

  let currentIndex = 0;
  let timer;
  const total = slides.length;

  function showSlide(index) {
    slides.forEach((el, i) => el.classList.toggle('active', i === index));
    dots.forEach((el, i) => el.classList.toggle('active', i === index));
  }
  function nextSlide() {
    currentIndex = (currentIndex + 1) % total;
    showSlide(currentIndex);
  }
  function prevSlide() {
    currentIndex = (currentIndex - 1 + total) % total;
    showSlide(currentIndex);
  }
  function startAutoPlay() {
    timer = setInterval(nextSlide, 5000);
  }
  function stopAutoPlay() {
    clearInterval(timer);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      currentIndex = idx;
      showSlide(currentIndex);
      startAutoPlay();
    });
  });
  nextBtn.addEventListener('click', () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
  });
  prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    nav.classList.toggle('open');
    header.classList.toggle('menu-open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      nav.classList.remove('open');
      header.classList.remove('menu-open');
    })
  })

  showSlide(currentIndex);
  startAutoPlay();
})();
