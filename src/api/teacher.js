'use strict';

import api from './config'

// 获取教师列表
export function getTeacherList(argv) {
    return api.post('tool_teacher/getTeacherList', {
        state: argv.state,
        page_index: argv.page_index - 1,
        page_size: argv.page_size
    });
}
//添加教师
export function addOrUpdateTeacher(payload) {
    return api.post('tool_teacher/addOrUpdateTeacher', payload)
}
//删除
export function deleteTeacher(teacher_id) {
    return api.post('tool_teacher/deleteTeacher', 
        teacher_id
    );
}