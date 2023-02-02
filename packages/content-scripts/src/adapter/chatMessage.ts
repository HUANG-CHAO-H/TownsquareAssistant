import type { ChatMessageType } from "../../../models";
import { SortQueue } from "../../../utils";
import { adapterEvent, adapterState, chatMsgStore } from './context';

// 消息队列的长度限制
const MSG_QUEUE_SIZE = 50;
const playerMsgQueueMap = new Map<number, SortQueue<ChatMessageType, number>>();

adapterEvent.addListener('chat_msg', msg => {
    if (!adapterState.data.hostPlayer) {
        throw new Error('message is arrive, but host info is empty');
    }
    const hostId = adapterState.data.hostPlayer.id;
    let playerId: number;
    if (hostId === msg.senderUid) {
        playerId = msg.toUid;
    } else if (hostId === msg.toUid) {
        playerId = msg.senderUid;
    } else {
        console.error('未知的消息发送者和接收方');
        return;
    }
    let queue = playerMsgQueueMap.get(playerId);
    if (!queue) {
        queue = new SortQueue<ChatMessageType, number>(compare, MSG_QUEUE_SIZE);
        playerMsgQueueMap.set(playerId, queue);
    }
    queue.push(msg.id, msg);
    chatMsgStore.set(playerId, queue.msgQueue);
})

function compare(a: ChatMessageType, b: ChatMessageType): number {
    return a.createTime - b.createTime;
}

// 测试代码
chatMsgStore.observeAllChange((id: number, msgArray: ChatMessageType[]) => {
    console.log('chatMsgStore 测试点', id, msgArray);
})
