import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'

import homePagePromote from '../components/homePagePromote'
import adminHomePagePromote from '../adminPage/homePagePromote'
import personalInformation from '../components/personalInformation'

import competitionInform from '../components/competitionInform'
import adminCompetitionInform from '../adminPage/competitionInform'

import competitionDetails from '../components/competitionDetails'
import adminCompetitionDetails from '../adminPage/competitionDetails'

import systemNotice from '../components/systemNotice'


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
        path:'adminHomePagePromote',
        component:adminHomePagePromote
      },
      {
        path:'personalInformation',
        component:personalInformation
      },
      {
        path:'competitionInform',
        component:competitionInform
      },
      {
        path:'adminCompetitionInform',
        component:adminCompetitionInform
      },
      {
        path:'competitionDetails',
        component:competitionDetails
      },
      {
        path:'adminCompetitionDetails',
        component:adminCompetitionDetails
      },
      {
        path:'systemNotice',
        component:systemNotice
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
