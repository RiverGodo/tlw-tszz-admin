'use strict';

import api from './config'

//获取图书资源列表
export function getBookResourceList(argv) {
    return api.post('tool_book_resource/getList', {
        book_id: argv.book_id,
        name: argv.name,
        category_id: 2,
        city_id: argv.city_id,
        grade_id: argv.grade_id,
        subject_id: argv.subject_id,
        years: argv.years,
        type_id: argv.type_id,
        page_index: argv.page_index - 1,
        page_size: argv.page_size
    });
}

//获取一本图书的资源列表
export function getResourceListOfOneBook(book_id) {
    return api.post('tool_book_resource/getList', {
        book_id: book_id,
        page_index: 0,
        page_size: 999
    });
}

//获取图书资源类别列表
export function getBookResourceTypeList() {
    return api.post('tool_book_resource/getBookResourceTypeList');
}
//通过md5获取文件详情
export function getBookResourceDetailByFileMD5(md5) {
    return api.post('tool_book_resource/getBookResourceDetailByFileMD5', {
        file_md5: md5
    });
}
//添加或修改资源
export function addOrUpdateBookResource(argv) {
    return api.post('tool_book_resource/addOrUpdateBookResource', {
        resource_id: argv.resource_id,
        name: argv.name,
        filename: argv.filename,
        file_md5: argv.file_md5,
        category_id: 2,
        duration:argv.duration,
        type_id: argv.type_id,
        subject_id: argv.subject_id,
        grade_id: argv.grade_id,
        download_url: argv.download_url,
        is_all: argv.is_all,
        size: argv.size,
        years: argv.years,
        res_format: argv.res_format,
        city_id_arr: argv.city_id_arr,
        start_time: argv.start_time,
        end_time: argv.end_time,
        state: argv.state
    });
}

//删除资源
export function delBookResource(resource_id_arr) {
    return api.post('tool_book_resource/delBookResource', {
        resource_id_arr: resource_id_arr
    });
}

//获取图书资源详情
export function getBookResourceDetail(resource_id) {
    return api.post('tool_book_resource/getBookResourceDetail', {
        resource_id: resource_id
    });
}

//检测资源是否已存在
export function checkDownloadUrl(download_url) {
    return api.post('tool_book_resource/checkDownloadUrl', {
        download_url: download_url
    })
}

//设置视频资源试看
export function setBookVideoResource(params) {
    let payload = {
        book_id: params.book_id,
        resource_id: params.resource_id,
        free_see: params.free_see
    }
    return api.post('tool_book_resource/setBookVideoResource', payload)
}