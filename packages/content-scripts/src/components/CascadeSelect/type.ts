import React from "react";
import type {} from '@/models';

export interface InsideItemProps {
    // 设置下一个list列表
    $setNextGroupItem?: (group: GroupSelectItem | undefined) => void;
    // 该元素是否被选中
    $selected?: boolean;
    // 设置自身被选中了
    $setSelected?: (value: boolean) => void;
    // 是否显示item所在的完整路径
    $showPath?: boolean;
    // 获取父节点
    $getParentItem?: () => ISelectItem | undefined;
}

export interface BaseSelectItem extends InsideItemProps {
    // 该item的唯一标识
    itemKey: string;
    // 该item所显示的label
    label: React.ReactNode;
    // 该item的value
    value: string;
    // 该item的子节点
    childItem?: ISelectItem[];
    // 用于匹配搜索的关键字
    searchKey?: string[] | ((value: string) => boolean);
}

export interface GroupSelectItem extends BaseSelectItem {
    childItem: ISelectItem[];
    [key: string | symbol]: unknown;
}

export interface SingleSelectItem extends BaseSelectItem {
    childItem?: undefined;
    [key: string | symbol]: unknown;
}

export type ISelectItem = GroupSelectItem | SingleSelectItem;

export function isGroupSelectItem(value: ISelectItem): value is GroupSelectItem {
    return value.childItem instanceof Array;
}
export function isSingleSelectItem(value: ISelectItem): value is SingleSelectItem {
    return !isGroupSelectItem(value);
}
