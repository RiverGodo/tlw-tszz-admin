<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    mounted() {
        //初始化通用数据
        this.getCityList();
        this.getSubjectList();
        this.getYearsList();
        this.getBookResourceTypeList();
        this.getGradeList();
        this.getQuestionCategoryList();
        this.getCategoryTypeList();
        this.getOrderExamList();
    },
    beforeDestroy() {

    },
    methods: {
        ...mapActions(["getCityList",
            "getGradeList",
            "getSubjectList",
            "getYearsList",
            "getBookResourceTypeList",
            "getQuestionCategoryList",
            "getCategoryTypeList",
            "getOrderExamList"])
    }
};
</script>

<style>
.app-main {
  width: 100%;
  height: 100%;
}
</style>
