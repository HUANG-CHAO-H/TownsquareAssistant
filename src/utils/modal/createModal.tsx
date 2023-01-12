import ReactDOM from 'react-dom';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import { ReactiveData } from '../ReactiveData';
import { ModalContainer } from './ModalContainer';

export interface CreateModalConfig<
    S extends Record<string, any> = {},
    C extends Record<string, any> = {},
    F = S,
> {
    // 对话框的类型(default表示为最普通的modal, 没有额外类型所附带的样式)
    type: 'success' | 'info' | 'warning' | 'error' | 'confirm' | 'default';
    // 点击ok时的回调函数(可以通过返回false来中断ok流程)
    beforeSubmit?: (state: S, cache: C) => boolean | Promise<boolean>;
    // 格式化数据输出(最终Promise返回时会用此方法来格式化state,然后作为返回值, 不传则直接返回state)
    format?: (state: S, cache: C) => F | Promise<F>;
    // 点击cancel时的回调函数(可以通过返回false来中断cancel流程)
    beforeCancel?: (state: S, cache: C) => boolean | Promise<boolean>;
    // 自定义渲染器, 该方法会会接收到一个参数, 该参数就是对话框的ReactNode实例, 业务侧可以在这个实例外层包裹自定义Provider然后返回
    customRender?: (modal: JSX.Element) => JSX.Element;
    // 由内部自动控制按钮的loading态(默认为true)
    autoLoading?: boolean;
}

/**
 * 创建一个简单的模态对话框, 并返回一个Promise异步函数, 通过该函数,可调用该对话框
 * 1. 此方法返回一个异步函数, 通过该函数, 可以调用该对话框
 * 2. 第1点提到的异步函数如果返回的Promise<Object>, 则说明用户点击了确认按钮;
 * 3. 如果异步函数返回的是Promise<undefined>, 则说明用户点击了取消按钮
 * @param modalProps 传递给对话框的props
 * @param config 对话框的配置config
 */
export function createModal<
    S extends Record<string, any> = {},
    C extends Record<string, any> = {},
    F = S,
>(
    config: CreateModalConfig<S, C, F> | CreateModalConfig['type'],
    modalProps: Omit<ModalReactProps, 'onOk' | 'onCancel' | 'visible'>,
) {
    const {
        beforeSubmit = () => Promise.resolve(true),
        format = (state: S) => state as any as F,
        beforeCancel = () => Promise.resolve(true),
        customRender = (modal: JSX.Element) => modal,
    } = typeof config === 'string' ? {} : config;
    const type = typeof config === 'string' ? config : config.type;
    const autoLoading = typeof config === 'string' ? true : config.autoLoading;
    return (state = {} as S, cache = {} as C) => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const modalData = new ReactiveData({
            state,
            cache,
            modalProps: {
                ...modalProps,
                visible: true,
            } as ModalReactProps,
        });
        const promise = new Promise<F | undefined>(resolve => {
            const submit = async () => {
                const _state = modalData.get('state');
                const _cache = modalData.get('cache');
                if (!(await beforeSubmit(_state, _cache))) {
                    return false;
                }
                resolve(format(_state, _cache));
                return true;
            };
            const cancel = async () => {
                const _state = modalData.get('state');
                const _cache = modalData.get('cache');
                if (!(await beforeCancel(_state, _cache))) {
                    return false;
                }
                resolve(undefined);
                return true;
            };
            modalData.set('modalProps', {
                ...modalData.get('modalProps'),
                onOk: submit,
                onCancel: cancel,
            });
            modalData.observe('modalProps', value => {
                // 对话框不可见了, 被销毁 / 隐藏了, 那么就销毁此次渲染
                if (!value.visible) {
                    ReactDOM.unmountComponentAtNode(div);
                    document.body.removeChild(div);
                    modalData.destroy();
                }
            });
            ReactDOM.render(
                customRender(
                    <ModalContainer
                        type={type === 'default' ? undefined : type}
                        modalData={modalData}
                        autoLoading={autoLoading}
                    />,
                ),
                div,
            );
        });
        return [promise, modalData] as const;
    };
}
