// https://www.regexper.com
// vue2 中采用的是正则
// vue3 中采用的是一个一个字符解析
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配 <xxx ，结果是 标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配 </xxx> ，结果是 标签名

const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function parseHTML(html) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = []; // 用来存放元素
  let currentParent; // 指向的是栈中的最后一个
  let root;

  function createASTElement(tag, attrs = []) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null,
    };
  }

  function start(tag, attrs) {
    let node = createASTElement(tag, attrs);
    if (!root) {
      // 看是否为空树，空则为根节点
      root = node;
    }
    if (currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }
    stack.push(node);
    currentParent = node;
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    if (text) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      });
    }
  }

  function end(tag) {
    stack.pop();
    currentParent = stack[stack.length - 1];
  }

  function advance(n) {
    html = html.substring(n);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);

      // 如果不是开始标签的结束，就一直匹配下去
      let attr, end;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        });
      }

      if (end) {
        advance(end[0].length);
      }

      return match;
    }

    return false; // 不是开始标签
  }

  while (html) {
    // 如果 textEnd 为 0，表示是一个开始或者结束标签
    // 如果 textEnd 大于 0，表示是文本的结束位置
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();

      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }

      break;
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd);

      if (text) {
        chars(text);
        advance(text.length);
        continue;
      }

      break;
    }
  }

  return root;
}

/**
 * @description 将 template 解析成 render 函数
 */
export function compileToFunction(template) {
  // 1. 将 template 转化为 ast 语法树
  let ast = parseHTML(template);
  console.dir(ast);

  // 2. 生成 render 方法（render 方法执行后返回的结果就是 虚拟DOM）

  console.log(template);
}
