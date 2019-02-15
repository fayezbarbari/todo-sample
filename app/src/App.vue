<template>
  <div id="app">
    <v-app>
      <!-- Top Toolbar -->
      <header-toolbar></header-toolbar>

      <!-- Content -->
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import HeaderToolbar from "@/components/HeaderToolbar";

export default {
  components: {
    HeaderToolbar
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-shadow: none !important;
}
#nav {
  padding: 20px 20px 0 20px;
  a {
    font-weight: bold;
    color: #083b66;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/* ANCHOR TAGS */
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
}

/* TEXT INPUTS */
.v-text-field > .v-input__control > .v-input__slot {
  background-color: white !important;
}
.v-text-field__details {
  margin-bottom: 4px !important;
}
.vue-tel-input {
  background-color: white !important;
  height: 55px;
  font-size: 16px;
  border: 1px solid var(--v-primary-base) !important;
  margin-bottom: 15px;
}
.theme--light.v-text-field--outline > .v-input__control > .v-input__slot {
  border: 1px solid var(--v-primary-base);
}
.theme--light.v-text-field--outline:not(.v-input--is-focused):not(.v-input--has-state)
  > .v-input__control
  > .v-input__slot:hover {
  border: 1px solid var(--v-primary-base);
}
</style>
