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
          <el-button type="success" @click="visible = true">预览</el-button>
          <el-button type="primary" ref="daochu" @click="exports">导出</el-button>
          <el-button type="warning" @click="headerVisible = true">表头设置</el-button>
          <el-button type="primary" @click="query">查询</el-button>
        </div>
      </el-row>
    </el-card>
    <div class="box">
      <table border="1" cellspacing="0" class="table" :class="{ 'always-table': n }" v-for="(n, i) in headerArr" :key="n">
        <tr style="font-weight: bold;" class="header-tr">
          <td v-for="row in orderTableHeader" :key="row.symbol">
            {{ row.text }}
          </td>
        </tr>
        <template v-for="(item, index) in tableData.slice(n, headerArr.length === 1 ? tableData.length : headerArr[i + 1])">
          <tr :key="'nvb' + index">
            <td class="t-c" style="width: 50px">{{ index + n + 1 }}</td>
            <td v-for="row in tableHeader" :key="row.symbol">
              <el-image v-if="row.symbol === 'product_img' && item.product_img" style="width: 50px; height: 50px" :src="item.product_img" fit="cove"></el-image>
              <ul v-else-if="row.symbol === 'product_field'">
                <li v-for="item in item.product_field" :key="item">
                  {{ item }}
                </li>
              </ul>

              <span v-else> {{ item[row.symbol] }}</span>
            </td>
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

    <headerSet :visible="headerVisible" @close="headerVisible = false" @ok="onOk" />
    <el-backtop target=".box"></el-backtop>
  </div>
</template>

