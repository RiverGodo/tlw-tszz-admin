import * as apiFeedBack from '@/api/feedback'
import { Message } from 'iview'

import moment from "moment";

const state = {
    searchQuestionnaireOption: {
        title: '',
        page_index: 0,
        page_size: 10,
        total_count: 0
    },
    searchQuestionByQuennaire: {
        questionnaire_id: 0,
        page_size: 100,
        page_index: 0
    },
    searchQuestionOption: {
        title: "",
        category: -1,
        page_index: 0,
        page_size: 10,
        total_count: 0
    },
    searchAnswerOption: {
        page_index: 0,
        page_size: 10,
        total_count: 0
    },
    selfQuestionList: [],
    questionnaireList: [],
    questionnaireDetail: {},
    existQuestionList: [],
    answerList: [],
    prizeList: [],
    prizeUserList: [],
    prizeUserLoading: false,
    searchPrizeUserOption: {
        reward_id: -1,
        nickname: "",
        page_index: 0,
        page_size: 20,
        page_size_opts: [20, 50, 100],
        total_count: 0
    },
    existQuestionLoading: true,
    questionnaireLoading: true,
    answerlistLoading: true,
    prizeListLoading: true,
    questionData: ''
}
const getters = {
    prizeListSelect: state => [
        {
            reward_id: -1,
            name: "选择奖项"
        },
        ...state.prizeList
    ]
}
const actions = {
    get_questionnaire_list({
        state,
        commit
    }, payload) {
        commit('SET_SEARCH_QUESTIONNAIRE_OPTION', {
            data: payload,
            callback() {
                commit('SET_QUESTIONNAIRE_LOADING', true)
                apiFeedBack.getQuestionnaireList(state.searchQuestionnaireOption).then(res => {
                    if (res.res_code === 1) {
                        commit('SET_QUESTIONNAIRE_LIST', res.msg);
                    }
                    commit('SET_QUESTIONNAIRE_LOADING', false)
                })
                    .catch(error => {
                        console.log(error)
                        commit('SET_QUESTIONNAIRE_LOADING', false)
                    })
            }
        })
    },
    get_prize_user_list({
        state,
        commit
    }, payload) {
        commit('SET_SEARCH_PRIZE_USER_OPTION', {
            data: payload,
            callback() {
                commit('SET_PRIZE_USER_LOADING', true);
                apiFeedBack.getRewardUserLog(state.searchPrizeUserOption)
                    .then(res => {
                        if (res.res_code == 1) {
                            commit('SET_PRIZE_USER_LIST', res.msg);
                        }
                        commit('SET_PRIZE_USER_LOADING', false);
                    })
                    .catch(error => {
                        console.log(error)
                        commit('SET_PRIZE_USER_LOADING', false);
                    })
            }
        });
    },
    // 获取已有试题
    get_question_list({
        state,
        commit
    }, payload) {
        commit('SET_SEARCH_QUESTION_SEARCH_OPTION', {
            data: payload,
            callback() {
                commit('SET_EXIST_QUESTION_LOADING', true);
                apiFeedBack.getQuestionList(state.searchQuestionOption)
                    .then(res => {
                        if (res.res_code == 1) {
                            commit('SET_EXIST_QUESTIONLIST', res.msg);
                        }
                        commit('SET_EXIST_QUESTION_LOADING', false);
                    })
                    .catch(error => {
                        console.log(error)
                        commit('SET_EXIST_QUESTION_LOADING', false);
                    })
            }
        });
    },
    get_question_list_by_questionnaire({
        state,
        commit
    }, payload) {
        commit('SET_SEARCH_QUESTION_BY_QUESTIONNAIRE_OPTION', {
            data: payload,
            callback() {
                apiFeedBack.getQuestionListByQuestionnaire(state.searchQuestionByQuennaire)
                    .then(res => {
                        if (res.res_code === 1) {
                            commit('SET_QUESTIONNAIRE_DETAIL', res.msg)
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        })
    },
    get_user_answer_list({
        state,
        commit
    }, payload) {
        commit('SET_SEARCH_ANSWER_OPTION', {
            data: payload,
            callback() {
                commit('SET_ANSWER_LOADING', true);
                apiFeedBack.getUserAnswerList(state.searchAnswerOption)
                    .then(res => {
                        if (res.res_code === 1) {
                            commit('SET_ANSWER_LIST', res.msg)
                        }
                        commit('SET_ANSWER_LOADING', false);
                    })
                    .catch(error => {
                        console.error(error);
                        commit('SET_ANSWER_LOADING', false);
                    })
            }
        })
    },
    get_reward_list({
        state,
        commit
    }) {
        commit('SET_REWARD_LOADING', true)
        apiFeedBack.getRewardListWithoutWeek()
            .then(res => {
                if (res.res_code === 1) {
                    commit('SET_REWARD_LIST', res.msg);
                } else {
                    this.$Message.warning(res.msg);
                }
                commit('SET_REWARD_LOADING', false)
            })
            .catch(error => {
                this.$Message.warning(error);
                commit('SET_REWARD_LOADING', false)
            });

    }
}

const mutations = {
    'SET_SEARCH_PRIZE_USER_OPTION': (state, payload) => {
        state.searchPrizeUserOption = {
            ...state.searchPrizeUserOption,
            ...payload.data
        };
        payload.callback();
    },
    'SET_SEARCH_QUESTIONNAIRE_OPTION': (state, payload) => {
        state.searchQuestionnaireOption = {
            ...state.searchQuestionnaireOption,
            ...payload.data
        };
        payload.callback();
    },
    'SET_SEARCH_QUESTION_SEARCH_OPTION': (state, payload) => {
        state.searchQuestionOption = {
            ...state.searchQuestionOption,
            ...payload.data
        }
        payload.callback();
    },
    'SET_SEARCH_QUESTION_BY_QUESTIONNAIRE_OPTION': (state, payload) => {
        state.searchQuestionByQuennaire = {
            ...state.searchQuestionByQuennaire,
            ...payload.data
        }
        payload.callback();
    },
    'SET_SEARCH_ANSWER_OPTION': (state, payload) => {
        state.searchAnswerOption = {
            ...state.searchAnswerOption,
            ...payload.data
        }
        payload.callback();
    },
    'EDIT_QUESTION': (state, payload) => {
        state.selfQuestionList.splice(payload.Index, 1, payload.data)
    },
    'CREATE_QUESTION': (state, payload) => {
        const reduceRepeateItem = arr => {
            let obj = {};
            let list = [];

            if (arr.length === 0) {
                return true;
            }

            arr.forEach(element => {
                if (!obj[element.question_id]) {
                    obj[element.question_id] = element.question_id;
                    list.push(element)
                } else {
                    Message.warning("您添加了重复的题，请检查!");
                    return false;
                }
            });

            return list;
        };

        state.selfQuestionList = reduceRepeateItem([...state.selfQuestionList, ...payload.data]);
    },
    'SET_PRIZE_USER_LIST': (state, payload) => {
        state.prizeUserList = payload.data;
        state.searchPrizeUserOption.total_count = payload.total_count
    },
    'SET_PRIZE_USER_LOADING': (state, payload) => {
        state.prizeUserLoading = payload;
    },
    'SET_QUESTIONNAIRE_LIST': (state, payload) => {
        state.questionnaireList = payload.questionnaire_arr;
        state.searchQuestionnaireOption.total_count = payload.total_count
    },
    'SET_EXIST_QUESTIONLIST': (state, payload) => {
        state.existQuestionList = payload.question_arr;
        state.searchQuestionOption.total_count = payload.total_count
    },
    'SET_ANSWER_LIST': (state, payload) => {
        state.answerList = payload.result;
        state.searchAnswerOption.total_count = payload.total_count;
    },
    'SET_QUESTIONNAIRE_DETAIL': (state, payload) => {
        state.selfQuestionList = payload.question_arr;
        state.questionnaireDetail = payload;
    },
    'SET_EXIST_QUESTION_LOADING': (state, payload) => {
        state.existQuestionLoading = payload;
    },
    'SET_QUESTIONNAIRE_LOADING': (state, payload) => {
        state.questionnaireLoading = payload
    },
    'SET_ANSWER_LOADING': (state, payload) => {
        state.answerlistLoading = payload;
    },
    'SET_REWARD_LOADING': (state, payload) => {
        state.prizeListLoading = payload;
    },
    'SET_REWARD_LIST': (state, payload) => {
        state.prizeList = payload
    },
    'SEND_QUESTION_DATA': (state, payload) => {
        state.questionData = payload;
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}