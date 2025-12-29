import * as api from '@/api/bookResource'

const bookResourceModal = {
    state: {
        resourceList: [],
        resourceCount: 0,
        resourceListLoading: false,
        searchOption: {
            book_id: 0,
            years: 0,
            grade_id: 0,
            subject_id: 0,
            type_id:0,
            name: "",
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100]
        }
    },
    actions: {
        getBookResourceModalList({ state, commit }, payload) {
            commit("setBookResourceModalListLoading");
            api.getBookResourceList(state.searchOption)
            .then(res => {
                if (res.res_code == 1) {
                    commit("setBookResourceModalCount", res.total_count);
                    commit("setBookResourceModalList", res.msg);
                }
            })
            .catch(reason => {
                console.error(reason)
            })
        }
    },
    mutations: {
        setBookResourceModalList(state, data) {
            state.resourceListLoading = false;
            state.resourceList = data;
        },
        clearBookResourceModalList(state){
            state.resourceList = []
            state.resourceCount = 0;            
        },
        setBookResourceModalListLoading(state, data) {
            state.resourceListLoading = true;
        },
        setBookResourceModalSearchOption(state, data) {
            state.searchOption = data;
        },
        setBookResourceModalCount(state, data) {
            state.resourceCount = data;
        }
    }
};

export default bookResourceModal;
