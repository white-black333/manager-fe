import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import store from './../store';
// 配置路由规则数组routes
const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'Welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('../views/Welcome.vue'),

            },

        ]

    },
    {
        name: 'Login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import('../views/Login.vue'),


    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '页面不存在'
        },
        component: () => import('../views/404.vue'),

    }
];

// 创建路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 导航守卫
router.beforeEach(async (to, from, next) => {
    if (router.hasRoute(to.name)) {
        document.title = to.meta.title;// 标签页标题更改
        next();
    } else {
        if (store.state.addRoutes.length == 0) {
            await store.dispatch('loadAsyncRoutes');
            next({ ...to, replace: true });
        } else {

            next('/404');
        }
    }
});

export default router;