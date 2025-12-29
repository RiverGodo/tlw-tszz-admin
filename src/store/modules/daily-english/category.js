import * as apiDE from '../../../api/daily-english/category'

const category = {
    state: {
        categoryList: [],
        categoryTypeList: [],
        categoryCount: 0,
        categoryListLoading: false,
        searchOption: {
            state: -1,
            package_category_id: -1,
            name: "",
            page_index: 1,
            page_size: 999,
        },
        categoryDetail: {},
        categoryDetailLoading: {},
        articleList: [],
        articleCount: 0,
        articleListLoading: false,
        articleSearchOption: {
            state: -1,
            type: 0,
            name: "",
            category_id: -1,
            page_index: 1,
            page_size: 10,
            page_size_opts: [10, 20, 50, 100]
        }
    },
    getters: {
        categoryTypeListSelect: state => [{
            package_category_id: -1,
            package_category_name: "选择类型",
            package_category_icon_url: ""
        }, ...state.categoryTypeList]
    },
    actions: {
        getCategoryList({
            state,
            commit
        }, payload) {
            commit("setCategoryListLoading");
            apiDE.getCategoryList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setCategoryCount", res.msg.packages.length);
                        commit("setCategoryList", res.msg.packages);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getCategoryTypeList({
            state,
            commit
        }, payload) {
            apiDE.getCategoryTypeList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setCategoryTypeList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getCategoryDetail({
            state,
            commit
        }, cid) {
            commit("setCategoryDetailLoading");
            apiDE.getCategoryDetail(cid)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setCategoryDetail", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getCategoryArticleList({
            state,
            commit
        }, payload) {
            commit("setCategoryArticleListLoading");
            apiDE.getArticleList(state.articleSearchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setCategoryArticleCount", res.msg.total_count);
                        commit("setCategoryArticleList", res.msg.products);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        }
    },
    mutations: {
        setCategoryList(state, data) {
            state.categoryListLoading = false;
            state.categoryList = data;
        },
        setCategoryTypeList(state, data) {
            state.categoryTypeList = data;
        },
        clearCategoryList(state) {
            state.categoryList = [];
        },
        setCategoryListLoading(state, data) {
            state.categoryListLoading = true;
        },
        setCategoryPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setCategoryPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setCategoryCount(state, data) {
            state.categoryCount = data;
        },
        setCategoryArticleList(state, data) {
            state.articleListLoading = false;
            state.articleList = data;
        },
        clearCategoryArticleList(state) {
            state.articleList = [];
        },
        setCategoryArticleListLoading(state, data) {
            state.articleListLoading = true;
        },
        setCategoryArticlePageIndex(state, data) {
            state.articleSearchOption.page_index = data;
        },
        setCategoryArticlePageSize(state, data) {
            state.articleSearchOption.page_size = data;
        },
        setCategoryArticleCount(state, data) {
            state.articleCount = data;
        },
        setCategoryDetail(state, data) {
            state.categoryDetailLoading = false;
            state.categoryDetail = data;
        },
        setCategoryDetailLoading(state, data) {
            state.categoryDetailLoading = true;
        }
    }
};

export default category;