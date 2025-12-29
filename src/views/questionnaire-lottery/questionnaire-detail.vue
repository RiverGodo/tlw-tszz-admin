<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">有奖反馈</BreadcrumbItem>
      <BreadcrumbItem to="/QuesLottery/QuestionnaireList">问卷列表</BreadcrumbItem>
      <BreadcrumbItem>{{ isCreated ? '创建问卷' : '问卷编辑'}}</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <div class="top-bar" :class="fixed ? 'fixed' : ''" :style="{'left': fixed ? bleft + 'px' : ''}" style="justify-content:flex-end">
        <Button type="ghost" @click="openModal">从已有题目列表中添加</Button>
        <div class="actions" style="flex: 0 0 100px;text-align:right;" :style="{'margin-right': fixed ? 250 + 'px' : ''}">
          <Dropdown @on-click="handleSelect">
            <Button type="primary">
              创建题目
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item, index) in questionCategoryList" :name="index" :key="item">{{ item }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="list">
        <questionnaire-item :is-created="isCreated" ref="questionnaire"></questionnaire-item>
      </div>
    </Card>
    <exist-questions ref="existQuestions" @on-confirm="confirm"></exist-questions>
  </div>
</template>

<script>
  import {
    mapActions
  } from "vuex";
  import questionnaireItem from "@/views/main-components/questionnaire/questionnaire-item.vue";
  import expandRow from "@/views/main-components/questionnaire/tableExpand.vue";
  import existQuestions from '@/views/modal-components/exist-questions.vue';
  export default {
    components: {
      questionnaireItem,
      existQuestions
    },
    data() {
      return {
        questionCategoryList: ["单选", "多选", "填空", "单选+填空"],
        bleft: 0,
        fixed: false,
        addQuestionHasExist: false,
        columns10: [{
            type: "selection",
            width: 35,
            align: "center"
          },
          {
            type: "expand",
            width: 35,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              });
            }
          },
          {
            title: "Name",
            key: "name"
          },
          {
            title: "Age",
            key: "age"
          },
          {
            title: "Address",
            key: "address"
          }
        ],
        data9: [{
            name: "John Brown",
            age: 18,
            address: "New York No. 1 Lake Park",
            job: "Data engineer",
            interest: "badminton",
            birthday: "1991-05-14",
            book: "Steve Jobs",
            movie: "The Prestige",
            music: "I Cry"
          },
          {
            name: "Jim Green",
            age: 25,
            address: "London No. 1 Lake Park",
            job: "Data Scientist",
            interest: "volleyball",
            birthday: "1989-03-18",
            book: "My Struggle",
            movie: "Roman Holiday",
            music: "My Heart Will Go On"
          },
          {
            name: "Joe Black",
            age: 30,
            address: "Sydney No. 1 Lake Park",
            job: "Data Product Manager",
            interest: "tennis",
            birthday: "1992-01-31",
            book: "Win",
            movie: "Jobs",
            music: "Don’t Cry"
          },
          {
            name: "Jon Snow",
            age: 26,
            address: "Ottawa No. 2 Lake Park",
            job: "Data Analyst",
            interest: "snooker",
            birthday: "1988-7-25",
            book: "A Dream in Red Mansions",
            movie: "A Chinese Ghost Story",
            music: "actor"
          }
        ],
        isCreated: 0
      };
    },
    computed: {},
    mounted() {
      var that = this;
      this.$nextTick(function () {
        that.singlePageCon = document.querySelector(".single-page-con");
        that.singlePage = document.querySelector(".single-page");
        that.createButton = document.querySelector(".ivu-dropdown");
        that.bleft = 200;

        that.singlePageCon.addEventListener("scroll", function () {
          if (that.createButton.offsetTop == 0) {
            that.fixed = true;
          }
          if (this.scrollTop == 0) {
            that.fixed = false;
          }
        });
      });

      // console.log(window.localStorage.getItem('questionnaire_id'))

      if (this.$route.query.questionnaire_id) {
        this.get_question_list_by_questionnaire({
          questionnaire_id: this.$route.query.questionnaire_id
        })
      } else if (window.localStorage.getItem('questionnaire_id')) {
        this.get_question_list_by_questionnaire({
          questionnaire_id: window.localStorage.getItem('questionnaire_id')
        })
      } else {
        this.$store.commit('SET_QUESTIONNAIRE_DETAIL', {
          question_arr: [],
          qn_title: ''
        })
      }

      this.isCreated = +this.$route.query.isCreate;
    },
    beforeDestroy() {
      window.localStorage.removeItem('questionnaire_id')
    },
    methods: {
      ...mapActions(['get_question_list_by_questionnaire']),
      openModal() {
        this.$refs.existQuestions.openModal();
      },
      handleSelect(v) {
        this.$refs.questionnaire.showModal(v);
      },
      confirm() {
        this.$refs.questionnaire.handleSubmit();
      }
    }
  };
</script>

<style lang="less" scoped>
  .list {
    width: 100%;
  }

  .fixed {
    height: 60px;
    background: #fff;
    position: fixed;
    left: 0;
    top: 60px;
    z-index: 999;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    animation: slideInto 0.5s ease-in-out;
    .ivu-btn {
      margin-left: 20px;
    }
  }

  @keyframes slideInto {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0%);
    }
  }

  .page-size-wrapper {
    display: flex;
    justify-content: flex-end;
  }
</style>