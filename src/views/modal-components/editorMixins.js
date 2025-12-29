import {
    ossSFileHost,
    getOssSign,
    uploadToAliyun
} from "@/api/aliyunOss";

export default {
    data() {
        return {
            articleImgUploading: false,
            editors: [],
            click_index: 0
        }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },

    mounted() {
        this.bindArticleImgUploadHandler()
    },
    methods: {
        ArticleImgUpload(file) { //详情图标上传
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
                                this.$Message.warning(JSON.stringify(res))
                            }
                            this.articleImgUploading = false;
                        })
                        .catch(err => {
                            this.articleImgUploading = false;
                            this.$Message.warning(JSON.stringify(err))
                        });
                }
            });
            return false;
        },
        uploadBtnClick(index) {
            this.click_index = index
        },
        ImgUploadByindex(file) {
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
                                let editor = this.editors[this.click_index].quill
                                let tmpImgUrl = ossSFileHost.cdn + sign_data.msg.filename;
                                let addRange = editor.getSelection();
                                editor.insertEmbed(
                                    addRange !== null ? addRange.index : 0,
                                    "image",
                                    tmpImgUrl
                                );
                            } else {
                                this.$Message.warning(JSON.stringify(res))
                            }
                            this.articleImgUploading = false;
                        })
                        .catch(err => {
                            this.articleImgUploading = false;
                            this.$Message.warning(JSON.stringify(err))
                        });
                }
            });
            return false;
        },
        //绑定图片上传处理事件
        bindArticleImgUploadHandler() {
            this.editor.getModule("toolbar").addHandler("image", function (state) {
                if (state) {
                    let fileInput = document.getElementById("articleImgUploadBtn");
                    fileInput.click(); // 加一个触发事件
                }
            });
        },

        //添加绑定图片上传处理事件
        addAllImgUploadHandler() {
            if (this.editors.length === 0) {
                return
            }
            this.editors.map((item, index) => {
                item.quill.getModule("toolbar").addHandler("image", function (state) {
                    if (state) {
                        let fileInput = document.getElementById("articleImgUploadBtn" + index);
                        fileInput.click(index); // 加一个触发事件
                    }
                });
            })
        },
        addImgUploadHandler(index) {
            this.editors[index].quill.getModule("toolbar").addHandler("image", function (state) {
                if (state) {
                    let fileInput = document.getElementById("articleImgUploadBtn" + index);
                    fileInput.click(); // 加一个触发事件
                }
            });
        }
    }
}