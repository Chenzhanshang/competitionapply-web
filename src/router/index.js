import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'


import home from '../components/home'
import adminHome from '../adminPage/home'

import homePagePromote from '../components/homePagePromote'
import personalInformation from '../components/personalInformation'

import competitionInform from '../components/competitionInform'
import adminCompetitionInform from '../adminPage/competitionInform'

import competitionDetails from '../components/competitionDetails'

import systemNotice from '../components/systemNotice'
import adminSystemNotice from '../adminPage/systemNotice'

import winningNotification from '../components/winningNotification'
import adminWinningNotification from '../adminPage/winningNotification'

import myCompetitionAndTeam from '../components/myCompetitionAndTeam'

import recruit from '../components/recruit'

import reportList from '../adminPage/reportList'

import advice from '../adminPage/advice'

import disposeAdvice from '../adminPage/disposeAdvice'

Vue.use(VueRouter)

const routes = [
  {
    name:'/',
    path:'/',
    redirect:'/login'
  },
  {
    name:'/login',
    path:'/login',
    component:login,
    meta: {
      title: '登录',
      type: '' // 是否需要判断是否登录,非login不需要判断
    }
  },
  {
    name:'home',
    path:'/home',
    component:home,
    meta: {
      title: '登录',
      type: 'login'  // 是否需要判断是否登录,login表示需要判断
    },
    children:[
      {
        path:'homePagePromote',
        component:homePagePromote,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'personalInformation',
        component:personalInformation,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'competitionInform',
        component:competitionInform,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'competitionDetails',
        component:competitionDetails,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'systemNotice',
        component:systemNotice,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'winningNotification',
        component:winningNotification,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'myCompetitionAndTeam',
        component:myCompetitionAndTeam,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'recruit',
        component:recruit,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      
    ]
  },

  {
    name:'adminHome',
    path:'/adminHome',
    component:adminHome,
    meta: {
      title: '登录',
      type: 'login' 
    },
    children:[
      {
        path:'adminCompetitionInform',
        component:adminCompetitionInform,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'adminSystemNotice',
        component:adminSystemNotice,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'adminWinningNotification',
        component:adminWinningNotification,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'reportList',
        component:reportList,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'advice',
        component:advice,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
      {
        path:'disposeAdvice',
        component:disposeAdvice,
        meta: {
          title: '登录',
          type: 'login' 
        }
      },
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
