import React, {useMemo, useState} from "react";
import {Avatar} from "@douyinfe/semi-ui";
import type {} from '@/models';

export interface MessageRowProps {
    // 头像链接
    avatarUrl: string;
    // 发送者头像所在的方向
    direction: 'left' | 'right';
    // 发送者的名称
    name: string;
    // 当前消息的时间戳
    timeStamp: number;
    // 消息内容
    content: React.ReactNode;
}

export function MessageRow(props: MessageRowProps) {
    const [hover, setHover] = useState(false);
    const { direction } = props;
    const avatar = useMemo(() => <Avatar size={'small'} src={props.avatarUrl} />, [props.avatarUrl]);
    const name = useMemo(() => {
        if (hover && props.timeStamp) {
            if (direction === 'left') {
                return `${props.name} (${new Date(props.timeStamp).toLocaleDateString()})`;
            } else if (direction === 'right') {
                return `(${new Date(props.timeStamp).toLocaleDateString()}) ${props.name}`;
            }
        }
        return props.name
    }, [props.name, props.timeStamp, direction]);
    return (
        <div className={'chat-message-row'}>
            <div className={'chat-message-avatar'}>{direction === 'left' ? avatar : null}</div>
            <div
                className={'chat-message-content'}
                style={{ textAlign: direction }}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
            >
                <div>{name}</div>
                <div>{props.content}</div>
            </div>
            <div className={'chat-message-avatar'}>{direction === 'right' ? avatar : null}</div>
        </div>
    )
}
