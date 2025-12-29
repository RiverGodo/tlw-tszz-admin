<template>
  <div class="page-content  de-exam">
    <Breadcrumb separator=">">
      <BreadcrumbItem>图书管理</BreadcrumbItem>
      <BreadcrumbItem>评论列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchOption.state" style="width:100px" @on-change="getCommentList(true)">
            <Option v-for="item in stateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <!-- <Select v-model="searchOption.book_type" style="width:100px" @on-change="getCommentList(true)">
            <Option v-for="item in bookTypeList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select> -->
          <Input class="margin-left-10" v-model="searchOption.content" style="width: 400px;display:inline-table">
          <Select class="input-select" v-model="searchOption.type" slot="prepend" style="width: 100px">
            <Option value="nickname">用户昵称</Option>
            <Option value="book_name">图书名称</Option>
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
import Cookie from "js-cookie";
import {
  getCommentList,
  replyComment,
  updateCommentState
} from "@/api/bookComment";
export default {
  name: "book-comment-list",
  data() {
    return {
      showAddComment: false,
      backPath: "",
      category_id: -1,
      reply_comment: {},
      addCommentLoading: false,
      bookTypeList: [
        {
          state: -1,
          name: "选择类别"
        },
        {
          state: 2,
          name: "图书"
        },
        {
          state: 3,
          name: "课程"
        }
      ],
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
          name: "正常"
        },
        {
          state: 2,
          name: "置顶"
        }
      ],
      commentList: [],
      commentListLoading: false,
      commentCount: 0,
      searchOption: {
        book_id: -1,
        type: "book_name",
        content: "",
        nickname: "",
        book_name: "",
        comment_content: "",
        state: -1,
        page_index: 1,
        page_size: 20,
        page_size_opts: [20, 50, 100],
        book_type: 3
      },
      commentListDef: [
        {
          title: "ID",
          key: "comment_id",
          align: "center",
          width: 60
        },
        {
          title: "类别",
          key: "book_type",
          align: "center",
          width: 80,
          render: (h, params) => {
            let str = params.row.book_type == 2 ? "图书" : "课程";
            return h("span", str);
          }
        },
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
                    size: 'small'
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
          title: "图书名称",
          key: "book_name",
          minWidth: 200,
          align: "center"
        },
        {
          title: "评论内容",
          key: "comment_content",
          minWidth: 400,
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
            let rs = {};
            switch (state_arr[0].state) {
              case 0:
                rs = h(
                  "span",
                  {
                    style: {
                      color: "#ed3f14"
                    }
                  },
                  state_arr[0].name
                );
                break;
              case 1:
                rs = state_arr[0].name;
                break;
              case 2:
                rs = h(
                  "span",
                  {
                    style: {
                      color: "#00a874"
                    }
                  },
                  state_arr[0].name
                );
                break;
              default:
                break;
            }
            return h("span", rs);
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
                "Dropdown",
                {
                  props: {
                    placement:
                      params.index > this.commentList.length - 4
                        ? "top"
                        : "bottom",
                    trigger: "click"
                  },
                  on: {
                    "on-click": name => {
                      let arr = this.stateList.filter(e => e.state == name);
                      if (params.row.comment_state == name) {
                        this.$Modal.warning({
                          title: "提示信息",
                          content: "该评论已经是" + arr[0].name + "状态！"
                        });
                        return;
                      }
                      this.$Modal.confirm({
                        title: "提示信息",
                        content: "确认" + arr[0].name + "该评论吗？",
                        onOk: res => {
                          updateCommentState(params.row.comment_id, name).then(
                            res => {
                              if (res.res_code == 1) {
                                this.$Message.success(
                                  arr[0].name + "评论成功！"
                                );
                                this.getCommentList();
                              }
                            }
                          );
                        }
                      });
                    }
                  }
                },
                [
                  h(
                    "a",
                    {
                      attrs: {
                        href: "javascript:void(0)"
                      }
                    },
                    [
                      "设置状态",
                      h("Icon", {
                        props: {
                          type: "arrow-down-b"
                        }
                      })
                    ]
                  ),
                  h(
                    "DropdownMenu",
                    {
                      slot: "list",
                      style: {
                        width: "70px"
                      }
                    },
                    [
                      h(
                        "DropdownItem",
                        {
                          props: { name: "0" },
                          style: { width: "70px" }
                        },
                        "隐藏"
                      ),
                      h(
                        "DropdownItem",
                        {
                          props: { name: "1" },
                          style: { width: "70px" }
                        },
                        "正常"
                      ),
                      h(
                        "DropdownItem",
                        {
                          props: { name: "2" },
                          style: { width: "70px" }
                        },
                        "置顶"
                      )
                    ]
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //没有列表内容，则去获取
      if (this.$route.query.bid > 0) {
        this.searchOption.book_id = this.$route.query.bid;
      }
      this.getCommentList();
    },
    searchTypeChange(name) {
      this.searchOption.nickname = "";
      this.searchOption.book_name = "";
      this.searchOption.comment_content = "";
      switch (name) {
        case "nickname":
          this.searchOption.nickname = this.searchOption.content;
          break;
        case "book_name":
          this.searchOption.book_name = this.searchOption.content;
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
      getCommentList(this.searchOption)
        .then(res => {
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
        })
        .catch(error => {
          this.commentListLoading = false;
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
