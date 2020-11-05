// import { ActionTree } from 'vuex'
import TYPES from './types';
let that = new Vue();
const actions = {
  async getCommon({ commit }, data = {}) {
    // 员工
    const res = await that.$post('/outbound_tasks/select_options', data).then((res) => res.data.data);
    if (!res) return;
    commit(TYPES.SET_COMMON, res);
    return res;
  },
  async getCust({ commit }, data = {}) {
    const res = await that.$post('/outbound_tasks/customer_options', data).then((res) => res.data.data);
    if (!res) return;
    commit(TYPES.SET_CUST, res);
    return res;
  },
  async getLocation({ commit }, data = {}) {
    const res = await that.$post('/outbound_tasks/warehouse_location_options', data).then((res) => res.data.data);
    if (!res) return;
    commit(TYPES.SET_LOCATION, res);
    return res;
  },
  async getFilter({ commit }, data = {}) {
    const res = await that.$post('/yuanyi_storages/filter_options', data).then((res) => res.data.data);
    if (!res) return;
    commit(TYPES.SET_FILTER, res);
    return res;
  },
};
export default actions;
