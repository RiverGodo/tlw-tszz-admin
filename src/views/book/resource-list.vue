<style lang="less">
</style>
<template>
  <div class="page-content book-resource-list bres-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>资源管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchOption.type_id" style="width:150px" @on-change="search(true)">
            <Option v-for="item in resourceTypeListSelect" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.years" style="width:100px" @on-change="search(true)">
            <Option v-for="item in yearsListSelect" :value="item.year_id" :key="item.year_id">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.grade_id" style="width:100px" @on-change="search(true)">
            <Option v-for="item in gradeListBaseSelect" :value="item.grade_id" :key="item.grade_id">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.subject_id" style="width:100px" @on-change="search(true)">
            <Option v-for="item in subjectListSelect" :value="item.subject_id" :key="item.subject_id">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.city_id" style="width:100px" @on-change="search(true)">
            <Option v-for="item in cityListSelect" :value="item.city_id" :key="item.city_id">{{ item.name }}</Option>
          </Select>
          <div class="search-bar">
            <Input v-model="searchOption.name" placeholder="请输入资料名称..." style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          </div>
        </div>
        <div class="actions">
          <Button type="primary" @click="showAddResourceDialogFun(-1)">添加资源</Button>
        </div>
      </div>
      <div class="list resource-list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前资源&nbsp;（
          <span>{{resourceCount}}</span>）&nbsp;份&nbsp;已选（
          <span>{{all_resource_id_arr.length}}</span>）</p>
        <Table ref="resourceList" :loading="resourceListLoading" :columns="resourceListDef" :data="resourceList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="8">
          <!-- <Button @click="handleSelectAll">全选</Button> -->
          <Button :loading="delResourceLoading" type="ghost" @click="delBookResource">删除</Button>
          </Col>
          <Col span="16" style="text-align:right">
          <Page show-total show-sizer show-elevator :current="searchOption.page_index" :total="resourceCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col>
        </Row>
      </div>
    </Card>
    <add-book-resource-modal :is-show="showAddResourceDialog" :resource-id="resource_id" @closeModal="showAddResourceDialog=false" @refreshList="getBookResourceList"></add-book-resource-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import * as apiBookResource from "@/api/bookResource";
import addBookResourceModal from "../modal-components/add-book-resource.vue";
import moment from "moment";
export default {
  components: {
    addBookResourceModal
  },
  data() {
    return {
      showAddResourceDialog: false,
      resource_id: -1,
      addResourceLoading: false,
      delResourceLoading: false,
      resource_id_arr: [],
      resourceListDef: [
        {
          type: "selection",
          width: 40,
          align: "center"
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
          minWidth: 515,
          align: "left"
        },
        {
          title: "类型",
          width: 150,
          key: "type_name",
          align: "center"
        },
        {
          title: "学科",
          width: 80,
          key: "subject_name",
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
          width: 80,
          key: "grade_name",
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
        /* {
          title: "创建人",
          key: "realname",
          width:80,
          align: "center",
          render: (h, params) => {
            return params.row.realname == "" ? "系统" : params.row.realname;
          }
        }, */
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
          width: 140,
          align: "center",
          render: (h, params) => {
            let obj = {
              props: {
                type: "text",
                size: "small"
              },
              style: {
                color: "#1975E0"
              },
            }
            let arr = [
              h(
                "Button",
                {
                  ...obj,
                  on: {
                    click: () => {
                      this.showAddResourceDialogFun(params.row.resource_id);
                    }
                  }
                },
                "编辑"
              )
            ]
            if (params.row.type_name === '直播') {
              arr.push(h(
                "Button",
                {
                  ...obj,
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
              ))
            }
            return h("div", arr);
          }
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      searchOption: state => state.bookResource.searchOption,
      resourceList: state => state.bookResource.resourceList,
      resourceListLoading: state => state.bookResource.resourceListLoading,
      resourceCount: state => state.bookResource.resourceCount
    }),
    ...mapGetters([
      "subjectListSelect",
      "cityListSelect",
      "yearsListSelect",
      "gradeListBaseSelect",
      "resourceTypeListSelect"
    ]),
    all_resource_id_arr() {
      let id_arr = [];
      this.resource_id_arr.forEach(e => {
        id_arr = id_arr.concat(e);
      });
      return id_arr;
    }
  },
  methods: {
    ...mapActions(["getBookResourceList"]),
    addLiveSource() {
      this.$router.push({
        path: "/add-live-resource/5"
      });
    },
    init() {
      if (this.resourceList.length == 0) {
        this.getBookResourceList(this.resource_id_arr);
      }
    },
    handleSelectAll(status) {
      if (
        this.resource_id_arr[this.searchOption.page_index].length ==
        this.resourceList.length
      ) {
        this.$refs.resourceList.selectAll(false);
      } else {
        this.$refs.resourceList.selectAll(true);
      }
    },
    selectChange(selection) {
      let arr = [...this.resource_id_arr];
      arr[0] = [];
      arr[this.searchOption.page_index] = selection.map(e => e.resource_id);
      this.resource_id_arr = arr;
    },
    showAddResourceDialogFun(id) {
      this.resource_id = id;
      this.showAddResourceDialog = true;
    },
    search(init) {
      if (init) {
        this.$store.commit("setBookResourcePageIndex", 1);
        this.resource_id_arr = [];
      }
      this.getBookResourceList(this.resource_id_arr);
    },
    delBookResource() {
      if (this.all_resource_id_arr.length == 0) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请选择要删除的资源！"
        });
      } else {
        this.$Modal.confirm({
          title: "提示信息",
          content: "确认要删除吗？",
          onOk: () => {
            this.delResourceLoading = true;
            apiBookResource
              .delBookResource(this.all_resource_id_arr)
              .then(res => {
                this.delResourceLoading = false;
                if (res.res_code == 1) {
                  this.resource_id_arr = [];
                  this.getBookResourceList();
                  this.$Message.success("删除资源成功！");
                } else {
                  this.$Message.error("删除资源失败！");
                }
              });
          }
        });
      }
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("setBookResourcePageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("setBookResourcePageSize", pageSize);
        this.search();
      }
    }
  }
};
</script>