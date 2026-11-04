const translations = {
  ru: {
    navHow: 'Как это работает', navEngines: 'Поисковые системы', navFaq: 'FAQ', navPrivacy: 'Конфиденциальность', language: 'Язык', getExtension: 'Установить ↗',
    eyebrow: 'БОЛЬШЕ СВОБОДЫ ВЫБОРА', heroLine1: 'Ваш поиск.', heroLine2: 'Ваш выбор.',
    lead: 'Девять поисковых систем. Один переключатель. Выберите любимую и продолжайте искать через адресную строку.',
    addChrome: 'Добавить в Chrome', detail: 'Без регистрации. Ваш выбор сохраняется.', demoLabel: 'ПОПРОБУЙТЕ ПЕРЕКЛЮЧИТЬ',
    popupTitle: 'Поисковая система', popupNote: 'Запросы из адресной строки и с поддерживаемых поисковых сайтов будут открываться в выбранной поисковой системе.',
    demoNote: 'Это интерактивный пример. Настройки вашего браузера не меняются.',
    enginesKicker: 'НАЙДИТЕ СВОЙ ПОИСК', enginesLead: 'Привычные результаты, новый взгляд или ответы ИИ. Решать вам.',
    howKicker: 'МЕНЬШЕ НАСТРОЕК. БОЛЬШЕ ПОИСКА.', howTitle: 'Три шага — и всё готово.',
    step1Title: 'Откройте расширение', step1: 'Нажмите на его значок рядом с адресной строкой Chrome.',
    step2Title: 'Выберите поисковик', step2: 'Один из девяти вариантов. Меняйте его в любой момент.',
    step3Title: 'Ищите как обычно', step3: 'Введите запрос в адресной строке с поддерживаемым поисковиком. Расширение перенаправит вас в выбранную систему.',
    clarityKicker: 'НЕМНОГО ПОДРОБНЕЕ', clarityTitle: 'Переключатель для ваших запросов.',
    clarity: 'Расширение перенаправляет поиск с поддерживаемых сайтов в выбранную систему. Это работает и при поиске прямо на этих сайтах. Поисковик, указанный в настройках Chrome, при этом не меняется.',
    faqKicker: 'ОТВЕТЫ НА ВОПРОСЫ', faqTitle: 'Полезно знать.',
    faq1: 'Мой выбор сохранится?', answer1: 'Да. Выбор хранится локально в Chrome и восстанавливается после перезапуска браузера.',
    faq2: 'Поиск из адресной строки работает?', answer2: 'Да, если текущий поисковик Chrome — один из девяти поддерживаемых. Запросы к другим поисковикам и неподдерживаемые адреса поиска не перенаправляются.',
    faq3: 'Нужен аккаунт?', answer3: 'Нет. Установите расширение, выберите поисковик и начните искать.',
    faq4: 'Этот пример меняет мой поисковик?', answer4: 'Нет. Пример только показывает интерфейс. Чтобы перенаправлять запросы, установите расширение.',
    installKicker: 'ВЫБИРАЙТЕ СВОЁ', installTitle: 'Один клик. Новое направление.', installLead: 'Ваш следующий поиск начинается с выбора.',
    privacy: 'Конфиденциальность (на английском)', pageTitle: 'Set Default Search Engine — ваш поиск, ваш выбор',
    description: 'Выбирайте из девяти поисковых систем в одном простом расширении Chrome. Ваш поиск, ваш выбор.', demoAria: 'Демонстрация расширения'
  }
};
translations.en = {};
for (const node of document.querySelectorAll('[data-i18n]')) translations.en[node.dataset.i18n] = node.textContent;
translations.en.pageTitle = document.title;
translations.en.description = document.querySelector('meta[name="description"]').content;
translations.en.demoAria = 'Extension demo';
const languageSelect = document.getElementById('language');
function setLanguage(language) {
  const strings = translations[language];
  document.documentElement.lang = language;
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = strings[node.dataset.i18n];
  document.title = strings.pageTitle;
  document.querySelector('meta[name="description"]').content = strings.description;
  document.querySelector('.demo-popup').setAttribute('aria-label', strings.demoAria);
  document.getElementById('demo-engines').setAttribute('aria-label', strings.navEngines);
  languageSelect.value = language;
}
let preferred;
try { preferred = localStorage.getItem('siteLanguage'); } catch {}
setLanguage(['en', 'ru'].includes(preferred) ? preferred : (navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'));
languageSelect.addEventListener('change', () => {
  setLanguage(languageSelect.value);
  try { localStorage.setItem('siteLanguage', languageSelect.value); } catch {}
});
const engines = [
  ['google', 'Google'], ['bing', 'Bing'], ['duckduckgo', 'DuckDuckGo'], ['yahoo', 'Yahoo'],
  ['qwant', 'Qwant'], ['perplexity', 'Perplexity'], ['startpage', 'Startpage'], ['ecosia', 'Ecosia'], ['brave', 'Brave']
];
const grid = document.getElementById('demo-engines');
const list = document.getElementById('engine-list');
const selected = document.getElementById('selected-name');
for (const [id, name] of engines) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'demo-engine';
  button.setAttribute('aria-label', name);
  button.setAttribute('aria-pressed', String(id === 'google'));
  button.classList.toggle('active', id === 'google');
  const logo = document.createElement('span');
  logo.className = 'demo-mark';
  const image = document.createElement('img');
  image.src = `assets/engines/${id}.png`;
  image.alt = '';
  image.addEventListener('error', () => { logo.textContent = name[0]; });
  logo.append(image);
  button.append(logo, document.createTextNode(name));
  button.addEventListener('click', () => {
    selected.textContent = name;
    for (const item of grid.children) {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    }
  });
  grid.append(button);
  const item = document.createElement('span');
  item.append(image.cloneNode(), document.createTextNode(name));
  list.append(item);
}
