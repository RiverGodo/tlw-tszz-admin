<style lang="less">

</style>

<template>
    <Modal class="common-dialog add-prize-dialog" v-model="showModal" :title="title">
    <Form ref="addPrizeForm" :model="addPrizeForm" :rules="ruleValidate" label-position="right" :label-width="80">
        <FormItem label="奖品名称" prop="name">
            <Input v-model="addPrizeForm.name" :disabled="canNotEdit" placeholder="请输入奖项名称..."></Input>
        </FormItem>
        <FormItem label="奖品类型" prop="type">
            <RadioGroup v-model="typeName" type="button" @on-change="handleRadioChange">
                <Radio label="话费" :disabled="canNotEdit"></Radio>
                <Radio label="流量" :disabled="canNotEdit"></Radio>
                <Radio label="优惠卷" :disabled="canNotEdit"></Radio>
                <Radio label="其他" :disabled="canNotEdit"></Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="优惠卷地址" prop="" v-if="showCoupon">
          <Input v-model="addPrizeForm.reward_url" placeholder="请输入优惠卷地址" style="width: 100%"></Input>
        </FormItem>
        <FormItem label="真实金额" prop="count" v-if="!showCoupon">
          <Input v-model="addPrizeForm.real_price" placeholder="请输入真是金额" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="奖品数量" prop="count">
          <InputNumber :max="100000" :min="0" :disabled="canNotEdit"  :step="1" v-model="addPrizeForm.can_use_count"></InputNumber>
        </FormItem>
        <FormItem label="奖品权重" prop="weight">
          <InputNumber :max="100" :min="0" :step="1" v-model="addPrizeForm.weight"></InputNumber>
        </FormItem>
    </Form>
    <div slot="footer">
        <Button type="ghost" size="large" @click="showModal = false">取消返回</Button>
        <Button type="primary" size="large" :loading="addPrizeLoading" @click="AddPrize(true)">保存奖品</Button>
    </div>
</Modal>
</template>

<script>
import { mapActions } from "vuex";
// import * as apiPrize from "@/api/Prize";
import { addOrUpdateReward } from "@/api/feedback";
import moment from "moment";
function getRewardIndex(type) {
  let content = "";
  if (type == '其他') {
    content = 0;
  } else if (type == '话费') {
    content = 1;
  } else if (type == '流量') {
    content = 2;
  } else if (type == '优惠卷') {
    content = 3;
  }
  return content;
}

function getRewardName(type) {
  let content = "";
  if (type == 0) {
    content = "其他";
  } else if (type == 1) {
    content = "话费";
  } else if (type == 2) {
    content = "流量";
  } else if (type == 3) {
    content = "优惠卷"
  }
  return content;
}

export default {
  name: "addPrizeModal",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    PrizeId: {
      type: Number,
      default: -1
    },
    rewardDetail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      showModal: false,
      addPrizeLoading: false,
      addPrizeForm: {
        reward_id: -1,
        name: "",
        can_use_count: 0,
        weight: 0,
        type: '',
        real_price: 0,
        reward_url: ''
      },
      showCoupon: false,
      typeName: '其他',
      ruleValidate: {
        name: [{ required: true, message: "请输入奖品名称！", trigger: "blur" }]
      },
      canNotEdit: false
    };
  },
  watch: {
    isShow: function(value) {
      if (value) {
        this.showModal = value;
        this.file = "";
        if (this.PrizeId > 0) {
          this.addPrizeForm = this.rewardDetail;
          this.typeName = getRewardName(this.rewardDetail.type);
          this.showCoupon = this.rewardDetail.type === 3 ? true : false
          if (this.PrizeId == 1) {
            this.canNotEdit = true;
          } else {
            this.canNotEdit = false;
          }
        } else {
          this.addPrizeForm = {
            reward_id: -1,
            name: "",
            can_use_count: 0,
            weight: 0,
            type: '',
            real_price: 0,
            reward_url: ''
          };
          this.typeName = '其他';
          this.showCoupon = false;
          this.addPrizeForm.reward_id = this.PrizeId;
        }
      }
    },
    showModal: function(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  computed: {
    title() {
      return this.PrizeId > 0 ? "编辑奖品" : "添加奖品";
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["get_reward_list"]),
    handleRadioChange(v){
      if(v == '优惠卷') 
        this.showCoupon = true; 
      else 
        this.showCoupon = false;
    },
    getPrizeDetail() {
      // apiPrize.getPrizeDetail(this.PrizeId).then(res => {
      //   if (res.res_code == 1) {
      //   }
      // });
    },
    AddPrize(goPage) {
      if (this.addPrizeLoading) {
        return;
      }
      this.$refs["addPrizeForm"].validate(valid => {
        if (valid) {
          this.addPrizeLoading = true;
          this.addPrizeForm.type = getRewardIndex(this.typeName)   
          addOrUpdateReward(this.addPrizeForm).then(res => {
            this.addPrizeLoading = false;
            if (res.res_code == 1) {
              this.showAddPrize = false;
              this.$Message.success("保存奖品成功！");
              this.showModal = false;
              this.get_reward_list();
              if (goPage) {
                // this.$router.push({
                //   name: "Prize_resource_list",
                //   params: {
                //     Prize_id: res.msg
                //   }
                // });
              } else {
                this.$emit("refreshList");
              }
            } else {
              this.$Message.error("保存奖品失败！");
            }
          });
        } else {
          this.$Message.error("请检测奖品信息是否填写完整!");
        }
      });
    }
  }
};
</script>
