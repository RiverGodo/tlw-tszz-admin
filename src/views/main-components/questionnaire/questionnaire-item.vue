<template>
  <div class="questionnaire-item-wrapper">
    <h2 class="quen-title">
      <Input type="textarea" v-model="qnTitle" :autosize="true" placeholder="请输入试卷名称"></Input>
    </h2>
    <div class="questionnaire-item" :key="index" v-for="(item, index) in selfQuestionList" v-if="selfQuestionList.length > 0">
      <div class="question-num">Q{{index+1}}</div>
      <div class="single-select" v-if="item.type == 1">
        <Row type="flex" align="top" justify="start" class="single-select-input">
         <Col class="question-type mr15">[单选]</Col>
         <Col :span="21">{{item.title}}</Col>
        </Row>
        <div class="single-select-radio">
          <Row type="flex" align="middle" class="single-select-radio-item" :key="index" v-for="(child, index) in item.option_arr">
            <Radio></Radio>
            <span>{{child.content}}</span>
          </Row>
        </div>
        <div class="single-select-options">
          <label>
            <Button @click="editQuestion({ type: 0, index })" type="primary">编辑</Button>
            <Button @click="delQuestionFunc({index, question_id: item.question_id})" type="default">删除</Button>
            <Button @click="setPosition({ option: 1, index })" type="primary">上移</Button>
            <Button @click="setPosition({ option: -1, index })" type="primary">下移</Button>
          </label>
        </div>
      </div>
      <div class="single-select" v-if="item.type == 2">
        <Row type="flex" align="top" justify="start" class="single-select-input">
         <Col class="question-type mr15">[多选]</Col>
         <Col :span="21">{{item.title}}</Col>
        </Row>
        <div class="single-select-radio">
          <Row type="flex" align="middle" class="single-select-radio-item" :key="index" v-for="(child, index) in item.option_arr">
            <Checkbox></Checkbox>
            <span>{{child.content}}</span>
          </Row>
        </div>
        <div class="single-select-options">
          <label>
            <Button @click="editQuestion({ type: 1, index })" type="primary">编辑</Button>
            <Button @click="delQuestionFunc({index, question_id: item.question_id})" type="default">删除</Button>
            <Button @click="setPosition({ option: 1, index })" type="primary">上移</Button>
            <Button @click="setPosition({ option: -1, index })" type="primary">下移</Button>
          </label>
        </div>
      </div>
      <div class="completion" v-if="item.type == 3">
        <Row type="flex" align="top" justify="start" class="completion-input">
         <Col class="question-type mr15">[填空]</Col>
         <Col :span="21">{{item.title}}</Col>
        </Row>
        <div class="completion-answer">
          <Input type="textarea" :rows="4"></Input>
        </div>
        <div class="complete-options">
          <label>
            <Button @click="editQuestion({ type: 2, index })" type="primary">编辑</Button>
            <Button @click="delQuestionFunc({index, question_id: item.question_id})" type="default">删除</Button>
            <Button @click="setPosition({ option: 1, index })" type="primary">上移</Button>
            <Button @click="setPosition({ option: -1, index })" type="primary">下移</Button>
          </label>
        </div>
      </div>
      <div class="single-select" v-if="item.type == 4">
        <Row type="flex" align="top" justify="start" class="single-select-input">
         <Col class="question-type mr15">[单选+填空]</Col>
         <Col :span="21">{{item.title}}</Col>
        </Row>
        <div class="single-select-radio">
          <Row type="flex" align="middle" class="single-select-radio-item" :key="index" v-for="(child, index) in item.option_arr">
            <Radio></Radio>
            <span>{{child.content}}</span>
          </Row>
          <div class="single-select-radio-item">
            <Input type="textarea" :rows="4"></Input>
          </div>
        </div>
        <div class="single-select-options">
          <label>
            <Button @click="editQuestion({ type: 3, index })" type="primary">编辑</Button>
            <Button @click="delQuestionFunc({index, question_id: item.question_id})" type="default">删除</Button>
            <Button @click="setPosition({ option: 1, index })" type="primary">上移</Button>
            <Button @click="setPosition({ option: -1, index })" type="primary">下移</Button>
          </label>
        </div>
      </div>
    </div>
    <Row type="flex" justify="end">
      <Button type="ghost" @click="goBack">返回</Button>&nbsp;&nbsp;&nbsp;
      <Button type="primary" @click="handleSubmit(-1)">保存试卷</Button>
    </Row>
    <add-single ref="single" @on-save-question="saveQuestion"></add-single>
    <add-multiple ref="multiple" @on-save-question="saveQuestion"></add-multiple>
    <add-completion ref="complete" @on-save-question="saveQuestion"></add-completion>
    <add-single-completion ref="singleAndcomplete" @on-save-question="saveQuestion"></add-single-completion>
  </div>
