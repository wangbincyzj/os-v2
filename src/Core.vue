<template>
  <div class="w-full h-full" @contextmenu.prevent>
    <AppBox v-for="appConfig in runningList" :key="appConfig.name" :appConfig="appConfig"/>
    <Context/>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {AppConfig} from "@/types/App"
import AppBox from "@/components/appBox/AppBox.vue"
import Context from "@/components/context/Context.vue"


const CoreModule = namespace("core")

@Component({
  components: {Context, AppBox}
})
export default class Core extends Vue {
  @CoreModule.State("runningList") runningList !: AppConfig[]


}
</script>

<style scoped lang="scss">

</style>
