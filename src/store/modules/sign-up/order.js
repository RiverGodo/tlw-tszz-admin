import * as apiOrder from '../../../api/sign-up/order'

const order = {
    state: {
        orderList: [], //订单列表
        orderListLoading: false,
        searchOption: { //查询参数
            exam_id: -1,
            page_index: 1,
            page_size: 20, //每页20条数据
            pay_type: -1,
            // origin: '',
            /* start_time: '',
            end_time: '', */
            type: 'user_id'
        },
        total_count: 0 //订单总数
    },
    mutations: {
        setOrderList(state, payload) {
            state.orderList = payload
        },
        updateOrderListLoading(state, payload) {
            state.orderListLoading = payload
        },
        updateOrderCount(state, payload) {
            state.total_count = payload
        },
        Order_setPageIndex(state, payload) {
            state.searchOption.page_index = payload
        },
        Order_setPageSize(state, payload) {
            state.searchOption.page_size = payload
        },
        updateSearchOption(state, payload) {
            state.searchOption = payload
        }
    },
    actions: {
        getOrderList({
            state,
            commit
        }, payload) {
            commit('updateOrderListLoading', true)
            apiOrder.getSuccessOrderList(state.searchOption).then(res => {
                if (res.res_code == 1) {
                    commit('setOrderList', res.data.orders)
                    commit('updateOrderCount', res.data.total_count)
                }
                commit('updateOrderListLoading', false)
            }).catch(err => {
                console.log(err);
                commit('updateOrderListLoading', false)
            })
        }
    }
}

export default order