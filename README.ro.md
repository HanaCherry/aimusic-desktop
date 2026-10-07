<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>Muzica ta. Studioul tău.</strong></p>
<p align="center">Un spațiu Windows pentru a crea cu AI Music, a asculta piese și a modela sunetul.</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ro"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Descarcă pentru Windows</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ro">Un studio pe gustul tău</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">Vezi codul</a></p>

<details>
<summary align="center">🌐 Română · 32 languages</summary>
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
<p align="center"><sub>Ilustrație a interfeței, fără date de cont.</sub></p>

## Un studio pe gustul tău

- **Player integrat** — Copertă fixă, bară transparentă, progres colorat și comenzi de redare în partea de jos.

- **Culori și atmosferă** — Galaxy, Muzică, Noapte, Deschis și Oficial. Culorile copertei însoțesc ascultarea.

- **Egalizator și efecte** — Zece benzi, preamplificator, presetări, A/B, lățime stereo, panoramare, auto-pan, reverberație, ecou și spectru.

- **Profil local** — Adaugă fotografie și pseudonim. Preferințele și presetările audio rămân pe calculator.

- **Cache la pornire** — Cache-ul pe disc reutilizează resursele disponibile. Ștergerea păstrează sesiunea și setările.

- **Credite vizibile** — Consultă soldul AI Music și folosește instrumentele reale ale serviciului.

## Ești gata să deschizi studioul?

1. Descarcă instalatorul Windows din pagina versiunii. → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. Rulează fișierul .exe și urmează instalarea.
3. Deschide AI Music Desktop și autentifică-te în serviciu dacă este necesar.

> Instalatorul nu este semnat; Windows poate afișa un avertisment.

## Un proiect independent

Aplicație neoficială, fără afiliere la AI Music. Necesită Internet. Efectele și analiza depind de accesul la fluxul audio; testele sintetice nu garantează fiecare piesă la distanță.

Prezentarea este disponibilă în 32 de limbi. Interfața locală este momentan în franceză; limba serviciului se alege din meniul său.

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## Dezvoltare

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ro">Muzica ta. Studioul tău.</a></p>
