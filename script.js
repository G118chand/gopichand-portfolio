const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const cursorGlow = document.querySelector(".cursor-glow");
const sectionCounter = document.querySelector(".section-counter b");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const railLinks = [...document.querySelectorAll(".chapter-rail a")];
const sections = [...document.querySelectorAll(".chapter[id]")];

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 24));
window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = `#${entry.target.id}`;
      if (sectionCounter) sectionCounter.textContent = entry.target.dataset.chapter || "01";
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === target));
      railLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === target));
    });
  },
  { rootMargin: "-36% 0px -54%", threshold: 0 },
);
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll(".experience-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".experience-item");
    const wasOpen = item?.classList.contains("open");
    document.querySelectorAll(".experience-item").forEach((entry) => {
      entry.classList.remove("open");
      entry.querySelector("button")?.setAttribute("aria-expanded", "false");
      const icon = entry.querySelector("button i");
      if (icon) icon.textContent = "+";
    });
    if (!wasOpen && item) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      const icon = button.querySelector("i");
      if (icon) icon.textContent = "×";
    }
  });
});

function createRepositoryCard(repository) {
  const card = document.createElement("article");
  card.className = "repo-card";
  const status = document.createElement("span");
  status.textContent = repository.fork ? "FORKED NODE" : "PUBLIC NODE";
  const title = document.createElement("h3");
  title.textContent = repository.name.replaceAll("-", " ");
  const description = document.createElement("p");
  description.textContent = repository.description || "Explore the source, structure, and latest build directly on GitHub.";
  const meta = document.createElement("div");
  meta.className = "repo-meta";
  const language = document.createElement("span");
  language.textContent = repository.language || "Code";
  const branch = document.createElement("span");
  branch.textContent = repository.default_branch || "main";
  meta.append(language, branch);
  const link = document.createElement("a");
  link.className = "repo-link";
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", `Open ${repository.name} on GitHub`);
  link.textContent = "↗";
  card.append(status, title, description, meta, link);
  return card;
}

async function loadRepositories() {
  const grid = document.querySelector("#repository-grid");
  if (!grid) return;
  try {
    const response = await fetch("https://api.github.com/users/G118chand/repos?sort=updated&per_page=6");
    if (!response.ok) throw new Error("GitHub request failed");
    const repositories = await response.json();
    grid.replaceChildren(...repositories.map(createRepositoryCard));
  } catch {
    grid.querySelector("h3").textContent = "Repository universe";
    grid.querySelector("p").textContent = "Open the complete collection directly on GitHub.";
  }
}

loadRepositories();
