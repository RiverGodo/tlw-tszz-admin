import * as apiAddBookCommend from '@/api/addBookCommend';
const addBookCommend={
    state:{
        addBookCommendList: [],
        addBookCommendCount: 0,
        addBookCommendListLoading: false,
        addBookCommendsearchOption: {
            book_id:'',
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
    },
    actions:{
        getAddBookRecommendList({
            state,
            commit
        }, book_id_arr) {
            if (state.addBookCommendListLoading) {
                return;
            }
            commit("setAddBookCommendListLoading");
            apiAddBookCommend.getAddBookRecommendList(state.addBookCommendsearchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setAddBookCommendCount", res.total_count);
                        res.msg.forEach(item => {
                            if (book_id_arr && book_id_arr[state.addBookCommendsearchOption.page_index]) {
                                book_id_arr[state.addBookCommendsearchOption.page_index].forEach(res_item => {
                                    if (item.book_id == res_item) {
                                        item._checked = true;
                                    }
                                });
                            }
                        });
                        commit("setAddBookCommendList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
    },
    mutations:{
        setAddBookCommendList(state, data) {
            state.addBookCommendListLoading = false;
            state.addBookCommendList = data;
        },
        setAddBookCommendListLoading(state, data) {
            state.addBookCommendListLoading = true;
        },
        AddBookCommend_setPageIndex(state, data) {
            state.addBookCommendsearchOption.page_index = data;
        },
        AddBookCommend_setPageSize(state, data) {
            state.addBookCommendsearchOption.page_size = data;
        },
        AddBookCommend_setSearchForm(state, data) {
            state.addBookCommendsearchOption = { ...state.addBookCommendsearchOption,
                ...data
            };
        },
        setAddBookCommendCount(state, data) {
            state.addBookCommendCount = data;
        },
    }
};

export default addBookCommend;