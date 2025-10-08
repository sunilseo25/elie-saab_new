function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
var dispatchCustomEvent = function dispatchCustomEvent(eventName) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var detail = {
    detail: data
  };
  var event = new CustomEvent(eventName, data ? detail : null);
  document.dispatchEvent(event);
};
window.recentlyViewedIds = [];

/**
 *  @class
 *  @function Quantity
 */
if (!customElements.get('quantity-selector')) {
  class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('.qty');
      this.step = Number(this.input.getAttribute('step')) || 1;
      this.changeEvent = new Event('change', { bubbles: true });

      // Buttons
      this.subtract = this.querySelector('.minus');
      this.add = this.querySelector('.plus');

      // Bind events
      this.subtract.addEventListener('click', () => this.change_quantity(-this.step));
      this.add.addEventListener('click', () => this.change_quantity(this.step));
    }

    connectedCallback() {
      this.classList.add('buttons_added');
      this.validateQtyRules();
    }

    change_quantity(change) {
      let quantity = Number(this.input.value);
      if (isNaN(quantity)) quantity = 1;

      const min = this.input.getAttribute('min') ? Number(this.input.getAttribute('min')) : 0;
      const max = this.input.getAttribute('max') ? Number(this.input.getAttribute('max')) : null;

      const newQuantity = quantity + change;

      // Allow reducing to 0 or any value >= min
      if (newQuantity < min) return;
      if (max !== null && newQuantity > max) return;

      this.input.value = newQuantity;
      this.input.dispatchEvent(this.changeEvent);

      this.validateQtyRules();
    }

    validateQtyRules() {
      const value = Number(this.input.value);
      const min = this.input.getAttribute('min') ? Number(this.input.getAttribute('min')) : 0;
      const max = this.input.getAttribute('max') ? Number(this.input.getAttribute('max')) : null;

      // ✅ DO NOT disable minus button when value is 1
      // this.subtract.classList.toggle('disabled', value <= min);

      if (max !== null) {
        this.add.classList.toggle('disabled', value >= max);
      }
    }
  }
  customElements.define('quantity-selector', QuantityInput);
}


/**
 *  @class
 *  @function ArrowSubMenu
 */
class ArrowSubMenu {

  constructor(self) {
    this.submenu = self.parentNode.querySelector('.sub-menu');
    this.arrow = self;
    // Add functionality to buttons
    self.addEventListener('click', (e) => this.toggle_submenu(e));
  }

  toggle_submenu(e) {
    e.preventDefault();
    let submenu = this.submenu;

    if (!submenu.classList.contains('active')) {
      submenu.classList.add('active');

    } else {
      submenu.classList.remove('active');
      this.arrow.blur();
    }
  }
}
let arrows = document.querySelectorAll('.thb-arrow');
arrows.forEach((arrow) => {
  new ArrowSubMenu(arrow);
});

/**
 *  @class
 *  @function ProductCard
 */
