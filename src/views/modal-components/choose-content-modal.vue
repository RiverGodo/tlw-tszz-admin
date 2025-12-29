<template>
  <div class="choose-content-modal">
    <Modal class="choose-content-modal-window" v-model="showProductList" :title="title" width="800" @on-ok="confirm" @on-cancel="showProductList = false">
      <div>
        <div class="search-bar" style="margin-bottom: 20px;" v-if="app_id!=3&&currentType == 2">
          <Input v-model="searchOption.name" placeholder="请输入文章标题..." style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="searchArticleList(true)">查询</Button>
        </div>
        <div class="search-bar" style="margin-bottom: 20px;" v-if="app_id!=3&&currentType == 1">
          <Input v-model="searchOption.name" placeholder="请输入专栏标题..." style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="searchCategoryList(true)">查询</Button>
        </div>
        <Table v-if="app_id == 2 && currentType == 1" @on-row-click="chooseCurrentsRow" :loading="categoryListLoading" :columns="categoryListDef" :data="categoryList"></Table>
        <Table v-if="app_id == 2 && currentType == 2" @on-row-click="chooseCurrentsRow" :loading="articleListLoading" :columns="articleListDef" :data="articleList"></Table>
        <Table v-if="app_id == 1" @on-row-click="chooseCurrentsRow" :loading="bookListLoading" :columns="bookListDef" :data="bookList"></Table>
        <Table v-if="app_id==3" @on-row-click="chooseCurrentsRow" :loading="productListLoading" :data="productList" :columns="productListDef"></Table>
        <div class="bottom-bar">
          <Page v-if="app_id == 2 && currentType == 2" show-total show-sizer :current="searchOption.page_index" :total="articleCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-change="pageEnglishIndexChange">
          </Page>
          <Page v-if="app_id == 1" show-total show-sizer :current="searchBookOption.page_index" :total="bookCount" :page-size="searchBookOption.page_size" :page-size-opts="searchBookOption.page_size_opts" @on-change="pageBookIndexChange">
          </Page>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      showProductList: false,
      title: "文章列表",
      currentType: "",
      articleListDef: [
        {
          title: "ID",
          key: "product_id",
          align: "center",
          width: 60
        },
        {
          title: "名称",
          key: "name",
          align: "left",
          width: 300
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
          width: 100,
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
          width: 300,
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
            return h("span", str);
          }
        }
      ],
      categoryListDef: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "状态",
          key: "state",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.state == 1 ? "已上架" : "已下架");
          }
        }
      ],
      bookListDef: [
        {
          title: "ID",
          key: "book_id",
          align: "center",
          width: 80
        },
        {
          title: "图书名称",
          key: "title",
          width: 350,
          align: "left"
        },
        {
          title: "学科",
          key: "subject_name",
          align: "center"
        }
      ],
      productListDef: [
        {
          title: 'ID',
          key: 'exam_id',
          align: 'center',
          width: 60
        },
        {
          title: '产品名称',
          key: 'name',
          align: 'center',
          minWidth: 180
        },
        {
          title: '产品类型',
          key: 'type',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let str = ''
            for (const item of this.$store.state.product.typeSelectList) {
              if (item.state === params.row.type) {
                str = item.name
                break;
              }
            }
            return h('span', str)
          }
        },
      ],
      book_id_arr: [],
      app_id: ""
    };
  },
  mounted() { },
  methods: {
    ...mapActions([
      "getArticleList",
      "getArticleTagList",
      "getCategoryList",
      "getBookList",
      "getProdList"
    ]),
    searchCategoryList(init) {
      if (init) {
        this.$store.commit("setCategoryPageIndex", 1);
      }
      this.getCategoryList();
    },
    chooseCurrentsRow(v) {
      this.$emit("on-choose-one", v);
      this.$Message.success("选择成功!");
      this.showProductList = false;
    },
    openModal(app_id = "", v = "") {
      //   console.log(v);
      if (!v) {
        this.$Message.info("请选择类别!");
        return;
      }

      this.app_id = app_id;
      switch (app_id) {
        case 2:
          // 英语小程序
          this.$store.commit('setArticlePageIndex', 1)
          this.currentType = v;
          if (v == 1) {
            this.init1();
          } else {
            this.init2();
          }

          this.title = v == 1 ? "专栏列表" : "文章列表";
          break;
        case 1:
          // 图书增值
          this.currentType = v;
          this.$store.commit("Book_setSearchForm", {
            type: v,
            has_verify_code: 2,
          });
          this.searchBookList(true);

          this.title = v == 2 ? "图书列表" : "课程列表";
          break;
        case 3:
          this.currentType = v;
          this.$store.commit("update_search_form_options", {
            type: v,
            page_index: 1
          })
          this.title = "产品列表"
          this.searchProductList()
          break;
      }

      this.showProductList = true;
    },
    confirm() { },
    // 获取专栏列表
    init1() {
      if (this.categoryList.length == 0) {
        this.getCategoryList();
      }
    },
    // 获取文章列表
    init2() {
      //没有列表内容，则去获取
      if (this.articleList.length == 0) {
        this.getArticleList();
      }
    },
    searchBookList(init) {
      if (init) {
        this.$store.commit("Book_setPageIndex", 1);
        this.book_id_arr = [];
      }
      this.searchBookOption.title = ''
      this.getBookList(this.book_id_arr);
    },
    searchProductList() {
      this.$store.commit("update_search_form_options", {
        page_index: 1
      })
      this.getProdList()
    },
    // 图书
    pageBookIndexChange(page) {
      if (page != this.searchBookOption.page_index) {
        this.$store.commit("Book_setPageIndex", page);
        this.searchBookList();
      }
    },
    searchArticleList(init) {
      if (init) {
        this.$store.commit("setArticlePageIndex", 1);
      }
      this.getArticleList();
    },
    // 英语小程序
    pageEnglishIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("setArticlePageIndex", page);
        this.searchArticleList();
      }
    }
  },
  computed: {
    ...mapState({
      // 文章
      searchOption: state => state.deArticle.searchOption,
      articleList: state => state.deArticle.articleList,
      articleTypeList: state => state.deArticle.articleTypeList,
      articleListLoading: state => state.deArticle.articleListLoading,
      articleCount: state => state.deArticle.articleCount,
      // 专栏
      categoryList: state => state.deCategory.categoryList,
      categoryListLoading: state => state.deCategory.categoryListLoading,
      categoryCount: state => state.deCategory.categoryCount,
      // 图书
      searchBookOption: state => state.book.searchOption,
      bookList: state => state.book.bookList,
      bookListLoading: state => state.book.bookListLoading,
      bookCount: state => state.book.bookCount,
      // 商城
      productListLoading: state => state.product.prodListLoadingState,
      productList: state => state.product.productList,
      prodCount: state => state.product.total_count,
      searchProdOption: state => state.product.searchOption
    }),
    ...mapGetters(["stateListSelect", "articleTypeListSelect"])
  }
};
</script>
<style lang="less">
.choose-content-modal-window {
  .bottom-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>

