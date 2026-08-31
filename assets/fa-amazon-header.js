(function () {
  "use strict";
  var header = document.querySelector(".fg-header > header.bannerHeight");
  if (!header) return;

  
  var lastY = window.pageYOffset || 0;
  var pinned = false;
  var hidden = false;
  var ticking = false;

  function yPos() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function uiLocked() {
    if (document.body.classList.contains("uk-offcanvas-page") || document.documentElement.classList.contains("uk-offcanvas-page")) return true;
    if (document.querySelector(".uk-offcanvas.uk-open, .uk-modal.uk-open, .uk-navbar-dropdown.uk-open")) return true;
    if (document.querySelector(".fg-search-form__input:focus, input:focus, textarea:focus")) return true;
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
    header.classList.remove("fa-amz-header--pinned", "fa-amz-header--hidden");
    setSpacer(false);
    pinned = false;
    hidden = false;
  }

  function hide() {
    if (!pinned || hidden) return;
    header.classList.add("fa-amz-header--hidden");
    hidden = true;
  }

  function show() {
    if (!hidden && pinned) return;
    pin();
    header.classList.remove("fa-amz-header--hidden");
    hidden = false;
  }

  function apply() {
    ticking = false;
    var y = yPos();
    if (y <= 0) {
      unpin();
      lastY = 0;
      return;
    }
    if (uiLocked()) {
      lastY = y;
      return;
    }
    if (y > lastY) {
      if (pinned) hide();
    } else if (y < lastY) {
      show();
    }
    lastY = y;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(apply);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    if (pinned) setSpacer(true);
  });
})();
