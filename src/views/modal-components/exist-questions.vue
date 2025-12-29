<template>
  <Modal class="common-dialog" title="题目列表" width="900" v-model="addQuestionHasExist" @on-visible-change="visibleChange">
    <Row type="flex">
      <Col :span="7">
      <Select style="width:200px" v-model="searchQuestionOption.category">
        <Option v-for="item in categorys" :value="item.category" :key="item.category">{{ item.name }}</Option>
      </Select>
      </Col>
      <Col>
      <div class="top-bar">
        <div class="options">
          <Input placeholder="请输入试题名称" v-model="searchQuestionOption.title" style="width: 200px; margin-left: -10px; margin-right: 10px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="init">查询</Button>
        </div>
      </div>
      </Col>
    </Row>
    <p class="list-info">已选（
      <span>{{select_question_arr.length}}</span>）</p>
    <Table :loading="existQuestionLoading" :columns="columnsQuestion" :data="existQuestionList" @on-selection-change="selChange"></Table>
    <div class="page-size-wrapper">
      <Row type="flex" justify="space-between">
        <Button type="default" @click="delQuestion">删除</Button>
        <Page show-total :current="searchQuestionOption.page_index+1" :total="searchQuestionOption.total_count" :page-size="searchQuestionOption.page_size" @on-change="pageIndexChange">
        </Page>
      </Row>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="addLoading" @click="handleConfirm">确认添加到试卷</Button>
    </div>
  </Modal>
</template>
<script>
import {
  mapActions,
  mapState
} from "vuex";
import categorysDef from "@/libs/categorys";
import moment from "moment";
import existQuestionList from "@/views/main-components/questionnaire/exist-question-list.vue";
import {
  delQuestion
} from "@/api/feedback";

function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].question_id == val.question_id) {
      arr.splice(i, 1);
      break;
    }
  }
}

export default {
  data() {
    return {
      addQuestionHasExist: false,
      categorys: [{
        category: -1,
        name: "全部"
      }, ...categorysDef],
      addLoading: false,
      columnsQuestion: [{
        type: "selection",
        width: 40,
        align: "center"
      },
      {
        type: "expand",
        width: 50,
        render: (h, params) => {
          return h(existQuestionList, {
            props: {
              row: params.row
            }
          });
        }
      },
      {
        title: "试题名",
        key: "title",
        align: "center"
      },
      {
        title: "类型",
        key: "type",
        align: "center",
        width: 150,
        render: (h, params) => {
          let arr = this.categorys.filter(e => e.category == params.row.category);
          return arr && arr[0] ? arr[0].name : "无";
        }
      },
      {
        title: "创建时间",
        align: "center",
        width: 120,
        render: (h, params) => {
          return moment(params.row.create_time).format("YYYY-MM-DD");
        }
      },
      {
        title: "更新时间",
        align: "center",
        width: 120,
        render: (h, params) => {
          return moment(params.row.create_time).format("YYYY-MM-DD");
        }
      }
      ],
      select_question_arr: [],
      existQuestionList: []
    };
  },
  mounted() { },
  computed: {
    ...mapState({
      searchQuestionOption: state => state.feedback.searchQuestionOption,
      existQuestionListVo: state => state.feedback.existQuestionList,
      existQuestionLoading: state => state.feedback.existQuestionLoading
    })
  },
  watch: {
    existQuestionListVo(v) {
      this.select_question_arr.map(item => {
        v.map(item1 => {
          if (item.question_id == item1.question_id) {
            item1._checked = true;
          }
        });
      });
      this.existQuestionList = v;
    }
  },
  methods: {
    ...mapActions(["get_question_list"]),
    init() {
      this.get_question_list();
    },
    pageIndexChange(e) {
      this.get_question_list({
        page_index: e - 1
      });
    },
    openModal() {
      this.select_question_arr = [];
      this.addQuestionHasExist = true;
      this.init();
    },
    handleConfirm() {
      this.addLoading = true;
      if (this.select_question_arr.length == 0) {
        this.$Message.info("请选择添加的试题！");
        return;
      }

      this.$store.commit("CREATE_QUESTION", {
        data: this.select_question_arr,
        type: 1
      });
      this.$emit("on-confirm");
      this.addLoading = false;
      this.addQuestionHasExist = false;
    },
    visibleChange(v) {
      if (!v) this.addQuestionHasExist = false;
    },
    selChange(selection) {
      let needAdd = [];
      let needRemove = [];
      // console.log(selection);
      // 选出本页学生中勾选的和没勾选的放在两个数组里
      this.existQuestionList.forEach(function (element) {
        if (
          selection.find(selectitem => {
            return selectitem.question_id == element.question_id;
          })
        ) {
          needAdd.push(element);
        } else {
          needRemove.push(element);
        }
      }, this);
      //   console.log(needAdd, needRemove, selection);
      needAdd.forEach(function (element) {
        if (
          !this.select_question_arr.find(id => {
            return id == element;
          })
        ) {
          this.select_question_arr.push(element);
        }
      }, this);

      needRemove.forEach(function (element) {
        if (
          this.select_question_arr.find(id => {
            return id == element;
          })
        ) {
          removeByValue(this.select_question_arr, element);
        }
      }, this);
      // this.select_question_arr = v;
    },
    delQuestion() {
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除该试题?",
        onOk: () => {
          delQuestion({
            question_id: this.select_question_arr.map(item => item.question_id)
          })
            .then(res => {
              if (res.res_code == 1) {
                this.$Message.success("删除成功!");
                this.get_question_list();
                this.select_question_arr = [];
              } else {
                this.$Message.warning("已与该试卷绑定，无法删除!");
              }
            })
            .catch(error => {
              console.log(error);
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
<style lang="less" scoped>
</style>
