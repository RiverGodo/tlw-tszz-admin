<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>板块管理</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <div class="search-bar">
            <Input v-model="searchOption.title" placeholder="请输入课程名称" style="width: 200px"></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
            <Button type="primary" class="btn_search" icon="ios-refresh" @click="reSearch(true)">重置</Button>
          </div>
        </div>
         <div class="actions" style="flex: 0 0 100px;">
            <Button type="primary" icon="android-add" @click="showAddBookDialog = true">添加课程</Button>
          </div>
      </div>
      <div class="list">
        <p class="list-info">
          <Icon type="ios-book"></Icon>推荐课程&nbsp;
        </p>
        <Table :loading="moduleListLoading" :columns="moduleListDef" :data="moduleList" @on-selection-change="selectChange"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
        <Col span="4">
          <!-- <Button :loading="delBookLoading" type="ghost" @click="delBook">删除</Button> -->
        </Col>
        <Col span="20" style="text-align:right">
          <Page
            show-total
            show-sizer
            :current="searchOption.page_index"
            :total="moduleListCount"
            :page-size="searchOption.page_size"
            :page-size-opts="searchOption.page_size_opts"
            @on-page-size-change="pageSizeChange"
            @on-change="pageIndexChange"
          ></Page>
        </Col>
      </Row>
      </div>
    </Card>
    <add-module :isShow="showAddBookDialog"  @reSearch="search" @closeModal="showAddBookDialog=false"></add-module>
  </div>
</template>

<script>
import * as moduleApi from "@/api/module-manage.js"
import addModule from "@/views/modal-components/add-module";
export default {
  data() {
    return {
      showAddBookDialog:false,
      searchOption:{
        title:'',
        element_type:1,
        page_index:1,
        page_size:20,
        page_size_opts:[10,20,50]
      },
      moduleListLoading:false,
      moduleListDef:[
        {
          title: "ID",
          key: "id",
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
          title: "讲师",
          key: "teacher_name",
          align: "left",
          width: 100
        },
        {
          title: "年级",
          key: "grade_name",
          align: "left",
          width: 60
        },
        
        {
          title: "适用版本",
          key: "version_years",
          align: "left",
          width: 100
        },
        {
          title: "实际价格",
          key: "price",
          align: "left",
          width: 100
        },
        {
          title: "原始价格",
          key: "original_price",
          align: "left",
          width: 100
        },
        {
          title: "可用学分",
          key: "point_price",
          align: "left",
          width: 100
        },
        {
          title: "返回学分",
          key: "return_point",
          align: "left",
          width: 100
        },
        {
          title: "课程权限",
          key: "role_id",
          align: "left",
          width: 150,
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
        },
        {
          title: "增值数量",
          key: "has_ex",
          align: "left",
          width: 100,
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
          align: "left",
          // width: 100,
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
          title: "操作",
          key: "id",
          fixed: 'right',
          align: "left",
          width: 150,
          render:(h,params)=>{
            return h('a',{
              on:{
                'click':()=>{
                  this.delCurrentModule(params.row)
                }
              }
            },'移出推荐课程')
          }
        },
        
      ],
      moduleList:[],
      moduleListCount:0
    };
  },
  components:{
    addModule:addModule
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      this.search()
    },
    search(){

      let params = Object.assign(this.searchOption,params)
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          console.log(element)
          if(!element){
            delete params.key
          }
        }
      }
      moduleApi.getModuleList(params).then(res=>{
        if(res.res_code == 1){
          this.moduleList = res.data.bookList
          this.moduleListCount = res.data.count
        }
      })
    },
    reSearch(){
      this.searchOption = {
        title:'',
        element_type:1,
        page_index:1,
        page_size:20,
        page_size_opts:[10,20,50]
      }
      this.search()
    },
    pageSizeChange(size){
      this.searchOption.page_size = size
      this.search()
    },
    pageIndexChange(pageIndex){
      this.searchOption.page_index = pageIndex 
      this.search()
    },
    selectChange(){},
    delCurrentModule(row){
      this.$Modal.confirm({
        title: "提示信息",
        content: "确认移除吗？",
        onOk: res => {
          moduleApi.delCurrentModule({id:row.id}).then(res=>{
            if(res.res_code === 1){
              this.$Message.success("移出成功")
              this.search()
            }else{
              this.$Message.error("移出失败")
            }
          })
        }
      });
    }
  }
};
</script>

<style>
</style>