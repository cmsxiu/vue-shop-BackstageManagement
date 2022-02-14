<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img
          src="../assets/logo.png"
          alt="login"
        >
      </div>

      <!-- login表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-yonghu"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_btn">
          <!-- 登录 -->
          <el-button
            type="primary"
            size="small"
            @click="loginBtn"
          >登录</el-button>
          <!-- 重置 -->
          <el-button
            size="small"
            @click="resetBtn"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import '../assets/css/login.css'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单预验证
    loginBtn () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        await this.$http.post('login', this.loginForm)
          .then(res => {
            if (res.status !== 200) {
              return this.$message.error('登录失败')
            }
            // 配置 token
            window.sessionStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
            // 成功提示
            this.$message({
              type: 'success',
              duration: 1000,
              message: res.data.meta.msg
            })
          })
        // .catch(err => {
        //   this.$message.error('发生了错误：' + err)
        // })
        /*
        const {data: res} = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        } else {
          // 配置 token
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
          // 成功提示
          this.$message({
            type: 'success',
            duration: 1000,
            message: res.meta.msg
          })
        } */
        /*
          // promise 方法接受
          result
            .then(res => {
              if (res.status === 200) {
                this.$message.info(res.data.meta.msg)
              }
            })
            .catch(err => this.$message.error(err))
        */
      })
      // validate(callback,)
    },
    // 表单重置
    resetBtn () {
      // 清除input数据
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  height: 100%;
  background: #2b4b6b;
  color: #fff;
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    box-shadow: 8px 8px 1px rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      position: absolute;
      top: 0%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        border: 3px solid #ccc;
        border-radius: 50%;
        box-sizing: border-box;
      }
    }

    .login_form {
      position: absolute;
      top: 80px;
      left: 50%;
      width: 80%;
      transform: translate(-50%, 0);

      .login_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>