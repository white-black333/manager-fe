/* vuex 状态管理 */
import { createStore } from 'vuex';
import storage from '../utils/storage';
import mutations from './mutations';
import actions from './actions';


export default createStore({
    state: {
        userInfo: storage.getItem('userInfo') || {}, // 获取用户信息
        userMenu: storage.getItem('userMenu') || [],
        userAction: storage.getItem('userAction') || [],
        addRoutes: [],
        noticeCount: 0
    },
    mutations,
    actions
});