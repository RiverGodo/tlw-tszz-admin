<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>销售模式管理</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <Select v-model="searchOption.type" @on-change="search" style="width:100px">
                        <Option v-for="item in typeSelects" :key="item.state" :value="item.state">{{item.name}}</Option>
                    </Select>
                    <Select v-model="searchOption.is_group_purchase" @on-change="search" style="width:100px">
                        <Option v-for="item in groupPurchaseSelects" :key="item.state" :value="item.state">{{item.name}}</Option>
                    </Select>
                    <Select v-model="searchOption.is_pre_buy" @on-change="search" style="width:100px">
                        <Option v-for="item in preBuySelects" :key="item.state" :value="item.state">{{item.name}}</Option>
                    </Select>
                    <div class="search-bar">
                        <Input v-model="searchOption.sale_name" placeholder="请输入名称" style="width: 200px"></Input>
                        <Button type="primary" class="btn_search" icon="ios-search" @click="search">查询</Button>
                    </div>
                </div>
                <div class="actions" style="flex:0 0 200px">
                    <Button type="primary" icon="android-add" @click="gotoAddSale(0)">新增销售模式</Button>
                </div>
            </div>
            <div class="list">
                <p class="list-info">
                    <Icon type="ios-book"></Icon>当前销售模式&nbsp;（
                    <span>{{total_count}}</span>）&nbsp;种</p>
                <Table :loading="saleListLoading" :columns="saleListDef" :data="saleList"></Table>
            </div>
        </Card>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
const moment = require('moment')
export default {
    name: 'saleList',
    data() {
        return {
            saleListDef: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'sale_name',
                    width: 220,
                },
                {
                    title: '描述',
                    key: 'sale_desc',
                    minWidth: 300
                },
                {
                    title: '优惠的价格或折扣',
                    key: 'sale_discount',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        let str = params.row.sale_discount;
                        if (params.row.type == 4) {
                            str = params.row.sale_discount * 100 + '%'
                        }
                        return h('span', str)
                    }
                },
                {
                    title: '分享收益',
                    key: 'sale_income',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'type',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        let str = '';
                        switch (params.row.type) {
                            case 1:
                                str = '无折扣';
                                break;
                            case 2:
                                str = '每件直减 ';
                                break;
                            case 3:
                                str = '总价直减';
                                break;
                            case 4:
                                str = '折扣';
                                break;
                        }
                        return h('span', str)
                    }
                },
                {
                    title: '是否团购',
                    key: 'is_group_purchase',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.is_group_purchase == 0 ? '否' : '是')
                    }
                },
                {
                    title: '是否预购',
                    key: 'is_pre_buy',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.is_pre_buy == -1 ? '否' : '是')
                    }
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    width: 140,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', moment(params.row.create_time).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                /* {
                    title: '操作',
                    key: 'action',
                    width: 100,
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
                        }
                        let arr = [
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.gotoAddSale(params.row.id)
                                    }
                                }                            }, '查看详情')
                        ]
                        return h('div', arr)
                    }
                } */
            ]
        }
    },
    computed: {
        ...mapState({
            saleListLoading: state => state.sale.saleListLoadiing,
            saleList: state => state.sale.saleList,
            searchOption: state => state.sale.searchOption,
            total_count: state => state.sale.total_count,
            groupPurchaseSelects: state => state.sale.groupPurchaseSelects,
            preBuySelects: state => state.sale.preBuySelects,
            typeSelects: state => state.sale.typeSelects
        })
    },
    mounted() {
        this.getSaleList()
    },
    methods: {
        ...mapActions(['getSaleList']),
        gotoAddSale(sale_id) {
            this.$router.push({
                name: 'AddSale',
                query: {
                    sale_id: sale_id
                }
            })
        },
        search() {
            this.getSaleList()
        }
    }
}
</script>

