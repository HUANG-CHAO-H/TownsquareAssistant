import React, {useEffect, useMemo, useRef, useState} from "react";
import {Row, Col, TextArea, Button, Avatar} from "@douyinfe/semi-ui";
import {ChatMessageType} from "../../../../models";
import {adapterState, chatMsgStore } from "../../adapter";
import {RoleAvatar} from "../../components/RoleAvatar";
import {PlayerAvatar} from "../../components/PlayerAvatar";
import {ChatHelper, useChatContext} from "../../provider/ChatProvider";
import './style.less';
import {MessageRow} from "../../components/ChatWindow/MessageRow";

export function ChatWindow() {
    const chatContext = useChatContext();
    const [message, setMessage] = useState<ChatMessageType[]>([])
    const [chatInput, setChatInput] = useState<string>('');
    const hostInfo = adapterState.useValue('hostPlayer');
    const playerId = Number(chatContext.chatPlayer?.id);
    const staticRef = useRef<Record<string, any>>({});
    staticRef.current[playerId] = chatInput;
    useEffect(() => {
        setChatInput(staticRef.current[playerId] || '');
        setMessage(chatMsgStore.get(playerId) || []);
        chatMsgStore.observe(playerId, setMessage);
        return () => chatMsgStore.unObserve(playerId, setMessage);
    }, [playerId]);
    const messageBody = useMemo(
        () => message.map(m => <MessageRow direction={hostInfo?.id === m.senderUid ? 'right' : 'left'} msg={m} />),
        [message, hostInfo],
    )

    if (!chatContext) return null;
    const {chatPlayer, chatPlayerSeat} = chatContext;
    if (!chatPlayer) return null;
    const onClickButton = () => chatInput && chatContext.sendMessage(chatInput, true).then(() => setChatInput(''));
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
            <div className={'chat-window-body'}>{messageBody}</div>
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
    chatContext: ChatHelper | undefined
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
