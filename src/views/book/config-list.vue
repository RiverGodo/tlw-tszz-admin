<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>系统配置</BreadcrumbItem>
        </Breadcrumb>
        <Tabs value="1" @on-click="handleClickTab">
            <TabPane label="学科" name="1">
                <Card shadow>
                    <div class="top-bar">
                        <div class="options"></div>
                        <div class="actions" style="flex:0 0 100px">
                            <Button type="primary" @click="showAddSubject=true">添加学科</Button>
                        </div>
                    </div>
                    <div class="list">
                        <Table :loading="subjectListLoading" :columns="subjectListDef" :data="subjectListData" width="1580"></Table>
                    </div>
                </Card>
            </TabPane>
            <TabPane label="资源类型" name="2">
                <Card shadow>
                    <div class="top-bar">
                        <div class="options"></div>
                        <div class="actions" style="flex:0 0 100px">
                            <Button type="primary" @click="AddResource">添加资源类型</Button>
                        </div>
                    </div>
                    <div class="list">
                        <Table :loading="subjectListLoading" :columns="resource_data" :data="resource_list" width="1580"></Table>
                    </div>
                </Card>
            </TabPane>
        </Tabs>
        
        <add-subject-modal :is-show="showAddSubject" @closeModal="showAddSubject=false" :is_resource="is_resource" @refreshList="handleChangeType"></add-subject-modal>
    </div>
