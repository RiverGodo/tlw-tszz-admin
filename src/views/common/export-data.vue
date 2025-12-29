<template>
  <Modal class="common-dialog model-roll" v-model="showModal" title="导出">
    <CheckboxGroup v-model="check_result[0]" @on-change="checkAllGroupChange(0)">
      <Row type="flex">
        <Col span="12" v-for="item in check_list[0]" :key="item.value">
          <Checkbox :label="item.value">{{item.label}}</Checkbox>
        </Col>
      </Row>
    </CheckboxGroup>
    <div v-if="this.title_list[1]">
      <div
        style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;margin-top:10px"
      >
        <Checkbox
          :indeterminate="indeterminate[1]"
          :value="checkAll[1]"
          @click.prevent.native="handleCheckAll(1)"
        >全选{{title_list[1]}}</Checkbox>
      </div>
      <CheckboxGroup v-model="check_result[1]" @on-change="checkAllGroupChange(1)">
        <Row type="flex">
          <Col span="12" v-for="item in check_list[1]" :key="item.value">
            <Checkbox :label="item.value">{{item.label}}</Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
      <div
        style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;margin-top:10px"
      >
        <Checkbox
          :indeterminate="indeterminate[2]"
          :value="checkAll[2]"
          @click.prevent.native="handleCheckAll(2)"
        >全选{{title_list[2]}}</Checkbox>
      </div>
      <CheckboxGroup v-model="check_result[2]" @on-change="checkAllGroupChange(2)">
        <Row type="flex">
          <Col span="12" v-for="item in check_list[2]" :key="item.value">
            <Checkbox :label="item.value">{{item.label}}</Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
    </div>

    <div slot="footer">
      <Button size="large" @click="showModal=false">取消</Button>
      <Button size="large" type="primary" @click="exportExcel">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {export_array_to_excel} from "@/libs/excel"
export default {
  name: "exportDataModal",
  props: {
    checkList: {
      default: []
    },
    checkListTwo: {},
    checkListThree: {},
    titleList: {},
    data: {
      default: []
    },
    dataArr: {},
    filename: {
      type: String,
      default: "导出数据"
    },
    isShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      title_list: ["", "", ""],
      check_list: [],
      check_result: [],
      values: [],
      data_arr: [],
      showModal: false,
      indeterminate: [false, false, false],
      checkAll: [true, true, true]
    };
  },
  watch: {
    isShow(value) {
      if (value) {
        if (this.dataArr ) {
          this.data_arr = this.dataArr;
        } else {
          this.data_arr = [];
          this.data_arr[0] = this.data;
        }
        this.showModal = true;
        if (this.titleList) {
          this.titleList.forEach((_item, _index) => {
            this.title_list[_index] = _item;
          });
        }
        let list = [];
        if (this.checkListTwo && this.checkListThree) {
          list = [this.checkList, this.checkListTwo, this.checkListThree];
        } else {
          list = [this.checkList];
        }
        list.forEach((items, _index) => {
          if (items.length > 0) {
            let arr = [];
            let values = [];
            items.map(item => {
              arr.push({
                value: item.key,
                label: item.title
              });
              values.push(item.key);
            });
            this.values[_index] = values;
            this.check_result[_index] = values;
            this.check_list[_index] = arr;
          }
        });
      }
    },
    showModal(value) {
      if (!value) {
        this.$emit("closemodal");
      }
    }
  },
  methods: {
    handleCheckAll(_index) {
      if (this.indeterminate[_index]) {
        this.checkAll[_index] = false;
      } else {
        this.checkAll[_index] = !this.checkAll[_index];
      }
      this.indeterminate[_index] = false;

      if (this.checkAll[_index]) {
        this.check_result.splice(_index, 1, this.values[_index]);
      } else {
        this.check_result.splice(_index, 1, []);
      }
    },
    checkAllGroupChange(_index) {
      let datas = this.check_result[_index];
      if (datas.length === this.values[_index].length) {
        this.indeterminate[_index] = false;
        this.checkAll[_index] = true;
      } else if (datas.length > 0) {
        this.indeterminate[_index] = true;
        this.checkAll[_index] = false;
      } else {
        this.indeterminate[_index] = false;
        this.checkAll[_index] = false;
      }
    },
    exportExcel() {
      //导出excel
      for (let i = 0; i < this.data_arr.length; i++) {
        let data = this.data_arr[i];

        if (data.length) {
          // import("@/libs/excel").then(excel => {
            let titles = [];
            let keys = [];
            for (const item of this.check_list[i]) {
              if (this.check_result[i].includes(item.value)) {
                titles.push(item.label);
                keys.push(item.value);
              }
            }
            const params = {
              title: titles,
              key: keys,
              data: data,
              autoWidth: true,
              filename: this.filename
            };
            export_array_to_excel(params);
            // this.exportLoading = false
          // });
        } else {
          this.$Message.info("数据不能为空！");
        }
      }
    }
  }
};
</script>
<style >
.model-roll .ivu-modal-body {
  height: 220px;
  overflow: auto;
}
</style>
