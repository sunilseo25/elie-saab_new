document.addEventListener("DOMContentLoaded", function () {
async function getCurrentCartItemsId() {
  try {
    const response = await fetch(`${window.Shopify.routes.root}cart.js`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cartData = await response.json();

    // Validate cart data structure
    if (!cartData?.items || !Array.isArray(cartData.items)) {
      throw new Error("Invalid cart data structure received");
    }

    // Extract variant IDs and ensure they're numbers
    const variantIds = cartData.items
      .map((item) => {
        if (!item.variant_id) {
          console.warn("Item missing variant_id:", item);
          return null;
        }
        return Number(item.variant_id);
      })
      .filter((id) => id !== null);

    return variantIds;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    // Optionally rethrow the error if you want calling code to handle it
    // throw error;
    return []; // Return empty array as fallback
  }
}

// Usage example:
// const currentCartItems = await getCurrentCartItemsId();

async function bulkproductadd(e) {
  e.preventDefault();

  let bulk_product_add = e.currentTarget;
  bulk_product_add.classList.add("loading");
  bulk_product_add.disabled = true;

  try {
    const selectedItems = document.querySelectorAll(
      "#wishlist_drawer [grid-wishlist] li[data-info].selected"
    );

    if (selectedItems.length === 0) {
      console.warn("No items selected");
      // Show error message to user
      throw new Error("Please select at least one item");
    }

    // Process variant IDs and quantities
    const variantIds = await Promise.all(
      Array.from(selectedItems).map(async (item) => {
        return item.getAttribute("data-variant-id");
      })
    );
    const currentCartVariant = await getCurrentCartItemsId();
    const newVariantIds = variantIds.filter(
      (id) => !currentCartVariant.includes(Number(id))
    );
    if (newVariantIds.length === 0) {
      console.log("No valid variant IDs found.");
      return;
    }
    const variantQuantities = newVariantIds.reduce((acc, id) => {
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const formData = {
      items: Object.entries(variantQuantities).map(([id, quantity]) => ({
        id: Number(id),
        quantity: 1,
      })),
    };

    console.log("formData", formData);

    // Make API call only after all variants are processed
    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add items to cart");
    }

    const data = await response.json();

    // Update UI
    await updateCartUI();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    bulk_product_add.classList.remove("loading");
    bulk_product_add.disabled = false;
  }
}

function updateCartUI() {
  // Fetch updated cart contents
  fetch("/cart?section_id=cart-items-drawer-ajax")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      // Check if the expected section data exists

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");

      // Update cart drawer contents
      const cartDrawer = document.querySelector("#cart_drawer_inner");
      if (cartDrawer && htmlDoc.querySelector("#cart__form_items")) {
        cartDrawer.innerHTML =
          htmlDoc.querySelector("#cart__form_items").innerHTML;
      }

      // Update item count

      document.querySelector(".cart_drawer_tab .thb-item-count").innerHTML =
        "(" +
        htmlDoc.querySelector("#cart__form_items_counter").innerHTML +
        ")";

      // Update footer cart
      const footerItem = htmlDoc.querySelector("#footer_item");
      const footerCart = document.querySelector("#footer-cart");
      if (footerCart && footerItem) {
        footerCart.innerHTML = footerItem.innerHTML;
      }

      // Remove loading classes
      document
        .querySelectorAll(".product-cart-item.thb-loading")
        .forEach((item) => {
          item.classList.remove("thb-loading");
        });

      // Remove wishlist products
      const wishlist_products = Array.from(
        document.querySelectorAll("#wishlist_drawer [button-wishlist]")
      );
      console.log("wishlist products", wishlist_products);
      if (wishlist_products.length > 0) {
        wishlist_products.forEach((wish_product) => {
          wish_product.click();
        });
      }
    })
    .catch((error) => {
      console.error("Error updating cart UI:", error);
      // Optionally show error message to user
    });
}
// Attach event listener
const bulk_product_add = document.querySelector("[data-bulk-add-btn]");
if (bulk_product_add) {
  bulk_product_add.addEventListener("click", bulkproductadd);
}

    function setUnderline() {
      console.log("underline")
      var $activeTab = $(".wishlist-tabs .nav-link.active");
      var $underline = $(".wishlistprogress");
      if ($activeTab.length > 0) {
        var offset = $activeTab.offset().left - $(".wishlist-tabs").offset().left;
        $underline.css({
          width: $activeTab.outerWidth(),
          transform: 'translateX(' + offset + 'px)',
        });
      }
    }

    function showTabContentOrMessage(target) {
      $('#wishlist_page .tab-pane').removeClass('show active');
      $('.empty-message').remove();
      if ($('.' + target).length > 0) {
        $('.' + target).addClass('show active');
      } else {
        // $('<div class="empty-message h6 empty-wishlist">Your wishlist is empty.</div>').insertAfter('#product-grid');
      }
    }
      $(".wishlist-tabs .nav-link").on("shown.bs.tab", function () {
      let target = $(this).attr('data-bs-target');
      showTabContentOrMessage(target);
      if ($(this).hasClass('column-3')) {
        $('#wishlist_page').removeClass('medium-up-4').addClass('medium-up-3');
      } else {
        $('#wishlist_page').removeClass('medium-up-3').addClass('medium-up-4');
      }
      setTimeout(function () {
        $('slider-component').each(function () {
          let flkty = Flickity.data(this);
          if (flkty) {
            flkty.resize(); // Force Flickity to update layout
          }
        });
      }, 100);
      setUnderline();
    });
   
      let activeTab = $(".wishlist-tabs .nav-link.active, .wishlist-tabs .nav-link:first").attr('data-bs-target');

      showTabContentOrMessage(activeTab);

function activeWishlistBox(handle){
  console.log("handle box",handle)
    $('#wishlist').attr("data-filter-wishlist",true)
 // $(".drawer-wishlist").show()
 //  $("#wishlist-container").hide()
 //   $("side-panel-close.btn-redirect ").hide()
 //     $(".wisthlist-box-wrapper").hide()
 //   $("[data-bulk-add-btn]").hide()
 const datatabbox = document.querySelector('wishlist-component.wishlist-tabs');
    if (datatabbox) {
      const flktybox = Flickity.data(datatabbox);
      if (flktybox) {
        flktybox.resize();
      }
    }
  
      document.querySelectorAll('slider-component').forEach(component => {
            if (component.dataset.initiated === 'true') {
              const flkty = Flickity.data(component);
              if (flkty) {
                flkty.resize();
              }
            }
          });
const currenttab =  $(`.wishlist-tabs [data-bs-target='${handle}']`)
 console.log(currenttab)
  setTimeout(function(){
    currenttab[0].click()
  },500)
    setTimeout(updateWishlistCount, 1000);
}
  const tabActiveBox = Array.from(document.querySelectorAll("[data-tab-wishlist]"))
 tabActiveBox.forEach((item)=>{
   item.addEventListener('click',(e)=>activeWishlistBox(e.currentTarget.dataset.handle))
 })
  function updateWishlistCount() {
  const currentWishlist = SWishlist?.getList();

  const promise_wishlist = Promise.resolve(currentWishlist);
  promise_wishlist.then((data) => {
    const wishlist_container = document.querySelector("#wishlist");
    if (wishlist_container && data) {
      wishlist_container.setAttribute("data-wishlist-count", data.length);
    }
  });
}

$(document).on("click", ".st-wishlist-button", function () {
  setTimeout(updateWishlistCount, 1000);
})
// Call the function after a delay
setTimeout(updateWishlistCount, 2000);
    $(document).on("click", "cart-drawer .side-panel-close", function () {
 const wishlist_container = document.querySelector("#wishlist");
    if(wishlist_container)
      wishlist_container.removeAttribute("data-filter-wishlist")
})
})