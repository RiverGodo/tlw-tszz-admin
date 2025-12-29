'use strict';

import api from '../config'
// 获取资源列表
export function getResoureList(argv) {
  return api.post('v2/tool_everyday_en_question/getResoureList',argv);
}
// 更新素材
export function updateResoure(argv) {
  return api.post('v2/tool_everyday_en_question/updateResoure',argv);
}

// 删除素材
export function deleteResoureList(argv) {
  return api.post('v2/tool_everyday_en_question/deleteResoureList',argv);
}
// 添加素材
export function addResoureList(argv) {
  return api.post('v2/tool_everyday_en_question/addResoureList',argv);
}
