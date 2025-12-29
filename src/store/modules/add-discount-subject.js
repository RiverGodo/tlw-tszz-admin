import * as apiAddDiscountSubject from '@/api/add-discount-subject';
const addDiscountSubject={
    state:{
        addDiscountSubjectList: [],
        addDiscountSubjectCount: 0,
        addDiscountSubjectListLoading: false,
        addDiscountSubjectsearchOption: {
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
        getAddDiscountSubjectList({
            state,
            commit
        }, book_list) {
            if (state.addDiscountSubjectListLoading) {
                return;
            }
            commit("setAddDiscountSubjectListLoading");
            apiAddDiscountSubject.getAddDiscountSubjectList(state.addDiscountSubjectsearchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setAddDiscountSubjectCount", res.total_count);
                        res.msg.forEach(item => {
                            if (book_list && book_list[state.addDiscountSubjectsearchOption.page_index]) {
                                book_list[state.addDiscountSubjectsearchOption.page_index].forEach(res_item => {
                                    if (item.book_id == res_item) {
                                        item._checked = true;
                                    }
                                });
                            }
                        });
                        commit("setAddDiscountSubjectList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
    },
    mutations:{
        setAddDiscountSubjectList(state, data) {
            state.addDiscountSubjectListLoading = false;
            state.addDiscountSubjectList = data;
        },
        setAddDiscountSubjectListLoading(state, data) {
            state.addDiscountSubjectListLoading = true;
        },
        AddDiscountSubject_setPageIndex(state, data) {
            state.addDiscountSubjectsearchOption.page_index = data;
        },
        AddDiscountSubject_setPageSize(state, data) {
            state.addDiscountSubjectsearchOption.page_size = data;
        },
        AddDiscountSubject_setSearchForm(state, data) {
            state.addDiscountSubjectsearchOption = { ...state.addBookCommendsearchOption,
                ...data
            };
        },
        setAddDiscountSubjectCount(state, data) {
            state.addDiscountSubjectCount = data;
        },
    }
};

export default addDiscountSubject;