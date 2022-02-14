<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索与添加 -->
        <div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input
                placeholder="请输入内容"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList"
              >
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </el-col>

            <el-col :span="3">
              <el-button type="primary" @click="openAddUserDialog">添加成员</el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 表格 -->
        <el-table :data="usersList" stripe border :row-style="{ lineHeight: '80px' }">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="role_name" label="权限"></el-table-column>
          <el-table-column label="状态">
            <!-- 使用组件插槽 -->
            <template v-slot="state">
              <el-switch
                v-model="state.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChanged(state.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="operation">
              <el-tooltip class="item" effect="dark" content="修改用户" placement="top">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  @click="openEditUser(operation.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  @click="delUser(operation.row.id)"
                ></el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="修改权限" placement="top">
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  circle
                  size="mini"
                  @click="openSetUserRole(operation.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户操作面板 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeAddUserDialog"
      >
        <el-form
          ref="addUserRef"
          :model="addUser"
          :rules="addUserRules"
          label-width="100px"
          class="addUser_form"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="addUser.username"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="addUser.password"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="addUser.email"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input
              type="text"
              v-model="addUser.mobile"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="addFormUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑用户操作面板 -->
      <el-dialog title="编辑用户" :visible.sync="editUserDialog" width="50%">
        <el-form
          ref="editUserRef"
          :model="editUser"
          :rules="editUserRules"
          label-width="100px"
          class="editUser_form"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="editUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="editUser.email"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input
              type="text"
              v-model="editUser.mobile"
              autocomplete="off"
              :hide-required-asterisk="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="editFormUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 用户权限操作面板 -->
      <el-dialog
        title="修改权限"
        :visible.sync="setUserRoleDialog"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div class="modifyPermissions">
          <p>当前用户：{{ userInfo.username }}</p>
          <p>当前权限：{{ userInfo.role_name }}</p>
          <p>
            修改权限：
            <el-select
              v-model="selectedRoleId"
              :placeholder="userInfo.role_name || '请选择'"
              size="mini"
            >
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="setUserRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="setUserRoleForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的手机号'))
      }
    }
    return {
      usersList: [],
      getUser: '',
      total: 0,
      addUserDialog: false,
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        // 验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 25, message: '密码长度在 6 到 25 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: ['blur', 'change'] }
        ]
      },
      // 编辑用户
      editUserDialog: false,
      editUser: {
        username: '',
        email: '',
        mobile: ''
      },
      editUserRules: {
        // 验证规则
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: ['blur', 'change'] }
        ]
      },
      // 用户权限
      setUserRoleDialog: false,
      setUserRole: {
        username: '',
        email: '',
        mobile: ''
      },
      setUserRoleRules: {
        // 验证规则
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: ['blur', 'change'] }
        ]
      },
      // 获取列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10 // 当前每页显示多少数据
      },
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      // 监听最新的 pageSize 的改变
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // 监听 页码值 的改变
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 状态
    async userStateChanged (userInfo) {
      const { data: res } = await this.$http.put('users/' + userInfo.id + '/state/' + userInfo.mg_state + '')
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败：Error ' + res.meta.msg)
      }
      this.$message.success('更新状态成功')
    },
    openAddUserDialog () {
      // 打开添加用户面板
      this.addUserDialog = true
    },
    addFormUser () {
      // 添加用户
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) {
          return false
        } else {
          const { data: res } = await this.$http.post('users', this.addUser)

          if (res.meta.status !== 201) {
            return this.$message.error('添加失败: ' + res.meta.msg)
          }
          this.$message.success('添加成功')
          // 添加成功后，关闭面板
          this.addUserDialog = false
          // 重新拉取用户列表
          this.getUserList()
        }
      })
    },
    closeAddUserDialog () {
      // 监听 关闭 添加面板
      this.$refs.addUserRef.resetFields()
    },
    async openEditUser (uid) {
      // 编辑 user
      const { data: res } = await this.$http.get('users/' + uid)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户失败')
      }
      this.editUser = res.data
      this.editUserDialog = true
    },
    editFormUser () {
      this.$refs.editUserRef.validate(async vaild => {
        if (!vaild) {
          return false
        }

        const { data: res } = await this.$http.put('users/' + this.editUser.id, {
          email: this.editUser.email,
          mobile: this.editUser.mobile
        })

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.editUserDialog = false
        this.$message.success('更新用户信息成功')
        this.getUserList()
      })
    },
    async delUser (uid) {
      // 删除 user
      const confirmRes = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      // 如果点击了取消按钮
      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      // 删除
      const { data: res } = await this.$http.delete('users/' + uid)
      // 如果状态吗！== 200
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      // 删除成功
      this.$message.success('删除用户成功！')
      // 重新拉用户列表
      this.getUserList()
    },

    delUserHandleClose () {
      // 删除user取消
      this.delUserDialog = false
    },
    async openSetUserRole (userInfo) {
      // 打开设置权限面板
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户权限失败！')
      }
      // 权限列表
      this.rolesList = res.data
      this.setUserRoleDialog = true
    },
    async setUserRoleForm () {
      // 设置权限
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(
        'users/' + this.userInfo.id + '/role',
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setUserRoleDialog = false
    },
    setRoleDialogClosed () {
      // 监听用户权限对话框的关闭事件
      this.selectedRoleId = ''
      this.userInfo = {}
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

  .el-pagination {
    margin-top: 15px;
    text-align: right;
  }
  .modifyPermissions {
    text-align: left;
  }
}
</style>