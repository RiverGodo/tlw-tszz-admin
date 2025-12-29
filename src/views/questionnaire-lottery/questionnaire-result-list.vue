<style lang="less">
.common-dialog.qrcode-modal{
  .ivu-modal{
    min-width: 200px;
    .ivu-modal-body{
      text-align: center;
    }
  }
}
</style>
<template>
    <div class="page-content">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>有奖反馈</BreadcrumbItem>
            <BreadcrumbItem>问卷列表</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <Select v-model="searchOption.years" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in yearsListSelect" :value="item.year_id" :key="item.year_id">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="searchOption.grade_id" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in gradeListBaseSelect" :value="item.grade_id" :key="item.grade_id">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="searchOption.subject_id" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in subjectListSelect" :value="item.subject_id" :key="item.subject_id">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="searchOption.has_verify_code" style="width:100px" @on-change="search(true)">
                      <Option v-for="item in bookVerifyCodeStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="searchOption.has_online_test" style="width:120px" @on-change="search(true)">
                      <Option v-for="item in bookOnlineTestStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="searchOption.state" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in stateListSelect" :value="item.state" :key="item.state">{{ item.name }}</Option>
                    </Select>
                    <div class="search-bar">          
                      <Input v-model="searchOption.title" placeholder="请输入图书名称" style="width: 200px"></Input>
                      <Button type="primary" class="btn_search"  icon="ios-search" @click="search(true)">查询</Button>
                    </div>
                </div>
                <div class="actions" style="flex: 0 0 100px;">
                    <Button type="primary" icon="android-add" @click="showAddBookDialogFun(-1)">添加图书</Button>
                </div>
            </div>
            <div class="list">
              <p class="list-info"><Icon type="ios-book"></Icon>当前图书&nbsp;（<span>{{bookCount}}</span>）&nbsp;本，&nbsp;已选（<span>{{all_book_id_arr.length}}</span>）</p>
              <Table :loading="bookListLoading" :columns="bookListDef" :data="bookList"
                @on-selection-change="selectChange"></Table>
              <Row class="bottom-bar" type="flex" justify="space-between">
                <Col span="4">
                    <Button :loading="delBookLoading" type="ghost" @click="delBook" >删除</Button>
                </Col>
                <Col span="20" style="text-align:right">
                  <Page 
                    show-total 
                    show-sizer
                    :current="searchOption.page_index"
                    :total="bookCount"
                    :page-size="searchOption.page_size"
                    :page-size-opts="searchOption.page_size_opts" 
                    @on-page-size-change="pageSizeChange" 
                    @on-change="pageIndexChange" >
                  </Page>
                </Col>
              </Row>
            </div>
        </Card>
        <add-book-modal 
        :is-show="showAddBookDialog"
        :book-id="book_id"
        @closeModal="showAddBookDialog=false"
        @refreshList="getBookList"
        ></add-book-modal>
        <Modal class="common-dialog qrcode-modal"  title="图书二维码" v-model="showQrCode">
            <qrcode :value="qrCodeUrl" :options="{ size: 300,padding:10 }"></qrcode>
            <div slot="footer">
                <Button @click="showQrCode = false">关闭</Button>
                <Button type="primary" @click="download">下载</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import * as apiBook from "@/api/book";
