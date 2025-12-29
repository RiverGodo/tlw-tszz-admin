<template>
    <Modal class="common-dialog  add-comment-dialog" :transfer="false" v-model="showModal" title="添加事件">
        <Form ref="addEventForm" :model="addEventForm" label-position="right" :label-width="80">
            <FormItem class="mb-0" label="事件名称" prop="event_name">
                <Input v-model="addEventForm.event_name" placeholder="请输入事件名称" class="inp-0"></Input>
            </FormItem>
          <FormItem class="mb-0" label="事件描述" prop="event_desc">
                <Input v-model="addEventForm.event_desc" placeholder="请输入事件描述" class="inp-0"></Input>
            </FormItem>
            <FormItem class="mb-0" label="渠道key" prop="channel_key">
                <Input v-model="addEventForm.channel_key" placeholder="请输入渠道key" class="inp-0"></Input>
            </FormItem>
            <FormItem class="mb-0" label="渠道名称" prop="channel_name">
                <Input v-model="addEventForm.channel_name" placeholder="请输入渠道名称" class="inp-0"></Input>
            </FormItem>
                <FormItem class="mb-0" label="添加时间" prop="create_time" >
                    {{date}}
                </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large"  @click="AddEvent()">添加</Button>
        </div>
    </Modal>
</template>

<script>
import moment from "moment";
import {addEvent} from '@/api/event-stat'

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
            addEventForm:{
                event_name:'',
                event_desc:'',
                channel_key:'',
                channel_name:''
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
       AddEvent(){
           addEvent(this.addEventForm).then(res=>{
                this.addEventForm.event_name='';
                this.addEventForm.avator_img='';
                this.addEventForm.channel_key='';
                this.addEventForm.channel_name='';
                if(res.res_code==1){
                    this.$Message.success("添加事件成功！");
                    this.showModal=false;
                    this.$emit('eventList');
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
    .mb-0{
margin-top:10px;
    }
    .inp-0{
        width:350px;
        
    }
    img {
        width:200px;
        padding-top:10px;
    }
</style>
