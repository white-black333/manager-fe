import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import storage from '../utils/storage';
import api from '@/api';
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
router.beforeEach((to, from, next) => {
    if (hasPermission(to.path)) { //to.path 要访问的路由组件路径path
        document.title = to.meta.title;// 标签页标题更改
        next();
    } else {
        next('/404');
    }
});

await loadAsyncRoutes();

// 获取路由组件列表并查询是否存在
function hasPermission(path) {//router.getRoutes() 返回所有路由组件数组
    const arr = router.getRoutes().filter((item) => item.path == path);
    if (arr.length > 0) { return true; }
    else { return false; }
}

async function loadAsyncRoutes() {
    const userInfo = storage.getItem('userInfo') || {};
    if (userInfo.token) {
        //不直接从Local storage中取menu，防止数据人为篡改
        const { treeList } = await api.getPermissionList();
        const routes = getRouteMap(treeList);
        routes.map((route) => {
            let url = `./../views/${route.component}.vue`;
            console.log(url);
            route.component = () => import(url);
            router.addRoute('home', route);//作为home组件的children
        });

    };
}

function getRouteMap(list) {
    const routes = [];
    const deep = (list) => {
        while (list.length) {
            const item = list.pop();
            if (item.children && item.operate) {//筛选 有按钮的二级菜单
                routes.push({
                    name: item.component,
                    path: item.path,
                    meta: {
                        title: item.menuName
                    },
                    component: item.component
                    // component: () => import('../views/Login.vue'),//异步懒加载不在业务逻辑中实现
                });
            } else if (item.children && !item.operate) {//筛选 有二级菜单的一级菜单
                deep(item.children);
            }
        }
    };
    deep(JSON.parse(JSON.stringify(list)));
    // console.log('routes=>', routes);
    return routes;
}
export default router;