</template>
<script>
import addSingle from "@/views/modal-components/add-single.vue";
import addMultiple from "@/views/modal-components/add-multiple.vue";
import addCompletion from "@/views/modal-components/add-completion.vue";
import addSingleCompletion from "@/views/modal-components/add-single-completion.vue";
import { mapState } from "vuex";
import {
  addOrUpdateQuestion,
  setQuestionnaireQuestion
} from "@/api/feedback";

export default {
  components: {
    addSingle,
    addMultiple,
    addCompletion,
    addSingleCompletion
  },
  props: {
    isCreated: {
      type: Number
    }
  },
  data() {
    return {
      singlePageCon: null,
      sinlePage: null,
      createButton: null,
      modalQuestion: null,
      isEdit: -1,
      Index: -1,
      qnTitle: "",
      questionnaireIdVo: 0
    };
  },
  mounted() {
    var that = this;
    this.$nextTick(function() {
      that.singlePageCon = document.querySelector(".single-page-con");
      that.singlePage = document.querySelector(".single-page");
    });
    this.questionnaireIdVo = this.$route.query.questionnaire_id;
  },
  computed: {
    ...mapState({
      selfQuestionList: state => state.feedback.selfQuestionList,
      questionnaireDetail: state => state.feedback.questionnaireDetail
    })
  },
  watch: {
    questionnaireDetail(v) {
      this.qnTitle = v.qn_title;
    }
  },
  methods: {
    filterOption(v, a) {
      return a.find(item => item == v) ? true : false;
    },
    goBack() {
      this.$router.push({
        path: "QuesLottery/QuestionnaireList"
      });
    },
    saveQuestion(v) {
      console.log(v);
      // return
      // 添加或保存试题
      addOrUpdateQuestion(v)
        .then(res => {
          if (res.res_code === 1) {
            v.question_id = res.msg;
            this.handleSubmit();
          }
        })
        .catch(error => {
          this.$Message.warning(error);
        });

      if (this.isEdit > 0) {
        this.$store.commit("EDIT_QUESTION", {
          Index: this.Index,
          data: v
        });
      } else {
        setTimeout(_ => {
          this.singlePageCon.scrollTop =
            this.singlePage.scrollHeight - this.singlePageCon.offsetHeight;
        }, 200);
        this.$store.commit("CREATE_QUESTION", {
          data: [v],
          type: 2
        });
      }
    },
    handleSubmit(v) {
      var questionnaire_id,
        question_arr = [];

      if (!this.questionnaireIdVo) {
        questionnaire_id = -1;
        this.selfQuestionList.map((item, index) => {
          question_arr.push({
            question_id: item.question_id,
            orderby: index + 1
          });
        });
      } else {
        questionnaire_id = this.questionnaireIdVo;
        this.selfQuestionList.map((item, index) => {
          question_arr.push({
            question_id: item.question_id,
            orderby: index + 1
          });
        });
      }

      if (!this.qnTitle) {
        this.$Message.warning("请输入试卷名称!");
        return;
      }

      if (question_arr.length == 0) {
        this.$Message.warning("请添加至少一个题型!");
        return;
      }
      // console.log(this.selfQuestionList);
      // return;
      setQuestionnaireQuestion({
        questionnaire_id,
        title: this.qnTitle,
        question_arr
      })
        .then(res => {
          // console.log(res);
          if (res.res_code === 1) {
            this.questionnaireIdVo = res.msg;
            window.localStorage.setItem("questionnaire_id", res.msg);
            if (v !== 0) {
              this.$Message.success("保存成功!");
              if (v < 0) {
                this.$router.push({
                  path: "/QuesLottery/QuestionnaireList"
                });
              }
            }
          }
        })
        .catch(error => {
          this.$Message.warning(error);
        });
    },
    editQuestion(v) {
      // console.log(this.selfQuestionList[v.index]);
      this.Index = v.index;
      this.isEdit = 1;
      // this.$store.commit("SEND_QUESTION_DATA", this.selfQuestionList[v.index]);
      this.modalList(v.type, this.selfQuestionList[v.index]);
    },
    showModal(v) {
      this.isEdit = 0;
      // this.$store.commit("SEND_QUESTION_DATA", null);
      this.modalList(v, null);
    },
    modalList(v, d) {
      switch (v) {
        case 0:
          this.$refs.single.questionData(d);
          this.$refs.single.parentOpenModal();
          break;
        case 1:
          this.$refs.multiple.parentOpenModal(d);
          break;
        case 2:
          this.$refs.complete.questionData(d);
          this.$refs.complete.parentOpenModal();
          break;
        case 3:
          this.$refs.singleAndcomplete.questionData(d);
          this.$refs.singleAndcomplete.parentOpenModal();
          break;
      }
    },
    // 删除试题
    delQuestionFunc(v) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除该试题?",
        onOk: () => {
          this.selfQuestionList.splice(v.index, 1);
          this.$Message.success("删除成功!");
          this.handleSubmit(0);
          // console.log(this.questionnaireIdVo);
          // delQuestion({
          //   question_id: v.question_id
          // })
          //   .then(res => {
          //     console.log(res);
          //     if (res.res_code == 1) {
          //       this.selfQuestionList.splice(v.index, 1);
          //     } else {
          //       this.$Message.warning("已与该试卷绑定，无法删除!");
          //     }
          //   })
          //   .catch(error => {
          //     console.log(error);
          //   });
        },
        onCancel: () => {
          // this.$Message.info("Clicked cancel");
        }
      });
    },
    setPosition(v) {
      var list = this.selfQuestionList;
      if (v.option > 0) {
        list.splice(v.index - 1, 0, list[v.index]);
        //删除后一项
        list.splice(v.index + 1, 1);
        if (v.index == 0) {
          this.$Message.info("到顶啦！");
        }
      } else {
        list.splice(v.index + 2, 0, list[v.index]);
        // 删除前一项
        list.splice(v.index, 1);
        if (v.index == list.length - 1) {
          this.$Message.info("已经是最后一项啦！");
        }
      }
    }
  }
};
</script>
<style lang="less">
.questionnaire-item-wrapper {
  .quen-title {
    padding: 20px 30px;
    text-align: center;
    textarea {
      width: 100%;
      border: 0;
      text-align: center;
      font-size: 26px;
      &:focus {
        background: #fdf9cd;
        outline: none;
        box-shadow: none;
      }
    }
  }
  .single-select-radio-item {
    .ivu-checkbox {
      margin-right: 6px;
    }
  }
}
</style>

