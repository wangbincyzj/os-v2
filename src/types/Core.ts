import {AppConfig} from "@/types/App"
import store from "@/store/index"
import cmdConfig from "@/apps/cmd/cmd.config"
import desktopConfig from "@/apps/desktop/desktop.config"
import computerConfig from "@/apps/computer/computer.config"

export class Core {
  name: string | undefined
  version: string | undefined
  appList: AppConfig[] | undefined
  registerApps: string[] | undefined

  // loadApps = async (): Promise<void> => {
  //   for (const path of this.registerApps) {
  //     const ret = await import("@/apps/" + path)
  //     console.log(ret)
  //   }
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // registerApp = (): void => {}
  //
  startUp = async (): Promise<void> => {
    // todo 先用固定导入,后期使用动态导入 require.context
    // await this.loadApps()   // 加载应用
    // this.registerApp()  // 注册Vue.component
    store.dispatch("core/loadAppList", [
      cmdConfig,
      desktopConfig,
      computerConfig
    ])
  }

  constructor() {
    this.startUp()
  }
}
