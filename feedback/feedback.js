const strings = {
  en: {},
  ru: {
    kicker: 'СПАСИБО, ЧТО ПОПРОБОВАЛИ РАСШИРЕНИЕ', title: 'Что мы можем улучшить?',
    intro: 'Ваш отзыв поможет улучшить Set Default Search Engine. Заполнять форму необязательно.',
    reasonLabel: 'Почему вы удалили расширение? (необязательно)', notWorking: 'Расширение работало не так, как ожидалось',
    redirects: 'Мне не понравилось перенаправление поиска', missingEngine: 'Не было нужного поисковика', notNeeded: 'Расширение больше не нужно', other: 'Другое',
    messageLabel: 'Хотите добавить что-нибудь ещё? (необязательно)',
    privacyNote: 'Ваш отзыв и версия расширения отправляются через Google Forms. Не указывайте пароли и другую конфиденциальную информацию.',
    send: 'Отправить отзыв', sending: 'Отправка…', thanks: 'Спасибо. Ваш отзыв отправлен.', back: 'Вернуться на сайт', privacy: 'Конфиденциальность (на английском)',
    empty: 'Выберите причину или напишите отзыв.', error: 'Не удалось отправить отзыв. Попробуйте ещё раз.', unavailable: 'Отправка отзывов временно недоступна. Попробуйте позже.'
  }
};
for (const el of document.querySelectorAll('[data-i18n]')) strings.en[el.dataset.i18n] = el.textContent;
Object.assign(strings.en, {sending: 'Sending…', empty: 'Please choose a reason or write a comment.', error: 'Could not send your feedback. Please try again.', unavailable: 'Feedback is temporarily unavailable. Please try again later.'});
const params = new URLSearchParams(location.search);
let saved;
try { saved = localStorage.getItem('siteLanguage'); } catch {}
const languages = [params.get('lang'), saved, navigator.language];
let language = languages.find(value => typeof value === 'string' && /^(en|ru)(-|$)/i.test(value))?.slice(0,2).toLowerCase() || 'en';
const selector = document.getElementById('language');
const form = document.getElementById('feedback-form');
const button = document.getElementById('submit');
const status = document.getElementById('status');
let statusKey = '';
function render() {
  document.documentElement.lang = language;
  document.title = `${strings[language].title} — Set Default Search Engine`;
  selector.value = language;
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const value = strings[language][el.dataset.i18n];
    if (el.textContent !== value) el.textContent = value;
  }
  status.textContent = strings[language][statusKey] || '';
}
selector.addEventListener('change', () => {
  language = selector.value;
  try { localStorage.setItem('siteLanguage', language); } catch {}
  render();
});
render();
button.disabled = false;
const FEEDBACK_ENDPOINT = 'https://defaultsearch-feedback-api.finitelyric4.chatgpt.site/feedback';
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;
  const data = new FormData(form);
  const reason = data.get('reason') || '';
  const message = String(data.get('message') || '').trim();
  if (!reason && !message) { statusKey = 'empty'; status.textContent = strings[language][statusKey]; return; }
  if (data.get('website')) return;
  button.disabled = true;
  selector.disabled = true;
  statusKey = 'sending';
  status.textContent = strings[language][statusKey];
  try {
    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      credentials: 'omit',
      body: JSON.stringify({reason, message, website: '', version: params.get('version') || '', language}),
      signal: AbortSignal.timeout(18000)
    });
    if (!response.ok) throw new Error('Feedback not accepted');
    const result = await response.json();
    if (result.ok !== true) throw new Error('Feedback not confirmed');
    statusKey = '';
    status.textContent = '';
    form.hidden = true;
    const thanks = document.getElementById('thanks');
    thanks.hidden = false;
    thanks.focus();
  } catch {
    statusKey = 'error';
    status.textContent = strings[language][statusKey];
  } finally {
    button.disabled = false;
    selector.disabled = false;
  }
});
