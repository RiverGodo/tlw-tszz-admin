<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/question.less";
</style>

<template>
   <div class="page-content daily-english question-manage">
    <Breadcrumb separator=">">
        <BreadcrumbItem >首页</BreadcrumbItem>
        <BreadcrumbItem>每日英语</BreadcrumbItem>
        <BreadcrumbItem>试题管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
        <div class="top-bar">
            <div class="options">
                <Select v-model="searchOption.category_id" style="width:150px;margin-right:10px;" @on-change="search(true)">
                    <Option v-for="item in questionCategoryListDef" :value="item.category_id" :key="item.category_id">{{ item.category_name }}</Option>
                </Select>
                <!-- <Select class="margin-left-10" v-model="searchOption.knowledge_point_id" style="width:200px">
                    <Option v-for="item in knowledgePointList" :value="item.knowledge_point_id" :key="item.knowledge_point_id">{{ item.knowledge_point_name }}</Option>
                </Select>   -->
                难度区间：
                <InputNumber :max="1" :min="0" :step="0.01" v-model="searchOption.level_min"></InputNumber>
                <InputNumber :max="1" :min="0" :step="0.01" v-model="searchOption.level_max"></InputNumber> 
                <div class="search-bar">         
                    <Input v-model="searchOption.from" placeholder="请输入试题来源" style="width: 200px"></Input>
                    <Button type="primary" class="btn_search"  icon="ios-search" @click="search(true)">查询</Button>
                </div>
            </div>
            <div class="actions">
                <Button type="primary" @click="goAddQuestion()">创建试题</Button>
            </div>
        </div>
        <div class="list question-list">
            <p class="list-info"><Icon type="ios-book"></Icon>当前试题<span>（{{questionCount?questionCount:"0"}}）</span></p>
            <div class="question" v-for="(q,idx) in questionList" :key="idx">
                <div class="question-top-bar">
                    <div class="title-bar">
                        <div class="title">
                            标题/来源：{{q.from}}
                        </div>
                        <div class="date">
                            日期：{{q.create_time | formatDate}}
                        </div>
                    </div>
                    <div class="info-bar">
                        <div class="info">
                            题号：{{q.question_id}}， 题型：{{q.category_name}}， 分值：{{q.default_score}}分, 难度：{{q.level}}
                        </div>
                        <div class="btn-group">
                            <Button size="small" type="info" @click="goAddQuestion(q.question_id)">
                                <span>编辑</span>
                            </Button>
                            <Button size="small" type="error" @click="delQuestion(q.question_id)">
                                <span>删除</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div class="content"  @click="showAnswerDiv(idx)">
                    <div v-if="q.question_resource_url">听力地址：
                        <div>{{q.question_resource_url}}</div>
                    </div>
                    <div class="aritcle" v-if="q.group_type == 2" v-html="q.content" ></div>
                    <div class="ques">
                        <div v-if="q.group_type == 1" v-html="q.quesHtml"></div>
                        <div v-if="q.group_type == 2" v-for="(item,index) in q.questionList" v-html="item.html"></div>
                    </div>
                    <div v-show="q.showAnswer"> 
                        <div class="answer" >
                            <div><strong>答案:</strong></div>
                            <div v-for="(a,a_idx) in q.answer" :key="a_idx">
                                <div v-if="q.sub_objective == 1" v-html="a"></div>
                                <template v-if="q.sub_objective == 2">
                                    <span v-if="q.answer.length >1">{{(a_idx+1)}}. </span>
                                {{a}}
                                </template>
                            </div>
                        </div>
                        <div class="answer">
                            <div><strong>解析:</strong></div>
                            <div v-html="q.analysis"></div>
                        </div>
                        <div class="answer" v-show="q.analysis_html">
                            <div><strong>图文解析:</strong></div>
                            <div v-html="q.analysis_html"></div>
                        </div>
                        <div  class="answer" v-show="q.analysis_resource_url">
                            <div><strong>音视频解析:</strong></div>
                            <div>{{q.analysis_resource_url}}</div>
                        </div>
                        <div  class="answer" v-show="q.analysis_trans">
                            <div><strong>材料翻译:</strong></div>
                            <div v-html="q.analysis_trans"></div>
                        </div>
                    </div>
                    <Spin fix v-if="questionListLoading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>读取信息中...</div>
                    </Spin>
                </div>
            </div>
            <div class="bottom-bar">
                <Page 
                show-total 
                show-sizer
                :current="searchOption.page_index"
                :total="questionCount"
                :page-size="searchOption.page_size" 
                :page-size-opts="searchOption.page_size_opts" 
                @on-page-size-change="pageSizeChange" 
                @on-change="pageIndexChange" >
                </Page>
            </div>
            <Spin fix v-if="questionListLoading">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>读取信息中...</div>
            </Spin>
        </div>
    </Card>
</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {deleteQuestion,checkInExercise} from "@/api/daily-english/question"
import moment from "moment";
export default {
  name: "question-list",
  data() {
    return {
    };
  },
  filters: {
    formatDate: function(value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD");
    }
  },
  computed: {
    ...mapState({
      questionCategoryListDef: state => state.deQuestion.questionCategoryList,
      searchOption: state => state.deQuestion.searchOption,
      questionList: state => state.deQuestion.questionList,
      questionListLoading: state => state.deQuestion.questionListLoading,
      questionCount: state => state.deQuestion.questionCount
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getQuestionList"]),
    init() {
      if (this.questionList.length == 0) {
        this.getQuestionList();
      }    
    },
    showAnswerDiv(idx){
      this.$store.commit("setQuestionListAnswerState", idx);
    },
    delQuestion(qid){
        checkInExercise(qid)
        .then(rs =>{
            if(rs.msg == 1){
                this.$Modal.info({
                    title: "提示信息",
                    content: "该试题已加入练习，无法删除！"
                });
            }else{
                this.$Modal.confirm({
                    title: "提示信息",
                    content: "确认删除该试题吗？",
                    onOk: res => {
                        deleteQuestion(qid)
                        .then(res =>{
                            if (res.res_code == 1) {
                                this.$Message.success("试题删除成功！");
                                this.getQuestionList();
                            }else{
                                this.$Message.error("试题删除失败！");                            
                            }
                        });
                    }
                });
            }
        });
    },
    search(init) {
        if(this.searchOption.level_min >this.searchOption.level_max ){
            this.$Modal.warning({
            title: "提示信息",
            content: "请输入正确的难度区间",
            });
            return;
        }
      if(init){      
          this.$store.commit("setQuestionPageIndex", 1);
      }
      this.getQuestionList();
    },
    pageIndexChange(page) {
        if (page != this.searchOption.page_index) {
            this.$store.commit("setQuestionPageIndex", page);
            this.search();
        }
    },
    pageSizeChange(pageSize) {
        if (pageSize != this.searchOption.page_size) {
            this.$store.commit("setQuestionPageSize", pageSize);
            this.search();
        }
    },
    goAddQuestion(qid) {
      if (qid) {
        /* checkInExercise(qid)
        .then(rs =>{
            if(rs.msg == 1){
                this.$Modal.info({
                    title: "提示信息",
                    content: "该试题已加入练习，无法编辑！"
                });
            }else{
                this.$router.push({
                name: "DEAddQuestion",
                    query: {
                        qid: qid
                    }
                });
            }
        }); */
        this.$router.push({
                name: "DEAddQuestion",
                    query: {
                        qid: qid
                    }
                });
      } else {
        this.$router.push({
          name: "DEAddQuestion"
        });
      }
    }
  }
};
</script>
