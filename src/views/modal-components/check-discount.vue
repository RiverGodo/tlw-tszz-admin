<template>
  <Modal class="common-dialog" v-model="showModal" :title="is_edit?'编辑优惠券':'绑定优惠券'">
    <Form ref="Form" :model="Form" label-position="right" :label-width="80">
      <div v-if="is_edit">
        <div class="flex-row">
          <FormItem label="优惠券名称" prop="coupon_name">
            <Input placeholder="请输入优惠券名称"  v-model="Form.coupon_name"></Input>
          </FormItem>
        </div>
        <div class="flex-row">
          <FormItem label="起始日期" prop="start_date">
            <DatePicker transfer  v-model="Form.start_date" type="date" placeholder="请选择开始时间" style="width:220px"></DatePicker>
          </FormItem>
          <FormItem label="结束日期" prop="end_date" >
            <DatePicker transfer v-model="Form.end_date" type="date" placeholder="请选择结束时间" style="width:220px"></DatePicker>
          </FormItem>
          <FormItem label></FormItem>
        </div>
        <div class="flex-row">
          <FormItem label="优惠金额" prop="discount_amount">
            <Input placeholder="请输入优惠金额"  v-model="Form.discount_amount"></Input>
          </FormItem>
          <FormItem label="使用门槛" prop="limited_amount">
            <Input placeholder="请输入门槛金额"  v-model="Form.limited_amount"></Input>
          </FormItem>
        </div>
        <div class="flex-row">
          <FormItem label="发行量" prop="total_count">
            <Input placeholder="不超过10万张"  v-model="Form.total_count"></Input>
          </FormItem>
          <FormItem label="每人限领" prop="user_limited_count">
            <Input placeholder="请输入每人限领张数"  v-model="Form.user_limited_count"></Input>
          </FormItem>
        </div>
        <div class="flex-row">
          <FormItem label="优惠券状态" prop="state">
            <Select v-model="Form.state"  placeholder="请选择使用范围">
              <Option
                v-for="item in discountStateList"
                :value="item.state"
                :key="item.state"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="使用范围" prop="type">
            <Select v-model="Form.type"  placeholder="请选择使用范围" @on-change="handleChangeFormType">
              <Option
                v-for="item in discountUserangeList"
                :value="item.type"
                :key="item.type"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="flex-row">
          <!-- <FormItem label="使用范围" prop="type">
            <Select v-model="Form.type" style="width:100%" placeholder="请选择使用范围">
              <Option
                v-for="item in discountUserangeList"
                :value="item.type"
                :key="item.type"
              >{{ item.name }}</Option>
            </Select>
          </FormItem> -->
        </div>
      </div>
      <!-- 如果使用范围是限定课程 -->
      <div class="flex-row" v-if="Form.type==3 || !is_edit">
        <FormItem :label="is_edit ? '已绑定课程' : '已绑定图书'">
          <Table
            :columns="columns"
            :data="bookListByCouponId"
          ></Table>
        </FormItem>
      </div>
      <div class="flex-row" v-if="Form.type==3 || !is_edit">
        <FormItem :label="is_edit ? '课程列表' : '图书列表'">
          <div class="search-bar">
            <Input
              v-model="checkDiscountSubjectsearchOption.title"
              placeholder="请输入名称"
              style="width: 200px"
            ></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          </div>
          <Table
            :loading="checkDiscountSubjectListLoading"
            :columns="columnsDefe"
            :data="checkDiscountSubjectList"
            @on-selection-change="selectChange"
            height="600"
          ></Table>
          <Row class="bottom-bar" type="flex" justify="space-between">
            <Col span="4"></Col>
            <Col span="20" style="text-align:right">
              <Page
                style="text-align:right"
                show-total
                show-sizer
                :current="page_index"
                :total="checkDiscountSubjectCount"
                :page-size="checkDiscountSubjectsearchOption.page_size"
                :page-size-opts="checkDiscountSubjectsearchOption.page_size_opts"
                @on-page-size-change="pageSizeChange"
                @on-change="pageIndexChange"
              ></Page>
            </Col>
          </Row>
        </FormItem>
      </div>
      <!-- 如果使用范围是限定单科-->
      <div class="flex-row" v-if="Form.type==2 && is_edit">
        <FormItem label="课程列表" prop="subject_id">
          <Select v-model="Form.subject_id" style="width:100%">
            <Option
              v-for="item in subjectList"
              :value="item.subject_id"
              :key="item.subject_id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>
    </Form>
    <div slot="footer">
      <Button type="primary" size="large" @click="addOrUpdateCoupon()">保存返回</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { bindVertifyBookOfCoupon } from "@/api/check-discount-subject";
