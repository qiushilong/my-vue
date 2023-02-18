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
    this.get(); // 重新渲染
  }
}

// 需要给每个属性增加一个 dep，目的就是收集 watcher
// 一个视图中，有多少个属性（n 个属性会对应一个视图）
// n 个 dep 对应一个 watcher
// 一个属性对应着多个视图，一个 dep 对应多个 watcher
// dep 和 watcher 是多对多的关系

export default Watcher;
