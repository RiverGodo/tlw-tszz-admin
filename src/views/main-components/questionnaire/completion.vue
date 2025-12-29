<template>
    <div class="completion">
        <div class="completion-input">
            {{question.title}}
        </div>
        <div class="completion-answer">
            {{question.answers[0]}}
        </div>
        <div class="complete-options">
            <label>
                <Button @click="editQuestion" type="primary">编辑</Button>
                <Button @click="delQuestion" type="default">删除</Button>
                <Button @click="setPosition(1)" type="primary">上移</Button>
                <Button @click="setPosition(-1)" type="primary">下移</Button>
            </label>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    question: {
      type: Object
    },
    SIndex: {
      tyoe: Number
    }
  },
  methods: {
    editQuestion() {
      this.$emit("on-edit-question", { type: 2, index: this.SIndex });
    },
    delQuestion(v) {
      this.$emit("on-del-question", { index: this.SIndex });
    },
    setPosition(v) {
      this.$emit("on-set-position", { option: v, index: this.SIndex });
    }
  }
};
</script>
<style lang="less">
.completion {
  margin-left: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 20px;

  &:hover .complete-options {
    opacity: 1;
  }
  .completion-answer input {
    width: 400px;
    height: 30px;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;
  }
  .completion-input {
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 40px;
      border: 0;
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
