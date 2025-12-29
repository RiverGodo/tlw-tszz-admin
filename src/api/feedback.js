'use strict';
import api from './config'

// 获取问卷列表
export function getQuestionnaireList(payload){
    return api.post('feedback/getQuestionnaireList', payload)
}

// 获取问卷绑定图书列表
export function getQuestionnaireBookList(payload){
    return api.post('feedback/getQuestionnaireBookList', payload)
}

// 删除问卷
export function delQuestionnaire(payload){
    return api.post('feedback/delQuestionnaire', payload)
}

// 修改问卷图书绑定
export function setQuestionnaireBook(payload){
    return api.post('feedback/setQuestionnaireBook', payload)
}

// add或修改问卷试题绑定
export function setQuestionnaireQuestion(payload){
    return api.post('feedback/setQuestionnaireQuestion', payload)
}

// 获取试题列表
export function getQuestionList(payload){
    return api.post('feedback/getQuestionList', payload)
}

// 添加或修改试题
export function addOrUpdateQuestion(payload){
    return api.post('feedback/addOrUpdateQuestion', payload)
}

// 删除试题
export function delQuestion(payload){
    return api.post('feedback/delQuestion', payload)
}

// 获取试卷对应试题列表
export function getQuestionListByQuestionnaire(payload){
    return api.post('feedback/getQuestionListByQuestionnaire', payload)
}

// 获取答卷列表 api/feedback/getUserAnswerList
export function getUserAnswerList(payload){
    return api.post('feedback/getUserAnswerList', payload)
}

// 获取答卷详情 api/feedback/getUserAnswerDetail
export function getUserAnswerDetail(payload){
    return api.post('feedback/getUserAnswerDetail', payload)
}

// 获取用户选项统计
export function getUserOptionStatistics(payload){
    return api.post('feedback/getUserOptionStatistics', payload)
}

// 获取单个问题用户回答
export function getUserAnswerByQuestionId(payload){
    return api.post('feedback/getUserAnswerByQuestionId', payload)
}

// 获取奖品列表
export function getRewardListWithoutWeek(payload){
    return api.post('feedback/getRewardListWithoutWeek', payload)
}

// 添加或修改奖品
export function addOrUpdateReward(payload){
    return api.post('feedback/addOrUpdateReward', payload)
}

// 删除奖品
export function delReward(payload){
    return api.post('feedback/delReward', payload)
}

//获取中奖列表
export function getRewardUserLog(payload){
    return api.post('feedback/getRewardUserLog', payload)
}