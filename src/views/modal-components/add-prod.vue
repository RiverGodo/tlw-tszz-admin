<template>
    <Modal class="common-dialog add-book-dialog" v-model="showModal" :title="title" :mask-closable="false">

        <Form ref="addProdForm" :model="addProdForm" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem label=" ">
                <Steps :current="currentStep">
                    <Step title="第一步" content="设置产品基础信息"></Step>
                    <Step title="第二步" content="设置产品附加信息"></Step>
                    <Step title="第三步" content="填写产品分享相关信息"></Step>
                </Steps>
            </FormItem>
            <div v-show="currentStep==0">
                <!-- 第一步 -->
                <FormItem label="产品名称" prop="name">
                    <Input v-model.trim="addProdForm.name" placeholder="请输入产品名称..."></Input>
                </FormItem>
                <FormItem label="简介" prop="description">
                    <Input v-model="addProdForm.description"></Input>
                </FormItem>
                <FormItem label="详细描述" prop="detail">
                    <quill-editor :key="1" ref="myQuillEditor" v-model="addProdForm.detail" class="rich-editor" :options="richEditorDef">
                    </quill-editor>
                    <Spin fix v-if="articleImgUploading">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传图片中...</div>
                    </Spin>
                    <div class="limit">
                        <span style="color:red">*</span>注意：详情内图片必须使用编辑器内的图片上传，小程序内不支持外链图片。</div>
                    <Upload style="display:none" :before-upload="ArticleImgUpload" action="" accept="image/*" :format="['jpg','jpeg','png']">
                        <Button id="articleImgUploadBtn" type="ghost" icon="ios-cloud-upload-outline">articleImgUploadBtn</Button>
                    </Upload>
                </FormItem>
                <FormItem label="产品图片" prop="img_url">
                    <Upload v-if="addProdForm.img_url == ''" :before-upload="handleProdImgUpload" action="" accept="image/*" :format="['jpg','jpeg','png']" type="drag">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p style="color: #80848f;">将图片拖拽至此处，或
                                <span style="color: #2d8cf0;">点击上传</span>
                            </p>
                        </div>
                    </Upload>
                    <Spin size="large" fix v-if="addProdForm.img_url =='' && img_uploading">上传中...</Spin>
                    <div class="book-img-bar" v-if="addProdForm.img_url !== ''">
                        <img class="book-img" :src="addProdForm.img_url" />
                        <Upload :before-upload="handleProdImgUpload" action="" accept="image/*" :format="['jpg','jpeg','png']">
                            <Button :loading="img_uploading" type="ghost" icon="ios-cloud-upload-outline">修改封面</Button>
                        </Upload>
                    </div>
                    <p>只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸750*750px</p>
                </FormItem>
                <div class="flex-row">
                    <FormItem label="实际价格" prop="price">
                        <Input v-model="addProdForm.price"></Input>
                    </FormItem>
                    <FormItem label="原始价格" prop="original_price">
                        <Input v-model="addProdForm.original_price"></Input>
                    </FormItem>
                    <FormItem label="产品类型" prop="type">
                        <Select v-model="addProdForm.type">
                            <Option v-for="item in typeSelectList" :value="item.state" :key="item.state">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="状态" prop="state">
                        <Select v-model="addProdForm.state">
                            <Option v-for="item in stateList" :value="item.state" :key="item.state">{{item.name}}</Option>
                        </Select>
                        <!-- <i-switch v-model="switchState.state">
                            <span slot="open">上架</span>
                            <span slot="close">下架</span>
                        </i-switch> -->
                    </FormItem>
                </div>
                <div class="flex-row">
                    <FormItem label="开始时间" prop="start_time">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:SS" v-model="addProdForm.start_time" placeholder="请选择开始时间"></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间" prop="end_time">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:SS" v-model="addProdForm.end_time" placeholder="请选择结束时间"></DatePicker>
                    </FormItem>
                </div>
                <FormItem label="绑定销售模式" prop="sale_id_arr">
                    <Select v-model="addProdForm.sale_id_arr">
                        <Option v-for="item in saleList" :key="item.id" :value="item.id">{{item.id}}---{{item.name}}---{{item.type|formatType}}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="绑定销售模式" prop="sale_id_arr">
                    <Select v-model="addProdForm.sale_id_arr" multiple>
                        <Option v-for="item in saleList" :key="item.id" :value="item.id">{{item.id}}---{{item.name}}---{{item.type|formatType}}</Option>
                    </Select>
                </FormItem> -->
            </div>
            <div v-show="currentStep==1">
                <!-- 第二步 -->
                <div class="flex-row">
                    <FormItem label="绑定兑换码" prop="has_verify_code">
                        <i-switch v-model="switchState.has_verify_code">
                            <span slot="open">有</span>
                            <span slot="close">无</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="显示地址" prop="has_address">
                        <i-switch v-model="switchState.has_address">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="用户信息" prop="has_user_info">
                        <i-switch v-model="switchState.has_user_info">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="添加类型">
                        <i-switch v-model="switchState.has_tags">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                </div>
                <FormItem label="信息类型" v-show="switchState.has_user_info">
                    <!-- <Checkbox :indeterminate="checkUiBoxState.indeterminate" :value="checkUiBoxState.check_all" @click.prevent.native="uiCheckAll">全选</Checkbox> -->
                    <CheckboxGroup v-model="addProdForm.user_info">
                        <Checkbox v-for="item in userInfoList" :key="item.id" :label="item.value">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>

                <FormItem label="绑定兑换码" v-if="switchState.has_verify_code" prop="codeCategory">
                    <Select v-model="code_category_id">
                        <Option v-for="item in codeCategoryList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <div v-for="(item,index) in tags" :key="index" v-if="switchState.has_tags" style="margin-bottom:10px">
                    <FormItem label="标签信息" prop="tags">
                        <Select v-model="item.subject_id" placeholder="请选择学科" style="width:240px">
                            <Option v-for="item in subjectList" :value="item.subject_id" :key="item.subject_id">{{ item.name }}</Option>
                        </Select>
                        <!-- <Input v-model.trim="item.tag_name" placeholder="请输入标签名称" :key="index" style="width:260px" /> -->
                        <span style="margin:0 8px">实际价格</span>
                        <Input v-model.number="item.price" :key="index" style="width:80px" />
                        <span style="margin:0 8px">原始价格</span>
                        <Input v-model.number=" item.original_price" :key="index" style="width:80px; margin-right:10px" />
                        <Button type="primary" v-if="index==0" @click="addTag">添加</Button>
                        <Button type="ghost" v-else @click="removeTag(index)">删除</Button>
                    </FormItem>
                    <FormItem label="标签详情">
                        <!-- <Input v-model="item.detail"></Input> -->
                        <quill-editor v-model="item.detail" class="rich-editor" ref="quillEditors" :options="richEditorDef">
                        </quill-editor>
                        <Spin fix v-if="articleImgUploading">
                            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                            <div>上传图片中...</div>
                        </Spin>
                        <div class="limit">
                            <span v-if="index==1" style="color:red">*</span>注意：详情内图片必须使用编辑器内的图片上传，小程序内不支持外链图片。</div>
                        <Upload style="display:none" :before-upload="ImgUploadByindex" action="" accept="image/*" :format="['jpg','jpeg','png']">
                            <Button @click="uploadBtnClick(index)" :id="'articleImgUploadBtn'+index" type="ghost" icon="ios-cloud-upload-outline">{{index}}</Button>
                        </Upload>
                    </FormItem>
                </div>
            </div>
            <div v-show="currentStep==2">
                <!-- 第三步 -->
                <FormItem label="分享图名称" prop="share_title">
                    <Input v-model.trim="addProdForm.share_title"></Input>
                </FormItem>
                <FormItem label="分享图描述" prop="share_desc">
                    <Input v-model="addProdForm.share_desc"></Input>
                </FormItem>
                <FormItem label="分享图" prop="share_img_url">
                    <Upload v-if="addProdForm.share_img_url==''" :before-upload="handleShareImgUpload" action="" accept="image/*" :format="[ 'jpg', 'jpeg', 'png']" type="drag">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p style="color: #80848f;">将图片拖拽至此处，或
                                <span style="color: #2d8cf0;">点击上传</span>
                            </p>
                        </div>
                    </Upload>
                    <Spin size="large" fix v-if="addProdForm.share_img_url=='' && shareimg_uploading">上传中...</Spin>
                    <div class="book-img-bar" v-if="addProdForm.share_img_url!==''">
                        <img class="book-img" :src="addProdForm.share_img_url" />
                        <Upload :before-upload="handleShareImgUpload" action="" accept="image/*" :format="['jpg', 'jpeg', 'png']">
                            <Button :loading="shareimg_uploading" type="ghost" icon="ios-cloud-upload-outline">修改封面</Button>
                        </Upload>
                    </div>
                    <p>只能上传 jpg/jpeg/png 文件，且不超过1M，建议尺寸200*200px</p>
                </FormItem>

            </div>
        </Form>
        <div slot="footer" class="flex-row" style="justify-content:space-between">
            <div>
                <Button type="warning" size="large" v-if="currentStep>0" @click="prev">上一步</Button>
                <Button type="ghost" size="large" @click="showModal=false">返回</Button>
            </div>
            <div>
                <Button type="info" size="large" v-if="currentStep<2" @click="next">下一步</Button>
                <Button type="primary" size="large" @click="AddProd">保存</Button>
            </div>
        </div>
    </Modal>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import { ossSFileHost, getOssSign, uploadToAliyun } from "@/api/aliyunOss";
