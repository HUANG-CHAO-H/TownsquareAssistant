type Callback<V = unknown> = (value: V) => unknown
export type IReactiveData<O> = {
    [K in keyof O]: O[K];
} & {
    // 订阅变量值的变化
    observe: <K extends keyof O>(key: K, callback: Callback<O[K]>) => void
    // 取消订阅
    unobserve: <K extends keyof O>(key: K, callback: Callback<O[K]>) => void
    // 返回一个Promise,每次目标值变化时,都会调用传入的callback,当callback返回true时,Promise被解决
    wait: <K extends keyof O>(key: K, callback: (value: O[K]) => boolean, maxTime?: number) => Promise<void>
}

export function ReactiveData<O extends Object>(record: O): IReactiveData<O> {
    // 监听函数集合
    const listenerMap = new Map<keyof O, Set<Function>>();
    for (const key of Object.keys(record)) {
        listenerMap.set(key as keyof O, new Set());
    }
    // 浅拷贝 & 添加三个关键函数
    const result = Object.assign({}, record) as IReactiveData<O>;
    result.observe = (key, callback) => {
        const set = listenerMap.get(key);
        if (set) set.add(callback);
        else throw new Error('key is unknown');
    }
    result.unobserve = (key, callback) => {
        const set = listenerMap.get(key);
        if (set) set.delete(callback);
        else throw new Error('key is unknown');
    }
    result.wait = (key, callback, maxTime) => new Promise<void>((resolve, reject) => {
        if (callback(result[key])) return resolve();
        const set = listenerMap.get(key);
        if (!set) throw new Error('key is unknown');
        const onceCallback = value => {
            if (callback(value)) {
                set.delete(onceCallback);
                resolve();
            }
        }
        set.add(onceCallback);
        if (maxTime) setTimeout(reject, maxTime, 'ReactiveData.wait Error: wait timeout');
    })

    return new Proxy(result, {
        set(target: typeof result, p: string | symbol, value: any): boolean {
            if (target[p] === value) return true;
            if (p === 'observe' || p === 'unobserve' || p === 'wait') return false;
            const listeners = listenerMap.get(p as any);
            if (!listeners) return false;
            target[p] = value;
            for (let listener of listeners) listener(value);
            return true;
        }
    })
}

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
