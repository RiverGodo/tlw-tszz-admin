<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/form.less";
.artical-preview {
  .ivu-modal-content {
    background: transparent;
  }
  .ivu-modal-body {
    background: #efeeed;
    padding-top: 50px;
    height: 667px;
    overflow: auto;
    img {
      width: 100%;
    }
  }
}
</style>
<template>
  <div class="page-content daily-english de-add-article">
    <Breadcrumb separator=">">
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <template v-if="addArticleForm.category_id > 0">
        <BreadcrumbItem to="/DailyEnglish/CategoryManage">专栏管理</BreadcrumbItem>
        <BreadcrumbItem :to="categoryDetailPath">专栏详情</BreadcrumbItem>
        <template v-if="addArticleForm.article_id >0">
          <BreadcrumbItem>编辑专栏内文章</BreadcrumbItem>
        </template>
        <template v-else>
          <BreadcrumbItem>创建专栏内文章</BreadcrumbItem>
        </template>
      </template>
      <template v-else>
        <BreadcrumbItem to="/DailyEnglish/ArticleManage">文章管理</BreadcrumbItem>
        <template v-if="addArticleForm.article_id >0">
          <BreadcrumbItem>编辑文章</BreadcrumbItem>
        </template>
        <template v-else>
          <BreadcrumbItem>创建文章</BreadcrumbItem>
        </template>
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
      <Form class="common-form add-article-form" ref="addArticleForm" :rules="ruleValidate" :model="addArticleForm" label-position="right" :label-width="120">
        <FormItem :label="formLabel.name" prop="name">
          <Input v-model="addArticleForm.name" placeholder="请输入名称(建议字数在14个字以上，不超过45个字)"></Input>
        </FormItem>
        <FormItem :label="formLabel.short_desc" prop="short_desc">
          <Input v-model="addArticleForm.short_desc" placeholder="请输入简介(建议字数在14个字以上，不超过45个字)"></Input>
        </FormItem>
        <FormItem :label="formLabel.price" prop="price">
          <Input style="width: 150px;" v-model="addArticleForm.price" placeholder="请输入实际价格(元)"></Input> 元
        </FormItem>
        <FormItem :label="formLabel.original_price" prop="original_price">
          <Input style="width: 150px;" v-model="addArticleForm.original_price" placeholder="请输入原始价格(元)"></Input> 元
        </FormItem>
        <FormItem v-if="addArticleForm.type ==2 || addArticleForm.type ==3" :label="formLabel.resource" prop="online_resource_url">
          <div class="img-bar">
            <video-player class="video-bar" v-if="addArticleForm.online_resource_url !== ''" ref="videoPlayer" :options="playerOptions" :playsinline="true">
            </video-player>
            <div class="actions">
              <Row>
                <Col span="4">
                <Upload v-if="!isInputUrl" :before-upload="ResourceUpload" action="" :format="['mp3','mp4']">
                  <Button :loading="resourceUploading" type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
                </Col>
                <Col span="20">
                <Row>
                  <Col span="20" v-if="isInputUrl">
                  <Input v-model="addArticleForm.online_resource_url"></Input>
                  </Col>
                  <Col span="4">
                  <Button type="text" @click="isInputUrl = !isInputUrl">{{ !isInputUrl ? '视频和音频上传直接输入地址' : '切换上传文件' }}</Button>
                  </Col>
                </Row>
                </Col>
              </Row>
              <p class="book-img-info">只能上传 mp3/mp4 文件</p>
            </div>
          </div>
          <Spin fix v-if="resourceUploading">
            <!-- <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon> -->
            <Progress :percent="uploadPercent"></Progress>
            <div>上传文件中...</div>
          </Spin>
        </FormItem>
        <FormItem v-if="addArticleForm.type != 5 && addArticleForm.type != 3" :label="formLabel.segment" prop="cover_img">
          <addSegment ref="segmentRef" :segmentData="addArticleForm.online_resource_ex" />
        </FormItem>
        <FormItem v-if="addArticleForm.type == 5" label="直播地址" prop="push_flow_name">
          <Input v-model="push_flow_name" style="width: 200px" placeholder="请输入推流名称(纯英文)"></Input>
          <div v-show="push_flow_name">
            <p style="margin-top: 10px;">推流地址: rtmp://video-center-bj.alivecdn.com/tszz/</p>
            <p>流密钥
              <span style="color: #2d8cf0">{{push_flow_name}}</span>?vhost=live.xuege100.com</p>
            <p>播放地址: rtmp://video-center-bj.alivecdn.com/tszz/
              <span style="color: #2d8cf0">{{push_flow_name}}</span>
            </p>
          </div>
        </FormItem>
        <!-- <FormItem v-if="addArticleForm.type == 5" label="播放地址" prop="play_url">
          <Input v-model="addArticleForm.play_url" placeholder="请输入名称播放地址"></Input>
        </FormItem> -->
        <FormItem v-if="addArticleForm.type == 5" label="开始时间" prop="start_date">
          <DatePicker v-model="addArticleForm.start_time" type="datetime" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem v-if="addArticleForm.type == 5" label="结束时间" prop="end_date">
          <DatePicker v-model="addArticleForm.end_time" type="datetime" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem :label="formLabel.cover_img" prop="cover_img">
          <div class="img-bar">
            <img v-if="addArticleForm.cover_img !== ''" class="cover-img" :src="addArticleForm.cover_img" />
            <div class="actions">
              <Upload :before-upload="CoverImgUpload" action="" accept="image/*" :format="['jpg','jpeg','png']">
                <Button :loading="coverImgUploading" type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
              </Upload>
              <p class="book-img-info">只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸750*450px</p>
            </div>
          </div>
          <Spin fix v-if="coverImgUploading">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>上传封面中...</div>
          </Spin>
        </FormItem>
        <FormItem v-if="addArticleForm.type == 5" label="直播老师">
          <Input v-model="addArticleForm.teacher_name" style="width: 200px" placeholder="请输入直播老师"></Input>
        </FormItem>
        <FormItem :label="formLabel.detail" prop="detail">
          <quill-editor class="rich-editor" v-model="addArticleForm.detail" ref="myQuillEditor" :options="richEditorDef">
          </quill-editor>
          <Spin fix v-if="articleImgUploading">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>上传图片中...</div>
          </Spin>
          <div class="limit">
            <span style="color:red">*</span>注意：详情内图片必须使用编辑器内的图片上传，小程序内不支持外链图片。</div>
          <Upload style="display:none" :before-upload="ArticleImgUpload" action="" accept="image/*" :format="['jpg','jpeg','png']">
            <Button id="articleImgUploadBtn" type="ghost" icon="ios-cloud-upload-outline">articleImgUploadBtn</Button>
          </Upload>
          <Button type="info" size="small" @click="showPreview = true">预览</Button>
        </FormItem>
        <FormItem label="选择标签">
          <CheckboxGroup v-model="addArticleForm.tags">
            <Checkbox v-for="item in articleTagListDef" :key="item.tag_id" :label="item.tag_id">{{item.tag_name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="绑定练习" prop="bindExam">
          <i-switch v-model="bindExam" @on-change="setArticleExam">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="选择练习" v-show="bindExam">
          <span v-if="addArticleForm.exercise_name">《 {{addArticleForm.exercise_name}} 》</span>
          <Button style="margin-left:10px;" type="ghost" @click="showExamListModal = true">选择练习</Button>
        </FormItem>
        <FormItem :label="formLabel.from" prop="from">
          <RadioGroup v-model="addArticleForm.from">
            <Radio v-for="item in articleOriginListDef" :label="item.origin_id" :key="item.origin_id">{{ item.name }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="上架状态" prop="state">
          <RadioGroup v-model="addArticleForm.state">
            <Radio v-for="item in stateList" :label="item.state" :key="item.state">{{ item.name }}</Radio>
          </RadioGroup>
        </FormItem>
        <Spin fix v-if="articleDetailLoading">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>读取信息中...</div>
        </Spin>
      </Form>
      <div style="text-align: center;">
        <Button type="primary" size="large" v-if="addArticleForm.type == 5" @click="goTransform">转为录播</Button>
        <Button type="ghost" size="large" @click="goBack">取消返回</Button>
        <Button type="primary" size="large" :loading="addArticleLoading" @click="AddArticle">保存文章</Button>
      </div>
    </Card>
    <exam-list-modal :is-show="showExamListModal" @closeModal="showExamListModal=false" @selectExam="setArticleExam">
    </exam-list-modal>
    <Modal v-model="showPreview" class="artical-preview" width="375">
      <p class="artical-preview-content" v-html="addArticleForm.detail"></p>
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
import { mapActions, mapState } from "vuex";
import {
  ossSFileHost,
  ossMvHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
import {
  getArticleDetail,
  createArticle,
  updateArticle
} from "@/api/daily-english/article";
import { createArticleToCategory } from "@/api/daily-english/category";
import examListModal from "../modal-components/exam-list";
import addSegment from "../modal-components/add-segment";
export default {
  name: "add-article",
  components: {
    quillEditor,
    videoPlayer,
    examListModal,
    addSegment
  },
  data() {
    return {
      articleType: 1,
      prefixText: "图文",
      articleDetailLoading: false,
      resourceUploading: false,
      addArticleLoading: false,
      coverImgUploading: false,
      articleImgUploading: false,
      bindExam: false,
      showExamListModal: false,
      stateList: [],
      uploadPercent: 0,
      isInputUrl: false,
      push_flow_name: "",
      addArticleForm: {
        category_id: -1,
        article_id: -1,
        exercise_id: -1,
        exercise_name: "",
        name: "",
        short_desc: "",//简介
        price: "",//实际价格
        original_price: "",//原始价格
        description: "",
        cover_img: "",
        detail: "",//详情
        online_resource_url: "",//在线课程链接地址
        content_type: "",
        state: 0,//上下架状态
        type: 1,//1 图文；2 视频；3 音频；5 直播
        tags: [],//标签
        open_time: "",
        from: 1,
        online_resource_ex: [],
        // 直播
        start_time: "",
        end_time: "",
        online_resource_stream_url: "rtmp://video-center-bj.alivecdn.com/tszz/",//直播推流地址
        teacher_name: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入文章名称！",
            trigger: "blur"
          }
        ],
        short_desc: [
          {
            required: true,
            message: "请输入文章简介！",
            trigger: "blur"
          }
        ],
        open_time: [
          {
            required: true,
            type: "date",
            message: "请选择上架时间！",
            trigger: "change"
          }
        ]
      },
      showPreview: false
    };
  },
  computed: {
    ...mapState({
      richEditorDef: state => state.app.richEditorDef,
      articleOriginListDef: state => state.deArticle.articleOriginList,
      articleTypeListDef: state => state.deArticle.articleTypeList,
      articleTagListDef: state => state.deArticle.articleTagList,
      stateListDef: state => state.app.stateList
    }),
    formLabel: function () {
      let fl = {};
      fl.name = this.prefixText + "名称";
      fl.short_desc = this.prefixText + "简介";
      fl.cover_img = this.prefixText + "封面";
      fl.detail = this.prefixText + "详情";
      fl.from = this.prefixText + "来源";
      fl.resource = this.prefixText + "上传";
      fl.price = "实际价格";
      fl.original_price = "原始价格";
      fl.segment = "视频分段";
      return fl;
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    playerOptions: function () {
      let options = {
        sources: [
          {
            type: this.addArticleForm.content_type,
            src: this.addArticleForm.online_resource_url
          }
        ]
      };
      return options;
    },
    categoryDetailPath: function () {
      return "/DailyEnglish/CategoryDetail/" + this.addArticleForm.category_id;
    },
    play_url() {
      return `rtmp://video-center-bj.alivecdn.com/tszz/${
        this.push_flow_name
        }`
    }
  },
  mounted() {
    this.bindArticleImgUploadHandler();
    this.init();
  },
  methods: {
    ...mapActions(["getArticleTagList"]),
    goTransform() {
      this.addArticleForm.online_resource_url = "";
      this.addArticleForm.type = 2;
      this.prefixText = '视频'
    },
    init() {
      if (this.articleTagListDef.length == 0) {
        this.getArticleTagList();
      }
      this.stateList = this.stateListDef.map(e => {
        let s = {
          state: e.state,
          name: e.name.substr(1)
        };
        return s;
      });
      this.addArticleForm.type = this.$route.params.type;
      // console.log(this.addArticleForm.type)
      let type_arr = this.articleTypeListDef.filter(
        e => e.type_id == this.addArticleForm.type
      );
      this.prefixText = type_arr[0].name;
      if (this.$route.query.aid > 0) {//如果是编辑
        this.articleDetailLoading = true;
        getArticleDetail(this.$route.query.aid).then(res => {
          this.articleDetailLoading = false;
          if (res.res_code == 1) {
            let articleDetail = res.msg;
            this.addArticleForm = res.msg;
            this.addArticleForm.start_time = new Date(articleDetail.start_time);
            this.addArticleForm.end_time = new Date(articleDetail.end_time);
            var rs = articleDetail.online_resource_url.substr(
              articleDetail.online_resource_url.indexOf("com/") + 4
            );
            this.push_flow_name = rs.substr(5);
            this.addArticleForm.article_id = this.$route.query.aid;
            if (this.$route.query.cid > 0) {
              this.addArticleForm.category_id = this.$route.query.cid;
            }
            if (this.addArticleForm.exercise_id > 0) {
              this.bindExam = true;
            }
            if (this.addArticleForm.tags.length > 0) {
              this.addArticleForm.tags = this.addArticleForm.tags.map(
                e => e.tag_id
              );
            }
          }
        });
      } else {
        this.addArticleForm.article_id = -1;//如果是添加
      }
      if (this.$route.query.cid > 0) {
        this.addArticleForm.category_id = this.$route.query.cid;
      }
    },
    CoverImgUpload(file) {//上传封面图
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
        dir: "daily-english/cover_img",
        filename: file.name,
        type: "POST"
      };
      this.coverImgUploading = true;
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(ossSFileHost.oss, formData)
            .then(res => {
              if (res.status == 200) {
                this.addArticleForm.cover_img =
                  ossSFileHost.cdn + sign_data.msg.filename;
              } else {
                this.$Message.warning(JSON.stringify(res))
              }
              this.coverImgUploading = false;
            })
            .catch(err => {
              this.coverImgUploading = false;
              this.$Message.warning(JSON.stringify(err))
            });
        }
      });
      return false;
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
        dir: "daily-english/article_img",
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
          uploadToAliyun(ossSFileHost.oss, formData)
            .then(res => {
              if (res.status == 200) {
                let tmpImgUrl = ossSFileHost.cdn + sign_data.msg.filename;
                let addRange = this.editor.getSelection();
                this.editor.insertEmbed(
                  addRange !== null ? addRange.index : 0,
                  "image",
                  tmpImgUrl
                );
              } else {
                this.$Message.warning(JSON.stringify(res))
              }
              this.articleImgUploading = false;
            })
            .catch(err => {
              this.articleImgUploading = false;
              this.$Message.warning(JSON.stringify(err))
            });
        }
      });
      return false;
    },
    ResourceUpload(file) {
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
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tl-mv",
        dir: "daily-english/resource/" + dir,
        filename: file.name,
        type: "POST"
      };
      this.resourceUploading = true;
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
            this.uploadPercent = parseInt(event.loaded / event.total * 100);
          })
            .then(res => {
              if (res.status == 200) {
                this.addArticleForm.online_resource_url =
                  ossMvHost.cdn + sign_data.msg.filename;
                this.addArticleForm.content_type = config.content_type;
              } else {
                this.$Message.warning(JSON.stringify(res))
              }
              this.resourceUploading = false;
            })
            .catch(err => {
              this.resourceUploading = false;
              this.$Message.warning(JSON.stringify(err))
            });
        }
      });
      return false;
    },
    setArticleExam(exam) {
      if (!exam) {
        this.addArticleForm.exercise_id = -1;
        this.addArticleForm.exercise_name = "";
      } else {
        if (typeof exam === "object") {
          this.addArticleForm.exercise_id = exam.exercise_id;
          this.addArticleForm.exercise_name = exam.exercise_name;
        }
      }
    },
    AddArticle() {
      this.$refs["addArticleForm"].validate(valid => {
        if (valid) {
          if (this.addArticleForm.type == 2 || this.addArticleForm.type == 3) {
            this.addArticleForm.online_resource_ex = this.$refs.segmentRef.segList;
            if (this.addArticleForm.online_resource_url == "") {
              this.$Message.warning("请上传" + this.prefixText + "文件！");
              return;
            }
          }
          // 直播
          if (this.addArticleForm.type == 5) {
            this.addArticleForm.online_resource_url = this.play_url;
          }
          this.addArticleLoading = true;
          if (this.addArticleForm.article_id > 0) {//编辑文章
            updateArticle(this.addArticleForm)
              .then(res => {
                this.addArticleLoading = false;
                if (res.res_code == 1) {
                  this.$Message.success("编辑文章成功！");
                  if (this.addArticleForm.category_id > 0) {
                    this.$store.commit("clearCategoryArticleList");
                  } else {
                    this.$store.commit("clearArticleList");
                  }
                  this.$router.go(-1);
                } else {
                  this.$Message.error("编辑文章失败！");
                }
              })
              .catch(error => {
                this.addArticleLoading = false;
              });
          } else {
            if (this.addArticleForm.category_id > 0) {//专栏中创建产品
              createArticleToCategory(this.addArticleForm)
                .then(res => {
                  this.addArticleLoading = false;
                  if (res.res_code == 1) {
                    this.$Message.success("添加文章成功！");
                    this.$store.commit("clearCategoryArticleList");
                    this.$router.go(-1);
                  } else {
                    this.$Message.error("添加文章失败！");
                  }
                })
                .catch(error => {
                  this.addArticleLoading = false;
                });
            } else {//创建文章
              createArticle(this.addArticleForm)
                .then(res => {
                  this.addArticleLoading = false;
                  if (res.res_code == 1) {
                    this.$Message.success("添加文章成功！");
                    this.$store.commit("clearArticleList");
                    this.$router.go(-1);
                  } else {
                    this.$Message.error("添加文章失败！");
                  }
                })
                .catch(error => {
                  this.addArticleLoading = false;
                });
            }
          }
        }
      });
    },
    onEditorChange({ quill, html, text }) {
      this.addArticleForm.detail = html;
    },
    //绑定图片上传处理事件
    bindArticleImgUploadHandler() {
      this.editor.getModule("toolbar").addHandler("image", function (state) {
        if (state) {
          let fileInput = document.getElementById("articleImgUploadBtn");
          fileInput.click(); // 加一个触发事件
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>