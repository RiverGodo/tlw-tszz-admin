<template>
    <Modal class="common-dialog  add-comment-dialog" :transfer="false" v-model="showModal" title="编辑评论">
        <Form ref="Form" :model="Form" label-position="right" :label-width="80">
            <FormItem class="mb-0" label="昵称" prop="nickname">
                <Input  placeholder="请输入昵称" v-model="Form.nickname" class="inp-0"></Input>
                <Button type="ghost" @click="handleGetNickname()">获取昵称</Button>
            </FormItem>
            <FormItem label="头像"  prop="avatar_url" class="avatar">
                    <div class="img-bar">
                        <img  class="cover-img" :src="Form.avatar_url" />
                        <div class="actions">
                            <Upload
                                :before-upload="CoverImgUpload" 
                                action=""
                                accept="image/*"
                                :format="['jpg','jpeg','png']">
                                <Button :loading="coverImgUploading" type="ghost" icon="ios-cloud-upload-outline">上传头像</Button>
                            </Upload>
                            <p class="book-img-info">只能上传 jpg/jpeg/png 文件</p>  
                            <Button type="ghost" @click="handleGetAvatar()">获取头像</Button>
                        </div>   
                    </div>
                    <Spin fix v-if="coverImgUploading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传头像中...</div>
                    </Spin>                
                </FormItem>
            <FormItem label="评价内容" prop="content">
                <Row>
                <Col span="24">
                <Input type="textarea" :rows="4" v-model="Form.content"></Input>
                <p style="text-align:right">尽量输入100字以内</p>
                </Col>
                </Row>
            </FormItem> 
            <FormItem class="mb-0" label="评论时间" prop="create_time">
                <DatePicker type="datetime" placement="top" placeholder="选择时间" v-model="Form.create_time" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem class="inp-0" label="创建时间" prop="create_time" style="margin-top:10px;">
                <Input v-model="this.data1.create_time"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large"  @click="EditComment()">确定</Button>
        </div>
    </Modal>
</template>

<script>
import { updateMockBookComment,getMockRandomResource } from "@/api/bookComment"; 
import moment from "moment";
import {
  ossSFileHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
export default {
    name:"editCommentModal",
    props:{
        isShow: {
            type: Boolean,
            default: false
        },
        bookList: {
            type: Array,
            required: true
        },
        editForm: {
            type: Object,
            required: true
        },
        data2:{
            type:Object,
            required: true
        },
        commentlist: {
            type: Array,
            required: true
        },
        data1:{
            type:Object,
            required: true
        }
    },
    data (){
        return {
            showModal: false,
            coverImgUploading: false,
            Form:{
                nickname:'',
                avatar_url:''
            },
        }
    },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = value;
                this.data1.create_time=moment(this.data1.create_time).format("YYYY-MM-DD hh:mm:ss")
            }
            this.Form.nickname=this.editForm.nickname;
            this.Form.content=this.editForm.content;
            this.Form.avatar_url=this.editForm.avatar_url;
            this.Form.mock_id=this.editForm.mock_id;
            this.Form.create_time=this.editForm.comment_time;
            },
            showModal(value) {
            if (!value) {
                this.$emit("closeModal");
            }
        }
    },
    mounted(){
        
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
                        this.Form.avatar_url =
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
        //编辑评论
        EditComment(){
            updateMockBookComment(
                this.Form
            ).then(res=>{
                if(res.res_code==1){
                    this.$Message.success("更新评论成功!");
                    this.showModal=false;
                    this.$emit('EditMockBookCommentList');
                }
            })
        },
        //获取随机昵称
        handleGetNickname(){
            getMockRandomResource({
                type:1
            }).then(res=>{
                if(res.res_code==1){
                    this.Form.nickname=res.data.resource;
                }
            })
        },
        handleGetAvatar(){
            getMockRandomResource({
                type:2
            }).then(res=>{
                if(res.res_code==1){
                    this.Form.avatar_url=res.data.resource;
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
