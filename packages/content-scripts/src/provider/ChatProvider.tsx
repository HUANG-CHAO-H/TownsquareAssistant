import React, {useContext, useEffect, useState} from "react";
import {writeChatMsg, adapterState } from "../adapter";
import {useGameState} from "./GameStateProvider";
import {useRoleState} from "./GameRoleProvider";

export class ChatHelper {
    /**
     * @param chatPlayer        处于当前聊天框的玩家信息
     * @param chatRole          当前聊天玩家的角色
     * @param chatPlayerSeat    当前聊天玩家的座位号(没有玩家时值为0)
     */
    constructor(
        readonly chatPlayer: GamePlayerInfo | undefined,
        readonly chatRole: GameRoleInfo | undefined,
        readonly chatPlayerSeat: number,
    ) {}

    sendMessage(message: string | undefined = undefined, autoSend: boolean = true): Promise<boolean> {
        return writeChatMsg(message, autoSend);
    }
}

export const defaultValue = new ChatHelper(undefined, undefined, 0);
const ChatContext = React.createContext<ChatHelper>(defaultValue);
export function useChatContext() {return useContext(ChatContext)}

export function ChatProvider(props: {children?: React.ReactNode}) {
    const [contextValue, setContextValue] = useState(defaultValue);
    const { gameState } = useGameState();
    const roleState = useRoleState();
    useEffect(() => {
        if (!gameState) return void setContextValue(defaultValue);
        const observer = (chatTitle: string) => {
            const playerSeat = gameState.players.findIndex(value => value.name === chatTitle);
            if (playerSeat >= 0) {
                const player = gameState.players[playerSeat];
                setContextValue(new ChatHelper(player, roleState.currentRoles[player.role], playerSeat + 1));
            } else {
                setContextValue(defaultValue);
            }
        }
        observer(adapterState.data.chatTitle);
        adapterState.observe('chatTitle', observer);
        return () => adapterState.unObserve('chatTitle', observer)
    }, [gameState?.players, roleState?.currentRoles]);

    return <ChatContext.Provider value={contextValue}>{props.children}</ChatContext.Provider>
}