if (!customElements.get('product-card')) {
  class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.swatches = this.querySelector('.product-card-swatches');
      this.image = this.querySelector('.product-featured-image-link .product-primary-image');
      this.additional_images = this.querySelectorAll('.product-secondary-image');
      this.additional_images_progress = this.querySelector(".product-secondary-current-progress");
      this.images = [this.image,...this.additional_images];
      this.additional_images_nav = this.querySelectorAll('.product-secondary-images-nav li');
      this.quick_add = this.querySelector('.product-card--add-to-cart-button-simple');
      this.size_options = this.querySelector('.product-card-sizes');
      this.slideprev= this.querySelector('.product-prev');
      this.slidenext = this.querySelector('.product-next');
        this.current_index = 0;
    }
    connectedCallback() {
      if (this.swatches) {
        this.enableSwatches(this.swatches, this.image);
      }
      if (this.additional_images) {
        this.enableAdditionalImages();
      }
      if (this.quick_add) {
        this.enableQuickAdd();
      }
      if (this.size_options) {
        this.enableSizeOptions();
      }
    }
    
     updateProgress() {
        if (this.additional_images_progress) {
            let progressWidth = (100 / this.images.length) * (this.current_index + 1);
            this.additional_images_progress.style.width = `${progressWidth}%`;
        }
    }
     setActiveImage(index) {
        this.current_index = index;
        this.images.forEach((img, i) => {
            img.classList.toggle('hover', i === index);
            // this.additional_images_nav[i].classList.toggle('active', i === index);
        });
        this.updateProgress();
    }
     changeImage(direction) {
       
        if (direction === 'next') {
            this.current_index = (this.current_index + 1) % this.images.length;
        } else if (direction === 'prev') {
            this.current_index = (this.current_index - 1 + this.images.length) % this.images.length;
        }
        this.setActiveImage(this.current_index);
    }
   // resetImages() {
   //    this.current_index = 0;
   //    this.images.forEach((image, index) => {
   //        image.classList.remove('hover');
   //        if (this.additional_images_nav.length) {
   //            this.additional_images_nav[index].classList.remove('active');
   //        }
   //    });
   //    this.updateProgress();
   //  }
    enableAdditionalImages() {
      let image_length = this.additional_images.length;
      let images = this.additional_images;
      // let images = [this.image,...this.additional_images]
      
      let nav = this.additional_images_nav;
    
      let image_container = this.querySelector('.product-featured-image-link');
      
    // const mouseleave = function (e) {
    //     console.log("curernt index", ProductCard.current_index)
    //       this.current_index = 0;
    //     images.forEach((image, index) => {
    //       image.classList.remove('hover');
    //       if (nav.length) {
    //         nav[index].classList.remove('active');
    //       }
    //     });
    //   };


      const mousemove = function (e) {
        let l = e.offsetX;
        let w = this.getBoundingClientRect().width;
        let prc = l / w;
        let sel = Math.floor(prc * image_length);
        let selimg = images[sel];
       
        images.forEach((image, index) => {
          if (image.classList.contains('hover')) {
            image.classList.remove('hover');
            if (nav.length) {
              nav[index].classList.remove('active');
            }
          }
        });
        if (selimg) {
          if (!selimg.classList.contains('hover')) {
            selimg.classList.add('hover');
            if (nav.length) {
              nav[sel].classList.add('active');
            }
          }
        }
      };
     const imageselect = function (direction) {
      // if (direction === 'next') {
      //     current_index = (current_index + 1) % image_length;
      // } else if (direction === 'prev') {
      //     current_index = (current_index - 1 + image_length) % image_length;
      // }

      this.images.forEach((image, index) => {
          image.classList.remove('hover');
          if (nav.length) {
              nav[index].classList.remove('active');
          }
      });
      
        this.images[this.current_index].classList.add('hover');
        if (nav.length) {
            nav[this.current_index].classList.add('active');
        }
      };
      if (image_container) {
        // image_container.addEventListener('touchstart', mousemove, {
        //   passive: true
        // });
        // image_container.addEventListener('touchmove', mousemove, {
        //   passive: true
        // });
        // image_container.addEventListener('touchend', mouseleave, {
        //   passive: true
        // });
        // image_container.addEventListener('mouseenter', mousemove, {
        //   passive: true
        // });
        // image_container.addEventListener('mousemove', mousemove, {
        //   passive: true
        // });

        //   this.additional_images_nav.forEach((navItem, index) => {
        //   navItem.addEventListener('click', () => {
        //     // Remove active class from all images and nav items
        //     images.forEach((image, imgIndex) => {
        //       image.classList.remove('hover');
        //       if (nav.length) {
        //         nav[imgIndex].classList.remove('active');
        //       }
        //     });
      
        //     // Add active class to the selected image and nav item
        //     images[index].classList.add('hover');
        //     nav[index].classList.add('active');
        //     current_index = index; // Update the current index
        //   });
        // });

        
        // image_container.addEventListener('mouseleave', mouseleave, {
        //   passive: true
        // });
        // custom code for button click
        // image_container.addEventListener('mouseleave',() => this.resetImages());
        this.slidenext?.addEventListener("click", () => this.changeImage('next'));
        this.slideprev?.addEventListener("click", () => this.changeImage('prev'));
      }

      images.forEach(function (image) {
        window.addEventListener('load', (event) => {
          lazySizes.loader.unveil(image);
        });
      });
    this.updateProgress();
    }
    enableSwatches(swatches, image) {
      let swatch_list = swatches.querySelectorAll('.product-card-swatch'),
        org_srcset = image ? image.dataset.srcset : '';
      this.color_index = this.swatches.dataset.index;

      swatch_list.forEach((swatch, index) => {
        window.addEventListener('load', (event) => {
          let image = new Image();
          image.srcset = swatch.dataset.srcset;
          lazySizes.loader.unveil(image);
        });

        swatch.addEventListener('mouseover', () => {
          [].forEach.call(swatch_list, function (el) {
            el.classList.remove('active');
          });
          if (image) {
            if (swatch.dataset.srcset) {
              image.setAttribute('srcset', swatch.dataset.srcset);
            } else {
              image.setAttribute('srcset', org_srcset);
            }
          }
          if (this.size_options) {
            this.current_options[this.color_index] = swatch.querySelector('span').innerText;
            this.updateMasterId();
          }
          swatch.classList.add('active');
        });
        swatch.addEventListener('click', function (evt) {
          window.location.href = this.dataset.href;
          evt.preventDefault();
        });
      });
    }
    enableQuickAdd() {
      this.quick_add.addEventListener('click', this.quickAdd.bind(this));
    }
    enableSizeOptions() {
      let size_list = this.size_options.querySelectorAll('.product-card-sizes--size'),
        featured_image = this.querySelector('.product-featured-image'),
        has_hover = featured_image.classList.contains('thb-hover'),
        size_parent = this.size_options.parentElement;

      this.size_index = this.size_options.dataset.index;

      this.current_options = this.size_options.dataset.options.split(',');

      this.updateMasterId();

      size_parent.addEventListener('mouseenter', () => {
        if (has_hover) {
          featured_image.classList.remove('thb-hover');
        }
      }, {
        passive: true
      });
      size_parent.addEventListener('mouseleave', () => {
        if (has_hover) {
          featured_image.classList.add('thb-hover');
        }
      }, {
        passive: true
      });
      size_list.forEach((size) => {
        size.addEventListener('click', (evt) => {
          evt.preventDefault();

          if (size.classList.contains('is-disabled')) {
            return;
          }
          this.current_options[this.size_index] = size.querySelector('span').innerText;
          this.updateMasterId();

          size.classList.add('loading');
          size.setAttribute('aria-disabled', true);
          const config = {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/javascript'
            }
          };
          let formData = new FormData();

          formData.append('id', this.currentVariant.id);
          formData.append('quantity', 1);
          formData.append('sections', this.getSectionsToRender().map((section) => section.section));
          formData.append('sections_url', window.location.pathname);

          config.body = formData;

          fetch(`${theme.routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                return;
              }
              this.renderContents(response);

              dispatchCustomEvent('cart:item-added', {
                product: response.hasOwnProperty('items') ? response.items[0] : response
              });
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              size.classList.remove('loading');
              size.removeAttribute('aria-disabled');
            });
        });
      });
    }
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options.map((option, index) => {
          return this.current_options[index] === option;
        }).includes(false);
      });
      setTimeout(() => {
        this.setDisabled();
      }, 100);
    }
    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
    setDisabled() {
      const variant_data = this.getVariantData();

      if (variant_data) {

        if (this.currentVariant) {
          const selected_options = this.currentVariant.options.map((value, index) => {
            return {
              value,
              index: `option${index + 1}`
            };
          });

          const available_options = this.createAvailableOptionsTree(variant_data, selected_options);

          const fieldset_options = Object.values(available_options)[this.size_index];
          if (fieldset_options) {
            if (this.size_options.querySelectorAll('.product-card-sizes--size').length) {
              this.size_options.querySelectorAll('.product-card-sizes--size').forEach((input, input_i) => {
                input.classList.toggle('is-disabled', fieldset_options[input_i].isUnavailable);
              });
            }
          }
        } else {
          if (this.size_options.querySelectorAll('.product-card-sizes--size').length) {
            this.size_options.querySelectorAll('.product-card-sizes--size').forEach((input, input_i) => {
              input.classList.add('is-disabled');
            });
          }
        }

      }
      return true;
    }
    createAvailableOptionsTree(variant_data, selected_options) {
      // Reduce variant array into option availability tree
      return variant_data.reduce((options, variant) => {

        // Check each option group (e.g. option1, option2, option3) of the variant
        Object.keys(options).forEach(index => {

          if (variant[index] === null) return;

          let entry = options[index].find(option => option.value === variant[index]);

          if (typeof entry === 'undefined') {
            // If option has yet to be added to the options tree, add it
            entry = {
              value: variant[index],
              isUnavailable: true
            };
            options[index].push(entry);
          }

          // Check how many selected option values match a variant
          const countVariantOptionsThatMatchCurrent = selected_options.reduce((count, {
            value,
            index
          }) => {
            return variant[index] === value ? count + 1 : count;
          }, 0);

          // Only enable an option if an available variant matches all but one current selected value
          if (countVariantOptionsThatMatchCurrent >= selected_options.length - 1) {
            entry.isUnavailable = entry.isUnavailable && variant.available ? false : entry.isUnavailable;
          }

          // Make sure if a variant is unavailable, disable currently selected option
          if ((!this.currentVariant || !this.currentVariant.available) && selected_options.find((option) => option.value === entry.value && index === option.index)) {
            entry.isUnavailable = true;
          }

          // First option is always enabled
          if (index === 'option1') {
            entry.isUnavailable = entry.isUnavailable && variant.available ? false : entry.isUnavailable;
          }
        });

        return options;
      }, {
        option1: [],
        option2: [],
        option3: []
      });
    }
    quickAdd(evt) {
      evt.preventDefault();
      if (this.quick_add.disabled) {
        return;
      }
      this.quick_add.classList.add('loading');
      this.quick_add.setAttribute('aria-disabled', true);

      const config = {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/javascript'
        }
      };

      let formData = new FormData();

      formData.append('id', this.quick_add.dataset.productId);
      formData.append('quantity', 1);
      formData.append('sections', this.getSectionsToRender().map((section) => section.section));
      formData.append('sections_url', window.location.pathname);

      config.body = formData;

      fetch(`${theme.routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            return;
          }
          this.renderContents(response);

          dispatchCustomEvent('cart:item-added', {
            product: response.hasOwnProperty('items') ? response.items[0] : response
          });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.quick_add.classList.remove('loading');
          this.quick_add.removeAttribute('aria-disabled');
        });

      return false;
    }
    getSectionsToRender() {
      return [
        {
          id: 'Cart-Drawer',
          section: 'cart-drawer',
          selector: '.cart_drawer_main'
        },
        {
          id: 'Cart-Drawer',
          section: 'cart-drawer',
          selector: '#footer-cart'
        },
        {
          id: 'cart__form__items',
          section: 'main-cart',
          selector: '.cart__form'
        },
        {
          id: 'cart-payment',
          section: 'main-cart',
          selector: '.cart-payment'
        },
        {
          id: 'cart-drawer-toggle',
          section: 'cart-bubble',
          selector: '.thb-item-count'
        },
        {
          id: 'cart_count',
          section: 'cart-bubble-drawer',
          selector: '.thb-itemcount'
        }
      ];
    }
    renderContents(parsedState) {
      this.getSectionsToRender().forEach((section => {
        if (!document.getElementById(section.id)) {
          return;
        }

        const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        if (section.id === 'Cart-Drawer') {
          document.getElementById('Cart-Drawer')?.notesToggle();
          document.getElementById('Cart-Drawer')?.removeProductEvent();
        }

        if (section.id === 'Cart' && typeof Cart !== 'undefined') {
          new Cart().renderContents(parsedState);
        }
      }));


      if (document.getElementById('Cart-Drawer')) {
        document.getElementById('Cart-Drawer').classList.add('active');
        document.body.classList.add('open-cart');
        document.body.classList.add('open-cc');
        if (document.getElementById('Cart-Drawer').querySelector('.product-recommendations--full')) {
          document.getElementById('Cart-Drawer').querySelector('.product-recommendations--full').classList.add('active');
        }
        dispatchCustomEvent('cart-drawer:open');
      }
    }
    getSectionInnerHTML(html, selector = '.shopify-section') {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
  }
  customElements.define('product-card', ProductCard);
}

/**
 *  @class
 *  @function PanelClose
 */
if (!customElements.get('side-panel-close')) {
  class PanelClose extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.cc = document.querySelector('.click-capture');

      this.onClick = (e) => {
        let panel = document.querySelectorAll('.side-panel.active');
        if (panel.length) {
          this.close_panel(e, panel[0]);
        }
      };
      // Add functionality to buttons
      this.addEventListener('click', this.onClick.bind(this));
      document.addEventListener('panel:close', this.onClick.bind(this));
      if (!this.cc.hasAttribute('initialized')) {
        this.cc.addEventListener('click', this.onClick.bind(this));
        this.cc.setAttribute('initialized', '');
      }

    }
    close_panel(e, panel) {
      if (e) {
        e.preventDefault();
      }
      if (!panel) {
        panel = e?.target.closest('.side-panel.active');

        if (!panel) {
          return;
        }
      }
      if (panel.classList.contains('product-drawer') || document.body.classList.contains('open-quick-view')) {
        this.close_quick_view();
      } else if (panel.classList.contains('cart-drawer')) {
        if (panel.querySelector('.product-recommendations--full')) {
          if (!document.body.classList.contains('open-quick-view')) {
            panel.querySelector('.product-recommendations--full').classList.remove('active');
          }
        }
        if (window.innerWidth < 1069) {
          if (!document.body.classList.contains('open-quick-view')) {
            panel.classList.remove('active');
            document.body.classList.remove('open-cc');
            document.body.classList.remove('open-cart');
          } else {
            this.close_quick_view();
          }
        } else {
          if (panel.querySelector('.product-recommendations--full')) {
            if (!document.body.classList.contains('open-quick-view')) {
              setTimeout(() => {
                panel.classList.remove('active');
                document.body.classList.remove('open-cc');
                document.body.classList.remove('open-cart');
              }, 500);
            } else {
              this.close_quick_view();
            }
          } else {
            panel.classList.remove('active');
            document.body.classList.remove('open-cc');
            document.body.classList.remove('open-cart');
          }
        }
      } else {
        panel.classList.remove('active');
        document.body.classList.remove('open-cc');
      }
    }
    close_quick_view() {
      let panel = document.getElementById('Product-Drawer');

      if (panel.querySelector('.product-quick-images--container')) {
        panel.querySelector('.product-quick-images--container').classList.remove('active');
      }
      if (window.innerWidth < 1069) {
        panel.classList.remove('active');
        if (!document.body.classList.contains('open-cart') || !document.body.classList.contains('open-quick-view')) {
          document.body.classList.remove('open-cc');
        }
        document.body.classList.remove('open-quick-view');
      } else {
        if (panel.querySelector('.product-quick-images--container')) {
          setTimeout(() => {
            panel.classList.remove('active');
            if (!document.body.classList.contains('open-cart') || !document.body.classList.contains('open-quick-view')) {
              document.body.classList.remove('open-cc');
            }
            document.body.classList.remove('open-quick-view');
            panel.querySelector('#Product-Drawer-Content').innerHTML = '';
          }, 500);
        }
      }
    }
  }
  customElements.define('side-panel-close', PanelClose);

  document.addEventListener('keyup', (e) => {
    if (e.code) {
      if (e.code.toUpperCase() === 'ESCAPE') {
        dispatchCustomEvent('panel:close');
      }
    }
  });
}
/**
 *  @class
 *  @function CartDrawer
 */
