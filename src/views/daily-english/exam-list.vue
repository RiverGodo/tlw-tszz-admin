<template>
  <div class="page-content daily-english de-exam-list">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>每日英语</BreadcrumbItem>
      <BreadcrumbItem>练习管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="searchOption.grade_id" style="width:100px" @on-change="search(true)">
            <Option v-for="item in gradeListSelect" :value="item.grade_id" :key="item.grade_id">{{ item.name }}</Option>
          </Select>
          <Select class="margin-left-10" v-model="searchOption.exercise_type" style="width:100px" @on-change="search(true)">
            <Option v-for="item in examTypeListSelect" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
          </Select>
          <span class="margin-left-10">难度区间：</span>
          <InputNumber :max="1" :min="0" :step="0.01" v-model="searchOption.level_min"></InputNumber>
          <InputNumber :max="1" :min="0" :step="0.01" v-model="searchOption.level_max"></InputNumber>
          <div class="search-bar">
            <Input v-model="searchOption.exercise_name" placeholder="请输入练习名称..." style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          </div>
        </div>
        <div class="actions">
          <Button type="primary" @click="goAddExamPage()">创建练习</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前练习
          <span>（{{examCount?examCount:"0"}}）</span>
        </p>
        <Table ref="examList" :loading="examListLoading" :columns="examListDef" :data="examList"></Table>
        <div class="bottom-bar">
          <Page show-total show-sizer :current="searchOption.page_index" :total="examCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import moment from "moment";
import { delExercise } from "@/api/daily-english/exam";
export default {
  name: "exam-list-modal",
  data() {
    return {
      examListDef: [
        {
          title: "ID",
          key: "exercise_id",
          align: "center",
          width: 60
        },
        {
          title: "名称",
          key: "exercise_name",
          minWidth: 350,
          align: "left"
        },
        {
          title: "描述",
          key: "description",
          minWidth: 350,
          align: "left"
        },
        {
          title: "数据来源",
          key: "data_from",
          align: "left",
          width: 80
        },
        {
          title: "年级",
          key: "grade_id",
          align: "center",
          width: 60,
          render: (h, params) => {
            let type_arr = this.gradeListSelect.filter(
              e => e.grade_id == params.row.grade_id
            );
            return h("span", type_arr[0].name);
          }
        },
        {
          title: "难度",
          key: "level",
          align: "center",
          width: 60
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h('span', moment(params.row.create_time).format("YYYY-MM-DD HH:mm"));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "left",
          width: 180,
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
                    color: "#1975E0"
                  },
                  on: {
                    click: () => {
                      this.goAddExamPage(params.row.exercise_id);
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
                      this.goExamAnalysisPage(params.row.exercise_id);
                    }
                  }
                },
                "分析"
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
                      this.delExam(params.row.exercise_id);
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
      searchOption: state => state.deExam.searchOption,
      examList: state => state.deExam.examList,
      examListLoading: state => state.deExam.examListLoading,
      examCount: state => state.deExam.examCount
    }),
    ...mapGetters(["gradeListSelect", "examTypeListSelect"])
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getExamList"]),
    init() {
      if (this.examList.length == 0) {
        this.getExamList();
      }
    },
    goAddExamPage(eid) {
      if (eid) {
        this.$router.push({
          name: "DEAddExam",
          query: {
            eid: eid
          }
        });
      } else {
        this.$router.push({
          name: "DEAddExam"
        });
      }
    },
    goExamAnalysisPage(eid) {
      this.$router.push({
        name: "AnalysisExam",
        query: {
          eid: eid
        }
      });
    },
    delExam(eid) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认删除该练习吗？",
        onOk: res => {
          delExercise(eid).then(res => {
            if (res.res_code == 1) {
              this.$Message.success("练习删除成功！");
              this.getExamList();
            } else {
              this.$Message.error("练习删除失败！");
            }
          });
        }
      });
    },
    search(init) {
      if (this.searchOption.level_min > this.searchOption.level_max) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请输入正确的难度区间"
        });
        return;
      }
      if (init) {
        this.$store.commit("setExamPageIndex", 1);
      }
      this.getExamList();
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("setExamPageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("setExamPageSize", pageSize);
        this.search();
      }
    }
  }
};
</script>