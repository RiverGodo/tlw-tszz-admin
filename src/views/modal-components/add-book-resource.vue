<style lang="less">
@import "../../styles/loading.less";
.common-dialog.add-book-resource-modal {
  .ivu-modal {
    min-width: 600px;
    .ivu-modal-body {
      padding: 30px 50px 0 0;
      .resource-detail {
      }
    }
  }
  .video-wrap {
    .video-js {
      width: 500px;
      height: 150px;
      .vjs-big-play-button {
        top: 50%;
        left: 50%;
        margin-left: -1.5em;
        margin-top: -1em;
        background-color: rgba(0, 0, 0, 0.45);
        font-size: 3.5em;
        height: 2em !important;
        line-height: 2em !important;
        margin-top: -1em !important;
      }
    }
  }
  .duration{
    width:130px;
  }
}
</style>

<template>
  <Modal class="common-dialog add-book-resource-modal" v-model="showModal" :title="title" :mask-closable="false">
    <Form ref="addForm" :model="addForm" label-position="right" :label-width="90">
      <template v-if="file !=='' || resourceId >0 || isLive || isCatalog||addForm.download_url || editByUser">
        <FormItem class="mb-0" label="名称">
          <Input v-model.trim="addForm.name" placeholder="上传资源时可以自动生成名称..."></Input>
          <p>注：名称中如包含"/"，请替换为其他分隔符。</p>
        </FormItem>
        <div v-if="!isCatalog" class="flex-row">
          <FormItem label="年级">
            <Select v-model="addForm.grade_id">
              <Option v-for="item in gradeList" :value="item.grade_id" :key="item.grade_id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="版本">
            <Select v-model="addForm.years">
              <Option v-for="item in yearsList" :value="item.year_id" :key="item.year_id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="!isCatalog" class="flex-row">
          <FormItem label="学科">
            <Select v-model="addForm.subject_id">
              <Option v-for="item in subjectList" :value="item.subject_id" :key="item.subject_id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="地区">
            <Select v-model="addForm.city_id" @on-change="cityChange">
              <Option v-for="item in cityList" :value="item.city_id" :key="item.city_id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="!isCatalog" class="flex-row">
          <FormItem label="类别">
            <!-- {{addForm.type_ id}} -->
            <Select v-model="addForm.type_id">
              <Option v-for="item in resourceTypeList" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="显示位置">
            <RadioGroup v-model="addForm.is_all">
              <Radio :label="0">资源列表</Radio>
              <Radio :label="1">下载全部</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <!-- <FormItem v-if="!isLive && addForm.download_url&&!editByUser" label="文件地址">
          <p style="word-break: break-all;">{{addForm.download_url}}</p>
        </FormItem> -->
        <FormItem label="文件地址" v-if="!isLive&&!isCatalog">
          <Input v-model.trim="addForm.download_url"></Input>
        </FormItem>
        <FormItem v-if="showVideoPlayer" label="视频预览">
          <div class="video-wrap">
            <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" :playsinline="true">
            </video-player>
          </div>
        </FormItem>
        <FormItem v-if="!isLive&&!isCatalog" label="文件信息">
          <div v-if="file">{{addForm.filename}}</div>
          <div v-else>
            {{ addForm.download_url==''? '未选择文件':'未修改文件'}}
          </div>
        </FormItem>
        <FormItem v-if="showVideoPlayer" label="文件大小">
          <p>{{addForm.size}}MB</p>
        </FormItem>
        <FormItem v-if="showVideoPlayer" label="视频时长">
          <Input class="duration" placeholder="请输入视频时长" v-model="addForm.duration"></Input>分钟
        </FormItem>
        <FormItem v-if="!isLive&&!isCatalog" label="资源文件">
          <Upload :before-upload="handleUpload" action="" :format="ext_list">
            <Button :loading="addResourceLoading" type="ghost" icon="ios-cloud-upload-outline">修改文件</Button>
          </Upload>
          <p class="book-img-info">只能上传 jpg/png/mp3/mp4/doc/xls/ppt/pdf/zip/rar 文件</p>
        </FormItem>
        <!-- 新增MP3文本资源添加开始 -->
        <FormItem label="听力原文地址" v-if="!isLive&&!isCatalog && addForm.type_id == 9">
          <Input v-model.trim="addForm.origin_url"></Input>
        </FormItem>
        <FormItem v-if="!isLive&&!isCatalog" label="文件信息">
          <div v-if="txtFile">{{addForm.mp3filename}}</div>
          <!-- <div v-else>
            {{ addForm.origin_url==''? '未选择文件':'未修改文件'}}
          </div> -->
        </FormItem>
        <FormItem v-if="!isLive&&!isCatalog && addForm.type_id == 9" label="听力原文">
          <Upload :before-upload="handleUploadTxt" action="">
            <Button :loading="addResourceLoading" type="ghost" icon="ios-cloud-upload-outline">修改文件</Button>
          </Upload>
          <p class="book-img-info">只能上传 jpg/png/mp3/mp4/doc/xls/ppt/pdf/zip/rar 文件</p>
          <Button @click="AddMpTxtResource">上传</Button>（听力原文上传需手动点击此上传按钮）
        </FormItem>
        <!-- 新增MP3文本资源添加结束 -->
        <FormItem label="手动添加" v-if="editByUser">
          <i-switch v-model="editByUser">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否直播" v-if="isLive">
          <i-switch v-model="isLive" @on-change="setMediaType">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Row type="flex" justify="start" align="middle" style="margin-top: 10px;">
            <Col span="8">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="addForm.start_time" placeholder="直播开始时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center"> 至
            </Col>
            <Col span="8">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="addForm.end_time" placeholder="直播结束时间"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="是否目录" v-if="isCatalog">
          <i-switch v-model="isCatalog" @on-change="setResourceType">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="直播状态" v-if="isLive">
          <Select v-model="addForm.state" style="width: 200px">
            <Option v-for="item in liveStateList" :value="item.type_id" :key="item.type_id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <div v-if="isLive">
          <!-- <FormItem label="是否录制">
            <i-switch v-model="openReplay">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem> -->
          <FormItem label="推流名称" v-if="addForm.state<4" prop="live_flow_name">
            <Input v-model="live_flow_name" placeholder="请输入推流名称（纯英文）"></Input>
            <p v-if="live_flow_name" style="margin-top: 10px;">推流地址: rtmp://video-center-bj.alivecdn.com/tszz/</p>
            <p v-if="live_flow_name">流密钥:
              <span style="color: #2d8cf0">{{live_flow_name}}</span>?vhost=live.xuege100.com</p>
            <p v-if="live_flow_name">播放地址: rtmp://live.xuege100.com/tszz/
              <span style="color: #2d8cf0">{{live_flow_name}}</span>
            </p>
            <p v-if="live_flow_name&&resourceId&&addForm.state==2">PC端聊天室链接: https://m.tl100.com/chat_room?resource_id={{resourceId}}&book_id=0</p>
          </FormItem>
          <FormItem label="回放地址" v-else>
            <Input v-model="replay_url" placeholder="请输入视频地址"></Input>
            <p v-if="replay_url">视频地址:
              <span style="color: #2d8cf0">{{replay_url}}</span>
            </p>
          </FormItem>
        </div>
        <FormItem v-if="!isLive&&!isCatalog" label="重复检测">
          <div v-if="resourceDetail.resource_id >0">
            <div class="resource-detail">
              <div style="color:rgb(237, 63, 20)">
                存在重复资源（已自动使用下载地址，可直接保存），资源信息如下:
              </div>
              <div>
                名称： {{resourceDetail.name}}
              </div>
              <Row type="flex">
                <Col span="6"> 年级：{{resourceDetail.grade_name}}
                </Col>
                <Col span="6"> 版本：{{resourceDetail.years}}
                </Col>
                <Col span="6"> 学科：{{resourceDetail.subject_name}}
                </Col>
                <Col span="6"> 地区：{{resourceDetail.city_name}}
                </Col>
              </Row>
              <div>
                类别：{{resourceDetail.type_name}}
              </div>
              <div>
                下载地址： {{resourceDetail.download_url}}
              </div>
            </div>
          </div>
          <div v-else style="color:#33b990">
            不存在重复文件
          </div>
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="是否直播">
          <i-switch v-model="isLive" @on-change="setMediaType">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否目录">
          <i-switch v-model="isCatalog" @on-change="setResourceType">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="手动添加">
          <i-switch v-model="editByUser">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="资源文件" v-if="!isLive">
          <Upload :before-upload="handleUpload" action="" :format="ext_list" type="drag">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p style="color: #80848f;">将文件拖拽至此处，或
                <span style="color: #2d8cf0;">点击上传</span>
              </p>
            </div>
          </Upload>
          <p class="book-img-info">只能上传 jpg/png/mp3/mp4/doc/xls/ppt/pdf/zip/rar 文件</p>
        </FormItem>
      </template>
      <Spin fix v-if="addResourceLoading">
        <!-- <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon> -->
        <Progress :percent="uploadPercent"></Progress>
        <div>上传文件中...</div>
      </Spin>
      <Spin fix v-if="checkResourceLoading">
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>资源检验中...</div>
      </Spin>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" size="large" :loading="addResourceLoading" @click="AddResource()">保存返回</Button>
    </div>
  </Modal>
