import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProxiesPage.vue'), name: 'Proxies', }],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    name: 'Setup',
    path: '/setup',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SetupPage.vue') }],
  },
  {
    name: 'Debugging',
    path: '/debugging',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DebuggingPage.vue') }],
  },
  {
    path: '/proxies/new',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProxyWizard.vue') }],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/proxies/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EditProxy.vue') }],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
