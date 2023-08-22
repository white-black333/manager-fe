<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: { required: true, message: '请输入用户名', trigger: 'blur' },
        userPwd: { required: true, message: '请输入密码', trigger: 'blur' }
      }
    };
  },
  methods: {
    login() {
      // validate()	对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then((res) => {
            this.$store.commit('saveUserInfo', res);
            this.$router.push('/welcome');
          });
        } else {
          return false;
        }
      });

    }
  },

};
</script>

<template>
  <div class="login-wrapper">
    <div class="modal">
      <div class="title">火星</div>
      <el-form ref="userForm" :model="user" :rules="rules" status-icon>
        <el-form-item prop="userName">
          <el-input ref="userName" type="text" v-model="user.userName" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input show-password type="password" v-model="user.userPwd" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="login">登录</el-button><!-- type指定按钮的el样式  -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    /* box-shadow:: x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
    box-shadow: 0 0 10px 3px #c7c9cb4d;

    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
