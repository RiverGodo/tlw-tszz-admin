/*
 * @Author: wangpan 
 * 直播间
 * @Date: 2018-07-11 15:17:15 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-07-12 15:39:21
 */
import * as apiChat from '@/api/chat.js'

const chat = {
    state: {
        userSearchOption: {
            user_id_arr: [],
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100]
        },
        userTotalCount: 0,
        userList: [],
        userListLoading: false,
        contentTotalCount: 0,
        contentList: [],
        contentListLoading: false,
        contSearchOption: {
            searchType: 'user_id',
            resource_id: 0,
            user_id: 0,
            content: '',
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100]
        },
    },
    mutations: {
        set_chat_user_list_loading(state, payload) {
            state.userListLoading = payload
        },
        set_chat_user_list(state, payload) {
            state.userList = payload
        },
        set_chat_content_list(state, payload) {
            state.contentList = payload
        },
        set_chat_content_list_loading(state, payload) {
            state.contentListLoading = payload
        },
        set_user_total_count(state, payload) {
            state.userTotalCount = payload
        },
        set_content_total_count(state, payload) {
            state.contentTotalCount = payload
        },
        set_user_search_option(state, payload) {
            state.userSearchOption = { ...state.userSearchOption,
                ...payload
            }
        },
        set_cont_search_option(state, payload) {
            state.contSearchOption = { ...state.contSearchOption,
                ...payload
            }
        }
    },
    actions: {
        getUserListByUserIdArray({
            state,
            commit
        }, payload) {
            commit('set_chat_user_list_loading', true)
            apiChat.getUserListByUserIdArray(state.userSearchOption).then(res => {
                if (res.res_code == 1) {
                    commit('set_chat_user_list', res.data.user_list)
                    commit('set_user_total_count', res.data.count)
                }
                commit('set_chat_user_list_loading', false)
            }).catch(err => {
                commit('set_chat_user_list_loading', false)
                console.log(err)
            })
        },
        getContentList({
            state,
            commit
        }, payload) {
            commit('set_chat_content_list_loading', true)
            apiChat.getContents(state.contSearchOption).then(res => {
                if (res.res_code == 1) {
                    commit('set_chat_content_list', res.data.content_list)
                    commit('set_content_total_count', res.data.total_count)
                }
                commit('set_chat_content_list_loading', false)
            }).catch(err => {
                commit('set_chat_content_list_loading', false)
                console.log(err)
            })
        }
    }
}
export default chat