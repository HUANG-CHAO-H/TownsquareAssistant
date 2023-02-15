import React, {useRef, useState, useLayoutEffect, useEffect} from "react";
import {useCacheRef, useMap} from "../../../../utils";
import {SelectBody} from "./SelectBody";
import {SelectItem} from "./type";
import Style from './style.module.less';

export interface CascadeSelectBody {
    items: SelectItem[];
    // 是否自动获得焦点
    autoFocus?: boolean;
    // 当完成选中时
    onChange?: (value: (SelectItem | undefined)[], items: SelectItem[]) => void;
    // 外层容器的引用
    divRef?: React.LegacyRef<HTMLDivElement>
}

export function CascadeSelectBody(props: CascadeSelectBody) {
    const [selectedBodyIndex, setSelectedBodyIndex] = useState<number>(props.autoFocus ? 0 : -1);
    const [selectBody, setSelectBody] = useState<SelectItem[][]>([]);
    const [selectedArray, setSelectedArray] = useState<(SelectItem | undefined)[]>([undefined]);
    const ulArray = useRef<(HTMLUListElement | null)[]>([]);
    const cacheRef = useCacheRef({
        onSelected(item: SelectItem | undefined, index: number) {
            const newSelectBody = selectBody.slice(0, index + 1);
            const newSelectedArray = selectedArray.slice(0, index + 1);
            newSelectedArray[index] = item;
            if (item?.itemType === 'group') {
                newSelectBody.push(item.childItem);
            }
            setSelectBody(newSelectBody);
            setSelectedArray(newSelectedArray);
            if (item) setSelectedBodyIndex(index);
        },
        // 键盘事件处理
        onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
            if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
                if (selectedBodyIndex <= 0) return;
                setSelectedBodyIndex(selectedBodyIndex - 1);
            } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
                if (selectedBodyIndex < 0) return;
                const currentItem = selectedArray[selectedBodyIndex];
                if (currentItem && currentItem.itemType === 'group') {
                    if (currentItem.childItem === selectBody[selectedBodyIndex]) return;
                    const newArray = selectBody.slice(0, selectedBodyIndex + 1);
                    newArray.push(currentItem.childItem);
                    setSelectBody(newArray);
                    setSelectedBodyIndex(selectedBodyIndex + 1);
                }
            } else if (e.key === 'Enter' || e.code === 'Enter') {
                cacheRef.current.onChange();
            }
        },
        // 完成选择后，触发上层的onChange
        onChange: () => props.onChange?.(selectedArray, props.items),
    });
    useEffect(() => setSelectBody([props.items]), [props.items]);
    useLayoutEffect(() => {
        if (selectedBodyIndex === -1 || !ulArray.current[selectedBodyIndex]) return;
        ulArray.current[selectedBodyIndex]?.focus();
    }, [selectedBodyIndex]);
    const children = useMap(selectBody, (value, index) => (
        <SelectBody
            key={index}
            items={value}
            ulRef={v => ulArray.current[index] = v}
            onSelected={value => cacheRef.current.onSelected(value, index)}
        />
    ), [selectBody]);
    return (
        <div className={Style.cascadeSelectBody}
             onDoubleClick={cacheRef.current.onChange}
             onKeyDown={cacheRef.current.onKeyDown} ref={props.divRef}>
            {children}
        </div>
    )
}
