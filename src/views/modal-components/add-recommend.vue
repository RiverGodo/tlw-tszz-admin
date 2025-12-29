<template>
    <Modal
        class="common-dialog add-comment-dialog"
        width="1000"
        v-model="showModal" 
        title="添加推荐课程">
        <div class="search-bar">
            <Input v-model="addBookCommendsearchOption.title" placeholder="请输入课程名称" style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
        </div>
        <Table :loading="addBookCommendListLoading" :columns="contentListDef" :data="addBookCommendList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
            <Col span="4">
                <Button :loading="addCommendLoading" type="primary" @click="addBookCommend">添加推荐</Button>
            </Col>
            <Col span="20" style="text-align:right">
                <Page style="text-align:right" show-total show-sizer :current="addBookCommendsearchOption.page_index" :total="addBookCommendCount" :page-size="addBookCommendsearchOption.page_size" :page-size-opts="addBookCommendsearchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
                </Page>
            </Col>
        </Row>
    </Modal>
</template>

<script>
import {setBookCommend}  from "@/api/book";
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
    name:"addRecommendModal",
    props:{
        isShow: {
            type: Boolean,
            default: false
        },
        subcom_info:{
            type:Object,
            default:true
        },
    },
    data (){
        return {
            showModal: false,
            addCommendLoading:false,
            book_id_arr: [],
            contentListDef:[
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "ID",
                    key: "book_id",
                    align: "center",
                    width: 100
                },
                {
                    title: '排序',
                    key: 'order_by',
                    align: 'center',
                    width: 60,
                },
                {
                    title: "课程名称",
                    key: "title",
                    align: "center"
                },
            ]
        }
    },
    computed: {
        ...mapState({
        addBookCommendsearchOption: state => state.addBookCommend.addBookCommendsearchOption,
        addBookCommendList: state => state.addBookCommend.addBookCommendList,
        addBookCommendListLoading: state => state.addBookCommend.addBookCommendListLoading,
        addBookCommendCount: state => state.addBookCommend.addBookCommendCount,
        }),
        all_book_id_arr() {
            let id_arr = [];
            let auth_arr = [];
            console.log(this.book_id_arr )
            this.book_id_arr.forEach(e => {
                id_arr.push(e.id)
                auth_arr.push(e.auth)
            });
            this.selectAuths = new Set([...auth_arr])
            console.log(this.selectAuths )
            return id_arr;
        },
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
        }
    },
    mounted(){
    
    },
    methods:{
        ...mapActions(["getAddBookRecommendList"]),
        init() {
        //没有列表内容，则去获取
        if (this.addBookCommendsearchOption.type == 3) {
            if (this.addBookCommendList.length == 0) {
                this.getAddBookRecommendList(this.book_id_arr);
            }
        } else {
            this.$store.commit("AddBookCommend_setSearchForm", { type: 3 });
            this.getAddBookRecommendList(this.book_id_arr);
        }
        },
         search(init) {
            if (init) {
                this.$store.commit("AddBookCommend_setPageIndex", 1);
                this.book_id_arr = [];
            }
            this.getAddBookRecommendList(this.book_id_arr);
        },
        pageIndexChange(page) {
            if (page != this.addBookCommendsearchOption.page_index) {
                this.$store.commit("AddBookCommend_setPageIndex", page);
                this.search();
            }
            },
            pageSizeChange(pageSize) {
            if (pageSize != this.addBookCommendsearchOption.page_size) {
                this.$store.commit("AddBookCommend_setPageSize", pageSize);
                this.search();
            }
        },
        selectChange(selection) {
            let arr = [];
            for (let index = 0; index < selection.length; index++) {
                const element = selection[index];
                const book_id=this.subcom_info.book_id;
                console.log(book_id);
                arr.push({
                    book_id:book_id,
                    relation_book_id: element.book_id,
                    subject_id:element.subject_id,
                    order_by:element.order_by,
                    is_commend:0
                })
            }
            this.book_id_arr = arr;
            console.log(this.book_id_arr)
            },
        addBookCommend(){
            if (this.all_book_id_arr.length == 0) {
                this.$Modal.warning({
                title: "提示信息",
                content: "请选择要添加的课程！"
                });
            }else{
                this.$Modal.confirm({
                title: "提示信息",
                content: "确认要添加吗？",
                onOk: () => {
                    this.addCommendLoading = true;
                    setBookCommend({
                       commend_arr:this.book_id_arr
                    }).then(res=>{
                        this.addCommendLoading = false;
                        if(res.res_code==1){
                            this.$Message.success("推荐课程添加成功！");
                            this.search();
                        }else{
                            this.$Message.success("推荐课程添加失败！");
                        }
                    })}
                });
            } 
        },
    }
}
</script>

<style scoped>
    
</style>
