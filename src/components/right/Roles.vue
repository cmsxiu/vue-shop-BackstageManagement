<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理 </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button
        type="primary"
        size="mini"
        class="add_roles"
        @click="addRolesDialog = true"
      >添加角色</el-button>
      <!-- 表格 -->
      <el-table
        :data="rolesList"
        stripe
        border
        :row-style="{lineHeight: '80px'}"
      >
        <el-table-column type="expand">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="operation">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改用户"
              placement="top"
            >
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="openEditRoles(operation.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delRoles(operation.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="修改权限"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="openSetUserRole(operation.row.id)"
              ></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色操作面板 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeAddRolesDialog"
      >
        <el-form
          ref="addRolesRef"
          :model="rolesInfo"
          :rules="addRolesRules"
          label-width="100px"
          class="addRoles_form"
          status-icon
        >
          <el-form-item
            label="角色名"
            prop="roleName"
          >
            <el-input
              type="text"
              v-model="rolesInfo.roleName"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input
              type="text"
              v-model="rolesInfo.roleDesc"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addRolesDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addRolesBtn"
          >确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改角色操作面板 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editRolesDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeEditRolesDialog"
      >
        <el-form
          ref="editRolesRef"
          :model="rolesInfo"
          :rules="editRolesRules"
          label-width="100px"
          class="editRoles_form"
          status-icon
        >
          <el-form-item
            label="角色名"
            prop="roleName"
          >
            <el-input
              type="text"
              v-model="rolesInfo.roleName"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input
              type="text"
              v-model="rolesInfo.roleDesc"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editRolesDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editRolesBtn"
          >确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [], // 所有角色列表
      rolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色
      addRolesDialog: false,
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 16, message: '色描述长度在 2 到 16 个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 修改角色
      editRolesDialog: false,
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 16, message: '色描述长度在 2 到 16 个字符', trigger: ['blur', 'change'] }
        ]
      }
      // 修改权限
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.rolesList = res.data
      console.log(res.data)
    },
    addRolesBtn () {
      // 添加新角色
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) {
          return false
        } else {
          const { data: res } = await this.$http.post('roles', this.rolesInfo)
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败: ' + res.meta.msg)
          }
          this.$message.success('添加成功')
          // 添加成功后，关闭面板
          this.addRolesDialog = false
          // 重新拉取权限列表
          this.getRolesList()
        }
      })
    },
    closeAddRolesDialog () {
      // 重置下
      this.$refs.addRolesRef.resetFields()
      this.addRolesDialog = false
    },
    // 修改角色
    async openEditRoles (uid) {
      // 打开面板
      const { data: res } = await this.$http.get('roles/' + uid)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败：' + res.meta.msg)
      }
      this.rolesInfo = res.data
      this.editRolesDialog = true
    },
    closeEditRolesDialog () {
      // 重置下
      this.$refs.editRolesRef.resetFields()
      this.editRolesDialog = false
    },
    editRolesBtn () {
      // 修改提交
      this.$refs.editRolesRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put('roles/' + this.rolesInfo.roleId, {
          roleName: this.rolesInfo.roleName,
          roleDesc: this.rolesInfo.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败：' + res.meta.msg)
        }
        this.$message.success('更新角色成功！')
        this.editRolesDialog = false
        this.getRolesList()
      })
    },
    // 删除角色
    async delRoles (uid) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 点击了取消按钮

      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      // 删除
      const { data: res } = await this.$http.delete('roles/' + uid)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败：' + res.meta.msg)
      }

      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 修改权限
    openSetUserRole () {

    }
  },
  mounted () {
    this.getRolesList()
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