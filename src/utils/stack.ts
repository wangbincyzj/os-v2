export class Stack<T> {
  private index = -1
  private arr: T[] = []
  private register: ((t: T[], index: number) => void)[] = []

  get isTopStack(): boolean {
    return this.index === this.arr.length - 1
  }

  get isBottomStack(): boolean {
    return this.index === 0
  }

  private notify = (): void => {
    this.register.forEach(callback => callback.call(this, this.arr, this.index))
  }

  subscribe = (fn: (t: T[], index: number) => void): void => {
    this.register.push(fn)
    fn.call(this, this.arr, this.index)
  }

  push = (t: T): void => {
    if (!this.isTopStack) {
      this.arr = this.arr.slice(0, this.index + 1)
    }
    this.arr.push(t)
    this.index = this.arr.length - 1
    this.notify()
  }

  go = (index: number): boolean => {
    if(index === 0 || index >= this.arr.length){
      return false
    }else{
      this.index = index
      this.notify()
      return true
    }
  }

  back = (): boolean => {
    if(this.isBottomStack){
      return false
    }else{
      this.index--
      this.notify()
      return true
    }
  }

  forward = (): boolean => {
    if(this.isTopStack){
      return false
    }else{
      this.index++
      this.notify()
      return true
    }
  }

  constructor(t: T) {
    this.push(t)
  }
}
