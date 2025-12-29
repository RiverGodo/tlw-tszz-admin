'use strict';

import api from './config'



//获取课程列表
export function getCheckDiscountSubjectList(argv) {
    if (argv.has_verify_code >= 0) {
        argv.has_verify_code = argv.has_verify_code;
    }
    if (argv.has_online_test >= 0) {
        argv.has_online_test = argv.has_online_test;
    }
    if (argv.type === 2) {
        argv.has_happy_buy = argv.has_happy_buy;
    }
    return api.post('tool_book/getList', argv);
}

// 正版验证绑定优惠券
export function bindVertifyBookOfCoupon(options) {
    return api.post('tool_coupon/setVertifyBookOfCoupon', options);
}