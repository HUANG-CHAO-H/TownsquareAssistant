import React from "react";
import {Tag} from "@douyinfe/semi-ui";
import {translateRoleTeam} from '@/models';
import {GameRoleInfo} from "../../../models";

// 获取角色所对应的tag标签
export const getRoleTag = (team: GameRoleInfo['team']) => (
    <Tag color={translateRoleTeam(team, 'color')}>{translateRoleTeam(team, 'CN')}</Tag>
)
