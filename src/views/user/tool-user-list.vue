<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>后台用户管理</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <Select v-model="searchOption.role_arr" multiple @on-change="getToolUserList" placeholder="请选择权限" style="min-width:200px; width:auto">
                        <Option v-for="(item,idx) in roleArrSelect" :key="idx" :value="item.id">{{item.name}}</Option>
                    </Select>
                </div>
                <div class="actions" style="flex: 0 0 100px;">
                    <Button type="primary" icon="android-add" @click="addUser">添加用户</Button>
                </div>
            </div>
            <div class="list">
                <p class="list-info">
                    <Icon type="ios-book"></Icon>
                    总用户&nbsp;（
                    <span>{{total_count}}</span>&nbsp;）&nbsp;个
                </p>
                <Table :loading="userListLoading" :columns="userListDef" :data="userList"></Table>
                <Row class="bottom-bar" type="flex" justify="space-between">
                    <!--  <Col span="4">
                    <Button :loading="delBookLoading" type="ghost" @click="delBook">删除</Button>
                    </Col> -->
                    <Col span="24" style="text-align:right">
                    <Page show-total show-sizer :current="searchOption.page_index" :total="userCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
                    </Page>
                    </Col>
                </Row>
            </div>
        </Card>
        <add-user-modal :is-show="showAddUserDialog" @refreshList="getToolUserList" :userinfo="userinfo" @closeModal="showAddUserDialog=false"></add-user-modal>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { deleteToolUser, setUserState } from '@/api/user'
import AddUserModal from '../modal-components/add-user'
var moment = require('moment')
export default {
    name: 'toolUserList',
    components: {
        AddUserModal
    },
    data() {
        return {
            userName: '',
            userCount: 0,
            userListDef: [
                {
                    title: '用户ID',
                    key: 'id',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'username',
                    width: 180,
                },
                {
                    title: '真实姓名',
                    key: 'realname',
                    width: 180
                },
                {
                    title: '用户权限',
                    key: 'roles',
                    minWidth: 260,
                    render: (h, params) => {
                        let roles = this.userList[params.index].roles
                        let rolesGroups = [...this.rolesGroups]
                        if (roles[0] == 1) {
                            return h('span', '[超级管理员]')
                        }
                        let role_arr = [];
                        roles.forEach(item => {
                            rolesGroups.forEach(roles => {
                                let roleGroup = []
                                if (roles.access == item) {
                                    roleGroup.push(roles.title)
                                }
                                roles.children.forEach(role => {
                                    if (role.access == item) {
                                        roleGroup.push(role.title)
                                    }
                                })
                                roleGroup.length && (role_arr.push(roleGroup))
                            })
                        });
                        return h('span', `[${role_arr.toString().replace(/,/g, '，')}]`)
                    }
                },
                {
                    title: '状态',
                    key: 'state',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.state == 0 ? '已冻结' : '正常')
                    }
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', moment(params.row.create_time).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '最后登录时间',
                    key: 'last_login_time',
                    width: 160,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', moment(params.row.last_login_time).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '操作',
                    width: 320,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: 'small'
                            },
                            style: {
                                color: "#1975E0"
                            }
                        };
                        let userinfo = {
                            user_id: params.row.id,
                            username: params.row.username,
                            realname: params.row.realname,
                            roles: params.row.roles,
                        }
                        let arr = [
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.showAddUserDialogFun({ ...userinfo, type: 2 })
                                    }
                                }                            }, '修改用户密码'),
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.showAddUserDialogFun({ ...userinfo, type: 3 })
                                    }
                                }

                            }, '设置用户权限'),
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.showAddUserDialogFun({ ...userinfo, type: 4 })
                                    }
                                }                            }, '设置用户信息'),
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.setUserState(params.row.id)
                                    }
                                }
                            }, '修改用户状态'),
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: '删除后无法恢复，请确认是否删除该用户吗？',
                                            onOk: () => {
                                                this.deleteToolUser(params.row.id)
                                            }
                                        })
                                    }
                                }                            }, '删除')
                        ]
                        return h('div', arr)
                    }
                }
            ],
            showAddUserDialog: false,
            userinfo: {
                user_id: '',
                username: '',
                realname: '',
                roles: []
            },
            btnDisabled: false,
            role_arr: []//按权限筛选
        };
    },
    computed: {
        ...mapState({
            searchOption: state => state.user.searchOption,
            userListLoading: state => state.user.userListLoading,
            userList: state => state.user.userList,
            rolesCheckList: state => state.user.rolesCheckList,
            total_count: state => state.user.total_count,
        }),
        ...mapGetters(['rolesGroups']),
        roleArrSelect() {//全选筛选选项
            let rolesGroups = this.rolesGroups
            let arr = [];
            rolesGroups.forEach(roles => {
                arr.push({
                    id: roles.access,
                    name: roles.title
                })
                if (roles.children && roles.children.length > 0) {
                    roles.children.forEach(role => {
                        arr.push({
                            id: role.access,
                            name: role.title
                        })
                    })
                }
            })
            arr.unshift({
                id: 1,
                name: '超级管理员'
            })
            return arr
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        ...mapActions(['getToolUserList']),
        init() {
            this.getToolUserList()
            // console.log(Cookies.get('islogin'));
        },
        deleteToolUser(id) {
            deleteToolUser(id).then(res => {
                if (res.res_code == 1) {
                    this.$Message.success('删除成功')
                    this.getToolUserList()
                }
            })
        },
        pageIndexChange(page) {
            if (page != this.searchOption.page_index) {
                this.$store.commit("user_setPageIndex", page);
                /* this.search(); */
            }
        },
        pageSizeChange(pageSize) {
            if (pageSize != this.searchOption.page_size) {
                this.$store.commit("user_setPageSize", pageSize);
                /* this.search(); */
            }
        },
        addUser() {
            this.userinfo = {
                user_id: '',
                username: '',
                realname: '',
                roles: [],
                type: 1
            }
            this.showAddUserDialog = true
        },
        showAddUserDialogFun(userinfo) {
            if (userinfo.user_id) {
                this.userinfo = {
                    ...userinfo
                }
            }
            this.showAddUserDialog = true
        },
        showSetUserRoleDialogFun(id, roles) {
            this.showSetUserRoleModal = true
            this.setUserRole.roles = roles
            this.setUserRole.user_id = id
        },
        setUserState(id) {//设置用户状态
            setUserState({
                user_id: id,
            }).then(res => {
                if (res.res_code == 1) {
                    this.$Message.success('设置成功')
                    this.getToolUserList()
                }
            })
        }
    }
};
</script>