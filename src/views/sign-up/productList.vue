<style lang="less">
.prod .list.prod_list .ivu-table .ivu-table-cell .img-title .img {
  flex: 1;
  width: 100%;
  height: 80px;
}
.actions {
  position: relative;
}
.checkStore:hover {
  ~ .fixed_qrcode {
    opacity: 1;
    visibility: visible;
  }
}
.fixed_qrcode {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  padding: 10px;
  background: #fff;
  box-shadow: 0 0 5px #aaa;
  z-index: 10;
  left: -50%;
  top: 40px;
  transition: opacity 0.3s linear;
  p {
    margin: 10px 0;
    text-align: center;
  }
}
</style>

<template>
    <div class="page-content prod">
        <Breadcrumb separator=">">
            <BreadcrumbItem>天利商城</BreadcrumbItem>
            <BreadcrumbItem>产品列表</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">
                    <span>产品类型：</span>
                    <Select v-model="searchOption.type" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in typeSelectList" :key="item.state" :value="item.state">{{item.name}}</Option>
                    </Select>
                    <span style="margin-left:10px;">产品状态：</span>
                    <Select v-model="searchOption.state" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in stateList" :key="item.state" :value="item.state">{{item.name}}</Option>
                    </Select>
                    <span style="margin-left:10px;">兑换码：</span>
                    <Select v-model="searchOption.has_verify_code" style="width:100px" @on-change="search(true)">
                        <Option v-for="item in codeStateList" :key="item.state" :value="item.state">{{item.name}}</Option>
                    </Select>
                    <div class="search-bar">
                        <Input v-model="searchOption.name" placeholder="请输入产品名称" style="width: 200px"></Input>
                        <Button type="primary" class="btn_search" icon="ios-search" @click="search(true)">查询</Button>
                    </div>
                </div>
                <div class="actions" style="flex: 0 0 200px;">
                    <Button type="ghost" class="checkStore">查看店铺</Button>
                    <Button type="primary" icon="android-add" @click="showAddProdDialogFn(-1)">添加产品</Button>
                    <div class="fixed_qrcode">
                        <p>微信扫码访问店铺</p>
                        <img :src="require('@/images/store_code.png')" alt="">
                    </div>
                </div>
            </div>
            <div class="list prod_list">
                <Tabs :animated="false" @on-click="tabChange">
                    <TabPane :disabled="prodListLoadingState" label="全部"></TabPane>
                    <TabPane :disabled="prodListLoadingState" v-for="item in tabs" :key="item.value" :label="item.label"></TabPane>
                </Tabs>
                <p class="list-info">
                    <Icon type="ios-book"></Icon>当前产品&nbsp;（
                    <span>{{prodCount}}</span>）&nbsp;个</p>
                <Table :loading="prodListLoadingState" :columns="productListDef" :data="productList"></Table>

                <Row class="bottom-bar" type="flex" justify="space-between">
                    <Col span="6">
                    <template v-if="tab_index>0">
                        <Button v-if="!showChangeNum" size="small" type="info" @click="showChangeNum = true">修改序号</Button>
                        <div v-if="showChangeNum">
                            <Button :loading="changeNumLoading" size="small" @click="cancelChangeNum">取消</Button>
                            <Button :loading="changeNumLoading" size="small" type="primary" @click="changeNum">保存</Button>
                        </div>
                    </template>
                    </Col>
                    <Col span="18" style="text-align:right">
                    <Page show-total show-sizer :current="searchOption.page_index" :total="prodCount" :page-size="searchOption.page_size" :page-size-opts="searchOption.page_size_opts" @on-page-size-change="pageSizeChange" @on-change="pageIndexChange">
                    </Page>
                    </Col>
                </Row>
            </div>
        </Card>
        <add-prod-modal :is-show="showAddProdDialog" :product-id="product_id" @closeModal="showAddProdDialog=false" @refreshList="getProdList"></add-prod-modal>
        <!-- <set-prod-tags-modal :is-show="showSetProdTagsDialog" :product-id="product_id" @closeModal="showSetProdTagsDialog=false" @refreshList="getProdList"></set-prod-tags-modal> -->
        <Modal class="common-dialog qrcode-modal" title="产品二维码" v-model="showQrCode">
            <qrcode :value="qrCodeUrlRes" :options="{ size: 300,padding:10 }"></qrcode>
            <p style="margin-bottom:10px;word-break:break-all">链接地址：{{qrCodeUrlRes}}</p>
            <Form :label-width="80">
                <FormItem label="设置来源">
                    <Input v-model="qr_origin" clearable></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="showQrCode = false">关闭</Button>
                <Button type="primary" @click="download">下载</Button>
            </div>
        </Modal>
        <Modal class="common-dialog" title="设置群链接" v-model="showVipGroup">
            <Form label-position="right" :label-width="80">
                <FormItem label="链接" style="margin-bottom:0">
                    <Input v-model.trim="vipGroupLink" type="text"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="showVipGroup = false">关闭</Button>
                <Button type="primary" @click="setLink">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { delProdFromOtherList, addToOtherList, orderProduct } from '@/api/sign-up/product'
