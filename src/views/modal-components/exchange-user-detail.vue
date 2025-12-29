<template>
    <Modal class="common-dialog exchange-user-detail" width="1000" v-model="showModal" title="查看详情">
        <Table :loading="contentListLoading" :columns="contentListDef" :data="contentList"></Table>
    </Modal>
</template>
<script>
import { getExchangeUserDetail } from '@/api/user'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
    name: "exchangeUserDetail",
    props: {
        userId: {
            type: Number,
            default: 0
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            btnDisabled: false,
            showModal: false,
            contentListLoading: false,
            contentList: [],
            contentListDef: [
                {
                    title: '兑换小程序',
                    key: 'app_id',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.app_id == 1 ? '图书增值' : '天利英语')
                    }
                },
                {
                    title: '兑换码批次',
                    key: 'code_category_name',
                    width: 210,
                    align: 'center'
                },
                {
                    title: '兑换码类型',
                    key: 'code_category_type',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        let str = ""
                        let codeCategoryType = this.codeCategoryTypeList.filter(item => item.type_id == params.row.code_category_type)
                        if (codeCategoryType.length) {
                            str = codeCategoryType[0].type_name
                        } else {
                            str = '无'
                        }
                        return h('span', str)
                    }
                },
                {
                    title: '兑换码',
                    key: 'code',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '兑换内容',
                    key: 'code_content',
                    minWidth: 160,
                    render: (h, params) => {
                        let arr = []
                        let code_content = JSON.parse(params.row.code_content)
                        for (const content of code_content) {
                            arr.push(h('div', { style: { margin: "3px 0" } }, content.related_name))
                        }
                        return h('div', arr)
                    }
                },
                {
                    title: '兑换时间',
                    key: 'create_time',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        let str = '';
                        if (!params.row.create_time || moment(params.row.create_time).format('YYYY-MM-DD hh:mm:ss') == "Invalid date") {
                            str = "无"
                        } else {
                            str = moment(params.row.create_time).format('YYYY-MM-DD hh:mm:ss')
                        }
                        return h('span', str)
                    }
                }
            ]
        }
    },
    watch: {
        isShow(value) {
            if (value) {
                this.showModal = true
                this.getUserDetail()
            }
        },
        showModal(val) {
            if (!val) {
                this.$emit('closeModal')
            }
        }
    },
    mounted() {
        this.getCodeCategoryTypeList()
    },
    computed: {
        ...mapState({
            subjectList: state => state.app.subjectList,
            codeCategoryTypeList: state => state.codeCategory.codeCategoryTypeList
        })
    },
    methods: {
        ...mapActions(['getCodeCategoryTypeList']),
        getUserDetail() {
            this.contentListLoading = true
            getExchangeUserDetail({
                user_id: this.userId
            }).then(res => {
                this.contentListLoading = false
                if (res.res_code == 1) {
                    this.contentList = res.data
                }
            }).catch(err => {
                this.contentListLoading = false
            })
        }
    }
}
</script>

