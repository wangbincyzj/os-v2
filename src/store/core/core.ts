import {Module} from "vuex"
import {AppConfig, AppMsg, EventReceiver} from "@/types/App"
import Vue from "vue"

interface coreState {
  appList: AppConfig[],  // register list
  runningList: (AppConfig & { vm: Vue & EventReceiver})[],  // when vm mounted, should set its own instance
  highestIndex: number,

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
        if (item.zIndex as number >= highestIndex) highestIndex = item.zIndex as number
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
      if (runningApp && runningApp.name !== "desktop") {
        runningApp.zIndex = zIndex$1++
        runningApp.windowMode.isMinimize = false
        state.highestIndex = runningApp.zIndex
      }
    },

    minimize({state}, appName) {
      const runningApp = state.runningList.find(item => item.name === appName)
      if (runningApp) {
        runningApp.zIndex = -1
        runningApp.windowMode.isMinimize = true
        let max = 0
        state.runningList.forEach(app => {
          if (app.zIndex as number >= max) {
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
        if (runningApp) {
          dispatch("top", appName)
        } else {
          state.runningList.push(app as any)
          app.runningTime = 0

          // check some reactive attr for join reactive system
          if (!app.windowMode.isMinimize) {
            Vue.set(app.windowMode, "isMinimize", false)
          }
          if (!app.zIndex) {
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
    },

    // register vm
    register({state}, {name, vm}: { name: string, vm: Vue }) {
      const app = state.runningList.find(item => item.name === name)
      if (app) {
        app.vm = vm as any
      }
      if(app&&app.vm&&app.msgQueue){
        app.msgQueue.forEach(msg => {
          app.vm.onReceiveMsg(msg)
        })
        app.msgQueue = undefined
      }
    },

    // if their have a existing vm instance then call its directly,otherwise cache the msg waiting for vm startup to call
    sendMsg({state, dispatch}, msg:AppMsg): void{
      const app = state.runningList.find(item => item.name === msg.to)
      if(!app || !app.vm){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const app = state.appList.find(item => item.name === msg.to)!
        if(app?.msgQueue){
          app.msgQueue.push(msg)
        }else{
          app.msgQueue = [msg]
        }
        dispatch("bootstrap", msg.to)
      }else{
        app.vm.onReceiveMsg(msg)
      }
    }
  }
}


export default coreModule
