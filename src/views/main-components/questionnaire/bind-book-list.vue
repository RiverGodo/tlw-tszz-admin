<template>
    <Modal class="common-dialog" title="题目列表" width="400" v-model="bindBookListModal" @on-visible-change="visibleChange">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="top-bar">
        <div class="options">
          <Input placeholder="请输入图书名称" v-model="searchBindBookForm.title" style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
        </div>
      </div>
        <p style="margin-top: 20px">已绑定的图书</p>
        <Row class="has-bind-book-wrapper">
          <Row class="has-bind-book-item" type="flex" justify="center" align="middle" v-if="hasBindedBookList.length == 0">无</Row>
          <Row class="has-bind-book-item" type="flex" justify="center" align="middle" v-for="(item, index) in hasBindedBookList" :key="item.book_id">
            <Col span="16">{{index + 1}}. {{item.title}}</Col>
            <Col span="4">{{item.subject_name}}</Col>
            <Col span="4" style="text-align: right">
              <Button type="text" @click="handleCancleBind(item.book_id)">取消绑定</Button>
            </Col>
          </Row>
        </Row>
        <p class="list-info">已选（<span>{{has_selected_books}}</span>）</p>
        <Table :loading="bookListLoading" :columns="columns" :data="unBindBookList" height="460" @on-selection-change="selChange"></Table>
        <div class="page-size-wrapper">
          <Row type="flex" justify="end">
            <Page show-total :current="searchBindBookForm.page_index + 1" :total="unBindBookCount" :page-size="searchBindBookForm.page_size" @on-page-size-change="pageSizeChange"
                @on-change="pageIndexChange">
            </Page>
            </Row>
        </div>
        <div slot="footer">
            <Button type="primary" @click="bindToQuestionnaire(1)">保存</Button>
        </div>
    </Modal>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { setQuestionnaireBook } from "@/api/feedback";
import moment from "moment";

function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
export default {
  data() {
    return {
      bindBookList: [],
      bindBookListModal: false,
      questionnaire_id: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "left"
        },
        {
          title: "学科",
          key: "subject_name",
          width: 100,
          align: "left"
        },
        {
          title: "创建时间",
          key: "create_time",
          width: 150,
          align: "left",
          render: (h, params) => {
            return moment(params.row.create_time).format("YYYY-MM-DD");
          }
        }
      ],
      book_id_arr: [],
      has_selected_books: 0
    };
  },
  computed: {
    ...mapState({
      searchBindBookForm: state => state.book.searchBindBookForm,
      bookListLoading: state => state.book.bookListLoading,
      unBindBookList: state => state.book.unBindBookList,
      hasBindedBookList: state => state.book.hasBindedBookList,
      unBindBookCount: state => state.book.unBindBookCount,
      spinShow: state => state.book.spinShow
    })
  },
  methods: {
    ...mapActions(["getQuestionnaireBookListDef", "get_questionnaire_list"]),
    search(init) {
      if (init) {
        this.$store.commit("setBindBookForm", {title: this.searchBindBookForm.title, page_index: 0});
        this.book_id_arr = []
      }
      this.init()
    },
    visibleChange(v) {
      if (!v) {
        this.bindBookListModal = false;
        this.get_questionnaire_list();
      }
    },
    pageIndexChange(page) {
      if (page - 1 != this.searchBindBookForm.page_index) {
        this.$store.commit("setBindBookForm", {page_index: page - 1});
        this.getQuestionnaireBookListDef();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchBindBookForm.page_size) {
        this.$store.commit("setBindBookForm", {page_size: pageSize});
        this.getQuestionnaireBookListDef();
      }
    },
    openModal(v) {
      this.questionnaire_id = v;
      this.$store.commit("setBindBookForm", {title: ''});
      this.init();
      this.bindBookListModal = true;
    },
    init() {
      this.$store.commit("setBindBookForm", {questionnaire_id: this.questionnaire_id});
      this.getQuestionnaireBookListDef()
    },
    selChange(selection) {
      let needAdd = [];
      let needRemove = [];
      this.unBindBookList.forEach(function(element) {
        if (
          selection.find(selectitem => {
            return selectitem.book_id == element.book_id;
          })
        ) {
          needAdd.push(element.book_id);
        } else {
          needRemove.push(element.book_id);
        }
      }, this);
      needAdd.forEach(function(element) {
        if (!this.book_id_arr.find(id => {
            return id == element;
          })) {
          this.book_id_arr.push(element);
        }
      }, this);

      needRemove.forEach(function(element) {
        if (
          this.book_id_arr.find(id => {
            return id == element;
          })
        ) {
          removeByValue(this.book_id_arr, element);
        }
      }, this);

      this.has_selected_books = this.book_id_arr.length;
    },
    handleCancleBind(v){
      this.bindToQuestionnaire(0, v);
    },
    bindToQuestionnaire(type, bind_book_id_arr) {
      var book_id_arr;
      var total_book_id = [...new Set([...this.book_id_arr, ...this.hasBindedBookList.map(item => { return item.book_id })])]

      if(bind_book_id_arr){
        book_id_arr = total_book_id.filter(item => item !== bind_book_id_arr);
      } else {
        book_id_arr = total_book_id;
      }

      setQuestionnaireBook({
        questionnaire_id: this.questionnaire_id,
        book_id_arr
      })
        .then(res => {
          if (res.res_code === 1) {
            this.$Message.success(type === 1 ? "绑定成功!" : "解绑成功!");
            this.init();
            this.book_id_arr = []
            this.has_selected_books = 0
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.has-bind-book-wrapper{
  max-height: 200px;
  overflow: auto;
  margin-top: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  .has-bind-book-item{
    height: 40px;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-top: 1px solid #eee;
    padding-left: 15px;
    margin-top: -1px;
  }
}
</style>
