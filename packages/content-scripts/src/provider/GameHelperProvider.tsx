import React, {useContext} from "react";
import type {} from '@/models';

export interface IGameHelperContext {
    // 获取目标玩家所相邻的下一个玩家
    getBeforePlayer(playerId: string): GamePlayerInfo;
    // 获取目标玩家所相邻的下一个活着的玩家
    getBeforeLivePlayer(playerId: string): GamePlayerInfo;
    // 获取目标玩家所相邻的下一个玩家
    getNextPlayer(playerId: string): GamePlayerInfo;
    // 获取目标玩家所相邻的下一个活着的玩家
    getNextLivePlayer(playerId: string): GamePlayerInfo;
    // 获取角色所对应的玩家
    getPlayerByRole(roleId: string): GamePlayerInfo;
    // 获取玩家的座位号
    getSeatByPlayer(playerId: string): number;
    // 获取首夜顺序
    getFirstNightOrder(playerId: string): number;
    // 获取非首夜顺序
    getOtherNightOrder(playerId: string): number;
}
export const GameHelperContext = React.createContext<IGameHelperContext | undefined>(undefined);
export const useGameHelperContext = useContext(GameHelperContext);

export function GameHelperProvider() {

}
