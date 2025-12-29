import * as apiBook from '@/api/book'
import {
    getQuestionnaireBookList
} from "@/api/feedback";
import moment from "moment";

const book = {
    state: {
        bookList: [],
        bookCategoryList: [],
        bookCount: 0,
        bookListLoading: false,
        bookExStateList: [{
            state: -1,
            name: "增值服务"
        }, {
            state: 1,
            name: "有增值"
        }, {
            state: 0,
            name: "无增值"
        }],
        bookVerifyCodeStateList: [{
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
        questionnaireStateList: [{
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
        happybuyStateList: [{
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
        bookOnlineTestStateList: [{
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
        searchOption: {
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
        // 试卷图书绑定
        searchBindBookForm: {
            title: '',
            questionnaire_id: 0,
            page_index: 0,
            page_size: 20,
            type: 2
        },
        hasBindedBookList: [],
        unBindBookList: [],
        unBindBookCount: 0,
        spinShow: false,
        role_idList: [ //图书权限列表
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
        bookOrderSearchOption: {
            type: 'book_name',
            content: '',
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
            book_name: '',
            user_id: '',
            phone: '',
            start_time: null,
            end_time: null
        },
        bookOrderList: [],
        bookOrderCount: 0,
        bookOrderListLoading: false
    },
    getters: {
        role_idSelectList: state => [{
            value: -1,
            label: '选择权限'
        }, ...state.role_idList]
    },
    actions: {
        getBookList({
            state,
            commit
        }, book_id_arr) {
            if (state.bookListLoading) {
                return;
            }
            commit("setBookListLoading");
            apiBook.getBookList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookCount", res.total_count);
                        res.msg.forEach(item => {
                            if (book_id_arr && book_id_arr[state.searchOption.page_index]) {
                                book_id_arr[state.searchOption.page_index].forEach(res_item => {
                                    if (item.book_id == res_item) {
                                        item._checked = true;
                                    }
                                });
                            }
                        });
                        commit("setBookList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getBookCategoryList({
            state,
            commit
        }, payload) {
            if (state.bookCategoryList.length == 0) {
                apiBook.getBookCategoryList()
                    .then(res => {
                        if (res.res_code == 1) {
                            commit("setBookCategoryList", res.msg);
                        }
                    })
                    .catch(reason => {
                        console.error(reason)
                    })
            }
        },
        /**
         * 获取已绑定图书
         * @param {*} param0 
         */
        getQuestionnaireBookListDef({
            state,
            commit
        }, payload) {
            commit('setSpinShow', true)
            getQuestionnaireBookList(state.searchBindBookForm)
                .then(res => {
                    if (res.res_code === 1) {
                        commit('setBindBookList', res.msg);
                    } else {
                        this.$Message.error(res.msg);
                    }
                    commit('setSpinShow', false)
                })
                .catch(error => {
                    commit('setSpinShow', false)
                });
        },
        getBookOrderList({
            state,
            commit
        }, payload) {
            commit('setBookOrderListLoading', true)
            apiBook.getSuccessOrderList(state.bookOrderSearchOption).then(res => {
                console.log(res);
                
                commit('setBookOrderListLoading', false)
                if (res.res_code === 1) {
                    commit('setBookOrderList', res.data.list)
                    commit('setBookOrderListCount', res.data.count)
                }
            }).catch(err => {
                commit('setBookOrderListLoading', false)
            })
        }
    },
    mutations: {
        setBindBookList(state, data) {
            state.hasBindedBookList = data.questionnaire_books;

            data.books.map(item => {
                if (item.has_questionnaire > 0) {
                    item._checked = true;
                }
            });

            state.unBindBookList = data.books
            state.unBindBookCount = data.total_count
            state.spinShow = false;
        },
        setSpinShow(state, data) {
            state.spinShow = data;
        },
        setBindBookForm(state, data) {
            state.searchBindBookForm = { ...state.searchBindBookForm,
                ...data
            };
        },
        setBookList(state, data) {
            state.bookListLoading = false;
            state.bookList = data;
        },
        setBookCategoryList(state, data) {
            state.bookCategoryList = data;
        },
        setBookListLoading(state, data) {
            state.bookListLoading = true;
        },
        Book_setPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        Book_setPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        Book_setSearchForm(state, data) {
            state.searchOption = { ...state.searchOption,
                ...data
            };
        },
        setBookCount(state, data) {
            state.bookCount = data;
        },
        setBookOrderSearchOption(state, payload) {
            state.bookOrderSearchOption = { ...state.bookOrderSearchOption,
                ...payload
            }
        },
        setBookOrderList(state, payload) {
            state.bookOrderList = payload
        },
        setBookOrderListCount(state, payload) {
            state.bookOrderCount = payload
        },
        setBookOrderListLoading(state, payload) {
            state.bookOrderListLoading = payload
        }
    }
};

export default book;