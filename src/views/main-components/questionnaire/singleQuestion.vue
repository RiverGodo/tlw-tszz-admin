<template>
    <div class="single-select">
        <div class="single-select-input">
            {{question.title}}
        </div>
        <div class="single-select-radio">
            <div class="single-select-radio-item" v-for="(item, index) in question.options">
                <input type="radio" :checked="item.option_id == question.answers[0]" disabled></input>
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="single-select-options">
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
      type: Number
    }
  },
  methods: {
    editQuestion(){
      this.$emit("on-edit-question", { type: 0, index: this.SIndex });
    },
    delQuestion(v){
      this.$emit("on-del-question", { index: this.SIndex });
    },
    setPosition(v) {
      this.$emit("on-set-position", { option: v, index: this.SIndex });
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
    display: flex;
    align-items: center;
    input[type="radio"] {
      margin-right: 10px;
    }
  }
  .single-select-options {
    margin-top: 10px;
    opacity: 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
