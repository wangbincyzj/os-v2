import {AppConfig} from "@/types/App"

const audioPlayerConfig: AppConfig = {
  name: "audioPlayer",
  iconName: "icon-audio",
  desktopName: "音频播放",
  hiddenInDesktop: true,
  windowMode: {
    mode: "FLOAT",
    appHead: true,
    width: "800px",
    height: "150px",
    left: "210px",
    top: "150px"
  },
  ext: ["m4a"]
}

export default audioPlayerConfig
