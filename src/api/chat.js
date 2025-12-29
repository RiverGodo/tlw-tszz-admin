/*
 * @Author: wangpan 
 * 直播间相关API
 * @Date: 2018-07-11 15:16:46 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-07-12 16:38:39
 */
import api from './config'

//获取直播间状态
export function getRoomState(params) {
    let payload = {
        resource_id: params.resource_id
    }
    return api.post('chat/getRoomState', payload)
}

//获取直播间用户列表
export function getUserListByUserIdArray(params) {
    let payload = {
        resource_id: params.resource_id,
        user_id_arr: params.user_id_arr,
        page_index: params.page_index - 1,
        page_size: params.page_size
    }
    return api.post('chat/getUserListByUserIdArray', payload)
}

//获取直播间聊天信息
export function getContents(params) {
    let payload = {
        resource_id: params.resource_id,
        page_index: params.page_index - 1,
        page_size: params.page_size,
        user_id: params.user_id,
        content: params.content
    }
    return api.post('chat/getContents', payload)
}

//禁言
export function setForbidden(params) {
    let payload = {
        resource_id: params.resource_id,
        user_id: params.user_id
    }
    return api.post('chat/setForbidden', payload)
}

//删除聊天信息
export function removeContents(params) {
    let payload = {
        content_id_arr: params.content_id_arr
    }
    return api.post('chat/removeContents', payload)
}

//设置用户角色
export function setUserRole(params) {
    let payload = {
        user_id: params.user_id,
        type: params.type
    }
    return api.post('chat/setUserRole', payload)
}

//全体禁言
export function setRoomForbidden(params) {
    let payload = {
        resource_id: params.resource_id,
        is_all_forbidden: params.is_all_forbidden
    }
    return api.post('chat/setRoomForbidden', payload)
}

//设置直播间状态
export function setRoomState(params) {
    let payload = {
        resource_id: params.resource_id,
        state: params.state
    }
    return api.post('chat/setRoomState', payload)
}