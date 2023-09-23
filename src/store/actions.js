import router from './../router';
import api from '@/api';
import util from '../utils/util';
import storage from '../utils/storage';
export default {
    async loadAsyncRoutes({ commit }) {
        const userInfo = storage.getItem('userInfo') || {};
        if (userInfo.token) {
            //不直接从Local storage中取menu，防止数据人为篡改
            const { treeList } = await api.getPermissionList();
            // console.log(treeList);
            const routes = util.generateRoutes(treeList);
            routes.map((item) => {
                let url = `./../views/${item.component}.vue`;
                // console.log(url);
                item.component = () => import(url);
                router.addRoute('home', item);//作为home组件的children
            });
            commit('SET_ROUTERS');
        };
    }
};

