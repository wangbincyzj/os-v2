<template>
  <div class="resize absolute" ref="resize"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
import {AppConfig} from "@/types/App"

function createResizeArea(dom: HTMLElement, options: {appConfig: AppConfig}): void {
  let x0: number, y0: number, width0: number, height0: number
  dom.addEventListener("mousedown", (ev: MouseEvent) => {
    if(ev.target !== dom){
      return
    }
    x0 = ev.x
    y0 = ev.y
    width0 = parseInt(options.appConfig.windowMode.width as string)
    height0 = parseInt(options.appConfig.windowMode.height as string)
    window.addEventListener("mousemove", handleMoseMove)
  })

  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", handleMoseMove)
  })

  const handleMoseMove = (ev: MouseEvent) => {
    let deltaX = ev.x - x0
    let deltaY = ev.y - y0
    options.appConfig.windowMode.width = width0 + deltaX + "px"
    options.appConfig.windowMode.height = height0 + deltaY + "px"
  }
}


@Component
export default class AppBoxResize extends Vue {
  @Prop() appConfig!: AppConfig

  mounted():void {
    createResizeArea(this.$refs.resize as HTMLElement, {appConfig: this.appConfig})
  }
}
</script>

<style scoped lang="scss">
.resize{
  background-color: transparent;
  width: 3px;
  height: 100%;
  right: 0;
  top: 0;
  cursor: ew-resize;
}
</style>
