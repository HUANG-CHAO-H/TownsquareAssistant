import {HTMLAttributes, RefAttributes} from "react";

export * from './ReactiveData';
export * from './loadRemoteResource';

export type ReactHTMLAttributes<T> = HTMLAttributes<T> & RefAttributes<T>

// 休眠
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function TypeCheck<T>(value: T): T {return value}

// 触发click事件
export function dispatchClickEvent(element: HTMLElement | null): void {
    if (!element) {
        console.error('dispatchClickEvent Error: element 不存在');
        return;
    }
    element.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    }));
}

/**
 * 判断当前环境是否是开发环境
 */
export function isDevelopment(): boolean {
    return import.meta.env.DEV || false;
}