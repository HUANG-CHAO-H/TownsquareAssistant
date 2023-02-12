import React, {useMemo, useState, useRef, useLayoutEffect, createElement, memo} from "react";
import {Avatar} from "@douyinfe/semi-ui";
import type {} from '@/models';

export interface ChatWindowBodyProps {
    chatContent: MessageRowProps[];
}

export const ChatWindowBody: React.FC<ChatWindowBodyProps> = memo(props => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const content = useMemo(
        () => props.chatContent.map((c, index) => createElement(MessageRow, {...c, key: c.msgKey || String(index)})),
        [props.chatContent],
    );
    // 当依赖发生变化时，强制定位滚动轴到底部
    useLayoutEffect(() => {
        const div = divRef.current;
        if (!div) return;
        div.scrollTop = div.scrollHeight;
    }, []);
    return <div ref={divRef} className={'chat-window-body new-scroll-bar'}>{content}</div>;
});
ChatWindowBody.displayName = 'ChatWindowBody';

export interface MessageRowProps {
    // 消息的唯一标识
    msgKey?: string | number;
    // 头像链接
    avatarUrl: string;
    // 发送者头像所在的方向
    direction: 'left' | 'right';
    // 发送者的名称
    name: string;
    // 消息内容
    content: React.ReactNode;
    // 当前消息的时间戳
    timeStamp: number;
}

export function MessageRow(props: MessageRowProps) {
    const [hover, setHover] = useState(false);
    const { direction } = props;
    const avatar = useMemo(() => <Avatar size={'small'} src={props.avatarUrl} />, [props.avatarUrl]);
    const name = useMemo(() => {
        if (hover && props.timeStamp) {
            if (direction === 'left') {
                return `${props.name} (${new Date(props.timeStamp).toLocaleTimeString()})`;
            } else if (direction === 'right') {
                return `(${new Date(props.timeStamp).toLocaleTimeString()}) ${props.name}`;
            }
        }
        return props.name
    }, [props.name, props.timeStamp, direction, hover]);
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
