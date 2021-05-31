<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理 </el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 选择商品分类 -->
        <div>
          <!-- <el-form
            ref="addCateFormRef"
            :model="addCateForm"
            :rules="addCateRules"
            label-width="120px"
            class="addCate_form"
          >
            <el-form-item label="选择商品分类：">
              <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
                :key="isResouceShow"
              ></el-cascader>
            </el-form-item>
          </el-form> -->
        </div>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
            我的行程
          </el-tab-pane>
          <el-tab-pane label="消息中心">消息中心</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>

      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {},
  mounted () { }
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

  .addCategorires {
    display: flex;
    margin-bottom: 20px;
  }

  .el-pagination {
    margin-top: 15px;
    text-align: right;
  }

  .modifyPermissions {
    text-align: left;
  }
}
</style>