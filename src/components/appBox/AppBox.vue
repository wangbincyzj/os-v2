<template>
  <div class="appBox flex flex-col relative" :style="boxStyle" @mousedown="topApp">
    <AppBoxHead v-if="appConfig.windowMode.appHead" :appConfig="appConfig"/>
    <component :is="appConfig.name" :appConfig="appConfig"/>
    <AppBoxResize :appConfig="appConfig"/>
  </div>
</template>

<script lang="ts">
// 所有的样式在这里解析
import {Component, Prop, Provide, Vue} from "vue-property-decorator"

import Desktop from "../../apps/desktop/Desktop.vue"
import Cmd from "../../apps/cmd/Cmd.vue"
import {AppConfig} from "@/types/App"
import Computer from "@/apps/computer/Computer.vue"
import AppBoxHead from "@/components/appBox/AppBoxHead.vue"
import {EmitEventType} from "@/types/Core"
import AppBoxResize from "@/components/appBox/AppBoxResize.vue"




@Component({
  components: {AppBoxResize, AppBoxHead, Computer, Cmd, Desktop}
})
export default class AppBox extends Vue {
  @Prop({required: true}) appConfig!: AppConfig

  @Provide() closeApp = (): void => this.$core.emit(EmitEventType.CLOSE_APP, this.appConfig.name)

  @Provide() toggleSize(): void {
    if (this.appConfig.windowMode.mode === "FLOAT_FULL") {
      this.appConfig.windowMode.mode = "FLOAT"
    } else {
      this.appConfig.windowMode.mode = "FLOAT_FULL"
    }
  }

  @Provide() minimizeApp = (): void => {
    this.$store.dispatch("core/minimize", this.appConfig.name)
  }

  @Provide() topApp = ():void => {
    this.$core.emit(EmitEventType.TOP_WINDOW, this.appConfig.name)
  }



  get boxStyle(): any {
    const app = this.appConfig
    // 位置信息
    let positionStyle = {} as any
    if (app.windowMode.mode === "FULL" || app.windowMode.mode === "FLOAT_FULL") {
      positionStyle.position = "fixed"
      positionStyle.left = "0"
      positionStyle.top = "0"
      positionStyle.bottom = "0"
      positionStyle.right = "0"
      if (app.windowMode.mode==="FLOAT_FULL") positionStyle.bottom = "40px"
    } else if (app.windowMode.mode === "FIXED" || app.windowMode.mode === "FLOAT") {
      const {mode, ...others} = app.windowMode
      positionStyle.position = "fixed"
      Object.keys(others).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        positionStyle[key] = app.windowMode[key] ? app.windowMode[key] : ""
      })
      positionStyle.bottom = "40px"
    }
    if (app.windowMode.isMinimize) {
      positionStyle.display = "none"
    }


    // Zindex信息
    let zIndexStyle = {} as any
    zIndexStyle.zIndex = app.zIndex
    return {
      ...positionStyle,
      ...zIndexStyle
    }
  }
}
</script>

<style scoped lang="scss">

</style>
