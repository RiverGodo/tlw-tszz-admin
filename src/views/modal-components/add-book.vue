<style lang="less">
.common-dialog.add-book-dialog {
  .happy_buy_row {
    margin-top: 20px;
    position: relative;
    &:first-child {
      margin-top: 0;
    }
    .happyBtn {
      position: absolute;
      right: -45px;
      top: 5px;
    }
  }
  textarea {
    font-size: 12px;
  }
  .ivu-modal-body {
    padding: 30px 50px 0 0;
  }
  .book-img-bar {
    display: flex;
    align-items: flex-end;
    .book-img {
      max-width: 200px;
      width: 100%;
      height: 100%;
      border: none;
    }
    .book-img-info {
      color: #8c9095;
      font-size: 12px;
    }
    .ivu-upload-select {
      margin-left: 20px;
    }
    .ivu-upload-list {
      margin-top: 0;
    }
  }
  /*   .ivu-modal .ivu-select-dropdown {
    position: fixed !important;
  } */
}
</style>

<template>
  <Modal
    class="common-dialog add-book-dialog"
    v-model="showModal"
    :title="title"
    :mask-closable="false"
  >
    <Form
      ref="addBookForm"
      :model="addBookForm"
      :rules="ruleValidate"
      label-position="right"
      :label-width="80"
    >
      <FormItem label="名称" prop="title">
        <Row>
          <Col span="24">
            <Input v-model="addBookForm.title" style="width: 100%" placeholder="请输入图书名称..."></Input>
          </Col>
        </Row>
        <p>注：名称中如包含"/"，请替换为其他分隔符。</p>
      </FormItem>
      <FormItem label="详情" prop="description">
        <quill-editor
          v-model="addBookForm.description"
          class="rich-editor"
          ref="myQuillEditor"
          :options="richEditorDef"
        ></quill-editor>
        <Spin fix v-if="articleImgUploading">
          <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
          <div>上传图片中...</div>
        </Spin>
        <div class="limit">
          <span style="color:red">*</span>注意：详情内图片必须使用编辑器内的图片上传，小程序内不支持外链图片。
        </div>
        <Upload
          style="display:none"
          :before-upload="ArticleImgUpload"
          action
          accept="image/*"
          :format="['jpg','jpeg','png']"
        >
          <Button
            id="articleImgUploadBtn"
            type="ghost"
            icon="ios-cloud-upload-outline"
          >articleImgUploadBtn</Button>
        </Upload>
        <!-- <Input v-model="addBookForm.description" type="textarea" :autosize="{minRows: 4,maxRows: 4}" placeholder="请输入一句话详情..."></Input> -->
      </FormItem>
      <div class="flex-row">
        <FormItem label="年级">
          <Select v-model="addBookForm.grade_id">
            <Option
              v-for="item in gradeList"
              :value="item.grade_id"
              :key="item.grade_id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="版本">
          <Select v-model="addBookForm.years">
            <Option
              v-for="item in yearsList"
              :value="item.year_id"
              :key="item.year_id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>
      <div class="flex-row">
        <FormItem label="学科">
          <Select v-model="addBookForm.subject_id">
            <Option
              v-for="item in subjectList"
              :value="item.subject_id"
              :key="item.subject_id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label></FormItem>
      </div>
      <FormItem label="类别">
        <CheckboxGroup v-model="addBookForm.category_id_arr">
          <Checkbox
            v-for="item in bookCategoryList"
            :key="item.category_id"
            :label="item.category_id"
          >{{item.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="适用地区" prop="city_id_arr">
        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          <Checkbox
            :indeterminate="checkBoxState.indeterminate"
            :value="checkBoxState.check_all"
            @click.prevent.native="handleCheckAll"
          >全选</Checkbox>
        </div>
        <CheckboxGroup v-model="addBookForm.city_id_arr" @on-change="checkAllGroupChange">
          <Checkbox v-for="item in cityList" :key="item.city_id" :label="item.city_id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <!-- <div class="flex-row">
        <FormItem label="实际价格" prop="price">
          <Input v-model="addBookForm.price" style="width:98px"></Input>
          <span style="color:#888;margin-left:5px">元</span>
        </FormItem>
        <FormItem label="原始价格" prop="original_price">
          <Input v-model="addBookForm.original_price" style="width:98px"></Input>
          <span style="color:#888;margin-left:5px">元</span>
        </FormItem>
        <FormItem label="可使用积分" prop="point_price">
          <Input v-model="addBookForm.point_price" style="width:98px"></Input>
          <span style="color:#888;margin-left:5px">1元=100积分</span>
        </FormItem>
      </div>-->
      <div class="flex-row">
        <FormItem :label="isSubject?'课程权限':'图书权限'">
          <Select v-model="role_id" style="width:110px;">
            <Option v-for="item in role_idList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>

        <FormItem label="验证码">
          <Select v-model="switchState.has_verify_code" style="width:100px;">
            <Option v-for="item in verifyList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="在线测评">
          <Select v-model="switchState.has_online_test">
            <Option v-for="item in testList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="switchState.state">
            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
          <!-- <i-switch v-model="switchState.state" size="large">
                    <span slot="open">上架</span>
                    <span slot="close">下架</span>
          </i-switch>-->
        </FormItem>
      </div>
      <div class="flex-row">
        <FormItem label="增值" style="flex:0 0 25%">
          <i-switch v-model="switchState.has_ex">
            <span slot="open">有</span>
            <span slot="close">无</span>
          </i-switch>
        </FormItem>
        <FormItem label="欢乐购" v-if="!isSubject" style="flex:0 0 25%">
          <i-switch v-model="switchState.has_happy_buy">
            <span slot="open">有</span>
            <span slot="close">无</span>
          </i-switch>
        </FormItem>
      </div>

      <FormItem label="超值欢乐购" v-show="!isSubject&&switchState.has_happy_buy">
        <Row v-for="(item,idx) in happy_buy_arr" :key="idx" class="happy_buy_row">
          <Col span="12">
            <Select v-model="item.exam_id">
              <Option
                v-for="item in examList"
                :value="item.exam_id"
                :key="item.exam_id"
              >{{item.sale_name}}</Option>
            </Select>
          </Col>
          <Col span="8" style="padding:0 6px;">
            <Input v-model="item.sale_name" placeholder="请输入欢乐购名称..."></Input>
          </Col>
          <Col span="4">
            <Input v-model="item.price" placeholder="请输入欢乐购价格..."></Input>
          </Col>
          <!-- 一对多按钮 -->
          <!-- <Button class="happyBtn" size="small" type="primary" v-if="idx==0" @click="addHappyBuy">添加</Button>
          <Button class="happyBtn" size="small" type="ghost" v-else @click="removeHappyBuy(idx)">删除</Button>-->
        </Row>
      </FormItem>
      <!--  <div class="flex-row" v-show="!isSubject&&switchState.has_happy_buy">
        <FormItem label="欢乐购名称">

        </FormItem>
        <FormItem label="欢乐购价格" style="flex:0 0 30%">
          
        </FormItem>
      </div>-->

      <FormItem label="增值提示" v-show="switchState.has_ex">
        <Row>
          <Col span="24">
            <Input v-model="ex_tooltip" placeholder="请输入增值提示信息..." style="width: 100%"></Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="增值权限" v-show="switchState.has_ex">
        <Row>
          <Col span="6">
            <Select v-model="ex_role" placeholder="请设置增值权限">
              <Option
                v-for="(item,index) in ex_roleList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="有奖问卷">
        <Row>
          <Col span="24">
            <div style="line-height:34px;">{{addBookForm.questionnaire_name}}</div>
            <!-- <Input v-model="addBookForm.questionnaire_name" readonly></Input> -->
          </Col>
        </Row>
      </FormItem>
      <FormItem
        :label="switchState.has_online_test==1?'在线测评':'智能教辅'"
        v-show="switchState.has_online_test>0"
      >
        <Row>
          <Col span="6">
            <Select v-model="online_test_period">
              <Option
                v-for="(item,index) in online_test_type_all.period"
                :value="item.value"
                :key="index"
              >{{item.label}}</Option>
            </Select>
          </Col>
          <Col span="6">
            <Select v-model="online_test_type">
              <Option
                v-for="(item,index) in online_test_type_all.type"
                :value="item.value"
                :key="index"
              >{{item.label}}</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <Select
              ref="onlineTestSelect"
              v-model="onlineTestID"
              :label="onlineTestName"
              placement="bottom"
              filterable
              remote
              :remote-method="getOnlineTestList"
              :loading="onlineTestListLoading"
            >
              <Option
                v-for="option in onlineTestList"
                :value="option.online_test_book_id"
                :key="option.online_test_book_id"
              >{{option.online_test_book_name}}</Option>
            </Select>
          </Col>
          <Col span="6" style="padding-left:8px;">
            <Select v-model.trim="onlineTestSubName" ref="onlineTestSubNameSelect">
              <Option
                v-for="(item,index) in onlineTestSubNameList"
                :value="item"
                :key="index"
              >{{item}}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="封面">
        <Upload
          v-if="addBookForm.img_url == ''"
          :before-upload="handleUpload"
          action
          accept="image/*"
          :format="['jpg','jpeg','png']"
          type="drag"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p style="color: #80848f;">
              将图片拖拽至此处，或
              <span style="color: #2d8cf0;">点击上传</span>
            </p>
          </div>
        </Upload>
        <Spin size="large" fix v-if="addBookForm.img_url =='' && coverImgUploading">上传中...</Spin>
        <div class="book-img-bar" v-if="addBookForm.img_url !== ''">
          <img class="book-img" :src="addBookForm.img_url" />
          <Upload
            :before-upload="handleUpload"
            action
            accept="image/*"
            :format="['jpg','jpeg','png']"
          >
            <Button :loading="coverImgUploading" type="ghost" icon="ios-cloud-upload-outline">修改封面</Button>
          </Upload>
        </div>
        <p class="book-img-info">只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸750*450px</p>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" size="large" :loading="btnDisabled == 1" @click="AddBook()">保存返回</Button>
      <Button type="primary" size="large" :loading="btnDisabled == 2" @click="AddBook(true)">保存添加增值</Button>
    </div>
  </Modal>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import { mapActions, mapState } from "vuex";
import { ossSFileHost, getOssSign, uploadToAliyun } from "@/api/aliyunOss";
import * as apiBook from "@/api/book";
import Cookies from "js-cookie";
import moment from "moment";
export default {
  name: "addBookModal",
  components: {
    quillEditor
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    bookId: {
      type: Number,
      default: -1
    },
    isSubject: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      author: "", //作者
      showModal: false,
      ex_role: 0, //增值权限选择框
      ex_roleList: [
        {
          value: 0,
          label: "所有增值可用"
        },
        {
          value: 1,
          label: "验证后获取免费增值"
        },
        {
          value: 2,
          label: "验证后获取所有增值"
        }
      ],
      role_id: 0, //图书权限
      file: {},
      timeout: "",
      btnDisabled: 0,
      coverImgUploading: false,
      onlineTestID: "",
      onlineTestName: "",
      onlineTestSubName: "全科",
      //onlineTestSubNameList: [],
      onlineTestList: [],
      onlineTestListLoading: false,
      checkBoxState: {
        check_all: false,
        indeterminate: false
      },
      switchState: {
        has_verify_code: 0,
        has_online_test: 0,
        has_happy_buy: 0,
        has_ex: true,
        state: 0
      },
      ex_tooltip: "增值内容正在准备中", //增值提示文字
      verifyList: [
        {
          value: 0,
          label: "无验证码"
        },
        {
          value: 1,
          label: "验证码"
        },
        {
          value: 2,
          label: "兑换码"
        }
      ],
      testList: [
        {
          value: 0,
          label: "无测评"
        },
        {
          value: 1,
          label: "在线测评"
        },
        {
          value: 2,
          label: "智能辅导"
        }
      ],
      stateList: [
        {
          value: 0,
          label: "下架"
        },
        {
          value: 1,
          label: "上架"
        },
        {
          value: 2,
          label: "兑换后可见"
        }
      ],
      addBookForm: {
        book_id: -1, //判断是添加还是编辑
        title: "", //图书名称
        description: "", //详情
        subject_id: 15, //学科Id
        grade_id: 9, //年级ID
        years: moment().year(), //版本年份
        city_id_arr: [], //地区id数组
        category_id_arr: [], //图书类别ID数组
        img_url: "", //封面图路径
        has_verify_code: 0, //验证码传参
        has_online_test: 0, //在线测评传参
        has_happy_buy: 0, //欢乐购
        online_test_arr: [], //在线测评数组
        state: 1, //图书上下架状态
        questionnaire_id: 0, //有奖问卷ID
        questionnaire_name: "无", //有奖问卷名称
        happy_buy_arr: [], //欢乐购数组,
        username: "",
        price: 0, //实际价格
        original_price: 0, //原价
        point_price: 0 //积分
      },
      ruleValidate: {
        title: [
          { required: true, message: "请输入图书名称！", trigger: "blur" }
        ],
        city_id_arr: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个适用地区",
            trigger: "change"
          }
        ],
        price: [
          {
            validator: (rule, value, callback) => {
              if (!/^\d+(\.\d+)?$/.test(value)) {
                callback(new Error("请输入不小于0的数字"));
              } else {
                callback();
              }
            }
          }
        ],
        original_price: [
          {
            validator: (rule, value, callback) => {
              if (!/^\d+(\.\d+)?$/.test(value)) {
                callback(new Error("请输入不小于0的数字"));
              } else {
                callback();
              }
            }
          }
        ],
        point_price: [
          {
            validator: (rule, value, callback) => {
              if (
                this.addBookForm.price === "" ||
                !/^\d+(\.\d+)?$/.test(this.addBookForm.price)
              ) {
                callback(new Error("请先设置商品价格"));
              } else if (!/^\d*$/.test(value)) {
                callback(new Error("请输入不小于0的正整数"));
              } else if (this.addBookForm.price * 100 < value) {
                callback(new Error("积分应小于价格*100"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      examList: [],
      happy_buy_arr: [
        {
          exam_id: -1,
          sale_name: "",
          price: 0
        }
      ], //欢乐购内容
      idx: 0,
      articleImgUploading: false,
      online_test_type: 0, // 0在线测评 1 非在线
      online_test_period: 2, // 1 初中 2 高中
      online_test_type_all: {
        period: [
          {
            value: 1,
            label: "初中"
          },
          {
            value: 2,
            label: "高中"
          }
        ],
        type: [
          {
            value: 0,
            label: "在线测评"
          },
          {
            value: 1,
            label: "非在线测评"
          },
          {
            value: 2,
            label: "在线习题（智能辅导"
          },
          {
            value: 3,
            label: "变式题习题"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(value) {
      //点击添加课程
      if (value) {
        this.showModal = value;
        this.file = "";
        this.author = "";
        if (!this.isSubject) {
          apiBook.getExamList().then(res => {
            if (res.res_code == 1) {
              let examList = res.msg;
              examList.forEach(item => {
                this.examList.push({
                  exam_id: item.exam_id,
                  sale_name: item.exam_name
                });
              });
            }
          });
        }
        if (this.bookId > 0) {
          this.addBookForm.username = "";
          this.getBookDetail();
        }
        // else {
        //   this.addBookForm.book_id = -1
        //    this.addBookForm = {
        //      book_id: -1,
        //      title: "",
        //      description: "",
        //      subject_id: 15,
        //      grade_id: 9,
        //      years: moment().year(),
        //      city_id_arr: [],
        //      category_id_arr: [],
        //      img_url: "",
        //      has_verify_code: 0,
        //      has_online_test: 0,
        //      has_happy_buy: 0,
        //      online_test_arr: [],
        //      state: 1,
        //      questionnaire_id: 0,
        //      questionnaire_name: '无',
        //      happy_buy_arr: []
        //    };
        //    this.happy_buy_arr = [{
        //      exam_id: -1,
        //      sale_name: '',
        //      price: ''
        //    }];
        //    this.ex_role = 0;
        //    this.ex_tooltip = "增值内容正在准备中";
        //    this.role_id = 0;
        //    this.switchState = {
        //      has_verify_code: 0,
        //      has_online_test: 0,
        //      has_ex: true,
        //      has_happy_buy: false,
        //      state: 0
        //    };
        //    this.onlineTestName = "";
        //    this.onlineTestList = [];
        //    this.onlineTestID = "";
        //    this.onlineTestName = "";
        // }
      }
    },
    showModal: function(value) {
      if (!value) {
        this.$emit("closeModal");
      }
    }
  },
  computed: {
    ...mapState({
      subjectList: state => state.app.subjectList,
      yearsList: state => state.app.yearsList,
      gradeList: state => state.app.gradeListBase,
      cityList: state => state.app.cityList,
      bookCategoryList: state => state.book.bookCategoryList,
      richEditorDef: state => state.app.richEditorDef,
      role_idList: state => state.book.role_idList
    }),
    title() {
      if (this.isSubject) {
        return this.bookId > 0 ? "编辑课程" : "添加课程";
      } else {
        return this.bookId > 0 ? "编辑图书" : "添加图书";
      }
    },
    onlineTestSubNameList() {
      let ot = this.onlineTestList.filter(
        e => e.online_test_book_id == this.onlineTestID
      );
      let arr = [];
      if (ot.length == 1) {
        arr = ot[0].online_test_subject_name.split(",");
        arr.unshift("全科");
      }
      return arr;
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.bindArticleImgUploadHandler();
    this.getBookCategoryList();
  },
  methods: {
    ...mapActions(["getBookCategoryList"]),
    getBookDetail() {
      //点击编辑获取相关数据
      /*       this.onlineTestName = "";
            this.onlineTestID = ""; */
      apiBook.getBookDetail(this.bookId).then(res => {
        if (res.res_code == 1) {
          let book = res.msg[0];
          this.author = book.author;
          this.addBookForm.book_id = book.book_id;
          this.addBookForm.title = book.title;
          this.addBookForm.description = book.description;
          this.addBookForm.questionnaire_id = book.questionnaire_id;
          this.addBookForm.questionnaire_name = book.questionnaire_name || "无";
          this.addBookForm.price = book.price;
          this.addBookForm.original_price = book.original_price;
          this.addBookForm.point_price = book.point_price;
          this.role_id = book.role_id;
          if (book.category && book.category.length > 0) {
            this.addBookForm.category_id_arr = book.category.map(
              e => e.category_id
            );
          }
          if (book.city && book.city.length > 0) {
            this.addBookForm.city_id_arr = book.city.map(e => e.city_id);
          }
          if (book.city && book.city.length == this.cityList.length) {
            //是否勾选地区全选
            this.checkBoxState.check_all = true;
          } else {
            this.checkBoxState.check_all = false;
          }
          if (book.grade && book.grade.length > 0) {
            this.addBookForm.grade_id = book.grade[0].grade_id;
          }
          this.addBookForm.subject_id = book.subject_id;
          this.addBookForm.years = book.version_years;
          this.addBookForm.img_url = book.img_url;
          this.switchState.has_verify_code = book.has_verify_code;
          this.switchState.state = book.state;
          this.switchState.has_online_test = book.has_online_test;
          this.switchState.has_happy_buy =
            book.has_happy_buy == 1 ? true : false;
          if (this.switchState.has_happy_buy) {
            //欢乐够
            apiBook.getHappyBuyList(this.bookId).then(res => {
              if (res.res_code == 1) {
                this.happy_buy_arr = [];
                let arr = res.msg;
                if (arr.length < 1) {
                  this.happy_buy_arr = [
                    {
                      exam_id: -1,
                      sale_name: "",
                      price: ""
                    }
                  ];
                }
                arr.forEach(item => {
                  this.happy_buy_arr.push({
                    exam_id: item.exam_id,
                    sale_name: item.sale_name,
                    price: item.price
                  });
                });
              }
            });
          } else {
            this.happy_buy_arr = [
              {
                exam_id: -1,
                sale_name: "",
                price: ""
              }
            ];
          }
          this.switchState.has_ex = book.has_ex == 1 ? true : false; //图书增值
          if (this.switchState.has_ex) {
            this.ex_role = book.ex_role;
            this.ex_tooltip = book.ex_tooltip;
          }
          if (book.online_test && book.online_test.length) {
            //已绑在线测评
            this.online_test_type = book.online_test[0].online_test_type
            this.online_test_period = book.online_test[0].online_test_period
            this.getOnlineTestList(
              book.online_test[0].online_test_book_name
            ).then(res => {
              this.$nextTick(() => {
                this.onlineTestID = book.online_test[0].online_test_book_id;
                this.onlineTestName =
                  book.online_test[0].online_test_book_name || "";
                this.$nextTick(() => {
                  this.onlineTestSubName =
                    book.online_test[0].subject_name || "全科";
                });
              });
            });
          } else {
            this.onlineTestID = "";
            this.onlineTestName = "";
            this.onlineTestSubName = "全科";
            // this.onlineTestList = [];
          }
          this.$refs.addBookForm.validateField("title");
        }
      });
    },
    getOnlineTestList(query) {
      //获取在线测评列表
      return new Promise((resolve, reject) => {
        this.idx++;
        let vm = this;
        // this.onlineTestList = [];
        if (query != "") {
          //设置500毫秒请求延时
          let params = {
            content: query,
            online_test_period: vm.online_test_period,
            online_test_type: vm.online_test_type
          };
          clearTimeout(this.timeout);
          vm.timeout = setTimeout(function() {
            vm.onlineTestListLoading = true;
            apiBook.getOnlineTestList(params).then(res => {
              vm.onlineTestListLoading = false;
              if (res.res_code == 1) {
                let newArr = [];
                res.msg.forEach(item => {
                  // if(item.online_test_period == 1){
                  //   item.online_test_book_name
                  // }
                  // if(item.online_test_period == 2){
                  //   item.online_test_book_name
                  // }
                  if (item.online_test_published == 1) {
                    newArr.push(item);
                  }
                });
                vm.onlineTestList = newArr;
                resolve();
              }
            });
          }, 500);
        }
      });
    },
    handleCheckAll() {
      //全选
      if (this.checkBoxState.indeterminate) {
        this.checkBoxState.check_all = false;
      } else {
        this.checkBoxState.check_all = !this.checkBoxState.check_all;
      }
      this.checkBoxState.indeterminate = false;

      if (this.checkBoxState.check_all) {
        this.cityList.forEach(element => {
          this.addBookForm.city_id_arr.push(element.city_id);
        });
      } else {
        this.addBookForm.city_id_arr = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.cityList.length) {
        this.checkBoxState.indeterminate = false;
        this.checkBoxState.check_all = true;
      } else if (data.length > 0) {
        this.checkBoxState.indeterminate = true;
        this.checkBoxState.check_all = false;
      } else {
        this.checkBoxState.indeterminate = false;
        this.checkBoxState.check_all = false;
      }
    },
    handleUpload(file) {
      //图片上传
      if (file.size > 1024 * 1024) {
        this.$Message.warning("请选择小于1M的图片！");
        return;
      }
      this.file = file;
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tlw-web-static-file",
        dir: "tl-book/cover_img",
        filename: file.name,
        type: "POST"
      };
      this.coverImgUploading = true;
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(ossSFileHost.oss, formData).then(res => {
            if (res.status == 200) {
              this.addBookForm.img_url =
                ossSFileHost.cdn + sign_data.msg.filename;
            }
            this.coverImgUploading = false;
          });
        }
      });
      return false;
    },
    addHappyBuy() {
      //增加欢乐购
      this.happy_buy_arr.push({
        exam_id: -1,
        sale_name: "",
        price: 0
      });
    },
    removeHappyBuy(idx) {
      //删除欢乐购
      this.happy_buy_arr.splice(idx, 1);
    },
    ArticleImgUpload(file) {
      //详情图标上传
      if (file.size > 1024 * 1024) {
        this.$Message.warning("请选择小于1M的图片！");
        return;
      }
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tlw-web-static-file",
        dir: "tl-book/article_img",
        filename: file.name,
        type: "POST"
      };
      this.articleImgUploading = true;
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(ossSFileHost.oss, formData)
            .then(res => {
              if (res.status == 200) {
                let tmpImgUrl = ossSFileHost.cdn + sign_data.msg.filename;
                let addRange = this.editor.getSelection();
                this.editor.insertEmbed(
                  addRange !== null ? addRange.index : 0,
                  "image",
                  tmpImgUrl
                );
              } else {
                this.$Message.warning(JSON.stringify(res));
              }
              this.articleImgUploading = false;
            })
            .catch(err => {
              this.articleImgUploading = false;
              this.$Message.warning(JSON.stringify(err));
            });
        }
      });
      return false;
    },
    //绑定图片上传处理事件
    bindArticleImgUploadHandler() {
      this.editor.getModule("toolbar").addHandler("image", function(state) {
        if (state) {
          let fileInput = document.getElementById("articleImgUploadBtn");
          fileInput.click(); // 加一个触发事件
        }
      });
    },
    AddBook(goPage) {
      //保存添加增值按钮
      if (this.btnDisabled > 0) {
        return;
      }
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      if (this.bookId > 0) {
        if (
          this.author != "" &&
          this.author != "天利网" &&
          userInfo.name != this.author &&
          !userInfo.role_arr.includes(1)
        ) {
          this.$Message.warning("非创建者无法编辑，请联系创建者或管理员");
          return;
        }
      }
      this.$refs["addBookForm"].validate(valid => {
        if (valid) {
          this.btnDisabled = goPage ? 2 : 1;
          //提交时赋值
          this.addBookForm.role_id = this.role_id; //图书权限
          this.addBookForm.has_verify_code = this.switchState.has_verify_code; //验证码
          this.addBookForm.has_online_test = this.switchState.has_online_test; //在线测评
          this.addBookForm.has_happy_buy = this.switchState.has_happy_buy
            ? 1
            : 0; //欢乐购
          this.addBookForm.has_ex = this.switchState.has_ex ? 1 : 0; //增值
          this.addBookForm.state = this.switchState.state; //上下架
          this.addBookForm.online_test_arr = []; //测评数组
          if (this.addBookForm.has_online_test > 0 && this.onlineTestID != "") {
            this.addBookForm.online_test_arr.push({
              online_test_book_id: this.onlineTestID,
              subject_name: this.onlineTestSubName,
              city_id: 0
            });
          }
          if (this.isSubject) {
            this.addBookForm.type = 3;
          } else {
            this.addBookForm.type = 2;
          }
          if (this.addBookForm.has_ex) {
            this.addBookForm.ex_role = this.ex_role;
            this.addBookForm.ex_tooltip = this.ex_tooltip;
          }
          if (
            this.addBookForm.has_happy_buy > 0 &&
            this.happy_buy_arr[0].exam_id > 0
          ) {
            this.addBookForm.happy_buy_arr = this.happy_buy_arr;
          }
          apiBook.addOrUpdateBook(this.addBookForm).then(res => {
            this.btnDisabled = 0;
            if (res.res_code == 1) {
              this.showAddBook = false;
              this.$Message.success("保存图书成功！");
              this.showModal = false;
              if (goPage) {
                this.$router.push({
                  name: "book_resource_list",
                  params: {
                    book_id: res.msg
                  }
                });
              } else {
                this.$emit("refreshList");
              }
            } else {
              this.$Message.error("保存图书失败！");
            }
          });
        } else {
          this.$Message.error("请检测图书信息是否填写完整!");
        }
      });
    }
  }
};
</script>