if (!customElements.get('cart-drawer')) {
  class CartDrawer extends HTMLElement {

    constructor() {
      super();
    }

    connectedCallback() {
      let button = document.getElementById('cart-drawer-toggle');

      // Add functionality to buttons
      button.addEventListener('click', (e) => {
        e.preventDefault();
       //  setTimeout(() => {
       //    document.body.classList.add('open-cc');
       //    document.body.classList.add('open-cart');
       //    this.classList.add('active');
       //    this.focus();
       // },500);
        setTimeout(() => {
          this.querySelector('.product-recommendations--full')?.classList.add('active');
        });
        dispatchCustomEvent('cart-drawer:open');
      });

      this.debouncedOnChange = debounce((event) => {
        this.onChange(event);
      }, 300);

      document.addEventListener('cart:refresh', (event) => {
        this.refresh();
      });

      this.addEventListener('change', this.debouncedOnChange.bind(this));

      this.notesToggle();
      this.removeProductEvent();
    }
    onChange(event) {
      if (event.target.classList.contains('qty')) {
        this.updateQuantity(event.target.dataset.index, event.target.value);
      }
    }
    removeProductEvent() {
      let removes = this.querySelectorAll('.remove');
      removes.forEach((remove) => {
        remove.addEventListener('click', (event) => {
          this.updateQuantity(event.target.dataset.index, '0');
          event.preventDefault();
        });
      });
    }
    getSectionsToRender() {
      return [
        {
          id: 'Cart-Drawer',
          section: 'cart-drawer',
          selector: '.cart_drawer_main'
        },
        {
          id: 'footer-cart',
          section: 'cart-drawer',
          selector: '#footer-cart'
        },
        {
          id: 'cart__form__items',
          section: 'main-cart',
          selector: '.cart__form'
        },
        {
          id: 'cart-payment',
          section: 'main-cart',
          selector: '.cart-payment'
        },
        {
          id: 'cart-drawer-toggle',
          section: 'cart-bubble',
          selector: '.thb-item-count'
        },
        {
          id: 'cart_count',
          section: 'cart-bubble-drawer',
          selector: '.thb-itemcount'
        }
      ];
    }
    getSectionInnerHTML(html, selector) {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
    notesToggle() {
      let notes_toggle = document.getElementById('order-note-toggle');

      if (!notes_toggle) {
        return;
      }

      notes_toggle.addEventListener('click', (event) => {
        notes_toggle.nextElementSibling.classList.add('active');
      });
      notes_toggle.nextElementSibling.querySelectorAll('.button, .order-note-toggle__content-overlay').forEach((el) => {
        el.addEventListener('click', (event) => {
          notes_toggle.nextElementSibling.classList.remove('active');
          this.saveNotes();
        });
      });
    }
    saveNotes() {
      fetch(`${theme.routes.cart_update_url}.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': `application/json`
        },
        body: JSON.stringify({
          'note': document.getElementById('mini-cart__notes').value
        })
      });
    }
    updateQuantity(line, quantity) {
      this.querySelector(`#CartDrawerItem-${line}`)?.classList.add('thb-loading');
      const body = JSON.stringify({
        line,
        quantity,
        sections: this.getSectionsToRender().map((section) => section.section),
        sections_url: window.location.pathname
      });

      dispatchCustomEvent('line-item:change:start', {
        quantity: quantity
      });
      this.querySelector('.product-recommendations--full')?.classList.remove('active');

      fetch(`${theme.routes.cart_change_url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': `application/json`
        },
        ...{
          body
        }
      })
        .then((response) => {
          return response.text();
        })
        .then((state) => {
          const parsedState = JSON.parse(state);

          this.getSectionsToRender().forEach((section => {
            // const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            // if (parsedState.sections) {
            //   elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            // }
            const sectionContainer = document.getElementById(section.id);
            if (!sectionContainer) return;
            const elementToReplace = sectionContainer.querySelector(section.selector) || sectionContainer;
            if (parsedState.sections && parsedState.sections[section.section]) {
              elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            }
          }));

          this.removeProductEvent();
          this.notesToggle();
          dispatchCustomEvent('line-item:change:end', {
            quantity: quantity,
            cart: parsedState
          });

          this.querySelector(`#CartDrawerItem-${line}`)?.classList.remove('thb-loading');
        });
    }
    refresh() {
      this.querySelector('.product-recommendations--full')?.classList.remove('active');
      let sections = 'cart-drawer,cart-bubble';
      fetch(`${window.location.pathname}?sections=${sections}`)
        .then((response) => {
          return response.text();
        })
        .then((state) => {
          const parsedState = JSON.parse(state);

          this.getSectionsToRender().forEach((section => {
            const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState[section.section], section.selector);
          }));

          this.removeProductEvent();
          this.notesToggle();
        });
    }
  }
  customElements.define('cart-drawer', CartDrawer);
}

