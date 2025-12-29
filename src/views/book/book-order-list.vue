<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>图书管理</BreadcrumbItem>
            <BreadcrumbItem>订单列表</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <DatePicker :options="dateRangeOptions" style="width:240px" type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="time_range" placeholder="请选择时间" @on-ok="search(true)" @on-clear="timeRangeClear"></DatePicker>
                    <Input class="margin-left-10" v-model.trim="bookOrderSearchOption.content" style="width: 400px;display:inline-table">
                    <Select class="input-select" v-model="bookOrderSearchOption.type" slot="prepend" style="width: 100px">
                        <Option value="book_name">产品名称</Option>
                        <Option value="user_id">用户ID</Option>
                        <Option value="phone">用户手机号</Option>
                        <Option value="order_id">订单ID</Option>
                    </Select>
                    </Input>
                    <Button type="primary" style="margin:1px 0 0 10px;" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
                </div>
            </div>
            <div class="list">
                <p class="list-info">
                    <Icon type="ios-book"></Icon>当前订单&nbsp;（
                    <span>{{bookOrderCount}}</span>）&nbsp;条</p>
                <Table :loading="bookOrderListLoading" :columns="orderListDef" :data="bookOrderList"></Table>
                <Row class="bottom-bar" type="flex" justify="space-between">
                    <Col span="24" style="text-align:right">
                    <Page show-total show-sizer :current="bookOrderSearchOption.page_index" :total="bookOrderCount" :page-size="bookOrderSearchOption.page_size" :page-size-opts="bookOrderSearchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
                    </Page>
                    </Col>
                </Row>
            </div>

        </Card>
    </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
    name: 'bookOrderList',
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
            time_range: [null, null],
            orderListDef: [
                {
                    title: "产品名称",
                    key: "related_name",
                    minWidth: 160,
                    align: "center"
                },
                {
                    title: "产品类型",
                    key: "type",
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.type == 2 ? '图书' : '课程')
                    }
                },
                {
                    title: "用户ID",
                    key: "user_id",
                    width: 100,
                    align: "center"
                },
                {
                    title: "用户手机号",
                    key: "phone",
                    width: 120,
                    align: "center"
                },
                {
                    title: "订单ID",
                    key: "order_id",
                    width: 220,
                    align: "center"
                },
                {
                    title: '订单价格',
                    key: "price",
                    width: 100,
                    align: 'center'
                },
                {
                    title: '消费点',
                    key: "point",
                    width: 100,
                    align: 'center'
                },
                {
                    title: '反还积分',
                    key: "return_point",
                    width: 100,
                    align: 'center'
                },
                {
                    title: '优惠金额',
                    key: "discount_amount",
                    width: 100,
                    align: 'center'
                },
                {
                    title: '使用余额',
                    key: 'use_money',
                    width: 100,
                    align: 'center'
                }
            ]
        }
    },
    watch: {

    },
    computed: {
        ...mapState({
            bookOrderSearchOption: state => state.book.bookOrderSearchOption,
            bookOrderList: state => state.book.bookOrderList,
            bookOrderCount: state => state.book.bookOrderCount,
            bookOrderListLoading: state => state.book.bookOrderListLoading,
        })
    },
    mounted() {
        this.getBookOrderList()
    },
    methods: {
        ...mapMutations(['setBookOrderSearchOption']),
        ...mapActions(['getBookOrderList']),
        //清空时间范围
        timeRangeClear() {
            this.time_range = [null, null];
            this.search(true)
        },
        search(init) {
            if (init) {
                let payload = {
                    page_index: this.bookOrderSearchOption.page_index,
                    page_size: this.bookOrderSearchOption.page_size,
                    user_id: '',
                    phone: '',
                    order_id: '',
                    book_name: ''
                }
                switch (this.bookOrderSearchOption.type) {
                    case 'user_id':
                        payload.user_id = this.bookOrderSearchOption.content;
                        break;
                    case 'phone':
                        payload.phone = this.bookOrderSearchOption.content;
                        break;
                    case 'order_id':
                        payload.order_id = this.bookOrderSearchOption.content;
                        break;
                    case 'book_name':
                        payload.book_name = this.bookOrderSearchOption.content;
                }
                if (this.time_range.length) {//时间筛选
                    payload.start_time = this.time_range[0] || null;
                    payload.end_time = this.time_range[1] || null;
                }
                this.setBookOrderSearchOption(payload)
            }
            this.getBookOrderList()
        },
        pageIndexChange(page) {
            if (page != this.bookOrderSearchOption.page_index) {
                this.setBookOrderSearchOption({
                    page_index: page
                });
                this.search();
            }
        },
        pageSizeChange(pageSize) {
            if (pageSize != this.bookOrderSearchOption.page_size) {
                this.setBookOrderSearchOption({
                    page_size: pageSize
                });
                this.search();
            }
        }
    }
}
</script>

