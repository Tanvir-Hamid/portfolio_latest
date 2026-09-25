// Mobile navigation elements (declared first so all handlers can use them)
const menuToggle = document.querySelector(".menu-toggle");
const navLinksContainer = document.querySelector("#nav-links");
const navLinks = navLinksContainer;

// 1) Automatically update the footer year
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// 2) Smooth-scroll internal links, with a fallback for invalid selectors
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start"
    });

    // Close the mobile navigation after choosing a section
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// 3) Typing effect
const typingElement = document.querySelector(".typing");
const roles = ["Web Developer", "Frontend Developer", "MERN Stack Learner"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingElement && !reduceMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  function typeNext() {
    const role = roles[roleIndex];

    if (deleting) {
      charIndex--;
      typingElement.textContent = role.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        window.setTimeout(typeNext, 300);
        return;
      }
      window.setTimeout(typeNext, 55);
    } else {
      const nextRole = roles[roleIndex];
      charIndex++;
      typingElement.textContent = nextRole.slice(0, charIndex);
      if (charIndex >= nextRole.length) {
        deleting = true;
        window.setTimeout(typeNext, 1500);
        return;
      }
      window.setTimeout(typeNext, 95);
    }
  }
  window.setTimeout(typeNext, 1500);
}

// 4) Reveal sections/cards as they enter the viewport
const revealElements = document.querySelectorAll(
  ".section-heading, .about-grid, .skill-card, .project-card, .timeline-item, .contact-box"
);

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => {
    element.classList.add("hidden");
    revealObserver.observe(element);
  });
}

// 5) Highlight the active navigation link
const sections = document.querySelectorAll("main section[id]");
const navLinkItems = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window && sections.length && navLinkItems.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinkItems.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

// 6) Mobile navigation toggle
if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksContainer.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// 7) Warn if placeholder email has not been replaced
document.querySelectorAll('a[href="mailto:your-email@example.com"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Please replace your-email@example.com in index.html with your own email address.");
  });
});
