'use strict';

import api from '../config'
//获取知识点列表
export function getKnowledgePointList() {
  return api.post('v2/tool_everyday_en_question/getKnowledgePointList');
}
// 获取知识点父级解构
export function getKnowledgePointParent(id){
  return api.post('v2/tool_everyday_en_question/getKnowledgePointParent',{
    id:id
  })
}
//获取题型列表
export function getQuestionCategoryList() {
  return api.post('tool_everyday_en_question/getQuestionCategoryList');
}
//添加单提
// export function addSingleQuestion(argv) {
//     return api.post('tool_everyday_en_question/addSingleQuestion', {
//         category_id: argv.category_id,
//         level: argv.level,
//         content: argv.content,
//         title: argv.title,
//         options: argv.options,
//         answer: argv.answer,
//         analysis: argv.analysis,
//         default_score: argv.default_score,
//         from: argv.from,
//         knowledge_point_id: argv.knowledge_point_id,
//         grade_id: argv.grade_id,
//         more: argv.more,
//     });
// }
//添加题组
// export function addGroupQuestion(argv) {
//     return api.post('tool_everyday_en_question/addGroupQuestion', {
//         question_article_content: argv.question_article_content,
//         question_article_url: argv.question_article_url,
//         questions: argv.questions
//     });
// }

//获取试题列表
export function getQuestionList(argv) {
  return api.post('v2/tool_everyday_en_question/getQuestionList', {
    category_id: argv.category_id,
    level_min: argv.level_min,
    level_max: argv.level_max,
    from: argv.from,
    knowledge_point_id: argv.knowledge_point_id,
    page_index: argv.page_index - 1,
    page_size: argv.page_size
  });
}
//获取试题详情
export function getQuestionDetail(question_id) {
  return api.post('v2/tool_everyday_en_question/getQuestionDetail', {
    question_id: question_id
  });
}

//修改单题试题详情
// export function updateSingleQuestion(argv) {
//     return api.post('tool_everyday_en_question/updateSingleQuestion', argv);
// }
//修改套题试题详情
// export function updateGroupQuestion(argv) {
//     return api.post('tool_everyday_en_question/updateGroupQuestion', argv);
// }

//检测试题是否已经加入练习
export function checkInExercise(ques_id) {
  return api.post('v2/tool_everyday_en_question/checkInExercise', {
    question_id: ques_id
  });
}
//删除试题
export function deleteQuestion(ques_id) {
  return api.post('v2/tool_everyday_en_question/delQuestion', {
    question_id: ques_id
  });
}

///v2.0接口
export function addOrUpdateQuestion(params) {
  return api.post('v2/tool_everyday_en_question/addOrUpdateQuestion', params);
}