<style lang="less">
@import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu :shrink="shrink" :open-names="[$route.matched[0].name]" :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <h1 v-show="!shrink">天利38套</h1>
                    <!-- <img v-show="!shrink"  src="../images/logo.jpg" key="max-logo" /> -->
                    <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userInfo.name }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="resetPwd">修改密码</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar icon="person" style="background: #619fe7;margin-left:10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <router-view></router-view>
            </div>
        </div>
        <reset-password-modal :is-show="showResetPwdModal" @closeModal="closeModal"></reset-password-modal>
    </div>
</template>
<script>
import Cookies from "js-cookie";
import { updateLastLoginTime } from "@/api/base.js"
import { mapState } from "vuex";
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import ResetPasswordModal from "./modal-components/reset-password"
export default {
    components: {
        shrinkableMenu,
        ResetPasswordModal
    },
    data() {
        return {
            shrink: false,
            showResetPwdModal: false,
        };
    },
    computed: {
        ...mapState({
            menuList: state => state.app.menuList,
            userInfo: state => state.app.userInfo
        })
    },
    methods: {
        init() {
            let userInfo = Cookies.get('userInfo');
            if (userInfo) {
                if (this.userInfo.password && this.userInfo.password === '000000') {//若为初始密码则弹出提示框
                    this.showResetPwdModal = true
                }
                updateLastLoginTime().then(res => {
                    if (res.res_code == 1) {
                        this.$Message.success('欢迎回来')
                    }
                })
                this.$store.commit('setUserInfo', JSON.parse(userInfo));
            }
            // 无论是否登录都更新菜单列表（未登录时显示所有菜单）
            this.$store.commit('updateMenulist');
            // 取消页面跳转拦截 - 允许未登录访问
            // else {
            //     this.$router.push({
            //         name: "login"
            //     });
            // }

            this.$Message.config({
                duration: 3
            });
        },
        toggleClick() {
            this.shrink = !this.shrink;
        },
        handleClickUserDropdown(name) {
            if (name == 'loginout') {
                this.$store.commit('logout')
                this.$router.push({
                    name: "login"
                });
            } else {
                this.showResetPwdModal = true
            }

        },
        closeModal() {
            console.log(this.userInfo.password);
            this.showResetPwdModal = false;
            if (!this.userInfo.password || this.userInfo.password === '000000') {
                this.$store.commit('logout')
                this.$router.push({
                    name: 'login'
                })
            }

        }
    },
    mounted() {
        this.init();
    }
};
</script>
