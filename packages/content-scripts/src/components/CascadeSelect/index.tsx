import React, {useEffect, useMemo, useRef} from "react";
import {Popover} from "@douyinfe/semi-ui";
import {CascadeSelectList, CascadeSelectListProps} from "./CascadeSelectList";
import {GroupSelectItem, ISelectItem, isGroupSelectItem, SingleSelectItem} from "./type";

export * from './type';

export interface CascadeSelectProps extends CascadeSelectListProps {
    searchKey?: string
    // 弹出层可见控制
    visible?: boolean;
    children?: React.ReactNode;
}

export function CascadeSelect(props: CascadeSelectProps) {
    const divRef = useRef<HTMLDivElement | null>(null);

    const groupItem = useMemo(
        () => getSearchGroup(props.groupItem, props.searchKey || ''),
        [props.groupItem, props.searchKey],
    )
    const groupRef = useRef(groupItem);
    groupRef.current = groupItem;
    useEffect(() => {
        let activeElement = document.activeElement;
        let mark: boolean = false;
        const keydown = (e: KeyboardEvent) => {
            if (e.key === 'Control' && !mark && groupRef.current?.childItem.length) {
                mark = true;
                activeElement = document.activeElement;
                (divRef?.current?.firstChild as HTMLUListElement)?.focus();
            }
        }
        const keyup = (e: KeyboardEvent) => {
            if (e.key === 'Control' && mark && groupRef.current?.childItem.length) {
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
    if (!groupItem?.childItem.length) return props.children;
    return (
        <Popover
            spacing={12}
            trigger={'custom'}
            visible={props.visible ?? true}
            position={'topLeft'}
            content={
                <CascadeSelectList
                    groupItem={groupItem}
                    autoFocus={props.autoFocus}
                    onSelected={props.onSelected}
                    onChange={props.onChange}
                    divRef={divRef}
                />
            }>
            {props.children}
        </Popover>
    )
}

function getSearchGroup(groupItem: GroupSelectItem | undefined, filterKey: string) {
    if (!groupItem || !filterKey) return groupItem;
    const array: SingleSelectItem[] = [];
    const deep = (item: ISelectItem, labelArray: React.ReactNode[]) => {
        if (filter(item.searchKey, filterKey)) {
            array.push({
                ...item,
                childItem: undefined,
                label: <>{[...labelArray, item.label]}</>
            })
        }
        if (isGroupSelectItem(item)) {
            for (const childItemElement of item.childItem) {
                deep(childItemElement, [...labelArray, item.label, ' / '])
            }
        }
    }
    for (const childItemElement of groupItem.childItem) {
        deep(childItemElement, [])
    }
    return {...groupItem, childItem: array };
}

function filter(current: string[] | ((value: string) => boolean) | undefined, target: string): boolean {
    if (!current) return true;
    if (typeof current === 'function') return current(target);
    const upperKey = target.toUpperCase();
    for (const s of current) {
        if (s.toUpperCase().includes(upperKey)) {
            return true;
        }
    }
    return false;
}
