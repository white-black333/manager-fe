<script>
import { useRouter } from 'vue-router';
import Welcome from './Welcome.vue';
import { ref } from 'vue';
export default {
  name: 'Login',
  components: {Welcome},
  setup() {
    /* 因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。*/
    const router = useRouter();//通过useRouter()函数访问router路由对象
    const goHome = () => {
      router.push('/welcome')
      // this.$router.push('/welcome') // vue2中用法
    };
    const msg = ref('!!!');

    return {
      goHome,
      msg
    }
  }
}
</script>

<template>
  <div>
    <h3>欢迎来到登录界面</h3>
    <el-button @click="goHome">回首页</el-button>
    <Welcome :message="msg" />
  </div>
</template>

<style ></style>
