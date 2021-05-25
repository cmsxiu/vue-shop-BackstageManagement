<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb
      separator="/"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理 </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table
        :data="rightList"
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
          prop="authName"
          label="权限名称"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
        >
          <template v-slot="slot">
            <el-tag v-if="slot.row.level == 0">一级</el-tag>
            <el-tag
              type="success"
              v-else-if="slot.row.level == 1"
            >二级</el-tag>
            <el-tag
              type="info"
              v-else
            >三级</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRoles () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败：' + res.meta.msg)
      }
      this.rightList = res.data
    }
  },
  mounted () {
    this.getRoles()
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

  .add_roles {
    display: block;
    margin-bottom: 20px;
  }

  .text {
    font-size: 12px;
  }
}
</style>