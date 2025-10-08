function toggleWishlistButton() {
  document.querySelectorAll(".st-wishlist-button").forEach(hiddenBtn => {
    hiddenBtn.addEventListener("click", function() {
      if (this.classList.contains("st-is-added")) return;
      const parentCard = this.closest(".product-card, .product-images--thumbnails,.product-grid-container");
      if (!parentCard) return;      
      const visibleWishlistBtn = parentCard.querySelector(".mobile_message");
      if (visibleWishlistBtn) {
        setTimeout(() => {
          visibleWishlistBtn.classList.remove("m-none");
        }, 500);
        setTimeout(() => {
          visibleWishlistBtn.classList.add("m-none");
        }, 2000);
      }
    });
  });
}
toggleWishlistButton();
  
$(document).ready(function () {
  // country flag with number
  var countryFlag = localStorage.getItem("selectedCountry23")?.toLowerCase();
  var selectedCountrynumber = $(".selected-country #country-flag option[data-code='"+countryFlag+"']").val();

  function setPhoneLimitsByCountryCode(code) {
    const option = $(`.country-flag option[value="${code}"]`);
    if (option.length) {
      const maxDigit = option.attr('max-digit');
      const minDigit = option.attr('min-digit');
      $('.checkout_shipping_address_phone').attr('maxlength', maxDigit).attr('minlength', minDigit);
    }
  }  
  if (countryFlag) {
    $('.country-flag-box .country-flag').css( 'background-image', `url('https://hatscripts.github.io/circle-flags/flags/${countryFlag}.svg')`);
    $('.country-flag-box .country-flag').addClass(countryFlag).removeClass('al');
    $('.selected_country-code').text(selectedCountrynumber);
    
    setPhoneLimitsByCountryCode(selectedCountrynumber);
    $('#country-flag').val(selectedCountrynumber);
  }
  
  $(document).on('change', '.country-flag', function() {
    var $this = $(this);
    var select_op = $this.find('option:selected');
    select_op_val = select_op.data('code');
    var select_val = select_op.val();  
    var $selector = $this.parents('.phone-group').find('.country-flag-box .country-flag');
    
    $selector.attr('class', 'country-flag');
    $this.find('option').removeClass('active');
    select_op.addClass('active');
    
    if (select_op_val) {
      $selector.addClass(select_op_val);
      $('.selected_country-code').text(select_val);
      $selector.css('background-image', `url('https://hatscripts.github.io/circle-flags/flags/${select_op_val}.svg')`);
      setPhoneLimitsByCountryCode(select_val);
    }
  });

  $("body").on("click", ".size-dropdown-list li", function() {
    let variantImage = $(this).data("link");
    let variant_id = $("select[data-link-target='"+variantImage+"'] option[data-title='"+$(this).data("variant-title")+"']").val();
    let currentVariant = $(this).data("current-variant");
    $(this).parents(".main_item").css({"opacity":"0.7","pointer-events":"none"});
    $.ajax({
      url:"/cart/add?id="+variant_id,
      success:function(data) {
        $.ajax({
           type: 'POST',
             url:"/cart/update",
             data:{
              updates:{
                 [currentVariant]:0
              }
            },
            dataType: 'json',
           async:false
         });
         $.ajax({
            url:"/cart?section_id=cart-items-ajax",
            success: function(data){
              $("#cart__form__items").html($(data).find("#cart__form_items").html());
              $(".cart__form__items2").html($(data).find("#cart_drawer_items").html());
              $("#wishlist_drawer").html($(data).find("#wishlist_drawer_items").html());
              $(".mini_cart").html($(data).find(".mini_cart").html())
            }
         })
      },
      error: function(data) {
        console.log(data.statusText);
      }
    })
  });
 
  // $("body").on("click", ".remove-product", function(e) {
  //   e.preventDefault();
  //   let _this = $(this);
  //   $.ajax({
  //     url:$(this).attr("href"),
  //     success:function() {
  //       _this.parents(".main_item").slideUp(500, function() {
  //         _this.parents(".main_item").remove();
  //         $.ajax({
  //           url:"/cart?section_id=cart-items-ajax",
  //           success: function(data) {
  //             $("#cart__form__items").html($(data).find("#cart__form_items").html());
  //             $("#cart__form__items2").html($(data).find("#cart_drawer_items").html());
  //             $(".mini_cart").html($(data).find(".mini_cart").html())
  //             // if($(".cart__form_items > li").length == 0) {
  //             //   location.href= "/cart"
  //             // }
  //           }
  //         })
  //       })
  //     }
  //   })
  // })

  $("body").on("click", ".add-to-cart-from-cart", function(e) {
    e.preventDefault();
    let _this = $(this);
    _this.css({"opacity": "0.7","pointer-events": "none"});
    let variant_id = _this.parents(".product-cart-item").find("li[data-info].selected").data("vaiant-id");
    $(this).closest('.product-cart-item').addClass('thb-loading');
    fetch("/cart/add?id=" + variant_id, {
      method: 'GET'
    }).then(res => {
      return res.text();
    })
    .then(myContent => {
      $.ajax({
        url: "/cart?section_id=cart-items-drawer-ajax",
        success: function(data) {
          $("#cart_drawer_inner").html($(data).find("#cart__form_items").html());
          $(".thb-item-count").html($(data).find("#cart__form_items_counter").html());
          $(".cart_drawer_tab .thb-item-count").html("(" + $(data).find("#cart__form_items_counter").html() + ")");
          $("#footer-cart").html($(data).find("#footer_item").html());
          $('.product-cart-item').removeClass('thb-loading');
        }
      });
      _this.parent().find("button").click();
    })
    .catch(error => {
      console.log(error);
    });
  });
});


