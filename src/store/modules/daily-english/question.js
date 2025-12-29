import * as api from '../../../api/daily-english/question'
import Format from "@/libs/format";
// import format from '../../../libs/format';
const answerTypeList = [
    {
    type_id:1,
    name:"选择题"
    },
    {
        type_id:2,
        name:"多选"
    },
    {
        type_id:3,
        name:"填空题"
    }
]
const question = {
    state: {
        questionCategoryList: [],
        questionCategoryListLoading: false,
        questionList: [],
        questionListLoading: false,
        questionCount: 0,
        searchOption: {
            category_id: 1,
            level_min: 0,
            level_max: 1,
            from:"",
            knowledge_point_id: 0,
            page_index: 1,
            page_size: 10,
            page_size_opts: [10, 20, 50, 100]
        },
        answerTypeList: answerTypeList.filter(e => e.type_id!=2),
        answerNumList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    },
    actions: {
        getQuestionCategoryList({ state, commit }, payload) {
            commit("setQuestionCategoryListLoading");
            api.getQuestionCategoryList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setQuestionCategoryList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getQuestionList({ state, commit }, payload) {
            commit("setQuestionListLoading");
            api.getQuestionList(state.searchOption)
            .then(res => {
                if (res.res_code == 1) {
                    commit("setQuestionCount", res.total_count);
                    commit("setQuestionList", res.msg);
                }
            })
            .catch(reason => {
                console.error(reason)
            })
        },
    },
    mutations: {
        setQuestionCategoryList(state, data) {
            state.questionCategoryListLoading = false;
            state.questionCategoryList = data;
        },
        setQuestionCategoryListLoading(state, data) {
            state.questionCategoryListLoading = true;
        },
        setQuestionPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setQuestionPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setQuestionList(state, data) {
            // state.questionList = data;
            state.questionListLoading = false;            
            state.questionList = [];
            if (data.length == 0) return;
            state.questionList = Format.QuestionListToHtml(data);
        },
        setQuestionListAnswerState(state,idx){
            state.questionList[idx].showAnswer = !state.questionList[idx].showAnswer;
        },
        setQuestionListLoading(state, data) {
            state.questionListLoading = true;
        },
        setQuestionCount(state, data) {
            state.questionCount = data;
        }
    }
};

export default question;
