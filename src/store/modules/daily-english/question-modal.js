import * as api from '../../../api/daily-english/question'
import Format from "@/libs/format";

const question = {
    state: {
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
        }
    },
    actions: {
        getModalQuestionList({ state, commit }, qidList) {
            commit("setModalQuestionListLoading");
            api.getQuestionList(state.searchOption)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setModalQuestionCount", res.total_count);
                        commit("setModalQuestionList", res.msg);
                        commit("setModalQuestionListAddState", qidList);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
    },
    mutations: {
        setModalQuestionPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setModalQuestionPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setModalQuestionList(state, data) {
            // state.questionList = data;
            state.questionListLoading = false;            
            state.questionList = [];
            if (data.length == 0) return;
            state.questionList = Format.QuestionListToHtml(data);
        },
        setModalQuestionListAnswerState(state,idx){
            state.questionList[idx].showAnswer = !state.questionList[idx].showAnswer;
        },
        setModalQuestionListAddState(state,qidList){
            if(!qidList) return;            
            if(qidList.length == 0) return;
            state.questionList.forEach(element => {
                if(qidList.includes(element.question_id)){
                    element.isAdd = true;
                }else{
                    element.isAdd = false;
                }
            });
        },
        setModalQuestionListLoading(state, data) {
            state.questionListLoading = true;
        },
        setModalQuestionCount(state, data) {
            state.questionCount = data;
        }
    }
};

export default question;
