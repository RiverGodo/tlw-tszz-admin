'use strict';

import api from '../config'

//获取banner列表
export function getBannerList() {
    return api.post('tool_everyday_en_banner/getBannerList');
}

//获取banner详情
// export function getArticleDetail(article_id) {
//     return api.post('tool_product/getProductDetail',{
//         product_id:article_id
//     });
// }

//创建banner
export function createBanner(argv) {
    return api.post('tool_everyday_en_banner/addBanner', {
        name: argv.name,
        cover_img: argv.cover_img,
        href: argv.href,
        open_time: argv.href,
        state: argv.state
    });
}

//更新banner
export function updateBanner(argv) {
    return api.post('tool_everyday_en_banner/updateBanner', {
        banner_id: argv.banner_id,
        name: argv.name,
        cover_img: argv.cover_img,
        href: argv.href,
        open_time: argv.open_time,
        state: argv.state
    });
}

//获取banner详情
export function getBannerDetail(bid) {
    return api.post('tool_everyday_en_banner/getBannerDetail', {
        banner_id: bid
    });
}

//删除banner
export function delBanner(bid) {
    return api.post('tool_everyday_en_banner/delBanner', {
        banner_id: bid
    });
}

// 设置排序Banner
export function orderByBanner(payload) {
    return api.post('tool_everyday_en_banner/orderByBanner', payload)
}