<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">有奖反馈</BreadcrumbItem>
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">问卷列表</BreadcrumbItem>
      <BreadcrumbItem to="/questionnaire-record">问卷记录</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="list" v-if="exitStatistices">
        <h2 class="quen-title">
          <input onfocus="this.select()" type="text" v-model="qnTitle" name="" id="" placeholder="请输入试卷名称"></input>
        </h2>
        <div class="questionnaire-item" :key="index" v-for="(item, index) in statistics" v-if="statistics.length > 0">
          <div class="question-num">Q{{index+1}}</div>
          <div class="single-select" v-if="item.type == 1">
            <div class="single-select-input">
              {{item.title}}
            </div>
            <div class="single-select-radio">
              <div class="single-select-radio-item skyblue">
                <span>选项</span>
                <span class="user-selected">回复情况</span>
              </div>
              <div class="single-select-radio-item" v-for="(child, index) in item.answer">
                <span class="answer-content">{{child.content}}</span>
                <span class="user-selected">{{child.count}}</span>
              </div>
            </div>

          </div>
          <div class="single-select" v-if="item.type == 4">
            <div class="single-select-input">
              {{item.title}}
            </div>
            <div class="single-select-radio">
              <div class="single-select-radio-item skyblue">
                <span>选项</span>
                <span class="user-selected">回复情况</span>
              </div>
              <div class="single-select-radio-item" v-for="(child, index) in item.answer">
                <span class="answer-content">{{child.content}}</span>
                <span class="user-selected">{{child.count}}</span>
              </div>
              <Row class="single-select-radio-item" type="flex" justify="end">
                <Button type="text" @click="fetchserAnswerByQuestionId(item.question_id, 4)">查看填空内容</Button>
              </Row>
            </div>

          </div>
          <div class="single-select" v-if="item.type == 2">
            <div class="single-select-input">
              {{item.title}}
            </div>
            <div class="single-select-radio">
              <div class="single-select-radio-item skyblue">
                <span>选项</span>
                <span class="user-selected">回复情况</span>
              </div>
              <div class="single-select-radio-item" v-for="(child, index) in item.answer">
                <span class="answer-content">{{child.content}}</span>
                <span class="user-selected">{{child.count}}</span>
              </div>
            </div>

          </div>
          <div class="single-select" v-if="item.type == 3">
            <Row type="flex" justify="space-between" class="single-select-radio-item">
              {{item.title}}
              <Button type="text" @click="fetchserAnswerByQuestionId(item.question_id)">查看</Button>
            </Row>
          </div>
        </div>
      </div>
      <Spin fix v-if="isLoading">加载中...</Spin>
      <Row type="flex" justify="center" v-if="!isLoading && statistics.length === 0">无问卷记录</Row>
    </Card>
    <Modal v-model="completionContentModal" class="common-dialog" title="回答情况" @on-ok="关闭">
      <div class="single-select">
        <div class="single-select-radio">
          <div class="answer-content-wrapper">
            <div class="single-select-radio-item completion-answer-content" :key="index" v-for="(item, index) in completionList">
              <div>
                <span>{{index+1}}.</span>
                <span>{{item.answer_content}}</span>
              </div>
              <Button type="ghost" @click="gotoDetail(item.user_id)">查看</Button>
            </div>
          </div>
          <div class="single-select-radio-item coloree">
            回答次数: {{completionList.length}}
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getUserOptionStatistics,
  getUserAnswerByQuestionId
} from "@/api/feedback";

export default {
  components: {},
  data() {
    return {
      questionnaire_id: 0,
      isCreated: 0,
      qnTitle: "",
      statistics: [],
      completionContentModal: false,
      completionList: [],
      exitStatistices: true,
      isLoading: true
    };
  },
  mounted() {
    this.questionnaire_id = this.$route.query.questionnaire_id;
    this.qnTitle = this.$route.query.qn_title;
    this.init();
  },
  methods: {
    gotoDetail(id) {
      this.$router.push({
        path: `/answerDetail?questionnaire_id=${
          this.questionnaire_id
        }&user_id=${id}&title=${this.qnTitle}`
      });
    },
    init() {
      this.isLoading = true;
      getUserOptionStatistics({
        questionnaire_id: this.questionnaire_id
      })
        .then(res => {
          if (res.res_code === 1) {
            console.log(res.msg);
            this.statistics = res.msg;
          } else {
            this.$Message.warning(res.msg);
            this.exitStatistices = false;
          }
          this.isLoading = false;
        })
        .catch(error => {
          this.$Message.warning(error);
          this.isLoading = false;
        });
    },
    fetchserAnswerByQuestionId(question_id, type) {
      getUserAnswerByQuestionId({
        question_id,
        questionnaire_id:Number(this.questionnaire_id)
      })
        .then(res => {
          if (res.res_code === 1) {
            res.msg.map(item => {
              if (item.answer.indexOf("[") > -1) {
                let write_answer = item.answer.substring(
                  1,
                  item.answer.indexOf("]")
                );
                if (type === 4) {
                  item.answer_content = JSON.parse(write_answer).content;
                } else {
                  item.answer_content = write_answer.replace(/"/g, "");
                }
              } else {
                item.answer_content = item.answer;
              }
            });
            this.completionList = res.msg;
            this.completionContentModal = true;
          } else {
            this.$Message.warning(res.msg);
          }
        })
        .catch(error => {
          this.$Message.warning(error);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.questionnaire-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .question-num {
    margin-right: 10px;
  }
}

.quen-title {
  padding: 20px 30px;
  text-align: center;
  input {
    width: 100%;
    height: 40px;
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
  border: 1px solid #eee;
  margin-bottom: 20px;
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
  .skyblue {
    background: skyblue;
    color: #fff;
  }
  .coloree {
    background: #eee;
  }
  .single-select-radio-item {
    display: flex;
    align-items: center;
    input[type="radio"],
    input[type="checkbox"] {
      margin-right: 10px;
    }
    border: 1px solid #eee;
    margin-top: -1px;
    min-height: 30px;
    line-height: 30px;
    padding-left: 15px;
    position: relative;
    .user-selected {
      position: absolute;
      left: 400px;
      top: 0;
      margin-left: 150px;
      padding-left: 15px;
      border-left: 1px solid #eee;
    }
    .answer-content {
      display: inline-block;
      width: 400px;
    }
  }
  .completion-answer-content {
    line-height: 1.8em;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: justify;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span:first-child {
      display: inline-block;
      width: 20px;
    }
    span:last-child {
      flex: 1;
    }
  }
  .single-select-options {
    margin-top: 10px;
    opacity: 0;
    display: flex;
    justify-content: space-between;
  }
  .answer-content-wrapper {
    max-height: 300px;
    overflow: auto;
    border-top: 1px solid #eee;
  }
}
</style>
