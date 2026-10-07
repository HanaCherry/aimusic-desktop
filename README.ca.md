<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>La teva música. El teu estudi.</strong></p>
<p align="center">Un espai Windows per crear amb AI Music, escoltar les teves peces i donar forma al so.</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ca"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Descarrega per a Windows</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ca">Un estudi a la teva mida</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">Veure el codi</a></p>

<details>
<summary align="center">🌐 Català · 32 languages</summary>
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
<p align="center"><sub>Il·lustració de la interfície sense dades de comptes.</sub></p>

## Un estudi a la teva mida

- **Reproductor integrat** — Portada fixa, barra transparent, progrés amb colors i controls reunits a baix.

- **Colors i ambient** — Galaxy, Música, Nit, Clar i Oficial. Els colors de la portada acompanyen l’escolta.

- **Equalitzador i efectes** — Deu bandes, preamplificador, perfils, A/B, amplada estèreo, panorama, auto-pan, reverberació, eco i espectre.

- **Perfil local** — Afegeix una foto i un sobrenom. Les preferències i els perfils d’àudio es queden a l’ordinador.

- **Memòria cau d’inici** — La memòria cau de disc reutilitza recursos disponibles. Netejar-la conserva la sessió i els ajustos.

- **Crèdits visibles** — Consulta el saldo d’AI Music i utilitza les eines reals del servei.

## A punt per obrir l’estudi?

1. Descarrega l’instal·lador Windows des de la versió publicada. → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. Executa el fitxer .exe i segueix la instal·lació.
3. Obre AI Music Desktop i inicia sessió si cal.

> Instal·lador sense signatura: Windows pot mostrar un avís.

## Un projecte independent

Aplicació no oficial i sense afiliació amb AI Music. Requereix Internet. Els efectes i l’anàlisi depenen de l’accés a l’àudio; les proves sintètiques no garanteixen totes les peces remotes.

La presentació està disponible en 32 llengües. La interfície local és actualment en francès; la llengua del servei es tria al seu menú.

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## Desenvolupament

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ca">La teva música. El teu estudi.</a></p>
