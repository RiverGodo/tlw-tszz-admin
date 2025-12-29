<template>
	<Row class="exam-analysis-question-item-root">
		<Row class="header" type="flex" align="middle">
			<Col :span="2" style="padding-left: 20px">题号: {{item.question_num}}</Col>
			<Col :span="4">
			<Row type="flex" align="middle">
				正确率:{{item.question_precision.toFixed(2)}}%
			</Row>
			</Col>
			<Col :span="4">
			<Row type="flex" align="middle">
				正确人次:{{item.question_students_count}}
			</Row>
            </Col>
            <Col :span="8"></Col>
			<Col :span="6">
			<Row type="flex" justify="end">
				<Button type="text" @click="handleExpandItem">{{!isExpand ? '展开' : '收起'}}</Button>
			</Row>
			</Col>
		</Row>
		<Row class="container" v-if="isExpand">
			<Row class="preview" style="padding:20px">
                <Row>
                    <Col :span="2">
                    <p>题干:</p>
                    </Col>
                    <Col :span="22">
                    <p>{{item.question_num}}.
                        <span v-html="item.question_title"></span>
                    </p>
                    </Col>
                </Row>
                <Row style="margin-top:20px">
                    <Col :span="2">
                    <br/>
                    </Col>
                    <Col :span="22">
                    <p :key="optionIndex" v-for="(option, optionIndex) in item.options">
                        {{option.index}}.
                        <span v-html="option.option"></span>
                        <br/>
                        <br/>
                    </p>
                    </Col>
                </Row>
                <Row>
                    <Col :span="2">
                    <p>答案:</p>
                    </Col>
                    <Col :span="22">
                    <p v-if="item.question_type == 1" style="display:inline" :key="answerIndex" v-for="(answer, answerIndex) in item.answer">
                        <span v-html="answer"></span>&nbsp;
                    </p>
                    <p v-if="item.question_type == 2">
                        <span v-html="item.answer"></span>
                    </p>
                    </Col>
                </Row>
                <Row style="margin-top:20px" v-if="item.question_type == 1">
                    <Col :span="2">
                    <p>选项情况:</p>
                    </Col>
                    <Col :span="22">
                    <p :key="optionIndex" v-for="(option, optionIndex) in item.option_statistics">
                        <span>
                            {{option.index == "NONE"?"未选择":option.index}}
                        </span>
                        :&nbsp;{{option.num}}人次选择，占总数的{{option.ratio.toFixed(2)}}%
                    </p>
                    </Col>
                </Row>
            </Row>
		</Row>
	</Row>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      isExpand: false
    };
  },
  mounted() {},
  methods: {
    handleExpandItem() {
        this.isExpand = !this.isExpand;
    }
  }
};
</script>
<style lang="less">
.exam-analysis-question-item-root {
  .header {
    height: 50px;
    line-height: 50px;
    border: 1px solid #dddee1;
  }
  .container {
    padding-top: 10px;
    border: 1px solid #dddee1;
  }
  .preview {
    img {
      width: 200px;
    }
  }
}
</style>
