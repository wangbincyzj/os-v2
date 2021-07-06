<template>
  <div class="w-full h-full  flex text-sm flex-1 bg-white">
    <template v-if="!user">
      <div class="bg-white items-center w-full h-full flex flex-col justify-center">
        <div class="text-gray-500">请先登录</div>
        <el-button @click="handleLogin">登录</el-button>
      </div>
    </template>
    <template v-else>
      <div class="w-full h-full flex justify-center items-center">
        <div class="status" v-if="state==='offLine'">
          <div class="title">未连接服务器</div>
          <el-button @click="connectServer">连接服务器</el-button>
        </div>
        <div class="status" v-if="state==='onLine'">
          <div class="title">已连接服务器</div>
          <div>
            <el-button @click="handleDisconnect">断开连接</el-button>
            <el-button @click="handleMatch" type="primary">开始匹配</el-button>
          </div>
        </div>
        <div class="status" v-if="state==='wait'">
          <div class="title">寻找对手中...</div>
          <div>
            <el-button @click="handleDisconnect">断开连接</el-button>
          </div>
        </div>
        <div class="status" v-if="state==='ready'">
          <div class="flex">
            <img :src="avatar(user.avatar)" alt="" class="avatar">
            <img :src="avatar(player.avatar)" alt="" class="avatar">
          </div>
          <div>{{ player.trueName }}</div>
          <div class="title">已匹配对手</div>
          <div>
            <el-button @click="handleStart">开始比赛</el-button>
          </div>
        </div>

        <div v-if="state==='playing'" class="container bg-white"
             :style="{width: `${vars.containerWidth}px`, height: `${vars.containerHeight}px`}">
          <div ref="ball" class="ball"
               :style="{left: `${p.x}px`, top: `${p.y}px`, width: `${vars.ballRadius*2}px`, height: `${vars.ballRadius*2}px`}"></div>
          <div class="board board2"
               :style="{width: `${vars.boardWidth}px`, height: `${vars.boardHeight}px`, right: `${board2.x}px`}"
          ></div>
          <div ref="board" class="board"
               :style="{width: `${vars.boardWidth}px`, height: `${vars.boardHeight}px`, left: `${board.x}px`}"></div>
        </div>
      </div>

    </template>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import {BallGameEventType, EventType, SocketPlus} from "@/types/SocketPlus"
import {fileApi} from "@/apps/computer/api"
import {EmitEventType} from "@/types/Core"
import config from "@/config"

const UserModule = namespace("user")

enum GameState {
  OFFLINE = "offLine",  // 离线未链接
  ONLINE = "onLine",  // 在线未操作
  WAIT = "wait",  // 排队中
  READY = "ready",   // 已建立双向链接
  PLAYING = "playing",  // 游戏中
  END = "end",   // 游戏结束 => ONLINE
}

@Component
export default class YourChat extends Vue {
  $refs!: {
    msgArea: HTMLDivElement
    ball: HTMLDivElement,
    board: HTMLDivElement
  }
  // 维护一个对面的状态和一个自己的状态

  @UserModule.State user!: User


  state: GameState = GameState.OFFLINE

  activeUser: User = {} as User

  socket: SocketPlus | null = null

  avatar(src: string): string {
    return fileApi.createStream(src)
  }

  player!: User


  // 链接服务器
  connectServer(): void {
    console.log("connect Server")
    const sp = new SocketPlus(new WebSocket(config.ballgameSocketUrl + `/${this.user.token}`,))
    this.socket = sp
    sp.on(BallGameEventType.CONNECTED, () => {
      console.log("connected")
      this.state = GameState.ONLINE
    })
    sp.on(BallGameEventType.WAITING, () => {
      console.log("waiting")
      this.state = GameState.WAIT
    })
    sp.on(BallGameEventType.PLAYER_FOUND, (data: any) => {
      console.log("ready")
      this.player = data.data
      this.state = GameState.READY
    })
    sp.on(EventType.P2P_MESSAGE, (data: any) => {
      data = data.data
      if (data.type === "start") {
        this.v = data.v
        this.p = data.p
        this.state = GameState.PLAYING
        this.initGame()
      } else if (data.type === "updatePosition") {
        this.board2.x = data.x
      } else if (data.type === "result") {
        this.$message.success("你赢了")
        this.state = GameState.READY
        this.clearEffect()
      } else if (data.type === "updateBallPosition") {
        this.v = data.v
        this.p = data.p
        console.log("receive vx, vy:", this.v.x, this.v.y)
      }
    })
  }


  // 开始匹配
  handleMatch(): void {
    console.log("匹配开始")
    this.socket?.send(0, {type: "match"})
  }


  // 断开连接
  handleDisconnect(): void {
    console.log("断开连接")
    this.state = GameState.OFFLINE
    if (this.socket) {
      this.socket.close()
    }
  }

