import * as api from '../../../api/daily-english/exam'

const exam = {
    state: {
        examList: [],
        examListLoading: false,
        examCount: 0,
        searchOption: {
            grade_id: -1,
            level_min: 0,
            level_max: 1,
            from:"",
            exam_name: "",
            exercise_type:0,
            page_index: 1,
            page_size: 10,
            page_size_opts: [10, 20, 50, 100]
        }
    },
    actions: {
        getModalExamList({ state, commit }, payload) {
            commit("setModalExamListLoading");
            let option = JSON.parse(JSON.stringify(state.searchOption));
            option.page_index = option.page_index-1;
            api.getExerciseList(option)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setModalExamCount", res.msg.total_count);
                        commit("setModalExamList", res.msg.exercises);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
    },
    mutations: {
        setModalExamPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setModalExamPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setModalExamList(state, data) {
            state.examList = data;
            state.examListLoading = false;
        },
        setModalExamListLoading(state, data) {
            state.examListLoading = true;
        },
        setModalExamCount(state, data) {
            state.examCount = data;
        }
    }
};

export default exam;
