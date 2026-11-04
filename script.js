const translations = {
  ru: {
    explore: 'Посмотреть расширение', enginesTitle: 'Смените направление одним кликом.', restart: 'Ваш выбор сохраняется после перезапуска браузера', supported: 'Работает с поддерживаемыми поисковыми системами',
    navHow: 'Как это работает', navEngines: 'Поисковые системы', navFaq: 'FAQ', navPrivacy: 'Конфиденциальность', language: 'Язык', getExtension: 'Установить расширение',
    eyebrow: 'РАСШИРЕНИЕ ДЛЯ CHROME', heroLine1: 'Ищите так,', heroLine2: 'как вам удобно.',
    lead: 'Девять поисковых систем в одном простом окне. Выберите любимую — и следующий поиск из адресной строки откроется в ней.',
    addChrome: 'Добавить в Chrome', detail: 'Ваш выбор сохраняется после перезапуска браузера · Работает с поддерживаемыми поисковыми системами', demoLabel: 'ПОПРОБУЙТЕ ПЕРЕКЛЮЧИТЬ',
    popupTitle: 'Поисковая система', popupNote: 'Запросы из адресной строки и с поддерживаемых поисковых сайтов будут открываться в выбранной поисковой системе.',
    demoNote: 'Это интерактивный пример. Настройки вашего браузера не меняются.',
    enginesKicker: 'ОДНО ОКНО, ДЕВЯТЬ ВАРИАНТОВ', enginesLead: 'От привычных результатов Google до ответов Perplexity — ваш выбор всегда под рукой.',
    howKicker: 'ПОИСК СТАЛ ПРОЩЕ', howTitle: 'Три шага. Вот и всё.',
    step1Title: 'Откройте окно расширения', step1: 'Нажмите значок Set Default Search Engine рядом с адресной строкой Chrome.',
    step2Title: 'Выберите поисковик', step2: 'Выберите один из девяти вариантов. Ваш выбор сохранится после перезапуска браузера.',
    step3Title: 'Ищите как обычно', step3: 'Введите запрос в адресной строке Chrome. Результаты откроются в выбранной поисковой системе.',
    clarityKicker: 'ПОЛЕЗНО ЗНАТЬ', clarityTitle: 'Ваш поиск, ваш выбор.',
    clarity: 'Расширение перенаправляет поиск с поддерживаемых сайтов в выбранную систему. Это работает и при поиске прямо на этих сайтах. Поисковик, указанный в настройках Chrome, при этом не меняется.',
    faqKicker: 'ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ', faqTitle: 'Полезно знать',
    faq1: 'Мой выбор сохранится после перезапуска Chrome?', answer1: 'Да. Выбранная поисковая система хранится локально в браузере и восстанавливается при следующем открытии окна расширения.',
    faq2: 'Это работает с поиском из адресной строки?', answer2: 'Да, если поисковая система в настройках Chrome — одна из поддерживаемых. Расширение перенаправляет её страницу результатов в выбранную вами систему.',
    faq3: 'Нужен аккаунт?', answer3: 'Нет. Вы можете выбрать поисковик и искать без регистрации.',
    faq4: 'Этот пример меняет мой поисковик?', answer4: 'Нет. Пример только показывает интерфейс. Чтобы перенаправлять запросы, установите расширение.',
    installKicker: 'НАЧНИТЕ С ЛЮБИМОГО', installTitle: 'Девять способов найти ответ.', installLead: 'Выберите любимую поисковую систему и начните пользоваться расширением в Chrome.',
    privacy: 'Политика конфиденциальности', pageTitle: 'Set Default Search Engine — ваш поиск, ваш выбор',
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
  if (list) list.append(item);
}
