/* Софьюшка — демо-хранилище. Все данные живут в localStorage этого браузера.
   Позже этот слой заменяется запросами к настоящему серверу. */
(function () {
  const KEY = 'sofyushka.v2';
  // Картинки: товары — фото магазина «Софьюшка» на Ozon (ir.ozone.ru), настроение — Unsplash
  const U = (id, w = 900) => {
    if (id && id.includes('/')) { const [dir, file] = id.split('/'); return `https://ir.ozone.ru/s3/${dir}/wc${w > 600 ? 1000 : w > 250 ? 500 : 250}/${file}.jpg`; }
    return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  };
  const OZON = sku => `https://www.ozon.ru/product/${sku}/`;

  const CATEGORIES = [
    { id: 'raspashonki', name: 'Распашонки', img: 'multimedia-1-9/8238341601', from: 56, to: 92, tint: 'sky' },
    { id: 'polzunki', name: 'Ползунки', img: 'multimedia-1-8/8577681560', from: 56, to: 80, tint: 'blush' },
    { id: 'body', name: 'Боди', img: 'multimedia-1-3/12975926943', from: 56, to: 86, tint: 'butter' },
    { id: 'sets', name: 'Комплекты в роддом', img: 'multimedia-1-w/9634433036', from: 56, to: 62, tint: 'sage' },
    { id: 'pelenki', name: 'Пелёнки', img: 'multimedia-1-3/13285565535', from: 0, to: 0, tint: 'lilac' },
    { id: 'tops', name: 'Футболки', img: 'multimedia-1-t/11330959025', from: 74, to: 92, tint: 'blush' },
    { id: 'feeding', name: 'Кормление', img: 'multimedia-1-y/7295187310', from: 0, to: 0, tint: 'sky' },
  ];

  // Рост ребёнка = размер одежды (российская размерная сетка)
  const SIZES = [
    { cm: 50, age: 'до рождения' }, { cm: 56, age: '0–1 мес' }, { cm: 62, age: '1–3 мес' },
    { cm: 68, age: '3–6 мес' }, { cm: 74, age: '6–9 мес' }, { cm: 80, age: '9–12 мес' },
    { cm: 86, age: '1–1,5 года' }, { cm: 92, age: '1,5–2 года' },
  ];

  // Товары магазина «Софьюшка» на Ozon (цены и характеристики — по карточкам Ozon, сентябрь 2026).
  // Одинаковые товары разных артикулов объединены; остатки (stock) — демо.
  const g = s => s.split(' ');
  const PRODUCTS = [
    { id: 1, sku: '2706791174', name: 'Распашонки «Белый изумруд», 3 шт', cat: 'raspashonki', price: 1046, old: 2500, stock: 24, sizes: [62, 68, 74, 80, 86, 92],
      img: 'multimedia-1-y/8952386218', gallery: g('multimedia-1-y/8952386218 multimedia-1-b/11849619323 multimedia-1-a/8952386230 multimedia-1-p/8952386245'), tags: ['hit'],
      material: '100% хлопок, кулирная гладь', color: 'белый изумруд', qty: 3, rating: 4.9, reviews: 2485,
      desc: 'Лёгкие и воздушные кофточки с длинным рукавом: на выписку, для дома и сна. Подойдут и девочке, и мальчику.', care: 'Деликатная стирка 30°, без отбеливателя' },
    { id: 2, sku: '249910994', name: 'Ползунки разноцветные, 5 шт', cat: 'polzunki', price: 729, old: 3337, stock: 40, sizes: [56, 62, 68, 74, 80],
      img: 'multimedia-1-g/10858692616', gallery: g('multimedia-1-g/10858692616 multimedia-1-r/13043430675 multimedia-1-0/8749128708 multimedia-1-c/15070875636'), tags: ['hit'],
      material: '100% хлопок, интерлок', color: 'розовый, бирюзовый, жёлтый, зелёный, оранжевый', qty: 5, rating: 4.9, reviews: 12060,
      desc: 'Пять пар мягких ползунков на каждый день — дома, на прогулке и на выписку.', care: 'Бережная стирка 30°, без отбеливателя' },
    { id: 3, sku: '660362396', name: 'Распашонки голубые, 3 шт', cat: 'raspashonki', price: 892, old: 3000, stock: 18, sizes: [56, 62],
      img: 'multimedia-1-9/8238341601', gallery: g('multimedia-1-9/8238341601 multimedia-1-h/9104985161 multimedia-1-j/8238341611 multimedia-1-r/8238341619'), tags: [],
      material: '100% хлопок, интерлок', color: 'голубой, зелёный, белый', qty: 3, rating: 4.9, reviews: 2485,
      desc: 'Швы наружу — ничего не натирает нежную кожу. Принты не выцветают после многих стирок.', care: 'Ручная стирка до 40°, наизнанку' },
    { id: 4, sku: '4657254473', name: 'Распашонка для девочки, белая', cat: 'raspashonki', price: 1117, old: 5000, stock: 9, sizes: [68, 80, 92],
      img: 'multimedia-1-b/11331175655', gallery: g('multimedia-1-b/11331175655 multimedia-1-3/11331174279 multimedia-1-k/11331175988 multimedia-1-v/11331176503'), tags: ['new'],
      material: '100% хлопок', color: 'белый', qty: 1, rating: 4.9, reviews: 2485,
      desc: 'Однотонная распашонка на кнопках, с антицарапками. Легко надевать и снимать.', care: 'Бережная стирка 30°' },
    { id: 5, sku: '2477737395', name: 'Распашонки «Бэби розовый», 5 шт', cat: 'raspashonki', price: 1550, old: 0, stock: 12, sizes: [56, 80],
      img: 'multimedia-1-y/9112445278', gallery: g('multimedia-1-y/9112445278 multimedia-1-p/9112445305 multimedia-1-w/9101346152 multimedia-1-a/9112445290'), tags: [],
      material: '100% хлопок, кулирная гладь', color: 'бэби розовый', qty: 5, rating: 4.9, reviews: 2485,
      desc: 'Пять кофточек разных расцветок: на выписку летом и на весь первый год дома.', care: 'Деликатная стирка 30°' },
    { id: 6, sku: '2477737431', name: 'Распашонки для мальчика, 5 шт', cat: 'raspashonki', price: 1671, old: 4000, stock: 7, sizes: [56],
      img: 'multimedia-1-g/9112442848', gallery: g('multimedia-1-g/9112442848 multimedia-1-3/9217550343 multimedia-1-9/9101331801 multimedia-1-l/9112442853'), tags: [],
      material: '100% хлопок, кулирная гладь', color: 'голубые оттенки', qty: 5, rating: 4.9, reviews: 2485,
      desc: 'Набор лёгких распашонок в спокойных цветах — дышат и быстро сохнут.', care: 'Деликатная стирка 30°' },
    { id: 7, sku: '3401854065', name: 'Распашонки «Детская мечта», 3 шт', cat: 'raspashonki', price: 1031, old: 3000, stock: 15, sizes: [62, 68, 74, 80],
      img: 'multimedia-1-e/8825748494', gallery: g('multimedia-1-e/8825748494 multimedia-1-1/8951959009 multimedia-1-i/8825748642 multimedia-1-x/8825748657'), tags: [],
      material: '100% хлопок', color: 'детская мечта', qty: 3, rating: 4.9, reviews: 2485,
      desc: 'Однотонные кофточки на кнопках одного размера — удобно в роддоме и на выписку.', care: 'Ручная стирка до 40°' },
    { id: 8, sku: '3475804054', name: 'Распашонки «Овечки», 2 шт', cat: 'raspashonki', price: 1127, old: 4000, stock: 11, sizes: [80, 86, 92],
      img: 'multimedia-1-e/12759100826', gallery: g('multimedia-1-e/12759100826 multimedia-1-q/8965082510 multimedia-1-i/12759101838 multimedia-1-n/12759100511'), tags: ['new'],
      material: '100% хлопок', color: 'овечки', qty: 2, rating: 4.9, reviews: 2485,
      desc: 'Мягкий крой без жёстких швов, милый принт с овечками. Для дома и прогулок.', care: 'Бережная стирка 30°' },
    { id: 9, sku: '3028584840', name: 'Ползунки «Индиго», 3 шт', cat: 'polzunki', price: 1119, old: 3000, stock: 16, sizes: [62, 68, 80],
      img: 'multimedia-1-8/8577681560', gallery: g('multimedia-1-8/8577681560 multimedia-1-w/9104808020 multimedia-1-h/8552841245 multimedia-1-4/8552841232'), tags: [],
      material: '100% хлопок, интерлок', color: 'индиго', qty: 3, rating: 4.9, reviews: 12060,
      desc: 'Тёплые штанишки, которые не стесняют движений. Хорошо сочетаются с боди и распашонками.', care: 'Деликатная стирка 30°' },
    { id: 10, sku: '3256395315', name: 'Ползунки молочные, 3 шт', cat: 'polzunki', price: 632, old: 2500, stock: 30, sizes: [62, 74, 80],
      img: 'multimedia-1-p/9184242625', gallery: g('multimedia-1-p/9184242625 multimedia-1-b/13044490895 multimedia-1-f/13044490791 multimedia-1-8/13044485492'), tags: ['hit'],
      material: '100% хлопок, интерлок', color: 'молочный', qty: 3, rating: 4.9, reviews: 12060,
      desc: 'Нежные ползунки спокойного молочного цвета на каждый день.', care: 'Ручная стирка до 40°' },
    { id: 11, sku: '3028584785', name: 'Ползунки на каждый день, 3 шт', cat: 'polzunki', price: 1299, old: 3500, stock: 4, sizes: [62],
      img: 'multimedia-1-w/8577675500', gallery: g('multimedia-1-w/8577675500 multimedia-1-4/9104807992 multimedia-1-0/8577675288 multimedia-1-4/8577675328'), tags: [],
      material: '100% хлопок, интерлок', color: 'разноцветные', qty: 3, rating: 4.9, reviews: 12060,
      desc: 'Удобные штанишки для дома и поездки в роддом.', care: 'Деликатная стирка 30°' },
    { id: 12, sku: '4935400821', name: 'Боди с длинным рукавом, 2 шт', cat: 'body', price: 1487, old: 3500, stock: 20, sizes: [56, 62, 68],
      img: 'multimedia-1-3/12975926943', gallery: g('multimedia-1-3/12975926943 multimedia-1-c/12975930084 multimedia-1-i/12114602010 multimedia-1-a/12975928606'), tags: ['hit'],
      material: '100% хлопок, интерлок в рубчик', color: 'универсальный', qty: 2, rating: 4.9, reviews: 738,
      desc: 'С антицарапками и застёжкой спереди. Плоские швы не натирают.', care: 'Деликатная стирка 30°, без отбеливателя' },
    { id: 13, sku: '4935400448', name: 'Боди для девочки, 2 шт', cat: 'body', price: 900, old: 3500, stock: 14, sizes: [62, 68],
      img: 'multimedia-1-5/12975894833', gallery: g('multimedia-1-5/12975894833 multimedia-1-r/12114600507 multimedia-1-3/12975893319 multimedia-1-k/12975890636'), tags: ['new'],
      material: '100% хлопок, интерлок', color: 'для девочек', qty: 2, rating: 4.9, reviews: 738,
      desc: 'Длинный рукав, кнопки спереди и мягкий U-вырез — переодевать быстро и легко.', care: 'Деликатная стирка 30°' },
    { id: 14, sku: '2490875657', name: 'Боди на кнопках, 3 шт', cat: 'body', price: 1746, old: 4000, stock: 10, sizes: [80, 86],
      img: 'multimedia-1-d/8720792077', gallery: g('multimedia-1-d/8720792077 multimedia-1-l/9104915181 multimedia-1-w/8720791952 multimedia-1-p/8720791945'), tags: [],
      material: '100% хлопок, интерлок', color: 'нежные цвета', qty: 3, rating: 4.9, reviews: 738,
      desc: 'Дышащие боди, которые хорошо впитывают влагу. Подходят и для выписки.', care: 'Бережная стирка 30°' },
    { id: 15, sku: '3220657450', name: 'Боди с коротким рукавом «Космос», 3 шт', cat: 'body', price: 1256, old: 3000, stock: 8, sizes: [86],
      img: 'multimedia-1-r/8511575175', gallery: g('multimedia-1-r/8511575175 multimedia-1-w/8892012488 multimedia-1-c/8511575088 multimedia-1-8/8511575120'), tags: [],
      material: '100% хлопок, кулирная гладь', color: 'синий, голубой, серый, белый', qty: 3, rating: 4.9, reviews: 738,
      desc: 'Лёгкие бодики на жаркое лето, на кнопках-клёпках.', care: 'Ручная стирка до 40°' },
    { id: 16, sku: '3843144539', name: 'Комплект в роддом «Облачко»', cat: 'sets', price: 1337, old: 5000, stock: 6, sizes: [62],
      img: 'multimedia-1-w/9634433036', gallery: g('multimedia-1-w/9634433036 multimedia-1-u/13088217162 multimedia-1-q/13088217266 multimedia-1-a/13088217754'), tags: ['new'],
      material: '100% хлопок', color: 'облачко', qty: 3, rating: 4.9, reviews: 38,
      desc: 'Распашонка, ползунки и чепчик — всё для первых дней и выписки.', care: 'Бережная стирка 30°' },
    { id: 17, sku: '3843144424', name: 'Комплект в роддом, шоколадный', cat: 'sets', price: 1067, old: 5000, stock: 5, sizes: [62],
      img: 'multimedia-1-j/9634433095', gallery: g('multimedia-1-j/9634433095 multimedia-1-6/13088426010 multimedia-1-k/13088426060 multimedia-1-h/13088425985'), tags: [],
      material: '100% хлопок', color: 'коричневый', qty: 3, rating: 4.9, reviews: 38,
      desc: 'Распашонка, ползунки и чепчик тёплого шоколадного оттенка.', care: 'Бережная стирка 30°' },
    { id: 18, sku: '3843144031', name: 'Комплект в роддом, бежевый', cat: 'sets', price: 984, old: 5000, stock: 7, sizes: [62],
      img: 'multimedia-1-l/9634432737', gallery: g('multimedia-1-l/9634432737 multimedia-1-i/13088420874 multimedia-1-8/13088420612 multimedia-1-1/13088426473'), tags: [],
      material: '100% хлопок', color: 'бежевый', qty: 3, rating: 4.9, reviews: 38,
      desc: 'Спокойный бежевый комплект из трёх вещей — на выписку и для дома.', care: 'Бережная стирка 30°' },
    { id: 19, sku: '3843144751', name: 'Комплект в роддом, 3 предмета', cat: 'sets', price: 1200, old: 0, stock: 3, sizes: [62],
      img: 'multimedia-1-x/9634433037', gallery: g('multimedia-1-x/9634433037 multimedia-1-g/13088418100 multimedia-1-v/13088409943 multimedia-1-f/13088409639'), tags: [],
      material: '100% хлопок', color: '', qty: 3, rating: 4.9, reviews: 38,
      desc: 'Распашонка, ползунки и чепчик из мягкого хлопка.', care: 'Бережная стирка 30°' },
    { id: 20, sku: '3842773386', name: 'Пелёнки «Мультяшные» 100×100, 5 шт', cat: 'pelenki', price: 1057, old: 5000, stock: 22, sizes: [], dims: '100×100 см',
      img: 'multimedia-1-6/13044905070', gallery: g('multimedia-1-6/13044905070 multimedia-1-l/9633787761 multimedia-1-y/13044903442 multimedia-1-i/13044903354'), tags: ['hit'],
      material: '100% хлопок, кулирная гладь', color: 'мультяшный', qty: 5, rating: 4.9, reviews: 1482,
      desc: 'Для пеленания, как лёгкий плед, простынка в кроватку или полотенце после купания.', care: 'Бережная стирка 30°' },
    { id: 21, sku: '4061069102', name: 'Пелёнки для мальчика 100×100, 5 шт', cat: 'pelenki', price: 1122, old: 5000, stock: 17, sizes: [], dims: '100×100 см',
      img: 'multimedia-1-3/13285565535', gallery: g('multimedia-1-3/13285565535 multimedia-1-c/10005797640 multimedia-1-l/13285566165 multimedia-1-r/13285565631'), tags: [],
      material: '100% хлопок, кулирная гладь', color: 'для мальчиков', qty: 5, rating: 4.9, reviews: 1482,
      desc: 'Большие мягкие пелёнки, которые выдерживают частые стирки.', care: 'Бережная стирка 30°' },
    { id: 22, sku: '3401809975', name: 'Пелёнки «Мечта» 100×100, 3 шт', cat: 'pelenki', price: 742, old: 2000, stock: 25, sizes: [], dims: '100×100 см',
      img: 'multimedia-1-h/8825657633', gallery: g('multimedia-1-h/8825657633 multimedia-1-0/9175042440 multimedia-1-m/9175042534 multimedia-1-a/9175042486'), tags: [],
      material: '100% хлопок, кулирная гладь', color: 'мечта', qty: 3, rating: 4.9, reviews: 1482,
      desc: 'Воздушные многоразовые пелёнки: в роддом, в коляску и в кроватку.', care: 'Бережная стирка 30°' },
    { id: 23, sku: '3401809735', name: 'Тёплые пелёнки из футера 80×100, 4 шт', cat: 'pelenki', price: 1488, old: 3500, stock: 9, sizes: [], dims: '80×100 см',
      img: 'multimedia-1-9/13045337901', gallery: g('multimedia-1-9/13045337901 multimedia-1-i/13045341186 multimedia-1-8/13045338980 multimedia-1-b/13045341971'), tags: ['new'],
      material: '100% хлопок, футер с начёсом', color: '', qty: 4, rating: 4.9, reviews: 1482,
      desc: 'Футер с начёсом: не замёрзнет после купания и не перегреется.', care: 'Деликатная стирка 30°' },
    { id: 24, sku: '4657139882', name: 'Футболки для девочки, 5 шт', cat: 'tops', price: 1075, old: 4000, stock: 13, sizes: [80, 92],
      img: 'multimedia-1-t/11330959025', gallery: g('multimedia-1-t/11330959025 multimedia-1-i/11330959914 multimedia-1-3/11330959251 multimedia-1-3/11330960151'), tags: ['new'],
      material: '100% хлопок', color: 'для девочек', qty: 5, rating: 4.9, reviews: 39,
      desc: 'Лёгкие дышащие футболки на лето — для дома и прогулок.', care: 'Бережная стирка 30°' },
    { id: 25, sku: '1849659216', name: 'Бутылочка для кормления 60 мл', cat: 'feeding', price: 201, old: 700, stock: 50, sizes: [], dims: '0+ мес',
      img: 'multimedia-1-y/7295187310', gallery: g('multimedia-1-y/7295187310 multimedia-1-v/7295187307 multimedia-1-z/7295187311 multimedia-1-s/7295187304'), tags: [],
      material: 'Силиконовая соска', color: 'молочный', qty: 1, rating: 4.9, reviews: 183,
      desc: 'Мягкая силиконовая соска, по форме близкая к маминой груди. Для малышей с рождения.', care: '' },
  ];

  const PROMOS = [
    { id: 1, title: 'Собираемся в роддом', text: 'Комплекты, пелёнки и распашонки — мягче к цене', discount: 10, code: 'РОДДОМ10', until: '2026-10-15', active: true, featured: true, img: '1607322851003-f5a88dc5b960' },
    { id: 2, title: 'Первый заказ', text: '500 бонусов за регистрацию', discount: 0, code: '', until: '', active: true, featured: false, img: '1560707854-fb9a10eeaace' },
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
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.products) return s; } catch (e) {}
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
          key, method, login: data.login, name: data.name || '', bonus: 500, spent: 0,
          child: { name: '', cm: 68, birthday: '' }, marketing: !!data.marketing,
          consentAt: new Date().toISOString(), orders: [],
          history: [{ date: new Date().toISOString(), text: 'Подарок за регистрацию', amount: 500 }],
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
