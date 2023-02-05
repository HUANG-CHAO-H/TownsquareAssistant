import React, {useEffect, useState} from "react";
import { TextArea, Button, Cascader } from "@douyinfe/semi-ui";
import type {TriggerRenderProps} from "@douyinfe/semi-ui/lib/es/cascader";
import type {Value} from "@douyinfe/semi-ui/cascader";
import type {CascaderData} from "@douyinfe/semi-ui/cascader/item";

import {useCacheRef, useRefCallback} from "../../../../utils";
import './style.less';
import {ChatWindowBody, ChatWindowBodyProps} from "./ChatWindowBody";

export type ChatWindowProps = {
    title?: React.ReactNode;
    // 聊天输入框中的内容
    input?: string;
    // 设置input
    setInput?: (value: string) => void;
    // 智能提示下拉选项框
    selectOptions?: CascaderData[]
    // 当用户点击发送按钮时
    onClickSend?: (value: string) => void | boolean | Promise<void | boolean>;
} & ChatWindowBodyProps;

export function ChatWindow(props: ChatWindowProps) {
    // 输入框内容
    const [input, setInput] = useState('');
    // 输入框中输入的快捷指令
    const [command, setCommand] = useState<IInputCommand>();
    const cacheRef = useCacheRef({
        setInput: props.setInput,
        async onClickSend() {
            let inputValue = '';
            setInput(v => (inputValue = v) && '');
            if (props.onClickSend && (await props.onClickSend(input.trim())) === false) {
                setInput(inputValue);
                return;
            }
            cacheRef.current.setInput?.('');
        },
        onCascadeChange(value: Value) {
            const path: string[] = (value instanceof Array ? value : [value]) as any;
            if (path.length <= 0 || !path[path.length - 1]) return;
            if (!command) {
                setInput(input + path[path.length - 1]);
            } else {
                setInput(input.slice(0, command.startIndex) + path[path.length - 1]);
            }
        }
    });
    const onClickSend = useRefCallback(cacheRef, "onClickSend");
    const onCascadeChange = useRefCallback(cacheRef, "onCascadeChange");
    // 上层的值覆盖当前状态
    useEffect(() => setInput(props.input || ''), [props.input === input]);
    // 延迟向上层传递input变更（节流防抖）
    useEffect(() => {
        const timeout = setTimeout(() => {
            cacheRef.current.setInput?.(input);
            setCommand(getInputCommand(input));
        }, 500);
        return () => clearTimeout(timeout);
    }, [input]);
    const triggerRender = (_props: TriggerRenderProps) => {
        const cmd = command?.command || '';
        if (cmd !== _props.inputValue) Promise.resolve().then(() => _props.onChange(cmd));
        return (
            <TextArea autosize rows={1} placeholder={'输入聊天信息'} value={input} onChange={setInput}/>
        )
    }
    return <div className={'chat-window-container'}>
        <div><div className={'chat-window-header'}>{props.title}</div></div>
        <div><ChatWindowBody chatContent={props.chatContent}/></div>
        <div>
            <div className={'chat-window-footer'} onKeyUp={e => e.key === 'Enter' && !e.shiftKey && onClickSend()}>
                <Button theme='solid' type='primary' onClick={onClickSend}>发送</Button>
                <Cascader filterTreeNode treeData={props.selectOptions} value={''}
                          emptyContent={props.selectOptions?.length ? undefined : <span/>}
                          triggerRender={triggerRender}
                          onChange={onCascadeChange}
                />
            </div>
        </div>
    </div>;
}


export interface IInputCommand {
    type: '@' | '/';
    startIndex: number;
    command: string;
}
export function getInputCommand(input: string): IInputCommand | undefined {
    let ch: string;
    for (let i = input.length; i >= 0 ; i--) {
        ch = input[i];
        if (ch === '@' || ch === '/') {
            return {
                type: ch,
                command: input.slice(i + 1),
                startIndex: i,
            };
        }
    }
    return undefined;
}
