import React, {useState} from "react";
import {Row, Col, TextArea, Button, Avatar} from "@douyinfe/semi-ui";
import {RoleAvatar} from "../../components/RoleAvatar";
import {PlayerAvatar} from "../../components/PlayerAvatar";
import {useChatContent} from "../../hooks/useChatContent";
import {IChatContext, useChatContext} from "../../provider/ChatProvider";
import {globalContext} from "../../script";
import './style.less';

export function ChatWindow() {
    const chatContext = useChatContext();
    const [chatInput, setChatInput] = useState<string>('');
    // 聊天内容展示
    const divRef = useChatContent();

    if (!chatContext) return null;
    const {chatPlayer, chatPlayerSeat} = chatContext;
    if (!chatPlayer) return null;
    const onClickButton = () => {
        if (!chatInput) return;
        globalContext.data.chatInput = chatInput;
        chatContext.writeChatMsg(chatInput, true).then(() => setChatInput(''));
    }
    return (
        <div className={'assist-chat-window'}>
            <div className={'chat-window-header'}>
                <Avatar color="light-blue" shape="square" alt="0">
                    <span style={{fontSize: 'x-large'}}>{chatPlayerSeat}</span>
                </Avatar>
                {chatContext.chatRole ? <RoleAvatar roleInfo={chatContext.chatRole} showName={false}/> : null}
                <PlayerAvatar playerInfo={chatPlayer}/>
            </div>
            <div className={'chat-window-header'}>{
                customFunctions.map((Comp, index) => <Comp key={index} setChatInput={setChatInput} chatContext={chatContext}/>)
            }</div>
            <div ref={divRef} className={'chat-window-body'}><div/></div>
            <Row type="flex" className={'chat-window-footer'} align="middle">
                <Col span={20}>
                    <TextArea value={chatInput} onChange={setChatInput} onEnterPress={onClickButton}/>
                </Col>
                <Col span={4}><Button block={true} onClick={onClickButton}>发送</Button></Col>
            </Row>
        </div>
    )
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
