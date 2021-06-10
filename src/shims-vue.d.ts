import Vue from "vue"
import {Core} from "@/types/Core"


declare module "*.vue" {
  export default Vue
}

declare global {
  interface Window {
    isDev: boolean;
  }
}


declare module "vue/types/vue" {
  interface Vue {
    $core: Core
    $refs: { [key: string]: any };
  }
}
