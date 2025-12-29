<style lang="less">
.common-dialog.resource-list-modal {
  .ivu-modal {
    min-width: 900px;
  }
}
</style>

<template>
  <Modal class="common-dialog resource-list-modal" v-model="showModal" title="资料库添加">
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
      </div>
      <div class="actions">
        <Input v-model="searchOption.name" placeholder="请输入资料名称..." style="width: 200px"></Input>
        <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
      </div>
    </div>
    <p class="list-info">当前已绑定资源（
      <span>{{ridList.length}}</span>），新增资源（
      <span>{{all_resource_id_arr.length}}</span>）</p>
    <Table ref="resourceListModal" :loading="resourceListLoading" :columns="resourceListDef" :data="resourceList" @on-selection-change="handleSelectChange">
    </Table>
    <Row class="bottom-bar" type="flex" justify="space-between">
      <Col span="4">
      <Button type="primary" style="width:150px;" :loading="addResourceLoading" @click="bindBookResource">添加</Button>
      </Col>
      <Col span="20" style="text-align:right">
      <Page show-total show-sizer :current="searchOption.page_index" :total="resourceCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
      </Page>
      </Col>
    </Row>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "bookResourceListModal",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    ridList: {
      type: Array,
      default: []
    },
    bookId: {
      default: 0
    }
  },
  data() {
    return {
      addResourceLoading: false,
      showModal: false,
      searchOption: {
        book_id: 0,
        years: 0,
        grade_id: 0,
        subject_id: 0,
        type_id: 0,
        name: "",
        page_index: 1,
        page_size: 10,
        page_size_opts: [10, 20, 50, 100]
      },
      resource_id_arr: [],
      resourceListDef: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "资源名称",
          key: "name",
          width: 290,
          align: "left"
        },
        {
          title: "类型",
          key: "type_name",
          align: "center",
          width: 150
        },
        {
          title: "学科",
          key: "subject_name",
          align: "center",
          width: 80,
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
          align: "center",
          width: 80,
          render: (h, params) => {
            return h(
              "span",
              params.row.grade_name ? params.row.grade_name : "无"
            );
          }
        },
        {
          title: "适用版本",
          key: "years",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.years == 0 ? "无" : params.row.years);
          }
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 105,
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.create_time).format("YYYY-MM-DD")
            );
          }
        }
      ]
    };
  },
  watch: {
    isShow: function (value) {
      if (value) {
        if (this.resourceCount == 0) {
          this.search(true);
        } else {
          this.setSelectionState();
        }
        this.showModal = value;
      }
    },
    showModal: function (value) {
      if (!value) {
        this.$emit("closeModal");
      }
    },
    resourceList: function (value) {
      this.setSelectionState();
    }
  },
  computed: {
    ...mapState({
      resourceList: state => state.bookResourceModal.resourceList,
      resourceListLoading: state => state.bookResourceModal.resourceListLoading,
      resourceCount: state => state.bookResourceModal.resourceCount,
      searchOptionDef: state => state.bookResourceModal.searchOption
    }),
    ...mapGetters([
      "subjectListSelect",
      "yearsListSelect",
      "gradeListBaseSelect",
      "resourceTypeListSelect"
    ]),
    all_resource_id_arr() {
      let id_arr = [];
      this.resource_id_arr.forEach(e => {
        if (e) {
          id_arr = id_arr.concat(e);
        }
      });
      return id_arr;
    }
  },
  mounted() { },
  methods: {
    ...mapActions(["getBookResourceModalList"]),
    // 资源库中添加
    handleSelectChange(selection) {
      let arr = [...this.resource_id_arr];
      arr[this.searchOption.page_index] = [];
      selection.forEach(e => {
        if (!this.ridList.includes(e.resource_id)) {
          arr[this.searchOption.page_index].push(e.resource_id);
        }
      });
      this.resource_id_arr = arr;
    },
    search(init) {
      if (init) {
        this.searchOption.page_index = 1;
      }
      this.$store.commit("setBookResourceModalSearchOption", this.searchOption);
      this.getBookResourceModalList();
    },
    setSelectionState() {
      this.resourceList.forEach(element => {
        if (this.ridList.includes(element.resource_id)) {
          element._checked = true;
          element._disabled = true;
        } else {
          if (
            this.resource_id_arr[this.searchOption.page_index] &&
            this.resource_id_arr[this.searchOption.page_index].includes(
              element.resource_id
            )
          ) {
            element._checked = true;
          } else {
            element._checked = false;
          }
        }
      });
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.searchOption.page_index = page;
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.searchOption.page_size = pageSize;
        this.search();
      }
    },
    bindBookResource(resource) {
      if (this.all_resource_id_arr.length == 0) {
        this.$Modal.info({
          title: "提示信息",
          content: "请选择要绑定的资源！"
        });
        return;
      }
      let all_resource = []
      this.all_resource_id_arr.map(item => {
        all_resource.push({
          resource_id: item,
          show_name: this.resourceList.filter(resource => resource.resource_id == item)[0].name
        })
      })
      this.$emit("bindBookResource", all_resource);
      this.resource_id_arr = [];
      this.showModal = false;
    }
  }
};
</script>
