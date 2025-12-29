<template>
  <Modal
    class="common-dialog add-book-dialog active_log"
    v-model="showModal"
    title="激活升级记录"
    :footer-hide="true"
    :mask-closable="false"
  >
  <div class="table_center">
      <Table :loading="dealerListLoading" :columns="dealerListColumns" :data="dealerList"></Table>
  </div>
  </Modal>
</template>
<script>
import moment from "moment";
import { getActivationLog } from "@/api/dealer/dealer";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    activationId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      dealerList: [],
      showModal: false,
      dealerListLoading: false,
      dealerCount: 0,
      searchOption: {
        activation_id: ""
      },
      dealerListColumns: [
        {
          title: "订单id",
          key: "order_id",
          minWidth: 250
        },
        {
          title: "押题卷版本",
          key: "version_name",
          minWidth: 150
        },
        {
          title: "类型",
          minWidth: 100,
          render: (h, params) =>
            h("span", params.row.type === 1 ? "激活" : "升级")
        },
        {
          title: "操作人",
          minWidth: 100,
          render: (h, params) =>
            h("span", params.row.user_type === 1 ? "经销商" : `用户(${ params.row.nickname})`)
        },
        {
          title: "操作时间",
          key: "create_time",
          minWidth: 120,
          render: (h, params) =>
            h("span", moment(params.row.create_time).format("YYYY-MM-DD"))
        }
      ]
    };
  },
  watch: {
    isShow(value) {
      if (value) {
        this.showModal = true;
        this.init();
      }
    },
    showModal(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  methods: {
    search() {
      if (this.dealerListLoading) {
        return false;
      }
      this.dealerListLoading = true;
      getActivationLog(this.searchOption)
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
      if (this.activationId) {
        this.searchOption = {
          activation_id: this.activationId
        };
        this.search();
      }
    }
  }
};
</script>
<style lang="less">

.active_log .ivu-modal-body {
    padding: 10px 30px !important;
}
</style>
<style lang="less" scoped>

</style>
