import React, {useContext, useMemo} from "react";
import {Toast} from "@douyinfe/semi-ui";
import type {} from '@/models';
import {GameRoleInfo} from "../../../models";
import {GameStateHelper, useGameState, defaultValue as defaultGameStateHelper} from "./GameStateProvider";
import {GameEditionHelper, useEditionState, defaultValue as defaultGameEditionHelper} from "./GameEditionProvider";
import {GameRoleHelper, useRoleState, defaultValue as defaultGameRoleHelper} from "./GameRoleProvider";

const emptyArray: any[] = []

export class GameHelper {
    // 缓存空间
    private _cache: Record<string, any> = {};

    get players(): GamePlayerInfo[] {
        if (this._cache.players !== undefined) return this._cache.players;
        return this._cache.players = this.gameStateHelper.gameState?.players || emptyArray;
    }

    constructor(
        public readonly gameStateHelper: GameStateHelper,
        public readonly gameEditionHelper: GameEditionHelper,
        public readonly gameRoleHelper: GameRoleHelper,
    ) {}

    // 根据ID获取玩家索引号
    getPlayerIndexById(playerId: number): number {
        const key = 'getPlayerIndexById_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key];
        const players = this.gameStateHelper.gameState?.players;
        if (!players?.length) return this._cache[key] = -1;
        return this._cache[key] = players.findIndex(p => p.id === playerId);
    }
    // 根据name获取玩家索引号
    getPlayerIndexByName(name: string): number {
        const key = 'getPlayerIndexByName_' + name;
        if (this._cache[key] !== undefined) return this._cache[key];
        const players = this.gameStateHelper.gameState?.players;
        if (!players?.length) return this._cache[key] = -1;
        return this._cache[key] = players.findIndex(p => p.name === name);
    }
    // 根据ID获取对应玩家数据
    getPlayerById(playerId: number): GamePlayerInfo | undefined {
        const key = 'getPlayerById_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const index = this.getPlayerIndexById(playerId);
        if (index === -1) {
            this._cache[key] = null;
            return undefined;
        }
        return this._cache[key] = this.gameStateHelper.gameState?.players[index];
    }
    // 根据name获取对应玩家数据
    getPlayerByName(name: string): GamePlayerInfo | undefined {
        const key = 'getPlayerByName_' + name;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const index = this.getPlayerIndexByName(name);
        if (index === -1) {
            this._cache[key] = null;
            return undefined;
        }
        return this._cache[key] = this.gameStateHelper.gameState?.players[index];
    }
    // 获取目标玩家所相邻的上一个玩家
    getBeforePlayer(playerId: number): GamePlayerInfo | undefined {
        const key = 'getBeforePlayer_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const index = this.getPlayerIndexById(playerId);
        if (index === -1) {
            Toast.error('[getBeforePlayer] can not find player info by playerId');
            this._cache[key] = null;
            return undefined;
        }
        const players = this.players;
        return this._cache[key] = players[(index + players.length - 1) % players.length];
    }
    // 获取目标玩家所相邻的上一个活着的玩家
    getBeforeLivePlayer(playerId: number): GamePlayerInfo | undefined {
        const key = 'getBeforeLivePlayer_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const index = this.getPlayerIndexById(playerId);
        if (index === -1) {
            Toast.error('[getBeforeLivePlayer] can not find player info by playerId');
            this._cache[key] = null;
            return undefined;
        }
        const players = this.players;
        let i = (index + players.length - 1) % players.length;
        while (i !== index) {
            if (!players[i].isDead) return this._cache[key] = players[i];
            i = (index + players.length - 1) % players.length;
        }
        return undefined;
    }
    // 获取目标玩家所相邻的下一个玩家
    getNextPlayer(playerId: number): GamePlayerInfo | undefined {
        const key = 'getNextPlayer_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const index = this.getPlayerIndexById(playerId);
        if (index === -1) {
            Toast.error('[getNextPlayer] can not find player info by playerId');
            this._cache[key] = null;
            return undefined;
        }
        const players = this.players;
        return this._cache[key] = players[(index + 1) % players.length];
    }
    // 获取目标玩家所相邻的下一个活着的玩家
    getNextLivePlayer(playerId: number): GamePlayerInfo | undefined {
        const key = 'getNextLivePlayer_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const index = this.getPlayerIndexById(playerId);
        if (index === -1) {
            Toast.error('[getNextLivePlayer] can not find player info by playerId');
            this._cache[key] = null;
            return undefined;
        }
        const players = this.players;
        let i = (index + 1) % players.length;
        while (i !== index) {
            if (!players[i].isDead) return this._cache[key] = players[i];
            i = (index + 1) % players.length;
        }
        return undefined;
    }
    // 获取玩家的座位号
    getSeatByPlayer(playerId: number): number {
        return this.getPlayerIndexById(playerId) + 1;
    }
    // 获取某位玩家所对应的角色
    getPlayerRole(playerId: number): GameRoleInfo | undefined {
        const key = 'getPlayerRole_' + playerId;
        if (this._cache[key] !== undefined) return this._cache[key] || undefined;
        const player = this.getPlayerById(playerId);
        if (!player) {
            Toast.error('[getPlayerRole] can not find player info by playerId');
            this._cache[key] = null;
            return undefined;
        }
        const role = this.gameRoleHelper.currentRoles[player.role];
        this._cache[key] = role || null;
        return role;
    }
    // 获取某一阵营的所有玩家
    getTeamPlayers(team: GameRoleInfo['team']): GamePlayerInfo[] {
        const key = 'getTeamPlayers_' + team;
        if (this._cache[key] !== undefined) return this._cache[key];
        const array: GamePlayerInfo[] = this._cache[key] = [];
        for (const player of this.players) {
            if (this.getPlayerRole(player.id)?.team === team) {
                array.push(player);
            }
        }
        return array;
    }
}

export const defaultValue = new GameHelper(defaultGameStateHelper, defaultGameEditionHelper, defaultGameRoleHelper);
export const GameHelperContext = React.createContext<GameHelper>(defaultValue);
export const useGameHelper = () => useContext(GameHelperContext);

export function GameHelperProvider(props: {children?: React.ReactNode}) {
    const gameState = useGameState();
    const editionState = useEditionState();
    const roleState = useRoleState();
    const contextValue = useMemo(
        () => new GameHelper(gameState, editionState, roleState),
        [gameState, editionState, roleState],
    );
    return <GameHelperContext.Provider value={contextValue}>{props.children}</GameHelperContext.Provider>
}
