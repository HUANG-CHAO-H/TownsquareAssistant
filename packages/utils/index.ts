import {HTMLAttributes, RefAttributes} from "react";

export * from './ReactiveData';
export * from './EventEmitter';
export * from './useCacheRef';
export * from './domHelper';
export * from './SortQueue';

export type ReactHTMLAttributes<T> = HTMLAttributes<T> & RefAttributes<T>

// 休眠
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function TypeCheck<T>(value: T): T {return value}

export function tryToParseJson<V>(value: V): Object | V {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.warn('tryToParseJson Error: ', e, value);
            return value;
        }
    }
    return value;
}

/**
 * 加载远程JSON资源
 * @param url
 */
export async function loadRemoteJson<D>(url: string, format?: (data: any) => D): Promise<D | undefined> {
    const response = await fetch(url);
    if (response.status !== 200) {
        console.error('加载JSON资源失败');
        return undefined;
    }
    if (format) return format(await response.json());
    else return tryToParseJson(await response.json());
}
