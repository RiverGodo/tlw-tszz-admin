<template>
  <div class="verification-code page-content">
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Input placeholder="请输入激活卡号" v-model="searchOption.no" style="width: 200px"></Input>
          <Input placeholder="请输入经销商姓名" v-model="searchOption.dealer_name" style="width: 200px"></Input>
          <Select
            placeholder="是否兑换"
            @on-change="handelSeach"
            class="input-select"
            v-model="searchOption.is_exchange"
            slot="prepend"
            style="width: 160px"
          >
            <Option value>全部</Option>
            <Option :value="1">是</Option>
            <Option :value="0">否</Option>
          </Select>
          <Select
            placeholder="是否经销商激活"
            @on-change="handelSeach"
            class="input-select"
            v-model="searchOption.is_dealer"
            slot="prepend"
            style="width: 160px"
          >
            <Option value>全部</Option>
            <Option :value="1">是</Option>
            <Option :value="0">否</Option>
          </Select>
          <Select
            placeholder="版本"
            @on-change="handelSeach"
            class="input-select"
            v-model="searchOption.version_id"
            slot="prepend"
            style="width: 160px"
          >
            <Option value>全部</Option>
            <Option :value="2">高级</Option>
            <Option :value="3">超级</Option>
            <Option :value="4">全能</Option>
            <Option :value="5">决胜</Option>
          </Select>
          <Button type="primary" class="btn_search" icon="ios-search" @click="handelSeach">查询</Button>
        </div>
      </div>
      <div class="list">
        <Table :loading="dealerListLoading" :columns="dealerListColumns" :data="dealerList"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4"></Col>
          <Col span="20" style="text-align:right">
            <Page
              show-total
              show-sizer
              :current="searchOption.page_index"
              :total="dealerCount"
              :page-size="searchOption.page_size"
              :page-size-opts="searchOption.page_size_opts"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
            ></Page>
          </Col>
        </Row>
      </div>
    </Card>
    <user-active-log
      :is-show="showActiveLog"
      :activation-id="activation_id"
      @closeModal="showActiveLog=false"
    ></user-active-log>
    <active-detail :is-show="show_active" :no="no" @closeModal="show_active=false"></active-detail>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import moment from "moment";
