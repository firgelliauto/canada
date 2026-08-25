(function () {
  if (window.__firgelliAmazonHeader) return;
  window.__firgelliAmazonHeader = true;
  window.__faAmazonHeaderInit = true;

  function headerRoot() {
    return document.querySelector(".fg-header") ||
      document.querySelector("header.bannerHeight, header[role='banner'], header");
  }

  function apply() {
    var header = headerRoot();
    if (!header) return;

    header.classList.remove(
      "fa-header-hide-down",
      "fa-amz-hidden",
      "fa-amz-header--hidden"
    );
    header.style.transform = "none";
    header.style.transition = "none";
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.left = "";
    header.style.right = "";
    header.style.width = "";
    header.style.zIndex = "10000";
    header.style.visibility = "visible";
    header.style.pointerEvents = "auto";
    header.style.display = "";
    header.style.willChange = "auto";

    var style = document.getElementById("firgelli-amazon-header-always");
    if (!style) {
      style = document.createElement("style");
      style.id = "firgelli-amazon-header-always";
      style.textContent = [
        ".fg-header, header.bannerHeight, header[role='banner']{",
        "transform:none!important;transition:none!important;",
        "position:sticky!important;top:0!important;",
        "z-index:10000!important;visibility:visible!important;}",
        ".fg-header.fa-amz-hidden,.fg-header.fa-amz-header--hidden,",
        "header.bannerHeight.fa-header-hide-down{",
        "transform:none!important;visibility:visible!important;}"
      ].join("");
      document.head.appendChild(style);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
