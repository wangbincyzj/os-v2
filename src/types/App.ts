import Vue from "vue"

export interface AppConfig {
  name: string,
  desktopName?: string,
  iconName?: string,
  schema?: string,      // 调用协议,没有就用name属性
  zIndex?: number | boolean,
  resize?: boolean,
  hiddenInDesktop?: boolean,  // 是否在桌面显示
  order?: number,  // 启动顺序, 没有值不启动
  runningTime?: number,   // 运行时间  todo
  windowMode: {   // 位置信息描述
    mode: "FULL" | "FLOAT" | "FLOAT_FULL" | "FIXED",  // 全屏,窗口化,全屏窗口化,自动
    isTop?: boolean,
    isMinimize?: boolean,
    appHead?: boolean,
    left?: string,
    right?: string,
    top?: string,
    bottom?: string,
    width?: string,
    height?: string
  },
  ext?: string| string[],
  msgQueue?: AppMsg[],
}


export class AppComponent extends Vue {
}

export interface EventReceiver {
  onReceiveMsg: (msg: AppMsg) => void
}

export interface AppMsg {
  from: AppConfig,
  to: string,
  data: any
}
