<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>Ваша музика. Ваша студія.</strong></p>
<p align="center">Простір Windows для творчості з AI Music, прослуховування композицій і налаштування звучання.</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=uk"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Завантажити для Windows</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=uk">Студія на ваш смак</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">Переглянути код</a></p>

<details>
<summary align="center">🌐 Українська · 32 languages</summary>
<p align="center">
<a href="README.md" lang="fr">Français</a> ·
<a href="README.en.md" lang="en">English</a> ·
<a href="README.es.md" lang="es">Español</a> ·
<a href="README.pt.md" lang="pt">Português</a> ·
<a href="README.de.md" lang="de">Deutsch</a> ·
<a href="README.it.md" lang="it">Italiano</a> ·
<a href="README.ja.md" lang="ja">日本語</a> ·
<a href="README.ko.md" lang="ko">한국어</a> ·
<a href="README.zh.md" lang="zh">简体中文</a> ·
<a href="README.zh-TW.md" lang="zh-TW">繁體中文</a> ·
<a href="README.ar.md" lang="ar">العربية</a> ·
<a href="README.ru.md" lang="ru">Русский</a> ·
<a href="README.hi.md" lang="hi">हिन्दी</a> ·
<a href="README.tr.md" lang="tr">Türkçe</a> ·
<a href="README.pl.md" lang="pl">Polski</a> ·
<a href="README.nl.md" lang="nl">Nederlands</a> ·
<a href="README.id.md" lang="id">Bahasa Indonesia</a> ·
<a href="README.vi.md" lang="vi">Tiếng Việt</a> ·
<a href="README.th.md" lang="th">ไทย</a> ·
<a href="README.uk.md" lang="uk">Українська</a> ·
<a href="README.sv.md" lang="sv">Svenska</a> ·
<a href="README.cs.md" lang="cs">Čeština</a> ·
<a href="README.ro.md" lang="ro">Română</a> ·
<a href="README.el.md" lang="el">Ελληνικά</a> ·
<a href="README.hu.md" lang="hu">Magyar</a> ·
<a href="README.fi.md" lang="fi">Suomi</a> ·
<a href="README.da.md" lang="da">Dansk</a> ·
<a href="README.no.md" lang="no">Norsk</a> ·
<a href="README.he.md" lang="he">עברית</a> ·
<a href="README.ca.md" lang="ca">Català</a> ·
<a href="README.ms.md" lang="ms">Bahasa Melayu</a> ·
<a href="README.tl.md" lang="tl">Filipino</a>
</p>
</details>

<p align="center"><img src="docs/studio.svg" alt="AI Music Desktop" width="1100"></p>
<p align="center"><sub>Ілюстрація інтерфейсу без даних облікових записів.</sub></p>

## Студія на ваш смак

- **Вбудований програвач** — Нерухома обкладинка, прозора панель, кольоровий прогрес і керування відтворенням унизу.

- **Кольори й атмосфера** — Galaxy, Музика, Ніч, Світла й Офіційна теми. Кольори обкладинки супроводжують прослуховування.

- **Еквалайзер та ефекти** — Десять смуг, передпідсилювач, пресети, A/B, ширина стерео, панорама, автопанорама, реверберація, луна та спектр.

- **Локальний профіль** — Додайте фото й псевдонім. Налаштування та аудіопресети залишаються на комп’ютері.

- **Кеш під час запуску** — Дисковий кеш повторно використовує доступні ресурси. Очищення зберігає сеанс і налаштування.

- **Кредити на видноті** — Переглядайте баланс AI Music і користуйтеся справжніми інструментами сервісу.

## Готові відкрити студію?

1. Завантажте інсталятор Windows зі сторінки випуску. → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. Запустіть файл .exe та дотримуйтесь інструкцій.
3. Відкрийте AI Music Desktop і за потреби увійдіть до сервісу.

> Інсталятор не підписаний; Windows може показати попередження.

## Незалежний проєкт

Неофіційний застосунок, не пов’язаний з AI Music. Потрібен Інтернет. Ефекти й аналіз залежать від доступу до аудіопотоку; синтетичні тести не гарантують кожну віддалену композицію.

Презентація доступна 32 мовами. Локальний інтерфейс наразі французькою; мову сервісу можна вибрати в його меню.

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## Розробка

Node.js 22.12+ · pnpm · Windows x64

```sh
git clone https://github.com/HanaCherry/aimusic-desktop.git
cd aimusic-desktop
pnpm install --frozen-lockfile
node node_modules/electron/install.js
pnpm start
```

```sh
pnpm test
pnpm exec electron . --smoke-test
pnpm exec electron . --preview
pnpm dist
```

---

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=uk">Ваша музика. Ваша студія.</a></p>
