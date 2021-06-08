export class Stack<T> {
  index = 0
  arr: T[] = []
  register: ((t: T[])=> void)[] = []

  push = (t: T): void => {
    this.arr.push(t)
    this.notify()
  }

  pop = (): void => {
    if(this.arr.pop()){
      this.notify()
    }
  }

  subscribe = (fn: (t: T[])=>void): void => {
    this.register.push(fn)
    fn.call(null, this.arr)
  }

  notify = (): void => {
    this.register.forEach(callback => callback.call(this, this.arr))
  }
}
