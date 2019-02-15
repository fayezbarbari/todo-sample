<template>
  <v-toolbar class="toolbar">
    <!-- LEFT SIDE -->
    <router-link to="/">
      <v-avatar size="48">
        <img class="avatar" src="../assets/logo.png" alt="" />
      </v-avatar>
    </router-link>
    <router-link to="/">
      <v-toolbar-title class="title">ToDo Sample</v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>

    <div>
      <v-toolbar-items>
        <!-- TASKS -->
        <v-btn v-if="signedIn" flat @click="routeTo('/tasks')">Tasks</v-btn>

        <!-- LOGIN -->
        <v-btn v-if="!signedIn" flat @click="routeTo('/signin')">Sign in</v-btn>

        <!-- SIGN OUT -->
        <v-btn v-if="signedIn" flat @click="userSignout"
          >Sign out ({{ userid }})</v-btn
        >
      </v-toolbar-items>
    </div>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      signedIn: "signedIn",
      userid: "userid"
    })
  },
  methods: {
    ...mapActions({
      signout: "signout"
    }),
    routeTo(path) {
      this.$router.push(path);
    },
    userSignout() {
      this.signout();
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.title {
  margin-top: 10px;
  margin-left: 10px !important;
  line-height: normal !important;
}
.title img {
  width: 150px;
}
.v-btn--active:before,
.v-btn:focus:before,
.v-btn:hover:before {
  background-color: transparent;
}

@media only screen and (max-width: 600px) {
  .toolbar-avatar {
    margin-left: 0;
  }
  .toolbar-avatar img {
    width: 40px;
    height: 40px;
  }
}
</style>
