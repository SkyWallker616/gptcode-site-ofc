const nav = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 50) {
    nav.classList.add("navbar-scrolled");
  } else {
    nav.classList.remove("navbar-scrolled");
  }
});
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

if (navbarToggler && !navbarCollapse.classList.contains("show")) {
  navbarToggler.click();
}
