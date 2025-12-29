'use strict';

import api from '../config'

//获取练习列表
export function getExerciseList(argv) {
    return api.post('v2/tool_everyday_en_question/getExerciseList',argv);
}

//获取练习分析
export function getExerciseAnalysis(argv) {
    return api.post('v2/tool_everyday_en_question/getExerciseAnalysis',argv);
}

//添加或修改练习
export function addOrUpdateExercise(argv) {
    return api.post('v2/tool_everyday_en_question/addOrUpdateExercise',argv);
}
// //添加练习列表
// export function addExercise(argv) {
//     return api.post('tool_everyday_en_question/addExercise',argv);
// }
// //更新练习
// export function updateExercise(argv) {
//     return api.post('tool_everyday_en_question/updateExercise',argv);
// }
//获取练习详情
export function getExerciseDetail(exercise_id) {
    return api.post('v2/tool_everyday_en_question/getExerciseDetail',{
        exercise_id:exercise_id
    });
}
//删除练习
export function delExercise(exercise_id) {
    return api.post('v2/tool_everyday_en_question/delExercise',{
        exercise_id:exercise_id
    });
}
//添加tag
// export function addTag(tag_content) {
//     return api.post('tool_everyday_en_question/addTag',{
//         tag_content:tag_content
//     });
// }

