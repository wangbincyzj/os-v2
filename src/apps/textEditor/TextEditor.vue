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
import {createTextFile} from "@/utils/jsUtils"

@Component({
  components: {WIcon}
})
export default class TextEditor extends Vue implements EventReceiver {
  loading = false
  file: File = new File()
  text = ""

  onReceiveMsg(msg: AppMsg): void {
    this.file = msg.data
    this.fetch()
  }

  fetch(): void {
    this.loading = true
    fileApi.getStream(this.file?.src as string).then(ret => {
      this.text = ret as any
    }).finally(() => this.loading = false)
  }

  async handleSave(): Promise<void> {
    if (!this.file.name) {
      this.$prompt("请输入文件名").then(async (ret: any) => {
        let loading = this.$loading({background: "rgba(0,0,0,0.5)"})
        try {
          const file = createTextFile(this.text, ret.value)
          const {msg: src} = await fileApi.upload(file)
          this.file = new File()
          this.file.ext = "txt"
          this.file.pid = 4
          this.file.name = ret.value
          this.file.src = src
          this.file.isDir = false
          const ret2 = await fileApi.add(this.file)
          this.file.id = ret2.data as any
          this.$message.success("保存成功")
        } catch (e) {
          this.$message.error(e.toString())
        } finally {
          loading.close()
        }
      })
    } else {
      let loading = this.$loading({background: "rgba(0,0,0,0.5)"})
      const file = createTextFile(this.text, this.file.name)
      const {msg: src} = await fileApi.upload(file, this.file.name)
      this.file.src = src
      await fileApi.update(this.file)
      this.$message.success("保存成功")
      loading.close()
    }
  }


  mounted(): void {
    this.$core.emit(EmitEventType.REGISTER, {name: "textEditor", vm: this})
  }

}
</script>

<style scoped lang="scss">
.input {
  outline: none;
  line-height: 1em;
  resize: none;
}
</style>
