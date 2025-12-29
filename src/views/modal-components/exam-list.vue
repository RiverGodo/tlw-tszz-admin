<style lang="less">
.common-dialog.exam-list-modal {
  .ivu-modal {
      min-width: 900px;
  }
}
</style>

<template>
    <Modal class="common-dialog daily-english exam-list-modal"
        v-model="showModal"
        title="选择已有练习">
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
              <Input class="margin-left-10" v-model="searchOption.exercise_name" placeholder="请输入练习名称..." style="width: 200px"></Input>
              <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
            </div>
        </div>
        <div class="list exam-list" style="margin-top:20px;">
            <p class="list-info"><Icon type="ios-book"></Icon>当前练习<span>（{{examCount?examCount:"0"}}）</span></p>
            <Table 
            highlight-row
            ref="examList" 
            :loading="examListLoading" 
            :columns="examListDef" 
            :data="examList"
            @on-current-change="selectRow"></Table>
            <Row class="bottom-bar" type="flex" justify="space-between">
                <Col span="4">
                </Col>
                <Col span="20" style="text-align:right">
                  <Page 
                    show-total 
                    show-sizer
                    :current="searchOption.page_index"
                    :total="examCount"
                    :page-size="searchOption.page_size" 
                    :page-size-opts="searchOption.page_size_opts" 
                    @on-page-size-change="pageSizeChange" 
                    @on-change="pageIndexChange" >
                  </Page> 
                </Col>
            </Row>
        </div>
        <div slot="footer">
            <Button type="ghost" size="large" @click="showModal = false" >返回</Button>
            <Button type="ghost" size="large" >保存</Button>
        </div>
    </Modal>
</template>

<script>
import { mapActions, mapState,mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "examListModal",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal:false,
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
          align: "left"
        },
        {
          title: "描述",
          key: "description",
          width:200,
          align: "left"
        },
        {
          title: "年级",
          key: "grade_id",
          align: "center",
          width: 60,
          render: (h, params) => {
            if(!this.gradeListSelect) return "";
            let type_arr = this.gradeListSelect.filter(
              e => e.grade_id == params.row.grade_id
            );
            return type_arr[0].name;
          }
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 180,
          render: (h, params) => {
            return moment(params.row.create_time).format("YYYY-MM-DD HH:mm");
          }
        }
      ]
    };
  },
  watch: {
    isShow: function(value) {
      if (value) {
        this.showModal = value;
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
      searchOption: state => state.deExamModal.searchOption,
      examList: state => state.deExamModal.examList,
      examListLoading: state => state.deExamModal.examListLoading,
      examCount: state => state.deExamModal.examCount
    }),
    ...mapGetters(['gradeListSelect','examTypeListSelect'])
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getModalExamList"]),
    init() {
      if (this.examList.length == 0) {
        this.getModalExamList();
      }
    },
    search(init) {
      if(init){
        this.$store.commit("setModalExamPageIndex", 1);
      }
      this.getModalExamList();
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("setModalExamPageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("setModalExamPageSize", pageSize);
        this.search();
      }
    },
    selectRow(curr,old){
      this.$emit("selectExam",curr);   
      this.showModal = false;
    }
  }
};
</script>