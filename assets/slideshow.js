/**
 *  @class
 *  @function SlideShow
 */
if (!customElements.get('slide-show')) {
  class SlideShow extends HTMLElement {
    constructor() {
      super();
      const slideshow = this,
        dataset = slideshow.dataset;

      let dots = dataset.dots === 'true',
      slideshow_slides = Array.from(slideshow.querySelectorAll('.carousel__slide')),
      autoplay = dataset.autoplay == 'false' ? false : parseInt(dataset.autoplay, 10),
      align = window.innerWidth <= 768 ? "center" : dataset.align == "center" ? "center" : "left",
      fade = dataset.fade == 'true' ? true : false,
      prev_button = slideshow.querySelector('.flickity-prev'),
      next_button = slideshow.querySelector('.flickity-next'),
      custom_dots = slideshow.querySelector('.flickity-page-dots'),
      progress_bar = slideshow.parentNode.querySelector('.flickity-progress--bar'),
      animations = [],
      rightToLeft = document.dir === 'rtl',
      animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';

      if (slideshow_slides.length < 1) return;
      const args = {
        wrapAround: true,
        //freeScroll:true,
        cellAlign: align,
        pageDots: false,
        contain: true,
        fade: fade,
        loop: true,
        autoPlay: autoplay,
        rightToLeft: rightToLeft,
        prevNextButtons: false,
        cellSelector: '.carousel__slide',
        on: {}
      };


      if (slideshow.classList.contains('image-with-text-slideshow__image')) {
        let main_slideshow = slideshow.parentNode.querySelector('.image-with-text-slideshow__content'),
          image_slideshow_slides = slideshow.querySelectorAll('.image-with-text-slideshow__image-media');
        args.draggable = false;
        args.asNavFor = main_slideshow;

        if (image_slideshow_slides.length) {
          if (image_slideshow_slides[0].classList.contains('desktop-height-auto')) {
            args.adaptiveHeight = true;
          }
        }
      }
      if (slideshow.classList.contains('customer-reviews__image')) {
        let main_slideshow = slideshow.parentNode.querySelector('.customer-reviews__content');
        args.draggable = false;
        args.asNavFor = main_slideshow;
      }
      if (slideshow.classList.contains('image-with-text-slideshow__content') ||
        slideshow.classList.contains('testimonials__carousel') ||
        slideshow.classList.contains('customer-reviews__content') ||
        slideshow.classList.contains('customer-reviews__image')) {
        args.adaptiveHeight = true;
      }
      if (slideshow.classList.contains('custom-dots')) {

        if (animations_enabled && slideshow.classList.contains('main-slideshow')) {
          this.prepareAnimations(slideshow, animations);
        }
        args.pauseAutoPlayOnHover = false;

        args.on = {
          staticClick: function () {
            this.unpausePlayer();
          },
          ready: function () {
            let flkty = this;
            // Animations.
            if (animations_enabled && slideshow.classList.contains('main-slideshow')) {
              slideshow.animateSlides(0, animations);
              gsap.set(slideshow.querySelectorAll('.subheading,.split-text,.button'), { visibility: 'visible' });
            }

            // Custom Dots.
            if (dots && custom_dots) {
              let dots = custom_dots.querySelectorAll('li');
              dots.forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                  flkty.select(i);
                });
              });
              dots[this.selectedIndex].classList.add('is-selected');
            }
            document.fonts.ready.then(function () {
              flkty.resize();
            });

            // Video Support.
            let video_container = flkty.cells[0].element.querySelector('.slideshow__slide-video-bg');
            if (video_container) {
              if (video_container.querySelector('iframe')) {
                video_container.querySelector('iframe').onload = function () {
                  slideshow.videoPlay(video_container);
                };
              } else if (video_container.querySelector('video')) {
                video_container.querySelector('video').onloadstart = function () {
                  slideshow.videoPlay(video_container);
                };
              }
            }
          },
          change: function (index) {
            flkty.cells[0].element.classList.remove('is-initial-selected');
            let previousIndex = fizzyUIUtils.modulo(this.selectedIndex - 1, this.slides.length),
              nextIndex = fizzyUIUtils.modulo(this.selectedIndex + 1, this.slides.length);

            // Animations.
            if (animations_enabled && slideshow.classList.contains('main-slideshow')) {
              setTimeout(() => {
                slideshow.animateReverse(previousIndex, animations);
              }, 300);
              slideshow.animateSlides(index, animations);
            }

            // Custom Dots.
            if (dots && custom_dots) {
              let dots = custom_dots.querySelectorAll('li');
              dots.forEach((dot, i) => {
                dot.classList.remove('is-selected');
              });
              dots[this.selectedIndex].classList.add('is-selected');
            }

            // AutoPlay
            if (autoplay) {
              this.stopPlayer();
              this.playPlayer();
            }

            // Video Support.
            // previous slide
            let video_container_prev = flkty.cells[previousIndex].element.querySelector('.slideshow__slide-video-bg');
            if (video_container_prev) {
              slideshow.videoPause(video_container_prev);
            }
            // next slide
            let video_container_next = flkty.cells[nextIndex].element.querySelector('.slideshow__slide-video-bg');
            if (video_container_next) {
              slideshow.videoPause(video_container_next);
            }
            // current slide
            let video_container = flkty.cells[index].element.querySelector('.slideshow__slide-video-bg');
            if (video_container) {
              if (video_container.querySelector('iframe')) {
                if (video_container.querySelector('iframe').classList.contains('lazyload')) {
                  video_container.querySelector('iframe').addEventListener('lazybeforeunveil', slideshow.videoPlay(video_container));
                  lazySizes.loader.checkElems();
                } else {
                  slideshow.videoPlay(video_container);
                }
              } else if (video_container.querySelector('video')) {
                slideshow.videoPlay(video_container);
              }
            }

          }
        };
      }
      if (slideshow.classList.contains('shoppable-video-reels--carousel')) {
        args.on.staticClick = function (event, pointer, cellElement, cellIndex) {
          if (typeof cellIndex == 'number') {
            flkty.select(cellIndex);
          }
        };
      }
      if (slideshow.classList.contains('main-slideshow')) {
        if (slideshow.classList.contains('desktop-height-image') || slideshow.classList.contains('mobile-height-image')) {
          args.adaptiveHeight = true;
        }
      }
      if (slideshow.classList.contains('products')) {
        args.wrapAround = true;
        args.on.ready = function () {
          var flickity = this;
          if (next_button) {
            window.addEventListener('resize', function () {
              slideshow.centerArrows(flickity, prev_button, next_button);
            });
          }
          window.dispatchEvent(new Event('resize'));
        };
      }
      if (progress_bar) {
        args.wrapAround = true;
        args.on = args.on || {};
        let originalScroll = args.on.scroll || function() {};
        args.on.scroll = function(progress) {
          originalScroll(progress);
          progress = Math.max(0, Math.min(1, progress));
          let totalSlides = this.slides.length;
          let currentSlide = this.selectedIndex + 1;
          let progressWidth = (currentSlide / totalSlides) * 100;          
          progress_bar.style.width = `${progressWidth}%`
          console.log(`Slide: ${currentSlide}/${totalSlides}, Progress: ${progressWidth}%`);
        };
      }

      const flkty = new Flickity(slideshow, args);

      slideshow.dataset.initiated = true;


      if (prev_button) {
        prev_button.addEventListener('click', (event) => {
          flkty.previous();
        });
        prev_button.addEventListener('keyup', (event) => {
          flkty.previous();
        });
        next_button.addEventListener('click', (event) => {
          flkty.next();
        });
        next_button.addEventListener('keyup', (event) => {
          flkty.next();
        });
      }
      if (Shopify.designMode) {
        slideshow.addEventListener('shopify:block:select', (event) => {
          let index = slideshow_slides.indexOf(event.target);
          flkty.select(index);
        });
      }
      // setTimeout(() => {
      //   const currentActive = tabButtons.findIndex(btn => btn.classList.contains('active'));
      //   if (currentActive > -1 && currentActive !== flkty.selectedIndex) {
      //     flkty.select(currentActive, false, true);
      //   }
      // }, 50);
    }
    videoPause(video_container) {
      setTimeout(() => {
        if (video_container.dataset.provider === 'hosted') {
          video_container.querySelector('video').pause();
        } else if (video_container.dataset.provider === 'youtube') {
          video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
            event: "command",
            func: "pauseVideo",
            args: ""
          }), "*");
        } else if (video_container.dataset.provider === 'vimeo') {
          video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
            method: "pause"
          }), "*");
        }
      }, 10);
    }
    videoPlay(video_container) {
      setTimeout(() => {
        if (video_container.dataset.provider === 'hosted') {
          video_container.querySelector('video').play();
        } else if (video_container.dataset.provider === 'youtube') {
          video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
            event: "command",
            func: "playVideo",
            args: ""
          }), "*");
        } else if (video_container.dataset.provider === 'vimeo') {
          video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
            method: "play"
          }), "*");
        }
      }, 10);
    }
    prepareAnimations(slideshow, animations) {
      if (!slideshow.dataset.animationsReady) {
        new SplitText(slideshow.querySelectorAll('.split-text'), {
          type: 'lines, words',
          linesClass: 'line-child'
        });
        slideshow.querySelectorAll('.slideshow__slide').forEach((item, i) => {
          let tl = gsap.timeline({
            paused: true
          }),
            button_offset = 0;

          animations[i] = tl;

          if (slideshow.dataset.transition == 'swipe') {
            tl
              .fromTo(item, {
                clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
              }, {
                duration: 0.7,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
              }, "start");
          }
          tl
            .to(item.querySelector('.slideshow__slide-bg'), {
              duration: 1.5,
              scale: 1
            }, "start");

          if (item.querySelector('.subheading')) {
            tl
              .to(item.querySelector('.subheading'), {
                duration: 0.5,
                autoAlpha: 1
              }, 0);

            button_offset += 0.5;
          }
          if (item.querySelector('.slideshow__slide-content--heading')) {
            let h1_duration = 0.5 + ((item.querySelectorAll('.slideshow__slide-content--heading .line-child div').length - 1) * 0.05);
            tl
              .from(item.querySelectorAll('.slideshow__slide-content--heading .line-child div'), {
                duration: h1_duration,
                yPercent: '100',
                stagger: 0.05
              }, 0);
            button_offset += h1_duration;
          }
          if (item.querySelector('p:not(.subheading)')) {

            let p_duration = 0.5 + ((item.querySelectorAll('p:not(.subheading) .line-child div').length - 1) * 0.02);
            tl
              .from(item.querySelectorAll('p:not(.subheading) .line-child div'), {
                duration: p_duration,
                yPercent: '100',
                stagger: 0.02
              }, 0);
            button_offset += p_duration;
          }
          if (item.querySelectorAll('.button')) {
            tl
              .fromTo(item.querySelectorAll('.button'), {
                y: '100%'
              }, {
                duration: 0.5,
                y: '0%',
                stagger: 0.1,
              }, button_offset * 0.2);
          }
          item.dataset.timeline = tl;
        });
        slideshow.dataset.animationsReady = true;
      }
    }
    animateSlides(i, animations) {
      document.fonts.ready.then(function () {
        animations[i].timeScale(1).restart();
      });
    }
    animateReverse(i, animations) {
      animations[i].timeScale(3).reverse();
    }
    centerArrows(flickity, prev_button, next_button) {
      let first_cell = flickity.cells[0],
        max_height = 0,

        image_height = first_cell.element.querySelector('.product-featured-image').clientHeight;

      flickity.cells.forEach((item, i) => {
        if (item.size.height > max_height) {
          max_height = item.size.height;
        }
      });


      if (max_height > image_height) {
        let difference = (max_height - image_height) / -2;

        prev_button.style.transform = 'translateY(' + difference + 'px)';
        next_button.style.transform = 'translateY(' + difference + 'px)';
      }
    }
  }
  customElements.define('slide-show', SlideShow);
}

