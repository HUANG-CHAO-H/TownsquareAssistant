import React, {useMemo} from "react";
import {Avatar, Button, Table, Tooltip} from "@douyinfe/semi-ui";
import {IconComment} from "@douyinfe/semi-icons";

import {useGameState} from "../provider/GameStateProvider";
import {PlayerAvatar} from "../components/PlayerAvatar";
import {RoleAvatar} from "../components/RoleAvatar";
import { clickPlayerMenu } from "../script";
import {ReminderAvatar} from "../components/ReminderAvatar";
import {useRoleState} from "../provider/GameRoleProvider";

const divStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    overflow: 'auto'
}

interface ITableRowData {
    player: GamePlayerInfo;
    role: GameRoleInfo | undefined;
}

export function PlayerInfo() {
    const { gameState } = useGameState() || {};
    const roleState = useRoleState();

    const tableData = useMemo<ITableRowData[]>(() => {
        const playerData = gameState?.players || [];
        const roleData = roleState?.currentRoles || {};
        console.info(playerData, roleData);
        return playerData.map(player => ({player, role: roleData[player.role]}));
    }, [gameState?.players, roleState?.currentRoles])

    return (
        <div style={divStyle}>
            <Table bordered={true} columns={tableColumns} dataSource={tableData} pagination={false} />
        </div>
    );
}

// import type {ColumnProps} from "@douyinfe/semi-ui/table/interface";
// const tableColumns: ColumnProps<GamePlayerInfo>[] = [
const tableColumns: any[] = [
    {
        title: '座位号',
        dataIndex: 'seatIndex',
        width: 50,
        align: 'center',
        render(text: string, record: GamePlayerInfo, index: number) {
            return String(index + 1)
        }
    },
    {
        title: '玩家',
        dataIndex: 'name',
        width: 150,
        render(text: string, record: ITableRowData) {
            return <PlayerAvatar playerInfo={record.player} size='small'/>
        }
    },
    {
        title: '角色',
        width: 150,
        render(text: string, record: ITableRowData) {
            const role = record.role;
            if (!role) return null;
            return <RoleAvatar roleInfo={role}/>
        }
    },
    {
        title: '首夜',
        width: 50,
        align: 'center',
        render(text: string, record: ITableRowData) {
            const role = record.role;
            if (role?.firstNight) {
                return <Tooltip content={role.firstNightReminder || ''}>
                    <Avatar size="small" color="red" shape="square" alt="0">{role.firstNight}</Avatar>
                </Tooltip>
            }
            return null;
        }
    },
    {
        title: '非首夜',
        width: 50,
        align: 'center',
        render(text: string, record: ITableRowData) {
            const role = record.role;
            if (role?.otherNight) {
                return <Tooltip content={role.otherNightReminder || ''}>
                    <Avatar size="small" color="green" shape="square" alt="0">{role.otherNight}</Avatar>
                </Tooltip>
            }
            return null;
        }
    },
    {
        title: '自定义标记',
        width: 200,
        align: 'center',
        render(text: string, record: ITableRowData) {
            const reminders = record.player.reminders;
            if (!reminders?.length) return null;
            return (<>{
                reminders.map(reminder => {
                    if (reminder.role === 'custom') {
                        return (
                            <Tooltip content={reminder.name}>
                                <Avatar size="small" color="green" alt="0">{reminder.name}</Avatar>
                            </Tooltip>
                        )
                    } else {
                        console.log('reminder =', reminder);
                        return <ReminderAvatar roleId={reminder.role} name={reminder.name}/>
                    }
                })
            }</>)
        }
    },
    {
        title: '操作',
        width: 100,
        align: 'center',
        render(text: string, record: ITableRowData, index: number) {
            return (
                <Button
                    icon={<IconComment style={{color:'#1abc9c'}}/>}
                    onClick={() => clickPlayerMenu(index + 1, '私聊')}
                />
            )
        }
    },
]
