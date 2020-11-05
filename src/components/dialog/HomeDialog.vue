<template>
  <div v-if="visible">
    <el-button type="success" class="mb-10" v-print="'#detailOutDepot'">打印</el-button>
    <div id="detailOutDepot">
      <div class="home-dialog" :class="{ 'always-table': n }" v-for="(n, i) in headerArr" :key="n">
        <header class="header">
          <div class="company">广州彩源印制纸品有限公司</div>
          <div>地址：广州市黄埔区百合三路8号</div>
          <div>电话：4008-959-818，传真：020-38200095</div>
          <div class="date">{{ date }} 对账单</div>
        </header>
        <table border="1" cellspacing="0" class="table">
          <tr>
            <td colspan="10">客户名称： {{ tableHeaderData.customer_name }}</td>
          </tr>
          <tr style="font-weight: bold;" class="header-tr">
            <td
              v-for="td in $common.tableHeader.slice(1, $common.tableHeader.length)"
              :key="td"
              :style="{ width: td.width ? td.width + (typeof td.width === 'string' ? 'px' : '%') : '' }"
              class="w-s-n"
            >
              {{ td.label }}
            </td>
          </tr>
          <template v-for="(item, index) in tableData.slice(n, headerArr.length === 1 ? tableData.length : headerArr[i + 1])">
            <tr :key="'nvb' + index">
              <td class="w-b-b-a">{{ item.order_serial }}</td>
              <td class="w-s-n">{{ item.billing_date }}</td>
              <td class="w-b-b-a">{{ item.product_name }}</td>
              <td class="w-b-b-a">{{ item.product_field.length ? item.product_field.join(' ') : '' }}</td>
              <td>{{ item.product_unit }}</td>
              <td>{{ item.product_num }}</td>
              <td>{{ item.product_price }}</td>
              <td>{{ item.product_amount }}</td>
              <td>
                <el-image v-if="item.product_img" style="width: 80px; height: 80px" :src="item.product_img" fit="cove"></el-image>
              </td>
              <td class="w-b-b-a">{{ item.order_note }}</td>
            </tr>
          </template>
          <tr>
            <td colspan="6">合计大写总金额： {{ $common.ToString(sum) }}</td>
            <td colspan="4">合计小写： {{ sum }}</td>
          </tr>
          <tr>
            <td colspan="10">
              注： 贵司（厂）若就此对账单存在异议，请立即与本司财务联系，若对此账单确认无误，请于三天内签字并盖章回传，否则以此单为准，谢谢合作！以上确认无误后，请贵司尽快付款。
            </td>
          </tr>
          <tr>
            <td colspan="5" style="height: 50px">
              确认签名：
            </td>
            <td colspan="5">
              日期：
            </td>
          </tr>
        </table>
      </div>
    </div>
    <el-backtop target=".el-dialog__wrapper"></el-backtop>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    tableHeaderData: {
      type: Object,
      default: {},
    },
    headerArr: {
      type: Array,
      default: [0],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
      default: [],
    },
  },
  computed: {
    sum() {
      let sum = this.tableData
        .map((r) => r.product_amount)
        .reduce((p, c) => {
          return p + c;
        });
      return sum;
    },
    date() {
      let min = moment(this.tableHeaderData.billing_date_min).format('YYYY年MM月DD日');
      let max = moment(this.tableHeaderData.billing_date_max).format('YYYY年MM月DD日');
      return min + '~' + max;
    },
  },
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
}
</style>
