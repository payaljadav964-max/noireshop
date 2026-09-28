(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (id) { return document.getElementById(id); };
  var u = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 700) + '&q=80'; };
  var money = function (n) { return '\u20B9' + n.toLocaleString('en-IN'); };

  var NEW = [
    { id: 'n1', name: 'Oversized T-Shirt', cat: 'Essentials', price: 1499, a: '1503342217505-b0a15ec3261c', b: '1521572163474-6864f9cf17ab' },
    { id: 'n2', name: 'Premium Hoodie', cat: 'Streetwear', price: 3499, a: '1556905055-8f358a7a47b2', b: '1620799140408-edc6dcb6d633' },
    { id: 'n3', name: 'Relaxed Cargo Pants', cat: 'Men', price: 2999, a: '1541099649105-f69ad21f3246', b: '1552374196-1ab2a1c593e8' },
    { id: 'n4', name: 'Classic Shirt', cat: 'Men', price: 2299, a: '1596755094514-f87e34085b2c', b: '1507679799987-c73779587ccf' },
    { id: 'n5', name: 'Minimal Dress', cat: 'Women', price: 3999, a: '1496747611176-843222e1e57c', b: '1595777457583-95e059d581b8' },
    { id: 'n6', name: 'Streetwear Jacket', cat: 'Streetwear', price: 5499, a: '1551028719-00167b16eac5', b: '1591047139829-d91aecb6caea' },
    { id: 'n7', name: 'Wide Leg Jeans', cat: 'Women', price: 2799, a: '1542272604-787c3835535d', b: '1434389677669-e08b4cac3105' },
    { id: 'n8', name: 'Essential Tank', cat: 'Essentials', price: 999, a: '1618354691373-d851c5c3a990', b: '1516257984-b1b4d707412e' }
  ];
  var TREND = [
    { id: 't1', name: 'Boxy Graphic Tee', cat: 'Streetwear', price: 1699, a: '1576566588028-4147f3842f27', b: '1521572163474-6864f9cf17ab' },
    { id: 't2', name: 'Tailored Blazer', cat: 'Women', price: 6499, a: '1594633312681-425c7b97ccd1', b: '1509631179647-0177331693ae' },
    { id: 't3', name: 'Utility Overshirt', cat: 'Men', price: 3799, a: '1617137968427-85924c800a22', b: '1504593811423-6dd665756598' },
    { id: 't4', name: 'Satin Slip Dress', cat: 'Women', price: 4299, a: '1529139574466-a303027c1d8b', b: '1490481651871-ab68de25d43d' }
  ];
  var ALL = NEW.concat(TREND);
  var byId = function (id) { return ALL.filter(function (p) { return p.id === id; })[0]; };

  var bag = [], wish = {};

  /* ---------- product cards ---------- */
  function card(p) {
    return '<article class="prod reveal">' +
      '<div class="p-img">' +
        '<img src="' + u(p.a) + '" alt="' + p.name + '" loading="lazy">' +
        '<img class="alt" src="' + u(p.b) + '" alt="" loading="lazy">' +
        '<button class="wish" data-wish="' + p.id + '" aria-label="Add ' + p.name + ' to wishlist" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9.500c0 6-8 11-8 11z"/></svg></button>' +
        '<button class="qv" data-qv="' + p.id + '">QUICK VIEW</button>' +
      '</div>' +
      '<div class="p-meta"><div><h3>' + p.name + '</h3><p class="cat-l">' + p.cat + '</p></div><span class="price">' + money(p.price) + '</span></div>' +
    '</article>';
  }
  $('newGrid').innerHTML = NEW.map(card).join('');
  $('trendGrid').innerHTML = TREND.map(card).join('');

  /* ---------- toast ---------- */
  var tt;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2400);
  }

  /* ---------- overlay / drawer / modal ---------- */
  var overlay = $('overlay'), drawer = $('drawer'), modal = $('modal'), menu = $('menu'), burger = $('burger');
  function lock() {
    var any = drawer.classList.contains('on') || modal.classList.contains('on') || menu.classList.contains('open');
    document.body.style.overflow = any ? 'hidden' : '';
    overlay.classList.toggle('on', drawer.classList.contains('on') || modal.classList.contains('on'));
  }
  function openBag() { drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); lock(); }
  function closeBag() { drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); lock(); }
  function closeModal() { modal.classList.remove('on'); modal.setAttribute('aria-hidden', 'true'); lock(); }
  function setMenu(o) {
    menu.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', String(o));
    burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    lock();
  }
  $('bagBtn').addEventListener('click', openBag);
  $('closeBag').addEventListener('click', closeBag);
  $('closeModal').addEventListener('click', closeModal);
  overlay.addEventListener('click', function () { closeBag(); closeModal(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeBag(); closeModal(); setMenu(false); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

  /* ---------- bag ---------- */
  function renderBag() {
    var box = $('bagItems'), total = 0, n = 0;
    if (!bag.length) {
      box.innerHTML = '<p class="empty">Your bag is empty.<br>Add something with attitude.</p>';
    } else {
      box.innerHTML = bag.map(function (i, idx) {
        var p = byId(i.id); total += p.price * i.qty; n += i.qty;
        return '<div class="item"><img src="' + u(p.a, 300) + '" alt="' + p.name + '">' +
          '<div><h4>' + p.name + '</h4><small>Size ' + i.size + '</small>' +
          '<div class="qty"><button data-dec="' + idx + '" aria-label="Decrease quantity">&minus;</button><span>' + i.qty + '</span><button data-inc="' + idx + '" aria-label="Increase quantity">+</button></div>' +
          '<div><button class="rm" data-rm="' + idx + '">Remove</button></div></div>' +
          '<b>' + money(p.price * i.qty) + '</b></div>';
      }).join('');
    }
    $('subtotal').textContent = money(total);
    var c = $('count');
    c.hidden = n === 0; c.textContent = n;
    c.classList.remove('pop'); void c.offsetWidth; if (n) c.classList.add('pop');
    fallback(box);
  }
  function addToBag(id, size) {
    var f = bag.filter(function (i) { return i.id === id && i.size === size; })[0];
    if (f) f.qty++; else bag.push({ id: id, size: size, qty: 1 });
    renderBag();
    toast(byId(id).name + ' added to bag');
  }
  $('bagItems').addEventListener('click', function (e) {
    var t = e.target, k;
    if ((k = t.dataset.inc) != null) bag[k].qty++;
    else if ((k = t.dataset.dec) != null) { bag[k].qty--; if (bag[k].qty < 1) bag.splice(k, 1); }
    else if ((k = t.dataset.rm) != null) bag.splice(k, 1);
    else return;
    renderBag();
  });
  $('checkout').addEventListener('click', function () {
    toast(bag.length ? 'Demo store: checkout is disabled.' : 'Your bag is empty.');
  });

  /* ---------- wishlist + quick view (delegated) ---------- */
  var current = null, size = 'M';
  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-wish]');
    if (w) {
      var id = w.dataset.wish, on = !wish[id]; wish[id] = on;
      document.querySelectorAll('[data-wish="' + id + '"]').forEach(function (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
      toast(on ? 'Saved to wishlist' : 'Removed from wishlist');
      return;
    }
    var q = e.target.closest('[data-qv]');
    if (q) {
      var p = byId(q.dataset.qv); current = p; size = 'M';
      $('mImg').src = u(p.a, 900); $('mImg').alt = p.name;
      $('mCat').textContent = p.cat; $('mName').textContent = p.name; $('mPrice').textContent = money(p.price);
      $('mSizes').innerHTML = ['XS', 'S', 'M', 'L', 'XL'].map(function (s) { return '<button data-size="' + s + '"' + (s === 'M' ? ' class="on"' : '') + '>' + s + '</button>'; }).join('');
      modal.classList.add('on'); modal.setAttribute('aria-hidden', 'false'); lock();
      fallback(modal);
      return;
    }
    var s = e.target.closest('[data-size]');
    if (s) {
      size = s.dataset.size;
      $('mSizes').querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === s); });
      return;
    }
    var info = e.target.closest('[data-info]');
    if (info) { e.preventDefault(); toast(info.dataset.info); }
  });
  $('mAdd').addEventListener('click', function () {
    if (!current) return;
    addToBag(current.id, size); closeModal(); openBag();
  });

  /* ---------- nav style ---------- */
  var nav = $('nav');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal ---------- */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  /* ---------- image fallback ---------- */
  var blank = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27800%27%3E%3Crect width=%27600%27 height=%27800%27 fill=%27%23e7dcca%27/%3E%3C/svg%3E';
  function fallback(scope) {
    (scope || document).querySelectorAll('img').forEach(function (img) {
      if (img.dataset.fb) return; img.dataset.fb = '1';
      var fix = function () { img.onerror = null; img.src = blank; };
      img.addEventListener('error', fix);
      if (img.complete && img.naturalWidth === 0 && img.src) fix();
    });
  }
  fallback(document);

  /* ---------- newsletter ---------- */
  var nform = $('nform'), nemail = $('nemail'), nerr = $('nerr'), nok = $('nok');
  nform.addEventListener('submit', function (e) {
    e.preventDefault(); nok.hidden = true;
    var v = nemail.value.trim();
    var msg = !v ? 'Enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Enter a valid email, like name@example.com.' : '';
    nerr.textContent = msg; nemail.classList.toggle('bad', !!msg);
    nemail.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) { nemail.focus(); return; }
    nform.reset(); nok.hidden = false;
  });
  nemail.addEventListener('input', function () { nerr.textContent = ''; nemail.classList.remove('bad'); });

  $('yr').textContent = new Date().getFullYear();
  renderBag();
})();
