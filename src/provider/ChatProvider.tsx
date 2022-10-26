import React, {useContext, useEffect, useMemo, useState} from "react";
import {clickChatButton, globalContext, writeChatInput} from "../script";
import {useGameState} from "./GameStateProvider";
import {useRoleState} from "./GameRoleProvider";

export interface IChatContext {
    // 处于当前聊天框的玩家信息
    chatPlayer: GamePlayerInfo | undefined
    // 当前聊天玩家的角色
    chatRole: GameRoleInfo | undefined
    // 当前聊天玩家的座位号(没有玩家时值为0)
    chatPlayerSeat: number
    // 聊天框的标题(用户的username)
    chatTitle: string
    // 聊天框中的信息
    chatContent: NodeListOf<ChildNode> | null
    // 触发信息发送功能
    dispatchSendMsg(): void
}

const ChatContext = React.createContext<IChatContext | undefined>(undefined);
export function useChatContext() {return useContext(ChatContext)}

export function ChatProvider(props: {children?: React.ReactNode}) {
    const gameState = useGameState();
    const roleState = useRoleState();
    const [chatPlayer, setChatPlayer] = useState<GamePlayerInfo | undefined>(undefined);
    const [chatRole, setChatRole] = useState<GameRoleInfo | undefined>(undefined);
    const [chatPlayerSeat, setChatPlayerSeat] = useState<number>(0);
    const [chatTitle, setChatTitle] = useState<string>('');
    const [chatContent, setChatContent] = useState<NodeListOf<ChildNode> | null>(null);
    useEffect(() => {
        setChatTitle(globalContext.chatTitle);
        setChatContent(globalContext.chatContent);
        globalContext.observe('chatTitle', setChatTitle);
        globalContext.observe('chatContent', setChatContent);
        return () => {
            globalContext.unobserve('chatTitle', setChatTitle);
            globalContext.unobserve('chatContent', setChatContent);
        }
    }, []);
    useEffect(() => {
        if (!gameState) return;
        const playerSeat = gameState.players.findIndex(value => value.name === chatTitle);
        if (playerSeat >= 0) {
            const player = gameState.players[playerSeat];
            setChatPlayer(player);
            setChatPlayerSeat(playerSeat + 1);
            setChatRole(roleState?.currentRoles[player.role])
        } else {
            setChatPlayer(undefined);
            setChatRole(undefined);
            setChatPlayerSeat(0);
        }
    }, [gameState?.players, roleState?.currentRoles, chatTitle]);

    const contextValue = useMemo<IChatContext>(() => ({
        chatPlayer, chatRole, chatPlayerSeat,
        chatTitle, chatContent,
        dispatchSendMsg: clickChatButton,
    }), [chatPlayer, chatPlayerSeat, chatTitle, chatContent]);

    return <ChatContext.Provider value={contextValue}>{props.children}</ChatContext.Provider>
}