import Vue from "vue"
import {Core} from "@/types/Core"


declare module "*.vue" {

  export default Vue
}

declare module "vue/types/vue" {
  interface Vue {
    $core: Core
  }
}
