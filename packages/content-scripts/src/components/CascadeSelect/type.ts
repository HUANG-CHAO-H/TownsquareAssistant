import React from "react";
import type {} from '@/models';

export interface BaseSelectItem<T = unknown> {
    itemKey: string;
    itemType: 'group' | 'single';
    label: React.ReactNode;
    value: string;
    searchKey?: string[] | ((value: string) => boolean);
    payload?: T;
}

export interface GroupSelectItem<T = unknown> extends BaseSelectItem<T> {
    itemType: 'group';
    childItem: SelectItem[];
}

export interface SingleSelectItem<T = unknown> extends BaseSelectItem<T> {
    itemType: 'single';
}

export type SelectItem = GroupSelectItem | SingleSelectItem;