import { mapActions, mapState } from "vuex";
import addBookModal from "../modal-components/add-book.vue";
import qrcode from '@xkeshi/vue-qrcode'
import moment from "moment";
export default {
  name: "bookList",
  components: {
    addBookModal,
    qrcode
  },
  data() {
    return {
      showAddBookDialog:false,
      book_id:-1,
      showQrCode:false,
      book_id_arr:[],
      qrCodeUrl:"",
      filename:"",
      delBookLoading:false,
      bookListDef: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          key: "book_id",
          align: "center",
          width: 60
        },
        {
          title: "图书名称",
          key: "title",
          width: 350,
          align: "left"
        },
        {
          title: "学科",
          key: "subject_name",
          width: 80,          
          align: "center",
        },
        {
          title: "年级",
          key: "grade",
          width: 80,          
          align: "center",
          render: (h, params) => {
            var str = "无";
            if (params.row.grade && params.row.grade.length > 0) {
              str = params.row.grade[0].grade_name;
            }
            return str;
          }
        },
        {
          title: "适用版本",
          key: "version_years",
          width: 100,          
          align: "center",
        },
        {
          title: "增值数量",
          width: 80,          
          key: "resource_count",
          align: "center",
        },
        {
          title: "验证码",
          key: "has_verify_code",
          width: 80,          
          align: "center",
          render: (h, params) => {
            if(params.row.has_verify_code == 1){
              return h("span",{
                  style: {
                    color: "#00a874"
                  }
              },"有");
            }else{
              return h("span",{
                  style: {
                    color: "#ed3f14"
                  }
              },"无");
            }
          }
        },
        {
          title: "在线测评",
          key: "has_online_test",
          width: 80,          
          align: "center",
          render: (h, params) => {
            let testCount = params.row.online_test_bind_count ? "(已绑)":"(未绑)";
            if(params.row.has_online_test == 1){
              if(params.row.online_test_bind_count){
                return h("span",{
                  style: {
                    color: "#00a874"
                  }
              },"有"+testCount);
              }else{
                return [h("span",{
                    style: {
                      color: "#00a874"
                    }
                },"有"),h("span",{
                    style: {
                      color: "#ed3f14"
                    }
                },testCount)];
              }  
            }else{
              return h("span",{
                  style: {
                    color: "#ed3f14"
                  }
              },"无");
            }
          }
        },
        {
          title: "状态",
          key: "state",
          width: 80,          
          align: "center",
          render: (h, params) => {
              let state_arr = this.stateListSelect.filter( e => e.state == params.row.state);
              if(params.row.state == 1){
              return h("span",{
                  style: {
                    color: "#00a874"
                  }
              },state_arr[0].name);
            }else{
              return h("span",{
                  style: {
                    color: "#ed3f14"
                  }
              },state_arr[0].name);
            }
          }
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 100,
          render: (h, params) => {
            return moment(params.row.create_time).format("YYYY-MM-DD");
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 230,
          render: (h, params) => {
            var stateStr = params.row.state == 0 ? "取消下架" : "取消上架";
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
                        name: "book_resource_list",
                        params: {
                          book_id: params.row.book_id
                        }
                      });
                    }
                  }
                },
                "查看增值"
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
                      this.showAddBookDialogFun(params.row.book_id);
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
                      this.setBookeState(params.row.book_id, params.row.state);
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
                      this.filename = params.row.version_years+
                      "_"+params.row.grade[0].grade_name+
                      "_"+params.row.subject_name+
                      "_"+params.row.title+".jpg";
                      this.qrCodeUrl = "https://m.tl100.com/q?bid="+params.row.book_id;
                      this.showQrCode = true;
                    }
                  }
                },
                "二维码"
              )
            ];
            // if(params.row.has_verify_code == 0){
            //   arr.splice(3);
            // }
            return h("div", arr);
          }
        }
      ],
    };
  },
  computed: {
    ...mapState({
      subjectListSelect: state => state.app.subjectListSelect,
      yearsListSelect: state => state.app.yearsListSelect,
      gradeListBaseSelect: state => state.app.gradeListBaseSelect,
      cityListDef: state => state.app.cityList,
      searchOption: state => state.book.searchOption,
      stateListSelect: state => state.app.stateListSelect,
      bookVerifyCodeStateList: state => state.book.bookVerifyCodeStateList,
      bookOnlineTestStateList: state => state.book.bookOnlineTestStateList,
      bookList: state => state.book.bookList,
      bookListLoading: state => state.book.bookListLoading,
      bookCount: state => state.book.bookCount
    }),
    all_book_id_arr(){
      let id_arr = [];
      this.book_id_arr.forEach( e =>{
        id_arr = id_arr.concat(e);
      })
      return id_arr;
    } 
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getBookList"]),
    init() {
      //没有列表内容，则去获取
      if (this.bookList.length == 0) {
        this.getBookList(this.book_id_arr);
      }
    },
    search(init) {
      if(init){
        this.$store.commit("Book_setPageIndex", 1);
        this.book_id_arr = [];
      }
      this.getBookList(this.book_id_arr);
    },
    pageIndexChange(page) {
      if (page != this.searchOption.page_index) {
        this.$store.commit("Book_setPageIndex", page);
        this.search();        
      }
      
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.searchOption.page_size) {
        this.$store.commit("Book_setPageSize", pageSize);       
        this.search();        
      }
      
    },
    setBookeState(book_id, state) {
      var str = state == 0 ? "取消下架" : "取消上架";
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该图书吗？",
        onOk: res => {
          apiBook.setBookState(book_id).then(res =>{
            if (res.res_code == 1) {
              this.getBookList(this.book_id_arr);
            }
          });
        }
      });
    },
    showAddBookDialogFun(book_id) {
      this.book_id = book_id;
      this.showAddBookDialog = true;
    },
    download(){
      let type ='image/jpeg';
      let c = document.getElementsByTagName('canvas');
      let img = c[0].toDataURL(type);
      img = img.replace(type,'image/octet-stream');
      let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = img;
      save_link.download = this.filename;
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
    },
    selectChange(selection) {
      let arr =[...this.book_id_arr];
      arr[this.searchOption.page_index] = selection.map(e => e.book_id);
      this.book_id_arr  = arr;
    },
    delBook(){
      if (this.all_book_id_arr.length == 0) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请选择要删除的图书！"
        });
      } else {
        this.$Modal.confirm({
          title: "提示信息",
          content: "确认要删除吗？",
          onOk: () => {
            this.delBookLoading = true;
              apiBook.delBook(this.all_book_id_arr).then(res => {
              this.delBookLoading = false;
              if (res.res_code == 1) {
                this.book_id_arr = [];
                this.getBookList(this.book_id_arr);
                this.$Message.success("删除图书成功！");
              } else {
                this.$Message.error("删除图书失败！");
              }
            });
          }
        });
      }
    }
  }
};
</script>