if (!customElements.get("variant-selects")) {
  /**
   *  @class
   *  @function VariantSelects
   */
  class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.sticky = this.dataset.sticky;
      this.updateUrl = this.dataset.updateUrl === "true";
      this.isDisabledFeature = this.dataset.isDisabled;
      this.addEventListener("change", this.onVariantChange);
      this.other = Array.from(
        document.querySelectorAll("variant-selects")
      ).filter((selector) => {
        return selector != this;
      });
      this.productWrapper = this.closest(".thb-product-detail");
      if (this.productWrapper) {
        this.productSlider = this.productWrapper.querySelector(
          ".product-images"
        )
          ? this.productWrapper.querySelector(".product-images")
          : this.productWrapper.querySelector(".product-quick-images");
        this.thumbnails = this.productWrapper.querySelector(
          ".product-thumbnail-container"
        );
        this.hideVariants = this.productSlider.dataset.hideVariants === "true";
      }
    }

    connectedCallback() {
      this.updateOptions();
      this.updateMasterId();
      this.setDisabled();
      this.setImageSet();
    }

    onVariantChange() {
      this.updateOptions();
      this.updateMasterId();
      // this.toggleAddButton(true, "", false);
      this.updatePickupAvailability();
      this.removeErrorMessage();
      this.updateVariantText();
      this.setDisabled();

      if (!this.currentVariant) {
        // this.toggleAddButton(true, "", true);
        this.setUnavailable();
      } else {
        this.updateMedia();
        if (this.updateUrl) {
          this.updateURL();
        }
        this.updateVariantInput();
        this.renderProductInfo();
        //this.updateShareUrl();
      }
      this.updateOther();
      dispatchCustomEvent("product:variant-change", {
        variant: this.currentVariant,
        sectionId: this.dataset.section,
      });
    }

    updateOptions() {
      this.fieldsets = Array.from(this.querySelectorAll("fieldset"));
      this.options = [];
      this.option_keys = [];

      this.fieldsets.forEach((fieldset, i) => {
        if (fieldset.querySelector("select")) {
          this.options.push(fieldset.querySelector("select").value);
          this.option_keys.push(fieldset.querySelector("select").name);
        } else if (fieldset.querySelectorAll("input").length) {
          const checkedInput = fieldset.querySelector("input:checked");
          if (checkedInput) {
            // Ensure a checked input exists
            this.options.push(checkedInput.value);
            this.option_keys.push(checkedInput.name);
          }
        }
      });
      this.dataset.options = this.options;
    }
    updateVariantText() {
      const fieldsets = Array.from(this.querySelectorAll("fieldset"));
      const sizefieldsets = this.querySelector('fieldset[data-handle="size"]');
      fieldsets.forEach((item, i) => {
        let label = item.querySelector(".form__label__value");

        if (label) {
          label.innerHTML = this.options[i];
        }
      });
      console.log("this.currentVariant",this.currentVariant);
      Array.from(this.querySelectorAll(".tootlip-active")).forEach((item) => {
        item.classList.remove("tootlip-active");
      });
      const currentBadge =
        this.productWrapper.querySelector(".low-stock-badge");
      if (currentBadge.classList.contains("tootlip-active")) {
        currentBadge.classList.remove("tootlip-active");
      }
      if (
        sizefieldsets &&
        this.currentVariant.inventory_quantity <= 2 &&
        this.currentVariant.inventory_quantity > 0
      ) {
        sizefieldsets
          .querySelector("input:checked + label")
          .classList.add("tootlip-active");
        setTimeout(function () {
          currentBadge.classList.add("tootlip-active");
        }, 200);
      }
    }
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
             console.log("this.currentVariant2",variant, option, index);
            return this.options[index] === option;
          })
          .includes(false);
      });
     console.log("this.currentVariant3",this.currentVariant);
      if (this.currentVariant) {
        this.currentVariant.inventory_quantity =
          this.getVariantInventory()[this.currentVariant?.id] ?? null;
      }
    }

    updateOther() {
      if (this.dataset.updateUrl === "false") {
        return;
      }
      if (this.other.length) {
        let fieldsets = this.other[0].querySelectorAll("fieldset"),
          fieldsets_array = Array.from(fieldsets);
        this.options.forEach((option, i) => {
          if (fieldsets_array[i].querySelector("select")) {
            fieldsets_array[i].querySelector(`select`).value = option;
          } else if (fieldsets_array[i].querySelectorAll("input").length) {
            fieldsets_array[i].querySelector(
              `input[value="${option}"]`
            ).checked = true;
          }
        });
        this.other[0].updateOptions();
        this.other[0].updateMasterId();
        this.other[0].updateVariantText();
        this.other[0].setDisabled();
      }
    }

    updateMedia() {
      if (!this.currentVariant) return;
      if (!this.currentVariant.featured_media) return;
      if (!this.productSlider) return;
      let mediaId = `#Slide-${this.dataset.section}-${this.currentVariant.featured_media.id}`;
      let activeMedia = this.productSlider.querySelector(mediaId);

      if (this.thumbnails) {
        this.setActiveMediaSlider(
          mediaId,
          `#Thumb-${this.dataset.section}-${this.currentVariant.featured_media.id}`,
          this.productSlider
        );
      } else {
        this.setActiveMedia(activeMedia);
      }
    }
    setActiveMedia(activeMedia) {
      this.productSlider
        .querySelectorAll("[data-media-id]")
        .forEach((element) => {
          element.classList.remove("is-active");
        });

      this.setImageSetMedia();

      activeMedia.classList.add("is-active");

      activeMedia.parentElement.prepend(activeMedia);

      if (!this.sticky) {
        window.setTimeout(() => {
          if (window.innerWidth > 1068) {
            let header_h =
                activeMedia.parentElement.offsetTop -
                parseInt(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    "--header-height"
                  )
                ),
              scroll_obj = {
                left: 0,
                behavior: "instant",
              };

            if (header_h > 0) {
              scroll_obj.top = header_h;
            }
            window.scrollTo(scroll_obj);
          }
          activeMedia.parentElement.scrollTo({
            left: 0,
            behavior: "instant",
          });
        });
      }
    }
    setActiveMediaSlider(mediaId, thumbId, productSlider) {
      let flkty = Flickity.data(productSlider),
        activeMedia = productSlider.querySelector(mediaId);

      if (flkty && this.hideVariants) {
        if (
          productSlider.querySelector(
            ".product-images__slide.is-initial-selected"
          )
        ) {
          productSlider
            .querySelector(".product-images__slide.is-initial-selected")
            .classList.remove("is-initial-selected");
        }
        [].forEach.call(
          productSlider.querySelectorAll(
            ".product-images__slide-item--variant"
          ),
          function (el) {
            el.classList.remove("is-active");
          }
        );

        activeMedia.classList.add("is-active");
        activeMedia.classList.add("is-initial-selected");

        this.setImageSetMedia();

        if (this.thumbnails) {
          let activeThumb = this.thumbnails.querySelector(thumbId);

          if (
            this.thumbnails.querySelector(
              ".product-thumbnail.is-initial-selected"
            )
          ) {
            this.thumbnails
              .querySelector(".product-thumbnail.is-initial-selected")
              .classList.remove("is-initial-selected");
          }
          [].forEach.call(
            this.thumbnails.querySelectorAll(
              ".product-images__slide-item--variant"
            ),
            function (el) {
              el.classList.remove("is-active");
            }
          );

          activeThumb.classList.add("is-active");
          activeThumb.classList.add("is-initial-selected");
        }

        productSlider.reInit(this.imageSetIndex);
        productSlider.selectCell(mediaId);
      } else if (flkty) {
        productSlider.selectCell(mediaId);
      }
    }

    updateURL() {
      if (!this.currentVariant || this.dataset.updateUrl === "false") return;
      // window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
      window.history.replaceState({}, "", `${this.dataset.url}`);
      //console.log(this.currentVariant.id)
    }

    updateShareUrl() {
      const shareButton = document.getElementById(
        `Share-${this.dataset.section}`
      );
      if (!shareButton) return;
      // shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
      shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}`);
    }

    updateVariantInput() {
      const productForms = document.querySelectorAll(
        `#product-form-${this.dataset.section}, #product-form-installment`
      );
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );
      });
    }

    updatePickupAvailability() {
      const pickUpAvailability = document.querySelector(
        ".pickup-availability-wrapper"
      );

      if (!pickUpAvailability) return;

      if (this.currentVariant && this.currentVariant.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);
      } else {
        pickUpAvailability.removeAttribute("available");
        pickUpAvailability.innerHTML = "";
      }
    }

    removeErrorMessage() {
      const section = this.closest("section");
      if (!section) return;

      const productForm = section.querySelector("product-form");
      if (productForm) productForm.handleErrorMessage();
    }

    getSectionsToRender() {
      return [
        `price-${this.dataset.section}`,
        `price-${this.dataset.section}--sticky`,
        `product-image-${this.dataset.section}--sticky`,
        `inventory-${this.dataset.section}`,
        `sku-${this.dataset.section}`,
        `quantity-${this.dataset.section}`,
      ];
    }

    renderProductInfo() {
      let sections = this.getSectionsToRender();

      fetch(
        `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
      )
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(
            responseText,
            "text/html"
          );
          sections.forEach((id) => {
            const destination = document.getElementById(id);
            const source = html.getElementById(id);

            if (source && destination) {
              if (id.indexOf("price-") > -1) {
                let source_price = $(source)
                  .find("span[data-base-price]")
                  .attr("data-base-price");
                let destination_price = $(destination)
                  .find("span[data-base-price]")
                  .attr("data-base-price");
                // console.log(destination.innerHTML,source.innerHTML);
                if (source_price != destination_price)
                  destination.innerHTML = source.innerHTML;
              } else {
                destination.innerHTML = source.innerHTML;
              }
            }
            const price = document.getElementById(id);
            const price_fixed = document.getElementById(id + "--sticky");

            if (price) price.classList.remove("visibility-hidden");
            if (price_fixed) price_fixed.classList.remove("visibility-hidden");
          });
          this.toggleAddButton(
            !this.currentVariant.available,
            window.theme.variantStrings.soldOut
          );
        });
    }


   toggleAddButton(disable = true, text = false, modifyClass = true) {
  console.log("toggle Add button")

  const productForm = document.getElementById(`product-form-${this.dataset.section}`);
  if (!productForm) return;

  const submitButtons = document.querySelectorAll(".single-add-to-cart-button");
  if (!submitButtons || submitButtons.length === 0) return;

  // Determine desired text for comparison (fallbacks if window.theme not available)
  const desiredText = text
    ? text
    : disable
    ? (window.theme?.variantStrings?.unavailable ?? "Unavailable")
    : (window.theme?.variantStrings?.addToCart ?? "Add to Bag");

  // Quick idempotence check: if ALL submit buttons already match the requested state, skip doing work.
  let needsUpdate = false;
  submitButtons.forEach((submitButton) => {
    const submitButtonTextEl = submitButton.querySelector(".single-add-to-cart-button--text");
    if (!submitButtonTextEl) {
      needsUpdate = true; // can't be sure, so proceed
      return;
    }

    const isDisabledNow = submitButton.hasAttribute("disabled") || submitButton.getAttribute("aria-disabled") === "true";
    const currentText = submitButtonTextEl.textContent?.trim() ?? "";

    if (isDisabledNow !== !!disable || currentText !== desiredText) {
      needsUpdate = true;
    }
  });

  if (!needsUpdate) {
    // Nothing to change — prevents duplicate runs from multiple callers
    return;
  }

  // Proceed with updates (existing behavior)
  submitButtons.forEach((submitButton) => {
    const submitButtonText = submitButton.querySelector(".single-add-to-cart-button--text");
    const selectVariant = document.querySelector(".select_variant");
    const notify_btn = document.querySelectorAll(".notify_card");
    const externalEmail = document.querySelectorAll("#external-email");
    const externalButton = document.querySelectorAll(".external-button-box");

    if (!submitButtonText || !selectVariant) return;

    console.log("enable", disable);

    if (disable) {
      submitButton.setAttribute("disabled", "disabled");
      // Optionally set aria-disabled for accessibility
      submitButton.setAttribute("aria-disabled", "true");

      if (text) {
        submitButtonText.textContent = text;
        notify_btn.forEach((btn) => btn.classList.add("active"));
        externalEmail.forEach((btn) => btn.removeAttribute("style"));
        externalButton.forEach((btn) => btn.removeAttribute("style"));
      } else {
        submitButtonText.textContent = "Add to Bag";
        notify_btn.forEach((btn) => btn.classList.remove("active"));
      }
    } else {
      submitButton.removeAttribute("disabled");
      submitButton.removeAttribute("aria-disabled");
      submitButton.classList.remove("loading");

      // Only overwrite text if it currently says a sold-out/unavailable message,
      // otherwise preserve any intentional custom text set elsewhere.
      const curText = submitButtonText.textContent?.trim() ?? "";
      const soldOutText = window.theme?.variantStrings?.soldOut ?? "Sold out";
      const unavailableText = window.theme?.variantStrings?.unavailable ?? "Unavailable";
      if (curText === soldOutText || curText === unavailableText || curText === "Add to Bag") {
        // prefer theme addToCart if available
        if (window.theme?.variantStrings?.addToCart) {
          submitButtonText.textContent = window.theme.variantStrings.addToCart;
        } else {
          submitButtonText.textContent = "Add to Bag";
        }
      }
      // remove notify styling if any
      document.querySelectorAll(".notify_card").forEach((btn) => btn.classList.remove("active"));
    }
  });

  if (!modifyClass) return;
}

    setUnavailable() {
      const submitButtons = document.querySelectorAll(
        ".single-add-to-cart-button"
      );
      const price = document.getElementById(`price-${this.dataset.section}`);
      const price_fixed = document.getElementById(
        `price-${this.dataset.section}--sticky`
      );

      submitButtons.forEach((submitButton) => {
        const submitButtonText = submitButton.querySelector(
          ".single-add-to-cart-button--text"
        );
        if (!submitButton) return;
        submitButtonText.textContent = window.theme.variantStrings.unavailable;
        submitButton.classList.add("sold-out");
      });
      if (price) price.classList.add("visibility-hidden");
      if (price_fixed) price_fixed.classList.add("visibility-hidden");
    }

    setDisabled() {
      if (this.isDisabledFeature != "true") {
        return;
      }
      const variant_data = this.getVariantData();

      if (variant_data) {
        let selected_options = false;
        if (this.currentVariant) {
          selected_options = this.currentVariant.options.map((value, index) => {
            return {
              value,
              index: `option${index + 1}`,
            };
          });
        } else {
          let found_option = variant_data.find((option) => {
            return option.option1 === this.options[0];
          });
          if (found_option) {
            selected_options = [
              {
                value: this.options[0],
                index: "option1",
              },
              {
                value: found_option.option2,
                index: "option2",
              },
            ];
          } else {
            return;
          }
        }

        const available_options = this.createAvailableOptionsTree(
          variant_data,
          selected_options
        );

        this.fieldsets.forEach((fieldset, i) => {
          const fieldset_options = Object.values(available_options)[i];

          if (fieldset_options) {
            if (fieldset.querySelector("select")) {
              fieldset_options.forEach((option, option_i) => {
                if (option.isUnavailable) {
                  fieldset.querySelector(
                    "option[value=" + JSON.stringify(option.value) + "]"
                  ).disabled = true;
                } else {
                  fieldset.querySelector(
                    "option[value=" + JSON.stringify(option.value) + "]"
                  ).disabled = false;
                }
              });
            } else if (fieldset.querySelectorAll("input").length) {
              fieldset.querySelectorAll("input").forEach((input, input_i) => {
                input.classList.toggle(
                  "is-disabled",
                  fieldset_options[input_i].isUnavailable
                );
              });
            }
          }
        });
      }
      return true;
    }

    getImageSetName(variant_name) {
      return variant_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-$/, "")
        .replace(/^-/, "");
    }

    setImageSet() {
      if (!this.productSlider) return;

      let dataSetEl = this.productSlider.querySelector("[data-set-name]");
      if (dataSetEl) {
        this.imageSetName = dataSetEl.dataset.setName;
        this.imageSetIndex = this.querySelector(
          '.product-form__input[data-handle="' + this.imageSetName + '"]'
        ).dataset.index;
        this.dataset.imageSetIndex = this.imageSetIndex;
        this.setImageSetMedia();
      }
    }

    setImageSetMedia() {
      if (!this.imageSetIndex) {
        return;
      }
      let setValue = this.getImageSetName(
        this.currentVariant[this.imageSetIndex]
      );
      let group = this.imageSetName + "_" + setValue;
      let selected_set_images = this.productSlider.querySelectorAll(
          `.product-images__slide[data-set-name="${this.imageSetName}"]`
        ),
        selected_set_thumbs = this.productWrapper.querySelectorAll(
          `.product-thumbnail[data-set-name="${this.imageSetName}"]`
        );

      if (this.hideVariants) {
        if (this.thumbnails) {
          // Product images
          this.productWrapper
            .querySelectorAll(".product-images__slide")
            .forEach((thumb) => {
              if (thumb.dataset.group && thumb.dataset.group !== group) {
                thumb.classList.remove("is-active");
              }
            });
          selected_set_images.forEach((thumb) => {
            thumb.classList.toggle("is-active", thumb.dataset.group === group);
          });

          // Product thumbnails
          this.productWrapper
            .querySelectorAll(".product-thumbnail")
            .forEach((thumb) => {
              if (thumb.dataset.group && thumb.dataset.group !== group) {
                thumb.classList.remove("is-active");
              }
            });
          selected_set_thumbs.forEach((thumb) => {
            thumb.classList.toggle("is-active", thumb.dataset.group === group);
          });
        } else {
          // Product images
          this.productWrapper
            .querySelectorAll(".product-images__slide")
            .forEach((thumb) => {
              if (thumb.dataset.group && thumb.dataset.group !== group) {
                thumb.classList.remove("is-active");
              }
            });
          selected_set_images.forEach((thumb) => {
            thumb.classList.toggle("is-active", thumb.dataset.group === group);
          });
        }
      } else {
        if (!this.thumbnails) {
          let set_images = Array.from(selected_set_images).filter(function (
            element
          ) {
            return element.dataset.group === group;
          });
          set_images.forEach((thumb) => {
            thumb.parentElement.prepend(thumb);
          });
        }
      }
      if (!this.thumbnails) {
        setTimeout(() => {
          this.productSlider
            .querySelector("product-slider")
            .onPaginationResize();
        }, 100);
      }
    }

    createAvailableOptionsTree(variants, currentlySelectedValues) {
      // Reduce variant array into option availability tree
      return variants.reduce(
        (options, variant) => {
          // Check each option group (e.g. option1, option2, option3) of the variant
          Object.keys(options).forEach((index) => {
            if (variant[index] === null) return;

            let entry = options[index].find(
              (option) => option.value === variant[index]
            );

            if (typeof entry === "undefined") {
              // If option has yet to be added to the options tree, add it
              entry = { value: variant[index], isUnavailable: true };
              options[index].push(entry);
            }

            const currentOption1 = currentlySelectedValues.find(
              ({ value, index }) => index === "option1"
            );
            const currentOption2 = currentlySelectedValues.find(
              ({ value, index }) => index === "option2"
            );

            switch (index) {
              case "option1":
                // Option1 inputs should always remain enabled based on all available variants
                entry.isUnavailable =
                  entry.isUnavailable && variant.available
                    ? false
                    : entry.isUnavailable;
                break;
              case "option2":
                // Option2 inputs should remain enabled based on available variants that match first option group
                if (
                  currentOption1 &&
                  variant.option1 === currentOption1.value
                ) {
                  entry.isUnavailable =
                    entry.isUnavailable && variant.available
                      ? false
                      : entry.isUnavailable;
                }
                break;
              case "option3":
                // Option 3 inputs should remain enabled based on available variants that match first and second option group
                if (
                  currentOption1 &&
                  variant.option1 === currentOption1.value &&
                  currentOption2 &&
                  variant.option2 === currentOption2.value
                ) {
                  entry.isUnavailable =
                    entry.isUnavailable && variant.available
                      ? false
                      : entry.isUnavailable;
                }
            }
          });

          return options;
        },
        { option1: [], option2: [], option3: [] }
      );
    }

    getVariantData() {
      this.variantData =
        this.variantData ||
        JSON.parse(this.querySelector('[type="application/json"]').textContent);
      console.log("this.variantData",this.variantData);
      return this.variantData;
    }

    getVariantInventory() {
      if (!this.variantInventory) {
        const inventoryEl = this.querySelector("#VariantInventory");
        this.variantInventory = inventoryEl
          ? JSON.parse(inventoryEl.textContent)
          : {};
      }

      return this.variantInventory;
    }
  }
  customElements.define("variant-selects", VariantSelects);

  /**
   *  @class
   *  @function VariantRadios
   */
  class VariantRadios extends VariantSelects {
    constructor() {
      super();
    }

    updateOptions() {
      const fieldsets = Array.from(this.querySelectorAll("fieldset"));
      this.options = fieldsets.map((fieldset) => {
        return Array.from(fieldset.querySelectorAll("input")).find(
          (radio) => radio.checked
        ).value;
      });
    }
  }

  customElements.define("variant-radios", VariantRadios);
}

if (!customElements.get("product-slider")) {
  /**
   *  @class
   *  @function ProductSlider
   */
  class ProductSlider extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.pagination = this.parentElement.querySelector(
        ".product-images-buttons"
      );
      this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
      this.video_containers = this.querySelectorAll(
        ".product-single__media-external-video--play"
      );

      // Start Gallery
      let observer = new MutationObserver(() => {
        this.setupProductGallery();
      });

      observer.observe(this, {
        attributes: true,
        attributeFilter: ["class"],
        childList: true,
        characterData: false,
      });

      this.setupProductGallery();

      // Start Pagination
      if (this.pagination) {
        this.setupPagination();
        this.resizeObserver = new ResizeObserver((entries) =>
          this.onPaginationResize()
        );
        this.resizeObserver.observe(this);
        this.addEventListener("scroll", this.updatePagination.bind(this));
      }
    }
    setupProductGallery() {
      if (!this.querySelectorAll(".product-single__media-zoom").length) {
        return;
      }

      this.setEventListeners();
    }
    buildItems(activeImages) {
      let images = activeImages.map((item) => {
        let activelink = item.querySelector(".product-single__media-zoom");
        return {
          src: activelink.getAttribute("href"),
          msrc: activelink.dataset.msrc,
          w: activelink.dataset.w,
          h: activelink.dataset.h,
          title: activelink.getAttribute("title"),
        };
      });
      return images;
    }
    setEventListeners() {
      let activeImages = Array.from(
          this.querySelectorAll(".product-images__slide--image")
        ).filter((element) => element.clientWidth > 0),
        items = this.buildItems(activeImages),
        captionEl = this.dataset.captions,
        pswpElement = document.querySelectorAll(".pswp")[0],
        options = {
          maxSpreadZoom: 2,
          loop: false,
          allowPanToNext: false,
          closeOnScroll: false,
          showHideOpacity: false,
          arrowKeys: true,
          history: false,
          captionEl: captionEl,
          fullscreenEl: false,
          zoomEl: false,
          shareEl: false,
          counterEl: true,
          arrowEl: true,
          preloaderEl: true,
        };

      let openPswp = function (e, link, options, pswpElement, items) {
        let parent = link.closest(".product-images__slide");
        let i = activeImages.indexOf(parent);
        options.index = parseInt(i, 10);
        options.getThumbBoundsFn = () => {
          const thumbnail = link.closest(".product-single__media"),
            pageYScroll = window.scrollY || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width,
          };
        };
        if (typeof PhotoSwipe !== "undefined") {
          let pswp = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
          );

          pswp.listen("firstUpdate", () => {
            pswp.listen("parseVerticalMargin", function (item) {
              item.vGap = {
                top: 50,
                bottom: 50,
              };
            });
          });
          pswp.init();
        }
        e.preventDefault();
      };
      this.querySelectorAll(".product-single__media-zoom").forEach(function (
        link
      ) {
        let thumbnail = link.closest(".product-single__media");
        let clone = link.cloneNode(true);
        thumbnail.append(clone);
        link.remove();
        clone.addEventListener("click", (e) =>
          openPswp(e, clone, options, pswpElement, items)
        );
      });

      this.video_containers.forEach((container) => {
        container
          .querySelector("button")
          .addEventListener("click", function () {
            container.setAttribute("hidden", "");
          });
      });
    }
    setupPagination() {
      this.sliderItemsToShow = Array.from(this.sliderItems).filter(
        (element) => element.clientWidth > 0
      );
      if (this.sliderItemsToShow.length < 2) return;

      this.sliderItemOffset =
        this.sliderItemsToShow[1].offsetLeft -
        this.sliderItemsToShow[0].offsetLeft;

      this.currentPageElement = this.pagination.querySelector(
        ".slider-counter--current"
      );
      this.pageTotalElement = this.pagination.querySelector(
        ".slider-counter--total"
      );

      this.prevButton = this.pagination.querySelector(
        'button[name="previous"]'
      );
      this.nextButton = this.pagination.querySelector('button[name="next"]');

      this.prevButton.addEventListener(
        "click",
        this.onPaginationButtonClick.bind(this)
      );
      this.nextButton.addEventListener(
        "click",
        this.onPaginationButtonClick.bind(this)
      );

      this.updatePagination();
    }
    onPaginationResize() {
      this.sliderItemsToShow = Array.from(this.sliderItems).filter(
        (element) => element.clientWidth > 0
      );

      if (this.sliderItemsToShow.length < 2) return;

      this.sliderItemOffset =
        this.sliderItemsToShow[1].offsetLeft -
        this.sliderItemsToShow[0].offsetLeft;
      this.updatePagination();
    }
    onPaginationButtonClick(event) {
      event.preventDefault();
      this.slideScrollPosition =
        event.currentTarget.name === "next"
          ? this.scrollLeft + 1 * this.sliderItemOffset
          : this.scrollLeft - 1 * this.sliderItemOffset;
      this.scrollTo({
        left: this.slideScrollPosition,
      });
    }
    updatePagination() {
      if (!this.nextButton) return;

      const previousPage = this.currentPage;
      this.currentPage =
        Math.round(this.scrollLeft / this.sliderItemOffset) + 1;

      if (this.currentPageElement) {
        this.currentPageElement.textContent = this.currentPage;
      }
      if (this.pageTotalElement) {
        this.pageTotalElement.textContent = this.sliderItemsToShow.length;
      }

      if (this.currentPage != previousPage) {
        this.dispatchEvent(
          new CustomEvent("slideChanged", {
            detail: {
              currentPage: this.currentPage,
              currentElement: this.sliderItemsToShow[this.currentPage - 1],
            },
          })
        );
      }

      if (
        this.isSlideVisible(this.sliderItemsToShow[0]) &&
        this.scrollLeft === 0
      ) {
        this.prevButton.setAttribute("disabled", "disabled");
      } else {
        this.prevButton.removeAttribute("disabled");
      }

      if (
        this.isSlideVisible(
          this.sliderItemsToShow[this.sliderItemsToShow.length - 1]
        )
      ) {
        this.nextButton.setAttribute("disabled", "disabled");
      } else {
        this.nextButton.removeAttribute("disabled");
      }
    }
    isSlideVisible(element, offset = 0) {
      const lastVisibleSlide = this.clientWidth + this.scrollLeft - offset;
      return (
        element.offsetLeft + element.clientWidth <= lastVisibleSlide &&
        element.offsetLeft >= this.scrollLeft
      );
    }
  }
  customElements.define("product-slider", ProductSlider);
}

/**
 *  @class
 *  @function ProductForm
 */
if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        this.sticky = this.dataset.sticky;
        this.form = document.getElementById(
          `product-form-${this.dataset.section}`
        );
        this.form.querySelector("[name=id]").disabled = false;
        if (!this.sticky) {
          this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        }
        this.cartNotification = document.querySelector("cart-notification");
        this.body = document.body;

        this.hideErrors = this.dataset.hideErrors === "true";
      }
      onSubmitHandler(evt) {
        evt.preventDefault();
        if (!this.form.reportValidity()) {
          return;
        }
        const submitButtons = document.querySelectorAll(
          ".single-add-to-cart-button"
        );

        submitButtons.forEach((submitButton) => {
          if (submitButton.classList.contains("loading")) return;
          submitButton.setAttribute("aria-disabled", true);
          submitButton.classList.add("loading");
        });

        this.handleErrorMessage();

        const config = {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/javascript",
          },
        };
        let formData = new FormData(this.form);

        formData.append(
          "sections",
          this.getSectionsToRender().map((section) => section.section)
        );
        formData.append("sections_url", window.location.pathname);
        config.body = formData;

        fetch(`${theme.routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              dispatchCustomEvent("product:variant-error", {
                source: "product-form",
                productVariantId: formData.get("id"),
                errors: response.description,
                message: response.message,
              });

              if (response.status === 422) {
                document.documentElement.dispatchEvent(
                  new CustomEvent("cart:refresh", {
                    bubbles: true,
                  })
                );
              }

              this.handleErrorMessage(response.description);
              throw new Error("Form submission failed"); // Ye error catch block me chali jayegi
            }

            this.renderContents(response);

            dispatchCustomEvent("cart:item-added", {
              product: response.hasOwnProperty("items")
                ? response.items[0]
                : response,
            });

            window.formSubmissionError = false; // Error nahi hai
          })
          .catch((e) => {
            console.error(e);
            window.formSubmissionError = true; // Error aya hai
          })
          .finally(() => {
            submitButtons.forEach((submitButton) => {
              submitButton.classList.remove("loading");
              if (!window.formSubmissionError) {
                submitButton.classList.add("added__bag");
                let submitButtonText = submitButton.querySelector(
                  ".single-add-to-cart-button--text"
                );
                submitButtonText.textContent = "Added to Bag";
                document.body.classList.add("added_item");
              }
              submitButton.removeAttribute("aria-disabled");
            });
          });
      }

      getSectionsToRender() {
        return [
          {
            id: "Cart-Drawer",
            section: "cart-drawer",
            selector: ".cart_drawer_main",
          },
          {
            id: "Cart-Drawer",
            section: "cart-drawer",
            selector: "#footer-cart",
          },
          {
            id: "Cart",
            section: "main-cart",
            selector: ".thb-cart-form",
          },
          {
            id: "cart-drawer-toggle",
            section: "cart-bubble",
            selector: ".thb-item-count",
          },
          {
            id: "cart_count",
            section: "cart-bubble-drawer",
            selector: ".thb-itemcount",
          },
        ];
      }
      renderContents(parsedState) {
        this.getSectionsToRender().forEach((section) => {
          if (!document.getElementById(section.id)) {
            return;
          }
          const elementToReplace =
            document
              .getElementById(section.id)
              .querySelector(section.selector) ||
            document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );

          if (section.id === "Cart-Drawer") {
            document.getElementById("Cart-Drawer")?.notesToggle();
            document.getElementById("Cart-Drawer")?.removeProductEvent();
          }
          if (section.id === "Cart" && typeof Cart !== "undefined") {
            new Cart().renderContents(parsedState);
          }
        });

        let product_drawer = document.getElementById("Product-Drawer");
        if (product_drawer && product_drawer.contains(this)) {
          product_drawer
            .querySelector(".product-quick-images--container")
            .classList.remove("active");
          document.body.classList.remove("open-quick-view");
          setTimeout(() => {
            document
              .querySelectorAll(".single-add-to-cart-button")
              .forEach((submitButton) => {
                submitButton.classList.remove("added__bag");
                let submitButtonText = submitButton.querySelector(
                  ".single-add-to-cart-button--text"
                );
                submitButtonText.textContent = "Add to Bag";
                document.body.classList.remove("added_item");
              });
          }, 2000);
          if (window.innerWidth < 1069) {
            product_drawer.classList.remove("active");
            if (document.getElementById("Cart-Drawer")) {
              document.getElementById("Cart-Drawer").classList.add("active");
              document.body.classList.add("open-cart");
              document
                .getElementById("Cart-Drawer")
                .querySelector(".product-recommendations--full")
                .classList.add("active");
              dispatchCustomEvent("cart-drawer:open");
            }
          } else {
            product_drawer
              .querySelector(".product-quick-images--container")
              .addEventListener("transitionend", function () {
                product_drawer.classList.remove("active");
                if (document.getElementById("Cart-Drawer")) {
                  document
                    .getElementById("Cart-Drawer")
                    .classList.add("active");
                  document.body.classList.add("open-cart");
                  document
                    .getElementById("Cart-Drawer")
                    .querySelector(".product-recommendations--full")
                    .classList.add("active");
                  dispatchCustomEvent("cart-drawer:open");
                }
              });
          }

          if (!document.getElementById("Cart-Drawer")) {
            document.body.classList.remove("open-cc");
          }
        } else if (document.getElementById("Cart-Drawer")) {
          setTimeout(() => {
            // document.body.classList.add('open-cc');
            //document.body.classList.add('open-cart');
            //document.getElementById('Cart-Drawer').classList.add('active');
            dispatchCustomEvent("cart-drawer:open");
            document
              .querySelectorAll(".single-add-to-cart-button")
              .forEach((submitButton) => {
                submitButton.classList.remove("added__bag");
                let submitButtonText = submitButton.querySelector(
                  ".single-add-to-cart-button--text"
                );
                submitButtonText.textContent = "Add to Bag";
                document.body.classList.remove("added_item");
              });
          }, 2000);
        }
        this.updateCartCountClass();
      }

      getSectionInnerHTML(html, selector = ".shopify-section") {
        return new DOMParser()
          .parseFromString(html, "text/html")
          .querySelector(selector).innerHTML;
      }
      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
      updateCartCountClass() {
        const cartCountEl = document.querySelector(".thb-item-count");
        if (!cartCountEl) return;
        const count = parseInt(cartCountEl.textContent, 10);
        if (isNaN(count) || count === 0) {
          cartCountEl.classList.remove("active");
        } else {
          cartCountEl.classList.add("active");
        }
      }
    }
  );
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const productForm = document.querySelector("product-form");
    productForm?.updateCartCountClass?.();
    const countEl = document.querySelector(".thb-item-count");
    if (countEl) {
      const observer = new MutationObserver(() => {
        productForm?.updateCartCountClass?.();
      });
      observer.observe(countEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }, 100);
});
document.addEventListener("cart:refresh", () => {
  const productForm = document.querySelector("product-form");
  productForm?.updateCartCountClass?.();
});
document.addEventListener("cart:item-removed", () => {
  const productForm = document.querySelector("product-form");
  productForm?.updateCartCountClass?.();
});

