import actions from './actions';
import mutations from './mutations';
let state = {
  allocate_member: [], // 配货员
  delivery_member: [], // 送货员选项
  delivery_train: [], // 送货车号
  with_member: [], // 跟车员
  customer: [], // 客户
  delivery_route: [], // 送货路线
  delivery_shift: [], // 送货班次
  fangdanfangshi: [], // 放单方式
  fufeifangshi: [], // 付费
  huoyunfangshi: [], // 货运
  location: [], // 库位
  member: [], // 人员
  warehouse: [], // 仓库
  group_options: [], // 分类
  member_options: [], // 销售，负责人
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
});