/**
 *  @class
 *  @function SelectWidth
 */
class SelectWidth {
  constructor() {
    let _this = this;
    // resize on initial load
    window.addEventListener('load', () => {
      document.querySelectorAll('.resize-select').forEach(_this.resizeSelect);
    });

    // delegated listener on change
    document.body.addEventListener('change', (e) => {
      if (e.target.matches('.resize-select') && e.target.offsetParent !== null) {
        _this.resizeSelect(e.target);
      }
    });
    window.addEventListener('resize.resize-select', function () {
      document.querySelectorAll('.resize-select').forEach(_this.resizeSelect);
    });
  }

  resizeSelect(sel) {
    let tempOption = document.createElement('option');
    tempOption.textContent = sel.selectedOptions[0].textContent;

    let tempSelect = document.createElement('select'),
      offset = 13;
    tempSelect.style.visibility = 'hidden';
    tempSelect.style.position = 'fixed';
    tempSelect.appendChild(tempOption);
    if (sel.classList.contains('thb-language-code') || sel.classList.contains('thb-currency-code') || sel.classList.contains('facet-filters__sort')) {
      offset = 2;
    }
    sel.after(tempSelect);
    if (tempSelect.clientWidth > 0) {
      sel.style.width = `${+tempSelect.clientWidth + offset}px`;
    }
    tempSelect.remove();
  }
}

