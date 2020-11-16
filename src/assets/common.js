import { Notification } from 'element-ui';
let obj = {
  tableHeader: [
    { title: '编号', _width: 5, key: 'index' },
    { title: '单据编号', _width: 5, key: 'order_serial' },
    { title: '业务日期', _width: 5, key: 'billing_date' },
    { title: '货品名称', _width: 23, key: 'product_name' },
    { title: '规格', _width: 22, key: 'product_field' },
    { title: '单位', _width: 5, key: 'product_unit' },
    { title: '数量', _width: 5, key: 'product_num' },
    { title: '单价', _width: 5, key: 'product_price' },
    { title: '金额', _width: 5, key: 'product_amount' },
    { title: '图片', _width: 5, key: 'product_img', type: 'image', width: 80, height: 50 },
    { title: '备注', _width: 20, key: 'order_note' },
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
