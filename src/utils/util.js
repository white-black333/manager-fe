/* 工具函数封装 */


// 日期格式化函数封装
export default {
    dataFormater(date, fmt) {
        fmt = fmt || "yyyy-MM-dd hh:mm:ss"; //没有规则默认日期格式
        date = new Date(date);
        if (/(y+)/.test(fmt)) {
            const t = (/(y+)/.exec(fmt)[1]);
            fmt = fmt.replace(t, date.getFullYear());
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        };
        for (let k in o) {
            const reg = new RegExp(`(${k})`);
            if (reg.test(fmt)) {
                const t = reg.exec(fmt)[1];
                // console.log(t.length);
                // console.log(o[k]);
                // fmt = fmt.replace(t, o[k]);
                fmt = fmt.replace(t, t.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    },
    generateRoutes(list) {
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
};
// obj.dataFormater("2024-01-17T13:32:06.381Z");