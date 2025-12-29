<template>
    <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>优惠券列表</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar">
        <div class="options">
          <Select v-model="formdata.state" style="width:120px" @on-change="search(true)" placeholder="选择状态">
            <Option v-for="item in discountStateListSelect" :value="item.state" :key="item.state">{{ item.name }}</Option>
          </Select>
          <!-- <Select v-model="formdata.type" style="width:160px" @on-change="search(true)" placeholder="选择使用范围"> 
            <Option v-for="item in discountUserangeListSelect" :value="item.type" :key="item.type">{{ item.name }}</Option>
          </Select> -->
        </div>
        <div class="actions" style="flex: 0 0 100px;">
          <Button type="primary" icon="android-add" @click="showAddDiscountDialogFun">添加优惠券</Button>
        </div>
      </div>
      <div class="list">
          <p class="list-info">
            <Icon type="ios-book"></Icon>当前优惠券&nbsp;（
            <span>{{discountCount}}</span>）&nbsp;张
          </p>
        <Table ref="discountList" :loading="discountListLoading" :columns="discountListDef" :data="discountList"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4">  
          </Col>
          <Col span="20" style="text-align:right">
            <Page show-total show-sizer :current="searchOption.page_index" :total="discountCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts"  @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
            </Page>
          </Col>
        </Row>
      </div>
    </Card>
    <check-discount-modal :is-show="showCheckDiscountDialog" :coupon_id="coupon_id" @closeModal="showCheckDiscountDialog=false" @getCouponList="getCouponListEmit" :is_edit="is_edit"></check-discount-modal>
    <add-discount-modal :is-show="showAddDiscountDialog" :id="id"  @closeModal="showAddDiscountDialog=false" @getCouponList="getCouponListEmit"></add-discount-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import checkDiscountModal from "../modal-components/check-discount";
