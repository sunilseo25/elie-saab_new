if (typeof debounce === "undefined") {
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}
/**
 *  @class
 *  @function ThemeHeader
 */

if (!customElements.get("theme-header")) {
  class ThemeHeader extends HTMLElement {
    constructor() {
      super();
      this.menuIsOpen = false;
      this.resizeObserver = null;
      this.animationFrameId = null;
      this._boundHandleScroll = this.handleScroll.bind(this);
    }

    connectedCallback() {
      this.initializeElements();
      this.setupEventListeners();
      this.setupObservers();
      window.dispatchEvent(new Event("scroll"));
    }

    disconnectedCallback() {
      this.cleanup();
    }

    initializeElements() {
      this.header_section = document.querySelector(".header-section");
      this.menu = this.querySelector("#mobile-menu") || this.querySelector(".header__inline-menu") || document;
      this.toggle = document.querySelector(".mobile-toggle-wrapper");
      this.menuwrapper = document.querySelector(".mobile-menu-drawer--inner");
      this.drawer = document.querySelector(".mobile-menu-drawer");
      this.overlay = document.querySelector(".white_bg");
    }

    setupEventListeners() {
      // Keyboard events
      document.addEventListener("keyup", (e) => {
        if (e.code?.toUpperCase() === "ESCAPE") this.closeMenu();
      });

      // Toggle button
      this.toggle?.querySelector(".mobile-toggle")?.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle.classList.contains("active") ? this.closeMenu() : this.openMenu();
        window.dispatchEvent(new Event("resize.resize-select"));
      });

      // Custom close button
      this.querySelectorAll("#custom-toggle-button").forEach(button => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.closeMenu();
        });
      });

      // Scroll events
      window.addEventListener("scroll", this._boundHandleScroll, { passive: true });

      // Menu interactions
      this.menu?.querySelectorAll("summary.parent-link, summary").forEach(summary => {
        summary.addEventListener("click", this.onSummaryClick.bind(this));
      });

      this.menu?.querySelectorAll(".parent-link-back--button").forEach(button => {
        button.addEventListener("click", this.onCloseButtonClick.bind(this));
      });

      this.menu?.addEventListener('click', this.onOverlayClose.bind(this));
    }

    setupObservers() {
      // Resize observer for zoom/resize handling
      this.resizeObserver = new ResizeObserver(() => {
        if (this.menuIsOpen) this.updateDrawerWidth();
      });

      if (this.drawer) this.resizeObserver.observe(this.drawer);
      if (this.overlay) this.resizeObserver.observe(this.overlay);

      // Mutation observer for submenu changes
      this.observeSubmenuChanges();
    }

    cleanup() {
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener("scroll", this._boundHandleScroll);
    }

    handleScroll() {
      this.setStickyClass();
      this.setHeaderOffset();
      this.setHeaderHeight();
      if (document.querySelector(".announcement-bar-section")) {
        this.setAnnouncementHeight();
      }
    }

    openMenu() {
      document.body.classList.add("overflow-hidden");
      
      // Handle cart drawer z-index if needed
      if (document.body.classList.contains('open-cart') && window.innerWidth < 769) {
        document.querySelector("#Cart-Drawer").style.zIndex = "2";
      }
      
      this.menuIsOpen = true;
      setTimeout(() => {
        this.toggle.classList.add("active");
        this.updateDrawerWidth();
      }, 10);
    }

    closeMenu() {
      // Close all open submenus
      this.toggle?.querySelectorAll(".parent-menu details[open]").forEach(detailEle => {
        detailEle.removeAttribute("open");
        detailEle.classList.remove("menu-opening", "submenu-open");
      });

      this.toggle?.classList.remove("active");
      this.menuIsOpen = false;
      this.resetDrawerWidth();

      setTimeout(() => {
        document.body.classList.remove("overflow-hidden");
      }, 500);
    }

    onOverlayClose(event) {
      if (!this.menuwrapper?.contains(event.target)) {
        this.closeMenu();
      }
    }

    setStickyClass() {
      if (this.classList.contains("header-sticky--active")) {
        const offset = parseInt(this.getBoundingClientRect().top, 10) + document.documentElement.scrollTop;
        this.classList.toggle("is-sticky", window.scrollY >= offset && window.scrollY > 0);
      }
    }

    setAnnouncementHeight() {
      const a_bar = document.getElementById("shopify-section-announcement-bar");
      if (a_bar) {
        document.documentElement.style.setProperty("--announcement-height", `${a_bar.clientHeight}px`);
      }
    }

    setHeaderOffset() {
      if (this.header_section) {
        document.documentElement.style.setProperty("--header-offset", `${this.header_section.getBoundingClientRect().top}px`);
      }
    }

    setHeaderHeight() {
      document.documentElement.style.setProperty("--header-height", `${this.clientHeight}px`);
    }

    updateDrawerWidth() {
      if (!this.menuIsOpen || !this.overlay || !this.drawer) return;
      
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      this.animationFrameId = requestAnimationFrame(() => {
        const activeElements = [
          this.drawer,
          ...Array.from(document.querySelectorAll('.child-menu:not([style*="display: none"])')),
          ...Array.from(document.querySelectorAll('.menu__promotions:not([style*="display: none"])'))
        ];
        
        if (activeElements.length > 0) {
          const drawerRect = this.drawer.getBoundingClientRect();
          const rightMost = activeElements.reduce((max, el) => {
            return el ? Math.max(max, el.getBoundingClientRect().right) : max;
          }, 0);
          
          this.overlay.style.width = `${rightMost - drawerRect.left}px`;
        } else {
          this.resetDrawerWidth();
        }
        
        this.animationFrameId = null;
      });
    }

    resetDrawerWidth() {
      this.overlay?.style.removeProperty("width");
    }

    onSummaryClick(event) {
      const summaryElement = event.currentTarget;
      const detailsElement = summaryElement.parentNode;
      const parentMenuElement = detailsElement.closest(".link-container");
      const parentByParent = detailsElement.closest(".drawer-body");
      const mainParent = detailsElement.closest("#mobile-menu");

      // Reset scroll position if needed
      if (this.querySelector(".parent-link-back--button")) {
        this.menu.scrollTop = 0;
      }

      if (detailsElement.classList.contains("link-container")) {
        setTimeout(() => {
          detailsElement.classList.add('menu-opening');
          parentMenuElement?.classList.add('submenu-open');
          parentByParent?.classList.add('main-parent');
          mainParent?.classList.add('active-section');
        }, 100);
      }

      if (detailsElement.classList.contains("parent-menu")) {
        document.querySelectorAll(".parent-menu").forEach(ele => ele.classList.remove("active-menu"));
        setTimeout(() => {
          detailsElement.setAttribute("open", "");
          this.updateDrawerWidth();
        }, 100);
        detailsElement.classList.add("active-menu");
      } else {
        setTimeout(() => this.updateDrawerWidth(), 100);
      }
    }

    onCloseButtonClick(event) {
      event.preventDefault();
      const detailsElement = event.currentTarget.closest(".link-container");
      const isFirstLevelBack = event.currentTarget.closest(".first_level_back_menu") !== null;
      this.closeSubmenu(detailsElement, isFirstLevelBack);
    }

    closeSubmenu(detailsElement, isFirstLevelBack) {
      const parentMenuElement = detailsElement.closest(".link-container");
      const parentByParent = detailsElement.closest(".drawer-body");
      const mainParent = detailsElement.closest("#mobile-menu");
      
      setTimeout(() => {
        detailsElement.classList.remove("menu-opening");
        parentMenuElement?.classList.remove('submenu-open');
        if (isFirstLevelBack) parentByParent?.classList.remove('main-parent');
        if (isFirstLevelBack) mainParent?.classList.remove('active-section');
        detailsElement.removeAttribute("open");
        this.updateDrawerWidth();
      }, 100);
    }

    observeSubmenuChanges() {
      const observer = new MutationObserver(() => {
        const activeSubmenus = this.menu.querySelectorAll(".link-container.submenu-open");
        
        if (activeSubmenus.length > 0) {
          const visibleElements = [
            ...Array.from(document.querySelectorAll('.child-menu:not([style*="display: none"])')),
            ...Array.from(document.querySelectorAll('.menu__promotions:not([style*="display: none"])'))
          ];
          
          visibleElements.length > 0 ? this.updateDrawerWidth() : this.resetDrawerWidth();
        } else {
          this.resetDrawerWidth();
        }
      });

      observer.observe(this.menu, {
        attributes: true,
        subtree: true,
        attributeFilter: ["class", "style"]
      });
    }
  }

  customElements.define("theme-header", ThemeHeader);
}

