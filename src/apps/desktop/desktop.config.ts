import {AppConfig} from "@/types/App"

const desktopConfig: AppConfig = {
  name: "desktop",
  iconName: "icon-Windows",
  zIndex: 1,
  hiddenInDesktop: true,
  order: 1,
  windowMode:{
    mode: "FULL"
  }
}

export default desktopConfig
