class Observe {
  constructor(data) {
    // Object.defineProperty 只能劫持已存在的属性（vue2 中为此单独写了 $set $delete)
    this.walk(data);
  }
  // 循环对象，对属性依次劫持
  walk(data) {
    // 重新定义属性
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}

function defineReactive(target, key, value) {
  observe(value);
  Object.defineProperty(target, key, {
    get() {
      // 取值的时候，执行 get
      return value;
    },
    set(newValue) {
      // 赋值的时候，执行 set
      if (newValue === value) {
        return;
      }
      value = newValue;
    },
  });
}

export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== "object" || data === null) {
    return;
  }

  // 如果一个对象被劫持过，就不再需要劫持了（要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过）

  return new Observe(data);
}
