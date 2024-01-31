"use strict";var Shopify=Shopify||{};Shopify.optionsMap={},Shopify.updateOptionsInSelector=function(t){switch(t){case 0:var o="root",e=jQuery(".single-option-selector:eq(0)");break;case 1:var o=jQuery(".single-option-selector:eq(0)").val(),e=jQuery(".single-option-selector:eq(1)");break;case 2:var o=jQuery(".single-option-selector:eq(0)").val();o+=" / "+jQuery(".single-option-selector:eq(1)").val();var e=jQuery(".single-option-selector:eq(2)")}var i=e.val();e.empty();for(var n=Shopify.optionsMap[o],a=0;a<n.length;a++){var s=n[a],p=jQuery("<option></option>").val(s).html(s);e.append(p)}jQuery('.swatch[data-option-index="'+t+'"] .swatch-element').each(function(){-1!==jQuery.inArray($(this).attr("data-value"),n)?$(this).removeClass("soldout").show().find(":radio").removeAttr("disabled","disabled").removeAttr("checked"):$(this).addClass("soldout").find(":radio").removeAttr("checked").attr("disabled","disabled")}),-1!==jQuery.inArray(i,n)&&e.val(i),e.trigger("change")},Shopify.linkOptionSelectors=function(t){for(var o=0;o<t.variants.length;o++){var e=t.variants[o];if(e.available){if(Shopify.optionsMap.root=Shopify.optionsMap.root||[],Shopify.optionsMap.root.push(e.option1),Shopify.optionsMap.root=Shopify.uniq(Shopify.optionsMap.root),t.options.length>1){var i=e.option1;Shopify.optionsMap[i]=Shopify.optionsMap[i]||[],Shopify.optionsMap[i].push(e.option2),Shopify.optionsMap[i]=Shopify.uniq(Shopify.optionsMap[i])}if(3===t.options.length){var i=e.option1+" / "+e.option2;Shopify.optionsMap[i]=Shopify.optionsMap[i]||[],Shopify.optionsMap[i].push(e.option3),Shopify.optionsMap[i]=Shopify.uniq(Shopify.optionsMap[i])}}}Shopify.updateOptionsInSelector(0),t.options.length>1&&Shopify.updateOptionsInSelector(1),3===t.options.length&&Shopify.updateOptionsInSelector(2),jQuery(".single-option-selector:eq(0)").change(function(){return Shopify.updateOptionsInSelector(1),3===t.options.length&&Shopify.updateOptionsInSelector(2),!0}),jQuery(".single-option-selector:eq(1)").change(function(){return 3===t.options.length&&Shopify.updateOptionsInSelector(2),!0})},function(t){t(document).ready(function(){t(".swatch :radio").change(function(){var o=jQuery(this).closest(".swatch").attr("data-option-index"),e=jQuery(this).val().replace("&quot;",'"');t(this).closest("form").find(".single-option-selector").eq(o).val(e).trigger("change")}),t(".tabs ul, .social-tabs ul").each(function(){var o,e,i=t(this).find("a");o=i.first().addClass("active"),e=t(o.attr("href")),i.not(":first").each(function(){t(t(this).attr("href")).hide()}),t(this).find("a").click(function(i){return i.preventDefault(),o.removeClass("active"),e.hide(),o=t(this),e=t(t(this).attr("href")),o.addClass("active"),e.show(),!1})}),t(".filter-group:first-child").show().next().show(),t(".has_group_selected").next().show(),t(".swatch-element").on("click",function(){t(this).hasClass("soldout")||t(this).siblings(".swatch-element").removeClass("active"),t(".swatch-element input").each(function(){t(this).prop("checked")?t(this).parent().addClass("active"):t(this).parent().removeClass("active")})}),t(".product-variants input:checked").parent().addClass("active"),t(".collection-container.selected").children("div").each(function(o){var e=t(this).children("a").text();t(this).parents("ul").prev(".filter-menu-value").text(e)}),t(".filter-menu-value").on("click",function(){t(this).parent().siblings().children(".filter-menu-value").next("ul").removeClass("active"),t(this).next("ul").toggleClass("active")})})}(jQuery);