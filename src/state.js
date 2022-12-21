import { observe } from "./observe/index"; // 写全

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  // todo...
}

function initData(vm) {
  let data = vm.$options.data;
  // vue2 中 option data 可以是对象，可以是函数
  data = typeof data === "function" ? data.call(vm) : data;

  vm._data = data;

  // 对数据进行劫持 vue2 中使用 defineProperty
  observe(data);

  // 将 vm._data 用 vm 来代理，使用值时不在需要加上 _data
  for (let key in data) {
    proxy(vm, "_data", key);
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(value) {
      vm[target][key] = value;
    },
  });
}
