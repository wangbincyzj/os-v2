import {AppConfig} from "@/types/App"
import store from "@/store/index"
import cmdConfig from "@/apps/cmd/cmd.config"
import desktopConfig from "@/apps/desktop/desktop.config"
import computerConfig from "@/apps/computer/computer.config"

export enum EmitEventType {
  "OPEN_APP" = "openApp",
  "CLOSE_APP" = "closeApp",
  "TOP_WINDOW" = "topWindow"
}

export enum SysEventType {

}

export type SubscribeType = EmitEventType | SysEventType

export class Core {
  private name: string | undefined
  private version: string | undefined
  private emitEventHandler: EmitEventHandler
  private eventBus: EventBus

  private loadApps = async (): Promise<void> => {
    store.dispatch("core/loadAppList", [
      cmdConfig,
      desktopConfig,
      computerConfig
    ]).then(() => {
      const autoBoot: AppConfig[] = store.state.core.appList.filter((app: AppConfig) => app.order !== undefined)
      autoBoot.sort((a: any, b: any) => a.order - b.order)
      autoBoot.forEach(app => store.dispatch("core/bootstrap", app.name))
    })
  }

  // 启动方法
  private startUp = async (): Promise<void> => {
    // todo 先用固定导入,后期使用动态导入 require.context
    await this.loadApps()
  }

  // 接受apps的事件
  emit = (eventType: EmitEventType, payload?: any): any => {
    // core响应事件本身
    const ret = this.emitEventHandler.handleEmit(eventType, payload)
    // 订阅者响应
    this.eventBus.notify(eventType)
    return ret
  }

  // app注册监听事件
  subscribe = (eventType: SubscribeType, callback: (payload?: any) => any, options: any = {}): void => {
    this.eventBus.subscribe(eventType, callback, options)
  }

  constructor() {
    this.startUp()
    this.emitEventHandler = new EmitEventHandler()
    this.eventBus = new EventBus()
  }
}


// 处理事件本身
class EmitEventHandler {
  private ok = (data: any, msg?: string) => ({data, code: 0, msg})
  private err = (msg: string) => ({data: null, code: 1, msg})
  handleEmit = (eventType: EmitEventType, payload: any): void | any => {
    try {
      switch (eventType) {
        case EmitEventType.OPEN_APP:
          return this.ok(store.dispatch("core/bootstrap", payload))
        case EmitEventType.CLOSE_APP:
          return this.ok(store.dispatch("core/closeApp", payload))
        case EmitEventType.TOP_WINDOW:
          return this.ok(store.dispatch("core/top", payload))
        default:
          return this.err("命令未找到")
      }
    } catch (e) {
      return this.err(e.toString())
    }
  }
}


// 处理订阅
class EventBus {
  private eventMap: { [key: string]: ({ once?: boolean, handler: (payload: any) => any })[] } = {}

  // app注册监听事件
  subscribe = (eventType: SubscribeType, callback: () => any, options?: any): boolean => {
    const subscribers = this.eventMap[eventType]
    if (subscribers && subscribers.length) {
      const already = subscribers.find(item => item.handler === callback)
      if (already) {
        return false
      } else {
        subscribers.push({handler: callback, once: options.once})
        return true
      }
    } else {
      this.eventMap[eventType] = [{handler: callback, once: options.once}]
      return true
    }
  }

  // 一次响应
  once = (eventType: SubscribeType, callback: () => any) => this.subscribe(eventType, callback, {once: true})

  // 取消订阅
  unSubscribe = (eventType: SubscribeType, callback: () => any): boolean => {
    const subscribers = this.eventMap[eventType]
    if (subscribers) {
      const target = subscribers.findIndex(subscriber => subscriber.handler === callback)
      if (target !== -1) {
        subscribers.splice(target, 1)
        return true
      }
    }
    return false

  }

  // 通知
  notify = (eventType: SubscribeType, payload?: any) => {
    let subscribers = this.eventMap[eventType]
    if (subscribers) {
      subscribers.forEach(subscriber => {
        subscriber.handler(payload)
      })
      subscribers = subscribers.filter(subscriber => !subscriber.once)
    }
  }
}












