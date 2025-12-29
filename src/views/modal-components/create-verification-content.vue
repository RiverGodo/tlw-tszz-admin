<template>
  <Row class="create-verification-content-wrapper">
    <Col span="4">
    <Row>
      <Button :disabled="isDisabled" type="primary" @click="addVerification">添加兑换内容</Button>
    </Row>
    </Col>
    <Col span="20">
    <Row style="margin-bottom: 10px" class="add-segment" type="flex" justify="start" align="middle" :key="index" v-for="(item, index) in contentList">
      <Col span="6">
      <Select :disabled="isDisabled" v-model="item.app_id" @on-change="onChange">
        <Option v-for="item in appList" :value="item.app_id" :key="item.app_id">{{ item.label }}</Option>
      </Select>
      </Col>
      <Col span="3" style="margin-left:20px; margin-right: 20px;">
      <Select v-if="item.app_id == 2" :key="1" :disabled="isDisabled" v-model="item.app_content.type">
        <Option v-for="item in typesEnglish" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-else-if="item.app_id==1" :disabled="isDisabled" :key="2" v-model="item.app_content.type">
        <Option v-for="item in typesBooks" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-else :disabled="isDisabled" :key="2" v-model="item.app_content.type">
        <Option v-for="item in typeSelectList" :value="item.state" :key="item.state">{{ item.name }}</Option>
      </Select>
      </Col>
      <Col span="6">
      <Input :disabled="isDisabled" v-model="item.app_content.related_name" @on-focus="showModal(item, index)" placeholder="请选择内容"></Input>
      </Col>
      <Col span="3" style="margin-left: 20px;">
      <Button :disabled="isDisabled" style="width: 80px;" @click="delVerification(index)">删除</Button>
      </Col>
    </Row>
    </Col>
    <choose-content-modal @on-choose-one="selOne" ref="chooseContentModalRef" />
  </Row>
</template>
<script>
import chooseContentModal from "../modal-components/choose-content-modal";
import { mapState } from "vuex";
export default {
  props: ["contentData", "isDisabled"],
  components: {
    chooseContentModal
  },
  data() {
    return {
      appList: [
        { app_id: 1, label: "天利图书增值小程序" },
        { app_id: 2, label: "天利英语小程序" },
        { app_id: 3, label: "天利商城" }
      ],
      typesEnglish: [{ value: 1, label: "专栏" }, { value: 2, label: "文章" }],
      typesBooks: [{ value: 2, label: "图书" }, { value: 3, label: "课程" }],
      titleList: [],
      currentItem: -1,
      currentType: "",
      addId: ""
    };
  },
  computed: {
    ...mapState({
      typeSelectList: state => state.product.typeSelectList,
    }),
    contentList() {
      return this.contentData;
    }
  },
  methods: {
    addVerification() {
      this.contentList.push({
        app_id: "",
        app_desc: "",
        app_content: {
          type: "",
          related_id: "",
          related_name: ""
        }
      });
    },
    onChange(v) {
      if (v == 2) {
        this.typesEnglish = [
          { value: 1, label: "专栏" },
          { value: 2, label: "文章" }
        ];
      } else {
        this.typesBooks = [
          { value: 2, label: "图书" },
          { value: 3, label: "课程" }
        ];
      }
    },
    delVerification(i) {
      this.contentList.splice(i, 1);
    },
    showModal(v, i) {
      this.addId = v.app_id;
      this.currentItem = i;
      this.currentType = v.app_content.type;
      this.$refs.chooseContentModalRef.openModal(v.app_id, v.app_content.type);
    },
    selOne(v) {
      this.contentList.map((item, index) => {
        if (index == this.currentItem) {
          console.log(v)
          switch (this.addId) {
            case 2:
              if (this.currentType == 2) {
                item.app_content.related_id = v.product_id;
                item.app_content.related_name = v.name;
              } else {
                item.app_content.related_id = v.package_id;
                item.app_content.related_name = v.name;
              }
              break;
            case 1:
              item.app_content.related_id = v.book_id;
              item.app_content.related_name = v.title;
              item.app_content.subject_id = v.subject_id;
              break;
            case 3:
              item.app_content.related_id = v.exam_id;
              item.app_content.related_name = v.name
              break;
          }
          item.app_desc = this.appList.filter(item => item.app_id == this.addId)[0].label;
        }
      });
    }
  },
  mounted() { }
};
</script>
<style lang="less" scoped>
.create-verification-content-wrapper {
  .add-segment {
  }
}
</style>
