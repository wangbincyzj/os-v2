import {Module} from "vuex"
import {AppConfig} from "@/types/App"
import Vue from "vue"

interface coreState {
  appList: AppConfig[],  // 注册的应用列表
  runningList: AppConfig[],  // 运行的应用列表
  highestIndex: number
}

let zIndex$1 = 3

const coreModule: Module<coreState, any> = {
  namespaced: true,
  state: {
    appList: [],
    runningList: [],
    highestIndex: 0
  },
  getters: {
    highestIndex: state => {
      let highestIndex = 0
      state.runningList.forEach(item => {
        if(item.zIndex as number >= highestIndex) highestIndex = item.zIndex as number
      })
      return highestIndex
    }
  },
  actions: {
    // 加载应用列表
    loadAppList({state}, config: AppConfig[] | AppConfig): void {
      config = Array.isArray(config) ? config : [config]
      config.forEach(item => {
        state.appList.push(item)
      })
    },

    // 置顶窗口
    top({state}, appName) {
      const runningApp = state.runningList.find(item => item.name === appName)
      if (runningApp && runningApp.name!=='desktop') {
        runningApp.zIndex = zIndex$1++
        runningApp.windowMode.isMinimize = false
        state.highestIndex = runningApp.zIndex
      }
    },

    minimize({state}, appName) {
      const runningApp = state.runningList.find(item => item.name === appName)
      if(runningApp){
        runningApp.zIndex = -1
        runningApp.windowMode.isMinimize = true
        let max = 0
        state.runningList.forEach(app => {
          if(app.zIndex as number >= max){
            max = app.zIndex as number
          }
        })
        state.highestIndex = max
      }
    },

    // 启动App
    bootstrap({state, dispatch}, appName: string): void {
      const app = state.appList.find(item => item.name === appName)
      if (app) {
        const runningApp = state.runningList.find(item => item.name === appName)
        if (runningApp) {    // 已经启动: index置于最高
          dispatch("top", appName)
        } else {  // 未启动: 启动
          state.runningList.push(app)
          app.runningTime = 0
          if(!app.windowMode.isMinimize){
            Vue.set(app.windowMode, "isMinimize", false)
          }
          if(!app.zIndex){
            Vue.set(app, "zIndex", 3)
          }
          dispatch("top", appName)
          if (window.isDev) {
            console.log(`${app.name} startup ${new Date().toDateString()}`)
          }
        }
      } else {
        throw new Error("未找到应用")
      }
    },

    // 关闭App
    closeApp({state}, appName: string) {
      const appIndex = state.runningList.findIndex(item => item.name === appName)
      if (appIndex !== -1) {
        state.runningList.splice(appIndex, 1)
        return true
      } else {
        return false
      }
    }
  }
}


export default coreModule
