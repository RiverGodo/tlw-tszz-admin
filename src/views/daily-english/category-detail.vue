<style lang="less">
.de-category-detail {
  .category-info {
    display: flex;
    box-sizing: border-box;
    border: 1px solid #ddd;
    background: #eee;
    padding: 20px;
    margin-bottom: 30px;
    .category-img {
      flex: 0 0 220px;
      width: 220px;
      height: 132px;
    }
    .info {
      flex: 1;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      h2 {
        font-size: 18px;
        flex: 0 0 25px;
        span {
          color: #f5a623;
        }
      }
      .short_desc {
        flex: 1;
        opacity: 0.8;
        font-size: 14px;
      }
      .all-counts {
        padding-bottom: 6px;
        flex: 0 0 20px;
        font-size: 14px;
        span {
          margin-left: 20px;
        }
      }
    }
    .actions {
      flex: 0 0 200px;
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 14px;
      .state {
        padding-right: 10px;
      }
      .btns {
        .ivu-btn {
          color: #2d8cf0;
          font-size: 14px;
          padding: 6px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
<template>
    <div class="page-content daily-english de-exam-list">
        <Breadcrumb separator=">">
            <BreadcrumbItem>每日英语</BreadcrumbItem>
            <BreadcrumbItem to="/DailyEnglish/CategoryManage">专栏管理</BreadcrumbItem>
            <BreadcrumbItem>专栏详情</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow class="de-category-detail">
            <div class="category-info">
                <img class="category-img" :src="categoryDetail.cover_img">
                <div class="info">
                    <div class="title">
                        <h2>{{categoryDetail.name}}<span>({{categoryDetail.package_category_name}})</span></h2>
                    </div>
                    <div class="short_desc">
                        {{categoryDetail.short_desc}}
                    </div>
                    <div class="price">
                        <span>实际价格: {{categoryDetail.price}}</span>
                        <span style="margin-left: 20px">原始价格: {{categoryDetail.original_price}}</span>
                    </div>
                    <div class="all-counts">
                        更新期数: {{categoryDetail.product_count}}
                        <span>订阅量: {{categoryDetail.subscribe_count}}</span>
                        <!-- <span>文章点击量: 3</span> -->
                    </div>
                </div>
                <div class="actions">
                    <div class="state">{{categoryDetail.state == 1 ? "已上架" : "已下架"}} | 更新中</div>
                    <div class="btns">
                        <Button type="text" @click="goAddCategoryPage(categoryDetail.package_id)">编辑</Button>
                        <Button type="text" @click="SetCategoryState(categoryDetail.state)">{{categoryDetail.state == 1 ? "下架" : "上架"}}</Button>
                        <Button type="text" @click="delCategory">删除</Button>
                    </div>
                </div>
            </div>
            <div class="top-bar">
                <div class="options">
                    <Select v-model="searchOption.type" style="width:100px"
                        @on-change="search(true)">
                        <Option v-for="item in articleTypeListSelect" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
                    </Select>
                    <Select class="margin-left-10" v-model="searchOption.state" style="width:100px"
                        @on-change="search(true)">
                        <Option v-for="item in stateListSelect" :value="item.state" :key="item.state">{{ item.name }}</Option>
                    </Select>                    
                      <Input class="margin-left-10" v-model="searchOption.name" placeholder="请输入文章标题..." style="width: 200px"></Input>
                      <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
                </div>
                <div class="actions">
                    <Button type="ghost" @click="showArticleListDialog = true">
                        选择已有文章
                    </Button>
                    <Dropdown @on-click="goAddArticlePage">
                        <Button type="primary">
                            创建文章
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="item in articleTypeList" :name="item.type_id" :key="item.type_id" >{{ item.name }}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div class="list">
                <p class="list-info"><Icon type="ios-book"></Icon>当前文章<span>{{articleCount}}</span>篇</p>
                <Table 
                ref="articleList" 
                :loading="articleListLoading" 
                :columns="articleListDef" 
                :data="articleList"></Table>
                <div class="bottom-bar">
                  <Page 
                    show-total 
                    show-sizer
                    :current="searchOption.page_index"
                    :total="articleCount"
                    :page-size="searchOption.page_size" 
                    :page-size-opts="searchOption.page_size_opts" 
                    @on-page-size-change="pageSizeChange" 
                    @on-change="pageIndexChange" >
                  </Page> 
                </div>
            </div>
        </Card>
        <article-list-modal 
            :is-show="showArticleListDialog"
            :category-id="searchOption.category_id"
            @closeModal="showArticleListDialog=false"
            @refreshList="search">
        </article-list-modal>
    </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState, mapGetters } from "vuex";
import {
  setCategoryState,
  delPackage,
  setProductCanSingleBuy,
  delArticleFromCategory,
  cancelProductCanSingleBuy
} from "@/api/daily-english/category";
import { setArticleState, updateArticle } from "@/api/daily-english/article";
import articleListModal from "../modal-components/article-list";
export default {
  name: "category-detail",
  components: {
    articleListModal
  },
  data() {
    return {
      showArticleListDialog: false,
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
            if (!this.articleTypeList) return "";
            let type_arr = this.articleTypeList.filter(
              e => e.type_id == params.row.type
            );
            return h("span", type_arr[0].name);
          }
        },
        {
          title: "阅读数",
          key: "read_count",
          align: "center",
          width: 80
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
          title: "是否单卖",
          key: "is_can_single_buy",
          align: "center",
          width: 60,
          render: (h, params) => {
            let str = params.row.is_can_single_buy == 1 ? "是" : "否";
            return h("span", str);
          }
        },
        {
          title: "相关专栏",
          key: "comment_count",
          align: "center",
          width: 100,
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
            return h("span", str);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "left",
          width: 200,
          render: (h, params) => {
            var stateStr = params.row.state == 0 ? "上架" : "下架";
            let str =
              params.row.is_can_single_buy == 1 ? "取消单卖" : "设置单卖";
            let tryWatch = params.row.is_try_view < 0 ? "设置试看" : "取消试看";
            if (params.row.is_can_single_buy == 1) {
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
                        this.$router.push({
                          name: "DECommentManage",
                          query: {
                            aid: params.row.product_id,
                            cid: this.searchOption.category_id
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
                          path: "/DailyEnglish/AddArticle/" + params.row.type,
                          query: {
                            aid: params.row.product_id,
                            cid: this.categoryDetail.package_id
                          }
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
                        this.setArticleSingleBuyState(
                          params.row.product_id,
                          params.row.is_can_single_buy
                        );
                      }
                    }
                  },
                  str
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
            } else {
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
                        this.$router.push({
                          name: "DECommentManage",
                          query: {
                            aid: params.row.product_id,
                            cid: this.searchOption.category_id
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
                          path: "/DailyEnglish/AddArticle/" + params.row.type,
                          query: {
                            aid: params.row.product_id,
                            cid: this.categoryDetail.package_id
                          }
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
                        this.setArticleSingleBuyState(
                          params.row.product_id,
                          params.row.is_can_single_buy
                        );
                      }
                    }
                  },
                  str
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
                        // console.log(params.row);
                        this.handleTryWatch(params.row);
                      }
                    }
                  },
                  tryWatch
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
        }
      ]
    };
  },
  computed: {
    ...mapState({
      articleTypeList: state => state.deArticle.articleTypeList,
      searchOption: state => state.deCategory.articleSearchOption,
      articleList: state => state.deCategory.articleList,
      articleListLoading: state => state.deCategory.articleListLoading,
      articleCount: state => state.deCategory.articleCount,
      categoryDetail: state => state.deCategory.categoryDetail,
      categoryDetailLoading: state => state.deCategory.categoryDetailLoading
    }),
    ...mapGetters(["stateListSelect", "articleTypeListSelect"])
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getCategoryDetail", "getCategoryArticleList"]),
    init() {
      //没有列表内容，则去获取
      if (this.$route.params.cid > 0) {
        this.getCategoryDetail(this.$route.params.cid);
        this.searchOption.category_id = this.$route.params.cid;
        this.search();
      }
    },
    /**
      设置试看
      @augments Object payload
     */
    handleTryWatch(payload) {
      payload.is_try_view > 0
        ? (payload.is_try_view = -1)
        : (payload.is_try_view = 1);
      let str = payload.is_try_view > 0 ? "设置观看" : "取消观看";
      // console.log(payload)
      payload.article_id = payload.product_id;
      updateArticle(payload)
        .then(res => {
          if (res.res_code == 1) {
            this.$Message.success("文章" + str + "成功！");
            this.search();
          } else {
            this.$Message.error("文章" + str + "失败！");
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    search(init) {
      if (init) {
        this.$store.commit("setCategoryArticlePageIndex", 1);
      }
      this.getCategoryArticleList();
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
              this.search();
            } else {
              this.$Message.error("文章" + str + "失败！");
            }
          });
        }
      });
    },
    setArticleSingleBuyState(aid, state) {
      let str = state == 1 ? "取消单卖" : "设置单卖";
      let newState = state == 1 ? 0 : 1;
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该文章吗？",
        onOk: res => {
          if (newState == 1) {
            setProductCanSingleBuy(this.searchOption.category_id, aid).then(
              res => {
                if (res.res_code == 1) {
                  this.$Message.success("文章" + str + "成功！");
                  this.search();
                } else {
                  this.$Message.error("文章" + str + "失败！");
                }
              }
            );
          } else {
            cancelProductCanSingleBuy(this.searchOption.category_id, aid).then(
              res => {
                if (res.res_code == 1) {
                  this.$Message.success("文章" + str + "成功！");
                  this.search();
                } else {
                  this.$Message.error("文章" + str + "失败！");
                }
              }
            );
          }
        }
      });
    },
    SetCategoryState(state) {
      let str = state == 1 ? "下架" : "上架";
      let newState = state == 1 ? 0 : 1;
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该专栏吗？",
        onOk: res => {
          setCategoryState(this.searchOption.category_id, newState).then(
            res => {
              if (res.res_code == 1) {
                this.$Message.success("专栏" + str + "成功！");
                this.getCategoryDetail(this.searchOption.category_id);
              } else {
                this.$Message.error("专栏" + str + "失败！");
              }
            }
          );
        }
      });
    },
    delArticle(aid) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认删除该文章吗？",
        onOk: res => {
          delArticleFromCategory(this.searchOption.category_id, aid).then(
            res => {
              if (res.res_code == 1) {
                this.search();
                this.$Message.success("文章删除成功！");
              } else {
                this.$Message.error("文章删除失败！");
              }
            }
          );
        }
      });
    },
    delCategory() {
      if (this.categoryDetail.product_count > 0) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请先删除专栏内全部文章！"
        });
      } else {
        this.$Modal.confirm({
          title: "提示信息",
          content: "确认删除该专栏吗？",
          onOk: res => {
            delPackage(this.searchOption.category_id).then(res => {
              if (res.res_code == 1) {
                this.$store.commit("clearCategoryList");
                this.$router.go(-1);
                this.$Message.success("专栏删除成功！");
              } else {
                this.$Message.error("专栏删除失败！");
              }
            });
          }
        });
      }
    },
    goAddArticlePage(name) {
      this.$router.push({
        path: "/DailyEnglish/AddArticle/" + name,
        query: {
          cid: this.categoryDetail.package_id
        }
      });
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("setCategoryArticlePageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("setCategoryArticlePageSize", pageSize);
        this.search();
      }
    },
    goAddCategoryPage(c_id) {
      this.$router.push({
        name: "DEAddCategory",
        query: {
          cid: c_id
        }
      });
    }
  }
};
</script>
