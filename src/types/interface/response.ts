export interface Resp<T> {
  code: number
  msg: string
  data: T
}

export interface RespList<T> {
  code: number
  msg: string
  data: Array<T>
}

export interface RespPage<T> {
  data: Page<T>
}


interface Page<T> {
  records: T[] | null
  total: number,
  size: number,
  current: number,
  pages: number
}
