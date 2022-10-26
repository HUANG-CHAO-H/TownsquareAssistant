import {Avatar, Tooltip} from "@douyinfe/semi-ui";
import React from "react";
import {getIconUrl} from "../script";

interface ReminderAvatarProps {
    roleId: string
    name: string
    size?: "small" | "large"
    style?: React.CSSProperties
}

export function ReminderAvatar(props: ReminderAvatarProps) {
    const {roleId, name, size, style} = props;
    const url = getIconUrl(roleId);
    return <Tooltip content={name}><Avatar size={size} src={url} style={style}></Avatar></Tooltip>
}