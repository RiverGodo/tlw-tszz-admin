<style lang="less">
.de-banner {
  .list.banner-list {
    .ivu-table {
      .ivu-table-cell {
        .img-title {
          .img {
            flex: 0 0 150px;
            width: 150px;
            height: 60px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="page-content daily-english de-banner">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>广告列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">

        </div>
        <div class="actions">
          <Button type="primary" @click="goAddBannerPage(-1)">创建广告</Button>
        </div>
      </div>
      <div class="list banner-list">
        <Table ref="BannerList" :loading="bannerBookListLoading" :columns="bannerBookListDef" :data="bannerBookList"></Table>
        <div class="bottom-bar">
          <Button v-if="!showChangeNum" size="small" type="info" @click="showChangeNum = true">修改序号</Button>
          <div v-if="showChangeNum">
            <Button :loading="changeNumLoading" size="small" @click="cancelChangeNum">取消</Button>
            <Button :loading="changeNumLoading" size="small" type="primary" @click="changeNum">保存</Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapState } from "vuex";
import { updateBanner, delBanner, orderByBanner } from "@/api/banner";
export default {
  name: "banner-list",
  data() {
    return {
      showChangeNum: false,
      changeNumLoading: false,
      bannerBookListDef: [
        {
          title: "ID",
          key: "banner_id",
          align: "center",
          width: 60
        },
        {
          title: '排序',
          key: 'orderby',
          align: 'center',
          width: 40,
          render: (h, params) => {
            if (this.showChangeNum) {
              return h("Input", {
                props: {
                  value: params.row.orderby,
                  size: "small"
                },
                on: {
                  "on-change": e => {
                    let value = Number(e.target.value)
                    if (!(value > 0)) {
                      value = 0
                    }
                    for (const order of this.orderList) {
                      if (order.banner_id == params.row.banner_id) {
                        order.num = value;
                        break;
                      }
                    }
                  }
                }
              });
            } else {
              return h('span', params.row.orderby)
            }

          }
        },
        {
          title: "封面/名称",
          key: "name",
          align: "left",
          minWidth: 450,
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
                      "上架时间: " +
                      moment(params.row.open_time).format("YYYY-MM-DD HH:mm")
                    )
                  ]
                )
              ]
            );
          }
        },
        // {
        // title: "类别",
        // key: "type",
        // align: "center",
        // width: 60,
        // render: (h, params) => {
        //     let type_arr = this.articleTypeListDef.filter( e => e.type_id == params.row.type);
        //     return type_arr[0].name;
        // }
        // },
        {
          title: "阅读数",
          key: "read_count",
          align: "center",
          width: 80
        },
        {
          title: "状态",
          key: "state",
          align: "center",
          width: 60,
          render: (h, params) => {
            let state_arr = this.stateListDef.filter(
              e => e.state == params.row.state
            );
            return h("span", state_arr[0].name);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "left",
          width: 200,
          render: (h, params) => {
            var stateStr = params.row.state == 0 ? "上架" : "下架";
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
                        path:
                          "/BookManage/AddBanner" +
                          "?bid=" +
                          params.row.banner_id
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
                      this.setBannerState(params.row);
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
                      this.delBanner(params.row.banner_id);
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
      stateListDef: state => state.app.stateList,
      bannerBookList: state => state.bookBanner.bannerBookList,
      bannerBookListLoading: state => state.bookBanner.bannerBookListLoading
    }),
    orderList: {
      get() {
        let arr = []
        for (const item of this.bannerBookList) {
          arr.push({
            banner_id: item.banner_id,
            num: item.orderby
          })
        }
        return arr
      },
      set() {

      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getBookBannerList"]),
    init() {
      if (this.$route.query.reload) {
        return this.getBookBannerList();
      }

      this.bannerBookList.length == 0 ? this.getBookBannerList() : "";
    },
    goAddBannerPage(bid) {
      if (bid > 0) {
        this.$router.push({
          path: "/BookManage/AddBanner" + "?bid=" + bid
        });
      } else {
        this.$router.push({
          path: "/BookManage/AddBanner"
        });
      }
    },
    setBannerState(banner) {
      let str = banner.state == 1 ? "下架" : "上架";
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该广告吗？",
        onOk: res => {
          banner.state = banner.state == 1 ? 0 : 1;
          updateBanner(banner).then(res => {
            if (res.res_code == 1) {
              this.$Message.success("广告" + str + "成功！");
              this.getBookBannerList();
            } else {
              this.$Message.error("广告" + str + "失败！");
            }
          });
        }
      });
    },
    delBanner(bid) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认删除该广告吗？",
        onOk: res => {
          delBanner({ banner_id: bid }).then(res => {
            if (res.res_code == 1) {
              this.$Message.success("广告删除成功！");
              this.getBookBannerList();
            } else {
              this.$Message.error("广告删除失败！");
            }
          });
        }
      });
    },
    cancelChangeNum() {
      let arr = [];
      this.bannerBookList.map(item => arr.push({ banner_id: item.banner_id, num: item.orderby }))
      this.orderList = arr
      this.showChangeNum = false
    },
    changeNum() {
      this.showChangeNum = false
      orderByBanner({
        orderby: this.orderList
      }).then(res => {
        if (res.res_code == 1) {
          this.$Message.success('排序成功')
          this.getBookBannerList()
        }
      })
    }
  }
};
</script>