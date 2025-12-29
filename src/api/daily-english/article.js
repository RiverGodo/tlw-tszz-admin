'use strict';

import api from '../config'
import moment from 'moment'

//获取文章列表
export function getArticleList(argv) {
    return api.post('tool_product/getProductList', {
        state: argv.state,
        type: argv.type,
        name: argv.name,
        tags: argv.tags,
        page_index: argv.page_index - 1,
        page_size: argv.page_size
    });
}
//获取文章tag列表
export function getArticleTagList(argv) {
    return api.post('tool_product/getTagList');
}

//获取图书详情
export function getArticleDetail(article_id) {
    return api.post('tool_product/getProductDetail', {
        product_id: article_id
    });
}

//创建文章
export function createArticle(argv) {
    return api.post('tool_product/createProduct', {
        name: argv.name,
        short_desc: argv.short_desc,
        exercise_id: argv.exercise_id,
        description: "",
        cover_img: argv.cover_img,
        detail: argv.detail,
        online_resource_url: argv.online_resource_url,
        state: argv.state,
        type: argv.type,
        tags: argv.tags,
        content_type: argv.content_type,
        open_time: argv.open_time,
        from: argv.from,
        original_price: argv.original_price,
        price: argv.price,
        bonus_ratio: 0,
        is_try_view: argv.is_try_view,
        online_resource_ex: argv.online_resource_ex,
        online_resource_stream_url: argv.online_resource_stream_url,
        start_time: argv.start_time,
        end_time: argv.end_time,
        teacher_name: argv.teacher_name
    });
}

//更新文章
export function updateArticle(argv) {
    let params = {
        product_id: argv.article_id,
        name: argv.name,
        exercise_id: argv.exercise_id,
        short_desc: argv.short_desc,
        cover_img: argv.cover_img,
        detail: argv.detail,
        resource_url: argv.resource_url,
        state: argv.state,
        type: argv.type,
        tags: argv.tags,
        from: argv.from,
        content_type: argv.content_type,
        open_time: argv.open_time,
        original_price: argv.original_price,
        price: argv.price,
        is_can_single_buy: argv.is_can_single_buy,
        bonus_ratio: 0,
        is_try_view: argv.is_try_view,
        online_resource_ex: argv.online_resource_ex,
        online_resource_stream_url: argv.online_resource_stream_url,
        online_resource_url: argv.online_resource_url,
        start_time: argv.start_time,
        end_time: argv.end_time,
        teacher_name: argv.teacher_name
    }
    return api.post('tool_product/updateProduct', params);
}
//设置文章状态
export function setArticleState(article_id, state) {
    return api.post('tool_product/setProductState', {
        product_id: article_id,
        state: state
    });
}

//移除文章
export function removeArticle(article_id) {
    return api.post('tool_product/removeProductSingleBuy', {
        product_id: article_id
    });
}

//删除文章
export function deleteArticle(article_id) {
    return api.post('tool_product/delProduct', {
        product_id: article_id
    });
}