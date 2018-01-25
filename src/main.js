// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
//创建一个日期过滤器,全局使用
Vue.filter('formatDate',function (old) {
  function fillZero(value) {
    return value > 10 ? value : '0' + value
  }
    let date = new Date(old)
    let year = fillZero(date.getFullYear());
    let month = fillZero(date.getMonth() + 1);
    let day = fillZero(date.getDate());
    let hours = fillZero(date.getHours());
    let second = fillZero(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${second}`
  })
// Vue.filter('formatState',function (value) {
//     return value == true ? '启用' : '未启用'
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
