<template>
  <div class="w-full bg-blue-100 flex pl-2 h-8 items-center justify-between select-none text-sm" ref="head" @dblclick="toggleSize">
    <div class="flex items-center">
      <WIcon :name="appConfig.iconName" class="mr-2"/>
      <div>{{ appConfig.name }}</div>
    </div>
    <div class="flex items-center  h-full" @click.stop>
      <div class="wrapper h-8 w-8 hover:bg-red-300  flex items-center justify-center" @click.stop="minimizeApp">
        <WIcon name="icon-zuixiaohua"/>
      </div>
      <div class="wrapper h-8 w-8 hover:bg-red-300 flex items-center justify-center" @click.stop="toggleSize">
        <WIcon name="icon-zuidahua1" v-if="appConfig.windowMode.mode === 'FLOAT_FULL'"/>
        <WIcon name="icon-zuidahua" v-else/>
      </div>
      <div class="wrapper h-8 w-8 hover:bg-red-600 hover:text-white flex items-center justify-center" @click.stop="closeApp">
        <WIcon name="icon-guanbi"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from "vue-property-decorator"
import {AppConfig} from "@/types/App"
import WIcon from "@/components/wIcon/WIcon.vue"


function createMovableBox(dom: HTMLElement, appConfig: AppConfig): any {
  let x0: number, y0: number, left0: number, top0: number
  dom.onmousedown = (ev: MouseEvent) => {
    if(ev.target !== dom){
      return
    }
    x0 = ev.x
    y0 = ev.y
    left0 = parseInt(appConfig.windowMode.left as string)
    top0 = parseInt(appConfig.windowMode.top as string)
    window.addEventListener("mousemove", handleMoseMove)
  }

  window.onmouseup = () => {
    window.removeEventListener("mousemove", handleMoseMove)
  }

  const handleMoseMove = (ev: MouseEvent) => {
    let deltaX = ev.x - x0
    let deltaY = ev.y - y0
    appConfig.windowMode.left = left0 + deltaX + "px"
    appConfig.windowMode.top = top0 + deltaY + "px"
  }
}

@Component({
  components: {WIcon}
})
export default class Computer extends Vue {
  @Prop() appConfig!: AppConfig

  @Inject() closeApp!: () => void
  @Inject() toggleSize!: () => void
  @Inject() minimizeApp!: () => void

  mounted(): void {
    createMovableBox(this.$refs.head as any, this.appConfig)
  }
}
</script>

<style scoped lang="scss">

</style>
