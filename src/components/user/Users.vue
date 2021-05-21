<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理 </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索与添加 -->
        <div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input placeholder="请输入内容">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                ></el-button>
              </el-input>

            </el-col>

            <el-col :span="3">
              <el-button type="primary">添加成员</el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 表格 -->
        <el-table
          :data="usersList"
          stripe
          border
          :row-style="{lineHeight: '80px'}"
        >
          <el-table-column
            type="index"
            label="#"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          >
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
          >
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="权限"
          >

          </el-table-column>
          <el-table-column label="状态">
            <!-- 使用组件插槽 -->
            <template v-slot="state">
              <el-switch
                v-model="state.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>

            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="operation">
              {{operation.row}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      usersList: [],
      total: 0,
      // 获取列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersList = res.data.users
      this.total = res.data.total
    }
  },
  created () {
    // 获取users列表
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 100%;
  min-width: 100%;
  margin-top: 20px;
  transition: all 0.5s;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

  .text {
    font-size: 12px;
  }

  .el-row {
    margin-bottom: 20px;
    line-height: 0;
  }
}
</style>