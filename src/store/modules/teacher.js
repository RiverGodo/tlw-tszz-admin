import * as apiTe from '@/api/teacher'

const teacher = {
    state: {
        teacherList:[],
        teacherListLoading:false,
        teacherCount: 0,
        searchOption: {
            page_index: 1,
            page_size: 20,
            page_size_opts: [20, 50, 100]
        },
    },
    actions: {
        getTeacherList({ state, commit }, payload) {
            commit("setTeacherListLoading", true);
            apiTe.getTeacherList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setTeacherCount", res.data);
                        commit("setTeacherList", res.data);
                    }
                    commit("setTeacherListLoading", false);
                })
                .catch(reason => {
                    commit("setTeacherListLoading", false);
                    console.error(reason)
                })
        }
    },
    mutations: {
        setTeacherList(state, data) {
            state.teacherListLoading = false;
            state.teacherList = data.teacher_list;
        },
        setTeacherListLoading(state, data) {
            state.teacherListLoading = data;
        },
        setTeacherCount(state, data) {
            state.teacherCount = data.count;
        },
        Teacher_setPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        Teacher_setPageSize(state, data) {
            state.searchOption.page_size = data;
        },
    }
};

export default teacher;
