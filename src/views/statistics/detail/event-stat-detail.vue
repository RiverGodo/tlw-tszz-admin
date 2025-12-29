<template>
  <div class="page-content">
    <Breadcrumb separator=">">
      <BreadcrumbItem>统计分析</BreadcrumbItem>
      <BreadcrumbItem>事件详情</BreadcrumbItem>
    </Breadcrumb>
    <Card shadow>
      <Form :label-width="120">
        <div class="form_style">
          <FormItem label="事件值">
            <Select
              class="input-select"
              v-model="search_option.event_value"
              @on-change="chanSearch"
            >
            <Option  value="-1" :key="9999">请选择</Option>
              <Option v-for="(item,index) in event_value_arr" :value="item" :key="index">{{ item}}</Option>
            </Select>
          </FormItem>
          <div class="form_style" style="margin-left:35px;">
            <FormItem label>
              <Input
                v-model="search_option.searchKey"
                style="width: 280px;display:inline-table;margin-left:-80px;"
              >
                <Select v-model="search_option.type" slot="prepend" style="width: 80px">
                  <Option value="1">事件值</Option>
                  <Option value="2">事件参数</Option>
                  <Option value="3">用户ID</Option>
                </Select>
              </Input>
            </FormItem>
            <Button
              type="primary"
              style="margin:1px 0 0 10px;height:32px;"
              class="btn_searchs"
              icon="ios-search"
              @click="vagueFunc"
            >查询</Button>
          </div>
          <Button
              type="primary"
              style="margin-left:60px;height:32px;"
              icon="ios-refresh"
              @click="handleRefresh"
            >刷新</Button>
        </div>
        <div class="form_style"> 
          <RadioGroup v-model="buttonLabel" type="button"  @on-change="handleChangeTime">
            <Radio label="1" style="margin-left:70px;">昨天</Radio>
            <Radio label="2">今天</Radio>
            <Radio label="3">过去七天</Radio>
            <Radio label="4">过去一个月</Radio>
            <Radio label="5">自定义</Radio>
          </RadioGroup>
          <FormItem label="开始时间">
            <DatePicker
              type="date"
              placement="top"
              v-model="start_time"
              @on-change="changeTime(0)"
              placeholder="选择开始时间"
              style="width: 200px"
              :disabled="is_disabled"
            ></DatePicker>
          </FormItem>
          <FormItem label="结束时间">
            <DatePicker
              type="date"
              placement="top"
              v-model="end_time"
              @on-change="changeTime(1)"
              placeholder="选择结束时间"
              style="width: 200px"
              :disabled="is_disabled"
            ></DatePicker>
          </FormItem>
        </div>
      </Form>
      <div style="position:relative">
        <echart :is-show="echart_show" :x-data="x_data" :y-data="y_data" :echart-title="echart_title"></echart>
        <Table :loading="eventDetailLoading" :columns="eventDetailListDef" :data="eventDetailLists"></Table>
        <Row class="bottom-bar" type="flex" justify="space-between">
          <Col span="4"></Col>
          <Col span="20" style="text-align:right">
            <Page
              show-total
              show-sizer
              :current="search_option.page_index"
              :total="enent_detail_count"
              :page-size="search_option.page_size"
              :page-size-opts="search_option.page_size_opts"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
            ></Page>
          </Col>
        </Row>
        <Spin fix v-if="isLoading">加载中...</Spin>
      </div>
    </Card>
  </div>