</template>

<script>
import "video.js/dist/video-js.css";
import 'vue-video-player/src/custom-theme.css'
import { mapState } from "vuex";
import { videoPlayer } from "vue-video-player";
import {
  ossDFileHost,
  ossMvHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
import {
  addOrUpdateBookResource,
  getBookResourceDetail,
  getBookResourceDetailByFileMD5
} from "@/api/bookResource";
import {
  getBookResourceShowName
} from '@/api/book'
var browserMD5File = require("browser-md5-file");
import moment from "moment";
export default {
  name: "addBookResourceModal",
  components: {
    videoPlayer
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: Number,
      default: -1
    },
    bookId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      show_name: "",
      addResourceLoading: false,
      getShowNameLoading: false,
      uploadPercent: 0,
      showModal: false,
      isCatalog: false,
      size:"",
      sectionFiles: [],
      isLive: false, //是否直播
      live_flow_name: "", //推流名称
      replay_url: "", //回放视频地址
      openReplay: false,//是否开启录制
      // 直播状态
      liveStateList: [
        {
          type_id: 1,
          name: "直播未开始"
        },
        {
          type_id: 2,
          name: "正在直播"
        },
        {
          type_id: 3,
          name: "直播结束"
        },
        {
          type_id: 4,
          name: "直播回放"
        }
      ],
      ext_list: [
        "jpg",
        "jpeg",
        "png",
        "mp3",
        "mp4",
        "doc",
        "docx",
        "txt",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "pdf",
        "zip",
        "rar"
      ],
      addForm: {
        resource_id: -1, //判断是编辑还是添加
        name: "", //资源名称
        filename: "", //文件名
        file_md5: "",
        subject_id: 15,
        grade_id: 9,
        years: moment().year(),
        is_all: 0,
        city_id_arr: [370],
        city_id: 370,
        type_id: 13, //资源类型
        download_url: "",
        origin_url: "",
        mp3filename: "",
        duration:0,
        res_format: "", //资源类型
        start_time: "",
        end_time: "",
        state: 1,
        size:"",
        catalog: []
      },
      file: "",
      txtFile:"", // txt 文本文件
      ossConfig: {
        url: "",
        content_type: "",
        date: "",
        bucket: "tl-book",
        dir: "resource",
        filename: "",
        type: "POST"
      },
      resourceDetail: {
        resource_id: -1
      },
      resourceList: [],
      editByUser: false,//是否手动编辑
      checkResourceLoading: false//资源检测loading
    };
  },
  watch: {
    isShow: function (value) {
      if (value) {
        this.showModal = value;
        this.editByUser = false;//初始化手动编辑
        this.isLive = false;//初始化是否直播
        this.isCatalog = false;//初始化是否目录
        this.file = "";
        this.addForm.download_url = "";
        this.addForm.size="";
        this.addForm.duration="";
        this.addForm.resource_id = this.resourceId;
        this.show_name = ""//初始化show_name
        if (this.resourceId > 0) {//编辑资源
          this.getBookResourceDetail();
          if (this.bookId > 0) {//从图书资源列表打开时 获取show_name
            this.checkResourceLoading = true
            getBookResourceShowName({
              resource_id: this.resourceId,
              book_id: this.bookId
            }).then(res => {
              if (res.res_code == 1) {
                this.show_name = res.data.show_name
              }
              this.checkResourceLoading = false
            }).catch(err => {
              this.checkResourceLoading = false
            })
          }
        }

      }
    },
    showModal: function (value) {
      if (!value) {
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.player.pause()
        }
        this.$emit("closeModal");
      }
    },
    title: function (value) {
      value == "添加资源" && this.resetDate();
    },
    live_flow_name: function (value) {
      this.addForm.download_url = `rtmp://live.xuege100.com/tszz/${value}`;
    }
  },
  computed: {
    ...mapState({
      subjectList: state => state.app.subjectList,
      yearsList: state => state.app.yearsList,
      gradeList: state => state.app.gradeListBase,
      gradeListExtend: state => state.app.gradeListBaseExtend,
      cityList: state => state.app.cityList,
      resourceTypeList: state => state.bookResource.resourceTypeList
    }),
    title() {
      return this.resourceId > 0 ? "编辑资源" : "添加资源";
    },
    playerOptions() {
      let options = {
        sources: [
          {
            src: this.addForm.download_url,
          }
        ],
        controls: true
      };
      return options;
    },
    showVideoPlayer() {//是否显示视频预览
      return this.addForm.type_id == 21 && this.addForm.download_url && this.addForm.download_url.search(/.mp4$/) > -1
    }
  },
  methods: {
    setMediaType(v) {//直播
      if (v) {
        this.addForm.type_id = 20;
      }
    },
    setResourceType(v) {//目录
      if (v) {
        this.addForm.type_id = 23;
      }
    },
    getBookResourceDetail() {//获取图书资源详情
      getBookResourceDetail(this.resourceId).then(res => {
        if (res.res_code == 1) {
          let r = res.msg;
          //如果是旧数据，自动处理一下属性
          let arr = r.download_url.split(".");
          let ext = arr[arr.length - 1];
          this.addForm.name = r.name;
          this.addForm.res_format = ext;
          let s_arr = this.subjectList.filter(
            e => e.subject_id == r.subject_id
          );
          if (s_arr && s_arr.length > 0) {
            this.addForm.subject_id = r.subject_id;
          } else {
            this.addForm.subject_id = this.subjectList[0].subject_id;
          }
          let g_arr = this.gradeList.filter(e => e.grade_id == r.grade_id);
          if (g_arr && g_arr.length > 0) {
            this.addForm.grade_id = r.grade_id;
          } else {
            this.addForm.grade_id = this.gradeList[0].grade_id;
          }
          this.addForm.years = r.years == 0 ? moment().year() : r.years;
          if (r.city_id_arr && r.city_id_arr.length > 0) {
            this.addForm.city_id = r.city_id_arr[0];
          } else {
            this.addForm.city_id = 370;
          }
          this.addForm.state = r.state;
          this.addForm.city_id_arr = [this.addForm.city_id];
          this.addForm.type_id = r.type_id == 0 ? 13 : r.type_id;
          this.addForm.download_url = r.download_url;
          this.addForm.duration = r.duration;
          this.addForm.size=r.size.toString().length>3?parseInt(r.size/1024/1024):r.size;
          this.addForm.start_time = new Date(r.start_time) == 'Invalid Date' ? '' : new Date(r.start_time);
          this.addForm.end_time = new Date(r.end_time) == 'Invalid Date' ? '' : new Date(r.end_time);
          this.isLive = false;
          if (r.type_id == 20) {
            this.isLive = true;
            if (r.state <= 3) {
              //判断是否为回放地址
              var rs = r.download_url.split("/");
              this.live_flow_name = rs[rs.length - 1];
              this.replay_url = "";
            } else {
              this.live_flow_name = "";
              this.replay_url = r.download_url;
            }
          }
          if (r.type_id == 23) {
            this.isCatalog = true
          } else {
            this.isCatalog = false
          }
          this.addForm.is_all = r.is_all;
          if (r.filename == "") {
            this.addForm.filename = r.name + ext;
          }
        }
      });
    },
    cityChange(city_id) {
      this.addForm.city_id_arr = [city_id];
    },
    handleUpload(file) {
      this.resourceDetail = {
        resource_id: -1
      }
      this.checkResourceLoading = true
      browserMD5File(file, (err, md5) => {
        if (err) {
          this.checkResourceLoading = false;
          return;
        }
        this.addForm.file_md5 = md5;
        getBookResourceDetailByFileMD5(md5).then(res => {
          this.checkResourceLoading = false
          if (res.res_code == 1 && res.msg.resource_id > 0) {
            this.resourceDetail = res.msg;
            let grade_arr = this.gradeList.filter(
              e => e.grade_id == this.resourceDetail.grade_id
            );
            this.resourceDetail.grade_name = grade_arr[0].name;
            let subject_arr = this.subjectList.filter(
              e => e.subject_id == this.resourceDetail.subject_id
            );
            this.resourceDetail.subject_name = subject_arr[0].name;
            let type_arr = this.resourceTypeList.filter(
              e => e.type_id == this.resourceDetail.type_id
            );
            this.resourceDetail.type_name = type_arr[0].name;
            let city_arr = this.cityList.filter(
              e => e.city_id == this.resourceDetail.city_id_arr[0]
            );
            this.resourceDetail.city_name = city_arr[0].name;
          }
        }).catch(err => {
          this.checkResourceLoading = false
        })
      });
      let name_arr = file.name.split(".");
      let ext = name_arr[name_arr.length - 1];
      if (!this.ext_list.includes(ext)) {
        this.$Message.warning("不支持上传该格式的文件！");
        return false;
      }
      this.autoSetProp(file.name);
      this.file = file;
      this.addForm.size = file.size; //字节
      this.addForm.content_type = file.type;
      this.addForm.duration = file.duration;
      this.ossConfig.filename = this.addForm.filename;
      this.ossConfig.content_type = file.type;
      this.ossConfig.type = "POST";
      switch (ext) {
        case "mp3":
          this.ossConfig.oss_url = ossMvHost.oss;
          this.ossConfig.cdn_url = ossMvHost.cdn;
          this.ossConfig.bucket = "tl-mv";
          this.ossConfig.dir = "tl-book/mp3";
          break;
        case "mp4":
          this.ossConfig.oss_url = ossMvHost.oss;
          this.ossConfig.cdn_url = ossMvHost.cdn;
          this.ossConfig.bucket = "tl-mv";
          this.ossConfig.dir = "tl-book/mp4";
          break;
        case "zip":
        case "rar":
          this.ossConfig.oss_url = ossDFileHost.oss;
          this.ossConfig.cdn_url = ossDFileHost.cdn;
          this.ossConfig.bucket = "tl-download-file";
          this.ossConfig.dir = "tl-book/zip";
          break;
        case "jpg":
        case "png":
          this.ossConfig.oss_url = ossDFileHost.oss;
          this.ossConfig.cdn_url = ossDFileHost.cdn;
          this.ossConfig.bucket = "tl-download-file";
          this.ossConfig.dir = "tl-book/pic";
          break;
        default:
          this.ossConfig.oss_url = ossDFileHost.oss;
          this.ossConfig.cdn_url = ossDFileHost.cdn;
          this.ossConfig.bucket = "tl-download-file";
          this.ossConfig.dir = "tl-book/doc";
          break;
      }
      return false;
    },
    // mp3 文本上传检测
    handleUploadTxt(file) {
      this.resourceDetail = {
        resource_id: -1
      }
      let name_arr = file.name.split(".");
      let ext = name_arr[name_arr.length - 1];
      
      if (!this.ext_list.includes(ext)) {
        this.$Message.warning("不支持上传该格式的文件！");
        return false;
      }
      this.autoSetProp(file.name,'mp3Txt');
      this.txtFile = file;
      this.addForm.size = file.size; //字节
      this.addForm.content_type = file.type;
      this.addForm.duration = file.duration;
      this.ossConfig.filename = this.addForm.mp3filename;
      this.ossConfig.content_type = file.type;
      this.ossConfig.type = "POST";
      this.ossConfig.oss_url = ossDFileHost.oss;
      this.ossConfig.cdn_url = ossDFileHost.cdn;
      this.ossConfig.bucket = "tl-download-file";
      this.ossConfig.dir = "tl-book/doc";
      return false
    },
    AddResource(status) {
      if (this.isLive) {
        this.addForm.openReplay = this.openReplay ? 1 : 0
      }
      if (this.replay_url == '' && this.addForm.state == 4) {
        this.$Message.warning("请输入回放地址!");
        return false;
      }
      if (this.isLive && !this.live_flow_name && this.addForm.state !== 4) {//直播必须输入直播地址
        this.$Message.warning("请输入直播地址!");
        return false;
      }
      if (!this.addForm.name) {
        this.$Message.warning("请输入资源名称");
        return false
      }
      //   return false;
      //设置资源类型
      if(this.addForm.download_url){
        let arrs=this.addForm.download_url.split(".")
        this.addForm.res_format=arrs[arrs.length-1]
      }
      if (this.resourceDetail.resource_id > 0) {//若存在重复资源，则自动保存
        if (this.file) {
          this.$Message.warning('存在重复资源，已自动使用，请再次点击保存!')
          this.resourceDetail.resource_id = -1
          this.addForm.download_url = this.resourceDetail.download_url
          this.file = ""
          return
        }
      }
      //存在文件则上传，不存在则只修改信息
      if (this.file) {
        var date = new Date();
        date = date.toGMTString();
        this.ossConfig.date = date;
        this.addResourceLoading = true;
        getOssSign(this.ossConfig)
          .then(sign_data => {
            if (sign_data.res_code == 1) {
              const formData = new FormData();
              formData.append("key", sign_data.msg.filename);
              formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
              formData.append("success_action_status", "200");
              formData.append("signature", sign_data.msg.sign);
              formData.append("policy", sign_data.msg.policyBase64);
              formData.append("file", this.file);
              uploadToAliyun(this.ossConfig.oss_url, formData, event => {
                this.uploadPercent = parseInt(event.loaded / event.total * 100);
              })
                .then(aliyun_rs => {
                  if (aliyun_rs.status == 200) {
                      this.addForm.download_url =
                      this.ossConfig.cdn_url + sign_data.msg.filename;
                      this.addOrUpdateBookResourcefunc();
                  } else {
                    this.$Message.warning(JSON.stringify(aliyun_rs))
                  }
                  this.addResourceLoading = false;
                })
                .catch(error => {
                  this.$Message.warning(JSON.stringify(error))
                  this.addResourceLoading = false;
                });
            }
          })
          .catch(error => {
            this.addResourceLoading = false;
          });
      } else {
        if (this.addForm.state > 3) {
          //如果直播状态为直播回放
          this.addForm.download_url = this.replay_url;
        }
        if (this.addForm.type_id == 23) {//如果是目录类型
          this.addForm = {            ...this.addForm, ...{
              res_format: "catalog",
              city_id_arr: [],
              download_url: '',
              state: 1,
              years: '无',
              grade_id: '无',
              subject_id: '无',
              filename: '',
              size: '',
              duration:0
            }          }
        }
        if (this.addForm.download_url && this.addForm.state <= 3 && !this.isLive) {//如果download_url存在则检查资源是否已上传
          this.addResourceLoading = true;
           this.addOrUpdateBookResourcefunc();
           this.addResourceLoading = false
          // checkDownloadUrl(this.addForm.download_url).then(res => {
          //   if (res.res_code == 1) {
          //     this.addResourceLoading = false
          //     this.addOrUpdateBookResourcefunc();//添加或编辑图书资源
          //   } else {
          //     this.$Message.warning('资源不存在，请重新上传')
          //     this.addResourceLoading = false
          //   }
          // })
          // return
        }
        this.addOrUpdateBookResourcefunc();
      }

    },
    AddMpTxtResource(status){
      //设置资源类型
      if(this.addForm.origin_url){
        let arrs=this.addForm.origin_url.split(".")
        this.addForm.res_format=arrs[arrs.length-1]
      }
      if (this.txtFile) {
        var date = new Date();
        date = date.toGMTString();
        this.ossConfig.date = date;
        this.addResourceLoading = true;
        console.log(this.ossConfig)
        getOssSign(this.ossConfig)
          .then(sign_data => {
            if (sign_data.res_code == 1) {
              const formData = new FormData();
              formData.append("key", sign_data.msg.filename);
              formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
              formData.append("success_action_status", "200");
              formData.append("signature", sign_data.msg.sign);
              formData.append("policy", sign_data.msg.policyBase64);
              formData.append("file", this.file);
              uploadToAliyun(this.ossConfig.oss_url, formData, event => {
                this.uploadPercent = parseInt(event.loaded / event.total * 100);
              })
                .then(aliyun_rs => {
                  if (aliyun_rs.status == 200) {
                      this.addForm.origin_url =
                      this.ossConfig.cdn_url + sign_data.msg.filename;
                  } else {
                    this.$Message.warning(JSON.stringify(aliyun_rs))
                  }
                  this.addResourceLoading = false;
                })
                .catch(error => {
                  this.$Message.warning(JSON.stringify(error))
                  this.addResourceLoading = false;
                });
            }
          })
          .catch(error => {
            this.addResourceLoading = false;
          });
      }
    },
    addOrUpdateBookResourcefunc() {//添加或修改图书资源
      addOrUpdateBookResource(this.addForm).then(res => {
        if (res.res_code > 0) {
          this.$Message.success("保存资源成功！");
          this.showModal = false;
          if (this.resourceId == -1) {
            this.$emit("refreshList");
            this.$emit("bindBookResource", [{
              resource_id: res.msg,
              show_name: this.show_name || this.addForm.name
            }]);
          } else {
            this.$emit("refreshList");
          }
        } else {
          this.$Message.warning(res.msg);
        }

      });
    },
    autoSetProp(filename, ext) {//自动设置属性
      console.log(filename,ext)
      if (ext && ext!= 'mp3Txt') {
        this.addForm.res_format = ext;
        this.addForm.name = filename;
        this.addForm.filename = filename + ext;
      }
      else if(ext && ext === 'mp3Txt'){
        //
        this.addForm.mp3filename = filename
      }
       else {
        let name_arr = filename.split(".");
        this.addForm.res_format = name_arr[name_arr.length - 1];
        //防止文件名中有.字符

        name_arr.pop();
        if (this.addForm.resource_id <= 0) {//修改文件时不改变资源名称
          this.addForm.name = name_arr.join("");
        }
        this.addForm.filename = filename;
      }
      if (this.addForm.res_format == "mp3") {
        this.addForm.type_id = 9;
      }

      //设置年份
      for (let i = 0; i < this.yearsList.length; i++) {
        if (this.addForm.name.indexOf(this.yearsList[i].name) >= 0) {
          this.addForm.years = this.yearsList[i].year_id;
          break;
        }
      }
      //设置年级
      if (this.gradeListExtend && this.gradeListExtend.length > 0) {
        for (let i = 0; i < this.gradeListExtend.length; i++) {
          if (this.addForm.name.indexOf(this.gradeListExtend[i].name) >= 0) {
            this.addForm.grade_id = this.gradeListExtend[i].grade_id;
            break;
          }
        }
      }
      //设置学科
      for (let i = 0; i < this.subjectList.length; i++) {
        if (this.addForm.name.indexOf(this.subjectList[i].name) >= 0) {
          this.addForm.subject_id = this.subjectList[i].subject_id;
          break;
        }
      }
      //设置城市
      for (let i = 0; i < this.cityList.length; i++) {
        if (this.addForm.name.indexOf(this.cityList[i].name) >= 0) {
          this.addForm.city_id = this.cityList[i].city_id;
          this.addForm.city_id_arr = [this.addForm.city_id];
          break;
        }
      }
      return;
    },
    resetDate() {
      //重置数据
      this.isCatalog = false;
      this.isLive = false;
      this.live_flow_name = "";
      this.addForm = {
        resource_id: -1,
        name: "",
        filename: "",
        file_md5: "",
        subject_id: 15,
        grade_id: 9,
        years: moment().year(),
        is_all: 0,
        city_id_arr: [370],
        city_id: 370,
        type_id: 13,
        download_url: "",
        size: 0,
        duration:0,
        res_format: "",
        start_time: "",
        end_time: "",
        state: 1
      };
    },

  }
};
</script>