/**
 *  @class
 *  @function ProductAddToCartSticky
 */
if (!customElements.get("product-add-to-cart-sticky")) {
  class ProductAddToCartSticky extends HTMLElement {
    constructor() {
      super();

      this.animations_enabled =
        document.body.classList.contains("animations-true") &&
        typeof gsap !== "undefined";
    }
    connectedCallback() {
      this.setupObservers();
      this.setupToggle();
    }
    setupToggle() {
      const AddStickyButton = this.querySelector("#AddToCartSticky");

      // button = this.querySelector('.product-add-to-cart-sticky--inner'),
      // content = this.querySelector('.product-add-to-cart-sticky--content');

      // if (this.animations_enabled) {
      //   const tl = gsap.timeline({
      //     reversed: true,
      //     paused: true,
      //     onStart: () => {
      //       // button.classList.add('sticky-open');
      //     },
      //     onReverseComplete: () => {
      //       // button.classList.remove('sticky-open');
      //     }
      //   });

      //   tl
      //     .set(content, {
      //       display: 'block',
      //       height: 'auto'
      //     }, 'start')
      //     .from(content, {
      //       // height: 0,
      //       duration: 0.25
      //     }, 'start+=0.001');

      //   // button.addEventListener('click', function () {
      //   //   tl.reversed() ? tl.play() : tl.reverse();

      //   //   return false;
      //   // });
      //   AddStickyButton.addEventListener('click', function () {
      //     // tl.reversed() ? tl.play() : tl.reverse();

      //     // return false;
      //   });
      // } else {
      //   // button.addEventListener('click', function () {
      //   //   content.classList.toggle('active');
      //   //   return false;
      //   // });

      // }
      AddStickyButton.addEventListener("click", function () {
        // tl.reversed() ? tl.play() : tl.reverse();
        // return false;
      });
      AddStickyButton.addEventListener("click", () => {
        const form = document.getElementById(
          `product-form-${this.dataset.section}`
        );
        if (!form) return;

        // Calculate position 15px from bottom of viewport
        const viewportHeight = window.innerHeight;
        const formRect = form.getBoundingClientRect();
        const scrollPosition =
          window.scrollY +
          formRect.top -
          (viewportHeight - formRect.height - 15);

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
        document
          .querySelector(".variations .size_variant")
          .classList.add("active");
      });
    }
    setupObservers() {
      let _this = this,
        observer = new IntersectionObserver(
          function (entries) {
            entries.forEach((entry) => {
              //    if(entry.target == productBox){
              // let boundingRect = productBox.getBoundingClientRect()
              //     const scrolledPastY =   window.scrollY > boundingRect.top + boundingRect.height;

              //    if(entry.intersectionRatio == 0 && scrolledPastY){
              //      _this.classList.remove("sticky--visible");
              //    }
              //      else{
              //         _this.classList.add("sticky--visible");
              //      }
              //    }

              if (entry.target === productslider) {
                let boundingRectY = productslider.getBoundingClientRect();
                let distanceFromBottom = (
                  window.innerHeight -
                  boundingRectY.bottom +
                  10
                ).toFixed(2);

                // if (entry.intersectionRatio > 0) {
                //   _this.classList.add("product-over");
                //   _this.style.setProperty(
                //     "--bottom",
                //     `${distanceFromBottom}px`
                //   );
                // } else  {
                //   _this.classList.remove("product-over");
                //     _this.style.removeProperty("--bottom");
                // }
              }

              if (entry.target === form) {
                let boundingRect = form.getBoundingClientRect();

                const scrolledPast =
                  window.scrollY > boundingRect.top + boundingRect.height;

                _this.formPassed =
                  entry.intersectionRatio <1 && scrolledPast;

                if (entry.intersectionRatio === 1) {
                  _this.classList.remove("sticky--visible");
                  _this.classList.add("form-visible");
                  form.style.visibility = "visible";
                    _this.style.top = '40px'
                } else if (entry.intersectionRatio >= 0 || _this.formPassed) {
                  _this.classList.add("sticky--visible");
                  _this.classList.remove("form-visible");

                  form.style.visibility = "hidden";
                        _this.removeAttribute('style')
                }

                _this.classList.toggle("sticky-top", _this.formPassed);
              }

              // if (entry.target == productrecommended) {
              //   let boundingRectProduct =
              //     productrecommended.getBoundingClientRect();

              //   const scrolledPastProduct =
              //     window.scrollY >
              //     boundingRectProduct.top + boundingRectProduct.height;

              //   if (entry.intersectionRatio === 1) {
              //     // _this.classList.remove("sticky--visible");
              //   }
              // }
              if (entry.target == footer) {
                console.log("footer intersection", entry.intersectionRatio)
                if (entry.intersectionRatio ===1) {
                  _this.classList.remove("sticky--visible");
                }
              }
            });
          },
          {
            threshold: [0, 1],
             rootMargin:`-60px 0px 13px 0px`
          }
        ),
        form = document.getElementById(`product-form-${this.dataset.section}`),

        footer = document.querySelector("#footer .footer-top"),
        productslider = document.getElementById("Product-Slider");

      _this.formPassed = false;

      _this.inProductBox = false;
      observer.observe(form);
      observer.observe(productslider);
      observer.observe(footer);
      // observer.observe(productrecommended);

      function setPositionBottom() {
        //       let boundingRectForm = productslider.getBoundingClientRect();

        //                 const scrolledPastBox =  (boundingRectForm.top +  boundingRectForm.height  - 115);
        // console.log("console box",scrolledPastBox, window.scrollY)
        //         if(scrolledPastBox < 0){
        //              _this.classList.add("sticky-top" );
        //         }
        let boundingRectY = productslider.getBoundingClientRect();
        let position_top = boundingRectY.top;

        if (position_top > 60) {
          _this.classList.add("product-over");
        } else {
          _this.classList.remove("product-over");
        }

        let distanceFromBottom = (
          window.innerHeight -
          boundingRectY.bottom +
          - 15
        ).toFixed(2);

        _this.style.setProperty("--bottom", `${distanceFromBottom}px`);
      }
      window.addEventListener("load", () => {
        setPositionBottom();
      });
      window.addEventListener("scroll", () => {
        setPositionBottom();
      });
    }
  }

  customElements.define("product-add-to-cart-sticky", ProductAddToCartSticky);
}

if (typeof addIdToRecentlyViewed !== "undefined") {
  addIdToRecentlyViewed();
}
