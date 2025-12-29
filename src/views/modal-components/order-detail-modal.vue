<template>
    <Modal class="common-dialog set-order-detail" v-model="showModal" :title="title">
        <Form ref="orderDetail" :model="orderDetail" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem label="产品名称" prop="exam_name">
                <Input :value="orderDetail.exam_name" readonly></Input>
            </FormItem>
            <div class="flex-row">
                <FormItem label="订单ID">
                    <Input :value="orderDetail.order_id" readonly></Input>
                </FormItem>
                <FormItem label="创建时间">
                    <Input :value="orderDetail.create_time" readonly></Input>
                </FormItem>
            </div>
            <div class="flex-row">
                <FormItem label="用户ID">
                    <Input :value="orderDetail.user_id" readonly></Input>
                </FormItem>
                <FormItem label="手机号">
                    <Input :value="orderDetail.phone" readonly></Input>
                </FormItem>
                <FormItem label="订单价格">
                    <Input :value="orderDetail.price" readonly></Input>
                </FormItem>
            </div>
            <div class="flex-row">
                <FormItem label="支付方式">
                    <Input :value="orderDetail.pay_type | formatPayType" readonly></Input>
                </FormItem>
                <FormItem label="收货人姓名">
                    <Input :value="orderDetail.receiving_name" readonly></Input>
                </FormItem>
                <FormItem label="联系方式">
                    <Input :value="orderDetail.receiving_phone" readonly></Input>
                </FormItem>
            </div>
            <FormItem label="收货地址">
                <Input :value="orderDetail.receiving_address" readonly></Input>
            </FormItem>
            <template v-if="orderDetail.more">
                <hr>
                <FormItem class="mb-0">
                    <h3>用户信息</h3>
                </FormItem>
                <div class="flex-row">
                    <FormItem label="姓名" v-if="orderDetail.more.realname">
                        <Input :value="orderDetail.more.realname" readonly></Input>
                    </FormItem>
                    <FormItem label="QQ号" v-if="orderDetail.more.qq">
                        <Input :value="orderDetail.more.qq" readonly></Input>
                    </FormItem>
                    <FormItem label="手机号" v-if="orderDetail.more.phone">
                        <Input :value="orderDetail.more.phone" readonly></Input>
                    </FormItem>
                </div>
                <div class="flex-row">
                    <FormItem label="邮箱" v-if="orderDetail.more.phone">
                        <Input :value="orderDetail.more.phone" readonly></Input>
                    </FormItem>
                </div>
                <FormItem label="收货地址" v-if="orderDetail.more.address">
                    <Input :value="orderDetail.more.address" readonly></Input>
                </FormItem>
            </template>
            <hr>
            <FormItem class="mb-0">
                <p>目前仅允许设置“快递单号”、“快递公司”、“发货时间”</p>
            </FormItem>
            <div class="flex-row">
                <FormItem label="快递单号">
                    <Input v-model="orderDetail.way_bill_num"></Input>
                </FormItem>
                <FormItem label="快递公司">
                    <Input v-model="orderDetail.way_bill_company"></Input>
                </FormItem>
                <FormItem label="发货时间">
                    <DatePicker type="datetime" v-model="orderDetail.way_bill_send_time" placeholder="选择时间"></DatePicker>
                </FormItem>
            </div>
        </Form>
        <div slot="footer">
            <Button type="ghost" size="large" @click="showModal=false">返回</Button>
            <Button type="primary" size="large" :loading="btnDisabled == 1" @click="SaveOrder">保存</Button>
        </div>
    </Modal>
</template>
<script>
import * as apiOrderDetail from '../../api/sign-up/order.js';
let moment = require('moment');
export default {
    name: 'orderDetailModal',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            btnDisabled: 0,
            showModal: false,
            title: '设置订单',
            ruleValidate: {
                title: [
                    { required: true, message: "请输入图书名称！", trigger: "blur" }
                ]
            },
            orderDetail: {
                title: '',//图书名称
                order_id: '',//订单ID
                user_id: '',//用户ID
                phone: '',//手机号
                receiving_name: '',//接收人姓名
                receiving_phone: '',//接收人手机号
                pay_type: -1, //支付方式
                origin: '',//来源
                price: 0,//价格
                receiving_city: '',//收货城市
                receiving_address: '',//收货地址
                way_bill_num: '',//快递单号
                way_bill_company: '',//快递公司
                way_bill_send_time: '',//发货时间
                create_time: '',//订单创建时间
                more: "",//用户信息
            }
        }
    },
    filters: {
        formatPayType(value) {
            let str = ""
            switch (value) {
                case 1:
                    str = "微信";
                    break;
                case 2:
                    str = "支付宝";
                    break;
                case 3:
                    str = "QQ支付";
                    break;
                default:
                    break;
            }
            return str
        }
    },
    watch: {
        isShow: function (value) {
            if (value) {
                this.showModal = true
                if (this.orderId) {
                    this.getOrderDetail()
                } else {
                    this.orderDetail = {
                        title: '',//图书名称
                        order_id: '',//订单ID
                        user_id: '',//用户ID
                        phone: '',//手机号
                        receiving_name: '',//接收人姓名
                        receiving_phone: '',//接收人手机号
                        pay_type: -1, //支付方式
                        origin: '',//来源
                        price: 0,//价格
                        receiving_city: '',//收货城市
                        receiving_address: '',//收货地址
                        way_bill_num: '',//快递单号
                        way_bill_company: '',//快递名称
                        way_bill_send_time: '',//发货时间
                        create_time: '',//订单创建时间
                        more: ""//用户信息
                    }
                }
            }
        },
        showModal: function (value) {
            if (!value) {
                this.$emit('closeModal')
            }
        }
    },
    methods: {
        getOrderDetail() {
            apiOrderDetail.getOrderDetail(this.orderId).then(res => {
                if (res.res_code == 1) {
                    this.orderDetail = { ...this.orderDetail, ...res.data }
                    if (this.orderDetail.way_bill_send_time == "0000-00-00 00:00:00") {
                        this.orderDetail.way_bill_send_time = ""
                    }
                    this.orderDetail.create_time = moment(this.orderDetail.create_time).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        },
        SaveOrder() {//保存订单
            if (this.btnDisabled) return;
            this.btnDisabled = 1;
            let params = {
                order_id: this.orderDetail.order_id,
                way_bill_num: this.orderDetail.way_bill_num,
                way_bill_company: this.orderDetail.way_bill_company,
                way_bill_send_time: this.orderDetail.way_bill_send_time
            }
            apiOrderDetail.setWayBillInfo(params).then(res => {
                if (res.res_code == 1) {
                    this.btnDisabled = 0
                    this.showModal = false
                    this.$Message.success('订单设置成功')
                    this.$emit('saveOrderSuccess')
                }
            })
        }
    }
}
</script>

