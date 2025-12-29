import * as apiEv from '@/api/event-stat'

const eventStat = {
    state: {
        eventList:[],
        eventListLoading:false,
        eventCount: 0,
        searchOption: {
            page_index: 1,
            page_size: 20,
            page_size_opts: [10, 50, 100]
        },
    },
    actions: {
        geteventList({ state, commit }, payload) {
            commit("setEventListLoading", true);
            apiEv.getEventList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setEventCount", res.data);
                        commit("setEventList", res.data);
                    }
                    commit("setEventListLoading", false);
                })
                .catch(reason => {
                    commit("setEventListLoading", false);
                    console.error(reason)
                })
        }
    },
    mutations: {
        setEventList(state, data) {
            state.eventListLoading = false;
            state.eventList = data.data;
        },
        setEventListLoading(state, data) {
            state.eventListLoading = data;
        },
        setEventCount(state, data) {
            state.eventCount = data.total_count;
        },
        Evnet_setPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        Evnet_setPageSize(state, data) {
            state.searchOption.page_size = data;
        },
    }
};

export default eventStat;
