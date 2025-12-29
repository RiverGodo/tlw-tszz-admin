"use strict";

import api from "./config";

export function helloWorld() {
  return api.get("hello");
}
//登录
export function login(username, pwd) {
  return api.post("tool_user/login", {
    username: username,
    pwd: pwd
  });
}
//更新最后登录时间
export function updateLastLoginTime() {
  return api.post("tool_user/updateLastLoginTime");
}
//学科列表
export function getSubjectList() {
  return api.post("subject/getList");
}
//城市列表
export function getCityList() {
  return api.post("city/getList");
}
//年级列表
export function getGradeList() {
  return api.post("grade/getList");
}
//产品列表
export function getExamList() {
  return api.post("tool_sign_up/getExamList");
}
//添加学科
export function addSubject(params) {
  let payload = {
    subject_id: params.subject_id,
    name: params.name
  };
  (params.orderby || params.orderby == 0) && (payload.orderby = params.orderby);
  return api.post("subject/addSubject", payload);
}
//修改学科
export function changeSubject(params) {
  let payload = {
    subject_id: params.subject_id
  };
  params.name && (payload.name = params.name);
  (params.orderby || params.orderby == 0) && (payload.orderby = params.orderby);
  return api.post("subject/changeSubject", payload);
}
//删除学科
export function removeSubject(params) {
  let payload = {
    subject_id: params.subject_id
  };
  return api.post("subject/removeSubject", payload);
}
