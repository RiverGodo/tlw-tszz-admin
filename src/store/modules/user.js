import Cookies from 'js-cookie';
import * as apiUser from '@/api/user'

const user = {
    state: {
        searchOption: { //后台用户列表参数
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
            role_arr: []
        },
        userList: [], //后台用户列表
        userListLoading: false,
        exUserList: [], //兑换用户列表
        exUserListLoading: false,
        exSearchOption: {
            start_time: '',
            end_time: '',
            user_id: -1,
            nickname: '',
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100]
        },
        total_count: 0,
        feSearchOption: {
            searchType: 'nickname',
            content: '',
            type: 0, //区分用户类型，0 基础用户，1图书增值小程序，2天利英语
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
            nickname: '',
            phone: '',
            user_id: '',
            start_time: '',
            end_time: ''
        },
        feUserList: [], //前端用户列表
    },
    mutations: {
        logout(state, vm) {
            Cookies.remove('islogin');
            Cookies.remove('userInfo');
        },
        setUserList(state, payload) {
            state.userList = payload
        },
        setUserListLoading(state, payload) {
            state.userListLoading = payload
        },
        setFeSearchOption(state, payload) {
            state.feSearchOption = { ...state.feSearchOption,
                ...payload
            }
        },
        setFeUserList(state, payload) {
            state.feUserList = payload
        },
        setTotalCount(state, payload) {
            state.total_count = payload
        },
        setExUserListLoading(state, payload) {
            state.exUserListLoading = payload
        },
        setExUserList(state, payload) {
            state.exUserList = payload
        },
        setExSearchOption(state, payload) {
            state.exSearchOption = { ...state.exSearchOption,
                ...payload
            }
        }
    },
    actions: {
        getToolUserList({
            state,
            commit
        }, payload) {
            commit('setUserListLoading', true)
            apiUser.getToolUserList(state.searchOption).then(res => {
                if (res.res_code == 1) {
                    commit('setUserList', res.data)
                    commit('setUserListLoading', false)
                    commit('setTotalCount', res.data.length)
                }
            }).catch(err => {
                commit('setUserListLoading', false)
            })
        },
        getFeUserList({
            state,
            commit
        }, payload) {
            commit('setUserListLoading', true)
            switch (state.feSearchOption.type) {
                case 0: //基础用户
                    apiUser.getBaseUserList(state.feSearchOption).then(res => {
                        if (res.res_code == 1) {
                            commit('setFeUserList', res.data.user_list)
                            commit('setUserListLoading', false)
                            commit('setTotalCount', res.data.count)
                        }
                    }).catch(err => {
                        commit('setUserListLoading', false)
                    })
                    break;
                case 1: //图书增值小程序
                    apiUser.getBoobExUserList(state.feSearchOption).then(res => {
                        if (res.res_code == 1) {
                            commit('setFeUserList', res.data.user_list)
                            commit('setUserListLoading', false)
                            commit('setTotalCount', res.data.count)
                        }
                    }).catch(err => {
                        commit('setUserListLoading', false)
                    })
                    break;
                case 2: //每日英语
                    apiUser.getEveryDayEngUserList(state.feSearchOption).then(res => {
                        if (res.res_code == 1) {
                            commit('setFeUserList', res.data.user_list)
                            commit('setUserListLoading', false)
                            commit('setTotalCount', res.data.count)
                        }
                    }).catch(err => {
                        commit('setUserListLoading', false)
                    })
                    break;
            }
        },
        getExuserList({
            state,
            commit
        }, payload) {
            commit('setExUserListLoading', true)
            apiUser.getExchangedUserList(state.exSearchOption).then(res => {
                commit('setExUserListLoading', false)
                if (res.res_code == 1) {
                    commit('setExUserList', res.data.user_list)
                    commit('setTotalCount', res.data.total_count)
                }
            }).catch(err => {
                commit('setExUserListLoading', false)
            })
        }
    },
};

export default user;