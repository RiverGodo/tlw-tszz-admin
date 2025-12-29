/*
 * @Author: wangpan 
 * @Date: 2018-06-22 12:08:09 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-07-02 12:58:59
 */
import * as apiSale from '@/api/sign-up/sale'

const sale = {
    state: {
        searchOption: {
            type: 0,
            sale_name: '',
            is_group_purchase: -1,
            is_pre_buy: -2,
        },
        groupPurchaseSelects: [{
                state: -1,
                name: '是否团购'
            },
            {
                state: 0,
                name: '否'
            },
            {
                state: 1,
                name: '是'
            }
        ],
        preBuySelects: [{
                state: -2,
                name: '是否预购'
            },
            {
                state: -1,
                name: '否'
            },
            {
                state: 1,
                name: '是'
            }
        ],
        typeSelects: [{
                state: 0,
                name: '选择类型'
            },
            {
                state: 1,
                name: '无折扣'
            },
            {
                state: 2,
                name: '每件直减'
            },
            {
                state: 3,
                name: '总价直减'
            },
            {
                state: 4,
                name: '折扣'
            }
        ],
        saleList: [],
        saleListLoading: false,
        total_count: 0,
    },
    mutations: {
        set_sale_list_loading(state, payload) {
            state.saleListLoading = payload
        },
        set_sale_list(state, payload) {
            state.saleList = payload
        },
        set_total_count(state, payload) {
            state.total_count = payload
        }
    },
    actions: {
        getSaleList({
            state,
            commit
        }, payload) {
            commit('set_sale_list_loading', true)
            apiSale.getList(state.searchOption).then(res => {
                if (res.res_code == 1) {
                    commit('set_sale_list', res.data.saleList)
                    commit('set_total_count', res.data.count)
                }
                commit('set_sale_list_loading', false)
            }).catch(err => {
                commit('set_sale_list_loading', false)
            })
        }
    }
}

export default sale