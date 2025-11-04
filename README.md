<center>
<p align="center">
  <a href="https://www.youxiaohou.com" title="点击访问">
    <img width="100" height="100" src="https://www.youxiaohou.com/logo.gif" alt="超级翻译助手">
  </a>
</p>

<h1 align="center">超级翻译助手</h1>

<p align="center">
  <img src="https://img.shields.io/badge/TamperMonkey-v4.13-brightgreen.svg" alt="tampermonkey">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-AGPLv3.0-lightgrey.svg" alt="LICENSE">
  </a>
  <img src="https://img.shields.io/badge/Chrome-≥76.0-brightgreen.svg" alt="chrome">
  <img src="https://img.shields.io/badge/Edge-≥88.0-brightgreen.svg" alt="chrome">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Mac%20%7C%20Linux-blue.svg" alt="platform">
</p>

<div align="center">
  <strong>👉 一个免费超级翻译助手 👈</strong><br>
  <sub>适用于 Linux，macOS，Windows 平台</sub>
</div>
</center><br>

---

## 📋 工具简介

超级翻译助手是一款基于 TamperMonkey 的网页翻译插件，支持将网页中选定的文字快速翻译成多种语言，操作便捷、响应迅速，为跨语言阅读提供高效解决方案。

### ✅ 支持语言

阿拉伯语、德语、俄语、法语、韩语、拉丁语、葡萄牙语、日语、泰语、西班牙语、意大利语、英语、简体中文、繁体中文（共14种语言）

### ⚡ 核心优势

- 免费无广告：全程无商业广告干扰，专注翻译体验

- 操作极简：快捷键一键触发，支持手动输入与选段翻译双模式

- 多端适配：兼容主流浏览器与操作系统，适配性强

- 个性化配置：支持快捷键、语言偏好等自定义设置

- 暗黑模式：支持明暗模式切换，适配系统颜色偏好，夜间使用更舒适

---

## 📖 使用说明

方法一：**按下翻译快捷键 `F9`，输入要翻译的文字**。

![](https://pic.rmb.bdstatic.com/bjh/0570ed8c826021f9d5e010b8cf4ff0035073.gif)

方法二：**选中要翻译的文本，按下翻译快捷键 `F9`，会自动翻译选中文本**。

![](https://pic.rmb.bdstatic.com/bjh/0831ae9c15cf8e8667cf4399f7d76f0a3680.gif)


---

## 📝 更新日志（Changelog）

### v1.0.8 版本更新（Latest Release）

![1](https://github.com/user-attachments/assets/d441c82c-24c9-4c2f-85fd-408a4b9185c9)

![2](https://github.com/user-attachments/assets/a28afbb2-c298-4ce2-bc6a-cd43ddb8cb2b)

![3](https://github.com/user-attachments/assets/96006c77-7abe-45c2-9996-24c245c4ad95)

![4](https://github.com/user-attachments/assets/576d13bf-101f-4bbe-8c0c-8cf5e4806c99)

#### 一、核心功能新增：暗黑模式（Dark Mode）全面上线
- **双入口快捷切换**：翻译框模块支持明暗模式切换，提供双触发入口（页面右上角 SVG 图标按钮 + 设置菜单选项），操作路径清晰。
- **流畅过渡与系统适配**：内置 0.3s 平滑过渡动画，消除模式切换顿挫感；支持自动同步系统暗黑模式偏好，实现无感知适配。
- **精准配色与交互反馈**：
  - 基础配色：主背景 #000000、模块背景 #1E1E1E、正文白色加粗、辅助文本 #999999，层次分明。
  - 强调色设计：主色 #6A0DAD（应用于按钮、输入框边框），hover 态 #8B00FF，点击态 #4B0082，交互反馈明确。

#### 二、问题修复（Bug Fixes）
- 修复暗黑模式下，右上角 SVG 模式切换图标显示异常问题。
- 优化翻译框外边框（`.translate-wrapper`）margin 区域颜色，由白色调整为 #000000，适配暗黑模式风格。

#### 三、交互与样式优化（UI/UX Improvements）
- 调整暗黑模式下“清空内容”按钮（`.translate-clear`）样式：深紫色背景搭配白色高亮乘号，提升视觉对比度与操作辨识度。
- 实现多窗口同步适配：原始语言选择窗口、翻译语言选择窗口与主翻译窗口的明暗模式同步切换，保持配色风格统一。

---

### v1.0.1
- 翻译界面新增**常用语言快捷选项**，减少操作步骤，提升效率。
- 优化部分界面样式细节，增强整体视觉协调性。

---

### v1.0.0（Initial Release）
- 核心功能：支持 14 种语言互译，满足多场景翻译需求。
- 效率功能：新增自定义快捷键，支持个性化操作设置。
- 配置功能：支持原始语言与目标语言自定义预设，适配不同使用习惯。

## 🔧 个性化配置

点击浏览器插件栏中的【超级翻译助手】图标，即可打开配置面板，自定义功能参数。配置界面如下：

### 可配置选项说明

- 翻译快捷键：支持自定义触发翻译的快捷键，默认值为 `F9`

- 原始语言：可设置待翻译文本的默认语言，默认值为“自动检测”

- 目标语言：可设置翻译结果的默认语言，默认值为“简体中文”

- 翻译次数统计：自动记录累计翻译次数，初始值为 0 次

- 暗黑模式开关：手动控制是否开启暗黑模式，默认值为“开”

- 系统颜色模式跟随：开启后自动同步系统明暗模式，默认值为“开”

---

## 🌙 夜间模式优化建议

为获得更优的夜间使用体验，建议配合以下浏览器设置使用：

1. **浏览器原生暗黑模式开启**：
        Edge 浏览器：访问 `edge://flags`，搜索“dark”相关选项，设置为“Enable”并重启浏览器

2. 其他浏览器（Chrome、Firefox 等）：在设置中搜索“深色模式”“暗黑模式”等关键词，开启对应功能即可

3. **配合深色模式扩展**：安装“Dark Reader”等第三方深色模式扩展，可实现全网页深色适配，与插件暗黑模式协同效果更佳

---

## 🐞 问题反馈与支持

如果您在使用过程中遇到功能异常、翻译错误或有优化建议，欢迎通过以下方式反馈：

- GitHub 反馈：[前往 GitHub 提交 Issue](https://github.com/syhyz1990/translate/issues)

- 邮件反馈：[mail@youxiaohou.com](mailto:mail@youxiaohou.com)

---

