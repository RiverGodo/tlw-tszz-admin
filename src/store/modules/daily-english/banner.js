import * as apiDE from '../../../api/daily-english/banner'

const banner = {
    state: {
        bannerList:[],
        bannerListLoading:false,
    },
    actions: {
        getBannerList({ state, commit }, payload) {
            commit("setBannerListLoading", true);
            apiDE.getBannerList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setBannerList", res.msg);
                    }
                    commit("setBannerListLoading", false);
                })
                .catch(reason => {
                    commit("setBannerListLoading", false);
                    console.error(reason)
                })
        }
    },
    mutations: {
        setBannerList(state, data) {
            state.bannerListLoading = false;
            state.bannerList = data;
        },
        clearBannerList(state) {
            state.bannerList = [];
        },
        setBannerListLoading(state, data) {
            state.bannerListLoading = data;
        }
    }
};

export default banner;
