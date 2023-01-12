import React, { useCallback, useRef } from 'react';

/**
 * 对ref进行一下简单的包装, 使其更便于书写
 * @param cache 要缓存的数据
 * @param autoCover 是否自动覆盖旧值(即每次执行时都将执行 cacheRef.current = cacheObj )
 */
export function useCacheRef<R>(cache: R, autoCover = true) {
    const cacheRef = useRef<R>(cache);
    autoCover && (cacheRef.current = cache);
    return cacheRef;
}

/**
 * 获取ref上的某个函数
 * @param ref
 * @param key
 */
export function getRefCallback<R, K extends keyof R>(
    ref: React.MutableRefObject<R>,
    key: K,
): R[K] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (...args: any[]) => ref.current[key](...args);
}

/**
 * 将ref上面的某个函数持久化,持续更新但引用不变
 * @param ref
 * @param key
 */
export function useRefCallback<R, K extends keyof R>(
    ref: React.MutableRefObject<R>,
    key: K,
): R[K] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return useCallback((...args: any[]) => ref.current[key](...args), [key, ref]);
}
