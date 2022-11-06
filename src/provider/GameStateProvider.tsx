import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {controlGameState, formatGameStateJSON, globalContext} from "../script";

interface GameStateContext {
    // 当前的GameState
    gameState: GameStateJSON | undefined;
    // 修改，覆盖当前的state
    changeState: (callback: (oldState: GameStateJSON | undefined) => string | undefined) => Promise<void>;
}

const GameStateContext = React.createContext<GameStateContext | undefined>(undefined)
export function useGameState() {return useContext(GameStateContext)}

export function GameStateProvider(props: {children?: React.ReactNode}) {
    const [gameState, setGameState] = useState<GameStateJSON | undefined>(undefined);
    const changeState = useCallback<GameStateContext['changeState']>(callback => {
        return controlGameState(callback, formatGameStateJSON);
    }, []);
    const contextValue = useMemo<GameStateContext>(() => ({gameState, changeState}), [gameState])

    useEffect(() => {
        setGameState(globalContext.gameState);
        globalContext.observe('gameState', setGameState);
        return () => globalContext.unobserve('gameState', setGameState);
    }, []);

    return <GameStateContext.Provider value={contextValue}>{props.children}</GameStateContext.Provider>
}

class GameStateController {
    constructor(readonly gameState: GameStateJSON) {}
}
