(function () {
  "use strict";

  var header = document.querySelector(".fg-header > header.bannerHeight");
  if (!header) return;

  var spacer = document.createElement("div");

  // IMPORTANT: spacer must occupy the header's original position
  header.parentNode.insertBefore(spacer, header);

  var pinned = false;
  var ticking = false;

  function yPos() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function uiLocked() {
    if (
      document.body.classList.contains("uk-offcanvas-page") ||
      document.documentElement.classList.contains("uk-offcanvas-page")
    ) return true;

    if (
      document.querySelector(
        ".uk-offcanvas.uk-open, .uk-modal.uk-open, .uk-navbar-dropdown.uk-open"
      )
    ) return true;

    if (
      document.querySelector(
        ".fg-search-form__input:focus, input:focus, textarea:focus"
      )
    ) return true;

    return false;
  }

  function setSpacer(on) {
    if (on) {
      spacer.style.display = "block";
      spacer.style.height = header.offsetHeight + "px";
    } else {
      spacer.style.display = "none";
      spacer.style.height = "0px";
    }
  }

  function pin() {
    if (pinned) return;

    setSpacer(true);
    header.classList.add("fa-amz-header--pinned");
    pinned = true;
  }

  function unpin() {
    header.classList.remove(
      "fa-amz-header--pinned",
      "fa-amz-header--hidden"
    );

    setSpacer(false);
    pinned = false;
  }

  function apply() {
    ticking = false;

    var y = yPos();

    if (y <= 0) {
      unpin();
      return;
    }

    if (uiLocked()) {
      return;
    }

    pin();
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(apply);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("resize", function () {
    if (pinned) {
      setSpacer(true);
    }
  });
})();