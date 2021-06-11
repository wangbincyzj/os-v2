<template>
  <div class="w-full bg-white h-full flex flex-col select-none">
    <audio class="w-full" :src="src" ref="player"
           @canplay="handleCanplay"
           @play="playing=true"
           @pause="playing=false"
           @timeupdate="handleTimeupdate"/>
    <PlayBar ref="playBar"
             @updateRate="handleUpdateRate"
             @updateRateEnd="handleUpdateRateEnd"/>
    <div class="control flex-1 bg-blue-100 flex items-center">

      <div class="time mx-2">
        {{ current|timeFilter }}/{{ total|timeFilter }}
      </div>
      <div class="play mx-2 flex justify-center" @click="handleTogglePlay">
        <WIcon v-if="!playing" class="cursor-pointer" size="50" name="icon-zanting"/>
        <WIcon v-else class="cursor-pointer" size="50" name="icon-bofang"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
import {AppConfig, AppMsg, EventReceiver} from "@/types/App"
import {EmitEventType} from "@/types/Core"
import {fileApi} from "@/apps/computer/api"
import PlayBar from "@/components/playbar/PlayBar.vue"
import WIcon from "@/components/wIcon/WIcon.vue"

@Component({
    components: {WIcon, PlayBar},
    filters: {
      timeFilter(val: number) {
        let min = parseInt((val / 60).toString())
        let sec = parseInt((val - min * 60).toString())
        return `${(min.toString()).padStart(2, "0")}:${(sec.toString().padStart(2, "0"))}`
      }
    }
  }
)
export default class AudioPlayer extends Vue implements EventReceiver {
  public $refs!: {
    player: HTMLMediaElement,
    playBar: PlayBar
  }
  @Prop() appConfig!: AppConfig
  src = ""
  total = 0
  current = 0
  onMoving = false
  playing = false

  get player(): HTMLMediaElement {
    return this.$refs.player
  }

  onReceiveMsg(msg: AppMsg): void {
    fileApi.getUrl(msg.data.src).then(ret => {
      this.src = ret.msg
    })
  }

  handleCanplay(): void {
    this.player.play()
    this.total = this.player.duration
  }

  handleTimeupdate(): void {
    if (this.$refs.playBar) {
      if (!this.onMoving) this.current = this.player.currentTime
      this.$refs.playBar.setRate(this.player.currentTime / this.player.duration)
    }
  }

  handleUpdateRate(rate: number): void {
    this.onMoving = true
    this.current = this.total * rate
  }

  handleUpdateRateEnd(rate: number): void {
    this.onMoving = false
    this.player.currentTime = rate * this.player.duration
  }

  handleTogglePlay():void {
    if(!this.player) return
    this.playing ? this.player.pause() : this.player.play()
  }

  mounted(): void {
    this.$core.emit(EmitEventType.REGISTER, {name: "audioPlayer", vm: this})
    console.log(this.appConfig)
  }

}
</script>

<style scoped lang="scss">

</style>
