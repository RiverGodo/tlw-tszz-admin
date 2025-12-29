<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">有奖反馈</BreadcrumbItem>
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">问卷列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <!-- <Select v-model="questionCatagory[0]" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in questionCatagory" :value="item" :key="item">{{ item }}</Option>
                    </Select> -->
          <Input placeholder="请输入问卷名称" style="width: 200px" v-model="search_content"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="search()">查询</Button>
        </div>
        <div class="actions" style="flex: 0 0 400px;">
          <!-- <Button type="primary" @click="showBindBooks">选择待绑定图书</Button> -->
          <Button type="primary" icon="android-add" @click="showAddQuestionnaire(-1)">创建问卷</Button>
        </div>
      </div>
      <div class="list">
        <!-- <p class="list-info"><Icon type="ios-book"></Icon>当前图书&nbsp;（<span>{{bookCount}}</span>）&nbsp;本，&nbsp;已选（<span>{{all_book_id_arr.length}}</span>）</p> -->
        <Table :loading="questionnaireLoading" :columns="bookListDef" :data="questionnaireList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">
          <Button type="ghost" @click="delQuestionnaire">删除</Button>
          </Col>
          <Col span="20" style="text-align:right">
          <Page show-total show-sizer :current="searchQuestionnaireOption.page_index + 1" :total="searchQuestionnaireOption.total_count" :page-size="searchQuestionnaireOption.page_size" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col>
        </Row>
      </div>
    </Card>
    <!-- <Modal class="common-dialog qrcode-modal"  title="新建问卷" v-model="showQuestionnaire">
          <Form label-position="right" :label-width="80">
            <FormItem class="mb-0" label="名称" prop="title">
                <Input placeholder="请输入问卷名称..."></Input>
            </FormItem>
          </Form>
        </Modal> -->
    <bind-book-list ref="needBindBookList"></bind-book-list>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import { delQuestionnaire } from "@/api/feedback";
import bindBookList from "@/views/main-components/questionnaire/bind-book-list.vue";

function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
export default {
  components: {
    bindBookList
  },
  data() {
    return {
      questionCatagory: ["全部类型", "问卷"],
      showQuestionnaire: false,
      questionnaire_id_arr: [],
      search_content: '',
      bookListDef: [
        {
          type: "selection",
          width: 100,
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "left",
          minWidth: 300
        },
        {
          title: "题目数量",
          key: "question_count",
          align: "center",
          width: 100
        },
        {
          title: "回答次数",
          key: "answer_count",
          align: "center",
          width: 100
        },
        {
          title: "绑定图书数量",
          key: "book_count",
          align: "center",
          width: 100
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h('span', moment(params.row.create_time).format("YYYY-MM-DD"));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 230,
          render: (h, params) => {
            // var stateStr = params.row.state == 0 ? "取消下架" : "取消上架";
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
                        path:
                          "/QuestionnaireDetail?questionnaire_id=" +
                          params.row.questionnaire_id
                      });
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
                      this.$refs.needBindBookList.openModal(
                        params.row.questionnaire_id
                      );
                    }
                  }
                },
                "绑定图书"
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
                      this.$router.push({
                        path: '/questionnaire-record?questionnaire_id=' + params.row.questionnaire_id + '&qn_title=' + params.row.title
                      })
                    }
                  }
                },
                "查看答题记录"
              )
            ];
            // if(params.row.has_verify_code == 0){
            //   arr.splice(3);
            // }
            return h("div", arr);
          }
        }
      ],
      questionnaireList: []
    };
  },
  computed: {
    ...mapState({
      searchQuestionnaireOption: state =>
        state.feedback.searchQuestionnaireOption,
      questionnaireListVo: state => state.feedback.questionnaireList,
      questionnaireLoading: state => state.feedback.questionnaireLoading
    })
  },
  mounted() {
    this.get_questionnaire_list();
  },
  watch: {
    questionnaireListVo(v) {
      this.questionnaire_id_arr.map(item => {
        v.map(item1 => {
          if (item == item1.questionnaire_id) {
            item1._checked = true;
          }
        });
      });
      this.questionnaireList = v;
    }
  },
  methods: {
    ...mapActions([
      "get_questionnaire_list",
      "get_question_list_by_questionnaire"
    ]),
    search() {
      this.get_questionnaire_list({ title: this.search_content });
    },
    pageSizeChange(v) {
      this.get_questionnaire_list({ page_size: v });
    },
    pageIndexChange(v) {
      this.get_questionnaire_list({ page_index: v - 1 });
    },
    showAddQuestionnaire(v) {
      this.$router.push({
        path: "/QuestionnaireDetail?isCreate=1"
      });
      // this.showQuestionnaire = true;
    },
    showBindBooks() { },
    selectChange(selection) {
      let needAdd = [];
      let needRemove = [];
      // console.log(selection);
      // 选出本页学生中勾选的和没勾选的放在两个数组里
      this.questionnaireList.forEach(function (element) {
        if (
          selection.find(selectitem => {
            return selectitem.questionnaire_id == element.questionnaire_id;
          })
        ) {
          needAdd.push(element.questionnaire_id);
        } else {
          needRemove.push(element.questionnaire_id);
        }
      }, this);
      //   console.log(needAdd, needRemove, selection);
      needAdd.forEach(function (element) {
        if (
          !this.questionnaire_id_arr.find(id => {
            return id == element;
          })
        ) {
          this.questionnaire_id_arr.push(element);
        }
      }, this);

      needRemove.forEach(function (element) {
        if (
          this.questionnaire_id_arr.find(id => {
            return id == element;
          })
        ) {
          removeByValue(this.questionnaire_id_arr, element);
        }
      }, this);
      // console.log(this.questionnaire_id_arr)
    },
    // 删除问卷
    delQuestionnaire() {
      if (this.questionnaire_id_arr.length == 0) {
        this.$Message.success("请选择要删除的问卷~");
        return
      }

      this.$Modal.confirm({
        title: "提示",
        content: "是否删除该试题?",
        onOk: () => {
          delQuestionnaire({
            questionnaire_id_arr: this.questionnaire_id_arr
          })
            .then(res => {
              if (res.res_code === 1) {
                this.$Message.success("删除成功!");
                this.get_questionnaire_list();
              } else {
                this.$Message.warning("已图书绑定，无法删除!");
              }
              this.questionnaire_id_arr = [];
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
};
</script>

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