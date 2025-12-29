<template>
  <div class="verification-code page-content">
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="codeCategorySearchForm.state" style="width:100px" @on-change="search">
            <Option v-for="item in codeCategorySelect" :key="item.state" :value="item.state">{{item.name}}</Option>
          </Select>
          <Select v-model="codeCategorySearchForm.type" style="width:150px" @on-change="search">
            <Option v-for="item in codeCategoryTypeSelect" :key="item.type_id" :value="item.type_id">{{item.type_name}}</Option>
          </Select>
          <Input placeholder="请输入邀请码标题" v-model="codeCategorySearchForm.title" style="width: 200px"></Input>
          <Button type="primary" class="btn_search" icon="ios-search" @click="search">查询</Button>
          <div class="search-bar">
            <Input placeholder="请输入验证码..." v-model="code" style="width: 200px"></Input>
            <Button type="primary" :loading="codeLogLoading" class="btn_search" icon="ios-search" @click="searchCodeLog">查询验证码使用记录</Button>
          </div>
        </div>
        <div class="actions">
          <Button type="primary" @click="gotoAddVeri" style="margin-right:40px;">生成邀请码</Button>
        </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>所有批次&nbsp;（
          <span>{{codeCategoryCount}}</span>）&nbsp;批,&nbsp;已选（
          <span>{{all_code_id_arr.length}}</span>）</p>
        <Table :loading="codeCategoryListLoading" :columns="categoryListColumns" :data="codeCategoryList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">
            <Button :loading="delCodeLoading" type="ghost" @click="delCode">删除</Button>
          </Col>
          <Col span="20" style="text-align:right">
          <Page show-total show-sizer :current="codeCategorySearchForm.page_index" :total="codeCategoryCount" :page-size="codeCategorySearchForm.page_size" :page-size-opts="codeCategorySearchForm.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
          </Page>
          </Col> 
        </Row>
      </div>
    </Card>
    <Modal v-model="donwloadModal" title="下载列表" @on-cancel="donwloadModal = false">
      <Row :key="index" v-for="(item, index) in downloadFiles" type="flex" justify="center" style="margin-bottom: 10px">
        <Col :span="18">{{item.filename}}</Col>
        <Col :span="6" style="text-align: right">
        <a :href="item.url" download>下载</a>
        </Col>
      </Row>
    </Modal>
    <code-log-modal :is-show="codeLogModal" :value="code" @closeModal="codeLogModal=false">></code-log-modal>
  </div>
</template>
<script>
import moment from "moment";
import { mapState, mapActions, mapGetters } from "vuex";
import codeLogModal from "../modal-components/code-log";
import {
  updateCodeCategory,
  setCodeCategoryState
} from "../../api/codeCategory";

