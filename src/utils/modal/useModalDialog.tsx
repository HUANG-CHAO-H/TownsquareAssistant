import React, { useCallback, useState } from 'react';

/**
 * 对话框task的基本属性
 */
export interface ModalDialogTask<V = unknown, R = unknown> {
    // 标识task的key,用来区分不同的task
    key: string;
    // task的Promise resolve
    resolve: (value: V) => void;
    // task的Promise reject
    reject: (reason?: R) => void;
}

/**
 * 对话框的props
 */
export interface ModalDialogProps<TASK extends ModalDialogTask> {
    // 对话框要执行的任务
    task: TASK;
    // 设置task
    setTask: React.Dispatch<React.SetStateAction<TASK | undefined>>;
}

/**
 * 对话框组件的接口描述
 */
export type ModalDialog<TASK extends ModalDialogTask> = (
    props: ModalDialogProps<TASK>,
) => JSX.Element;

/**
 * 使用 ModalDialog 对话框, 传入满足`ModalDialog`接口的对话框组件(函数), 此方法将会将该对话框转化成Promise调用
 * 1. 该方法返回一个二元数组, 该数组的第一个元素是ReactNode节点,需要将它挂载到React组件中
 * 2. 该方法返回的二元数组的第二个元素是一个异步函数,通过调用该函数,可以启用对话框
 * 3. 第2点中提到的异步函数接收一个task实例, 该实例是此次调用对话框需要的参数, Promise的resolve或reject包含了对话框最终的执行结果
 * @param Modal 满足`ModalDialog`接口的对话框组件
 */
export function useModalDialog<TASK extends ModalDialogTask>(
    Modal: ModalDialog<TASK>,
) {
    const [task, setTask] = useState<TASK>();
    const callModalFn = useCallback<CallModalDialogFn<TASK>>(
        _task =>
            new Promise((resolve, reject) => {
                setTask(oldV => {
                    oldV?.resolve(undefined);
                    return {
                        ..._task,
                        resolve,
                        reject,
                        key: `modal-dialog-${getAccumulator()}`,
                    } as TASK;
                });
            }),
        [],
    );
    // span是用来做占位符的, 避免因为对话框的挂载和销毁而导致的dom结构巨大改变
    const reactNode = task ? (
        <Modal key={task.key} task={task} setTask={setTask} />
    ) : (
        <span style={spanStyle} />
    );
    return [reactNode, callModalFn] as const;
}

let _accumulator = 0;
// 自增(+1)的累加器
function getAccumulator() {
    return ++_accumulator;
}

// 获取函数参数
export type FnParams<F> = F extends (...args: infer A) => unknown ? A : never;
// 调用对话框的函数接口
export type CallModalDialogFn<TASK extends ModalDialogTask> = (
    task: Omit<TASK, keyof ModalDialogTask>,
) => Promise<FnParams<TASK['resolve']>[0]>;

export type GetModalCallFn<M> = M extends ModalDialog<infer T>
    ? CallModalDialogFn<T>
    : never;

const spanStyle: React.CSSProperties = {
    display: 'inline',
    width: 0,
    height: 0,
};
