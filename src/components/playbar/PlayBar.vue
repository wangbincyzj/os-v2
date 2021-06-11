<template>
  <div class="w-full h-12 bg-blue-100 flex flex-col items-center justify-center select-none">
    <div class="line h-1 bg-blue-700 w-full relative hover:bg-blue-800" ref="line" @click.self="handleBarClick">
      <div class="indicator" @mousedown="handleStart" :style="{left: `${rate*100}%`}"  ref="indicator"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"


@Component
export default class PlayBar extends Vue {
  $refs!: {
    line: HTMLElement,
    indicator: HTMLElement
  }
  rate = 0
  onMoving= false
  // 这个组件围绕rate
  handleStart(e: MouseEvent):void {
    const handleMove = (e: MouseEvent): void => {
      const dx = e.x - startX
      rate = startLeft + dx*100/totalWidth
      rate = Math.max(0, Math.min(rate, 100))/100
      dom.style.left = rate * 100 + "%"
      this.$emit("updateRate", rate)   // ------------------------------- 开始设置rate
      this.rate = rate
    }
    const handleMoveEnd = () => {
      this.onMoving = false
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleMoveEnd)
      this.$emit("updateRateEnd", rate)  // ---------------------------------- 结束设置rate
    }
    const startX = e.x
    let rate = this.rate
    this.onMoving = true
    const totalWidth = this.$refs.line.offsetWidth
    const dom = this.$refs.indicator
    const startLeft = (parseFloat(dom.style.left) || 0)
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleMoveEnd)
  }

  handleBarClick(e: MouseEvent): void {
    this.rate = e.offsetX / e.target.offsetWidth
    this.$emit("updateRateEnd", this.rate)
  }

  setRate(rate: number): void {
    if(!this.onMoving){
      this.rate = rate
    }
  }
}
</script>

<style scoped lang="scss">
.indicator{
  width: 12px;
  height: 12px;
  background-color: white;
  position: absolute;
  transform: translate(-6px, -4px);
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #333;
  &:hover{
    transform: translate(-6px, -4px) scale(1.2);
    border-color: orange;
  }
}
</style>
