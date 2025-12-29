import * as apiBookResource from '@/api/bookResource'

const bookResource = {
    state: {
        resourceList: [],
        resourceTypeList: [],
        resourceCount: 0,
        resourceListLoading: false,
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
    getters: {
        resourceTypeListSelect:state =>[
            {
                type_id: 0,
                name: "选择资源类型"
            },
            ...state.resourceTypeList
        ]
    },
    actions: {
        getBookResourceList({ state, commit }, id_arr) {
            commit("setBookResourceListLoading");
            apiBookResource.getBookResourceList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookResourceCount", res.total_count);
                        res.msg.forEach(item => {
                            if(id_arr && id_arr[state.searchOption.page_index]){
                                id_arr[state.searchOption.page_index].forEach(res_item => {
                                if (item.resource_id == res_item) {
                                    item._checked = true;
                                }
                                });
                            }
                        });
                        commit("setBookResourceList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getBookResourceTypeList({ state, commit }, payload) {
            apiBookResource.getBookResourceTypeList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookResourceTypeList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        }
    },
    mutations: {
        setBookResourceList(state, data) {
            state.resourceListLoading = false;
            state.resourceList = data;
        },
        setBookResourceTypeList(state, data) {
            state.resourceTypeList = data;
        },
        setBookResourceListLoading(state, data) {
            state.resourceListLoading = true;
        },
        setBookResourcePageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setBookResourcePageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setBookResourceCount(state, data) {
            state.resourceCount = data;
        }
    }
};

export default bookResource;
