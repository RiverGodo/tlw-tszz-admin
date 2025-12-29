<style lang="less">
.page-content.resource-list-of-book {
  .top-bar {
    .actions {
      flex: 1;
    }
  }
}
</style>
<template>
  <div class="page-content resource-list-of-book">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem :to="breadLink">{{breadcrumItem}}</BreadcrumbItem>
      <BreadcrumbItem>{{currentPage}}</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <strong> {{bookInfo.title}}</strong>
          <div class="search-bar">
            <strong>学科：</strong>{{subject_name}}
            <strong style="margin-left:20px">年级：</strong>{{bookInfo.grade | filterGrade}}
            <strong style="margin-left:20px">适用版本：</strong>{{bookInfo.version_years > 0 ? bookInfo.version_years:"无"}}
          </div>
        </div>
        <div class="actions">
          <!-- <Button type="primary" icon="android-add" @click="addLiveSource">添加直播</Button>                               -->
          <Button type="ghost" @click="showResourceListModal = true">从资源库添加</Button>
          <Button type="primary" @click="showAddResourceDialogFun(-1)">添加新资源</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">当前已绑定资源（
          <span>{{resourceList.length}}</span>）</p>
        <Table ref="resourceList" :loading="resourceListLoading" :columns="resourceListDef" :data="resourceList"></Table>
        <div class="bottom-bar">
          <!-- <Button :loading="delResourceLoading" type="ghost" @click="unBindBookResource">解除绑定</Button> -->
          <Button v-if="!showChangeNum" size="small" type="info" @click="showChangeNum = true">修改序号</Button>
          <div v-if="showChangeNum">
            <Button :loading="changeNumLoading" size="small" @click="cancelChangeNum">取消</Button>
            <Button :loading="changeNumLoading" size="small" type="primary" @click="changeNum">保存</Button>
          </div>
        </div>
      </div>
    </Card>
    <add-book-resource-modal :is-show="showAddResourceDialog" :book-id="book_id" :resource-id="resource_id" @closeModal="showAddResourceDialog=false" @bindBookResource="bindBookResource" @refreshList="getResourceListOfOneBook">
    </add-book-resource-modal>
    <book-resource-list-modal :is-show="showResourceListModal" :rid-list="ridList" @closeModal="showResourceListModal=false" @bindBookResource="bindBookResource">
    </book-resource-list-modal>
    <set-showname-modal :is-show="showSetShownameModal" :resource-name="resourceName" :book-id="book_id" :resource-id="resource_id" @closeModal="showSetShownameModal=false" @refreshList="getResourceListOfOneBook"></set-showname-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as apiBookResource from "@/api/bookResource";
