/**
 *  @class
 *  @function FacetsToggle
 */

document.querySelectorAll(".subcollection-list .dropmenuoption").forEach((menuOption) => {
  menuOption.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector("#subcollection_dropdown_val").innerHTML = "All";
    const urlpath = new URL(e.currentTarget.href, window.location.origin);
    const urlhandle = urlpath.pathname;    
    if (urlpath.search) {
      urlpath.search += "&filter.v.availability=1";
    } else {
      urlpath.search = "?filter.v.availability=1";
    }
    document.querySelector(".dropdown-collection").classList.remove("active");
    const section_id = FacetFiltersForm.getSections()[0].section;
    e.renderCollectionList = true;
    const currenturl = `${urlhandle}${urlpath.search}&${section_id}`;
    history.pushState({}, "", urlpath.href);
    FacetFiltersForm.renderSectionFromFetch(currenturl, e);
    let currentTitle = e.currentTarget.querySelector("span");
    if (currentTitle) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector("#current_collection_title").textContent = currentTitle.textContent;
    }
  });
});


// setTimeout(function(){
// setupButtons();
// let activeLength =  $("body").find(".collection-title.active-menu:not([data-menu-options='all'])").length;
//     console.log("activeLength122",activeLength);
//    if(activeLength ==  0){
//       $("body").find('[data-menu-options="all"]').addClass("active-menu");
//    }else{
//       $("body").find('[data-menu-options="all"]').removeClass("active-menu");
//    }
//  let dropVal = $("body").find(".collection-title.active-menu:not([data-menu-options='all']) a").data("val"); 

//    if(dropVal != "All" && dropVal != "all")
//  $("#subcollection_dropdown_val").html(dropVal);
// },1000)

class FacetsToggle {
  constructor() {
    // let applybutton = document.querySelector(".button.mobile-filters-apply");

    // Add functionality to buttons

    // if (applybutton) {
    //   applybutton.addEventListener("click", (e) => {
    //     this.setPaddingProductGrid();
    //   });
    // }
    // this.container = document.getElementById("Facet-Drawer");
    // let button = document.getElementById("Facets-Toggle");
    // if (button) {
    //   button.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     if (window.innerWidth < 749) {
    //       document.getElementsByTagName("body")[0].classList.toggle("open-cc");
    //       document.getElementsByTagName("body")[0].classList.toggle("filter-active");
    //     } else {
    //       document.getElementsByTagName('body')[0].classList.toggle('filter-active');
    //     }
    //     // document.getElementsByTagName('body')[0].classList.toggle('open-cc');
    //     document.querySelector("#Facets-Toggle").classList.toggle("active");
    //     // this.container.classList.toggle("active");
    //     this.container.parentElement.classList.toggle("active");
    //     // this.setPaddingProductGrid();
    //   });
    // }

    document.body.addEventListener("click", function(e) {
      const button = e.target.closest("#Facets-Toggle");
      if (!button) return;
      e.preventDefault();
      const container = document.getElementById("Facet-Drawer");
      if (!container) return;
      if (window.innerWidth < 749) {
        document.body.classList.toggle("open-cc");
        document.body.classList.toggle("filter-active");
      } else {
        document.body.classList.toggle("filter-active");
      }
      button.classList.toggle("active");
      container.parentElement.classList.toggle("active");
    });

    setTimeout(function() {
      window.dispatchEvent(new Event("resize.resize-select"));
    }, 10);

    //Filter Count
    // const countFilter = document.querySelectorAll(
    //   '.facets__mobile_form input[type="checkbox"]:checked'
    // );
    // const countFilterElement = document.querySelector("#applied-filters-count");
    // if (countFilter.length > 0) {
    //   countFilterElement.classList.add("active");
    //   countFilterElement.innerHTML = countFilter.length;
    // } else {
    //   countFilterElement.classList.remove("active");
    // }

    document.body.addEventListener("click", function(e) {
      const sortByBar = e.target.closest(".SortByBar");
      if (!sortByBar) return;
      const parentContainer = document.querySelector(".sort-by-option");
      document.querySelectorAll(".facetfiltersformmobile").forEach(el => el.classList.remove("active"));
      document.querySelectorAll(".collection-meta-size").forEach(el => el.classList.remove("show"));
      document.querySelectorAll(".subcollection_dropdown, .dropdown-collection").forEach(el => el.classList.remove("active"));
      if (document.body.classList.contains("filter-active")) {
        document.body.classList.remove("filter-active");
        const toggle = document.getElementById("Facets-Toggle");
        toggle?.classList.remove("active");
      }
      if (parentContainer) {
        parentContainer.classList.toggle("active");
        setTimeout(() => {
          parentContainer.classList.toggle("active-pointer-events");
        }, 300);
      }
    });

    document
      .querySelectorAll('.sort-by-container input[type="radio"]')
      .forEach(function(radio) {
        radio.addEventListener("click", function() {
          const parentContainer = document.querySelector(".sort-by-option");
          parentContainer.classList.remove("active");
        });
      });

    // Close the dropdown if clicked outside
    document.addEventListener("click", function(event) {
      const parentContainer = document.querySelector(".sort-by-option");
      const dropdownContainer = document.querySelector(".dropdown-collection");
      const dropmenuoption = document.querySelector(".dropbtn");
      const sortByBar = document.querySelector(".SortByBar");
      // if(!dropdownContainer.contains(event.target) && !dropmenuoption.contains(event.target)){
      //   dropdownContainer.classList.remove("active")
      // }
      if (parentContainer && sortByBar) {
        if (
          !parentContainer.contains(event.target) &&
          !sortByBar.contains(event.target)
        ) {
          parentContainer.classList.remove("active");
        }
      }
    });

    const playvideopermotion = document.querySelectorAll(".promotion-column .product-video-permotion ");
    playvideopermotion.forEach((videobtn) => {
      videobtn.addEventListener("click", function(e) {

        const parentContainer = e.currentTarget.closest(".product-video-permotion");
        const videoContainer = parentContainer.querySelector("video");
        const btnPlay = parentContainer.querySelector(".media__poster-button ");
        // Check if the clicked element is the play button
        if (!btnPlay.classList.contains("disable")) {
          btnPlay.classList.add("disable");
          // videoContainer.play();
        } else {
          btnPlay.classList.remove("disable");
          // videoContainer.pause();
        }
      })
    })
    // console.log("event box")
    this.initCollectionFilters();
    this.initCollectionSlider();
    this.initCustomFacetDropdown();
    this.initClickOutsideHandler();
    this.initCollectionSliderWidthCheck();
  }

