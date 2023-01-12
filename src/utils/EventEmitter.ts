export type InputParams<Fn> = Fn extends (...args: infer P) => any
    ? P
    : never[];
export type ReturnParams<Fn> = Fn extends (...args: any[]) => infer P
    ? P
    : never[];

// 监听函数的配置参数
export interface ListenerConfig {
    // 是否只触发一次
    once: boolean;
}

/**
 * 最基础的 EventEmitter, 只包含最基本的 添加/移除监听函数, 以及触发事件, 适合用来继承并自定义其它实现
 */
export abstract class BaseEventEmitter<
    EListener extends { [K in keyof EListener]: (...args: any[]) => any },
    > {
    // 事件与订阅者
    protected readonly _eventHandlers: Map<
        keyof EListener,
        Map<EListener[keyof EListener], ListenerConfig>
        > = new Map();

    // 添加事件监听函数
    protected addListener<T extends keyof EListener>(
        type: T,
        handler: EListener[T],
        config?: ListenerConfig,
    ): void {
        let map = this._eventHandlers.get(type);
        if (!map) {
            this._eventHandlers.set(
                type,
                (map = new Map<EListener[keyof EListener], ListenerConfig>()),
            );
        }
        map.set(handler, config || { once: false });
    }

    // 移除事件监听函数
    protected removeListener<T extends keyof EListener>(
        type: T,
        handler: EListener[T],
    ): void {
        const set = this._eventHandlers.get(type);
        if (set) {
            set.delete(handler);
            if (set.size === 0) {
                this._eventHandlers.delete(type);
            }
        }
    }

    // 分发事件, 调用listener
    protected callListener<T extends keyof EListener>(
        type: T,
        map: Map<EListener[T], ListenerConfig>,
        [listener, config]: [EListener[T], ListenerConfig],
        args: InputParams<EListener[T]>,
    ): ReturnParams<EListener[T]> | undefined {
        if (typeof listener === 'function') {
            // 如果只需要执行一次, 则从map移除该监听函数
            if (config.once) {
                map.delete(listener);
                // 移除不再需要的map集合
                if (map.size === 0) {
                    this._eventHandlers.delete(type);
                }
            }
            return listener(...args);
        } else {
            console.error('BaseEventEmitter.callListener listener is not a function');
            return undefined;
        }
    }

    // 触发某个事件(最简单的, 经典的事件触发函数)
    protected dispatch<T extends keyof EListener>(
        type: T,
        ...args: InputParams<EListener[T]>
    ): void {
        const map = this._eventHandlers.get(type);
        if (map) {
            // 事件派发
            for (const keyValue of map) {
                this.callListener(type, map, keyValue, args);
            }
        }
    }
}

/**
 * 自定义事件系统，继承使用, 或者直接实例化使用
 */
export class EventEmitter<
    EListener extends { [K in keyof EListener]: (...args: any[]) => any },
    > extends BaseEventEmitter<EListener> {
    // 触发某个事件(最简单的, 经典的事件触发函数)
    dispatch<T extends keyof EListener>(
        type: T,
        ...args: InputParams<EListener[T]>
    ): void {
        return super.dispatch(type, ...args);
    }

    addListener<T extends keyof EListener>(
        type: T,
        handler: EListener[T],
        config?: ListenerConfig,
    ) {
        super.addListener(type, handler, config);
    }

    removeListener<T extends keyof EListener>(type: T, handler: EListener[T]) {
        super.removeListener(type, handler);
    }

    // (同步)触发某个事件(如果监听函数中有异步函数,则会堵塞事件的触发过程)
    async syncDispatch<T extends keyof EListener>(
        type: T,
        ...args: InputParams<EListener[T]>
    ): Promise<void> {
        const map = this._eventHandlers.get(type);
        if (map) {
            // 事件派发
            let _return: any;
            for (const keyValue of map) {
                _return = this.callListener(type, map, keyValue, args);
                if (_return instanceof Promise) {
                    await _return;
                }
            }
        }
    }

    // 触发某个事件, 并收集所有listener的返回值(如果返回的Promise会使用await)
    async collectDispatch<T extends keyof EListener>(
        type: T,
        ...args: InputParams<EListener[T]>
    ): Promise<ReturnParams<EListener[T]>[]> {
        const map = this._eventHandlers.get(type);
        const returns: ReturnParams<EListener[T]>[] = [];
        if (map) {
            // 事件派发
            let _return: any;
            for (const keyValue of map) {
                _return = this.callListener(type, map, keyValue, args);
                if (_return instanceof Promise) {
                    _return = await _return;
                }
                returns.push(_return);
            }
        }
        return returns;
    }

    /**
     * 类似Array.every的某个触发事件, 触发事件的过程中会检查每个listener的返回值
     * 1. 如果某个listener的返回值不是 true/Promise<true>, 那么就立刻中断触发流程, 并返回Promise<false>;
     * 2. 如果所有的listener都返回 true/Promise<true>, 那么最终就会返回 Promise<true>;
     */
    async everyDispatch<T extends keyof EListener>(
        type: T,
        ...args: InputParams<EListener[T]>
    ): Promise<boolean> {
        const map = this._eventHandlers.get(type);
        if (map) {
            // 事件派发
            let _return: any;
            for (const keyValue of map) {
                _return = this.callListener(type, map, keyValue, args);
                if (_return instanceof Promise) {
                    _return = await _return;
                }
                if (_return === false) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 类似Array.some的某个触发事件, 触发事件的过程中会检查每个listener的返回值
     * 1. 如果某个listener的返回值是 true/Promise<true>, 那么就立刻中断触发流程, 并返回Promise<true>;
     * 2. 如果所有的listener的返回值都不是 true/Promise<true>, 那么最终就会返回 Promise<false>;
     */
    async someDispatch<T extends keyof EListener>(
        type: T,
        ...args: InputParams<EListener[T]>
    ): Promise<boolean> {
        const map = this._eventHandlers.get(type);
        if (map) {
            // 事件派发
            let _return: any;
            for (const keyValue of map) {
                _return = this.callListener(type, map, keyValue, args);
                if (_return instanceof Promise) {
                    _return = await _return;
                }
                if (_return === true) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 类似Array.reduce的某个触发事件, 上一个listener的返回值会作为下一个listener的输入
     */
    async reduceDispatch<T extends keyof EListener, V>(type: T, initValue: V) {
        const map = this._eventHandlers.get(type);
        let reduceValue: any = initValue;
        if (map) {
            // 事件派发
            for (const keyValue of map) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                reduceValue = this.callListener(type, map, keyValue, [reduceValue]);
                if (reduceValue instanceof Promise) {
                    reduceValue = await reduceValue;
                }
            }
        }
        return reduceValue as V;
    }
}
