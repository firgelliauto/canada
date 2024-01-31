// product variant callback  

var currencyFormat = $('body').data('curr-format');  
var shopCurrency = $('body').data('curr-code');  
selectCallback = function(variant, selector) {

  var $product = $('#prod-' + selector.product.id);
  $('.var-msg', $product).html('').hide();
  if (variant) {
    if (variant.available) {
      // Selected a valid variant that is available
      // enable buy button
      $('.purchase', $product).removeClass('disabled').removeAttr('disabled');
      
      
    } else {
      // Variant is sold out
      $('.var-msg', $product).html("").fadeIn(200);
      $('.purchase', $product).addClass('disabled').attr('disabled', 'disabled');
    }
   
    // Whether the variant is in stock or not, we can update the prices
     $('.product-price', $product).html(Shopify.formatMoney(variant.price, currencyFormat));          
    if ( variant.compare_at_price > variant.price ) {
      $('.product-compare-price', $product).html(Shopify.formatMoney(variant.compare_at_price, currencyFormat));
    }else{
      $('.product-compare-price', $product).html('');
    }           
  } else {
    // variant doesn't exist.
    $('.var-msg', $product).html("UNAVAILABLE").fadeIn(200);
    $('.purchase', $product).addClass('disabled').attr('disabled', 'disabled');         
  }
     
  // BEGIN SWATCHES
  if (variant) {
    var form = jQuery('#' + selector.domIdPrefix).closest('form');
    for (var i=0,length=variant.options.length; i<length; i++) {
      var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i].replace('"', '&quot;') +'"]');
      if (radioButton.length) {
        radioButton.get(0).checked = true;
      }
    }
  }
  // END SWATCHES         
};   
