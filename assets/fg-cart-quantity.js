(function () {
  'use strict';
  let started = false;
  let cart;
  const desired = new Map();
  const removed = new Set();
  let timer;
  let saving = false;
  let savePromise = Promise.resolve();
  let submitting = false;
  let checkingOut = false;
  const delay = 350;
  function rows() {
    return Array.from(document.querySelectorAll('.fg-cart-table__tr[data-cart-key]'));
  }
  function itemFor(row) {
    return cart.items.find(item => item.key === row.dataset.cartKey);
  }
  function quantity(item) {
    return desired.has(item.key) ? desired.get(item.key) : item.quantity;
  }
  function status(message) {
    const node = document.querySelector('.fg-cart-quantity-status');
    if (!node) return;
    node.textContent = message || '';
    node.hidden = !message;
  }
  function money(cents) {
    return rivets.formatters.money(Math.round(cents), window.Currency?.currentCurrency);
  }
  function bulkRate(amount) {
    return amount >= 50 ? 0.7 : amount >= 11 ? 0.8 : 1;
  }
  function paintPrices() {
    let itemCount = 0;
    let originalDelta = 0;
    let totalDelta = 0;
    let weight = 0;
    cart.items.forEach(item => {
      const nextQuantity = quantity(item);
      const currentQuantity = item.quantity || 1;
      const linePrice = Number(item.line_price ?? item.final_line_price ?? 0);
      const originalLinePrice = Number(item.original_line_price ??
        (item.original_price ?? item.price ?? 0) * item.quantity);
      // Remove the current tier before applying the tier for the selected quantity.
      // Any other existing per-item discount stays in the provisional unit price.
      const beforeBulkUnit = linePrice / currentQuantity / bulkRate(item.quantity);
      const nextLinePrice = nextQuantity === item.quantity ? linePrice :
        Math.round(beforeBulkUnit * nextQuantity * bulkRate(nextQuantity));
      const nextOriginalLinePrice = Math.round(originalLinePrice * nextQuantity / currentQuantity);
      const savings = Math.max(0, nextOriginalLinePrice - nextLinePrice);
      const tier = nextQuantity >= 50 ? 30 : nextQuantity >= 11 ? 20 : 0;
      const serverTitles = (item.discounts || []).map(discount => discount.title).filter(Boolean);
      const discountTitle = desired.has(item.key) ?
        (tier ? tier + '% off when buying at least ' + (tier === 30 ? '50.' : '11.') : '') :
        serverTitles.join(', ');
      itemCount += nextQuantity;
      weight += Number(item.grams || 0) * nextQuantity;
      totalDelta += nextLinePrice - linePrice;
      originalDelta += nextOriginalLinePrice - originalLinePrice;
      const row = rows().find(entry => entry.dataset.cartKey === item.key);
      if (row) {
        row.querySelectorAll('.totalItemPrice, .individualPrice').forEach(price => {
          price.innerHTML = money(nextLinePrice);
        });
        row.querySelectorAll('.fg-cart-unit-original').forEach(price => {
          price.innerHTML = money(originalLinePrice / currentQuantity);
        });
        row.querySelectorAll('.fg-cart-unit-final').forEach(price => {
          price.innerHTML = money(nextQuantity ? nextLinePrice / nextQuantity : originalLinePrice / currentQuantity);
        });
        row.querySelectorAll('.fg-cart-unit-regular').forEach(section => {
          section.hidden = savings > 0;
        });
        row.querySelectorAll('.fg-cart-unit-discount').forEach(section => {
          section.hidden = savings <= 0;
        });
        row.querySelectorAll('.fg-cart-savings').forEach(section => {
          section.hidden = savings <= 0;
          const amount = section.querySelector('.savedAmount var');
          if (amount) amount.innerHTML = money(savings);
        });
        row.querySelectorAll('.fg-cart-server-discounts').forEach(section => {
          section.hidden = !discountTitle;
          const title = section.querySelector('.fg-cart-discount-title');
          if (title) title.textContent = discountTitle || '';
        });
      }
      const summaryRow = Array.from(document.querySelectorAll('.fg-cart-summary-item'))
        .find(entry => entry.dataset.cartKey === item.key);
      if (summaryRow) {
        summaryRow.classList.toggle('itemHidden', nextQuantity === 0);
        const summaryQuantity = summaryRow.querySelector('.fg-cart-summary-quantity');
        if (summaryQuantity) summaryQuantity.textContent = nextQuantity;
      }
    });
    const subtotal = Number(cart.original_total_price || 0) + originalDelta;
    const total = Number(cart.total_price || 0) + totalDelta;
    const discount = Number(cart.total_discount || 0) + originalDelta - totalDelta;
    const weightNode = document.querySelector('.fg-cart-summary-weight');
    if (weightNode) weightNode.textContent = rivets.formatters.weight_to_lb(weight);
    const summary = document.querySelector('.fg-cart-summary');
    if (summary) summary.style.display = itemCount > 0 ? '' : 'none';
    const itemCountNode = document.querySelector('.fg-cart-summary-item-count');
    if (itemCountNode) itemCountNode.textContent = itemCount;
    const emptyRow = document.querySelector('.fg-cart-empty-row');
    if (emptyRow) emptyRow.style.display = itemCount === 0 ? '' : 'none';
    document.querySelectorAll('.js-cart-item-count, .js-cart-item-count_form')
      .forEach(badge => { badge.textContent = itemCount; });
    const subtotalNode = document.getElementById('subtotalPrice');
    const totalNode = document.getElementById('totalPrice');
    const discountNode = document.getElementById('totalDiscount');
    if (subtotalNode) subtotalNode.innerHTML = money(subtotal);
    if (totalNode) totalNode.innerHTML = money(total);
    if (discountNode) discountNode.innerHTML = money(Math.max(0, discount));
    const discountRow = document.querySelector('.fg-cart-total-discount-row');
    if (discountRow) discountRow.style.display = discount > 0 ? '' : 'none';
  }
  function paint(forceInputs) {
    rows().forEach(row => {
      const item = itemFor(row);
      if (!item) return;
      row.classList.toggle('itemHidden', quantity(item) === 0);
      const input = row.querySelector('.js-cart-item-quantity');
      if (!input) return;
      const locked = item.sku === 'FA-MULTI-TOOL';
      const stock = window.firgelliCartMaxById?.[item.id];
      if (Number.isInteger(stock) && stock >= 0) input.setAttribute('max', stock);
      else input.removeAttribute('max');
      input.disabled = locked;
      input.setAttribute('aria-label', 'Quantity for ' + item.title);
      if (forceInputs || document.activeElement !== input || locked) input.value = quantity(item);
      row.querySelectorAll('.js-cart-quanity-toggle').forEach(button => {
        button.hidden = locked;
      });
      const max = input.hasAttribute('max') ? Number(input.getAttribute('max')) : NaN;
      const plus = row.querySelector('.fg-cart-quantity-toggle__plus');
      const atMax = Number.isInteger(max) && max >= 0 && !locked && quantity(item) >= max;
      if (plus) {
        plus.classList.toggle('itemAtMaxQuantity', atMax);
      }
      row.querySelectorAll('.stockWarningMessage, .stockWarningMessageMobile').forEach(warning => {
        if (atMax) warning.textContent = 'We have ' + max + ' of these in stock';
        warning.classList.toggle('stockMessageHidden', !atMax);
      });
    });
    paintPrices();
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => { flush().catch(() => {}); }, delay);
  }
  function setQuantity(item, value, input) {
    if (item.sku === 'FA-MULTI-TOOL' || !Number.isSafeInteger(value) || value < 0) {
      status('Enter a whole number of 0 or more.');
      input.value = quantity(item);
      paint();
      return;
    }
    const max = input.hasAttribute('max') ? Number(input.getAttribute('max')) : NaN;
    if (Number.isInteger(max) && max >= 0 && value > max) {
      value = max;
      input.value = max;
      status('Quantity adjusted to the maximum available: ' + max + '.');
    } else {
      status('');
    }
    if (value === quantity(item)) return;
    desired.set(item.key, value);    paint();
    schedule();
  }
  async function request(url, options) {
    const root = window.Shopify?.routes?.root || '/';
    const response = await fetch(root + url, Object.assign({ credentials: 'same-origin' }, options));
    if (!response.ok) throw new Error('Cart request failed (' + response.status + ')');
    return response.json();
  }
  async function flush() {
    clearTimeout(timer);
    if (saving) return savePromise;
    if (!desired.size) return;
    saving = true;
    savePromise = (async function () {
      try {
        while (desired.size) {
          const updates = {};
          const previousItems = cart.items.slice();
          desired.forEach((value, key) => { updates[key] = value; });
          const verified = await request('cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ updates: updates })
          });
          cart = verified;
          Object.keys(updates).forEach(key => {
            const prior = previousItems.find(item => item.key === key);
            const matchingId = verified.items.filter(item => item.id === prior?.id);
            const current = verified.items.find(item => item.key === key);
            const actual = current?.quantity
              ?? (updates[key] > 0 && matchingId.length === 1 ? matchingId[0].quantity : 0);
            if (desired.get(key) === updates[key]) {
              if (actual !== updates[key]) throw new Error('The cart did not save the requested quantity.');
              desired.delete(key);
            }
          });
          Array.from(desired).forEach(([key, value]) => {
            if (verified.items.some(item => item.key === key)) return;
            const prior = previousItems.find(item => item.key === key);
            const matches = verified.items.filter(item => item.id === prior?.id &&
              JSON.stringify(item.properties || {}) === JSON.stringify(prior?.properties || {}) &&
              item.selling_plan_allocation?.selling_plan?.id === prior?.selling_plan_allocation?.selling_plan?.id);
            if (matches.length === 1) {
              desired.set(matches[0].key, value);
              if (removed.delete(key)) removed.add(matches[0].key);
            } else if (value !== 0 || matches.length) {
              throw new Error('The cart item changed while saving. Please retry.');
            }
            desired.delete(key);
          });          CartJS.cart.update(verified);
          cart = CartJS.cart;
          removed.forEach(key => { if (!cart.items.some(item => item.key === key)) removed.delete(key); });
          paint();
        }
        status('');
      } catch (error) {
        desired.clear();
        removed.clear();
        try {
          cart = await request('cart.js');
        } catch (refreshError) {
          // Keep the last confirmed cart when the connection is unavailable.
        }
        CartJS.cart.update(cart);
        cart = CartJS.cart;
        paint(true);
        status('Your cart could not be updated. Please try again before checkout.');
        throw error;
      } finally {
        saving = false;
      }
    })();
    return savePromise;
  }
  function init() {
    if (started) return;
    started = true;
    cart = CartJS.cart;
    rivets.formatters.weight_to_lb = grams => (grams * 0.00220462).toFixed(CartJS.settings.weightPrecision) + ' lb';
    const form = document.querySelector('.js-cart-form');
    if (!form) return;
    form.style.display = '';
    form.classList.remove('fg-transparent');
    form.classList.add('fg-animated-fade');
    document.querySelector('.js-logo-animate')?.classList.add('fg-display-none');
    document.body.classList.remove('fg-scroll-none');    paint();
    if (desired.size) schedule();
    jQuery(document).on('cart.requestComplete', function () {
      if (saving) return;
      cart = CartJS.cart;      paint();
      if (desired.size) schedule();
    });
    form.addEventListener('click', event => {
      const remove = event.target.closest('.js-cart-remove-line_item');
      if (remove) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const row = remove.closest('.fg-cart-table__tr');
        const item = row && itemFor(row);
        if (!item || removed.has(item.key)) return;
        removed.add(item.key);
        desired.set(item.key, 0);        status('');
        paint();
        flush().catch(() => {});
        return;
      }
      const button = event.target.closest('.fg-cart-quantity-toggle__plus, .fg-cart-quantity-toggle__minus');
      if (!button) return;
      event.preventDefault();
      const row = button.closest('.fg-cart-table__tr');
      const item = row && itemFor(row);
      if (!item || item.sku === 'FA-MULTI-TOOL') return;
      const input = row.querySelector('.js-cart-item-quantity');
      const amount = button.classList.contains('fg-cart-quantity-toggle__plus') ? 1 : -1;
      setQuantity(item, quantity(item) + amount, input);
    }, true);
    form.addEventListener('change', event => {
      const input = event.target.closest('.js-cart-item-quantity');
      if (!input) return;
      const item = itemFor(input.closest('.fg-cart-table__tr'));
      if (!item) return;
      if (!/^\d+$/.test(input.value.trim())) {
        status('Enter a whole number of 0 or more.');
        input.value = quantity(item);
        return;
      }
      setQuantity(item, Number(input.value), input);
    });
    form.addEventListener('input', event => {
      const input = event.target.closest('.js-cart-item-quantity');
      if (!input || !/^\d+$/.test(input.value.trim())) return;
      const item = itemFor(input.closest('.fg-cart-table__tr'));
      if (item) setQuantity(item, Number(input.value), input);
    });
    form.addEventListener('keydown', event => {
      if (event.key === 'Enter' && event.target.matches('.js-cart-item-quantity')) {
        event.preventDefault();
        event.target.blur();
      }
    });
    form.addEventListener('submit', async event => {
      if (submitting) return;
      event.preventDefault();
      if (checkingOut) return;
      const invalid = Array.from(form.querySelectorAll('.js-cart-item-quantity:not(:disabled)')).find(input =>
        !/^\d+$/.test(input.value.trim()) || !Number.isSafeInteger(Number(input.value)));
      if (invalid) {
        status('Enter a whole number of 0 or more before checkout.');
        invalid.focus();
        return;
      }
      document.activeElement?.blur();
      checkingOut = true;
      form.inert = true;
      const checkout = form.querySelector('#checkoutButton');
      if (checkout) checkout.disabled = true;
      try {
        await flush();
        const verified = await request('cart.js');
        cart = verified;
        CartJS.cart.update(verified);
        cart = CartJS.cart;
        paint();
        submitting = true;
        if (checkout) checkout.disabled = false;
        form.inert = false;
        form.requestSubmit(checkout);
      } catch (error) {
        status('Please retry your cart update before checkout.');
        if (checkout) checkout.disabled = false;
      } finally {
        checkingOut = false;
        form.inert = false;
      }
    });
  }
  window.FirgelliCartQuantity = { init: init };
})();
