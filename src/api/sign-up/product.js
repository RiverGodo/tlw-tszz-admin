'use strict';

import api from '../config'

//获取产品列表
export function getList(params) {
    let payload = {
        page_index: params.page_index - 1,
        page_size: params.page_size,
        name: params.name,
        type: params.type,
        state: params.state,
        has_verify_code: params.has_verify_code,
        sale_type: params.sale_type
    }
    return api.post('tool_sign_up/getList', payload)
}

//添加或修改产品
export function addOrUpdateProduct(params) {
    let payload = {
        name: params.name,
        type: params.type,
        description: params.description,
        detail: params.detail,
        share_title: params.share_title,
        share_desc: params.share_desc,
        share_img_url: params.share_img_url,
        img_url: params.img_url,
        price: params.price,
        original_price: params.original_price,
        state: params.state,
        has_verify_code: params.has_verify_code,
        sale_id_arr: params.sale_id_arr,
        has_address: params.has_address,
        has_user_info: params.has_user_info,
        user_info: params.user_info,
        // tags: params.tags
        subject_id_arr: params.subject_id_arr,
        city_id_arr: params.city_id_arr,
    }
    params.product_id && (payload.product_id = params.product_id)
    params.has_verify_code && (payload.code_category_id = params.code_category_id)
    if (params.start_time) {
        payload.start_time = params.start_time
        payload.end_time = params.end_time
    }
    return api.post('tool_sign_up/addOrUpdateProduct', payload)
}
//修改产品状态
export function setState(product_id) {
    let payload = {
        product_id: product_id,
    }
    return api.post('tool_sign_up/setState', payload)
}
//获取产品详情
export function getDetail(product_id) {
    let payload = {
        product_id: product_id,
    }
    return api.post('tool_sign_up/getDetail', payload)
}

//设置加群链接
export function setLink(params) {
    let payload = {
        link_id: params.link_id,
        url: params.url
    }
    return api.post('tool_sign_up/setLink', payload)
}
//添加加群链接
export function addLink(params) {
    let payload = {
        exam_id: params.exam_id,
        url: params.url
    }
    return api.post('tool_sign_up/addLink', payload)
}

//添加或修改产品标签
export function addOrUpdateTags(params) {
    let payload = {
        exam_id: params.exam_id,
        tags: params.tags
    }
    return api.post('tool_sign_up/addOrUpdateTags', payload)
}
// 获取产品标签
export function getTagsByExamId(params) {
    let payload = {
        exam_id: params.exam_id
    }
    return api.post('tool_sign_up/getTagsByExamId', payload)
}

// 产品排序
export function orderProduct(params) {
    let payload = {
        sale_type: params.sale_type,
        order_list: params.order_list
    }
    return api.post('tool_sign_up/orderProduct', payload)
}

// 添加产品到其他列表
export function addToOtherList(params) {
    let payload = {
        sale_type: params.sale_type,
        exam_id: params.exam_id
    }
    return api.post('tool_sign_up/addToOtherList', payload)
}

// 删除其他列表中的产品
export function delProdFromOtherList(params) {
    let payload = {
        sale_type: params.sale_type,
        exam_id: params.exam_id
    }
    return api.post('tool_sign_up/delProdFromOtherList', payload)
}
