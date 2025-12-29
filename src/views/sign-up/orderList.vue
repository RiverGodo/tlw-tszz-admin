<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>天利商城</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="pay_type" style="width:100px" @on-change="search(true)">
            <Option v-for="item in payTypeSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="searchOption.exam_id" style="width:210px" @on-change="search(true)">
            <Option v-for="item in orderExamListSelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <DatePicker :options="dateRangeOptions" style="width:240px" type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="time_range" placeholder="请选择时间" @on-ok="search(true)" @on-clear="timeRangeClear"></DatePicker>
          <Input class="margin-left-10" v-model.trim="searchOption.content" style="width: 400px;display:inline-table">
          <Select class="input-select" v-model="searchOption.type" slot="prepend" style="width: 100px">
            <Option value="user_id">用户ID</Option>
            <Option value="phone">用户手机号</Option>
            <Option value="order_id">订单ID</Option>
            <Option value="origin">来源</Option>
          </Select>
          </Input>
          <Button type="primary" style="margin:1px 0 0 10px;" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          <div class="search-bar">
            <span>订单附加信息</span>
            <CheckboxGroup v-model="columnsOpt">
              <Checkbox v-for="(item,idx) in columnsCheckers" :key="idx" :label="item.value">{{item.label}}</Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前订单&nbsp;（
          <span>{{totalCount}}</span>）&nbsp;条</p>
        <Table :loading="orderListLoading" :columns="orderListDef" :data="orderList"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="24" style="text-align:right">
          <Page show-total show-sizer :current="searchOption.page_index" :total="totalCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col>
        </Row>
      </div>

    </Card>
    <order-detail-modal :isShow="showModal" :orderId="order_id" @closeModal="showModal=false" @saveOrderSuccess="getOrderList">
    </order-detail-modal>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import orderDetailModal from '../modal-components/order-detail-modal'
