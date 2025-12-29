<template>
  <div class="sourceManage">
    <sourcelist ref="sourcelist" :scenes="'sourceManage'"  @add="handleOpenAddSourceModel" @remove="remove" @edit="edit"></sourcelist>
    <Modal v-model="showDetailState" title="编辑素材" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formInline" :label-width="80">
        <FormItem prop="user" label="名称">
          <Input type="text" v-model="editForm.name" placeholder="名称"></Input>
        </FormItem>
        <FormItem prop="user" label="创建人姓名">
          <Input type="text" v-model="editForm.realname" placeholder="创建人姓名"></Input>
        </FormItem>
        <FormItem prop="user" label="地址">
          <Input type="text" v-model="editForm.url" placeholder="地址"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加素材 -->
    <Modal v-model="showAddSourceState" title="添加素材" @on-ok="handleAddSource" @on-cancel="cancel">
      <Form ref="formInline" :label-width="80">
        <FormItem prop="user" label="名称">
          <Input type="text" v-model="uploadForm.name" placeholder="名称"></Input>
        </FormItem>
        <FormItem prop="user" label="内容">
          <quill-editor
            class="edit-editor"
            v-model="uploadForm.content"
            :options="simpleRichEditorDef"
          ></quill-editor>
        </FormItem>
        <FormItem prop="user" label="地址">
          <Input type="text" v-model="uploadForm.url" placeholder="地址"></Input>
        </FormItem>
        <FormItem prop="user" label="文件">
          <Upload :before-upload="ResourceUpload" action :format="['mp3','mp4']">
            <Button :loading="resourceUploading" type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <p class="book-img-info">只能上传 mp3/mp4 文件</p>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import {
  ossSFileHost,
  ossMvHost,
  getOssSign,
  uploadToAliyun
} from "@/api/aliyunOss";
import {
  getResoureList,
  updateResoure,
  deleteResoureList,
  addResoureList
} from "@/api/daily-english/sourcelist.js";
import sourcelist from "./components/sourceList.vue"
import { mapState } from "vuex";
export default {
  name: "SourceManage",
  data() {
    return {
      sourceList: [],
      total: 0,
      
      showDetailState: false,
      editForm: {
        name: "",
        url: "",
        content: "",
        realname: "",
        id: ""
      },
      searchForm: {
        name: "",
        url: "",
        content: "",
        realname: ""
      },
      showAddSourceState: false,
      resourceUploading: false,
      uploadForm: {
        name: "",
        url: "",
        content: "",
        realname: ""
      },
      currentPage: 1
    };
  },
  components: {
    quillEditor,
    sourcelist
  },
  mounted() {
    // getResoureList({ page_size: 20 }).then(res => {
    //   this.total = res.data.count;
    //   this.sourceList = res.data.rows;
    // });
  },
  methods: {
    // getList(page) {
    //   // 遍历搜索对象
    //   this.currentPage = page;
    //   let searchObj = {};
    //   searchObj.page_index = Number(page - 1);
    //   searchObj.page_size = 20;
    //   Object.keys(this.searchForm).forEach(v => {
    //     if (this.searchForm[v]) {
    //       searchObj[v] = this.searchForm[v];
    //     }
    //   });
    //   getResoureList(searchObj).then(res => {
    //     this.total = res.data.count;
    //     this.sourceList = res.data.rows;
    //   });
    // },
    edit(argv) {
      this.editForm = argv[0].row;
      this.showDetailState = true;
    },
    remove(argv) {
      this.$Modal.confirm({
        title: "确定要删除吗",
        content: "",
        onOk: () => {
          let param = {
            id: argv[0].row.id
          };
          deleteResoureList(param).then(res => {
            this.$Message.info(res.msg);
            this.$refs.sourcelist.handleSearch(argv[1])
          });
        },
        onCancel: () => {}
      });
    },
    ok() {
      let param = {};
      Object.keys(this.editForm).forEach(v => {
        if (this.editForm[v]) {
          param[v] = this.editForm[v];
        }
      });
      updateResoure(param).then(res => {
        this.$Message.info(res.msg);
      });
    },
    cancel() {
      this.showDetailState = false;
      this.showAddSourceState = false;
    },
    // handleSearch(page) {
    //   if (page) {
    //     this.getList(page);
    //   } else {
    //     this.getList(0);
    //   }
    // },
    // handleReset() {
    //   Object.keys(this.searchForm).forEach(v => {
    //     this.searchForm[v] = "";
    //   });
    //   this.getList(0);
    // },
    handleAddSource() {
      addResoureList(this.uploadForm).then(res => {
        this.$Message.info(res.msg);
      });
    },
    analysisResourceUpload(file) {
      this.ResourceUpload(file, "analysis");
    },
    ResourceUpload(file, type) {
      let name_arr = file.name.split(".");
      let ext = name_arr[name_arr.length - 1];
      if (ext != "mp3" && ext != "mp4") {
        this.$Message.warning("不支持上传该格式的文件！");
        return false;
      }
      var dir = "audio";
      if (ext == "mp4") {
        dir = "video";
      }
      if (type == "analysis") {
        dir = "/analysis/" + dir;
        this.addQuestionForm.analysis_resource_type = file.type;
      } else {
        dir = "/question/" + dir;
        this.uploadForm.content_type = file.type;
      }
      var date = new Date();
      date = date.toGMTString();
      let config = {
        content_type: file.type,
        date: date,
        bucket: "tl-mv",
        dir: "daily-english" + dir,
        filename: file.name,
        type: "POST"
      };
      if (type == "analysis") {
        this.analysisResourceUploading = true;
      } else {
        this.resourceUploading = true;
      }
      getOssSign(config).then(sign_data => {
        if (sign_data.res_code == 1) {
          const formData = new FormData();
          formData.append("key", sign_data.msg.filename);
          formData.append("OSSAccessKeyId", sign_data.msg.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", sign_data.msg.sign);
          formData.append("policy", sign_data.msg.policyBase64);
          formData.append("file", file);
          uploadToAliyun(ossMvHost.oss, formData, event => {
            this.uploadPercent = parseInt((event.loaded / event.total) * 100);
          }).then(res => {
            if (res.status == 200) {
              if (type == "analysis") {
                this.addQuestionForm.analysis_resource_url =
                  ossMvHost.cdn + sign_data.msg.filename;
              } else {
                this.uploadForm.url = ossMvHost.cdn + sign_data.msg.filename;
              }
            }
            if (type == "analysis") {
              this.analysisResourceUploading = false;
            } else {
              this.resourceUploading = false;
            }
          });
        }
      });
      return false;
    },
    handleOpenAddSourceModel(){
      this.showAddSourceState = true
    }
  },
  computed: {
    ...mapState({
      simpleRichEditorDef: state => state.app.simpleRichEditorDef
    })
  }
};
</script>

<style lang="less" scoped>
.sourceManage {
  /deep/.ivu-layout-header {
    background: #fff;
    margin-bottom: 15px;
    padding-top: 15px;
  }
  .edit-editor {
    margin-top: 5px;
    .ql-toolbar.ql-snow {
      display: none;
    }
    .ql-container.ql-snow {
      border-top: 1px solid #ccc;
      height: 100px;
    }
  }
}
</style>