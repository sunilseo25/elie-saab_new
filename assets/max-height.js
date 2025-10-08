if (!customElements.get('max-height')) {
  class MaxHeight extends HTMLElement {
    constructor() {
      super();
      this.content = this.querySelector('.max-height--inner-content');
      this.toggle = this.querySelector('.max-height--toggle');
      this.max = parseInt(this.dataset.max, 10) || 0; // Ensure max is a number

      if (!this.content || !this.toggle) {
        console.warn('MaxHeight: Required elements not found.');
        return;
      }
    }

    connectedCallback() {
      if (!this.toggle) return;

      this.toggle.addEventListener('click', this.onClick.bind(this));
      window.addEventListener('resize', this.checkVisible.bind(this));

      this.checkVisible();
    }

    checkVisible() {
      if (!this.content) return;

      if (this.content.offsetHeight > this.max) {
        this.showToggle();
      } else {
        this.hideToggle();
      }
    }

    showToggle() {
      this.classList.add('max-height--active');
    }

    hideToggle() {
      this.classList.remove('max-height--active');
    }

    onClick() {
      this.classList.toggle('max-height--enabled');
    }
  }

  customElements.define('max-height', MaxHeight);
}
