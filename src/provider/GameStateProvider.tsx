import React, {useContext, useEffect, useState} from "react";
import {globalContext} from "../script";


const GameStateContext = React.createContext<GameStateJSON | undefined>(undefined)
export function useGameState() {return useContext(GameStateContext)}

export function GameStateProvider(props: {children?: React.ReactNode}) {
    const [gameState, setGameState] = useState<GameStateJSON | undefined>(undefined);

    useEffect(() => {
        setGameState(globalContext.gameState);
        globalContext.observe('gameState', setGameState);
        return () => globalContext.unobserve('gameState', setGameState);
    }, []);

    return <GameStateContext.Provider value={gameState}>{props.children}</GameStateContext.Provider>
}

