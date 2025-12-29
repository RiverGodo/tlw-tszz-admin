'use strict';

import api from '../config'

//获取评论列表
export function getCommentList(argv) {
    return api.post('tool_everyday_en_comment/getCommentList',{
        product_id:argv.article_id,
        nickname: argv.nickname,
        product_name: argv.product_name,
        comment_content: argv.comment_content,
        state: argv.state,
        page_index: argv.page_index-1,
        page_size: argv.page_size
    });
}

//回复评论
export function replyComment(comment_id,content) {
    return api.post('tool_everyday_en_comment/replyComment', {
        comment_id: comment_id,
        content: content
    });
}

//设置评论状态
export function hiddenOrShowComment(comment_id,state) {
    return api.post('tool_everyday_en_comment/hiddenOrShowComment', {
        comment_id: comment_id,
        state: state
    });
}
