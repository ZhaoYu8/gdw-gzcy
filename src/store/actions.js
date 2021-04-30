// import { ActionTree } from 'vuex'
import TYPES from "./types";
const actions = {
  setTableHeader({ commit }, data = {}) {
    commit(TYPES.SET_TABLE_HEADER, data);
  }
};
export default actions;
