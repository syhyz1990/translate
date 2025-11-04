// ==UserScript==
// @name              超级翻译助手
// @namespace         https://github.com/syhyz1990/translate
// @version           1.0.8
// @author            YouXiaoHou
// @description       用鼠标选中文字，按下快捷键（默认为F9），可自动翻译文字。已支持超过 14 种语言。
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-translate.html
// @supportURL        https://github.com/syhyz1990/translate
// @updateURL         https://www.youxiaohou.com/translate.user.js
// @downloadURL       https://www.youxiaohou.com/translate.user.js
// @match             *://*/*
// @require           https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @require           https://unpkg.com/hotkeys-js@3.13.3/dist/hotkeys.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @connect           translate.youxiaohou.com
// @run-at            document-idle
// @noframes
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik02NTguMyA0MDIuM2gyOTIuNmM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg0NzUuNGMtNDAuNCAwLTczLjEtMzIuNS03My4xLTczLjFWNjU4LjNoMTQ2LjNjNjAuOSAwIDEwOS43LTQ5LjEgMTA5LjctMTA5LjdWNDAyLjN6TTAgNzMuMUMwIDMyLjcgMzIuNSAwIDczLjEgMGg0NzUuNGM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg3My4xYy00MC40LjEtNzMuMS0zMi40LTczLjEtNzNWNzMuMXptMTQ2LjMgMzE1LjhoNTMuNHYtMjguM2g3N3YxMzUuMmg1Ni42VjM2MC42aDc4LjZ2MjMuNkg0NzBWMjA1SDMzMy4zdi0zOS4zYzAtMTEuNSAxLjYtMjEuNSA0LjgtMjkuOC44LTEuNSAxLjQtMy4xIDEuNS00LjggMC0xLTMuNy0yLTExLTMuMWgtNTMuNXY3N0gxNDYuM3YxODMuOXpNMTk5LjcgMjQ5aDc3djY5LjFoLTc3VjI0OXptMjEyLjIgNjkuMWgtNzguNlYyNDloNzguNnY2OS4xem0yMzIuOSA1NTcuN2wyMi02MS4zaDExNC43bDIyIDYxLjNoNjIuOGwtMTAyLTI5MC43aC03My45TDU4NS4xIDg3NS45bDU5LjctLjF6bTM3LjgtMTEwTDcyNSA2NDEuN2gxLjZsMzkuMyAxMjQuMWgtODMuM3ptMjY4LjMtNDczLjJoLTczLjFjMC04MC44LTY1LjUtMTQ2LjMtMTQ2LjMtMTQ2LjNWNzMuMWMxMjEuMSAwIDIxOS40IDk4LjMgMjE5LjQgMjE5LjV6TTczLjEgNzMxLjRoNzMuMWMwIDgwLjggNjUuNSAxNDYuMyAxNDYuMyAxNDYuM3Y3My4xYy0xMjEuMS4xLTIxOS40LTk4LjItMjE5LjQtMjE5LjR6IiBmaWxsPSIjZDgxZDQ1Ii8+PC9zdmc+
// ==/UserScript==

