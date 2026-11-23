(function () {
  'use strict';

  var MIN_CHARS = 2;
  var MAX_PER_CAT = 6;

  // Compute /productos/ prefix based on current page depth
  function getProductosPrefix() {
    var path = window.location.pathname.replace(/\/[^/]*$/, '');
    var parts = path.replace(/^\//, '').split('/').filter(Boolean);
    // parts: [] = root, ['productos'] = depth1, ['productos','enfriamiento'] = depth2
    if (parts.length === 0) return 'productos/';
    if (parts.length === 1) return '';           // ya estamos en /productos/
    return '../';                                // estamos en /productos/enfriamiento/
  }

  function getRootPrefix() {
    var path = window.location.pathname.replace(/\/[^/]*$/, '');
    var parts = path.replace(/^\//, '').split('/').filter(Boolean);
    return parts.length === 0 ? '' : parts.map(function () { return '../'; }).join('');
  }

  var prodPrefix   = getProductosPrefix();
  var rootPrefix   = getRootPrefix();

  function buildUI() {
    var bar = document.querySelector('.prod-search');
    if (!bar) return;

    // Wrap the search bar in a position:relative container
    var wrap = document.createElement('div');
    wrap.style.position = 'relative';
    bar.parentNode.insertBefore(wrap, bar);
    wrap.appendChild(bar);

    // Dropdown for global results
    var dropdown = document.createElement('div');
    dropdown.id = 'globalSearchResults';
    dropdown.className = 'gsearch-dropdown';
    wrap.appendChild(dropdown);

    // Category select → navigate
    var catSelect = document.getElementById('categorySelect');
    if (catSelect) {
      // Mark current page as selected
      var currentFile = window.location.pathname.split('/').pop();
      var currentDir  = window.location.pathname.split('/').slice(-2, -1)[0] || '';
      for (var i = 0; i < catSelect.options.length; i++) {
        var val = catSelect.options[i].value;
        if (val && (val === currentFile || val === currentDir + '/' + currentFile)) {
          catSelect.options[i].selected = true;
          break;
        }
      }

      catSelect.addEventListener('change', function () {
        var val = catSelect.value;
        if (!val) return;
        window.location.href = prodPrefix + val;
      });
    }

    // Text input → global search
    var input = document.getElementById('prodSearchInput');
    if (!input) return;

    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q.length < MIN_CHARS) {
        hideDropdown(dropdown);
        updateCount();
        return;
      }
      showGlobalResults(dropdown, q);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideDropdown(dropdown);
        input.value = '';
        updateCount();
      }
      if (e.key === 'Enter') {
        var first = dropdown.querySelector('.gsearch-item');
        if (first) first.click();
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) hideDropdown(dropdown);
    });

    updateCount();
  }

  function hideDropdown(dropdown) {
    dropdown.innerHTML = '';
    dropdown.classList.remove('gsearch-dropdown--open');
  }

  function updateCount() {
    var grid  = document.getElementById('productGrid');
    var count = document.getElementById('brandCount');
    if (!grid || !count) return;
    var n = grid.querySelectorAll('.prod-card:not(.is-hidden)').length;
    count.textContent = n + ' producto' + (n !== 1 ? 's' : '');
  }

  function showGlobalResults(dropdown, q) {
    var index = window.PRODUCTS_INDEX;
    if (!index) return;

    var ql = q.toLowerCase();
    var matches = index.filter(function (p) {
      return (
        p.name.toLowerCase().indexOf(ql) !== -1 ||
        p.ref.toLowerCase().indexOf(ql)  !== -1 ||
        p.brand.toLowerCase().indexOf(ql) !== -1
      );
    });

    dropdown.innerHTML = '';

    if (matches.length === 0) {
      dropdown.innerHTML =
        '<p class="gsearch-empty">Sin resultados para <strong>' +
        escapeHtml(q) + '</strong></p>';
      dropdown.classList.add('gsearch-dropdown--open');
      return;
    }

    // Group by subcategory
    var groups = {};
    matches.forEach(function (p) {
      var key = p.subcategory || p.category;
      if (!groups[key]) groups[key] = { label: key, cat: p.category, items: [] };
      groups[key].items.push(p);
    });

    Object.keys(groups).forEach(function (key) {
      var g = groups[key];
      var groupEl = document.createElement('div');
      groupEl.className = 'gsearch-group';

      var items = g.items.slice(0, MAX_PER_CAT);
      var extra = g.items.length - items.length;

      var header = document.createElement('div');
      header.className = 'gsearch-group__header';
      header.innerHTML =
        '<span class="gsearch-group__cat">' + escapeHtml(g.cat.toUpperCase()) + '</span>' +
        '<span class="gsearch-group__sub">' + (g.label !== g.cat ? escapeHtml(g.label) : '') + '</span>' +
        '<span class="gsearch-group__count">' + g.items.length + '</span>';
      groupEl.appendChild(header);

      items.forEach(function (p) {
        var href = rootPrefix + p.url + (p.modal ? '#' + p.modal : '');
        var a = document.createElement('a');
        a.className = 'gsearch-item';
        a.href = href;
        a.innerHTML =
          '<span class="gsearch-item__name">' + escapeHtml(p.name) + '</span>' +
          '<span class="gsearch-item__ref">'  + escapeHtml(p.ref)  + '</span>' +
          (p.brand ? '<span class="gsearch-item__brand">' + escapeHtml(p.brand) + '</span>' : '');
        groupEl.appendChild(a);
      });

      if (extra > 0) {
        var more = document.createElement('a');
        more.className = 'gsearch-more';
        more.href = rootPrefix + g.items[0].url;
        more.textContent = '+ ' + extra + ' más en esta categoría →';
        groupEl.appendChild(more);
      }

      dropdown.appendChild(groupEl);
    });

    var summary = document.createElement('div');
    summary.className = 'gsearch-summary';
    summary.textContent = matches.length + ' resultado' + (matches.length !== 1 ? 's' : '') + ' en todas las categorías';
    dropdown.appendChild(summary);

    dropdown.classList.add('gsearch-dropdown--open');
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
