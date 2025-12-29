<template>
    <Modal class="common-dialog add-subject-dialog" v-model="showModal" :title="is_resource? '添加资源类型': '添加学科'">
        <Form ref="addSubjectForm" :model="addSubjectForm" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem label="名称" prop="name">
                <Input v-model="addSubjectForm.name" placeholder="请输入名称..."></Input>
            </FormItem>
            <FormItem label="序号" prop="orderby">
                <Input v-model="addSubjectForm.orderby" placeholder="请输入序号..."></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" size="large">取消</Button>
            <Button type="primary" size="large" :loading="btnDisabled" @click="AddSubject">保存</Button>
        </div>
    </Modal>
</template>
<script>
import { addSubject } from '@/api/base'
import { addOrUpdateBookResourceType } from '@/api/book-resource-subject'
export default {
    name: 'AddSubject',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        is_resource: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            btnDisabled: false,
            showModal: false,
            ruleValidate: {
                name: [
                    { required: true, message: '请输入学科名称', trigger: 'blur' }
                ],
                orderby: [
                    {                        validator: (rule, value, callback) => {
                            let reg = /^[1-9]*$/
                            if (!reg.test(value)) {
                                callback(new Error('请输入大于0的正整数'))
                            } else {
                                callback()
                            }
                        }, trigger: 'blur'                    }
                ]
            },
            addSubjectForm: {
                name: '',
                orderby: ''
            }
        }
    },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = value
            }
        },
        showModal(value) {
            if (!value) {
                this.$emit("closeModal");
            }
        }
    },
    methods: {
        AddSubject() {
            this.$refs.addSubjectForm.validate(valid => {
                if (valid) {
                    if (this.is_resource) {
                        this.addSubjectForm.type_id = 0;
                        addOrUpdateBookResourceType(this.addSubjectForm).then(res => {
                            if (res.res_code == 1) {
                                this.showModal = false;
                                this.$Message.success('添加成功')
                                this.$emit("refreshList")
                            } else {
                                this.$Message.warning(res.msg)
                            }
                            this.btnDisabled = false
                        }).catch(err => {
                            this.$Message.error('请求出错')
                            this.btnDisabled = false
                        })
                    } else {
                        this.btnDisabled = true
                        addSubject(this.addSubjectForm).then(res => {
                            if (res.res_code == 1) {
                                this.showModal = false;
                                this.$Message.success('添加成功')
                                this.$emit("refreshList")
                            } else {
                                this.$Message.warning(res.msg)
                            }
                            this.btnDisabled = false
                        }).catch(err => {
                            this.$Message.error('请求出错')
                            this.btnDisabled = false
                        })
                    }

                }
            })

        }
    }
}
</script>

