# Repeaの博客 - 个人静态博客系统

这是一个基于 HTML、CSS 和原生 JavaScript 构建的纯静态个人博客系统。内容由 Markdown 驱动，无需后端数据库，具有轻量、快速、易部署的特点。

## 📁 项目目录结构

```text
Personal_Blog/
├── index.html          # 博客主页面（包含首页、文章列表、关于等视图）
├── css/
│   └── style.css       # 博客全局样式表
├── js/
│   ├── common.js       # 全局通用逻辑（主题切换、调色盘、基础 UI）
│   ├── main.js         # 首页逻辑与文章列表配置
│   ├── markdown.js     # Markdown 解析与加载引擎
│   └── post.js         # 文章详情页逻辑
├── Page/               # 存放 Markdown 文章内容的目录
│   ├── AI提示词汇总.md
│   ├── HyperOS移植思路.md
│   ├── HyperOS移植思路——BUG修复与个性化修改篇.md
│   ├── ROM和插件获取.md
│   └── 如何让AI生成的UI界面去除“AI味”.md
├── Image/              # 存放博客图片、Banner 等素材
├── 头像.png            # 博客头像
└── Font.ttf            # 自定义字体文件
```

---

## 📝 如何更改博客内容

### 1. 修改首页与关于页面信息
首页和关于页面的大部分静态文本直接在 `index.html` 中修改：
- **站点标题**：修改 `<title>` 标签以及 `id="home"` 部分的 `h1` 标签。
- **关于我**：在 `id="about"` 的 `<div class="about-content">` 中修改个人简介和联系方式。
- **头像**：替换根目录下的 `头像.png` 或修改 `index.html` 中相关的 `url('头像.png')` 路径。

### 2. 管理博客文章 (Articles)
文章存放在 `Page/` 目录下，以 `.md` 结尾。
- **新增文章**：
  1. 在 `Page/` 目录下新建一个 `.md` 文件。
  2. 在文件开头添加 YAML 元数据（Front Matter），例如：
     ```markdown
     ---
     title: 文章标题
     published: 2026-02-11
     description: 文章简短描述
     tags: [标签1, 标签2]
     ---
     ```
  3. 打开 `js/main.js`，在 `POST_FILES` 数组中添加该文章的文件名（带扩展名）。
- **删除文章**：从 `Page/` 删除文件，并同步从 `js/main.js` 的 `POST_FILES` 中移除。

### 3. 管理“真心话” (Words)
“真心话”的逻辑与文章类似：
1. 在 `Page/` 或自定义目录下创建 Markdown 文件。
2. 在 `js/main.js` 的 `TRUTH_FILES` 数组中添加对应的文件名。

### 4. 自定义视觉效果
- **Banner 背景图**：在 `js/common.js` 的 `BANNER_IMAGES` 数组中添加或修改图片路径。图片建议存放在 `Image/` 目录。
- **主题色**：用户可以通过页面顶部的调色盘动态修改。如果你想修改默认颜色，可以在 `css/style.css` 中查找 `:root` 下的变量。

---

## 🚀 部署建议
由于是纯静态项目，你可以将其部署到：
- GitHub Pages
- Vercel / Netlify
- 任何支持静态文件托管的服务器（直接上传所有文件即可）

---

## 🛠️ 技术栈
- **Markdown 解析**: 使用原生 JS 实现的异步解析流程。
- **代码高亮**: [Highlight.js](https://highlightjs.org/)
- **图标库**: [Font Awesome](https://fontawesome.com/)
- **动画效果**: 自定义 CSS 动画。
