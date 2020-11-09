<template>
  <div class="home">
    <el-card class="no-p-b">
      <el-row :gutter="20">
        <el-form label-position="left" :inline="true">
          <el-col span="6">
            <el-form-item label="客户名称：" class="form-item">
              <Page v-model="customer_id" :clearable="true" placeholder="请选择客户名称" :data="custData"></Page>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="日期：" class="form-item">
              <a-range-picker
                class="form-item"
                v-model="date"
                range-separator="至"
                :placeholder="['开始日期', '结束日期']"
                @change="query"
                :locale="{
                  lang: {
                    yearFormat: 'YYYY年',
                  },
                }"
              >
              </a-range-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <el-button class="f-r mr-10" type="success" @click="visible = true">预览</el-button>
        <el-button class="f-r mr-10" type="primary" @click="query">查询</el-button>
      </el-row>
    </el-card>
    <div class="box">
      <table border="1" cellspacing="0" class="table" :class="{ 'always-table': n }" v-for="(n, i) in headerArr" :key="n">
        <tr
          style="font-weight: bold;"
          class="header-tr"
          @dblclick="
            () => {
              headerArr.splice(
                headerArr.findIndex((r) => r === n),
                1
              );
            }
          "
        >
          <td v-for="td in $common.tableHeader" :key="td" :style="{ width: td.width ? td.width + (typeof td.width === 'string' ? 'px' : '%') : '' }">
            {{ td.label }}
          </td>
        </tr>
        <template v-for="(item, index) in tableData.slice(n, headerArr.length === 1 ? tableData.length : headerArr[i + 1])">
          <tr :key="'nvb' + index" @dblclick="always(index + n)">
            <td class="t-c">{{ index + n + 1 }}</td>
            <td>{{ item.order_serial }}</td>
            <td>{{ item.billing_date }}</td>
            <td>{{ item.product_name }}</td>
            <td>{{ item.product_field.length ? item.product_field.join(' ') : '' }}</td>
            <td>{{ item.product_unit }}</td>
            <td>{{ item.product_num }}</td>
            <td>{{ item.product_price }}</td>
            <td>{{ item.product_amount }}</td>
            <td>
              <el-image v-if="item.product_img" style="width: 80px; height: 80px" :src="item.product_img" fit="cove"></el-image>
            </td>
            <td>{{ item.order_note }}</td>
          </tr>
        </template>
      </table>
    </div>

    <el-dialog title="" :visible.sync="visible" width="90%" top="50px">
      <HomeDialog :headerArr="headerArr" :visible="visible" :tableHeaderData="tableHeaderData" :tableData="tableData" />
      <div slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
        <el-button type="success" class="mb-10" v-print="'#detailOutDepot'">打印</el-button>
      </div>
    </el-dialog>
    <el-backtop target=".box"></el-backtop>
  </div>
</template>

<script>
import HomeDialog from '@/components/dialog/HomeDialog';
export default {
  data() {
    return {
      customer_id: '',
      date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      custData: [],
      tableData: [],
      visible: false,
      headerArr: [0],
      tableHeaderData: {},
    };
  },
  components: { HomeDialog },
  methods: {
    async init() {
      let res = await this.$post('outbound_tasks/customer_options');
      this.custData = res.data.data.customer_options;
      this.customer_id = this.custData[0].id;
      this.query();
    },
    async query() {
      let obj = {};
      if (this.customer_id) obj.customer_id = this.customer_id;
      if (this.date) {
        obj.billing_date_min = moment(this.date[0]).format('YYYY-MM-DD');
        obj.billing_date_max = moment(this.date[1]).format('YYYY-MM-DD');
      }
      let res = await this.$post('bills/list', obj);
      this.tableData = res.data.data.products;
      this.tableHeaderData = res.data.data;
    },
    always(val) {
      if (!this.headerArr.filter((r) => r === val).length) this.headerArr.push(val);
      this.headerArr = this.headerArr.sort((a, b) => {
        return a - b;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.home {
  font-size: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .box {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    .table {
      margin-top: 10px;
      border: 1px solid #000;
      width: 100%;
      border-collapse: collapse;
      tr {
        height: 34px;
        th,
        td {
          padding: 4px;
          border: 1px solid #000;
        }
      }
      tr:first-child {
        background-color: #909399;
        color: #fff;
        td {
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
