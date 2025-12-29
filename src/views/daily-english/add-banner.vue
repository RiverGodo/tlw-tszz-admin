<style lang="less">
@import "../../styles/loading.less";
@import "../../styles/form.less";
.common-form.add-banner-form{
  .cover-img{
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
            <BreadcrumbItem to="/DailyEnglish/BannerManage">广告管理</BreadcrumbItem>
            <template v-if="addBannerForm.banner_id >0">
              <BreadcrumbItem >编辑广告</BreadcrumbItem>
            </template>
            <template v-else>
              <BreadcrumbItem >创建广告</BreadcrumbItem>
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
            <Form class="common-form add-banner-form" ref="addBannerForm" :rules="ruleValidate"  :model="addBannerForm" label-position="right" :label-width="120">
                <FormItem label="广告名称"  prop="name">
                    <Input v-model="addBannerForm.name" placeholder="请输入名称(建议字数在14个字以上，不超过45个字)"></Input>
                </FormItem>
                <FormItem label="广告封面"  prop="cover_img">
                    <div class="img-bar">
                        <img v-if="addBannerForm.cover_img !== ''" class="cover-img" :src="addBannerForm.cover_img" />
                        <div class="actions">
                            <Upload
                                :before-upload="CoverImgUpload" 
                                action=""
                                accept="image/*"
                                :format="['jpg','jpeg','png']">
                                <Button :loading="coverImgUploading" type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
                            </Upload>
                            <p class="book-img-info">只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸750*300px</p>  
                        </div>   
                    </div>
                    <Spin fix v-if="coverImgUploading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传封面中...</div>
                    </Spin>                
                </FormItem>
                <FormItem label="广告地址"  prop="href">
                    <Input v-model="addBannerForm.href" placeholder="请输入广告URL地址"></Input>
                    <p>第三方网址（需要提前在小程序上设置安全业务域名）：https://www.baidu.com</p>
                    <p>小程序内文章详情：../column/column?product_id=1&package_id=1</p>
                    <p>其中 product_id 为文章id,package_id 为专栏id</p>                    
                </FormItem>
                <FormItem label="上架时间"  prop="open_time">
                    <DatePicker type="datetime" placement="top" v-model="addBannerForm.open_time" placeholder="选择时间" style="width: 200px"></DatePicker>
                </FormItem>
                <Spin fix v-if="bannerDetailLoading">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>读取信息中...</div>
                </Spin>
            </Form>
             <div style="text-align: center;">
                <Button type="ghost" size="large"  @click="goBack()" >取消返回</Button>
                <Button type="primary" size="large" :loading="addBannerLoading" @click="AddBanner()" >保存广告</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import {
  ossSFileHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
import {
  createBanner,
  updateBanner,
  getBannerDetail
} from "@/api/daily-english/banner";
export default {
  name: "add-banner",
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
        state: 0,
        open_time: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "请输入广告名称！", trigger: "blur" }],
        href: [{ required: true, message: "请输入广告地址！", trigger: "blur" }],
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
      bannerList: state => state.deBanner.bannerList,
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.bid > 0) {
        this.getBannerDetail(this.$route.query.bid);
      } else {
        this.addBannerForm.banner_id = -1;
      }
    },
    getBannerDetail(bid){
      getBannerDetail(bid)
      .then(res =>{
        if(res.res_code == 1){
          this.addBannerForm = res.msg;
          this.addBannerForm.open_time = new Date(this.addBannerForm.open_time);
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
        dir: "daily-english/banner_img",
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
    AddBanner() {
      this.$refs["addBannerForm"].validate(valid => {
        if (valid) {
         if (this.addBannerForm.cover_img == "") {
              this.$Message.warning("请上传封面图片！");
              return;
          }
          this.addBannerLoading = true;
          if (this.addBannerForm.banner_id > 0) {
            this.addBannerForm.open_time = new Date(this.addBannerForm.open_time);
            updateBanner(this.addBannerForm).then(res => {
              this.addBannerLoading = false;
              if (res.res_code == 1) {
                this.$Message.success("编辑广告成功！");
                this.$store.commit("clearBannerList");
                this.$router.go(-1);
              } else {
                this.$Message.error("编辑广告失败！");
              }
            });
          } else {
            createBanner(this.addBannerForm).then(res => {
                this.addBannerLoading = false;
                if (res.res_code == 1) {
                  this.$Message.success("添加广告成功！");
                  this.$store.commit("clearBannerList");
                  this.$router.go(-1);
                } else {
                  this.$Message.error("添加广告失败！");
                }
            });
          }
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
