document.addEventListener("DOMContentLoaded", function () {});
  const container = document.querySelector('#wishlist-container');
  const wishlistPage = document.querySelector('#wishlist_page');
  
  function getWishlist() {
    return JSON.parse(localStorage.getItem('st-wishlist-local') || '[]');
  }
  
  function updateEmptyState() {
    const wishlist = getWishlist();
  
    // Remove existing messages
    document.querySelectorAll(".empty-wishlist").forEach(el => el.remove());
  
    if (wishlist.length === 0) {
      if (container) {
        const msg1 = document.createElement("div");
        msg1.className = "empty-wishlist";
        msg1.textContent = "Your wishlist is empty.";
        container.appendChild(msg1);
      }
  
      if (wishlistPage) {
        const msg2 = document.createElement("div");
        msg2.className = "empty-wishlist";
        msg2.textContent = "Your wishlist is empty.";
        wishlistPage.appendChild(msg2);
      }
    }
  }
  
  function fetchAndAppendProduct(handle) {
      if (container.querySelector(`[data-handle="${handle}"]`)) return;
  
      fetch(`/products/${handle}?section_id=product-card-template`)
      .then(response => response.text())
      .then(html => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const productCard = tempDiv.querySelector('.product-cart-item');
      if (productCard) {
          productCard.setAttribute('data-handle', handle);
          container.prepend(productCard);
      }
      updateEmptyState();
      });
  }
  
  function fetchAndAppendWishlist(handle) {
    if (!wishlistPage) return; // Prevent code from running if the element doesn't exist
  
    if (wishlistPage.querySelector(`[data-handle="${handle}"]`)) return;  
  
    fetch(`/products/${handle}?section_id=product-card-template`)
      .then(response => response.text())
      .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
  
        const wishlistProduct = tempDiv.querySelector('.wishlist-product');
        if (wishlistProduct) {
          wishlistProduct.setAttribute('data-handle', handle);
          wishlistPage.prepend(wishlistProduct);
  
          setTimeout(function () {
            document.querySelectorAll('slider-component').forEach(function (slider) {
              const flkty = Flickity.data(slider);
              if (flkty) {
                flkty.resize();
              }
            });
          }, 100);
        }
        updateEmptyState();
      });
  }

  function removeProductCard(handle) {
    const card = container.querySelector(`[data-handle="${handle}"]`);
    if (card) {
      card.remove();
    }
    const page = wishlistPage.querySelector(`[data-handle="${handle}"]`);
    if (page) {
      page.remove();
    }
    updateEmptyState();
  }
  function removeProductCard(handle) {
    const card = container.querySelector(`[data-handle="${handle}"]`);
    if (card) {
      card.remove();
    }
  
    if (wishlistPage) {
      const page = wishlistPage.querySelector(`[data-handle="${handle}"]`);
      if (page) {
        page.remove();
      }
    }
  
    updateEmptyState();
  }

  let previousHandles = [];
  function syncWishlist() {
    const wishlist = getWishlist();
    const currentHandles = wishlist.map(item => item.handle);
    currentHandles.forEach(handle => {
      if (!previousHandles.includes(handle)) {
        fetchAndAppendProduct(handle);
        fetchAndAppendWishlist(handle);
      }
    });
    previousHandles.forEach(handle => {
      if (!currentHandles.includes(handle)) {
        removeProductCard(handle);
      }
    });

    previousHandles = currentHandles;
    updateEmptyState();
  }
  syncWishlist();
  setInterval(syncWishlist, 500);
