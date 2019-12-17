import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import homePagePromote from '../components/homePagePromote'
import personalInformation from '../components/personalInformation'


Vue.use(VueRouter)

const routes = [
  {
    name:'/',
    path:'/',
    redirect:'/login'
  },
  {
    name:'login',
    path:'/login',
    component:login
  },
  {
    name:'home',
    path:'/home',
    component:home,
    children:[
      {
        path:'homePagePromote',
        component:homePagePromote
      },
      {
        path:'personalInformation',
        component:personalInformation
      }
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
