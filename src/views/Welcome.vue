<script >
export default {
  name: 'Welcome',
};
</script>

<template>
  <div class="welcome-wrapper">
    <div class="content-wrapper">
      <div class="slogan">欢迎体验</div>
      <div class="title">慕课通用后台管理系统</div>
      <div class="sub-title">- Vue3+ElementPlus+Koa2+Mongo打造通用后台管理系统</div>
    </div>
    <div class="img-wrapper">
      <img src="../assets/images/welcome.png" alt="欢迎页">
    </div>
  </div>
</template>

<style lang="scss">
// content-wrapper和img-wrapper都是水平和垂直方向均居中 => flex 布局
.welcome-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;


  .content-wrapper {
    position: relative;
    bottom: 60px;

    .slogan {
      font-size: 30px;
      line-height: 42px;
      font-weight: bold;
    }

    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }

    .sub-title {
      font-size: 14px;
      line-height: 26px;
      color: rgb(145, 138, 138);
      text-align: right;
    }
  }

  .img-wrapper {
    margin-left: 105px;
  }
}
</style>



