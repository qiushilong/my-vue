// 我们希望重写数组中的部分方法

let oldArrayProto = Array.prototype;

export let newArrayProto = Object.create(oldArrayProto);

// 所有变异方法（能修改原数组）
let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];

methods.forEach((method) => {
  // 重写数组的方法
  newArrayProto[method] = function (...args) {
    // 内部调用原来的方法（切片编程 aop）
    const result = oldArrayProto[method].call(this, ...args);

    // 对新增的数据进行劫持
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice": // splice(0,1,{a:1},{b:1})
        inserted = args.slice(2);
      default:
        break;
    }

    if (inserted) {
      // this 谁调用指向谁
      console.log("this", this);
      ob.observeArray(inserted);
    }

    return result;
  };
});
