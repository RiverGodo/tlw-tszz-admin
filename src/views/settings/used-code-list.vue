<template>
  <div class="used-code-list page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>天利商城</BreadcrumbItem>
      <BreadcrumbItem to="/SignUp/Verification">课程兑换码</BreadcrumbItem>
      <BreadcrumbItem>查看使用记录</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow class="create-verfication">
      <div class="top-bar">
        <div class="options">
          <Select v-model="is_send" style="width:100px;margin-right:20px;" @on-change="searchCodeCategory">
            <Option v-for="item in sendList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input placeholder="请输入验证码..." v-model="code" style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="searchCodeCategory(true)">查询</Button>
        </div>
      </div>
      <div class="list">
        <Table :columns="columns1" :data="codeList" :loading="codeCategoryLoading"></Table>
        <Row type="flex" justify="end" class="footer-wrapper">
          <Page @on-change="pageIndexChange" :current="currentPage" :total="codeCount"></Page>
        </Row>
      </div>
    </Card>
    <code-log-modal :is-show="modal" :value="codeId" @closeModal="modal=false"></code-log-modal>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import codeLogModal from "../modal-components/code-log";
import moment from "moment";

import {
  setCodeState,
} from "../../api/codeCategory";

export default {
  components: {
    codeLogModal
  },
  data() {
    return {
      code: "",
      codeId: "",
      modal: false,
      columns1: [
        {
          title: "ID",
          key: "id",
          width: 100,
          align: 'center'
        },
        {
          title: "兑换码",
          key: "code",
          minWidth: 300,
          align: "center"
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          minWidth: 140,
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.create_time).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "是否发送",
          key: "is_send",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.is_send > 0 ? "已发送" : "未发送");
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
            let str = params.row.state == 0 ? "立即生效" : "立即失效";
            // let msg = params.row.state == 0 ? "已使用" : "未使用";
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
                  },
                  on: {
                    click: () => {
                      this.showCodeLog(params.row.code);
                    }
                  }
                },
                "查看使用情况"
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
                      params.row.state = params.row.state == 1 ? 0 : 1;
                      let payload = {
                        code: params.row.code,
                        state: params.row.state
                      };
                      this.setCodeState(payload);
                    }
                  }
                },
                str
              )
              /*h(
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
                      alert("已恢复");
                    }
                  }
                },
                "恢复"
              ) */
            ];
            return h("div", arr);
          }
        }
      ],
      is_send: -1,
      sendList: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "未发送"
        },
        {
          value: 1,
          label: "已发送"
        }
      ]
    };
  },
  mounted() {
    this.searchCodeCategory();
  },
  computed: {
    ...mapGetters(["codeList"]),
    ...mapState({
      codeDetail: state => state.codeCategory.codeCategoryDetail,
      codeCategoryLoading: state => state.codeCategory.codeCategoryLoading,
      searchForm: state => state.codeCategory.searchForm,
      codeCount: state => state.codeCategory.codeCount,
      currentPage: state => state.codeCategory.currentPage
    })
  },
  methods: {
    ...mapActions(["getCodeList"]),
    // 搜索邀请码
    searchCodeCategory() {
      this.$store.commit("set_code_search_form", {
        //提交搜索参数
        code_category_id: this.$route.query.code_category_id,
        code: this.code,
        page_index: 0,
        is_send: this.is_send
      });
      this.getCodeList(); //获取验证码列表
    },
    // 分页
    pageIndexChange(index) {
      this.$store.commit("set_code_search_form", {
        page_index: index - 1
      });
      this.getCodeList();
    },
    showCodeLog(payload) {
      //查看验证码详情
      this.codeId = payload;
      this.modal = true;
    },
    setCodeState(payload) {
      //设置验证码状态
      setCodeState(payload)
        .then(res => {
          if (res.res_code == 1) {
            this.$Message.success("设置成功！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.used-code-list {
  .footer-wrapper {
    margin-top: 20px;
  }
}
</style>
