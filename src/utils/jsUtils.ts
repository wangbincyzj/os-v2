import {AppConfig} from "@/types/App"

export const parseFileName = (str: string): [string, string | null] => {
  const arr = str.split(".")
  const name = arr[0]
  const ext = arr.length === 1 ? null : arr[arr.length - 1]
  return [name, ext]
}


export const createTextForm = (content: string, filename: string, file?: any): FormData => {
  const form = new FormData()
  if (typeof file === "string") {
    form.set("pid", "4")
  } else {
    Object.keys(file).forEach(key => {
      if (file[key]) form.set(key, file[key])
    })
  }
  form.set("ext", "txt")
  form.set("icon", "icon-jishiben")
  form.set("file", new File([content], filename, {type: "text/plain"}))
  return form
}


export function createMovableBox(dom: HTMLElement, appConfig: AppConfig): any {
  const handleMoveEnd = () => {
    window.removeEventListener("mousemove", handleMoseMove)
    // window.removeEventListener("mouseup", handleMoveEnd)
  }

  const handleMoseMove = (ev: MouseEvent) => {
    const deltaX = ev.x - x0
    const  deltaY = ev.y - y0
    appConfig.windowMode.left = left0 + deltaX + "px"
    appConfig.windowMode.top = top0 + deltaY + "px"
  }

  let x0: number, y0: number, left0: number, top0: number
  dom.addEventListener("mousedown", (ev: MouseEvent) => {
    if(ev.target !== dom){
      return
    }
    x0 = ev.x
    y0 = ev.y
    left0 = parseInt(appConfig.windowMode.left as string)
    top0 = parseInt(appConfig.windowMode.top as string)
    window.addEventListener("mousemove", handleMoseMove)
  })

  window.addEventListener("mouseup", handleMoveEnd)



}
