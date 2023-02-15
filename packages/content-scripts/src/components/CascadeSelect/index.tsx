import React, {useEffect, useRef} from "react";
import {Popover} from "@douyinfe/semi-ui";
import {CascadeSelectBody} from "./CascadeSelectBody";
import {SelectItem} from "./type";

export * from './type';

export interface CascadeSelectProps {
    listItem?: SelectItem[];
    // 弹出层可见控制
    visible?: boolean;
    // 当完成选中时
    onChange?: (value: (SelectItem | undefined)[], items: SelectItem[]) => void;
    children?: React.ReactNode;
}

const emptyArray = [];
export function CascadeSelect(props: CascadeSelectProps) {
    const divRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        let activeElement = document.activeElement;
        let mark: boolean = false;
        const keydown = (e: KeyboardEvent) => {
            if (e.key === 'Control' && !mark) {
                mark = true;
                activeElement = document.activeElement;
                (divRef?.current?.firstChild as HTMLUListElement)?.focus();
            }
        }
        const keyup = (e: KeyboardEvent) => {
            if (e.key === 'Control' && mark) {
                mark = false;
                (activeElement as HTMLUListElement)?.focus();
            }
        }
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        return () => {
            window.removeEventListener('keydown', keydown);
            window.removeEventListener('keyup', keyup);
        }
    }, []);
    return (
        <Popover spacing={12} trigger={'custom'} visible={props.visible ?? true} position={'topLeft'} content={
            <CascadeSelectBody divRef={divRef} onChange={props.onChange} items={props.listItem ?? emptyArray}/>
        }>
            {props.children}
        </Popover>
    )
}
