import React, {useRef, useState, useLayoutEffect, useEffect} from "react";
import {useCacheRef, useMap} from "../../../../utils";
import {SelectList} from "./SelectList";
import {GroupSelectItem, ISelectItem} from "./type";
import Style from './style.module.less';

export interface CascadeSelectListProps {
    groupItem?: GroupSelectItem;
    // 是否自动获得焦点
    autoFocus?: boolean;
    // 当选中的节点发生变化时调用
    onChange?: (value: ISelectItem | undefined) => void;
    // 节点选中事件
    onSelected?: (value: ISelectItem | undefined) => void;
    // 外层容器的引用
    divRef?: React.LegacyRef<HTMLDivElement>
}

export function CascadeSelectList(props: CascadeSelectListProps) {
    // 当前焦点在哪个group上
    const [focusIndex, setFocusIndex] = useState<number>(props.autoFocus ? 0 : -1);
    // 当前被渲染的所有group列表
    const [groupArray, setGroupArray] = useState<GroupSelectItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ISelectItem | undefined>(undefined);
    const ulArray = useRef<(HTMLUListElement | null)[]>([]);
    const cacheRef = useCacheRef({
        // 键盘事件处理
        onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
            if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
                if (focusIndex < 0) return void setFocusIndex(groupArray.length - 1);
                if (focusIndex === 0) return;
                setFocusIndex(focusIndex - 1);
            } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
                if (focusIndex < 0) setFocusIndex(groupArray.length > 0 ? 0 : -1);
                if (focusIndex >= groupArray.length - 1) return;
                setFocusIndex(focusIndex + 1);
            } else if (e.key === 'Enter' || e.code === 'Enter') {
                props.onSelected?.(selectedItem);
            }
        },
        // 完成选择后，触发上层的onChange
        onChange: (value: ISelectItem | undefined) => props.onChange?.(value),
    });
    useEffect(() => props.groupItem ? setGroupArray([props.groupItem]) : undefined, [props.groupItem]);
    useEffect(() => props.onChange?.(selectedItem), [selectedItem]);
    useLayoutEffect(() => {
        if (focusIndex === -1 || !ulArray.current[focusIndex]) return;
        ulArray.current[focusIndex]?.focus();
    }, [focusIndex]);
    const children = useMap(groupArray, (value, index) => (
        <SelectList
            key={(props.groupItem?.itemKey || '') + index}
            ulRef={v => ulArray.current[index] = v}
            onSelected={value => {
                setSelectedItem(value);
                setFocusIndex(index);
                cacheRef.current.onChange(value);
            }}
            groupItem={{
                ...value,
                $setNextGroupItem: g => setGroupArray(oldV => {
                    const newValue = oldV.slice(0, index + 1);
                    if (g) newValue.push(g);
                    return newValue;
                })
            }}
        />
    ), [groupArray]);
    return (
        <div className={Style.cascadeSelectList}
             onDoubleClick={() => props.onSelected?.(selectedItem)}
             onKeyDown={cacheRef.current.onKeyDown} ref={props.divRef}>
            {children}
        </div>
    )
}
