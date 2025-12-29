<style lang="less">
.page-content .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #00a874;
}
.highlight {
  font-style: normal;
  font-weight: bold;
  color: #f00;
}
</style>

<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>前端用户管理</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <DatePicker :options="dateRangeOptions" style="width:240px" type="datetimerange" format="yyyy-MM-dd HH:mm:SS" v-model="time_range" placeholder="请选择时间" @on-ok="search" @on-clear="timeRangeClear"></DatePicker>
                    <!-- <DatePicker type="datetimerange" v-model="timerange" confirm format="" placeholder="请选择时间" style="width: 200px"></DatePicker> -->
                    <Input class="margin-left-10" v-model="feSearchOption.content" style="width: 400px;display:inline-table">
                    <Select class="input-select" v-model="feSearchOption.searchType" slot="prepend" style="width: 100px">
                        <Option value="nickname">用户昵称</Option>
                        <Option value="user_id">用户ID</Option>
                        <Option value="phone">手机号</Option>
                    </Select>
                    </Input>
                    <Button type="primary" style="margin:1px 0 0 10px;" class="btn_search" icon="ios-search" @click="search">查询</Button>
                </div>
                <div class="actions" style="flex:0 0 100px"></div>
            </div>
            <div class="list">
                <Tabs :animated="false" @on-click="tabChange">
                    <TabPane :disabled="userListLoading" label="基础用户"></TabPane>
                    <TabPane :disabled="userListLoading" label="图书增值小程序"></TabPane>
                    <TabPane :disabled="userListLoading" label="天利英语"></TabPane>
                </Tabs>
                <p class="list-info">
                    <Icon type="ios-book"></Icon>
                    总用户&nbsp;（
                    <span>{{total_count}}</span>&nbsp;）&nbsp;个
                </p>
                <Table :loading="userListLoading" :columns="userListDef" :data="feUserList"></Table>
                <div class="bottom-bar">
                    <Page show-total show-sizer :current="feSearchOption.page_index" :total="total_count" :page-size="feSearchOption.page_size" :page-size-opts="feSearchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
                    </Page>
                </div>
            </div>
        </Card>
        <user-detail :isShow="show_active" :no="no"  @closeModal="show_active=false"></user-detail>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import userDetail from "@/views/modal-components/user-detail";
