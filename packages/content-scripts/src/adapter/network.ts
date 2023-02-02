import { adapterEvent } from './context';
import { decodeUint8ArrayMsg, formatChatMessage } from "../../../models";
import {tryToParseJson} from "../../../utils";

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
        adapterEvent.dispatch('http_request', {
            method,
            url,
            requestBody: body || null,
            responseBody: this.response,
        });
        if (url.includes('message/v2/messages')) {
            const msgArray = tryToParseJson(this.response as any)?.data?.list || [];
            if (!(msgArray instanceof Array)) {
                console.error('[助手]: message/v2/messages 接口的返回体接口超出预期, 无法解析', body);
                return;
            }
            for (const msg of msgArray) {
                adapterEvent.dispatch('chat_msg', formatChatMessage(msg));
            }
        }
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
                adapterEvent.dispatch('chat_msg', m.msg);
            } else if (m.baseType === 'clockTower') {
                adapterEvent.dispatch('clockTower_msg', m.msg);
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
