<template>
  <div class="h-full flex justify-around flex-col items-center">
    <div class="avatar rounded-full w-24 h-24 overflow-hidden cursor-pointer" @click="handleUploadAvatar">
      <img class="h-full w-full" :src="avatar" alt="点击更换头像">
    </div>
    <div class=" flex flex-col items-center">
      <div class="username text-gray-500">
        <span>{{user.username}}</span>
      </div>
      <div class="username text-gray-500">
        <el-input ref="input" v-model="trueName" v-if="editMode" @blur="handleSave" @keypress.native.enter="handleSave"/>
        <span title="点击修改名称" v-else class="cursor-pointer" @click="editMode=true">{{ trueName }}</span>
      </div>
    </div>
    <div>
      <el-button @click="handleLogoff">注销</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import {userApi} from "@/apps/userManage/api"
import {fileApi} from "@/apps/computer/api"
import {parseFileName} from "@/utils/jsUtils"

const UserModule = namespace("user")

@Component
export default class Profile extends Vue {
  $refs!: {
    input: any
  }

  @UserModule.State user!: User

  @Watch("editMode") focus(val: boolean):void {
    if(val) this.$nextTick(()=>{
      this.$refs.input.focus()
    })
  }

  get avatar():string {
    if(this.user.avatar){
      return  fileApi.createStream(this.user.avatar)
    }else{
      return  "https://dgss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=434435894,144733231&fm=30&app=106&f=JPEG?w=312&h=208&s=3A82994D4C73200D698421A80300E012"
    }
  }

  get trueName(): string {
    if(!this.editMode){
      if(!this.user.trueName) return "点击修改名称"
      return this.user.trueName
    }else{
      return this.user.trueName || ""
    }
  }

  set trueName(val: string){
    this.$store.commit("user/setUser", {
      ...this.user,
      trueName: val
    })

  }

  handleSave():void {
    userApi.update(this.user)
    this.editMode = false
  }

  handleUploadAvatar():void {
    const input = document.createElement("input")
    input.type = "file"
    input.onchange =async (e: any) => {
      const file:File = e.target.files[0]
      const [name, ext] = parseFileName(file.name)
      if(ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "gif" || ext === "jfif"){
        const ret = await fileApi.upload(file)
        this.$store.commit("user/setUser", {
          ...this.user,
          avatar: ret.msg
        })
        userApi.update(this.user)
      }else{
        this.$message.warning("不支持的格式")
      }
    }
    input.click()
  }

  handleLogoff():void {
    this.$store.commit("user/setUser", null)
  }

  editMode = false
}
</script>

<style scoped lang="scss">

</style>
