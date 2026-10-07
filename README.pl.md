<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>Twoja muzyka. Twoje studio.</strong></p>
<p align="center">Przestrzeń Windows do tworzenia z AI Music, słuchania utworów i kształtowania brzmienia.</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=pl"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Pobierz dla Windows</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=pl">Studio w Twoim stylu</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">Kod źródłowy</a></p>

<details>
<summary align="center">🌐 Polski · 32 languages</summary>
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
<p align="center"><sub>Ilustracja interfejsu bez danych kont.</sub></p>

## Studio w Twoim stylu

- **Zintegrowany odtwarzacz** — Nieruchoma okładka, przezroczysty pasek, kolorowy postęp i sterowanie na dole.

- **Kolory i klimat** — Galaxy, Muzyka, Noc, Jasny i Oficjalny. Kolory okładki towarzyszą słuchaniu.

- **Korektor i efekty** — Dziesięć pasm, przedwzmacniacz, presety, A/B, szerokość stereo, panorama, auto-pan, pogłos, echo i widmo.

- **Lokalny profil** — Dodaj zdjęcie i pseudonim. Preferencje i presety audio pozostają na komputerze.

- **Pamięć podręczna** — Dyskowa pamięć podręczna ponownie wykorzystuje dostępne zasoby. Czyszczenie zachowuje sesję i ustawienia.

- **Widoczne kredyty** — Sprawdzaj saldo AI Music i korzystaj z rzeczywistych narzędzi usługi.

## Gotowy na otwarcie studia?

1. Pobierz instalator Windows ze strony wydania. → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. Uruchom plik .exe i postępuj zgodnie z instrukcjami.
3. Otwórz AI Music Desktop i w razie potrzeby zaloguj się do usługi.

> Instalator nie jest podpisany; Windows może wyświetlić ostrzeżenie.

## Niezależny projekt

Nieoficjalna aplikacja niezwiązana z AI Music. Wymaga Internetu. Efekty i analiza zależą od dostępu do strumienia audio; testy syntetyczne nie gwarantują działania każdego zdalnego utworu.

Prezentacja jest dostępna w 32 językach. Lokalny interfejs aplikacji jest obecnie francuski; język usługi wybiera się w jej menu.

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## Rozwój

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=pl">Twoja muzyka. Twoje studio.</a></p>
