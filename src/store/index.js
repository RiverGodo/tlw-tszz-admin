import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import book from './modules/book';
import bookCommend from './modules/book-commend';
import addBookCommend from './modules/add-book-commend';
import bookResource from './modules/book-resource';
import bookResourceModal from './modules/book-resource-modal';
import deArticle from './modules/daily-english/article';
import deCategory from './modules/daily-english/category';
import deBanner from './modules/daily-english/banner';
import deQuestion from './modules/daily-english/question';
import deModalQuestion from './modules/daily-english/question-modal';
import deExam from './modules/daily-english/exam';
import deExamModal from './modules/daily-english/exam-modal';
import bookResourceSubject from './modules/book-resource-subject';
// 又将反馈
import feedback from './modules/feedback';
// 验证码
import codeCategory from './modules/code-category';
// 增值图书banner
import bookBanner from './modules/banner';
//订单
import order from './modules/sign-up/order'
import product from './modules/sign-up/product'
import sale from './modules/sign-up/sale'
import signUpBanner from './modules/sign-up/banner'
//聊天室
import chat from './modules/chat'
//优惠券
import discount from './modules/discount';
import addDiscountSubject from './modules/add-discount-subject';
import checkDiscountSubject from './modules/check-discount';
//教师
import teacher from './modules/teacher';
//统计
import eventStat from './modules/event-stat'; 

Vue.use(Vuex);

const store = new Vuex.Store({
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
        user,
        book,
        bookCommend,
        addBookCommend,
        bookResource,
        bookResourceModal,
        deArticle,
        deCategory,
        deBanner,
        deQuestion,
        deModalQuestion,
        deExam,
        deExamModal,
        feedback,
        codeCategory,
        bookBanner,
        order,
        product,
        sale,
        chat,
        signUpBanner,
        discount,
        addDiscountSubject,
        teacher,
        eventStat,
        bookResourceSubject,
        checkDiscountSubject
    }
});

export default store;