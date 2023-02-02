import {ReducerWithoutAction, useEffect, useReducer, useState} from 'react';
import {BaseEventEmitter} from './EventEmitter';

export type AllChangeListener<D extends Record<string, any>> = <K extends keyof D>(key: K, value: D[K]) => void;

export class ReactiveData<
    D extends Record<string, any>,
> extends BaseEventEmitter<{ [K in keyof D]: (value: D[K]) => void }> {
    // 真实数据对象
    protected _realData: D;

    // 代理数据对象
    protected _proxyData: D;

    // 数据对象的key集合
    protected readonly _keySet: Set<keyof D>;

    // 是否冻结该对象，不允许修改或设置 data 中不包含的属性
    private readonly _freeze: boolean;

    // 是否已经销毁
    protected _destroy: boolean = false;

    // 监听所有变化的listener
    protected allChangeListenerSet = new Set<AllChangeListener<D>>();

    // 获取代理对象
    get data(): D {
        return this._proxyData;
    }

    constructor(data: D, freeze = true) {
        super();
        this._freeze = freeze;
        // 对传入的数据进行浅拷贝
        const realData = { ...data };
        this._realData = realData;
        // 所有属性key的集合
        this._keySet = new Set<keyof D>(Object.keys(realData));
        // 生成代理对象
        this._proxyData = new Proxy(this._realData, {
            set: <K extends keyof D>(
                _target: D,
                p: K | symbol,
                value: D[K],
            ): boolean => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.set(p, value);
                return true;
            },
        });
    }

    /**
     * 销毁, 清空ReactiveData
     * 1. 并不是真正意义上的完全清空, 只是让代理直接指向了真实对象, 允许读数据
     * 2. 销毁后observe, 和wait都将无效(wait堵塞的流程将会永远都无法继续向下进行)
     * 3. 销毁后再调用set, observe和wait将会抛出错误
     */
    destroy() {
        this._destroy = true;
        this._eventHandlers.clear();
        this._keySet.clear();
        this._proxyData = this._realData;
    }

    // 获取值
    get<K extends keyof D>(key: K): D[K] {
        if (this._destroy) {
            console.error('ReactiveData is destroy');
        }
        return this._realData[key];
    }

    // 设置值
    set<K extends keyof D>(key: K, value: D[K]) {
        if (this._destroy) {
            throw new Error('ReactiveData is destroy');
        }
        if (typeof key === 'symbol' || (this._freeze && !this._keySet.has(key))) {
            throw new Error('key is unknown');
        }
        if (this._realData[key] !== value) {
            this._realData[key] = value;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.dispatch(key, value);
            for (const fn of this.allChangeListenerSet) {
                fn(key, value);
            }
        }
    }

    // 订阅某个属性的变化
    observe<K extends keyof D>(key: K, callback: (value: D[K]) => void) {
        if (this._destroy) {
            throw new Error('ReactiveData is destroy');
        }
        this.addListener(key, callback);
    }

    // 取消订阅属性的变化
    unObserve<K extends keyof D>(key: K, callback: (value: D[K]) => void) {
        if (this._destroy) {
            console.error('ReactiveData is destroy');
        }
        this.removeListener(key, callback);
    }

    // 添加监听所有值变化的函数
    observeAllChange(listener: AllChangeListener<D>) {
        if (this._destroy) {
            throw new Error('ReactiveData is destroy');
        }
        this.allChangeListenerSet.add(listener);
    }

    // 移除监听所有值变化的函数
    unObserveAllChange(listener: AllChangeListener<D>) {
        if (this._destroy) {
            console.error('ReactiveData is destroy');
        }
        this.allChangeListenerSet.delete(listener);
    }

    wait<K extends keyof D>(key: K, callback: (value: D[K]) => boolean) {
        if (this._destroy) {
            throw new Error('ReactiveData is destroy');
        }
        return new Promise<void>(resolve => {
            if (callback(this._realData[key])) {
                resolve();
                return;
            }
            const onceCallback = (value: D[K]) => {
                if (callback(value)) {
                    this.removeListener(key, onceCallback);
                    resolve();
                }
            };
            this.addListener(key, onceCallback);
        });
    }

    // 将 ReactiveData中的数据转化为React state
    useState<K extends keyof D>(key: K) {
        if (this._destroy) {
            throw new Error('ReactiveData is destroy');
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(this._realData[key]);
        this.set(key, value);
        this.addListener(key, setValue);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => () => this.removeListener(key, setValue), [key]);
        return [value, setValue] as const;
    }

    /**
     * 将 ReactiveData中的数据转化为React state
     * 1. reducer需要满足一个基础要求, 如果调用时没有传入action, 则表达的含义是 set / 覆盖
     */
    useReducer<K extends keyof D, R extends ReducerWithoutAction<D[K]>>(
        key: K,
        reducer: R,
    ) {
        if (this._destroy) {
            throw new Error('ReactiveData is destroy');
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, dispatch] = useReducer(reducer, this._realData[key]);
        this.set(key, value);
        this.addListener(key, dispatch);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => () => this.removeListener(key, dispatch), [key]);
        return [value, dispatch] as const;
    }
}