  initCollectionSliderWidthCheck() {
    const jumpScroll = 150;
    const sliderWrap = document.querySelector(".collection-slider-wrap");
    const wrapper = document.querySelector(".collection-list-menu-wrapper");
    const btnLeft = document.querySelector(".collection-slider-left");
    const btnRight = document.querySelector(".collection-slider-right");

    // Tablet detection function
    const isTablet = () => window.innerWidth >= 768 && window.innerWidth <= 2000;

    // Disable slider when not in tablet mode
    const disableSlider = () => {
      if (btnLeft) btnLeft.style.display = "none";
      if (btnRight) btnRight.style.display = "none";
      if (wrapper) wrapper.scrollLeft = 0;
      if (sliderWrap) sliderWrap.style.width = "100%";
    };

    const updateSlider = () => {
      // Only proceed if in tablet mode
      if (!isTablet()) {
        disableSlider();
        return;
      }

      const titles = document.querySelectorAll(".collection-list-menu-wrapper .collection-title");
      if (!titles.length || !sliderWrap || !wrapper) {
        disableSlider();
        console.log("disable slider")
        return;
      }

      const totalWidth = Array.from(titles).reduce((sum, el, idx) => {
        console.log(`Title ${idx} width:`, el.offsetWidth);
        return sum + el.offsetWidth;
      }, 0);
      const wrapperWidth = wrapper.offsetWidth;
      console.log("total width", totalWidth, wrapperWidth)
      if (totalWidth > wrapperWidth) {
        sliderWrap.style.width = `${totalWidth}px`;
        updateButtonVisibility();
      } else {
        wrapper.scrollLeft = 0;
        sliderWrap.style.width = "100%";
        disableSlider();
      }
    };

    const updateButtonVisibility = () => {
      if (!isTablet() || !sliderWrap || !wrapper) {
        disableSlider();
        return;
      }

      const maxScrollLeft = sliderWrap.scrollWidth - wrapper.offsetWidth;
      if (btnLeft) btnLeft.style.display = wrapper.scrollLeft > 0 ? "block" : "none";
      if (btnRight) btnRight.style.display = wrapper.scrollLeft < maxScrollLeft - 1 ? "block" : "none";
    };

    const scrollLeft = () => {
      if (!isTablet() || !wrapper) return;
      wrapper.scrollBy({
        left: -jumpScroll,
        behavior: "smooth"
      });
      setTimeout(updateButtonVisibility, 300);
    };

    const scrollRight = () => {
      if (!isTablet() || !wrapper) return;
      wrapper.scrollBy({
        left: jumpScroll,
        behavior: "smooth"
      });
      setTimeout(updateButtonVisibility, 300);
    };

    // Initialize event listeners
    btnLeft?.addEventListener("click", scrollLeft);
    btnRight?.addEventListener("click", scrollRight);
    wrapper?.addEventListener("scroll", updateButtonVisibility);

    // Drag Scroll (tablet-only)
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    const handleDragStart = (e) => {
      if (!isTablet()) return;
      isDragging = true;
      wrapper.classList.add("dragging");
      startX = e.pageX || e.touches[0].pageX;
      scrollStart = wrapper.scrollLeft;
    };

    const handleDragMove = (e) => {
      if (!isDragging || !isTablet()) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX);
      wrapper.scrollLeft = scrollStart - walk;
    };

