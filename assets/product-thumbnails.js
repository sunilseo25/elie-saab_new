if (!customElements.get('product-slider-thumbnails')) {
  /**
   *  @class
   *  @function ProductSliderThumbnails
   */
  class ProductSliderThumbnails extends HTMLElement {
    constructor() {
      super();

      this.addEventListener('change', this.setupProductGallery);
    }

    connectedCallback() {
      this.product_container = this.closest('.thb-product-detail');
      this.thumbnail_container = this.product_container.querySelector('.product-thumbnail-container');
      this.thumbnail__container = this.product_container.querySelector('.scroll--shadow');
      this.video_containers = this.querySelectorAll('.product-single__media-external-video--play');
      this.progressBar = this.product_container.querySelector('.flickity-progress--bar'); // ✅ Make sure this exists

      this.setOptions();
      this.addNavigationArrows();
      this.init();
    }

    setOptions() {
      this.hide_variants = this.dataset.hideVariants == 'true';
      this.thumbnails = this.thumbnail_container.querySelectorAll('.product-thumbnail');
      this.prev_button = this.querySelector('.flickity-prev');
      this.next_button = this.querySelector('.flickity-next');
      this.options = {
        wrapAround: true,
        pageDots: false,
        contain: true,
        adaptiveHeight: true,
        initialIndex: '.is-initial-selected',
        prevNextButtons: false,
        fade: false,
        cellSelector: '.product-images__slide.is-active'
      };
    }

    addNavigationArrows() {
      // Create previous arrow
      this.prevArrow = document.createElement('button');
      this.prevArrow.className = 'thumbnail-prev thumb-arrow';
      this.prevArrow.innerHTML = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163 94" width="163" height="94"><path fill="#d1d1d0" d="m81.8-0.1l81.3 81.4-12.5 12.4-68.8-68.7-68.7 68.7-12.7-12.4z"/></svg>';
      this.prevArrow.addEventListener('click', () => this.navigateThumbnails('prev'));

      // Create next arrow
      this.nextArrow = document.createElement('button');
      this.nextArrow.className = 'thumbnail-next thumb-arrow';
      this.nextArrow.innerHTML = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177 102" width="177" height="102"> <path class="s0" d="m88.1 101.9l-88.2-88.2 13.6-13.4 74.6 74.4 74.5-74.4 13.7 13.4z" fill="#d1d1d0" /> </svg>';
      this.nextArrow.addEventListener('click', () => this.navigateThumbnails('next'));

      // Append arrows to thumbnail container
      this.thumbnail__container.appendChild(this.prevArrow);
      this.thumbnail__container.appendChild(this.nextArrow);
    }

    navigateThumbnails(direction) {
      if (!this.flkty) return;
      if (direction === 'prev') {
        this.flkty.previous();
      } else {
        this.flkty.next();
      }
    }
    updateProgressBar() {
      if (this.progressBar && this.flkty.cells.length > 0) {
        let progressWidth = (100 / this.flkty.cells.length) * (this.flkty.selectedIndex + 1);
        this.progressBar.style.width = `${progressWidth}%`;
      }
    }
    init() {
      this.flkty = new Flickity(this, this.options);
      this.selectedIndex = this.flkty.selectedIndex;
      this.setupEvents();
      this.setupProductGallery();
      
      if (this.progressBar) {
        this.flkty.on('scroll', () => this.updateProgressBar());
        this.updateProgressBar(); // Ensure it runs on init
      }
    }

    reInit(imageSetIndex) {
      this.flkty.destroy();
      this.setOptions();
      this.flkty = new Flickity(this, this.options);
      this.setupEvents();
      this.selectedIndex = this.flkty.selectedIndex;
    }

    setupEvents() {
      const _this = this;
      if (this.prev_button) {
        this.prev_button.addEventListener('click', () => this.flkty.previous());
      }
      if (this.next_button) {
        this.next_button.addEventListener('click', () => this.flkty.next());
      }

      this.video_containers.forEach((container) => {
        container.querySelector('button').addEventListener('click', function () {
          container.setAttribute('hidden', '');
        });
      });

      this.flkty.on('settle', function (index) {
        _this.selectedIndex = index;
      });

      this.flkty.on('change', (index) => {
        let previous_slide = this.flkty.cells[_this.selectedIndex].element;
        let previous_media = previous_slide.querySelector('.product-single__media');
        let active_thumbs = Array.from(this.thumbnails).filter(element => element.classList.contains('is-active'));
        let active_thumb = active_thumbs[index] ? active_thumbs[index] : active_thumbs[0];

        this.thumbnails.forEach(item => item.classList.remove('is-initial-selected'));
        active_thumb.classList.add('is-initial-selected');

        requestAnimationFrame(() => {
          if (active_thumb.offsetParent === null) return;
          const windowHalfHeight = active_thumb.offsetParent.clientHeight / 2;
          const windowHalfWidth = active_thumb.offsetParent.clientWidth / 2;
          active_thumb.parentElement.scrollTo({
            left: active_thumb.offsetLeft - windowHalfWidth + active_thumb.clientWidth / 2,
            top: active_thumb.offsetTop - windowHalfHeight + active_thumb.clientHeight / 2,
            behavior: 'smooth'
          });
        });

        // Stop previous video
        if (previous_media.classList.contains('product-single__media-external-video')) {
          if (previous_media.dataset.provider === 'youtube') {
            previous_media.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
              event: "command",
              func: "pauseVideo",
              args: ""
            }), "*");
          } else if (previous_media.dataset.provider === 'vimeo') {
            previous_media.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
              method: "pause"
            }), "*");
          }
          previous_media.querySelector('.product-single__media-external-video--play').removeAttribute('hidden');
        } else if (previous_media.classList.contains('product-single__media-native-video')) {
          previous_media.querySelector('video').pause();
        }

         this.updateThumbnailContainerHeight(index)
      });

      setTimeout(() => {
        let active_thumbs = Array.from(this.thumbnails).filter(element => element.clientWidth > 0);
        active_thumbs.forEach((thumbnail, index) => {
          thumbnail.addEventListener('click', () => this.thumbnailClick(thumbnail, index));
        });
      });

    }
