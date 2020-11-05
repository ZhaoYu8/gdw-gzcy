import App from './App.vue';
import router from './router';
import http from './api/index';
import common from './assets/common';
import Print from 'vue-print-nb';
import global from './assets/global';
import store from './store';
import './assets/common.scss';
import Element from 'element-ui';
import directives from './directives';
// 全局注册指令
Vue.use(directives);
Vue.use(Element, { size: 'medium' });
Vue.config.productionTip = false;
let arr = [];
Object.assign(Vue.prototype, {
  $post: http.post,
  $get: http.get,
  $bus: new Vue(),
  $common: common,
  $print: Print,
});
Vue.directive('focus', {
  inserted: function(el) {
    arr.push(el.children[0]);
    el.onkeydown = function(event) {
      if (event.keyCode === 13) {
        let ar = arr.findIndex((r) => event.target === r);
        if (arr[ar + 7]) {
          arr[ar + 7].focus();
        }
      }
    };
  },
});
Vue.use(Print);
Vue.use(global);
let vm = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

export default vm;
