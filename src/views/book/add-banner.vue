<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/form.less";
.common-form.add-banner-form {
  .cover-img {
    flex: 0 0 300px;
    width: 300px;
    height: 120px;
    margin-right: 20px;
  }
}
</style>
<template>
  <div class="page-content daily-english de-add-banner">
    <Breadcrumb separator=">">
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <BreadcrumbItem to="/BookManage/BannerList">广告列表</BreadcrumbItem>
      <template v-if="addBannerForm.banner_id > 0">
        <BreadcrumbItem>编辑广告</BreadcrumbItem>
      </template>
      <template v-else>
        <BreadcrumbItem>创建广告</BreadcrumbItem>
      </template>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          基本信息
        </div>
        <div class="actions"></div>
      </div>
      <Form
        class="common-form add-banner-form"
        ref="addBannerForm"
        :rules="ruleValidate"
        :model="addBannerForm"
        label-position="right"
        :label-width="120"
      >
        <FormItem label="广告名称" prop="name">
          <Input
            v-model="addBannerForm.name"
            placeholder="请输入名称(建议字数在14个字以上，不超过45个字)"
          ></Input>
        </FormItem>
        <FormItem label="广告封面" prop="cover_img">
          <div class="img-bar">
            <img
              v-if="addBannerForm.cover_img !== ''"
              class="cover-img"
              :src="addBannerForm.cover_img"
            />
            <div class="actions">
              <Upload
                :before-upload="CoverImgUpload"
                action=""
                accept="image/*"
                :format="['jpg', 'jpeg', 'png']"
              >
                <Button
                  :loading="coverImgUploading"
                  type="ghost"
                  icon="ios-cloud-upload-outline"
                  >上传封面</Button
                >
              </Upload>
              <p class="book-img-info">
                只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸750*300px
              </p>
            </div>
          </div>
          <Spin fix v-if="coverImgUploading">
            <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
            <div>上传封面中...</div>
          </Spin>
        </FormItem>
        <FormItem label="广告类型" prop="type">
          <RadioGroup @on-change="changeRules()" v-model="addBannerForm.type">
              <Radio v-for="item in typeList"
              :value="item.value"
              :key="item.value" :label="item.value">
                  <Icon type="logo-apple"></Icon>
                  <span>{{ item.label }}</span>
              </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-show="addBannerForm.type == 0" label="广告地址" prop="href">
          <Input
            v-model="addBannerForm.href"
            placeholder="请输入广告URL地址"
          ></Input>
          <p>
            第三方网址（需要提前在小程序上设置安全业务域名）：https://www.baidu.com
          </p>
          <p>
            小程序内图书以及课程详情：../subjectDetail/subjectDetail?book_id=1
          </p>
          <p>其中 product_id 为文章id,package_id 为专栏id</p>
        </FormItem>
        <FormItem v-show="addBannerForm.type == 1"  label="广告内容" prop="contenthref">
          <quill-editor
            class="rich-editor"
            ref="myQuillEditor"
            :options="richEditorDef"
            v-model="addBannerForm.content"
          >
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
        </FormItem>
        <FormItem label="开启弹窗" prop="popup">
          <i-switch v-model="ispopup" @on-change="changepopup"> </i-switch>
        </FormItem>
        <FormItem v-show="ispopup" label="弹窗封面" prop="popup_cover_img">
          <div class="img-bar">
            <img
              v-if="addBannerForm.popup_cover_img !== ''"
              width="300px"
              :src="addBannerForm.popup_cover_img"
            />
            <div class="actions">
              <Upload
                :before-upload="PopCoverImgUpload"
                action=""
                accept="image/*"
                :format="['jpg', 'jpeg', 'png']"
              >
                <Button
                  :loading="coverImgUploading"
                  type="ghost"
                  icon="ios-cloud-upload-outline"
                  >上传封面</Button
                >
              </Upload>
              <p class="book-img-info">
                只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸700*930px
              </p>
            </div>
          </div>
          <Spin fix v-if="coverImgUploading">
            <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
            <div>上传封面中...</div>
          </Spin>
        </FormItem>
        <FormItem v-show="ispopup" label="弹窗间隔">
          <div style="display:flex;align-items: center;width:200px">
            <Input v-model="addBannerForm.popup_interval_date" placeholder="请输入弹窗间隔时间"></Input>
            <p style=" width: 200px;margin-left:10px">单位：天</p>
          </div>
          <p>每隔XX天弹窗一次</p>
        </FormItem>
        <FormItem label="开启咨询" >
          <i-switch v-model="customerservice" @on-change="changeservice"> </i-switch>
        </FormItem>
        <FormItem label="上架时间" prop="open_time">
          <DatePicker
            type="datetime"
            placement="top"
            v-model="addBannerForm.open_time"
            placeholder="选择时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        
        <Spin fix v-if="bannerDetailLoading">
          <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
          <div>读取信息中...</div>
        </Spin>
      </Form>
      <div style="text-align: center;">
        <Button type="ghost" size="large" @click="goBack()">取消返回</Button>
        <Button
          type="primary"
          size="large"
          :loading="addBannerLoading"
          @click="AddBanner()"
          >保存广告</Button
        >
      </div>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { quillEditor } from "vue-quill-editor";