    const handleDragEnd = () => {
      isDragging = false;
      wrapper.classList.remove("dragging");
    };

    if (wrapper) {
      // Mouse events
      wrapper.addEventListener("mousedown", handleDragStart);
      wrapper.addEventListener("mousemove", handleDragMove);
      wrapper.addEventListener("mouseup", handleDragEnd);
      wrapper.addEventListener("mouseleave", handleDragEnd);

      // Touch events
      wrapper.addEventListener("touchstart", handleDragStart);
      wrapper.addEventListener("touchmove", handleDragMove);
      wrapper.addEventListener("touchend", handleDragEnd);
    }

    // Underline effect (tablet-only)
    const underline = document.querySelector(".collection-meta-size .underline");
    const collectionLinks = document.querySelectorAll(".collection-slider-wrap .collection-title .link");
    const resetUnderlineArea = document.querySelector(".collection-slider-wrap");

    const updateUnderlinePosition = (link) => {
      if (!wrapper || !underline) return;

      const linkRect = link.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const offsetX = linkRect.left - wrapperRect.left;

      wrapper.style.setProperty("--underline-width", `${link.offsetWidth}px`);
      wrapper.style.setProperty("--underline-offset-x", `${offsetX}px`);

      // Also update the physical underline position
      const parentMeta = link.closest(".collection-meta-size");
      if (parentMeta) {
        const parentRect = parentMeta.getBoundingClientRect();
        const width = linkRect.width;
        const underlineOffsetX = linkRect.left - parentRect.left;
        underline.style.width = `${width}px`;
        underline.style.transform = `translateX(${underlineOffsetX}px)`;
      }
    };

    if (wrapper && underline && collectionLinks.length > 0) {
      wrapper.addEventListener("mouseover", (event) => {

        const link = event.target.closest(".link");

        if (link) updateUnderlinePosition(link);
      });

      wrapper.addEventListener("mouseleave", () => {
        if (!isTablet()) return;
        wrapper.style.setProperty("--underline-width", "0");
      });

      collectionLinks.forEach((link) => {
        link.addEventListener("mouseenter", (e) => {
          updateUnderlinePosition(e.currentTarget);
        });
      });

      resetUnderlineArea?.addEventListener("mouseleave", () => {
        if (underline) underline.removeAttribute("style");
      });
    }

