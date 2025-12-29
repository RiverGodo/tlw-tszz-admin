<template>
    <Modal class="common-dialog  add-comment-dialog" :transfer="false" v-model="showModal" title="修改教师">
        <Form ref="Form" :model="Form" label-position="right" :label-width="80">
            <FormItem class="mb-0" label="姓名" prop="teacher_name">
                <Input v-model="Form.teacher_name"  class="inp-0"></Input>
            </FormItem>
            <FormItem label="头像"  prop="avator_img" class="avatar">
                    <div class="img-bar">
                        <img v-if="Form.avator_img !== ''" class="cover-img" :src="Form.avator_img" />
                        <div class="actions">
                            <Upload
                                :before-upload="CoverImgUpload" 
                                action=""
                                accept="image/*"
                                :format="['jpg','jpeg','png']">
                                <Button :loading="coverImgUploading" type="ghost" icon="ios-cloud-upload-outline">上传头像</Button>
                            </Upload>
                            <p class="book-img-info">只能上传 jpg/jpeg/png 文件</p> 
                        </div>   
                    </div>
                    
                    <Spin fix v-if="coverImgUploading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传头像中...</div>
                    </Spin>                
                </FormItem> 
                <FormItem class="mb-0" label="添加时间" prop="create_time">
                    {{date}}
                </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large"  @click="EditTeacher()">修改</Button>
        </div>
    </Modal>
</template>

<script>
import moment from "moment";
import {addOrUpdateTeacher} from "@/api/teacher";
import {
  ossSFileHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
export default {
    name:"addTeacherModal",
    props:{
        isShow: {
            type: Boolean,
            default: false
        },
        addTeacherForm:{
            type:Object,
            default:true
        }
    },
    data (){
        return {
            date:moment(new Date()).format("YYYY-MM-DD"),
            showModal: false,
            coverImgUploading: false,
            Form:{
                teacher_id:-1,
                teacher_name:'',
                avator_img:'',
                create_time:'',
            },
        }
    },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = value;
                this.Form.teacher_name=this.addTeacherForm.teacher_name;
                this.Form.avator_img=this.addTeacherForm.avator_img;
                this.Form.create_time=this.addTeacherForm.comment_time;
                this.Form.teacher_id=this.addTeacherForm.id;
            }
            },
            showModal(value) {
            if (!value) {
                this.$emit("closeModal");
            }
        },
        
    },
    mounted(){
        
    },
    computed:{
        
    },
    methods:{
        CoverImgUpload(file) {
            console.log(file);
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
                        this.Form.avator_img =
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
       EditTeacher(){
           addOrUpdateTeacher(this.Form).then(res=>{
                if(res.res_code==1){
                    this.$Message.success("更新教师成功！");
                    this.showModal=false;
                    this.$emit('TeacherList');
                }
            })
       } 
    }
}
</script>

<style scoped>
    .add-comment-dialog {
        z-index:1000
    }
    .avatar{
        text-align:center;
    }
    .inp-0{
        width:350px;
    }
    img {
        width:200px;
        padding-top:10px;
    }
</style>