import { ossSFileHost, getOssSign, uploadToAliyun } from "@/api/aliyunOss";
import { addBanner, updateBanner, getBannerDetail } from "@/api/banner";
export default {
  name: "add-banner",
  components: {
    quillEditor
  },
  data() {
    return {
      bannerDetailLoading: false,
      addBannerLoading: false,
      coverImgUploading: false,
      addBannerForm: {
        banner_id: -1,
        name: "",
        cover_img: "",
        href: "",
        content: "",
        is_popup: 0,
        is_customer_service: 0,
        popup_interval_date: 0,
        type: 0,
        state: 0,
        open_time: "",
        popup_cover_img:""
      },
      ispopup:false,
      customerservice:false,
      typeList: [
        {
          value: 0,
          label: "链接"
        },
        {
          value: 1,
          label: "内容"
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: "请输入广告名称！", trigger: "blur" }
        ],
        href: [
          { required: true, message: "请输入广告地址！", trigger: "blur" }
        ],
        contenthref: "",
        open_time: [
          {
            required: true,
            type: "date",
            message: "请选择上架时间！",
            trigger: "change"
          }
        ]
      },
      articleImgUploading: false
    };
  },
  computed: {
    ...mapState({
      bannerBookList: state => state.bookBanner.bannerBookList,
      richEditorDef: state => state.app.richEditorDef
    }),
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    this.init();
    this.bindArticleImgUploadHandler();
  },
  methods: {
    init() {
      if (this.$route.query.bid > 0) {
        this.getBannerDetail(this.$route.query.bid);
      } else {
        this.addBannerForm.banner_id = -1;
      }
    },
    getBannerDetail(bid) {
      getBannerDetail({ banner_id: bid }).then(res => {
        if (res.res_code == 1) {
          this.addBannerForm = res.msg;
          this.addBannerForm.open_time = new Date(this.addBannerForm.open_time);
          this.ispopup = this.addBannerForm.is_popup == 1 ? true : false;
          this.customerservice = this.addBannerForm.is_customer_service == 1 ? true : false;
          if (res.msg.type == 0) {
              this.ruleValidate.contenthref = ""
          }else{
              this.ruleValidate.href = ""
          }
        }
      });
      //this.addBannerForm  = arr[0];
    },
    CoverImgUpload(file) {
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
        dir: "tl-book/banner_img",
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
          uploadToAliyun(ossSFileHost.oss, formData).then(res => {
            if (res.status == 200) {
              this.addBannerForm.cover_img =
                ossSFileHost.cdn + sign_data.msg.filename;
            }
            this.coverImgUploading = false;
          });
        }
      });
      return false;
    },
    PopCoverImgUpload(file) {
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
        dir: "tl-book/banner_img",
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
          uploadToAliyun(ossSFileHost.oss, formData).then(res => {
            if (res.status == 200) {
              this.addBannerForm.popup_cover_img =
                ossSFileHost.cdn + sign_data.msg.filename;
            }
            this.coverImgUploading = false;
          });
        }
      });
      return false;
    },
    ArticleImgUpload(file) {//详情图标上传
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
        dir: "tl-book/article_img",
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
    AddBanner() {
      this.$refs["addBannerForm"].validate(valid => {
        if (valid) {
          if (this.addBannerForm.cover_img == "") {
            this.$Message.warning("请上传封面图片！");
            return;
          }
          this.addBannerLoading = true;
          if (this.addBannerForm.banner_id > 0) {
            this.addBannerForm.open_time = new Date(
              this.addBannerForm.open_time
            );
            updateBanner(this.addBannerForm).then(res => {
              this.addBannerLoading = false;
              if (res.res_code == 1) {
                this.$Message.success("编辑广告成功！");
                this.$store.commit("clearBookBannerList");
                this.$router.go(-1);
              } else {
                this.$Message.error("编辑广告失败！");
              }
            });
          } else {
            addBanner(this.addBannerForm).then(res => {
              this.addBannerLoading = false;
              if (res.res_code == 1) {
                this.$Message.success("添加广告成功！");
                this.$store.commit("clearBookBannerList");
                this.$router.go(-1);
              } else {
                this.$Message.error("添加广告失败！");
              }
            });
          }
        }
      });
    },
    changepopup(exam){
      if (exam) {
        this.addBannerForm.is_popup = 1
      }else{
        this.addBannerForm.is_popup = 0
      }
    },
    changeservice(exam){
      if (exam) {
        this.addBannerForm.is_customer_service = 1
      }else{
        this.addBannerForm.is_customer_service = 0
      }
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
    changeRules(){
      if (this.addBannerForm.type == 0) {
        this.ruleValidate.href =  [ { required: true, message: "请输入广告地址！", trigger: "blur" } ]
        this.ruleValidate.contenthref = ""
      }else{
        this.ruleValidate.href =  ""
        // this.ruleValidate.contenthref = [ { required: true, message: "请输入广告内容！", trigger: "blur" } ]
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
