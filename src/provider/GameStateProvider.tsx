import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {controlGameState, formatGameStateJSON, globalContext} from "../script";

interface GameStateContext {
    // 当前的GameState
    gameState: GameStateJSON | undefined;
    // // 玩家数据的数组形式
    // playerArray: GamePlayerInfo[];
    // // 玩家信息的key-value
    // playerMap: Record<string, GamePlayerInfo>;
    // // 存活玩家数据的数组形式
    // livePlayerArray: GamePlayerInfo[];
    // // 存活玩家信息的key-value
    // livePlayerMap: Record<string, GamePlayerInfo>;
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
    const contextValue = useMemo<GameStateContext>(() => ({gameState, changeState}), [gameState, changeState]);

    useEffect(() => {
        setGameState(globalContext.data.gameState);
        globalContext.observe('gameState', setGameState);
        return () => globalContext.unObserve('gameState', setGameState);
    }, []);

    return <GameStateContext.Provider value={contextValue}>{props.children}</GameStateContext.Provider>
}

class GameStateController {
    constructor(readonly gameState: GameStateJSON) {}
}