let moment = require("moment");
export default {
  name: "order_list",
  components: {
    orderDetailModal
  },
  data() {
    return {
      showModal: false,
      time_range: "",
      columnsOpt: [],
      columnsCheckers: [
        {
          value: 'receiving_name',
          label: '收货人姓名'
        },
        {
          value: 'receiving_phone',
          label: '收货人联系电话'
        },
        {
          value: 'way_bill_company',
          label: '快递公司'
        },
        {
          value: 'way_bill_num',
          label: '快递单号'
        },
        {
          value: 'way_bill_send_time',
          label: '快递发出时间'
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
      pay_type: -1,
      payTypeSelect: [
        {
          value: -1,
          label: "支付方式"
        },
        {
          value: 1,
          label: "微信"
        },
        {
          value: 2,
          label: "支付宝"
        },
        {
          value: 3,
          label: "QQ"
        },
        {
          value: 4,
          label: '京东兑换'
        }
      ],
      origin: 0,
      originSelect: [
        {
          value: 0,
          label: "订单来源"
        }
      ],
      order_id: '',

    };
  },
  computed: {
    ...mapState({
      orderListLoading: state => state.order.orderListLoading,
      orderList: state => state.order.orderList,
      searchOption: state => state.order.searchOption,
      totalCount: state => state.order.total_count
    }),
    ...mapGetters(['orderExamListSelect']),
    orderListDef() {
      let columns = [
        {
          title: "产品名称",
          key: "exam_name",
          minWidth: 160,
          align: "center"
        },
        {
          title: "用户ID",
          key: "user_id",
          width: 80,
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
          width: 80,
          align: 'center'
        },
        /* {
          title: "订单信息",
          key: "order_desc",
          width: 200,
          align: "center"
        }, */
        {
          title: "支付类型",
          key: "pay_type",
          width: 100,
          align: "center",
          render: (h, params) => {
            let str = "无";
            if (params.row.pay_type) {
              str = this.payTypeSelect.filter(item => item.value === params.row.pay_type)[0].label
            }
            return h("span", str);
          }
        },
        {
          title: "订单来源",
          key: "origin",
          width: 100,
          align: "center"
        },
        {
          title: "创建日期",
          key: "create_time",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.create_time).format("YYYY-MM-DD")
            );
          }
        },
        {
            title:"兑换卡类型",
            key:"card_type",
            width:100,
            align:"center",
            render:(h, params) => {
              let str = "无";
              if (params.row.card_type == 2) {
                str = "正常卡"
              }else if(params.row.card_type == 3){
                str = "预约卡"
              }
              return h("span",str);
            }
        },
        {
          title: "操作",
          width: 140,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small"
                },
                style: {
                  color: "#1975E0"
                },
                on: {
                  click: () => {
                    this.showModal = true
                    this.order_id = params.row.order_id
                  }
                }
              },
              "设置订单"
            );
          }
        }
      ]
      let index = 0;
      if (this.columnsOpt.includes('receiving_name')) {//勾选收货人姓名
        index = columns.findIndex(item => item.key == 'phone')
        columns.splice(index + 1, 0,
          {
            title: "收货人姓名",
            key: "receiving_name",
            width: 80,
            align: "center"
          }
        )
      }
      if (this.columnsOpt.includes('receiving_phone')) {//勾选收货人地址
        let idx = columns.findIndex(item => item.key == 'receiving_name')
        index = idx > 0 ? idx : columns.findIndex(item => item.key == 'phone')
        columns.splice(index + 1, 0, {
          title: "收货人联系电话",
          key: "receiving_phone",
          width: 100,
          align: "center"
        })
      }
      if (this.columnsOpt.includes('way_bill_company')) {//勾选快读公司
        index = columns.findIndex(item => item.key == 'origin')
        columns.splice(index + 1, 0, {
          title: "快递公司",
          key: "way_bill_company",
          width: 100,
          align: "center"
        })
      }
      if (this.columnsOpt.includes('way_bill_num')) {//勾选快递单号
        let idx = columns.findIndex(item => item.key == 'way_bill_company')
        index = idx > -1 ? idx : columns.findIndex(item => item.key == 'origin')
        columns.splice(index + 1, 0, {
          title: "快递单号",
          key: "way_bill_num",
          width: 120,
          align: "center"
        })
      }
      if (this.columnsOpt.includes('way_bill_send_time')) {//勾选快递发出时间
        let idx1 = columns.findIndex(item => item.key == 'way_bill_num')
        let idx2 = columns.findIndex(item => item.key == 'way_bill_company')
        if (idx2 > -1) {
          index = idx2
        }
        if (idx1 > -1) {
          index = idx1
        }
        if (idx1 == -1 && idx2 == -1) {
          index = columns.findIndex(item => item.key == 'origin')
        }
        columns.splice(index + 1, 0, {
          title: "快递发货时间",
          key: "way_bill_send_time",
          width: 100,
          align: "center",
          render: (h, params) => {
            let str = "";
            if (!params.row.way_bill_send_time || moment(params.row.way_bill_send_time).format('YYYY-MM-DD hh:mm:ss') == 'Invalid date') {
              str = "无"
            } else {
              str = moment(params.row.way_bill_send_time).format('YYYY-MM-DD hh:mm:ss')
            }
            return h('span', str)
          }
        })
      }
      return columns
    }
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["getOrderList"]),
    init() {
      if (this.orderList.length <= 0) {
        this.getOrderList();
      }
    },
    //清空时间范围
    timeRangeClear() {
      this.time_range = [null, null];
      this.search(true)
    },
    search(init) {
      if (init) {
        this.$store.commit("Order_setPageIndex", 1);
        let payload = {
          pay_type: this.pay_type,
          exam_id: this.searchOption.exam_id,
          page_index: this.searchOption.page_index,
          page_size: this.searchOption.page_size,
          type: this.searchOption.type,
          content: this.searchOption.content
        };
        if (this.origin) {
          payload.origin = this.originSelect[this.origin].label;
        }
        payload.user_id = "";
        payload.phone = "";
        payload.order_id = "";
        switch (this.searchOption.type) {
          case 'user_id':
            payload.user_id = this.searchOption.content;
            break;
          case 'phone':
            payload.phone = this.searchOption.content;
            break;
          case 'order_id':
            payload.order_id = this.searchOption.content;
            break;
          case 'origin':
            payload.origin = this.searchOption.content;
        }
        if (this.time_range.length) {//时间筛选
          payload.start_time = this.time_range[0];
          payload.end_time = this.time_range[1];
        }
        this.$store.commit("updateSearchOption", payload);
      }
      this.getOrderList();
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("Order_setPageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("Order_setPageSize", pageSize);
        this.search();
      }
    }
  }
};
</script>

<style lang="less">
</style>
