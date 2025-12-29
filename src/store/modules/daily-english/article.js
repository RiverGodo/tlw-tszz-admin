import * as apiDE from '../../../api/daily-english/article'
const articleTypeList = [
    {
        type_id:1,
        name:"图文"
    },{
        type_id:2,
        name:"视频"
    },{
        type_id:3,
        name:"音频"
    },{
        type_id:5,
        name: '直播'
    }
];
const articleOriginList =[
    {
        origin_id:1,
        name:"原创"
    },{
        origin_id:2,
        name:"整理"
    },{
        origin_id:3,
        name:"转载"
    },{
        origin_id:4,
        name:"其他"
    }
];
const article = {
    state: {
        articleList:[],
        articleTagList:[],
        articleTypeList:articleTypeList,
        articleOriginList:articleOriginList,
        articleCount: 0,
        articleListLoading: false,
        searchOption: {
            state: -1,
            type: 0,
            tags:[],
            name: "",
            page_index: 1,
            page_size: 10,
            page_size_opts: [10, 20,50,100]
        },
        addarticleForm: {
            title: "",
            img_url: "",
            description: "",
            origin: 2,
            open_time: "",
            state: 1
        }
    },
    getters: {
        articleTypeListSelect:state =>[
            {
                type_id:0,
                name:"选择类型"
            },
            ...state.articleTypeList
        ]
    },
    actions: {
        getArticleList({ state, commit }, payload) {
            commit("setArticleListLoading");
            apiDE.getArticleList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setArticleCount", res.msg.total_count);
                        commit("setArticleList", res.msg.products);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getArticleTagList({ state, commit }, payload) {
            apiDE.getArticleTagList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setArticleTagList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        }
    },
    mutations: {
        setArticleTagList(state, data) {
            state.articleTagList = data;
        },
        setArticleList(state, data) {
            state.articleListLoading = false;
            state.articleList = data;
        },
        clearArticleList(state) {
            state.articleList = [];
        },
        setArticleListLoading(state, data) {
            state.articleListLoading = true;
        },
        setArticlePageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setArticlePageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setArticleCount(state, data) {
            state.articleCount = data;
        }
    }
};

export default article;