import AddProdModal from '../modal-components/add-prod'
// import SetProdTagsModal from '../modal-components/set-prod-tags'
import qrcode from "@xkeshi/vue-qrcode";
import { setLink, addLink } from '@/api/sign-up/product'
const moment = require('moment')
export default {
    name: 'prodList',
    components: {
        AddProdModal,
        qrcode,
        // SetProdTagsModal
    },
    data() {
        return {
            qrCodeUrl: '',
            qrCodeUrlRes: '',
            qr_origin: '',
            current_index: -1,//当前行下标
            vipGroupLink: '',
            showVipGroup: false,
            showStoreQrCode: false,
            showQrCode: false,
            tab_index: 0,
            product_id: -1,
            tabs: [{
                value: 1,
                label: '推荐'
            },
            {
                value: 2,
                label: '预售'
            },
            {
                value: 3,
                label: '团购'
            }
            ],
            showAddProdDialog: false,
            // showSetProdTagsDialog: false,
            showChangeNum: false,
            changeNumLoading: false,
            orderList: [],
            newOrderList: []
        }
    },
    watch: {
        qr_origin(value) {
            if (value) {
                this.qrCodeUrlRes = this.qrCodeUrl + `&o=${value}`
            } else {
                this.qrCodeUrlRes = this.qrCodeUrl
            }
        },
        tab_index: {
            handler: function (value) {
                this.update_search_form_options({
                    sale_type: value
                })
                this.getProdList()
            },
            immediate: true
        },
        productList(value) {
            let order_list = []
            if (value.length && this.tab_index > 0) {
                value.map(item => {
                    order_list.push({
                        exam_id: item.exam_id,
                        orderby: item.orderby
                    })
                })
            }
            this.orderList = order_list
            this.newOrderList = JSON.parse(JSON.stringify(order_list))
        }
    },
    computed: {
        ...mapState({
            productList: state => state.product.productList,
            prodListLoadingState: state => state.product.prodListLoadingState,
            prodCount: state => state.product.total_count,
            searchOption: state => state.product.searchOption,
            typeSelectList: state => state.product.typeSelectList,
            stateList: state => state.product.stateList,
            codeStateList: state => state.product.codeStateList,
        }),
        productListDef() {
            let columns = [
                {
                    title: 'ID',
                    key: 'exam_id',
                    align: 'center',
                    width: 60
                },
                {
                    title: 'SALE_ID',
                    key: 'sale_id_arr',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('span', params.row.sale_id_arr.length > 0 ? params.row.sale_id_arr[0] : '无')
                    }
                },
                {
                    title: '产品名称',
                    key: 'name',
                    align: 'center',
                    minWidth: 180
                },
                {
                    title: '产品图片',
                    key: 'name',
                    align: 'center',
                    width: 160,
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                attrs: {
                                    class: "img-title"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        class: "img",
                                        src: params.row.img_url
                                    }
                                }),
                            ]
                        );
                    }
                },
                {
                    title: '分享图名称',
                    key: 'share_title',
                    align: 'center',
                    width: 140
                },
                {
                    title: '分享图',
                    key: 'share_img_url',
                    align: 'center',
                    width: 160,
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                attrs: {
                                    class: "img-title"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        class: "img",
                                        src: params.row.share_img_url
                                    }
                                }),
                            ]
                        );
                    }
                },
                {
                    title: '产品类型',
                    key: 'type',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        let str = ''
                        for (const item of this.typeSelectList) {
                            if (item.state === params.row.type) {
                                str = item.name
                                break;
                            }
                        }
                        return h('span', str)
                    }
                },
                {
                    title: '加群链接',
                    key: 'url',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        return h('span', params.row.url || '无')
                    }
                },
                {
                    title: '实际价格',
                    key: 'price',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        return h('span', '￥ ' + params.row.price)
                    }
                },
                {
                    title: '原始价格',
                    key: 'original_price',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        return h('span', '￥ ' + params.row.original_price)
                    }
                },
                {
                    title: '兑换码',
                    key: 'has_verify_code',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        let obj = {
                            style: {
                                color: params.row.has_verify_code == 1 ? '#00a874' : '#ed3f14'
                            }
                        }
                        return h('span', obj, params.row.has_verify_code == 0 ? '无' : '有')
                    }
                },
                {
                    title: '状态',
                    key: 'state',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        let str = "";
                        this.stateList.map(item => {
                            if (item.state === params.row.state) {
                                str = item.name
                            }
                        })
                        let obj = {
                            style: {
                                color: params.row.state > -1 ? '#00a874' : '#ed3f14'
                            }
                        }
                        return h('span', obj, str)
                    }
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', moment(params.row.create_time).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                }
            ]
            if (this.tab_index === 0) {
                columns.push({
                    title: '操作',
                    key: 'action',
                    width: 260,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            },
                        }
                        let dropdownItems = this.tabs.map(item => {
                            return h('DropdownItem', { props: { name: item.value } }, item.label)
                        })
                        let arr = [
                            h('Dropdown', {
                                props: {
                                    trigger: "click",
                                    transfer: true
                                },
                                style: {
                                    margin: "0 5px"
                                },
                                on: {
                                    "on-click": val => {
                                        let sale_type = this.tabs.filter(item => item.value === val)[0].value
                                        addToOtherList({
                                            sale_type: sale_type,
                                            exam_id: params.row.exam_id
                                        }).then(res => {
                                            if (res.res_code === 1) {
                                                this.$Message.success('添加成功')
                                            } else if (res.res_code === 2) {
                                                this.$Message.warning('重复添加')
                                            }
                                        }).catch(err => {

                                        })
                                    }
                                }
                            }, [
                                    h('a', [
                                        '添加到',
                                        h("Icon", {
                                            props: {
                                                type: "arrow-down-b"
                                            }
                                        })
                                    ]),
                                    h(
                                        "DropdownMenu",
                                        {
                                            slot: "list"
                                        },
                                        dropdownItems
                                    )
                                ]),
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.showAddProdDialogFn(params.row.exam_id)
                                    }
                                }                            }, '编辑'),
                            h('Button', {                                props: {
                                    type: "text",
                                    size: "small",
                                }, style: {
                                    color: "#1975E0"
                                }, on: {
                                    click: () => {
                                        this.showVipGroup = true;
                                        this.current_index = params.index;
                                        this.vipGroupLink = params.row.url || ''
                                    }
                                }                            }, '设置群链接'),
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        // console.log(params.row);
                                        this.filename = params.row.name + ".jpg";
                                        this.qrCodeUrl = `https://m.tl100.com/tlmall/detail?exam_id=${params.row.exam_id}&sale_id=${params.row.sale_id_arr[0] || 1}`
                                        this.qrCodeUrlRes = `https://m.tl100.com/tlmall/detail?exam_id=${params.row.exam_id}&sale_id=${params.row.sale_id_arr[0] || 1}`
                                        this.qr_origin = "";
                                        this.showQrCode = true;
                                    }
                                }                            }, '二维码'),
                            h('Button', {                                props: {
                                    type: "text",
                                    size: "small",
                                    disabled: params.row.has_verify_code == 0
                                }, style: {
                                    color: "#1975E0"
                                }, on: {
                                    click: () => {
                                        this.$router.push({
                                            name: `usedCodeList`,
                                            query: {
                                                code_category_id: params.row.code_category_id
                                            }
                                        });
                                    }
                                }                            }, '查看兑换码'),
                        ];
                        return h('div', arr)
                    }
                })
            } else if (this.tab_index > 0) {
                columns.splice(1, 0, {
                    title: '排序',
                    key: 'orderby',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        if (this.showChangeNum) {
                            return h("Input", {
                                props: {
                                    value: params.row.orderby,
                                    size: "small"
                                },
                                on: {
                                    "on-change": v => {
                                        this.newOrderList.forEach(item => {
                                            if (item.exam_id === params.row.exam_id) {
                                                item.orderby = v.target.value
                                            }
                                        })
                                    }
                                }
                            });
                        } else {
                            return h("span", params.row.orderby);
                        }
                    }
                })
                columns.push({
                    title: '操作',
                    key: 'action',
                    width: 80,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let obj = {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#1975E0"
                            },
                        }
                        let arr = [
                            h('Button', {                                ...obj, on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '温馨提示',
                                            content: '删除后的产品将只出现在全部列表，确认删除吗？',
                                            onOk: () => {
                                                delProdFromOtherList({
                                                    sale_type: value,
                                                    exam_id: params.row.exam_id
                                                }).then(res => {
                                                    if (res.res_code === 1) {
                                                        this.$Message.success('删除成功')
                                                        this.getProdList()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }                            }, '删除'),
                        ];
                        return h('div', arr)
                    }
                })
            }
            return columns
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        ...mapActions(['getProdList']),
        ...mapMutations(['update_search_form_options']),
        init() {
            this.getProdList()
        },
        tabChange(index) {
            this.tab_index = index
        },
        download() {//二维码生成
            let type = "image/jpeg";
            let c = document.getElementsByTagName("canvas");
            let img = c[0].toDataURL(type);
            img = img.replace(type, "image/octet-stream");
            let save_link = document.createElementNS(
                "http://www.w3.org/1999/xhtml",
                "a"
            );
            save_link.href = img;
            save_link.download = this.filename;
            let event = document.createEvent("MouseEvents");
            event.initMouseEvent(
                "click",
                true,
                false,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            );
            save_link.dispatchEvent(event);
        },
        setLink() {//设置群链接
            const item = this.productList[this.current_index]
            if (this.vipGroupLink == item.url) {
                this.showVipGroup = false;
                return
            }
            if (!item.link_id) {
                addLink({
                    exam_id: item.exam_id,
                    url: this.vipGroupLink
                }).then(res => {
                    if (res.res_code == 1) {
                        this.$Message.success('添加成功')
                        this.showVipGroup = false
                        this.getProdList()
                    }
                })
            } else {
                setLink({
                    link_id: item.link_id,
                    url: this.vipGroupLink
                }).then(res => {
                    if (res.res_code == 1) {
                        this.$Message.success('设置成功')
                        this.showVipGroup = false
                        this.getProdList()
                    }
                })
            }
        },
        search(init) {
            if (init) {
                this.$store.commit("Prd_setPageIndex", 1);
            }
            this.getProdList()
        },
        pageIndexChange(page) {
            if (page != this.searchOption.page_index) {
                this.$store.commit("Prd_setPageIndex", page);
                this.search();
            }
        },
        pageSizeChange(pageSize) {
            if (pageSize != this.searchOption.page_size) {
                this.$store.commit("Prd_setPageSize", pageSize);
                this.search(true);
            }
        },
        showAddProdDialogFn(product_id) {
            this.product_id = product_id;
            this.showAddProdDialog = true
        },
        cancelChangeNum() {
            this.newOrderList = JSON.parse(JSON.stringify(this.orderList));
            this.showChangeNum = false;
        },
        changeNum() {
            this.changeNumLoading = true;
            orderProduct({
                sale_type: this.tab_index,
                order_list: this.newOrderList
            }).then(res => {
                this.changeNumLoading = false;
                this.showChangeNum = false;
                if (res.res_code === 1) {
                    this.getProdList()
                    this.$Message.success('排序成功')
                }
            }).catch(err => {
                this.changeNumLoading = false;
            })
        },
    }
}
</script>


