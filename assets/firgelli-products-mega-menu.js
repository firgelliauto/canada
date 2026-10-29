(function () {
  var ICON_URL = window.FIRGELLI_MEGA_MENU_ICON_URL || "";
  var STATIC_ICON_URLS = window.FIRGELLI_MEGA_MENU_STATIC_ICONS || {};
  var MARKER_ID = "firgelli-products-mega-menu-style";
  var MENU_CLASS = "firgelli-products-mega-menu";
  var INSTALLED_CLASS = "firgelli-products-mega-menu-installed";
  var ICON_MATCHES = {
    actuator: [
      { label: "PREMIUM", href: "/collections/premium-linear-actuators" },
      { label: "ALL LINEAR ACTUATORS", href: "/collections/linear-actuators" },
      { label: "SUPER DUTY", href: "/products/super-duty-actuators" }
    ],
    rotary: [
      { label: "ROTARY ACTUATORS", href: "/collections/rotary-actuators" }
    ],
    control: [
      { label: "MICROCONTROLLERS", href: "/collections/arduino" }
    ],
    bracket: [
      { label: "BRACKETS", href: "/collections/mounting-brackets" }
    ],
    slides: [
      { label: "SLIDE RAILS", href: "/collections/slide-rails" }
    ],
    lift: [
      { label: "TV LIFTS", href: "/collections/tv-lifts" }
    ],
    motor: [
      { label: "ROBOTICS", href: "/collections/robotics" },
      { label: "ROTARY ACTUATORS", href: "/collections/rotary-actuators" }
    ]
  };

  function isDesktop() {
    return window.matchMedia && window.matchMedia("(min-width: 901px)").matches;
  }

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findProductsItem() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a"));
    for (var i = 0; i < links.length; i += 1) {
      if (normalize(links[i].textContent) !== "products") continue;
      var item = links[i].closest("li, .site-nav__item, .menu-item, .nav-item");
      if (item && item.querySelector("ul, .dropdown, .submenu, .site-nav__dropdown")) return item;
    }
    // Fallback: some themes mark the top-level item with an id (e.g. <li id="products">)
    try {
      var el = document.getElementById("products");
      if (el && el.querySelector && el.querySelector("ul, .dropdown, .submenu, .site-nav__dropdown")) return el;
    } catch (e) {}
    return null;
  }

  function iconClass(name) {
    return "firgelli-mega-icon firgelli-mega-icon--" + name;
  }

  function iconHtml(name) {
    return '<span class="' + iconClass(name) + '" data-firgelli-icon="' + name + '"><img alt="" loading="lazy"></span>';
  }

  function link(label, href) {
    return '<a href="' + href + '">' + label + "</a>";
  }

  function section(icon, title, href, links) {
    return [
      '<section class="firgelli-mega-section">',
      '<h3><span class="firgelli-mega-heading-row">' + iconHtml(icon) + '<a class="firgelli-mega-heading" href="' + href + '">' + title + "</a></span></h3>",
      '<div class="firgelli-mega-links">',
      links.join(""),
      "</div>",
      "</section>"
    ].join("");
  }

  function menuHtml() {
    return [
      '<div class="' + MENU_CLASS + '" role="menu" hidden>',
      '<div class="firgelli-mega-column">',
      section("actuator", "Linear Actuators", "/collections/linear-actuators", [
        link("All Linear Actuators", "/collections/linear-actuators"),
        link("Super Duty Actuators", "/products/super-duty-actuators"),
        link("Classic Rod Actuator", "/products/light-duty-rod-actuator"),
        link("Bullet Actuators", "/collections/bullet-actuators"),
        link("Micro Utility Actuator", "/products/micro-utility-actuator"),
        link("Feedback Actuators", "/collections/feedback-actuators"),
        link("Track Actuators", "/collections/track-actuators"),
        link("Industrial Actuator", "/products/industrial-heavy-duty-linear-actuators"),
        link("Column Lifts", "/products/electric-column-lift")
      ]),
      "</div>",
      '<div class="firgelli-mega-column">',
      section("control", "Controls & Electronics", "/collections/actuator-switches-remotes-relays-timers-controllers-power-supplies", [
        link("Actuator Controls", "/collections/actuator-switches-remotes-relays-timers-controllers-power-supplies"),
        link("Switches and Joysticks", "/collections/switches"),
        link("Remote Controls", "/collections/remotes"),
        link("Arduino Controllers", "/collections/arduino"),
        link("Relays", "/collections/controls-relays-remotes"),
        link("Power Supplies", "/collections/linear-actuator-power-supplies")
      ]),
      section("bracket", "Mounting & Accessories", "/collections/brackets", [
        link("Mounting Brackets", "/collections/brackets"),
        link("Actuator Accessories", "/collections/accessories"),
        link("Linear Bearing Slide Rails", "/collections/slide-rails"),
        link("Drawer Slides", "/collections/drawer-slides")
      ]),
      "</div>",
      '<div class="firgelli-mega-column">',
      section("lift", "Lifts & Motion Systems", "/collections/tv-lifts", [
        link("TV Lifts", "/collections/tv-lifts"),
        link("Outdoor TV Lift Cabinets", "/products/outdoor-tv-lift-cabinet"),
        link("Standing Desks", "/collections/desk-lifts")
      ]),
      section("slides", "Bearing Slides", "/collections/slide-rails", [
        link("All Bearing Slides", "/collections/slide-rails")
      ]),
      section("motor", "Motors & Robotic Parts", "/collections/robotics", [
        link("Robotic Parts", "/collections/robotics"),
        link("Micro Motors", "/collections/micro-motors")
      ]),
      "</div>",
      "</div>"
    ].join("");
  }

  function injectStyle() {
    if (document.getElementById(MARKER_ID)) return;
    var style = document.createElement("style");
    style.id = MARKER_ID;
    style.textContent = [
      "." + MENU_CLASS + "{position:absolute;left:50%;top:258%;transform:translateX(-50%);width:min(960px,calc(100vw - 32px));display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:0;background:#fff;border:1px solid #dbe8f5;box-shadow:0 18px 42px rgba(16,52,84,.18);padding:28px;z-index:99999;text-align:left;}",
      "." + MENU_CLASS + "[hidden]{display:none!important;}",
      ".firgelli-mega-column{padding:2px 24px;border-right:1px solid #dbe8f5;}",
      ".firgelli-mega-column:first-child{padding-left:0;}",
      ".firgelli-mega-column:nth-child(3){border-right:0;}",
      ".firgelli-mega-section+.firgelli-mega-section{margin-top:24px;}",
      ".firgelli-mega-section h3{display:block;margin:0 0 12px;color:#173a5e;font-size:14px;line-height:1.2;font-weight:900;text-transform:none;letter-spacing:0;}",".firgelli-mega-heading-row{display:flex!important;align-items:center;gap:10px!important;}",".firgelli-mega-heading-row .firgelli-mega-icon{flex:0 0 38px;margin:0!important;}",".firgelli-mega-section h3 a.firgelli-mega-heading{display:inline!important;width:auto!important;margin:0!important;padding:0!important;color:inherit;text-decoration:none;font:inherit;}",".firgelli-mega-section h3 a.firgelli-mega-heading:hover{color:#0d8fe8;text-decoration:underline;}",
      ".firgelli-mega-links{display:block;padding-left:48px;text-align:left!important;}",
      ".firgelli-mega-links a{display:block!important;width:100%!important;max-width:100%;margin:0!important;padding:6px 0!important;color:#26394d;text-decoration:none;font-size:14px;line-height:1.25;font-weight:400;text-transform:none;letter-spacing:0;text-align:left!important;text-indent:0!important;transform:none!important;}",
      ".firgelli-mega-links a:hover{color:#0d8fe8;text-decoration:underline;}",
      ".firgelli-mega-icon{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:1px solid #92cef8;border-radius:9px;background:#f7fcff;box-shadow:0 2px 8px rgba(13,144,232,.1);overflow:hidden;}",
      ".firgelli-mega-icon img{display:block;width:34px;height:34px;object-fit:contain;opacity:0;transition:opacity .12s ease;}",
      ".firgelli-mega-icon img[src]{opacity:1;}",
      "." + INSTALLED_CLASS + " [data-firgelli-old-products-dropdown='true']{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}",
      "@media(max-width:900px){." + MENU_CLASS + "{display:none!important;}}"
    ].join("");
    document.head.appendChild(style);
  }

  function bestImageSource(img, baseUrl) {
    var src = img.getAttribute("src") || "";
    var srcset = img.getAttribute("srcset") || "";
    if (!src && srcset) src = srcset.split(",").pop().trim().split(/\s+/)[0];
    if (!src) return "";
    try {
      return new URL(src, baseUrl || window.location.href).href;
    } catch (error) {
      return src;
    }
  }

  function isRejectedIconSource(src) {
    return !src || /logo|firgelli-?logo|header|payment|flag|cart/i.test(src);
  }

  function sourceFromCandidate(node, baseUrl) {
    if (!node || !node.querySelector) return "";
    var candidateText = normalize(node.textContent);
    if (candidateText.length > 220) return "";
    if (/login|create account|toll free|search products|resources|contact us|about us|articles|faq/.test(candidateText)) return "";
    var img = node.querySelector("img");
    if (!img) return "";
    var alt = normalize(img.getAttribute("alt"));
    if (/logo|firgelli automations|payment|flag|cart/.test(alt)) return "";
    var src = bestImageSource(img, baseUrl);
    return isRejectedIconSource(src) ? "" : src;
  }

  function linkMatches(anchor, match) {
    var href = anchor.getAttribute("href") || "";
    var text = normalize(anchor.textContent);
    var wantedHref = String(match.href || "").replace(/^https?:\/\/[^/]+/i, "");
    return href.indexOf(wantedHref) !== -1 || text.indexOf(normalize(match.label)) !== -1;
  }

  function findIconSourceByExactText(root, match, baseUrl) {
    var wanted = normalize(match.label);
    var nodes = Array.prototype.slice.call(root.querySelectorAll("a, span, div, p, h2, h3, h4, h5, h6"));
    for (var i = 0; i < nodes.length; i += 1) {
      if (normalize(nodes[i].textContent) !== wanted) continue;
      var node = nodes[i];
      for (var depth = 0; node && depth < 5; depth += 1) {
        var src = sourceFromCandidate(node, baseUrl);
        if (src) return src;
        node = node.parentElement;
      }
    }
    return "";
  }

  function findIconSource(root, matches, baseUrl) {
    var anchors = Array.prototype.slice.call(root.querySelectorAll("a[href]"));
    for (var m = 0; m < matches.length; m += 1) {
      for (var i = 0; i < anchors.length; i += 1) {
        if (!linkMatches(anchors[i], matches[m])) continue;
        var direct = sourceFromCandidate(anchors[i], baseUrl);
        if (direct) return direct;
        var card = anchors[i].closest(".grid__item, .grid-item, .collection-grid-item, .feature-row, .home-category, .homepage-category, .category-card, .image-bar__item, .firgelli-category-card, li, article, div");
        var cardSource = sourceFromCandidate(card, baseUrl);
        if (cardSource) return cardSource;
      }
      var textSource = findIconSourceByExactText(root, matches[m], baseUrl);
      if (textSource) return textSource;
    }
    return "";
  }

  function applyHomepageIcons(root, sourceRoot, baseUrl) {
    Object.keys(ICON_MATCHES).forEach(function (key) {
      var staticSrc = STATIC_ICON_URLS[key] || "";
      if (staticSrc) {
        Array.prototype.slice.call(root.querySelectorAll('[data-firgelli-icon="' + key + '"] img')).forEach(function (img) {
          img.src = staticSrc;
        });
        return;
      }
      var src = findIconSource(sourceRoot, ICON_MATCHES[key], baseUrl);
      if (!src) return;
      Array.prototype.slice.call(root.querySelectorAll('[data-firgelli-icon="' + key + '"] img')).forEach(function (img) {
        img.src = src;
      });
    });
  }

  function loadHomepageIcons(menu) {
    applyHomepageIcons(menu, document, window.location.href);
    if (Object.keys(ICON_MATCHES).every(function (key) {
      var img = menu.querySelector('[data-firgelli-icon="' + key + '"] img[src]');
      return !!img;
    })) return;
    if (!window.fetch || !window.DOMParser) return;
    fetch("/", { credentials: "same-origin" })
      .then(function (response) { return response.ok ? response.text() : ""; })
      .then(function (html) {
        if (!html) return;
        var doc = new DOMParser().parseFromString(html, "text/html");
        applyHomepageIcons(menu, doc, window.location.origin + "/");
      })
      .catch(function () {});
  }

  function install() {
    if (!isDesktop()) return;
    injectStyle();
    var productsItem = findProductsItem();
    if (!productsItem || productsItem.querySelector("." + MENU_CLASS)) return;
    productsItem.classList.add(INSTALLED_CLASS);
    productsItem.style.position = productsItem.style.position || "relative";
    var oldDropdowns = Array.prototype.slice.call(productsItem.children).filter(function (child) {
      return child.tagName && child.tagName.toLowerCase() !== "a" && !child.classList.contains(MENU_CLASS);
    }).concat(Array.prototype.slice.call(productsItem.querySelectorAll("ul, .dropdown, .dropdown-menu, .submenu, .site-nav__dropdown, .mega-menu, .menu-dropdown")));
    oldDropdowns.forEach(function (node) {
      node.setAttribute("data-firgelli-old-products-dropdown", "true");
      node.style.display = "none";
    });
    productsItem.insertAdjacentHTML("beforeend", menuHtml());
    var megaMenu = productsItem.querySelector("." + MENU_CLASS);
    if (megaMenu) {
      loadHomepageIcons(megaMenu);
      // When hovering other top-level nav items, immediately hide our mega menu
      try {
        var topLevel = (productsItem.closest && productsItem.closest('ul')) || document;
        var topItems = Array.prototype.slice.call(topLevel.querySelectorAll('ul.itg_main > li, .itg_main > li, nav.itg--nav li'));
        topItems.forEach(function (item) {
          if (item === productsItem) return;
          if (item.getAttribute('data-firgelli-mega-listener') === 'true') return;
          item.addEventListener('mouseenter', function () {
            if (megaMenu) megaMenu.hidden = true;
          }, { passive: true });
          item.addEventListener('focusin', function () {
            if (megaMenu) megaMenu.hidden = true;
          });
          item.setAttribute('data-firgelli-mega-listener', 'true');
        });
      } catch (e) {}
    }
    // Simple enter/leave show/hide logic (no pointer geometry math)
    var hideTimer = null;
    function showMenu() {
      window.clearTimeout(hideTimer);
      if (megaMenu) megaMenu.hidden = false;
    }
    function hideMenu() {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () {
        if (megaMenu) megaMenu.hidden = true;
      }, 500);
    }

    productsItem.addEventListener("mouseenter", showMenu);
    productsItem.addEventListener("mouseleave", hideMenu);
    productsItem.addEventListener("focusin", showMenu);
    productsItem.addEventListener("focusout", hideMenu);

    if (megaMenu) {
      megaMenu.addEventListener("mouseenter", showMenu);
      megaMenu.addEventListener("mouseleave", hideMenu);
      megaMenu.addEventListener("focusin", showMenu);
      megaMenu.addEventListener("focusout", hideMenu);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }
  window.addEventListener("resize", install);
}());
