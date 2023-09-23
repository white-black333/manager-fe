/* mutations业务层数据提交 */

import storage from "../utils/storage";
import router from './../router';

export default {
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo);
    },
    saveUserMenu(state, userMenu) {
        state.userMenu = userMenu;
        storage.setItem('userMenu', userMenu);
    },
    saveUserAction(state, userAction) {
        state.userAction = userAction;
        storage.setItem('userAction', userAction);
    },
    SET_ROUTERS(state) {
        state.addRoutes = router.getRoutes();
    }
};