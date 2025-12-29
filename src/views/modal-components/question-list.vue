<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/question.less";
.common-dialog.question-list-modal {
  .ivu-modal {
      min-width: 900px;
  }
}
</style>

<template>
    <Modal class="common-dialog daily-english question-list-modal"
        v-model="showModal"
        title="选择已有试题">
        <div class="options">
            <Select v-model="searchOption.category_id" style="width:150px" @on-change="search(true)">
                <Option v-for="item in questionCategoryListDef" :value="item.category_id" :key="item.category_id">{{ item.category_name }}</Option>
            </Select>
            <span class="margin-left-10">难度区间：</span>
            <InputNumber :max="1" :min="0" :step="0.01" v-model="searchOption.level_min"></InputNumber>
            <InputNumber :max="1" :min="0" :step="0.01" v-model="searchOption.level_max"></InputNumber> 
            <Input class="margin-left-10" v-model="searchOption.from" placeholder="请输入来源" style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
        </div>
        <div class="list question-list" style="margin-top:20px;">
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
                            题号：{{q.question_id}}，题型：{{q.category_name}}，难度：
                            {{q.level}}
                        </div>
                        <div class="btn-group">
                            <template v-if="!q.isAdd">
                                <Button size="small" type="info" icon="plus" @click="addQuestionToExam(q)">
                                    <span>加入练习</span>
                                </Button>
                            </template>
                            <template v-else>
                                <Button size="small" type="ghost" disabled>
                                    <span>已经加入</span>
                                </Button>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="content" @click="showAnswerDiv(idx)">
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
                                <span v-if="q.answer.length >1">{{(a_idx+1)}}. </span>
                                {{a}}
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
                        <div class="answer" v-show="q.analysis_resource_url">
                            <div><strong>音视频解析:</strong></div>
                            <div>{{q.analysis_resource_url}}</div>
                        </div>
                        <div class="answer" v-show="q.analysis_trans">
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
            <Row class="bottom-bar" type="flex" justify="space-between">
                <Col span="4">
                </Col>
                <Col span="20" style="text-align:right">
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
                </Col>
            </Row>
            <Spin fix v-if="questionListLoading">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>读取信息中...</div>
            </Spin>
        </div>
        <div slot="footer">
            <Button type="ghost" size="large" @click="showModal = false" >返回</Button>
        </div>
    </Modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  name: "questionListModal",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    qidList:{
       type: Array,
       default:[]
    }
  },
  data() {
    return {
      showModal:false,
    };
  },
  filters: {
    formatDate: function(value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD");
    }
  },
  watch: {
    isShow: function(value) {
      if (value) {
        this.showModal = value;
      }
    },
    showModal: function(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    },
    qidList:function(value){
        this.$store.commit("setModalQuestionListAddState", value);
    }
  },
  computed: {
    ...mapState({
      questionCategoryListDef: state => state.deQuestion.questionCategoryList,
      searchOption: state => state.deModalQuestion.searchOption,
      questionList: state => state.deModalQuestion.questionList,
      questionListLoading: state => state.deModalQuestion.questionListLoading,
      questionCount: state => state.deModalQuestion.questionCount
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getModalQuestionList"]),
    init() {
      if (this.questionList.length == 0) {
        this.getModalQuestionList(this.qidList);
      }    
    },
    showAnswerDiv(idx){
      this.$store.commit("setModalQuestionListAnswerState", idx);
    },
    addQuestionToExam(ques){
        let q ={};
        q.question_id = ques.question_id;
        q.category_id = ques.category_id;
        q.category_name = ques.category_name;
        q.content = ques.content;
        q.quesHtml = ques.quesHtml;
        q.default_score = ques.default_score;
        q.group_type = ques.group_type;
        if(ques.questionList){
            q.questionList = [...ques.questionList];
        }

        this.$store.commit("addQuestionToExam", q);
    },
    search(init) {
      if(init){
        this.$store.commit("setModalQuestionPageIndex", 1);
      }
      this.getModalQuestionList(this.qidList);
    },
    pageIndexChange(page) {
        if (page != this.searchOption.page_index) {
            this.$store.commit("setModalQuestionPageIndex", page);
            this.search();
        }
    },
    pageSizeChange(pageSize) {
        if (pageSize != this.searchOption.page_size) {
        this.$store.commit("setModalQuestionPageSize", pageSize);
            this.search();
        }
    }
  }
};
</script>