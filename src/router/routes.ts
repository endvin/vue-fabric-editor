import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/home/index.vue';
import Template from '@/views/template/index.vue';

// 在开发环境使用静态组件，生产环境使用懒加载以优化首屏体积
const HomeComp = import.meta.env.DEV ? Home : () => import('@/views/home/index.vue');
const TemplateComp = import.meta.env.DEV ? Template : () => import('@/views/template/index.vue');

import { setToken, autoLogin, logout } from '@/api/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    beforeEnter: async (to) => {
      // 自动登录功能
      if (to.query.username && to.query.key) {
        const res = await autoLogin({
          username: to.query.username,
          projectid: to.query.projectid,
          key: to.query.key,
        });
        if (res.data.jwt) {
          setToken(res.data.jwt);
        } else {
          logout();
          alert('签名失败');
          window.location.href = '/';
        }
      }
      return true;
    },
    component: HomeComp,
  },
  {
    path: '/template',
    component: TemplateComp,
  },
];

export default routes;
