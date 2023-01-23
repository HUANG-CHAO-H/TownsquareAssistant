import React, {useContext, useEffect, useMemo, useState} from "react";
import {globalState} from '../globalState';
import {useGameState} from "./GameStateProvider";

export interface IEditionContext {
    // 整个游戏的所有剧本
    allEditions: Record<string, GameEditionInfo>
    // 当前剧本
    currentEdition: GameEditionInfo | undefined
}

const GameEditionContext = React.createContext<IEditionContext | undefined>(undefined)
export function useEditionState() {return useContext(GameEditionContext)}

export function GameEditionProvider(props: {children?: React.ReactNode}) {
    const[allEditions, setAllEditions] = useState<IEditionContext['allEditions']>({});
    const [currentEdition, setEdition] = useState<IEditionContext['currentEdition']>();
    useEffect(() => {
        setAllEditions(globalState.data.editions);
        globalState.observe('editions', setAllEditions);
        return () => globalState.unObserve('editions', setAllEditions);
    }, []);

    const { gameState } = useGameState() || {};
    useEffect(() => {
        if (!gameState?.edition.id) {
            setEdition(undefined);
            return;
        }
        setEdition(allEditions[gameState.edition.id]);
    }, [allEditions, gameState?.edition])

    const contextValue = useMemo(() => ({
        allEditions,
        currentEdition
    }), [allEditions, currentEdition]);
    return <GameEditionContext.Provider value={contextValue}>{props.children}</GameEditionContext.Provider>
}
