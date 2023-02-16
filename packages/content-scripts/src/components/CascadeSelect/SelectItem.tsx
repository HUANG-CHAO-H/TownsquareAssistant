import React, {useEffect, useMemo, createElement, useRef, useLayoutEffect} from "react";
import {GroupSelectItem, ISelectItem, isGroupSelectItem, SingleSelectItem} from './type';
import Style from './style.module.less';

export function ListItemRender(props: ISelectItem) {
    if (isGroupSelectItem(props)) return createElement(GroupItemRender, props);
    else return createElement(SingleItemRender, props);
}

export function GroupItemRender(props: GroupSelectItem) {
    const ref = useFocusView(props.$selected);
    useEffect(() => void (props.$selected && props.$setNextGroupItem?.(props)), [props.$selected]);
    return (
        <li className={Style.selectItem} ref={ref}
            data-selected={Boolean(props.$selected)}
            onClick={() => props.$setSelected?.(true)}>
            {props.label}
        </li>
    )
}

export function SingleItemRender(props: SingleSelectItem) {
    const ref = useFocusView(props.$selected);
    useEffect(() => void (props.$selected && props.$setNextGroupItem?.(undefined)), [props.$selected]);
    return (
        <li className={Style.selectItem} ref={ref}
            data-selected={Boolean(props.$selected)}
            onClick={() => props.$setSelected?.(true)}>
            {props.label}
        </li>
    );
}

export function useFocusView(selected?: boolean) {
    const ref = useRef<HTMLLIElement | null>(null);
    useLayoutEffect(() => {
        if (!ref.current || !selected) return;
        const item = ref.current!;
        const container: HTMLElement = item.offsetParent as any;
        if (!container) return;
        const offsetLeft = item.offsetLeft + item.clientWidth / 2;
        const offsetTop = item.offsetTop + item.clientHeight / 2;
        const halfWidth = container.clientWidth / 2;
        const halfHeight = container.clientHeight / 2;
        const left = halfWidth >= offsetLeft ? 0 : offsetLeft - halfWidth;
        const top = halfHeight >= offsetTop ? 0 : offsetTop - halfHeight;
        container.scrollTo({ left, top, behavior: 'smooth' });
    }, [selected]);
    return ref;
}
