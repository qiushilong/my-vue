import { mergeOptions } from "./util";

export function initGlobalAPI(Vue) {
  Vue.options = {};

  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    // 我们希望将用户的 options 和 全局的 options 合并
    // {create: [fn]} => {create: [fn1, fn2]}
    return this;
  };
}
