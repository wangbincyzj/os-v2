<template>
  <div class="absolute w-full bottom-0 h-10 bg-opacity-60 bg-gray-400 flex justify-between items-center">
    <div class="icons flex items-center">
      <div class="startMenu h-10 w-10 flex justify-center items-center text-white hover:bg-gray-500 hover:text-blue-400">
        <WIcon name="icon-windows" size="30"/>
      </div>
      <div
        @click="handleClick(app)"
        v-for="app in showList"
        :key="app.name"
        :class="[highestIndex === app.zIndex &&'active']"
        class="startMenu p-1 h-10 w-10 flex justify-center items-center text-white hover:bg-gray-500 hover:text-blue-400 border-b-2 border-purple-800">
        <WIcon :name="app.iconName" size="30"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
import WIcon from "@/components/wIcon/WIcon.vue"
import {AppConfig} from "@/types/App"
import {namespace} from "vuex-class"

const CoreModule = namespace("core")


@Component({
  components: {WIcon}
})
export default class StatusBar extends Vue {
  @Prop() runningList!: AppConfig[]
  @CoreModule.State highestIndex!: number

  get showList(): AppConfig[] {
    return this.runningList.filter(app => !app.hiddenInDesktop)
  }

  isHighestApp= (appConfig: AppConfig): boolean  => {
    return this.highestIndex === appConfig.zIndex
  }

  handleClick(appConfig: AppConfig): void {
    if(this.highestIndex === appConfig.zIndex){
      this.$store.dispatch("core/minimize", appConfig.name)
    }else{
      this.$store.dispatch("core/top", appConfig.name)
    }
  }
}
</script>

<style scoped lang="scss">
.active{
  background-color: lightpink;
}
</style>
