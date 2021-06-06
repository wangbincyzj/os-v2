<template>
  <div class="flex-1  flex flex-col items-start">
    <div v-for="app in desktopAppList" :key="app.schema"
         class="bg-gray-50 bg-opacity-10 hover:bg-opacity-40 py-2 flex flex-col icon-wrapper items-center m-2 rounded cursor-pointer justify-between">
      <div class="logo">
        <WIcon :name="app.iconName" size="40"/>
        <i class="iconfont icon-Windows"/>
      </div>
      <div class="name">{{app.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
import {AppConfig} from "@/types/App"
import WIcon from "@/components/wIcon/WIcon.vue"
@Component({
  components: {WIcon}
})
export default class DeskArea extends Vue {
  @Prop() appList!: AppConfig[]

  get desktopAppList(): AppConfig[] {
    return this.appList.filter(app => !app.hiddenInDesktop)
  }
}
</script>

<style scoped lang="scss">
.icon-wrapper{
  width: 120px;
  height: 100px;
}
</style>
