// @ts-ignore
module.exports = function document_start() {
    // const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    const body = document.body || document.getElementsByTagName("body")[0] || document.documentElement;

    // 在页面中注入span, 标记插件地址
    const span = document.createElement('span');
    span.id = 'townsquare_assistant_url';
    span.style.display = 'none';
    span.innerHTML = chrome.runtime.getURL('/');
    body.appendChild(span);

    // if (window.location.href.includes('www.imdodo.com/tools/clocktower')) {
    //     // 注入脚本
    //     const script = document.createElement('script');
    //     script.setAttribute("src", chrome.runtime.getURL('pre-runtime/pre_runtime.js'));
    //     head.insertBefore(script, head.lastChild);
    // }
}