if (!customElements.get('slider-component')) {
  class SlideShow extends HTMLElement {
    constructor() {
      super();
      const slideshow = this,
        dataset = slideshow.dataset;

      let dots = dataset.dots === 'true',
        slideshow_slides = Array.from(slideshow.querySelectorAll('.carousel_slide')),
        autoplay = dataset.autoplay == 'false' ? false : Math.max(parseInt(dataset.autoplay, 10), 100),
        align = window.innerWidth <= 768 ? "center" : dataset.align == "center" ? "center" : "left",
        fade = dataset.fade == 'true' ? true : false,
        prev_button = slideshow.querySelector('.flickity-prev'),
        next_button = slideshow.querySelector('.flickity-next'),
        custom_dots = slideshow.querySelector('.flickity-page-dots'),
        progress_bar = slideshow.parentNode.querySelector('.flickity-progress--bar'),
        rightToLeft = document.dir === 'rtl',
        debounce = false,
        debounceTime = 100;

      if (slideshow_slides.length < 1) return;
      const args = {
        wrapAround: true,
        cellAlign: align,
        pageDots: false,
        contain: true,
        fade: fade,
        loop: true,
        autoPlay: autoplay,
        rightToLeft: rightToLeft,
        prevNextButtons: false,
        cellSelector: '.carousel_slide',
        draggable: true,
        on: {}
      };

      if (progress_bar) {
        args.wrapAround = true;
        args.on = args.on || {};
        let originalScroll = args.on.scroll || function () {};
        args.on.scroll = function (progress) {
          originalScroll(progress);
          progress = Math.max(0, Math.min(1, progress));
          let totalSlides = this.slides.length;
          let currentSlide = this.selectedIndex + 1;
          let progressWidth = (currentSlide / totalSlides) * 100;
          progress_bar.style.width = `${progressWidth}%`;
        };
      }

      const flkty = new Flickity(slideshow, args);
      slideshow.dataset.initiated = true;

      if (prev_button) {
        prev_button.addEventListener('click', () => {
          if (debounce) return;
          debounce = true;
          flkty.previous();
          setTimeout(() => debounce = false, debounceTime);
        });
      }

      if (next_button) {
        next_button.addEventListener('click', () => {
          if (debounce) return;
          debounce = true;
          flkty.next();
          setTimeout(() => debounce = false, debounceTime);
        });
      }

      if (Shopify.designMode) {
        slideshow.addEventListener('shopify:block:select', (event) => {
          let index = slideshow_slides.indexOf(event.target);
          flkty.select(index);
        });
      }
    }
  }
  customElements.define('slider-component', SlideShow);
}

