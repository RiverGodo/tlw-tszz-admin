<template>
    <Modal class="common-dialog "  v-model="showModal" title="查看虚拟评论">
        <div class="list">
            <div class="actions">
                <Button type="primary" icon="android-add" @click="addMockBookComment">添加评论</Button>
            </div>
            <Table ref="commentList" height="600" :loading="commentListLoading" :columns="commentListDef" :data="commentlist"></Table>
        </div>
        <!-- 添加评论弹出框 -->
        <add-comment-modal :isShow="showAddCommentDialog" :commentlist="commentlist" :data1="data1" @MockBookCommentList="getComment" :bookList="bookList" @closeModal="showAddCommentDialog=false"></add-comment-modal>
        <!-- 编辑评论弹出框 -->
        <edit-comment-modal :isShow="showEditCommentDialog" :editForm="editForm" :commentlist="commentlist" :data1="data1" :data2="data2" @EditMockBookCommentList="getComment" :bookList="bookList" @closeModal="showEditCommentDialog=false"></edit-comment-modal>
    </Modal>
</template>
<script>
import { getMockBookCommentList,deleteMockBookComment } from "@/api/bookComment";
import addCommentModal from "../modal-components/add-comment";
import editCommentModal from "../modal-components/edit-comment";
import moment from "moment";
export default {
  name: "checkBookCommentModal",
  components:{
      addCommentModal,
      editCommentModal
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    bookList: {
      type: Array,
      required: true
    },
    commentlist: {
      type: Array,
      required: true
    },
    addcomment:{
       type: Object,
       required: true 
    }
  },
  data() {
    return {
      data1:{},
      data2:{},
      btnDisabled: false,
      showModal: false,
      commentListLoading: false,
      showAddCommentDialog:false,
      showEditCommentDialog:false,
      editForm:{},
      book_id: "",
      commentListDef: [
        {
          title: "头像/昵称",
          key: "nickname",
          width: 160,
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
                    src: params.row.avatar_url,
                    size: "small"
                  }
                }),
                h(
                  "div",
                  {
                    attrs: {
                      class: "nickname",
                      title: params.row.nickname
                    }
                  },
                  params.row.nickname
                )
              ]
            );
          }
        },
        {
          title: "评论内容",
          key: "content",
          minWidth: 400,
          align: "center"
        },
        {
          title: "评论时间",
          key: "comment_time",
          width: 100,
          align: "center",
          render: (h, params) => {
            let str = params.row.comment_time
              ? moment(params.row.comment_time).format("YYYY-MM-DD HH:mm")
              : "无";
            return h("span", str);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "left",
          fixed: "right",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0"
                  },
                  on: {
                    click: () => {
                    //编辑
                    this.handleEditComment(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0"
                  },
                  on: {
                    click: () => {
                    //删除
                    this.handleDeleteComment(params.row.mock_id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
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
  mounted() {
    
  },
  methods: {
    //添加评论
    addMockBookComment(){
        this.data1=this.addcomment;
        console.log(this.data1);
        this.showAddCommentDialog=true;
    },
    //删除评论
    handleDeleteComment(mock_id){
        this.data1.mock_id=mock_id;
        this.$Modal.confirm({
            title: "提示信息",
            content: "确认要删除吗？",
            onOk: () => {
                deleteMockBookComment({
                    mock_id:mock_id
                }).then(res=>{
                    if(res.res_code==1){
                        this.$Message.success("删除评论成功！");
                    }
                    this.getComment();
                })
            }
        });
    },
    //获取模拟评论列表
    getComment(){
        getMockBookCommentList({
            book_id:this.data1.book_id,
            state:this.data1.state,
        }).then(res=>{
              this.commentlist=res.data.list;
            })
    },
    //编辑评论
    handleEditComment(row){
      this.data1=this.addcomment;
      this.data2=row;
      this.editForm=row;
      this.showEditCommentDialog=true;
    }
  }
};
</script>

<style lang="less">
.actions {
  flex: 1;
  text-align: right;
}
.list {
      margin-top: 20px;
      .list-info {
        margin-bottom: 10px;
        font-size: 14px;
        color: #8c9095;
        line-height: 20px;
        .ivu-icon {
          margin-right: 5px;
          color: #00a874;
        }
        span {
          color: #00a874;
        }
        .info {
          font-size: 12px;
          color: #aaa;
        }
      }
      .ivu-table {
        td {
          height: 40px;
        }
        .ivu-table-cell {
          padding: 0 5px;
          .avatar-title {
            height: 50px;
            display: flex;
            align-items: center;
            padding: 5px;
            .img {
              flex: 0 0 40px;
              height: 40px;
              background: #eee;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .nickname {
              flex: 1;
              font-size: 14px;
              margin-left: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .img-title {
            display: flex;
            padding: 5px;
            .img {
              flex: 0 0 110px;
              width: 110px;
              height: 66px;
              margin-right: 5px;
            }
            .info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: left;
              .title {
                font-size: 14px;
              }
              .time {
                font-size: 12px;
                opacity: 0.5;
              }
            }
          }
        }
      }
      .bottom-bar {
        margin-top: 10px;
        .ivu-btn-ghost {
          &:hover {
            color: #d0021b;
            background-color: transparent;
            border-color: #d0021b;
          }
        }
        .ivu-page {
          text-align: right;
        }
      }
    }

</style>