import { mapState } from 'vuex';
import * as apiProd from '@/api/sign-up/product'
import { getCodeCategoryList } from '@/api/codeCategory'
import { getList } from '@/api/sign-up/sale'
import editorMixins from './editorMixins'
export default {
    name: 'addProd',
    mixins: [editorMixins],
    components: {
        quillEditor
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        productId: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            currentStep: 0,
            curStepStatus: "finish",
            checkBoxState: {
                check_all: false,
                indeterminate: false
            },
            checkUiBoxState: {
                check_all: false,
                indeterminate: false
            },
            btnDisabled: false,
            showModal: false,
            prod_file: {},
            share_file: {},
            code_category_id: -1,
            codeCategoryList: [],
            ruleValidate: {
                name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
                price: [{                    validator: (rule, value, callback) => {
                        if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                            callback(new Error('请输入数字(小数点后最多两位)'))
                        } else if (Number(value) < 0.01) {
                            callback(new Error('价格不得小于0.01'))
                        } else {
                            callback()
                        }
                    }                }],
                original_price: [{                    validator: (rule, value, callback) => {
                        if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                            callback(new Error('请输入数字(小数点后最多两位)'))
                        } else if (Number(value) < 0.01) {
                            callback(new Error('价格不得小于0.01'))
                        } else if (Number(value) < Number(this.addProdForm.price)) {
                            callback(new Error('原价不应小于实际价格'))
                        } else {
                            callback()
                        }
                    }                }],
                type: [{
                    require: true,
                    validator: (rule, value, callback) => {
                        if (!(Number(value) > 0)) {
                            callback(new Error('请选择产品类型'))
                        } else {
                            callback()
                        }
                    }
                }],
                state: [{
                    require: true,
                    validator: (rule, value, callback) => {
                        if (!(value > -2)) {
                            callback(new Error('请设置产品状态'))
                        } else {
                            callback()
                        }
                    }
                }],
                tags: [{
                    validator: (rule, value, callback) => {
                        let msg = ""
                        this.tags.map(item => {
                            if (!/^\d+(\.\d+)?$/.test(item.price) || !/^\d+(\.\d+)?$/.test(item.original_price)) {
                                msg = "请输入数字"
                            } else if (item.price < 0.01 || item.original_price < 0.01) {
                                msg = "价格不得小于0.01"
                            } else if (item.subject_id <= 0) {
                                msg = "请选择学科"
                            }
                        })
                        if (msg) {
                            callback(new Error(msg))
                        } else {
                            callback()
                        }
                    }
                }],
                sale_id_arr: [{
                    require: true,
                    validator: (rule, value, callback) => {
                        if (value < 1) {
                            callback(new Error('请绑定销售模式'))
                        } else {
                            callback()
                        }
                    }
                }],
                codeCategory: [{
                    validator: (rule, value, callback) => {
                        if (this.code_category_id < 0) {
                            callback(new Error('请绑定兑换码'))
                        } else {
                            callback()
                        }
                    }
                }]
            },
            addProdForm: {
                name: '',
                description: '',
                detail: '',
                share_title: '',
                share_desc: '',
                share_img_url: '',
                img_url: '',
                type: -1,
                price: 0,
                original_price: 0,
                start_time: null,
                end_time: null,
                state: -1,
                has_verify_code: 0,
                sale_id_arr: 0,
                has_address: 0,
                has_user_info: 0,
                //tags: [],
                user_info: [],
                subject_id_arr: [],
                city_id_arr: []
            },
            tags: [], //标签
            saleList: [],
            img_uploading: false,
            shareimg_uploading: false,
            switchState: {
                state: true,
                has_verify_code: false,
                has_address: false,
                has_user_info: false,
                has_tags: false
            },
            userInfoList: [
                {
                    id: 1,
                    name: '姓名',
                    value: 'realname'
                },
                {
                    id: 2,
                    name: 'QQ号',
                    value: 'qq'
                },
                {
                    id: 3,
                    name: '邮箱',
                    value: 'email'
                },
                {
                    id: 4,
                    name: '手机号',
                    value: 'phone'
                },
                {
                    id: 5,
                    name: '联考科目',
                    value: 'exam_subjects'
                },
                {
                    id: 6,
                    name: '地区',
                    value: 'area'
                },
                {
                    id: 7,
                    name: '微信昵称',
                    value: 'wx_nickname'
                }
            ]
        }
    },
    computed: {
        ...mapState({
            richEditorDef: state => state.app.richEditorDef,
            typeSelectList: state => state.product.typeSelectList,
            subjectList: state => state.app.subjectList,
            cityList: state => state.app.cityList,
            stateList: state => state.product.stateList
        }),
        title() {
            return this.productId > 0 ? '编辑产品' : '添加产品'
        },

    },
    filters: {
        formatType(value) {
            let str = ''
            switch (value) {
                case 1:
                    str = '无折扣'
                    break;
                case 2:
                    str = '每件直减'
                    break;
                case 3:
                    str = '总价直减'
                    break;
                case 4:
                    str = '折扣'
                    break;
            }
            return str
        }
    },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = true
                this.currentStep = 0
                if (this.codeCategoryList.length < 1) {
                    this.getCodeCategoryList()
                }
                if (this.saleList.length < 1) {
                    this.getSaleList()
                }
                console.log(this.productId)
                if (this.productId > 0) {
                    this.getProdDetail()
                }
            }
        },
        showModal(value) {
            if (!value) {
                this.$emit('closeModal')
            }
        },
        switchState: {
            handler: function (val, oldVal) {
                if (val.has_tags && this.tags.length == 0) {
                    this.addTag()
                }
            },
            deep: true
        },
        tags(value) {
            if (value.length) {
                this.$nextTick().then(() => {
                    this.editors = this.$refs.quillEditors || []
                    this.addAllImgUploadHandler()
                })
            }
        }
    },
    methods: {
        getCodeCategoryList() {//获取兑换码列表
            getCodeCategoryList({
                page_index: 1,
                page_size: 999,
                state: 1,
            }).then(res => {
                if (res.res_code == 1) {
                    let data = res.msg
                    data.forEach(item => {
                        this.codeCategoryList.push({
                            id: item.id,
                            name: item.name
                        })
                    });
                }
            })
        },
        getSaleList() {//获取销售模式列表
            getList({
                sale_name: '',
                type: 0,
                is_group_purchase: -1,
                is_pre_buy: -2
            }).then(res => {
                if (res.res_code === 1) {
                    let arr = []
                    let saleList = [...res.data.saleList].sort((a, b) => a.id - b.id)
                    saleList.forEach(item => {
                        arr.push({
                            id: item.id,
                            name: item.sale_name,
                            type: item.type
                        })
                    })
                    this.saleList = arr
                }
            })
        },
        handleProdImgUpload(file) {//产品图片上传
            if (file.size > 1024 * 1024) {
                this.$Message.warning("请选择小于1M的图片！");
                return;
            }
            this.prod_file = file;
            var date = new Date();
            date = date.toGMTString();
            let config = {
                content_type: file.type,
                date: date,
                bucket: "tlw-web-static-file",
                dir: "tl-xg-exam/prod_img",
                filename: file.name,
                type: "POST"
            };
            this.img_uploading = true;
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
                            this.addProdForm.img_url =
                                ossSFileHost.cdn + sign_data.msg.filename;
                        }
                        this.img_uploading = false;
                    })
                }
            });
            return false;
        },
        handleShareImgUpload(file) {//分享图片上传
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
                dir: "tl-xg-exam/exam-image",
                filename: file.name,
                type: "POST"
            };
            this.shareimg_uploading = true;
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
                            this.addProdForm.share_img_url =
                                ossSFileHost.cdn + sign_data.msg.filename;
                        }
                        this.shareimg_uploading = false;
                    })
                }
            });
            return false
        },
        AddProd() {//添加产品
            if (this.btnDisabled) return;
            this.$refs.addProdForm.validate(valid => {
                if (valid) {
                    this.btnDisabled = true;
                    //提交赋值
                    if (this.productId) {
                        this.addProdForm.product_id = this.productId
                    }
                    if (!this.addProdForm.share_title) {
                        this.addProdForm.share_title = this.addProdForm.name
                    }
                    if (!this.addProdForm.share_desc) {
                        this.addProdForm.share_desc = this.addProdForm.description
                    }
                    this.addProdForm.sale_id_arr = this.addProdForm.sale_id_arr > 0 ? [this.addProdForm.sale_id_arr] : []
                    // this.addProdForm.state = this.switchState.state ? 1 : -1
                    this.addProdForm.has_verify_code = this.switchState.has_verify_code ? 1 : 0
                    this.addProdForm.has_address = this.switchState.has_address ? 1 : 0
                    this.addProdForm.has_user_info = this.switchState.has_user_info ? 1 : 0
                    if (this.addProdForm.has_user_info == 0) {
                        this.addProdForm.user_info = []
                    }
                    this.addProdForm.city_id_arr = []
                    if (this.switchState.has_tags) {
                        for (const tag of this.tags) {
                            tag.subject_name = this.subjectList.filter(item => item.subject_id == tag.subject_id)[0].name
                        }
                        this.addProdForm.subject_id_arr = this.tags
                    } else {
                        this.addProdForm.subject_id_arr = []
                    }
                    if (this.addProdForm.has_verify_code) {
                        this.addProdForm.code_category_id = this.code_category_id
                    }

                    apiProd.addOrUpdateProduct(this.addProdForm).then(res => {
                        if (res.res_code == 1) {
                            this.$Message.success('保存成功')
                            this.showModal = false;
                            this.$emit('refreshList')
                        }
                        this.btnDisabled = false
                    }).catch(err => {
                        this.btnDisabled = false
                        this.$Message.error('添加失败')
                    })
                } else {
                    this.$Message.warning('请检查产品信息完整性')
                }
            })
        },
        getProdDetail() {//获取产品详情
            apiProd.getDetail(this.productId).then(res => {
                if (res.res_code == 1) {
                    let prod = res.data
                    this.addProdForm.name = prod.name
                    this.addProdForm.description = prod.description
                    this.addProdForm.detail = prod.detail
                    this.addProdForm.share_title = prod.share_title
                    this.addProdForm.share_desc = prod.share_desc
                    this.addProdForm.share_img_url = prod.share_img_url
                    this.addProdForm.img_url = prod.img_url
                    this.addProdForm.type = prod.type
                    this.addProdForm.price = prod.price
                    this.addProdForm.original_price = prod.original_price
                    // this.addProdForm.sale_id_arr = prod.sale_id_arr
                    this.addProdForm.sale_id_arr = prod.sale_id_arr[0]
                    this.addProdForm.subject_id_arr = prod.subject_id_arr
                    this.addProdForm.city_id_arr = prod.city_id_arr
                    this.addProdForm.start_time = new Date(prod.start_time)
                    this.addProdForm.end_time = new Date(prod.end_time)
                    this.addProdForm.state = prod.state
                    // this.switchState.state = prod.state == 1 ? true : false
                    this.switchState.has_address = prod.has_address == 1 ? true : false
                    this.switchState.has_user_info = prod.has_user_info == 1 ? true : false
                    this.addProdForm.user_info = prod.user_info
                    this.switchState.has_verify_code = prod.has_verify_code == 1 ? true : false
                    /* if (prod.subject_id_arr.length || prod.city_id_arr.length) {
                        this.switchState.has_tags = true
                    } else {
                        this.switchState.has_tags = false
                    } */
                    if (prod.subject_id_arr.length) {
                        this.switchState.has_tags = true
                        this.tags = prod.subject_id_arr
                    } else {
                        this.switchState.has_tags = false
                        this.tags = [{
                            subject_id: -1,
                            subject_name: '',
                            //tag_name: '',
                            price: prod.price,
                            original_price: prod.original_price
                        }]
                    }
                    if (prod.code_category_id) {
                        this.code_category_id = prod.code_category_id
                    } else {
                        this.code_category_id = -1
                    }
                }
            })
        },
        handleCheckAll() {
            if (this.checkBoxState.indeterminate) {
                this.checkBoxState.check_all = false;
            } else {
                this.checkBoxState.check_all = !this.checkBoxState.check_all;
            }
            this.checkBoxState.indeterminate = false;

            if (this.checkBoxState.check_all) {
                this.cityList.forEach(element => {
                    this.addProdForm.city_id_arr.push(element.city_id);
                });
            } else {
                this.addProdForm.city_id_arr = [];
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
        addTag() {
            this.tags.push({
                subject_id: -1,
                subject_name: '',
                //tag_name: '',
                price: this.addProdForm.price,
                original_price: this.addProdForm.original_price
            })
        },
        removeTag(index) {
            this.tags.splice(index, 1)
        },
        next() {
            if (this.currentStep < 3) {
                this.currentStep++
            }
        },
        prev() {
            if (this.currentStep > 0) {
                this.currentStep--
            }
        }
    }
}
</script>

