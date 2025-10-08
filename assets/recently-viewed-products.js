if (!customElements.get('recently-viewed-products')) {
  class RecentlyViewedProducts extends HTMLElement {
    constructor() {
      super();

      this.url = theme.routes.search_url + '?view=recently-viewed&type=product&q=';
      this.container = this.querySelector('.products');
      this.currentId = this.dataset.productHandle;
      this.max = 12;
      this.products = '';
      if (window.localStorage) {
        let recentIds = window.localStorage.getItem('recently-viewed');
        if (recentIds && typeof recentIds !== 'undefined') {
          window.recentlyViewedIds = JSON.parse(recentIds);
        }
      }
    }

    connectedCallback() {
      this.buildUrl();
    }

    buildUrl() {
      let i = 0;
      window.recentlyViewedIds.forEach((val) => {
        // Skip current product
        if (val === this.currentId) {
          return;
        }
        // Stop at max
        if (i >= this.max) {
          return;
        }
        this.products += 'handle:' + val + ' OR ';
        i++;
      });

      this.url = this.url + encodeURIComponent(this.products);
      this.fetchProducts();
    }

    fetchProducts() {
      fetch(this.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('.products');
    
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.container.innerHTML = recommendations.innerHTML;
            this.classList.add('product-recommendations--loaded');
    
            // Count number of products
            const productItems = this.container.querySelectorAll('.product-card, .grid__item');
            if (productItems.length <= 3) {
              this.container.classList.add('arrow_show');
            }
    
            this.initSlider();
          }
        })
        .catch(e => {
          console.error(e);
        });
    }fetchProducts() {
      fetch(this.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('.products');
    
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.container.innerHTML = recommendations.innerHTML;
            this.classList.add('product-recommendations--loaded');
    
            // Count number of products
            const productItems = this.container.querySelectorAll('.product-card, .grid__item');
            if (productItems.length < 3) {
              this.container.classList.add('cart_drawer_arrow');
            }
    
            this.initSlider();
          }
        })
        .catch(e => {
          console.error(e);
        });
    }

    initSlider() {
      if (!this.container) {
        console.error("Flickity: Slider container not found!");
        return;
      }
      
      if (this.flickityInstance) {
        this.flickityInstance.destroy();
      }
    
      this.flickityInstance = new Flickity(this.container, {
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        prevNextButtons: false, // Default Flickity arrows disabled
        pageDots: false,
      });
    
      const wrapper = this.container.closest(".products");
      if (!wrapper) {
        console.error("Error: products not found!");
        return;
      }
    
      const prevButton = document.createElement("div");
      prevButton.classList.add("flickity-prev", "flickity-nav");
      prevButton.innerHTML = `<img width="30" height="30" src="/cdn/shop/t/160/assets/arrow-left.svg" data-ac-alt-type="image" alt="a white circle with a black background">`;
    
      const nextButton = document.createElement("div");
      nextButton.classList.add("flickity-next", "flickity-nav");
      nextButton.innerHTML = `<img width="30" height="30" src="/cdn/shop/t/160/assets/arrow-right.svg" data-ac-alt-type="image" alt="a white circle with a black background">`;
    
      wrapper.appendChild(prevButton);
      wrapper.appendChild(nextButton);
    
      prevButton.addEventListener('click', () => this.flickityInstance.previous());
      nextButton.addEventListener('click', () => this.flickityInstance.next());
    
      // Resize Flickity on tab change
      document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', () => {
          this.flickityInstance.resize();
        });
      });
    }

  }
  customElements.define('recently-viewed-products', RecentlyViewedProducts);
}