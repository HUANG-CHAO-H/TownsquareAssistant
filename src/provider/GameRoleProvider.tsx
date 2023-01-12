import React, {useContext, useEffect, useMemo, useState} from "react";
import {globalContext} from "../script";
import {useEditionState} from "./GameEditionProvider";

export interface IRoleContext {
    // 整个游戏的所有角色（不仅仅是当前剧本中的角色，也包含其它剧本的）
    allRoles: Record<string, GameRoleInfo>
    // 当前剧本中的角色
    currentRoles: Record<string, GameRoleInfo>
}

const GameRoleContext = React.createContext<IRoleContext | undefined>(undefined)
export function useRoleState() {return useContext(GameRoleContext)}

export function GameRoleProvider(props: {children?: React.ReactNode}) {
    const[allRoles, setAllRoles] = useState<IRoleContext['allRoles']>({});
    const [currentRoles, setCurrentRoles] = useState<IRoleContext['currentRoles']>({});
    useEffect(() => {
        setAllRoles(globalContext.data.roles);
        globalContext.observe('roles', setAllRoles);
        return () => globalContext.unObserve('roles', setAllRoles);
    }, []);

    const editionState = useEditionState();
    useEffect(() => {
        if (!editionState?.currentEdition) return;
        const roles = editionState.currentEdition.roles;
        const _currentUsers: IRoleContext['currentRoles'] = {};
        for (const role of roles) {
            if (allRoles[role]) _currentUsers[role] = allRoles[role];
        }
        setCurrentRoles(_currentUsers);
    }, [allRoles, editionState?.currentEdition])

    const contextValue = useMemo(() => ({
        allRoles,
        currentRoles
    }), [allRoles, currentRoles]);
    return <GameRoleContext.Provider value={contextValue}>{props.children}</GameRoleContext.Provider>
}
