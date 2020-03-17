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
      },
      {
        path:'competitionInform',
        component:competitionInform
      },
      {
        path:'competitionDetails',
        component:competitionDetails
      },
      {
        path:'systemNotice',
        component:systemNotice
      },
      {
        path:'winningNotification',
        component:winningNotification
      },
      {
        path:'myCompetitionAndTeam',
        component:myCompetitionAndTeam
      },
      {
        path:'recruit',
        component:recruit
      },
      
    ]
  },

  {
    name:'adminHome',
    path:'/adminHome',
    component:adminHome,
    children:[
      {
        path:'adminCompetitionInform',
        component:adminCompetitionInform
      },
      {
        path:'adminSystemNotice',
        component:adminSystemNotice
      },
      {
        path:'adminWinningNotification',
        component:adminWinningNotification
      },
      {
        path:'reportList',
        component:reportList
      },
      {
        path:'advice',
        component:advice
      },
      {
        path:'disposeAdvice',
        component:disposeAdvice
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
