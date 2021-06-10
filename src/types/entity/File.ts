export class File {
  id: string|number  = ""
  name = ""
  ext: string | null = ""
  pid: number | null = null
  isDir: boolean | null = null
  password: string | null = null
  src: string | null = null
  create_time: string | null = null
  update_time: string | null = null
  icon  = ""
  renaming = false
  temp = false
}
