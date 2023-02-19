import { initMixin } from "./init";
import { initLifecycle } from "./lifecycle";
import { nextTick } from './observe/watcher'

/**
 * @param {*} options 传入的选项
 */
function Vue(options) {
  this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initMixin(Vue);
initLifecycle(Vue);

export default Vue;
