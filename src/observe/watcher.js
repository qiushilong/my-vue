import Dep from "./dep";

// 复用、方便维护、局部更新
// 每个组件里面一个 watcher
let id = 0;

/**
 * 1. 当我们创建渲染 watcher 时，我们会把当前的渲染watcher 放到 Dep.target
 * 2. 调用 _render() 会取值，走到 get 上
 */

// 不同组件有不同的 watcher
class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;
    this.renderWatcher = options;
    this.getter = fn; // getter 意味着调用这个函数可以发生取值操作
    this.deps = []; // 后续计算属性和清理工作需要用到
    this.depsId = new Set();
    this.get();
  }

  get() {
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }

  addDep(dep) {
    let id = dep.id;
    if(!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }

  update() {
    // this.get(); // 重新渲染
    queueWatcher(this); // 不立即渲染
  }

  run() {
    this.get();
  }
}

// 需要给每个属性增加一个 dep，目的就是收集 watcher
// 一个视图中，有多少个属性（n 个属性会对应一个视图）
// n 个 dep 对应一个 watcher
// 一个属性对应着多个视图，一个 dep 对应多个 watcher
// dep 和 watcher 是多对多的关系

let queue = [];
let has = {};
let pending = false; // 防抖

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)

  queue = [];
  has = {};
  pending = false;

  flushQueue.forEach(q => q.run())
}

function queueWatcher(watcher) {

  const id = watcher.id;
  if(!has[id]) {
    queue.push(watcher)
    has[id] = true;
    // 不管 update 执行多少次，最终只执行一轮刷新操作
    if(!pending) {
      nextTick(flushSchedulerQueue, 0)
      pending = true;
    }
  }
}

let callbacks = [];
let waiting = false;

function flushCallbacks() {
  let cbs = callbacks.slice(0)
  waiting = true;
  callbacks = [];
  cbs.forEach(cb => cb())
}

// 优雅降级，先考虑 promise(微任务)，后考虑 setTimeout（宏任务）
let timerFunc;
if(Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if(MutationObserver) {
  let observer = new MutationObserver(flushCallbacks); // 
  let textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2;
  }
} else if(setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks)
  }
}

export function nextTick(cb) {
  callbacks.push(cb);
  if(!waiting) {
    timerFunc();
  }
}

export default Watcher;
