/* Софьюшка — общие части интерфейса */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.6 1.2 4.7 2.8 1.1-1.6 2.7-2.8 4.7-2.8 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3Z"/>',
    bag: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12M12 8v12.5M12 8c-1.5-3.5-5.5-4-5.5-1.5S10 8 12 8Zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 8 12 8Z"/>',
    truck: '<path d="M3 6.5h11v9H3zM14 10h3.5l3 3v2.5H14z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    leaf: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 9.5-8.5"/>',
    swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    star: '<path d="m12 3.8 2.5 5.2 5.6.7-4.1 3.9 1 5.6L12 16.5l-5 2.7 1-5.6-4.1-3.9 5.6-.7L12 3.8Z"/>',
    ruler: '<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v2"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    home: '<path d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1V11Z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.2 6.2a1.5 1.5 0 0 1-2.1 0l-8.7-7.9Z"/><circle cx="8" cy="8" r="1.4"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.4.9 2.4 2.7 3 5.2"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    cookie: '<path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3 3 0 0 0 4 3.5 3 3 0 0 0 5 5.5Z"/><circle cx="8.5" cy="11" r=".6"/><circle cx="12" cy="15.5" r=".6"/><circle cx="15.5" cy="13" r=".6"/>',
    pencil: '<path d="m4 20 1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    vk: '<path d="M3 7.5h3c.6 3.2 2 5.2 3.3 5.7V7.5h2.8v3.2c1.3-.2 2.7-1.6 3.3-3.2h2.7c-.5 2-2 3.6-3.1 4.3 1.1.5 2.8 2 3.5 4.7h-3c-.6-1.8-2-3.1-3.4-3.3v3.3h-.4C6.5 16.5 3.4 13 3 7.5Z" fill="currentColor" stroke="none"/>',
    tg: '<path d="m21 4.5-3 15.2c-.2 1-.9 1.3-1.8.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.1 13.7l-4.5-1.4c-1-.3-1-1 .2-1.5L19.7 3.8c.8-.3 1.6.2 1.3.7Z" fill="currentColor" stroke="none"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

  const here = location.pathname.split('/').pop() || 'index.html';

  function header() {
    const el = $('#site-header'); if (!el) return;
    const cats = S.CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const nav = [
      ['catalog.html?tag=new', 'Новинки'], ...S.CATEGORIES.map(c => ['catalog.html?cat=' + c.id, c.name]),
    ].map(([h, t]) => `<li><a href="${h}" ${location.href.endsWith(h) ? 'aria-current="page"' : ''}>${t}</a></li>`).join('');
    el.innerHTML = `
      <div class="topbar"><div class="wrap">
        <span>${icon('truck')} Бесплатная доставка от 5 000 ₽</span>
        <span>${icon('gift')} 500 бонусов за регистрацию</span>
        <span>${icon('swap')} Обмен и возврат 30 дней</span>
      </div></div>
      <header class="header" id="hdr">
        <div class="wrap header__row">
          <a class="logo" href="index.html" aria-label="Софьюшка — на главную"><img src="assets/img/logo.png" alt="Софьюшка" width="750" height="306"></a>
          <form class="search" role="search" action="catalog.html" autocomplete="off">
            <select class="select" name="cat" aria-label="Категория"><option value="">Все товары</option>${cats}</select>
            <input name="q" type="search" placeholder="Найти распашонки, боди, пелёнки…" aria-label="Поиск по магазину" aria-autocomplete="list" aria-controls="suggest">
            <button type="submit" aria-label="Искать">${icon('search')}</button>
            <div class="suggest" id="suggest" role="listbox"></div>
          </form>
          <div class="actions">
            <a class="bonus-pill hide-m" href="account.html#bonus" data-bonus hidden>${icon('star')}<span class="num"></span></a>
            <a class="iconbtn" href="account.html" aria-label="Личный кабинет">${icon('user')}</a>
            <a class="iconbtn hide-m" href="catalog.html?fav=1" aria-label="Избранное">${icon('heart')}<span class="badge" data-fav></span></a>
            <a class="iconbtn" href="cart.html" aria-label="Корзина">${icon('bag')}<span class="badge" data-cart></span></a>
          </div>
        </div>
        <nav class="nav" aria-label="Категории"><ul>${nav}<li><a class="nav__sale" href="catalog.html?tag=sale">Скидки</a></li></ul></nav>
      </header>`;
    const params = new URLSearchParams(location.search);
    const form = $('.search', el);
    form.q.value = params.get('q') || '';
    form.cat.value = params.get('cat') || '';
    searchSuggest(form);
    const hdr = $('#hdr');
    const onScroll = () => hdr.classList.toggle('is-stuck', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  function searchSuggest(form) {
    const box = $('.suggest', form); let active = -1;
    const render = () => {
      const q = form.q.value.trim();
      if (q.length < 2) { box.classList.remove('is-open'); return; }
      const res = S.search(q, { cat: form.cat.value }).slice(0, 5);
      box.innerHTML = res.length
        ? res.map(p => `<a href="product.html?id=${p.id}" role="option"><img src="${S.U(p.img, 120)}" alt=""><div><b>${esc(p.name)}</b><small>${S.rub(p.price)} · ${UI.sizeLabel(p)}</small></div></a>`).join('') +
          `<a class="suggest__all" href="catalog.html?q=${encodeURIComponent(q)}${form.cat.value ? '&cat=' + form.cat.value : ''}">Все результаты ${icon('arrow')}</a>`
        : `<div class="suggest__empty">Ничего не нашли по «${esc(q)}». Попробуйте «боди» или «пелёнки».</div>`;
      box.classList.add('is-open'); active = -1;
    };
    form.q.addEventListener('input', render);
    form.q.addEventListener('focus', render);
    form.q.addEventListener('keydown', e => {
      const items = $$('a', box); if (!items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle('is-active', i === active));
      } else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = items[active].href; }
      else if (e.key === 'Escape') box.classList.remove('is-open');
    });
    document.addEventListener('click', e => { if (!form.contains(e.target)) box.classList.remove('is-open'); });
  }

  function footer() {
    const el = $('#site-footer'); if (!el) return;
    el.innerHTML = `
      <footer class="footer"><div class="wrap">
        <div class="footer__grid">
          <div>
            <a class="logo" href="index.html"><img src="assets/img/logo.png" alt="Софьюшка" width="750" height="306" loading="lazy"></a>
            <div class="socials">
              <a href="#" aria-label="ВКонтакте">${icon('vk')}</a>
              <a href="#" aria-label="Telegram">${icon('tg')}</a>
            </div>
          </div>
          <div><h4>Магазин</h4><ul>
            <li><a href="catalog.html?tag=new">Новинки</a></li><li><a href="catalog.html?cat=sets">В роддом</a></li>
            <li><a href="catalog.html?tag=sale">Скидки</a></li><li><a href="catalog.html?cat=pelenki">Пелёнки</a></li></ul></div>
          <div><h4>Помощь</h4><ul>
            <li><a href="account.html">Личный кабинет</a></li><li><a href="account.html#bonus">Бонусы</a></li>
            <li><a href="privacy.html">Персональные данные</a></li><li><a href="privacy.html#cookie">Cookie</a></li></ul></div>
          <div><h4>Новинки — первой</h4>
            <p class="muted" style="font-size:14px">Раз в неделю, без спама.</p>
            <form class="footer__sub" data-sub><input class="input" type="email" required placeholder="Ваша почта" aria-label="Почта"><button class="btn btn--sm" style="min-height:50px">Да</button></form>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© 2026 «Софьюшка» — детская одежда из хлопка, сделано в России. <a href="https://www.ozon.ru/seller/sofyushka/" target="_blank" rel="noopener">Мы на Ozon</a></span>
          <span><a href="privacy.html">Политика обработки персональных данных</a> · <a href="admin.html">Вход для администратора</a></span>
        </div>
      </div></footer>
      <nav class="tabbar" aria-label="Меню">
        <a href="index.html" ${here === 'index.html' ? 'aria-current="page"' : ''}>${icon('home')}Главная</a>
        <a href="catalog.html" ${here === 'catalog.html' ? 'aria-current="page"' : ''}>${icon('grid')}Каталог</a>
        <a href="catalog.html?fav=1">${icon('heart')}Избранное<span class="badge" data-fav></span></a>
        <a href="cart.html" ${here === 'cart.html' ? 'aria-current="page"' : ''}>${icon('bag')}Корзина<span class="badge" data-cart></span></a>
        <a href="account.html" ${here === 'account.html' ? 'aria-current="page"' : ''}>${icon('user')}Кабинет</a>
      </nav>`;
    $('[data-sub]', el).addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Подписали! Первое письмо — с подарком.'); });
  }

  function counters() {
    const n = S.cartCount(), f = S.fav().length, u = S.user();
    $$('[data-cart]').forEach(b => { b.textContent = n || ''; b.dataset.n = n; });
    $$('[data-fav]').forEach(b => { b.textContent = f || ''; b.dataset.n = f; });
    $$('[data-bonus]').forEach(b => { b.hidden = !u; if (u) $('span', b).textContent = S.num(u.bonus); });
  }

  let tt;
  function toast(msg, opts = {}) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = (opts.img ? `<img src="${opts.img}" alt="">` : '') + `<span>${msg}</span>` + (opts.link ? `<a href="${opts.link[0]}">${opts.link[1]}</a>` : '');
    requestAnimationFrame(() => t.classList.add('is-on'));
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), opts.ms || 3200);
  }

  function cookieBanner() {
    if (S.cookie()) return;
    const c = document.createElement('section');
    c.className = 'cookie'; c.setAttribute('aria-label', 'Cookie');
    c.innerHTML = `
      <div class="cookie__top"><i>${icon('cookie')}</i>
        <p>Мы используем cookie, чтобы корзина и бонусы не терялись. Подробнее — в <a href="privacy.html#cookie">политике</a>.</p></div>
      <div class="cookie__more" hidden>
        <label class="setting"><div><b>Необходимые</b><span>Корзина, вход, безопасность</span></div><span class="switch"><input type="checkbox" checked disabled aria-label="Необходимые"></span></label>
        <label class="setting"><div><b>Аналитика</b><span>Помогает делать сайт удобнее</span></div><span class="switch"><input type="checkbox" data-k="analytics" aria-label="Аналитика"></span></label>
        <label class="setting"><div><b>Реклама</b><span>Персональные акции</span></div><span class="switch"><input type="checkbox" data-k="ads" aria-label="Реклама"></span></label>
      </div>
      <div class="cookie__btns">
        <button class="btn btn--sm" data-a="all">Принять все</button>
        <button class="btn btn--sm btn--ghost" data-a="need">Только необходимые</button>
        <button class="linkbtn" data-a="more" style="margin-left:auto">Настроить</button>
      </div>`;
    document.body.appendChild(c);
    c.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const more = $('.cookie__more', c);
      if (a.dataset.a === 'more') {
        if (more.hidden) { more.hidden = false; a.textContent = 'Сохранить выбор'; return; }
        S.setCookie({ necessary: true, analytics: $('[data-k=analytics]', c).checked, ads: $('[data-k=ads]', c).checked });
      } else S.setCookie({ necessary: true, analytics: a.dataset.a === 'all', ads: a.dataset.a === 'all' });
      c.remove();
    });
  }

  /* ---- карточка товара ---- */
  function card(p, i = 0) {
    const fav = S.fav().includes(p.id);
    const flag = p.stock <= 0 ? '<span class="card__flag card__flag--out">Нет в наличии</span>'
      : p.old ? `<span class="card__flag card__flag--sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>`
      : p.tags.includes('new') ? '<span class="card__flag">Новинка</span>'
      : p.tags.includes('hit') ? '<span class="card__flag">Любимое</span>' : '';
    const size = !p.sizes.length ? 0 : window.__pickSize && p.sizes.includes(window.__pickSize) ? window.__pickSize : p.sizes[0];
    return `<article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <a class="card__media" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true"><img src="${S.U(p.img, 640)}" alt="" loading="lazy">${flag}</a>
      <button class="card__fav" aria-label="В избранное" aria-pressed="${fav}" data-fav-id="${p.id}">${icon('heart')}</button>
      <div class="card__body">
        <a class="card__name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <span class="card__sizes">${sizeLabel(p)} · <span class="card__rate">★ ${String(p.rating || 4.9).replace(".", ",")}</span></span>
        <span class="card__price">${S.rub(p.price)}${p.old ? `<s>${S.rub(p.old)}</s>` : ''}</span>
        <button class="card__add" aria-label="Добавить в корзину${size ? ", рост " + size : ""}" data-add="${p.id}" data-size="${size}" ${p.stock <= 0 ? 'disabled' : ''}>${icon('plus')}</button>
      </div>
    </article>`;
  }
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav-id]');
    if (fav) { const on = S.toggleFav(+fav.dataset.favId); fav.setAttribute('aria-pressed', on); toast(on ? 'Добавили в избранное' : 'Убрали из избранного', { link: on ? ['catalog.html?fav=1', 'Смотреть'] : null }); }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = S.product(add.dataset.add);
      S.addToCart(p.id, +add.dataset.size, 1);
      add.classList.add('is-done'); add.innerHTML = icon('check');
      setTimeout(() => { add.classList.remove('is-done'); add.innerHTML = icon('plus'); }, 1600);
      toast(`${esc(p.name)}${+add.dataset.size ? ", " + add.dataset.size + " см" : ""} — в корзине`, { img: S.U(p.img, 120), link: ['cart.html', 'Оформить'] });
    }
  });

  /* ---- ростомер (вертикальный, в масштабе) ---- */
  function ruler(host, opts) {
    const stops = S.SIZES.map(s => s.cm), min = stops[0], max = stops[stops.length - 1];
    let value = opts.value || 68;
    host.innerHTML = `<div class="doorframe__post"></div>
      <div class="ruler" role="slider" tabindex="0" aria-label="Рост малыша, см" aria-valuemin="${min}" aria-valuemax="${max}">
        ${Array.from({ length: (max - min) / 2 + 1 }, (_, i) => min + i * 2).map(cm => `<i class="ruler__tick ${stops.includes(cm) ? 'is-major' : ''}" style="top:${pct(cm)}%"></i>`).join('')}
        ${stops.map(cm => `<span class="ruler__num" style="top:${pct(cm)}%">${cm}</span>`).join('')}
        ${(opts.marks || []).map(m => `<span class="ruler__mark" style="top:${pct(m.cm)}%"><em>${esc(m.t)}</em><svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M2 6c24-3 50 2 96-2"/></svg></span>`).join('')}
        <div class="ruler__handle"><span class="ruler__tag">${icon('ruler')}<b></b></span></div>
      </div>`;
    function pct(cm) { return (1 - (cm - min) / (max - min)) * 100; }
    const r = $('.ruler', host), h = $('.ruler__handle', host), tag = $('.ruler__tag b', host);
    function set(cm, fire = true) {
      value = stops.reduce((a, b) => Math.abs(b - cm) < Math.abs(a - cm) ? b : a);
      h.style.top = pct(value) + '%'; tag.textContent = value + ' см';
      r.setAttribute('aria-valuenow', value); r.setAttribute('aria-valuetext', `${value} сантиметров, ${S.ageFor(value)}`);
      if (fire && opts.onChange) opts.onChange(value);
    }
    const fromY = y => { const b = r.getBoundingClientRect(); return max - Math.max(0, Math.min(1, (y - b.top) / b.height)) * (max - min); };
    r.addEventListener('pointerdown', e => { r.setPointerCapture(e.pointerId); r.classList.add('is-dragging'); set(fromY(e.clientY)); });
    r.addEventListener('pointermove', e => { if (r.classList.contains('is-dragging')) set(fromY(e.clientY)); });
    const end = () => { if (r.classList.contains('is-dragging')) { r.classList.remove('is-dragging'); opts.onCommit && opts.onCommit(value); } };
    r.addEventListener('pointerup', end); r.addEventListener('pointercancel', end);
    r.addEventListener('keydown', e => {
      const i = stops.indexOf(value);
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); set(stops[Math.min(stops.length - 1, i + 1)]); opts.onCommit && opts.onCommit(value); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); set(stops[Math.max(0, i - 1)]); opts.onCommit && opts.onCommit(value); }
    });
    set(value, false);
    return { set, get: () => value };
  }

  /* ---- горизонтальный ростомер-фильтр ---- */
  function hruler(host, opts) {
    const stops = S.SIZES.map(s => s.cm), min = stops[0], max = stops[stops.length - 1];
    let value = opts.value || null;
    const pct = cm => (cm - min) / (max - min) * 100;
    host.innerHTML = `<div class="hruler" role="slider" tabindex="0" aria-label="Рост малыша, см" aria-valuemin="${min}" aria-valuemax="${max}">
        <div class="hruler__bar"></div>
        ${Array.from({ length: (max - min) / 2 + 1 }, (_, i) => min + i * 2).map(cm => `<i class="hruler__tick ${stops.includes(cm) ? 'is-major' : ''}" style="left:${pct(cm)}%"></i>`).join('')}
        ${stops.filter((_, i) => i % 2 === 0 || i === stops.length - 1).map(cm => `<span class="hruler__num" style="left:${pct(cm)}%">${cm}</span>`).join('')}
        <div class="hruler__knob"><span></span></div>
      </div>
      <div class="hruler__off"><span data-age></span><button type="button" data-clear>Любой рост</button></div>`;
    const r = $('.hruler', host), k = $('.hruler__knob', host), lab = $('.hruler__knob span', host), age = $('[data-age]', host), clr = $('[data-clear]', host);
    function set(cm, fire = true) {
      if (cm == null) { value = null; k.style.display = 'none'; age.textContent = 'Тяните метку'; clr.hidden = true; r.removeAttribute('aria-valuenow'); }
      else {
        value = stops.reduce((a, b) => Math.abs(b - cm) < Math.abs(a - cm) ? b : a);
        k.style.display = ''; k.style.left = pct(value) + '%'; lab.textContent = value + ' см'; age.textContent = S.ageFor(value); clr.hidden = false;
        r.setAttribute('aria-valuenow', value);
      }
      if (fire && opts.onChange) opts.onChange(value);
    }
    const fromX = x => { const b = r.getBoundingClientRect(); return min + Math.max(0, Math.min(1, (x - b.left) / b.width)) * (max - min); };
    r.addEventListener('pointerdown', e => { r.setPointerCapture(e.pointerId); r.classList.add('is-dragging'); set(fromX(e.clientX)); });
    r.addEventListener('pointermove', e => { if (r.classList.contains('is-dragging')) set(fromX(e.clientX)); });
    r.addEventListener('pointerup', () => r.classList.remove('is-dragging'));
    r.addEventListener('keydown', e => {
      const i = value ? stops.indexOf(value) : 3;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); set(stops[Math.min(stops.length - 1, i + 1)]); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); set(stops[Math.max(0, i - 1)]); }
    });
    clr.addEventListener('click', () => set(null));
    set(value, false);
    return { set, get: () => value };
  }

  function sizeLabel(p) {
    if (!p.sizes.length) return p.dims || 'один размер';
    const a = p.sizes[0], b = p.sizes[p.sizes.length - 1];
    return a === b ? 'рост ' + a + ' см' : 'рост ' + a + '–' + b + ' см';
  }

  function statusClass(s) {
    return { 'Оплачен': 'ok', 'Доставлен': 'ok', 'Ожидает оплаты': 'wait', 'Возврат': 'back', 'Отменён': 'bad' }[s] || 'wait';
  }

  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };
  window.UI = { $, $$, esc, icon, toast, card, ruler, hruler, counters, statusClass, plural, sizeLabel };

  document.addEventListener('DOMContentLoaded', () => {
    header(); footer(); counters(); cookieBanner();
    S.on(counters);
  });
})();
