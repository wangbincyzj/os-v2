import {AppConfig} from "@/types/App"

const textEditorConfig: AppConfig = {
  name: "textEditor",
  iconName: "icon-txt",
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

export default textEditorConfig
