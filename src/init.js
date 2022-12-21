import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // vue 自带变量 $options 实现
    const vm = this;
    vm.$options = options;

    // 初始化状态
    initState(vm);

    // todo...
  };
}
