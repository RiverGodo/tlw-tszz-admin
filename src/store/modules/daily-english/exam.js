import * as api from '../../../api/daily-english/exam'
const examTypeList =[{
    type_id:1,
    name:"套题"
},{
    type_id:2,
    name:"专题训练"
}];
const exam = {
    state: {
        examList: [],
        examListLoading: false,
        examCount: 0,
        examTypeList:examTypeList,
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
        },
        qidList:[],
        questionList:[],
        questionNum:1,
        questionCategoryNumList:["一","二","三","四","五","六","七","八","九","十"]
    },
    getters: {
        examTypeListSelect: state => [
            {
                type_id:0,
                name:"判卷类型"
            },
            ...state.examTypeList
        ]
    },
    actions: {
        getExamList({ state, commit }, payload) {
            commit("setExamListLoading");
            let option = JSON.parse(JSON.stringify(state.searchOption));
            option.page_index = option.page_index-1;
            api.getExerciseList(option)
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setExamCount", res.msg.total_count);
                        commit("setExamList", res.msg.exercises);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
    },
    mutations: {
        setExamPageIndex(state, data) {
            state.searchOption.page_index = data;
        },
        setExamPageSize(state, data) {
            state.searchOption.page_size = data;
        },
        setExamList(state, data) {
            state.examList = data;
            state.examListLoading = false;
        },
        setExamListLoading(state, data) {
            state.examListLoading = true;
        },
        setExamCount(state, data) {
            state.examCount = data;
        },
        setExamQidList(state, data) {
            state.qidList = data;
        },
        clearQuestionList(state){
            state.qidList = [];
            state.questionList = [];
            state.questionNum = 1;
        },
        delExamQuestion(state,ques_id){
            let beginChangeNum = false;
            let cateIndex = 0;
            let quesIndex = 0;
            state.questionNum = 1;
            state.questionList.forEach((cate,cate_idx) =>{
                let default_score = 0;
                let quesCount = 0;
                cate.list.forEach((ques,ques_idx) => { 
                    if(ques_id == ques.question_id){
                        cateIndex = cate_idx;
                        quesIndex = ques_idx;
                        beginChangeNum = true;
                    }else{
                        default_score+=ques.default_score;
                        if(ques.group_type == 1){
                            quesCount ++;
                            ques.quesHtml = ques.quesHtml.replace(/>\d?\d\./,">"+state.questionNum+".");
                            state.questionNum++;
                        }else{
                            quesCount+= ques.questionList.length;
                            let arr = ques.content.split(/<u[^>]*>\s*[0-9]?[0-9]\s*<\/u>/);
                            ques.content = "";
                            ques.questionList = ques.questionList.map((e,i) =>{
                                let q = {};
                                q.html = e.html.replace(/>\d?\d\./,">"+state.questionNum+".");
                                q.default_score = e.default_score;
                                ques.content += arr[i]+ "<u>&nbsp;&nbsp;&nbsp;&nbsp;"+state.questionNum+"&nbsp;&nbsp;&nbsp;&nbsp;</u>";
                                if(i == (arr.length -1)){
                                    ques.content += arr[i+1];
                                }
                                state.questionNum++;
                                return q;
                            }); 
                        }
                    }                   
                });
                //如果该类别下删除了数据，重新计算总分
                if(beginChangeNum){
                    cate.default_score = default_score;
                    cate.quesCount = quesCount;
                }
            });
            state.questionList[cateIndex].list.splice(quesIndex,1);
            if(state.questionList[cateIndex].list.length == 0){
                state.questionList.splice(cateIndex,1);
            }
            state.qidList = state.qidList.filter(e => e != ques_id);
        },
        addQuestionToExam(state,ques){
            //暂时支持添加10种题型
            if(state.questionList.length ==10){
                return;
            }
            let hasPush = false;
            for(let i = 0; i< state.questionList.length;i++){
                if(ques.category_id == state.questionList[i].category_id){
                    state.questionList[i].default_score += ques.default_score;//分数                    
                    if(ques.group_type == 1){
                        state.questionList[i].quesCount ++;//数量
                        ques.quesHtml = "<p><span>"+state.questionNum+".&nbsp;</span>"+ques.quesHtml.substr(3);   
                        state.questionNum++;                                     
                    }else{
                        state.questionList[i].quesCount +=ques.questionList.length;//数量
                        let arr = ques.content == "" ? []:ques.content.split(/<u[^>]*>\s*[0-9]?[0-9]\s*<\/u>/);
                        ques.content = "";
                        ques.questionList = ques.questionList.map((e,i) =>{
                            let q = {};
                            q.html = e.html.replace(/>\d?\d\./,">"+state.questionNum+".");
                            q.default_score = e.default_score;
                            if(arr.length>1){
                                ques.content += arr[i]+ "<u>&nbsp;&nbsp;&nbsp;&nbsp;"+state.questionNum+"&nbsp;&nbsp;&nbsp;&nbsp;</u>";
                                if(i == (arr.length -1)){
                                    ques.content += arr[i+1];
                                }
                            }else{
                                ques.content = arr[0];
                            }
                            state.questionNum++;
                            return q;
                        });  
                    }
                    state.questionList[i].list.push(ques);
                    state.qidList.push(ques.question_id);
                    hasPush = true;
                    break;
                }
            }
            if(!hasPush){
                var newQues = {};
                newQues.category_id = ques.category_id;
                newQues.category_name = ques.category_name;
                newQues.default_score = ques.default_score;
                if(ques.group_type == 1){
                    newQues.quesCount = 1;
                    ques.quesHtml = "<p><span>"+state.questionNum+".&nbsp;</span>"+ques.quesHtml.substr(3);   
                    state.questionNum++;                                     
                }else{
                    newQues.quesCount = ques.questionList.length;
                    let arr = ques.content == "" ? []:ques.content.split(/<u[^>]*>\s*[0-9]?[0-9]\s*<\/u>/);
                    ques.content = "";
                    ques.questionList = ques.questionList.map((e,i) =>{
                        let q = {};
                        q.html = e.html.replace(/>\d?\d\./,">"+state.questionNum+".");
                        q.default_score = e.default_score;
                        if(arr.length > 1){
                            ques.content += arr[i]+ "<u>&nbsp;&nbsp;&nbsp;&nbsp;"+state.questionNum+"&nbsp;&nbsp;&nbsp;&nbsp;</u>";
                            if(i == (arr.length -1)){
                                ques.content += arr[i+1];
                            }
                        }else{
                            ques.content = arr[0];
                        }
                        state.questionNum++;
                        return q;
                    });
                }
                newQues.list = [];
                newQues.list.push(ques);
                state.questionList.push(newQues);
                state.qidList.push(ques.question_id);                
            }
            // console.log(state.questionList);
        }
    }
};

export default exam;
