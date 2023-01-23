import { EventEmitter } from '@/utils';
import {WsChatMessage, WsClockTowerMessage, decodeUint8ArrayMsg} from '@/models';

export interface IGlobalEvent {
    // 接收到聊天消息
    ws_chat_msg: (msg: WsChatMessage) => void;
    // 长链接收到clockTower相关的消息
    ws_clockTower_msg: (msg: WsClockTowerMessage) => void;
}

export const globalEvent = new EventEmitter<IGlobalEvent>();
export default globalEvent;

const interval = setInterval(() => {
    if (!window.mqtt_client) {
        return;
    }
    console.info('[助手]: 注册监听函数');
    window.mqtt_client.on('message', (key: string, data: Uint8Array) => {
        const msg = decodeUint8ArrayMsg(data);
        for (const m of msg) {
            if (m.baseType === 'chat') {
                globalEvent.dispatch('ws_chat_msg', m);
            } else if (m.baseType === 'clockTower') {
                globalEvent.dispatch('ws_clockTower_msg', m);
            }
        }
        console.info('[助手]: ws消息', key, msg);
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
