<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理 </el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索与添加 -->
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="openAddCateDialog"
            class="addCategorires"
          >添加分类</el-button>
        </div>
        <!-- 表格 -->
        <tree-table
          :data="cateList"
          :columns="columns"
          show-index
          index-text="#"
          :selection-type="false"
          :expand-type="false"
          border
        >
          <!-- 是否有效 新版用法 -->
          <template v-slot:cat_deleted="scope">
            <div v-if="scope.row.cat_deleted == false">
              <i
                class="el-icon-success"
                :index="scope"
                style="color: #f00;"
              ></i>
            </div>
            <div v-else>
              <i
                class="el-icon-error"
                :index="scope"
              ></i>
            </div>
          </template>
          <!-- 排序 -->
          <template v-slot:cat_level="scope">
            <div v-if="scope.row.cat_level == 0">
              <el-tag size="mini">一级</el-tag>
            </div>
            <div v-else-if="scope.row.cat_level == 1">
              <el-tag
                type="success"
                size="mini"
              >二级</el-tag>
            </div>
            <div v-else>
              <el-tag
                type="info"
                size="mini"
              >三级</el-tag>
            </div>
          </template>

          <!-- 操作 -->
          <template
            slot="operation"
            slot-scope="scope"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditCate(scope.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delCate(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </tree-table>
      </div>
      <!-- 添加商品分类操作面板 -->
      <el-dialog
        title="添加商品分类"
        :visible.sync="addCateDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeAddCateDialog"
      >
        <el-form
          ref="addCateFormRef"
          :model="addCateForm"
          :rules="addCateRules"
          label-width="100px"
          class="addCate_form"
        >
          <el-form-item
            label="分类名称："
            prop="cat_name"
          >
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange"
              clearable
              :key="isResouceShow"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeAddCateDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="addFormCate"
          >确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑商品分类操作面板 -->
      <el-dialog
        title="编辑商品分类"
        :visible.sync="editCateDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeEditCateDialog"
      >
        <el-form
          ref="editCateFormRef"
          :model="editCateForm"
          :rules="editCateRules"
          label-width="100px"
          class="editCate_form"
        >
          <el-form-item
            label="分类名称："
            prop="cat_name"
          >
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeEditCateDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="editFormCate"
          >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 10 // 当前每页显示多少数据
      },
      // 商品分类
      cateList: [],
      total: 0,
      // 为 tree-table 指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        prop: 'cat_deleted',
        type: 'template',
        template: 'cat_deleted'
      }, {
        label: '排序',
        prop: 'cat_level',
        type: 'template',
        template: 'cat_level'
      }, {
        label: '操作',
        prop: 'operation',
        type: 'template',
        template: 'operation'
      }],
      addCateDialog: false,
      addCateForm: {
        cat_name: '华为',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: ['blur'] }
        ]
      },
      editCateDialog: false,
      editCateForm: {
        cat_name: ''
      },
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: ['blur'] }
        ]
      },
      // 父级商品分类
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      isResouceShow: 1 // 解决回显问题
    }
  },
  methods: {
    async getcateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败：' + res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // get父级分类
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败：' + res.meta.msg)
      this.parentCateList = res.data
    },
    // 查询商品分类
    async queryGoods () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败：' + res.meta.msg)

      if (res.data.total === 0) {
        return this.$message.error('未查询到该产品')
      }

      this.total = res.data.total
      this.cateList = res.data.goods
      this.getcateList()
    },
    // 添加商品分类面板
    openAddCateDialog () {
      this.getParentCateList()
      this.addCateDialog = true
      this.isResouceShow++
    },
    // 关闭添加商品分类面板
    closeAddCateDialog () {
      this.addCateDialog = false
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.isResouceShow++
    },
    // 添加商品分类
    addFormCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('分类名称格式错误')
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加失败：' + res.meta.msg)
        this.$message.success('添加成功')
        this.getcateList()
        this.addCateDialog = false
        // 分类父级id 默认
        this.addCateForm.cat_pid = 0
        // 分类等级 默认
        this.addCateForm.cat_level = 0
      })
    },
    // 分页
    handleSizeChange (newSize) {
      // 监听最新的 pagesize 的变化
      this.queryInfo.pagesize = newSize
      this.getcateList()
    },
    handleCurrentChange (newPage) {
      // 监听最新的页码值的变化
      this.queryInfo.pagenum = newPage
      this.getcateList()
    },
    // 打开编辑商品分类面板
    async openEditCate (cid) {
      const { data: res } = await this.$http.get('categories/' + cid)
      this.editCateForm = res.data
      this.editCateDialog = true
    },
    // 关闭编辑商品分类面板
    closeEditCateDialog () {
      this.addCateDialog = false
      this.$refs.editCateFormRef.resetFields()
      this.addCateForm.cat_name = ''
    },
    // 编辑商品分类
    editFormCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('分类名称格式错误')
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, this.editCateForm)
        if (res.meta.status !== 200) return this.$message.error('更新失败：' + res.meta.msg)
        this.$message.success('更新成功')
        this.editCateDialog = false
        this.editCateForm = {}
        this.getcateList()
      })
    },
    // 删除商品分类
    async delCate (gid) {
      const confirmRes = await this.$confirm(
        '您确实要删除该分类吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + gid)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getcateList()
    },
    // cascader 选择事件
    handleChange () {
      if (this.selectedKeys.length > 0) {
        // 分类父级id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 分类父级id 默认
        this.addCateForm.cat_pid = 0
        // 分类等级 默认
        this.addCateForm.cat_level = 0
      }
    }
  },
  mounted () {
    this.getcateList()
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
  .el-cascader {
    width: 100%;
  }
}
</style>