<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>Tu música. Tu estudio.</strong></p>
<p align="center">Un espacio Windows para crear con AI Music, escuchar tus canciones y dar forma a tu sonido.</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=es"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Descargar para Windows</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=es">Un estudio a tu medida</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">Ver código</a></p>

<details>
<summary align="center">🌐 Español · 32 languages</summary>
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
<p align="center"><sub>Ilustración de la interfaz, sin datos de cuentas.</sub></p>

## Un estudio a tu medida

- **Reproductor integrado** — Portada fija, barra transparente, progreso con colores y controles reunidos en la parte inferior.

- **Colores y ambiente** — Galaxy, Música, Noche, Claro y Oficial. Los colores de la portada acompañan la reproducción.

- **Ecualizador y efectos** — Diez bandas, preamplificador, perfiles, A/B, amplitud estéreo, panorama, auto-pan, reverberación, eco y espectro.

- **Tu perfil es local** — Añade foto y apodo. Las preferencias y los perfiles de audio permanecen en tu equipo.

- **Caché de inicio** — La caché de disco reutiliza recursos disponibles. Limpiarla conserva la sesión y los ajustes.

- **Créditos visibles** — Consulta el saldo de AI Music y utiliza las herramientas reales del servicio.

## ¿Listo para abrir tu estudio?

1. Descarga el instalador Windows desde la versión publicada. → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. Ejecuta el archivo .exe y sigue la instalación.
3. Abre AI Music Desktop e inicia sesión si es necesario.

> Instalador sin firma: Windows puede mostrar una advertencia.

## Un proyecto independiente

Aplicación no oficial, sin afiliación con AI Music. Requiere Internet. Los efectos y el análisis dependen del acceso al audio; las pruebas sintéticas no garantizan todas las canciones remotas.

Esta presentación está disponible en 32 idiomas. La interfaz local está actualmente en francés; el idioma del servicio se elige en su menú.

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## Desarrollo

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=es">Tu música. Tu estudio.</a></p>