    // Handle resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isTablet()) {
          updateSlider();
        } else {
          disableSlider();
        }
      }, 100);
    };

    // Initial setup
    if (isTablet()) {
      updateSlider();
    } else {
      disableSlider();
    }

    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);
  }
  initCollectionFilters() {
    // const filterboxwrap = document.querySelector("#FacetFiltersFormMobile .dropdown-toggle-box");
    // if (filterboxwrap) {
    //   filterboxwrap.addEventListener("click", function(e) {
    //     const detailsElement = e.target.closest("details");
    //     if (detailsElement) { // Ensure 'details' exists before modifying attributes
    //       const isActive = detailsElement.getAttribute("data-issizeactive") === "true";
    //       detailsElement.setAttribute("data-issizeactive", isActive ? "false" : "true");
    //     }
    //   });
    // }

    document.body.addEventListener("click", function(e) {
      const toggleBox = e.target.closest("#FacetFiltersFormMobile .dropdown-toggle-box");
      if (!toggleBox) return;
      const detailsElement = e.target.closest("details");
      if (detailsElement) {
        const isActive = detailsElement.getAttribute("data-issizeactive") === "true";
        detailsElement.setAttribute("data-issizeactive", isActive ? "false" : "true");
      }
    });

    document.querySelectorAll(".dropdown-toggleInline .country-btn").forEach((buttonwrap) => {
      buttonwrap.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelectorAll(".dropdown-toggleInline .country-btn").forEach((item) => {
          item.classList.remove("active");
        });
        document.querySelector("#currentSizeOption").textContent = e.currentTarget.dataset.country;
        e.currentTarget.classList.add("active");
        e.currentTarget.closest("details").setAttribute("data-issizeactive", "false");
      });
    });
  }

  initClickOutsideHandler() {
    // window.addEventListener("click", (event) => {
    //   if (
    //     !event.target.closest("facetfiltersformmobile.active") &&

    //     !event.target.matches(".facets-toggle")
    //   ) {

    //     document.getElementById("Facets-Toggle")?.click();
    //   }

    //   // const dropdownContent = event.target.closest(".dropdown-collection");

    //   // if (dropdownContent && dropdownContent.classList.contains("active") ) {
    //   //   document.querySelectorAll(".dropdown-collection").forEach((dropdown) =>
    //   //     dropdown.classList.remove("active")
    //   //   );
    //   // }
    // });
  }
  initCollectionSlider() {

    const collectionSliderWrap = document.querySelector(".collection-slider-wrap");
    if (!collectionSliderWrap) return;

    let collectionMenuSlider = null;

    const initializeSlider = () => {
      const isMobile = window.innerWidth <= 767;
      if (isMobile && collectionMenuSlider) {
        collectionMenuSlider.destroy();
        collectionMenuSlider = null;
      } else if (!isMobile && !collectionMenuSlider) {
        if (document.body.classList.contains('template-collection-custom-collection-rtw-available')) {
          const url = window.location.href;

          if (url.includes('resort-2025') || url.includes('spring-summer-2025-rtw-show')) {
            console.log('URL contains one of the specified strings!');
            const listItems = document.querySelectorAll('#product-grid li.grid__item');
            listItems.forEach(item => {
              item.classList.add('custom-grid-third1'); // Add your custom class

            });
            // You can add your custom logic here
          } else {
            const listItems = document.querySelectorAll('#product-grid li.grid__item');
            listItems.forEach(item => {
              item.classList.add('custom-grid-third'); // Add your custom class

            });
          }


        }
        if (document.body.classList.contains('template-collection-custom-collection-rtw')) {
          const url1 = window.location.href;
          if (url1.includes('resort-2025') || url1.includes('spring-summer-2025-rtw-show')) {
            console.log('URL contains one of the specified strings!');
            const listItems = document.querySelectorAll('#product-grid li.grid__item');
            listItems.forEach(item => {
              item.classList.add('custom-grid-third1'); // Add your custom class

            });
            // You can add your custom logic here
          } else {
            const listItems = document.querySelectorAll('#product-grid li.grid__item');
            listItems.forEach(item => {
              item.classList.add('custom-grid-third'); // Add your custom class

            });
          }

        }
        /*  $(".collection-slider-wrap").slick({
             infinite: true,
             speed: 300,
             slidesToShow: 9
           })
          */

        /*   collectionMenuSlider = new Flickity(collectionSliderWrap, {

               pageDots: false,

               draggable: false,

               contain:true,

               prevNextButtons: true,
            	wrapAround: true,
               arrowShape: { x0: 30, x1: 50, y1: 20, x2: 55, y2: 20, x3: 35 }
             });   */

      }
    };

    initializeSlider();
    window.addEventListener("resize", initializeSlider);

    function updateUnderline(container, underline, activeElement, reduceWidth = false) {
      /* if (!underline || !activeElement) return;
          const rect = activeElement.getBoundingClientRect();
          const parentRect = container.getBoundingClientRect();
          const width = reduceWidth ? Math.max(rect.width - 6, 0) : rect.width; // Reduce width only if required
          const offsetX = rect.left - parentRect.left + (rect.width / 2) - (width / 2);
       underline.style.width = `${width}px`;
        underline.style.transform = `translateX(${offsetX}px)`; */
    }

    //             const menu = document.querySelector(".collection-list-menu-wrapper");
    //       menu.addEventListener("mouseover", (event) => {
    //         if (event.target.classList.contains("link")) {
    //           menu.style.setProperty(
    //             "--underline-width",
    //             `${event.target.offsetWidth}px`
    //           );
    //           menu.style.setProperty(
    //             "--underline-offset-x",
    //             `${event.target.offsetLeft}px`
    //           );
    //         }
    //       });
    //       menu.addEventListener("mouseleave", () =>
    //         menu.style.setProperty("--underline-width", "0")
    //       );

    //     const collectionlist = document.querySelectorAll(".collection-slider-wrap .collection-title .link");
    //     const resetunderline = document.querySelector(".collection-slider-wrap")
    //     collectionlist.forEach((ele)=>{
    //       ele.addEventListener('mouseenter',function(e){
    //         const activeEle = e.currentTarget
    //         const underlineEle = document.querySelector(".collection-meta-size .underline");
    //         const parentRect = activeEle.closest(".collection-meta-size").getBoundingClientRect();
    //          const rect = activeEle.getBoundingClientRect();
    //                   const width = rect.width; // Reduce width only if required
    //           const offsetX = rect.left - parentRect.left + (rect.width / 2) - (width / 2);
    //          underlineEle.style.width = `${width}px`;
    //           underlineEle.style.transform = `translateX(${offsetX}px)`;
    //       })
    //     })

    // resetunderline.addEventListener("mouseleave",function(){
    //        const underlineEle = document.querySelector(".collection-meta-size .underline");
    //   underlineEle.removeAttribute('style');
    // })
  }

  initCustomFacetDropdown() {
    const dropdowncollection = document.querySelectorAll(" .dropdown-collection .dropbtn");
    dropdowncollection.forEach((button) => {
      button.addEventListener("click", (e) => {
        const parentContainer = e.currentTarget.closest(".dropdown-collection");
        if (parentContainer) {
          parentContainer.classList.toggle("active");
        }

        // Remove active from all subcollection dropdowns
        $(".subcollection_dropdown").removeClass("active");
      });
    });
    setTimeout(function() {
      // setupButtons();
      toggleWishlistButton();
      let activeLength = $("body").find(".collection-title.active-menu").length;

      if (activeLength == 0) {
        $("body").find('[data-menu-options="all"]').addClass("active-menu");
      } else {
        $("body").find('[data-menu-options="all"]').removeClass("active-menu");
      }
      let dropVal = $("body").find(".collection-title.active-menu a").data("val");

      // if (dropVal != "All" && dropVal != "all")
      $("#subcollection_dropdown_val").html(dropVal);
    }, 1000)
  }


  // setPaddingProductGrid() {

  //   // if (window.innerWidth > 750) {

  //   //   const sectionHeight = this.container.classList.contains("active")
  //   //     ? this.container.offsetHeight
  //   //     : 0;
  //   //   const productGridSection = document.querySelector(
  //   //     ".facets--bar"
  //   //   );
  //   //   productGridSection.style.setProperty(
  //   //     "--offset-padding-height",
  //   //     `${sectionHeight}px`
  //   //   );
  //   // }
  // }
}

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    // this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      // this.onSubmitHandler(event);
    }, 500);
    document.querySelector(".mobile-filters-apply").addEventListener("click", () => {
      this.onSubmitHandler(event);
      toggleWishlistButton();
      setTimeout(() => {
        toggleWishlistButton();
      }, 200);
    })
    //  this.querySelector('form').addEventListener('input[name="sort_by"]', this.debouncedOnSubmit.bind(this));
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ?
        event.state.searchParams :
        FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);

    };
    window.addEventListener("popstate", onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll(".js-facet-remove").forEach((element) => {
      element.classList.toggle("disabled", disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const container = document.getElementsByClassName("thb-filter-count");
    document
      .getElementById("ProductGridContainer")
      .querySelector(".collection")
      .classList.add("loading");

    for (var item of container) {
      item.classList.add("loading");
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;

      const filterDataUrl = (element) => element.url === url;

      if (FacetFiltersForm.filterData.some(filterDataUrl)) {
        FacetFiltersForm.renderSectionFromCache(filterDataUrl, event);
      } else {
        FacetFiltersForm.renderSectionFromFetch(url, event);
      }
    });
    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {

    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [
          ...FacetFiltersForm.filterData,
          {
            html,
            url,
          },
        ];

        if (event && event.renderCollectionList) {
          FacetFiltersForm.renderCollectionList(html);
        }


        FacetFiltersForm.renderFilterCollapsible(html);

        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderDropdownList(html)
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);

        new FacetsToggle();
      });
  }
  static renderFilterCollapsible(html) {
    const elementBox = new DOMParser()
      .parseFromString(html, "text/html")
      .querySelectorAll("#FacetFiltersFormMobile, #FacetFiltersForm");

    const elementList = Array.from(elementBox);

    elementList.forEach((ele) => {
      const targetElement = document.querySelector(`#${ele.id}`); // Select by ID
      if (targetElement) {
        targetElement.innerHTML = ele.innerHTML; // Update innerHTML
      }
    });
  }
  static renderDropdownList(html) {
    const dropdownList = document.querySelector("[data-js-page-menu]");

    if (dropdownList) {

      document.querySelector(".submenu-list  .dropdown-collection").innerHTML = new DOMParser()
        .parseFromString(html, "text/html")
        .querySelector(".submenu-list  .dropdown-collection").innerHTML;
    }
  }
  static renderCollectionList(html) {


    document.querySelector("#SubCollectionList .collection-slider-wrap").innerHTML = new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("#SubCollectionList .collection-slider-wrap").innerHTML;

  }
  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);

    new FacetsToggle();
  }

  static renderProductGridContainer(html) {


    document.getElementById("ProductGridContainer").innerHTML = new DOMParser().parseFromString(html, "text/html").getElementById("ProductGridContainer").innerHTML;

    let top =
      document.getElementById("SubCollectionList").getBoundingClientRect()
      .top +
      document.documentElement.scrollTop -
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        ),
        10
      ) -
      30;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  static renderProductCount(html) {
    const countHtml = new DOMParser()
      .parseFromString(html, "text/html")
      .getElementById("ProductCount");
    const container = document.getElementsByClassName("thb-filter-count");

    // // Filter count
    // const countFilter = new DOMParser()
    //   .parseFromString(html, "text/html")
    //   .querySelectorAll('.facets__mobile_form input[type="checkbox"]:checked');
    // const countFilterElement = document.querySelector("#applied-filters-count");
    // if (countFilter.length > 0) {
    //   countFilterElement.classList.add("active");
    //   countFilterElement.innerHTML = countFilter.length;
    // } else {
    //   countFilterElement.classList.remove("active");
    // }
    if (countHtml) {
      for (var item of container) {
        item.innerHTML = countHtml.innerHTML;
        item.classList.remove("loading");
      }
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#FacetFiltersForm collapsible-row, #FacetFiltersFormMobile collapsible-row');
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('collapsible-row') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    };


    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      const targetElement = document.querySelector(`collapsible-row[data-index="${element.dataset.index}"]`);
      if (targetElement) {
        targetElement.innerHTML = element.innerHTML;
      }
    });
    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);
    new FacetsToggle();

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('collapsible-row'));
  }




  static renderActiveFacets(html) {

    const activeFacetElementSelectors = [".active-facets"];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = [".mobile-filter-count"];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML =
        html.querySelector(selector).innerHTML;
    });
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector(".facets__selected");
    const sourceElement = source.querySelector(".facets__selected");

    if (sourceElement && targetElement) {
      target.querySelector(".facets__selected").outerHTML =
        source.querySelector(".facets__selected").outerHTML;
    }
  }

  static updateURLHash(searchParams) {

    history.pushState({
        searchParams,
      },
      "",
      `${window.location.pathname}${searchParams && "?".concat(searchParams)}`
    );
  }

  static getSections() {
    return [{
      section: document.getElementById("product-grid").dataset.id,
    }, ];
  }

  onSubmitHandler(event) {

    event.preventDefault();

    const formData = new FormData(document.querySelector("#FacetFiltersFormMobile"));
    const searchParams = new URLSearchParams(formData);
    if (searchParams.get("filter.v.price.gte") === "0.00") {
      searchParams.delete("filter.v.price.gte");
    }
    if (document.querySelector(".price_slider")) {
      if (
        searchParams.get("filter.v.price.lte") ===
        parseFloat(document.querySelector(".price_slider").dataset.max).toFixed(
          2
        )
      ) {
        searchParams.delete("filter.v.price.lte");
      }
    }
    if (location.search.replace("?", "") != searchParams.toString())
      FacetFiltersForm.renderPage(searchParams.toString(), event);

    document.getElementsByTagName('body')[0].classList.remove('filter-active');
    // setTimeout(function(){
    //   let activeLength =  $("body").find(".collection-title.active-menu:not([data-menu-options='all'])").length;
    //       console.log("activeLength1",activeLength);
    //      if(activeLength ==  0)
    //         $("body").find('[data-menu-options="all"]').addClass("active-menu");
    //      else
    //        $("body").find('[data-menu-options="all"]').removeClass("active-menu");

    // },1000)
  }

  onActiveFilterClick(event) {

    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url =
      event.currentTarget.href.indexOf("?") == -1 ?
      "" :
      event.currentTarget.href.slice(
        event.currentTarget.href.indexOf("?") + 1
      );
    FacetFiltersForm.renderPage(url);

  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define("facet-filters-form", FacetFiltersForm);
FacetFiltersForm.setListeners();

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        const form =
          this.closest("facet-filters-form") ||
          document.querySelector("facet-filters-form");
        form.onActiveFilterClick(event);
      });
    });
  }
}