// cart js

$(document).ready(function () {
  // Populate form fields from localStorage
  $("#checkout_shipping_address_first_name").val(localStorage.getItem("firstname") || "");
  $("#checkout_shipping_address_last_name").val(localStorage.getItem("lastname") || "");
  $("#checkout_email_or_phone").val(localStorage.getItem("email") || "");
  $("#checkout_shipping_address_phone").val(localStorage.getItem("phone") || "");

  $("#checkout_shipping_address_address1").val(localStorage.getItem("shipping_address1") || "");
  $("#checkout_shipping_address_address2").val(localStorage.getItem("shipping_address2") || "");
  $("#checkout_shipping_address_city").val(localStorage.getItem("shipping_city") || "");
  $("#checkout_shipping_address_state").val(localStorage.getItem("shipping_state") || "");
  $("#checkout_shipping_address_postcode").val(localStorage.getItem("shipping_code") || "");
  const shippingcountry = localStorage.getItem("shipping_country") || "";
  if (shippingcountry) {
    $("select.checkout_shipping_address_country option").each(function() {
      if ($(this).text().trim() === shippingcountry) {
        $(this).prop('selected', true);
        return false;
      }
    });
  }
  
  $("#checkout_billing_address_address1").val(localStorage.getItem("billing_address1") || "");
  $("#checkout_billing_address_address2").val(localStorage.getItem("billing_address2") || "");
  $("#checkout_billing_address_city").val(localStorage.getItem("billing_city") || "");
  $("#checkout_billing_address_state").val(localStorage.getItem("billing_state") || "");
  $("#checkout_billing_address_postcode").val(localStorage.getItem("billing_code") || "");
  
  const billingcountry = localStorage.getItem("billing_country") || "";
  if (billingcountry) {
    $("select.checkout_billing_address_country option").each(function() {
      if ($(this).text().trim() === billingcountry) {
        $(this).prop('selected', true);
        return false;
      }
    });
  }
 
  const storedCountryValue = localStorage.getItem("country") || "";
  const $countrySelect = $("select.country-flag");
  $countrySelect.val(storedCountryValue);
  const $selectedOption = $countrySelect.find(`option[value="${storedCountryValue}"]`);

  if ($selectedOption.length) {
    const countryCode = $selectedOption.val(); // e.g., "+213"
    const countryCodeAlpha2 = $selectedOption.data("code"); // e.g., "dz"
    const minDigit = $selectedOption.attr("min-digit");
    const maxDigit = $selectedOption.attr("max-digit");
    $("#checkout_shipping_address_phone").attr("minlength", minDigit).attr("maxlength", maxDigit);
    $(".country-flag-box .country-flag").css("background-image", `url('https://hatscripts.github.io/circle-flags/flags/${countryCodeAlpha2}.svg')`).attr("class", `country-flag ${countryCodeAlpha2}`);
    $(".selected_country-code").text(countryCode);
  }
});
  