export class SortQueue<V = unknown, K = V> {
    // 消息队列
    private readonly _queue: Array<V> = [];
    // 消息的map集合
    private readonly _keyValueMap = new Map<K, V>();
    // _msgQueue的版本号
    private _queueVersion = 0;
    // 缓存空间
    private readonly _cache = {
        // _cache.queue的消息版本, 每次变更都会修改此版本号
        queueVersion: 0,
        // queue缓存
        queue: [] as Array<V>,
        // _cache.keyValueMap的版本号
        keyValueMapVersion: 0,
        // keyValueMap缓存
        keyValueMap: new Map<K, V>(),
    }
    constructor(readonly compare: (a: V, b: V) => number, readonly size: number) {}

    // 获取key的set版本
    get keyValueMap(): Map<K, V> {
        if (this._queueVersion === this._cache.keyValueMapVersion) {
            return this._cache.keyValueMap;
        }
        this._cache.keyValueMap = new Proxy(this._keyValueMap, {});
        this._cache.keyValueMapVersion = this._queueVersion;
        return this._cache.keyValueMap;
    }
    // 获取消息队列实例（每一次变更都会返回一个新的队列实例）
    get msgQueue(): Array<V> {
        if (this._queueVersion === this._cache.queueVersion) {
            return this._cache.queue;
        }
        this._cache.queue = new Proxy(this._queue, {});
        this._cache.queueVersion = this._queueVersion;
        return this._cache.queue;
    }
    // 队列长度（消息数量）
    get queueLength(): number {
        return this._queue.length;
    }

    shift(): V | undefined {
        if (!this.queueLength) {
            return undefined;
        }
        this._queueVersion++;
        return this.deleteValueFromMap(this._queue.shift()!)?.[1];
    }
    pop(): V | undefined {
        if (!this.queueLength) {
            return undefined;
        }
        this._queueVersion++;
        return this.deleteValueFromMap(this._queue.pop()!)?.[1];
    }
    // 向消息队列中插入消息
    push(key: K, value: V = key as any) {
        // 先查询此消息是否存在
        if (this._keyValueMap.has(key)) {
            return false;
        }
        // 按createTime从小到大插入到消息队列中
        for (let i = this.queueLength - 1; i >= 0; i--) {
            if (this.compare(this._queue[i], value) > 0) {
                continue;
            }
            if (this.queueLength >= this.size) {
                this._queue[i] = value;
            } else {
                this._queue.splice(i + 1, 0, value);
            }
            this._keyValueMap.set(key, value);
            this._queueVersion++;
            return true;
        }
        // 头部插入
        if (this.queueLength >= this.size) {
            return false;
        }
        this._queue.unshift(value);
        this._keyValueMap.set(key, value);
        this._queueVersion++;
        return true;
    }

    private deleteValueFromMap(value: V): [K, V] | undefined {
        for (const keyValue of this._keyValueMap) {
            if (keyValue[1] !== value) continue;
            this._keyValueMap.delete(keyValue[0]);
            return keyValue;
        }
        return undefined;
    }
}
