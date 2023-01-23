import {enc} from "crypto-js";

const enum BaseMessageType {
    // 聊天消息
    kky = 1,
    // 此消息会触发名为 MQTT_LIVE_MESSAGE_ARRIVED 的事件
    live = 2,
    //
    isLandChanel = 3,
    // 钟楼业务消息
    clockTower = 4,
}

// BaseMessageType.kky的子类型
const enum SubMessageType {
    // 正常的消息内容
    chat = 1,
    // 消息撤回? RECALL_CHAT_MESSAGE事件
    recallMsg = 2,
    // 消息已读? RECALL_CHAT_MESSAGE; 所有消息默认已读, 因此每次收到 1 类型的消息后,会紧跟着收到 3 类型的消息
    readMsg = 3,
}

// 聊天信息格式
export interface ChatMessageType {
    // 消息ID
    id: number;
    // 消息类型
    chatMsgType: number;
    // 消息内容
    content: string;
    // 创建时间
    createTime: number;
    conversationId: number;
    identity: number;
    relatedId: number;
    tk: string;

    // 发送者相关信息
    senderAuditAvatarUrl: string;
    senderAuditNickName: string;
    senderAuthType: number;
    senderAvatarUrl: string;
    senderBot: number;
    senderNickname: string;
    senderUid: number;
    senderUsingNftAvatar: number;

    // 接受者相关信息
    toAuthType: number;
    toAvatarUrl: string;
    toBot: number;
    toNickName: string;
    toUid: number;
    toUsingNftAvatar: number;
}

// ws接收到的原始消息
export interface BaseWsMessage {
    baseType: BaseMessageType;
    subType: SubMessageType | number;
    // json字符串
    msg: Record<string, any> | Array<any>;
}
export interface WsChatMessage {
    baseType: 'chat';
    msg: ChatMessageType;
}
export interface WsClockTowerMessage {
    baseType: 'clockTower';
    msg: [string, Record<string, any>];
}
export type WsMessage = WsChatMessage | WsClockTowerMessage;

const textDecoder = new TextDecoder();
export function decodeUint8ArrayMsg(data: Uint8Array): WsMessage[] {
    let parseData: BaseWsMessage[] | undefined;
    try {
        parseData = JSON.parse(enc.Base64.parse(textDecoder.decode(data)).toString(enc.Utf8));
    } catch (e) {
        console.error('decodeUint8ArrayMsg Error: decode failed', e);
    }
    const msg: WsMessage[] = [];
    if (!(parseData instanceof Array)) {
        console.info('decodeUint8ArrayMsg Error: parseData is not a array', parseData);
        return msg;
    }
    for (const item of parseData) {
        let baseType: WsMessage['baseType'];
        if (item.baseType === BaseMessageType.kky) {
            if (item.subType !== SubMessageType.chat) {
                continue;
            }
            baseType = 'chat';
        } else if (item.baseType === BaseMessageType.clockTower) {
            if (item.subType !== 1) {
                continue;
            }
            baseType = 'clockTower';
        } else {
            continue;
        }
        msg.push({
            baseType,
            msg: (item.msg && typeof item.msg === 'object') ? item.msg : JSON.parse(item.msg || '[]'),
        });
    }
    return msg;
}
