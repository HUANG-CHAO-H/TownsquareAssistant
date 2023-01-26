import type { ChatMessageType } from "@/models";

export class ChatMessage {
    // 获取id的set版本
    get msgIdSet(): Set<number> {
        if (this._cache.msgQueueVersion === this._cache.msgIdSetVersion) {
            return this._cache.msgIdSet;
        }
        const set = new Set<number>();
        for (const m of this.msgQueue) {
            set.add(m.id);
        }
        this._cache.msgIdSetVersion = this._cache.msgQueueVersion;
        this._cache.msgIdSet = set;
        return set;
    }

    // 消息队列
    msgQueue: Array<ChatMessageType> = [];

    private _cache = {
        // msgQueue的消息版本, 每次变更都会修改此版本号
        msgQueueVersion: 0,
        // msgIdSet的版本号
        msgIdSetVersion: 0,

        msgIdSet: new Set<number>(),
    }

    push(msg: ChatMessageType) {
        // 先查询此消息是否存在
        if (this.msgIdSet.has(msg.id)) {
            return false;
        }
    }
}