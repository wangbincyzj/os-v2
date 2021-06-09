import {Module} from "vuex"


export interface contextEvent {
  icon?: string,
  label: string,
  handler?: () => void,
  children?: contextEvent[]
}

interface ContextState {
  show: boolean,
  events: contextEvent[],
  style: { [key: string]: string }
}


const contextModule: Module<ContextState, any> = {
  namespaced: true,
  state: {
    show: false,
    events: [
      {
        label: "打开", handler: (): void => {
          console.log("打开")
        },
        children: [
          {label: "mp3"},
          {label: "txt"}
        ]
      },
      {
        label: "关闭", handler: (): void => {
          console.log("关闭")
        }
      },
      {
        label: "取消", handler: (): void => {
          console.log("取消")
        }
      },
    ],
    style: {
      left: "150px",
      top: "200px"
    }
  },
  actions:{
    openContext: (context, payload: any) => {
      const events = payload.events || []
      context.state.events = events.concat({label: "取消"})
      context.state.style = payload.style
      context.state.show = true
    },
    closeContext: ({state}) => {
      state.show = false
    }
  }
}


export default contextModule
