import * as apiBook from '@/api/book'
import moment from "moment";

const discount = {
    state: {
        discountList: [],
        discountCount: 0,
        discountListLoading: false,
        discountStateList: [{
            state: 1,
            name: "未上线"
        }, {
            state: 2,
            name: "已上线"
        },{
            state: 3,
            name: "领取后可见"
        }],
        discountUserangeList: [{
            type: 1,
            name: "全场通用"
        }, {
            type: 2,
            name: "限定单科"
        }, {
            type: 3,
            name: "限定课程"
        }],
        searchOption: {
            title: "",
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
        },
    },
    getters: {
    },
    actions: {
        getCouponList({ state, commit }, payload) {
            commit("setDiscountListLoading", true);
            apiBook.getCouponList(payload)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setDiscountListLoading", false);
                        commit("setDiscountCount", res.data.count);
                        commit("setDiscountList", res.data.coupon_list);
                    }
                })
                .catch(reason => {
                    commit("setDiscountListLoading", false);
                    console.error(reason)
                })
        }
    },
    mutations: {
        setDiscountList(state, data) {
            state.discountListLoading = false;
            state.discountList = data;
        },
        setDiscountListLoading(state, data) {
            state.discountListLoading = true;
        },
        Discount_setPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        Discount_setPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        Discount_setSearchForm(state, data) {
            state.searchOption = {
                ...state.searchOption,
                ...data
            };
        },
        setDiscountCount(state, data) {
            state.discountCount = data;
        }
    }
};

export default discount;