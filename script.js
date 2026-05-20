const topbar = document.querySelector(".topbar");
const reveals = Array.from(document.querySelectorAll(".reveal"));

const updateTopbar = () => {
  if (window.scrollY > 8) {
    topbar.classList.add("is-active");
  } else {
    topbar.classList.remove("is-active");
  }
};

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  }
);

for (const section of reveals) {
  observer.observe(section);
}
