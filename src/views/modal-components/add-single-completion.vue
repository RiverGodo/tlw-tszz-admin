<template>
  <Modal class="common-dialog" title="创建单选题" v-model="addSingleAndCompletionModal" @on-visible-change="visibleChange" :mask-closable="false">
    <div class="single-select">
      <div class="single-select-input">
        <Input type="textarea" :autosize="true" v-model="selfQuestion.title" name="" id=""></Input>
      </div>
      <div class="single-select-input">
          <Select v-model="selfQuestion.category" style="width:200px;">
              <Option v-for="item in categorys" :value="item.category" :key="item.category">{{ item.name }}</Option>
          </Select>
      </div>
      <div class="single-select-radio">
        <Row type="flex" align="middle" class="single-select-radio-item" :key="index" v-for="(item, index) in selfQuestion.option_arr">
          <Col><Radio></Radio></Col>
          <Col style="flex:1"><Input type="text" v-model="item.content" name="" id=""></Input></Col>
          <Col><Button type="text" @click="delOption(index)">删除</Button></Col>
        </Row>
        <div class="single-select-radio-item">
          <Input type="textarea" :rows="4"></Input>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div class="single-select-options">
        <label>
          <Button @click="addOption" type="primary">添加选项</Button>
          <!-- <Button v-if="canDel" @click="delQuestion" type="primary">删除</Button> -->
        </label>
        <Button @click="saveQuestion" type="primary">确定</Button>
      </div>
    </div>
  </Modal>
</template>
<script>
import categorys from "@/libs/categorys";
export default {
  data() {
    return {
      selfQuestion: {},
      addSingleAndCompletionModal: false,
      canDel: false,
      categorys
    };
  },
  methods: {
    questionData(v) {
      if (v) {
        this.selfQuestion = v;
        this.canDel = true;
      } else {
        this.canDel = false;
        this.selfQuestion = {
          question_id: -1,
          title: "单选+填空",
          category:1,
          type: 4,
          option_arr: [
            {
              option_id: -1,
              content: "单选题",
              orderby: 0
            },
            {
              option_id: -1,
              content: "单选题",
              orderby: 0
            },
            {
              option_id: -1,
              content: "填空题",
              orderby: 0
            }
          ]
        };
      }
    },
    delOption(i) {
      this.selfQuestion.option_arr.splice(i, 1);
    },
    visibleChange(v) {
      if (!v) this.addSingleAndCompletionModal = false;
    },
    addOption() {
      this.selfQuestion.option_arr.push({
        option_id: -1,
        content: "单选题",
        orderby: 0
      });
    },
    saveQuestion() {
      this.$emit("on-save-question", this.selfQuestion);
      this.addSingleAndCompletionModal = false;
    },
    parentOpenModal() {
      this.addSingleAndCompletionModal = true;
    },
    handleSelect(v) {
      this.selfQuestion.answers[0] = v.option_id;
    },
    delQuestion(v) {
      this.$emit("on-del-question", {
        index: this.SIndex
      });
    }
  }
};
</script>
<style lang="less" scoped>
.single-select {
  margin-left: 15px;
  margin-right: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 20px;
  &:hover .single-select-options {
    opacity: 1;
  }
  input {
    height: 40px;
    border: 0;
    &:focus {
      background: #fdf9cd;
      outline: none;
      box-shadow: none;
    }
  }
  .single-select-input {
    margin-bottom: 20px;
    input {
      width: 100%;
      font-size: 16px;
    }
  }
  .single-select-radio .ivu-radio-group {
    display: flex;
    flex-direction: column;
    input {
      width: 100%;
    }
  }
  .single-select-radio-item {
    input[type="radio"] {
      margin-right: 10px;
    }
    margin-bottom: 10px;
  }
  .single-select-options {
    margin-top: 10px;
    opacity: 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
