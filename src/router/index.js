Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "tab" */ '../views/Home.vue'),
    children: [],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '*',
    redirect: '/home',
  },
];

const router = new VueRouter({
  mode: '',
  base: process.env.BASE_URL,
  routes,
});

export default router;
