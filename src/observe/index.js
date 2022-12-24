import { newArrayProto } from "./array";

class Observer {
  constructor(data) {
    // Object.defineProperty 只能劫持已存在的属性（vue2 中为此单独写了 $set $delete)

    // 给数据加了一个标识，如果数据上有 __ob__，说明数据被劫持过了
    data.__ob__ = this;

    // 防止对象 __ob__ 死循环，设置 __ob__ 为不可枚举
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });

    if (Array.isArray(data)) {
      // 这里我们可以重写数组中的方法
      data.__proto__ = newArrayProto;

      // 对数组中的对象进行劫持
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  // 循环对象，对属性依次劫持
  walk(data) {
    // 重新定义属性
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
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
      observe(newValue);
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
  if (data.__ob__ instanceof Observer) {
    return data.__ob__;
  }

  return new Observer(data);
}
