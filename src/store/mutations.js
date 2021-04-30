import TYPES from "./types";

const mutations = {
  [TYPES.SET_TABLE_HEADER](state, data) {
    state.tableHeader = data;
  }
};
export default mutations;
