<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>Muzik anda. Studio anda.</strong></p>
<p align="center">Ruang Windows untuk berkarya dengan AI Music, mendengar lagu dan membentuk bunyi anda.</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ms"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Muat turun untuk Windows</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ms">Studio yang sesuai dengan anda</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">Lihat kod</a></p>

<details>
<summary align="center">🌐 Bahasa Melayu · 32 languages</summary>
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
<p align="center"><sub>Ilustrasi antara muka tanpa data akaun.</sub></p>

## Studio yang sesuai dengan anda

- **Pemain bersepadu** — Kulit album tetap, bar lut sinar, kemajuan berwarna dan kawalan main balik di bawah.

- **Warna dan suasana** — Galaxy, Muzik, Malam, Cerah dan Rasmi. Warna kulit album mengiringi pendengaran.

- **Penyama dan kesan** — Sepuluh jalur, pra-penguat, pratetap, A/B, lebar stereo, pan, auto-pan, reverb, gema dan spektrum.

- **Profil setempat** — Tambah foto dan nama samaran. Pilihan dan pratetap audio kekal pada komputer anda.

- **Cache permulaan** — Cache cakera menggunakan semula sumber yang tersedia. Pembersihan mengekalkan sesi dan tetapan.

- **Kredit kelihatan** — Lihat baki AI Music dan gunakan alat penciptaan sebenar perkhidmatan.

## Bersedia membuka studio?

1. Muat turun pemasang Windows daripada halaman keluaran. → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. Jalankan fail .exe dan ikuti pemasangan.
3. Buka AI Music Desktop dan log masuk jika perlu.

> Pemasang tidak ditandatangani; Windows mungkin memaparkan amaran.

## Projek bebas

Aplikasi tidak rasmi tanpa hubungan dengan AI Music. Internet diperlukan. Kesan dan analisis bergantung pada akses aliran audio; ujian sintetik tidak menjamin setiap lagu dalam talian.

Pembentangan ini tersedia dalam 32 bahasa. Antara muka setempat kini dalam bahasa Perancis; bahasa perkhidmatan dipilih melalui menunya.

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## Pembangunan

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ms">Muzik anda. Studio anda.</a></p>
