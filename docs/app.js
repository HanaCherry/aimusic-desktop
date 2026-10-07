'use strict';
(async () => {
  const response = await fetch('locales.json');
  if (!response.ok) throw new Error('Translations unavailable');
  const locales = await response.json();
  const select = document.getElementById('language');
  select.replaceChildren(...Object.entries(locales).map(([code, text]) => {
    const option = document.createElement('option'); option.value = code; option.textContent = text.name; option.lang = code; return option;
  }));
  function resolve(value) {
    if (Object.hasOwn(locales, value)) return value;
    if (/^zh-(tw|hk|hant)/i.test(value || '')) return 'zh-TW';
    const base = String(value || '').toLowerCase().split('-')[0];
    return Object.hasOwn(locales, base) ? base : 'en';
  }
  function render(code, updateURL = false) {
    const text = locales[code];
    document.documentElement.lang = code;
    document.documentElement.dir = ['ar', 'he'].includes(code) ? 'rtl' : 'ltr';
    select.value = code;
    document.title = `AI Music Desktop — ${text.hero}`;
    document.querySelector('meta[name=description]').content = text.lead;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = text.lead;
    for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = text[node.dataset.i18n];
    for (const node of document.querySelectorAll('[data-feature]')) {
      const [title, description] = text[node.dataset.feature].split('::');
      node.querySelector('h3').textContent = title; node.querySelector('p').textContent = description;
    }
    document.getElementById('readmeLink').href = `https://github.com/HanaCherry/aimusic-desktop/blob/main/${code === 'fr' ? 'README.md' : `README.${code}.md`}`;
    if (updateURL) { const url = new URL(location.href); url.searchParams.set('lang', code); history.replaceState(null, '', url); }
  }
  render(resolve(new URL(location.href).searchParams.get('lang') || navigator.language || 'fr'));
  select.addEventListener('change', () => render(select.value, true));
  window.addEventListener('popstate', () => render(resolve(new URL(location.href).searchParams.get('lang') || navigator.language)));
})().catch(() => {
  document.getElementById('language').disabled = true;
  const message = document.createElement('p'); message.className = 'noscript'; message.textContent = 'Traductions indisponibles. Retrouvez les 32 présentations dans les README du dépôt GitHub.'; document.querySelector('main').append(message);
});