  // 开始比赛
  handleStart(): void {
    console.log("开始比赛")
    // 延时问题: 需要同步开始时间
    this.socket?.send(this.player.id, {
      type: "start",
      v: {x: this.v.x * -1, y: -1 * this.v.y},
      p: {x: this.vars.containerWidth - this.p.x, y: this.vars.containerHeight - this.p.y}
    })
    this.state = GameState.PLAYING
    this.initGame()
  }


  beforeDestroy(): void {
    this.handleDisconnect()
    this.clearEffect()
  }

  clearEffect(): void {
    this.v = {
      x: 1,
      y: 2
    }

    // 球的位置
    this.p = {
      x: 100,
      y: 100,
    }
    clearInterval(this.timer)
    clearInterval(this.boardAddVTimer)
    clearInterval(this.boardTimer)
    window.onkeydown = null
    window.onkeyup = null
  }

  handleLogin(): void {
    this.$core.emit(EmitEventType.OPEN_APP, "userManage")
  }


  // 数据相关
  vars = {
    containerWidth: 598,
    containerHeight: 766,
    ballRadius: 10,
    boardWidth: 80,
    boardHeight: 10
  }

  // 球的位置驱动
  timer!: number
  // 板的速度驱动
  boardTimer!: number
  // 板的加速度驱动
  boardAddVTimer!: number

  // 球的速度
  v = {
    x: 1,
    y: 2
  }

  // 球的位置
  p = {
    x: 100,
    y: 100,
  }


  // 板的位置
  board = {
    x: 0
  }

  board2 = {
    x: 0
  }

  // 板的速度
  boardV = {
    x: 0
  }

  // 球的加速方法
  addV = (): void => {
    console.log("addv start", this.v.x, this.v.y)
    this.v.x = 1.05 * this.v.x
    this.v.y = 1.05 * this.v.y
    console.log("addv end", this.v.x, this.v.y)
  }

  handleMoveRight(): void {
    if (!this.boardAddVTimer) {
      this.boardV.x = 1
      this.boardAddVTimer = setInterval(() => {
        this.boardV.x += 0.005
      }, 1)
    }
  }

  handleMoveLeft(): void {
    if (!this.boardAddVTimer) {
      this.boardV.x = -1
      this.boardAddVTimer = setInterval(() => {
        this.boardV.x -= 0.005
      }, 1)
    }
  }

  initGame(): void {
    this.boardTimer = setInterval(() => {
      this.board.x = this.board.x + this.boardV.x
      this.socket?.send(this.player.id, {x: this.board.x, type: "updatePosition"})
    }, 2)
    this.timer = setInterval(() => {
      const {x: vx, y: vy} = this.v
      const {x, y} = this.p
      this.p = {
        x: x + vx,
        y: y + vy,
      }
      const vars = this.vars
      if ((this.p.x - vars.ballRadius) <= 0) {
        this.v.x = -this.v.x
      }
      // if ((this.p.y - vars.ballRadius) <= vars.boardHeight) {
      //   this.v.y = -this.v.y
      //   this.addV()
      // }
      if ((this.p.x + vars.ballRadius) >= vars.containerWidth) {
        this.v.x = -this.v.x

      }
      const checkCondition = this.p.y + vars.ballRadius >= vars.containerHeight - vars.boardHeight
      if (checkCondition) {
        const success = this.board.x < this.p.x && this.p.x - this.board.x <= vars.boardWidth
        if (success) { // 更新位置
          this.v.y = -this.v.y
          this.v.x = this.v.x + 0.5 * this.boardV.x
          this.v.x = 1.05 * this.v.x
          this.v.y = 1.05 * this.v.y
          this.socket?.send(this.player.id,
              {
                type: "updateBallPosition",
                v: {x: -this.v.x, y: -this.v.y},
                p: {x: this.vars.containerWidth - this.p.x, y: this.vars.containerHeight - this.p.y}
              })
        } else {  // 游戏结束
          this.$message.info("你输了")
          this.socket?.send(this.player.id, {type: "result"})
          this.clearEffect()
          this.state = GameState.READY
        }
      }
    }, 8)

    window.onkeydown = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight") {
        this.handleMoveRight()
      }
      if (ev.key === "ArrowLeft") {
        this.handleMoveLeft()
      }
    }
    window.onkeyup = () => {
      clearInterval(this.boardAddVTimer)
      this.boardAddVTimer = null as any
      this.boardV.x = 0
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  width: 200px;
}

.from {
  margin-right: 120px;
}

.to {
  margin-left: 120px;

  .msgContent {
    background-color: green;
    color: white;
  }
}

.active {
  background-color: skyblue;
}

.container {
  width: 500px;
  height: 600px;
  background-color: skyblue;
  position: relative;
  //overflow: hidden;

  .ball {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: royalblue;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .board {
    position: absolute;
    bottom: 0;
    background-color: orange;
  }

  .board2 {
    top: 0;
  }
}

.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }

  .title {
    font-weight: 600;
    margin-bottom: 20px;
  }
}
</style>
