'use strict';

import api from './config'

// 获取事件列表
export function getEventList(payload) {
    let data = {
        page_index: payload.page_index-1,
        page_size: payload.page_size
    }
    return api.post('v2/log/getEvents', data);
}
//获取事件详情
export function getEventDetailList(payload) {
    return api.post('v2/log/getEventsBydate', payload)
}
//添加事件
export function addEvent(payload) {
    return api.post('v2/log/addEvent', payload)
}
//获取事件参数
export function getEventValueList(payload) {
    return api.post('v2/log/getEventValueList', payload)
}