import UserActiveLog from "../../modal-components/user-active-log";
import {
  getActivationList,
  updateCardActivationState,
  deleteCardActivation
} from "@/api/dealer/dealer";
import activeDetail from "@/views/modal-components/active-detail";
export default {
  components: {
    activeDetail,
    UserActiveLog
  },
  data() {
    return {
      no: 0,
      dealerCount: 0,
      activation_id: 0, //激活id
      show_active: false,
      showActiveLog: false,
      loading: false,
      dealerListLoading: false,
      searchOption: {
        dealer_name:"",
        dealer_id: "",
        version_id:'',
        is_exchange: "",
        is_dealer: "",
        page_index: 1,
        page_size: 20
      },
      real_search:{},
      dealerListColumns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 60
        },
        {
          title: "激活卡号",
          key: "no",
          minWidth: 180,
          render: (h, params) => {
            //十位，前面自动补0
            let len = params.row.no.toString().length;
            let zero = "";
            if (len < 10) {
              for (let i = 0; i < 10 - len; i++) {
                zero += "0";
              }
            }
            return h("span", zero + params.row.no);
          }
        },
        {
          title: "当前版本",
          key: "name",
          minWidth: 180,
          align:"center"
        },
        {
          title: "持卡人",
          key: "nickname",
          minWidth: 160,
          align:"center",
          render: (h, params) => {
            let str = "暂无";
            if (params.row.user_id) {
              str = `${params.row.nickname}(${params.row.user_id})`;
            }
            return h("span", str);
          }
        },
        {
          title: "激活经销商",
          minWidth: 160,
          align:"center",
          render: (h, params) => {
            return h("span", params.row.shop_name || "无");
          }
        },
        {
          title: "是否兑换",
          minWidth: 180,
          align:"center",
          render: (h, params) => h("span", params.row.is_exchange ? "是" : "否")
        },
        {
          title: "激活时间",
          key: "create_time",
          minWidth: 120,
          align:"center",
          render: (h, params) =>
            h("span", moment(params.row.create_time).format("YYYY-MM-DD"))
        },
        {
          title:"兑换卡类型",
          key:"card_type",
          width:100,
          align:"center",
          render: (h,params) => {
            let str = "无"
            if (params.row.card_type == 2) {
              str = "正常卡"
            }else if(params.row.card_type == 3){
              str = "预约卡"
            }

            return h("span",str)
          }
        },
        {
          title:"兑换时间",
          key:"exchange_time",
          minWidth: 120,
          align:"center",
          render: (h, params) =>
            h("span", params.row.exchange_time == "0000-00-00 00:00:00" ? "无" : moment(params.row.exchange_time).format("YYYY-MM-DD"))
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 250,
          render: (h, params) => {
            let arr = [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0"
                    // width: "60px"
                  },
                  on: {
                    click: () => {
                      this.no = params.row.no;
                      this.show_active = true;
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0"
                    // width: "80px"
                  },
                  on: {
                    click: () => {
                      this.activation_id = params.row.id;
                      this.showActiveLog = true;
                    }
                  }
                },
                "操作记录"
              )
            ];
            let userInfo = JSON.parse(Cookies.get("userInfo"));
            //只有超级管理员有取消激活权限
            if (userInfo.role_arr&&userInfo.role_arr.includes(1)) {
              arr.push(
                h(
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
                        this.cancelActiveState(params.row);
                      }
                    }
                  },
                  "取消激活"
                ),
                h(
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
                        this.cancelActiveDealState(params.row);
                      }
                    }
                  },
                  "删除兑换"
                )
              );
            }
            return h("div", arr);
          }
        }
      ],
      dealerList: []
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    handelSeach(){
         this.searchOption.page_index = 1
         this.real_search = {...this.searchOption}
         this.search()
    },
    search() {
      if (this.dealerListLoading) {
        return false;
      }
      this.dealerListLoading = true;
      getActivationList(this.real_search)
        .then(res => {
          if (res.res_code == 1) {
            this.dealerList = res.data.list;
            this.dealerCount = res.data.total_count;
          }
          this.dealerListLoading = false;
        })
        .catch(err => {
          this.dealerListLoading = false;
        });
    },
    // 初始化
    init() {
      let dealer_id = this.$route.query.dealer_id;
      this.searchOption = {
        dealer_id: dealer_id,
        no: "",
        is_exchange: "",
        is_dealer: "",
        page_index: 1,
        page_size: 20
      };
      this.real_search = {...this.searchOption}
      if (dealer_id) {
        this.searchOption.dealer_id = Number(dealer_id);
      }
      this.search();
    },
    cancelActiveState(_param) {
      if (_param.user_id) {
        this.$Message.warning("已经有持卡人，不可修改激活状态");
        return false;
      }
      this.$Modal.confirm({
        title: "确定要取消激活状态吗?取消后将不会出现在激活列表",
        content: "",
        onOk: () => {
          if (this.dealerListLoading) {
            return false;
          }
          this.dealerListLoading = true;
          updateCardActivationState({ no: _param.no }).then(res => {
            if (res.res_code == 1) {
              this.$Message.info("取消成功");
              this.dealerListLoading = false;
              this.search();
            } else {
              this.dealerListLoading = false;
              this.$Message.info(res.msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    cancelActiveDealState(_param){
      if (!_param.user_id) {
        this.$Message.warning("没有持卡人，不可修改激活状态");
        return false;
      }
      this.$Modal.confirm({
        title: "确定要取消已兑换激活状态吗?取消后将会彻底删除用户激活兑换信息，该操作不可恢复！",
        content: "",
        onOk: () => {
          if (this.dealerListLoading) {
            return false;
          }
          this.dealerListLoading = true;
          deleteCardActivation({no: _param.no}).then(res => {
            if (res.res_code == 1) {
              this.$Message.info("取消成功");
              this.dealerListLoading = false;
              this.search();
            }else{
              this.dealerListLoading = false;
              this.$Message.info(res.msg);
            }
          })
        },
        onCancel: () => {}
      });
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.searchOption.page_index = page;
        this.real_search.page_index = page;
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.searchOption.page_size = pageSize;
        this.real_search.page_size = pageSize;
        this.search();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.verification-code {
  .operation {
    margin-bottom: 20px;
  }
  .pagination-wrapper {
    margin-top: 20px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 100%;
  }
}
</style>