import addDiscountModal from "../modal-components/add-discount";
import {deleteCoupon}  from "@/api/book";
import moment from "moment";
export default {
    name:"discount-list",
    components: {
        checkDiscountModal,
        addDiscountModal
    },
    data(){
        return {
            showCheckDiscountDialog:false,
            showAddDiscountDialog:false,
            delDiscountLoading:false,
            is_edit: true,
            id:-1,
            coupon_id:0,
            addDiscountForm:{},
            formdata:{},
            discountListDef:[
                {
                    title: "ID",
                    key: "id",
                    minWidth: 60,
                    align: "center",
                },
                {
                    title: "优惠券名称",
                    key: "coupon_name",
                    minWidth: 250,
                    align: "left",
                },
                {
                    title: "使用门槛",
                    key: "limited_amount",
                    minWidth: 90,
                    align: "center",
                },
                {
                    title: "优惠金额",
                    key: "discount_amount",
                    minWidth: 90,
                    align: "center",
                },
                {
                    title: "使用范围",
                    key: "type",
                    minWidth: 90,
                    align: "center",
                    render:(h,params)=>{
                        let str = "";
                        switch (params.row.type) {
                            case 1:
                                str = "全科通用";
                                break;
                            case 2:
                                str = "限定单科";
                                break;
                            case 3:
                                str = "限定课程";
                                break;
                        }
                        return h("span",str);
                    }
                },
                {
                    title: "有效时间",
                    key: "time",
                    minWidth: 260,
                    align: "center",
                    render:(h,params)=>{
                        return h("span",moment(params.row.start_date).format("YYYY-MM-DD")+'至'+moment(params.row.end_date).format("YYYY-MM-DD"))
                    }
                },
                {
                    title: "总数",
                    key: "total_count",
                    minWidth: 60,
                    align: "center",
                },
                {
                    title: "已领取",
                    key: "get_count",
                    minWidth: 60,
                    align: "center",
                },
                {
                    title: "已使用",
                    key: "use_count",
                    minWidth: 60,
                    align: "center",
                },
                {
                    title: "状态",
                    key: "state",
                    minWidth: 120,
                    align: "center",
                    render:(h,params)=>{
                        let str = "";
                        switch (params.row.state) {
                            case 1:
                                str = "未上线";
                                break;
                            case 2:
                                str = "已上线";
                                break;
                            case 3:
                                str = "领取后可见";
                                break;
                        }
                        return h("span",str);
                    }
                },
                {
                    title: "添加人",
                    key: "author",
                    minWidth: 120,
                    align: "center",
                },
                {
                    title: "添加时间",
                    key: "subject",
                    align: "center",
                    minWidth: 200,
                    render:(h,params)=>{
                        return h("span",moment(params.row.create_time).format("YYYY-MM-DD hh:mm:ss"))
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right',
                    minWidth: 180,
                    render:(h,params)=>{
                        let arr=[h ("Button",
                            {
                                props:{
                                    type: "text",
                                    size: "small"
                                },
                                style: {
                                    color: "#1975E0"
                                },
                                on: {
                                    click: () => {
                                        this.showDiscountDialogFun(params.row,1);
                                    }
                                }
                            },"编辑"),
                            h ("Button",
                            {
                                props:{
                                    type: "text",
                                    size: "small"
                                },
                                style: {
                                    color: "#1975E0"
                                },
                                on: {
                                    click: () => {
                                        this.handleDelete(params.row);
                                    }
                                }
                            },"删除")
                        ]
                        if (params.row.state == 3) {
                            arr.push(h ("Button",
                            {
                                props:{
                                    type: "text",
                                    size: "small"
                                },
                                style: {
                                    color: "#1975E0"
                                },
                                on: {
                                    click: () => {
                                        this.showDiscountDialogFun(params.row,0);
                                    }
                                }
                            },"正版验证"))
                        }
                        return h("div", arr);
                    }
                },
            ]
        }
    },
    computed:{
        ...mapState({
            searchOption: state => state.discount.searchOption,
            discountStateList: state => state.discount.discountStateList,
            discountList: state => state.discount.discountList,
            discountListLoading: state => state.discount.discountListLoading,
            discountCount: state => state.discount.discountCount,
        }),
        ...mapGetters([
            "discountStateListSelect",
            "discountUserangeListSelect"
        ]),
    },
    mounted() {
        this.init();
    },
    methods:{
        ...mapActions(["getAddDiscountSubjectList","getCouponList"]),
        init() {
            //获取列表内容
            if (this.discountList.length == 0) {
                this.formdata.page_index=this.searchOption.page_index;
            this.formdata.page_size=this.searchOption.page_size;
                this.getCouponList(this.formdata);
            }
        },
        search(init) {
            console.log(this.formdata)
            if (init) {
                this.$store.commit("Discount_setPageIndex", 1);
            }
            this.formdata.page_index=this.searchOption.page_index;
            this.formdata.page_size=this.searchOption.page_size;
            this.getCouponList(this.formdata);
        },
        showDiscountDialogFun(row,_is_edit){   // _is_edit  1是编辑   0是正版验证
            this.is_edit = _is_edit == 1 ? true : false;
            this.coupon_id=row.id;
            this.showCheckDiscountDialog=true;
        },
        showAddDiscountDialogFun(id){
            this.showAddDiscountDialog=true;
            this.id=id;
            this.getAddDiscountSubjectList();
        },
        //删除
        handleDelete(row){
            this.$Modal.confirm({
                title: "提示信息",
                content: "确认要删除吗？",
                onOk :()=>{
                    deleteCoupon({
                        id:row.id
                    }).then(res=>{
                        if(res.res_code===1){
                            this.getCouponList(this.formdata);
                            this.$Message.success("删除优惠券成功！");
                        }else {
                            this.$Message.success("删除优惠券失败！");
                        }
                    })
                }
            })
            
        },
        pageSizeChange(pageSize){
             if (pageSize != this.searchOption.page_size) {
                this.$store.commit("Discount_setPageSize", pageSize);
                this.search();
            }   
        },
        pageIndexChange(page){
            if (page != this.searchOption.page_index) {
                this.$store.commit("Discount_setPageIndex", page);
                this.search();
            }
        },
        getCouponListEmit () {
            this.getCouponList(this.formdata)
        }
    }
}
</script>

<style>

</style>
