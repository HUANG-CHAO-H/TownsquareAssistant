import React, {useEffect, useState} from "react";
import {useCacheRef, useMap, useRefCallback} from "../../../../utils";
import {ListItemRender} from "./SelectItem";
import {GroupSelectItem} from "./type";
import type {ISelectItem} from "./type";
import Style from './style.module.less';

export interface SelectListProps {
    groupItem: GroupSelectItem;
    // 当有元素被选中时
    onSelected?: (value: ISelectItem | undefined) => void;
    // 对ul元素的引用
    ulRef?: React.LegacyRef<HTMLUListElement>
}

export function SelectList(props: SelectListProps) {
    const { groupItem } = props;
    const [selectIndex, setSelectIndex] = useState<number>(0);
    const [focus, setFocus] = useState(false);
    const cacheRef = useCacheRef({
        onSelected: props.onSelected,
        $setNextGroupItem: groupItem.$setNextGroupItem,
        groupItem,
        // 键盘事件处理
        onKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
            const itemLength = groupItem.childItem.length;
            if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
                if (selectIndex === -1) return setSelectIndex(0);
                return setSelectIndex(v => (v + 1) % itemLength);
            } else if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
                if (selectIndex === -1) return setSelectIndex(itemLength - 1);
                return setSelectIndex(v => (v + itemLength - 1) % itemLength);
            }
        }
    });
    const $setNextGroupItem = useRefCallback(cacheRef, '$setNextGroupItem');

    const children = useMap(groupItem.childItem, (item, index) => (
            <ListItemRender
                key={groupItem.itemKey + item.itemKey}
                {...item}
                $selected={selectIndex === index}
                $setSelected={() => setSelectIndex(index)}
                $setNextGroupItem={$setNextGroupItem}
                $getParentItem={() => cacheRef.current.groupItem}
            />
        ),
        [groupItem.childItem, selectIndex],
    );
    // selectIndex的变更触发相关事件回调
    useEffect(() => {
        if (!focus) return;
        const selectedItem =
            selectIndex >= 0 && selectIndex < groupItem.childItem.length
                ? groupItem.childItem[selectIndex]
                : undefined;
        props.onSelected?.(selectedItem);
    }, [selectIndex, focus]);
    return (
        <ul tabIndex={-1} className={Style.selectList} ref={props.ulRef}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyDown={cacheRef.current.onKeyDown}>
            {children}
        </ul>
    );
}
