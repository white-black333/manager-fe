<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name: 'Login',
  methods: {
    goHome() {
      this.$router.push('/welcome');
    },
  },
  mounted() {
    // request调用 写法一：
    /* request({
  method: 'get',
  url: '/login',
  data: {
    name:'jack'
  }
}).then((res) => {
  console.log(res);
}) */

    // 写法二:  options作为技术的扩展
    this.$request.get('/login', { name: "jack" }, { mock: true, loading: true }).then((res) => {
      console.log(res);
    });
  }


  // vue3 路由跳转写法
  /*   setup() {
      // 因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。
      const router = useRouter();//通过useRouter()函数访问router路由对象
      const goHome = () => {
        router.push('/welcome')
      };
      return {
        goHome,
      }
    }, */
};
</script>

<template>
  <div class="login-wrapper">
    <div class="modal">
      <div class="title">火星</div>
      <el-form>
        <el-form-item>
          <el-input type="text" value="admin" prefix-icon="User" suffix-icon="CircleCheck" />
        </el-form-item>
        <el-form-item>
          <el-input show-password type="password" value="111111" prefix-icon="View" suffix-icon="CircleCheck" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary">登录</el-button><!-- type指定按钮的el样式  -->
        </el-form-item>
      </el-form>
    </div>
    <!-- <h3>欢迎来到登录界面</h3>
    <el-button @click="goHome">回首页</el-button> -->
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
