<style lang="less">
.common-dialog.qrcode-modal {
  .ivu-modal {
    min-width: 200px;
    .ivu-modal-body {
      text-align: center;
    }
  }
}
</style>
<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>图书管理</BreadcrumbItem>
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
          <Select v-model="searchOption.has_ex" style="width:100px" @on-change="search(true)">
            <Option v-for="item in bookExStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.has_verify_code" style="width:100px" @on-change="search(true)">
            <Option v-for="item in bookVerifyCodeStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.has_online_test" style="width:120px" @on-change="search(true)">
            <Option v-for="item in bookOnlineTestStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>

          <Select v-model="searchOption.questionnaire_id" style="width:120px" @on-change="search(true)">
            <Option v-for="item in questionnaireStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.has_happy_buy" style="width:120px" @on-change="search(true)">
            <Option v-for="item in happybuyStateList" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <Select v-model="searchOption.role_id" style="width:120px" @on-change="search(true)">
            <Option v-for="item in role_idSelectList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
          <Select v-model="searchOption.state" style="width:100px" @on-change="search(true)">
            <Option v-for="item in stateListSelect" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <div class="search-bar">
            <Input v-model="searchOption.title" placeholder="请输入图书名称" style="width: 200px"></Input>
            <Input v-model="searchOption.book_id" placeholder="请输入图书ID" style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          </div>
        </div>
        <div class="actions" style="flex: 0 0 100px;">
          <Button type="primary" icon="android-add" @click="showAddBookDialogFun(-1)">添加图书</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>当前图书&nbsp;（
          <span>{{bookCount}}</span>）&nbsp;本，&nbsp;已选（
          <span>{{all_book_id_arr.length}}</span>）</p>
        <Table :loading="bookListLoading" :columns="bookListDef" :data="bookList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">
          <Button :loading="delBookLoading" type="ghost" @click="delBook">删除</Button>
          </Col>
          <Col span="20" style="text-align:right">
          <Page show-total show-sizer :current="searchOption.page_index" :total="bookCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col>
        </Row>
      </div>
    </Card>
    <add-book-modal :is-show="showAddBookDialog" :book-id="book_id" @closeModal="showAddBookDialog=false" @refreshList="getBookList"></add-book-modal>
    <Modal class="common-dialog qrcode-modal" title="图书二维码" v-model="showQrCode">
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
import { mapActions, mapState, mapGetters } from "vuex";
import addBookModal from "../modal-components/add-book.vue";
import qrcode from "@xkeshi/vue-qrcode";
import Cookie from 'js-cookie';
import moment from "moment";
export default {
  name: "bookList",
  components: {
    addBookModal,
    qrcode
  },
  data() {
    return {
      selectAuths: [],//已选择图书作者列表
      showAddBookDialog: false,
      book_id: -1,
      showQrCode: false,
      book_id_arr: [],
      qrCodeUrl: "",
      filename: "",
      delBookLoading: false,
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
          minWidth: 260,
          align: "left"
        },
        {
          title: "学科",
          key: "subject_name",
          width: 80,
          align: "center"
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
            return h("span", str);
          }
        },
        {
          title: "适用版本",
          key: "version_years",
          width: 100,
          align: "center",
          render: (h, params) => {
            var str =
              params.row.version_years > 0 ? params.row.version_years : "无";
            return h("span", str);
          }
        },
        /* {
          title: "实际价格",
          width: 60,
          align: "center",
          key: "price"
        },
        {
          title: "原始价格",
          width: 60,
          align: "center",
          key: "original_price"
        },
        {
          title: "可用积分",
          width: 60,
          align: "center",
          key: "point_price"
        }, */
        {
          title: "增值数量",
          width: 80,
          key: "resource_count",
          align: "center",
          render: (h, params) => {
            if (params.row.has_ex == 1) {
              return [
                h(
                  "span",
                  {
                    style: {
                      color: "#00a874"
                    }
                  },
                  "有"
                ),
                h(
                  "span",
                  {
                    style: {
                      color:
                        params.row.resource_count == 0 ? "#ed3f14" : "#00a874"
                    }
                  },
                  "（" + params.row.resource_count + "）"
                )
              ];
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#ed3f14"
                  }
                },
                "无"
              );
            }
          }
        },
        {
          title: "验证码",
          key: "has_verify_code",
          width: 80,
          align: "center",
          render: (h, params) => {
            let str = "";
            let obj = {
              style: {
                color: params.row.has_verify_code > 0 ? "#00a874" : "#ed3f14"
              }
            };
            switch (params.row.has_verify_code) {
              case 0:
                str = "无";
                break;
              case 1:
                str = "验证码";
                break;
              case 2:
                str = "兑换码";
                break;
            }
            return h("span", obj, str);
          }
        },
        {
          title: "在线测评",
          key: "has_online_test",
          width: 80,
          align: "center",
          render: (h, params) => {
            let testCount = params.row.online_test_bind_count
              ? "(已绑)"
              : "(未绑)";
            if (params.row.has_online_test == 1) {
              if (params.row.online_test_bind_count) {
                return h(
                  "span",
                  {
                    style: {
                      color: "#00a874"
                    }
                  },
                  "有" + testCount
                );
              } else {
                return [
                  h(
                    "span",
                    {
                      style: {
                        color: "#00a874"
                      }
                    },
                    "有"
                  ),
                  h(
                    "span",
                    {
                      style: {
                        color: "#ed3f14"
                      }
                    },
                    testCount
                  )
                ];
              }
            } else if (params.row.has_online_test == 2) {
              return h(
                "span",
                {
                  style: {
                    color: "#00a874"
                  }
                },
                "智能辅导"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#ed3f14"
                  }
                },
                "无"
              );
            }
          }
        },
        {
          title: "有奖问卷",
          key: "questionnaire_id",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h('span', params.row.questionnaire_id > 0 ? '有' : '无')
          }
        },
        {
          title: '欢乐购',
          key: 'has_happy_buy',
          width: 80,
          align: 'center',
          render: (h, params) => {
            let obj = {
              style: {
                color: params.row.has_happy_buy == 0 ? '#ed3f14' : '#00a874'
              }
            }
            return h('span', obj, params.row.has_happy_buy == 0 ? '无' : '有')
          }
        },
        {
          title: "图书权限",
          key: "role_id",
          width: 100,
          align: "center",
          render: (h, params) => {
            let obj = {
              style: {
                color: params.row.role_id == 0 ? "#00a874" : "#ed3f14"
              }
            }
            let str = "";
            let role_arr = this.role_idSelectList.filter(item => item.value === params.row.role_id)
            if (role_arr.length) {
              str = role_arr[0].label
            }
            return h('span', obj, str)
          }
        },
        {
          title: "状态",
          key: "state",
          width: 80,
          align: "center",
          render: (h, params) => {
            let state_arr = this.stateListSelect.filter(
              e => e.state == params.row.state
            );
            let obj = {
              style: {
                color: params.row.state == 1 ? "#00a874" : "#ed3f14"
              }
            };
            return h("span", obj, state_arr[0].name);
          }
        },
        {
          title: '是否置顶',
          key: 'top',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.top > 0 ? "是" : "否")
          }
        },
        {
          title: "创建者",
          key: 'author',
          width: 100,
          align: 'center'
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 100,
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
          fixed: 'right',
          width: 340,
          render: (h, params) => {
            let stateStr = "";
            switch (params.row.state) {
              case 0:
                stateStr = "已下架";
                break;
              case 1:
                stateStr = "已上架";
                break;
              case 2:
                stateStr = "兑换后可见";
                break;
            }
            let items = ["下架", "上架", "兑换后可见"];
            let dropdownItems = items.map((item, idx) => {
              return h("DropdownItem", { props: { name: idx } }, item);
            });
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
                      this.setTop(params.row.book_id)
                    }
                  }
                },
                '置顶'
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
                      this.cancelTop(params.row.book_id, params.row.top)
                    }
                  }
                },
                '取消置顶'
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
                "Dropdown",
                {
                  props: {
                    trigger: "click",
                    transfer: true
                  },
                  style: {
                    margin: "0 5px"
                  },
                  on: {
                    "on-click": state => {
                      this.setBookeState(params.row.book_id, state);
                    }
                  }
                },
                [
                  h("a", [
                    stateStr,
                    h("Icon", {
                      props: {
                        type: "arrow-down-b"
                      }
                    })
                  ]),
                  h(
                    "DropdownMenu",
                    {
                      slot: "list"
                    },
                    dropdownItems
                  )
                ]
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
                      this.filename =
                        params.row.version_years +
                        "_" +
                        params.row.grade[0].grade_name +
                        "_" +
                        params.row.subject_name +
                        "_" +
                        params.row.title +
                        ".jpg";
                      this.qrCodeUrl =
                        "https://m.tl100.com/q?bid=" + params.row.book_id;
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
      ]
    };
  },
  computed: {
    ...mapState({
      cityListDef: state => state.app.cityList,
      searchOption: state => state.book.searchOption,
      bookVerifyCodeStateList: state => state.book.bookVerifyCodeStateList,
      bookOnlineTestStateList: state => state.book.bookOnlineTestStateList,
      questionnaireStateList: state => state.book.questionnaireStateList,
      happybuyStateList: state => state.book.happybuyStateList,
      bookExStateList: state => state.book.bookExStateList,
      bookList: state => state.book.bookList,
      bookListLoading: state => state.book.bookListLoading,
      bookCount: state => state.book.bookCount
    }),
    ...mapGetters([
      "stateListSelect",
      "yearsListSelect",
      "subjectListSelect",
      "gradeListBaseSelect",
      "role_idSelectList"
    ]),
    all_book_id_arr() {
      let id_arr = [];
      let auth_arr = [];
      this.book_id_arr.forEach(e => {
        id_arr.push(e.id)
        auth_arr.push(e.auth)
      });
      this.selectAuths = new Set([...auth_arr])
      return id_arr;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name !== 'book_resource_list') {
        vm.$store.commit("Book_setSearchForm", {//初始化搜索条件
          has_online_test: -1,
          questionnaire_id: -1,
          has_happy_buy: -1,
          category_id: 0,
          years: 0,
          state: -1,
          grade_id: 0,
          subject_id: 0,
          has_verify_code: -1,
          has_ex: -1,
          title: "",
          role_id: -1,
          book_id:''
        })
      }
    });
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getBookList"]),
    init() {
      //没有列表内容，则去获取

      if (this.searchOption.type == 3) {
        this.$store.commit("Book_setSearchForm", {
          type: 2
        });
        this.getBookList(this.book_id_arr);
      } else {
        if (this.bookList.length == 0) {
          this.getBookList(this.book_id_arr);
        }

        if (this.searchOption.has_verify_code != 0) {
          this.$store.commit("Book_setSearchForm", {
            type: 2
          });
          this.getBookList(this.book_id_arr);
        }
      }
    },
    search(init) {
      if (init) {
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
      var str = state == 0 ? "下架" : state == 1 ? "上架" : "兑换后可见";
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认" + str + "该图书吗？",
        onOk: res => {
          apiBook
            .setBookState({
              book_id: book_id,
              state: state
            })
            .then(res => {
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
    download() {
      let type = "image/jpeg";
      let c = document.getElementsByTagName("canvas");
      let img = c[0].toDataURL(type);
      img = img.replace(type, "image/octet-stream");
      let save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = img;
      save_link.download = this.filename;
      let event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
    },
    selectChange(selection) {
      let arr = [];
      for (let index = 0; index < selection.length; index++) {
        const element = selection[index];
        arr.push({
          id: element.book_id,
          auth: element.author
        })
      }
      this.book_id_arr = arr;
    },
    delBook() {
      let userInfo = JSON.parse(Cookie.get('userInfo'));
      if (this.all_book_id_arr.length == 0) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请选择要删除的图书！"
        });
      } else {
        //非创建者无法删除图书
        if ((this.selectAuths.size > 1 && !userInfo.role_arr.includes(1)) || !this.selectAuths.has(userInfo.name)) {
          this.$Message.error('非创建者无法删除，请联系创建者或管理员')
          return
        }
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
    },
    setTop(book_id) {//置顶
      apiBook.setTop(book_id).then(res => {
        if (res.res_code == 1) {
          this.$Message.success('置顶成功')
          this.search()
        }
      })
    },
    cancelTop(book_id, top) {//取消置顶
      if (top == 0) {
        this.$Message.warning('无需取消置顶')
        return
      }
      apiBook.cancelTop(book_id).then(res => {
        if (res.res_code == 1) {
          this.$Message.success('已取消置顶')
          this.search()
        }
      })
    }
  }
};
</script>