import { getBookDetail, bindBookResource } from "@/api/book";
import addBookResourceModal from "../modal-components/add-book-resource.vue";
import setShownameModal from "../modal-components/set-showname.vue";
import bookResourceListModal from "../modal-components/book-resource-list.vue";
import moment from "moment";
export default {
  components: {
    addBookResourceModal,
    bookResourceListModal,
    setShownameModal
  },
  data() {
    return {
      resourceName: "",
      book_id: 0,
      bookInfo: {},
      showAddResourceDialog: false,
      showChangeNum: false,
      changeNumLoading: false,
      resource_id: -1,
      showResourceListModal: false,
      showSetShownameModal: false,
      addResourceLoading: false,
      delResourceLoading: false,
      resourceList: [],
      ridList: [],
      orderList: [],
      newOrderList: [],
      resourceListLoading: false,
      resourceListDef: [],
      breadLink: "",
      breadcrumItem: "图书管理"
    };
  },
  filters: {
    filterGrade(v) {
      return v && v.length > 0 ? v[0].grade_name : "无";
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.breadLink = from.fullPath;
      vm.breadcrumItem = from.name == "subject_list" ? "课程管理" : "图书管理";
    });
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters([
      "cityListSelect",
      "resourceTypeListSelect",
      "subjectListSelect"
    ]),
    subject_name() {
      let name = "未识别";
      let arr = this.subjectListSelect.filter(
        e => e.subject_id == this.bookInfo.subject_id
      );
      if (arr && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    currentPage() {
      return this.breadcrumItem == "课程管理" ? "课程资源" : "图书资源";
    }
  },
  methods: {
    addLiveSource() {
      this.$router.push({
        path: "/add-live-resource/5"
      });
    },
    init() {
      this.book_id = Number(this.$route.params.book_id);
      if (this.book_id > 0) {
        getBookDetail(this.book_id).then(res => {
          this.bookInfo = res.msg[0];
        });
        this.getResourceListOfOneBook();
      } else {
        this.$router.push({
          name: "error-404"
        });
      }
    },
    setColumns(typeFilter) {
      let columns = [
        {
          title: "排序",
          key: "orderby",
          align: "center",
          width: 50,
          render: (h, params) => {
            if (this.showChangeNum) {
              return h("Input", {
                props: {
                  value: params.row.orderby,
                  size: "small"
                },
                on: {
                  "on-change": v => {
                    for (let e of this.newOrderList) {
                      if (e.resource_id == params.row.resource_id) {
                        e.orderby = v.target.value;
                        break;
                      }
                    }
                  }
                }
              });
            } else {
              return h("span", params.row.orderby);
            }
          }
        },
        {
          title: "展示",
          key: "show_num",
          align: "center",
          width: 50,
          render: (h, params) => {
            if (this.showChangeNum) {
              return h("Input", {
                props: {
                  value: params.row.show_num,
                  size: "small"
                },
                on: {
                  "on-change": v => {
                    for (let e of this.newOrderList) {
                      if (e.resource_id == params.row.resource_id) {
                        e.show_num = v.target.value;
                        break;
                      }
                    }
                  }
                }
              });
            } else {
              return h("span", params.row.show_num);
            }
          }
        },
        {
          title: "ID",
          key: "resource_id",
          align: "center",
          width: 60
        },
        {
          title: "资源名称",
          key: "name",
          minWidth: 320,
          align: "left"
        },
        {
          title: "展示名称",
          key: "show_name",
          minWidth: 320,
          align: "left"
        },
        {
          title: "类型",
          key: "type_name",
          width: 120,
          align: "center",
          filters: typeFilter,
          filterMultiple: false,
          filterMethod(value, row) {
            return value == row.type_name;
          },
          render: (h, params) => {
            let str = params.row.type_name
            // console.log(params.row);
            if (params.row.type_name === '视频' && params.row.free_see) {
              str += '(可试看)'
            }
            if (params.row.type_name === '直播' && params.row.free_see) {
              str += '(可试看)'
            }
            return h('span', str)
          }
        },
        {
          title: "资源格式",
          width: 80,
          key: "res_format",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.row.type_name == "直播" ? "rtmp" : params.row.res_format
            );
          }
        },
        {
          title: "学科",
          key: "subject_name",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.row.subject_name ? params.row.subject_name : "无"
            );
          }
        },
        {
          title: "年级",
          key: "grade_name",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.row.grade_name ? params.row.grade_name : "无"
            );
          }
        },
        {
          title: "适用版本",
          width: 80,
          key: "years",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.years == 0 ? "无" : params.row.years);
          }
        },
        {
          title: "适用城市",
          width: 80,
          key: "city_id",
          align: "center",
          render: (h, params) => {
            let city_arr = this.cityListSelect.filter(
              e => e.city_id == params.row.city_id
            );
            return h("span", city_arr.length == 0 ? "无" : city_arr[0].name);
          }
        },
        // {
        //   title: "创建人",
        //   key: "realname",
        //   width: 80,
        //   align: "center",
        //   render: (h, params) => {
        //     return params.row.realname == "" ? "系统" : params.row.realname;
        //   }
        // },
        {
          title: "创建时间",
          key: "create_time",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.create_time).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: 'right',
          width: 220,
          render: (h, params) => {
            let arr = [
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
                      this.showAddResourceDialogFun(params.row.resource_id);
                    }
                  }
                },
                "编辑"
              ),
              h("Button", {
                props: {
                  type: "text",
                  size: "small"
                },
                style: {
                  color: "#1975E0"
                },
                on: {
                  click: () => {
                    this.showSetNameModalFn(params.row.resource_id, params.row.name)
                  }
                }
              }, "设置展示名称"),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#ed3f14"
                  },
                  on: {
                    click: () => {
                      this.unBindBookResource(params.row.resource_id);
                    }
                  }
                },
                "删除"
              )
            ]
            if (params.row.type_name === '直播'||params.row.type_name === '直播(可试看)') {
              arr.push(h(
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
                        name: 'chat_room',
                        params: {
                          resourceId: params.row.resource_id
                        }
                      })
                    }
                  }
                }, '进入直播间'
              ),h(
                'Button',
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
                      let free_see = params.row.free_see === 1 ? 0 : 1
                      let payload = {
                        book_id: this.book_id,
                        resource_id: params.row.resource_id,
                        free_see: free_see
                      }
                      apiBookResource.setBookVideoResource(payload).then(res => {
                        if (res.res_code === 1) {
                          this.$Message.success('设置成功')
                          this.getResourceListOfOneBook()
                        }
                      }).catch(err => {
                        console.log(err)
                      })
                    }
                  }
                }, params.row.free_see === 1 ? '取消试看' : '设置试看'
              ))
            }
            if (params.row.type_name === '视频' || params.row.type_name === '视频(可试看)') {
              arr.push(h(
                'Button',
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
                      let free_see = params.row.free_see === 1 ? 0 : 1
                      let payload = {
                        book_id: this.book_id,
                        resource_id: params.row.resource_id,
                        free_see: free_see
                      }
                      apiBookResource.setBookVideoResource(payload).then(res => {
                        if (res.res_code === 1) {
                          this.$Message.success('设置成功')
                          this.getResourceListOfOneBook()
                        }
                      }).catch(err => {
                        console.log(err)
                      })
                    }
                  }
                }, params.row.free_see === 1 ? '取消试看' : '设置试看'
              ))
            }
            return h("div", arr);
          }
        }
      ];
      this.resourceListDef = columns;
    },
    showAddResourceDialogFun(id) {
      this.resource_id = id ? id : -1;
      this.showAddResourceDialog = true;
    },
    getResourceListOfOneBook() {
      this.resourceListLoading = true;
      apiBookResource.getResourceListOfOneBook(this.book_id).then(res => {
        this.resourceListLoading = false;
        if (res.res_code == 1) {
          this.resourceList = res.msg;
          this.ridList = [];
          this.orderList = [];
          let typeFilter = [];
          res.msg.forEach(e => {
            let o = {
              resource_id: e.resource_id,
              show_name: e.show_name,
              show_num: e.show_num,
              orderby: e.orderby,
              free_see: e.free_see
            };
            this.ridList.push(e.resource_id);
            this.orderList.push(o);
            if (e.free_see == 1) {
              e.type_name += '(可试看)'
            }
            if (typeFilter.length == 0) {
              typeFilter.push({
                label: e.type_name,
                value: e.type_name
              });
            } else {
              if (typeFilter.findIndex(f => f.value == e.type_name) == -1) {
                typeFilter.push({
                  label: e.type_name,
                  value: e.type_name
                });
              }
            }
          }, this);
          this.setColumns(typeFilter);
          console.log(this.orderList);
          this.newOrderList = JSON.parse(JSON.stringify(this.orderList));
          console.log(this.newOrderList);
        }
      });
    },
    bindBookResource(rid_arr) {
      rid_arr.forEach(element => {
        if (element) {
          let o = {
            resource_id: element.resource_id,
            show_num: "",
            show_name: element.show_name,
            orderby: this.orderList.length + 1,
            free_see: 0
          };
          this.orderList.push(o);
        }
      }, this);
      bindBookResource(this.book_id, this.orderList).then(res => {
        if (res.res_code == 1) {
          this.$Message.success("绑定资源成功！");
          this.getResourceListOfOneBook();
          this.$store.commit("clearBookResourceModalList");
        } else {
          this.$Message.error("绑定资源失败！");
        }
      });
    },
    unBindBookResource(del_id) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认要解除绑定吗？",
        onOk: () => {
          this.delResourceLoading = true;
          let del_arr = this.orderList.filter(e => e.resource_id != del_id);
          bindBookResource(this.book_id, del_arr)
            .then(res => {
              this.delResourceLoading = false;
              if (res.res_code == 1) {
                this.getResourceListOfOneBook();
                this.$Message.success("解除绑定资源成功！");
              } else {
                this.$Message.error("解除绑定资源失败！");
              }
            })
            .catch(error => {
              this.delResourceLoading = false;
            });
        }
      });
    },
    cancelChangeNum() {
      this.newOrderList = JSON.parse(JSON.stringify(this.orderList));
      this.showChangeNum = false;
    },
    changeNum() {
      this.changeNumLoading = true;
      bindBookResource(this.book_id, this.newOrderList)
        .then(res => {
          this.changeNumLoading = false;
          this.showChangeNum = false;
          if (res.res_code == 1) {
            this.getResourceListOfOneBook();
            this.$Message.success("资源排序修改成功！");
          } else {
            this.$Message.error("资源排序修改失败！");
          }
        })
        .catch(error => {
          this.changeNumLoading = false;
        });
    },
    showSetNameModalFn(id, name) {//显示设置展示名称弹框
      this.resource_id = id
      this.resourceName = name
      this.showSetShownameModal = true
    }
  }
};
</script>