if (!customElements.get('tab-component')) {
  class mobileTab extends HTMLElement {
    constructor() {
      super();

      const slideshow = this,
        dataset = slideshow.dataset,
        prevButton = slideshow.querySelector('.flickity-prev'),
        nextButton = slideshow.querySelector('.flickity-next'),
        slides = Array.from(slideshow.querySelectorAll('.carousel')),
        autoplay = dataset.autoplay === 'false' ? false : Math.max(parseInt(dataset.autoplay, 10), 500),
        align = window.innerWidth <= 768 ? "center" : dataset.align === "center" ? "center" : "left",
        fade = dataset.fade === 'true',
        progressBar = slideshow.parentNode.querySelector('.flickity-progress--bar'),
        rightToLeft = document.dir === 'rtl',
        debounceTime = 500;

      if (slides.length < 1) return;

      const flkty = new Flickity(slideshow, {
        wrapAround: true,
        cellAlign: align,
        pageDots: false,
        contain: true,
        fade: fade,
        loop: true,
        autoPlay: autoplay,
        rightToLeft: rightToLeft,
        prevNextButtons: false,
        cellSelector: '.carousel',
        draggable: false,
      });

      const tabButtons = Array.from(document.querySelectorAll('tab-component [data-bs-toggle="tab"]'));
      let debounce = false;
      
      // function triggerCustomLogic(flkty) {
      //   const currentIndex = flkty.selectedIndex;
      //   const targetTab = document.querySelectorAll('.cart_progress_bar .nav-link')[currentIndex];
      //   if (targetTab) {
      //     targetTab.click(); 
      //   }
      //   if (typeof setUnderline === 'function') {
      //     setUnderline();
      //   }
      // }
      document.querySelectorAll('[data-slide]').forEach(function(button) {
        button.addEventListener('click', function() {
          var index = parseInt(this.getAttribute('data-slide'));
          flkty.select(index);
        });
      });
      
      function activateTab(index) {
        if (index < 0 || index >= tabButtons.length) return;
        tabButtons[index].click();
      }

      flkty.on('select', () => {
        activateTab(flkty.selectedIndex);
      });
      tabButtons.forEach((btn, i) => {
        btn.addEventListener('shown.bs.tab', () => {
          flkty.select(i);
        });
      });
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          if (debounce) return;
          debounce = true;
          flkty.previous(true); // wrapAround works
           // triggerCustomLogic(flkty);
          setTimeout(() => debounce = false, debounceTime);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          if (debounce) return;
          debounce = true;
          flkty.next(true);
           // triggerCustomLogic(flkty);
          setTimeout(() => debounce = false, debounceTime);
        });
      }

      // Progress bar
      if (progressBar) {
        flkty.on('scroll', function (progress) {
          progress = Math.max(0, Math.min(1, progress));
          const totalSlides = this.slides.length;
          const currentSlide = this.selectedIndex + 1;
          const progressWidth = (currentSlide / totalSlides) * 100;
          progressBar.style.width = `${progressWidth}%`;
        });
      }

      // Shopify editor sync
      if (Shopify.designMode) {
        slideshow.addEventListener('shopify:block:select', (event) => {
          const index = slides.indexOf(event.target);
          flkty.select(index);
          activateTab(index);
        });
      }
    }
  }
  customElements.define('tab-component', mobileTab);
}

