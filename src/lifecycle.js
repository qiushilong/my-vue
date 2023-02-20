import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode,  } from "./vdom/index"

function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if(typeof tag === 'string') {
    // 将真实节点和虚拟节点对应起来
    vnode.el = document.createElement(tag);

    patchProps(vnode.el, data);

    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function patchProps(el, props) {
  for(let key in props) {
    if(key === 'style') {
      for(let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

function patch(oldVNode, vnode, callback) {
  const isRealElement = oldVNode.nodeType;
  if(isRealElement) {
    // 初渲染
    const elm = oldVNode;
    const parentElm = elm.parentNode;
    
    let newElm = createElm(vnode)
    console.log(newElm)
    // 
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm);

    callback(newElm)
  } else {
    // diff 算法
  }
}

export function initLifecycle(Vue) {
    // 将 vnode 转化为真实 dom
    Vue.prototype._update = function(vnode) {
      const el = this.$el;
      console.log('el', el, vnode)
      // patch 既有初始化的功能，又有更新的功能
      patch(el, vnode, (el) => this.$el = el);
    }

    // _c('div', {}, ...children)
    Vue.prototype._c = function() {
      return createElementVNode(this, ...arguments)
    }

    // _v(text)
    Vue.prototype._v = function() {
      return createTextVNode(this, ...arguments)
    }

    Vue.prototype._s = function(value) {
      if(typeof value !== 'object') return value;
      return JSON.stringify(value);
    }

    Vue.prototype._render = function() {
      // 当渲染的时候会去实例中取值，我们就可以将属性和视图绑定在一起
      return this.$options.render.call(this); // 通过ast语法树转义生成的render方法
    }
}

export function mountComponent(vm, el) {
    vm.$el = el;
    // 1. 调用 render 方法产生虚拟 dom
    // vm._update(vm._render());
    const updateComponent = () => {
      vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, true);


    // 2. 根据 虚拟dom 生成真实 dom

    // 3. 插入到 el 中
}

/*
  vue 核心流程：
  1. 创造了响应式数据
  2. 模板转换为 ast 语法树
  3. 将 ast 语法树转换成 render 函数
  4. 后续每次数据更新可以只执行 render 函数（无需再次执行 ast 转换过程）
  5. render 函数会去生成虚拟节点（使用响应式数据）
  6. 根据虚拟节点生成真实的 dom
*/

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]

  if(handlers) {
    handlers.forEach(handlers => handlers.call(vm))
  }
}