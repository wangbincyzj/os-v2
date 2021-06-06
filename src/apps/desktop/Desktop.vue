<template>
  <div class="w-full h-full relative flex flex-col select-none desktop">
    <DeskArea :appList="appList"/>
    <StatusBar :runningList="runningList"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import StatusBar from "@/apps/desktop/children/statusBar/StatusBar.vue"
import DeskArea from "@/apps/desktop/children/deskArea/DeskArea.vue"
import {namespace} from "vuex-class"
import {AppConfig} from "@/types/App"

const CoreModule = namespace("core")

@Component({
  components: {DeskArea, StatusBar}
})
export default class Desktop extends Vue {
  @CoreModule.State("runningList") runningList!: AppConfig[]
  @CoreModule.State("appList") appList!: AppConfig[]
}
</script>

<style scoped lang="scss">
.desktop{
  background: url("/bg.png") center;
  background-size: cover;
}
</style>
