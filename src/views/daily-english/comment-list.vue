<template>
  <div class="page-content daily-english de-exam">
    <Breadcrumb separator=">">
      <BreadcrumbItem v-if="searchOption.article_id < 0">首页</BreadcrumbItem>
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <template v-if="category_id >0">
        <BreadcrumbItem :to="backPath">专栏详情</BreadcrumbItem>
      </template>
      <template v-else>
        <BreadcrumbItem v-if="searchOption.article_id >0" to="/DailyEnglish/ArticleManage">文章管理</BreadcrumbItem>
      </template>
      <BreadcrumbItem>评论管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchOption.state" style="width:100px" @on-change="getCommentList(true)">
            <Option v-for="item in stateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Input class="margin-left-10" v-model="searchOption.content" style="width: 400px;display:inline-table">
          <Select class="input-select" v-model="searchOption.type" slot="prepend" style="width: 100px">
            <Option value="nickname">用户昵称</Option>
            <Option value="product_name">文章名称</Option>
            <Option value="comment_content">评论内容</Option>
          </Select>
          </Input>
          <Button type="primary" style="margin:1px 0 0 10px;" class="btn_search" icon="ios-search" @click="getCommentList(true)">查询</Button>
        </div>
        <div class="actions">

        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前评论（
          <span>{{commentCount}}</span>）</p>
        <Table ref="commentList" :loading="commentListLoading" :columns="commentListDef" :data="commentList"></Table>
        <div class="bottom-bar">
          <Page show-total show-sizer :current="searchOption.page_index" :total="commentCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
        </div>
      </div>
    </Card>
    <Modal class="common-dialog daily-english add-comment" v-model="showAddComment" title="管理员回复">
      <Input v-model="reply_comment.reply_comment" type="textarea" :rows="4" placeholder="请输入回复内容..." />
      <p style="text-align:right">尽量输入100字以内</p>
      <div slot="footer">
        <Button type="primary" size="large" :loading="addCommentLoading" @click="replyComment()">回复</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import {
  getCommentList,
  replyComment,
  hiddenOrShowComment
} from "@/api/daily-english/comment";
export default {
  name: "comment-list",
  data() {
    return {
      showAddComment: false,
      backPath: "",
      category_id: -1,
      reply_comment: {},
      addCommentLoading: false,
      stateList: [
        {
          state: -1,
          name: "选择状态"
        },
        {
          state: 0,
          name: "隐藏"
        },
        {
          state: 1,
          name: "显示"
        }
      ],
      commentList: [],
      commentListLoading: false,
      commentCount: 0,
      searchOption: {
        article_id: -1,
        type: "product_name",
        content: "",
        nickname: "",
        product_name: "",
        comment_content: "",
        state: -1,
        page_index: 1,
        page_size: 10,
        page_size_opts: [10, 20, 50, 100]
      },
      commentListDef: [
        {
          title: "ID",
          key: "comment_id",
          align: "center",
          width: 60
        },
        {
          title: "头像/昵称",
          key: "nickname",
          minWidth: 160,
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
                    size: 'small'
                  }
                }),
                h(
                  "div",
                  {
                    attrs: {
                      class: "nickname"
                    }
                  },
                  params.row.nickname
                )
              ]
            );
          }
        },
        {
          title: "类别",
          key: "product_type",
          align: "center",
          width: 60,
          render: (h, params) => {
            let type_arr = this.articleTypeListDef.filter(
              e => e.type_id == params.row.product_type
            );
            return h("span", type_arr[0].name);
          }
        },
        {
          title: "资源名称",
          key: "product_name",
          width: 200,
          align: "center"
        },
        {
          title: "评论内容",
          width: 300,
          key: "comment_content",
          align: "center"
        },
        {
          title: "评论时间",
          key: "comment_time",
          width: 120,
          align: "center",
          render: (h, params) => {
            let str = params.row.comment_time
              ? moment(params.row.comment_time).format("YYYY-MM-DD HH:mm")
              : "无";
            return h("span", str);
          }
        },
        {
          title: "回复内容",
          key: "reply_comment",
          width: 200,
          align: "center",
          render: (h, params) => {
            let str = params.row.reply_comment
              ? params.row.reply_comment
              : "无";
            return h("span", str);
          }
        },
        {
          title: "回复时间",
          key: "reply_time",
          width: 120,
          align: "center",
          render: (h, params) => {
            let str = params.row.reply_time
              ? moment(params.row.reply_time).format("YYYY-MM-DD HH:mm")
              : "无";
            return h("span", str);
          }
        },
        {
          title: "状态",
          key: "comment_state",
          width: 80,
          align: "center",
          render: (h, params) => {
            let state_arr = this.stateList.filter(
              e => e.state == params.row.comment_state
            );
            return h("span", state_arr[0].name);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "left",
          fixed: "right",
          width: 100,
          render: (h, params) => {
            var stateStr = params.row.comment_state == 0 ? "显示" : "隐藏";
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
                      this.reply_comment.comment_id = params.row.comment_id;
                      this.reply_comment.reply_comment = params.row
                        .reply_comment
                        ? params.row.reply_comment
                        : "";
                      this.showAddComment = true;
                    }
                  }
                },
                "回复"
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
                      this.setCommentState(
                        params.row.comment_id,
                        params.row.comment_state
                      );
                    }
                  }
                },
                stateStr
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      articleTypeListDef: state => state.deArticle.articleTypeList
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //没有列表内容，则去获取
      if (this.$route.query.aid > 0) {
        this.searchOption.article_id = this.$route.query.aid;
      }
      if (this.$route.query.cid > 0) {
        this.category_id = this.$route.query.cid;
        this.backPath = "/DailyEnglish/CategoryDetail/" + this.category_id;
      }
      this.getCommentList();
    },
    searchTypeChange(name) {
      this.searchOption.nickname = "";
      this.searchOption.product_name = "";
      this.searchOption.comment_content = "";
      switch (name) {
        case "nickname":
          this.searchOption.nickname = this.searchOption.content;
          break;
        case "product_name":
          this.searchOption.product_name = this.searchOption.content;
          break;
        case "comment_content":
          this.searchOption.comment_content = this.searchOption.content;
          break;
        default:
          break;
      }
    },
    getCommentList(init) {
      if (init) {
        this.searchOption.page_index = 1;
      }
      this.searchTypeChange(this.searchOption.type);
      this.commentListLoading = true;
      getCommentList(this.searchOption).then(res => {
        this.commentListLoading = false;
        if (res.res_code == 1) {
          this.commentCount = res.msg.total_count;
          this.commentList = [];
          res.msg.comments.map(e => {
            if (e) {
              this.commentList.push(e);
            }
          });
        }
      });
    },
    replyComment() {
      if (this.reply_comment.reply_comment == "") {
        this.$Message.warning("请输入回复内容！");
      }
      if (this.reply_comment.reply_comment.length > 100) {
        this.$Message.warning("请限制回复内容到100字以内！");
      }
      replyComment(
        this.reply_comment.comment_id,
        this.reply_comment.reply_comment
      ).then(res => {
        if (res.res_code == 1) {
          this.showAddComment = false;
          this.$Message.success("回复成功！");
          this.getCommentList();
        }
      });
    },
    setCommentState(cid, state) {
      let str = state == 0 ? "显示" : "隐藏";
      let newState = state == 0 ? 1 : 0;
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该评论吗？",
        onOk: res => {
          hiddenOrShowComment(cid, newState).then(res => {
            if (res.res_code == 1) {
              this.$Message.success(str + "评论成功！");
              this.getCommentList();
            }
          });
        }
      });
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.searchOption.page_index = page;
        this.getCommentList();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.searchOption.page_size = pageSize;
        this.getCommentList();
      }
    }
  }
};
</script>
