import { initMixin } from "./init";

/**
 * @param {*} options 传入的选项
 */
function Vue(options) {
  this._init(options);
}

initMixin(Vue);

export default Vue;
