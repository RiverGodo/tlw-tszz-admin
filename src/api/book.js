'use strict';

import api from './config'

//获取图书列表
export function getBookList(argv) {
  console.log(argv)
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
    if(argv.book_id){
      o.book_id = +argv.book_id
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
export function getOnlineTestList(params) {
//   {
//     content: content
// }
    return api.post('tool_book/getOnlineTestList', params)
}
//获取图书类别列表
export function getBookCategoryList() {
    return api.post('tool_book/getBookCategoryList');
}
//获取图书详情
export function getBookDetail(book_id) {
    return api.post('tool_book/getBookDetail', {
        book_id: book_id
    });
}
//设置图书状态
export function setBookState(payload) {
    return api.post('tool_book/setBookState', {
        book_id: payload.book_id,
        state: payload.state
    });
}
//删除图书
export function delBook(book_id_arr) {
    return api.post('tool_book/delBook', {
        book_id_arr: book_id_arr
    });
}
//添加或修改图书
export function addOrUpdateBook(argv) {
    let payload = {
        book_id: argv.book_id,
        title: argv.title,
        description: argv.description,
        img_url: argv.img_url,
        category_id_arr: argv.category_id_arr,
        subject_id: argv.subject_id,
        online_test_arr: argv.online_test_arr,
        years: argv.years,
        state: argv.state,
        grade_id: argv.grade_id,
        city_id_arr: argv.city_id_arr,
        has_verify_code: argv.has_verify_code,
        has_online_test: argv.has_online_test,
        has_ex: argv.has_ex,
        has_happy_buy: argv.has_happy_buy,
        type: argv.type,
        ex_role: argv.ex_role,
        ex_tooltip: argv.ex_tooltip,
        role_id: argv.role_id,
        price: argv.price,
        original_price: argv.original_price,
        point_price: argv.point_price,
        return_point: argv.return_point,
        teacher_id:argv.teacher_id,
        default_read_count: argv.default_read_count,   
        default_buy_count: argv.default_buy_count, 
    }
    argv.has_happy_buy > 0 && (payload.happy_buy_arr = argv.happy_buy_arr)
    return api.post('tool_book/addOrUpdateBook', payload);
}

//图书绑定资源
export function bindBookResource(book_id, resource_data_arr) {
    return api.post('tool_book/bindBookResource', {
        book_id: book_id,
        resource_data_arr: resource_data_arr
    });
}

//获取考试报名列表
export function getExamList() {
    return api.post('tool_book/getExamList')
}

//获取欢乐购列表
export function getHappyBuyList(book_id) {
    let payload = {
        book_id: book_id
    }
    return api.post('tool_book/getHappyBuyList', payload)
}

//图书置顶
export function setTop(book_id,top) {
    let payload = {
        book_id: book_id,
        top:top
    }
    return api.post('tool_book/setTop', payload)
}
//取消置顶
export function cancelTop(book_id,top) {
    let payload = {
        book_id: book_id,
        top:top
    }
    return api.post('tool_book/cancelTop', payload)
}

//获取图书资源展示名称
export function getBookResourceShowName(params) {
    let payload = {
        resource_id: params.resource_id,
        book_id: params.book_id
    }
    return api.post('/tool_book/getBookResourceShowName', payload)
}

//修改资源展示名称
export function updateBookResourceShowName(params) {
    let payload = {
        resource_id: params.resource_id,
        book_id: params.book_id,
        show_name: params.show_name
    }
    return api.post('/tool_book/updateBookResourceShowName', payload)
}

//获取小程序订单列表
export const getSuccessOrderList = function (params) {
    let payload = {
        book_name: params.book_name,
        user_id: params.user_id,
        order_id: params.order_id,
        phone: params.phone,
        page_index: params.page_index - 1,
        page_size: params.page_size,
        start_time:params.start_time,
        end_time:params.end_time,
    }
    return api.post('tool_book/getSuccessOrderList', payload)
}
//获取小程序码
export const getSmalProgramCode=function(params){
    let payload={
        book_id: params.book_id,
        origin: params.origin
    }
    return api.post('tool_book/reGetBookQrCode', payload)
}
//获取图书推荐列表
export function getBookCommendList(params) {
    return api.post('tool_book/getBookCommendList', params);
}
//设置图书推荐列表
export function setBookCommend(params) {
    return api.post('tool_book/setBookCommend', params);
}
//设置图书排序
export function setBookOrderBy(params) {
    return api.post('tool_book/setBookOrderBy', params);
}
//删除图书推荐
export function delBookCommend(book_commend_ids) {
    return api.post('tool_book/delBookCommend', {
        book_commend_ids: book_commend_ids
    });
}

//获取优惠券列表
export const getCouponList =function getCouponList(payload) {
    return api.get('tool_coupon/getCouponList',{params:{state: payload.state,type:payload.type,page_index:payload.page_index-1,page_size:payload.page_size}});
}
//添加优惠券
export function addOrUpdateCoupon(params) {
    let payload = {
        coupon_id:params.coupon_id,
        coupon_name:params.coupon_name,
        limited_amount:params.limited_amount,
        discount_amount:params.discount_amount,
        total_count:params.total_count,
        user_limited_count:params.user_limited_count,
        start_date:params.start_date,
        end_date:params.end_date,
        subject_id:params.subject_id,
        type:params.type,
        state: params.state,
        book_list:params.book_list
    }
    console.log(payload);
    return api.post('tool_coupon/addOrUpdateCoupon', payload)
}
//删除优惠券
export const deleteCoupon =function deleteCoupon(payload) {
    return api.get('tool_coupon/deleteCoupon',{params:{coupon_id: payload.id}});
}
//获取优惠券详情
export const getCouponDetail =function getCouponDetail(payload) {
    return api.get('tool_coupon/getCouponDetail', {params:{coupon_id: payload.id}});
}
//获取优惠券绑定的图书列表
export const getBookListByCouponId =function getBookListByCouponId(payload) {
    return api.get('tool_coupon/getBookListByCouponId', {params:{coupon_id: payload.coupon_id,type:payload.type}});
}

//导出抽奖数据
export const userFeedbackExport =function userFeedbackExport(payload) {
    return api.post('v2/export/userFeedback', payload);
}