<style lang="less" scoped>
.questionnaire-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .question-num {
    margin-right: 10px;
  }
}
.question-type {
  color: skyblue;
}
.mr15 {
  margin-right: 15px;
}
.quen-title {
  padding: 20px 30px;
  text-align: center;
  textarea {
    width: 100%;
    border: 0;
    text-align: center;
    &:focus {
      background: #fdf9cd;
      outline: none;
      box-shadow: none;
    }
  }
}

.single-select {
  padding: 15px;
  border: 1px solid #dddee1;
  margin-bottom: 20px;
  border-radius: 4px;
  flex: 1;
  &:hover .single-select-options {
    opacity: 1;
  }
  input {
    height: 40px;
    border: 0;
    text-indent: 1em;
    &:focus {
      background: #fdf9cd;
      outline: none;
      box-shadow: none;
    }
  }
  .single-select-input {
    margin-bottom: 20px;
    input {
      width: 100%;
    }
  }
  .single-select-radio .ivu-radio-group {
    display: flex;
    flex-direction: column;
    input {
      width: 100%;
    }
  }
  .single-select-radio-item {
    margin-bottom: 10px;
    input[type="radio"],
    input[type="checkbox"] {
      margin-right: 8px;
    }
  }
  .single-select-options {
    margin-top: 10px;
    opacity: 0;
    display: flex;
    justify-content: space-between;
  }
}

.completion {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 20px;
  flex: 1;
  &:hover .complete-options {
    opacity: 1;
  }
  .completion-answer textarea {
    width: 400px;
    height: 80px;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;
  }
  .completion-input {
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 40px;
      border: 0;
      &:focus {
        background: #fdf9cd;
        outline: none;
        box-shadow: none;
      }
    }
  }
  .complete-options {
    margin-top: 10px;
    opacity: 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
