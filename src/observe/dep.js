let id = 0;

// 每个属性有一个 dep（属性就是被观察者），watcher 是观察者
// 属性变了会通知 watcher 来更新
class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 这里存放着当前属性对应的 watcher
  }

  depend() {
    // watcher 记录 dep
    Dep.target.addDep(this);
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
Dep.target = null;

export default Dep;