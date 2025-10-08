document.addEventListener("DOMContentLoaded", function () {
  function toSlug(title) {
    return title
      .toLowerCase()
      .replace(/[\/\s]+/g, '-')     // Replace slashes and spaces with -
      .replace(/[^\w\-]+/g, '')     // Remove special chars except -
      .replace(/\-\-+/g, '-')       // Replace multiple dashes with one
      .replace(/^-+|-+$/g, '');     // Trim dashes
  }

  const currentURL = decodeURIComponent(window.location.href.toLowerCase());

  const slugOverrides = {
    'pre-fall-2026': 'pre-fall-2025',
  };

  const dropdownItems = document.querySelectorAll('#dropdownCard div');

  // URL matching & activating the correct item on load
  dropdownItems.forEach(item => {
    const title = item.dataset.title;
    if (title) {
      let slug = toSlug(title);

      // Check override match
      for (const [urlSlug, dataSlug] of Object.entries(slugOverrides)) {
        if (currentURL.includes(urlSlug) && slug === dataSlug) {
          dropdownItems.forEach(div => div.classList.remove('active'));
          item.classList.add('active');
          return;
        }
      }

      // Fallback to slug match
      if (currentURL.includes(slug)) {
        dropdownItems.forEach(div => div.classList.remove('active'));
        item.classList.add('active');
      }
    }
  });

  // Listen to Alpine dropdown changes (mobile)
  // const selectedEl = document.querySelector('.dropdown_button span');
  // if (selectedEl) {
  //   const observer = new MutationObserver(() => {
  //     const selectedText = selectedEl.textContent.trim().toLowerCase();
  //     dropdownItems.forEach(div => {
  //       const title = div.dataset.title?.toLowerCase();
  //       if (title === selectedText) {
  //         dropdownItems.forEach(d => d.classList.remove('active'));
  //         div.classList.add('active');
  //         div.click();
  //       }
  //     });
  //   });

  //   observer.observe(selectedEl, { childList: true });
  // }

  // Click handler for custom desktop menu
  document.querySelectorAll('#custom-menu .dropdown_card div').forEach(item => {
    item.addEventListener('click', function () {
      const title = this.dataset.title;

      if (title) {
        const targetLink = document.querySelector(`.dropmenuoption.js-link-collection[data-title="${title}"]`);

        if (targetLink) {
          targetLink.click();

          document.querySelectorAll('#custom-menu .dropdown_card div').forEach(div => div.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });
});
