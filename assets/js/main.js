(function () {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const submenuButtons = document.querySelectorAll(".submenu-toggle");
  const carousels = document.querySelectorAll("[data-carousel]");
  const menuMetaItems = document.querySelectorAll(".menu-list article p");

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  submenuButtons.forEach(function (button) {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", function () {
      const parent = button.closest(".has-submenu");
      if (!parent) return;
      const isOpen = parent.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("click", function (event) {
    if (event.target.closest(".has-submenu")) return;
    document.querySelectorAll(".has-submenu.is-open").forEach(function (item) {
      item.classList.remove("is-open");
      const button = item.querySelector(".submenu-toggle");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  });

  carousels.forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll("[class*='__slide']"));
    let activeIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });

    if (slides.length <= 1) return;

    if (activeIndex < 0) {
      activeIndex = 0;
      slides[activeIndex].classList.add("is-active");
    }

    window.setInterval(function () {
      slides[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add("is-active");
    }, 5000);
  });

  function isPriceText(value) {
    return /(\d+,\d{2}\s*EUR|\d+,\d{2}\s*€|\d+\s*€|\+\d+,\d{2})/i.test(value);
  }

  menuMetaItems.forEach(function (meta) {
    const text = meta.textContent.trim();
    if (!text || meta.querySelector(".menu-price")) return;

    const parts = text.split(" · ").map(function (part) {
      return part.trim();
    }).filter(Boolean);

    if (!parts.length) return;

    let firstPriceIndex = parts.findIndex(isPriceText);
    if (firstPriceIndex < 0) {
      firstPriceIndex = parts.length - 1;
    }

    const descriptionParts = parts.slice(0, firstPriceIndex);
    const priceParts = parts.slice(firstPriceIndex);
    const description = descriptionParts.join(" · ");

    meta.textContent = "";
    meta.classList.add("menu-meta");

    if (description) {
      const descriptionNode = document.createElement("span");
      descriptionNode.className = "menu-description";
      descriptionNode.textContent = description;
      meta.appendChild(descriptionNode);
    } else {
      meta.classList.add("menu-meta--price-only");
    }

    const pricesNode = document.createElement("span");
    pricesNode.className = "menu-prices menu-prices--count-" + Math.min(priceParts.length, 4);

    priceParts.forEach(function (pricePart) {
      const priceNode = document.createElement("span");
      priceNode.className = "menu-price";
      priceNode.textContent = pricePart;
      pricesNode.appendChild(priceNode);
    });

    meta.appendChild(pricesNode);
  });
})();
