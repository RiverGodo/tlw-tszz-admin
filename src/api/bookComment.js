'use strict';

import api from './config'

//获取评论列表
export function getCommentList(argv) {
    let payload = {
        book_id: argv.book_id,
        nickname: argv.nickname,
        book_name: argv.book_name,
        comment_content: argv.comment_content,
        state: argv.state,
        page_index: argv.page_index - 1,
        page_size: argv.page_size,
    }
    if (argv.book_type > 0) {
        payload.book_type = argv.book_type
    }
    return api.post('v2/tool_book_comment/getCommentList', payload);
}

//回复评论
export function replyComment(comment_id, content) {
    return api.post('v2/tool_book_comment/replyComment', {
        comment_id: comment_id,
        content: content
    });
}

//设置评论状态
export function updateCommentState(comment_id, state) {
    return api.post('v2/tool_book_comment/updateCommentState', {
        comment_id: comment_id,
        state: state
    });
}
//获取模拟评论列表
export function getMockBookCommentList(params) {
    return api.post('tool_mock_data/getMockBookCommentList', 
        params
    );
}
//添加模拟评论
export function addMockBookComment(params) {
    return api.post('tool_mock_data/addMockBookComment', params);
}
//删除评论
export function deleteMockBookComment(mock_id) {
    return api.post('tool_mock_data/deleteMockBookComment',mock_id);
}
//更新评论
export function updateMockBookComment(params) {
    return api.post('tool_mock_data/updateMockBookComment', params);
}
//获取随机昵称
export function getMockRandomResource(params) {
    return api.post('tool_mock_data/getMockRandomResource', params);
}