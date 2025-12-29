<template>
    <Modal class="common-dialog  add-comment-dialog" :transfer="false" v-model="showModal" title="添加教师">
        <Form ref="addTeacherForm" :model="addTeacherForm" label-position="right" :label-width="80">
            <FormItem class="mb-0" label="姓名" prop="teacher_name">
                <Input v-model="addTeacherForm.teacher_name" placeholder="请输入姓名" class="inp-0"></Input>
            </FormItem>
            <FormItem label="头像"  prop="avator_img" class="avatar">
                    <div class="img-bar">
                        <img v-if="addTeacherForm.avator_img !== ''" class="cover-img" :src="addTeacherForm.avator_img" />
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
            <Button type="primary" size="large"  @click="AddTeacher()">添加</Button>
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
        }
    },
    data (){
        return {
            date:moment(new Date()).format("YYYY-MM-DD"),
            showModal: false,
            coverImgUploading: false,
            addTeacherForm:{
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
                        this.addTeacherForm.avator_img =
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
       AddTeacher(){
           addOrUpdateTeacher(this.addTeacherForm).then(res=>{
                this.addTeacherForm.teacher_name='';
                this.addTeacherForm.avator_img='';
                this.addTeacherForm.create_time='';
                if(res.res_code==1){
                    this.$Message.success("添加评论成功！");
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
