import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//使用axios
import axios from 'axios'
import VueAxios from 'vue-axios'

//设置全局访问路径
axios.defaults.baseURL= 'http://localhost:8999/competition'
//访问携带cookie
axios.defaults.withCredentials = true
Vue.use(VueAxios,axios)

Vue.config.productionTip = false

//全局日期过滤器
Vue.filter('dateFormart',function(date,formart ='yyyy-MM-dd HH:mm:ss'){
  var dt = new Date(date);
  var y  = dt.getFullYear();
  var m = dt.getMonth()+1;
  var d = dt.getDate();
  if(formart === 'yyyy-MM-dd' ){
    return `${y}-${m<10?'0'+m:m}-${d<10?'0'+d:d}`;
  }
  else if(formart === 'yyyy-MM-dd HH:mm:ss'){
    var HH = dt.getHours();
    var mm = dt.getMinutes();
    var ss = dt.getSeconds();
    return `${y}-${m<10?'0'+m:m}-${d<10?'0'+d:d} ${HH<10?'0'+HH:HH}:${mm<10?'0'+mm:mm}:${ss<10?'0'+ss:ss}`;
  }
  else{
    return date
  }

})

//界面加载时判断是否已登录，通过type=login控制是否校验登录
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const type = to.meta.type
  // 判断该路由是否需要登录权限
  if (type === 'login') {
    axios.get('/user/isLogin')
    .then((res)=>{
      if(res.data.status == 1001){
        //在main.js直接使用element的$message组件
        Vue.prototype.$message({
          type: "error",
          message: res.data.msg
        });
        next('/login')
      }
      else{
        next()
      }
    })
    .catch()
  } else {
    next()  // 确保一定要有next()被调用
  }
})

new Vue({
  router,
  render: h => h(App),
  created() {
    if(!localStorage.getItem('showAttention')){
      localStorage.setItem("showAttention",JSON.stringify(true))
    }
    
    
  },
}).$mount('#app')