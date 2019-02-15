import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate from "vee-validate";
import Enums from "./plugins/Enums";
import VueLodash from "vue-lodash";
import moment from "moment";

// AWS Cognito
import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import aws_exports from "./aws-exports";
Amplify.configure(aws_exports);

Vue.use(AmplifyPlugin, AmplifyModules);
Vue.use(VeeValidate);
Vue.use(VueLodash);
Vue.use(Enums);

Vue.prototype.$moment = moment;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
