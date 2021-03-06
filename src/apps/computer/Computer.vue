<template>
  <div class="w-full h-full bg-white flex-1 flex flex-col" @contextmenu.capture="handleContext">
    <NavBar
      :navRoutes="navRoutes"
      :isBottomStack="isBottomStack"
      :isTopStack="isTopStack"
      @goBack="stack.back()"
      @goForward="stack.forward()"
    />
    <div class="content flex-1 flex justify-start items-start content-start flex-wrap" v-loading="loading">
      <FileItem class="flex-shrink-0" v-for="file in fileList" :key="file.id" :file="file" @dirClick="handleDirClick"/>
    </div>
    <el-dialog :visible.sync="showUpload" append-to-body title="上传文件">
      <el-button @click="handleChooseFile">上传</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Provide} from "vue-property-decorator"
import {AppComponent, AppMsg, EventReceiver} from "@/types/App"
import {fileApi} from "@/apps/computer/api"
import NavBar from "@/apps/computer/children/NavBar.vue"
import {Stack} from "@/utils/stack"
import {File} from "@/types/entity/File"
import WIcon from "@/components/wIcon/WIcon.vue"
import FileItem from "@/apps/computer/children/FileItem.vue"
import {EmitEventType} from "@/types/Core"
import {createTextForm, parseFileName} from "@/utils/jsUtils"
import {contextEvent} from "@/store/context/context"

export interface Route {
  id: number,
  name: string,
  icon: string
}


@Component({
  components: {FileItem, WIcon, NavBar}
})
export default class Computer extends AppComponent implements EventReceiver {

  @Provide() refresh = (): void => this.fetchRouteData()

  stack = new Stack<Route>({
    id: 0,
    name: "此电脑",
    icon: "icon-diannao"
  })

  loading = false

  showUpload = false

  index = 0

  routes: Route[] = []

  isTopStack = false
  isBottomStack = false

  fileList: File[] = []

  get currentRoute(): Route {
    return this.routes[this.index]
  }

  get navRoutes(): Route[] {
    return this.routes.slice(0, this.index + 1)
  }

  fetchRouteData(): void {
    this.loading = true
    fileApi.getList({pid: this.currentRoute.id} as File).then(ret => {
      this.fileList = ret.data
    }).finally(() => this.loading = false)
  }

  handleDirClick(file: File): void {
    this.stack.push({id: file.id, icon: file.icon, name: file.name} as any)
  }

  handleUpload(): void {
    this.showUpload = true
  }

  handleAddDir(): void {
    const file = new File()
    file.isDir = true
    file.pid = this.currentRoute.id
    file.icon = "icon-wenjianjia"
    file.name = "新建文件夹"
    file.renaming = true
    file.temp = true
    this.fileList.push(file)
  }

  handleAddText(): void {
    // todo
    fileApi.add(createTextForm("", "新建文本文档") as any).then(() => {
      this.refresh()
    })
  }

  handleChooseFile(): void {
    const dom = document.createElement("input")
    dom.type = "file"
    dom.onchange = async e => {
      const file_ = (e as any).target.files[0]
      const [name, ext] = parseFileName(file_.name)
      const service = this.$loading({background: "rgba(0,0,0,0.5)", text: "上传中..."})
      try {
        const ret = await fileApi.upload(file_)
        const file = new File()
        file.name = name
        file.ext = ext
        file.src = ret.msg
        file.isDir = false
        file.pid = this.currentRoute.id
        await fileApi.add(file)
      } catch (e) {
        this.$message.error(e)
      } finally {
        service.close()
        this.fetchRouteData()
      }
    }
    dom.click()
  }

  handleContext(e: MouseEvent): void {
    let events: contextEvent[] = [
      {label: "刷新", handler: () => this.fetchRouteData()},
    ]
    if (this.currentRoute.id !== 0) {
      events = events.concat([
        {label: "上传", handler: () => this.handleUpload()},
        {
          label: "新建", children: [
            {label: "文件夹", handler: () => this.handleAddDir()},
            {label: "文本文档", handler: () => this.handleAddText()},
          ]
        }
      ])
    }
    this.$core.emit(EmitEventType.OPEN_CONTEXT, {
      e,
      events
    })
  }

  mounted(): void {
    this.stack.subscribe((t, index) => {
      this.routes = t
      this.index = index
      this.isBottomStack = this.stack.isBottomStack
      this.isTopStack = this.stack.isTopStack
      this.fetchRouteData()
    })
  }

  onReceiveMsg(msg: AppMsg): void {
    console.log(msg)
  }
}
</script>

<style scoped lang="scss">

</style>
