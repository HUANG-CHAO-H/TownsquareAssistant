import React, {useContext, useEffect, useMemo, useState} from "react";
import {writeChatMsg} from "../script";
import {globalState} from '../globalState';
import {useGameState} from "./GameStateProvider";
import {useRoleState} from "./GameRoleProvider";

export interface IChatContext {
    // 处于当前聊天框的玩家信息
    chatPlayer: GamePlayerInfo | undefined
    // 当前聊天玩家的角色
    chatRole: GameRoleInfo | undefined
    // 当前聊天玩家的座位号(没有玩家时值为0)
    chatPlayerSeat: number
    // 向聊天输入框中写入聊天消息, 并发送
    writeChatMsg: typeof writeChatMsg;
}

const ChatContext = React.createContext<IChatContext | undefined>(undefined);
export function useChatContext() {return useContext(ChatContext)}

export function ChatProvider(props: {children?: React.ReactNode}) {
    const { gameState } = useGameState() || {};
    const roleState = useRoleState();
    const [chatPlayer, setChatPlayer] = useState<GamePlayerInfo | undefined>(undefined);
    const [chatRole, setChatRole] = useState<GameRoleInfo | undefined>(undefined);
    const [chatPlayerSeat, setChatPlayerSeat] = useState<number>(0);
    useEffect(() => {
        if (!gameState) return;
        const observer = (chatTitle: string) => {
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
        }
        observer(globalState.data.chatTitle);
        globalState.observe('chatTitle', observer);
        return () => globalState.unObserve('chatTitle', observer)
    }, [gameState?.players, roleState?.currentRoles]);

    const contextValue = useMemo<IChatContext>(() => ({
        chatPlayer, chatRole, chatPlayerSeat, writeChatMsg,
    }), [chatPlayer, chatPlayerSeat]);

    return <ChatContext.Provider value={contextValue}>{props.children}</ChatContext.Provider>
}
