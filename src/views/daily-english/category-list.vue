<style lang="less">
.de-category-list {
  .category {
    display: flex;
    padding: 10px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    position: relative;
    .detail-btn {
      position: absolute;
      bottom: 5px;
      right: 0;
      color: #2d8cf0;
      &:hover {
        opacity: 0.8;
      }
    }
    .state {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 12px;
    }
    .img {
      flex: 0 0 150px;
      width: 150px;
      height: 90px;
      margin-right: 10px;
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      font-size: 16px;
      align-items: flex-start;
      .title {
        flex: 0 0 20px;
        span {
          color: #f5a623;
        }
      }
      .desc {
        flex: 1;
        opacity: 0.8;
        font-size: 14px;
      }
      .time {
        flex: 0 0 20px;
        font-size: 14px;
        opacity: 0.5;
      }
    }
  }
  .category + .category {
    border-top: none;
  }
}
</style>
<template>
  <div class="page-content daily-english">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <BreadcrumbItem>专栏管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchOption.package_category_id" style="width:100px" @on-change="search(true)">
            <Option v-for="(item,index) in categoryTypeListSelect" :value="item.package_category_id" :key="index">{{ item.package_category_name }}</Option>
          </Select>
          <Select v-model="searchOption.state" style="width:100px" @on-change="search(true)">
            <Option v-for="item in stateListSelect" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Input class="margin-left-10" v-model="searchOption.name" placeholder="请输入专栏标题..." style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
        </div>
        <div class="actions">
          <Button type="primary" @click="goAddCategoryPage">创建专栏</Button>
        </div>
      </div>
      <div class="list de-category-list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前专栏
          <span>{{categoryCount}}</span>个</p>
        <div class="category" v-for="item in categoryList" :key="item.package_id">
          <img class="img" :src="item.cover_img">
          <div class="info">
            <div class="title">
              {{item.name}}
              <span v-if="item.package_category_name">({{item.package_category_name}})</span>
            </div>
            <div class="desc">
              {{item.short_desc}}
            </div>
            <p style="font-size: 12px;">
              <span>实际价格: {{item.price}}</span>
              <span style="margin-left: 20px;">原始价格: {{item.original_price}}</span>
            </p>
            <div class="time">
              创建时间：{{item.create_time | formatDate}} &nbsp;&nbsp;&nbsp; 文章数量：{{item.product_count}}
            </div>
          </div>
          <span class="state">
            {{item.state | stateFormat}}
          </span>
          <Button type="text" class="detail-btn" @click="goCategoryDetailPage(item.package_id)">查看详情</Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "category-list",
  data() {
    return {
    };
  },
  filters: {
    formatDate: function (value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD HH:mm");
    },
    stateFormat(val) {
      let str = ""
      switch (val) {
        case 0:
          str = "已下架";
          break;
        case 1:
          str = "已上架";
          break;
        case 2:
          str = "兑换后可见";
          break;
      }
      return str
    }
  },
  computed: {
    ...mapState({
      searchOption: state => state.deCategory.searchOption,
      categoryList: state => state.deCategory.categoryList,
      categoryListLoading: state => state.deCategory.categoryListLoading,
      categoryCount: state => state.deCategory.categoryCount
    }),
    ...mapGetters(['stateListSelect', 'categoryTypeListSelect'])
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getCategoryList"]),
    init() {
      if (this.categoryList.length == 0) {
        this.getCategoryList();
      }
    },
    search(init) {
      if (init) {
        this.$store.commit("setCategoryPageIndex", 1);
      }
      this.getCategoryList();
    },
    goCategoryDetailPage(category_id) {
      this.$router.push({
        name: "DECategoryDetail",
        params: {
          cid: category_id
        }
      });
    },
    goAddCategoryPage() {
      this.$router.push({
        name: "DEAddCategory"
      });
    }
  }
};
</script>
