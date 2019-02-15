<template>
  <div>
    <v-container grid-list-xs text-xs-center>
      <v-layout row wrap>
        <!-- Title -->
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <div class="text-xs-left title">
            <h4>Signin</h4>
          </div>
        </v-flex>

        <!-- Userid -->
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-text-field
            outline
            ref="userid"
            label="User ID"
            v-model="userid"
            @keyup.enter="userSignin"
          ></v-text-field>
        </v-flex>

        <!-- Sign In Button -->
        <v-flex
          xs12
          sm3
          offset-sm1
          md3
          offset-md2
          lg2
          offset-lg3
          class="text-xs-left"
        >
          <v-btn
            @click="userSignin"
            ref="submit"
            class="login-button"
            color="accent"
            >Sign In</v-btn
          >
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      userid: ""
    };
  },
  methods: {
    ...mapActions({
      signin: "signin"
    }),
    userSignin() {
      if (this.userid) {
        this.signin(this.userid.toLowerCase());
        this.$router.push("/");
      }
    }
  }
};
</script>

<style scoped>
.sign-in {
  margin-top: 10px;
}
</style>