customElements.define("facet-remove", FacetRemove);

/**
 *  @class
 *  @function PriceSlider
 */
class PriceSlider extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    let slider = this.querySelector(".price_slider"),
      amounts = this.querySelector(".price_slider_amount"),
      args = {
        start: [
          parseFloat(slider.dataset.minValue || 0),
          parseFloat(slider.dataset.maxValue || slider.dataset.max),
        ],
        connect: true,
        step: 10,
        direction: document.dir,
        handleAttributes: [{
            "aria-label": "lower"
          },
          {
            "aria-label": "upper"
          },
        ],
        range: {
          min: 0,
          max: parseFloat(slider.dataset.max),
        },
      },
      event = new CustomEvent("input"),
      form =
      this.closest("facet-filters-form") ||
      document.querySelector("facet-filters-form");

    if (slider.classList.contains("noUi-target")) {
      slider.noUiSlider.destroy();
    }
    noUiSlider.create(slider, args);

    slider.noUiSlider.on("update", function(values) {
      amounts.querySelector(".field__input_min").value = values[0];
      amounts.querySelector(".field__input_max").value = values[1];
    });
    slider.noUiSlider.on("change", function(values) {
      form.querySelector("form").dispatchEvent(event);
    });
  }
}
customElements.define("price-slider", PriceSlider);
let facetsToggleInstance;
window.addEventListener("load", () => {
  facetsToggleInstance = new FacetsToggle();
});

