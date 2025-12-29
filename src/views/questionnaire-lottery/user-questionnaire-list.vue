<style lang="less">
.common-dialog.qrcode-modal {
  .ivu-modal {
    min-width: 200px;
    .ivu-modal-body {
      text-align: center;
    }
  }
}
</style>
<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">有奖反馈</BreadcrumbItem>
      <BreadcrumbItem to="/QuesLottery/UserQuestionnaireList">答卷列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <Button type="primary" @click="handleExport">导出</Button>
      <div class="list">
        <Table :loading="answerlistLoading" :columns="answerColumns" :data="answerList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">
          </Col>
          <Col span="20" style="text-align:right">
          <Page show-total show-sizer :current="searchAnswerOption.page_index + 1" :total="searchAnswerOption.total_count" :page-size="searchAnswerOption.page_size" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col>
        </Row>
      </div>
    </Card>
    <!-- <export-data :is-show="is_show_export" :data="arr_list" :check-list="check_list" @closemodal="is_show_export=false"></export-data> -->
    <Modal @on-ok="handleChangeTime" @on-cancel="is_show_export = false" v-model="is_show_export" title="导出" width="400" ok-text="确认导出并下载">
      <div v-if="is_show_time">
        <div style="width:300px;display:block;margin: 0 auto 10px;">开始时间： <DatePicker type="date" placeholder="选择开始日期" style="width:230px;" v-model="export_start_time"></DatePicker></div> 
        <div style="width:300px;display:block;margin:0 auto;">结束时间： <DatePicker type="date" placeholder="选择结束日期" style="width:230px;" v-model="export_end_time"></DatePicker></div>
      </div>
      <div v-if="!is_show_time">文件太大，下载需要时间，请耐心等待</div>
      <Progress :percent="percent" style="background:#fff;width:350px;margin:0 auto;display:block" v-if="!is_show_time">
        <Icon type="checkmark-circled" v-if="percent == 100"></Icon>
        <span v-if="percent == 100">成功</span>
      </Progress>
    </Modal>
  </div>
</template>

<script>
import * as apiBook from "@/api/book";
import { mapActions, mapState } from "vuex";
import addBookModal from "../modal-components/add-book.vue";
import qrcode from "@xkeshi/vue-qrcode";
import moment from "moment";
function formatTime(seconds) {
  var min = Math.floor(seconds / 60),
    second = seconds % 60,
    hour,
    newMin,
    time;

  if (min > 60) {
    hour = Math.floor(min / 60);
    newMin = min % 60;
  }

  if (second < 10) {
    second = "0" + second;
  }
  if (min < 10) {
    min = "0" + min;
  }

  return (time = hour
    ? hour + "时" + newMin + "分" + second + "秒"
    : min + "分" + second + "秒");
}

export default {
  name: "bookList",
  components: {
    addBookModal,
    qrcode
  },
  data() {
    return {
      showAddBookDialog: false,
      book_id: -1,
      export_start_time: '',   // 开始日期
      export_end_time: '',     // 结束日期
      showQrCode: false,
      is_show_time: true,
      percent: 0,
      book_id_arr: [],
      is_show_export: false,    // 显隐弹框
      qrCodeUrl: "",
      filename: "",
      delBookLoading: false,
      answerColumns: [
        {
          title: "ID",
          key: "user_id",
          align: "center",
          width: 100
        },
        {
          title: "头像/昵称",
          key: "avatar_url",
          width: 160,
          align: "left",
          render: (h, params) => {
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
                    size: 'small'
                  }
                }),
                h(
                  "div",
                  {
                    attrs: {
                      class: "nickname"
                    }
                  },
                  params.row.nickname
                )
              ]
            );
          }
        },
        {
          title: "答卷名称",
          key: "title",
          align: "center",
          minWidth: 300
        },
        {
          title: "完成时间",
          key: "create_time",
          align: "center",
          width: 120,
          render: (h, params) =>
            h("span", moment(params.row.create_time).format("YYYY-MM-DD"))
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 80,
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
                      this.$router.push({
                        path: `/answerDetail?questionnaire_id=${
                          params.row.questionnaire_id
                          }&user_id=${params.row.user_id}&title=${
                          params.row.title
                          }`
                      });
                    }
                  }
                },
                "查看"
              )
            ];
            // if(params.row.has_verify_code == 0){
            //   arr.splice(3);
            // }
            return h("div", arr);
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      answerList: state => state.feedback.answerList,
      searchAnswerOption: state => state.feedback.searchAnswerOption,
      answerlistLoading: state => state.feedback.answerlistLoading
    })
  },
  mounted() {
    this.get_user_answer_list();
  },
  methods: {
    ...mapActions(["get_user_answer_list"]),
    pageIndexChange(v) {
      this.get_user_answer_list({ page_index: v - 1 });
    },
    pageSizeChange(v) {
      this.get_user_answer_list({ page_size: v });
    },
    selectChange() { },
    /*
    * anthor jiayin
    * time 19.1.16
    * 按时间段导出数据
    */
    handleExport () {
      this.is_show_export = true
    },
    handleChangeTime () {
      if (this.export_start_time == '') {
        this.$Message.warning('请选择时间')
        return;
      }
      apiBook.userFeedbackExport({
        start_time: this.export_start_time,
        end_time: this.export_end_time,
      }).then(res => {
        let wait_time = res.data.wait_time
        if (wait_time > 0) {
          this.is_show_time = false
          this.is_show_export = true
          let i = 0
          let timeId = setInterval(() => {
            i = i+50
            this.percent = Number((i / wait_time * 100).toFixed(2))
          },50)
          setTimeout(() => {
            this.percent = 100
            clearInterval(timeId)
            this.handleChangeTime()
          },wait_time)
        } else {
          this.percent = 0
          this.$Message.success('下载完成')
          this.is_show_time = true
          this.is_show_export = false
          window.location.href = 'http://api.tl100.com/download/tool_excel/' + res.data.download_url
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
.avatar-title {
  display: flex;
  justify-content: center;
}
</style>
