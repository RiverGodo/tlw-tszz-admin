<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>有奖反馈</BreadcrumbItem>
      <BreadcrumbItem>问卷列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <h3 class="answer-detail-title">
        答题详情:
      </h3>
      <Row style="margin-bottom: 30px" class="questionnaire-title">
        试卷名称: {{title}}
      </Row>
      <h3 class="answer-detail-title">
        答题详情:
      </h3>
      <Row class="question-item" :key="item.question_id" v-for="(item, index) in answerDetailList">
        <Row class="question-title">Q{{index+1}}. {{item.title}}</Row>
        <Row class="question-answer">
          <Row class="question-answer-item" :key="index" v-for="(child, index) in item.answer_content_arr">
            <Row>{{child.content}}</Row>
          </Row>
        </Row>
      </Row>
      <Spin fix v-if="isLoading">加载中...</Spin>
      <Row type="flex" justify="center" v-if="!isLoading && answerDetailList.length === 0">暂无答题详情</Row>
    </Card>
  </div>
</template>
<script>
import { getUserAnswerDetail } from "@/api/feedback";
export default {
  data() {
    return {
      questionnaireId: 0,
      to_user_id: 0,
      answerDetailList: [],
      title: "",
      isLoading: true
    };
  },
  mounted() {
    this.questionnaireId = this.$route.query.questionnaire_id;
    this.to_user_id = this.$route.query.user_id;
    this.title = this.$route.query.title;
    this.getUserAnserDetailFunc();
  },
  methods: {
    getUserAnserDetailFunc() {
      this.isLoading = true;
      getUserAnswerDetail({
        questionnaire_id: this.questionnaireId,
        to_user_id: this.to_user_id
      })
        .then(res => {
          if (res.res_code === 1) {
            res.msg.forEach(element => {
              if (element.type === 3) {
                if (element.answer.indexOf("[") > -1) {
                  let write_answer = element.answer.substring(
                    1,
                    element.answer.indexOf("]")
                  );
                  element.answer_content_arr = [write_answer.replace(/"/g, "")];
                } else {
                  element.answer_content_arr = [element.answer];
                }
              } else {
                if (element.type === 4) {
                  let answer1 = JSON.parse(element.answer);
                  let content;

                  if(answer1[0]['content']){
                    content = answer1[0]['content']
                  }

                  element.answer_content_arr = [...element.option_arr.filter(
                    item => item.option_id == answer1[0].option_id
                  ), {content}];
                  console.log(element.answer_content_arr)
                } else {
                  let answer = JSON.parse(element.answer);
                  element.answer_content_arr = element.option_arr.filter(
                    item => item.option_id == answer
                  );
                }
              }
            });
            this.answerDetailList = res.msg;
          }
          this.isLoading = false;
        })
        .catch(error => {
          this.$Message.warning(error);
          this.isLoading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.answer-detail-title {
  margin-bottom: 20px;
}

.questionnaire-title {
  border: 1px solid #eee;
  background: #eee;
  min-height: 30px;
  padding-left: 10px;
  display: flex;
  align-items: center;
}

.question-item {
  margin-bottom: 20px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  .question-title {
    background: #eee;
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .question-title,
  .question-answer {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    min-height: 30px;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
  .question-answer{
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
}
</style>
