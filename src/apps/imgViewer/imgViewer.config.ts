import {AppConfig} from "@/types/App"

const imgViewerConfig: AppConfig = {
  name: "imgViewer",
  iconName: "icon-tupian1",
  desktopName: "图片查看",
  windowMode: {
    mode: "FLOAT",
    appHead: true,
    width: "800px",
    height: "500px",
    left: "200px",
    top: "100px"
  },
  ext: ["png","jfif", "jpg"]
}

export default imgViewerConfig
