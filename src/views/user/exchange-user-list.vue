<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>用户管理</BreadcrumbItem>
            <BreadcrumbItem>兑换用户列表</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <DatePicker :options="dateRangeOptions" style="width:240px" type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="time_range" placeholder="请选择时间" @on-ok="search(true)" @on-clear="timeRangeClear"></DatePicker>
                    <Input class="margin-left-10" v-model.trim="content" style="width: 400px;display:inline-table">
                    <Select class="input-select" v-model="searchtype" slot="prepend" style="width: 100px">
                        <Option value="user_id">用户ID</Option>
                        <Option value="nickname">用户名</Option>
                    </Select>
                    </Input>
                    <Button type="primary" style="margin:1px 0 0 10px;" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
                </div>
                <div class="actions" style="flex: 0 0 200px;"></div>
            </div>
            <div class="list">
                <p class="list-info">
                    <Icon type="ios-book"></Icon>总用户数&nbsp;（
                    <span>{{totalCount}}</span>）&nbsp;人</p>
                <Table :loading="exUserListLoading" :columns="exUserListDef" :data="exUserList"></Table>
                <Row class="bottom-bar" type="flex" justify="space-between">
                    <Col span="24" style="text-align:right">
                    <Page show-total show-sizer :current="exSearchOption.page_index" :total="totalCount" :page-size="exSearchOption.page_size" :page-size-opts="exSearchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
                    </Page>
                    </Col>
                </Row>
            </div>
        </Card>
        <exchange-user-detail-modal :is-show="showModal" :user-id="user_id" @closeModal="showModal=false"></exchange-user-detail-modal>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import ExchangeUserDetailModal from '../modal-components/exchange-user-detail';
import moment from "moment";
export default {
    name: 'exchangeUserList',
    components: {
        ExchangeUserDetailModal

    },
    data() {
        return {
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
            exUserListDef: [
                {
                    title: '用户ID',
                    key: "user_id",
                    width: 80,
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'nickname',
                    width: 140
                },
                {
                    title: '兑换次数',
                    key: 'count',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '最新兑换时间',
                    key: 'last_use_time',
                    width: 140,
                    align: 'center',
                    render: (h, params) => {
                        let str = ""
                        if (!params.row.last_use_time || moment(params.row.last_use_time).format('YYYY-MM-DD hh:mm:ss') == 'Invalid date') {
                            str = '无'
                        } else {
                            str = moment(params.row.last_use_time).format('YYYY-MM-DD hh:mm:ss')
                        }
                        return h('span', str)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            },
                        }
                        let arr = [
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.showUserDetail(params.row.user_id)
                                    }
                                }                            }, '查看详情'),
                        ]
                        return h('div', arr)
                    }
                }
            ],
            time_range: [],
            searchtype: "user_id",
            content: '',
            showModal: false,
            user_id: -1
        }
    },
    mounted() {
        this.search()
    },
    computed: {
        ...mapState({
            exUserList: state => state.user.exUserList,
            exUserListLoading: state => state.user.exUserListLoading,
            exSearchOption: state => state.user.exSearchOption,
            totalCount: state => state.user.total_count,
        })
    },
    methods: {
        ...mapActions(['getExuserList']),
        search(init) {
            if (init) {
                let payload = {
                    start_time: this.time_range[0],
                    end_time: this.time_range[1]
                }
                switch (this.searchtype) {
                    case 'user_id':
                        payload.user_id = this.content
                        payload.nickname = ""
                        break;
                    case 'nickname':
                        payload.nickname = this.content
                        payload.user_id = ""
                        break;  
                }
                this.$store.commit('setExSearchOption', payload)
            }
            this.getExuserList()
        },
        showUserDetail(user_id) {//显示用户详情
            this.user_id = Number(user_id);
            this.showModal = true
        },
        //清空时间范围
        timeRangeClear() {
            this.time_range = [null, null];
            this.search(true)
        },
        pageIndexChange(page) {
            if (page != this.exSearchOption.page_index) {
                this.$store.commit("setExSearchOption", {
                    page_index: page
                });
                this.getExuserList()
            }
        },
        pageSizeChange(pageSize) {
            if (pageSize != this.exSearchOption.page_size) {
                this.$store.commit("setExSearchOption", {
                    page_size: pageSize
                });
                this.getExuserList()
            }
        },
    }
}
</script>

