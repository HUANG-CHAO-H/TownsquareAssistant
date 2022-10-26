import React from "react";
import {Avatar, Badge, Card, Tag, Descriptions} from "@douyinfe/semi-ui";
import {ReactHTMLAttributes} from "../utils";
import {AvatarCard} from "./AvatarCard";

interface PlayerAvatarProps {
    playerInfo: GamePlayerInfo
    // 尺寸，大小
    size?: 'small' | 'medium' | 'large'
    // 是否展示名称
    showName?: boolean
    // 是否展示详情页卡片（默认展示）
    showDetailCard?: boolean
    // 给外层容器传递的额外属性
    divContainerAttr?: ReactHTMLAttributes<HTMLDivElement>
}
export const PlayerAvatar = React.memo<PlayerAvatarProps>(props => {
    const {
        playerInfo,
        size = 'small',
        showName = true,
        showDetailCard = true,
        divContainerAttr,
    } = props;
    // 生成头像内容
    let playAvatar = <Avatar size={size} src={playerInfo.avatarUrl}/>;
    if (playerInfo.countUnread) {
        playAvatar = <Badge count={playerInfo.countUnread} type={'primary'}>{playAvatar}</Badge>
    } else if (playerInfo.isDead) {
        playAvatar = <Badge count={'死'} type={'danger'}>{playAvatar}</Badge>
    }
    // 生成label内容
    const playerName = showName ? (
        <div style={{fontSize: size, paddingLeft: '5px'}}>
            <span style={playerInfo.isDead ? deadStyle : undefined}>{playerInfo.name}</span>
        </div>
    ) : null;
    return (
        <AvatarCard
            avatar={playAvatar}
            label={playerName}
            divContainerAttr={divContainerAttr}
            popover={showDetailCard ? <PlayerDetailCard player={playerInfo}/> : null}
        />
    )
})

const deadStyle: React.CSSProperties = {
    // 中划线
    textDecoration: "line-through",
    // 灰色字体
    color: 'gray'
}

const PlayerDetailCard = React.memo<{player: GamePlayerInfo}>(props => {
    const playerInfo = props.player;
    const descriptionData = [
        { key: '用户ID', value: playerInfo.id },
        { key: 'username', value: playerInfo.name },
        { key: '自定义别称', value: playerInfo.pronouns },
        { key: '存活状态', value: playerInfo.isDead ? '死亡' : '存活'},
        { key: '是否有投票权', value: playerInfo.isVoteless ? '无' : '有'},
        {
            key: '自定义标记',
            value: playerInfo.reminders.map(
                value => (<Tag style={{marginRight: 5, marginBottom: 5}} color={'blue'}>{value.name}</Tag>)
            )},
    ]
    return (
        <Card
            bordered={false}
            headerLine={true}
            style={{ width: 250 }}
            headerStyle={{padding: '10px 20px'}}
            title={
                <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: 'center'}}>
                    <span style={{color: 'black', fontSize: 'x-large', fontWeight: '400'}}>{playerInfo.name}</span>
                    <Avatar size={'small'} src={playerInfo.avatarUrl}/>
                </div>
            }
        >
            <Descriptions data={descriptionData} />
        </Card>
    )
})