updateThumbnailContainerHeight(selectedIndex) {
  let thumbnails = Array.from(this.thumbnails);
  const total =thumbnails.length;
  console.log("Totla",total, selectedIndex)
  let start = Math.max(0, selectedIndex - 1);
  let end = Math.min(total, selectedIndex + 3);

  // If selected is at the start (index 0), include next 2
if (selectedIndex === 0) {
    end = Math.min(total, 4);
  }

  // If selected is at the end (last index), include previous 3
  if (selectedIndex >= total - 1) {
    start = Math.max(0, total - 4);
  }

  const visibleThumbs = thumbnails.slice(start, end);

  const totalHeight = visibleThumbs.reduce((sum, thumb) => {
    return sum + thumb.offsetHeight;
  }, 0);

  const spacing =5; // if thumbnails have margin-bottom
  const finalHeight = totalHeight + spacing * (visibleThumbs.length - 1);

  // this.thumbnail_container.style.setProperty("height", `${finalHeight}px`);
}
    thumbnailClick(thumbnail, index) {
      this.thumbnails.forEach(el => el.classList.remove('is-initial-selected'));
      thumbnail.classList.add('is-initial-selected');
      this.flkty.select(index);
          this.updateThumbnailContainerHeight(index)
    }

    setDraggable(draggable) {
      this.flkty.options.draggable = draggable;
      this.flkty.updateDraggable();
    }

    selectCell(mediaId) {
      this.flkty.selectCell(mediaId);
    }

    setupProductGallery() {
      if (!this.querySelectorAll('.product-single__media-zoom').length) {
        return;
      }
      this.setEventListeners();
    }

    buildItems() {
      this.activeImages = Array.from(this.querySelectorAll('.product-images__slide.is-active .product-single__media-image'));

      return this.activeImages.map((item) => {
        let index = [].indexOf.call(item.parentNode.parentNode.children, item.parentNode);
        let activelink = item.querySelector('.product-single__media-zoom');

        activelink.dataset.index = index;
        return {
          src: activelink.getAttribute('href'),
          msrc: activelink.dataset.msrc,
          w: activelink.dataset.w,
          h: activelink.dataset.h
        };
      });
    }

    setEventListeners() {
      this.links = this.querySelectorAll('.product-single__media-zoom');
      this.pswpElement = document.querySelectorAll('.pswp')[0];
      this.pswpOptions = {
        maxSpreadZoom: 2,
        loop: false,
        allowPanToNext: false,
        closeOnScroll: false,
        showHideOpacity: false,
        arrowKeys: true,
        history: false,
        captionEl: false,
        fullscreenEl: false,
        zoomEl: false,
        shareEl: false,
        counterEl: true,
        arrowEl: true,
        preloaderEl: true
      };

      this.links.forEach((link) => {
        link.addEventListener('click', (e) => this.zoomClick(e, link));
      });
    }

    zoomClick(e, link) {
      this.items = this.buildItems();
      this.pswpOptions.index = parseInt(link.dataset.index, 10);
      if (typeof PhotoSwipe !== 'undefined') {
        let pswp = new PhotoSwipe(this.pswpElement, PhotoSwipeUI_Default, this.items, this.pswpOptions);
        pswp.init();
      }
      e.preventDefault();
    }
  }
  customElements.define('product-slider-thumbnails', ProductSliderThumbnails);
}