</template>
<script>
import AddSubjectModal from '../modal-components/add-subject'
import { mapActions, mapState } from 'vuex'
import { changeSubject, removeSubject } from '@/api/base'
import { getBookResourceTypeList,addOrUpdateBookResourceType,deleteBookResourceType } from '@/api/book-resource-subject'
export default {
    name: 'configList',
    components: {
        AddSubjectModal
    },
    data() {
        return {
            subjectListDef: [
                {
                    title: 'ID',
                    key: 'subject_id',
                    width: 260,
                    align: 'center'
                },
                {
                    title: '排序',
                    key: 'orderby',
                    width: 460,
                    align: 'center',
                    render: (h, params) => {
                        if (params.row.showInp) {
                            return h('Input', {
                                props: {
                                    value: params.row.orderby,
                                    size: 'small'
                                },
                                on: {
                                    'on-change': e => {
                                        if (Number(e.target.value) != params.row.orderby) {
                                            params.row.orderby = Number(e.target.value)
                                        }
                                    }
                                }
                            })
                        } else {
                            return h('span', params.row.orderby)
                        }
                    }
                },
                {
                    title: '学科名称',
                    key: 'name',
                    width: 440,
                    render: (h, params) => {
                        if (params.row.showInp) {
                            return h('Input', {
                                props: {
                                    value: params.row.name,
                                    size: 'small'
                                },
                                on: {
                                    'on-change': e => {
                                        if (e.target.value != params.row.name) {
                                            params.row.name = e.target.value
                                        }
                                    }
                                }
                            })
                        } else {
                            return h('span', params.row.name)
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 420,
                    align: 'center',
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            }
                        };
                        if (params.row.showInp) {
                            return h('div', [
                                h('Button', {                                    props: { size: 'small' }, style: { marginRight: '10px' }, on: {
                                        click: () => {
                                            let index = params.index
                                            params.row.name = this.subjectList[index].name
                                            params.row.orderby = this.subjectList[index].orderby
                                            params.row.showInp = false
                                        }
                                    }                                }, '取消'),
                                h('Button', {                                    props: { type: 'primary', size: "small" }, on: {
                                        click: () => {
                                            this.changeSubject(params).then(res => {
                                                params.row.showInp = false
                                            })
                                        }
                                    }                                }, '保存')
                            ])
                        } else {
                            return h('div', [
                                h('Button', {                                    ...obj, on: {
                                        click: () => {
                                            params.row.showInp = true
                                        }
                                    }                                }, '编辑'),
                                h('Button', {                                    ...obj, on: {
                                        click: () => {
                                            this.removeSubject(params.row.subject_id)
                                        }
                                    }                                }, '删除')
                            ])
                        }

                    }
                }
            ],
            showAddSubject: false,
            is_resource: false,   // 是否是资源
            resource_list: [],
            resource_data: [
                {
                    title: 'ID',
                    key: 'type_id',
                    width: 260,
                    align: 'center'
                },
                {
                    title: '排序',
                    key: 'orderby',
                    width: 460,
                    align: 'center',
                    render: (h, params) => {
                        if (params.row.showInp) {
                            return h('Input', {
                                props: {
                                    value: params.row.orderby,
                                    size: 'small'
                                },
                                on: {
                                    'on-change': e => {
                                        if (Number(e.target.value) != params.row.orderby) {
                                            params.row.orderby = Number(e.target.value)
                                        }
                                    }
                                }
                            })
                        } else {
                            return h('span', params.row.orderby)
                        }
                    }
                },
                {
                    title: '资源名称',
                    key: 'name',
                    width: 440,
                    render: (h, params) => {
                        if (params.row.showInp) {
                            return h('Input', {
                                props: {
                                    value: params.row.name,
                                    size: 'small'
                                },
                                on: {
                                    'on-change': e => {
                                        if (e.target.value != params.row.name) {
                                            params.row.name = e.target.value
                                        }
                                    }
                                }
                            })
                        } else {
                            return h('span', params.row.name)
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 420,
                    align: 'center',
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            }
                        };
                        if (params.row.showInp) {
                            return h('div', [
                                h('Button', {                                    
                                    props: { size: 'small' }, style: { marginRight: '10px' }, on: {
                                        click: () => {
                                            let index = params.index
                                            params.row.name = this.resource_list[index].name
                                            params.row.orderby = this.resource_list[index].orderby
                                            params.row.showInp = false
                                        }
                                    }                                
                                }, '取消'),
                                h('Button', {                                    
                                    props: { type: 'primary', size: "small" }, on: {
                                        click: () => {
                                            this.editResource(params).then(res => {
                                                params.row.showInp = false
                                            })
                                        }
                                    }                                
                                }, '保存')
                            ])
                        } else {
                            return h('div', [
                                h('Button', {                                    
                                    ...obj, on: {
                                        click: () => {
                                            params.row.showInp = true
                                        }
                                    }                                
                                }, '编辑'),
                                h('Button', {                                    
                                    ...obj, on: {
                                        click: () => {
                                            this.removeSubject(params.row.type_id)
                                        }
                                    }                                
                                }, '删除')
                            ])
                        }

                    }
                }
            ]
        }
    },
    computed: {
        ...mapState({
            subjectList: state => state.app.subjectList,
            subjectListLoading: state => state.app.subjectListLoading
        }),
        subjectListData() {
            let subjectList = [...this.$store.state.app.subjectList];
            subjectList.forEach(item => {
                item.showInp = false
            })
            return subjectList
        }
    },
    methods: {
        ...mapActions(['getSubjectList']),
        changeSubject(params) {
            let payload = {
                subject_id: params.row.subject_id,
                name: params.row.name,
                orderby: params.row.orderby
            }
            return new Promise((resolve, reject) => {
                if (params.row.name != this.subjectList[params.index].name || params.row.orderby != this.subjectList[params.index].orderby) {
                    changeSubject(payload).then(res => {
                        if (res.res_code == 1) {
                            this.getSubjectList();
                            this.$Message.success('修改成功')
                            resolve()
                        }
                    })
                } else {
                    resolve()
                }
            })
        },
        removeSubject(_id) {
            this.$Modal.confirm({
                title: '温馨提示',
                content: '删除后将无法恢复， 确认删除该学科吗？',
                loading: true,
                onOk: () => {
                    if (this.is_resource) {
                        deleteBookResourceType({
                            type_id: _id
                        }).then(res => {
                            if (res.res_code == 1) {
                                this.$Modal.remove();
                                this.$Message.success('删除成功')
                                this.handleClickTab(2)
                            }
                        })
                    } else {
                        removeSubject({
                            subject_id: _id
                        }).then(res => {
                            if (res.res_code == 1) {
                                this.$Modal.remove();
                                this.$Message.success('删除成功')
                                this.getSubjectList()
                            }
                        })
                    }
                }
            })

        },
        handleClickTab (e) {
            if (e == 2) {
                this.is_resource = true
                getBookResourceTypeList().then(res => {
                    if (res.res_code == 1) {
                        res.msg.forEach(item => {
                            item.showInp = false
                        })
                        this.resource_list = res.msg
                    }
                }).catch(err => {
                    this.$Message.warning('请求失败，请重新加载')
                })
            } else {
                this.is_resource = false
            }
        },
        AddResource () {
            this.showAddSubject = true;
            this.is_resource = true;
        },
        handleChangeType () {
            if (this.is_resource) {
                this.handleClickTab(2)
            } else {
                this.getSubjectList()
            }
        },
        editResource (_params) {
            let row = _params.row;
            console.log(row);
            
            let payload = {
                type_id: row.type_id,
                name: row.name,
                orderby: row.orderby
            }
            return new Promise((resolve,resject) => {
                if (row.name == this.resource_list[_params.index].name && row.orderby == this.resource_list[_params.index].orderby) {
                    resolve()
                } else {
                    addOrUpdateBookResourceType(payload).then(res => {
                        if (res.res_code == 1) {
                            this.$Message.success('修改成功')
                            this.handleClickTab(2)
                            resolve()
                        }
                    })
                }
            })
        }
    }
}
</script>

