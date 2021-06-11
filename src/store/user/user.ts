import {Module} from "vuex"
import {User} from "@/types/entity/User"


interface UserState {
  user: User | null
}


const userModule: Module<UserState, any> = {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    setUser(state, user:User):void {
      state.user = user
      console.log(state.user)
    }
  },
  actions: {
    setUser({commit}, user:User):void{
      commit("setUser", user)
    }
  }

}


export default userModule
