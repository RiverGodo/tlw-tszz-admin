<style lang="less">
.code-log-modal {
  .ivu-col {
    text-align: center;
  }
}
</style>

<template>
  <Modal class="code-log-modal" title="使用日志" v-model="showModal">
    <div v-if="codeLog.code_category_id">
      <Row style="margin-bottom:10px">
        <Col span="3">用户ID</Col>
        <Col span="3">兑换码批次</Col>
        <Col span="6">兑换程序</Col>
        <Col span="5">兑换内容</Col>
        <Col span="7">兑换时间</Col>
      </Row>
      <Row v-for="(item,index) in codeLog.logs" :key="index">
        <Col span="3">{{item.user_id}}</Col>
        <Col span="3">{{codeLog.code_category_id}}</Col>
        <Col span="6">{{item.app_desc}}</Col>
        <Col span="5">{{item.content}}</Col>
        <Col span="7">{{item.create_time}}</Col>
      </Row>
    </div>
    <Row v-else style="padding:10px 0">
      <Col span="24">{{codeLog}}</Col>
    </Row>
    <Spin fix v-if="codeLogLoading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>读取信息中...</div>
    </Spin>
  </Modal>
</template>
<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  name: "code-log-modal",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState({
      codeLog: state => {
        if (state.codeCategory.codeLog.code_category_id) {
          let data = Object.assign({}, state.codeCategory.codeLog);
          data.logs.forEach(item => {
            item.content = "";
            let content = JSON.parse(item.code_content);
            content.forEach(val => {
              item.content += val.related_id + ','
            })
            item.content = item.content.replace(/,$/, "")
            item.create_time = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")
          });
          return data
        }
        return state.codeCategory.codeLog
      },
      codeLogLoading: state => state.codeCategory.codeLogLoading
    })
  },
  watch: {
    isShow: function (value) {
      if (value) {
        this.showModal = value;
        this.getCodeLog(this.value)
      }
    },
    showModal: function (value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  methods: {
    ...mapActions(["getCodeLog"])
  }
};
</script>
<style lang="less">
</style>


