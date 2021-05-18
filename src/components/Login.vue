<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img
          src="../assets/logo.png"
          alt="login"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {}
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
      width: 150px;
      height: 150px;
    }
  }
}
</style>