/**
 *  @class
 *  @function FullMenu
 */
if (!customElements.get("full-menu")) {
  class FullMenu extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.submenus = this.querySelectorAll(
        ".thb-full-menu>.menu-item-has-children:not(.menu-item-has-megamenu)>.sub-menu"
      );

      if (!this.submenus.length) {
        return;
      }
      const _this = this;
      // resize on initial load
      window.addEventListener(
        "resize",
        debounce(function() {
          _this.resizeSubMenus();
        }, 100)
      );

      window.dispatchEvent(new Event("resize"));

      document.fonts.ready.then(function() {
        _this.resizeSubMenus();
      });
    }
    resizeSubMenus() {
      this.submenus.forEach((submenu) => {
        let sub_submenus = submenu.querySelectorAll(":scope >.menu-item-has-children>.sub-menu");

        sub_submenus.forEach((sub_submenu) => {
          let w = sub_submenu.offsetWidth,
            l =
            sub_submenu.parentElement.parentElement.getBoundingClientRect()
            .left +
            sub_submenu.parentElement.parentElement.clientWidth +
            10,
            total = w + l;
          if (total > document.body.clientWidth) {
            sub_submenu.parentElement.classList.add("left-submenu");
          } else if (
            sub_submenu.parentElement.classList.contains("left-submenu")
          ) {
            sub_submenu.parentElement.classList.remove("left-submenu");
          }
        });
      });
    }
  }
  customElements.define("full-menu", FullMenu);
}
// function filterItems(inputId) {
//     const searchTerm = document.getElementById(inputId).value.toLowerCase();
//     const countryInlines = document.querySelectorAll('.country-inline');
//     const titleWraps = document.querySelectorAll('.title-wrap');

