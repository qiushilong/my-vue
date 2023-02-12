
// h() _c()
export function createElementVNode(vm, tag, data = {}, ...children) {
    if(data == null) {
        data = {}
    }
    let key = data.key;
    delete data.key;
    return {
        vm,
        tag,
        key,
        data,
        children
    }
}

// _v()
export function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// ast 描述的语法本身，vdom 描述的是 dom 元素
function vnode(vm, tag, key, data, children, text) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}