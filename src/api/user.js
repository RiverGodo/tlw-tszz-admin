'use strict';

import api from './config'

//获取后台用户列表
export function getToolUserList(params) {
    let payload = {
        role_arr: params.role_arr
    }
    return api.post('tool_user/getToolUserList', payload)
}

//重设密码
export function resetPassword(params) {
    let payload = {
        old_pwd: params.old_pwd,
        password: params.password
    }
    return api.post('tool_user/resetPassword', payload)
}

//修改指定用户密码
export function setToolUserPassword(params) {
    let payload = {
        user_id: params.user_id,
        password: params.password
    }
    return api.post('tool_user/setToolUserPassword', payload)
}

//设置后台用户权限

export function setToolUserRole(params) {
    let payload = {
        user_id: params.user_id,
        role_arr: params.role_arr
    }
    return api.post('tool_user/setToolUserRole', payload)
}

//添加后台用户

export function addToolUser(params) {
    let payload = {
        username: params.username,
        realname: params.realname,
        password: params.password,
        role_arr: params.role_arr
    }
    return api.post('tool_user/addToolUser', payload)
}

//设置用户信息
export function updateToolUserInfo(params) {
    let payload = {
        user_id: params.user_id,
        username: params.username,
        realname: params.realname
    }
    return api.post('tool_user/updateToolUserInfo', payload)
}

//删除后台用户
export function deleteToolUser(params) {
    let payload = {
        user_id: params
    }
    return api.post('tool_user/deleteToolUser', payload)
}

//获取基础用户信息列表 
export function getBaseUserList(params) {
    let payload = {
        page_index: params.page_index - 1,
        page_size: params.page_size,
        nickname: params.nickname,
        phone: params.phone,
        user_id: params.user_id,
    }
    params.start_time && (payload = { ...payload,
        ...{
            start_time: params.start_time,
            end_time: params.end_time
        }
    })
    return api.post('tool_user/getBaseUserList', payload)
}

//获取图书增值用户信息列表 
export function getBoobExUserList(params) {
    let payload = {
        page_index: params.page_index - 1,
        page_size: params.page_size,
        nickname: params.nickname,
        phone: params.phone,
        user_id: params.user_id,
    }
    params.start_time && (payload = { ...payload,
        ...{
            start_time: params.start_time,
            end_time: params.end_time
        }
    })
    return api.post('tool_user/getBoobExUserList', payload)
}

//获取每日英语用户信息列表

export function getEveryDayEngUserList(params) {
    let payload = {
        page_index: params.page_index - 1,
        page_size: params.page_size,
        nickname: params.nickname,
        phone: params.phone,
        user_id: params.user_id,
    }
    params.start_time && (payload = { ...payload,
        ...{
            start_time: params.start_time,
            end_time: params.end_time
        }
    })
    return api.post('tool_user/getEveryDayEngUserList', payload)
}

//设置后台用户状态
export function setUserState(params) {
    let payload = {
        user_id: params.user_id,
    }
    return api.post('tool_user/setUserState', payload)
}

//获取兑换用户列表
export function getExchangedUserList(params) {
    let payload = {
        page_index: params.page_index - 1,
        page_size: params.page_size,
        user_id: params.user_id,
        nickname: params.nickname,
        start_time: params.start_time,
        end_time: params.end_time
    }
    return api.post('tool_user/getExchangedUserList', payload);
}

//获取兑换用户详情
export function getExchangeUserDetail(params) {
    let payload = {
        user_id: params.user_id
    }
    return api.post('tool_user/getExchangeUserDetail', payload);
}

export function getBoobExUserInfo(params) {
  return api.post('tool_user/getBookExUserInfo', params);
}
