import React, { useMemo } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import {
  EventEmitter,
  getRefCallback,
  ReactiveData,
  useCacheRef,
} from '..';
import { CallModal } from './CallModal';
import {
  ModalEvent,
  IModalContext,
  ModalContext,
} from './ModalContext';
export interface ModalReactData<S, C> {
  // 状态
  state: S;
  // 缓存
  cache: C;
  // Modal的Props
  modalProps: ModalReactProps;
}
export interface ModalDialogContainerProps<S, C> {
  // 对话框类型
  type?: 'success' | 'info' | 'warning' | 'error' | 'confirm';
  // 对话框的数据
  modalData: ReactiveData<ModalReactData<S, C>>;
  // 由内部自动控制按钮的loading态(默认为true)
  autoLoading?: boolean;
  // react children
  children?: React.ReactNode;
}
/**
 * 对 Modal 的二次封装, 增加了如下内容
 * 1. 在外层包裹了 ModalContext, 使得下层组件可以访问相应上下文
 * 2. 将内部状态, state, cache, 以及modalProps暴露给外界(通过ReactiveData实例), 外部可以通过直接修改ReactiveData实例来改变内部状态
 */
export function ModalContainer<S, C>(
    props: ModalDialogContainerProps<S, C>,
) {
  const { type, modalData, autoLoading = true, children } = props;
  // 全局状态
  const [state, setState] = modalData.useState('state');
  // 全局缓存
  const [cache] = modalData.useState('cache');
  // 对话框的Props
  const [modalProps, setModalProps] = modalData.useState('modalProps');
  const eventEmitter = useMemo(
      () => new EventEmitter<ModalEvent<S, C>>(),
      [],
  );
  const cacheRef = useCacheRef({
    isObserve: false,
    // 设置对话框的可见性
    setVisible(visible: boolean) {
      const _modalProps = modalData.data.modalProps;
      if (_modalProps.visible !== visible) {
        modalData.set('modalProps', {
          ..._modalProps,
          visible,
        });
      }
    },
    // 设置确认按钮的loading态
    setConfirmLoading(loading: boolean) {
      if (!autoLoading) {
        return;
      }
      const _modalProps = modalData.data.modalProps;
      if (_modalProps.confirmLoading !== loading) {
        modalData.set('modalProps', {
          ..._modalProps,
          confirmLoading: loading,
        });
      }
    },
    // onOk回调函数
    async onOk(e: React.MouseEvent) {
      cacheRef.current.setConfirmLoading(true);
      if (!(await eventEmitter.everyDispatch('submit', state, cache))) {
        cacheRef.current.setConfirmLoading(false);
        return;
      }
      const _onOk = modalData.data.modalProps.onOk;
      if (_onOk) {
        if ((await _onOk(e)) === false) {
          cacheRef.current.setConfirmLoading(false);
          return;
        }
      }
      cacheRef.current.setConfirmLoading(false);
      cacheRef.current.setVisible(false);
    },
    // onCancel回调函数
    async onCancel(e: React.MouseEvent) {
      if (!(await eventEmitter.everyDispatch('cancel', state, cache))) {
        return;
      }
      const _onCancel = modalData.data.modalProps.onCancel;
      if (_onCancel) {
        if ((await _onCancel(e)) === false) {
          return;
        }
      }
      cacheRef.current.setVisible(false);
    },
  });
  // 最终的对话框 props
  const finalModalProps = useMemo<ModalReactProps>(
      () => ({
        ...modalProps,
        type,
        onOk: getRefCallback(cacheRef, 'onOk'),
        onCancel: getRefCallback(cacheRef, 'onCancel'),
      }),
      [cacheRef, modalProps, type],
  );
  // context value
  const contextValue = useMemo<IModalContext<S, C>>(
      () => ({
        state,
        setState,
        modalProps: finalModalProps,
        setModalProps,
        cache,
        eventEmitter,
      }),
      [state, setState, finalModalProps, setModalProps, cache, eventEmitter],
  );
  const Component: typeof CallModal = type ? CallModal : (Modal as any);
  return (
      <ModalContext.Provider value={contextValue as any}>
        <Component {...finalModalProps}>
          {children || modalProps.children || modalProps.content}
        </Component>
      </ModalContext.Provider>
  );
}
