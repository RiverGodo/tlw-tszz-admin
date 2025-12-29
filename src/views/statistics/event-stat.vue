<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>事件统计</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options"></div>
        <div class="actions">
          <Button type="primary" icon="android-add" @click="showAddTeacherDialogFun">添加事件</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前事件&nbsp;（
          <span>{{eventCount}}</span>）&nbsp;条&nbsp;
        </p>
        <Table
          ref="eventList"
          :loading="eventListLoading"
          :columns="eventListDef"
          :data="eventList"
        ></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4"></Col>
          <Col span="20" style="text-align:right">
            <Page
              show-total
              show-sizer
              :current="searchOption.page_index"
              :total="eventCount"
              :page-size="searchOption.page_size"
              :page-size-opts="searchOption.page_size_opts"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
            ></Page>
          </Col>
        </Row>
      </div>
    </Card>
    <add-teacher-modal
      :is-show="showAddEventDialog"
      @eventList="geteventList"
      @closeModal="showAddEventDialog=false"
    ></add-teacher-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import addTeacherModal from "../modal-components/add-event-stat";
import moment from "moment";
export default {
  name: "event-list",
  components: {
    addTeacherModal
  },
  data() {
    return {
      showAddEventDialog: false,
      showEditTeacherDialog: false,
      addTeacherForm: {},
      eventListDef: [
        {
          title: "事件ID",
          key: "id",
          align: "center",
          width: 190
        },
        {
          title: "事件名称",
          key: "event_name",
          width: 190,
          align: "center"
        },

        {
          title: "事件描述",
          key: "event_desc",
          width: 190,
          align: "center"
        },
        {
          title: "渠道key",
          key: "channel_key",
          width: 190,
          align: "center"
        },
        {
          title: "渠道名称",
          key: "channel_name",
          width: 190,
          align: "center"
        },
        {
          title: "昨日触发数量",
          key: "yestodayCount",
          width: 190,
          align: "center"
        },
        {
          title: "今日触发数量",
          key: "todayCount",
          width: 190,
          align: "center"
        },
        {
          title: "添加时间",
          key: "createDate",
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
          fixed: "right",
          width: 120,
          align: "center",
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
                      this.$router.push({
                        path: `/evnetStatDetail?event_id=${params.row.id}`
                      });
                    }
                  }
                },
                "查看"
              )
            ];
            return h("div", arr);
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      eventList: state => state.eventStat.eventList,
      searchOption: state => state.eventStat.searchOption,
      eventListLoading: state => state.eventStat.eventListLoading,
      eventCount: state => state.eventStat.eventCount
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["geteventList"]),
    init() {
      if (this.eventList.length == 0) {
        this.geteventList();
      }
    },
    search(init) {
      if (init) {
        this.$store.commit("Evnet_setPageIndex", 1);
      }
      this.geteventList();
    },
    showAddTeacherDialogFun() {
      this.showAddEventDialog = true;
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("Evnet_setPageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("Evnet_setPageSize", pageSize);
        this.search();
      }
    },
    delTeacher(teacher_id) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认要删除吗？",
        onOk: () => {
          deleteTeacher({
            teacher_id: teacher_id
          }).then(res => {
            if (res.res_code == 1) {
              this.$Message.success("删除教师成功！");
            }
            this.geteventList();
          });
        }
      });
    },
    editTeacher(teacher_id) {
      this.showEditTeacherDialog = true;
    }
  }
};
</script>

<style>
.img img {
  border-radius: 50%;
}
</style>
