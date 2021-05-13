import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component:() => import('../views/Login.vue')
  },
  {
    path: '/Main',
    name: 'Main',
    component:() => import('../views/Main.vue'),
    children:[
      {
        path:'/mytask',
        name: 'MyTask',
        component: () => import('../views/MyTask.vue')
      },
      {
        path:'/task',
        name: 'Task',
        component: () => import('../views/Task.vue')
      },
      {
        path:'/timeLine',
        name:'TimeLine',
        component: ()=> import('../views/TimeLine.vue')
      },
      {
        path:'/account',
        name:'Account',
        component: ()=> import('../views/Account.vue')
      },
      {
        path:'/dictionary',
        name:'Dictionary',
        component: ()=> import('../views/Dictionary.vue')
      },
      {
        path:'/finance/summary',
        name:'Finance_Summary',
        component: ()=> import('../views/Finance/Summary.vue')
      },
      {
        path:'/plan',
        name:'Plan',
        component: ()=> import('../views/Plan.vue')
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
