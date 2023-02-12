import React, {createElement} from "react";
import {Button, Avatar} from "@douyinfe/semi-ui";
import {RoleAvatar} from "../../components/RoleAvatar";
import {PlayerAvatar} from "../../components/PlayerAvatar";
import {ChatHelper, useChatContext} from "../../provider/ChatProvider";
import {useGameHelper} from "../../provider/GameHelperProvider";
import {ChatWindow} from "./ChatWindow";
import {useCacheState, useMessageRow} from "../../hooks";
import {createChatTooltip} from "./chatTooltip";
import './style.less';

export { createChatTooltip }

export function ChatPage() {
    const gameHelper = useGameHelper();
    const chatContext = useChatContext();
    const playerId = Number(chatContext.chatPlayer?.id);
    const [chatInput, setChatInput] = useCacheState<string>('', playerId);
    const messageRowProps = useMessageRow(playerId);

    if (!chatContext?.chatPlayer) return null;
    const { chatPlayer, chatPlayerSeat } = chatContext;
    return (
        <div className={'chat-page-container'}>
            <ChatWindow
                title={
                    <div className={'chat-page-header'}>
                        <Avatar color="light-blue" shape="square" alt="0">
                            <span style={{fontSize: 'x-large'}}>{chatPlayerSeat}</span>
                        </Avatar>
                        {chatContext.chatRole ? <RoleAvatar roleInfo={chatContext.chatRole} showName={false}/> : null}
                        <PlayerAvatar playerInfo={chatPlayer}/>
                    </div>
                }
                input={chatInput}
                setInput={setChatInput}
                onClickSend={async value => {
                    if (!value) return;
                    return chatContext.sendMessage(value, true);
                }}
                chatContent={messageRowProps}
                getChatTooltip={cmd => createChatTooltip(cmd, gameHelper)}
            />
            <div>{customFunctions.map(c => createElement(c, {setChatInput, chatContext}))}</div>
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
