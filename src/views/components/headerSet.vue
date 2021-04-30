<template>
  <el-dialog title="表头设置" :visible.sync="visible" width="90%" top="100px" @close="close">
    <el-row :gutter="10">
      <el-col :span="12" class="set">
        <div class="set-header">剩余选中</div>
        <draggable class="set-box" tag="ul" v-model="allTableHeader" v-bind="dragOptions" @start="drag = true" @end="drag = false">
          <li class="set-box-li" v-for="element in allTableHeader" :key="element.id">
            {{ element.name }}
          </li>
        </draggable>
      </el-col>
      <el-col :span="12" class="set">
        <div class="set-header">已选中</div>
        <draggable class="set-box" tag="ul" v-model="selected" v-bind="dragOptions" @start="drag = true" @end="drag = false">
          <li v-for="element in selected" :key="element.id" class="set-box-li">
            {{ element.name }}
          </li>
        </draggable>
      </el-col>
    </el-row>

    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      allTableHeader: [],
      selected: [],
      drag: false
    };
  },
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.init();
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      tableHeader: (state) => state.tableHeader
    }),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    async init() {
      let { data } = await this.$post("bills/table_headers");
      this.selected = this.tableHeader.map((r) => {
        return {
          name: r.text || r.name,
          id: r.symbol || r.id
        };
      });
      let arr = this.selected.map((r) => r.id);
      this.allTableHeader = data.data.headers.filter((r) => !arr.includes(r.id));
    },
    async save() {
      await this.$post("bills/table_headers_save", {
        headers: this.selected.map((r) => r.id)
      });
      this.$message({
        message: "保存成功！",
        type: "success"
      });
      this.$emit("ok");
    },
    close() {
      this.$emit("close");
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.set {
  &-header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &-box {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 5px;
    min-height: 100px;
    &-li {
      padding: 5px 10px;
      background-color: #409eff;
      margin: 5px;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      height: 22px;
      line-height: 22px;
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>
