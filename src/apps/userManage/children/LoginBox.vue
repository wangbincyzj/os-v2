<template>
  <div class="p-4 h-full bg-white">
    <div class="font-bold text-xl text-gray-600 mb-3">请先登录</div>
    <el-form class="mb-10">
      <el-form-item label="用户名">
        <el-input v-model="username"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="password"/>
      </el-form-item>
    </el-form>
    <el-button @click="handleLogin" class="w-full mt-6" type="primary">登录</el-button>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
import {userApi} from "@/apps/userManage/api"
import {EmitEventType} from "@/types/Core"

@Component
export default class LoginBox extends Vue {
  @Prop() value!: boolean

  username = ""
  password = ""

  handleClose(): void {
    this.$emit("input", false)
  }

  handleLogin(): void {
    userApi.login(this.username, this.password).then(ret => {
      this.$message.success(`登录成功:${ret.data.trueName || ret.data.username}`)
      this.$core.emit(EmitEventType.SET_USER, ret.data)
    })
  }
}
</script>

<style scoped lang="scss">

</style>
