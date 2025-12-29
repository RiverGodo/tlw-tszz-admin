<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>中奖结果</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchPrizeUserOption.reward_id" style="width:100px" @on-change="get_prize_user_list()">
            <Option v-for="item in prizeListSelect" :value="item.reward_id" :key="item.reward_id">{{ item.name }}</Option>
          </Select>
          <Input v-model="searchPrizeUserOption.nickname" placeholder="请输入用户昵称" style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="get_prize_user_list()">查询</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前中奖用户&nbsp;（
          <span>{{searchPrizeUserOption.total_count}}</span>）&nbsp;人</p>
        <Table :loading="prizeUserLoading" :columns="prizeUserListDef" :data="prizeUserList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4"></Col>
          <Col span="20" style="text-align:right">
          <Page show-total show-sizer :current="searchPrizeUserOption.page_index + 1" :total="searchPrizeUserOption.total_count" :page-size="searchPrizeUserOption.page_size" :page-size-opts="searchPrizeUserOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      prizeUserListDef: [
        {
          title: "ID",
          key: "log_id",
          align: "center",
          width: 60
        },
        {
          title: "昵称",
          key: "nickname",
          align: "center",
          width: 100
        },
        {
          title: "奖品",
          key: "reward_name",
          align: "center",
          width: 200
        },
        {
          title: "所属问卷",
          key: "questionnaire_title",
          align: "center",
          minWidth: 350
        },
        {
          title: "所属图书",
          key: "book_title",
          align: "center",
          width: 350
        },
        {
          title: "中奖时间",
          key: "update_time",
          align: "center",
          width: 250,
          render: (h, params) =>
            h("span", moment(params.row.update_time).format("YYYY-MM-DD"))
        }
      ]
    };
  },
  computed: {
    ...mapState({
      searchPrizeUserOption: state => state.feedback.searchPrizeUserOption,
      prizeUserList: state => state.feedback.prizeUserList,
      prizeUserLoading: state => state.feedback.prizeUserLoading
    }),
    ...mapGetters(["prizeListSelect"])
  },
  mounted() {
    this.get_prize_user_list();
    if (this.prizeListSelect.length == 1) {
      this.get_reward_list();
    }
  },
  methods: {
    ...mapActions(["get_prize_user_list", "get_reward_list"]),
    pageIndexChange(v) {
      this.get_prize_user_list({ page_index: v - 1 });
    },
    pageSizeChange(v) {
      this.get_prize_user_list({ page_size: v });
    },
    selectChange() { }
  }
};
</script>
<style lang="less">
</style>
