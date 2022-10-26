import React, {useEffect, useRef, useState} from "react";
import {Row, Col, TextArea, Button, Avatar} from "@douyinfe/semi-ui";
import {RoleAvatar} from "../components/RoleAvatar";
import {PlayerAvatar} from "../components/PlayerAvatar";
import {IChatContext, useChatContext} from "../provider/ChatProvider";
import {sleep} from "../utils";
import {globalContext} from "../script";

export function ChatWindow() {
    const chatContext = useChatContext();
    const [chatInput, setChatInput] = useState<string>('');
    // 聊天内容展示
    const divRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const div = divRef.current;
        if (!div) return;
        const container: HTMLDivElement = div.firstChild as HTMLDivElement;
        const oldLength = container.childNodes.length;
        container.innerHTML = '';
        if (!chatContext?.chatContent) return;
        container.append(...chatContext.chatContent);
        if (oldLength !== container.childNodes.length) {   // 滚动轴修正
            div.scrollTop = div.scrollHeight;
        }
    }, [chatContext?.chatContent])

    if (!chatContext) return null;
    const {chatPlayer, chatPlayerSeat} = chatContext;
    if (!chatPlayer) return null;
    const onClickButton = () => {
        if (!chatInput) return;
        globalContext.chatInput = chatInput;
        sleep(50).then(chatContext.dispatchSendMsg).then(() => setChatInput(''));
    }
    return (
        <div style={containerStyle}>
            <div style={{display: 'flex'}}>
                <Avatar color="light-blue" shape="square" alt="0">
                    <span style={{fontSize: 'x-large'}}>{chatPlayerSeat}</span>
                </Avatar>
                {chatContext.chatRole ? <RoleAvatar roleInfo={chatContext.chatRole} showName={false}/> : null}
                <PlayerAvatar playerInfo={chatPlayer}/>
            </div>
            <div style={{margin: '5px 0'}}>{
                customFunctions.map((Comp, index) => <Comp key={index} setChatInput={setChatInput} chatContext={chatContext}/>)
            }</div>
            <div ref={divRef} style={contentStyle}><div/></div>
            <Row gutter={16} type="flex" align="middle">
                <Col span={20}>
                    <TextArea value={chatInput} onChange={setChatInput} onEnterPress={onClickButton}/>
                </Col>
                <Col span={4}><Button block={true} onClick={onClickButton}>发送</Button></Col>
            </Row>
        </div>
    )
}

const containerStyle: React.CSSProperties = {
    color: 'black',
    padding: '10px 0',
    height: '100%',
    overflow: 'hidden',
    display: "flex",
    flexDirection: 'column'
}

const contentStyle: React.CSSProperties = {
    overflowX: 'auto',
    overflowY: 'scroll',
    borderStyle: "inset",
    borderWidth: '2px',
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 5,
}

interface IButtonProps {
    // 修改聊天输入框中的内容
    setChatInput: React.Dispatch<React.SetStateAction<string>>
    // context的值
    chatContext: IChatContext | undefined
}

// 自定义功能列表
const customFunctions: Array<(props: IButtonProps) => JSX.Element> = [];
// 生成首夜信息按钮
customFunctions.push((props: IButtonProps) => {
    const { chatContext, setChatInput } = props;
    const onClick = () => {
        if (!chatContext) return;
        const content = chatContext.chatRole?.firstNightReminder || '';
        setChatInput(content);
    }
    return (
        <Button size={'small'} onClick={onClick}>
            生成首夜信息
        </Button>
    );
})
// 生成非首夜信息按钮
customFunctions.push((props: IButtonProps) => {
    const { chatContext, setChatInput } = props;
    const onClick = () => {
        if (!chatContext) return;
        const content = chatContext.chatRole?.otherNightReminder || '';
        setChatInput(content);
    }
    return (
        <Button size={'small'} onClick={onClick}>
            生成非首夜信息
        </Button>
    );
})
