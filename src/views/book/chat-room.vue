<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem to="/BookManage/ResourceList">资源列表</BreadcrumbItem>
            <BreadcrumbItem>直播间</BreadcrumbItem>
        </Breadcrumb>

        <Card shadow>
            <h2> {{title}}</h2>
            <Row type="flex" align="middle" justify="space-between" style="font-size:16px;padding-top:20px;padding-bottom:10px">
                <Col> <span style="font-weight:700;">直播间状态：</span>
                <span :style="{color:roomState.state==1?'#00a874':'#ed3f14'}">{{roomState.state==1?'正常':'关闭'}}</span>
                </Col>
                <Col> <span style="font-weight:700">直播间发言状态：</span>
                <span :style="{color:roomState.is_all_forbidden==1?'#ed3f14':'#00a874'}">{{roomState.is_all_forbidden==1?'全员禁言':'正常'}}</span>
                </Col>
                <Col>
                <Button type="ghost" :loading="is_all_forbidden_loading" @click="setRoomForbidden">{{is_all_forbidden==1?"取消禁言":"全体禁言"}}</Button>
                <Button type="primary" :loading="is_all_forbidden_loading" @click="setRoomState">{{roomState.state==1?"关闭直播间":"开启直播间"}}</Button>
                </Col>
            </Row>
            <div style="font-size:16px;margin-bottom:20px;"><span style="font-weight:700">老师直播间地址：</span><span style="color:#00a874">https://m.tl100.com/chat_room?resource_id={{resource_id}}</span></div>
            <template>
                <Tabs :animated="false" style="overflow:visible;">
                    <TabPane :disabled="contentListLoading" label="在线用户列表">
                        <div class="top-bar">
                            <div class="options">
                            </div>
                            <div class="actions" style="flex: 0 0 100px;"></div>
                        </div>
                        <div class="list">
                            <p class="list-info">
                                <Icon type="ios-book"></Icon>当前在线人数&nbsp;（
                                <span>{{userTotalCount}}</span>）&nbsp;人;&nbsp;&nbsp;累计在线人数&nbsp;（
                                <span>{{maxCount}}</span>）&nbsp;人
                            </p>
                            <Table :loading="userListLoading" :data="userList" :columns="userListDef"></Table>
                            <Row class="bottom-bar" type="flex" justify="space-between">
                                <Col span="8"></Col>
                                <Col span="16" style="text-align:right">
                                <Page show-total show-sizer :current="userSearchOption.page_index" :total="userTotalCount" :page-size="userSearchOption.page_size" :page-size-opts="userSearchOption.page_size_opts" @on-page-size-change="userPageSizeChange" @on-change="userPageIndexChange">
                                </Page>
                                </Col>
                            </Row>

                        </div>
                    </TabPane>
                    <TabPane :disabled="userListLoading" label="聊天信息列表">
                        <div class="top-bar">
                            <div class="options">
                                <Input class="margin-left-10" v-model.trim="contSearchOption.content" style="width: 400px;display:inline-table">
                                <Select class="input-select" v-model="contSearchOption.searchType" slot="prepend" style="width: 100px">
                                    <Option value="content">发言内容</Option>
                                    <Option value="user_id">用户ID</Option>
                                </Select>
                                </Input>
                                <Button type="primary" style="margin:1px 0 0 10px;" class="btn_search" icon="ios-search" @click="getContents">查询</Button>

                            </div>
                            <div class="actions" style="flex: 0 0 100px;"></div>
                        </div>
                        <div class="list">
                            <p class="list-info">
                                <Icon type="ios-book"></Icon>当前聊天数&nbsp;（
                                <span>{{contentTotalCount}}</span>）&nbsp;份&nbsp;已选（
                                <span>{{content_id_arr.length}}</span>）</p>
                            <Table ref="contentList" :loading="contentListLoading" :data="contentList" :columns="contentListDef" @on-selection-change="selectChange"></Table>
                            <Row class="bottom-bar" type="flex" justify="space-between">
                                <Col span="8">
                                <Button @click="handleSelectAll">全选</Button>
                                <Button :loading="delContsLoading" type="ghost" @click="delConts">删除</Button>
                                </Col>
                                <Col span="16" style="text-align:right">
                                <Page show-total show-sizer :current="contSearchOption.page_index" :total="contentTotalCount" :page-size="contSearchOption.page_size" :page-size-opts="contSearchOption.page_size_opts" @on-page-size-change="contPageSizeChange" @on-change="contPageIndexChange">
                                </Page>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                </Tabs>

            </template>

        </Card>
    </div>
