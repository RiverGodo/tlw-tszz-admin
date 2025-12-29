<template>
  <div class="verification-code page-content">
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Input placeholder="请输入店铺名称" v-model="searchOption.dealer_name" style="width: 200px"></Input>
          <Input placeholder="请输入手机号" v-model="searchOption.phone" style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="handelSeach">查询</Button>
        </div>
      </div>
      
      <div class="list">
        <Table :loading="dealerListLoading" :columns="dealerListColumns" :data="dealerList"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4"></Col>
          <Col span="20" style="text-align:right">
            <Page
              show-total
              show-sizer
              :current="searchOption.page_index"
              :total="dealerCount"
              :page-size="searchOption.page_size"
              :page-size-opts="searchOption.page_size_opts"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
            ></Page>
          </Col>
        </Row>
      </div>
    </Card>
    <Modal
      v-model="showModel"
      title="激活号段"
      @on-ok="modelOk"
      >
      <p>经销商：{{modelName}}</p>

      -

      <Input v-model="firstCode" placeholder="请输入起始卡号"></Input>

      -

      <Input v-model="endCode" placeholder="请输入结束卡号"></Input>
    </Modal>
    <Modal
      v-model="errMoadle"
      title="存在已激活卡号"
      width="520"
      >
      <div style="height: 10rem; overflow: auto;">
        <p v-for="(item, index) in errModleList" :key="index">{{item.NO}}</p>
      </div>
    </Modal>
  </div>
</template>
<script>
import moment from "moment";
import { getDealerList,activationCard } from "@/api/dealer/dealer";

export default {
  data() {
    return {
      showModel:false,
      errMoadle:false,
      errModleList:[],
      modelName:"",
      firstCode:"",
      endCode:"",
      modelId:0,
      dealerList: [],
      dealerListLoading: false,
      dealerCount: 0,
      searchOption: {
        phone: "",
        page_index: 1,
        page_size: 20
      },
      real_search:{},
      dealerListColumns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 60
        },
        {
          title: "头像/店名",
          key: "nickname",
          minWidth: 160,
          align: "left",
          render: (h, params) => {
            let nickname = params.row.shop_name;
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
                h("div", {
                  attrs: {
                    class: "nickname",
                    title: params.row.shop_name
                  },
                  domProps: {
                    innerHTML: nickname
                  }
                })
              ]
            );
          }
        },
        {
          title: "手机号",
          key: "phone",
          minWidth: 280
        },
        {
          title: "激活数量",
          key: "activation_count",
          minWidth: 180,
          align: "center"
        },
        {
          title: "说明",
          key: "content",
          minWidth: 280
        },
        {
          title: "创建时间",
          key: "create_time",
          minWidth: 280,
          render: (h, params) =>
            h("span", moment(params.row.create_time).format("YYYY-MM-DD"))
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 250,
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
                    color: "#1975E0",
                    width: "100px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: `/dealerList/activeList/?dealer_id=${
                          params.row.id
                          }`
                      });
                    }
                  }
                },
                "查看激活数据"
              ),
               h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0",
                    width: "100px"
                  },
                  on: {
                    click: () => {
                      // console.log(params.row);
                      this.modelId = params.row.user_id
                      this.modelName = params.row.shop_name
                      this.showModel = true
                    }
                  }
                },
                "绑定号段"
              ),
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
     handelSeach(){
         this.searchOption.page_index = 1
         this.real_search = {...this.searchOption}
         this.search()
    },
    modelOk(){ 
      if (this.firstCode && this.endCode) {
        if (parseInt(this.firstCode) > parseInt(this.endCode)) {
          this.$Message.warning("起始卡号必须小于结束卡号");
        }else{
          activationCard({user_id:this.modelId,begin_no:parseInt(this.firstCode),end_no:parseInt(this.endCode)}).then(res => {
            if (res.res_code == 1) {
              this.$Message.success(res.msg);
            }else{
              if (res.is_Popup) {
                this.errModleList = res.data.fail_list
                this.errMoadle = true
              }else{
                this.$Message.warning(res.msg);
              }
            }
          })
        }
      }else{
        this.$Message.warning("请输入起始卡号与结束卡号");
      }
    },
    search() {
      if (this.dealerListLoading) {
        return false;
      }
      this.dealerListLoading = true;
      getDealerList(this.searchOption)
        .then(res => {
          if (res.res_code == 1) {
            this.dealerList = res.data.list;
            this.dealerCount = res.data.total_count;
          }
          this.dealerListLoading = false;
        })
        .catch(err => {
          this.dealerListLoading = false;
        });
    },
    // 初始化
    init() {
      this.searchOption = {
        page_index: 1,
        page_size: 20,
        dealer_name:"",
        phone:""
      };
      this.real_search = {...this.searchOption}
      this.search();
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.searchOption.page_index = page;
        this.real_search.page_index = page;
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.searchOption.page_size = pageSize;
        this.real_search.page_size = pageSize;
        this.search();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.verification-code {
  .operation {
    margin-bottom: 20px;
  }
  .pagination-wrapper {
    margin-top: 20px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 100%;
  }
}
</style>
