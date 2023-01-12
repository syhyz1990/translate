// ==UserScript==
// @name              超级翻译助手
// @namespace         https://github.com/syhyz1990/translate
// @version           1.0.0
// @author            YouXiaoHou
// @description       用鼠标选中文字，按下快捷键（默认为F9），可自动翻译文字。已支持超过 14 种语言。
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-translate.html
// @supportURL        https://github.com/syhyz1990/translate
// @updateURL         https://www.youxiaohou.com/translate.user.js
// @downloadURL       https://www.youxiaohou.com/translate.user.js
// @match             *://*/*
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @require           https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
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
// @grant             GM_info
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik02NTguMyA0MDIuM2gyOTIuNmM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg0NzUuNGMtNDAuNCAwLTczLjEtMzIuNS03My4xLTczLjFWNjU4LjNoMTQ2LjNjNjAuOSAwIDEwOS43LTQ5LjEgMTA5LjctMTA5LjdWNDAyLjN6TTAgNzMuMUMwIDMyLjcgMzIuNSAwIDczLjEgMGg0NzUuNGM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg3My4xYy00MC40LjEtNzMuMS0zMi40LTczLjEtNzNWNzMuMXptMTQ2LjMgMzE1LjhoNTMuNHYtMjguM2g3N3YxMzUuMmg1Ni42VjM2MC42aDc4LjZ2MjMuNkg0NzBWMjA1SDMzMy4zdi0zOS4zYzAtMTEuNSAxLjYtMjEuNSA0LjgtMjkuOC44LTEuNSAxLjQtMy4xIDEuNS00LjggMC0xLTMuNy0yLTExLTMuMWgtNTMuNXY3N0gxNDYuM3YxODMuOXpNMTk5LjcgMjQ5aDc3djY5LjFoLTc3VjI0OXptMjEyLjIgNjkuMWgtNzguNlYyNDloNzguNnY2OS4xem0yMzIuOSA1NTcuN2wyMi02MS4zaDExNC43bDIyIDYxLjNoNjIuOGwtMTAyLTI5MC43aC03My45TDU4NS4xIDg3NS45bDU5LjctLjF6bTM3LjgtMTEwTDcyNSA2NDEuN2gxLjZsMzkuMyAxMjQuMWgtODMuM3ptMjY4LjMtNDczLjJoLTczLjFjMC04MC44LTY1LjUtMTQ2LjMtMTQ2LjMtMTQ2LjNWNzMuMWMxMjEuMSAwIDIxOS40IDk4LjMgMjE5LjQgMjE5LjV6TTczLjEgNzMxLjRoNzMuMWMwIDgwLjggNjUuNSAxNDYuMyAxNDYuMyAxNDYuM3Y3My4xYy0xMjEuMS4xLTIxOS40LTk4LjItMjE5LjQtMjE5LjR6IiBmaWxsPSIjZDgxZDQ1Ii8+PC9zdmc+
// ==/UserScript==

