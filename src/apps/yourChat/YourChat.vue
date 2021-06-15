<template>
  <div class="w-full h-full bg-green-100 flex ">
    <div class="list h-full bg-green-50">
      <div class="flex" v-for="user in userList" :key="user.id">
        <div class="avatar">
          <img :src="avatar(user.avatar)" alt="">
        </div>
        <div class="info"></div>
      </div>
    </div>
    <div class="content h-full flex-1"></div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import config from "@/config"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import {EventType, SocketPlus} from "@/types/SocketPlus"
import {fileApi} from "@/apps/computer/api"

const UserModule = namespace("user")

@Component
export default class YourChat extends Vue {
  @UserModule.State user!: User

  userList: User[] = []

  socket!: SocketPlus

  avatar(src: string):string {
    return fileApi.createStream(src)
  }

  init():void {
    if(!this.user){
      this.$message.error("请登录")
      return
    }
    const socket = new SocketPlus(new WebSocket(config.socketUrl + `/${this.user.token}`,))
    socket.on(EventType.UPDATE, msg => {
      this.userList = msg.data
    })
    socket.on(EventType.P2P_MESSAGE, msg => {
      console.log(msg)
    })
    this.socket = socket
  }

  mounted():void {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.list{
  width: 200px;
}
</style>
