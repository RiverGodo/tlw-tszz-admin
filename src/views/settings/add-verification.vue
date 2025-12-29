<template>
  <div class="add-verification">
    <Breadcrumb separator=">">
      <BreadcrumbItem>天利商城</BreadcrumbItem>
      <BreadcrumbItem to="/SignUp/Verification">课程兑换码</BreadcrumbItem>
      <BreadcrumbItem>生成验证码</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow class="create-verfication">
      <Form class="common-form" ref="form" :model="form" :rules="ruleValidate" label-position="right" :label-width="160">
        <FormItem label="批次名称" prop="name">
          <Input v-model="form.name" style="width: 200px;" placeholder="请输入批次名称"></Input>
        </FormItem>
        <FormItem label="邀请码数量" prop="count">
          <Input :disabled="isDisabled" @on-change="onCountChange" v-model="form.count" style="width: 200px;" placeholder="请输入邀请码数量"></Input>&nbsp;最多10000个
        </FormItem>
        <FormItem label="单个文件中兑换码的数量" v-if="!isDisabled" prop="file_count">
          <Input style="width: 200px;" v-model="form.file_count" placeholder="请输入数量"></Input>
        </FormItem>
        <FormItem label="下载文件序号范围" v-if="isDisabled">
          <Row>
            <Col :span="4">
            <Input v-model="form.start_id" :disabled="isDisabled" placeholder="请输入数量"></Input>
            </Col>
            <Col :span="1" style="text-align: center"> ---
            </Col>
            <Col :span="4">
            <Input v-model="form.end_id" :disabled="isDisabled" placeholder="请输入数量"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="验证码类型" prop="type">
          <Select v-model="form.type" style="width:200px">
            <Option v-for="item in typeList" :key="item.type_id" :value="item.type_id">{{item.type_name}}</Option>
          </Select>
          <span>1.若无可选类型，请选择 “新增验证码类型” 添加新类型后再进行选择；2.若需兑换点卡，请选择点卡类型并输入学分以及余额。</span>
        </FormItem>
        <FormItem label="添加类型" v-if="form.type==-1">
          <Input v-model.trim="type_name" style="width:200px;margin-right:10px"></Input>
          <Button type="primary" :loading="addTypeLoading" @click="addType">提交</Button>
        </FormItem>
        <template v-if="form.type===17">
          <FormItem label="学分" prop="point">
            <Input v-model="form.point" style="width:200px;"></Input>
          </FormItem>
          <FormItem label="余额" prop="xg_money">
            <Input v-model="form.xg_money" style="width:200px;"></Input>
          </FormItem>
        </template>
        <FormItem label="有效时间">
          <i-switch v-model="isInfinite" size="large" @on-change="onChangeInfinite">
            <span slot="open">永久</span>
            <span slot="close">有效</span>
          </i-switch>
          <Row v-if="!isInfinite" type="flex" justify="start" align="middle" style="margin-top: 10px;">
            <Col span="5">
            <DatePicker type="date" format="yyyy-MM-dd" v-model="form.start_time" placeholder="请选择生效时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center"> 至
            </Col>
            <Col span="5">
            <DatePicker type="date" format="yyyy-MM-dd" v-model="form.end_time" placeholder="请选择失效时间"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="兑换内容" prop="original_price">
          <create-verfication-content :contentData="form.bind_content" ref="createVerRef"></create-verfication-content>
        </FormItem>
        <FormItem label="兑换方式">
          <i-switch v-model="exchange_mode" size="large" @on-change="onChoose">
            <span slot="open">全部</span>
            <span slot="close">部分</span>
          </i-switch>
        </FormItem>
        <FormItem label="兑换数量" prop="content_count" v-if="!exchange_mode">
          <Input style="width: 150px;" v-model="form.content_count" placeholder="请输入兑换数量"></Input>
        </FormItem>
        <FormItem label="描述" prop="description">
          <quill-editor :disabled="isDisabled" v-model="form.description" class="rich-editor" ref="myQuillEditor" :options="richEditorDef">
          </quill-editor>
        </FormItem>
      </Form>
      <div style="text-align: center;">
        <Button type="ghost" size="large" style="margin-right:20px" :loading="addVerificationLoading" @click="goBack">返回</Button>
        <Button type="primary" size="large" :loading="addVerificationLoading" @click="CreateVerification">{{btnName}}</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import { mapState, mapActions } from "vuex";
import moment from "moment";

import createVerficationContent from "../modal-components/create-verification-content";
import {
  getCodeCategoryDetail,
  createCode,
  updateCodeCategory,
  addCodeCategoryType,
  getCodeCategoryTypeList
} from "../../api/codeCategory";