(function () {
  "use strict";

  const customClass = {
    container: "translate-container",
    popup: "translate-popup",
    content: "translate-content",
  };

  const toastClass = {
    container: "translate-d-container",
    popup: "translate-d-popup",
  };

  let toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timerProgressBar: false,
    customClass: toastClass,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  let languageMap = {
    auto: "自动检测",
    ar: "阿拉伯语",
    de: "德语",
    ru: "俄语",
    fr: "法语",
    ko: "韩语",
    la: "拉丁语",
    pt: "葡萄牙语",
    ja: "日语",
    th: "泰语",
    es: "西班牙语",
    it: "意大利语",
    en: "英语",
    "zh-CN": "简体中文",
    "zh-TW": "繁体中文",
  };

  let util = {
    getValue(name) {
      return GM_getValue(name);
    },

    setValue(name, value) {
      GM_setValue(name, value);
    },

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    addStyle(id, tag, css) {
      tag = tag || "style";
      let doc = document,
        styleDom = doc.getElementById(id);
      if (styleDom) return;
      let style = doc.createElement(tag);
      style.rel = "stylesheet";
      style.id = id;
      tag === "style" ? (style.innerHTML = css) : (style.href = css);
      document.head.appendChild(style);
    },

    isType(obj) {
      return Object.prototype.toString
        .call(obj)
        .replace(/^\[object (.+)\]$/, "$1")
        .toLowerCase();
    },

    post(url, data, headers, type) {
      if (this.isType(data) === "object") {
        data = JSON.stringify(data);
      }
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url,
          headers,
          data,
          responseType: type || "json",
          onload: (res) => {
            type === "blob"
              ? resolve(res)
              : resolve(res.response || res.responseText);
          },
          onerror: (err) => {
            reject(err);
          },
        });
      });
    },

    parseLanguage(language) {
      return languageMap[language] || language;
    },
  };

  let main = {
    untranslatedText: "",
    translatedText: "",
    translating: false,
    speechSynthesis: null,
    speakPlaySvg:
      '<svg height="20" width="20" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',

    //初始化配置数据
    initValue() {
      let value = [
        {
          name: "setting_success_times",
          value: 0,
        },
        {
          name: "hotkey",
          value: "f9",
        },
        {
          name: "from",
          value: "auto",
        },
        {
          name: "to",
          value: "zh-CN",
        },
        // 新增暗黑模式设置: dark_mode, dark_mode_sync
        {
          name: "dark_mode",
          value: true,
        },
        {
          name: "dark_mode_sync",
          value: true,
        },
      ];

      value.forEach((v) => {
        if (util.getValue(v.name) === undefined) {
          util.setValue(v.name, v.value);
        }
      });
    },

    async startTranslate() {
      this.translatedText = "";
      let select = window.getSelection().toString();
      if (select) this.untranslatedText = select;
      if (this.untranslatedText)
        this.translatedText = await this.translate(this.untranslatedText);
      await this.showPopup(this.untranslatedText, this.translatedText);
    },

    async translate(text, showToast = true) {
      let btn = $(".translate-box .translate-btn");
      try {
        if (!text) return "";
        if (this.translating) return;
        this.translating = true;
        showToast && toast.fire({ title: "正在翻译...", icon: "info" });
        btn.length > 0 &&
          btn.html('<span class="translate-loading-css"></span>翻译中');
        let res = await util.post(
          "https://translate.youxiaohou.com",
          {
            str: text,
            from: util.getValue("from"),
            to: util.getValue("to"),
          },
          {
            "Content-Type": "application/json",
          }
        );
        this.translating = false;
        btn.length > 0 && btn.html("翻译");
        if (res.code === 200) {
          util.setValue(
            "setting_success_times",
            util.getValue("setting_success_times") + 1
          );
          return res.data;
        }
        return res?.msg || "";
      } catch (e) {
        this.translating = false;
        btn.length > 0 && btn.html("翻译失败");
        return "";
      }
    },

    async showPopup(untranslatedText, translatedText) {
      let commonLangFrom = ["auto", "zh-CN", "en"];
      let commonLangTo = ["zh-CN", "en", "zh-TW"];
      let langFrom = util.getValue("from");
      let langTo = util.getValue("to");
      if (!commonLangFrom.includes(langFrom)) commonLangFrom.push(langFrom);
      if (!commonLangTo.includes(langTo)) commonLangTo.push(langTo);
      let langDomFrom = commonLangFrom
        .map((val) => {
          if (val === langFrom) {
            return `<div class="item on" data-lang="${val}" data-type="from">${languageMap[val]}</div>`;
          } else {
            return `<div class="item" data-lang="${val}" data-type="from">${languageMap[val]}</div>`;
          }
        })
        .join("");
      let langDomTo = commonLangTo
        .map((val) => {
          if (val === langTo) {
            return `<div class="item on" data-lang="${val}" data-type="to">${languageMap[val]}</div>`;
          } else {
            return `<div class="item" data-lang="${val}" data-type="to">${languageMap[val]}</div>`;
          }
        })
        .join("");

      // 右上角暗黑切换按钮（图标会根据当前模式更新）
      let darkToggleHtml = `<button id="dark-toggle" class="translate-dark-toggle" title="切换暗黑模式" aria-label="切换暗黑模式"></button>`;

      let html = `
<div class="translate-wrapper">
  ${darkToggleHtml}
  <div class="translate-box">
    <div class="from-side">
      <div class="translate-title">
        <div class="translate-lang">${langDomFrom}<svg id="dropdown-from" width="24" height="24" viewBox="0 0 24 24" class="translate-dropdown"><path d="M5.41 7.59L4 9l8 8 8-8-1.41-1.41L12 14.17"/></svg></div>
        <button class="translate-btn" title="点击翻译左侧文本">翻译</button>
      </div>
      <textarea class="untranslated-text" placeholder="请输入要翻译的内容">${untranslatedText}</textarea>
      <svg class="translate-clear" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M806.4 263.2l-45.6-45.6L512 467.2 263.2 217.6l-45.6 45.6L467.2 512 217.6 760.8l45.6 45.6L512 557.6l248.8 248.8 45.6-45.6L557.6 512z"/></svg>
      <div class="translate-toolbar">
        <div id="speak-from" class="translate-speak">${main.speakPlaySvg}</div>
        <div id="word-count">字数：${untranslatedText.length}</div>
      </div>
    </div>
    <div class="to-side">
      <div class="translate-title">
        <div class="translate-lang">${langDomTo}<svg id="dropdown-to" width="24" height="24" viewBox="0 0 24 24" class="translate-dropdown"><path d="M5.41 7.59L4 9l8 8 8-8-1.41-1.41L12 14.17"/></svg></div>
      </div>
      <div class="translated-text">${translatedText}</div>
      <div class="translate-toolbar">
        <div id="speak-to" class="translate-speak">${main.speakPlaySvg}</div>
        <div class="translate-copy-box" title="点击复制"><svg class="translate-copy" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path d="M672 832H224c-52.928 0-96-43.072-96-96V160c0-52.928 43.072-96 96-96h448c52.928 0 96 43.072 96 96v576c0 52.928-43.072 96-96 96zM224 128c-17.632 0-32 14.368-32 32v576c0 17.664 14.368 32 32 32h448c17.664 0 32-14.336 32-32V160c0-17.632-14.336-32-32-32H224z"/>
          <path
            d="M800 960H320c-17.664 0-32-14.304-32-32s14.336-32 32-32h480c17.664 0 32-14.336 32-32V256c0-17.664 14.304-32 32-32s32 14.336 32 32v608c0 52.928-43.072 96-96 96zM544 320H288c-17.664 0-32-14.336-32-32s14.336-32 32-32h256c17.696 0 32 14.336 32 32s-14.304 32-32 32zm64 160H288.032c-17.664 0-32-14.336-32-32s14.336-32 32-32H608c17.696 0 32 14.336 32 32s-14.304 32-32 32z"/>
          <path d="M608 640H288c-17.664 0-32-14.304-32-32s14.336-32 32-32h320c17.696 0 32 14.304 32 32s-14.304 32-32 32z"/>
        </svg>
        <span class="translate-copy-tip"></span></div>
        </div>
    </div>
  </div>
  <div class="translate-footer"><a href="https://www.youxiaohou.com/tool/install-translate.html" target="_blank">油小猴翻译助手</a> 为您提供翻译服务</div>
</div>
            `;

      Swal.fire({
        width: "1200px",
        position: "center",
        allowOutsideClick: false,
        showCloseButton: true,
        showConfirmButton: false,
        html: html,
        customClass,
      });

      // 自动聚焦
      let textarea = document.querySelector(
        ".translate-box .untranslated-text"
      );
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }

      // 更新暗黑按钮图标与类（弹窗打开时）
      this.updateDarkToggleButton();
    },

    async startNewTranslate() {
      if (this.translating) return;
      $(".translate-box .translated-text").text(
        await this.translate(
          $(".translate-box .untranslated-text").val(),
          false
        )
      );
    },

    addPageListener() {
      let body = $("body");

      body.on("click", ".translate-box .translate-btn", async () => {
        await this.startNewTranslate();
      });

      body.on("input", ".translate-box .untranslated-text", async (e) => {
        this.untranslatedText = e.target.value;
        $(".translate-box #word-count").text(
          `字数：${this.untranslatedText.length}`
        );
      });

      body.on("change", ".translate-box .untranslated-text", () => {
        setTimeout(async () => {
          await this.startNewTranslate();
        }, 300);
      });

      body.on("click", ".translate-box .translate-clear", async () => {
        this.untranslatedText = "";
        $(".translate-box .untranslated-text").val("");
        $(".translate-box .translated-text").text("");
        $(".translate-box #word-count").text("字数：0");
      });

      body.on("click", ".translate-box #dropdown-from", async () => {
        this.setFromLanguage(true);
      });

      body.on("click", ".translate-box #dropdown-to", async () => {
        this.setToLanguage(true);
      });

      body.on("click", ".translate-box #speak-from", async () => {
        this.speakWord($(".translate-box .untranslated-text").val());
      });

      body.on("click", ".translate-box #speak-to", async () => {
        this.speakWord($(".translate-box .translated-text").text());
      });

      body.on("click", ".translate-box .translate-lang .item", async (e) => {
        let $current = $(e.target);
        let lang = $current.data("lang");
        let type = $current.data("type");
        $current.siblings().removeClass("on");
        $current.addClass("on");
        util.setValue(type, lang);
        await this.startNewTranslate();
      });

      body.on("click", ".translate-box .translate-copy", async () => {
        GM_setClipboard($(".translate-box .translated-text").text());
        let copyTip = $(".translate-box .translate-copy-tip");
        copyTip.text("复制成功");
        setTimeout(() => copyTip.text(""), 3000);
      });

      // 暗黑模式切换按钮（弹窗内右上角）
      // 修复：防止点击按钮冒泡导致弹窗被关闭，仅执行切换逻辑
      body.on("click", ".translate-dark-toggle", async (e) => {
        // 阻止事件冒泡到 Swal 或其它全局 click 处理器
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch (err) {}
        // 手动切换暗黑模式时，关闭跟随系统同步（用户手动切换优先）
        util.setValue("dark_mode_sync", false);
        this.toggleDarkMode();
        return false;
      });

      // 语言 item 选中等已使用 .item.on 样式，暗黑主题下 .item.on 也会使用强调色
    },

    addHotKey() {
      hotkeys(util.getValue("hotkey"), async (event, handler) => {
        event.preventDefault();
        await this.startTranslate();
      });
    },

    speakWord(text) {
      if ("speechSynthesis" in window && text) {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
        } else {
          let msg = new SpeechSynthesisUtterance();
          msg.text = text;
          speechSynthesis.speak(msg);
        }
      }
    },

    //重置翻译次数
    clearTranslateTimes() {
      Swal.fire({
        showCancelButton: true,
        title: "确定要重置翻译次数吗？",
        icon: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: toastClass,
      }).then((res) => {
        if (res.isConfirmed) {
          util.setValue("setting_success_times", 0);
          history.go(0);
        }
      });
    },

    setHotkey() {
      Swal.fire({
        title: "请选择快捷键",
        text: "注意：避免与其他程序产生冲突",
        input: "select",
        inputValue: util.getValue("hotkey").toUpperCase(),
        inputOptions: {
          F1: "F1",
          F2: "F2",
          F3: "F3",
          F4: "F4",
          F5: "F5",
          F6: "F6",
          F7: "F7",
          F8: "F8",
          F9: "F9（默认）",
          F10: "F10",
          F11: "F11",
          F12: "F12",
        },
        confirmButtonText: "确定",
        customClass: toastClass,
      }).then(async (result) => {
        if (result.isConfirmed) {
          util.setValue("hotkey", result.value.toLowerCase());
          history.go(0);
        }
      });
    },

    setFromLanguage(popAgain = false) {
      Swal.fire({
        title: "请选择原始语言",
        text: "选择您要翻译的原始语言",
        input: "select",
        inputValue: util.getValue("from"),
        inputOptions: languageMap,
        confirmButtonText: "确定",
        customClass: toastClass,
      }).then(async (result) => {
        if (result.isConfirmed) {
          util.setValue("from", result.value);
          popAgain && this.startTranslate();
        }
      });
    },

    setToLanguage(popAgain = false) {
      let map = JSON.parse(JSON.stringify(languageMap));
      delete map.auto;
      Swal.fire({
        title: "请选择目标语言",
        text: "选择您要翻译的目标语言",
        input: "select",
        inputValue: util.getValue("to"),
        inputOptions: map,
        confirmButtonText: "确定",
        customClass: toastClass,
      }).then(async (result) => {
        if (result.isConfirmed) {
          util.setValue("to", result.value);
          popAgain && this.startTranslate();
        }
      });
    },

    registerMenuCommand() {
      GM_registerMenuCommand(
        `⚙️ 设置快捷键：${util.getValue("hotkey").toUpperCase()}`,
        () => {
          this.setHotkey();
        }
      );
      GM_registerMenuCommand(
        `⚙️ 设置原始语言：${util.parseLanguage(util.getValue("from"))}`,
        () => {
          this.setFromLanguage();
        }
      );
      GM_registerMenuCommand(
        `⚙️ 设置目标语言：${util.parseLanguage(util.getValue("to"))}`,
        () => {
          this.setToLanguage();
        }
      );
      GM_registerMenuCommand(
        "👀 已翻译：" + util.getValue("setting_success_times") + "次",
        () => {
          this.clearTranslateTimes();
        }
      );

      // 新增：切换暗黑模式（菜单）
      GM_registerMenuCommand(
        `🌙 暗黑模式：${util.getValue("dark_mode") ? "开" : "关"}`,
        () => {
          // 切换暗黑模式（手动切换时取消跟随系统）
          util.setValue("dark_mode_sync", false);
          this.toggleDarkMode();
        }
      );

      // 新增：跟随系统暗黑模式
      GM_registerMenuCommand(
        `🖥️ 跟随系统暗黑模式：${util.getValue("dark_mode_sync") ? "开" : "关"}`,
        () => {
          let newVal = !util.getValue("dark_mode_sync");
          util.setValue("dark_mode_sync", newVal);
          if (newVal) {
            // 开启跟随系统：立即按系统状态应用
            this.applySystemPref();
            toast.fire({
              title: "已开启跟随系统暗黑模式",
              icon: "success",
            });
          } else {
            // 关闭同步：保持当前主题（不改变 dark_mode）
            toast.fire({
              title: "已关闭跟随系统暗黑模式",
              icon: "info",
            });
          }
        }
      );
    },

    addPluginStyle() {
      let style = `
      /* 主题变量（默认浅色）*/
      :root {
        --translate-bg: #ffffff;
        --translate-card-bg: #ffffff;
        --translate-text: #222222;
        --translate-muted: #999999;
        --translate-accent: #1a73e8; /* 默认强调色（浅色模式）        */
        --translate-accent-hover: #0f62d0;
        --translate-accent-active: #0b4fa1;
        --translate-transition: 0.3s ease;
      }

      /* 暗黑模式变量（当页面或html上添加 .translate-dark 时启用） */
      .translate-dark, .translate-dark * {
        --translate-bg: #000000;
        --translate-card-bg: #1E1E1E;
        --translate-text: #FFFFFF;
        --translate-muted: #999999;
        --translate-accent: #6A0DAD;
        --translate-accent-hover: #8B00FF;
        --translate-accent-active: #4B0082;
        --translate-transition: 0.3s ease;
      }

      .translate-container { z-index: 99999!important; }
      /* 将主 swal 弹窗背景改为主题背景，这样 translate-wrapper 的 margin 区域会使用 --translate-bg（暗黑时为 #000000） */
      .translate-popup { font-size: 14px !important; padding:0 !important; border-radius: 10px; background: var(--translate-bg) !important; transition: background var(--translate-transition), color var(--translate-transition); }
      .translate-d-container { z-index: 999999!important;}
      .translate-d-popup { font-size: 14px !important;}
      .translate-content { padding:0 !important; }
      .translate-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; }
      .translate-setting-checkbox { width: 16px;height: 16px; }

      /* 主窗口与卡片样式（使用变量） */
      .translate-wrapper { margin: 28px 24px 10px; font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; background: var(--translate-bg); transition: background var(--translate-transition), color var(--translate-transition); position: relative; }
      .translate-box { display: flex; min-height: calc(100vh - 130px);box-shadow: 1px 1px 9px rgba(0,0,0,0.08); border-radius: 15px; transition: background var(--translate-transition), color var(--translate-transition); }
      .translate-box .from-side { flex:1; width:50%; border: 1px solid rgba(0,0,0,0.06); border-radius: 15px 0 0 15px; border-right:none;color: var(--translate-text);position: relative;padding: 0 0 36px; background: var(--translate-card-bg); transition: background var(--translate-transition), color var(--translate-transition), border-color var(--translate-transition); }
      .translate-box .to-side { flex:1; width:50%; border:1px solid rgba(0,0,0,0.06); border-radius: 0 15px 15px 0; border-left: none;background: var(--translate-card-bg);color: var(--translate-text);position: relative;padding: 0 0 36px; transition: background var(--translate-transition), color var(--translate-transition), border-color var(--translate-transition); }
      .translate-box .untranslated-text { width: 100%; height: calc(100% - 50px); border-radius: 15px 0 0 15px; resize: none; line-height: 28px; font-size: 16px; color: var(--translate-text); border: none; text-align: left; padding: 20px; box-sizing: border-box; outline:none; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word; background: transparent; transition: color var(--translate-transition), border-color var(--translate-transition), background var(--translate-transition); border: 1px solid transparent; }
      .translate-box .untranslated-text::placeholder { color: var(--translate-muted); }
      .translate-box .untranslated-text::-webkit-scrollbar { width: 6px; height: 6px;}
      .translate-box .untranslated-text::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4)}
      .translate-box .untranslated-text::-webkit-scrollbar-thumb, .translate-box .untranslated-text::-webkit-scrollbar-thumb:hover { border-radius: 5px; box-shadow: inset 0 0 6px rgb(0 0 0 / 20%);}
      .translate-box .translate-toolbar { position: absolute; bottom: 0; font-size: 13px; color: var(--translate-muted); height: 36px; text-align: right; left: 20px; right: 20px; display: flex; align-items: center; justify-content: space-between; transition: color var(--translate-transition); }
      .translate-box .translated-text { width: 100%; line-height: 28px; font-size: 16px; border: none; text-align: left; white-space: pre-wrap;  padding: 20px; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word; position: relative; color: var(--translate-text); font-weight: 700; transition: color var(--translate-transition), background var(--translate-transition); }
      .translate-box .translate-title { border-bottom: 1px solid rgba(0,0,0,0.06); padding: 0 20px 0 10px; position: sticky; top: -10px;display: flex;align-items:center;justify-content: space-between; z-index: 99999; background: var(--translate-card-bg);user-select:none; transition: background var(--translate-transition), border-color var(--translate-transition); color: var(--translate-text) }
      .translate-box .translate-lang { display: flex; align-items:center;}
      .translate-box .translate-lang .item { position:relative; color:var(--translate-muted); padding: 0 15px; cursor:pointer;font-size:15px;font-weight: 500;height: 48px;display: flex;align-items:center; transition: color var(--translate-transition), background var(--translate-transition); }
      .translate-box .translate-lang .item.on { color:var(--translate-accent); font-weight: 700 }
      .translate-box .translate-lang .item.on:after { content: '';display:block;position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 2px; background: var(--translate-accent); }
      .translate-box .translate-lang .item:hover { background: rgba(0,0,0,0.03); color:var(--translate-text)}
      .translate-box .translate-dropdown { cursor:pointer; fill: var(--translate-muted); margin: 0 10px 0 20px; padding:5px;border-radius:50%; transition: fill var(--translate-transition), background var(--translate-transition) }
      .translate-box .translate-dropdown:hover { fill: var(--translate-text); background:#f5f5f5 }
      .translate-box .from-side .translate-title { border-radius: 15px 0 0 0;}
      .translate-box .to-side .translate-title { border-radius: 0 15px 0 0;}
      .translate-box .translate-btn { border: 0; border-radius: 5px; color: #fff; font-size: 14px; padding: 8px 13px; background: var(--translate-accent); cursor: pointer; line-height: 1; display: flex; align-items: center; transition: background var(--translate-transition), box-shadow var(--translate-transition); }
      .translate-box .translate-btn:hover { background: var(--translate-accent-hover); }
      .translate-box .translate-btn:active { background: var(--translate-accent-active); }
      .translate-box .translate-loading-css { width: 12px; height: 12px; border: 2px solid #FFF; margin-right:6px; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: __rotation 1s linear infinite; }
      @keyframes __rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}
      .translate-box .translate-copy-box {display: flex;align-items:center;gap:5px;}
      .translate-box .translate-copy,.translate-speak svg {cursor: pointer;opacity: 0.6;transition: opacity .3s, fill var(--translate-transition); display: flex;align-items:center; fill: var(--translate-muted); }
      .translate-box .translate-copy:hover,.translate-speak svg:hover {opacity: 0.9}
      /* 清空按钮默认样式（浅色模式或通用） */
      .translate-box .translate-clear {cursor: pointer; fill: var(--translate-muted); padding:6px; border-radius:50%;position: absolute; top: 66px; right: 13px; background: rgba(255,255,255,0.5); transition: background var(--translate-transition), fill var(--translate-transition), transform var(--translate-transition); }
      .translate-box .translate-clear:hover {transform: scale(1.05); fill: var(--translate-text); background: rgba(0,0,0,0.06);}
      .translate-box .translate-clear svg, .translate-box .translate-clear path { display: block; }
      /* 暗黑模式下清空按钮改为强调色背景，图形为白色高亮 */
      .translate-dark .translate-box .translate-clear { background: var(--translate-accent) !important; fill: #FFFFFF !important; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
      .translate-dark .translate-box .translate-clear:hover { background: var(--translate-accent-hover) !important; }
      .translate-dark .translate-box .translate-clear path, .translate-dark .translate-box .translate-clear svg { fill: #FFFFFF !important; stroke: none !important; opacity: 1 !important; }
      .translate-footer {margin-top: 8px; font-size: 14px; color: var(--translate-muted)}
      .translate-footer a {color: var(--translate-accent)}
      .translate-footer a:hover {color: var(--translate-accent-hover)}
      .swal2-close { font-size: 30px!important}
      .swal2-close:focus {box-shadow:none!important}

      /* 暗黑模式切换按钮（右上角） */
      .translate-dark-toggle {
        position: absolute;
        top: 12px;
        right: 18px;
        width: 36px;
        height: 36px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid transparent;
        cursor: pointer;
        transition: background var(--translate-transition), color var(--translate-transition), border-color var(--translate-transition);
        color: var(--translate-muted);
        z-index: 200000; /* 保证在 swal 弹窗内可见，不被其它元素遮挡 */
      }
      /* 强制 svg 显示与填充，覆盖可能的全局 svg 样式冲突 */
      .translate-dark-toggle svg { width: 20px !important; height: 20px !important; display: block !important; }
      .translate-dark-toggle svg path, .translate-dark-toggle svg * { fill: currentColor !important; stroke: none !important; }
      .translate-dark .translate-dark-toggle { background: rgba(255,255,255,0.03); color: var(--translate-accent); border-color: rgba(255,255,255,0.04); }
      .translate-dark-toggle:hover { color: var(--translate-accent-hover); }

      /* 如果仍有全局样式影响 svg path 的填充，优先使用强调色（暗黑下） */
      .translate-dark .translate-dark-toggle svg path { fill: var(--translate-accent) !important; }

      /* 下拉选中、复选框等应使用强调色（样式示例，具体复选框若有需按相同变量应用） */
      .translate-box .item.selected { color: var(--translate-accent); }


      /* -----------------------------
         SweetAlert2 语言选择弹窗（translate-d-popup）主题化样式
         确保语言选择的 Swal 弹窗与主窗口同样跟随暗黑/白天主题
         ------------------------------ */

      /* 弹窗容器（使用 customClass.popup = "translate-d-popup" 的弹窗） */
      .translate-d-popup {
        background: var(--translate-bg) !important;
        color: var(--translate-text) !important;
        transition: background var(--translate-transition), color var(--translate-transition);
      }

      /* 弹窗内部卡片（标题、内容）使用卡片背景以区别外部 margin 区域 */
      .translate-d-popup .swal2-popup {
        background: var(--translate-card-bg) !important;
        color: var(--translate-text) !important;
        border-radius: 10px !important;
      }

      .translate-d-popup .swal2-title,
      .translate-d-popup .swal2-content {
        color: var(--translate-text) !important;
      }

      /* select / option（SweetAlert2 的 input: select） */
      .translate-d-popup .swal2-select {
        background: var(--translate-card-bg) !important;
        color: var(--translate-text) !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
        padding: 8px !important;
        border-radius: 6px !important;
        outline: none !important;
        transition: background var(--translate-transition), color var(--translate-transition), border-color var(--translate-transition);
      }

      .translate-d-popup .swal2-select option {
        background: var(--translate-card-bg) !important;
        color: var(--translate-text) !important;
      }

      /* 若 SweetAlert2 使用普通输入框 / 列表，也一并样式化 */
      .translate-d-popup .swal2-input,
      .translate-d-popup .swal2-textarea {
        background: var(--translate-card-bg) !important;
        color: var(--translate-text) !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
      }

      /* 操作按钮（确认 / 取消） */
      .translate-d-popup .swal2-actions .swal2-confirm {
        background: var(--translate-accent) !important;
        color: #ffffff !important;
        border: none !important;
        box-shadow: none !important;
      }
      .translate-d-popup .swal2-actions .swal2-confirm:hover {
        background: var(--translate-accent-hover) !important;
      }
      .translate-d-popup .swal2-actions .swal2-cancel {
        color: var(--translate-muted) !important;
      }

      /* 小屏/容器外背景保持与主主题一致（暗黑时为纯黑） */
      .translate-d-container {
        background: transparent !important;
      }

      /* 强制覆盖可能的第三方样式对 select 的 !important */
      .translate-d-popup .swal2-select,
      .translate-d-popup .swal2-select option,
      .translate-d-popup .swal2-input {
        background: var(--translate-card-bg) !important;
        color: var(--translate-text) !important;
      }
      `;

      if (document.head) {
        util.addStyle(
          "swal-pub-style",
          "style",
          GM_getResourceText("swalStyle")
        );
        util.addStyle("translate-style", "style", style);
      }

      const headObserver = new MutationObserver(() => {
        util.addStyle(
          "swal-pub-style",
          "style",
          GM_getResourceText("swalStyle")
        );
        util.addStyle("translate-style", "style", style);
      });
      headObserver.observe(document.head, { childList: true, subtree: true });
    },

    isTopWindow() {
      return window.self === window.top;
    },

    // 应用暗黑模式（直接在 document.documentElement 上设置类）
    applyDarkMode(flag) {
      try {
        const root = document.documentElement;
        if (flag) {
          root.classList.add("translate-dark");
        } else {
          root.classList.remove("translate-dark");
        }
        util.setValue("dark_mode", !!flag);
        // 更新弹窗内的按钮图标（如果弹窗已打开）
        this.updateDarkToggleButton();
        // 触发一次强制重绘，确保已打开的 SweetAlert2 弹窗立即应用新变量（通常不必，但作为兼容处理）
        try {
          document
            .querySelectorAll(
              ".translate-d-popup, .translate-popup, .swal2-popup"
            )
            .forEach((el) => {
              // 读取并重新设置一个 harmless style 以确保 repaint（不会改变布局）
              el.style.willChange = "transform";
              // 触发回流
              void el.offsetHeight;
              el.style.willChange = "";
            });
        } catch (e) {}
      } catch (e) {
        // ignore
      }
    },

    // 切换暗黑模式
    toggleDarkMode() {
      const current = !!util.getValue("dark_mode");
      const next = !current;
      util.setValue("dark_mode", next);
      // 手动切换时取消跟随系统
      util.setValue("dark_mode_sync", false);
      this.applyDarkMode(next);
      toast.fire({
        title: next ? "已开启暗黑模式" : "已关闭暗黑模式",
        icon: next ? "success" : "info",
      });
    },

    // 按系统首选项应用（用于跟随系统）
    applySystemPref() {
      const mql =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (mql) {
        this.applyDarkMode(!!mql.matches);
      }
    },

    // 系统主题监控（当 dark_mode_sync 为 true 时，启用监听）
    setupSystemPrefListener() {
      if (!window.matchMedia) return;
      if (this._mqlListener) {
        // 已有监听器时先移除
        try {
          window
            .matchMedia("(prefers-color-scheme: dark)")
            .removeEventListener("change", this._mqlListener);
        } catch (e) {
          try {
            window
              .matchMedia("(prefers-color-scheme: dark)")
              .removeListener(this._mqlListener);
          } catch (e2) {}
        }
        this._mqlListener = null;
      }
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      this._mqlListener = (e) => {
        if (util.getValue("dark_mode_sync")) {
          this.applyDarkMode(!!e.matches);
        }
      };
      // 支持 addEventListener 或 addListener
      try {
        mql.addEventListener("change", this._mqlListener);
      } catch (e) {
        try {
          mql.addListener(this._mqlListener);
        } catch (e2) {}
      }
    },

    updateDarkToggleButton() {
      // 更新弹窗内的切换按钮图标（如果存在）
      const btn = document.getElementById("dark-toggle");
      if (!btn) return;
      const isDark = !!util.getValue("dark_mode");
      // SVG：月亮 + 太阳 图标（根据模式切换）
      const sunSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.34 4.67l1.79 1.8 1.63-1.63zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.66 1.02l1.79-1.8-1.63-1.63-1.79 1.8 1.63 1.63zM17 13h3v-2h-3v2zM12 6a6 6 0 100 12 6 6 0 000-12zm-1 14h2v3h-2v-3zM4.24 19.16l1.63-1.63-1.79-1.8-1.63 1.63 1.79 1.8zM20.66 19.33l-1.79-1.8-1.63 1.63 1.8 1.79 1.62-1.62z"/></svg>`;
      const moonSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9.37 5.51A7 7 0 0019 14.99 9 9 0 119.37 5.51z"/></svg>`;
      btn.innerHTML = isDark ? sunSvg : moonSvg;
      // 设置类（按钮在暗黑模式时加上 .on 以使用强调色）
      if (isDark) btn.classList.add("on");
      else btn.classList.remove("on");
      // 兼容性：在更新完 svg 后再强制应用填充，防止页面全局样式覆盖
      try {
        const svgPath = btn.querySelector("svg path");
        if (svgPath) {
          svgPath.style.fill = "currentColor";
        }
      } catch (e) {}
    },

    init() {
      this.initValue();
      this.addPluginStyle();
      // 加载当前暗黑模式状态并应用（如果开启了跟随系统则按系统）
      if (util.getValue("dark_mode_sync")) {
        this.applySystemPref();
      } else {
        this.applyDarkMode(!!util.getValue("dark_mode"));
      }
      this.setupSystemPrefListener();
      this.addHotKey();
      this.addPageListener();
      this.isTopWindow() && this.registerMenuCommand();
    },
  };

  main.init();
})();
