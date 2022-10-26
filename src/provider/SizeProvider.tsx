import React, {useContext, useEffect, useRef, useState} from "react";

interface ISizeContext {
    width: number
    height: number
}
const defaultValue: ISizeContext = {width: 0, height: 0};
const SizeContext = React.createContext<ISizeContext>(defaultValue);

export function useSizeContext() {
    return useContext(SizeContext);
}

export function SizeProvider(props: {children?: React.ReactNode}) {
    const divRef = useRef<HTMLDivElement| null>(null);
    const [ctxValue, setCtxValue] = useState<ISizeContext>(defaultValue);
    const [refresh, setRefresh] = useState<number>(0);
    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;
        const handler = () => {
            if (timeout !== undefined) return;
            timeout = setTimeout(() => {
                setRefresh(v => ++v);
                timeout = undefined;
            }, 300);
        }
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [])
    useEffect(() => {
        const div =divRef.current;
        if (!div) return setRefresh(v => ++v);
        setCtxValue({
            width: div.clientWidth || 0,
            height: div.clientHeight || 0,
        })
    }, [divRef.current, refresh])

    return (
        <SizeContext.Provider value={ctxValue}>
            <div style={sizeDivStyle} ref={divRef}>
                { ctxValue === defaultValue ? null : props.children }
            </div>
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