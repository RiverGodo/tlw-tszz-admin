<style lang="less">
.common-dialog.article-list-modal {
  .ivu-modal {
      min-width: 900px;
  }
}
</style>

<template>
    <Modal class="common-dialog daily-english article-list-modal"
        v-model="showModal"
        title="选择已有文章">
        <div class="options">
                <div class="search-bar">                 
                    <Input v-model="searchOption.name" placeholder="请输入文章名称..." style="width: 200px"></Input>
                    <Button type="primary" class="btn_search" icon="ios-search" @click="getArticleList(true)">查询</Button>
                </div>
            </div>
            <Table 
                ref="articleList" 
                :loading="articleListLoading" 
                :columns="articleListDef" 
                :data="articleList"
                @on-selection-change="articleListSelectChange"></Table>
            <Row class="bottom-bar" type="flex" justify="space-between">
                <Col span="4">
                  <!-- <Button @click="articleListSelectAll" >全选</Button> -->
                </Col>
                <Col span="20" style="text-align:right">
                  <Page 
                    show-total 
                    show-sizer
                    :current="searchOption.page_index"
                    :total="articleListCount"
                    :page-size="searchOption.page_size" 
                    :page-size-opts="searchOption.page_size_opts" 
                    @on-page-size-change="pageSizeChange" 
                    @on-change="pageIndexChange" >
                  </Page> 
                </Col>
            </Row>
        <div slot="footer">
            <Button type="ghost" size="large" @click="showModal = false" >取消</Button>
            <Button type="primary" size="large" :loading="addArticleLoading" @click="bindArticle" >保存</Button>
        </div>
    </Modal>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import {
  getCanAddArticleList,
  bindArticleToCategory
} from "@/api/daily-english/category";
export default {
  name: "articleListModal",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    categoryId: {
      default: -1
    }
  },
  data() {
    return {
      addArticleLoading: false,
      showModal: false,
      searchOption: {
        name: "",
        category_id: -1,
        page_index: 1,
        page_size: 10,
        page_size_opts: [10, 20, 50, 100]
      },
      article_id_arr:[],
      articleListLoading: false,
      articleListCount:0,
      articleList: [],
      articleListDef: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          align: "left"
        },
        {
          title: "类别",
          key: "type",
          align: "center",
          width: 80,
          render: (h, params) => {
            let type_arr = this.articleTypeListDef.filter(
              e => e.type_id == params.row.type
            );
            return type_arr[0].name;
          }
        },
        {
          title: "上架时间",
          key: "open_time",
          align: "center",
          width: 200,
          render: (h, params) => {
            return moment(params.row.open_time).format("YYYY-MM-DD HH:mm");
          }
        }
      ]
    };
  },
  watch: {
    isShow: function(value) {
      if (value) {
        this.showModal = value;
        if (this.categoryId > 0) {
          this.searchOption.category_id = this.categoryId;
          this.getArticleList();
        }
      }
    },
    showModal: function(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  computed: {
    ...mapState({
        articleTypeListDef: state => state.deArticle.articleTypeList,
    })
  },
  methods: {
    getArticleList(init) {
      if(init){
        this.searchOption.page_index = 1;
      }
        this.articleListLoading = true;
        getCanAddArticleList(this.searchOption)
        .then(res =>{
            this.articleListLoading = false;            
            if(res.res_code == 1){
                this.articleList = res.msg.products;
                this.articleListCount = res.msg.total_count;
            }  
        });
    },
    articleListSelectAll(status) {
      if (this.article_id_arr.length == this.articleList.length) {
        this.$refs.articleList.selectAll(false);
      } else {
        this.$refs.articleList.selectAll(true);
      }
    },
    articleListSelectChange(selection) {
      this.article_id_arr = [];
      this.article_id_arr = selection.map(e => e.product_id);
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.searchOption.page_index = page;
        this.getArticleList();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.searchOption.page_size = pageSize;
        this.getArticleList();
      }
    },
    bindArticle(){
        if (this.article_id_arr.length == 0) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请选择要添加的文章！"
        });
      } else {
        this.$Modal.confirm({
          title: "提示信息",
          content:
            "确认要添加这些文章吗？",
          onOk: () => {
            this.addArticleLoading = true;
            bindArticleToCategory(
              this.categoryId,
              this.article_id_arr
            ).then(res => {
              this.addArticleLoading = false;
              if (res.res_code == 1) {
                this.$Message.success("绑定资源成功！");
                this.showModal = false;
                this.$emit("refreshList");                
              } else {
                this.$Message.error("绑定资源失败！");
              }
            });
          }
        });
      }
    }
  }
};
</script>
