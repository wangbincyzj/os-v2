import {requests, RestRequest} from "@/utils/request"

class FileApi extends RestRequest<any>{

  constructor(url: string) {
    super(url)
  }

  newFile = (data: any) => requests.post(this.url + "/newFile", data)
}


export const fileApi = new FileApi("/file")
