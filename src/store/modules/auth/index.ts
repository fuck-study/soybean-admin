import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { clearAuthStorage, getToken, getUserInfo } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const routeStore = useRouteStore();
  const {route, toLogin, redirectFromLogin} = useRouterPush(false);
  const {loading: loginLoading, startLoading, endLoading} = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive(getUserInfo());

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.value.meta.constant) {
      await toLogin();
    }

    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   */
  async function login(userName: string, password: string) {
    startLoading();

    const {data: loginToken, error} = await fetchLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        await routeStore.initAuthRoute();

        await redirectFromLogin();

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', {userName: userInfo.username}),
            duration: 4500
          });
        }
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.UserInfo) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.username);
    // localStg.set('role', loginToken.refreshToken);

    const {data: info, error} = await fetchGetUserInfo();

    if (!error) {
      info.roles = ['R_ADMIN']
      Object.assign(userInfo, info);
      localStg.set('userInfo', userInfo);
      return true;
    }
    return false;
  }

  return {
    token,
    userInfo,
    isLogin,
    loginLoading,
    resetStore,
    login
  };
});
