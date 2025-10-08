const LOCAL_STORAGE_WISHLIST_KEY = 'shopify-wishlist';
const LOCAL_STORAGE_DELIMITER = ',';
const BUTTON_ACTIVE_CLASS = 'active';
const GRID_LOADED_CLASS = 'loaded';

const selectors = {
  button: '[button-wishlist]',
  grid: '[grid-wishlist]',
  page: '[page-wishlist]',
  productCard: '.product-cart-item',
  wishlistProduct: '.wishlist-product',
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Shopify Wishlist] Initializing...');
  initButtons();
  updateGrid();
});

document.addEventListener('shopify-wishlist:updated', () => {
  console.log('[Shopify Wishlist] Wishlist updated!');
  updateGrid();
});

const fetchProductCardHTML = async (handle) => {
  const productTileTemplateUrl = `/products/${handle}?view=card`;
  // console.log(`[Shopify Wishlist] Fetching product: ${productTileTemplateUrl}`);
  
  try {
    const res = await fetch(productTileTemplateUrl);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    
    const text = await res.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, 'text/html');
    const productCard = htmlDocument.querySelector(selectors.productCard);
    const wishlistProduct = htmlDocument.querySelector(selectors.wishlistProduct);
    
    return {
      productCardHTML: productCard ? productCard.outerHTML : '',
      wishlistProductHTML: wishlistProduct ? wishlistProduct.outerHTML : '',
    };
  } catch (err) {
    console.error(`[Shopify Wishlist] Failed to load product: ${handle}`, err);
    return { productCardHTML: '', wishlistProductHTML: '' };
  }
};

const updateGrid = async () => {
  console.log('[Shopify Wishlist] Updating wishlist grids...');
  const gridContainer = document.querySelector(selectors.grid);
  const pageContainer = document.querySelector(selectors.page);

  if (!gridContainer && !pageContainer) {
    console.error('[Shopify Wishlist] Grid and Page Wishlist containers not found!');
    return;
  }

  const wishlist = getWishlist();

  if (!wishlist.length) {
    if (gridContainer) gridContainer.innerHTML = '<p class="empty-wishlist h6">Your wishlist is empty.</p>';
    if (pageContainer) pageContainer.innerHTML = '<div class="h6 empty-wishlist active show">Your wishlist is empty.</div>';
    return;
  }

  if (pageContainer) pageContainer.innerHTML = '<p class="empty-wishlist h6 loading">Loading your wishlist...</p>';

  try {
    const reversedWishlist = [...wishlist].reverse(); // ✅ Reverse order
    const responses = await Promise.all(reversedWishlist.map(fetchProductCardHTML));

    const productCardsHTML = responses.map(res => res.productCardHTML).filter(html => html !== '').join('');
    const wishlistProductsHTML = responses.map(res => res.wishlistProductHTML).filter(html => html !== '').join('');

    if (gridContainer) {
      gridContainer.innerHTML = productCardsHTML;
      gridContainer.classList.add(GRID_LOADED_CLASS);
    }

    if (pageContainer) {
      pageContainer.innerHTML = wishlistProductsHTML;
      pageContainer.classList.add(GRID_LOADED_CLASS);
    }

    setupButtons();
  } catch (error) {
    console.error('[Shopify Wishlist] Error updating grid:', error);
  }
};


const setupButtons = () => {
  // console.log('[Shopify Wishlist] Setting up buttons...');
  document.querySelectorAll(selectors.button).forEach((button) => {
    const productHandle = button.dataset.productHandle;
    
    if (!productHandle) {
      console.error('[Shopify Wishlist] Missing `data-product-handle` attribute.');
      return;
    }

    if (wishlistContains(productHandle)) button.classList.add(BUTTON_ACTIVE_CLASS);

    button.removeEventListener('click', toggleWishlist);
    button.addEventListener('click', toggleWishlist);
  });
};

const initButtons = () => {
  setTimeout(setupButtons, 100);
};

const toggleWishlist = (event) => {
  event.preventDefault();
  const button = event.currentTarget;
  const productHandle = button.dataset.productHandle;
  
  if (!productHandle) return;
  
  console.log(`[Shopify Wishlist] Button clicked for: ${productHandle}`);
  updateWishlist(productHandle);
  button.classList.toggle(BUTTON_ACTIVE_CLASS);
};

const getWishlist = () => {
  const wishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
  return wishlist ? wishlist.split(LOCAL_STORAGE_DELIMITER) : [];
};

const setWishlist = (array) => {
  const wishlist = array.join(LOCAL_STORAGE_DELIMITER);
  if (array.length) localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, wishlist);
  else localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);

  document.dispatchEvent(new CustomEvent('shopify-wishlist:updated', { detail: { wishlist: array } }));
};

const updateWishlist = (handle) => {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(handle);
  
  if (index === -1) wishlist.push(handle);

  else wishlist.splice(index, 1);
  setWishlist(wishlist);
};

const wishlistContains = (handle) => getWishlist().includes(handle);