// const domain = "10.86.8.75"
const domain = "47.95.192.129"
// const domain = "localhost"
export default {
  baseUrl: `http://${domain}:10086/domain`,
  socketUrl: `ws://${domain}:10086/websocket/message`,
  ballgameSocketUrl: `ws://${domain}:10086/ballgame`
}
