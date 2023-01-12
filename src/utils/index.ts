import {HTMLAttributes, RefAttributes, useRef} from "react";

export * from './ReactiveData';
export * from './EventEmitter';
export * from './useCacheRef';
export * from './loadRemoteResource';

export type ReactHTMLAttributes<T> = HTMLAttributes<T> & RefAttributes<T>

// 休眠
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function TypeCheck<T>(value: T): T {return value}

export function useCacheRef<O>(object: O, autoCover = true) {
    const cacheRef = useRef<O>(object);
    autoCover && (cacheRef.current = object);
    return cacheRef;
}
