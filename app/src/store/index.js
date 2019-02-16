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
    dueTasks: [],
    doneTasks: [],
    inProgressTasks: [],
    draftTasks: []
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
    },
    doneTasks(state) {
      return state.doneTasks;
    },
    inProgressTasks(state) {
      return state.inProgressTasks;
    },
    draftTasks(state) {
      return state.draftTasks;
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
    },
    SET_DONE_TASKS(state, tasks) {
      state.doneTasks = tasks;
    },
    SET_IN_PROGRESS_TASKS(state, tasks) {
      state.inProgressTasks = tasks;
    },
    SET_DRAFT_TASKS(state, tasks) {
      state.draftTasks = tasks;
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
    },
    setDoneTasks({ commit }, tasks) {
      commit("SET_DONE_TASKS", tasks);
    },
    setInProgressTasks({ commit }, tasks) {
      commit("SET_IN_PROGRESS_TASKS", tasks);
    },
    setDraftTasks({ commit }, tasks) {
      commit("SET_DRAFT_TASKS", tasks);
    }
  }
});
