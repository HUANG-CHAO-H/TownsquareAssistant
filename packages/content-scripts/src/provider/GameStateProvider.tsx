import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {formatGameStateJSON} from '@/models';
import {controlGameState} from "../script";
import {globalState} from "../globalState";

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
        setGameState(globalState.data.gameState);
        globalState.observe('gameState', setGameState);
        return () => globalState.unObserve('gameState', setGameState);
    }, []);

    return <GameStateContext.Provider value={contextValue}>{props.children}</GameStateContext.Provider>
}

class GameStateController {
    constructor(readonly gameState: GameStateJSON) {}
}
