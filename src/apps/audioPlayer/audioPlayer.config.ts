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
    left: "200px",
    top: "100px"
  },
  ext: ["m4a"]
}

export default audioPlayerConfig
