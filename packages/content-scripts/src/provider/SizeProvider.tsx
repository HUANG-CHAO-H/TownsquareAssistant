import React, { useContext, useLayoutEffect, useRef, useState, createElement } from "react";

interface ISizeContext {
    // 宽
    width: number
    // 高
    height: number
    // 是否是默认值
    isDefault: boolean
}
const DEFAULT_VALUE: ISizeContext = {
    width: document.body.clientWidth || 0,
    height: document.body.clientHeight || 0,
    isDefault: true,
};
const SizeContext = React.createContext<ISizeContext>(DEFAULT_VALUE);
export const useSizeContext = () => useContext(SizeContext);

export interface SizeProviderProps {
    // 传入自定义Ref, 如果不传， 则SizeProvider内部会自动包裹一层div， 以进行size计算
    divRef?: React.RefObject<HTMLElement | null>;
    // 默认宽高（在第一次计算还为完成时展示的默认值）
    defaultValue?: ISizeContext;
    // react children
    children?: React.ReactNode
}

export function SizeProvider(props: SizeProviderProps) {
    if (props.divRef) {
        return createElement(CustomSizeProvider, props);
    } else {
        return createElement(DivSizeProvider, props);
    }
}

// 使用外界传入的ref element作为容器，计算其size
function CustomSizeProvider(props: SizeProviderProps) {
    const ctxValue = useSizeContextValue(props.defaultValue, props.divRef);
    return <SizeContext.Provider value={ctxValue} children={props.children}/>;
}

// 内部包裹一层div作为容器， 以此来计算size
function DivSizeProvider(props: SizeProviderProps) {
    const divRef = useRef<HTMLDivElement | null>(null);
    const ctxValue = useSizeContextValue(props.defaultValue, divRef);
    return (
        <SizeContext.Provider value={ctxValue}>
            <div style={sizeDivStyle} ref={divRef}>{props.children}</div>
        </SizeContext.Provider>
    )
}
const sizeDivStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
}

function useSizeContextValue(defaultValue = DEFAULT_VALUE, divRef?: React.RefObject<HTMLElement | null>) {
    const [ctxValue, setCtxValue] = useState<ISizeContext>(defaultValue);
    const sizeContext = useSizeContext();
    useLayoutEffect(() => {
        // 刷新ctx的值
        const refreshCtxValue = () => {
            const el: HTMLElement = divRef?.current || document.body;
            setCtxValue({
                width: el.clientWidth || 0,
                height: el.clientHeight || 0,
                isDefault: false,
            });
        }
        // 如果更上层也有SizeProvider， 则跟随更上层的SizeProvider同步刷新size
        if (sizeContext) {
            refreshCtxValue();
            return undefined;
        }
        // 如果更上层没有SizeProvider， 那么就监听window的resize事件，选择合适的机会进行更新
        let timeout: NodeJS.Timeout | undefined;
        const handler = () => {
            if (timeout !== undefined) clearTimeout(timeout);
            timeout = setTimeout(() => {
                refreshCtxValue();
                timeout = undefined;
            }, 300);
        }
        refreshCtxValue();
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [sizeContext]);
    return ctxValue;
}
