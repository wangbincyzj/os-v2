import Vue from "vue"
import App from "./Core.vue"
import store from "./store"
import "@/assets/css/index.scss"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import {Core} from "@/types/Core"

Vue.config.productionTip = false

window.isDev = process.env.NODE_ENV === "development"
Vue.use(ElementUI, {size: "mini"})
Vue.prototype.$core = new Core()

new Vue({
  store,
  render: h => h(App)
}).$mount("#app")
