import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Signin from "./views/Signin.vue";
import Tasks from "./views/Tasks.vue";

import store from "@/store/index";

Vue.use(Router);

const authRoute = (to, from, next) => {
  if (store.getters["signedIn"]) {
    next();
  } else {
    next("/login");
  }
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/signin",
      name: "signin",
      component: Signin
    },
    {
      path: "/tasks",
      name: "tasks",
      component: Tasks,
      beforeEnter: authRoute
    },
    // {
    //   path: "/task/:id",
    //   name: "createGame",
    //   component: () => import("./views/game/CreateGame.vue"),
    //   beforeEnter: authAdminRoute
    // },
    // {
    //   path: "/edit-game/:code",
    //   name: "editGame",
    //   component: () => import("./views/game/EditGame.vue"),
    //   beforeEnter: authAdminRoute
    // },
    // {
    //   path: "/game/:code",
    //   name: "gameDetails",
    //   component: () => import("./views/game/GameDetails.vue"),
    //   beforeEnter: authRoute
    // },
    {
      path: "*",
      name: "default",
      component: Home
    }
  ]
});
