<template>
    <Row class="add-segment-wrapper">
        <Col span="3">
            <Row><Button type="primary" @click="addSegment">添加分段</Button></Row>
        </Col>
        <Col span="21">
            <Row style="margin-bottom: 10px" class="add-segment" type="flex" justify="start" align="middle" :key="index" v-for="(item, index) in segList">
                <Col span="3">
                    <Input v-model="item.seek" placeholder="请输入秒数"></Input>
                </Col>
                <Col span="1">
                    <Row type="flex" align="middle" justify="center">
                        ----
                    </Row>
                </Col>
                <Col span="6">
                    <Input v-model="item.name" placeholder="请输入内容"></Input>
                </Col>
                <Col span="3" offset="1">
                    <Button style="width: 80px;" @click="delSegment(index)">删除</Button>
                </Col>
            </Row>
        </Col>
    </Row>
</template>
<script>
export default {
    props: ['segmentData'],
    computed: {
        segList(){
            return this.segmentData
        }
    },
    methods: {
        addSegment(){
            this.segList.push({
                name: '',
                seek: '',
                isCurrent: false
            })
        },
        delSegment(i){
            this.segList.splice(i, 1)
        }
    }
};
</script>
<style lang="less" scoped>
    .add-segment-wrapper{

        .add-segment{
        }
    }
</style>
