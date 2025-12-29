<style lang="less">
.ivu-select-item {
  &.others {
    padding-left: 32px;
  }
}
</style>

<template>
    <Modal class="common-dialog add-user-dialog" v-model="showModal" :title="title">
        <Form ref="addUserForm" :model="addUserForm" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem label="用户名" prop="username" v-if="type==1||type==4">
                <Input v-if="type==1" :key="1" v-model="addUserForm.username" placeholder="请输入用户名"></Input>
                <Input v-if="type==4" :key="4" v-model="addUserForm.username" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="真实姓名" prop="realname" v-if="type==1||type==4">
                <Input v-model="addUserForm.realname" placeholder="请输入真实姓名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password" v-if="type==1||type==2">
                <Input type="password" v-model="addUserForm.password" placeholder="请输入密码(至少6位以上)"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="passwdCheck" v-if="type==1||type==2">
                <Input type="password" v-model="addUserForm.passwdCheck" placeholder="请输入确认密码"></Input>
            </FormItem>
            <FormItem label="用户权限" prop="roles" v-if="type==1||type==3">
                <!-- <Tree ref="treeRoles" :data="rolesTree" show-checkbox multiple @on-check-change="selectRole"></Tree> -->
                <Select v-model="addUserForm.roles" multiple>
                    <Option :value="1">超级管理员</Option>
                    <OptionGroup v-for="(item,idx) in rolesGroups" :key="idx" :label="item.title">
                        <Option v-for="(val,i) in item.children" :class="val.class||''" :value="val.access" :key="i">{{val.title}}</Option>
                    </OptionGroup>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" size="large" @click="showModal=false">返回</Button>
            <Button type="primary" size="large" :loading="btnDisabled" @click="AddUser(true)">保存用户</Button>
        </div>
    </Modal>
</template>
<script>
import { mapGetters } from 'vuex'
import * as apiUser from "@/api/user"
export default {
    name: 'addUser',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        userinfo: {
            type: Object,
        }
    },
    data() {
        return {
            ruleValidate: {
                username: {
                    required: true,
                    message: '用户名不能为空',
                    triggle: 'blur'
                },
                password: [{ message: '请至少输入6位以上密码', min: 6, trigger: 'blur' }],
                passwdCheck: [
                    {                        validator: (rule, value, callback) => {
                            if (value !== this.addUserForm.password) {
                                callback(new Error('两次输入密码不一致,请重写输入'))
                            } else {
                                callback()
                            }
                        }, trigger: 'blur'
                    }],
            },
            btnDisabled: false,
            addUserForm: {
                username: '',
                realname: '',
                password: '',
                passwdCheck: '',
                roles: []
            },
            showModal: false,
            type: 1,//判断是添加 1,还是修改密码 2,还是设置权限 3,设置信息 4
        }
    },
    watch: {
        isShow: function (value) {
            if (value) {
                this.showModal = true;
                this.type = this.userinfo.type
                switch (this.userinfo.type) {
                    case 1:
                        this.addUserForm = {
                            username: '',
                            realname: '',
                            password: '',
                            passwdCheck: '',
                            roles: []
                        }
                        break;
                    case 3:
                        this.addUserForm.roles = this.userinfo.roles
                        this.addUserForm.roles = this.addUserForm.roles.filter(item => {
                            return item == 1 || item > 10
                        })
                        /* let rolesTree = [...this.rolesTree]
                        rolesTree.forEach(roles => {
                            if (roles.access != 1) {
                                roles.children.forEach(role => {
                                    if (this.addUserForm.roles.includes(role.access)) {
                                        role.checked = true
                                        roles.checked = true
                                    }
                                })
                            }
                        })
                        this.rolesTree = rolesTree */
                        break;
                    default:
                        this.addUserForm = { ...this.addUserForm, ...this.userinfo }
                        this.addUserForm.password = ""
                        this.addUserForm.passwdCheck = ""
                        break;
                }
            }
        },
        showModal: function (value) {
            if (!value) {
                this.$emit('closeModal')
            }
        }
    },
    computed: {
        ...mapGetters(['rolesGroups']),
        title() {
            let str = ""
            switch (this.type) {
                case 1:
                    str = "添加用户"
                    break;
                case 2:
                    str = "设置用户密码"
                    break;
                case 3:
                    str = "设置用户权限";
                    break;
                case 4:
                    str = "修改用户信息";
                    break;
            }
            return str
        },
    },
    methods: {
        AddUser() {
            this.$refs.addUserForm.validate(valid => {
                if (valid) {
                    this.btnDisabled = true;
                    switch (this.type) {
                        case 1:
                            this.addToolUser()//添加后台用户
                            break;
                        case 2:
                            this.setToolUserPassword()//修改用户密码
                            break;
                        case 3:
                            this.setToolUserRole()//设置用户权限
                            break;
                        case 4:
                            this.updateToolUserInfo()//设置用户信息
                            break;

                    }
                }
            })
        },
        addToolUser() {//添加用户
            let role_arr = this.formatRoles()
            let payload = {
                username: this.addUserForm.username,
                realname: this.addUserForm.realname,
                role_arr: role_arr
            }
            this.addUserForm.password && (payload.password = this.addUserForm.password)
            apiUser.addToolUser(payload).then(res => {
                this.btnDisabled = false
                if (res.res_code == 1) {
                    this.showModal = false
                    this.$Message.success('用户添加成功')
                    this.$emit("refreshList")
                } else {
                    this.$Message.error(res.msg)
                }
            })
        },
        updateToolUserInfo() {//设置用户信息
            let payload = {
                user_id: this.userinfo.user_id
            }
            this.addUserForm.username != this.userinfo.username && (payload.username = this.addUserForm.username)
            this.addUserForm.realname != this.userinfo.realname && (payload.realname = this.addUserForm.realname)
            if (payload.username || payload.realname) {
                apiUser.updateToolUserInfo(payload).then(res => {
                    this.btnDisabled = false
                    if (res.res_code == 1) {
                        this.showModal = false
                        this.$Message.success('设置成功')
                        this.$emit("refreshList")
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            } else {
                this.btnDisabled = false
                this.showModal = false
            }
        },
        setToolUserRole() {//设置用户权限
            let role_arr = this.formatRoles()
            let payload = {
                user_id: this.userinfo.user_id,
                role_arr: role_arr
            }
            apiUser.setToolUserRole(payload).then(res => {
                this.btnDisabled = false
                if (res.res_code == 1) {
                    this.showModal = false
                    this.$Message.success('设置成功')
                    this.$emit("refreshList")
                }
            })
        },
        formatRoles() {
            let roles = [...this.addUserForm.roles].sort();
            let role_arr = []
            if (roles.includes(1)) {
                role_arr = [1]
            } else {
                role_arr = [...roles];
                role_arr.forEach((item, idx) => {
                    if (item > 10) {
                        let num = Math.floor(item / 10);
                        !role_arr.includes(num) && role_arr.push(num)
                    }
                    if (item > 100) {
                        let num = Math.floor(item / 100);
                        !role_arr.includes(num) && role_arr.push(num)
                    }
                })
            }
            let newArr = role_arr.map(item => '' + item).sort().map(item => parseInt(item))
            return newArr
        },
        setToolUserPassword() {//修改用户密码
            let payload = {
                user_id: this.userinfo.user_id,
                password: this.addUserForm.password,
            }
            apiUser.setToolUserPassword(payload).then(res => {
                this.btnDisabled = false
                if (res.res_code == 1) {
                    this.showModal = false
                    this.$Message.success('设置成功')
                    this.$emit("refreshList")
                }
            })
        }
    }
}
</script>