<script>
import HomeDialog from "@/components/dialog/HomeDialog";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      customer_id: "",
      billing_date: moment()
        .subtract(1, "months")
        .format("YYYY-MM"),
      custData: [],
      tableData: [],
      visible: false,
      headerArr: [0],
      tableHeaderData: {},
      headerVisible: false
    };
  },
  components: { HomeDialog, headerSet: () => import("./components/headerSet") },
  computed: {
    ...mapState({
      tableHeader: (state) => state.tableHeader
    }),
    orderTableHeader() {
      let arr = [...this.tableHeader];
      arr.unshift({ text: "编号", symbol: "index" });
      return arr;
    },
    sum() {
      return this.tableData.map((r) => r.product_amount || 0).reduce((p, c) => p + c);
    },
    filterHeader() {
      return this.tableHeader.filter((r) => !["product_img"].includes(r.symbol));
    }
  },
  methods: {
    ...mapActions(["setTableHeader"]),
    onOk() {
      this.headerVisible = false;
      this.query();
    },
    async init() {
      let res = await this.$post("outbound_tasks/customer_options");
      this.custData = res.data.data.customer_options;
      this.customer_id = this.custData[4].id;
      this.query();
    },
    async query() {
      let obj = {};
      if (this.customer_id) obj.customer_id = this.customer_id;
      obj.billing_date = this.billing_date = moment(this.billing_date).format("YYYY-MM");
      let res = await this.$post("bills/list", obj);
      this.tableHeaderData = res.data.data;
      this.tableData = this.tableHeaderData.products.map((r) => {
        return {
          ...r,
          ...{
            product_num: Math.round(r.product_num * 100) / 100,
            product_price: Math.round(r.product_price * 100) / 100,
            product_amount: Math.round(r.product_amount * 100) / 100
          }
        };
      });
      this.setTableHeader(this.tableHeaderData.labels);
    },
    exports() {
      if (!this.tableData.length) {
        this.$message.error({
          type: "error",
          message: "数据列表是空！",
          showClose: true
        });
        return;
      }
      let arr = [];
      JSON.parse(JSON.stringify(this.tableData)).map((r, i) => {
        arr[i] = {};

        this.filterHeader.map((n) => {
          arr[i][n.text] = n.symbol === "product_field" ? (r[n.symbol].length ? r[n.symbol].join("\n ") : "") : r[n.symbol] || "";
        });
      });
      this.downloadExl(arr, {
        bookType: "xlsx",
        bookSST: true,
        type: "binary",
        cellStyles: true
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
      let arr = json.map((v, i) =>
        keyMap.map((k, j) => {
          return {
            v: v[k],
            position: this.getCharCol(j) + (i + 7)
          };
        })
      );
      arr.reduce((prev, next) => prev.concat(next)).map((v) => (tmpdata[v.position] = { v: v.v }));
      let outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
      tmpdata["A1"] = { v: this.tableHeaderData.org.name };
      outputPos = ["A1"].concat(outputPos);
      tmpdata["A2"] = {
        v: `地址: ${this.tableHeaderData.org.address} \n 电话: ${this.tableHeaderData.org.telephone}, 传真: ${this.tableHeaderData.org.fax} \n ${this.billing_date}月 对账单`
      };
      tmpdata["A1"].s = {
        font: { sz: 18, bold: true, vertAlign: true },
        alignment: { vertical: "center", horizontal: "center", wrapText: true },
        fill: { bgColor: { rgb: "fff" } }
      };
      tmpdata["A2"].s = {
        font: { sz: 14, vertAlign: true },
        alignment: { vertical: "center", horizontal: "center", wrapText: true }
      };
      let clen = this.filterHeader.length - 1;
      let dlen = this.tableData.length;
      let _date = this.getCharCol(parseInt(this.filterHeader.length / 2)) + (dlen + 8);
      let _date2 = this.getCharCol(parseInt(this.filterHeader.length / 2)) + (dlen + 10);
      // 合并单元格处理
      tmpdata["!merges"] = [
        {
          s: { c: 0, r: 0 },
          e: { c: clen, r: 0 }
        },
        {
          s: { c: 0, r: 1 },
          e: { c: clen, r: 4 }
        },
        {
          s: { c: 0, r: 5 },
          e: { c: clen, r: 5 }
        },
        {
          s: { c: 0, r: dlen + 7 },
          e: { c: parseInt(this.filterHeader.length / 2) - 1, r: dlen + 7 }
        },
        {
          s: { c: parseInt(this.filterHeader.length / 2), r: dlen + 7 },
          e: { c: clen, r: dlen + 7 }
        },
        {
          s: { c: 0, r: dlen + 8 },
          e: { c: clen, r: dlen + 8 }
        },
        {
          s: { c: 0, r: dlen + 9 },
          e: { c: parseInt(this.filterHeader.length / 2) - 1, r: dlen + 10 }
        },
        {
          s: { c: parseInt(this.filterHeader.length / 2), r: dlen + 9 },
          e: { c: clen, r: dlen + 10 }
        }
      ];
      tmpdata["A6"] = { v: `客户名称: ${this.custData.filter((r) => r.id === this.customer_id)[0].name}` };
      tmpdata["A6"].s = {
        font: { sz: 14, vertAlign: true }
      };
      tmpdata[`A${dlen + 8}`] = { v: `合计大写总金额: ${this.$common.ToString(Math.round(this.sum * 100) / 100)}` };
      tmpdata[_date] = { v: `合计小写: ${Math.round(this.sum * 100) / 100}` };
      tmpdata[`A${dlen + 8}`].s = {};
      tmpdata[_date].s = {};
      tmpdata[`A${dlen + 9}`] = {
        v:
          "注： 贵司（厂）若就此对账单存在异议，请立即与本司财务联系，若对此账单确认无误，请于三天内签字并盖章回传，否则以此单为准，谢谢合作！以上确认无误后，请贵司尽快付款。"
      };
      tmpdata[`A${dlen + 9}`].s = {};
      tmpdata[`A${dlen + 10}`] = { v: `确认签名: ` };
      tmpdata[_date2] = { v: `日期:` };
      //  s  设置xlsx单元格样式
      tmpdata[`A${dlen + 10}`].s = {
        font: { sz: 14, vertAlign: true },
        alignment: { vertical: "center" }
      };
      tmpdata[_date2].s = {
        font: { sz: 14, vertAlign: true },
        alignment: { vertical: "center" }
      };
      Array.from({ length: this.filterHeader.length }, (v, k) => this.getCharCol(k)).map((r) => {
        tmpdata[`${r}7`].s = {
          font: { sz: 14, bold: true, vertAlign: true },
          alignment: { vertical: "center", horizontal: "center" }
        };
        [...new Array(dlen + 11).keys()].map((n) => {
          if (!tmpdata[`${r}${n + 1}`]) {
            tmpdata[`${r}${n + 1}`] = {};
          }
          if (!tmpdata[`${r}${n + 1}`].s) {
            // 统一处理 样式
            tmpdata[`${r}${n + 1}`].s = {
              alignment: { vertical: "center", horizontal: "center", wrapText: true }
            };
          }
          tmpdata[`${r}${n + 1}`].s.border = {
            top: { style: "thin", color: "000" },
            left: { style: "thin", color: "000" },
            right: { style: "thin", color: "000" },
            bottom: { style: "thin", color: "000" }
          };
        });
      });
      tmpdata["!cols"] = this.filterHeader.map((r) => {
        return {
          wpx: this.getCellWidth(r) //<====设置一列宽度 根据长度 推算宽度
        };
      });
      let tmpWB = {
        SheetNames: ["mySheet"], //保存的表标题
        Sheets: {
          mySheet: Object.assign(
            {},
            tmpdata, //内容
            {
              "!ref": outputPos[0] + ":" + `${this.getCharCol(this.filterHeader.length)}${this.tableData.length + 11}` //设置填充区域
            }
          )
        }
      };
      let tmpDown = new Blob(
        [
          this.s2ab(
            XLSX.write(
              tmpWB,
              {
                bookType: type == undefined ? "xlsx" : type.bookType,
                bookSST: false,
                type: "binary"
              } //这里的数据是用来定义导出的格式类型
            )
          )
        ],
        {
          type: ""
        }
      );
      this.saveAs(tmpDown, `${this.billing_date}` + "." + (type.bookType == "biff2" ? "xls" : type.bookType));
    },
    // 计算最长的列宽 汉字二个字符 其他的一个字符
    getCellWidth(data) {
      if (["product_field"].includes(data.symbol)) {
        return 150;
      }
      let arr = this.tableData
        .map((r) => r[data.symbol])
        .map(
          (r) =>
            (r || "")
              .toString()
              .split("")
              .map((n) => (/.*[\u4e00-\u9fa5]+.*$/.test(n) ? 2 : 1))
              .reduce((l, s) => l + s, 0) * 20
        );
      let len = Math.min.apply(Math, arr);
      if (len < 100) return 100;
      if (len > 200) return 200;
      return len;
    },
    // 下载功能
    saveAs(obj, fileName) {
      let tmpa = document.createElement("a");
      tmpa.download = fileName || "未命名";
      // 兼容ie
      if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, "下载的文件名" + ".xlsx");
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
      if (n === 0) return "A";
      let s = "",
        m = 0;
      while (n > 0) {
        m = (n % 26) + 1;
        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
      }
      return s;
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== "undefined") {
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
        .add(num, "months")
        .format("YYYY-MM");
      this.query();
    }
  },
  mounted() {
    this.init();
  }
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
