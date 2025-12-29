<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/form.less";
.edit-question-form {
  .edit-option {
    position: relative;
    margin-top: 5px;
    .ivu-input-group {
      width: 85%;
    }
    .ivu-btn-error {
      position: absolute;
      top: 5px;
      right: 0;
    }
  }
  .edit-editor {
    margin-top: 5px;
    .ql-toolbar.ql-snow {
      display: none;
    }
    .ql-container.ql-snow {
      border-top: 1px solid #ccc;
      height: 100px;
    }
  }
}

.daily-english {
  &.add-text {
    .rich-editor {
      .ql-container {
        min-height: 400px;
      }
      .limit {
        margin-top: 10px;
      }
    }
  }
}

.de-add-question {
  .add-question-form {
    .rich-editor {
      .ql-container {
        height: 200px;
      }
    }
    .question-editor {
      .ql-container {
        height: 200px;
      }
      .ques-format {
        width: 50px;
        line-height: 24px;
        padding: 0;
      }
    }
  }
  .edit-border {
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
  .answer-list {
    .answer {
      line-height: 32px;
      min-height: 32px;
      span {
        width: 25px;
      }
    }
  }
}
</style>
<template>
  <div class="page-content daily-english de-add-question">
    <Breadcrumb separator=">">
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <template v-if="$route.query.eid > 0">
        <BreadcrumbItem :to="backPath">编辑练习</BreadcrumbItem>
      </template>
      <template v-else>
        <BreadcrumbItem to="/DailyEnglish/QuestionManage">试题管理</BreadcrumbItem>
      </template>
      <template v-if="$route.query.qid > 0">
        <BreadcrumbItem>编辑试题</BreadcrumbItem>
      </template>
      <template v-else>
        <BreadcrumbItem>创建试题</BreadcrumbItem>
      </template>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">基本信息</div>
        <div class="actions"></div>
      </div>
      <Form
        class="common-form add-question-form"
        ref="baseQuestionForm"
        label-position="right"
        :label-width="120"
      >
        <FormItem label="适用年级" prop="grade_id">
          <Select v-model="addQuestionForm.grade_id" style="width:150px">
            <Option
              v-for="item in gradeListDef"
              :value="item.grade_id"
              :key="item.grade_id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="试题难度" prop="level">
          <InputNumber :max="1" :min="0" :step="0.01" v-model="addQuestionForm.level"></InputNumber>
          (0-1)之间
        </FormItem>-->
        <FormItem label="新试题难度" prop="difficulty">
          <InputNumber :max="4" :min="-4" :step="0.01" v-model="addQuestionForm.difficulty"></InputNumber>(-4-4)之间
        </FormItem>
        <FormItem label="知识点" prop="level">
          <Select
            v-model="addQuestionForm.knowledgePointLevel1"
            clearable
            style="width:150px"
            @on-change="handleChangeKnowledgePointLink"
          >
            <Option
              v-for="item in knowledgePointLevel1List"
              :value="item.id"
              :key="item.parent_id"
            >{{ item.name }}</Option>
          </Select>
          <Select v-model="addQuestionForm.knowledgePointLevel2" multiple style="width:260px">
            <Option
              v-for="item in knowledgePointLevel2List"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="试题类型" prop="category_id">
          <Select
            v-model="addQuestionForm.category_id"
            style="width:150px"
            @on-change="questionCategoryChange"
          >
            <Option
              v-for="item in questionCategoryList"
              :value="item.category_id"
              :key="item.category_id"
            >{{ item.category_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="试题结构">
          <RadioGroup v-model="addQuestionForm.question_type" type="button">
            <Radio
              :label="item.type_id"
              v-for="item in answerTypeListDef"
              :key="item.type_id"
            >{{item.name}}</Radio>
          </RadioGroup>
          <RadioGroup v-model="addQuestionForm.group_type" type="button">
            <Radio label="1">单题</Radio>
            <Radio label="2">套题</Radio>
          </RadioGroup>
          <RadioGroup v-model="addQuestionForm.sub_objective" type="button">
            <Radio label="1">主观题</Radio>
            <Radio label="2">客观题</Radio>
          </RadioGroup>
          <span v-if="addQuestionForm.group_type == 2">（套题：包含小题。例如：听力，完型，阅读等）</span>
        </FormItem>
        <FormItem label="附加资源">
          <Checkbox
            v-model="questionTypeList.resource.isSelect"
            :disabled="questionTypeList.resource.isDisable"
          >
            <span>{{ questionTypeList.resource.name }}</span>
          </Checkbox>
          <Checkbox
            v-model="questionTypeList.article.isSelect"
            :disabled="questionTypeList.article.isDisable"
            @on-change="changeArticleCheckbox"
          >
            <span>{{ questionTypeList.article.name }}</span>
          </Checkbox>
          <Checkbox
            v-model="questionTypeList.analysis_html.isSelect"
            @on-change="changeAnalysisHtmlCheckbox"
          >
            <span>{{ questionTypeList.analysis_html.name }}</span>
          </Checkbox>
          <Checkbox v-model="questionTypeList.analysis_resource.isSelect">
            <span>{{ questionTypeList.analysis_resource.name }}</span>
          </Checkbox>
          <Checkbox
            v-model="questionTypeList.analysis_trans.isSelect"
            @on-change="changeAnalysisTransCheckbox"
          >
            <span>{{ questionTypeList.analysis_trans.name }}</span>
          </Checkbox>
        </FormItem>
      </Form>
      <div class="top-bar">
        <div class="options">试题信息</div>
        <div class="actions"></div>
      </div>
      <Form
        class="common-form add-question-form"
        ref="addQuestionForm"
        label-position="right"
        :label-width="120"
      >
        <FormItem v-if="questionTypeList.resource.isSelect" label="听力资源">
          <div
            v-if="addQuestionForm.question_resource_url"
          >{{addQuestionForm.question_resource_url}}</div>
          <div class="img-bar">
            <div class="actions">
              <Button type="primary" @click="showBindResourceModal('question_resource_url')">从资源库选择</Button>
            </div>
            <div class="actions">
              <Upload :before-upload="ResourceUpload" action :format="['mp3','mp4']">
                <Button
                  :loading="resourceUploading"
                  type="ghost"
                  icon="ios-cloud-upload-outline"
                >本地上传文件</Button>
              </Upload>
              <p class="book-img-info">只能上传 mp3/mp4 文件</p>
            </div>
          </div>
          <Spin fix v-if="resourceUploading">
            <!-- <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon> -->
            <Progress :percent="uploadPercent"></Progress>
            <div>上传文件中...</div>
          </Spin>
        </FormItem>
        <template v-if="questionTypeList.article.isSelect">
          <FormItem label="文章材料">
            <div v-if="addQuestionForm.content !=''" class="edit-border">
              <div class="question-article" v-html="addQuestionForm.content"></div>
              <div class="btn-group">
                <Button
                  class="edit-btn"
                  type="info"
                  size="small"
                  @click="editTextContent('article')"
                >编辑</Button>
              </div>
            </div>
          </FormItem>
        </template>
        <FormItem label="题目">
          <div class="question-list">
            <div class="question edit-border" v-for="(ques,idx) in questionList" :key="idx">
              <div v-html="questionsHtml[idx]"></div>
              <div class="btn-group">
                <Button
                  class="edit-btn"
                  type="info"
                  size="small"
                  @click="showEditQuestionModal(idx)"
                >编辑</Button>
              </div>
            </div>
          </div>
          <div class="btn-group">
            <Button type="info" size="small" @click="editTextContent('question')">格式化录入试题</Button>
            <!-- <Button type="info" size="small" @click="showEditQuestionModal(-1)">手动录入试题</Button> -->
          </div>
        </FormItem>
        <FormItem label="答案">
          <div class="answer-list">
            <div class="answer" v-for="(ques,idx) in questionList" :key="idx">
              <template v-if="addQuestionForm.sub_objective == 1">
                <div v-html="ques.answer"></div>
              </template>
              <template v-if="addQuestionForm.sub_objective == 2">
                <p>
                  <span v-if="questionList.length >1">{{(idx+1)}}.&nbsp;</span>
                  {{ques.answer}}
                </p>
              </template>
            </div>
          </div>
          <Button
            v-if="questionList.length > 0"
            type="info"
            size="small"
            @click="editTextContent('answer')"
          >格式化录入答案</Button>
        </FormItem>
        <FormItem label="解析">
          <div class="answer-list">
            <div class="answer" v-for="(ques,idx) in questionList" :key="idx">
              <div v-html="analysisHtml[idx]"></div>
            </div>
          </div>
          <Button
            v-if="questionList.length > 0"
            type="info"
            size="small"
            @click="editTextContent('analysis')"
          >格式化录入解析</Button>
        </FormItem>
        <FormItem v-if="questionTypeList.analysis_html.isSelect" label="图文解析">
          <div v-if="addQuestionForm.analysis_html !=''" class="edit-border">
            <div class="question-article" v-html="addQuestionForm.analysis_html"></div>
            <div class="btn-group">
              <Button
                class="edit-btn"
                type="info"
                size="small"
                @click="editTextContent('analysis_html')"
              >编辑</Button>
            </div>
          </div>
        </FormItem>
        <FormItem v-if="questionTypeList.analysis_resource.isSelect" label="音视频解析">
          <div
            v-if="addQuestionForm.analysis_resource_url"
          >{{addQuestionForm.analysis_resource_url}}</div>
          <div class="img-bar">
            <div class="actions">
              <Button type="primary" @click="showBindResourceModal('analysis_resource_url')">从资源库选择</Button>
            </div>
            <div class="actions">
              <Upload :before-upload="analysisResourceUpload" action :format="['mp3','mp4']">
                <Button
                  :loading="analysisResourceUploading"
                  type="ghost"
                  icon="ios-cloud-upload-outline"
                >本地上传文件</Button>
              </Upload>
              <p class="book-img-info">只能上传 mp3/mp4 文件</p>
            </div>
          </div>
          <Spin fix v-if="analysisResourceUploading">
            <!-- <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon> -->
            <Progress :percent="uploadPercent"></Progress>
            <div>上传文件中...</div>
          </Spin>
        </FormItem>
        <FormItem v-if="questionTypeList.analysis_trans.isSelect" label="材料翻译">
          <div v-if="addQuestionForm.analysis_trans !=''" class="edit-border">
            <div class="question-article" v-html="addQuestionForm.analysis_trans"></div>
            <div class="btn-group">
              <Button
                class="edit-btn"
                type="info"
                size="small"
                @click="editTextContent('analysis_trans')"
              >编辑</Button>
            </div>
          </div>
        </FormItem>
        <FormItem label="试题分数" v-if="!isInExam" prop="Score">
          <InputNumber
            :max="100"
            :min="1"
            v-model="addQuestionForm.default_score"
            @on-change="changeScore"
          ></InputNumber>分
          <p>如包含小题，此分数为每小题的分数,特殊分数请选择题目编辑</p>
        </FormItem>
        <FormItem label="试题来源">
          <Input v-model="addQuestionForm.from" placeholder="请输入试题来源（可不填）"></Input>
        </FormItem>
        <Spin fix v-if="questionDetailLoading">
          <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
          <div>读取信息中...</div>
        </Spin>
      </Form>
      <div style="text-align: center;">
        <Button type="ghost" size="large" @click="goBack()">取消返回</Button>
        <Button
          type="primary"
          size="large"
          :loading="addQuestionLoading"
          @click="AddQuestion()"
        >保存试题</Button>
      </div>
    </Card>
    <Modal class="common-dialog daily-english add-text" v-model="showAddText" title="录入信息">
      <quill-editor
        class="rich-editor"
        v-model="addTextContent"
        ref="articleEditor"
        :options="richEditorDef"
      ></quill-editor>
      <Spin fix v-if="articleImgUploading">
        <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
        <div>上传图片中...</div>
      </Spin>
      <div class="limit">
        <span style="color:red">*</span>注意：详情内图片必须使用编辑器内的图片上传，小程序内不支持外链图片.
      </div>
      <Upload
        style="display:none"
        :before-upload="ArticleImgUpload"
        action
        accept="image/*"
        :format="['jpg','jpeg','png']"
      >
        <Button
          id="articleImgUploadBtn"
          type="ghost"
          icon="ios-cloud-upload-outline"
        >articleImgUploadBtn</Button>
      </Upload>
      <div slot="footer">
        <Button type="ghost" size="large" @click="saveText(false)">取消返回</Button>
        <Button type="primary" size="large" @click="saveText(true)">确认保存</Button>
      </div>
    </Modal>
    <Modal
      class="common-dialog daily-english edit-question-dialog"
      v-model="showEditQuestion"
      title="编辑试题"
    >
      <Form
        class="common-form edit-question-form"
        ref="editQuestionForm"
        label-position="right"
        :label-width="80"
      >
        <FormItem label="题干" prop="title">
          <quill-editor
            class="edit-editor"
            v-model="editQuestionForm.title"
            :options="simpleRichEditorDef"
          ></quill-editor>
        </FormItem>
        <FormItem label="选项" prop="grade_id" v-if="addQuestionForm.question_type == 1">
          <div class="edit-option" v-for="(op,idx) in editQuestionForm.options" :key="op.index">
            <Row>
              <Col span="3">
                <Select v-model="op.index" style="width:50px" >
                  <Option v-for="item in answerNumList" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </Col>
              <Col span="13">
                <Input v-model="op.option" placeholder="请输入选项内容"></Input>
              </Col>
              <Col span="4" offset="1">
                <Button type="error" size="small" @click="delOption(idx)">删除</Button>
              </Col>
            </Row>
          </div>
          <Button style="margin-top:10px;" type="dashed" size="small" @click="addOption">增加选项</Button>
        </FormItem>
        <FormItem label="答案" prop="answer">
          <Select
            v-model="editQuestionForm.answer"
            style="width:80px"
            v-if="addQuestionForm.question_type == 1"
          >
            <Option v-for="item in answerNumList" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <Input
            v-if="addQuestionForm.sub_objective ==2 && addQuestionForm.question_type == 3"
            v-model="editQuestionForm.answer"
            placeholder="请输入答案"
          ></Input>
          <quill-editor
            v-if="addQuestionForm.sub_objective ==1"
            class="edit-editor"
            v-model="editQuestionForm.answer"
            :options="simpleRichEditorDef"
          ></quill-editor>
        </FormItem>
        <FormItem label="解析" prop="analysis">
          <quill-editor
            class="edit-editor"
            v-model="editQuestionForm.analysis"
            :options="simpleRichEditorDef"
          ></quill-editor>
        </FormItem>
        <FormItem label="分数" v-if="addQuestionForm.group_type == 2 ">
          <InputNumber :max="100" :min="1" v-model="editQuestionForm.default_score"></InputNumber>分
        </FormItem>
        <FormItem label="知识点" prop="knowledgePointLevel1">
          <!-- v-if="editQuestionForm.question_type && editQuestionForm.question_type != 1" -->
          <Select
            v-model="editQuestionForm.knowledgePointLevel1"
            clearable
            style="width:150px"
            @on-change="handleChildChangeKnowledgePointLink"
          >
            <Option
              v-for="item in knowledgePointLevel1List"
              :value="item.id"
              :key="item.parent_id"
            >{{ item.name }}</Option>
          </Select>
          <Select v-model="editQuestionForm.knowledgePointLevel2" multiple style="width:260px">
            <Option
              v-for="item in childKnowledgePointLevel2List"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="试题难度" prop="difficulty">
          <!-- v-if="editQuestionForm.question_type && editQuestionForm.question_type != 1" -->
          <InputNumber :max="4" :min="-4" :step="0.01" v-model="editQuestionForm.difficulty"></InputNumber>(-4-4)之间
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="ghost" size="large" @click="showEditQuestion =false">取消返回</Button>
        <Button type="primary" size="large" @click="saveEditQuestion(editQuestionForm.index)">确认保存</Button>
      </div>
    </Modal>
    <!-- 资源选择模态框 -->
    <Modal
      class="common-dialog daily-english edit-question-dialog"
      v-model="showSourceList"
      title="资源选择"
    >
      <sourcelist ref="sourcelist" :scenes="'bindResource'" @bind="bindResource"></sourcelist>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "video.js/dist/video-js.css";
import { quillEditor } from "vue-quill-editor";
import { videoPlayer } from "vue-video-player";
import sourcelist from "./components/sourceList.vue";
import { mapState } from "vuex";
import {
  ossSFileHost,
  ossMvHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
import {
  getQuestionDetail,
  addOrUpdateQuestion,
  getKnowledgePointList,
  getKnowledgePointParent
} from "@/api/daily-english/question";
import Format from "@/libs/format";
export default {
  name: "add-question",
  components: {
    quillEditor,
    videoPlayer,
    sourcelist
  },
  data() {
    return {
      showSourceList: false, // 资源选择模态框
      questionResourceType: "", // questionTypeList对应
      questionDetailLoading: false,
      showEditQuestion: false,
      showAddText: false,
      addTextType: "",
      addTextContent: "",
      articleImgUploading: false,
      myRichEditorDef: {
        modules: {
          toolbar: "#toolbar"
        },
        placeholder: "请输入详情信息...",
        theme: "snow"
      },
      //附加资源选项
      questionTypeList: {
        resource: {
          isSelect: false,
          isDisable: true,
          name: "听力材料"
        },
        article: {
          isSelect: false,
          isDisable: true,
          name: "文章材料"
        },
        analysis_html: {
          isSelect: false,
          isDisable: false,
          name: "图文解析"
        },
        analysis_resource: {
          isSelect: false,
          isDisable: false,
          name: "音视频解析"
        },
        analysis_trans: {
          isSelect: false,
          isDisable: false,
          name: "材料翻译"
        }
      },
      resourceUploading: false,
      analysisResourceUploading: false,
      addQuestionLoading: false,
      isInExam: false,
      //手动编辑题目用结构
      editQuestionForm: {
        index: -1,
        title: "",
        options: [],
        answer: "",
        analysis: "",
        default_score: 0,
        knowledgePointLevel1: "",
        knowledgePointLevel2: "",
        level: "",
        difficulty: 0
      },
      knowledgePointLevelList: {}, // 一级知识点列表
      knowledgePointLevel1List: [], // 一级知识点列表
      knowledgePointLevel2List: [], // 二级知识点列表
      childKnowledgePointLevel2List: [], // 子题二级知识点列表
      //页面内用问题列表
      questionList: [],
      uploadPercent: 0,
      addQuestionForm: {
        question_id: -1,
        category_id: 1,
        group_type: 1,
        question_type: 1,
        sub_objective: 1,
        level: 1,
        difficulty: 0,
        content: "",
        title: "",
        options: "",
        answer: "",
        analysis: "",
        analysis_html: "",
        analysis_trans: "",
        analysis_resource_url: "",
        analysis_resource_type: "",
        default_score: 0,
        from: "后台录入",
        knowledge_point_id: "",
        grade_id: 1,
        more: "",
        question_resource_url: "",
        content_type: "",
        knowledgePointLevel1: "", // 一级知识点
        knowledgePointLevel2: [] // 二级知识点
      }
    };
  },
  computed: {
    ...mapState({
      richEditorDef: state => state.app.richEditorDef,
      gradeListDef: state => state.app.gradeList,
      simpleRichEditorDef: state => state.app.simpleRichEditorDef,
      questionCategoryList: state => state.deQuestion.questionCategoryList,
      answerTypeListDef: state => state.deQuestion.answerTypeList,
      answerNumList: state => state.deQuestion.answerNumList
    }),
    articleEditor() {
      return this.$refs.articleEditor.quill;
    },
    questionsHtml() {
      let arr = [];
      // let showNum = this.addQuestionForm.group_type == 1 ? false : true;
      if (this.questionList.length > 0) {
        arr = this.questionList.map((e, i) => {
          return Format.formatQuestionHtml(true, i, e.title, e.options);
        });
      }
      return arr;
    },
    analysisHtml() {
      let arr = [];
      let showNum = this.addQuestionForm.group_type == 1 ? false : true;
      if (this.questionList.length > 0) {
        arr = this.questionList.map((e, i) => {
          return Format.formatQuestionHtml(showNum, i, e.analysis);
        });
      }
      return arr;
    },
    backPath() {
      let path = "";
      if (this.$route.query.eid > 0) {
        path = "/DailyEnglish/AddExam?eid=" + this.$route.query.eid;
      }
      return path;
    }
  },
  mounted() {
    this.bindArticleImgUploadHandler();
    this.init();
  },
  methods: {
    init() {
      this.handleGetKnowledgePointList();
      if (this.$route.query.qid) {
        this.getQuestionDetail(this.$route.query.qid);
      } else {
        this.isInExam = false;
      }
    },
    // 获取知识点
    async handleGetKnowledgePointList() {
      await getKnowledgePointList().then(res => {
        this.knowledgePointLevelList = res.data;
        this.knowledgePointLevel1List = res.data[1][0];
      });
    },
    // 切换知识点层及关联
    handleChangeKnowledgePointLink(val) {
      this.knowledgePointLevel2List = this.knowledgePointLevelList[2][val];
      this.$set(this.addQuestionForm, "knowledgePointLevel2", []);
    },
    // 子题知识点层级关联
    handleChildChangeKnowledgePointLink(val) {
      this.childKnowledgePointLevel2List = this.knowledgePointLevelList[2][val];
      this.$set(this.editQuestionForm, "knowledgePointLevel2", []);
    },
    ArticleImgUpload(file) {
      if (file.size > 1024 * 1024) {
        this.$Message.warning("请选择小于1M的图片！");
        return;
      }
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tlw-web-static-file",
        dir: "daily-english/question/article_img",
        filename: file.name,
        type: "POST"
      };
      this.articleImgUploading = true;
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(ossSFileHost.oss, formData).then(res => {
            if (res.status == 200) {
              let tmpImgUrl = ossSFileHost.cdn + sign_data.msg.filename;
              let addRange = this.articleEditor.getSelection();
              this.articleEditor.insertEmbed(
                addRange !== null ? addRange.index : 0,
                "image",
                tmpImgUrl
              );
            }
            this.articleImgUploading = false;
          });
        }
      });
      return false;
    },
    changeArticleCheckbox(state) {
      if (state) {
        this.addTextType = "article";
        if (this.addQuestionForm.content == "") {
          this.showAddText = true;
        }
      }
    },
    changeAnalysisHtmlCheckbox(state) {
      if (state) {
        this.addTextType = "analysis_html";
        if (this.addQuestionForm.analysis_html == "") {
          this.showAddText = true;
        }
      }
    },
    changeAnalysisTransCheckbox(state) {
      if (state) {
        this.addTextType = "analysis_trans";
        if (this.addQuestionForm.analysis_trans == "") {
          this.showAddText = true;
        }
      }
    },
    editTextContent(type) {
      this.addTextType = type;
      switch (type) {
        case "article":
          this.addTextContent = this.addQuestionForm.content;
          break;
        case "analysis_html":
          this.addTextContent = this.addQuestionForm.analysis_html;
          break;
        case "analysis_trans":
          this.addTextContent = this.addQuestionForm.analysis_trans;
          break;
        default:
          break;
      }
      this.showAddText = true;
    },
    saveText(state) {
      if (state) {
        switch (this.addTextType) {
          case "article":
            this.addQuestionForm.content = this.formatArticle(
              this.addTextContent
            );
            break;
          case "question":
            this.addQuestionForm.group_type == 1
              ? this.formatSingleQuestion(this.addTextContent)
              : this.formatSubQuestion(this.addTextContent);
            break;
          case "answer":
            this.formatAnswer(this.addTextContent);
            break;
          case "analysis":
            this.formatAnalysis(this.addTextContent);
            break;
          case "analysis_html":
            this.addQuestionForm.analysis_html = this.addTextContent;
            break;
          case "analysis_trans":
            this.addQuestionForm.analysis_trans = this.addTextContent;
            break;
          default:
            break;
        }
      }
      this.addTextContent = "";
      this.showAddText = false;
    },
    formatArticle(textContent) {
      if (textContent == "") {
        return "";
      }
      let arr = textContent.split(/<u[^>]*>\s*[0-9]?[0-9]\s*<\/u>/);
      let str = "";
      arr.forEach((e, i) => {
        if (i == 0) {
          str = e;
        } else {
          str += "<u>  " + i + "  </u>" + e;
        }
      });
      return str;
    },
    formatOptions(text, length) {
      let options = [];
      let os = text.split(/[A-J][\.．。\、\t\s]/);
      os.forEach(e => {
        if (e.trim() != "") {
          let o = {
            index: this.answerNumList[length + options.length],
            option: e.trim()
          };
          options.push(o);
        }
      });
      return options;
    },
    formatSingleQuestion(textContent) {
      let div = document.createElement("div");
      div.innerHTML = textContent;
      let htmlArr = div.childNodes;
      let q = {
        title: "",
        options: this.addQuestionForm.question_type == 3 ? "" : [],
        answer: "",
        analysis: "",
        category_id: this.addQuestionForm.category_id,
        default_score: 0
      };
      let last_insert = "";
      for (let i = 0; i < htmlArr.length; i++) {
        let line = htmlArr[i].innerText;
        //1-9题
        if (line.match(/^[1-9][\.．。\、\t\s]/)) {
          if (last_insert != "") {
            break;
          }
          let title = line.substring(2).trim();
          q.title = title == "" ? "" : "<p>" + title + "</p>";
          last_insert = "title";
        } else if (line.match(/^[1-9][0-9][\.．。\、\t\s]/)) {
          if (last_insert != "") {
            break;
          }
          let title = line.substring(3).trim();
          q.title = title == "" ? "" : "<p>" + title + "</p>";
          last_insert = "title";
        } else {
          //非题目
          //是选项
          if (line.match(/^[A-J][\.．。\、\t\s]/)) {
            if (last_insert == "") {
              q.title = "";
            }
            if (last_insert == "title") {
              q.options = this.formatOptions(line, 0);
            } else {
              q.options = q.options.concat(
                this.formatOptions(line, q.options.length)
              );
            }
            last_insert = "options";
          } else {
            //都不是则附加到标题
            if (line.trim() != "") {
              q.title += "<p>" + line.trim() + "</p>";
              last_insert = "title";
            }
          }
        }
      }
      if (this.addQuestionForm.question_type == 1) {
        if (q.options.length == 0) {
          this.$Modal.info({
            title: "提示信息",
            content: "选择题请录入选项！"
          });
          return;
        }
      }
      if (this.addQuestionForm.question_type == 3) {
        if (q.options.length > 0) {
          this.$Modal.info({
            title: "提示信息",
            content: "填空题请不要录入选项！"
          });
          return;
        }
      }
      this.questionList = [];
      this.questionList.push(q);
    },
    formatSubQuestion(textContent) {
      let div = document.createElement("div");
      div.innerHTML = textContent;
      let htmlArr = div.childNodes;
      let q = {
        title: "",
        options: this.addQuestionForm.question_type == 3 ? "" : [],
        answer: "",
        analysis: "",
        category_id: this.addQuestionForm.category_id,
        default_score: 0
      };
      let last_insert = "";
      let error = false;
      let sub_questions = [];
      // htmlArr.forEach(element => {
      for (let i = 0; i < htmlArr.length; i++) {
        let line = htmlArr[i].innerText;
        //1-9题
        if (line.match(/^[1-9][\.．。\、\t\s]/)) {
          if (last_insert != "") {
            if (this.addQuestionForm.question_type == 1) {
              if (q.options.length == 0) {
                this.$Modal.info({
                  title: "提示信息",
                  content: "选择题请录入选项！"
                });
                error = true;
                break;
              }
            }
            if (this.addQuestionForm.question_type == 3) {
              if (q.options.length > 0) {
                this.$Modal.info({
                  title: "提示信息",
                  content: "填空题请不要录入选项！"
                });
                error = true;
              }
            }
            let nq = JSON.parse(JSON.stringify(q));
            sub_questions.push(nq);
          }
          let title = line.substring(2).trim();
          //是选项
          if (title == "") {
            q.title = "";
            last_insert = "title";
          } else if (title.match(/^[A-J][\.．。\、\t\s]/)) {
            q.title = "";
            q.options = this.formatOptions(title, 0);
            last_insert = "options";
          } else {
            q.title = "<p>" + title + "</p>";
            last_insert = "title";
          }
        } else if (line.match(/^[1-9][0-9][\.。．。\、\t\s]/)) {
          //10-40题
          if (last_insert != "") {
            if (this.addQuestionForm.question_type == 1) {
              if (q.options.length == 0) {
                this.$Modal.info({
                  title: "提示信息",
                  content: "选择题请录入选项！"
                });
                error = true;
                break;
              }
            }
            if (this.addQuestionForm.question_type == 3) {
              if (q.options.length > 0) {
                this.$Modal.info({
                  title: "提示信息",
                  content: "填空题请只不要录入选项！"
                });
                error = true;
              }
            }
            let nq = JSON.parse(JSON.stringify(q));
            sub_questions.push(nq);
          }
          let title = line.substring(3).trim();
          //是选项
          if (title == "") {
            q.title = "";
            last_insert = "title";
          } else if (title.match(/^[A-J][\.．。\、\t\s]/)) {
            q.title = "";
            q.options = this.formatOptions(title, 0);
            last_insert = "options";
          } else {
            q.title = "<p>" + title + "</p>";
            last_insert = "title";
          }
        } else {
          //非题目
          //是选项
          if (line.match(/^[A-J][\.．。\、\t\s]/)) {
            if (last_insert == "") {
              q.title = "";
            }
            if (last_insert == "title") {
              q.options = this.formatOptions(line, 0);
            } else {
              q.options = q.options.concat(
                this.formatOptions(line, q.options.length)
              );
            }
            last_insert = "options";
          } else {
            //都不是则附加到标题
            if (line.trim() != "") {
              q.title += "<p>" + line.trim() + "</p>";
            }
          }
        }
      }
      if (error) {
        return;
      }
      if (this.addQuestionForm.question_type == 1) {
        if (q.options.length == 0) {
          this.$Modal.info({
            title: "提示信息",
            content: "选择题请录入选项！"
          });
          return;
        }
      }
      if (this.addQuestionForm.question_type == 3) {
        if (q.options.length > 0) {
          this.$Modal.info({
            title: "提示信息",
            content: "填空题请不要录入选项！"
          });
          return;
        }
      }
      sub_questions.push(q);
      this.questionList = sub_questions;
    },
    formatAnswer(textContent) {
      if (this.questionList.length == 0) {
        this.$Message.warning("请先录入试题！");
        return;
      }
      if (this.addQuestionForm.sub_objective == 1) {
        this.questionList[0].answer = textContent;
        return;
      }
      var div = document.createElement("div");
      div.innerHTML = textContent;
      let htmlArr = div.childNodes;
      let answer = "";
      let ques_index = 0;
      let last_insert = "";
      // htmlArr.forEach(element => {
      for (let i = 0; i < htmlArr.length; i++) {
        let line = htmlArr[i].innerText;
        if (ques_index == this.questionList.length) {
          break;
        }
        if (line.match(/^[1-9][\.\、\t\s]/)) {
          if (last_insert != "") {
            this.questionList[ques_index].answer = answer;
            ques_index++;
          }
          answer = line.substring(2).trim();
          last_insert = "answer";
        } else if (line.match(/^[1-4][0-9][\.\、\t\s]/)) {
          if (last_insert != "") {
            this.questionList[ques_index].answer = answer;
            ques_index++;
          }
          answer = line.substring(3).trim();
          last_insert = "answer";
        } else {
          if (line.trim() != "") {
            answer += line.trim();
          }
        }
      }
      if (ques_index < this.questionList.length) {
        this.questionList[ques_index].answer = answer;
      }
    },
    formatAnalysis(textContent) {
      if (this.questionList.length == 0) {
        this.$Message.warning("请先录入试题！");
        return;
      }
      var div = document.createElement("div");
      div.innerHTML = textContent;
      let htmlArr = div.childNodes;
      let analysis = "";
      let ques_index = 0;
      let last_insert = "";
      // htmlArr.forEach(element => {
      for (let i = 0; i < htmlArr.length; i++) {
        let line = htmlArr[i].innerText;
        if (ques_index == this.questionList.length) {
          return;
        }
        if (line.match(/^[1-9][\.\、\t\s]/)) {
          if (last_insert != "") {
            this.questionList[ques_index].analysis = analysis;
            ques_index++;
          }
          if (line.substring(2).trim() != "") {
            analysis = "<p>" + line.substring(2).trim() + "</p>";
          } else {
            analysis = "";
          }
          last_insert = "analysis";
        } else if (line.match(/^[1-4][0-9][\.\、\t\s]/)) {
          if (last_insert != "") {
            this.questionList[ques_index].analysis = analysis;
            ques_index++;
          }
          if (line.substring(3).trim() != "") {
            analysis = "<p>" + line.substring(3).trim() + "</p>";
          } else {
            analysis = "";
          }
          last_insert = "analysis";
        } else {
          if (line.trim() != "") {
            analysis += "<p>" + line.trim() + "</p>";
          }
        }
      }
      if (ques_index < this.questionList.length) {
        this.questionList[ques_index].analysis = analysis;
      }
    },
    //绑定图片上传处理事件
    bindArticleImgUploadHandler() {
      this.articleEditor
        .getModule("toolbar")
        .addHandler("image", function(state) {
          if (state) {
            let fileInput = document.getElementById("articleImgUploadBtn");
            fileInput.click(); // 加一个触发事件
          }
        });
    },
    analysisResourceUpload(file) {
      this.ResourceUpload(file, "analysis");
    },
    ResourceUpload(file, type) {
      let name_arr = file.name.split(".");
      let ext = name_arr[name_arr.length - 1];
      if (ext != "mp3" && ext != "mp4") {
        this.$Message.warning("不支持上传该格式的文件！");
        return false;
      }
      var dir = "audio";
      if (ext == "mp4") {
        dir = "video";
      }
      if (type == "analysis") {
        dir = "/analysis/" + dir;
        this.addQuestionForm.analysis_resource_type = file.type;
      } else {
        dir = "/question/" + dir;
        this.addQuestionForm.content_type = file.type;
      }
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tl-mv",
        dir: "daily-english" + dir,
        filename: file.name,
        type: "POST"
      };
      if (type == "analysis") {
        this.analysisResourceUploading = true;
      } else {
        this.resourceUploading = true;
      }
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(ossMvHost.oss, formData, event => {
            this.uploadPercent = parseInt((event.loaded / event.total) * 100);
          }).then(res => {
            if (res.status == 200) {
              if (type == "analysis") {
                this.addQuestionForm.analysis_resource_url =
                  ossMvHost.cdn + sign_data.msg.filename;
              } else {
                this.addQuestionForm.question_resource_url =
                  ossMvHost.cdn + sign_data.msg.filename;
              }
            }
            if (type == "analysis") {
              this.analysisResourceUploading = false;
            } else {
              this.resourceUploading = false;
            }
          });
        }
      });
      return false;
    },
    getQuestionDetail(qid) {
      getQuestionDetail(qid).then(res => {
        if (res.res_code == 1) {
          let q = res.msg;

          if (q.group_type == 1) {
            try {
              q.answer = q.question_type == 3 ? q.answer : JSON.parse(q.answer);
              if (q.answer instanceof Array) {
                q.answer = q.answer[0];
              }
            } catch (error) {
              q.answer = q.answer;
              console.error(q.question_id + " JSON.parse fail!");
            }
            try {
              q.options =
                q.question_type == 3 ? q.options : JSON.parse(q.options);
            } catch (error) {
              console.error(q.question_id + " JSON.parse fail!");
            }
            this.questionList.push({
              title: q.title,
              options: q.options,
              answer: q.answer,
              analysis: q.analysis,
              category_id: q.category_id,
              default_score: q.default_score,
              question_type: q.question_type
            });
            this.questionTypeList.resource.isDisable = true;
            this.questionTypeList.article.isDisable = true;
          } else {
            this.questionList = q.sub_questions.map((e, i) => {
              let answer = "";
              try {
                // answer = JSON.parse(e.answer);
                answer = e.question_type == 3 ? e.answer : JSON.parse(e.answer);
                if (answer instanceof Array) {
                  answer = answer[0];
                }
              } catch (error) {
                answer = e.answer;
                console.error(
                  q.question_id + " sub_questions JSON.parse fail!"
                );
                console.error("sub_questions id: " + e.id);
              }
              try {
                // e.options =  JSON.parse(e.options);
                e.options =
                  e.question_type == 3 ? e.options : JSON.parse(e.options);
              } catch (error) {
                console.error(
                  q.question_id + " sub_questions JSON.parse fail!"
                );
                console.error("sub_questions id: " + e.id);
              }
              return {
                title: e.title,
                options: e.options,
                answer: answer,
                analysis: e.analysis,
                category_id: q.category_id,
                default_score: e.default_score,
                knowledge_point_id: e.knowledge_point_id,
                difficulty: Number(e.difficulty),
                question_type: q.question_type
              };
            }, this);
            console.log(this.questionList);
            if (q.content != "") {
              this.questionTypeList.article.isSelect = true;
            }
            if (q.question_resource_url && q.question_resource_url != "") {
              this.questionTypeList.resource.isSelect = true;
            }
          }

          this.addQuestionForm = q;
          // 将知识点展示
          if (q.knowledge_point_id) {
            this.addQuestionForm.knowledgePointLevel2 = q.knowledge_point_id.split(
              ","
            );
            for (
              let i = 0;
              i < this.addQuestionForm.knowledgePointLevel2.length;
              i++
            ) {
              this.addQuestionForm.knowledgePointLevel2[i] = Number(
                this.addQuestionForm.knowledgePointLevel2[i]
              );
            }
            // this.$set(this.addQuestionForm,'knowledgePointLevel2', res.data[0]);
            // 搜索第一层级对应知识点(当前只涉及两级)
            getKnowledgePointParent(
              this.addQuestionForm.knowledgePointLevel2[0]
            ).then(res => {
              this.$set(
                this.addQuestionForm,
                "knowledgePointLevel1",
                res.data[0]
              );
              this.knowledgePointLevel2List = this.knowledgePointLevelList[2][
                res.data[0]
              ];
            });
          }

          if (this.addQuestionForm.analysis_resource_url != "") {
            this.questionTypeList.analysis_resource.isSelect = true;
          }
          if (this.addQuestionForm.analysis_trans != "") {
            this.questionTypeList.analysis_trans.isSelect = true;
          }
          if (this.addQuestionForm.analysis_html != "") {
            this.questionTypeList.analysis_html.isSelect = true;
          }
        }
      });
    },
    changeScore(score) {
      if (this.questionList.length > 0) {
        this.questionList.forEach(e => {
          e.default_score = score;
        });
      }
    },
    delOption(idx) {
      this.editQuestionForm.options.splice(idx, 1);
    },
    addOption() {
      if (this.editQuestionForm.options.length == this.answerNumList.length) {
        return;
      }
      this.editQuestionForm.options.push({
        index: this.answerNumList[this.editQuestionForm.options.length],
        option: ""
      });
    },
    saveEditQuestion(index) {
      this.questionList[index].title = this.editQuestionForm.title;
      this.questionList[index].options = JSON.parse(
        JSON.stringify(this.editQuestionForm.options)
      );
      this.questionList[index].answer = this.editQuestionForm.answer;
      this.questionList[index].analysis = this.editQuestionForm.analysis;
      this.questionList[
        index
      ].default_score = this.editQuestionForm.default_score;
      this.questionList[
        index
      ].knowledge_point_id = this.editQuestionForm.knowledgePointLevel2.join(
        ","
      );
      this.questionList[index].difficulty = Number(
        this.editQuestionForm.difficulty
      );
      console.dir(this.questionList[index]);
      this.showEditQuestion = false;
    },
    showEditQuestionModal(index) {
      this.editQuestionForm.title = this.questionList[index].title;
      this.editQuestionForm.options = JSON.parse(
        JSON.stringify(this.questionList[index].options)
      );
      this.editQuestionForm.answer = this.questionList[index].answer;
      this.editQuestionForm.analysis = this.questionList[index].analysis;
      this.editQuestionForm.default_score = this.questionList[
        index
      ].default_score;
      this.editQuestionForm.index = index;
      this.editQuestionForm.question_type = this.questionList[
        index
      ].question_type;
      this.editQuestionForm.difficulty = this.questionList[index].difficulty;
      // 将编辑试题的部分知识点进行对应
      // 将知识点展示
      if (this.questionList[index].knowledge_point_id) {
        this.editQuestionForm.knowledgePointLevel2 = this.questionList[
          index
        ].knowledge_point_id.split(",");
        for (
          let i = 0;
          i < this.editQuestionForm.knowledgePointLevel2.length;
          i++
        ) {
          this.editQuestionForm.knowledgePointLevel2[i] = Number(
            this.editQuestionForm.knowledgePointLevel2[i]
          );
        }
        console.log(this.editQuestionForm.knowledgePointLevel2);

        // this.$set(this.addQuestionForm,'childKnowledgePointLevel2List', res.data[0]);
        // 搜索第一层级对应知识点(当前只涉及两级)
        getKnowledgePointParent(
          this.editQuestionForm.knowledgePointLevel2[0]
        ).then(res => {
          this.$set(this.editQuestionForm, "knowledgePointLevel1", res.data[0]);
          this.childKnowledgePointLevel2List = this.knowledgePointLevelList[2][
            res.data[0]
          ];
          this.showEditQuestion = true;
        });
      } else {
        this.showEditQuestion = true;
      }
    },
    checkQuestions() {
      let str = "";
      // str += this.addQuestionForm.level == 0 ? "题目没有选择难度" : "";
      this.questionList.forEach((e, i) => {
        //单选
        if (this.addQuestionForm.question_type == 1) {
          if (e.options.length == 0) {
            str += "题目" + (i + 1) + " 没有录入选项！\n";
          }
          if (e.answer == "") {
            str += "题目" + (i + 1) + " 没有录入答案！\n";
          }
        }
      });
      return str;
    },
    formatForm() {
      let newQues = JSON.parse(JSON.stringify(this.addQuestionForm));
      if (!this.questionTypeList.article.isSelect) {
        newQues.content = "";
      }
      if (!this.questionTypeList.resource.isSelect) {
        newQues.question_resource_url = "";
      }
      // 将最后一级知识点转化为按 ， 分割的字符串
      newQues.knowledge_point_id = this.addQuestionForm.knowledgePointLevel2.join(
        ","
      );

      if (this.addQuestionForm.group_type == 1) {
        newQues.title = this.questionList[0].title;
        if (this.addQuestionForm.question_type == 3) {
          newQues.options = "";
          newQues.answer = this.questionList[0].answer;
        } else {
          newQues.options = JSON.stringify(this.questionList[0].options);
          newQues.answer = JSON.stringify([this.questionList[0].answer]);
        }
        newQues.analysis = this.questionList[0].analysis;
      } else {
        newQues.sub_questions = this.questionList.map((e, i) => {
          let o = {
            category_id: e.category_id,
            answer:
              this.addQuestionForm.question_type == 3
                ? e.answer
                : JSON.stringify([e.answer]),
            analysis: e.analysis,
            default_score: e.default_score,
            question_type: newQues.question_type,
            sub_objective: newQues.sub_objective,
            title: e.title,
            num: i + 1,
            options:
              this.addQuestionForm.question_type == 3
                ? ""
                : JSON.stringify(e.options),
            knowledge_point_id: e.knowledge_point_id,
            difficulty: Number(e.difficulty)
          };
          return o;
        });
      }
      return newQues;
    },
    AddQuestion() {
      if (this.questionList.length == 0) {
        this.$Message.warning("请录入试题！");
        return;
      }
      let valid = this.checkQuestions();
      if (valid != "") {
        this.$Modal.warning({
          title: "提示信息",
          content: valid
        });
        return;
      }
      this.addQuestionLoading = true;
      addOrUpdateQuestion(this.formatForm()).then(res => {
        this.addQuestionLoading = false;
        let str = "添加";
        if (this.$route.query.qid) {
          str = "编辑";
        }
        if (res.res_code == 1) {
          this.$Message.success(str + "试题成功！");
          this.goBack();
        } else {
          this.$Message.error(str + "试题失败！");
        }
      });
    },
    questionCategoryChange(value) {
      console.log(value);
      let cate = this.questionCategoryList.filter(e => e.category_id == value);
      this.addQuestionForm.group_type = cate[0].group_type;
      this.addQuestionForm.question_type = cate[0].question_type;
      this.addQuestionForm.sub_objective = cate[0].sub_objective;
      if (cate[0].group_type == 1) {
        this.questionTypeList.resource.isDisable = true;
        this.questionTypeList.article.isDisable = true;
      } else {
        this.questionTypeList.resource.isDisable = false;
        this.questionTypeList.article.isDisable = false;
      }
      //添加试题切换题型清空数据
      // if (!this.$route.query.qid) {
      //   this.questionList = [];
      // }
    },
    goBack() {
      this.$router.go(-1);
    },
    // 打开资源选择
    showBindResourceModal(type) {
      this.questionResourceType = type;
      this.showSourceList = true;
    },
    // 绑定资源
    bindResource(argv) {
      this.showSourceList = false;
      this.addQuestionForm[this.questionResourceType] =
        argv[0].row.url || "没有url";
    }
  }
};
</script>