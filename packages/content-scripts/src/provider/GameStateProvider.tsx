import React, { useContext, useEffect, useState} from "react";
import {formatGameStateJSON} from '../../../models';
import {controlGameState} from "../adapter";
import {adapterState} from "../adapter";

export class GameStateHelper {
    constructor(readonly gameState: GameStateJSON | undefined) {}
    // 设置 、 修改GameState
    setGameState(callback: (oldState: GameStateJSON | undefined) => string | undefined) {
        return controlGameState(callback, formatGameStateJSON);
    }
}

export const defaultValue = new GameStateHelper(undefined);
export const GameStateContext = React.createContext<GameStateHelper>(defaultValue)
export const useGameState = () => useContext(GameStateContext);

export function GameStateProvider(props: {children?: React.ReactNode}) {
    const [gameState, setGameState] = useState(defaultValue);
    useEffect(() => {
        const handler = (value: GameStateJSON | undefined) => setGameState(new GameStateHelper(value));
        handler(adapterState.data.gameState);
        adapterState.observe('gameState', handler);
        return () => adapterState.unObserve('gameState', handler);
    }, []);

    return <GameStateContext.Provider value={gameState}>{props.children}</GameStateContext.Provider>
}


