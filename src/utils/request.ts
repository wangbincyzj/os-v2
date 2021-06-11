import axios from "axios"
import {RequestArgs} from "@/types/interface/requestArgs"
import {Resp, RespList, RespPage} from "@/types/interface/response"
import {Page} from "@/types/interface/page"
//import { config } from "@/config/config"
//import Vue from "vue"
export const baseUrl =  "http://10.86.9.180:10086/domain"

axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 3000

axios.interceptors.response.use(value => {
  const data = value.data

  // 这里是数据层报错
  if (data.code === 999) {
    //Vue.prototype.$msg.warning(data.msg)
  }
  return data
}, err => {  // 这里是http层报错
  return {code: 999, msg: err.toString()}
})

axios.interceptors.request.use(value => {
  return value
})


const get = function (url: string, params?: RequestArgs): Promise<Resp<never>> {
  return axios.get(url, {params})
}

const post = function (url: string, data?: RequestArgs): Promise<Resp<never>> {
  return axios.post(url, data)
}

const put = function (url: string, data?: RequestArgs): Promise<Resp<never>> {
  return axios.put(url, data)
}

const del = function (url: string, id: number): Promise<Resp<never>> {
  return axios.delete(url + `/${id}`)
}

export const requests = {
  get, post, put, del
}


/**
 * Rest请求基础类
 * @param url 资源路径
 */
export class RestRequest<T> {
  url: string

  constructor(url: string) {
    this.url = url
  }

  getById(id: number): Promise<Resp<T>> {
    return requests.get(this.url + `/${id}`)
  }

  getList(data?: T): Promise<RespList<T>> {
    return requests.get(this.url, data)
  }

  getPage(data?: T & Page): Promise<RespPage<T>> {
    return requests.get(this.url, data)
  }

  add(data: T): Promise<Resp<T>> {
    return requests.post(this.url, data)
  }

  update(data: T): Promise<Resp<T>> {
    return requests.put(this.url, data)
  }

  delete(id: number): Promise<Resp<T>> {
    return requests.del(this.url, id)
  }
}