export default {
  components: {
    quillEditor,
    createVerficationContent
  },
  data() {
    return {
      addVerificationForm: {},
      isInfinite: true, // 是否永久 true -- 永久, false -- 有效
      addVerificationLoading: false,
      exchange_mode: true, // 兑换方式
      currentId: "", // 验证码ID
      btnName: "", // 按钮名称
      isDisabled: false, // 是否禁用 true -- 禁用, false -- 激活
      type_name: "",//类型名称
      addTypeLoading: false,
      form: {
        code_category_id: "",
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        count: "",
        insert_count: "",
        file_count: "",
        never_expires: 1, // 1 - 永不过期， -1 - 有效过期,
        code_type: 1, // 1 = 全部兑换, 2 = 部分兑换
        content_count: "",
        bind_content: [],
        type: 0,
        point: 0,
        xg_money: 0
      },
      ruleValidate: {
        name: [{
          required: true,
          message: "请输入批次名称",
          trigger: "blur"
        }],
        count: [
          {            required: true, validator: (rule, value, callback) => {
              if (!value) {
                this.$Message.error("请输入邀请码数量!");
                callback(new Error('请输入兑换码数量'))
              } else if (value > 10000) {
                this.$Message.error("请把邀请码数量限制在10000以内！");
                callback(new Error('请把邀请码数量限制在10000以内！'))
              } else {
                callback()
              }
            }, trigger: "blur"          }],
        file_count: [{
          required: true,
          message: "单个文件中兑换码的数量",
          trigger: "blur"
        }],
        content_count: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.form.code_type == 2 &&
              this.form.bind_content.length < value) {
              if (!value) {
                callback(new Error('请输入兑换次数'))
              } else {
                this.$Message.error("兑换内容数量不能超过兑换内容数量！");
                callback(new Error('兑换内容数量不能超过兑换内容数量！'))
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        type: [{
          required: true,
          validator: (rule, value, callback) => {
            console.log(value)
            if (value <= 0) {
              callback(new Error('请选择验证码类型'))
            } else {
              callback()
            }
          }, trigger: 'change'
        }
        ],
        point: [
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value) || Number(value) < 0) {
                callback(new Error('请输入零或正整数'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        xg_money: [
          {
            validator: (rule, value, callback) => {
              if (!/^\d+(\.\d{0,2})?$/.test(value) || Number(value) < 0) {
                callback(new Error('请输入大于0的数字(小数点后最多两位)'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      richEditorDef: state => state.app.richEditorDef,
      typeList: state => {
        let arr = [...state.codeCategory.codeCategoryTypeList]
        let extension = [
          {
            type_id: -1,
            type_name: '新增验证码类型'
          }
        ]
        arr = extension.concat(arr)
        return arr
      }
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(['getCodeCategoryTypeList']),
    // 初始化
    init() {
      this.getCodeCategoryTypeList();
      if (this.$route.query.code_category_id) {
        this.getDetail();
      }
      this.currentId = this.$route.query.code_category_id;
      if (this.currentId) {
        this.btnName = "保存";
        this.isDisabled = true;
      } else {
        this.btnName = "生成兑换码并返回";
        this.isDisabled = false;
        this.form.content_count = 0;
      }
    },
    // 邀请码数量同步
    onCountChange() {
      this.form.file_count = this.form.count;
      this.form.insert_count = this.form.count;
    },
    // 获取详情
    getDetail() {
      getCodeCategoryDetail({
        code_category_id: this.$route.query.code_category_id
      })
        .then(res => {
          if (res.res_code == 1) {
            this.form = res.msg;
            this.form.start_time = new Date(res.msg.start_time);
            this.form.end_time = new Date(res.msg.end_time);
            this.isInfinite = res.msg.never_expires > 0 ? true : false;
            this.form.code_category_id = parseInt(
              this.$route.query.code_category_id
            );
            this.form.file_count = "";
            this.form.insert_count = "";
            this.exchange_mode = res.msg.code_type == 1 ? true : false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 验证生效时间
    ValidateTime() {

    },
    // 创建验证码
    CreateVerification() {
      this.form.bind_content = this.$refs.createVerRef.contentList;
      console.log(this.form);
      if (!this.isInfinite) {
        if (!this.form.start_time || this.form.start_time == "Invalid date") {
          this.$Message.error("请选择生效时间");
          return
        }
        if (!this.form.end_time || this.form.end_time == "Invalid date") {
          this.$Message.error("请选择生效时间");
          return
        }
      } else {
        this.form.start_time = moment().format("YYYY-MM-DD");
        this.form.end_time = "2050-12-30";
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.addVerificationLoading = true;
          if (!this.currentId) {
            createCode(this.form)
              .then(res => {
                if (res.res_code == 1) {
                  this.$Message.success("生成兑换码成功!");
                  this.$router.back();
                } else {
                  this.$Message.error(res.msg);
                }
                this.addVerificationLoading = false;
              })
              .catch(error => {
                console.log(error);
                this.addVerificationLoading = false;
              });
          } else {
            updateCodeCategory(this.form)
              .then(res => {
                if (res.res_code == 1) {
                  this.$Message.success("更新兑换码成功!");
                  this.$router.back();
                } else {
                  this.$Message.error(res.msg);
                }
                this.addVerificationLoading = false;
              })
              .catch(error => {
                console.log(error);
                this.addVerificationLoading = false;
              });
          }
        } else {
          this.addVerificationLoading = false;
        }
      });
    },
    // 选择兑换方式
    onChoose(v) {
      this.form.code_type = v ? 1 : 2;
    },
    // 选择是否永久
    onChangeInfinite(v) {
      this.form.never_expires = v ? 1 : -1;
      if (!v) {
        this.form.end_time = moment(this.form.end_time).format("YYYY-MM-DD");
        this.form.start_time = moment(this.form.start_time).format(
          "YYYY-MM-DD"
        );
      } else {
        this.form.end_time = "";
        this.form.start_time = "";
      }
    },
    // 返回
    goBack() {
      this.$router.back()
    },
    addType() {
      this.addTypeLoading = true
      this.addVerificationLoading = true
      addCodeCategoryType({
        type_name: this.type_name
      }).then(res => {
        console.log(res)
        if (res.res_code === 1) {
          getCodeCategoryTypeList().then(result => {
            if (result.res_code == 1) {
              this.$store.commit('set_code_category_type_list', result.data)
              this.form.type = res.data
              this.$refs.form.validateField('type')
              this.addTypeLoading = false
              this.addVerificationLoading = false
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error(res.msg)
          this.addTypeLoading = false
          this.addVerificationLoading = false
        }
      }).catch(err => {
        this.addVerificationLoading = false
        this.addTypeLoading = false
      })
    }
  }
};
</script>
<style lang="less" scoped>
</style>
