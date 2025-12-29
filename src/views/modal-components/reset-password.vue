<template>
    <Modal class="common-dialog reset-password" v-model="showModal" title="修改密码">
        <Form ref="resetPwdForm" :model="resetPwdForm" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem label="旧密码" prop="old_pwd">
                <Input v-model="resetPwdForm.old_pwd" type="password" placeholder="请输入当前密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="password">
                <Input v-model="resetPwdForm.password" type="password" placeholder="请输入新密码(至少6位以上)"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="passwdCheck">
                <Input v-model="resetPwdForm.passwdCheck" type="password" placeholder="请输入确认密码"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" size="large" @click="showModal=false">返回</Button>
            <Button type="primary" size="large" :loading="btnDisabled" @click="SaveUser">保存并返回</Button>
        </div>
    </Modal>
</template>
<script>
import { resetPassword } from '@/api/user'
export default {
    name: 'resetPwd',
    props: {
        isShow: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            ruleValidate: {
                old_pwd: { required: true, message: '密码不能为空', triggle: 'blur' },
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '000000') {
                                callback(new Error('请勿使用初始密码'))
                            } else if (value.length < 6) {
                                callback(new Error('请输入6位以上密码'))
                            } else {
                                callback()
                            }
                        }, trigger: 'blur'
                    }],
                passwdCheck: [
                    { required: true, message: "请输入确认密码", trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (value !== this.resetPwdForm.password) {
                                callback(new Error('两次输入密码不一致，请重新输入'))
                            } else {
                                callback()
                            }
                        }, trigger: 'blur'
                    }],
            },
            resetPwdForm: {
                old_pwd: '',
                password: '',
                passwdCheck: ''
            },
            password: '',
            showModal: false,
            btnDisabled: false
        }
    },
    watch: {
        isShow: function (value) {
            if (value) {
                this.showModal = true
                this.resetPwdForm = {
                    old_pwd: '',
                    password: '',
                    passwdCheck: ''
                };
            }
        },
        showModal: function (value) {
            if (!value) {
                this.$emit('closeModal')
            }
        }
    },
    methods: {
        SaveUser() {
            this.$refs.resetPwdForm.validate(valid => {
                if (valid) {
                    this.btnDisabled = true;
                    let payload = {
                        old_pwd: this.resetPwdForm.old_pwd,
                        password: this.resetPwdForm.password
                    };
                    resetPassword(payload).then(res => {
                        this.btnDisabled = false
                        if (res.res_code == 1) {
                            this.$Message.success({
                                content: '密码修改成功，请重新登录',
                                onClose: () => {
                                    this.$store.commit('logout')
                                    this.$router.push({
                                        name: "login"
                                    });
                                }
                            })
                            this.$store.commit('setUserInfo', {
                                password: this.resetPwdForm.password
                            })
                            this.showModal = false

                        } else if (res.res_code < 0) {
                            this.$Message.error(res.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>

