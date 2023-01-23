// @ts-ignore
module.exports = function document_end() {
    // 向页面中插入script标签引入脚本文件, 以及必须的css样式
    function injectScript(_document = document) {
        const head = _document.head || _document.getElementsByTagName("head")[0] || _document.documentElement;
        // 注入
        const script = _document.createElement('script');
        script.setAttribute("type", "module");
        script.setAttribute("src", chrome.runtime.getURL('content-scripts/index.js'));
        head.insertBefore(script, head.lastChild);

        const styleLink = _document.createElement('link');
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", chrome.runtime.getURL('content-scripts/css/index.css'));
        head.insertBefore(styleLink, head.lastChild);
    }
    if (window.location.href.includes('www.imdodo.com/tools/clocktower')) {
        injectScript();
    } else {
        if (window['injectScriptInterval'] !== undefined) {
            clearInterval(window['injectScriptInterval']);
        }
        window['injectScriptInterval'] = setInterval(() => {
            const iframe: HTMLIFrameElement | null = document.querySelector('iframe#ifr');
            if (!iframe?.src.includes('www.imdodo.com/tools/clocktower')) return;
            const _document = iframe.contentDocument;
            if (!_document) return;
            if (_document.querySelector('span#townsquare_assistant_url')) return;
            injectScript(_document);
            clearInterval(window['injectScriptInterval']);
            window['injectScriptInterval'] = undefined;
        }, 1000);
    }
}
