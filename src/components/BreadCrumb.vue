<script >
export default {
    name: 'BreadCrumb',

    computed: {
        routeList() {
            return this.$route.matched;
        }
    }
};
</script>

<template>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="route in routeList" :key="route.path">
            <router-link :to="route.path">
                {{ route.meta.title }}
            </router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style lang="scss"></style>
