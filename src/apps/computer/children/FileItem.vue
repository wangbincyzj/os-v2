<template>
  <div class="flex flex-col hover:bg-blue-100 item justify-center items-center p-2 text-xs overflow-hidden"
       @dblclick.left="handleFileClick"
       @contextmenu.capture="handleContext"
  >
    <WIcon :name="file.icon" size="25"/>
    <div class="name truncate w-full text-center mt-1">
      <el-input  ref="input" @dblclick.native.stop v-if="file.renaming" v-model="file.name" @keyup.enter.native="handleRenamingEnd"
                @blur="handleRenamingEnd"/>
      <span v-else>{{ fileName }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from "vue-property-decorator"
import {File} from "@/types/entity/File"
import WIcon from "@/components/wIcon/WIcon.vue"
import {EmitEventType} from "@/types/Core"
import {fileApi} from "@/apps/computer/api"
import {contextEvent} from "@/store/context/context"

@Component({
  components: {WIcon}
})
export default class FileItem extends Vue {
  @Prop({required: true}) file!: File
  @Inject() refresh!: () => void
  public $refs!: {
    input: any
  }

  get isDir(): boolean {
    return this.file.isDir as boolean
  }

  updated(): void {
    this.$nextTick(()=>{
      this.$refs.input && this.$refs.input.focus()
    })
  }

  mounted():void {
    this.$nextTick(()=>{
      this.$refs.input && this.$refs.input.focus()
    })
  }

  get fileName(): string {
    if (this.isDir) return this.file.name
    return this.file.name + "." + this.file.ext
  }

  set fileName(val: string) {
    this.file.name = val
  }

  test(): void {
    console.log(123)
  }


  handleFileClick(): void {
    if (this.isDir) {
      this.$emit("dirClick", this.file)
    } else {
      let ret = this.$core.emit(EmitEventType.OPEN_FILE, {form: this, ext: this.file.ext, data: this.file})
      if(ret.code!==0){
        this.$message.warning(ret.msg)
      }
    }
  }

  handleRenamingEnd(): void {
    this.file.renaming = false
    if (this.file.temp) {
      fileApi.add(this.file).then(() => {
        this.refresh()
      })
    } else {
      fileApi.update(this.file).then(() => {
        this.refresh()
      })
    }
    this.file.temp = false
  }

  handleDelete(): void {
    this.$confirm("确定要删除吗?", {
      type: "warning",
    }).then(()=>{
      fileApi.delete(this.file.id).then(()=>this.refresh())
    })
  }

  handleContext(e: MouseEvent): void {
    if(this.file.pid===0) return
    const events: contextEvent[] = [
      {label: "打开", handler: () => this.handleFileClick()},
      {label: "重命名", handler: () => {this.$set(this.file, "renaming", true)}},
      {label: "删除", handler: () => this.handleDelete()}
    ]
    if(this.file.src){
      events.splice(1, 0, {label: "下载"})
    }
    this.$core.emit(EmitEventType.OPEN_CONTEXT, {
      e: e,
      events
    })
  }
}
</script>

<style scoped lang="scss">
.item {
  user-select: none;
  width: 130px;
  height: 80px;
  margin: 5px;
}
</style>
