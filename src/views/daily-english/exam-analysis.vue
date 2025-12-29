<template>
    <div class="page-content daily-english de-exam-list">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>每日英语</BreadcrumbItem>
            <BreadcrumbItem to="/DailyEnglish/ExamManage">练习管理</BreadcrumbItem>            
            <BreadcrumbItem>练习分析</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <p class="row-title">测试名称：{{exercise_name}}</p>
            <p style="margin-top:15px">累计参加考试人次：{{exam_student_count}}</p>
            <p v-if="exercise_result_type == 2">平均正确率：{{exam_average_precision.toFixed(2)}}%</p>
            <p v-else>平均分：{{exam_average_score}}</p>
            <p class="row-title" style="margin-top:15px;margin-bottom:15px;">题型分析</p>
                <Row :key="index" v-for="(item, index) in categorys">
                    <p>{{item.category_name}}:{{item.average_precision.toFixed(2)}}%</p>
                </Row>
            <p class="row-title" style="margin-top:15px">题目列表</p>
            <div v-if="questions.length > 0" class="quetion-analysis-item" >
                <Row style="margin-top:15px" :key="index" v-for="(item, index) in questions">
                    <question-analysis-item :item="item"></question-analysis-item>
                </Row>
            </div>
        </Card>
    </div>
</template>

<script>
import * as api from "../../api/daily-english/exam";
import QuestionAnalysisItem from "./exam-analysis-question-item";
export default {
  components: {
    "question-analysis-item": QuestionAnalysisItem
  },
  data() {
    return {
      exercise_id: 1,
      exercise_name: "某某练习",
      exam_student_count: 200,
      exercise_result_type: 2,
      exam_average_precision: 100,
      exam_average_score: 80,
      categorys: [
        {
          category_id: 1,
          category_name: "单选",
          average_precision: 30
        }
      ],
      questions: [
        {
          question_id: 1,
          question_title: "某某题",
          question_num: 1,
          question_precision: 100,
          question_students_count: 300,
          options: [
            {
              index: "A",
              option: "选项内容"
            },
            {
              index: "B",
              option: "选项内容"
            },
            {
              index: "C",
              option: "选项内容"
            },
            {
              index: "D",
              option: "选项内容"
            }
          ],
          question_type: 1,
          answer: ["A"],
          option_statistics: [
            {
              index: "NONE",
              num: 20,
              ratio: 80
            },
            {
              index: "A",
              num: 20,
              ratio: 80
            },
            {
              index: "B",
              num: 20,
              ratio: 80
            },
            {
              index: "C",
              num: 20,
              ratio: 80
            },
            {
              index: "D",
              num: 20,
              ratio: 80
            }
          ]
        },
        {
          question_id: 2,
          question_title: "某某题",
          question_num: 2,
          question_precision: 80,
          question_students_count: 30,
          question_type: 2,
          answer: "填空答案"
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let exam_id = this.$route.query.eid;
      api
        .getExerciseAnalysis({ exercise_id: exam_id })
        .then(res => {
          if (res.res_code == 1) {
            console.log(res.msg);
            this.exercise_id = res.msg.exercise_id;
            this.exercise_name = res.msg.exercise_name;
            this.exam_student_count = res.msg.exam_student_count;
            this.exercise_result_type = res.msg.exercise_result_type;
            this.exam_average_precision = res.msg.exam_average_precision;
            this.exam_average_score = res.msg.exam_average_score;
            this.categorys = res.msg.categorys;
            this.questions = res.msg.questions;
          }
        })
        .catch(reason => {
          console.error(reason);
        });
    }
  }
};
</script>

<style lang="less">
.row-title {
  font-size: 18px;
  color: #333333;
  letter-spacing: 0.43px;
  font-weight: bolder;
}

.quetion-analysis-item {
  background: #fff;
  padding: 15px;
  div:first-child {
    margin-top: 0 !important;
  }
}
</style>
