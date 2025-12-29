<template>
  <Modal class="common-dialog" v-model="showModal" title="添加优惠券">
    <Form ref="addDiscountForm" :model="addDiscountForm" label-position="right" :label-width="80">
      <div class="flex-row">
        <FormItem label="优惠券名称" prop="coupon_name">
          <Input placeholder="请输入优惠券名称"  v-model="addDiscountForm.coupon_name"></Input>
        </FormItem>
      </div>
      <div class="flex-row">
        <FormItem label="起始日期" prop="start_date">
          <DatePicker transfer  v-model="addDiscountForm.start_date" type="date" placeholder="请选择开始时间" style="width:220px"></DatePicker>
        </FormItem>
        <FormItem label="结束日期" prop="end_date" >
          <DatePicker transfer v-model="addDiscountForm.end_date" type="date" placeholder="请选择结束时间" style="width:220px"></DatePicker>
        </FormItem>
        <FormItem label></FormItem>
      </div>
      <div class="flex-row">
        <FormItem label="优惠金额" prop="discount_amount">
          <Input placeholder="请输入优惠金额"  v-model="addDiscountForm.discount_amount"></Input>
        </FormItem>
        <FormItem label="使用门槛" prop="limited_amount">
          <Input placeholder="请输入门槛金额"  v-model="addDiscountForm.limited_amount"></Input>
        </FormItem>
      </div>
      <div class="flex-row">
        <FormItem label="发行量" prop="total_count">
          <Input placeholder="不超过10万张"  v-model="addDiscountForm.total_count"></Input>
        </FormItem>
        <FormItem label="每人限领" prop="user_limited_count">
          <Input placeholder="请输入每人限领张数"  v-model="addDiscountForm.user_limited_count"></Input>
        </FormItem>
      </div>
      <div class="flex-row">
        <FormItem label="优惠券状态" prop="state">
          <Select v-model="addDiscountForm.state"  placeholder="请选择使用范围">
            <Option
              v-for="item in discountStateList"
              :value="item.state"
              :key="item.state"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="使用范围" prop="type">
          <Select v-model="addDiscountForm.type"  placeholder="请选择使用范围">
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
          <Select v-model="addDiscountForm.type" style="width:100%" placeholder="请选择使用范围">
            <Option
              v-for="item in discountUserangeList"
              :value="item.type"
              :key="item.type"
            >{{ item.name }}</Option>
          </Select>
        </FormItem> -->
      </div>
      <!-- 如果使用范围是限定课程 -->
      <div class="flex-row" v-if="addDiscountForm.type==3">
        <FormItem label="课程列表">
          <div class="search-bar">
            <Input
              v-model="addDiscountSubjectsearchOption.title"
              placeholder="请输入课程名称"
              style="width: 200px"
            ></Input>
            <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
          </div>
          <Table
            :loading="addDiscountSubjectListLoading"
            :columns="columns"
            :data="addDiscountSubjectList"
            @on-selection-change="selectChange"
          ></Table>
          <Row class="bottom-bar" type="flex" justify="space-between">
            <Col span="4"></Col>
            <Col span="20" style="text-align:right">
              <Page
                style="text-align:right"
                show-total
                show-sizer
                :current="addDiscountSubjectsearchOption.page_index"
                :total="addDiscountSubjectCount"
                :page-size="addDiscountSubjectsearchOption.page_size"
                :page-size-opts="addDiscountSubjectsearchOption.page_size_opts"
                @on-page-size-change="pageSizeChange"
                @on-change="pageIndexChange"
              ></Page>
            </Col>
          </Row>
        </FormItem>
      </div>
      <!-- 如果使用范围是限定单科-->
      <div class="flex-row" v-if="addDiscountForm.type==2">
          <FormItem label="课程列表" prop="subject_id">
          <Select v-model="addDiscountForm.subject_id" style="width:100%">
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
import { mapState, mapActions, mapGetters } from "vuex";
import { addOrUpdateCoupon } from "@/api/book";
import moment from "moment";
export default {
  name: "addDiscountModal",
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      book_list: [],
      addDiscountForm: {
        coupon_id:0,//判断是添加还是编辑
        subject_id: 15,//科目id
        coupon_name:'',//优惠券名称
        start_date:'', //开始时间
        end_date:'',//结束时间
        discount_amount: 0,//优惠金额
        limited_amount: 0,//限定门槛金额
        total_count:'',//优惠券总数
        user_limited_count:'',//用户限定领取数量
        type:-1,//优惠券类型
        state:0,//优惠券状态
      },
      columns: [
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
          align: "left"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      searchOption: state => state.addDiscountSubject.searchOption,
      subjectList: state => state.app.subjectList,
      discountStateList: state => state.discount.discountStateList,
      discountUserangeList: state => state.discount.discountUserangeList
    }),
    ...mapState({
      addDiscountSubjectList: state =>
        state.addDiscountSubject.addDiscountSubjectList,
      addDiscountSubjectCount: state =>
        state.addDiscountSubject.addDiscountSubjectCount,
      addDiscountSubjectListLoading: state =>
        state.addDiscountSubject.addDiscountSubjectListLoading,
      addDiscountSubjectsearchOption: state =>
        state.addDiscountSubject.addDiscountSubjectsearchOption
    }),
    ...mapGetters(["discountUserangeListSelect"]),
  },
  watch: {
    isShow(value) {
      if (value) {
        this.showModal = value;
        //去掉课程列表中全科的选项
        for(var i=0;i<this.subjectList.length;i++){
          if(this.subjectList[i].subject_id==15){
            this.subjectList.splice(i,1)
          }
        }
      }
    },
    showModal(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["getAddDiscountSubjectList"]),
    init() {
      //没有列表内容，则去获取
      if (this.addDiscountSubjectsearchOption.type == 3) {
        if (this.addDiscountSubjectList.length == 0) {
          this.getAddDiscountSubjectList(this.book_list);
        }
      } else {
        this.$store.commit("AddDiscountSubject_setSearchForm", { type: 3 });
        this.getAddDiscountSubjectList(this.book_list);
      }
    },
    //搜索
    search(init) {
      if (init) {
        this.$store.commit("AddDiscountSubject_setPageIndex", 1);
        this.book_list = [];
      }
      this.getAddDiscountSubjectList(this.book_list);
    },
    //选择课程
    selectChange(selection) {
        let arr = [];
        //将选中的课程的id传入
        for (let index = 0; index < selection.length; index++) {
            const element = selection[index];
            arr.push(element.book_id);
        }
        this.book_list = arr;
        console.log(this.book_list)
    },
    //保存返回
    addOrUpdateCoupon(){
      this.addDiscountForm.book_list=this.book_list;
      console.log(this.addDiscountForm);
      this.addDiscountForm.start_date=moment(this.addDiscountForm.start_date).format("YYYY-MM-DD")
      this.addDiscountForm.end_date=moment(this.addDiscountForm.end_date).format("YYYY-MM-DD")
      this.addDiscountForm.discount_amount=Number(this.addDiscountForm.discount_amount)
      this.addDiscountForm.limited_amount=Number(this.addDiscountForm.limited_amount)

      addOrUpdateCoupon(this.addDiscountForm).then(res=>{
        this.addDiscountForm.id='';
          this.addDiscountForm.coupon_name='';
          this.addDiscountForm.start_date='';
          this.addDiscountForm.end_date='';
          this.addDiscountForm.discount_amount='';
          this.addDiscountForm.limited_amount='';
          this.addDiscountForm.total_count='';
          this.addDiscountForm.user_limited_count='';
          this.addDiscountForm.type='';
          this.addDiscountForm.state='';
          this.addDiscountForm.subject_id='';
        if(res.res_code===1){
          this.showModal = false;
          this.$Message.success("保存图书成功！");
          this.$emit("getCouponList",this.addDiscountForm.state);
        }
      })
    },
    pageIndexChange(page) {
      if (page != this.addDiscountSubjectsearchOption.page_index) {
        this.$store.commit("AddDiscountSubject_setPageIndex", page);
        this.search();
      }
    },
    pageSizeChange(pageSize) {
      if (pageSize != this.addDiscountSubjectsearchOption.page_size) {
        this.$store.commit("AddDiscountSubject_setPageSize", pageSize);
        this.search();
      }
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


