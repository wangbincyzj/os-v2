import {AppConfig} from "@/types/App"

const yourChatConfig: AppConfig = {
  name: "yourChat",
  desktopName: "你们聊",
  iconName: "icon-liaotian",
  windowMode: {
    mode: "FLOAT",
    appHead: true,
    width: "800px",
    height: "500px",
    left: "200px",
    top: "100px"
  },
  ext: ["txt", "md"]
}

export default yourChatConfig
