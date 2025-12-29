import * as apiBookCommend from '@/api/bookCommend';
import moment from "moment";
const bookCommend={
    state:{
        bookCommendList: [],
        bookCommendCategoryList: [],
        bookCommendCount: 0,
        bookCommendListLoading: false,
        bookCommendExStateList: [{
            state: -1,
            name: "增值服务"
        }, {
            state: 1,
            name: "有增值"
        }, {
            state: 0,
            name: "无增值"
        }],
        bookCommendVerifyCodeStateList: [{
                state: -1,
                name: "有无验证码"
            },
            {
                state: 0,
                name: "无验证码"
            },
            {
                state: 1,
                name: "验证码"
            },
            {
                state: 2,
                name: "兑换码"
            }
        ],
        CommendquestionnaireStateList: [{
                state: -1,
                name: "有无问卷"
            },
            {
                state: 0,
                name: "无问卷"
            },
            {
                state: 1,
                name: "有问卷"
            }
        ],
        CommendhappybuyStateList: [{
                state: -1,
                name: '欢乐购'
            },
            {
                state: 0,
                name: '无'
            },
            {
                state: 1,
                name: '有'
            }
        ],
        bookCommendOnlineTestStateList: [{
            state: -1,
            name: "选择测评"
        }, {
            state: 0,
            name: "无测评"
        }, {
            state: 1,
            name: "在线测评"
        }, {
            state: 2,
            name: "智能辅导"
        }],
        CommendsearchOption: {
            category_id: 0,
            years: 0,
            state: -1,
            grade_id: 0,
            subject_id: 0,
            has_verify_code: -1,
            has_online_test: -1,
            has_ex: -1,
            type: 2,
            title: "",
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
            questionnaire_id: -1,
            has_happy_buy: -1,
            role_id: -1,
        },
        addBookForm: {
            book_id: -1,
            title: "",
            description: "",
            subject_id: 15,
            grade_id: 9,
            years: moment().year() + 1,
            city_id_arr: [],
            category_id_arr: [],
            img_url: "",
            has_verify_code: 0,
            has_online_test: 0,
            state: 0,
            has_happy_buy: 0,
            happy_buy_array: []
        },
        Commendrole_idList: [ //图书权限列表
            {
                value: 0,
                label: "全部用户可见"
            },
            {
                value: 1,
                label: "测试用户可见"
            },
            {
                value: 2,
                label: "编辑可见"
            }
        ],
    },
    actions:{
        getBookRecommendList({
            state,
            commit
        }, book_id_arr) {
            if (state.bookCommendListLoading) {
                return;
            }
            commit("setBookCommendListLoading");
            apiBookCommend.getBookRecommendList(state.CommendsearchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookCommendCount", res.total_count);
                        res.msg.forEach(item => {
                            if (book_id_arr && book_id_arr[state.CommendsearchOption.page_index]) {
                                book_id_arr[state.CommendsearchOption.page_index].forEach(res_item => {
                                    if (item.book_id == res_item) {
                                        item._checked = true;
                                    }
                                });
                            }
                        });
                        commit("setBookCommendList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getBookRecommendCategoryList({
            state,
            commit
        }, payload) {
            if (state.bookCommendCategoryList.length == 0) {
                apiBookCommend.getBookRecommendCategoryList()
                    .then(res => {
                        if (res.res_code == 1) {
                            commit("setBookCommendCategoryList", res.msg);
                        }
                    })
                    .catch(reason => {
                        console.error(reason)
                    })
            }
        },
        // getBookOrderList({
        //     state,
        //     commit
        // }, payload) {
        //     commit('setBookOrderListLoading', true)
        //     apiBook.getSuccessOrderList(state.bookOrderSearchOption).then(res => {
        //         commit('setBookOrderListLoading', false)
        //         if (res.res_code === 1) {
        //             commit('setBookOrderList', res.data.list)
        //             commit('setBookOrderListCount', res.data.count)
        //         }
        //     }).catch(err => {
        //         commit('setBookOrderListLoading', false)
        //     })
        // }
    },
    mutations:{
        setBookCommendList(state, data) {
            state.bookCommendListLoading = false;
            state.bookCommendList = data;
        },
        setBookCommendCategoryList(state, data) {
            state.bookCommendCategoryList = data;
        },
        setBookCommendListLoading(state, data) {
            state.bookCommendListLoading = true;
        },
        BookCommend_setPageIndex(state, data) {
            state.CommendsearchOption.page_index = data;
        },
        BookCommend_setPageSize(state, data) {
            state.CommendsearchOption.page_size = data;
        },
        BookCommend_setSearchForm(state, data) {
            state.CommendsearchOption = { ...state.CommendsearchOption,
                ...data
            };
        },
        setBookCommendCount(state, data) {
            state.bookCommendCount = data;
        },
    }
};

export default bookCommend;