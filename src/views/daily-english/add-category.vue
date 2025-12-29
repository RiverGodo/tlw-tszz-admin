<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/form.less";
</style>
<template>
    <div class="page-content  daily-english">
        <Breadcrumb separator=">">
            <BreadcrumbItem>每日英语</BreadcrumbItem>
            <BreadcrumbItem to="/DailyEnglish/CategoryManage">专栏管理</BreadcrumbItem>
            <template v-if="addCategoryForm.category_id >0">
              <BreadcrumbItem >编辑专栏</BreadcrumbItem>
            </template>
            <template v-else>
              <BreadcrumbItem >创建专栏</BreadcrumbItem>
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
            <Form class="common-form add-category-form" ref="addCategoryForm" :rules="ruleValidate"  :model="addCategoryForm" label-position="right" :label-width="120">
                <FormItem label="专栏类型"  prop="package_category_id">
                  <Select v-model="addCategoryForm.package_category_id" style="width:100px">
                        <Option v-for="item in categoryTypeListDef" 
                        :value="item.package_category_id" 
                        :key="item.package_category_id">{{ item.package_category_name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="专栏名称"  prop="name">
                    <Input v-model="addCategoryForm.name" placeholder="请输入专栏名称(建议字数在14个字以上，不超过45个字)"></Input>
                </FormItem>
                <FormItem label="专栏简介"  prop="short_desc">
                    <Input v-model="addCategoryForm.short_desc" placeholder="请输入专栏简介..."></Input>
                </FormItem>
                <FormItem label="实际价格"  prop="price">
                    <Input style="width: 150px;" v-model="addCategoryForm.price" placeholder="请输入实际价格"></Input> 元
                </FormItem>
                <FormItem label="原始价格"  prop="price">
                    <Input style="width: 150px;" v-model="addCategoryForm.original_price" placeholder="请输入原始价格"></Input> 元
                </FormItem>
                <!-- <FormItem label="专栏图标"  prop="icon_url">
                    <div class="img-bar">
                        <img v-if="addCategoryForm.icon_url !== ''" class="icon-img" :src="addCategoryForm.icon_url" />
                        <div class="actions">
                            <Upload
                                :before-upload="IconImgUpload"
                                action=""
                                accept="image/*"
                                :format="['jpg','jpeg','png']">
                                <Button :loading="iconImgUploading" type="ghost" icon="ios-cloud-upload-outline">上传图标</Button>
                            </Upload>
                            <p class="book-img-info">只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸81*81px</p>  
                        </div>   
                    </div>
                    <Spin fix v-if="iconImgUploading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传图标中...</div>
                    </Spin>                
                </FormItem> -->
                <FormItem label="专栏封面"  prop="img_url">
                    <div class="img-bar">
                        <img v-if="addCategoryForm.cover_img !== ''" class="cover-img" :src="addCategoryForm.cover_img" />
                        <div class="actions">
                            <Upload
                                :before-upload="CoverImgUpload" 
                                action=""
                                accept="image/*"
                                :format="['jpg','jpeg','png']">
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
                <FormItem label="专栏详情" prop="detail" >
                    <quill-editor 
                      class="rich-editor" 
                      v-model="addCategoryForm.detail"
                      ref="myQuillEditor"
                      :options="richEditorDef">
                    </quill-editor>
                    <Spin fix v-if="categoryImgUploading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传图片中...</div>
                    </Spin>
                    <div class="limit"><span style="color:red">*</span>注意：专栏内图片必须使用编辑器内的图片上传，小程序内不支持外链图片。</div>
                    <Upload
                        style="display:none"
                        :before-upload="CategoryImgUpload"
                        action=""
                        accept="image/*"
                        :format="['jpg','jpeg','png']">
                        <Button id="categoryImgUploadBtn" type="ghost" icon="ios-cloud-upload-outline">categoryImgUploadBtn</Button>
                    </Upload>
                </FormItem>
                <Spin fix v-if="categoryDetailLoading">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>读取信息中...</div>
                </Spin>
            </Form>
             <div style="text-align: center;">
                <Button type="primary" size="large" :loading="addCategoryLoading" @click="AddCategory()" >保存返回</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { ossSFileHost, getOssSign, uploadToAliyun } from "@/api/aliyunOss";
import { quillEditor } from "vue-quill-editor";
import { mapState } from "vuex";
import {
  getCategoryDetail,
  createCategory,
  updateCategory
} from "@/api/daily-english/category";
export default {
  name: "add-category",
  components: {
    quillEditor
  },
  data() {
    return {
      addCategoryLoading: false,
      coverImgUploading: false,
      iconImgUploading: false,
      categoryImgUploading: false,
      categoryDetailLoading: false,
      addCategoryForm: {
        category_id: -1,
        package_category_id: 1,
        name: "",
        short_desc: "",
        icon_url: "",
        cover_img: "",
        detail: "",
        state: 1,
        price: 0,
        original_price: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: "请输入专栏名称！", trigger: "blur" }
        ],
        short_desc: [
          { required: true, message: "请输入专栏简介！", trigger: "blur" }
        ],
        open_time: [
          {
            required: true,
            type: "date",
            message: "请选择上架时间！",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      richEditorDef: state => state.app.richEditorDef,
      categoryOriginListDef: state => state.deCategory.categoryOriginList,
      categoryTypeListDef: state => state.deCategory.categoryTypeList
    }),
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.bindCategoryImgUploadHandler();
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.cid > 0) {
        this.categoryDetailLoading = true;
        getCategoryDetail(this.$route.query.cid).then(res => {
          this.categoryDetailLoading = false;
          if (res.res_code == 1) {
            this.addCategoryForm = res.msg;
            this.addCategoryForm.category_id = this.$route.query.cid;
          }
        });
      } else {
        this.addCategoryForm.category_id = -1;
      }
    },
    /* IconImgUpload(file) {
      if(file.size>1024*100){
        this.$Message.warning("请选择小于100k的图片！");
        return;
      }
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tlw-web-static-file",
        dir: "daily-english/icon_img",
        dir: "icon_img",
        filename: file.name,
        type: "POST"
      };
      this.iconImgUploading = true;
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(config,formData).then(res => {
            if (res.status == 200) {
              this.addCategoryForm.icon_url = ossDailyEnglishHost + sign_data.msg.filename;
            }
            this.iconImgUploading = false;
          });
        }
      });
      return false;
    }, */
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
          uploadToAliyun(ossSFileHost.oss, formData).then(res => {
            if (res.status == 200) {
              this.addCategoryForm.cover_img =
                ossSFileHost.cdn + sign_data.msg.filename;
            }
            this.coverImgUploading = false;
          });
        }
      });
      return false;
    },
    CategoryImgUpload(file) {
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
        dir: "daily-english/category_img",
        filename: file.name,
        type: "POST"
      };
      this.categoryImgUploading = true;
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
              let addRange = this.editor.getSelection();
              this.editor.insertEmbed(
                addRange !== null ? addRange.index : 0,
                "image",
                tmpImgUrl
              );
            }
            this.categoryImgUploading = false;
          });
        }
      });
      return false;
    },
    AddCategory() {
      this.$refs["addCategoryForm"].validate(valid => {
        if (valid) {
          if (this.addCategoryForm.cover_img == "") {
            this.$Message.warning("请上传专栏封面！");
            return;
          }
          this.addCategoryLoading = true;
          if (this.addCategoryForm.category_id > 0) {
            updateCategory(this.addCategoryForm).then(res => {
              this.addCategoryLoading = false;
              if (res.res_code == 1) {
                this.$Message.success("修改专栏成功！");
                this.$store.commit("clearCategoryList");
                this.$router.go(-1);
              } else {
                this.$Message.error("修改专栏失败！");
              }
            });
          } else {
            createCategory(this.addCategoryForm).then(res => {
              this.addCategoryLoading = false;
              if (res.res_code == 1) {
                this.$Message.success("添加专栏成功！");
                this.$store.commit("clearCategoryList");
                this.$router.go(-1);
              } else {
                this.$Message.error("添加专栏失败！");
              }
            });
          }
        }
      });
    },
    //绑定图片上传处理事件
    bindCategoryImgUploadHandler() {
      this.editor.getModule("toolbar").addHandler("image", function(state) {
        if (state) {
          let fileInput = document.getElementById("categoryImgUploadBtn");
          fileInput.click(); // 加一个触发事件
        }
      });
    }
  }
};
</script>

