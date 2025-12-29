<template>
  <div>
    <Header class="searchBoard">
      <Form ref="formInline" :label-width="80" inline>
        <FormItem prop="user" label="名称">
          <Input type="text" v-model="searchForm.name" placeholder="名称"></Input>
        </FormItem>
        <FormItem prop="user" label="创建人姓名">
          <Input type="text" v-model="searchForm.realname" placeholder="创建人姓名"></Input>
        </FormItem>
        <FormItem prop="user" label="url">
          <Input type="text" v-model="searchForm.url" placeholder="地址"></Input>
        </FormItem>
        <FormItem prop="user" label>
          <Button type="info" @click="handleReset()">重置</Button>
          <Button type="primary" @click="handleSearch()">搜索</Button>
        </FormItem>
      </Form>
      <Form ref="formInline" :label-width="80" inline v-if="scenes=='sourceManage'">
        <FormItem prop="user" label>
          <Button type="info" @click="add">添加素材</Button>
        </FormItem>
      </Form>
    </Header>
    <Table border :columns="sourceListHeader" :data="sourceList"></Table>
    <div style="text-align:right">
      <Page :total="total" current.sync="current" :page-size="20" @on-change="getList"></Page>
    </div>
  </div>
</template>

<script>
import {
  getResoureList,
  updateResoure,
  deleteResoureList,
  addResoureList
} from "@/api/daily-english/sourcelist.js";
export default {
  name: "sourceList",
  props: {
    scenes: {}
  },
  data() {
    return {
      sourceListHeader: [
        {
          title: "资源类型",
          key: "content_type"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "url",
          key: "url"
        },
        {
          title: "创建人姓名",
          key: "realname",
          width: 120
        }
      ],
      sourceList: [],
      total: 0,
      searchForm: {
        name: "",
        url: "",
        content: "",
        realname: ""
      },
      currentPage: 1
    };
  },
  mounted() {
    if (this.scenes == "sourceManage") {
      this.sourceListHeader.push({
        title: "Action",
        width: 150,
        align: "center",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.edit(params);
                  }
                }
              },
              "编辑"
            ),
            h(
              "Button",
              {
                props: {
                  type: "error",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.remove(params);
                  }
                }
              },
              "删除"
            )
          ]);
        }
      });
    }else if(this.scenes == 'bindResource'){
      this.sourceListHeader.push({
        title: "Action",
        width: 150,
        align: "center",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.bind(params);
                  }
                }
              },
              "绑定"
            )
          ]);
        }
      });
    }
    getResoureList({ page_size: 20 }).then(res => {
      this.total = res.data.count;
      this.sourceList = res.data.rows;
    });
  },
  methods: {
    handleSearch(page) {
      if (page) {
        this.getList(page);
      } else {
        this.getList(1);
      }
    },
    handleReset() {
      Object.keys(this.searchForm).forEach(v => {
        this.searchForm[v] = "";
      });
      this.getList(1);
    },
    getList(page) {
      // 遍历搜索对象
      this.currentPage = page;
      let searchObj = {};
      searchObj.page_index = Number(page - 1);
      searchObj.page_size = 20;
      Object.keys(this.searchForm).forEach(v => {
        if (this.searchForm[v]) {
          searchObj[v] = this.searchForm[v];
        }
      });
      getResoureList(searchObj).then(res => {
        this.total = res.data.count;
        this.sourceList = res.data.rows;
      });
    },
    edit(argv) {
      this.$emit("edit", [argv, this.currentPage]);
    },
    bind(argv) {
      this.$emit("bind", [argv, this.currentPage]);
    },
    remove(argv) {
      this.$emit("remove", [argv, this.currentPage]);
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
    add() {
      this.$emit("add");
    }
  }
};
</script>

<style>
</style>