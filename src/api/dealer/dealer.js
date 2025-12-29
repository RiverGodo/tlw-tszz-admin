'use strict';

import api from '../config'

// 获取所有的经销商列表
export function getDealerList(payload) {
    let data ={
        ...payload,
        page_index:payload.page_index-1
    }
    return api.post('tool_dealer_card/getDealerList', data)
}

// 获取所有的提现数据
export function getAllProfit(payload) {
    let data ={
        ...payload,
        page_index:payload.page_index-1
    }
    return api.post('tool_dealer_card/getAllProfit', data)
}
// 修改提现数据状态
export function updateProfit(payload) {
    let data ={
        ...payload
    }
    return api.post('tool_dealer_card/updateProfit', data)
}
// 获取经销商激活的卡记录
export function getActivationList(payload) {
    let data ={
        ...payload,
        no:Number(payload.no),
        page_index:payload.page_index-1
    }
    return api.post('tool_dealer_card/getActivationList', data)
}
// 获取卡号激活兑换信息详情
export function getActivationInfo(payload) {
    let data ={
        ...payload
    }
    return api.post('tool_dealer_card/getActivationInfo', data)
}
// 修改激活卡的激活状态
export function updateCardActivationState(payload) {
    let data ={
        ...payload
    }
    return api.post('tool_dealer_card/updateCardActivationState', data)
}

// 获取卡号激活兑换信息详情
export function updateOrderUserInfo(payload) {
    let data ={
        ...payload
    }
    return api.post('tool_dealer_card/updateOrderUserInfo', data)
}
// 获取所有的用户激活升级记录
export function getActivationLog(payload) {
    let data ={
        ...payload
    }
    return api.post('tool_dealer_card/getActivationLog', data)
}
//取消激活用户兑换过的卡
export function deleteCardActivation(payload) {
    let data = {
        ...payload
    }
    return api.post('tool_dealer_card/deleteCardActivation', data)
}
//经销商批量激活普通卡
export function activationCard (payload) {
    let data = {
        ...payload
    }
    return api.post('tool_dealer_card/activationCard', data)
}
