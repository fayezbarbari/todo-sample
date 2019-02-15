import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);
const vuexLocalStorage = new VuexPersist({
  key: "todo-sample",
  storage: localStorage
});

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],

  state: {
    signedIn: false,
    userid: null,
    dueTasks: []
  },

  getters: {
    signedIn(state) {
      return state.signedIn;
    },
    userid(state) {
      return state.userid;
    },

    dueTasks(state) {
      return state.dueTasks;
    }
  },

  mutations: {
    SET_SIGNEDIN(state, signedIn) {
      state.signedIn = signedIn;
    },
    SET_USERID(state, userid) {
      state.userid = userid;
    },

    SET_DUE_TASKS(state, dueTasks) {
      state.dueTasks = dueTasks;
    }
  },

  actions: {
    signout({ commit }) {
      commit("SET_SIGNEDIN", false);
      commit("SET_USERID", null);
    },
    signin({ commit }, userid) {
      commit("SET_SIGNEDIN", true);
      commit("SET_USERID", userid);
    },

    setDueTasks({ commit }, dueTasks) {
      commit("SET_DUE_TASKS", dueTasks);
    }
  }
});
