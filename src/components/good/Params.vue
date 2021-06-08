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
      <el-alert
        type="warning"
        show-icon
        title="注意：只允许为第三级分类设置相关参数"
        :closable="false"
      ></el-alert>
      <el-row>
        <el-col :span="24">
          <div class="text item">
            <!-- 选择商品分类 -->
            <el-form label-width="120px">
              <el-form-item label="选择商品分类：">
                <el-cascader
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-tabs
        type="border-card"
        v-model="activeModel"
        @tab-click="handleTabsClik"
      >
        <el-tab-pane
          name="many"
          label="动态参数"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
            size="mini"
            @click="openAddParams()"
          >添加参数</el-button>

          <el-table
            :data="manyTableData"
            border
            show-index
            index-text="#"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template v-slot="slot">
                <el-tag
                  :key="tag"
                  v-for="(tag, index) in slot.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="closeTabs(index, slot.row)"
                >
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="slot.row.inputVisible"
                  v-model="slot.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slot.row)"
                  @blur="handleInputConfirm(slot.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(slot.row)"
                >+ 添加选项</el-button>

              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数说明"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
            size="mini"
          >添加属性</el-button>
          <el-table
            :data="onlyTableData"
            border
            show-index
            index-text="#"
            style="width: 100%"
          >
            <el-table-column type="expand">
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
            >
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数面板 -->
      <el-dialog
        title="添加动态参数"
        :visible.sync="addParamsDialog"
        width="50%"
        :before-close="handleClose"
      >
        <el-form
          ref="addParamFormRef"
          :model="addParamsForm"
          :rules="addParamsrules"
          label-width="100px"
        >
          <el-form-item
            label="动态参数"
            prop="addParamsData"
          >
            <el-input
              v-model="addParamsForm.addParamsData"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addParamsDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="postParamsData"
          >确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数/属性面板 -->
      <el-dialog
        :title="'修改' + editTile"
        :visible.sync="editParamsDialog"
        width="50%"
        :before-close="handleClose"
      >
        <el-form
          ref="editParamsFormRef"
          :model="editParamsForm"
          :rules="editParamsrules"
          label-width="100px"
        >
          <el-form-item
            :label="editTile"
            prop="editParamsData"
          >
            <el-input
              v-model="editParamsForm.editParamsData"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editParamsDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editPost"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectedKeys: [], // 商品分类
      parentCateList: [], // 商品列表
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeModel: 'many', // 默认选择的 参数(many) / 属性(only)
      manyTableData: [], // 参数数据
      onlyTableData: [], // 属性数据
      // 添加参数 / 属性
      addParamsDialog: false,
      addParamsForm: {
        addParamsData: ''
      },
      addParamsrules: {
        addParamsData: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      editParamsDialog: false,
      editTile: '',
      editParamsForm: {
        editParamsData: ''
      },
      editParamsrules: {
        editParamsData: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.parentCateList = res.data
    },
    handleChange () {
      this.getParmasData()
    },
    // 获取参数列表
    async getParmasData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      const { data: res } = await this.$http.get('categories/' + this.cateId + '/attributes', {
        params: {
          sel: this.activeModel
        }
      })

      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeModel === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handleTabsClik () {
      this.getParmasData()
    },
    // 打开添加参数面板
    openAddParams () {
      this.addParamsDialog = true
    },
    // 关闭添加参数面板
    handleClose () { },
    // 确认添加参数
    postParamsData () {
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('categories/' + this.cateId + '/attributes', {
          attr_name: this.addParamsForm.addParamsData,
          attr_sel: this.activeModel
        })
        if (res.meta.status !== 201) return this.$message.error('创建失败：' + res.meta.msg)
        this.getParmasData()
        this.addParamsForm.addParamsData = ''
        this.addParamsDialog = false
        this.$message.success(res.meta.msg)
      })
    },
    // 打开编辑面板
    async editParams (id) {
      if (this.activeModel === 'many') {
        this.editTile = '动态参数'
      } else {
        this.editTile = '静态属性'
      }
      const { data: res } = await this.$http.get('categories/' + id.cat_id + '/attributes/' + id.attr_id, {
        params: {
          attr_sel: this.activeModel
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editParamsDialog = true
      this.editParamsForm.editParamsData = res.data.attr_name
      this.editParamsForm.attr_id = id.attr_id
      this.editParamsForm.cat_id = id.cat_id
    },
    // 删除
    async delParams (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果点击了取消按钮
      if (confirmRes !== 'confirm') return this.$message.info('已取消删除')

      // 删除
      const { data: res } = await this.$http.delete('categories/' + this.cateId + '/attributes/' + id)

      // 如果状态码 !== 200
      if (res.meta.status !== 200) return this.$message.error('删除失败：' + res.mata.msg)

      // 删除成功
      this.$message.success('删除成功')
      // 重新拉取数据
      this.getParmasData()
    },
    // 提交编辑
    editPost () {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put('categories/' + this.editParamsForm.cat_id + '/attributes/' + this.editParamsForm.attr_id, {
          attr_name: this.editParamsForm.editParamsData,
          attr_sel: this.activeModel
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getParmasData()
        this.editParamsForm.editParamsData = ''
        this.editParamsDialog = false
        this.$message.success(res.meta.msg)
      })
    },
    closeTabs (index, slot) {
      slot.attr_vals.splice(index, 1)
      this.saveAttrVals(slot)
    },

    showInput (slot) {
      slot.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async saveAttrVals (slot) {
      const { data: res } = await this.$http.put('categories/' + slot.cat_id + '/attributes/' + slot.attr_id, {
        attr_name: slot.attr_name,
        attr_sel: slot.attr_sel,
        attr_vals: slot.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新成功')
    },
    // 添加对应参数
    async handleInputConfirm (slot) {
      if (slot.inputValue.trim().length === 0) {
        slot.inputVisible = false
        slot.inputValue = ''
        return
      }
      const inputValue = slot.inputValue
      if (inputValue) {
        slot.attr_vals.push(inputValue)
      }
      this.saveAttrVals(slot)
      slot.inputVisible = false
      slot.inputValue = ''
    }
  },
  computed: {
    isDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    }
  },
  mounted () {
    this.getParentCateList()
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

  .el-cascader {
    width: 300px;
    float: left;
  }

  .el-alert {
    margin-bottom: 22px;
    background: #e6a23c;
    color: #fff;
  }
  .el-button {
    margin-bottom: 22px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>