<template>
  <div class="contextMenu text-sm bg-gray-200" :style="computedStyle" v-if="show">
    <div @click="handleEventClick(event)" class="event hover:bg-white relative flex justify-between items-center" v-for="(event, index) in events" :key="index">
      <span  class="text">{{event.label}}</span>
      <i v-if="event.children" class="el-icon-arrow-right"/>
      <div v-if="event.children" class="absolute children bg-gray-200">
        <div  @click="handleEventClick(event)" class="event hover:bg-gray-50 relative" v-for="(event, index) in event.children" :key="index">
          <span class="text">{{event.label}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {contextEvent} from "@/store/context/context"

const ContextModule = namespace("context")

@Component
export default class Context extends Vue {
  @ContextModule.State show!: boolean

  @ContextModule.State style!: {left: string, top: string}

  @ContextModule.State events!: contextEvent[]

  @ContextModule.Action closeContext!: () => void

  get computedStyle(): any {
    return this.style
  }

  handleEventClick(e: contextEvent):void {
    e.handler?.call(this)
    this.closeContext()
  }
}
</script>

<style scoped lang="scss">
.contextMenu{
  padding: 5px 0;
  user-select: none;
  z-index: 99999999;
  position: fixed;
  min-width: 250px;
  border: 1px solid #666;
  box-shadow: 2px 2px 3px #333;
  .event{
    padding: 2px 0;
    padding-left: 12px;
    &:hover{
      .children{
        display: block;
      }
    }
  }
  .children{
    padding: 5px 0;
    display: none;
    right: -100%;
    top: -3px;
    min-width: 250px;
    border: 1px solid #666;
    box-shadow: 2px 2px 3px #333;
  }
}
</style>
