<template>
  <div class="flex-1  flex flex-col items-start">
    <div v-for="app in desktopAppList" :key="app.schema"
         @dblclick="boot(app.name)"
         class="
         flex flex-col justify-between
         bg-gray-50 bg-opacity-10 hover:bg-opacity-40 text-white
          py-2  icon-wrapper items-center m-2 rounded cursor-default ">
      <div class="logo">
        <WIcon :name="app.iconName" size="40"/>
        <i class="iconfont icon-Windows"/>
      </div>
      <div class="name">{{ app.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from "vue-property-decorator"
import {AppConfig} from "@/types/App"
import WIcon from "@/components/wIcon/WIcon.vue"

@Component({
  components: {WIcon}
})
export default class DeskArea extends Vue {
  @Prop() appList!: AppConfig[]
  @Inject() boot!: (app: string) => void

  get desktopAppList(): AppConfig[] {
    return this.appList.filter(app => !app.hiddenInDesktop)
  }
}
</script>

<style scoped lang="scss">
.icon-wrapper {
  width: 120px;
  height: 100px;
}
</style>
