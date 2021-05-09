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
        naem:'TimeLine',
        component: ()=> import('../views/TimeLine.vue')
      },
      {
        path:'/account',
        naem:'Account',
        component: ()=> import('../views/Account.vue')
      },
      {
        path:'/dictionary',
        naem:'Dictionary',
        component: ()=> import('../views/Dictionary.vue')
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
