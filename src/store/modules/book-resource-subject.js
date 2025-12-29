import * as apiBookResourceSubject from '@/api/book-resource-subject'

const bookResourceSubject = {
    state: {
        resourceSubjectList: [],
        resourceSubjectTypeList: [],
        resourceSubjectCount: 0,
        resourceSubjectListLoading: false,
        searchOption: {
            book_id: 0,
            years: 0,
            grade_id: 0,
            city_id:0,
            subject_id: 0,
            type_id:0,
            name: "",
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100]
        }
    },
    actions: {
        getBookResourceSubjectList({ state, commit }, id_arr) {
            commit("setBookResourceSubjectListLoading");
            apiBookResourceSubject.getBookResourceList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookResourceSubjectCount", res.total_count);
                        res.msg.forEach(item => {
                            if(id_arr && id_arr[state.searchOption.page_index]){
                                id_arr[state.searchOption.page_index].forEach(res_item => {
                                if (item.resource_id == res_item) {
                                    item._checked = true;
                                }
                                });
                            }
                        });
                        commit("setBookResourceSubjectList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getBookResourceSubjectTypeList({ state, commit }, payload) {
            apiBookResourceSubject.getBookResourceTypeList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookResourceSubjectTypeList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        }
    },
    mutations: {
        setBookResourceSubjectList(state, data) {
            state.resourceSubjectListLoading = false;
            state.resourceSubjectList = data;
        },
        setBookResourceSubjectTypeList(state, data) {
            state.resourceSubjectTypeList = data;
        },
        setBookResourceSubjectListLoading(state, data) {
            state.resourceSubjectListLoading = true;
        },
        setBookResourceSubjectPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setBookResourceSubjectPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setBookResourceSubjectCount(state, data) {
            state.resourceSubjectCount = data;
        }
    }
};

export default bookResourceSubject;
