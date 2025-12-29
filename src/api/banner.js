'use strict';

import api from './config'

// 获取Banner列表
export function getBannerList(payload) {
    return api.post('tool_book_banner/getBannerList', payload)
}

// 添加Banner
export function addBanner(payload) {
    return api.post('tool_book_banner/addBanner', payload)
}

// 更新Banner
export function updateBanner(payload) {
    return api.post('tool_book_banner/updateBanner', payload)
}

// 设置排序Banner
export function orderByBanner(payload) {
    return api.post('tool_book_banner/orderByBanner', payload)
}

// 获取Banner详情
export function getBannerDetail(payload){
    return api.post('tool_book_banner/getBannerDetail', payload)
}

// 删除Banner
export function delBanner(payload){
    return api.post('tool_book_banner/delBanner', payload)
}