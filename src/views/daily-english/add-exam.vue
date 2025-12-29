<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/form.less";
.de-add-exam {
  .question-list {
    
    .question-item-title {
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .category {
      margin: 10px 0;
      font-size: 18px;
      span {
        font-size: 16px;
        color: #ccc;
      }
    }
    .question {
      border: 1px solid #fff;
      position: relative;
      min-height: 26px;
      .btn-group {
        display: none;
        position: absolute;
        top: 0;
        right: 20px;
        .ivu-btn {
          font-size: 12px;
          padding: 2px 4px;
          border-radius: 0;
        }
      }
      &:hover {
        border: 1px solid #2d8cf0;
        .btn-group {
          display: block;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page-content daily-english de-add-exam">
    <Breadcrumb separator=">">
        <BreadcrumbItem>每日英语</BreadcrumbItem>
        <BreadcrumbItem to="/DailyEnglish/ExamManage">练习管理</BreadcrumbItem>
        <template v-if="addExamForm.exercise_id >0">
          <BreadcrumbItem >编辑练习</BreadcrumbItem>
        </template>
        <template v-else>
          <BreadcrumbItem >创建练习</BreadcrumbItem>
        </template>
    </Breadcrumb>
    <Card shadow>
        <div class="top-bar">
            <div class="options">
                基本信息
            </div>
            <div class="actions">

            </div>
        </div>
        <Form class="common-form add-exam-form" ref="addExamForm" :model="addExamForm" :rules="ruleValidate" label-position="right"
            :label-width="120">
            <FormItem label="练习名称" prop="exercise_name">
                <Input v-model="addExamForm.exercise_name" placeholder="请输入名称(建议字数在14个字以上，不超过45个字)"></Input>
            </FormItem>
            <FormItem label="练习简介" prop="description">
                <Input v-model="addExamForm.description" placeholder="请输入描述(建议字数在14个字以上，不超过45个字)"></Input>
            </FormItem>
            <div class="flex-row">
            <FormItem label="适用年级" prop="grade_id">
                <Select v-model="addExamForm.grade_id" style="width:150px">
                    <Option v-for="item in gradeListDef" :value="item.grade_id" :key="item.grade_id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="练习类型" prop="exercise_type">
                <Select v-model="addExamForm.exercise_type" style="width:150px">
                    <Option v-for="item in examTypeList" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="练习难度" prop="level">
              <InputNumber :max="1" :min="0" :step="0.01" v-model="addExamForm.level"></InputNumber>
              (0-1)之间
            </FormItem>
            </div>
            <Spin fix v-if="examDetailLoading">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>读取信息中...</div>
            </Spin>
        </Form>
        <div class="top-bar">
            <div class="options">
                试题列表
            </div>
            <div class="actions">
              <Button type="ghost" @click="showQuestionListDialog = true">从试题库选择</Button>
            </div>
        </div>
        <div class="question-list" v-for="(cate,cate_idx) in questionList" :key="cate.category_id">
          <div class="category">
            <strong>{{questionCategoryNumList[cate_idx]}}、</strong>
            {{cate.category_name}}: <span>共{{cate.quesCount}}题 共{{cate.default_score}}分</span>
          </div>
          <div  v-for="(ques,ques_idx) in cate.list" :key="ques_idx">
              <div class="question-item-title">
                试题标题: <Input style="width: 500px" v-model="ques.tag_title" placeholder="请输入试题标题"></Input>
              </div>
              <div class="question">
                <template v-if="ques.group_type == 1">
                  <div class="ques" v-html="ques.quesHtml"></div>
                </template>
                <template v-if="ques.group_type == 2">
                  <div class="resource" v-html="ques.content"></div>
                  <div class="ques"  v-for="(q,q_idx) in ques.questionList" :key="q_idx" v-html="q.html"></div>
                </template>
                <div class="btn-group">
                    <Button size="small" type="info" @click="editQuestion(ques.question_id)">
                        <span>编辑</span>
                    </Button>
                    <Button size="small" type="error" @click="delQuestion(ques.question_id)">
                        <span>删除</span>
                    </Button>
                </div>
              </div>
          </div>
        </div>
        <div style="text-align: center;">
            <Button type="ghost" size="large" @click="goBack()">取消返回</Button>
            <Button type="primary" size="large" :loading="addExamLoading" @click="AddExam()">保存练习</Button>
        </div>
    </Card>
    <question-list-modal 
        :is-show="showQuestionListDialog"
        :qid-list="qidList"
        @closeModal="showQuestionListDialog=false">
    </question-list-modal>
</div>
</template>

<script>
import { mapState } from "vuex";
import {
  getExerciseDetail,
  addOrUpdateExercise
} from "@/api/daily-english/exam";
import questionListModal from "../modal-components/question-list";
import Format from "@/libs/format";
export default {
  name: "add-exam",
  components: {
    questionListModal
  },
  data() {
    return {
      examDetailLoading: false,
      addExamLoading: false,
      showQuestionListDialog: false,
      tags: [],
      addExamForm: {
        exercise_id: -1,
        exercise_name: "",
        description: "",
        total_score: 0,
        exercise_type: 1,
        // subject_id: 1,
        grade_id: 1,
        level: 1,
        from: "",
        questions: []
      },
      ruleValidate: {
        exercise_name: [
          { required: true, message: "请输入练习名称！", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入练习简介！", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      gradeListDef: state => state.app.gradeList,
      questionList: state => state.deExam.questionList,
      examTypeList: state => state.deExam.examTypeList,
      questionCategoryNumList: state => state.deExam.questionCategoryNumList,
      qidList: state => state.deExam.qidList
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.commit("clearQuestionList");
      if (this.$route.query.eid > 0) {
        this.examDetailLoading = true;
        getExerciseDetail(this.$route.query.eid).then(res => {
          this.examDetailLoading = false;
          if (res.res_code == 1) {
            this.addExamForm.exercise_id = res.msg.exercise_id;
            this.addExamForm.exercise_name = res.msg.exercise_name;
            this.addExamForm.description = res.msg.description;
            this.addExamForm.exercise_type = res.msg.exercise_type;
            this.addExamForm.grade_id = res.msg.grade_id;
            this.addExamForm.from = res.msg.from;
            this.addExamForm.level = parseInt(res.msg.level);
            if (!res.msg.questions) {
              res.msg.questions = [];
            }
            let qList = res.msg.questions.filter(e => e.type == 2);
            let qHtmlList = Format.QuestionListToHtml(qList);
            qHtmlList.forEach(e => {
              this.$store.commit("addQuestionToExam", e);
            });
          }
        });
      }
    },
    delQuestion(ques_id) {
      this.$store.commit("delExamQuestion", ques_id);
    },
    editQuestion(ques_id) {
      this.$router.push({
        name: "DEAddQuestion",
        query: {
          qid: ques_id,
          eid: this.addExamForm.exercise_id
        }
      });
    },
    formatExamForm() {
      let num = 1;
      let orderby = 1;
      this.addExamForm.questions = [];
      this.addExamForm.total_score = 0;
      this.questionList.forEach((cate, cate_idx) => {
        let tag = {
          type: 1,
          num: 0,
          score: 0,
          orderby: orderby,
          tag_title:
            this.questionCategoryNumList[cate_idx] +
            "、" +
            cate.category_name +
            ":",
          tag_content:
            "共" + cate.quesCount + "题 共" + cate.default_score + "分",
          tag_score: cate.default_score,
          tag_category_id: cate.category_id,

        };
        this.addExamForm.total_score += cate.default_score;
        orderby++;
        this.addExamForm.questions.push(tag);
        cate.list.forEach((ques, ques_idx) => {
          let q = {
            type: 2,
            num: num,
            question_id: ques.question_id,
            score: ques.default_score,
            orderby: orderby,
            tag_title: ques.tag_title
          };
          this.addExamForm.questions.push(q);
          num++;
          orderby++;
        });
        // console.log(this.addExamForm);
      });
    },
    AddExam() {

      this.$refs["addExamForm"].validate(valid => {
        if (valid) {
          this.addExamLoading = true;
          this.formatExamForm();
          // return;
          // console.log(this.addExamForm);
          addOrUpdateExercise(this.addExamForm).then(res => {
            this.addExamLoading = false;
            let str = "添加";
            if (this.addExamForm.exercise_id > 0) {
              str = "编辑";
            }
            if (res.res_code == 1) {
              this.$Message.success(str + "练习成功！");
              this.$router.go(-1);
            } else {
              this.$Message.error(str + "练习失败！");
            }
          });
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