</template>
<script>
import * as apiChat from '@/api/chat'
import { mapState, mapActions } from 'vuex'
import { getBookResourceDetail } from '@/api/bookResource'
const moment = require('moment')
export default {
    name: 'chatList',
    data() {
        return {
            is_all_forbidden: 0,
            is_all_forbidden_loading: false,
            maxCount: 0,
            contentListDef: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '用户ID',
                    key: 'user_id',
                    width: 80
                },
                {
                    title: '用户昵称',
                    key: 'nickname',
                    width: 140,
                },
                {
                    title: '发言内容',
                    key: 'content',
                    minWidth: 260,
                    align: 'center'
                },
                {
                    title: '发言时间',
                    key: 'video_time',
                    width: 140,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.video_time ? moment(params.row.video_time).format('YYYY-MM-DD HH:mm:ss') : '无')
                    }
                }
            ],
            content_id_arr: [],
            user_id_arr: [],
            userListDef: [
                {
                    title: '用户ID',
                    key: 'user_id',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '头像/昵称',
                    key: "nickname",
                    minWidth: 160,
                    align: "left",
                    render: (h, params) => {
                        let nickname = params.row.nickname;
                        if (this.userSearchOption.nickname) {
                            let reg = new RegExp(this.userSearchOption.nickname, 'i')
                            let str = params.row.nickname.match(reg);
                            nickname = params.row.nickname.replace(reg, `<em class="highlight">${str}</em>`)
                        }
                        return h(
                            "div",
                            {
                                attrs: {
                                    class: "avatar-title"
                                }
                            },
                            [
                                h("Avatar", {
                                    attrs: {
                                        class: "img"
                                    },
                                    props: {
                                        src: params.row.avatar_url,
                                        size: 'small'
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            class: "nickname",
                                            title: params.row.nickname
                                        },
                                        domProps: {
                                            innerHTML: nickname
                                        }
                                    },
                                )
                            ]
                        );
                    }
                },
                {
                    title: '性别',
                    key: 'sex',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.sex == 1 ? "男" : "女")
                    }
                },
                {
                    title: '手机号',
                    key: 'phone',
                    width: 140,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.phone || '无')
                    }
                },
                {
                    title: '年级',
                    key: 'grade_id',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        let grade_list = [...this.gradeList, { grade_id: 0, name: '全部' }];
                        let gradeName = grade_list.filter(item => item.grade_id == params.row.grade_id)
                        return h('span', gradeName[0].name)
                    }
                },
                {
                    title: '城市',
                    key: 'city_id',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        let city_list = [...this.cityList, { city_id: 0, name: '无' }];
                        let cityName = city_list.filter(item => item.city_id == params.row.city_id)
                        return h('span', cityName[0].name)
                    }
                },
                {
                    title: '禁言状态',
                    key: 'state',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.state == 1 ? '否' : '是')
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 140,
                    render: (h, params) => {
                        let stateStr = "";
                        switch (params.row.type) {
                            case 0:
                                stateStr = "普通用户";
                                break;
                            case 1:
                                stateStr = "管理员";
                                break;
                            case 2:
                                stateStr = "老师";
                                break;
                        }
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            }
                        }
                        let items = ["普通用户", "管理员", "老师"];
                        let dropdownItems = items.map((item, idx) => {
                            return h("DropdownItem", { props: { name: idx } }, item);
                        });
                        let arr = [
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.setForbidden(params.row.user_id)
                                    }
                                }                            }, '禁言'),
                            h(
                                "Dropdown",
                                {
                                    props: {
                                        trigger: "click"
                                    },
                                    style: {
                                        margin: "0 5px"
                                    },
                                    on: {
                                        "on-click": state => {
                                            this.setUserRole(params.row.user_id, state);
                                        }
                                    }
                                },
                                [
                                    h("a", [
                                        stateStr,
                                        h("Icon", {
                                            props: {
                                                type: "arrow-down-b"
                                            }
                                        })
                                    ]),
                                    h(
                                        "DropdownMenu",
                                        {
                                            slot: "list"
                                        },
                                        dropdownItems
                                    )
                                ]
                            )
                        ]
                        return h('div', arr)
                    }
                }
            ],
            resource_id: '',
            ws: {},
            message: {},
            delContsLoading: false,//删除聊天记录Loading
            roomState: {
                state: 0,
                is_all_forbidden: 0
            },
            title: ''//资源标题
        }
    },
    computed: {
        ...mapState({
            gradeList: state => state.app.gradeList,
            cityList: state => state.app.cityList,
            contentListLoading: state => state.chat.contentListLoading,
            contentList: state => state.chat.contentList,
            contentTotalCount: state => state.chat.contentTotalCount,
            contSearchOption: state => state.chat.contSearchOption,
            userListLoading: state => state.chat.userListLoading,
            userList: state => state.chat.userList,
            userTotalCount: state => state.chat.userTotalCount,
            userSearchOption: state => state.chat.userSearchOption
        }),
    },
    created() {
        this.resource_id = Number(this.$route.params.resourceId)
        this.$store.commit('set_user_search_option', { resource_id: this.resource_id })
        this.$store.commit('set_cont_search_option', { resource_id: this.resource_id })
        getBookResourceDetail(this.resource_id).then(res => {
            if (res.res_code == 1) {
                this.title = res.msg.name
            }
        })
    },
    mounted() {
        this.init()
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.resource_id != Number(to.params.resourceId)) {
                vm.resource_id = Number(to.params.resourceId);
                vm.init()
            }
        })
    },
    beforeDestroy() {
        this.ws.close()//断开socket
        this.ws = null
    },
    methods: {
        ...mapActions(['getUserListByUserIdArray', 'getContentList']),
        init() {
            this.ws = new WebSocket('wss://api.tl100.com/wss');
            this.ws.onopen = this.onOpen
            this.ws.onmessage = this.onMessage
            this.ws.onerror = this.onError
            this.ws.onclose = this.onClose
        },
        onOpen() {
            this.getRoomState().then(res => {
                this.getContentList()
            })
            this.message = {
                token: '1B0DD6E0188C11E89634DF8485C5EECD',
                resource_id: this.resource_id
            }
            this.ws.send(JSON.stringify(this.message))
            this.sendMsg()
            console.log('链接上SOCKET')
        },
        onMessage(msg) {
            console.log('接收到消息')
            let data = JSON.parse(msg.data)
            if (data.rooms) {
                let rooms = data.rooms
                rooms = rooms.filter(item => item.resource_id == this.resource_id)
                let user_id_arr = rooms[0].data

                this.$store.commit('set_user_search_option', {
                    resource_id: this.resource_id,
                    user_id_arr: user_id_arr
                })
                this.maxCount = rooms[0].max_data.length
                this.getUserList()
                this.getContents()
            }
        },
        onError(err) {
            this.$Message.error('网路异常！')
            console.log(err)
        },
        onClose() {
            console.log('socket链接已断开')
        },
        sendMsg(cmd) {//向服务器发送消息

            this.message = {
                cmd: cmd || 1
            }
            this.ws.send(JSON.stringify(this.message))
        },
        setRoomForbidden() {//全体禁言
            this.is_all_forbidden = this.is_all_forbidden == 0 ? 1 : 0
            this.is_all_forbidden_loading = true
            apiChat.setRoomForbidden({
                resource_id: this.resource_id,
                is_all_forbidden: this.is_all_forbidden
            }).then(res => {
                if (res.res_code == 1) {
                    this.$Message.success('设置成功')
                    this.getRoomState().then(result => {
                        this.is_all_forbidden_loading = false
                        this.sendMsg()
                    })
                }
            })
        },
        setRoomState() {//设置直播间状态
            this.is_all_forbidden_loading = true
            let state = this.roomState.state == 1 ? 0 : 1
            apiChat.setRoomState({
                resource_id: this.resource_id,
                state: state
            }).then(res => {
                if (res.res_code == 1) {
                    this.$Message.success('直播间状态设置成功')
                    this.getRoomState().then(result => {
                        this.is_all_forbidden_loading = false
                        this.sendMsg()
                    })
                }
            }).catch(err => {
                this.is_all_forbidden_loading = true
            })
        },
        getUserList() {
            this.getUserListByUserIdArray()
        },
        getContents() {//获取聊天信息
            switch (this.contSearchOption.searchType) {
                case 'user_id':
                    if (Number.isNaN(Number(this.contSearchOption.content))) {
                        this.$Message.error('请输入正确地用户ID')
                        return
                    }
                    this.$store.commit('set_cont_search_option', {
                        user_id: Number(this.contSearchOption.content),
                        content: '',
                        page_index: 1
                    })
                    break;
                case 'content':
                    this.$store.commit('set_cont_search_option', {
                        user_id: 0,
                        page_index: 1
                    })
                    break;
            }
            this.getContentList()
        },
        getRoomState() {
            return new Promise((resolve, reject) => {
                apiChat.getRoomState({ resource_id: this.resource_id }).then(res => {
                    if (res.res_code == 1) {
                        this.roomState = { ...res.data }
                        resolve()
                    }
                })
            })

        },
        handleSelectAll(status) {//全选
            if (
                this.content_id_arr[this.contsearchOption.page_index].length ==
                this.contentList.length
            ) {
                this.$refs.contentList.selectAll(false);
            } else {
                this.$refs.contentList.selectAll(true);
            }
        },
        delConts() {//删除记录
            if (this.content_id_arr < 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请选择要删除的记录！"
                });
            } else {
                this.$Modal.confirm({
                    title: "提示信息",
                    content: "确认要删除吗？",
                    onOk: () => {
                        this.delContsLoading = true;
                        apiChat
                            .removeContents({
                                content_id_arr: this.content_id_arr
                            })
                            .then(res => {
                                this.delContsLoading = false;
                                if (res.res_code == 1) {
                                    this.getContents()
                                    this.$Message.success("删除记录成功！");
                                    let msg = {
                                        msg: -4,
                                        data: this.content_id_arr
                                    }
                                    this.ws.send(JSON.stringify(msg))
                                } else {
                                    this.$Message.error("删除记录失败！");
                                }
                            });
                    }
                });
            }
        },
        selectChange(data) {
            let arr = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                arr.push(element.id)
            }
            this.content_id_arr = arr
        },
        setUserRole(user_id, type) {//设置用户权限
            apiChat.setUserRole({
                user_id: user_id,
                type: type
            }).then(res => {
                if (res.res_code == 1) {
                    this.$Message.success('设置成功')
                    this.getUserList()
                    this.sendMsg()
                }
            })
        },
        setForbidden(user_id) {//禁言
            apiChat.setForbidden({
                resource_id: this.resource_id,
                user_id: user_id
            }).then(res => {
                if (res.res_code == 1) {
                    this.$Message.success('设置成功')
                    this.getUserList()
                    this.sendMsg()
                }
            })
        },
        contPageIndexChange(page) {
            if (page != this.contSearchOption.page_index) {
                this.$store.commit("set_cont_search_option", { page_index: page });
                this.getContentList()
            }
        },
        contPageSizeChange(pageSize) {
            if (pageSize != this.contSearchOption.page_size) {
                this.$store.commit("set_cont_search_option", { page_size: pageSize });
                this.getContentList()
            }
        },
        userPageIndexChange(page) {
            if (page != this.userSearchOption.page_index) {
                this.$store.commit("set_user_search_option", { page_index: page });
            }
        },
        userPageSizeChange(pageSize) {
            if (pageSize != this.userSearchOption.page_size) {
                this.$store.commit("set_user_search_option", { page_size: pageSize });
            }
        }
    },
}
</script>


