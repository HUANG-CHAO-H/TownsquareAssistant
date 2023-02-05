import React, {useEffect, useState} from "react";
import { TextArea, Button } from "@douyinfe/semi-ui";
import {useCacheRef} from "../../../../utils";
import './style.less';
import {ChatWindowBody, ChatWindowBodyProps} from "./ChatWindowBody";

export type ChatWindowProps = {
    title?: React.ReactNode;
    // 聊天输入框中的内容
    input?: string;
    // 设置input
    setInput?: (value: string) => void;
    // 当用户点击发送按钮时
    onClickSend?: (value: string) => void | boolean | Promise<void | boolean>;
} & ChatWindowBodyProps;

export function ChatWindow(props: ChatWindowProps) {
    const [input, setInput] = useState('');
    const cacheRef = useCacheRef({
        setInput: props.setInput,
    });
    // 上层的值覆盖当前状态
    useEffect(() => setInput(props.input || ''), [props.input === input]);
    // 延迟向上层传递input变更（节流防抖）
    useEffect(() => {
        const timeout = setTimeout(() => cacheRef.current.setInput?.(input), 500);
        return () => clearTimeout(timeout);
    }, [input]);

    const onClickSend = async () => {
        let inputValue = '';
        setInput(v => (inputValue = v) && '');
        if (props.onClickSend && (await props.onClickSend(input.trim())) === false) {
            setInput(inputValue);
            return;
        }
        cacheRef.current.setInput?.('');
    };
    return <div className={'chat-window-container'}>
        <div><div className={'chat-window-header'}>{props.title}</div></div>
        <div><ChatWindowBody chatContent={props.chatContent}/></div>
        <div>
            <div className={'chat-window-footer'} onKeyUp={e => e.key === 'Enter' && !e.shiftKey && onClickSend()}>
                <Button theme='solid' type='primary' onClick={onClickSend}>发送</Button>
                <TextArea autosize rows={1} placeholder={'输入聊天信息'} value={input} onChange={setInput}/>
            </div>
        </div>
    </div>;
}
