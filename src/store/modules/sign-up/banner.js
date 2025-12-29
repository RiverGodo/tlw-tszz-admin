import * as apiSU from '../../../api/sign-up/banner'

const banner = {
    state: {
        signUpBannerList: [],
        signUpBannerListLoading: false,
    },
    actions: {
        getBookBannerList({
            state,
            commit
        }, payload) {
            commit("setSignUpBannerListLoading", false);
            apiSU.getBannerList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setSignUpBannerList", res.msg);
                    }
                    commit("setSignUpBannerListLoading", false);
                })
                .catch(reason => {
                    commit("setSignUpBannerListLoading", false);
                    console.error(reason)
                })
        }
    },
    mutations: {
        setSignUpBannerList(state, data) {
            state.signUpBannerListLoading = false;
            state.signUpBannerList = data;
        },
        clearBookBannerList(state) {
            state.signUpBannerList = [];
        },
        setSignUpBannerListLoading(state, data) {
            state.signUpBannerListLoading = data;
        }
    }
};

export default banner;