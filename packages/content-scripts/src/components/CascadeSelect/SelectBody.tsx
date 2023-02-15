import React, {useEffect, useState} from "react";
import {useCacheRef, useMap} from "../../../../utils";
import {SelectItem} from "./type";
import Style from './style.module.less';

export interface SelectBodyProps {
    items: SelectItem[];
    // 是否自动获得焦点
    autoFocus?: boolean;
    // 当有元素被选中时
    onSelected?: (value: SelectItem | undefined, items: SelectItem[]) => void;
    // 对ul元素的引用
    ulRef?: React.LegacyRef<HTMLUListElement>
}

export function SelectBody(props: SelectBodyProps) {
    const [selectIndex, setSelectIndex] = useState<number>(props.autoFocus ? 0 : -1);
    const children = useMap(props.items, (item, index) => (
            <li data-selected={selectIndex === index} key={item.itemKey} onClick={() => setSelectIndex(index)}>
                {item.label}
            </li>
        ),
        [props.items, selectIndex],
    );
    // selectIndex的变更触发相关事件回调
    useEffect(() => {
        const selectedItem = selectIndex >= 0 && selectIndex < props.items.length ? props.items[selectIndex] : undefined;
        props.onSelected?.(selectedItem, props.items);
    }, [selectIndex]);
    const cacheRef = useCacheRef({
        onSelected: props.onSelected,
        // 键盘事件处理
        onKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
            const itemLength = props.items.length;
            if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
                if (selectIndex === -1) return setSelectIndex(0);
                return setSelectIndex(v => (v + 1) % itemLength);
            } else if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
                if (selectIndex === -1) return setSelectIndex(itemLength - 1);
                return setSelectIndex(v => (v + itemLength - 1) % itemLength);
            }
        }
    });
    return (
        <ul tabIndex={-1} className={Style.selectBodyUl} ref={props.ulRef}
            onFocus={() => setSelectIndex(v => v < 0 ? 0 : v)}
            onKeyDown={cacheRef.current.onKeyDown}>
            {children}
        </ul>
    );
}
