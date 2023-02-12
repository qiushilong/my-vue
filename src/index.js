import { initMixin } from "./init";
import { initLifecycle } from "./lifecycle";

/**
 * @param {*} options 传入的选项
 */
function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLifecycle(Vue);

export default Vue;