export default {
  components: {
    codeLogModal
  },
  data() {
    return {
      code: "",
      donwloadModal: false,
      codeLogModal: false,
      delCodeLoading:false,
      code_category_ids:[],
      categoryListColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 60
        },
        {
          title: "邀请码标题",
          key: "name",
          minWidth: 280,
          render: (h, params) => {
            let name = params.row.name;
            if (this.codeCategorySearchForm.title) {
              let reg = new RegExp(this.codeCategorySearchForm.title, 'i');
              let str = name.match(reg);
              name = params.row.name.replace(reg, `<em class="highlight">${str}</em>`)
            }
            return h('div', {
              domProps: {
                innerHTML: name
              }
            })
          }
        },
        {
          title: '邀请码类型',
          align: 'center',
          key: 'type',
          width: 100,
          render: (h, params) => {
            let str = ''
            let typeList = this.codeCategoryTypeSelect
            for (const item of typeList) {
              if (item.type_id == params.row.type) {
                str = item.type_name
              }
            }
            console.log(str)
            return h('span', str)
          }
        },
        {
          title: "邀请码数量",
          align: "center",
          key: "count",
          minWidth: 120
        },
        {
          title: "生效时间",
          key: "start_time",
          minWidth: 120,
          render: (h, params) =>
            h("span", moment(params.row.start_time).format("YYYY-MM-DD"))
        },
        {
          title: "失效时间",
          key: "end_time",
          minWidth: 120,
          render: (h, params) =>
            h("span", moment(params.row.end_time).format("YYYY-MM-DD"))
        },
        {
          title: "状态",
          key: "state",
          width: 80,
          render: (h, params) => {
            let msg = params.row.state > 0 ? "生效" : "失效";
            let obj = {
              style: {
                color: params.row.state > 0 ? "#00a874" : "#ed3f14"
              }
            };
            return h("span", obj, msg);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 250,
          render: (h, params) => {
            var str = params.row.state < 0 ? "立即生效" : "立即失效";
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0",
                    width: "100px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: `/Verification/CheckVerification/?code_category_id=${
                          params.row.id
                          }`
                      });
                    }
                  }
                },
                "查看详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0",
                    width: "100px"
                  },
                  on: {
                    click: () => {
                      let p = params.row;
                      p.state = p.state > 0 ? -1 : 1;
                      this.updateCodeCategoryDef(p);
                    }
                  }
                },
                str
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0",
                    width: "100px"
                  },
                  on: {
                    click: () => {
                      this.$store.commit("set_code_search_form", {
                        code_category_id: params.row.id
                      });
                      this.getCodeList();
                      this.donwloadModal = true;
                    }
                  }
                },
                "下载文件"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#1975E0",
                    width: "100px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: `/Verification/usedCodeList/?code_category_id=${
                          params.row.id
                          }`
                      });
                    }
                  }
                },
                "查看使用记录"
              )
            ]);
          }
        }
      ],
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters(["downloadFiles"]),
    ...mapState({
      codeLogLoading: state => state.codeCategory.codeLogLoading,
      codeCategoryList: state => state.codeCategory.codeCategoryList,
      codeCategoryListLoading: state => state.codeCategory.codeCategoryListLoading,
      codeCategorySelect: state => state.codeCategory.codeCategorySelect,
      codeCategoryCount: state => state.codeCategory.codeCategoryCount,
      codeCategorySearchForm: state => state.codeCategory.codeCategorySearchForm,
      codeCategoryTypeSelect: state => {
        let arr = [...state.codeCategory.codeCategoryTypeList]
        let extension = [
          {
            type_id: -1,
            type_name: '选择类型'
          },
          {
            type_id: 0,
            type_name: '默认分类'
          }
        ]
        arr = extension.concat(arr)
        return arr
      }
    }),
    all_code_id_arr() {
      let id_arr = [];
      // console.log(this.code_id_arr )
      this.code_category_ids.forEach(e => {
        id_arr.push(e.id)
      });
      return id_arr;
    }
  },
  methods: {
    ...mapActions(["getCodeList", "getCodeCategoryList", "getCodeCategoryTypeList"]),
    search() {
      this.getCodeCategoryList()
    },
    // 前往生成验证码
    gotoAddVeri() {
      this.$router.push({
        path: "/Verification/AddVerification"
      });
    },
    // 设置是否有效
    updateCodeCategoryDef(data) {
      data.code_category_id = data.id;
      updateCodeCategory(data)
        .then(res => {
          if (res.res_code == 1) {
            this.$Message.success("设置成功！");
          } else {
            this.$Message.error("设置失败！");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 初始化
    init() {
      this.getCodeCategoryTypeList()
      this.getCodeCategoryList()
    },
    //查询验证码使用情况
    searchCodeLog() {
      if (!this.code) {
        this.$Message.error("请输入验证码");
        return;
      }
      this.codeLogModal = true;
    },
    pageIndexChange(page) {
      if (page != this.codeCategorySearchForm.page_index) {
        this.$store.commit("set_code_category_search_form", {
          page_index: page
        });
        this.getCodeCategoryList();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.codeCategorySearchForm.page_size) {
        this.$store.commit("set_code_category_search_form", {
          page_size: pageSize
        });
        this.getCodeCategoryList();
      }
    },
    selectChange(selection) {
      let arr = [];
      for (let index = 0; index < selection.length; index++) {
        const element = selection[index];
        arr.push({
          id: element.id
        })
      }
      this.code_category_ids = arr;
      console.log(this.code_category_ids);
    },
    //删除兑换码
    delCode(){
      if(this.all_code_id_arr==0){
        this.$Modal.warning({
          title: "提示信息",
          content: "请选择要删除的兑换码！"
        });
      }else{
        this.$Modal.confirm({
          title: "提示信息",
          content: "确认要删除吗？",
          onOk: () => {
            this.delCodeLoading = true;
            setCodeCategoryState({
              code_category_ids:this.all_code_id_arr,
              state:-2
            }).then(res => {
              this.delBookLoading = false;
              console.log(res);
              if (res.res_code == 1) {
                this.code_id_arr = [];
                this.getCodeCategoryList(this.code_id_arr);
                this.$Message.success("删除兑换码成功！");
              } else {
                this.$Message.error("删除兑换码失败！");
              }
            });
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.verification-code {
  .operation {
    margin-bottom: 20px;
  }
  .pagination-wrapper {
    margin-top: 20px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 100%;
  }
}
</style>
