import React, {useMemo, useState} from "react";
import {Popover} from "@douyinfe/semi-ui";
import {useCacheRef, useRefCallback} from "../../../utils";

// TODO 实验性开发，功能待补充完善

export interface CascadeSelectProps {
    listItem: ICascadeSelectItem[];
    children?: React.ReactNode;
}

export function CascadeSelect(props: CascadeSelectProps) {
    const [selectIndex, setSelectIndex] = useState<number[]>([]);
    return <Popover visible={true} content={'hello world'}>{props.children}</Popover>
}


export interface ICascadeSelectItem {
    itemKey: string;
    itemValue: string;
    itemLabel: string;
    child?: ICascadeSelectItem[];
}

interface CascadeSelectBodyProps {
    selectIndex: number[];
    setSelectIndex: (value: number[]) => void;
    focus: boolean;
    setFocus: (value: boolean) => void;
    listItem: ICascadeSelectItem[];
}

function CascadeSelectBody(props: CascadeSelectBodyProps) {
    const { selectIndex, focus, listItem } = props;
    // 当前选择器的index
    const currentIndex = props.selectIndex[0];
    // 可能存在的下一级选择器的焦点状态
    const [childFocus, setChildFocus] = useState(!props.focus);
    // 可能存在的下一级选择器的index选择
    const childIndex = useMemo(() => selectIndex.length > 1 ? selectIndex.splice(1) : undefined, [selectIndex]);
    const cacheRef = useCacheRef({
       setCurrentIndex(value: number) {
           if (selectIndex[0] === value) return;
           const newArr = [...selectIndex];
           newArr[0] = value;
           props.setSelectIndex(newArr);
       },
        setChildIndex(value: number[]) {
            props.setSelectIndex([currentIndex, ...value]);
        }
    });
    const setChildIndex = useRefCallback(cacheRef, 'setChildIndex');
    const currentBody = useMemo(
        () => listItem.map(
            (item, index) => (
                <div key={item.itemKey} style={currentIndex === index ? selectStyle : undefined}>{item.itemLabel}</div>
            )
        ),
        [listItem, childIndex],
    );
    const nextCascadeSelect = useMemo(() => {
        if (childIndex === undefined) return null;
        const child = listItem[currentIndex].child;
        if (!child) return null;
        return (
            <CascadeSelectBody
                selectIndex={childIndex}
                setSelectIndex={setChildIndex}
                focus={childFocus}
                setFocus={setChildFocus}
                listItem={child}
            />
        )
    }, [currentIndex, listItem, childFocus]);
    return (
        <div style={bodyStyle}>
            <div tabIndex={focus ? 0 : undefined}>{currentBody}</div>
            {nextCascadeSelect}
        </div>
    )
}

const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
}

const selectStyle: React.CSSProperties = {
    color: 'red',
}
