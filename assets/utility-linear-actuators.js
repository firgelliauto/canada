    var strokeImages110lb = {
        "2": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/002_FA-U-110-12-2_Drawing-1.png?v=1658946981", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/002_FA-U-110-12-2_Drawing.pdf?v=1658945188" },
        "4": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/004_FA-U-110-12-4_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/004_FA-U-110-12-4_Drawing.pdf?v=1658945188" },
        "6": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/006_FA-U-110-12-6_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/006_FA-U-110-12-6_Drawing.pdf?v=1658945188" },
        "8": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/008_FA-U-110-12-8_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/008_FA-U-110-12-8_Drawing.pdf?v=1658945188" },
        "10": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/010_FA-U-110-12-10_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/010_FA-U-110-12-10_Drawing.pdf?v=1658945188" },
        "12": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/012_FA-U-110-12-12_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/012_FA-U-110-12-12_Drawing.pdf?v=1658945188" },
    };

    var strokeImages330lb = {
        "2": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/FA-U-330-12-2.jpg?v=1658946083", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/001_FA-U-330-12-2_Drawing.pdf?v=1658945188" },
        "4": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/003_FA-U-330-12-4_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/003_FA-U-330-12-4_Drawing.pdf?v=1658945188" },
        "6": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/005_FA-U-330-12-6_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/005_FA-U-330-12-6_Drawing.pdf?v=1658945188" },
        "8": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/007_FA-U-330-12-8_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/007_FA-U-330-12-8_Drawing.pdf?v=1658945188" },
        "10": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/009_FA-U-330-12-10_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/009_FA-U-330-12-10_Drawing.pdf?v=1658945188" },
        "12": { img: "https://cdn.shopify.com/s/files/1/0615/2193/files/011_FA-U-330-12-12_Drawing-1.png?v=1658948174", link: "https://cdn.shopify.com/s/files/1/0615/2193/files/011_FA-U-330-12-12_Drawing.pdf?v=1658945188" },
    };


  jQuery(document).ready(function ($) {
    // Image handling
    const strokeSelector = document.getElementById("strokeSelector");
    const forceSelector = document.getElementById("forceSelector");
    const strokeImage = document.getElementById("strokeImage");
    const imageLink = document.getElementById("imageLink");

    function updateImage() {
      const stroke = strokeSelector?.value;
      const force = forceSelector?.value;
    
      let selectedMap = null;
      selectedMap = force === "110" ? strokeImages110lb : strokeImages330lb;

      if (selectedMap && selectedMap[stroke]) {
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
        preloadImages(strokeImages110lb);
        preloadImages(strokeImages330lb);
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

    // MutationObserver to track dynamic elements
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

