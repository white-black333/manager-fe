<script >
export default {
  name: 'Home'
};
</script>

<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="userInfo">用户</div>
      </div>
      <div class="wrapper">
        <router-view class="main-page"></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.basic-layout {
  position: relative; //给父元素设置相对定位

  .nav-side {
    position: fixed; //子元素设置绝对定位/固定定位    一般会给父元素设置相对定位
    width: 200px;
    height: 100vh; //vh: 相对于视窗的高度, 视窗被均分为100单位的vh; 
    background-color: #001529;
    color: #fff;
    overflow-y: auto; // 如果内容溢出，则浏览器提供纵向滚动条。
    transition: width .5s; // 左侧菜单栏宽度变化时的过渡效果
  }

  .content-right {
    margin-left: 200px; //左侧菜单栏脱离文档流。右侧元素设置margin-left

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
    }

    .wrapper {
      padding: 20px;
      background-color: #eef0f3;

      .main-page {
        background-color: #fff;
        height: calc(100vh - 90px); //怪异盒模型 height已经包含了自身的padding，boder
      }
    }
  }
}
</style>
