<template>
  <div>
    <el-button
      type="info"
      @click="logout"
    >退出</el-button>
  </div>
</template>
<script>
export default {
  data () { return {} },
  methods: {
    logout () {
      // window.sessionStorage.removeItem('token') 删除某一项
      window.sessionStorage.clear() // 清空全部
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped>
</style>