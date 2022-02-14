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
        row-key="rolesid"
      >
        <el-table-column type="expand">
          <template v-slot="slot">
            <el-row
              v-for="(item, index1) in slot.row.children"
              :key="index1"
              :class="['border_bottom', 'border_left', 'vcenter', index1 == 0 ? 'border_top' : '']"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeTag(slot.row, item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="index2"
                  :class="['vcenter', 'border_left', 'border_right', index2 !== 0 ? 'border_top' : '']"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTag(slot.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col
                    :span="18"
                    style="text-align: left"
                  >
                    <el-tag
                      type="info"
                      closable
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      @close="removeTag(slot.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
        >
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
                @click="openSetRight(operation.row)"
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

      <!-- 修改角色权限面板 -->
      <el-dialog
        title="修改权限"
        :visible.sync="setRightDialog"
        width="50%"
        @close="closeSetRight"
      >
        <el-tree
          :data="rightsList"
          show-checkbox
          :props="treeProps"
          node-key="id"
          default-expand-all
          :check-on-click-node="true"
          :default-checked-keys="defaultKey"
          ref="treeRef"
        >
        </el-tree>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeSetRight">取 消</el-button>
          <el-button
            type="primary"
            @click="setRightBtn"
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
      rolesList: [], // 所有角色列表
      rolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      rightsList: [], // 所有权限列表
      treeProps: {
        label: 'authName',
        children: 'children'
      }, // 默认
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
      },
      // 修改权限
      setRightDialog: false,
      // 默认选中
      defaultKey: [],
      // role.id
      roleId: '',
      barr: []
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.rolesList = this.deepFn(res.data)
      // this.rolesList = res.data
    },
    deepFn (obj) {
      let objClong = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (var prop in obj) {
          if (obj[prop] && typeof obj[prop] === 'object') {
            objClong[prop] = this.deepFn(obj[prop])
          } else {
            objClong.rolesid = Math.random() + obj.id
            objClong[prop] = obj[prop]
          }
        }
      }
      return objClong
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
    async openSetRight (roles) {
      // 获取所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败：' + res.meta.msg)
      }
      this.rightsList = res.data
      // 递归三级节点
      this.getdkey(roles, this.defaultKey)
      this.setRightDialog = true
      this.roleId = roles.id
    },
    // 获取权限
    getdkey (node, arr) {
      // 查看node是否是第三级
      if (!node.children) {
        // 是第三级，直接赋值
        return arr.push(node.id)
      }
      // 不是，就继续递归
      node.children.forEach(item => this.getdkey(item, arr))
    },
    // 提交权限设置
    async setRightBtn () {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', {
        rids: idStr
      })
      if (res.meta.status !== 200) return this.$message.error('操作失败：' + res.meta.msg)
      this.$message.success('操作成功！')
      this.getRolesList()
      this.setRightDialog = false
    },
    // 取消权限设置
    closeSetRight () {
      this.defaultKey = []
      this.setRightDialog = false
    },
    // 删除权限
    async removeTag (roles, rid) {
      const confirmRes = await this.$confirm(
        '请确认取消该用户的此权限',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmRes !== 'confirm') {
        return this.$message.info('您取消了操作！')
      }
      const { data: res } = await this.$http.delete('roles/' + roles.id + '/rights/' + rid)
      if (res.meta.status !== 200) return this.$message.error('操作失败：' + res.meta.msg)
      this.$message.success('操作成功！')
      // 将最新的权限，赋值给该角色
      roles.children = res.data
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

  .el-tag {
    margin: 7px 7px 7px 0;
  }

  .border_top {
    border-top: 1px solid #eee;
  }

  .border_bottom {
    border-bottom: 1px solid #eee;
  }
  .border_left {
    border-left: 1px solid #eee;
  }

  .border_right {
    border-right: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
    text-align: center;
  }
}
</style>