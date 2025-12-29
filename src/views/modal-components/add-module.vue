<style lang="less">
.active_detail {
  font-size: 14px;
  .pad {
    padding: 10px;
  }
  .flex_card {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
    margin: 21px 0;
    .flex_item {
      width: 250px;
    }
  }
  .ivu-form-item-label {
    padding: 10px 0px 10px 0 !important;
  }
  .tap {
    font-size: 18px;
    line-height: 31px;
    font-weight: 600;
  }
  .mb-0 {
    width: 250px;
  }
  .form_item {
    width: 80%;
  }
  .no_exchange {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}
</style>

<template>
  <Modal
    class="common-dialog add-book-dialog active_detail"
    v-model="showModal"
    title="添加课程"
    width="1000"
    style="position: relative"
    :mask-closable="false"
  >
    <div style="padding-left:50px">
      <Row>
        <Col span="5">
          <Select v-model="searchOption.subject_id" placeholder="请选择学科" style="width:150px" @on-change="search({page_index:0})">
            <Option
              v-for="item in subjectListSelect"
              :value="item.subject_id"
              :key="item.subject_id"
            >{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="5">
          <Select v-model="searchOption.grade_id" placeholder="请选择年级" style="width:150px" @on-change="search({page_index:0})">
            <Option
              v-for="item in gradeListBaseSelect"
              :value="item.grade_id"
              :key="item.grade_id"
            >{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="5">
          <Input v-model="searchOption.title" placeholder="请输入课程名称" style="width: 150px"></Input>
        </Col>
        <Col span="5" offset="1">
          <Button class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          <Button class="btn_search" icon="ios-refresh" @click="searchReset(true)">重置</Button>
        </Col>
      </Row>
      <Table
        :loading="bookListLoading"
        :columns="bookListDef"
        :data="bookList"
        @on-selection-change="selectChange"
      ></Table>
      <Row class="bottom-bar" type="flex" justify="space-between">
        <Col span="4">
          <!-- <Button :loading="delBookLoading" type="ghost" @click="delBook">删除</Button> -->
        </Col>
        <Col span="20" style="text-align:right">
          <Page
            show-total
            show-sizer
            :current="searchOption.page_index+1"
            :total="bookCount"
            :page-size="searchOption.page_size"
            :page-size-opts="searchOption.page_size_opts"
            @on-page-size-change="pageSizeChange"
            @on-change="pageIndexChange"
          ></Page>
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button type="primary" @click="addBook" size="large">添加</Button>
    </div>
    <Spin fix v-if="loading"></Spin>
  </Modal>
</template>

<script>
import { getSubjectListForModule } from "@/api/add-discount-subject.js";
import { addModule } from "@/api/module-manage.js";
import { mapGetters } from "vuex";
export default {
  name: "addModule",
  props:{
    isShow:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      showModal: this.isShow,
      loading: false,
      searchOption: {
        grade_id: "",
        subject_id: "",
        title: "",
        type:3,
        page_index: 0,
        page_size: 20,
        page_size_opts: [10, 20, 50]
      },
      bookListLoading: false,
      bookListDef: [
        {
          type: "selection",
          width: 60,
          align: "left"
        },
        {
          title: "课程ID",
          key: "book_id",
          align: "left",
          width: 100
        },
        {
          title: "课程名称",
          key: "title",
          align: "left",
          minWidth: 200
        },
        {
          title: "学科",
          key: "subject_name",
          align: "left",
          width: 100
        },
        {
          title: "年级",
          key: "grade_id",
          align: "left",
          width: 60,
          render: (h, params) => {
            let grade = params.row.grade_id == 9 ? "高中" : "初中";
            return h("span", {}, grade);
          }
        },
        {
          title: "讲师",
          key: "teacher_name",
          align: "left",
          width: 100
        },
        {
          title: "课程权限",
          key: "role_id",
          align: "left",
          render: (h, params) => {
            let role =
              params.row.role_id == 0
                ? "全部用户可见"
                : params.row.role_id == 1
                ? "测试用户可见"
                : params.row.role_id == 2
                ? "编辑可见"
                : "";
            return h("span", {}, role);
          }
        }
      ],
      bookList: [],
      bookCount: 0,
      bookToAddList:[]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.search();
    },
    search(params={}) {
      let payload = Object.assign(this.searchOption, params);
      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          const element = payload[key];
          if (!element) {
            delete payload.key;
          }
        }
      }
      getSubjectListForModule(payload).then(res => {
        if (res.res_code == 1) {
          let ads = []
           for (let i = 0; i < res.msg.length; i++) {
            if (res.msg[i].state == 1) {
              ads.push(res.msg[i])
            }
          }
          this.bookList = ads;
          this.bookCount = res.total_count;
        }
      });
    },
    searchReset() {
      this.searchOption = {
        grade_id: "",
        subject_id: "",
        title: "",
        type:3,
        page_index: 0,
        page_size: 20,
        page_size_opts: [10, 20, 50]
      };
      this.search();
    },
    selectChange(param) {
      this.bookToAddList = []
      param.forEach(item => {
        this.bookToAddList.push({
          module_type:1,
          element_id:item.book_id,
          element_type:1
        })
      })
    },
    pageSizeChange(size) {
       this.searchOption.page_size = size
       this.search();
    },
    pageIndexChange(pageIndex) {
      this.searchOption.page_index = pageIndex - 1
      this.search();
    },
    addBook(){
      if(this.bookToAddList.length === 0){
        this.$Message.error("请先选择课程")
        return
      }
      let param = {
        params:this.bookToAddList
      }
      addModule(param).then(res=>{
        if(res.res_code === 1){
          this.$Message.success("添加成功")
          this.bookToAddList = []
          this.showModal = false
          this.$emit('reSearch')
        }else{
          this.$Message.error("添加失败")
        }
      })
    }
  },
  computed: {
    ...mapGetters(["subjectListSelect", "gradeListBaseSelect"])
  },
  watch:{
    isShow: function(value) {
      //点击添加课程
      if (value) {
        this.showModal = value;
        this.init();
      }
    },
    showModal: function(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  }
};
</script>

<style>
</style>