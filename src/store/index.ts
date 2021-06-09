import Vue from 'vue'
import Vuex from 'vuex'
import coreModule from "@/store/core/core"
import contextModule from "@/store/context/context"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    core: coreModule,
    context: contextModule
  }
})
