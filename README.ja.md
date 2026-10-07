<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>あなたの音楽。あなたのスタジオ。</strong></p>
<p align="center">AI Musicで制作し、楽曲を聴き、サウンドを調整するためのWindowsアプリ。</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ja"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>Windows版をダウンロード</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ja">あなたらしいスタジオ</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">ソースコード</a></p>

<details>
<summary align="center">🌐 日本語 · 32 languages</summary>
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
<p align="center"><sub>画面のイメージ図です。アカウント情報は使用していません。</sub></p>

## あなたらしいスタジオ

- **一体型プレーヤー** — 静止したジャケット、透明なバー、色付きの再生位置、画面下部にまとまった操作ボタン。

- **色と雰囲気** — Galaxy、Music、Night、Light、Official。ジャケットの色が再生画面に反映されます。

- **イコライザーとエフェクト** — 10バンド、プリアンプ、プリセット、A/B、ステレオ幅、パン、オートパン、リバーブ、エコー、スペクトラム。

- **ローカルプロフィール** — 写真とニックネームを設定できます。設定と音声プリセットは端末内に保存されます。

- **起動時のキャッシュ** — ディスクキャッシュで利用可能なリソースを再利用。削除してもセッションと設定は保持されます。

- **クレジット表示** — AI Musicの残高を確認し、サービス本来の制作ツールを利用できます。

## スタジオを開きませんか？

1. リリースページからWindowsインストーラーをダウンロードします。 → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. .exeファイルを実行し、手順に従ってインストールします。
3. AI Music Desktopを開き、必要に応じてサービスにログインします。

> インストーラーは未署名のため、Windowsで警告が表示される場合があります。

## 独立したプロジェクト

AI Musicとは提携していない非公式アプリです。インターネット接続が必要です。エフェクトと解析には音声ストリームへのアクセスが必要で、合成音声によるテストはすべてのオンライン楽曲の動作を保証しません。

この紹介は32言語に対応しています。アプリ独自の画面は現在フランス語です。サービスの言語はそのメニューで選べます。

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## 開発

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=ja">あなたの音楽。あなたのスタジオ。</a></p>
