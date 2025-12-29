import * as apiPrd from "@/api/sign-up/product.js"

const product = {
    state: {
        productList: [],
        searchOption: {
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
            type: -1,
            state: -2,
            has_verify_code: -1,
        },
        prodListLoadingState: false,
        total_count: 0,
        codeStateList: [{
                state: -1,
                name: '有无兑换码'
            },
            {
                state: 0,
                name: '无兑换码'
            },
            {
                state: 1,
                name: '有兑换码'
            }
        ],
        typeSelectList: [{
                state: -1,
                name: '选择类型'
            },
            {
                state: 1,
                name: '报名类'
            },
            {
                state: 2,
                name: '实物购物'
            },
            {
                state: 3,
                name: '视频卡券虚拟类'
            },
            {
                state: 4,
                name: '服务类'
            },
            {
                state: 5,
                name: '实物加虚拟'
            },
            {
                state: 6,
                name: '在线联考'
            }
        ],
        stateList: [{
                state: -2,
                name: '选择状态'
            },
            {
                state: 1,
                name: '正常'
            },
            {
                state: 0,
                name: '测试用户可见'
            },
            {
                state: -1,
                name: '下架'
            }
        ]
    },
    actions: {
        getProdList({
            state,
            commit
        }, payload) {
            commit('update_prod_list_loading_state', true)
            apiPrd.getList(state.searchOption).then(res => {
                if (res.res_code == 1) {
                    commit('set_product_list', res.data.prodList)
                    commit('set_total_count', res.data.count)
                }
                commit('update_prod_list_loading_state', false)
            }).catch(err => {
                commit('update_prod_list_loading_state', false)
            })
        }
    },
    mutations: {
        set_add_prod_form(state, payload) {
            state.addProdForm = { ...state.addProdForm,
                ...payload
            }
        },
        set_product_list(state, payload) {
            state.productList = payload
        },
        set_total_count(state, payload) {
            state.total_count = payload
        },
        update_prod_list_loading_state(state, payload) {
            state.prodListLoadingState = payload
        },
        update_search_form_options(state, payload) {
            state.searchOption = { ...state.searchOption,
                ...payload
            }
        },
        Prd_setPageIndex(state, payload) {
            state.searchOption.page_index = payload
        },
        Prd_setPageSize(state, payload) {
            state.searchOption.page_size = payload
        }
    },
}

export default product