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
}
