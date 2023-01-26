import { EventEmitter } from '@/utils';
import {ChatMessageType} from '@/models';

export interface HttpRequestInfo {
    method: string;
    url: string;
    requestBody: Document | XMLHttpRequestBodyInit | null;
    responseBody: Record<string, any> | null;
}

export interface IGlobalEvent {
    // 接收到聊天消息
    ws_chat_msg: (msg: ChatMessageType) => void;
    // 长链接收到clockTower相关的消息
    ws_clockTower_msg: (msg: [string, Record<string, any>]) => void;
    // http响应
    http_request: (info: HttpRequestInfo) => void;
}

export const globalEvent = new EventEmitter<IGlobalEvent>();
export default globalEvent;

globalEvent.addListener('ws_chat_msg', msg => console.info('ws_chat_msg', msg));
globalEvent.addListener('ws_clockTower_msg', msg => console.info('ws_clockTower_msg', msg));
globalEvent.addListener('http_request', info => console.info('http_request', info));
