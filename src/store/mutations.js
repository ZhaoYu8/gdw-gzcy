import TYPES from './types';

const mutations = {
  [TYPES.SET_COMMON](state, data) {
    state.delivery_route = data.delivery_route_options; // 送货路线
    state.delivery_shift = data.delivery_shift_options; // 送货班次
    state.fangdanfangshi = data.fangdanfangshi_options; // 放单方式
    state.fufeifangshi = data.fufeifangshi_options; // 付费
    state.huoyunfangshi = data.huoyunfangshi_options; // 货运
    state.member = data.member_options; // 会员
    state.allocate_member = data.allocate_member_options; // 配货员
    state.delivery_member = data.delivery_member_options; // 送货员选项
    state.delivery_train = data.delivery_train_options; // 送货车号
    state.with_member = data.with_member_options; // 跟车员
  },
  [TYPES.SET_CUST](state, data) {
    state.customer = data.customer_options; // 客户
  },
  [TYPES.SET_LOCATION](state, data) {
    state.location = data.location_options; // 仓位
    state.warehouse = data.warehouse_options; // 仓库
  },
  [TYPES.SET_FILTER](state, data) {
    state.group_options = data.group_options; // 分类
    state.member_options = data.member_options; // 销售负责人
  },
};
export default mutations;
