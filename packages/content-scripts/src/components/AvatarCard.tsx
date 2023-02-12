import {Popover} from "@douyinfe/semi-ui";
import React, {CSSProperties} from "react";
import {ReactHTMLAttributes, TypeCheck} from "@/utils";

interface AvatarCardProps {
    // 头像部分
    avatar: React.ReactNode
    // hover头像后渲染悬浮卡片
    popover?: React.ReactNode
    // 右侧的显示名称
    label?: React.ReactNode
    // 给外层容器传递的额外属性
    divContainerAttr?: ReactHTMLAttributes<HTMLDivElement>
}

export function AvatarCard(props: AvatarCardProps) {
    const {
        avatar, popover, label,
        divContainerAttr = {} as ReactHTMLAttributes<HTMLDivElement>,
    } = props;
    divContainerAttr.style = Object.assign(
        divContainerAttr.style || {},
        TypeCheck<CSSProperties>({
            display: 'flex',
            alignItems: 'center',
        })
    )
    const labelWrap = label ? <div style={{paddingLeft: '5px'}}>{label}</div> : null;
    if (popover) {
        return (
            <div {...divContainerAttr}>
                <Popover position={'bottomLeft'} content={popover} mouseEnterDelay={500}>{avatar}</Popover>
                {labelWrap}
            </div>
        )
    } else {
        return (
            <div {...divContainerAttr}>
                {avatar}{labelWrap}
            </div>
        )
    }
}