// export type IReactiveData<O> = {
//   [K in keyof O]: O[K];
// } & {
//   // 订阅某个属性值的变化
//   $observe: <K extends keyof O>(
//     key: K,
//     callback: (value: O[K]) => void,
//   ) => void;
//   // 取消订阅
//   $unobserve: <K extends keyof O>(
//     key: K,
//     callback: (value: O[K]) => void,
//   ) => void;
//   // 返回一个Promise,每次目标值变化时,都会调用传入的callback,当callback返回true时,Promise被解决
//   $wait: <K extends keyof O>(
//     key: K,
//     callback: (value: O[K]) => boolean,
//   ) => Promise<void>;
// };
//
// export function ReactiveData<O>(record: O): IReactiveData<O> {
//   // 监听函数集合
//   const listenerMap = new Map<keyof O, Set<(...args: any[]) => any>>();
//   for (const key of Object.keys(record)) {
//     listenerMap.set(key as keyof O, new Set());
//   }
//   // 浅拷贝 & 添加三个关键函数
//   const result = { ...record } as IReactiveData<O>;
//   result.$observe = (key, callback) => {
//     const set = listenerMap.get(key);
//     if (set) {
//       set.add(callback);
//     } else {
//       throw new Error('key is unknown');
//     }
//   };
//   result.$unobserve = (key, callback) => {
//     const set = listenerMap.get(key);
//     if (set) {
//       set.delete(callback);
//     } else {
//       throw new Error('key is unknown');
//     }
//   };
//   result.$wait = <K extends keyof O>(
//     key: K,
//     callback: (value: O[K]) => boolean,
//   ) =>
//     new Promise<void>(resolve => {
//       if (callback(result[key])) {
//         resolve();
//         return;
//       }
//       const set = listenerMap.get(key);
//       if (!set) {
//         throw new Error('key is unknown');
//       }
//       const onceCallback = (value: O[K]) => {
//         if (callback(value)) {
//           set.delete(onceCallback);
//           resolve();
//         }
//       };
//       set.add(onceCallback);
//     });
//
//   return new Proxy(result, {
//     set(target: typeof result, p: string | symbol, value: any): boolean {
//       if (target[p] === value) {
//         return true;
//       }
//       if (p === '$observe' || p === '$unobserve' || p === '$wait') {
//         return false;
//       }
//       const listeners = listenerMap.get(p as any);
//       if (!listeners) {
//         return false;
//       }
//       target[p] = value;
//       for (const listener of listeners) {
//         listener(value);
//       }
//       return true;
//     },
//   });
// }

// 逻辑验证代码
// const data = {
//     A: 1,
//     B: 2,
//     C: 3,
// }
// const reactData = ReactiveData(data);
// reactData.observe('A', value => console.log('A发生了变化', value));
// reactData.observe('B', value => console.log('B发生了变化', value));
// reactData.observe('C', value => console.log('C发生了变化', value));
// reactData.wait('A', value => value === 0).then(() => console.log('A的值归零了'))
// reactData.wait('A', value => value === 0).then(() => console.log('A的值归零了'))
// reactData.wait('A', value => value === 0).then(() => console.log('A的值归零了'))
// console.log('reactData.A = ', reactData.A);
// console.log('reactData.B = ', reactData.B);
// console.log('reactData.C = ', reactData.C);
//
// reactData.A = 10;
// reactData.B = 20;
// reactData.C = 30;
// console.log('reactData.A = ', reactData.A);
// console.log('reactData.B = ', reactData.B);
// console.log('reactData.C = ', reactData.C);
//
// reactData.A = 0;
// setTimeout(() => {
//     reactData.A = 10;
//     reactData.A = 0;
// }, 1000);
