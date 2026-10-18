const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#site-search");
const productCards = [...document.querySelectorAll(".product-card")];
const emptyMessage = document.querySelector("#search-empty");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

function normalizeSearchText(text) {
  return text
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function filterProducts(query) {
  const queryTerms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  productCards.forEach((card) => {
    const searchableTerms = normalizeSearchText(`${card.dataset.search} ${card.textContent}`).split(/\s+/);
    const matches = queryTerms.every((term) => searchableTerms.some((searchableTerm) => searchableTerm.startsWith(term)));
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptyMessage.hidden = visibleCount > 0;
  return visibleCount;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts(searchInput.value);
  document.querySelector("#ofertas").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => filterProducts(searchInput.value));

document.querySelector("#clear-search").addEventListener("click", () => {
  searchInput.value = "";
  filterProducts("");
  searchInput.focus();
});

document.querySelectorAll("[data-filter]").forEach((categoryLink) => {
  categoryLink.addEventListener("click", () => {
    const category = categoryLink.dataset.filter;
    searchInput.value = "";
    productCards.forEach((card) => {
      const categories = card.dataset.category.split(/\s+/);
      card.hidden = !categories.includes(category);
    });
    emptyMessage.hidden = productCards.some((card) => !card.hidden);
  });
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
  mainNav.classList.toggle("is-open", !isExpanded);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mainNav.classList.remove("is-open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.blur();
  }
});
