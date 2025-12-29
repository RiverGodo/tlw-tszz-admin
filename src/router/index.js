import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import { routers } from './router';
import Cookies from 'js-cookie';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    // console.log(to);
    next();
    //是否登录
    // if(Cookies.get('islogin')){
    //     //已登录，前往登陆页则跳转默认页
    //     if(to.name === 'login'){
    //         next({
    //             name: 'home_index'
    //         });
    //     }else{
    //         if(to.meta.access){
    //             let userInfo = Cookies.get('userInfo');
    //             if(userInfo){
    //                 let userInfo_arr = JSON.parse(userInfo);
    //                 if(Util.showThisRoute(to.meta.access, userInfo_arr.role_arr)){
    //                     next();
    //                 }else{
    //                     next({
    //                         replace: true,
    //                         name: 'error-403'
    //                     });
    //                 }
    //             }else{
    //                 next({
    //                     name: 'login',
    //                     query: { redirect: to.fullPath }
    //                 });
    //             }
    //         }else{
    //             next();
    //         }
            
            
    //     }
    // }else{
    //     //未登录，如果页面需要登录，则跳登陆页
    //     if(to.meta.requiresAuth){
    //         next({
    //             name: 'login',
    //             query: { redirect: to.fullPath }
    //         });
    //     }else{
    //         next();
    //     }
    // }
});

router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
