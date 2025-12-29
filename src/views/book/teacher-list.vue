<template>
    <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>教师列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
        </div>
        <div class="actions">
            <Button type="primary" icon="android-add" @click="showAddTeacherDialogFun">添加教师</Button>
        </div>
      </div>
      <div class="list">
          <p class="list-info">
            <Icon type="ios-book"></Icon>当前教师&nbsp;（
            <span>{{teacherCount}}</span>）&nbsp;名&nbsp;
          </p>
        <Table ref="teacherList" :loading="teacherListLoading" :columns="teacherListDef" :data="teacherList"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">
          </Col>
          <Col span="20" style="text-align:right">
            <Page show-total show-sizer :current="searchOption.page_index" :total="teacherCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
            </Page>
          </Col>
        </Row>
      </div>
    </Card>
    <add-teacher-modal :is-show="showAddTeacherDialog" @TeacherList="getTeacherList" @closeModal="showAddTeacherDialog=false"></add-teacher-modal>
    <edit-teacher-modal :is-show="showEditTeacherDialog" :addTeacherForm="addTeacherForm" @TeacherList="getTeacherList" @closeModal="showEditTeacherDialog=false"></edit-teacher-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import addTeacherModal from "../modal-components/add-teacher";
import editTeacherModal from "../modal-components/edit-teacher";
import {deleteTeacher} from "@/api/teacher";
import moment from "moment";
export default {
    name:"teacher-list",
    components:{
      addTeacherModal,
      editTeacherModal
    },
    data(){
        return {
            showAddTeacherDialog:false,
            showEditTeacherDialog:false,
            addTeacherForm:{},
            teacherListDef:[
                {
                    title: "ID",
                    key: "id",
                    align: "center",
                    width: 90,
                },
                {
                    title: "头像/讲师",
                    key: "teacher_name",
                    width: 260,
                    align: "left",
                    render: (h, params) => {
                        return h(
                        "div",
                        {
                            attrs: {
                            class: "avatar-title"
                            }
                        },
                        [
                            h("Avatar", {
                            attrs: {
                                class: "img"
                            },
                            props: {
                                src: params.row.avator_img,
                                size: 'small',
                            }
                            }),
                            h(
                            "div",
                            {
                                attrs: {
                                class: "nickname",
                                title: params.row.teacher_name
                                }
                            },
                            params.row.teacher_name
                            )
                        ]
                        );
                    }
                },
                {
                    title: "添加时间",
                    key: "create_time",
                    align: "center",
                    render: (h, params) => {
                        return h(
                        "span",
                        moment(params.row.create_time).format("YYYY-MM-DD")
                        );
                }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right',
                    width: 120,
                    align: "center",
                    render:(h,params)=>{
                        let arr=[
                            h ("Button",
                            {
                                props:{
                                    type: "text",
                                    size: "small"
                                },
                                style: {
                                    color: "#1975E0"
                                },
                                on: {
                                    click: () => {
                                        this.delTeacher(params.row.id);
                                    }
                                }
                            },"删除"),
                            h ("Button",
                            {
                                props:{
                                    type: "text",
                                    size: "small"
                                },
                                style: {
                                    color: "#1975E0"
                                },
                                on: {
                                    click: () => {
                                        this.editTeacher(params.row.id);
                                        this.addTeacherForm=params.row;
                                        console.log(this.addTeacherForm)
                                    }
                                }
                            },"编辑")
                        ];
                        return h("div", arr);
                    }
                },
            ]
        }
    },
    computed:{
        ...mapState({
            teacherList: state => state.teacher.teacherList,
            searchOption: state => state.teacher.searchOption,
            teacherListLoading: state => state.teacher.teacherListLoading,
            teacherCount: state => state.teacher.teacherCount,
        }),
    },
    mounted() {
        this.init();
    },
    methods:{
        ...mapActions(["getTeacherList"]),
        init() {
            if (this.teacherList.length == 0) {
                this.getTeacherList();
            }
        },
        search(init) {
            if (init) {
                this.$store.commit("Teacher_setPageIndex", 1);
            }
            this.getTeacherList();
        },
        showAddTeacherDialogFun(){
            this.showAddTeacherDialog=true;
        },
        pageIndexChange(page){
            if (page != this.searchOption.page_index) {
                this.$store.commit("Teacher_setPageIndex", page);
                this.search();
            }
        },
        pageSizeChange(pageSize) {
            if (pageSize != this.searchOption.page_size) {
                this.$store.commit("Teacher_setPageSize", pageSize);
                this.search();
            }
        },
        delTeacher(teacher_id){
            this.$Modal.confirm({
            title: "提示信息",
            content: "确认要删除吗？",
            onOk: () => {
                deleteTeacher({
                    teacher_id:teacher_id
                }).then(res=>{
                    if(res.res_code==1){
                        this.$Message.success("删除教师成功！");
                    }
                    this.getTeacherList();
                })
            }
        });
        },
        editTeacher(teacher_id){
            this.showEditTeacherDialog=true;
        }
    }
}
</script>

<style>
    .img img {
        border-radius: 50%
    }
</style>
