import {Module} from "vuex"
import {User} from "@/types/entity/User"
import {getItem, setItem} from "@/utils/storage"


interface UserState {
  user: User | null
}


const userModule: Module<UserState, any> = {
  namespaced: true,
  state: {
    user: getItem("user") || null
  },
  mutations: {
    setUser(state, user:User):void {
      state.user = user
      setItem("user", user)
    }
  },
  actions: {
    setUser({commit}, user:User):void{
      commit("setUser", user)
    }
  }

}


export default userModule
