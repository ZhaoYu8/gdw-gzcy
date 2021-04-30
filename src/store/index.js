import actions from "./actions";
import mutations from "./mutations";
let state = { tableHeader: [] };

export default new Vuex.Store({
  state,
  actions,
  mutations
});
