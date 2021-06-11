import {requests, RestRequest} from "@/utils/request"
import {User} from "@/types/entity/User"
import {Resp} from "@/types/interface/response"

class UserApi extends RestRequest<User>{
  login(username: string, password: string): Promise<Resp<User>> {
    return requests.post(this.url + "/login", {username, password})
  }
}


export const userApi = new UserApi("/user")
