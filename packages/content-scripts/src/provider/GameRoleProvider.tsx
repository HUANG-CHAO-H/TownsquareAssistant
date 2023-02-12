import React, {useContext, useEffect, useState} from "react";
import {GameRoleInfo} from "../../../models";
import {adapterState} from "../adapter";
import {useEditionState} from "./GameEditionProvider";

export class GameRoleHelper {
    // 缓存空间
    private _cache: Record<string, any> = {};
    /**
     * @param allRoles      整个游戏的所有角色（不仅仅是当前剧本中的角色，也包含其它剧本的）
     * @param currentRoles  当前剧本中的角色
     */
    constructor(
        readonly allRoles: Record<string, GameRoleInfo>,
        readonly currentRoles: Record<string, GameRoleInfo>,
    ) {}

    // 获取当前剧本中，某一阵营的全部角色
    getTeamRoles(team: GameRoleInfo['team']): Record<string, GameRoleInfo> {
        const key = 'getTeamRoles_' + team;
        if (this._cache[key] !== undefined) return this._cache[key] || {};
        const r = this._cache[key] = {};
        for (const k of Object.keys(this.currentRoles)) {
            if (this.currentRoles[k].team === team) r[k] = this.currentRoles[k];
        }
        return r;
    }

    static setAllRoles(oldV: GameRoleHelper, allRoles: Record<string, GameRoleInfo>): GameRoleHelper {
        if (oldV.allRoles === allRoles) return oldV;
        return new GameRoleHelper(allRoles, oldV.currentRoles);
    }
    static setCurrentRoles(oldV: GameRoleHelper, currentRoles: Record<string, GameRoleInfo>): GameRoleHelper {
        if (oldV.currentRoles === currentRoles) return oldV;
        return new GameRoleHelper(oldV.allRoles, currentRoles);
    }
}
export const defaultValue = new GameRoleHelper({}, {});
export const GameRoleContext = React.createContext<GameRoleHelper>(defaultValue);
export const useRoleState = () => useContext(GameRoleContext);

export function GameRoleProvider(props: {children?: React.ReactNode}) {
    const [contextValue, setContextValue] = useState(defaultValue);
    useEffect(() => {
        const handler = (value: Record<string, GameRoleInfo>) => {
            setContextValue(v => GameRoleHelper.setAllRoles(v, value));
        }
        handler(adapterState.data.roles);
        adapterState.observe('roles', handler);
        return () => adapterState.unObserve('roles', handler);
    }, []);

    const { currentEdition } = useEditionState();
    useEffect(() => {
        if (!currentEdition?.roles?.length || !Object.keys(contextValue.allRoles)) {
            setContextValue(GameRoleHelper.setCurrentRoles(contextValue, defaultValue.currentRoles));
            return;
        }
        const _currentUsers: Record<string, GameRoleInfo> = {};
        for (const role of currentEdition.roles) {
            if (contextValue.allRoles[role]) _currentUsers[role] = contextValue.allRoles[role];
        }
        setContextValue(new GameRoleHelper(contextValue.allRoles, _currentUsers));
    }, [contextValue.allRoles, currentEdition])
    return <GameRoleContext.Provider value={contextValue}>{props.children}</GameRoleContext.Provider>
}
