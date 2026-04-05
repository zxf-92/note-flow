# Note-Flow 📝

## 项目简介

Note-Flow 是一款主打“数字纸笔 (Digital Paper)”理念的跨平台桌面笔记应用。它追求极简与优雅的现代设计美学，致力于为知识工作者、学生和创作者提供一个清爽、专注且不失强大的书写环境。

本项目底层基于 [Tauri](https://tauri.app/) 与 [Rust](https://www.rust-lang.org/) 构建，兼顾了 Web 前端的灵活表现力与原生桌面应用的轻量及高性能。

## ✨ 核心特性

当前版本已实现以下核心功能：

* **沉浸式笔记管理**：支持流畅的笔记创建、编辑，以及灵活的多级文件夹分类结构。
* **多维标签系统**：支持为笔记添加自定义标签，并可通过标签进行快速筛选与精准检索。
* **个性化视觉体验**：内置浅色 (Light) / 深色 (Dark) 双主题模式，支持无缝切换。
* **数据安全**：完善的收藏夹与回收站机制，防止重要灵感丢失。
* **AI 赋能（开发中）**：已预留 AI 助手交互模块，未来将集成智能总结、文本润色、多语言翻译与基于笔记内容的智能问答功能。

## 🛠️ 技术栈

* **桌面端框架**：Tauri
* **核心逻辑 / 后端**：Rust (Cargo)
* **前端交互**：*(在这里填入你实际使用的前端技术，例如 Vue 3 / React / 纯 HTML+JS)*

## 🚀 本地开发与构建

如果你想在本地运行或参与开发本项目，请确保你的系统已安装以下环境：

1.  **Node.js** (推荐最新 LTS 版本)
2.  **Rust 工具链** (`rustup`, `cargo`, `rustc`)
3.  **C++ 构建工具** (Windows 用户请安装 Visual Studio 2022 Build Tools，并勾选“使用 C++ 的桌面开发”)

**运行步骤：**

```bash
# 1. 克隆项目到本地
git clone [https://github.com/你的用户名/note-flow.git](https://github.com/你的用户名/note-flow.git)

# 2. 进入项目目录
cd note-flow

# 3. 安装前端依赖
npm install  # 或 yarn / pnpm install

# 4. 启动本地开发服务 (Tauri 开发模式)
npm run tauri dev
