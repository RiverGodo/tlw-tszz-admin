'use strict';

import api from './config'

// 获取批次码信息列表
export function getCodeCategoryList(payload) {
    let params = {
        page_index: payload.page_index - 1,
        page_size: payload.page_size,
        state: payload.state,
        title: payload.title,
        type: payload.type
    }
    return api.post('tool_code/getCodeCategoryList', params);
}

// 获取单个批次码信息
export function getCodeCategoryDetail(payload) {
    return api.post('tool_code/getCodeCategoryDetail', payload);
}

// 更新单个批次码信息
export function updateCodeCategory(payload) {
    return api.post('tool_code/updateCodeCategory', payload);
}

// 生成码
export function createCode(payload) {
    return api.post('tool_code/createCode', payload);
}

// 查看兑换码列表
export function getCodeList(payload) {
    return api.post('tool_code/getCodeList', payload);
}

//更新单个兑换码状态
export function setCodeState(payload) {
    return api.post('tool_code/setCodeState', payload);
}

//查看单个兑换码的使用记录
export function getCodeUseLog(params) {
    let payload = {
        code: params
    }
    return api.post('tool_code/getCodeUseLog', payload);
}

//获取验证码类型列表
export function getCodeCategoryTypeList() {
    return api.post('tool_code/getCodeCategoryTypeList')
}

//添加验证码类型
export function addCodeCategoryType(payload) {
    let params = {
        type_name: payload.type_name
    }
    return api.post('tool_code/addCodeCategoryType', params)
}
//删除兑换码
export function setCodeCategoryState(payload) {
    let params = {
        code_category_ids: payload.code_category_ids,
        state:payload.state
    }
    return api.post('tool_code/setCodeCategoryState', params)
}