if (typeof SelectWidth !== 'undefined') {
  new SelectWidth();
}

/**
 *  @class
 *  @function FooterMenuToggle
 */
class FooterMenuToggle {
  constructor() {
    let _this = this;
    // resize on initial load
    document.querySelectorAll('.footer-top .thb-widget-title.collapsible').forEach((button) => {
      button.addEventListener('click', (e) => {
     
        let content = button.nextElementSibling;
  if (button.classList.contains("active")) {
          // Collapse content
          content.style.setProperty("--max-height", `0px`);
        } else {
          // Expand content
          content.style.setProperty("--max-height", `${content.scrollHeight}px`);
        }
        button.classList.toggle('active');
      });
    });
  }
}

/**
 *  @class
 *  @function QuickView
 */
if (!customElements.get('quick-view')) {
  class QuickView extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.drawer = document.getElementById('Product-Drawer');
      this.body = document.body;

      this.addEventListener('click', this.setupEventListener.bind(this));

    }
    setupEventListener(e) {
      e.preventDefault();
      let productHandle = this.dataset.productHandle,
        href = `${theme.routes.root_url}/products/${productHandle}?view=quick-view`;

      // remove double `/` in case shop might have /en or language in URL
      href = href.replace('//', '/');
      if (!href || !productHandle) {
        return;
      }
      if (this.classList.contains('loading')) {
        return;
      }
      this.classList.add('loading');
      fetch(href, {
        method: 'GET'
      })
        .then((response) => {
          this.classList.remove('loading');
          return response.text();
        })
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('#Product-Drawer-Content').innerHTML;

          this.renderQuickview(sectionInnerHTML, href, productHandle);

        });
    }
    renderQuickview(sectionInnerHTML, href, productHandle) {
      if (sectionInnerHTML) {

        this.drawer.querySelector('#Product-Drawer-Content').innerHTML = sectionInnerHTML;

        let js_files = this.drawer.querySelector('#Product-Drawer-Content').querySelectorAll('script');

        if (js_files.length > 0) {
          var head = document.getElementsByTagName('head')[0];
          js_files.forEach((js_file, i) => {
            let script = document.createElement('script');
            script.src = js_file.src;
            head.appendChild(script);
          });
        }

        setTimeout(() => {
          if (Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }
          if (window.ProductModel) {
            window.ProductModel.loadShopifyXR();
          }
        }, 300);

        this.body.classList.add('open-cc');
        this.body.classList.add('open-quick-view');
        this.drawer.classList.add('active');

        this.drawer.querySelector('.side-panel-close').focus();

        setTimeout(() => {
          this.drawer.querySelector('.product-quick-images--container').classList.add('active');
        });
        dispatchCustomEvent('quick-view:open', {
          productUrl: href,
          productHandle: productHandle
        });
        addIdToRecentlyViewed(productHandle);
      }
    }
  }
  customElements.define('quick-view', QuickView);
}

