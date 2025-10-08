/**
 *  @class
 *  @function LocalizationForm
 */
if (!customElements.get("localization-form")) {
  class LocalizationForm extends HTMLElement {
    constructor() {
      super();
      this.country = this.dataset.country;
      this.form = this.querySelector("form");
      this.inputs = this.form.querySelectorAll(
        '[name="locale_code"], [name="country_code"]'
      );
      this.searchInputs = this.form.querySelectorAll(
        ".countryInput"
      );
      this.detailsInputs = this.form.querySelectorAll("details summary");
      this.detailsInputs.forEach((summary) => {
        summary.addEventListener("click", this.onClick.bind(this));
      });
      this.form
        .querySelectorAll(".parent-link-back--button")
        .forEach((button) =>
          button.addEventListener("click", this.onCloseButtonClick.bind(this))
        );
      this.debouncedOnSubmit = debounce((event) => {
        this.onSubmitHandler(event);
      }, 200);
      this.inputs.forEach((item) =>
        item.addEventListener("change", this.debouncedOnSubmit.bind(this))
      );
      this.searchInputs.forEach((input) => {
        input.addEventListener("input", () => this.filterItems(input));
      });
    }
    onClick(event) {
      let __event = event;
       setTimeout(function(){
           document.querySelector(".is_currency_selector").removeAttribute("open");
           
       },200)
   /*   var languageOpen = document.querySelector(".sub-footer .customCountryOption .coutnryselector.toggle-option").hasAttribute("open");
     // alert(languageOpen);
      if (languageOpen) {
        setTimeout(function(){
        document.querySelector(".sub-footer .customCountryOption .coutnryselector").removeAttribute("open");
        },200)  
      }
      var mobilelanguageOpen = document.querySelector(".thb-mobile-menu-footer .customCountryOption .coutnryselector.toggle-option").hasAttribute("open");
      if (mobilelanguageOpen) {
         setTimeout(function(){
        document.querySelector(".thb-mobile-menu-footer .customCountryOption .coutnryselector").removeAttribute("open");
        },200)      
      }
      const detailsElement = event.currentTarget.parentNode;
      const isOpen = detailsElement.hasAttribute("open");
      if (isOpen) {
        event.preventDefault();
        detailsElement.removeAttribute("open");
      }

      isOpen ? this.closeDrawer(event) : this.openDrawer(event); */
      //   if(detailsElement.hasAttribute("open")){
      //       detailsElement.removeAttribute("open")
      //   }
      //     else{
      //           this.form.querySelectorAll("details[open]")?.forEach((details) => {
      //   details.removeAttribute('open');
      // });
      //       detailsElement.setAttribute("open","")
      //     }
    }
    onCloseButtonClick(event) {
      event.preventDefault();
      const button = event.currentTarget.closest("details[open]");
      button.removeAttribute("open");
    }
    closeDrawer(event) {}
    openDrawer(event) {
      this.form.querySelectorAll("details[open]")?.forEach((details) => {
        details.removeAttribute("open");
      });
    }
    filterItems(input) {
      const searchTerm = input.value.toLowerCase();
 
      const countryInlines = this.form.querySelectorAll(".country-inline");
      const titleWraps = this.form.querySelectorAll(".title-wrap");
     console.log("filteritems",countryInlines)
      countryInlines.forEach((countryInline) => {
        const label = countryInline.querySelector("label")?.textContent.toLowerCase() || "";
        countryInline.style.display = label.includes(searchTerm)
          ? "block"
          : "none";
         
        console.log("input=>",input);
        if(label.includes(searchTerm))
           countryInline.setAttribute("data-class","is_active");
        else
           countryInline.setAttribute("data-class","");
      });

      // titleWraps.forEach((titleWrap) => {
      //   const parentSection = titleWrap.parentElement;
      //   const hasVisibleChildren = Array.from(
      //     parentSection.querySelectorAll(".country-inline")
      //   ).some((el) => el.style.display !== "none");

      //   titleWrap.style.display = hasVisibleChildren ? "block" : "none";
      // });
    }

    onSubmitHandler(event) {
      if (this.form) this.form.submit();
    }
  }
  customElements.define("localization-form", LocalizationForm);
}
function searchInputForms(inputEvent) {


  // Get the closest parent element with class 'country-options'
  const parentEle = inputEvent.target.closest(".country-options");
  if (!parentEle) return; // Safety check if parent not found

  const searchTerm = inputEvent.target.value.toLowerCase();
  
  const countryInlines = parentEle.querySelectorAll(".country-inline");
  const titleWraps = parentEle.querySelectorAll(".title-wrap");
  const sections = parentEle.querySelectorAll(".country-options > div"); // Assuming sections are direct children
  
  // First hide all country inlines and show matching ones
  countryInlines.forEach((countryInline) => {
    const label = countryInline.querySelector("label")?.textContent?.toLowerCase() || "";
    countryInline.style.display = label.includes(searchTerm) ? "block" : "none";
    if(label.includes(searchTerm))
        countryInline.setAttribute("data-class","is_active");
     else
       countryInline.setAttribute("data-class","");
  });

  // Then handle section visibility based on visible children
  sections.forEach((section) => {

    const sectionTitleWrap = section.querySelector(".title-wrap");
    if (!sectionTitleWrap) return;
    
    const hasVisibleChildren = Array.from(section.querySelectorAll(".country-inline")).some(
      (el) => el.style.display !== "none"
    );
    
    sectionTitleWrap.style.display = hasVisibleChildren ? "block" : "none";
    section.style.display = hasVisibleChildren ? "block" : "none";
  });
}

// Initialize event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const currencyInputs = document.querySelectorAll(".currencyInput");
  currencyInputs.forEach((input) => {
    input.addEventListener("input", searchInputForms);
  });
    const currencyBox = document.querySelectorAll(".is_currency_selector .parent-link-back--button");
  currencyBox.forEach((itembox)=>{
    itembox.addEventListener('click',function(e){
      const currentEle = e.currentTarget.closest("details");
      currentEle.removeAttribute("open");   
    })
  })
});