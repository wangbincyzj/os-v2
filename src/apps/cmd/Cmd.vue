<template>
  <div class=" p-2 fixed bottom-0 w-full flex">
    <el-input v-model="command"/>
    <el-button>发送</el-button>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator"
import {AppComponent} from "@/types/App"

@Component
export default class Cmd extends AppComponent {
  command = ""
}
</script>

<style scoped lang="scss">

</style>
