import React, { useContext } from 'react';
import { get as lodashGet } from 'lodash';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import { EventEmitter } from '../EventEmitter';
import { useCacheRef, useRefCallback } from '../useCacheRef';

export const ModalContext = React.createContext<
    IModalContext | undefined
>(undefined);

export function useModalContext<
    S = Record<string, any>,
    C = Record<string, any>,
>() {
  return useContext(ModalContext) as IModalContext<S, C>;
}

// 对话框内部的事件流
export interface ModalEvent<S, C> {
  // onOk事件,listener可以通过返回false来中断该流程
  submit: (state: S, cache: C) => boolean | Promise<boolean>;
  // onCancel事件,listener可以通过返回false来中断该流程
  cancel: (state: S, cache: C) => boolean | Promise<boolean>;
}

export interface IModalContext<
    S = Record<string, any>,
    C = Record<string, any>,
> {
  // 整个对话框的共用state
  state: S;
  // 设置 modalState
  setState: React.Dispatch<React.SetStateAction<S>>;
  // 整个对话框共用的缓存空间
  cache: C;
  // 对话框所拥有的modalProps输入
  modalProps: ModalReactProps;
  // 设置 modalProps (不要修改 onOk, onCancel, 以及visible, 这会导致对话框失控)
  setModalProps: React.Dispatch<React.SetStateAction<ModalReactProps>>;
  // 对话框内部的事件流
  eventEmitter: Pick<
      EventEmitter<ModalEvent<S, C>>,
      'addListener' | 'removeListener'
  >;
}

export interface WithModalFieldOption {
  valueKey?: string;
  onKeyChangeFnName?: string;
  valuePath?: string;
}

// FIXME 这里只是"理论上"实现了, 没有进行实际的测试, 如果真要使用可以先验证一下有没有bug
export function withModalField<
    C extends React.ElementType,
    P = Omit<React.ComponentProps<C>, 'value' | 'onChange'> & {
      fieldKey: string;
    },
>(Component: C, option: WithModalFieldOption = {}): React.ElementType<P> {
  const {
    valueKey = 'value',
    onKeyChangeFnName = 'onChange',
    valuePath = '',
  } = option;
  return (props: P) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { fieldKey, ...componentProps } = props;
    const { state = {}, setState } = useModalContext() || {};
    const cacheRef = useCacheRef({
      onValueChange(value: any) {
        const v = valuePath ? lodashGet(value, valuePath) : value;
        if (state[fieldKey] === v) {
          return;
        }
        setState?.({
          ...state,
          [fieldKey]: v,
        });
      },
    });
    (componentProps as any)[onKeyChangeFnName] = useRefCallback(
        cacheRef,
        'onValueChange',
    );
    (componentProps as any)[valueKey] = state[fieldKey];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Component {...componentProps} />;
  };
}

interface BaseFormProps {
  initValues?: Record<string, any>;
  onValueChange?: (...args: any[]) => any;
  getFormApi?: (formApi: FormApi) => void;
}

// FIXME 这里只是"理论上"实现了, 没有进行实际的测试, 如果真要使用可以先验证一下有没有bug
export function withModalForm<
    C extends React.ElementType<BaseFormProps>,
    P extends React.ComponentProps<C>,
>(FormComponent: C) {
  return (props: Omit<P, 'initValues' | 'onChange' | 'getFormApi'>) => {
    const { state = {}, setState, cache = {} } = useModalContext() || {};
    const cacheRef = useCacheRef({
      onValueChange() {
        const formApi = cache.formApi as FormApi | undefined;
        if (!formApi) {
          console.error('withModalForm Error: formApi is undefined');
          return;
        }
        const values = formApi.getValues();
        if (state.formData === values) {
          return;
        }
        setState?.({
          ...state,
          formData: values,
        });
      },
    });
    const onValueChange = useRefCallback(cacheRef, 'onValueChange');
    const p = {
      ...props,
      getFormApi: (f: any) => (cache.formApi = f),
      onValueChange,
    } as any;
    return <FormComponent {...p} />;
  };
}
