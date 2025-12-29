import api from './config'
// 获取模块内容
export function getModuleList(payload) {
  return api.post('module/list', payload);
}
// 删除板块内容
export function delCurrentModule(payload) {
  return api.post('module/del', payload);
}
// 添加板块内容
export function addModule(payload) {
  return api.post('module/add', payload);
}
