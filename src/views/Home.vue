<template>
  <div class="home">
    <el-card class="no-p-b">
      <el-row :gutter="20" class="d-f-c-s-b">
        <el-form label-position="left" :inline="true" class="f-1">
          <el-col span="6">
            <el-form-item label="客户名称：" class="form-item">
              <Page v-model="customer_id" :clearable="false" placeholder="请选择客户名称" :data="custData" @change="query"></Page>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="月份：" class="form-item month">
              <el-date-picker :clearable="false" v-model="billing_date" type="month" class="W-200 mr-10" @change="query" />
              <i class="el-icon-circle-plus-outline mr-10 f-24 icon" @click="change(1)"></i>
              <i class="el-icon-remove-outline mr-10 f-24 icon" @click="change(-1)"></i>
            </el-form-item>
          </el-col>
        </el-form>
        <div>
          <el-button class="f-r mr-10" type="primary" @click="query">查询</el-button>
          <el-button class="f-r mr-10" type="success" @click="visible = true">预览</el-button>
          <el-button type="primary" class="f-r mr-10" ref="daochu" @click="exports">导出</el-button>
        </div>
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
          <td v-for="td in $common.tableHeader" :key="td" :style="{ width: td._width ? td._width + (typeof td._width === 'string' ? 'px' : '%') : '' }">
            {{ td.title }}
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
import table2excel from 'js-table2excel';
export default {
  data() {
    return {
      customer_id: '',
      billing_date: moment().format('YYYY-MM'),
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
      this.customer_id = this.custData[4].id;
      this.query();
    },
    async query() {
      let obj = {};
      if (this.customer_id) obj.customer_id = this.customer_id;
      if (this.billing_date) obj.billing_date = moment(this.billing_date).format('YYYY-MM');
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
    exports() {
      let arr = [];
      JSON.parse(JSON.stringify(this.tableData)).map((r, i) => {
        arr[i] = {};
        this.$common.tableHeader
          .filter((r) => !['index', 'product_img'].includes(r.key))
          .map((n) => {
            arr[i][n.title] = r[n.key];
          });
      });
      this.downloadExl(arr, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary',
        cellStyles: true,
      });
    },

    downloadExl(json, type) {
      let tmpdata = json[0];
      json.unshift({});
      let keyMap = []; //获取keys
      for (let k in tmpdata) {
        keyMap.push(k);
        json[0][k] = k;
      }
      tmpdata = []; //用来保存转换好的json
      let arr = json.map((v, i) => {
        let data = keyMap.map((k, j) => {
          return Object.assign(
            {},
            {
              v: v[k],
              position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 7),
            }
          );
        });
        return data;
      });
      arr
        .reduce((prev, next) => prev.concat(next))
        .forEach(
          (v, i) =>
            (tmpdata[v.position] = {
              v: v.v,
            })
        );
      let outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
      tmpdata['A1'] = { v: `广州彩源印制纸品有限公司` };
      outputPos = ['A1'].concat(outputPos);
      tmpdata['A2'] = { v: `地址: 广州市黄埔区百合三路8号 \n 电话: 4008-959-818, 传真: 020-38200095 \n ${this.billing_date}月 对账单` };
      tmpdata['A1'].s = {
        font: { sz: 18, bold: true, vertAlign: true },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        fill: { bgColor: { rgb: 'fff' } },
      };
      tmpdata['A2'].s = {
        font: { sz: 14, vertAlign: true },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
      };
      tmpdata['!merges'] = [
        {
          s: { c: 0, r: 0 },
          e: { c: 8, r: 0 },
        },
        {
          s: { c: 0, r: 1 },
          e: { c: 8, r: 4 },
        },
        {
          s: { c: 0, r: 5 },
          e: { c: 8, r: 5 },
        },
        {
          s: { c: 0, r: this.tableData.length + 7 },
          e: { c: 5, r: this.tableData.length + 7 },
        },
        {
          s: { c: 6, r: this.tableData.length + 7 },
          e: { c: 8, r: this.tableData.length + 7 },
        },
        {
          s: { c: 0, r: this.tableData.length + 8 },
          e: { c: 8, r: this.tableData.length + 8 },
        },
        {
          s: { c: 0, r: this.tableData.length + 9 },
          e: { c: 4, r: this.tableData.length + 10 },
        },
        {
          s: { c: 5, r: this.tableData.length + 9 },
          e: { c: 8, r: this.tableData.length + 10 },
        },
      ];
      tmpdata['A6'] = { v: `客户名称: ${this.custData.filter((r) => r.id === this.customer_id)[0].name}` };
      tmpdata['A6'].s = {
        font: { sz: 14, vertAlign: true },
      };
      tmpdata[`A${this.tableData.length + 8}`] = { v: `合计大写总金额: ${this.$common.ToString(this.sum)}` };
      tmpdata[`G${this.tableData.length + 8}`] = { v: `合计小写: ${this.sum}` };
      tmpdata[`A${this.tableData.length + 9}`] = {
        v: '注： 贵司（厂）若就此对账单存在异议，请立即与本司财务联系，若对此账单确认无误，请于三天内签字并盖章回传，否则以此单为准，谢谢合作！以上确认无误后，请贵司尽快付款。',
      };

      tmpdata[`A${this.tableData.length + 10}`] = { v: `确认签名: ` };

      tmpdata[`F${this.tableData.length + 10}`] = { v: `日期:` };
      tmpdata[`A${this.tableData.length + 10}`].s = {
        font: { sz: 14, vertAlign: true },
        alignment: { vertical: 'center' },
      }; //<====设置xlsx单元格样式
      tmpdata[`F${this.tableData.length + 10}`].s = {
        font: { sz: 14, vertAlign: true },
        alignment: { vertical: 'center' },
      }; //<====设置xlsx单元格样式
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((r) => {
        tmpdata[`${r}7`].s = {
          font: { sz: 14, bold: true, vertAlign: true },
          alignment: { vertical: 'center', horizontal: 'center' },
        };
        [...new Array(this.tableData.length + 11).keys()].map((n) => {
          if (!tmpdata[`${r}${n + 1}`]) {
            tmpdata[`${r}${n + 1}`] = {};
          }
          if (!tmpdata[`${r}${n + 1}`].s) {
            tmpdata[`${r}${n + 1}`].s = {};
          }
          tmpdata[`${r}${n + 1}`].s.border = {
            top: { style: 'thin', color: 'FFFFAA00' },
            left: { style: 'thin', color: 'FFFFAA00' },
            right: { style: 'thin', color: 'FFFFAA00' },
            bottom: { style: 'thin', color: 'FFFFAA00' },
          };
        });
      });
      [...new Array(9).keys()].map((r) => {
        tmpdata[`${String.fromCharCode(65 + r)}1`].s.border = {
          top: { style: 'thin', color: 'FFFFAA00' },
          left: { style: 'thin', color: 'FFFFAA00' },
          right: { style: 'thin', color: 'FFFFAA00' },
        };
        tmpdata[`${String.fromCharCode(65 + r)}2`].s.border = {
          left: { style: 'thin', color: 'FFFFAA00' },
          right: { style: 'thin', color: 'FFFFAA00' },
          bottom: { style: 'thin', color: 'FFFFAA00' },
        };
      });
      tmpdata['!cols'] = [{ wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; //<====设置一列宽度
      let tmpWB = {
        SheetNames: ['mySheet'], //保存的表标题
        Sheets: {
          mySheet: Object.assign(
            {},
            tmpdata, //内容
            {
              '!ref': outputPos[0] + ':' + `I${this.tableData.length + 11}`, //设置填充区域
            }
          ),
        },
      };
      console.log(tmpWB);
      let tmpDown = new Blob(
        [
          this.s2ab(
            XLSX.write(
              tmpWB,
              {
                bookType: type == undefined ? 'xlsx' : type.bookType,
                bookSST: false,
                type: 'binary',
              } //这里的数据是用来定义导出的格式类型
            )
          ),
        ],
        {
          type: '',
        }
      );
      this.saveAs(tmpDown, `${this.billing_date}` + '.' + (type.bookType == 'biff2' ? 'xls' : type.bookType));
    },
    // 下载功能
    saveAs(obj, fileName) {
      let tmpa = document.createElement('a');
      tmpa.download = fileName || '未命名';
      // 兼容ie
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, '下载的文件名' + '.xlsx');
      } else {
        tmpa.href = URL.createObjectURL(obj);
      }
      tmpa.click();
      setTimeout(function() {
        URL.revokeObjectURL(obj);
      }, 100);
    },
    // 获取26个英文字母用来表示excel的列
    getCharCol(n) {
      let temCol = '',
        s = '',
        m = 0;
      while (n > 0) {
        m = (n % 26) + 1;
        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
      }
      return s;
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      } else {
        let buf = new Array(s.length);
        for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
    },
    change(num) {
      this.billing_date = moment(this.billing_date)
        .add(num, 'months')
        .format('YYYY-MM');
      this.query();
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
  .month {
    ::v-deep .el-form-item__content {
      display: inline-flex;
      align-items: center;
    }
    .icon {
      color: #909399;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
        transition: all 0.3s;
      }
    }
  }
}
</style>
