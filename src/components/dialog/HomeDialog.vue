<template>
  <div v-if="visible">
    <div id="detailOutDepot">
      <div class="home-dialog" :class="{ 'always-table': n }" v-for="(n, i) in headerArr" :key="n">
        <header class="header">
          <div class="company">{{ tableHeaderData.org.name }}</div>
          <div>地址：{{ tableHeaderData.org.address }}</div>
          <div>电话：{{ tableHeaderData.org.telephone }}，传真：{{ tableHeaderData.org.fax }}</div>
          <div class="date">{{ date }} 对账单</div>
        </header>
        <table border="1" cellspacing="0" class="table">
          <tr>
            <td :colspan="tableHeader.length">客户名称： {{ tableHeaderData.customer_name }}</td>
          </tr>
          <tr style="font-weight: bold;" class="header-tr">
            <td v-for="row in tableHeader" :key="row.text" class="w-s-n">
              {{ row.text }}
            </td>
          </tr>
          <template v-for="(item, index) in tableData.slice(n, headerArr.length === 1 ? tableData.length : headerArr[i + 1])">
            <tr :key="'nvb' + index">
              <td v-for="row in tableHeader" :key="row.symbol">
                <el-image
                  v-if="row.symbol === 'product_img' && item.product_img"
                  style="width: 50px; height: 50px"
                  :src="item.product_img"
                  fit="cove"
                ></el-image>
                <ul v-else-if="row.symbol === 'product_field'">
                  <li v-for="item in item.product_field" :key="item">
                    {{ item }}
                  </li>
                </ul>

                <span v-else> {{ item[row.symbol] }}</span>
              </td>
            </tr>
          </template>
          <tr>
            <td :colspan="parseInt(tableHeader.length / 2) - 1">合计大写总金额： {{ $common.ToString(sum) }}</td>
            <td :colspan="tableHeader.length - parseInt(tableHeader.length / 2)">合计小写： {{ sum }}</td>
          </tr>
        </table>

        <el-row class="tail">
          <el-col :span="24">
            注：
            贵司（厂）若就此对账单存在异议，请立即与本司财务联系，若对此账单确认无误，请于三天内签字并盖章回传，否则以此单为准，谢谢合作！以上确认无误后，请贵司尽快付款。
          </el-col>
        </el-row>
        <el-row class="tail">
          <el-col :span="12" class="tail-first">确认签名：</el-col>
          <el-col :span="12"> 日期：</el-col>
        </el-row>
      </div>
    </div>
    <el-backtop target=".el-dialog__wrapper"></el-backtop>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    tableHeaderData: {
      type: Object,
      default: {}
    },
    headerArr: {
      type: Array,
      default: [0]
    },
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  computed: {
    sum() {
      return this.tableData.map((r) => r.product_amount || 0).reduce((p, c) => p + c);
    },
    date() {
      let min = moment(this.tableHeaderData.billing_date_min).format("YYYY年MM月DD日");
      let max = moment(this.tableHeaderData.billing_date_max).format("YYYY年MM月DD日");
      return min + "~" + max;
    },
    ...mapState({
      tableHeader: (state) => state.tableHeader
    })
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#detailOutDepot {
  font-size: 16px;
  .always-table {
    page-break-before: always;
  }
  .home-dialog {
    margin-bottom: 20px;
    .header {
      border: 1px solid #000;
      border-bottom: 0;
      font-size: 20px;
      text-align: center;
      .company {
        font-size: 30px;
      }
      .date {
        font-size: 25px;
        margin-bottom: 0;
        padding-bottom: 5px;
      }
      div {
        margin-bottom: 5px;
      }
    }
    .table {
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
        td {
          white-space: nowrap;
        }
      }
    }
  }
  .tail {
    height: 50px;
    line-height: 50px;
    border: 1px solid #000;
    border-top: 0;
    &-first {
      border-right: 1px solid #000;
    }
    * {
      padding-left: 5px;
    }
  }
}
</style>
