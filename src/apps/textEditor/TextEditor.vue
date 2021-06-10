<template>
  <div class="flex-1 bg-white flex flex-col" v-loading="loading">
    <div class="menu bg-blue-200">
      <WIcon @click.native="handleSave" name="icon-Save" class="mx-1 cursor-pointer" title="保存"/>
    </div>
    <textarea @keydown.ctrl.s.prevent="handleSave" v-model="text" class="w-full  p-1 flex-1 input"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import {AppMsg, EventReceiver} from "@/types/App"
import {EmitEventType} from "@/types/Core"
import {File} from "@/types/entity/File"
import {fileApi} from "@/apps/computer/api"
import WIcon from "@/components/wIcon/WIcon.vue"
import {createTextForm} from "@/utils/jsUtils"
@Component({
  components: {WIcon}
})
export default class TextEditor extends Vue implements EventReceiver{
  loading = false
  file: File = new File()
  text = ""

  onReceiveMsg(msg: AppMsg): void {
    this.file = msg.data
    this.fetch()
  }

  fetch():void {
    this.loading = true
    fileApi.getStream(this.file?.src as string).then(ret=>{
      this.text = ret as any
    }).finally(() => this.loading = false)
  }

  handleSave():void {
    if(!this.file.name){
      this.$prompt("请输入文件名").then((ret: any)=>{
        this.file = new File()
        this.file.ext = "txt"
        this.file.pid = 4
        this.file.name = ret.value
        fileApi.newFile(createTextForm(this.text, this.file.name, this.file) as any).then(ret=>{
          this.file.id = ret.data
          this.$message.success("新增成功")
        })
      })
    }else{
      fileApi.newFile(createTextForm(this.text, this.file.name, this.file) as any).then(()=>{
        this.$message.success("保存成功")
      })
    }
  }




  mounted(): void {
    this.$core.emit(EmitEventType.REGISTER, {name: "textEditor", vm: this})
  }

}
</script>

<style scoped lang="scss">
.input{
  outline: none;
  line-height: 1em;
  resize: none;
}
</style>