// custom code for facet
// function toggleDropdown(e) {

//   const dropdownContent = document.getElementById("dropdown-content");
//   const selectArrow = document.getElementById("select-arrow");

//   if (dropdownContent && selectArrow) {
//     const parentContainer = e.currentTarget.closest(".dropdown-collection")
//     if(!parentContainer.classList.contains('active')){
//       parentContainer.classList.add('active')
//     }
//     else{
//       parentContainer.classList.remove('active')
//     }
//     // dropdownContent.classList.toggle("show");
//     // selectArrow.classList.toggle("open");
//   }

//   // if (typeof facetsToggleInstance !== "undefined" && facetsToggleInstance.container) {
//   //   if (facetsToggleInstance.container.classList.contains("active")) {
//   //     facetsToggleInstance.container.classList.remove("active");
//   //     facetsToggleInstance.setPaddingProductGrid();
//   //   }
//   // }
// }
// const dropdowncollection = document.querySelector(".dropdown-collection .dropbtn");
// dropdowncollection.addEventListener('click',(e)=>toggleDropdown(e))
// // function selectOption(title,handle) {
// //   document.querySelector(".dropbtn").innerText = title;
// //   document.getElementById("dropdown-content").classList.remove("show");
// //   document.getElementById("select-arrow").classList.remove("open");
// // }

