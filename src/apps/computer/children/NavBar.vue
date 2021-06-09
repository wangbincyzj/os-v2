<template>
  <div class="bg-white py-1 px-2 flex select-none">
    <div class="navIcon">
      <i class="el-icon-arrow-left mx-1 "
         @click="handleGoBack"
         :class="[isBottomStack?'text-gray-300':'text-black  cursor-pointer hover:text-blue-600']"
      />
      <i class="el-icon-arrow-right mx-1"
         @click="handleGoForward"
         :class="[isTopStack?'text-gray-300':'text-black  cursor-pointer hover:text-blue-600']"
      />
    </div>
    <div class="routes flex-1 bg-gray-200 flex">
      <div
        class="item text-xs flex items-center bg-gray-300 h-full px-2 cursor-pointer hover:bg-gray-400 hover:text-white"
        v-for="item in navRoutes" :key="item.id">
        <WIcon :name="item.icon" class="mr-1"/>
        <span class="name">{{ item.name }}</span>
        <i class="el-icon-arrow-right text-white"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
import {Route} from "@/apps/computer/Computer.vue"
import WIcon from "@/components/wIcon/WIcon.vue"

@Component({
  components: {WIcon}
})
export default class NavBar extends Vue {
  @Prop() navRoutes!: Route[]
  @Prop() isBottomStack!: boolean
  @Prop() isTopStack!: boolean

  handleGoBack():void {
    if(!this.isBottomStack){
      this.$emit("goBack")
    }
  }

  handleGoForward():void {
    if(!this.isTopStack){
      this.$emit("goForward")
    }
  }
}
</script>

<style scoped lang="scss">

</style>
