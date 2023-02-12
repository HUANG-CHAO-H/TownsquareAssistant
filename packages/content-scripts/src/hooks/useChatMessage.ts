import {useEffect, useState} from "react";
import type {ChatMessageType} from "../../../models";
import type {MessageRowProps} from "../pages/ChatPage/ChatWindow/ChatWindowBody";
import {adapterState, chatMsgStore} from "../adapter";
import {Toast} from "@douyinfe/semi-ui";

export function useChatMessage(playerId: number): ChatMessageType[] {
    const [message, setMessage] = useState<ChatMessageType[]>([]);
    useEffect(() => {
        setMessage(chatMsgStore.get(playerId) || []);
        chatMsgStore.observe(playerId, setMessage);
        return () => void chatMsgStore.unObserve(playerId, setMessage);
    }, [playerId]);
    return message;
}

export function useMessageRow(playerId: number): MessageRowProps[] {
    const [message, setMessage] = useState<MessageRowProps[]>([]);
    const hostInfo = adapterState.useValue('hostPlayer');
    useEffect(() => {
        const hostId = hostInfo?.id;
        if (!hostId) {
            Toast.error('hostInfo is not find');
            return undefined;
        }
        const setMessageProps = (value: ChatMessageType[]) => setMessage(
            value.map<MessageRowProps>(v => ({
                msgKey: v.id,
                direction: v.senderUid === hostId ? 'right' : 'left',
                avatarUrl: v.senderAvatarUrl,
                name: v.senderNickname,
                content: v.content,
                timeStamp: v.createTime,
            })),
        );
        setMessageProps(chatMsgStore.get(playerId) || []);
        chatMsgStore.observe(playerId, setMessageProps);
        return () => void chatMsgStore.unObserve(playerId, setMessageProps);
    }, [playerId]);
    return message;
}
