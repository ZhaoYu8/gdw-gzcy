<template>
  <el-select
    v-model="value"
    :filterable="filterable"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :class="selectClass"
    :remote="filterable"
    :remote-method="remoteMethod"
    @visible-change="handleSelect"
    v-loadmore="loadMore"
    @change="change"
    :clearable="clearable"
  >
    <el-option v-for="item in options" :key="item[id]" :label="item[name]" :value="item[id]"> </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      options: [],
      index: 1, // 当前页
      stop: false,
    };
  },
  props: {
    placeholder: {
      // 占位符
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    value: {
      // 传值
      type: Number | Array,
      default() {
        return [];
      },
    },
    selectClass: {
      // class
      type: String,
      default: 'width-200',
    },
    size: {
      // 大小
      type: String,
      default: 'medium',
    },
    filterable: {
      // 是否可搜索
      type: Boolean,
      default: true,
    },
    name: {
      // 默认员工的name
      type: String,
      default: 'name',
    },
    id: {
      // 默认员工的id
      type: String,
      default: 'id',
    },
    data: {
      type: Array,
      default: [],
    },
  },
  watch: {
    value: {
      handler(value) {
        this.$emit('input', value);
      },
      immediate: true,
    },
    data: {
      handler(value) {
        if (value.length) {
          this.options = value.slice(0, 20);
        }
      },
      immediate: true,
    },
  },
  components: {},
  computed: {},
  methods: {
    change() {
      this.$nextTick(() => {
        this.$emit('change');
      });
    },
    // 筛选的方法
    remoteMethod(query) {
      this.index = 1;
      this.stop = false;
      if (query !== '') {
        this.stop = true;
        this.options = this.data.filter((r) => r.name.indexOf(query) > -1);
      } else {
        this.options = this.data.slice((this.index - 1) * 20, this.index * 20);
      }
    },
    // 滚动到底部触发
    loadMore() {
      if (this.stop) return;
      this.index = this.index + 1;
      this.options = this.options.concat(this.data.slice((this.index - 1) * 20, this.index * 20));
    },
    // 点击下拉框触发
    handleSelect(val) {
      if (val) {
        this.index = 1;
        this.options = this.data.slice((this.index - 1) * 20, this.index * 20);
      } else {
        this.stop = false;
        this.$emit('input', this.value);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.value && !this.options.filter((r) => r.id === this.value).length) {
        this.options.push(...this.data.filter((n) => n.id === this.value));
      }
    });
  },
};
</script>

<style lang="scss" scoped></style>
