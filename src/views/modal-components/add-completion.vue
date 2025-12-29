<template>
  <Modal class="common-dialog" title="创建填空题" v-model="addCompletionModal" @on-visible-change="visibleChange">
    <div class="completion">
      <div class="completion-input">
        <Input type="textarea" :autosize="true" v-model="selfQuestion.title" name="" id=""></Input>
      </div>
      <div class="completion-input">
          <Select v-model="selfQuestion.category" style="width:200px;">
              <Option v-for="item in categorys" :value="item.category" :key="item.category">{{ item.name }}</Option>
          </Select>
      </div>
      <div class="single-select-input">
          <Select v-model="selfQuestion.category" style="width:200px;">
              <Option v-for="item in categorys" :value="item.category" :key="item.category">{{ item.name }}</Option>
          </Select>
      </div>
      <div class="completion-answer">
        <Input type="textarea" v-model="selfQuestion.option_arr && selfQuestion.option_arr[0].content" :rows="4"></Input>
      </div>

    </div>
    <div slot="footer">
      <div class="complete-options">
        <label>
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
      addCompletionModal: false,
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
          title: "填空题",
          category: 1,
          type: 3,
          option_arr: [
            {
              option_id: -1,
              content: "",
              orderby: 0
            }
          ]
        };
      }
    },
    visibleChange(v) {
      if (!v) this.addCompletionModal = false;
    },
    saveQuestion() {
      this.$emit("on-save-question", this.selfQuestion);
      this.addCompletionModal = false;
    },
    parentOpenModal() {
      this.addCompletionModal = true;
    },
    delQuestion(v) {
      this.$emit("on-del-question", {
        index: this.SIndex
      });
    },
    setPosition(v) {
      this.$emit("on-set-position", {
        option: v,
        index: this.SIndex
      });
    }
  }
};
</script>
<style lang="less" scoped>
.completion {
  margin-left: 15px;
  margin-right: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 20px;

  &:hover .complete-options {
    opacity: 1;
  }
  textarea {
    width: 100%;
    height: 300px;
    border-color: #eee;
  }
  .completion-answer input {
    width: 400px;
    height: 30px;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;
  }
  .single-select-input {
    margin-bottom: 20px;
    input {
      width: 100%;
      font-size: 16px;
    }
  }
  .completion-input {
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 40px;
      border: 0;
      font-size: 16px;
      &:focus {
        background: #fdf9cd;
        outline: none;
        box-shadow: none;
      }
    }
  }
  .complete-options {
    margin-top: 10px;
    opacity: 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
