import {requests, RestRequest} from "@/utils/request"
import {File} from "@/types/entity/File"

class FileApi extends RestRequest<File>{

  constructor(url: string) {
    super(url)
  }

  newFile = (data: File) => requests.post(this.url + "/newFile", data)

  getStream = (src: string) => requests.get(this.url + `/fileStream/${src}`)
}


export const fileApi = new FileApi("/file")
