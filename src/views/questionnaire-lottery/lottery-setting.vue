<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>奖项管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">

        </div>
        <div class="actions" style="flex: 0 0 100px;">
          <Button type="primary" icon="android-add" @click="showAddPrize(-1)">添加奖项</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前奖项&nbsp;（
          <span>{{prizeList.length}}</span>）</p>
        <Table :loading="PrizeListLoading" :columns="prizeListDef" :data="prizeList"></Table>
      </div>
    </Card>
    <add-prize-modal :is-show="showAddPrizeDialog" :prize-id="prize_id" @closeModal="showAddPrizeDialog=false" @refreshList="" :reward-detail="rewardDetail"></add-prize-modal>
  </div>
</template>
<script>
import addPrizeModal from "../modal-components/add-prize.vue";
import { delReward } from "@/api/feedback";
import { mapState, mapActions } from "vuex";

function getRewardName(type) {
  let content = "";
  if (type == 0) {
    content = "其他";
  } else if (type == 1) {
    content = "话费";
  } else if (type == 2) {
    content = "流量";
  } else if (type == 3) {
    content = "优惠卷";
  }
  console.log(content);

  return content;
}
export default {
  components: {
    addPrizeModal
  },
  data() {
    return {
      prize_id: -1,
      showAddPrizeDialog: false,
      rewardDetail: {},
      prizeListDef: [
        {
          title: "ID",
          key: "reward_id",
          align: "center",
          width: 60
        },
        {
          title: "奖项",
          key: "type", // 1 -- 话费, 2 -- 流量, 0 -- 其他
          align: "center",
          minWidth: 120,
          render: (h, params) => h("span", getRewardName(params.row.type))
        },
        {
          title: "真实金额",
          key: "real_price",
          align: "center",
          minWidth: 80,
        },
        {
          title: "奖项",
          key: "name",
          align: "center",
          minWidth: 200,
        },
        {
          title: "总数",
          key: "count",
          align: "center",
          width: 120,
          render: (h, params) =>
            h("span", params.row.can_use_count + params.row.used_count)
        },
        {
          title: "剩余数量",
          key: "can_use_count",
          align: "center",
          width: 120
        },
        {
          title: "权重",
          key: "weight",
          align: "center",
          width: 100
        },
        {
          title: "中奖率",
          key: "weight",
          align: "center",
          width: 100,
          render: (h, params) =>
            h("span", (params.row.weight / this.prizeWeightAll * 100).toFixed(2) + "%")
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 230,
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
                  },
                  on: {
                    click: () => {
                      this.showAddPrize(params.row.reward_id);
                      let detail = params.row;
                      this.rewardDetail = detail;
                    }
                  }
                },
                "编辑"
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
                      this.$Modal.confirm({
                        title: "提示",
                        content: "是否删除该奖品?",
                        onOk: () => {
                          delReward({ reward_id: params.row.reward_id })
                            .then(res => {
                              if (res.res_code === 1) {
                                this.$Message.success("删除成功!");
                                this.get_reward_list();
                              } else {
                                this.$Message.warning(res.msg);
                              }
                            })
                            .catch(error => {
                              this.$Message.warning(error);
                            });
                        },
                        onCancel: () => {
                          // this.$Message.info("Clicked cancel");
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ];
            return h("div", arr);
          }
        }
      ]
    };
  },
  mounted() {
    this.get_reward_list();
  },
  computed: {
    ...mapState({
      prizeList: state => state.feedback.prizeList,
      PrizeListLoading: state => state.feedback.prizeListLoading
    }),
    prizeWeightAll() {
      return this.prizeList.map(e => e.weight).reduce((s, v) => s + v);
    }
  },
  methods: {
    ...mapActions(["get_reward_list"]),
    showAddPrize(id) {
      this.prize_id = id;
      this.showAddPrizeDialog = true;
    }
  }
};
</script>
<style lang="less">
</style>
