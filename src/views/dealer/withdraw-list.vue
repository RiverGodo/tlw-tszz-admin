<template>
  <div class="withdraw-list page-content">
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Input class="form_item" placeholder="请输入ID" v-model="searchOption.id"></Input>
          <Input class="form_item" placeholder="请输入店名" v-model="searchOption.shop_name"></Input>
          <Input class="form_item" placeholder="请输入手机号" v-model="searchOption.phone"></Input>
          <Input class="form_item" placeholder="请输入收款人姓名" v-model="searchOption.realname"></Input>
          <Input class="form_item" placeholder="请输入银行卡号" v-model="searchOption.card_no"></Input>
          <Input class="form_item" placeholder="请输入所属银行" v-model="searchOption.bank_name"></Input>
          <Input class="form_item" placeholder="请输入银行预留手机号" v-model="searchOption.bank_phone"></Input>
          <Select
            placeholder="是否打款"
            @on-change="handelSeach"
            class="input-select form_item"
            v-model="searchOption.state"
            slot="prepend"
          >
            <Option value>全部</Option>
            <Option :value="1">是</Option>
            <Option :value="0">否</Option>
          </Select>
          <Button type="primary" class="btn_search" icon="ios-search" @click="handelSeach">查询</Button>
        </div>
      </div>

      <div class="list">
        <Table :loading="withdrawListLoading" :columns="withdrawListColumns" :data="withdrawList"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4"></Col>
          <Col span="20" style="text-align:right">
            <Page
              show-total
              show-sizer
              :current="searchOption.page_index"
              :total="withdrawCount"
              :page-size="searchOption.page_size"
              :page-size-opts="searchOption.page_size_opts"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
            ></Page>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
import moment from "moment";
import { getAllProfit, updateProfit } from "@/api/dealer/dealer";

export default {
  data() {
    return {
      withdrawList: [],
      withdrawListLoading: false,
      withdrawCount: 0,
      searchOption: {
        id: "",
        shop_name: "",
        phone: "",
        realname: "",
        card_no: "",
        bank_name: "",
        bank_phone: "",
        state: "",
        page_index: 1,
        page_size: 20
      },
      real_search:{},
      withdrawListColumns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 60
        },
        {
          title: "头像/店名",
          minWidth: 160,
          align: "left",
          render: (h, params) => {
            let nickname = params.row.shop_name;
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
                    size: "small"
                  }
                }),
                h("div", {
                  attrs: {
                    class: "nickname",
                    title: params.row.shop_name
                  },
                  domProps: {
                    innerHTML: nickname
                  }
                })
              ]
            );
          }
        },
        {
          title: "手机号",
          key: "phone",
          minWidth: 120
        },
        {
          title: "申请提现金额",
          key: "money",
          minWidth: 80,
          render: (h, params) => h("span", params.row.money.toFixed(2))
        },
        {
          title: "收款人姓名",
          key: "realname",
          minWidth: 120
        },
        {
          title: "银行卡号",
          key: "card_no",
          minWidth: 150
        },
        {
          title: "所属银行",
          key: "bank_name",
          minWidth: 150
        },
        {
          title: "银行预留手机号",
          key: "bank_phone",
          minWidth: 120
        },
        {
          title: "申请时间",
          key: "create_time",
          minWidth: 120,
          render: (h, params) =>
            h("span", moment(params.row.create_time).format("YYYY-MM-DD"))
        },
        {
          title: "确认打款/已打款",
          key: "action",
          minWidth: 120,
          render: (h, params) => {
            let state = params.row.state;
            if (state) {
              return h("div", "已打款");
            }
            return h(
              "div",
              {
                props: {
                  type: "text",
                  size: "small"
                },
                style: {
                  color: "#1975E0",
                  cursor:"pointer"
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "提示信息",
                      content: "确认打款吗？",
                      onOk: res => {
                        this.updateProfit(params.row.info_id);
                      }
                    });
                  }
                }
              },
              "确认打款"
            );
          }
        }
      ]
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
      if (this.withdrawListLoading) {
        return false;
      }
      this.withdrawListLoading = true;
      getAllProfit(this.real_search)
        .then(res => {
          if (res.res_code == 1) {
            this.withdrawList = res.data.list;
            this.withdrawCount = res.data.total_count;
          }
          this.withdrawListLoading = false;
        })
        .catch(err => {
          this.withdrawListLoading = false;
        });
    },
    updateProfit(id) {
      if (this.withdrawListLoading) {
        return false;
      }
      this.withdrawListLoading = true;
      updateProfit({ id })
        .then(res => {
          this.withdrawListLoading = false;
          if (res.res_code == 1) {
            this.$Message.success("设置成功");
            this.search();
          }
        })
        .catch(err => {
          this.withdrawListLoading = false;
        });
    },
    // 初始化
    init() {
      this.searchOption = {
        page_index: 1,
        page_size: 20,
        id: "",
        shop_name: "",
        phone: "",
        realname: "",
        card_no: "",
        bank_name: "",
        bank_phone: "",
        state: ""
      };
      this.real_search = {...this.searchOption}
      this.search();
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
<style lang="less">
.withdraw-list {
  .options_div {
    display: inline-block;
  }
  .options_div:nth-child(1) {
  }
  .form_item {
    width: 200px;
    margin-top: 12px;
  }
  .btn_search {
    margin-top: 12px;
  }
}
</style>
