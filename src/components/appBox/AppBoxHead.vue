<template>
  <div class="w-full bg-blue-100 flex pl-2 h-8 items-center  justify-between  text-sm" :style="style" ref="head" @dblclick="toggleSize">
    <div class="flex items-center">
      <WIcon :name="appConfig.iconName" class="mr-2"/>
      <div>{{ appConfig.name }}</div>
    </div>
    <div class="flex items-center  h-full" @click.stop>
      <div class="wrapper h-8 w-8 hover:bg-red-300  flex items-center justify-center" @click.stop="minimizeApp">
        <WIcon name="icon-zuixiaohua"/>
      </div>
      <div v-if="appConfig.resize" class="wrapper h-8 w-8 hover:bg-red-300 flex items-center justify-center" @click.stop="toggleSize">
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
import {createMovableBox} from "@/utils/jsUtils"




@Component({
  components: {WIcon}
})
export default class AppBoxHead extends Vue {
  style: any = {}
  @Prop() appConfig!: AppConfig
  @Inject() closeApp!: () => void
  @Inject() toggleSize!: () => void
  @Inject() minimizeApp!: () => void

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setStyle(style: any):void {
    this.style = style
  }

  mounted(): void {
    createMovableBox(this.$refs.head as any, this.appConfig)
  }
}
</script>

<style scoped lang="scss">

</style>
