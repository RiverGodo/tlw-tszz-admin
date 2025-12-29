'use strict';

import api from '../config'

// 获取Banner列表
export function getBannerList(payload) {
    return api.post('tool_sign_up_banner/getBannerList', payload)
}

// 添加Banner
export function addBanner(payload) {
    return api.post('tool_sign_up_banner/addBanner', payload)
}

// 更新Banner
export function updateBanner(payload) {
    return api.post('tool_sign_up_banner/updateBanner', payload)
}

// 设置排序Banner
export function orderByBanner(payload) {
    return api.post('tool_sign_up_banner/orderByBanner', payload)
}

// 获取Banner详情
export function getBannerDetail(payload){
    return api.post('tool_sign_up_banner/getBannerDetail', payload)
}

// 删除Banner
export function delBanner(payload){
    return api.post('tool_sign_up_banner/delBanner', payload)
}