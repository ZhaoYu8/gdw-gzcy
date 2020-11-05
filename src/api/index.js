import { Loading, Notification } from 'element-ui';
let baseURL = 'https://www.gendanwang.com/v1/api';
import router from '../router';
if (process.env.NODE_ENV === 'development') {
  baseURL = '/ccc';
} else if (process.env.VUE_APP_CURRENTMODE === 'prod') {
  baseURL = 'https://yy.yiyuanmaidian.com/v1/api';
}
let instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  responseType: 'json',
  validateStatus(status) {
    return status === 200;
  },
});
let loading;
let _error;
// 拦截请求
instance.interceptors.request.use(
  (config) => {
    let params = {};
    let current_org;
    let current_member;
    if (router.currentRoute.query.current_org) {
      localStorage.setItem('current_org', router.currentRoute.query.current_org);
      localStorage.setItem('current_member', router.currentRoute.query.current_member);
      current_org = router.currentRoute.query.current_org;
      current_member = router.currentRoute.query.current_member;
    } else {
      if (process.env.NODE_ENV === 'development') {
        current_org = localStorage.getItem('current_org') || '423'; // 11112 423
        current_member = localStorage.getItem('current_member') || '1092'; // 1 1092
      } else {
        current_org = localStorage.getItem('current_org'); // 11112 423
        current_member = localStorage.getItem('current_member'); // 1 1092
      }
    }
    if (!current_org && !_error) {
      _error = true;
      Notification.error({
        title: '系统提示',
        message: '因你清除了浏览器数据！所以需要从跟单王重新进去此页面！',
        onClose: () => {
          _error = false;
        },
      });
    }
    params = {
      current_org: current_org, // 11112 423
      current_member: current_member, // 1 1092
    };
    config.data = {
      ...params,
      ...config.data,
    };
    if (loading) loading.close();
    loading = Loading.service({
      lock: true,
      text: '玩命加载中...',
      background: 'transparent',
      target: '.content-box',
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    loading.close();
    return response;
  },
  (error) => {
    loading.close();
    let errorMessage = '请求错误！请刷新页面再试！';
    if (error.response) {
      errorMessage = error.response.data === null ? errorMessage : error.response.data.message;
    }
    if (_error) return;
    _error = true;
    Notification.error({
      title: '系统提示',
      message: errorMessage,
      duration: 2000,
      onClose: () => {
        _error = false;
      },
    });
    return Promise.reject(error);
  }
);
const request = {
  post(url, params = {}) {
    if (process.env.NODE_ENV === 'development') {
      params.testing_mode = 1;
    }
    return instance.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};
export default request;
