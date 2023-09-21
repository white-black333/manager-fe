<template>
    <div class="notExist">
        <img src="@/assets/images/404.jpeg" alt="">
        <el-button class="btn-home" @click="goHome">回首页</el-button>
    </div>
</template>
<script>
export default {
    name: '404',
    methods: {
        goHome() {
            this.$router.push('/');
        }
    }
};
</script>
<style lang="scss">
.notExist {
    position: relative;

    img {
        width: 100%;
        height: 100vh;

    }

    .btn-home {
        position: fixed;
        left: 50%;
        bottom: 100px;
        margin-left: -37px;
    }
}
</style>