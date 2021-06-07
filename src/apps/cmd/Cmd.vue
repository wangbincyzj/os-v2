<template>
  <div class=" p-2  w-full flex">
    <el-input v-model="command" @keypress.enter.native="sendCommand"/>
    <el-button @click="sendCommand">发送</el-button>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator"
import {AppComponent} from "@/types/App"

@Component
export default class Cmd extends AppComponent {
  command = ""

  sendCommand(): void {
    let arr = this.command.split(" ", 2)
    let result = this.$core.emit(arr[0] as any, arr[1])
    if(result.code !== 0){
      this.$message.warning(result.msg)
    }
    this.command = ""
  }
}
</script>

<style scoped lang="scss">

</style>
