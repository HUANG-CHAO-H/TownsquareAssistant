import React, {useEffect, useState} from "react";
import { TextArea, Button } from "@douyinfe/semi-ui";

import {useCacheRef, useRefCallback} from "../../../../../utils";
import {CascadeSelect, SelectItem} from "../../../components/CascadeSelect";
import {ChatWindowBody, ChatWindowBodyProps} from "./ChatWindowBody";
import './style.less';

export type ChatWindowProps = {
    title?: React.ReactNode;
    // 聊天输入框中的内容
    input?: string;
    // 设置input
    setInput?: (value: string) => void;
    // 获取输入框智能提示文本
    getChatTooltip?: (cmd: InputCommandType | undefined) => SelectItem[];
    // 当用户点击发送按钮时
    onClickSend?: (value: string) => void | boolean | Promise<void | boolean>;
} & ChatWindowBodyProps;

export function ChatWindow(props: ChatWindowProps) {
    // 输入框内容
    const [input, setInput] = useState('');
    // 输入框中输入的快捷指令
    const [command, setCommand] = useState<IInputCommand>();
    // 输入框上的智能提示文本选项
    const [tooltipOptions, setOptions] = useState<{type?: string, options?: SelectItem[]}>({});
    // cache 缓存
    const cacheRef = useCacheRef({
        setInput: props.setInput,
        getChatTooltip: props.getChatTooltip,
        async onClickSend() {
            let inputValue = '';
            setInput(v => (inputValue = v) && '');
            if (props.onClickSend && (await props.onClickSend(input.trim())) === false) {
                setInput(inputValue);
                return;
            }
            cacheRef.current.setInput?.('');
        },
        onCascadeChange(value: (SelectItem | undefined)[]) {
            for (let i = value.length - 1; i >= 0; i--) {
                if (!value[i]) continue;
                if (!command) {
                    setInput(input + value[i]!.value);
                } else {
                    setInput(input.slice(0, command.startIndex) + value[i]!.value);
                }
                break;
            }
        }
    });
    const onClickSend = useRefCallback(cacheRef, "onClickSend");
    // 上层的值覆盖当前状态
    useEffect(() => setInput(props.input || ''), [props.input]);
    // 延迟向上层传递input变更（节流防抖）
    useEffect(() => {
        const timeout = setTimeout(() => {
            cacheRef.current.setInput?.(input);
            const cmd = getInputCommand(input);
            setCommand(cmd);
            setOptions(oldV => {
                if (oldV.type === cmd?.type) return oldV;
                return {
                    type: cmd?.type,
                    options: cacheRef.current.getChatTooltip?.(cmd?.type) || []
                }
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [input]);
    return <div className={'chat-window-container'}>
        <div className={'chat-window-header'}>{props.title}</div>
        <div><ChatWindowBody chatContent={props.chatContent}/></div>
        <div>
            <div className={'chat-window-footer'}>
                <Button theme='solid' type='primary' onClick={onClickSend}>发送</Button>
                <CascadeSelect visible={Boolean(tooltipOptions.options)}
                               listItem={tooltipOptions.options}
                               onChange={cacheRef.current.onCascadeChange}>
                    <TextArea autosize rows={1} placeholder={'输入聊天信息'} value={input}
                              onChange={setInput}
                              onKeyUp={e => e.key === 'Enter' && !e.shiftKey && onClickSend()}/>
                </CascadeSelect>
            </div>
        </div>
    </div>;
}


export const enum InputCommandType {
    CallPlayer = '@',
    InsertInfo = '/',
}

export interface IInputCommand {
    type: InputCommandType;
    startIndex: number;
    command: string;
}
export function getInputCommand(input: string): IInputCommand | undefined {
    let ch: string;
    const startIndex = input.length - 5 > 0 ? input.length - 5 : 0;
    const endIndex = input.length - 1;
    for (let i = endIndex; i >= startIndex; i--) {
        ch = input[i];
        if (ch === InputCommandType.CallPlayer || ch === InputCommandType.InsertInfo) {
            return {
                type: ch,
                command: input.slice(i + 1),
                startIndex: i,
            };
        }
    }
    return undefined;
}
