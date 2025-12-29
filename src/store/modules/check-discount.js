import * as apiCheckDiscountSubject from '@/api/check-discount-subject';
const checkDiscountSubject={
    state:{
        checkDiscountSubjectList: [],
        checkDiscountSubjectCount: 0,
        checkDiscountSubjectListLoading: false,
        checkDiscountSubjectsearchOption: {
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
        searchOption: {
            state: -1,
            // type:1,
            title: "",
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100],
        },
    },
    actions:{
        getCheckDiscountSubjectList({
            state,
            commit
        }, book_list) {
            if (state.checkDiscountSubjectListLoading) {
                return;
            }
            commit("setCheckDiscountSubjectListLoading");
            apiCheckDiscountSubject.getCheckDiscountSubjectList(state.checkDiscountSubjectsearchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        let list = res.msg.filter(item => {
                            return item.has_verify_code > 0
                        })
                        commit("setCheckDiscountSubjectCount", res.total_count);
                        // res.msg.forEach(item => {
                        //     if (book_list && book_list[state.checkDiscountSubjectsearchOption.page_index]) {
                        //         book_list[state.checkDiscountSubjectsearchOption.page_index].forEach(res_item => {
                        //             if (item.book_id == res_item) {
                        //                 item._checked = true;
                        //             }
                        //         });
                        //     }
                        // });
                        commit("setCheckDiscountSubjectList", list);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
    },
    mutations:{
        setCheckDiscountSubjectList(state, data) {
            state.checkDiscountSubjectListLoading = false;
            state.checkDiscountSubjectList = data;
        },
        setCheckDiscountSubjectListLoading(state, data) {
            state.checkDiscountSubjectListLoading = true;
        },
        CheckDiscountSubject_setPageIndex(state, data) {
            state.checkDiscountSubjectsearchOption.page_index = data;
        },
        CheckDiscountSubject_setPageSize(state, data) {
            state.checkDiscountSubjectsearchOption.page_size = data;
        },
        CheckDiscountSubject_setSearchForm(state, data) {
            state.checkDiscountSubjectsearchOption = { ...state.checkBookCommendsearchOption,
                ...data
            };
        },
        CheckDiscountSubject_setType(state, data) {
            state.checkDiscountSubjectsearchOption.type = data;
        },
        CheckDiscountSubject_setTitle(state, data) {
            state.checkDiscountSubjectsearchOption.title = data;
        },
        setCheckDiscountSubjectCount(state, data) {
            state.checkDiscountSubjectCount = data;
        },
    }
};

export default checkDiscountSubject;