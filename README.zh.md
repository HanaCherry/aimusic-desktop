<p align="center"><img src="assets/icon.png" width="72" height="72" alt="AI Music"></p>

<h1 align="center">AI Music Desktop</h1>
<p align="center"><strong>你的音乐。你的工作室。</strong></p>
<p align="center">在 Windows 上使用 AI Music 创作、聆听歌曲并塑造你的声音。</p>

<p align="center">
  <a href="https://hanacherry.github.io/aimusic-desktop/?lang=zh"><img src="https://img.shields.io/badge/Website-32_languages-ae94e8?style=for-the-badge" alt="32 languages"></a>
  <a href="https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0"><img src="https://img.shields.io/badge/Windows-v0.4.0-8be5bd?style=for-the-badge&amp;logo=windows" alt="Windows 0.4.0"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Electron-Desktop-91bad8?style=for-the-badge&amp;logo=electron" alt="Electron"></a>
</p>

<p align="center"><a href="https://github.com/HanaCherry/aimusic-desktop/releases/download/v0.4.0/AI-Music-Desktop-0.4.0-Installation.exe"><strong>下载 Windows 版</strong></a> · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=zh">属于你的音乐工作室</a> · <a href="https://github.com/HanaCherry/aimusic-desktop">查看源码</a></p>

<details>
<summary align="center">🌐 简体中文 · 32 languages</summary>
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
<p align="center"><sub>界面示意图，未使用任何账户数据。</sub></p>

## 属于你的音乐工作室

- **集成播放器** — 静态封面、透明底栏、彩色进度条，播放控件集中在底部。

- **色彩与氛围** — Galaxy、音乐、夜间、浅色和官方主题。播放界面跟随专辑封面的色彩。

- **均衡器与音效** — 十段均衡器、前级增益、预设、A/B、立体声宽度、声像、自动声像、混响、回声和频谱。

- **本地个人资料** — 添加照片和昵称。设置与音频预设保存在你的电脑上。

- **启动缓存** — 磁盘缓存重复利用可用资源。清理缓存会保留会话和设置。

- **显示点数** — 查看 AI Music 提供的余额，使用服务原有的创作工具。

## 准备好打开工作室了吗？

1. 从发布页面下载 Windows 安装程序。 → [v0.4.0](https://github.com/HanaCherry/aimusic-desktop/releases/tag/v0.4.0)
2. 运行 .exe 文件并按提示安装。
3. 打开 AI Music Desktop，必要时登录服务。

> 安装程序未签名，Windows 可能显示警告。

## 独立项目

本应用非官方，与 AI Music 无关联。需要互联网连接。音效和分析取决于能否访问音频流；合成音频测试不保证所有在线歌曲都可用。

本介绍提供 32 种语言。应用本地界面目前为法语；服务语言可在其菜单中选择。

→ [NOTICE.md](NOTICE.md) · [aimusic.so](https://aimusic.so/fr/app)

## 开发

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

<p align="center">AI Music Desktop · 0.4.0 · <a href="https://hanacherry.github.io/aimusic-desktop/?lang=zh">你的音乐。你的工作室。</a></p>