// const dropdownmenuOption = document.querySelectorAll(".subcollection-list  .js-link-collection");
// dropdownmenuOption.forEach((menuOption)=>{
//   menuOption.addEventListener('click',function(e){
//     e.preventDefault();
//     const urlpath =new URL(e.currentTarget.href);
//     const urlhandle = urlpath.pathname

//  document.querySelector(".dropbtn span").innerText = e.currentTarget.innerText;
//   document.querySelector(".dropdown-collection").classList.remove("active");
//     const section_id = FacetFiltersForm.getSections()[0].section;

//  const currenturl = `${urlhandle}?${section_id}`
//     FacetFiltersForm.renderSectionFromFetch(currenturl,e)

//     history.pushState({},"",`${urlpath}`)
//   })
// })

// Close the dropdown if the user clicks outside of it
// window.onclick = function (event) {

//     if (!event.target.closest(".facet-drawer.active") && facetsToggleInstance?.container.classList.contains("active") && !event.target.matches(".facets-toggle")){

//  document.getElementById("Facets-Toggle").click()

//     }

//   if (!event.target.matches(".dropbtn")) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     for (var i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains("show")) {
//         openDropdown.classList.remove("show");
//       }
//     }
//     var arrows = document.getElementsByClassName("select-arrow");
//     for (var j = 0; j < arrows.length; j++) {
//       var openArrow = arrows[j];
//       if (openArrow.classList.contains("open")) {
//         openArrow.classList.remove("open");
//       }
//     }
//   }
// };