import { addOrUpdateCoupon,getCouponDetail,getBookListByCouponId} from "@/api/book";    // 正版验证添加删除编辑
import moment from "moment";
export default {
  name: "addDiscountModal",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    coupon_id:{
      type: Number,
      default: -1
    },
    is_edit: {   // true是优惠券编辑   false是优惠券正版验证
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      close_bind: false,    // 取消绑定
      page_index: 1,
      book_list: [],
      bookListByCouponId:[],
      Form: {
        coupon_id:3,//判断是添加还是编辑
        subject_id: -1,//科目id
        coupon_name:'',//优惠券名称
        start_date:'', //开始时间
        end_date:'',//结束时间
        discount_amount:'',//优惠金额
        limited_amount:'',//限定门槛金额
        total_count:'',//优惠券总数
        user_limited_count:'',//用户限定领取数量
        type:-1,//优惠券类型
        state:0,
      },
      columns: [
        {
          title: "ID",
          key: "id",
          minWidth: 60,
          align: "left"
        },
        {
          title: "课程名称",
          key: "title",
          minWidth: 260,
          align: "left"
        },
        {
          title: "操作",
          key: "action",
          minWidth: 90,
          align: "center",
          render:(h,params)=>{
            return h(
              "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleCacelBind(params.row.id);
                    }
                  }
                },
                "取消绑定"
            )
          }
        }
      ],
      columnsDef: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          key: "book_id",
          width: 90,
          align: "center"
        },
        {
          title: "课程名称",
          key: "title",
          minWidth: 260,
          align: "center"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      subjectList: state => state.app.subjectList,
      discountStateList: state => state.discount.discountStateList,
      searchOption: state => state.checkDiscountSubject.searchOption,
      discountUserangeList: state => state.discount.discountUserangeList
    }),
    ...mapState({
      checkDiscountSubjectList: state =>
        state.checkDiscountSubject.checkDiscountSubjectList,
      checkDiscountSubjectCount: state =>
        state.checkDiscountSubject.checkDiscountSubjectCount,
      checkDiscountSubjectListLoading: state =>
        state.checkDiscountSubject.checkDiscountSubjectListLoading,
      checkDiscountSubjectsearchOption: state =>
        state.checkDiscountSubject.checkDiscountSubjectsearchOption
    }),
    ...mapGetters(["discountUserangeListSelect"]),
    columnsDefe () {
      /*/*
      * anthor jiayin
      * time 19.1.23
      * 如果是正版验证的时候给table加一科目列
      */ 
      if (!this.is_edit) {
        this.columnsDef.splice(2,0,{
          title: "科目",
          key: "subject_name",
          minWidth: 100,
          align: "center"
        })
        return this.columnsDef
      } else {
        return this.columnsDef
      }
    },
    page_index () {
      if (this.checkDiscountSubjectsearchOption.page_index == 0) {
        return 1
      } else {
        return this.checkDiscountSubjectsearchOption.page_index
      }
    }
  },
  watch: {
    isShow(value) {
      if (value) {
        this.checkDiscountSubjectsearchOption.title = '';   // 清空查询值
        this.getBookListByCouponIdFunc();
        // this.search();
        this.getCouponDetail();
        /*
        * anthor jiayin
        * time 19.1.22
        * 如果不是编辑就是正版验证，如果是正版验证获取图书列表
        * 如果默认值是3，就获取图书列表
        */
        if (!this.is_edit) {
          this.$store.commit("CheckDiscountSubject_setType", 2);
          this.getCheckDiscountSubjectListFunc()
        } else {
          this.$store.commit("CheckDiscountSubject_setType", 3);
          this.getCheckDiscountSubjectList();
        }
        //去掉课程列表中的全科选项
        for(let i=0;i<this.subjectList.length;i++){
          if(this.subjectList[i].subject_id==15){
            this.subjectList.splice(i,1)
          }
        }
        this.showModal = value;
      }
    },
    showModal(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  mounted() {    
    this.search();
  },
  methods: {
    ...mapActions(["getCheckDiscountSubjectList"]),
    ...mapMutations('/checkDiscountSubject', ["CheckDiscountSubject_setType","CheckDiscountSubject_setTitle"]),
    //搜索
    /*
    * anthor jiayin
    * time 19.1.28
    * 在查询的时候分为图书和课程
    * 在查询后清空input值
    */
    search(init) {
      if (init) {
        this.$store.commit("CheckDiscountSubject_setPageIndex",0)
        this.$store.commit("CheckDiscountSubject_setTitle",this.checkDiscountSubjectsearchOption.title)
        if (this.is_edit) {
          this.$store.commit("CheckDiscountSubject_setPageIndex", 1);
          this.$store.commit("CheckDiscountSubject_setType", 3);
          this.book_list = [];
        } else {
          this.$store.commit("CheckDiscountSubject_setType", 2);
        }
        this.getCheckDiscountSubjectListFunc()  
      }
    },
    //获取已绑定图书
    getBookListByCouponIdFunc(){
      getBookListByCouponId({
        coupon_id:this.coupon_id,
        type: this.is_edit ? 1 : 2
      }).then(res=>{
        if(res.res_code===1){
          this.bookListByCouponId=res.data;
        }
      })
    },
    //获取优惠券详情
    getCouponDetail(){
      getCouponDetail({id:this.coupon_id}).then(res=>{
        if(res.res_code===1){
          this.addDiscountForm=res.data;
          this.Form.coupon_id=this.addDiscountForm.id;
          this.Form.coupon_name=this.addDiscountForm.coupon_name;
          this.Form.start_date=moment(this.addDiscountForm.start_date).format("YYYY-MM-DD");
          this.Form.end_date=moment(this.addDiscountForm.end_date).format("YYYY-MM-DD");
          this.Form.discount_amount=this.addDiscountForm.discount_amount;
          this.Form.limited_amount=this.addDiscountForm.limited_amount;
          this.Form.total_count=this.addDiscountForm.total_count;
          this.Form.user_limited_count=this.addDiscountForm.user_limited_count;
          this.Form.type=this.addDiscountForm.type;
          this.Form.state=this.addDiscountForm.state;
          this.Form.subject_id=this.addDiscountForm.subject_id;
        }
      })
    },
    //取消绑定课程
    /*
    * anthor jiayin
    * time 19.1.23
    * 取消绑定，在保存的时候确定取消
    * 如果是编辑最少要有一门课程，不可以全部取消
    */
    handleCacelBind(row){
      if (this.bookListByCouponId.length == 1) {
        if (this.is_edit) {
          this.$Message.warning('最少绑定一门课程')
          return
        }
        this.bookListByCouponId = []   
      } else {
        this.bookListByCouponId.forEach((item,index) => { 
          if (row != item.id) this.bookListByCouponId.splice(index,1)
        });
      }
      this.close_bind = true
    },
    //选择课程
    selectChange(selection) {
        // let arr = [];
        for (let index = 0; index < selection.length; index++) {
            const element = selection[index];
            this.book_list.push(element.book_id);
        }
    },
    //保存返回
    /*
    * anthor jiayin
    * time 19.1.23
    * 保存绑定的图书
    * 编辑的时候绑定课程
    * 正版验证绑定图书
    */
    addOrUpdateCoupon(){
      if (this.close_bind) {
        this.Form.book_list = this.bookListByCouponId.map(item => {return item.id})
      } else {
        this.Form.book_list = [...new Set([...this.book_list, ...this.bookListByCouponId.map(item => { return item.id })])];
      }
      if (this.is_edit) {
        addOrUpdateCoupon(this.Form).then(res=>{
          if(res.res_code===1){
            // this.showModal = false;
            this.$Message.success("修改图书成功！");
            this.getBookListByCouponIdFunc();
            this.$emit("getCouponList");
            this.showModal = false;
            this.book_list = []   // 添加后回复默认
          }
        })
      } else {
        bindVertifyBookOfCoupon({
          coupon_id: this.coupon_id,
          book_list: this.Form.book_list
        }).then(res => {
          this.showModal = false;
          this.$Message.success("绑定成功！");
          this.getBookListByCouponIdFunc();
          this.$emit("getCouponList");
          this.book_list = []
        })
      }
    },
    pageIndexChange(page) {
      if (page != this.checkDiscountSubjectsearchOption.page_index) {
        this.$store.commit("CheckDiscountSubject_setPageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.checkDiscountSubjectsearchOption.page_size) {
        this.$store.commit("CheckDiscountSubject_setPageSize", pageSize);
        this.search();
      }
    },
    handleChangeFormType () {
      if (this.Form.type == 3) {
        this.$store.commit("CheckDiscountSubject_setType", 3);
        this.getCheckDiscountSubjectList();
      }
    },
    getCheckDiscountSubjectListFunc () {
      return new Promise((resolve,resject) => {
        this.getCheckDiscountSubjectList().then(res => {
          resolve()
        })
      })
    }
  }
};
</script>

<style lang="less">
.list {
  margin-top: 20px;
  .list-info {
    margin-bottom: 10px;
    font-size: 14px;
    color: #8c9095;
    line-height: 20px;
    .ivu-icon {
      margin-right: 5px;
      color: #00a874;
    }
    span {
      color: #00a874;
    }
    .info {
      font-size: 12px;
      color: #aaa;
    }
  }
  .ivu-table {
    td {
      height: 40px;
    }
    .ivu-table-cell {
      padding: 0 5px;
      .avatar-title {
        height: 50px;
        display: flex;
        align-items: center;
        padding: 5px;
        .img {
          flex: 0 0 40px;
          height: 40px;
          background: #eee;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .nickname {
          flex: 1;
          font-size: 14px;
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .img-title {
        display: flex;
        padding: 5px;
        .img {
          flex: 0 0 110px;
          width: 110px;
          height: 66px;
          margin-right: 5px;
        }
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          .title {
            font-size: 14px;
          }
          .time {
            font-size: 12px;
            opacity: 0.5;
          }
        }
      }
    }
  }
  .bottom-bar {
    margin-top: 10px;
    .ivu-btn-ghost {
      &:hover {
        color: #d0021b;
        background-color: transparent;
        border-color: #d0021b;
      }
    }
    .ivu-page {
      text-align: right;
    }
  }
}
</style>


