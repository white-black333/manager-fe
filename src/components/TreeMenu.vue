<script >
export default {
    name: 'TreeMenu',
    props: ['userMenu'],
};
</script>

<template>
    <div>
        <!-- 在template标签上使用v-for，:key="index"不能写在template标签上，因为其标签不会被渲染，会引起循环错误 -->
        <template v-for="menu in userMenu">
            <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :key="menu.id"
                :index="menu.path">
                <template #title>
                    <el-icon v-if="menu.icon">
                        <component :is="menu.icon"></component>
                    </el-icon>
                    <span>{{ menu.menuName }}</span>
                </template>
                <TreeMenu :userMenu="menu.children" />
            </el-sub-menu>
            <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">
                {{ menu.menuName }}
            </el-menu-item>
        </template>
    </div>
</template>

<style lang="scss"></style>
