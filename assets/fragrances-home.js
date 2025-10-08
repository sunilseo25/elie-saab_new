$(document).ready(() => {
  document.querySelectorAll(".fragrance-home").forEach(function (el) {
    const parent = el.closest(".shopify-section");
    if (parent) {
      parent.classList.add("custom-sticky-style");
    }
  });
  document.querySelectorAll(".fragrance-le-parfum").forEach(function (el) {
    const parent = el.closest(".shopify-section");
    if (parent) {
      parent.classList.add("custom-sticky-style");
    }
  });
  document.querySelectorAll(".fragrance-elixir").forEach(function (el) {
    const parent = el.closest(".shopify-section");
    if (parent) {
      parent.classList.add("custom-sticky-style");
    }
  });
});