var moment = require('moment')
export default {
    name: 'feUserList',
    data() {
        return {
            userListDef: [
                {
                    title: '用户id',
                    key: 'user_id',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '头像/昵称',
                    key: "nickname",
                    minWidth: 160,
                    align: "left",
                    render: (h, params) => {
                        let nickname = params.row.nickname;
                        if (this.feSearchOption.nickname) {
                            let reg = new RegExp(this.feSearchOption.nickname, 'i')
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
                    width: 50,
                    align: 'center',
                    render: (h, params) => {
                        let str = '';
                        switch (params.row.sex) {
                            case 0:
                                str = '未知'; break;
                            case 1:
                                str = '男'; break;
                            case 2:
                                str = '女'; break;
                        }
                        return h('span', str)
                    }
                },
                {
                    title: '手机号',
                    key: 'phone',
                    width: 120,
                    align: 'center'
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
                    title: '高考时间',
                    key: 'college_entrance_examination_year',
                    width: 160,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.college_entrance_examination_year || '无')
                    }
                },
                {
                    title: '最后登录时间',
                    key: 'last_login_time',
                    align: 'center',
                    width: 160,
                    render: (h, params) => {
                        return h('span', moment(params.row.last_login_time).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    align: 'center',
                    width: 160,
                    render: (h, params) => {
                        return h('span', moment(params.row.create_time).format('YYYY-MM-DD HH:mm:ss'))
                    }
                }
            ],
            dateRangeOptions: {
                shortcuts: [
                    {
                        text: "一周",
                        value() {
                            let start = new Date();
                            let end = new Date();
                            let tTimes =
                                (start.getHours() * 3600 +
                                    start.getMinutes() * 60 +
                                    start.getSeconds()) *
                                1000;
                            start.setTime(start.getTime() - 3600 * 24 * 7 * 1000 - tTimes);
                            return [start, end];
                        }
                    },
                    {
                        text: "上个月",
                        value() {
                            let now = new Date();
                            let lastMon = now.getMonth();
                            let curMon = lastMon + 1;
                            if (lastMon < 10) {
                                lastMon = "0" + lastMon;
                            } else {
                                lastMon += "";
                            }
                            if (curMon < 10) {
                                curMon = "0" + curMon;
                            } else {
                                curMon += "";
                            }
                            let start = new Date(
                                `${now.getFullYear()}-${lastMon}-01 00:00:00`
                            );
                            let end = new Date(`${now.getFullYear()}-${curMon}-01 00:00:00`);
                            end.setTime(end.getTime() - 1000);
                            return [start, end];
                        }
                    },
                    {
                        text: "本月",
                        value() {
                            let now = new Date();
                            let curMon = now.getMonth() + 1;
                            if (curMon < 10) {
                                curMon = "0" + curMon;
                            } else {
                                curMon += "";
                            }
                            let start = new Date(
                                `${now.getFullYear()}-${curMon}-01 00:00:00`
                            );
                            let end = new Date();
                            return [start, end];
                        }
                    }
                ]
            },
            time_range: [],
            type: 0,
            show_active:false,
            no:-1
        }
    },
    components:{
      userDetail:userDetail
    },
    computed: {
        ...mapState({
            feUserList: state => state.user.feUserList,
            userListLoading: state => state.user.userListLoading,
            total_count: state => state.user.total_count,
            feSearchOption: state => state.user.feSearchOption,
            gradeList: state => state.app.gradeList,
            cityList: state => state.app.cityList,
        }),
    },
    watch: {
        time_range: function (value) {
            if (value.length) {
                this.$store.commit('setFeSearchOption', {
                    start_time: value[0],
                    end_time: value[1]
                })
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        ...mapActions(['getFeUserList']),
        init() {
            this.getFeUserList()
        },
        search() {
            this.$store.commit('setFeSearchOption', {
                nickname: '',
                user_id: '',
                phone: '',
            })
            switch (this.feSearchOption.searchType) {
                case 'nickname':
                    this.$store.commit('setFeSearchOption', {
                        nickname: this.feSearchOption.content
                    })
                    break;
                case 'user_id':
                    this.$store.commit('setFeSearchOption', {
                        user_id: this.feSearchOption.content
                    })
                    break;
                case 'phone':
                    this.$store.commit('setFeSearchOption', {
                        phone: this.feSearchOption.content
                    })
                    break;
            }
            this.getFeUserList()
        },
        //清空时间范围
        timeRangeClear() {
            this.time_range = [null, null];
            this.$store.commit('setFeSearchOption', {
                start_time: '',
                end_time: ''
            })
            this.getFeUserList()
        },
        tabChange(idx) {
            if (idx != this.type) {
                this.type = idx;
                this.$store.commit('setFeSearchOption', {
                    type: this.type,
                    page_index: 1
                })
                this.updateUserListDef(idx)
                this.getFeUserList()
            }
        },
        updateUserListDef(idx) {
            if (idx == 1) {
                this.userListDef = [...this.userListDef, {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            },
                            on:{
                            'click':()=>{
                              this.no = params.row.user_id
                              this.show_active = true;
                            }
                          }
                        }
                        return h('div', [
                            h('Button', { ...obj }, '查看')
                        ])
                    }
                }]
            } else if (this.userListDef[this.userListDef.length - 1].key == 'action') {
                this.userListDef.pop()
            }
        },
        pageIndexChange(page) {
            if (page != this.feSearchOption.page_index) {
                this.$store.commit('setFeSearchOption', {
                    page_index: page
                });
                this.getFeUserList()
            }
        },
        pageSizeChange(pageSize) {
            if (pageSize != this.feSearchOption.page_size) {
                this.$store.commit('setFeSearchOption', {
                    page_size: pageSize
                });
                this.getFeUserList();
            }
        }
    }
}
</script>

