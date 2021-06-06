import Vue from "vue"


export interface AppConfig {
  name: string,
  iconName?: string,
  schema?: string,      // 调用协议,没有就用name属性
  zIndex?: number,
  hiddenInDesktop?: boolean

}


export class AppComponent extends Vue{

}
