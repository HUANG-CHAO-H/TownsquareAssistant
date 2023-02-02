import {ChatMessageType} from "../../../../models";
import {Avatar} from "@douyinfe/semi-ui";
import React from "react";

export interface MessageRowProps {
    // 发送者头像所在的方向
    direction: 'left' | 'right';
    // 消息体
    msg: ChatMessageType;
}

export function MessageRow(props: MessageRowProps) {
    const { direction, msg } = props;
    const avatar = <Avatar size={'small'} src={msg.senderAvatarUrl} />;
    return (
        <div className={'chat-message-row'}>
            <div className={'chat-message-avatar'}>{direction === 'left' ? avatar : null}</div>
            <div className={'chat-message-content'} style={{ textAlign: direction }}>
                <div>{msg.senderNickname}</div>
                <div>{msg.content}</div>
            </div>
            <div className={'chat-message-avatar'}>{direction === 'right' ? avatar : null}</div>
        </div>
    )
}
