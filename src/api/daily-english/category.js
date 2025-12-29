'use strict';

import api from '../config'

//获取专栏列表
export function getCategoryList(argv) {
    return api.post('tool_package/getPackageList',{
        name: argv.name,
        state:argv.state,
        package_category_id:argv.package_category_id,
        page_index:argv.page_index-1,
        page_size:argv.page_size
    });
}
//获取专栏分类列表
export function getCategoryTypeList(argv) {
    return api.post('tool_package/getCategoryList');
}

//获取文章列表
export function getArticleList(argv) {
    return api.post('tool_product/getProductList',{
        package_id:argv.category_id,
        state:argv.state,
        type:argv.type,
        name:argv.name,
        page_index:argv.page_index-1,
        page_size:argv.page_size
    });
}

//获取图书详情
export function getCategoryDetail(Category_id) {
    return api.post('tool_package/getPackageDetail',{
        package_id:Category_id
    });
}

//创建文章
export function createCategory(argv) {
    return api.post('tool_package/createPackage',{
        name:argv.name,
        short_desc:argv.short_desc,
        icon_url:"",
        package_category_id:argv.package_category_id,
        cover_img:argv.cover_img,
        detail:argv.detail,
        state:argv.state,
        price:argv.price,
        original_price: argv.original_price,
    });
}

//更新专栏
export function updateCategory(argv) {
    return api.post('tool_package/updatePackage',{
        package_id:argv.category_id,
        name:argv.name,
        short_desc:argv.short_desc,
        package_category_id:argv.package_category_id,
        cover_img:argv.cover_img,
        detail:argv.detail,
        state:argv.state,
        price: argv.price,
        original_price: argv.original_price,
    });
}

//获取专栏可以添加的文章列表
export function getCanAddArticleList(argv) {
    return api.post('tool_package/getCanAddProductList',{
        package_id:argv.category_id,        
        name:argv.name,
        page_index:argv.page_index-1,
        page_size:argv.page_size
    });
}

//专栏中绑定产品
export function bindArticleToCategory(category_id,article_ids) {
    return api.post('tool_package/bindAddProduct',{
        package_id:category_id,  
        product_ids:article_ids
    });
}

//设置专栏状态
export function setCategoryState(category_id,state) {
    return api.post('tool_package/setPackageState',{
        package_id:category_id,
        state:state
    });
}

//删除专栏
export function delPackage(category_id) {
    return api.post('tool_package/delPackage',{
        package_id:category_id
    });
}
//删除专栏内产品
export function delArticleFromCategory(cid,aid) {
    return api.post('tool_package/delProduct',{
        package_id:cid,
        product_id:aid
    });
}

//设置产品单卖
export function setProductCanSingleBuy(category_id,article_id) {
    return api.post('tool_package/setProductCanSingleBuy',{
        package_id:category_id,
        product_id:article_id,
        price:0
    });
}
//取消产品单卖
export function cancelProductCanSingleBuy(category_id,article_id) {
    return api.post('tool_package/cancelProductCanSingleBuy',{
        package_id:category_id,
        product_id:article_id,
        price:0
    });
}


//专栏中创建产品
export function createArticleToCategory(argv) {
    return api.post('tool_package/createAddProduct',{
        package_id:argv.category_id,  
        product_name:argv.name,
        product_short_desc:argv.short_desc,
        product_from:argv.from,
        exercise_id:argv.exercise_id,
        product_cover_img:argv.cover_img,
        product_detail:argv.detail,
        product_description:"",
        product_online_resource_url:argv.online_resource_url,
        product_content_type:argv.content_type,
        product_state:argv.state,
        product_type:argv.type,
        product_open_time:argv.open_time,
        product_price:0,
        product_is_can_single_buy:0,
        product_bonus_ratio:0
    });
}