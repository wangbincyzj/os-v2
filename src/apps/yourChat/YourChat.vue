<template>
  <div class="w-full h-full  flex text-sm flex-1">
    <template v-if="!user">
      <div class="bg-white items-center w-full h-full flex flex-col justify-center">
        <div class="text-gray-500">请先登录</div>
        <el-button @click="handleLogin">登录</el-button>
      </div>
    </template>
    <template v-else>
      <div class="w-full h-full  flex">
        <!--左侧菜单-->
        <div class="menu">

        </div>
        <!--用户列表-->
        <div class="list h-full border-r bg-white">
          <div class="flex bg-white cursor-pointer  p-1" :class="{active: user.id===activeUser.id}" v-for="user in userList" :key="user.id"
               @click="handleChooseUser(user)">
            <div class="avatar h-12 overflow-hidden border">
              <img class="h-full" :src="avatar(user.avatar)" alt="">
            </div>
            <div class="info ml-2">
              {{ user.trueName }}
            </div>
          </div>
        </div>
        <!--右边区域-->
        <div class="content h-full flex-1 bg-gray-50 flex flex-col">
          <!--消息区域-->
          <div ref="msgArea" class="msgs h-2/3 overflow-auto py-2 flex-shrink-0">
            <template v-for="(msg, index) in currentUserMsgList">
              <div :key="index" class="mb-4">
                <div class="from flex ml-2" v-if="msg.from">
                  <img class="w-6 h-6 mr-1" :src="avatar(msg.from.avatar)" alt="">
                  <div>
                    <div class="name text-xs text-gray-500">{{msg.from.trueName}}</div>
                    <div class="msgContent border p-1 bg-white rounded">{{msg.data}}</div>
                  </div>
                </div>
                <div class="to flex justify-end  mr-2" v-if="msg.to">
                  <div>
                    <div class="msgContent border p-1 bg-white rounded">{{msg.data}}</div>
                  </div>
                  <img class="w-6 h-6 ml-1" :src="avatar(user.avatar)" alt="">

                </div>
              </div>
            </template>
          </div>
          <!--输入区域-->
          <div class="input  flex-1 relative">
            <textarea @keypress.enter="handleSendMsg" class="w-full h-full outline-none p-1" v-model="msg" style="resize: none"/>
            <el-button @click="handleSendMsg" class="absolute right-2 bottom-2">发送</el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator"
import config from "@/config"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import {EventType, ReceiveMessage, SendMessage, SocketPlus} from "@/types/SocketPlus"
import {fileApi} from "@/apps/computer/api"
import {EmitEventType} from "@/types/Core"
import {getItem, setItem} from "@/utils/storage"

const UserModule = namespace("user")
const MSG_STORAGE_KEY = "msgKey"

@Component
export default class YourChat extends Vue {
  $refs!: {
    msgArea: HTMLDivElement
  }

  @UserModule.State user!: User

  @Watch("user", {immediate: true}) handleUser = (val: boolean) => {
    if (val) {
      this.init()
    } else {
      this.handleClose()
    }
  }

  msg = ""
  msgList: ReceiveMessage[] | SendMessage[] = []

  get currentUserMsgList(): any[] {
    if (!this.activeUser) return []
    return (this.msgList as any).filter((msg: any) => {
      if (msg.from && msg.from.id === this.activeUser.id) {
        return true
      }
      if (msg.to && msg.to === this.activeUser.id) {
        return true
      }
    })
  }

  userList: User[] = []

  activeUser: User = {} as User

  socket: SocketPlus | null = null

  avatar(src: string): string {
    return fileApi.createStream(src)
  }

  init(): void {
    this.msgList = getItem(MSG_STORAGE_KEY) || []
    const socket = new SocketPlus(new WebSocket(config.socketUrl + `/${this.user.token}`,))
    socket.on(EventType.UPDATE, msg => {
      this.userList = msg.data
    })
    socket.on(EventType.P2P_MESSAGE, msg => {
      this.msgList.push(msg as any)
      setItem(MSG_STORAGE_KEY, this.msgList)
      this.scrollToBottom()
    })
    this.socket = socket
  }

  handleClose(): void {
    this.socket?.close()
  }

  beforeDestroy(): void {
    this.handleClose()
  }

  handleChooseUser(user: User): void {
    this.activeUser = user
    this.scrollToBottom()
  }

  scrollToBottom():void {
    this.$nextTick(()=>{
      this.$refs.msgArea.scrollTo({top:this.$refs.msgArea.scrollHeight})
    })
  }

  handleSendMsg(): void {
    if(!this.msg.trim()){
      return
    }
    this.msgList.push({
      type: EventType.P2P_MESSAGE,
      to: this.activeUser.id,
      data: this.msg,
      timestamp: Date.now()
    } as any)
    setItem(MSG_STORAGE_KEY, this.msgList)
    this.socket?.send(this.activeUser.id, this.msg)
    this.msg = ""
    this.scrollToBottom()
  }

  handleLogin(): void {
    this.$core.emit(EmitEventType.OPEN_APP, "userManage")
  }
}
</script>

<style scoped lang="scss">
.list {
  width: 200px;
}
.from{
  margin-right: 120px;
}
.to{
  margin-left: 120px;
  .msgContent{
    background-color: green;
    color: white;
  }
}
.active{
  background-color: skyblue;
}
</style>
