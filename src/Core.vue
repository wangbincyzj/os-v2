<template>
  <div class="w-full h-full">
    <!--<component v-for="appConfig in runningList" :key="appConfig.name" :is="appConfig.name"/>-->
    <Desktop/>
    <!--<Cmd/>-->
  </div>
</template>

<script lang="ts">
import Cmd from "@/apps/cmd/Cmd.vue"

import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {AppConfig} from "@/types/App"
import Desktop from "@/apps/desktop/Desktop.vue"

const CoreModule = namespace("core")

@Component({
  components: {Desktop, Cmd}
})
export default class Core extends Vue {
  @CoreModule.State("runningList") runningList !: AppConfig[]

  @CoreModule.Action("bootstrap") bootstrap!: (appName: string) => void


}
</script>

<style scoped lang="scss">

</style>
