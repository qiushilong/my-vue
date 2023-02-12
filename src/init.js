import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
import { mountComponent } from './lifecycle'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // vue 自带变量 $options 实现
    const vm = this;
    vm.$options = options;

    // 初始化状态
    initState(vm);

    // todo...
    if (options.el) {
      vm.$mount(options.el); // 实现数据挂载
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    // 先检查是否写了 render 函数
    if (!ops.render) {
      let template;
      // 再检查是否写了 template，没写 template 使用 el 属性
      if (!ops.template && el) {
        template = el.outerHTML;
      } else {
        if (el) {
          template = ops.template;
        }
      }
      if (template) {
        // 这里需要对模板进行编译
        const render = compileToFunction(template);
        ops.render = render;
      } 
    }

    mountComponent(vm, el);

    // script 标签引用的 vue.global.js 这个编译过程是再浏览器运行的
    // runtime 是不包含模板编译的，整个编译是再打包的时候通过 loader 来转义 .vue 文件的，用 runtime 的时候不能使用 template

    // ops.render;
  };
}
