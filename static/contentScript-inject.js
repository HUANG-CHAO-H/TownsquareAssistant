
'use strict';

const span = document.createElement('span');
span.id = 'townsquare_assistant_url';
span.style.display = 'none';
span.innerHTML = chrome.runtime.getURL('/');
document.body.appendChild(span);

const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('js/contentScript.js'));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);
