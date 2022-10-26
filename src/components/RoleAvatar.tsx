import React from "react";
import {Avatar, Tag, Card, Descriptions} from "@douyinfe/semi-ui";
import type {TagColor} from "@douyinfe/semi-ui/tag/interface";
import {getIconUrl, translateRoleTeam} from "../script";
import {ReactHTMLAttributes} from "../utils";
import {AvatarCard} from "./AvatarCard";

interface RoleAvatarProps {
    // 角色信息
    roleInfo: GameRoleInfo
    // 尺寸，大小
    size?: 'small' | 'medium' | 'large'
    // 是否展示名称
    showName?: boolean
    // 是否展示详情页卡片（默认展示）
    showDetailCard?: boolean
    // 给外层容器传递的额外属性
    divContainerAttr?: ReactHTMLAttributes<HTMLDivElement>
}

export const RoleAvatar = React.memo<RoleAvatarProps>(props => {
    const {
        roleInfo,
        size,
        showName = true,
        showDetailCard = true,
        divContainerAttr,
    } = props;
    const roleName = showName ? <div style={{fontSize: size, paddingLeft: '5px'}}>{roleInfo.name}</div> : null;
    return (
        <AvatarCard
            avatar={<Avatar size={size} src={getIconUrl(roleInfo.id)}/>}
            label={roleName}
            divContainerAttr={divContainerAttr}
            popover={showDetailCard ? <RoleDetailCard role={roleInfo}/> : null}
        />
    )
})

const RoleDetailCard = React.memo<{role: GameRoleInfo}>(props => {
    const roleInfo = props.role;
    const descriptionData = [
        { key: '角色ID', value: roleInfo.id },
        { key: '角色名称', value: roleInfo.name },
        { key: '角色类型', value: <Tag color={getRoleTeamColor(roleInfo.team)}>{translateRoleTeam(roleInfo.team, 'CN')}</Tag> },
        { key: '角色能力', value: roleInfo.ability },
        { key: '首夜技能', value: roleInfo.firstNightReminder },
        { key: '非首夜技能', value: roleInfo.otherNightReminder},
    ]
    return (
        <Card
            bordered={false}
            headerLine={true}
            style={{ width: 300 }}
            headerStyle={{padding: '10px 20px'}}
            title={
                <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: 'center'}}>
                    <span style={{color: 'black', fontSize: 'x-large', fontWeight: '400'}}>{roleInfo.name}</span>
                    <Avatar size={'small'} src={getIconUrl(roleInfo.id)}/>
                </div>
            }
        >
            <Descriptions data={descriptionData} />
        </Card>
    )
})

function getRoleTeamColor(team: GameRoleInfo['team']): TagColor {
    switch (translateRoleTeam(team, 'number')) {
        case 0: return 'blue';
        case 1: return 'light-blue';
        case 2: return 'orange';
        case 3: return 'red';
        case 4: return 'green';
        default: return 'grey';
    }
}