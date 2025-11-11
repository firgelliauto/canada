
var strokeImagesAlllb = {
    "6": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-6.png?v=1689018593", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-6.pdf?v=1689009115" },
    "9": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-9.png?v=1689018600", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-9.pdf?v=1689009116" },
    "12": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-12.png?v=1689018607", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-12.pdf?v=1689009115" },
    "18": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-18.png?v=1689018616", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-18.pdf?v=1689009115" },
    "24": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-24.png", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-24.pdf?v=1689009115" },
    "28": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-28-1.png?v=1689183392", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-BS35-XXX-12v-28.pdf?v=1689183320" }
};

  jQuery(document).ready(function ($) {
  var strokeSelector = document.getElementById("strokeSelector");
  var forceSelector = document.getElementById("forceSelector");
  var strokeImage = document.getElementById("strokeImage");
  var imageLink = document.getElementById("imageLink");

  function updateImage() {
    var stroke = strokeSelector.value;
    var force = forceSelector.value;
    var selectedMap;
    selectedMap = strokeImagesAlllb;
    
    if (selectedMap[stroke]) {
      strokeImage.src = selectedMap[stroke].img;
      imageLink.href = selectedMap[stroke].link;
    }
  }
  function preloadImages(map) {
    Object.values(map).forEach(entry => {
      const img = new Image();
      img.src = entry.img;
    });
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloadImages(strokeImagesAlllb);
    }, 500);
  });
  
  strokeSelector?.addEventListener("change", updateImage);
  forceSelector?.addEventListener("change", updateImage);

  function bindDropdownListeners() {
    const dropdownToggles = document.querySelectorAll(".dropdown-trigger");
    dropdownToggles.forEach(trigger => {
      if (!trigger.dataset.listenerAdded) {
        trigger.dataset.listenerAdded = "true";
        trigger.addEventListener("click", () => {
        const detailsSection = trigger.nextElementSibling;
        if (detailsSection) {
          detailsSection.style.transition = "max-height 0.3s ease, padding 0.3s ease";

          if (detailsSection.classList.contains("open")) {
            // Close
            detailsSection.style.maxHeight = "0px";
            detailsSection.classList.remove("open");
          } else {
            // Open
            detailsSection.style.maxHeight = detailsSection.scrollHeight + "px";
            detailsSection.classList.add("open");

            // If content includes images, re-measure once they load
            detailsSection.querySelectorAll("img").forEach(img => {
              if (!img.complete) {
                img.addEventListener("load", () => {
                  if (detailsSection.classList.contains("open")) {
                    detailsSection.style.maxHeight = detailsSection.scrollHeight + "px";
                  }
                });
              }
            });
          }
        }
      });
      }
    });
  }
  // Product tab toggle
  let lastChecked = document.querySelector("input[type='radio'][name='productTabs']");
  document.querySelectorAll("input[type='radio'][name='productTabs']").forEach(radio => {
    radio.addEventListener("click", function () {
      if (lastChecked === this) {
        this.checked = false;
        lastChecked = null;
      } else {
        lastChecked = this;
      }
    });
  });

    const contentTarget = document.querySelector(".fg-product-additional-content");
    if (contentTarget) {
      const contentObserver = new MutationObserver(() => {
        bindDropdownListeners();
        hideNearestH2Above(".site-wrapper");
        setupYouTubeThumbnails();
      });
      contentObserver.observe(contentTarget, { childList: true, subtree: true });
    }

    // Function to hide nearest <h2> above a target
    function hideNearestH2Above(selector) {
      const element = document.querySelector(selector);
      if (!element) return;

      let h2 = element.previousElementSibling;
      while (h2 && h2.tagName !== "H2") {
        h2 = h2.previousElementSibling;
      }

      if (h2) h2.style.display = "none";
    }

    
    function setupYouTubeThumbnails() {
      var youtube = document.querySelectorAll(".youtubeVideo:not([data-initialized])");
      youtube.forEach(el => {
        el.dataset.initialized = "true";
        el.addEventListener("click", function () {
          var iframe = document.createElement("iframe");
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "");
          iframe.setAttribute("allow", "autoplay");
          iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.dataset.embed + "?rel=0&showinfo=0&autoplay=1");
          this.innerHTML = "";
          this.appendChild(iframe);
        });
      });
    }

    // Initial bindings
    bindDropdownListeners();
    hideNearestH2Above(".site-wrapper");
    setupYouTubeThumbnails();

  });