</template>
<script>
import { getEventDetailList, getEventValueList } from "@/api/event-stat";
import echart from "@/views/modal-components/echart";
import moment from "moment";
export default {
  components: {
    echart
  },
  data() {
    return {
      x_data: "[]",
      y_data: "[]",
      start_time: "",
      end_time: "",
      day_len:7,//最开始渲染的天数
      enent_detail_count: 0,
      eventDetailLoading: false,
      echart_show: false,
      isLoading: true,
      is_disabled: true,   // 是否禁用
      is_btn: false,    // 判断是否是点击按钮  按日期还是按时间
      date_tab_index:0, //选择某个tab日期
      eventDetailLists: [],
      buttonLabel: 0,
      week_info: [], //从今天到七天前的日期
      event_args_arr: [], //事件参数列表
      event_value_arr: [], //事件值列表
      echart_title: [],
      search_option: {
        searchKey: "",
        type: "2",
        event_value:"-1",
        event_args: "-1",
        page_index: 1,
        page_size: 20,
        page_size_opts: [3, 50, 100]
      },
      eventDetailListDef: [
        {
          title: "用户id",
          key: "user_id",
          width: 260,
          align: "center"
        },
        {
          title: "来源IP",
          key: "ip",
          align: "center",
          width: 260
        },
        {
          title: "事件值",
          key: "event_value",
          width: 260,
          align: "center"
        },
        {
          title: "事件参数",
          key: "event_args",
          width: 260,
          align: "center"
        },
        {
          title: "访问时间",
          key: "create_time",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.create_time).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        }
      ]
    };
  },
  mounted() {
    this.getEventValueList();
    this.getWeek();
    this.start_time = moment().subtract(this.day_len,"days").format("YYYY-MM-DD")
    this.end_time = moment().format("YYYY-MM-DD")
  },
  methods: {
    //改变时间
    changeTime(_index) {
      this.getWeek(this.start_time, this.end_time, _index);
    },
    //选择筛选
    chanSearch(){
      this.echart_show = false;
      this.search_option.page_index =1
      this.getUserAnserDetailFunc();
    },
    //模糊查询
    vagueFunc(){
      if(this.search_option.type){
        this.search_option.page_index =1
        this.getUserAnserDetailFunc()
      }else{
        this.$Message.warning("请选择一项进行查询")
      }
    },
    getEventValueList() {
      getEventValueList({ event_id: this.$route.query.event_id }).then(res => {
        if (res.res_code === 1) {
          this.event_value_arr = res.data.event_values;
          this.event_args_arr = res.data.event_argses;
        }
      });
    },
    //获取一段时间的日期表
    getWeek(_start, _end, _index) {
      this.week_info = [];
      const endtDate = _end ? _end : moment().format("YYYY-MM-DD");
      let len = this.day_len;
      if (_start) {
        const startDate = moment(_start);
        len = startDate.diff(endtDate, "days");
        if (len >= 0) {
          //判断限制条件，重置日期
          this.$Message.warning("开始时间不能大于结束时间");
          if (_index) {
            this.end_time = "";
          } else {
            this.start_time = "";
          }
          return false;
        } else {
          len = -len;
        }
      }
      for (let i = 0; i <= len; i++) {
        this.week_info.unshift(moment(endtDate).subtract(i, "days").format("YYYY-MM-DD"));
      }
      this.x_data = JSON.stringify(this.week_info);
      this.search_option.page_index =1
      /*
      * anthor jiayin
      * time 19.1.25
      * 在获取数据完数据后把echart组件恢复到默认值
      */
      this.getUserAnserDetailFunc().then(() => {
        this.echart_show = false;
      });
    },
    
    getUserAnserDetailFunc(_start,_end) {
      this.isLoading = true;
      this.echart_show = false;
      return new Promise((resolve,resject) => { 
        getEventDetailList({
          event_id: this.$route.query.event_id,
          page_index: this.search_option.page_index - 1,
          page_size: this.search_option.page_size,
          startDate: _start ? _start : this.week_info[0],
          type: this.search_option.searchKey?Number(this.search_option.type):0,
          event_value: this.search_option.event_value,
          event_args: this.search_option.event_args,
          endDate: _end ? _end : (_start ? _start : this.week_info[this.week_info.length - 1]),
          searchKey: this.search_option.searchKey,
          hourFlg: _start ? 1 : 0
        })
          .then(res => {
            if (res.res_code === 1) {  
              /*/*
              * anthor jiayin
              * time 19.2.1
              * 需求改成默认是有几条线，如果是点击事件值后才会显示对应的曲线
              * this.echart_title 中存着对应曲线的名称和颜色
              */ 
              let y = {};
              let color = ['#1d6d42','#ffc442','#0aa6e6','yellow','#17eaa0','#0aa6e6','#655a5a','#63438c','#214f79','#968852','#0032ff','#6891e2','#e268b4','#c768e2','#9f68e2','#e26868','#c7e268','#e2ca68','#9042f3'];
              let c = 0;
              this.echart_title = []
              for (let j in res.data.countDataMap) {
                this.echart_title.push({
                  name: j,
                  color: color[c]
                })
                c++
                y[j] = []
                for (let i = 0; i < this.week_info.length; i++) {
                  let cur_data = res.data.countDataMap[j].filter(item => {
                    /*
                    * anthor jiayin
                    * time 19.1.25
                    * 如果是按小时也就是取一天的数据的时候就截取字符串去匹配值
                    * 如果是按日期的按日期去匹配
                    */
                    if (this.is_btn) {
                      return item.date.substring(11,13) == this.week_info[i]
                    } else {
                      return item.date == this.week_info[i]
                    }
                  });
                  if (cur_data.length > 0) {
                    y[j][i] = cur_data[0].count;
                  } else {
                    y[j][i] = 0;
                  }
                }
              }
              this.y_data = JSON.stringify(y);      
              this.echart_show = true;
              this.eventDetailLists = res.data.eventsList;
              this.enent_detail_count = res.data.total_count;
            }
            this.isLoading = false;
            resolve()
          })
          .catch(error => {
            this.echart_show = true;
            this.$Message.warning(error);
            this.isLoading = false;
            resject()
          });
      })
    },
    pageIndexChange(_value) {
      this.search_option.page_index = _value;
      this.getUserAnserDetailFunc();
    },
    pageSizeChange(_value) {
      this.search_option.page_size = _value;
      this.getUserAnserDetailFunc();
    },
    /*
    * anthor jiayin
    * time 19.1.25
    * 五个按钮点击事件
    * _id用来区分是哪个按钮
    * this.week_info 换成24小时格式
    */
    handleChangeTime (_id) {
      this.date_tab_index =_id;
      this.echart_show = false;
      if (_id != 5) {
        this.is_disabled = true
      }
      if (_id == 1 || _id == 2) {
        for(let i = 0;i<24;i++) {
          this.week_info[i] = i + 1
        }
      }
      switch(Number(_id)) {
        case 1: 
          this.is_btn = true
          this.echart_show = true;
          this.x_data = JSON.stringify(this.week_info)
          var time1 = moment().subtract(1, "days").format('YYYY-MM-DD'); 
          var start_time = time1 + ' 00'
          var end_time = time1 + ' 23'
          this.getUserAnserDetailFunc(start_time,end_time)
        break;
        case 2: 
          this.is_btn = true
          this.echart_show = true;
          this.x_data = JSON.stringify(this.week_info)
          var time2 = moment().format('YYYY-MM-DD'); 
          var start_time = time2 + ' 00'
          var end_time = time2 + ' 23'
          this.getUserAnserDetailFunc(start_time,end_time)
        break;
        case 3: 
          this.echart_show = true;
          this.is_btn = false
          this.x_data = JSON.stringify(this.week_info)
          var start_time = moment().subtract(7, "days").format('YYYY-MM-DD'); 
          var end_time = moment().format('YYYY-MM-DD'); 
          this.getWeek(start_time, end_time, 1) 
        break;
        case 4: 
          this.echart_show = true;
          this.is_btn = false
          this.x_data = JSON.stringify(this.week_info)
          var start_time = moment().subtract(30, "days").format('YYYY-MM-DD'); 
          var end_time = moment().format('YYYY-MM-DD'); 
          this.getWeek(start_time, end_time, 1) 
        break;
        case 5: 
          this.is_btn = false;
          this.is_disabled = false;
        break;
      }
    },
    /*
    * anthor jiayin
    * time 19.1.31
    * 点击刷新
    */
    handleRefresh () {
      this.is_btn = false;
      this.getEventValueList();
      this.getWeek();
    }
  }
};
</script>
<style lang="less" scoped>
.form_style {
  display: flex;
  flex-direction: row;
}
.input-select {
  width: 200px;
}
.input-selects {
  width: 100px;
}
.btn_searchs {
  background: #8c9095;
  color: #fff;
  border: none;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
</style>
