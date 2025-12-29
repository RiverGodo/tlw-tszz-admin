<template>
  <div class="page-content  daily-english">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <BreadcrumbItem>文章管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchOption.type" style="width:100px" @on-change="search(true)">
            <Option v-for="item in articleTypeListSelect" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
          </Select>
          <Select class="margin-left-10" v-model="searchOption.state" style="width:100px" @on-change="search(true)">
            <Option v-for="item in stateListSelect" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Select class="margin-left-10" multiple v-model="searchOption.tags" style="width:100px" @on-change="search(true)">
            <Option v-for="item in articleTagListDef" :value="item.tag_id" :key="item.tag_id">{{ item.tag_name }}</Option>
          </Select>
          <div class="search-bar">
            <Input v-model="searchOption.name" placeholder="请输入文章标题..." style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          </div>
        </div>
        <div class="actions">
          <Dropdown @on-click="goAddArticlePage">
            <Button type="primary">
              创建文章
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="item in articleTypeList" :name="item.type_id" :key="item.type_id">{{ item.name }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前文章
          <span>{{articleCount}}</span>篇
          <span class="info">注：这里不显示专栏内专属文章</span>
        </p>
        <Table ref="articleList" :loading="articleListLoading" :columns="articleListDef" :data="articleList"></Table>
        <div class="bottom-bar">
          <Page show-total show-sizer :current="searchOption.page_index" :total="articleCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState, mapGetters } from "vuex";
import {
  setArticleState,
  deleteArticle
} from "@/api/daily-english/article";
export default {
  name: "article-list",
  data() {
    return {
      articleTagList: [],
      articleListDef: [
        {
          title: "ID",
          key: "product_id",
          align: "center",
          width: 60
        },
        {
          title: "封面/名称",
          key: "name",
          align: "left",
          minWidth: 350,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "img-title"
                }
              },
              [
                h("img", {
                  attrs: {
                    class: "img",
                    src: params.row.cover_img
                  }
                }),
                h(
                  "div",
                  {
                    attrs: {
                      class: "info"
                    }
                  },
                  [
                    h(
                      "div",
                      {
                        attrs: {
                          class: "title"
                        }
                      },
                      params.row.name
                    ),
                    h(
                      "div",
                      {
                        attrs: {
                          class: "time"
                        }
                      },
                      "创建时间: " +
                      moment(params.row.create_time).format("YYYY-MM-DD")
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "类别",
          key: "type",
          align: "center",
          width: 60,
          render: (h, params) => {
            let type_arr = this.articleTypeList.filter(
              e => e.type_id == params.row.type
            );
            return h("span", type_arr[0].name);
          }
        },
        {
          title: "实际价格",
          key: "price",
          align: "center",
          width: 80
        },
        {
          title: "原始价格",
          key: "original_price",
          align: "center",
          width: 80
        },
        {
          title: "阅读数",
          key: "read_count",
          align: "center",
          width: 80
        },
        {
          title: "评论数",
          key: "comment_count",
          align: "center",
          width: 80
        },
        {
          title: "状态",
          key: "state",
          align: "center",
          width: 60,
          render: (h, params) => {
            let state_arr = this.stateListSelect.filter(
              e => e.state == params.row.state
            );
            return h("span", state_arr[0].name);
          }
        },
        {
          title: "相关专栏",
          key: "comment_count",
          align: "center",
          minWidth: 130,
          render: (h, params) => {
            let str = "无";
            if (params.row.packages.length > 0) {
              str = "";
              str += ";" + params.row.packages.map(e => e.package_name);
              str = str.substr(1);
            }
            return h("span", str);
          }
        },
        {
          title: "相关练习",
          key: "comment_count",
          align: "center",
          width: 100,
          render: (h, params) => {
            let str = params.row.exercise_id > 0 ? "有" : "无";
            return h('span', str);
          }
        },
        {
          title: "相关标签",
          key: "tags",
          align: "center",
          width: 100,
          render: (h, params) => {
            let str = "无";
            if (params.row.tags.length > 0) {
              params.row.tags.forEach((e, i) => {
                if (i == 0) {
                  str = e.tag_name;
                } else {
                  str += " | " + e.tag_name;
                }
              });
            }
            return h('span', str);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "left",
          fixed: "right",
          width: 200,
          render: (h, params) => {
            var stateStr = params.row.state == 0 ? "上架" : "下架";
            var commentDisabled = params.row.comment_count == 0 ? true : false;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: commentDisabled
                  },
                  style: {
                    color: "#1975E0"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "DECommentManage",
                        query: {
                          aid: params.row.product_id
                        }
                      });
                    }
                  }
                },
                "查看评论"
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
                      this.$router.push({
                        path:
                          "/DailyEnglish/AddArticle/" +
                          params.row.type +
                          "?aid=" +
                          params.row.product_id
                      });
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
                      this.setArticleState(
                        params.row.product_id,
                        params.row.state
                      );
                    }
                  }
                },
                stateStr
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
                      this.delArticle(params.row.product_id);
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
  computed: {
    ...mapState({
      articleTypeList: state => state.deArticle.articleTypeList,
      articleTypeListSelect: state => state.deArticle.articleTypeListSelect,
      searchOption: state => state.deArticle.searchOption,
      articleList: state => state.deArticle.articleList,
      articleTagListDef: state => state.deArticle.articleTagList,
      articleListLoading: state => state.deArticle.articleListLoading,
      articleCount: state => state.deArticle.articleCount
    }),
    ...mapGetters(["stateListSelect", "articleTypeListSelect"])
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getArticleList", "getArticleTagList"]),
    init() {
      if (this.articleTagListDef.length == 0) {
        this.getArticleTagList();
      }
      //没有列表内容，则去获取
      if (this.articleList.length == 0) {
        this.getArticleList();
      }
    },
    goAddArticlePage(name) {
      this.$router.push({
        name: "DEAddArticle",
        params: {
          type: name
        }
      });
    },
    setArticleState(aid, state) {
      let str = state == 1 ? "下架" : "上架";
      let newState = state == 1 ? 0 : 1;
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该文章吗？",
        onOk: res => {
          setArticleState(aid, newState).then(res => {
            if (res.res_code == 1) {
              this.$Message.success("文章" + str + "成功！");
              this.getArticleList();
            } else {
              this.$Message.error("文章" + str + "失败！");
            }
          });
        }
      });
    },
    delArticle(aid) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认删除该文章吗？",
        onOk: res => {
          deleteArticle(aid).then(res => {
            if (res.res_code == 1) {
              this.$Message.success("文章删除成功！");
              this.getArticleList();
            } else {
              this.$Message.error("文章删除失败！");
            }
          });
        }
      });
    },
    search(init) {
      if (init) {
        this.$store.commit("setArticlePageIndex", 1);
      }
      this.getArticleList();
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("setArticlePageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("setArticlePageSize", pageSize);
        this.search();
      }
    }
  }
};
</script>
