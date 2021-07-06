import {AppConfig} from "@/types/App"

const textEditorConfig: AppConfig = {
  name: "textEditor",
  desktopName: "文本编辑器",
  iconName: "icon-txt",
  windowMode: {
    mode: "FLOAT",
    appHead: true,
    width: "800px",
    height: "500px",
    left: "144px",
    top: "140px"
  },
  ext: ["txt", "md"],
  resize: true
}

export default textEditorConfig
