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
    left: "250px",
    top: "124px"
  },
  ext: ["png","jfif", "jpg"],
  resize: true
}

export default imgViewerConfig
