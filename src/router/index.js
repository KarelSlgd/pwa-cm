import Vue from "vue";
import VueRouter from "vue-router";
import adminRouter from "./modules/AdminRouter";
import clientRouter from "./modules/ClientRouter";
import utils from "../core/utils/FunctionGlobals";
import AdminLogin from "@/views/AdminLogin/AdminLogin.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/inicio",
    component: {
      render(c) {
        return c("router-view");
      },
    },
    children: [
      ...adminRouter.map((route) => {
        route.meta.requireAuth = true;
        return { ...route };
      }),
      ...clientRouter.map((route) => {
        route.meta.requireAuth = false;
        return { ...route };
      }),
    ],
  },
  {
    path: "/admin225ij5a2o1uzptgeo9g",
    name: "login",
    component: AdminLogin,
    meta: {
      title: "Iniciar sesión",
    },
  },
  {
    path: "/unautorized",
    name: "unautorized",
    component: () => import("../views/UnAuthorized/UnAuthorized.vue"),
  },
  {
    path: "/*",
    name: "404",
    component: () => import("../views/ErrorPage/ErrorPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const token = utils.getToken();

  if (!token) {
    if (to.meta && to.meta.requireAuth) {
      return next("/unautorized");
    }
    return next();
  }
  const role = utils.getRole();
  console.log(role);
  if (to.meta && to.meta.role && to.meta.role.toLowerCase() !== role.toLowerCase()) {
    return next("/unautorized");
  }

  if (
    token &&
    to.path.toLowerCase() === "/admin225ij5a2o1uzptgeo9g" &&
    from.path !== "/admin"
  ) {
    if (role.toLowerCase() === "admin") {
      return next("/admin");
    }
  }

  next();

  const matchedRoute = to.matched.slice().reverse().find((r) => r.meta && r.meta.title);
  if (matchedRoute) {
    document.title = matchedRoute.meta.title;
  }
});
export default router;