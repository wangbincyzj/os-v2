import {requests, RestRequest} from "@/utils/request"
import {File} from "@/types/entity/File"
import config from "@/config"

class FileApi extends RestRequest<File>{

  constructor(url: string) {
    super(url)
  }

  newFile = (data: File) => requests.post(this.url + "/newFile", data)

  getStream = (src: string) => requests.get(this.url + `/fileStream/${src}`)

  getUrl = (src: string) => requests.get(this.url + `/fileUrl/${src}`)

  createStream = (src: string) =>  config.baseUrl + this.url + `/fileStream/${src}`
}


export const fileApi = new FileApi("/file")
