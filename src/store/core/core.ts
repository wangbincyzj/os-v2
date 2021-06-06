import {Module} from "vuex"
import {AppConfig} from "@/types/App"

interface coreState {
  appList: AppConfig[],  // 注册的应用列表
  runningList: AppConfig[],  // 运行的应用列表
}

let zIndex$1 = 0

const coreModule: Module<coreState, any> = {
  namespaced: true,
  state: {
    appList: [],
    runningList: []
  },
  actions: {
    loadAppList({state}, config: AppConfig[] | AppConfig): void {
      config = Array.isArray(config) ? config : [config]
      config.forEach(item => {
        state.appList.push(item)
      })
    },

    top({state}, appName) {
      const runningApp = state.runningList.find(item => item.name === appName)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      runningApp.zIndex = zIndex$1++
    },

    bootstrap({state, dispatch}, appName: string): void {
      const app = state.appList.find(item => item.name === appName)
      if (app) {
        const runningApp = state.runningList.find(item => item.name === appName)
        if (runningApp) {    // 已经启动: index置于最高
          dispatch("top", appName)
        } else {  // 未启动: 启动
          app.zIndex = zIndex$1++
          state.runningList.push(app)
        }
      } else {
        throw new Error("未找到应用")
      }
      // 未启动: 加入running列表
    }
  }
}


export default coreModule
