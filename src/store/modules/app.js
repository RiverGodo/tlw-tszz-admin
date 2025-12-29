import {
    otherRouter,
    appRouter
} from '@/router/router';
import * as base from '@/api/base';
import Util from '@/libs/util';

import moment from "moment";
const gradeListBase = [{
    grade_id: 9,
    name: "高中"
}, {
    grade_id: 10,
    name: "初中"
}, {
    grade_id: 7,
    name: "小学"
}];
const gradeListExtend = [{
        grade_id: 9,
        name: "高中"
    },
    {
        grade_id: 9,
        name: "高等"
    },
    {
        grade_id: 9,
        name: "高考"
    },
    {
        grade_id: 9,
        name: "高三"
    },
    {
        grade_id: 9,
        name: "高二"
    },
    {
        grade_id: 9,
        name: "高一"
    }, {
        grade_id: 10,
        name: "初中"
    }, {
        grade_id: 10,
        name: "中考"
    }, {
        grade_id: 10,
        name: "初等"
    }, {
        grade_id: 10,
        name: "初三"
    }, {
        grade_id: 10,
        name: "初二"
    }, {
        grade_id: 10,
        name: "初一"
    }, {
        grade_id: 7,
        name: "小学"
    }
];
const stateList = [{
        state: 0,
        name: "已下架"
    }, {
        state: 1,
        name: "已上架"
    },
    {
        state: 2,
        name: "兑换后可见"
    }
];
const discountUserangeList = [{
        type: 0,
        name: "请选择使用范围"
    },
    {
        type: 1,
        name: "全科通用"
    }, {
        type: 2,
        name: "限定单科"
    },
    {
        type: 3,
        name: "限定课程"
    }
];
const discountStateList = [{
        state: 0,
        name: "请选择状态"
    },
    {
        state: 1,
        name: "未上线"
    }, {
        state: 2,
        name: "已上线"
    },
];
const app = {
    state: {
        userInfo: {
            name: "未知",
            role_arr: []
        },
        richEditorDef: { //富文本编辑器配置
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    // ["blockquote", "code-block"],
                    [{
                        list: "ordered"
                    }, {
                        list: "bullet"
                    }],
                    // [{ script: "sub" }, { script: "super" }],
                    [{
                        indent: "-1"
                    }, {
                        indent: "+1"
                    }],
                    // [{ direction: "rtl" }],
                    [{
                        size: ["small", false, "large", "huge"]
                    }],
                    // [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    // [{ font: [] }],
                    [{
                        color: []
                    }, {
                        background: []
                    }],
                    [{
                        align: []
                    }],
                    ["clean"],
                    // ["link", "image", "video"]
                    ["image"]
                ]
            },
            placeholder: "请输入详情信息...",
            theme: "snow"
        },
        simpleRichEditorDef: { //简单富文本编辑器
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    [{
                        list: "ordered"
                    }, {
                        indent: "-1"
                    }, {
                        indent: "+1"
                    }],
                    ["clean"],
                ]
            },
            placeholder: "请输入详情信息...",
            theme: "snow"
        },
        menuList: [],
        cityList: [],
        cityListLoading: false,
        subjectList: [],
        subjectListLoading: false,
        gradeListBase: gradeListBase,
        gradeList: [],
        gradeListExtend: gradeListExtend,
        yearsList: [],
        stateList: stateList,
        discountStateList:discountStateList,
        discountUserangeList:discountUserangeList,
        gradeListLoading: false,
        routers: [
            otherRouter,
            ...appRouter
        ],
        orderExamList: [],
    },
    getters: {
        stateListSelect: state => [{
                state: -1,
                name: "选择状态"
            },
            ...state.stateList
        ],
        discountStateListSelect: state => [
            ...state.discountStateList
        ],
        discountUserangeListSelect: state => [
            ...state.discountUserangeList
        ],
        gradeListBaseSelect: state => [{
                grade_id: 0,
                name: "选择年级"
            },
            ...state.gradeListBase
        ],
        subjectListSelect: state => [{
                subject_id: 0,
                name: "选择学科"
            },
            ...state.subjectList
        ],
        cityListSelect: state => [{
                city_id: 0,
                name: "选择城市"
            },
            ...state.cityList
        ],
        gradeListSelect: state => [{
                grade_id: -1,
                name: "选择年级"
            },
            ...state.gradeList
        ],
        yearsListSelect: state => [{
                year_id: 0,
                name: "选择版本"
            },
            ...state.yearsList
        ],
        orderExamListSelect: state => [{
            id: -1,
            name: "选择产品名称"
        }, ...state.orderExamList],
        rolesGroups: state => { //权限设置列表
            let arr = [];
            appRouter.forEach(item => {
                let obj = {
                    access: item.access,
                    title: item.title,
                };
                if (item.children && item.children.length > 0) {
                    obj.children = [];
                    item.children.forEach(child => {
                        obj.children.push({
                            access: child.meta.access,
                            title: child.meta.title
                        })
                    })
                }
                arr.push(obj)
            })
            otherRouter.children.forEach(item => {
                if (item.meta.access && item.meta.access > 100) {
                    let access = item.meta.access
                    let menu = Math.floor(access / 100)
                    arr.forEach(app => {
                        if (app.access === menu) {
                            app.children.push({
                                title: item.meta.title,
                                access: access,
                                class: 'others'
                            })
                            app.children.sort((a, b) => a.access + '' > b.access + '')
                        }
                    })
                }
            })
            return arr;
        }
    },
    actions: {
        getCityList({
            state,
            commit
        }, payload) {
            commit("setCityListLoading");
            base.getCityList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setCityList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getSubjectList({
            state,
            commit
        }, payload) {
            commit("setSubjectListLoading");
            base.getSubjectList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setSubjectList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getGradeList({
            state,
            commit
        }, payload) {
            commit("setGradeListLoading");
            base.getGradeList()
                .then(res => {
                    if (res.res_code == 1) {
                        commit("setGradeList", res.msg);
                    }
                })
                .catch(reason => {
                    console.error(reason)
                })
        },
        getYearsList({
            state,
            commit
        }, type) {
            let y = moment().year();
            let y_arr = [];
            for (let i = 2; i > -10; i--) {
                y_arr.push({
                    year_id: y + i,
                    name: y + i
                });
            }
            y_arr.unshift({
                year_id: -1,
                name: "无"
            });
            commit("setYearsList", y_arr);
        },
        getOrderExamList({
            state,
            commit
        }, payload) {
            base.getExamList().then(res => {
                if (res.res_code == 1) {
                    commit('setOrderExamList', res.data)
                }
            }).catch(err => {
                console.log(err);

            })
        }
    },
    mutations: {
        setUserInfo(state, data) {
            state.userInfo = { ...state.userInfo,
                ...data
            };
        },
        setCityList(state, data) {
            state.cityListLoading = false;
            state.cityList = data;
        },
        setCityListLoading(state, data) {
            state.cityListLoading = true;
        },
        setSubjectList(state, data) {
            state.subjectListLoading = false;
            state.subjectList = data;
        },
        setSubjectListLoading(state, data) {
            state.subjectListLoading = true;
        },
        setTeacherListLoading(state, data) {
            state.teacherListLoading = true;
        },
        setTeacherList(state, data) {
            state.teacherListLoading = false;
            state.teacherList = data.teacher_list;
        },
        setGradeList(state, data) {
            state.gradeListLoading = false;
            state.gradeList = data;
        },
        setGradeListLoading(state, data) {
            state.gradeListLoading = true;
        },
        setYearsList(state, data) {
            state.yearsList = data;
        },
        setOrderExamList(state, data) {
            state.orderExamList = data
        },
        //根据用户权限动态更新左侧列表
        updateMenulist(state) {
            let accessCode = state.userInfo.role_arr || []; //用户权限列表
            let menuList = [];
            // 如果没有权限信息，显示所有菜单（取消权限过滤）
            let showAllMenus = !accessCode || accessCode.length === 0;
            
            appRouter.forEach((item, index) => {
                if (item.access !== undefined) {
                    if (showAllMenus || Util.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            let len = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                if (child.access !== undefined) {
                                    if (showAllMenus || child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (child.access !== undefined) {
                                if (showAllMenus || Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                        handledItem.children = childrenArr;
                        menuList.splice(len - 1, 1, handledItem);
                    }
                }
            });

            state.menuList = menuList;
        },
    }
};

export default app;