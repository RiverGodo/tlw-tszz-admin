'use strict';

import api from './config'


//获取图书推荐页列表
export function getBookRecommendList(argv) {
    let o = {};
    o.category_id = argv.category_id;
    o.years = argv.years;
    o.grade_id = argv.grade_id;
    if (argv.has_verify_code >= 0) {
        o.has_verify_code = argv.has_verify_code;
    }
    if (argv.has_online_test >= 0) {
        o.has_online_test = argv.has_online_test;
    }
    o.questionnaire_id = argv.questionnaire_id;
    if (argv.type === 2) {
        o.has_happy_buy = argv.has_happy_buy;
    }
    o.has_ex = argv.has_ex;
    o.title = argv.title;
    o.type = argv.type;
    o.state = argv.state;
    o.subject_id = argv.subject_id;
    o.page_index = argv.page_index - 1;
    o.page_size = argv.page_size;
    o.role_id = argv.role_id;
    return api.post('tool_book/getList', o);
}
//获取图书类别列表
export function getBookRecommendCategoryList() {
    return api.post('tool_book/getBookCategoryList');
}