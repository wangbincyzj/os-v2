export const parseFileName = (str: string): [string, string|null] => {
  const arr = str.split(".")
  const name = arr[0]
  const ext = arr.length === 1 ? null : arr[arr.length - 1]
  return [name, ext]
}
