'use strict';

import api from '../config'

//获取支付成功订单列表
export function getSuccessOrderList(payload) {
    let params = {
        page_index: payload.page_index - 1,
        page_size: payload.page_size,
        pay_type: payload.pay_type,
        exam_id: payload.exam_id
    }
    if (payload.start_time) {
        params.start_time = payload.start_time;
        params.end_time = payload.end_time;
    }
    payload.user_id && (params.user_id = payload.user_id)
    payload.phone && (params.phone = payload.phone)
    payload.order_id && (params.order_id = payload.order_id)
    payload.origin && (params.origin = payload.origin)
    return api.post('tool_sign_up/getSuccessOrderList', params)
}
//根据订单ID获取订单详情
export function getOrderDetail(payload) {
    return api.post('tool_sign_up/getOrderDetail', {
        order_id: payload
    })
}
//设置快递信息
export function setWayBillInfo(payload) {
    let params = {
        order_id: payload.order_id,
        way_bill_num: payload.way_bill_num
    }
    payload.way_bill_company && (params.way_bill_company = payload.way_bill_company)
    payload.way_bill_send_time && (params.way_bill_send_time = payload.way_bill_send_time)
    return api.post('tool_sign_up/setWayBillInfo', params)
}