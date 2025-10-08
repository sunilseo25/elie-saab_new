/**
 *  @class
 *  @function PredictiveSearch
 */
if (!customElements.get("predictive-search")) {
  class PredictiveSearch extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form.searchform');
      this.button = document.querySelectorAll('.thb-quick-search');
      this.input = this.querySelector('input[type="search"]');
      this.defaultTab = this.querySelector('.side-panel-content--initial');
      this.predictiveSearchResults = this.querySelector('.side-panel-content--has-tabs');

      this.setupEventListeners();
    }

    setupEventListeners() {
      // this.form.addEventListener('submit', this.onFormSubmit.bind(this));
      this.input.addEventListener('input', debounce((event) => {
        this.onChange(event);
      }, 300).bind(this));

      this.button.forEach((item, i) => {
        item.addEventListener('click', (event) => {
          var _this = this;
          event.preventDefault();
          document.getElementsByTagName("body")[0].classList.toggle('open-cc');
          this.classList.toggle('active');
          if (this.classList.contains('active')) {
            setTimeout(function () {
              _this.input.focus({
                preventScroll: true
              });
            }, 100);
            dispatchCustomEvent('search:open');
          }

          return false;
        });
      });
    }

    getQuery() {
      return this.input.value.trim();
    }

    onChange() {
      let height = 0;
      const searchTerm = this.getQuery();
      if (!searchTerm.length) {
        this.predictiveSearchResults.classList.remove('active');
        this.predictiveSearchResults.style.setProperty("--height", `${height}px`);
        return;
      }
      this.predictiveSearchResults.classList.add('active');
      this.getSearchResults(searchTerm);
    }

    onFormSubmit(event) {
      if (!this.getQuery().length) {
        event.preventDefault();
      }
    }

    onFocus() {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) {
        return;
      }
      this.getSearchResults(searchTerm);
    }

    getSearchResults(searchTerm) {
      const queryKey = searchTerm.replace(" ", "-").toLowerCase();
      this.predictiveSearchResults.classList.add('loading');
      fetch(`${theme.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent('resources[type]')}=query&${encodeURIComponent('resources[limit]')}=10&section_id=predictive-search`)
        .then((response) => {
          this.predictiveSearchResults.classList.remove('loading');
          if (!response.ok) {
            var error = new Error(response.status);
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
          this.renderSearchResults(resultsMarkup);
        })
        .catch((error) => {
          throw error;
        });
    }

    renderSearchResults(resultsMarkup) {
      const tempWrapper = document.createElement('div');
      tempWrapper.innerHTML = resultsMarkup;
    
      const hasResults = tempWrapper.querySelectorAll('.predictive-search__item, .predictive-search__result-item').length > 0;
    
      if (hasResults) {
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        setTimeout(() => {
          const height = this.predictiveSearchResults.scrollHeight;
          this.predictiveSearchResults.style.setProperty("--height", `${height}px`);
        }, 0);
      } else {
        // this.predictiveSearchResults.innerHTML = `
        //   <div class="no-results empty-wishlist">No results found.</div>`;
        // this.predictiveSearchResults.style.removeProperty("--height");
      }
    }


    close() {
      this.classList.remove('active');
    }
  }

  customElements.define("predictive-search", PredictiveSearch);
}
