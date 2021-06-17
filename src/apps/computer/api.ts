import {requests, RestRequest} from "@/utils/request"
import {File} from "@/types/entity/File"
import {Resp} from "@/types/interface/response"
import {getExtIcon} from "@/utils/jsUtils"

import config from "@/config"

class FileApi extends RestRequest<File>{

  constructor(url: string) {
    super(url)
  }

  add(data: File): Promise<Resp<File>> {
    if(data.isDir){
      data.icon = "icon-wenjianjia"
    }else{
      data.icon = getExtIcon(data.ext as string)
    }
    return super.add(data)
  }

  upload = (file: any, fileName?: string) => {
    const form = new FormData()
    form.append("file", file)
    if(fileName){
      form.append("fileName", fileName)
    }
    return requests.post(this.url + "/upload", form)
  }

  newFile = (data: File) => requests.post(this.url + "/newFile", data)

  getStream = (src: string) => requests.get(this.url + `/fileStream/${src}`)

  getUrl = (src: string) => requests.get(this.url + `/fileUrl/${src}`)

  createStream = (src: string) =>  config.baseUrl + this.url + `/fileStream/${src}`
}


export const fileApi = new FileApi("/file")
