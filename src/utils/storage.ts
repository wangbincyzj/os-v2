interface ExpiredData {
  expire: number | undefined,
  data: any
}


export const getItem = (key: string): null | any => {
  const str = localStorage.getItem(key)
  if (!str) return null
  const obj: ExpiredData = JSON.parse(str)
  if (obj.expire && obj.expire < Date.now()) {
    localStorage.removeItem(key)
    return null
  }else{
    return obj.data
  }
}


export const setItem = (key: string, data: any, expire?: number): void => {
  localStorage.setItem(key, JSON.stringify({
    data, expire
  }))
}


// export const
