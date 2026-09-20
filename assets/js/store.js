/* Софьюшка — демо-хранилище. Все данные живут в localStorage этого браузера.
   Позже этот слой заменяется запросами к настоящему серверу. */
(function () {
  const KEY = 'sofyushka.v3';
  // Картинки: товары — фото магазина «Софьюшка» на Ozon (ir.ozone.ru), настроение — Unsplash
  const U = (id, w = 900) => {
    if (id && id.includes('/')) { const [dir, file] = id.split('/'); return `https://ir.ozone.ru/s3/${dir}/wc${w > 600 ? 1000 : w > 250 ? 500 : 250}/${file}.jpg`; }
    return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  };
  const OZON = sku => `https://www.ozon.ru/product/${sku}/`;

  const SRC = window.SOFY || { categories: [], products: [] };
  const CATEGORIES = SRC.categories;

  // Рост ребёнка = размер одежды (российская размерная сетка)
  const SIZES = [
    { cm: 50, age: 'до рождения' }, { cm: 56, age: '0–1 мес' }, { cm: 62, age: '1–3 мес' },
    { cm: 68, age: '3–6 мес' }, { cm: 74, age: '6–9 мес' }, { cm: 80, age: '9–12 мес' },
    { cm: 86, age: '1–1,5 года' }, { cm: 92, age: '1,5–2 года' },
  ];

  const PRODUCTS = SRC.products;

  const PROMOS = [
    { id: 1, title: 'Собираемся в роддом', text: 'Комплекты, пелёнки и распашонки — мягче к цене', discount: 10, code: 'РОДДОМ10', until: '2026-10-15', active: true, featured: true, img: '1607322851003-f5a88dc5b960' },
    { id: 2, title: 'Первый заказ', text: '100 бонусов за регистрацию', discount: 0, code: '', until: '', active: true, featured: false, img: '1560707854-fb9a10eeaace' },
    { id: 3, title: 'День рождения малыша', text: 'Двойные бонусы всю неделю', discount: 0, code: '', until: '', active: true, featured: false, img: '1546015720-b8b30df5aa27' },
  ];

  const LEVELS = [
    { id: 'sprout', name: 'Росток', from: 0, cash: 3 },
    { id: 'grow', name: 'Подрастаю', from: 15000, cash: 5 },
    { id: 'big', name: 'Большой', from: 40000, cash: 7 },
  ];

  const ORDER_STEPS = ['Оформлен', 'Оплачен', 'Собран', 'В пути', 'Доставлен'];
  const PAY_STATUSES = ['Ожидает оплаты', 'Оплачен', 'Возврат', 'Отменён'];

  const today = new Date();
  const daysAgo = n => new Date(today.getTime() - n * 864e5).toISOString();
  const ORDERS = [
    { id: 10431, date: daysAgo(0), client: 'Анна К.', phone: '+7 916 ••• 12 40', items: [{ id: 16, size: 62, qty: 1 }, { id: 20, size: 0, qty: 1 }], pay: 'Ожидает оплаты', step: 0, method: 'СБП' },
    { id: 10430, date: daysAgo(1), client: 'Мария П.', phone: '+7 921 ••• 55 03', items: [{ id: 2, size: 62, qty: 2 }], pay: 'Оплачен', step: 2, method: 'Карта' },
    { id: 10429, date: daysAgo(1), client: 'Екатерина В.', phone: '+7 903 ••• 71 18', items: [{ id: 12, size: 62, qty: 1 }, { id: 1, size: 62, qty: 1 }], pay: 'Оплачен', step: 3, method: 'Карта' },
    { id: 10427, date: daysAgo(3), client: 'Ольга С.', phone: '+7 985 ••• 00 91', items: [{ id: 17, size: 62, qty: 1 }, { id: 22, size: 0, qty: 1 }], pay: 'Оплачен', step: 4, method: 'Карта' },
    { id: 10424, date: daysAgo(5), client: 'Дарья М.', phone: '+7 926 ••• 38 66', items: [{ id: 24, size: 92, qty: 1 }], pay: 'Возврат', step: 4, method: 'СБП' },
    { id: 10422, date: daysAgo(6), client: 'Ирина Л.', phone: '+7 999 ••• 24 57', items: [{ id: 10, size: 74, qty: 2 }], pay: 'Отменён', step: 0, method: 'При получении' },
  ];

  function seed() {
    return { products: PRODUCTS, promos: PROMOS, orders: ORDERS, cart: [], fav: [], user: null, users: {}, cookie: null, nextId: { product: 100, promo: 10, order: 10432 } };
  }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.products && s.products.length) return s; } catch (e) {}
    return seed();
  }
  let db = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} emit(); }
  const subs = [];
  function emit() { subs.forEach(f => { try { f(db); } catch (e) { console.error(e); } }); }

  const priceOf = p => p.price;
  const S = {
    U, OZON, SIZES, CATEGORIES, LEVELS, ORDER_STEPS, PAY_STATUSES,
    on(f) { subs.push(f); },
    reset() { db = seed(); save(); },
    cat: id => CATEGORIES.find(c => c.id === id),
    // товары
    products: () => db.products,
    product: id => db.products.find(p => p.id === +id),
    saveProduct(p) {
      if (!p.id) { p.id = db.nextId.product++; db.products.unshift(p); }
      else { const i = db.products.findIndex(x => x.id === p.id); db.products[i] = { ...db.products[i], ...p }; }
      save(); return p;
    },
    deleteProduct(id) { db.products = db.products.filter(p => p.id !== id); save(); },
    search(q, opts = {}) {
      const norm = t => t.toLowerCase().replace(/ё/g, 'е');
      q = norm((q || '').trim());
      return db.products.filter(p => {
        if (q) {
          const c = S.cat(p.cat);
          const hay = norm(p.name + ' ' + (c ? c.name : '') + ' ' + p.color + ' ' + p.material + ' ' + (p.sku || ''));
          if (!q.split(/\s+/).every(w => hay.includes(w) || (w.length > 4 && hay.includes(w.slice(0, -1))))) return false;
        }
        if (opts.cat && p.cat !== opts.cat) return false;
        if (opts.size && !p.sizes.includes(+opts.size)) return false;
        if (opts.tag && !p.tags.includes(opts.tag)) return false;
        if (opts.max && p.price > opts.max) return false;
        if (opts.inStock && p.stock <= 0) return false;
        return true;
      });
    },
    // избранное
    fav: () => db.fav,
    toggleFav(id) { db.fav = db.fav.includes(id) ? db.fav.filter(x => x !== id) : [...db.fav, id]; save(); return db.fav.includes(id); },
    // корзина
    cart: () => db.cart.map(l => ({ ...l, p: S.product(l.id) })).filter(l => l.p),
    cartCount: () => db.cart.reduce((a, l) => a + l.qty, 0),
    addToCart(id, size, qty = 1) {
      const l = db.cart.find(x => x.id === id && x.size === size);
      if (l) l.qty += qty; else db.cart.push({ id, size, qty });
      save();
    },
    setQty(id, size, qty) {
      const l = db.cart.find(x => x.id === id && x.size === size); if (!l) return;
      if (qty <= 0) db.cart = db.cart.filter(x => x !== l); else l.qty = qty;
      save();
    },
    clearCart() { db.cart = []; save(); },
    cartTotal: () => S.cart().reduce((a, l) => a + priceOf(l.p) * l.qty, 0),
    // акции
    promos: () => db.promos,
    activePromos: () => db.promos.filter(p => p.active),
    featuredPromo: () => db.promos.find(p => p.active && p.featured) || db.promos.find(p => p.active),
    promoByCode: code => db.promos.find(p => p.active && p.code && p.code.toLowerCase() === (code || '').trim().toLowerCase()),
    savePromo(p) {
      if (p.featured) db.promos.forEach(x => x.featured = false);
      if (!p.id) { p.id = db.nextId.promo++; db.promos.unshift(p); }
      else { const i = db.promos.findIndex(x => x.id === p.id); db.promos[i] = { ...db.promos[i], ...p }; }
      save(); return p;
    },
    deletePromo(id) { db.promos = db.promos.filter(p => p.id !== id); save(); },
    // покупатель
    user: () => db.user,
    login(method, data) {
      const key = method + ':' + (data.login || '');
      let u = db.users[key];
      if (!u) {
        u = {
          key, method, login: data.login, name: data.name || '', bonus: 100, spent: 0,
          child: { name: '', cm: 68, birthday: '' }, marketing: !!data.marketing,
          consentAt: new Date().toISOString(), orders: [],
          history: [{ date: new Date().toISOString(), text: 'Подарок за регистрацию', amount: 100 }],
        };
        // для наглядности демо: у нового кабинета есть пара прошлых заказов
        u.orders = [10429, 10427];
        u.spent = 9870;
        u.history.unshift({ date: daysAgo(3), text: 'Заказ № 10427', amount: 150 }, { date: daysAgo(1), text: 'Заказ № 10429', amount: 146 });
        u.bonus += 296;
        db.users[key] = u;
      }
      db.user = u; save(); return u;
    },
    updateUser(patch) { if (!db.user) return; Object.assign(db.user, patch); db.users[db.user.key] = db.user; save(); },
    logout() { db.user = null; save(); },
    level(spent) {
      let lv = LEVELS[0]; LEVELS.forEach(l => { if (spent >= l.from) lv = l; });
      const next = LEVELS[LEVELS.indexOf(lv) + 1] || null;
      return { ...lv, next, toNext: next ? next.from - spent : 0, progress: next ? (spent - lv.from) / (next.from - lv.from) : 1 };
    },
    // заказы
    orders: () => db.orders,
    order: id => db.orders.find(o => o.id === +id),
    orderSum: o => o.total != null ? o.total : o.items.reduce((a, l) => { const p = S.product(l.id); return a + (p ? p.price : 0) * l.qty; }, 0),
    setOrder(id, patch) { const o = S.order(id); if (o) Object.assign(o, patch); save(); },
    placeOrder(form) {
      const lines = S.cart();
      const sub = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
      const promo = form.code ? S.promoByCode(form.code) : null;
      const disc = promo && promo.discount ? Math.round(sub * promo.discount / 100) : 0;
      const u = db.user;
      const useBonus = u && form.useBonus ? Math.min(u.bonus, Math.floor((sub - disc) * 0.3)) : 0;
      const delivery = sub - disc >= 5000 ? 0 : 350;
      const total = sub - disc - useBonus + delivery;
      const id = db.nextId.order++;
      const order = {
        id, date: new Date().toISOString(), client: form.name, phone: form.phone,
        items: lines.map(l => ({ id: l.id, size: l.size, qty: l.qty })),
        pay: form.payment === 'При получении' ? 'Ожидает оплаты' : 'Оплачен',
        step: form.payment === 'При получении' ? 0 : 1, method: form.payment, total, address: form.address, delivery: form.delivery,
      };
      lines.forEach(l => { const p = S.product(l.id); if (p) p.stock = Math.max(0, p.stock - l.qty); });
      db.orders.unshift(order);
      let earned = 0;
      if (u) {
        const lv = S.level(u.spent);
        earned = Math.round((total - delivery) * lv.cash / 100);
        u.bonus = u.bonus - useBonus + earned; u.spent += total - delivery;
        u.orders.unshift(id);
        if (useBonus) u.history.unshift({ date: order.date, text: 'Оплата заказа № ' + id, amount: -useBonus });
        u.history.unshift({ date: order.date, text: 'Заказ № ' + id, amount: earned });
        db.users[u.key] = u;
      }
      db.cart = []; save();
      return { order, earned, useBonus, disc, delivery };
    },
    // cookie
    cookie: () => db.cookie,
    setCookie(v) { db.cookie = v ? { ...v, at: new Date().toISOString() } : null; save(); },
    // форматирование
    rub: n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽',
    num: n => new Intl.NumberFormat('ru-RU').format(Math.round(n)),
    date: iso => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    ageFor: cm => (SIZES.find(s => s.cm === +cm) || {}).age || '',
  };
  window.S = S;
  window.addEventListener('storage', e => { if (e.key === KEY) { db = load(); emit(); } });
})();
