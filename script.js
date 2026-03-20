const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearNode = document.getElementById("year");
const header = document.querySelector("[data-header]");
const revealNodes = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("[data-section]");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const heroParallax = document.querySelector("[data-parallax]");
const heroParallaxImage = heroParallax?.querySelector("img");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealNodes.forEach((node) => {
    if (!node.classList.contains("reveal-on-load")) {
      revealObserver.observe(node);
    }
  });
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("is-active", isActive);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -35% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (heroParallaxImage) {
  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.08, 26);
    heroParallaxImage.style.transform = `translate3d(0, ${-offset}px, 0) scale(1.02)`;
  };

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    formStatus.textContent =
      "Consultation request prepared. Thank you. We will review the scope and return with next steps.";
    formStatus.classList.add("is-success");
    contactForm.reset();
  });
}
