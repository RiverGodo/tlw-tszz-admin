/*
 * @Author: wangpan 
 * @Date: 2018-06-22 11:59:53 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-06-22 14:52:31
 */
'use strict';

import api from '../config'
/**
 *获取销售模式列表
 * @export
 * @param {*} params
 */
export function getList(params) {
    let payload = {
        sale_name: params.sale_name,
        type: params.type,
        is_group_purchase: params.is_group_purchase,
        is_pre_buy: params.is_pre_buy
    }
    return api.post('tool_sign_up_sale/getList', payload)
}
/**
 *添加或修改销售模式
 * @export
 * @param {*} params
 */
export function addSale(params) {
    let payload = {
        sale_name: params.sale_name,
        sale_desc: params.sale_desc,
        sale_discount: params.sale_discount,
        sale_income: params.sale_income,
        type: params.type,
        is_group_purchase: params.is_group_purchase,
        is_pre_buy: params.is_pre_buy,
        more: params.more
    }
    params.sale_id > 0 && (payload.sale_id = params.sale_id)
    return api.post('tool_sign_up_sale/addSale', payload)
}
/**
 *获取详情
 * @export
 * @param {*} params
 */
export function getDetail(params) {
    let payload = {
        sale_id: params.sale_id
    }
    return api.post('tool_sign_up_sale/getDetail', payload)
}