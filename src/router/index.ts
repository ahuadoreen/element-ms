import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BaseLayout from "~/components/layouts/BaseLayout.vue";
import useUserStore from "~/store/userStore";
import useMenuStore from "~/store/menuStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "basic",
    component: BaseLayout,
    children: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
      },
      {
        path: "/404",
        name: "404",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Exception.vue"),
      },
      {
        path: "/403",
        name: "403",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Exception.vue"),
        props: { type: "403" },
      },
      {
        path: "/user",
        name: "user",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/security/User.vue"),
      },
      {
        path: "/role",
        name: "role",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/security/Role.vue"),
      },
      {
        path: "/menu",
        name: "menu",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/security/MenuView.vue"
          ),
      },
      {
        path: "/dictionary",
        name: "dictionary",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/basic/Dictionary.vue"
          ),
      },
      {
        path: "/log",
        name: "log",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/basic/LogView.vue"),
      },
      {
        path: "/user-info",
        name: "user-info",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/security/UserInfo.vue"
          ),
      },
      {
        path: "/language",
        name: "language",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/basic/Language.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (to.matched.length == 0) return { name: "404" };
  if (to.path == "/login") return true;
  if (
    (to.hasOwnProperty("meta") && to.meta.anonymous) ||
    (!useUserStore().isTokenExpired && useUserStore().user)
  ) {
    if (to.path == "/" || to.path == "/403" || to.path == "/404") return true;
    const menus = useMenuStore().flatMenu;
    const index = menus.findIndex((m) => m.url == to.path);
    if (index < 0) {
      return { name: "403" };
    }
    return true;
  } else {
    return { path: "/login", query: { redirect: to.path } };
  }
});
export default router;
