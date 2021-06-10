export const parseFileName = (str: string): [string, string | null] => {
  const arr = str.split(".")
  const name = arr[0]
  const ext = arr.length === 1 ? null : arr[arr.length - 1]
  return [name, ext]
}


export const createTextForm = (content: string, filename: string, file?: any): FormData => {
  const form = new FormData()
  if (typeof file === "string") {
    form.set("ext", "txt")
    form.set("pid", "4")
  } else {
    Object.keys(file).forEach(key => {
      if (file[key]) form.set(key, file[key])
    })
  }
  form.set("icon", "icon-jishiben")
  form.set("file", new File([content], filename, {type: "text/plain"}))
  return form
}

