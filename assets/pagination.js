if (!customElements.get('pagination-theme')) {
  class Pagination extends HTMLElement {
    constructor() {
      super();
      const id = this.dataset.section;
      this.button = this.querySelector('.load-more');
      this.grid = document.querySelector('[data-id="' + id + '"]');
      this.pagination = parseInt(this.grid.dataset.pagination) || 12;
      this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
      this.i = 2;
      this.remainingProducts = []; // Store buffered products
    }

    connectedCallback() {
      console.log("pagination", this.pagination)
      if (this.classList.contains('pagination-type--loadmore')) {
        this.loadMore();
      }
      if (this.classList.contains('pagination-type--infinite')) {
        this.infinite();
      }
    }

    addUrlParam(search, key) {
      let newParam = key + '=' + this.i,
        params = '?' + newParam;

      if (search) {
        params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);
        if (params === search) {
          params += '&' + newParam;
        }
      }
      return params;
    }

    loadMore() {
      this.button.addEventListener('click', (e) => {
        this.loadProducts();
        this.button.blur();
        e.preventDefault();
      });
    }

    infinite() {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadProducts();
        }
      }, {
        threshold: 1.0
      });
      this.observer.observe(this);
    }

    loadProducts() {
  
  

      if (this.getAttribute('loading')) return;

      const url = document.location.pathname + this.addUrlParam(document.location.search, 'page');
      this.setAttribute('loading', true);
      this.i++;

      fetch(url)
        .then(response => response.text())
        .then((responseText) => {
          this.renderProducts(responseText, url);
          dispatchCustomEvent('pagination:page-changed', { url });
        })
        .catch(() => {
          this.removeAttribute('loading');
        });
    }

    renderProducts(html, url) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const grid = doc.getElementById('product-grid');

      if (!grid) {
        if (this.observer) this.observer.unobserve(this);
        this.removeAttribute('loading');
        if (this.button) this.button.classList.add('visually-hidden');
        return;
      }
const newProducts = Array.from(grid.querySelectorAll('.column'));

  if (newProducts.length === 0 && this.remainingProducts.length === 0) {
    // No more products to load
    if (this.observer) this.observer.unobserve(this);
    this.removeAttribute('loading');
    if (this.button) this.button.classList.add('visually-hidden');
    return;
  }

  // Combine buffer + new products
  let products = [...this.remainingProducts, ...newProducts];

  
      let initial = products.slice(0, this.pagination);
      let remaining = products.slice(this.pagination);

      this.remainingProducts = remaining;
      this.appendProducts(initial);
    }

 

    appendProducts(products) {
      if (!products.length) {
        this.removeAttribute('loading');
        return;
      }

      products.forEach(product => {
        this.grid.appendChild(product);

        product.querySelectorAll(".lazyload").forEach((img) => {
          if (typeof lazySizes !== 'undefined') {
            lazySizes.loader.unveil(img);
          }
        });
      });

      toggleWishlistButton?.(); // Optional: only if defined globally

      if (this.animations_enabled) {
        gsap.set(products, { opacity: 0, y: 30 });
        gsap.to(products, {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          onComplete: () => this.removeAttribute('loading')
        });
      } else {
        this.removeAttribute('loading');
      }
    }
  }

  customElements.define('pagination-theme', Pagination);
}
