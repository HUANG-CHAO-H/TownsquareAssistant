import {decodeUint8ArrayMsg} from "@/models";
import globalEvent from "../globalEvent";

// http网络请求劫持与监听
const _open = XMLHttpRequest.prototype.open;
const _send = XMLHttpRequest.prototype.send;
const symbol_method = Symbol('method');
const symbol_url = Symbol('url');
XMLHttpRequest.prototype.open = function (method, url) {
    this[symbol_method] = method;
    this[symbol_url] = url;
    return _open.apply(this, arguments as any);
}
XMLHttpRequest.prototype.send = function (body) {
    const method = this[symbol_method] || '';
    const url = this[symbol_url] || '';
    this.addEventListener('load', function () {
        globalEvent.dispatch('http_request', {
            method,
            url,
            requestBody: body || null,
            responseBody: this.response,
        });
    });
    return _send.apply(this, arguments as any);
}

// ws网络通讯劫持与监听
const interval = setInterval(() => {
    if (!window.mqtt_client) {
        return;
    }
    console.info('[助手]: 注册监听函数');
    window.mqtt_client.on('message', (key: string, data: Uint8Array) => {
        const msg = decodeUint8ArrayMsg(data);
        for (const m of msg) {
            if (m.baseType === 'chat') {
                globalEvent.dispatch('ws_chat_msg', m.msg);
            } else if (m.baseType === 'clockTower') {
                globalEvent.dispatch('ws_clockTower_msg', m.msg);
            }
        }
    });
    clearInterval(interval);
}, 50);
declare global {
    interface Window {
        mqtt_client: {
            on: (key: string, callback: Function) => void;
        }
    }
}
