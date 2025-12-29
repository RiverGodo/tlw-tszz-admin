<template>
  <Modal class="common-dialog" title="创建多选题" v-model="addMultipleModal" @on-visible-change="visibleChange">
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
          <Col>
          <Checkbox></Checkbox>
          </Col>
          <Col style="flex:1">
          <Input type="text" v-model="item.content" name="" id=""></Input>
          </Col>
          <Col>
          <Button type="text" @click="delOption(index)">删除</Button>
          </Col>
        </Row>
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
      categorys,
      addMultipleModal: false,
      canDel: false
    };
  },
  methods: {
    delOption(i) {
      this.selfQuestion.option_arr.splice(i, 1);
    },
    visibleChange(v) {
      if (!v) this.addMultipleModal = false;
    },
    saveQuestion() {
      this.$emit("on-save-question", this.selfQuestion);
      this.addMultipleModal = false;
    },
    parentOpenModal(data) {
      if (data) {
        this.selfQuestion = data;
        this.canDel = true;
      } else {
        this.canDel = false;
        this.selfQuestion = {
          question_id: -1,
          title: "多选题",
          category: 1,
          type: 2,
          option_arr: [
            {
              option_id: -1,
              content: "多选题",
              orderby: 0
            },
            {
              option_id: -1,
              content: "多选题",
              orderby: 0
            }
          ]
        };
      }
      this.addMultipleModal = true;
    },
    addOption() {
      this.selfQuestion.option_arr.push({
        option_id: -1,
        content: "多选题",
        orderby: 0
      });
    },
    handleSelect(i) {
      this.selfQuestion.option_arr.map((item, index) => {
        if (index == i) {
          item.isChecked = !item.isChecked;
        }
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
    input[type="checkbox"] {
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