// const collectionsizefilter = document.querySelector("#FacetFiltersFormMobile collapsible-row[data-index='2']");

// if (collectionsizefilter) {
//   const filterboxwrap = collectionsizefilter.querySelector(".dropdown-toggle");
//   const collectionsizedetails = collectionsizefilter.querySelector("details");

//   if (collectionsizedetails && filterboxwrap) {
//     collectionsizedetails.setAttribute("data-issizeactive", "false");

//     filterboxwrap.addEventListener("click", function () {
//       const isActive = collectionsizedetails.getAttribute("data-issizeactive") === "true";
//       collectionsizedetails.setAttribute("data-issizeactive", isActive ? "false" : "true");
//     });
//   }
// }
// const sizebuttonwrap = document.querySelectorAll(".dropdown-toggleInline .country-btn");
// sizebuttonwrap.forEach((buttonwrap) => {
//   buttonwrap.addEventListener("click", function (e) {
//     e.preventDefault();
//     document.querySelectorAll(".dropdown-toggleInline .country-btn").forEach((item) => {
//   if (item.classList.contains("active")) {
//     item.classList.remove("active");
//   }
// });
//     document.querySelector("#currentSizeOption").textContent= e.currentTarget.dataset.country;
//     e.currentTarget.classList.add("active")

//   });
// });

// Collection slider boxes
// document.addEventListener("DOMContentLoaded", () => {
//   const collectionSliderWrap = document.querySelector(".collection-slider-wrap");
//   if (!collectionSliderWrap) return; // Exit if the element doesn't exist

//   let collectionMenuSlider = null;

//   const initializeSlider = () => {
//     const isMobile = window.innerWidth <= 767;

//     if (isMobile && collectionMenuSlider) {
//       collectionMenuSlider.destroy(); // Destroy slider for mobile
//       collectionMenuSlider = null;
//     } else if (!isMobile && !collectionMenuSlider) {
//       collectionMenuSlider = new Flickity(collectionSliderWrap, {
//         groupCells: 8,
//         pageDots: false,
//         contain: true,
//         prevNextButtons: true,
//         arrowShape: { 
//           x0: 30,
//           x1: 50, y1: 20,
//           x2: 55, y2: 20,
//           x3: 35
//         }
//       });
//     }
//   };

//   initializeSlider(); // Initialize on page load
//   window.addEventListener("resize", initializeSlider); // Adjust on resize
// });

document.addEventListener('click', function(e) {
  const dropdownCollection = document.querySelector('.dropdown-collection');
  const clickedInsideDropdown = dropdownCollection.contains(e.target);

  if (!clickedInsideDropdown && dropdownCollection.classList.contains('active')) {
    dropdownCollection.classList.remove('active');
  }
});

jQuery(document).ready(function($) {
  if (window.location.pathname.indexOf("/collections") === 0) {
    var urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("filter.v.availability")) {
      urlParams.set("filter.v.availability", "1");
      var newUrl = window.location.pathname + '?' + urlParams.toString();
      window.history.replaceState({}, '', newUrl);
      if (typeof Shopify !== 'undefined' && Shopify && Shopify.queryParams) {
        Shopify.queryParams['filter.v.availability'] = 1;
      }
      if ($.isFunction(window.renderCollection)) {
        window.renderCollection();
      } else if (typeof FacetFiltersForm !== 'undefined') {
        const section_id = FacetFiltersForm.getSections()[0].section;
        FacetFiltersForm.renderSectionFromFetch(newUrl, { renderCollectionList: true });
      }
    }
  }
});
