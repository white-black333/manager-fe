<script >
import TreeMenu from './TreeMenu.vue';
import BreadCrumb from './BreadCrumb.vue';
export default {
  name: 'Home',
  components: { TreeMenu, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      noticeCount: false,
      userMenu: [],
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    activeMenu() {
      return location.hash.slice(1);
    }
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    handleLogout(key) {
      if (key == 'email') return;
      this.$store.commit('saveUserInfo', '');
      this.$router.push('/login');
      this.$storage.removeItem('userInfo');

    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },

    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        this.noticeCount = !!count;
      }
      catch (error) { console.error(error); }
    },
    async getMenuList() {
      try {
        // 根据用户角色拉取对应的权限菜单
        const { treeList, operateMap } = await this.$api.getPermissionList();
        this.$store.commit('saveUserMenu', treeList);
        this.$store.commit('saveUserAction', operateMap);
        this.userMenu = treeList;
      }
      catch (error) { console.error(error); }
    },
  }


};
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="menu-logo">
        <img src="../assets/logo.png" alt="menu-logo">
        <span>Manager</span>
      </div>
      <el-menu :default-active="activeMenu" class="menu-content" background-color="#001529" text-color="#fff" router
        :collapse="isCollapse">
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <el-icon class="icon-fold" @click="toggle">
            <Fold />
          </el-icon>
          <BreadCrumb />
        </div>
        <div class="userInfo">
          <el-badge class="notice" :is-dot="noticeCount">
            <el-icon class="notice-icon">
              <Bell />
            </el-icon>
          </el-badge>
          <!-- command是自定义事件 -->
          <el-dropdown @command="handleLogout" class="dropdown">
            <span class="dropdown-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="quit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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

    .menu-logo {
      display: flex;
      align-items: center;
      height: 50px;

      img {
        width: 32px;
        margin: 16px;
      }

    }

    .menu-content {
      border-right: none;
      height: calc(100vh - 50px);

    }

    // &指 .nav-side
    &.fold {
      width: 64px;
    }

    &.unfold {
      width: 200px;
    }
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

      .nav-left {
        display: flex;
        align-items: center;

        .icon-fold {
          margin-right: 10px;
        }
      }

      .userInfo {

        .notice {
          /* height设置元素自身的高度，line-height设置子元素的高度 */
          line-height: 30px; //line-height指定匿名行内框的最小高度
          margin-right: 15px;
          ;
        }

        .dropdown {
          height: 49px;
          line-height: 49px;

          .dropdown-link {
            // line-height: 4;
            color: #409eff;
            cursor: pointer;

            // &连体符 表示元素本身
            &:hover,
            &:active,
            &:focus {
              outline: none;
            }
          }

        }

      }

    }

    .wrapper {
      padding: 20px;
      background-color: #eef0f3;

      .main-page {
        height: calc(100vh - 90px); //怪异盒模型 height已经包含了自身的padding，boder
      }
    }

    &.fold {
      margin-left: 64px;

    }

    &.unfold {
      margin-left: 200x;
    }
  }
}
</style>
