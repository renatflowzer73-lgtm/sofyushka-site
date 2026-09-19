/* Софьюшка — кабинет администратора (демо: логин admin, пароль admin) */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, esc, icon, toast } = UI;
  const app = $('#app');
  const AUTH = 'sofyushka.admin';
  const isIn = () => { try { return sessionStorage.getItem(AUTH) === '1'; } catch (e) { return window.__adm; } };
  const setIn = v => { try { v ? sessionStorage.setItem(AUTH, '1') : sessionStorage.removeItem(AUTH); } catch (e) {} window.__adm = v; };

  /* ---------- вход ---------- */
  function login() {
    app.innerHTML = `<div class="adm-login"><form novalidate>
      <img src="assets/img/logo.png" alt="Софьюшка">
      <h1>Вход для администратора</h1>
      <label class="field"><span>Логин</span><input class="input" name="l" autocomplete="username" autofocus></label>
      <label class="field"><span>Пароль</span><input class="input" name="p" type="password" autocomplete="current-password"></label>
      <p class="err" data-err></p>
      <button class="btn btn--block">Войти</button>
      <a href="index.html" class="hint" style="text-align:center">← В магазин</a>
    </form></div>`;
    $('form', app).addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      if (f.l.value.trim() === 'admin' && f.p.value === 'admin') { setIn(true); shell(); }
      else { $('[data-err]').textContent = 'Неверный логин или пароль'; f.p.value = ''; f.p.focus(); }
    });
  }

  /* ---------- оболочка ---------- */
  const SECTIONS = [['dash', 'Обзор', 'chart'], ['products', 'Товары', 'tag'], ['orders', 'Заказы и оплаты', 'card'], ['promos', 'Акции и скидки', 'gift']];
  let cur = (location.hash || '#dash').slice(1);
  function shell() {
    if (!SECTIONS.some(s => s[0] === cur)) cur = 'dash';
    const waiting = S.orders().filter(o => o.pay === 'Ожидает оплаты').length;
    app.innerHTML = `<div class="adm">
      <nav class="adm__side" aria-label="Разделы">
        <a class="logo" href="index.html"><img src="assets/img/logo.png" alt="Софьюшка — в магазин"></a>
        ${SECTIONS.map(([id, t, ic]) => `<button data-sec="${id}" aria-current="${id === cur}">${icon(ic)}${t}${id === 'orders' && waiting ? `<span class="cnt">${waiting}</span>` : ''}</button>`).join('')}
        <span class="spacer"></span>
        <a href="index.html" target="_blank">${icon('home')}Открыть магазин</a>
        <button data-reset>${icon('swap')}Сбросить демо</button>
        <button data-out>${icon('logout')}Выйти</button>
      </nav>
      <main class="adm__main" id="main"></main></div>`;
    ({ dash, products, orders, promos })[cur]();
  }
  app.addEventListener('click', e => {
    const s = e.target.closest('[data-sec]');
    if (s) { cur = s.dataset.sec; history.replaceState(null, '', '#' + cur); shell(); }
    if (e.target.closest('[data-out]')) { setIn(false); login(); }
    if (e.target.closest('[data-reset]') && confirm('Вернуть демо-данные к исходным? Ваши изменения пропадут.')) { S.reset(); shell(); toast('Демо-данные восстановлены'); }
  });

  /* ---------- обзор ---------- */
  function dash() {
    const os = S.orders();
    const paid = os.filter(o => o.pay === 'Оплачен');
    const revenue = paid.reduce((a, o) => a + S.orderSum(o), 0);
    const wait = os.filter(o => o.pay === 'Ожидает оплаты');
    const low = S.products().filter(p => p.stock <= 5);
    const byCat = S.CATEGORIES.map(c => ({ c, n: S.products().filter(p => p.cat === c.id).reduce((a, p) => a + p.stock, 0) })).filter(x => x.n).sort((a, b) => b.n - a.n);
    const maxN = Math.max(...byCat.map(x => x.n));
    $('#main').innerHTML = `
      <div class="adm__head"><h1>Добрый день!</h1><button class="btn" data-new-product>${icon('plus')}Добавить товар</button></div>
      <div class="kpis">
        <div class="kpi"><span>Оплачено</span><b>${S.rub(revenue)}</b><small>${paid.length} ${UI.plural(paid.length, "заказ", "заказа", "заказов")}</small></div>
        <div class="kpi ${wait.length ? 'kpi--warn' : ''}"><span>Ждут оплаты</span><b>${wait.length}</b><small>на ${S.rub(wait.reduce((a, o) => a + S.orderSum(o), 0))}</small></div>
        <div class="kpi"><span>Товаров на складе</span><b>${S.num(S.products().reduce((a, p) => a + p.stock, 0))}</b><small>${S.products().length} позиций</small></div>
        <div class="kpi ${low.length ? 'kpi--warn' : ''}"><span>Заканчиваются</span><b>${low.length}</b><small>5 шт. и меньше</small></div>
      </div>
      <div class="two">
        <div class="box"><div class="box__head"><h2>Новые заказы</h2><button class="link-more" style="border:0;background:none" data-sec="orders">Все ${icon('arrow')}</button></div>
          <div class="tbl-wrap" style="border:0">${orderTable(os.slice(0, 5), true)}</div></div>
        <div class="box"><div class="box__head"><h2>Остатки по категориям</h2></div>
          <div class="bar-list">${byCat.map(x => `<div class="bar-row"><span>${esc(x.c.name)}</span><i><b style="width:${x.n / maxN * 100}%"></b></i><span class="num">${x.n} шт.</span></div>`).join('')}</div>
          ${low.length ? `<p class="muted" style="font-size:14px">Дозаказать: ${low.map(p => `<b>${esc(p.name)}</b> (${p.stock})`).join(', ')}</p>` : ''}</div>
      </div>`;
    bindOrderSelects();
  }

  /* ---------- товары ---------- */
  let pq = '', pcat = '';
  function products() {
    const list = S.products().filter(p => (!pcat || p.cat === pcat) && (!pq || p.name.toLowerCase().includes(pq.toLowerCase())));
    $('#main').innerHTML = `
      <div class="adm__head"><h1>Товары</h1><button class="btn" data-new-product>${icon('plus')}Добавить товар</button></div>
      <div class="filters-row">
        <input class="input" id="pq" placeholder="Поиск по названию" value="${esc(pq)}" aria-label="Поиск товара">
        <select class="select cellsel" id="pcat" style="min-height:42px" aria-label="Категория"><option value="">Все категории</option>${S.CATEGORIES.map(c => `<option value="${c.id}" ${c.id === pcat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
        <span class="muted" style="font-size:14px">${list.length} позиций · цены и остатки меняются прямо в таблице</span>
      </div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Товар</th><th>Рост, см</th><th class="num">Цена, ₽</th><th class="num">Старая цена</th><th>Остаток</th><th></th></tr></thead>
        <tbody>${list.map(p => `<tr data-pid="${p.id}">
          <td><div class="pcell"><img src="${S.U(p.img, 120)}" alt=""><div><b>${esc(p.name)}</b><small>${esc((S.cat(p.cat) || {}).name || '')}</small></div></div></td>
          <td class="num" style="text-align:left">${UI.sizeLabel(p).replace('рост ', '')}</td>
          <td class="num"><input class="cellin" data-f="price" inputmode="numeric" value="${p.price}" aria-label="Цена ${esc(p.name)}"></td>
          <td class="num"><input class="cellin" data-f="old" inputmode="numeric" value="${p.old || ''}" placeholder="—" aria-label="Старая цена ${esc(p.name)}"></td>
          <td><span class="stepper"><button data-st="-1" aria-label="Меньше">−</button><input class="cellin" data-f="stock" inputmode="numeric" value="${p.stock}" aria-label="Остаток ${esc(p.name)}"><button data-st="1" aria-label="Больше">+</button></span>
            ${p.stock <= 0 ? '<small class="out">нет</small>' : p.stock <= 5 ? '<small class="low">мало</small>' : ''}</td>
          <td><div class="rowbtns"><a class="iconbtn" href="product.html?id=${p.id}" target="_blank" aria-label="Открыть на сайте">${icon('arrow')}</a><button class="iconbtn" data-edit="${p.id}" aria-label="Изменить">${icon('pencil')}</button><button class="iconbtn" data-del="${p.id}" aria-label="Удалить">${icon('trash')}</button></div></td>
        </tr>`).join('')}</tbody></table></div>`;
    $('#pq').addEventListener('input', e => { pq = e.target.value; const pos = e.target.selectionStart; products(); const i = $('#pq'); i.focus(); i.setSelectionRange(pos, pos); });
    $('#pcat').addEventListener('change', e => { pcat = e.target.value; products(); });
  }
  app.addEventListener('change', e => {
    const inp = e.target.closest('.cellin[data-f]'); if (!inp) return;
    const id = +inp.closest('[data-pid]').dataset.pid;
    const v = Math.max(0, parseInt(inp.value.replace(/\D/g, ''), 10) || 0);
    if (inp.dataset.f === 'price' && !v) { toast('Цена не может быть нулевой'); inp.value = S.product(id).price; return; }
    S.saveProduct({ id, [inp.dataset.f]: v });
    toast({ price: 'Цена обновлена', old: v ? 'Старая цена — покажем скидку' : 'Скидка снята', stock: 'Остаток обновлён' }[inp.dataset.f]);
    if (inp.dataset.f === 'stock') products();
  });
  app.addEventListener('click', e => {
    const st = e.target.closest('[data-st]');
    if (st) { const id = +st.closest('[data-pid]').dataset.pid; const p = S.product(id); S.saveProduct({ id, stock: Math.max(0, p.stock + +st.dataset.st) }); products(); }
    const del = e.target.closest('[data-del]');
    if (del) { const p = S.product(del.dataset.del); if (confirm(`Удалить «${p.name}» из каталога?`)) { S.deleteProduct(p.id); products(); toast('Товар удалён'); } }
    const ed = e.target.closest('[data-edit]'); if (ed) productForm(S.product(ed.dataset.edit));
    if (e.target.closest('[data-new-product]')) productForm(null);
    const pe = e.target.closest('[data-pedit]'); if (pe) promoForm(S.promos().find(x => x.id === +pe.dataset.pedit));
    if (e.target.closest('[data-new-promo]')) promoForm(null);
    const pd = e.target.closest('[data-pdel]');
    if (pd && confirm('Удалить акцию?')) { S.deletePromo(+pd.dataset.pdel); promos(); toast('Акция удалена'); }
  });

  /* ---------- выдвижная форма ---------- */
  const drawer = $('#drawer'), dbg = $('#dbg'), dForm = $('#dForm');
  $$('[data-dclose]').forEach(b => { b.innerHTML = b.innerHTML || icon('close'); b.addEventListener('click', closeD); });
  dbg.addEventListener('click', closeD);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-on')) closeD(); });
  let onSave = null, lastFocus = null;
  function openD(title, html, save) {
    $('#dTitle').textContent = title; dForm.innerHTML = html; onSave = save; lastFocus = document.activeElement;
    drawer.classList.add('is-on'); dbg.classList.add('is-on');
    setTimeout(() => { const f = dForm.querySelector('input,select,textarea'); f && f.focus(); }, 60);
  }
  function closeD() { drawer.classList.remove('is-on'); dbg.classList.remove('is-on'); lastFocus && lastFocus.focus && lastFocus.focus(); }
  dForm.addEventListener('submit', e => { e.preventDefault(); if (onSave && onSave(dForm) !== false) closeD(); });

  const PHOTOS = [...new Set(S.products().map(p => p.img))].slice(0, 10);

  function productForm(p) {
    const n = p || { name: '', cat: 'body', price: '', old: 0, stock: 10, sizes: [62, 68, 74], img: PHOTOS[0], tags: ['new'], material: '', color: '', desc: '' };
    const imgs = PHOTOS.includes(n.img) ? PHOTOS : [n.img, ...PHOTOS.slice(0, 9)];
    openD(p ? 'Изменить товар' : 'Новый товар', `
      <label class="field"><span>Название</span><input class="input" name="name" value="${esc(n.name)}" placeholder="Боди «Ромашка»" required></label>
      <label class="field"><span>Категория</span><select class="select" name="cat">${S.CATEGORIES.map(c => `<option value="${c.id}" ${c.id === n.cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
      <div class="form-grid">
        <label class="field"><span>Цена, ₽</span><input class="input" name="price" inputmode="numeric" value="${n.price}" required></label>
        <label class="field"><span>Старая цена (для скидки)</span><input class="input" name="old" inputmode="numeric" value="${n.old || ''}" placeholder="—"></label>
        <label class="field"><span>Количество на складе</span><input class="input" name="stock" inputmode="numeric" value="${n.stock}"></label>
        <label class="field"><span>Цвет</span><input class="input" name="color" value="${esc(n.color)}" placeholder="молочный"></label>
      </div>
      <div class="field"><span>Рост, см (для пелёнок и бутылочек — не отмечайте)</span><div class="sizes-pick">${S.SIZES.map(s => `<label><input type="checkbox" name="sizes" value="${s.cm}" ${n.sizes.includes(s.cm) ? 'checked' : ''}><span>${s.cm}</span></label>`).join('')}</div></div>
      <label class="field"><span>Состав</span><input class="input" name="material" value="${esc(n.material)}" placeholder="100% хлопок"></label>
      <div class="field"><span>Фото (в демо — из библиотеки; в рабочей версии загрузка файла)</span>
        <div class="imgpick">${imgs.map(id => `<label><input type="radio" name="img" value="${id}" ${id === n.img ? 'checked' : ''}><img src="${S.U(id, 160)}" alt=""></label>`).join('')}</div></div>
      <div class="field"><span>Метки</span><div class="sizes-pick">${[['new', 'Новинка'], ['hit', 'Любимое']].map(([v, t]) => `<label><input type="checkbox" name="tags" value="${v}" ${n.tags.includes(v) ? 'checked' : ''}><span style="padding:0 14px">${t}</span></label>`).join('')}</div></div>
      <p class="err" data-ferr></p>`,
      f => {
        const sizes = $$('[name=sizes]:checked', f).map(i => +i.value);
        const price = parseInt(f.price.value.replace(/\D/g, ''), 10) || 0;
        const err = !f.name.value.trim() ? 'Введите название' : !price ? 'Укажите цену' : '';
        if (err) { $('[data-ferr]', f).textContent = err; return false; }
        const old = parseInt(f.old.value.replace(/\D/g, ''), 10) || 0;
        const tags = $$('[name=tags]:checked', f).map(i => i.value);
        if (old > price) tags.push('sale');
        S.saveProduct({ ...(p ? { id: p.id } : {}), name: f.name.value.trim(), cat: f.cat.value, price, old: old > price ? old : 0,
          stock: parseInt(f.stock.value, 10) || 0, sizes, material: f.material.value.trim(), color: f.color.value.trim(), img: f.img.value, tags });
        toast(p ? 'Товар сохранён' : 'Товар добавлен в каталог');
        cur = 'products'; shell();
      });
  }

  /* ---------- заказы и оплаты ---------- */
  let ofilter = '';
  function orderTable(list, compact) {
    return `<table class="tbl"><thead><tr><th>№</th><th>Дата</th><th>Покупатель</th>${compact ? '' : '<th>Состав</th><th>Способ</th>'}<th class="num">Сумма</th><th>Оплата</th>${compact ? '' : '<th>Доставка</th>'}</tr></thead>
      <tbody>${list.map(o => `<tr data-oid="${o.id}">
        <td><b>${o.id}</b></td><td>${new Date(o.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}</td><td>${esc(o.client)}<br><small class="muted">${esc(o.phone || '')}</small></td>
        ${compact ? '' : `<td>${o.items.map(i => { const p = S.product(i.id); return p ? `${esc(p.name)}${i.size ? ', ' + i.size : ''} × ${i.qty}` : ''; }).join('<br>')}</td><td>${esc(o.method || '')}</td>`}
        <td class="num"><b>${S.rub(S.orderSum(o))}</b></td>
        <td><select class="cellsel status--${UI.statusClass(o.pay)}" data-pay aria-label="Статус оплаты">${S.PAY_STATUSES.map(s => `<option ${s === o.pay ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
        ${compact ? '' : `<td><select class="cellsel" data-step aria-label="Статус доставки">${S.ORDER_STEPS.map((s, i) => `<option value="${i}" ${i === o.step ? 'selected' : ''}>${s}</option>`).join('')}</select></td>`}
      </tr>`).join('')}</tbody></table>`;
  }
  function bindOrderSelects() {
    $$('[data-pay]').forEach(s => s.addEventListener('change', () => {
      const id = +s.closest('[data-oid]').dataset.oid; const patch = { pay: s.value };
      if (s.value === 'Оплачен' && S.order(id).step < 1) patch.step = 1;
      S.setOrder(id, patch); toast(`Заказ ${id}: ${s.value.toLowerCase()}`); shell();
    }));
    $$('[data-step]').forEach(s => s.addEventListener('change', () => {
      const id = +s.closest('[data-oid]').dataset.oid; S.setOrder(id, { step: +s.value });
      toast(`Заказ ${id}: ${S.ORDER_STEPS[+s.value].toLowerCase()} — покупатель увидит в кабинете`);
    }));
  }
  function orders() {
    const all = S.orders();
    const list = ofilter ? all.filter(o => o.pay === ofilter) : all;
    $('#main').innerHTML = `
      <div class="adm__head"><h1>Заказы и оплаты</h1></div>
      <div class="filters-row">
        <button class="chip ${!ofilter ? 'is-on' : ''}" data-of="">Все · ${all.length}</button>
        ${S.PAY_STATUSES.map(s => `<button class="chip ${ofilter === s ? 'is-on' : ''}" data-of="${s}">${s} · ${all.filter(o => o.pay === s).length}</button>`).join('')}
      </div>
      <div class="tbl-wrap">${list.length ? orderTable(list) : '<p class="muted" style="padding:30px;text-align:center">Нет заказов с таким статусом</p>'}</div>`;
    $$('[data-of]').forEach(b => b.addEventListener('click', () => { ofilter = b.dataset.of; orders(); }));
    bindOrderSelects();
  }

  /* ---------- акции ---------- */
  const PROMO_PHOTOS = ['1607322851003-f5a88dc5b960', '1560707854-fb9a10eeaace', '1546015720-b8b30df5aa27', '1543334270-24bb46642afe', '1635874714425-c342060a4c58'];
  function promos() {
    $('#main').innerHTML = `
      <div class="adm__head"><h1>Акции и скидки</h1><button class="btn" data-new-promo>${icon('plus')}Новая акция</button></div>
      <p class="muted">Акция «на главной» показывается большим баннером на главной странице. Промокод покупатель вводит в корзине.</p>
      <div class="promo-list">${S.promos().map(p => `<article class="pcard">
        <div class="pcard__img"><img src="${S.U(p.img, 600)}" alt=""><span class="status status--${p.active ? 'ok' : 'bad'}">${p.active ? 'Идёт' : 'Выключена'}</span></div>
        <div class="pcard__body"><b>${esc(p.title)}</b><span class="muted" style="font-size:14px">${esc(p.text)}</span>
          <div class="pcard__meta">${p.discount ? `<span>−${p.discount}%</span>` : ''}${p.code ? `<span>${esc(p.code)}</span>` : ''}${p.until ? `<span>до ${S.date(p.until)}</span>` : ''}${p.featured ? '<span style="background:var(--blush);color:var(--plum)">на главной</span>' : ''}</div></div>
        <div class="pcard__foot"><label><span class="switch"><input type="checkbox" data-pact="${p.id}" ${p.active ? 'checked' : ''} aria-label="Акция активна"></span>Активна</label>
          <div class="rowbtns"><button class="iconbtn" data-pedit="${p.id}" aria-label="Изменить">${icon('pencil')}</button><button class="iconbtn" data-pdel="${p.id}" aria-label="Удалить">${icon('trash')}</button></div></div>
      </article>`).join('')}</div>`;
    $$('[data-pact]').forEach(i => i.addEventListener('change', () => { S.savePromo({ id: +i.dataset.pact, active: i.checked }); promos(); toast(i.checked ? 'Акция включена' : 'Акция выключена'); }));
  }
  function promoForm(p) {
    const n = p || { title: '', text: '', discount: 10, code: '', until: '', active: true, featured: false, img: PROMO_PHOTOS[0] };
    openD(p ? 'Изменить акцию' : 'Новая акция', `
      <label class="field"><span>Заголовок</span><input class="input" name="title" value="${esc(n.title)}" placeholder="Неделя платьев"></label>
      <label class="field"><span>Короткий текст</span><textarea class="textarea" name="text" placeholder="Одна строка — без лишних слов">${esc(n.text)}</textarea></label>
      <div class="form-grid">
        <label class="field"><span>Скидка, %</span><input class="input" name="discount" inputmode="numeric" value="${n.discount || ''}" placeholder="0 — без скидки"></label>
        <label class="field"><span>Промокод</span><input class="input" name="code" value="${esc(n.code)}" placeholder="ПЛАТЬЯ15" style="text-transform:uppercase"></label>
        <label class="field full"><span>Действует до</span><input class="input" type="date" name="until" value="${esc(n.until)}"></label>
      </div>
      <div class="field"><span>Картинка</span><div class="imgpick">${PROMO_PHOTOS.map(id => `<label><input type="radio" name="img" value="${id}" ${id === n.img ? 'checked' : ''}><img src="${S.U(id, 160)}" alt=""></label>`).join('')}</div></div>
      <label class="setting" style="border:0"><div><b>Показать на главной</b><span>Большой баннер — только одна акция</span></div><span class="switch"><input type="checkbox" name="featured" ${n.featured ? 'checked' : ''}></span></label>
      <label class="setting" style="border:0;padding-top:0"><div><b>Активна</b><span>Видна покупателям</span></div><span class="switch"><input type="checkbox" name="active" ${n.active ? 'checked' : ''}></span></label>
      <p class="err" data-ferr></p>`,
      f => {
        if (!f.title.value.trim()) { $('[data-ferr]', f).textContent = 'Введите заголовок'; return false; }
        const d = Math.min(90, parseInt(f.discount.value, 10) || 0);
        S.savePromo({ ...(p ? { id: p.id } : {}), title: f.title.value.trim(), text: f.text.value.trim(), discount: d, code: f.code.value.trim().toUpperCase(),
          until: f.until.value, img: f.img.value, featured: f.featured.checked, active: f.active.checked });
        toast(p ? 'Акция сохранена' : 'Акция опубликована'); cur = 'promos'; shell();
      });
  }

  isIn() ? shell() : login();
});
