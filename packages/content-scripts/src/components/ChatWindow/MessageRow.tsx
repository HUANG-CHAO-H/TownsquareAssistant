import React from "react";
import {Avatar} from "@douyinfe/semi-ui";
import type {} from '@/models';

export interface MessageRowProps {
    // 头像链接
    avatarUrl: string;
    // 发送者头像所在的方向
    direction: 'left' | 'right';
    // 发送者的名称
    name: string;
    // 消息内容
    content: React.ReactNode;
    // 消息体
    msg: ChatMessageType;
}

export function MessageRow(props: MessageRowProps) {
    const { direction, msg } = props;
    const avatar = <Avatar size={'small'} src={props.avatarUrl} />;
    return (
        <div className={'chat-message-row'}>
            <div className={'chat-message-avatar'}>{direction === 'left' ? avatar : null}</div>
            <div className={'chat-message-content'} style={{ textAlign: direction }}>
                <div>{props.name}</div>
                <div>{props.content}</div>
            </div>
            <div className={'chat-message-avatar'}>{direction === 'right' ? avatar : null}</div>
        </div>
    )
}
