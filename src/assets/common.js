import { Notification } from 'element-ui';
let obj = {
  tableHeader: [
    { label: '编号', width: 5 },
    { label: '单据编号', width: 5 },
    { label: '业务日期', width: 5 },
    { label: '货品名称', width: 23 },
    { label: '规格', width: 22 },
    { label: '单位', width: 5 },
    { label: '数量', width: 5 },
    { label: '单价', width: 5 },
    { label: '金额', width: 5 },
    { label: '图片', width: 5 },
    { label: '备注', width: 20 },
  ],
  // 成功提示
  notify(message = '保存', type = false) {
    Notification({
      title: type ? '提示' : '成功',
      message: message + (type ? '' : '成功'),
      type: type ? 'warning' : 'success',
    });
  },
  ToString(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
      return '数据非法'; //判断数据是否大于0
    }
    let unit = '千百拾亿千百拾万千百拾元角分',
      str = '';
    n += '00';
    let indexpoint = n.indexOf('.'); // 如果是小数，截取小数点前面的位数
    if (indexpoint >= 0) {
      n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2); // 若为小数，截取需要使用的unit单位
    }
    unit = unit.substr(unit.length - n.length); // 若为整数，截取需要使用的unit单位
    for (let i = 0; i < n.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i); //遍历转化为大写的数字
    }
    return str
      .replace(/零(千|百|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|壹(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元整'); // 替换掉数字里面的零字符，得到结果
  },
};
export default obj;