/**
 *  @class
 *  @function SidePanelContentTabs
 */
if (!customElements.get('side-panel-content-tabs')) {
  class SidePanelContentTabs extends HTMLElement {
    constructor() {
      super();
      this.buttons = this.querySelectorAll('button');
      this.panels = this.parentElement.querySelectorAll('.side-panel-content--tab-panel');
    }
    connectedCallback() {
      this.setupButtonObservers();
    }
    disconnectedCallback() {

    }
    setupButtonObservers() {
      this.buttons.forEach((item, i) => {
        item.addEventListener('click', (e) => {
          this.toggleActiveClass(i);
        });
      });
    }
    toggleActiveClass(i) {
      this.buttons.forEach((button) => {
        button.classList.remove('tab-active');
      });
      this.buttons[i].classList.add('tab-active');

      this.panels.forEach((panel) => {
        panel.classList.remove('tab-active');
      });
      this.panels[i].classList.add('tab-active');
    }
  }

  customElements.define('side-panel-content-tabs', SidePanelContentTabs);
}
/**
 *  @class
 *  @function CollapsibleRow v1 on filter
 */

if (!customElements.get('collapsible-card')) {
  // https://css-tricks.com/how-to-animate-the-details-element/
  class CollapsibleRow extends HTMLElement {
    constructor() {
      super();

      this.details = this.querySelector('details');
      this.summary = this.querySelector('summary');
      this.content = this.querySelector('.collapsible__content');

      // Store the animation object (so we can cancel it if needed)
      this.animation = null;
      // Store if the element is closing
      this.isClosing = false;
      // Store if the element is expanding
      this.isExpanding = false;
    }
    connectedCallback() {
      this.setListeners();
    }
    setListeners() {
      this.querySelector('summary').addEventListener('click', (e) => this.onClick(e));
    }
    instantClose() {
      this.tl.timeScale(10).reverse();
    }
    animateClose() {
      this.tl.timeScale(3).reverse();
    }
    animateOpen() {
      this.tl.timeScale(1).play();
    }
    onClick(e) {
      // Stop default behaviour from the browser
      e.preventDefault();
      // Add an overflow on the <details> to avoid content overflowing
      this.details.style.overflow = 'hidden';
      // Check if the element is being closed or is already closed
      if (this.isClosing || !this.details.open) {
        this.open();
        // Check if the element is being openned or is already open
      } else if (this.isExpanding || this.details.open) {
        this.shrink();
      }
    }
    shrink() {
      this.details.classList.remove("expand");
      this.isClosing = true;
      const startHeight = `${this.details.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight}px`;

      if (this.animation) this.animation.cancel();

      this.animation = this.details.animate({ height: [startHeight, endHeight] }, { duration: 800, easing: 'ease' });

      this.animation.onfinish = () => this.onAnimationFinish(false);
      this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
      // Apply a fixed height on the element
      this.details.style.height = `${this.details.offsetHeight}px`;
      // Force the [open] attribute on the details element
      this.details.open = true;
      // Wait for the next frame to call the expand function
      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      this.details.classList.add("expand");
      this.isExpanding = true;
      const startHeight = `${this.details.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

      if (this.animation) this.animation.cancel();

      this.animation = this.details.animate({ height: [startHeight, endHeight] }, { duration: 400, easing: 'ease-out' });

      this.animation.onfinish = () => this.onAnimationFinish(true);
      this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
      // Set the open attribute based on the parameter
      this.details.open = open;
      // Clear the stored animation
      this.animation = null;
      // Reset isClosing & isExpanding
      this.isClosing = false;
      this.isExpanding = false;
      // Remove the overflow hidden and the fixed height
      this.details.style.height = this.details.style.overflow = '';
    }
  }
  customElements.define('collapsible-card', CollapsibleRow);
}

/**
 *  @class
 *  @function CollapsibleRow
 */
if (!customElements.get('collapsible-row')) {
  class CollapsibleRow extends HTMLElement {
    constructor() {
      super();

      this.details = this.querySelector('details');
      this.summary = this.querySelector('summary');
      this.content = this.querySelector('.collapsible__content'); // animate this wrapper

      this.animation = null;
      this.isExpanding = false;
      this.isClosing = false;
    }

    connectedCallback() {
      this.summary.addEventListener('click', (e) => {
        e.preventDefault();
        this.onClick();
      });
    }

    onClick() {
      // Close other open rows
      document.querySelectorAll('collapsible-row').forEach(row => {
        if (row !== this && row.details.open) row.shrink();
      });

      if (!this.details.open || this.isClosing) {
        this.open();
      } else {
        this.shrink();
      }
    }

    getContentHeight() {
      this.content.style.height = 'auto';
      const h = this.content.scrollHeight;
      this.content.style.height = '';
      return h;
    }

    open() {
      this.details.classList.add("expand");
      this.details.open = true;
      const endHeight = this.getContentHeight();

      this.isExpanding = true;
      this.isClosing = false;

      this.cancelAnimation();
      this.content.style.overflow = 'hidden';
      this.content.style.height = '0px';

      this.animation = this.content.animate(
        { height: ['0px', `${endHeight}px`] },
        { duration: 400, easing: 'ease-out' }
      );

      this.animation.onfinish = () => {
        this.finish(true, endHeight);
      };
    }

    shrink() {
            this.details.classList.remove("expand");
      const startHeight = this.content.scrollHeight;

      this.isClosing = true;
      this.isExpanding = false;

      this.cancelAnimation();
      this.content.style.overflow = 'hidden';
      this.content.style.height = `${startHeight}px`;

      this.animation = this.content.animate(
        { height: [`${startHeight}px`, '0px'] },
        { duration: 800, easing: 'ease' }
      );

      this.animation.onfinish = () => {
        this.finish(false);
      };
    }

    finish(open, finalHeight = 0) {
      this.animation = null;
      this.isExpanding = false;
      this.isClosing = false;

      if (open) {
        this.content.style.height = `${finalHeight}px`;
        requestAnimationFrame(() => {
          this.content.style.height = 'auto';
          this.content.style.overflow = '';
        });
      } else {
        this.details.open = false;
        this.content.style.height = '0px';
        this.content.style.overflow = '';
      }
    }

    cancelAnimation() {
      if (this.animation) this.animation.cancel();
      this.animation = null;
    }
  }

  customElements.define('collapsible-row', CollapsibleRow);
}

if (!customElements.get('tab-progress')) {
  class TabProgress extends HTMLElement {
    constructor() {
      super();
      this.progress_active = this.querySelector('.tab-progress-bar-active');
      this.mainparent = this.previousElementSibling;
      this.onClick = this.onClick.bind(this); // Bind the method to the instance
    }

    connectedCallback() {
      console.log(this)
      this.mainparent.querySelectorAll(".progress-tab-button").forEach((item) => {
        item.addEventListener("click", (e) => this.onClick(e)); // Properly pass the event
      });
    }

    onClick(e) {
      const tabRect = e.currentTarget.getBoundingClientRect();
      const containerRect = this.mainparent.getBoundingClientRect();
      this.progress_active.style.width = `${tabRect.width}px`;
      this.progress_active.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
    }
  }
  customElements.define('tab-progress', TabProgress);
}
/**
 *  @function addIdToRecentlyViewed
 */
function addIdToRecentlyViewed(handle) {

  if (!handle) {
    let product = document.querySelector('.thb-product-detail');

    if (product) {
      handle = product.dataset.handle;
    }
  }
  if (!handle) {
    return;
  }
  if (window.localStorage) {
    let recentIds = window.localStorage.getItem('recently-viewed');
    if (recentIds != 'undefined' && recentIds != null) {
      window.recentlyViewedIds = JSON.parse(recentIds);
    }
  }
  // Remove current product if already in recently viewed array
  var i = window.recentlyViewedIds.indexOf(handle);

  if (i > -1) {
    window.recentlyViewedIds.splice(i, 1);
  }

  // Add id to array
  window.recentlyViewedIds.unshift(handle);

  if (window.localStorage) {
    window.localStorage.setItem('recently-viewed', JSON.stringify(window.recentlyViewedIds));
  }
}
document.addEventListener('DOMContentLoaded', () => {
  if (typeof FooterMenuToggle !== 'undefined') {
    new FooterMenuToggle();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const accountWrapper = document.querySelector(".account-wrapper");
  const underlineEle = accountWrapper?.querySelector(".under_progress");
  const tabs = Array.from(document.querySelectorAll(".nav__tabs .progress-single"));
  const tabContents = Array.from(document.querySelectorAll('[data-account-tab]'));

  // Update underline position
  const updateUnderline = (activeTab) => {
    tabs.forEach(t => t.classList.remove("active"));
    activeTab.classList.add("active");

    if (!underlineEle || !accountWrapper) return;

    const tabRect = activeTab.getBoundingClientRect();
    const parentRect = accountWrapper.getBoundingClientRect();

    underlineEle.style.width = `${tabRect.width}px`;
    underlineEle.style.transform = `translateX(${tabRect.left - parentRect.left}px)`;
  };

  // Handle tab changes
  const handleTabChange = () => {
    const hash = window.location.hash.slice(1) || 'overview';
    const navTab = document.querySelector(`.progress-single[data-button="${hash}"]`);
    
    // Update tab content visibility
    tabContents.forEach(tab => {
      tab.style.display = tab.dataset.accountTab === hash ? 'block' : 'none';
    });

    // Handle special cases
    if (hash === "appointment" || hash === "profile") {
    const accountwrapper=  document.querySelector('.dropdown-menu-box-container');
      updateUnderline(accountwrapper)
    }

    // Update UI if valid tab found
    if (navTab) {
      updateUnderline(navTab);
      
      // Resize any sliders in the active tab
      document.querySelectorAll('slider-component').forEach(component => {
        const flkty = Flickity.data(component);
        flkty?.resize();
      });
    }
  };

  // Initialize
  const defaultTab = document.querySelector(".nav__tabs .progress-single.active") || tabs[0];
  if (defaultTab) updateUnderline(defaultTab);

  // Set up event listeners
  tabs.forEach(tab => {
    tab.addEventListener("click", () => updateUnderline(tab));
  });

  window.addEventListener('hashchange', handleTabChange);
  handleTabChange(); // Initial call
});