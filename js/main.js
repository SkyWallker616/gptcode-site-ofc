document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  const nav = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 50) {
      nav.classList.add("navbar-scrolled");
    } else {
      nav.classList.remove("navbar-scrolled");
    }
  });

  // Smooth scrolling para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Fechar navbar mobile após clique
        const navbarToggler = document.querySelector(".navbar-toggler");
        const navbarCollapse = document.querySelector(".navbar-collapse");

        if (navbarToggler && !navbarCollapse.classList.contains("show")) {
          navbarToggler.click();
        }
      }
    });
  });

  // Animação de elementos ao scroll
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".glass-card, .publication-card, .highlight-card"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.style.opacity = 1;
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Inicializar opacidade para animação
  document
    .querySelectorAll(".glass-card, .publication-card, .highlight-card")
    .forEach((element) => {
      element.style.opacity = 0;
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

  window.addEventListener("scroll", animateOnScroll);
  // Executar uma vez ao carregar a página
  animateOnScroll();

  // Tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
