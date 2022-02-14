import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/right/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/right/Roles.vue')

const Categories = () => import(/* webpackChunkName: "Cate_Params" */ '../components/good/Categories.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/good/Params.vue')

const Goods = () => import(/* webpackChunkName: "goods_add_edit" */ '../components/good/Goods.vue')
const Add = () => import(/* webpackChunkName: "goods_add_edit" */ '../components/good/Add.vue')
const Edit = () => import(/* webpackChunkName: "goods_add_edit" */ '../components/good/Edit.vue')

const Orders = () => import(/* webpackChunkName: "orders_reports" */ '../components/order/Orders.vue')
const Reports = () => import(/* webpackChunkName: "orders_reports" */ '../components/report/Reports.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          describe: '欢迎页',
          component: Welcome
        }, {
          path: '/users',
          name: 'users',
          describe: '用户管理 - 用户列表',
          component: Users
        }, {
          path: '/roles',
          name: 'roles',
          describe: '权限管理 - 角色列表',
          component: Roles
        }, {
          path: '/rights',
          name: 'rights',
          describe: '权限管理 - 权限列表',
          component: Rights
        }, {
          path: '/goods',
          name: 'goods',
          describe: '商品管理 - 商品列表',
          component: Goods
        }, {
          path: '/goods/add',
          name: 'add',
          describe: '商品列表 - 添加商品',
          component: Add
        }, {
          path: '/goods/edit',
          name: 'edit',
          describe: '商品列表 - 编辑商品',
          component: Edit
        }, {
          path: '/params',
          name: 'params',
          describe: '商品管理 - 分类参数',
          component: Params
        }, {
          path: '/categories',
          name: 'categories',
          describe: '商品管理 - 商品分类',
          component: Categories
        }, {
          path: '/orders',
          name: 'orders',
          describe: '订单管理 - 订单列表',
          component: Orders
        }, {
          path: '/reportS',
          name: 'reportS',
          describe: '数据统计 - 数据报表',
          component: Reports
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  /*
    to 将要访问的路径
    from 代表从哪个路径跳转而来
    next 是一个函数，表示放行
      next() 放行   next('/login') 强制跳转
  */
  if (to.path === '/login') {
    return next()
  }

  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    next()
  }
})

export default router