import {useEffect, useRef, useState} from "react";

const stateSymbol = Symbol('state');

export function useCacheState<T>(defaultValue: T, key: string | number = '') {
    const cacheRef = useRef<Record<string | number | symbol, T>>({});
    const [state, setState] = useState(defaultValue);
    cacheRef.current[stateSymbol] = state;
    // 当key发生变化时， 更新以及读取缓存
    useEffect(() => {
        if (cacheRef.current[key] === undefined) {
            cacheRef.current[key] = defaultValue;
        }
        setState(cacheRef.current[key]);
        return () => void (cacheRef.current[key] = cacheRef.current[stateSymbol]);
    }, [key]);
    return [state, setState] as const;
}
