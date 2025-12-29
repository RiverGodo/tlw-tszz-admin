import * as apiCode from '@/api/codeCategory'
import moment from "moment";

const state = {
    searchForm: {
        code_category_id: '',
        page_index: 0,
        page_size: 20
    },
    codeCategorySearchForm: {
        title: '',
        state: -2,
        page_index: 1,
        page_size: 20,
        type: -1,
        page_size_opts: [20, 50, 100]
    },
    codeCategoryTypeList: [],
    codeCategoryCount: 0,
    codeCategoryLoading: false,
    codeCategoryList: [],
    codeCategoryListLoading: false,
    codeCategoryDetail: [],
    currentPage: 1,
    codeCount: 0,
    codeLog: '', //验证码使用日志
    codeLogLoading: false,
    codeCategorySelect: [{
            state: -2,
            name: '选择状态'
        },
        {
            state: -1,
            name: '失效'
        },
        {
            state: 1,
            name: '生效'
        }
    ]
}

const getters = {
    codeList: (state) => {
        return state.codeCategoryDetail.codes
    },
    downloadFiles: (state) => {
        return state.codeCategoryDetail.files
    }
}

const actions = {
    getCodeCategoryList({
        commit,
        state
    }, payload) {
        commit('set_code_category_list_loading', true)
        apiCode.getCodeCategoryList(state.codeCategorySearchForm).then(res => {
            if (res.res_code == 1) {
                commit('set_code_category_list', res.msg)
                commit('set_code_category_count', res.total_count)
            }
            commit('set_code_category_list_loading', false)
        }).catch(err => {
            commit('set_code_category_list_loading', false)
        })
    },
    getCodeList({
        commit,
        state
    }, payload) {
        commit('set_code_category_loading', true)
        apiCode.getCodeList(state.searchForm)
            .then(res => {
                if (res.res_code == 1) {
                    commit('set_code_category_detail', res.msg);
                }
                commit('set_code_category_loading', false)
            })
            .catch(error => {
                console.log(error)
                commit('set_code_category_loading', false)
            })
    },
    getCodeLog({
        commit,
        state
    }, payload) {
        commit('set_codeLog_loading', true)
        apiCode.getCodeUseLog(payload).then(res => {
            if (res.res_code == 1) {
                res.data ? commit('set_code_log', res.data) : commit('set_code_log', res.msg);
            }
            commit('set_codeLog_loading', false)
        }).catch(err => {
            commit('set_codeLog_loading', false)
            console.log(err)
        })
    },
    getCodeCategoryTypeList({
        state,
        commit
    }, payload) {
        apiCode.getCodeCategoryTypeList().then(res => {
            if (res.res_code == 1) {
                commit('set_code_category_type_list', res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }
}

const mutations = {
    set_code_search_form(state, payload) {
        state.searchForm = { ...state.searchForm,
            ...payload
        }
        state.currentPage = state.searchForm.page_index + 1;
    },
    set_code_category_search_form(state, payload) {
        state.codeCategorySearchForm = { ...state.codeCategorySearchForm,
            ...payload
        }
    },
    set_code_category_count(state, payload) {
        state.codeCategoryCount = payload
    },
    set_code_category_list(state, payload) {
        state.codeCategoryList = payload
    },
    set_code_category_loading(state, payload) {
        state.codeCategoryLoading = payload;
    },
    set_code_category_detail(state, payload) {
        state.codeCategoryDetail = payload;
        state.codeCount = payload.count;
    },
    set_page_currentIndex(state, payload) {
        state.codeCount = payload;
        state.currentPage = payload + 1;
    },
    set_code_category_list_loading(state, payload) {
        state.codeCategoryListLoading = payload
    },
    set_codeLog_loading(state, payload) {
        state.codeLogLoading = payload
    },
    set_code_log(state, payload) {
        state.codeLog = payload;
    },
    set_code_category_type_list(state, payload) {
        state.codeCategoryTypeList = payload
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}