//     countryInlines.forEach(countryInline => {
//         const label = countryInline.querySelector('label').textContent.toLowerCase();
//         countryInline.style.display = label.includes(searchTerm) ? 'block' : 'none';
//     });

//     titleWraps.forEach(titleWrap => {
//         const parentSection = titleWrap.parentElement;
//         const hasVisibleChildren = Array.from(parentSection.querySelectorAll('.country-inline')).some(
//             el => el.style.display !== 'none'
//         );
//         titleWrap.style.display = hasVisibleChildren ? 'block' : 'none';
//     });
// }

// ['currencyInput', 'countryInput'].forEach(inputId => {
//     document.getElementById(inputId).addEventListener('input', () => filterItems(inputId));
// });

document.addEventListener("DOMContentLoaded", function () {
  const allPromotions = document.querySelectorAll(".submenu-1");
  const childCategories = document.querySelectorAll(".child-category");

  // Handle parent-link click
  document.querySelectorAll(".child-category > .parent-link").forEach((summary) => {
    summary.addEventListener("click", function (e) {
      e.stopPropagation();
      const container = summary.closest(".sub-category");
      if (!container) return;

      const promotions = container.querySelector(".submenu-1");
      const category = summary.closest(".child-category");
      const isAlreadyOpen = category.classList.contains("menu-opening") && category.classList.contains("submenu-open");

      // summary.classList.add("active");
      childCategories.forEach((cat) => {
        setTimeout(() => {
          cat.classList.remove("menu-opening", "submenu-open");
          const promo = cat.querySelector(".submenu-1");
          if (promo) promo.classList.remove("show-promotion");
        }, 100);
      });
      if (!isAlreadyOpen) {
        setTimeout(() => {
          category.classList.add("menu-opening", "submenu-open");
          if (promotions) promotions.classList.add("show-promotion");
        }, 100);
      } else {
        setTimeout(() => {
          category.classList.remove("menu-opening", "submenu-open");
          if (promotions) promotions.classList.remove("show-promotion");
        }, 100);
      }
    });
  });

  // Handle back button click
  document.querySelectorAll(".child-link-back--button, .child-menu .parent-link-back").forEach((button) => {
    button.addEventListener("click", function () {
      const subCategory = button.closest(".sub-category");
      if (subCategory) {
        const submenu1 = subCategory.querySelector(".submenu-1");
        if (submenu1 && submenu1.classList.contains("show-promotion")) {
          setTimeout(() => {
            submenu1.classList.remove("show-promotion");
          }, 100);
        }
        const childCategory = subCategory.querySelector(".child-category.menu-opening.submenu-open");
        if (childCategory) {
          childCategory.classList.remove("menu-opening", "submenu-open");
        }
      }
    });
  });
});

// Select all elements with data-title
let items = document.querySelectorAll('[data-title]');
let targetElement = document.getElementById('child-title');

items.forEach(item => {
  item.addEventListener('click', function() {
    let title = this.getAttribute('data-title');
    targetElement.textContent = title;
  });
});

