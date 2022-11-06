
'use strict';
console.info('hello, 血染钟楼助手(chrome插件)')
function injectScript(_document = document) {
    const span = _document.createElement('span');
    span.id = 'townsquare_assistant_url';
    span.style.display = 'none';
    span.innerHTML = chrome.runtime.getURL('/');
    _document.body.appendChild(span);
    const head = _document.head || _document.getElementsByTagName("head")[0] || _document.documentElement;

    const script = _document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/contentScript.js'));
    head.insertBefore(script, head.lastChild);
    
    const styleLink = _document.createElement('link');
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("href", chrome.runtime.getURL('assets/css/contentScript.css'));
    head.insertBefore(styleLink, head.lastChild);
}
if (window.location.href.includes('www.imdodo.com/tools/clocktower')) {
    injectScript();
} else {
    if (window['injectScriptInterval'] !== undefined) {
        clearInterval(window['injectScriptInterval']);
    }
    setInterval(() => {
        const iframe = document.querySelector('iframe#ifr');
        if (!iframe?.src.includes('www.imdodo.com/tools/clocktower')) return;
        const _document = iframe.contentDocument;
        if (!_document) return;
        if (_document.querySelector('span#townsquare_assistant_url')) return;
        injectScript(_document);
    }, 1000);
}
