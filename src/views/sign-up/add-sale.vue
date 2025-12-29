<template>
    <div class="add-sale">
        <Breadcrumb separator=">">
            <BreadcrumbItem>天利商城</BreadcrumbItem>
            <BreadcrumbItem to="/SignUp/SaleList">销售模式管理</BreadcrumbItem>
            <BreadcrumbItem>{{title}}</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <Form class="common-form" ref="addSaleForm" :model="addSaleForm" :rules="ruleValidate" label-position="right" :label-width="160">
                <FormItem label="模式名称" prop="sale_name">
                    <Input :disabled="isDisabled" v-model="addSaleForm.sale_name" style="width: 200px;" placeholder="请输入模式名称..."></Input>
                </FormItem>
                <FormItem label="模式描述" prop="sale_desc">
                    <Input :disabled="isDisabled" v-model="addSaleForm.sale_desc" style="width: 400px;" placeholder="请输入销售模式得描述信息..."></Input>
                </FormItem>
                <FormItem label="销售模式" prop="type">
                    <Select :disabled="isDisabled" v-model="addSaleForm.type" style="width:100px">
                        <Option v-for="item in typeSelectsList" :value="item.state" :key="item.state">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="优惠的价格" prop="sale_discount" v-if="addSaleForm.type!=4">
                    <Input :disabled="isDisabled" v-model.number="addSaleForm.sale_discount" :key="1" style="width:100px"></Input>
                </FormItem>
                <FormItem label="优惠的折扣" prop="sale_discount" v-else>
                    <Input :disabled="isDisabled" v-model.number="addSaleForm.sale_discount" :key="2" style="width:100px"></Input>
                </FormItem>
                <FormItem label="分享收益" prop="sale_income">
                    <Input :disabled="isDisabled" v-model.number="addSaleForm.sale_income" style="width:100px"></Input>
                </FormItem>
                <FormItem label="是否团购" prop="is_group_purchase">
                    <i-switch :disabled="isDisabled" v-model="is_group_purchase">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="是否预购" prop="is_pre_buy">
                    <i-switch :disabled="isDisabled" v-model="is_pre_buy">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="备注" prop="more">
                    <Input :disabled="isDisabled" type="textarea" v-model="addSaleForm.more" placeholder="请输入备注..." :rows="3" style="width: 400px;"></Input>
                </FormItem>
            </Form>
            <div style="text-align: center;">

                <Button type="ghost" size="large" v-if="!this.sale_id" @click="addSale(-1)">返回</Button>
                <Button type="primary" size="large" :loading="addSaleLoading" @click="addSale(1)">{{btnName}}</Button>
            </div>
        </Card>
    </div>
</template>
<script>
import { addSale, getDetail } from '@/api/sign-up/sale'
export default {
    name: 'addSale',
    data() {
        return {
            addSaleLoading: false,
            isDisabled: false,
            title: '新增销售模式',
            btnName: '保存',
            sale_id: '',
            ruleValidate: {
                sale_name: [{ required: true, message: '请填写模式名称', trigger: 'blur' }],
                sale_discount: [
                    {                        validator: (rule, value, callback) => {
                            if (value < 0) {
                                callback(new Error('价格不得小于0'))
                                return
                            }
                            if (this.addSaleForm.type == 4) {
                                if (value > 1) {
                                    callback(new Error('折扣力度不得大于1'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        }, trigger: 'blur'                    }
                ],
                sale_income: [{                    validator: (rule, value, callback) => {
                        if (value < 0) {
                            callback(new Error('价格不得小于0'))
                        } else {
                            callback()
                        }
                    }, trigger: 'blur'                }]
            },
            addSaleForm: {
                sale_name: '',
                sale_desc: '',
                sale_discount: 0,
                sale_income: 0,
                type: 1,
                is_group_purchase: 0,
                is_pre_buy: -1,
                more: ''
            },
            is_group_purchase: false,
            is_pre_buy: false
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.sale_id = Number(vm.$route.query.sale_id)
        })
    },
    watch: {
        sale_id(value) {
            if (value) {
                this.title = "查看详情"
                this.btnName = "返回"
                this.isDisabled = true
                getDetail({ sale_id: value }).then(res => {
                    if (res.res_code == 1) {
                        this.addSaleForm = res.data
                    }
                })
            }
        },
        is_group_purchase(value) {
            if (value) {
                this.addSaleForm.is_group_purchase = 1
            } else {
                this.addSaleForm.is_group_purchase = 0
            }
        },
        is_pre_buy(value) {
            if (value) {
                this.addSaleForm.is_pre_buy = 1
            } else {
                this.addSaleForm.is_pre_buy = -1
            }
        }
    },
    computed: {
        typeSelectsList() {
            let arr = [...this.$store.state.sale.typeSelects]
            arr.forEach((item, index) => {
                if (item.state === 0) {
                    arr.splice(index, 1)
                }
            })
            return arr
        }
    },
    methods: {
        addSale(init) {
            if (this.addSaleLoading) return
            this.addSaleLoading = true
            if (init < 0) {
                this.$router.go(-1)
                return
            }
            this.$refs.addSaleForm.validate(valid => {
                if (valid) {
                    if (this.sale_id === 0) {
                        addSale(this.addSaleForm).then(res => {
                            if (res.res_code == 1) {
                                this.$Message.success('添加成功')
                                this.addSaleLoading = false
                                this.$router.go(-1)
                            }
                        })
                    } else {
                        this.addSaleLoading = false
                        this.$router.go(-1)
                    }
                } else {
                    this.addSaleLoading = false
                }
            })
        },
    }
}
</script>


