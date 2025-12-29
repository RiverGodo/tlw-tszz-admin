<template>
    <div class="page-content de-banner">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>每日英语</BreadcrumbItem>
            <BreadcrumbItem>广告管理</BreadcrumbItem>
        </Breadcrumb>
        <Card shadow>
            <div class="top-bar">
                <div class="options">

                </div>
                <div class="actions">
                    <Button type="primary">创建广告</Button>
                </div>
            </div>
            <div class="list">
                <!-- <Table 
                ref="resourceList" 
                :loading="resourceListLoading" 
                :columns="resourceListDef" 
                :data="resourceList"
                @on-selection-change="selectChange"></Table>
                <div class="bottom-bar">
                    <Button @click="handleSelectAll" >全选</Button>
                    <Button :loading="delResourceLoading" type="ghost" @click="unBindBookResource" >解除绑定</Button>
                </div> -->
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'page1'
};
</script>
