<template>
  <div class="w-full h-full bg-green-100 flex ">
    <div class="list h-full bg-green-50"></div>
    <div class="content h-full flex-1"></div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"

@Component
export default class YourChat extends Vue {

}
</script>

<style scoped lang="scss">
.list{
  width: 200px;
}
</style>
