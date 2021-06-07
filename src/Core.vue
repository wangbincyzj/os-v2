<template>
  <div class="w-full h-full">
    <AppBox v-for="appConfig in runningList" :key="appConfig.name" :appConfig="appConfig"/>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {AppConfig} from "@/types/App"
import AppBox from "@/components/appBox/AppBox.vue"


const CoreModule = namespace("core")

@Component({
  components: {AppBox}
})
export default class Core extends Vue {
  @CoreModule.State("runningList") runningList !: AppConfig[]


}
</script>

<style scoped lang="scss">

</style>
