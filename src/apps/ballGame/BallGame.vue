<template>
  <div class="w-full h-full  flex text-sm flex-1">
    <template v-if="!user">
      <div class="bg-white items-center w-full h-full flex flex-col justify-center">
        <div class="text-gray-500">请先登录</div>
        <el-button @click="handleLogin">登录</el-button>
      </div>
    </template>
    <template v-else>
      <template v-if="wait">
        <div class="flex w-full h-full justify-center items-center">
          <el-button @click="handleWait">开始匹配</el-button>
        </div>
      </template>
      <template v-if="!wait">
        <div @keydown.right="handleMoveRight" class="container bg-white"
             :style="{width: `${vars.containerWidth}px`, height: `${vars.containerHeight}px`}">
          <div ref="ball" class="ball"
               :style="{left: `${p.x}px`, top: `${p.y}px`, width: `${vars.ballRadius*2}px`, height: `${vars.ballRadius*2}px`}"></div>
          <div ref="board" class="board"
               :style="{width: `${vars.boardWidth}px`, height: `${vars.boardHeight}px`, left: `${board.x}px`}"></div>
        </div>
      </template>

    </template>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import {SocketPlus} from "@/types/SocketPlus"
import {fileApi} from "@/apps/computer/api"
import {EmitEventType} from "@/types/Core"
import config from "@/config"

const UserModule = namespace("user")

enum GameState {
  OFFLINE = "offLine",  // 离线未链接
  ONLINE = "onLine",
  WAIT = "wait",
  READY = "ready",
  PLAYING = "playing",
  WIN = "win",
  LOOSE = "loose"
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

  @Watch("user", {immediate: true}) handleUser = (val: boolean) => {
    if (val) {
      this.init()
    } else {
      this.handleClose()
    }
  }
  wait = true

  activeUser: User = {} as User

  socket: SocketPlus | null = null

  avatar(src: string): string {
    return fileApi.createStream(src)
  }

  init(): void {
    this.connectServer()
  }

  // 开始匹配
  handleWait(): void {
    console.log(this.socket?.getSocket())
    this.socket?.send(0, "start_match")
  }

  start(): void {
    this.$nextTick(() => {
      this.boardTimer = setInterval(() => {
        this.board.x = this.board.x + this.boardV.x
        console.log(this.boardV.x)
      }, 2)
      this.timer = setInterval(() => {
        const {x: vx, y: vy} = this.v
        const {x, y} = this.p
        this.p = {
          x: x + vx,
          y: y + vy,
        }
        const {offsetLeft: left, offsetTop: top} = this.$refs.ball
        const vars = this.vars
        if ((this.p.x - vars.ballRadius) <= 0) {
          this.v.x = -this.v.x
        }
        if ((this.p.y - vars.ballRadius) <= 0) {
          this.v.y = -this.v.y
          this.addV()
        }
        if ((this.p.x + vars.ballRadius) >= vars.containerWidth) {
          this.v.x = -this.v.x

        }
        const checkCondition = this.p.y + vars.ballRadius >= vars.containerHeight - vars.boardHeight
        if (checkCondition) {
          const success = this.board.x < this.p.x && this.p.x - this.board.x <= vars.boardWidth
          if (success) {
            this.v.y = -this.v.y
            this.addV()
          } else {
            clearInterval(this.timer)
          }
        }
      }, 8)
    })
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

  connectServer(): void {
    const sp = new SocketPlus(new WebSocket(config.ballgameSocketUrl + `/${this.user.token}`,))
    sp.on("match", msg => {
      console.log("match", msg)
    })
    this.socket = sp
  }

  handleClose(): void {
    this.socket?.close()
  }

  beforeDestroy(): void {
    this.handleClose()
    clearInterval(this.timer)
    clearInterval(this.boardAddVTimer)
    clearInterval(this.boardTimer)
  }

  handleLogin(): void {
    this.$core.emit(EmitEventType.OPEN_APP, "userManage")
  }

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
    x: 10,
    y: 10,
  }


  // 板的位置
  board = {
    x: 0
  }

  // 板的速度
  boardV = {
    x: 0
  }

  // 球的加速方法
  addV = (): void => {
    this.v.y = 1.05 * this.v.y
    this.v.x = 1.05 * this.v.x
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
    width: 50px;
    height: 10px;
  }
}
</style>
