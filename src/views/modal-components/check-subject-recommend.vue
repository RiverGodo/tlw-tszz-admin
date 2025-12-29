<template>
    <Modal
        class="common-dialog"
        width="1000"
        v-model="showModal"
        title="推荐课程">
        <Table :loading="contentListLoading" :columns="contentListDef" :data="recommendlist" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">
            <Button :loading="delRecommendLoading" type="ghost" @click="handleDelRecommend">删除</Button>
            <Button v-if="!showChangeNum" size="small" type="info" @click="showChangeNum = true" style="margin-left:10px;">修改序号</Button>
            <div v-if="showChangeNum" style="margin-top:5px;">
                <Button :loading="changeNumLoading" size="small" @click="cancelChangeNum">取消</Button>
                <Button :loading="changeNumLoading" size="small" type="primary" @click="changeNum">保存</Button>
            </div>
          </Col>
        </Row>
    </Modal>
</template>

<script>
import {getBookCommendList,setBookCommend,delBookCommend}  from "@/api/book";
import moment from "moment";
export default {
    name:"checkSubjectRecommend",
    components:{
      
    } ,
    data(){
        return{
            showModal:false,
            contentListLoading:false,
            showChangeNum:false,
            changeNumLoading:false,
            delRecommendLoading:false,
            book_id:0,
            book_id_arr: [],
            newOrderList:[],
            orderList:[],
            contentListDef:[
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "ID",
                    key: "book_commend_id",
                    align: "center",
                    width: 100
                },
                {
                    title: '排序',
                    key: 'order_by',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        if (this.showChangeNum) {
                        return h("Input", {
                            props: {
                            value: params.row.order_by,
                            size: "small"
                            },
                            on: {
                                "on-change": v => {
                                    for (let e of this.recommendlist) {                                 
                                        if (e.book_commend_id == params.row.book_commend_id) {
                                            e.order_by = Number(v.target.value);
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                        } else {
                        return h('span', params.row.order_by)
                        }

                    }
                },
                {
                    title: "课程名称",
                    key: "title",
                    align: "center"
                },
            ]
        }
    },
    props: {
        isShow: {
        type: Boolean,
        default: false
        },
        subject_id:{
            type:Number,
            default:0
        },
        recommendlist:{
            type:Array,
            default:true
        },
        subcom_info:{
            type:Object,
            default:true
        }
  },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = true
            }
        },
        showModal(val) {
            if (!val) {
                this.$emit('closeModal')
            }
        }
    },
    mounted(){  
    },
    computed:{
        all_book_id_arr() {
            let id_arr = [];
            this.book_id_arr.forEach(e => {
                id_arr.push(e.id)
            });
            return id_arr;
        }
    },
    methods:{
        //获取图书推荐列表(科目id,图书id))
        getCommendList(){
            getBookCommendList({
                subject_id:this.subcom_info.subject_id,
                book_id:this.subcom_info.book_id
            }).then(res=>{
                if(res.res_code==1){
                this.recommendlist=res.data;
                this.orderList = [];
                res.data.forEach(e => {
                    let o = {
                    subject_id: e.subject_id,
                    order_by: e.order_by
                    };
                    this.orderList.push(o);
                }, this);  
                console.log(this.orderList);
                this.newOrderList = JSON.parse(JSON.stringify(this.orderList));
                }
            })
        },
        //修改序号点击取消的时候
        cancelChangeNum(){
            console.log(this.recommendlist)
            let arr = [];
            this.recommendlist.map(item => arr.push({ subject_id: item.subject_id, num: item._index }))
            this.orderList = arr
            this.showChangeNum = false
        },
        //修改序号点击保存
        changeNum() {
            this.newOrderList = JSON.parse(JSON.stringify(this.recommendlist));
            console.log(this.newOrderList)
            this.recommendlist.setid=this.subcom_info.book_id;
            this.subcom_info.book_id;
            let commend_arr = this.recommendlist.map((item)=>{
                return {book_id: this.subcom_info.book_id,subject_id:item.subject_id,order_by:item.order_by,book_commend_id:item.book_commend_id,relation_book_id:item.relation_book_id,is_commend:item.is_commend};
            });
            console.log(commend_arr);
            console.log(this.recommendlist)
                this.changeNumLoading = true;
                setBookCommend({
                    commend_arr
                }).then(res=>{
                    this.changeNumLoading = false;
                    this.showChangeNum = false;
                    if(res.res_code==1){  
                        this.getCommendList();
                        this.$Message.success("资源排序修改成功！");
                    }else{
                        this.$Message.error("资源排序修改失败！");
                    }
                })
        },
        //选中项触发事件
        selectChange(selection) {
            let arr = [];
            for (let index = 0; index < selection.length; index++) {
                const element = selection[index];
                arr.push({
                    id: element.book_commend_id
                })
            }
            this.book_id_arr = arr;
            console.log(this.book_id_arr)
        },
        //删除图书推荐
        handleDelRecommend(){
            console.log(this.all_book_id_arr)
            if (this.all_book_id_arr.length == 0) {
                this.$Modal.warning({
                title: "提示信息",
                content: "请选择要删除的课程！"
                });
            }else {
                this.$Modal.confirm({
                    title: "提示信息",
                    content: "确认要删除吗？",
                    onOk: () => {
                        this.delRecommendLoading = true;
                        delBookCommend(this.all_book_id_arr).then(res => {
                            console.log(this.all_book_id_arr)
                        this.delRecommendLoading = false;
                        if (res.res_code == 1) {
                            this.getCommendList();
                            this.$Message.success("删除课程成功！");
                        } else {
                            this.$Message.error("删除课程失败！");
                        }
                        });
                    }
                });
            }
        }
    },
    
}
</script>

<style>

</style>
