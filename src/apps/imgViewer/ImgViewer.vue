<template>
  <div class="bg-white w-full h-full flex">
    <img :src="src" alt="" class="flex-1">
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import {AppMsg, EventReceiver} from "@/types/App"
import {EmitEventType} from "@/types/Core"
import {File} from "@/types/entity/File"
import {fileApi} from "@/apps/computer/api"

@Component
export default class ImgViewer extends Vue implements EventReceiver{
  src = ""

  onReceiveMsg(msg: AppMsg): void {
    this.fetch(msg.data)
  }


  fetch(file: File):void {
    fileApi.getUrl(file.src as string).then(ret=>{
      this.src = ret.msg
    })
    // this.src = fileApi.createStream(file.src as string)
  }

  mounted():void {
    this.$core.emit(EmitEventType.REGISTER, {name: "imgViewer", vm: this})
  }

}
</script>

<style scoped lang="scss">

</style>
