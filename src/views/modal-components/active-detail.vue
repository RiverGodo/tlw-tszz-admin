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
    title="卡号详情"
    style="position: relative"
    :mask-closable="false"
  >
    <div class="pad">
      <div class="tap">卡片信息</div>
      <div class="flex_card">
        <div class="flex_item">兑换卡号：{{cardForm.no}}</div>
        <div class="flex_item">兑换码：{{cardForm.code}}</div>
        <div class="flex_item">卡片版本：{{cardForm.version_name}}</div>
        <div class="flex_item">是否兑换：{{cardForm.is_exchange?"是":"否"}}</div>
      </div>
      <div class="tap">兑换信息</div>
      <div v-if="!cardForm.is_exchange" class="no_exchange">暂未兑换</div>
      <Form v-else ref="cardForm" :model="cardForm" label-position="left" :label-width="60">
        <div class="flex_card">
          <div class="flex_item">兑换版本：{{cardForm.exchange_version}}</div>
          <div class="flex_item">支付金额：{{cardForm.order_price}}</div>
          <div class="flex_item">订单ID：{{cardForm.order_id}}</div>
        </div>
        <div class="flex_card">
          <div class="flex_item">兑换时间：{{cardForm.exchange_time}}</div>
          <div class="flex_item">操作人：{{cardForm.opration_user}}</div>
          <div class="flex_item"></div>
        </div>

        <div class="flex_card">
          <FormItem class="mb-0" label="收货人：">
            <Input v-model="cardForm.user_info.consignee" class="form_item" placeholder="请输入收货人..."></Input>
          </FormItem>
          <FormItem class="mb-0" label="手机号：">
            <Input v-model="cardForm.user_info.phone" class="form_item" placeholder="请输入手机号..."></Input>
          </FormItem>
          <FormItem class="mb-0" label="收货地址：">
            <Input v-model="cardForm.user_info.address" class="form_item" placeholder="请输入收货地址..."></Input>
          </FormItem>
        </div>
        <div class="flex_card">
          <FormItem class="mb-0" label="兑换卷区：">
            <Select v-model="cardForm.user_info.select_version" class="form_item">
              <Option v-for="(item,index) in paper_list" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem class="mb-0" label="兑换科目：">
            <Select v-model="cardForm.user_info.subject_arr" class="form_item">
              <Option v-for="(item,index) in subject_list" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem class="mb-0" label="地区">
            <Cascader
              :data="cityData"
              v-model="cardForm.code_address_total"
              :clearable="false"
              @on-change="changeCity"
            ></Cascader>
          </FormItem>
        </div>
        <div class="tap">物流信息</div>
        <div class="flex_card">
          <FormItem class="mb-0" label="快递公司：">
            <Select v-model="cardForm.courier_company" class="form_item">
              <Option
                v-for="(item,index) in courier_list"
                :value="item.courier_id"
                :key="index"
              >{{ item.courier_name }}</Option>
            </Select>
          </FormItem>
          <FormItem class="mb-0" label="快递单号：">
            <Input v-model="cardForm.courier_number" class="form_item" style="width:300px" placeholder="请输入快递单号"></Input>
          </FormItem>
          <FormItem class="mb-0" label>
            <!-- <Cascader :data="cityData" v-model="cardForm.code_address_total" :clearable="false" @on-change="changeCity"></Cascader> -->
          </FormItem>
        </div>
        <div class="flex_card"></div>
      </Form>
    </div>

    <div slot="footer">
      <Button type="ghost" @click="showModal = false" size="large">关闭</Button>
      <Button
        type="primary"
        v-if="cardForm.is_exchange"
        @click="updateOrderUserInfo"
        size="large"
      >修改并关闭</Button>
    </div>
    <Spin fix v-if="loading"></Spin>
  </Modal>
</template>

<script>
import {getCityData} from "@/libs/city.js"
import moment from "moment";
import { getActivationInfo,updateOrderUserInfo } from "@/api/dealer/dealer";
export default {
  name: "activeDetail",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    no:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      showModal: false,
      cardForm: {
        title: "",
        user_info: {
          wx: "",
          phone: "",
          address: "",
          code_address: "",
          consignee: "",
          select_version: "",
          subject_arr: ""
        },
        order_id: "",
        order_price: "",
        opration_user: "",
        exchange_version: "",
        exchange_time: "",
        is_exchange: "",
        no: "",
        code: "",
        version_name: "",
        code_address_total:[],
        courier_company:'', // 快递公司
        courier_number:'' // 快递单号
      },
      paper_list: ["全国I卷", "全国II卷,全国III卷"],
      subject_list: ["文科", "理科"],
      cityData:getCityData(),
      value2:[],
      courier_list:[{
        courier_id:-1,
        courier_name:'请选择快递'
      },{
        courier_id:1,
        courier_name:'圆通速递'
      },
      {
        courier_id:2,
        courier_name:'邮政包裹'
      }], // 快递公司
    };
  },
  watch: {
    isShow: function(value) {
      //点击添加课程
      if (value) {
        this.showModal = value;
        this.getActivationInfo(this.no);
      }
    },
    showModal: function(value) {
      if (!value) {
        this.cardForm.code_address_total = []
        this.$emit("closeModal");
      }
    }
  },
  computed: {},
  mounted() {
    
  },
  methods: {
    //修改个人订单信息
    updateOrderUserInfo() {
      if (this.loading) {
        return false;
      }
      this.loading = true;
      let params = {
        order_id: this.cardForm.order_id,
        more: this.cardForm.user_info
      }
      if(this.cardForm.courier_company!== -1){
        params.courier_company = this.cardForm.courier_company
      }
      if(this.cardForm.courier_number!== ""){
        params.courier_number = this.cardForm.courier_number
      }
      updateOrderUserInfo(params)
        .then(res => {
          if (res.res_code == 1) {
           this.$Message.success("修改成功")
           this.showModal = false
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getActivationInfo(no) {
      if(!no){
        return false;
      }
      if (this.loading) {
        return false;
      }
      this.loading = true;
      getActivationInfo({ no })
        .then(res => {
          if (res.res_code == 1) {
            let data = res.data.info;
            let user_info = JSON.parse(data.more);
            this.cardForm.user_info = {
              ...this.cardForm.user_info,
              ...user_info
            };
            this.cardForm.order_id = data.order_id;
            this.cardForm.order_price = data.order_price;
            this.cardForm.courier_company = data.courier_company || -1;
            this.cardForm.courier_number = data.courier_number || "";
            if(data.dealer_id&&data.version_name==data.name){
                this.cardForm.order_price = 0
            }
            
            this.cardForm.opration_user = data.nickname;
            this.cardForm.exchange_version = data.name;
            this.cardForm.exchange_time = data.exchange_time;
            this.cardForm.is_exchange = data.is_exchange;
            this.cardForm.no = data.no;
            this.cardForm.code = data.code;
            this.cardForm.version_name = data.version_name;
            if(this.cardForm.user_info.code_address){
              this.cardForm.code_address_total.push(this.cardForm.user_info.code_address.substring(0,2))
              this.cardForm.code_address_total.push(this.cardForm.user_info.code_address.substring(0,4))
              this.cardForm.code_address_total.push(this.cardForm.user_info.code_address.substring(0,6))
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changeCity(val){
      this.cardForm.user_info.code_address = val[2]
    }
  }
};
</script>
