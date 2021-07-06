import {User} from "@/types/entity/User"

export enum EventType {
  UPDATE = "update",
  P2P_MESSAGE = "p2pMessage",
}

export enum BallGameEventType {
  CONNECTED = "connected", // 链接上服务器
  WAITING = "waiting",  // 等待中
  PLAYER_FOUND = "playerFound", // 寻找到玩家
  PLAYER_READY = "playerReady",  // 玩家准备完毕
  PLAYER_UPDATE_POSITION = "playerUpdatePosition",   // 玩家移动
  PLAYER_DISCONNECT = "playerDisconnect",   // 玩家掉线
  GAME_RESULT = "gameResult"
}


export interface ReceiveMessage {
  type: EventType,
  data: any,
  from: User,
  timestamp: number
}

export interface SendMessage{
  type: EventType,
  data: any,
  to: number,
  timestamp: number
}

export class SocketPlus {
  private socket: WebSocket
  private eventMap: { [type: string]: (msg: ReceiveMessage) => void } = {}

  on = (event: EventType | BallGameEventType, callback: (msg: ReceiveMessage) => void) => {
    this.eventMap[event] = callback
  }

  send = (to: number, content: any, eventType?: EventType | BallGameEventType) => {
    this.socket.send(JSON.stringify({to, data: content, type: eventType || EventType.P2P_MESSAGE}))
  }

  close = () => {
    this.socket.close()
  }

  getSocket(): WebSocket {
    return this.socket
  }


  constructor(socket: WebSocket) {
    this.socket = socket
    socket.onmessage = (ev: MessageEvent) => {
      const data: ReceiveMessage = JSON.parse(ev.data) as ReceiveMessage
      const eventName = data.type
      const handler = this.eventMap[eventName]
      if (handler) {
        handler.call(this, data)
      }else if(process.env.NODE_ENV === "development"){
        console.warn("uncatch msg:", data)
      }
    }
  }
}
