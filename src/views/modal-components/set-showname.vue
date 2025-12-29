<template>
    <Modal class="common-dialog" v-model="showModal" title="设置展示名称">
        <Form ref="shownameForm" label-position="right" :label-width="80">
            <FormItem label="资源名称">
                <p>{{resourceName}}</p>
            </FormItem>
            <FormItem label="展示名称">
                <Input v-model="show_name" placeholder="请输入展示名称"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large" :loading="updateBookResourceShowNameLoading" @click="updateBookResourceShowName">保存返回</Button>
        </div>
    </Modal>
</template>
<script>
import { getBookResourceShowName, updateBookResourceShowName } from '@/api/book'
export default {
    name: 'shownameModal',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        resourceId: {
            type: Number,
            default: -1
        },
        resourceName: {
            type: String,
            default: ""
        },
        bookId: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            show_name: "",
            showModal: false,
            updateBookResourceShowNameLoading: false
        }
    },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = true
                if (this.resourceId > 0 && this.bookId > 0) {
                    getBookResourceShowName({
                        resource_id: this.resourceId,
                        book_id: this.bookId
                    }).then(res => {
                        if (res.res_code == 1) {
                            this.show_name = res.data.show_name
                        }
                    })
                }
            }
        },
        showModal(value) {
            if (!value) {
                this.$emit('closeModal')
            }
        }
    },
    methods: {
        updateBookResourceShowName() {
            this.updateBookResourceShowNameLoading = true
            updateBookResourceShowName({
                resource_id: this.resourceId,
                book_id: this.bookId,
                show_name: this.show_name
            }).then(res => {
                this.updateBookResourceShowNameLoading = false
                if (res.res_code == 1) {
                    this.$Message.success('设置成功')
                    this.showModal = false
                    this.$emit('refreshList')
                }
            }).catch(err => {
                this.updateBookResourceShowNameLoading = false
            })
        }
    }
}
</script>

