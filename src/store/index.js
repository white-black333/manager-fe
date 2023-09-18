/* vuex 状态管理 */
import { createStore } from 'vuex';
import storage from '../utils/storage';
import mutations from './mutations';


export default createStore({
    state: {
        userInfo: storage.getItem('userInfo') || {}, // 获取用户信息


    },
    mutations
});