if (!customElements.get('wishlist-component')) {
  class mobileTab extends HTMLElement {
    constructor() {
      super();

      const slideshow = this,
        dataset = slideshow.dataset,
        prevButton = slideshow.querySelector('.flickity-prev'),
        nextButton = slideshow.querySelector('.flickity-next'),
        slides = Array.from(slideshow.querySelectorAll('.carousel')),
        autoplay = dataset.autoplay === 'false' ? false : Math.max(parseInt(dataset.autoplay, 10), 500),
        align = window.innerWidth <= 768 ? "center" : dataset.align === "center" ? "center" : "left",
        fade = dataset.fade === 'true',
        progressBar = slideshow.parentNode.querySelector('.flickity-progress--bar'),
        rightToLeft = document.dir === 'rtl',
        debounceTime = 500;

      if (slides.length < 1) return;

      const flkty = new Flickity(slideshow, {
        wrapAround: true,
        cellAlign: align,
        pageDots: false,
        contain: true,
        fade: fade,
        loop: true,
        autoPlay: autoplay,
        rightToLeft: rightToLeft,
        prevNextButtons: false,
        cellSelector: '.carousel',
        draggable: false,
      });

      const tabButtons = Array.from(document.querySelectorAll('wishlist-component [data-bs-toggle="tab"]'));
      let debounce = false;
      
      // function triggerCustomLogic(flkty) {
      //   const currentIndex = flkty.selectedIndex;
      //   const targetTab = document.querySelectorAll('.cart_progress_bar .nav-link')[currentIndex];
      //   if (targetTab) {
      //     targetTab.click(); 
      //   }
      //   if (typeof setUnderline === 'function') {
      //     setUnderline();
      //   }
      // }
      document.querySelectorAll('[data-slide]').forEach(function(button) {
        button.addEventListener('click', function() {
          var index = parseInt(this.getAttribute('data-slide'));
          flkty.select(index);
        });
      });
      
      function activateTab(index) {
        if (index < 0 || index >= tabButtons.length) return;
        tabButtons[index].click();
      }

      flkty.on('select', () => {
        activateTab(flkty.selectedIndex);
      });
      tabButtons.forEach((btn, i) => {
        btn.addEventListener('shown.bs.tab', () => {
          flkty.select(i);
        });
      });
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          if (debounce) return;
          debounce = true;
          flkty.previous(true); // wrapAround works
           // triggerCustomLogic(flkty);
          setTimeout(() => debounce = false, debounceTime);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          if (debounce) return;
          debounce = true;
          flkty.next(true);
           // triggerCustomLogic(flkty);
          setTimeout(() => debounce = false, debounceTime);
        });
      }

      // Progress bar
      if (progressBar) {
        flkty.on('scroll', function (progress) {
          progress = Math.max(0, Math.min(1, progress));
          const totalSlides = this.slides.length;
          const currentSlide = this.selectedIndex + 1;
          const progressWidth = (currentSlide / totalSlides) * 100;
          progressBar.style.width = `${progressWidth}%`;
        });
      }

      // Shopify editor sync
      if (Shopify.designMode) {
        slideshow.addEventListener('shopify:block:select', (event) => {
          const index = slides.indexOf(event.target);
          flkty.select(index);
          activateTab(index);
        });
      }
    }
  }
  customElements.define('wishlist-component', mobileTab);
}