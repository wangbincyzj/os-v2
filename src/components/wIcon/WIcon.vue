<template>
  <svg class="icon" aria-hidden="true" :style="{fontSize: iconSize}">
    <use :xlink:href="`#${iconName}`"></use>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"

@Component
export default class WIcon extends Vue {
  @Prop({required: true}) name!: string

  @Prop() size!: string | number

  get iconName(): string {
    return this.name
  }

  get iconSize(): string {
    const size = this.size || 16
    return size + "px"
  }
}
</script>

<style scoped lang="scss">
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
