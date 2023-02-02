import React, {useContext, useEffect, useState} from "react";
import {adapterState} from '../adapter';
import {useGameState} from "./GameStateProvider";

export class GameEditionHelper {
    /**
     * @param allEditions 整个游戏的所有剧本
     * @param currentEdition 当前剧本
     */
    constructor(
        readonly allEditions: Record<string, GameEditionInfo>,
        readonly currentEdition: GameEditionInfo | undefined,
    ) {}

    static setAllEditions(oldV: GameEditionHelper, allEditions: Record<string, GameEditionInfo>): GameEditionHelper {
        if (oldV.allEditions === allEditions) return oldV;
        return new GameEditionHelper(allEditions, oldV.currentEdition);
    }
    static setCurrentEdition(oldV: GameEditionHelper, currentEdition: GameEditionInfo | undefined): GameEditionHelper {
        if (oldV.currentEdition === currentEdition) return oldV;
        return new GameEditionHelper(oldV.allEditions, currentEdition);
    }
}

export const defaultValue = new GameEditionHelper({}, undefined);
export const GameEditionContext = React.createContext<GameEditionHelper>(defaultValue)
export const useEditionState = () => useContext(GameEditionContext);

export function GameEditionProvider(props: {children?: React.ReactNode}) {
    const [contextValue, setContextValue] = useState(defaultValue);
    useEffect(() => {
        const handler = (value: Record<string, GameEditionInfo>) => {
            setContextValue(v => GameEditionHelper.setAllEditions(v, value))
        }
        handler(adapterState.data.editions);
        adapterState.observe('editions', handler);
        return () => adapterState.unObserve('editions', handler);
    }, []);

    const { gameState } = useGameState();
    const editionId = gameState?.edition.id;
    useEffect(() => {
        const currentEdition = contextValue.allEditions[editionId || ''];
        if (currentEdition !== contextValue.currentEdition) {
            setContextValue(new GameEditionHelper(contextValue.allEditions, currentEdition));
        }
    }, [contextValue.allEditions, editionId]);
    return <GameEditionContext.Provider value={contextValue}>{props.children}</GameEditionContext.Provider>
}
