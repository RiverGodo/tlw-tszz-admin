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
    title="用户信息"
    width="1000px"
    style="position: relative;"
    :mask-closable="false"
  >
    <div class="pad" style="padding-left:50px">
      <div class="tap">基本信息</div>
      <div class="flex_card">
        <div class="flex_item">昵称：{{cardForm.nickname}}</div>
        <div class="flex_item">年级：{{cardForm.grade_id == 9? '高中':cardForm.grade_id == 10 ?'初中':'全部'}}</div>
        <div class="flex_item">手机号：{{cardForm.phone}}</div>
        <div class="flex_item">创建时间：{{cardForm.create_time}}</div>
      </div>
      <div class="flex_card">
        <div class="flex_item">性别：{{cardForm.sex == 1 ? '男' : cardForm.sex == 2 ?'女':''}}</div>
        <div class="flex_item">城市：{{cardForm.city_name}}</div>
        <div class="flex_item">高考时间：{{cardForm.college_entrance_examination_year}}</div>
        <div class="flex_item">最后登陆时间：{{cardForm.last_login_time}}</div>
      </div>
      <div class="tap">用户图书列表</div>
      <Table :columns="userListColumns" :data="cardForm.book_list"></Table>
      <div class="tap">用户课程列表</div>
      <Table :columns="userListColumns1" :data="cardForm.course_list"></Table>
    </div>

    <div slot="footer">
      <Button type="ghost" @click="showModal = false" size="large">关闭</Button>
    </div>
    <Spin fix v-if="loading"></Spin>
  </Modal>
</template>

<script>
import * as userApi from "@/api/user.js"
import moment from "moment";
export default {
  name: "userDetail",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    no: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loading: false,
      showModal: false,
      cardForm:{},
      userListColumns: [
        {
          title: "ID",
          key: "id",
          align: "left",
          width: 100
        },
        {
          title: "图书名称",
          key: "title",
          align: "left",
          width: 200
        },
        {
          title: "学科",
          key: "subject_name",
          align: "left",
          width: 100
        },
        {
          title: "年级",
          key: "grade_id",
          align: "left",
          width: 60
        },
        {
          title: "适用版本",
          key: "version_years",
          align: "left",
          width: 100
        },
        {
          title: "兑换码",
          key: "from_code",
          align: "left",
          width: 150
        },
        {
          title: "兑换时间",
          key: "create_time",
          align: "left",
          // width: 150
        }
      ],
      userListColumns1: [
        {
          title: "ID",
          key: "id",
          align: "left",
          width: 100
        },
        {
          title: "课程名称",
          key: "title",
          align: "left",
          width: 200
        },
        {
          title: "学科",
          key: "subject_name",
          align: "left",
          width: 100
        },
        {
          title: "年级",
          key: "grade_id",
          align: "left",
          width: 60
        },
        {
          title: "适用版本",
          key: "version_years",
          align: "left",
          width: 100
        },
        {
          title: "兑换码",
          key: "from_code",
          align: "left",
          width: 150
        },
        {
          title: "兑换时间",
          key: "create_time",
          align: "left",
          // width: 150
        }
      ]
    };
  },
  computed: {},
  mounted() {},
  methods: {
    getCurrentUserInfo(no) {
      if(!no){
        return false;
      }
      if (this.loading) {
        return false;
      }
      this.loading = true;
      let param = {
        user_id: no
      };
      userApi.getBoobExUserInfo(param).then(res => {
        if (res.res_code == 1) {
          this.cardForm = res.data
        } else {
          this.$Message.error("获取失败");
        }
        this.loading = false;
      }).catch(err => {
          this.loading = false;
        });
    }
  },
  watch: {
    isShow: function(value) {
      console.log(value);
      //点击添加课程
      if (value) {
        this.showModal = value;
        this.getCurrentUserInfo(this.no);
      }
    },
    showModal: function(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  }
};
</script>
