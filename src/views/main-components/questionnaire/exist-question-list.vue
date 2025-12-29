<template>
  <Row>
    <Row :key="item.option_id" v-for="item in row.option_arr">
      <Row class="select-item">选项: {{item.content}}</Row>
    </Row>
   </Row>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>
<style lang="less" scoped>
.select-item{
  margin-left: 208px;
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>
