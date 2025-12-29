import * as apiDE from '../../api/banner'

const banner = {
    state: {
        bannerBookList:[],
        bannerBookListLoading:false,
    },
    actions: {
        getBookBannerList({ state, commit }, payload) {
            commit("setBookBannerListLoading", false);
            apiDE.getBannerList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBookBannerList", res.msg);
                    }
                    commit("setBookBannerListLoading", false);
                })
                .catch(reason => {
                    commit("setBookBannerListLoading", false);
                    console.error(reason)
                })
        }
    },
    mutations: {
        setBookBannerList(state, data) {
            state.bannerBookListLoading = false;
            state.bannerBookList = data;
        },
        clearBookBannerList(state) {
            state.bannerBookList = [];
        },
        setBookBannerListLoading(state, data) {
            state.bannerBookListLoading = data;
        }
    }
};

export default banner;