(function () {
    'use strict';

    const customClass = {
        container: 'translate-container',
        popup: 'translate-popup',
        content: 'translate-content',
    };

    const toastClass = {
        container: 'translate-d-container',
        popup: 'translate-d-popup',
    };

    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        customClass: toastClass,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    let languageMap = {
        'auto': '自动检测',
        'ar': '阿拉伯语',
        'de': '德语',
        'ru': '俄语',
        'fr': '法语',
        'ko': '韩语',
        'la': '拉丁语',
        'pt': '葡萄牙语',
        'ja': '日语',
        'th': '泰语',
        'es': '西班牙语',
        'it': '意大利语',
        'en': '英语',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
    };

    let util = {
        clog(c) {
            console.group("%c %c [油小猴翻译助手]", `background:url(${GM_info.script.icon}) center center no-repeat;background-size:12px;padding:3px`, "");
            console.log(c);
            console.groupEnd();
        },

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
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            document.head.appendChild(style);
        },

        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        post(url, data, headers, type) {
            if (this.isType(data) === 'object') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
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
        selectedText: '',
        translatedText: '',

        //初始化配置数据
        initValue() {
            let value = [{
                name: 'setting_success_times',
                value: 0
            }, {
                name: 'hotkey',
                value: 'f9'
            }, {
                name: 'from',
                value: 'auto'
            }, {
                name: 'to',
                value: 'zh-CN'
            }];

            value.forEach((v) => {
                if (util.getValue(v.name) === undefined) {
                    util.setValue(v.name, v.value);
                }
            });
        },

        async startTranslate() {
            this.selectedText = window.getSelection().toString();
            this.translatedText = '';
            if (this.selectedText) {
                this.translatedText = await this.translate(this.selectedText);
            }
            await this.showPopup(this.selectedText, this.translatedText);
        },

        async translate(text, showToast = true) {
            try {
                showToast && toast.fire({title: '正在翻译...', icon: 'info'});
                let res = await util.post('https://translate.youxiaohou.com', {
                    str: text,
                    from: util.getValue('from'),
                    to: util.getValue('to')
                }, {
                    'Content-Type': 'application/json'
                });
                if (res.code === 200) {
                    util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);
                    return res.data;
                }
                return '';
            } catch (e) {
                return '';
            }
        },

        async showPopup(selectedText, translatedText) {
            let html = `<div class="translate-wrapper">
                          <div class="translate-box"> 
                            <div class="left-side">
                                <div class="translate-title"><div class="translate-lang">${util.parseLanguage(util.getValue('from'))}</div><button class="translate-btn" title="点击翻译左侧文本">翻译</button></div>
                                <textarea class="translate-textarea" placeholder="请输入要翻译的内容">${selectedText}</textarea>
                                <div class="translate-toolbar"><span id="word-count">字数：${selectedText.length}</span></div>
                            </div>
                            <div class="right-side">
                                <div class="translate-title"><div class="translate-lang">${util.parseLanguage(util.getValue('to'))}</div></div>
                                <div class="translate-target">${translatedText}</div>
                                <div class="translate-toolbar"><svg class="translate-copy" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M672 832H224c-52.928 0-96-43.072-96-96V160c0-52.928 43.072-96 96-96h448c52.928 0 96 43.072 96 96v576c0 52.928-43.072 96-96 96zM224 128c-17.632 0-32 14.368-32 32v576c0 17.664 14.368 32 32 32h448c17.664 0 32-14.336 32-32V160c0-17.632-14.336-32-32-32H224z"/><path d="M800 960H320c-17.664 0-32-14.304-32-32s14.336-32 32-32h480c17.664 0 32-14.336 32-32V256c0-17.664 14.304-32 32-32s32 14.336 32 32v608c0 52.928-43.072 96-96 96zM544 320H288c-17.664 0-32-14.336-32-32s14.336-32 32-32h256c17.696 0 32 14.336 32 32s-14.304 32-32 32zm64 160H288.032c-17.664 0-32-14.336-32-32s14.336-32 32-32H608c17.696 0 32 14.336 32 32s-14.304 32-32 32z"/><path d="M608 640H288c-17.664 0-32-14.304-32-32s14.336-32 32-32h320c17.696 0 32 14.304 32 32s-14.304 32-32 32z"/></svg><span class="translate-copy-tip"></span></div>
                            </div>
                          </div>
                        <div class="translate-footer"><a href="https://www.youxiaohou.com/tool/install-translate.html" target="_blank">油小猴翻译助手</a> 为您提供翻译服务</div>
                        </div>`;

            Swal.fire({
                width: '1200px',
                position: 'top',
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                html: html,
                customClass
            });

            document.querySelector('.translate-copy').addEventListener("click", (e) => {
                GM_setClipboard(this.translatedText);
                let copyTip = document.querySelector('.translate-copy-tip');
                copyTip.innerHTML = '复制成功';
                setTimeout(() => {
                    copyTip.innerHTML = '';
                }, 3000);
            });
            document.querySelector('.translate-btn').addEventListener("click", async (e) => {
                let text = document.querySelector('.translate-textarea').value;
                let translated = await this.translate(text, false);
                this.translatedText = translated;
                document.querySelector('.translate-target').innerHTML = translated;
            });
            document.querySelector('.translate-textarea').addEventListener("input", async (e) => {
                document.querySelector('#word-count').innerHTML = '字数：' + e.target.value.length;
            });
            //自动聚焦
            let textarea = document.querySelector('.translate-textarea');
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        },

        addHotKey() {
            hotkeys(util.getValue('hotkey'), async (event, handler) => {
                event.preventDefault();
                await this.startTranslate();
            });
        },

        //重置翻译次数
        clearTranslateTimes() {
            Swal.fire({
                showCancelButton: true,
                title: '确定要重置翻译次数吗？',
                icon: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: toastClass,
            }).then(res => {
                if (res.isConfirmed) {
                    util.setValue('setting_success_times', 0);
                    history.go(0);
                }
            });
        },

        setHotkey() {
            Swal.fire({
                title: '请选择快捷键',
                text: '注意：避免与其他程序产生冲突',
                input: 'select',
                inputValue: util.getValue('hotkey').toUpperCase(),
                inputOptions: {
                    'F1': 'F1',
                    'F2': 'F2',
                    'F3': 'F3',
                    'F4': 'F4',
                    'F5': 'F5',
                    'F6': 'F6',
                    'F7': 'F7',
                    'F8': 'F8',
                    'F9': 'F9（默认）',
                    'F10': 'F10',
                    'F11': 'F11',
                    'F12': 'F12',
                },
                confirmButtonText: '确定',
                customClass: toastClass,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    util.setValue('hotkey', result.value.toLowerCase());
                    history.go(0);
                }
            });
        },

        setFromLanguage() {
            Swal.fire({
                title: '请选择原始语言',
                text: '选择您要翻译的原始语言',
                input: 'select',
                inputValue: util.getValue('from'),
                inputOptions: languageMap,
                confirmButtonText: '确定',
                customClass: toastClass,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    util.setValue('from', result.value);
                    history.go(0);
                }
            });
        },

        setToLanguage() {
            let map = JSON.parse(JSON.stringify(languageMap));
            delete map.auto;
            Swal.fire({
                title: '请选择目标语言',
                text: '选择您要翻译的目标语言',
                input: 'select',
                inputValue: util.getValue('to'),
                inputOptions: map,
                confirmButtonText: '确定',
                customClass: toastClass,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    util.setValue('to', result.value);
                    history.go(0);
                }
            });
        },

        registerMenuCommand() {
            GM_registerMenuCommand(`⚙️ 设置快捷键：${util.getValue('hotkey').toUpperCase()}`, () => {
                this.setHotkey();
            });
            GM_registerMenuCommand(`⚙️ 设置原始语言：${util.parseLanguage(util.getValue('from'))}`, () => {
                this.setFromLanguage();
            });
            GM_registerMenuCommand(`⚙️ 设置目标语言：${util.parseLanguage(util.getValue('to'))}`, () => {
                this.setToLanguage();
            });
            GM_registerMenuCommand('👀 已翻译：' + util.getValue('setting_success_times') + '次', () => {
                this.clearTranslateTimes();
            });
        },


        addPluginStyle() {
            let style = `
                .translate-container { z-index: 99999!important; }
                .translate-popup { font-size: 14px !important;padding:0 !important; }
                .translate-d-container { z-index: 999999!important;}
                .translate-d-popup { font-size: 14px !important;}
                .translate-content { padding:0 !important; }
                .translate-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; }
                .translate-setting-checkbox { width: 16px;height: 16px; }
                .translate-wrapper { margin: 28px 24px 10px;}
                .translate-box { display: flex; min-height: calc(100vh - 130px)}
                .translate-box .left-side { flex:1; width:50%; border: 1px solid #ddd; border-radius: 15px 0 0 15px; border-right:none;color: #666;position: relative;padding: 0 0 36px;}
                .translate-box .right-side { flex:1; width:50%; border:1px solid #ddd; border-radius: 0 15px 15px 0; border-left: none;background: #f5f5f5;color: #000;position: relative;padding: 0 0 36px;}
                .translate-box .translate-textarea { width: 100%; height: calc(100% - 50px); border-radius: 15px 0 0 15px; resize: none; line-height: 28px; font-size: 16px; color: #666; border: none; text-align: left; padding: 20px; box-sizing: border-box; outline:none; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word;}
                .translate-box .translate-textarea::-webkit-scrollbar { width: 6px; height: 6px;}
                .translate-box .translate-textarea::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4)}
                .translate-box .translate-textarea::-webkit-scrollbar-thumb, .translate-box .translate-textarea::-webkit-scrollbar-thumb:hover { border-radius: 5px; box-shadow: inset 0 0 6px rgb(0 0 0 / 20%);}
                .translate-box .translate-toolbar { position: absolute; bottom: 0; font-size: 13px; color: #999; height: 36px; text-align: right; left: 20px; right: 20px; display: flex; align-items: center; justify-content: end; gap:5px}
                .translate-box .translate-target { width: 100%; line-height: 28px; font-size: 16px; border: none; text-align: left; white-space: pre-wrap;  padding: 20px; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word; position: relative;}
                .translate-box .translate-title { border-bottom: 1px solid #ddd; height: 48px;line-height: 48px; padding: 0 20px 0 10px; position: sticky; top: -10px;display: flex;align-items:center;justify-content: space-between; z-index: 99999; background: #fff;}         
                .translate-box .translate-lang { position:relative; color:#1a73e8;padding: 0 13px; cursor:pointer;font-size:15px;font-weight: 700}                
                .translate-box .translate-lang:after { content: '';display:block;position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 2px; background: #1a73e8;}                
                .translate-box .translate-lang:hover { background: #f6fafe;}                
                .translate-box .left-side .translate-title { border-radius: 15px 0 0 0;}
                .translate-box .right-side .translate-title { border-radius: 0 15px 0 0;}
                .translate-btn { border: 0; border-radius: 5px; color: #fff; font-size: 14px; padding: 8px 13px; background: #4396fc; cursor: pointer; line-height: 1;}
                .translate-btn:hover { background: #187efa;}
                .translate-copy {cursor: pointer;opacity: 0.2;transition: opacity .3s}
                .translate-copy:hover {opacity: 0.5;transition: opacity .3s}
                .translate-footer {margin-top: 8px; font-size: 14px; color: #999}
                .translate-footer a {color: rgb(26 115 232 / 70%)}
                .translate-footer a:hover {color: rgb(26 115 232 / 90%)}
                .swal2-close { font-size: 26px;!important}
                .swal2-close:focus {box-shadow:none!important}
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('translate-style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('translate-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        isTopWindow() {
            return window.self === window.top;
        },

        init() {
            this.initValue();
            this.addPluginStyle();
            this.addHotKey();
            this.isTopWindow() && this.registerMenuCommand();
        },
    };

    main.init();
})();
