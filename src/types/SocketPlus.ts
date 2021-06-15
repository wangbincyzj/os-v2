export enum EventType {
  UPDATE = "update",
  P2P_MESSAGE = "p2pMessage"
}


export interface ReceiveMessage {
  type: EventType,
  data: any,
  from: number
}

export class SocketPlus {
  private socket: WebSocket
  private eventMap: { [type: string]: (msg: ReceiveMessage) => void } = {}

  on = (event: EventType, callback: (msg: ReceiveMessage) => void) => {
    this.eventMap[event] = callback
  }

  constructor(socket: WebSocket) {
    this.socket = socket
    socket.onmessage = (ev: MessageEvent) => {
      const data: ReceiveMessage = JSON.parse(ev.data) as ReceiveMessage
      const eventName = data.type
      const handler = this.eventMap[eventName]
      if (handler) {
        handler.call(this, data)
      }
    }
  }
}
