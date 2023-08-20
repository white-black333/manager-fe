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
  <div>
    <h3>欢迎来到登录界面</h3>
    <el-button @click="goHome">回首页</el-button>
  </div>
</template>

<style ></style>
