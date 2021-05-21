<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img
          src="../assets/logo.png"
          alt="vue-logo"
        >
        <h2> 电商后台管理系统 </h2>
      </div>
      <el-button
        type="info"
        @click="logout"
      >退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="is_collapse ? '64px' : '200px'">
        <el-menu
          :default-active="default_active"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#ccc"
          active-text-color="#409EFF"
          unique-opened
          :collapse="is_collapse"
          :collapse-transition="false"
          router
        >
          <el-button
            size="medium"
            class="open_close"
            @click="change_collapse"
          >{{open_symbol}}</el-button>
          <!-- 一级菜单 -->
          <el-submenu
            :index="String(item.id)"
            v-for="(item, index) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[index].icon"></i>
              <span>{{ item.authName }}</span>

            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + submenu.path"
              v-for="(submenu, list) in item.children"
              :key="submenu.id"
              @click="add_default_active('/' + submenu.path)"
            >
              <template slot="title">
                <i :class="iconList[index].children[list].icon"></i>
                <span>{{ submenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: '',
      iconList: [{
        id: 1,
        name: '用户管理',
        path: 'user',
        icon: 'iconfont icon-yonghuguanli_huaban',
        children: [{
          id: 1,
          name: '用户列表',
          path: 'user',
          icon: 'iconfont icon-yonghuliebiao'
        }]
      }, {
        id: 2,
        name: '权限管理',
        path: 'rights',
        icon: 'iconfont icon-quanxianguanli',
        children: [{
          id: 1,
          name: '角色列表',
          path: 'roles',
          icon: 'iconfont icon-role-list'
        }, {
          id: 2,
          name: '权限列表',
          path: 'rights',
          icon: 'iconfont icon-permissions-list'

        }]
      }, {
        id: 3,
        name: '商品管理',
        path: 'goods',
        icon: 'iconfont icon-shangpinguanli',
        children: [{
          id: 1,
          name: '商品列表',
          path: 'goods',
          icon: 'iconfont icon-shangpinliebiao'
        }, {
          id: 2,
          name: '分类参数',
          path: 'params',
          icon: 'iconfont icon-canshuxinxi'
        }, {
          id: 3,
          name: '商品分类',
          path: 'categories',
          icon: 'iconfont icon-icon04'
        }]
      }, {
        id: 4,
        name: '订单管理',
        path: 'orders',
        icon: 'iconfont icon-dingdanguanli',
        children: [{
          id: 1,
          name: '订单列表',
          path: 'orders',
          icon: 'iconfont icon-dingdanliebiao'
        }]
      }, {
        id: 5,
        name: '数据统计',
        path: 'reports',
        icon: 'iconfont icon-shujutongji',
        children: [{
          id: 1,
          name: '数据报表',
          path: 'reports',
          icon: 'iconfont icon-shujubaobiao'
        }]
      }],
      is_collapse: false,
      open_symbol: '<<<',
      default_active: '/users' // 默认地址
    }
  },
  methods: {
    logout () {
      // window.sessionStorage.removeItem('token') 删除某一项
      window.sessionStorage.clear() // 清空全部
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    change_collapse () {
      this.is_collapse = !this.is_collapse
      this.open_symbol = this.is_collapse ? '>>>' : '<<<'
    },
    add_default_active (path) {
      // 解决高亮
      this.default_active = path
      window.sessionStorage.setItem('active_path', path)
    }
  },
  created () {
    // 获取菜单数据
    this.getMenuList()
    this.default_active = window.sessionStorage.getItem('active_path')
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    color: #333;
    text-align: center;

    .logo {
      display: flex;

      img {
        width: auto;
        height: 50px;
        padding: 5px 0;
      }

      h2 {
        margin: 0 0 0 15px;
        color: #fff;
        font-weight: lighter;
        line-height: 60px;
      }
    }

    .el-button {
      height: 30px;
      padding: 0 15px;
      margin: 15px 0;
      line-height: 30px;
    }
  }

  .el-aside {
    background: #333744;
    color: #333;
    .open_close {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0);
      border: 0;
      color: #ccc;
      transition: all 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
    .el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
}
.iconfont {
  margin-right: 5px;
}
</style>