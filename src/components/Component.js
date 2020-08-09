import { toTypeString } from "../utils/object";

export default class Component {
  constructor() {
    this.children = [];
    this.props = Object.create(null);
  }
  get type () {
    return this.constructor.name;
  }
  get vDom () {
    return this.render().vDom;
  }
  setAttribute (name, value) {
    this.props[name] = value;
    if (name.match(/^on([\s\S]+)$/)) {
      // console.log(RegExp.$1)
    }
    this[name] = value;
  }
  mountTo (range) {
    this.range = range;
    this.update();
  }
  update () {
    // let placeholder = document.createComment('-------------------');
    // let range = document.createRange();
    // range.setStart(this.range.endContainer, this.range.endOffset);
    // range.setEnd(this.range.endContainer, this.range.endOffset);
    // range.insertNode(placeholder);
    // this.range.deleteContents();
    let vDom = this.vDom;
    if (this.oldVDom) {
      const isSameNode = (node1, node2) => {
        if (!node1 || !node2) {
          console.log(node1, node2);
        }
        if (node1.type !== node2.type)
          return false;
        for (let name in node1.props) {
          // 函数事件跳过
          // if (toTypeString(node1.props[name]) === '[object Function]' &&
          //   toTypeString(node2.props[name]) === '[object Function]')
          //   continue;
          // 对象, 数组跳过
          if (typeof (node1.props[name]) === 'object' &&
            typeof (node2.props[name]) === 'object' &&
            JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name]))
            continue;
          if (node1.props[name] !== node2.props[name])
            return false;
        }
        if (Object.keys(node1.props).length !== Object.keys(node2.props).length)
          return false;
        return true;
      }
      const isSameTree = (tree1, tree2) => {
        if (!isSameNode(tree1, tree2))
          return false;
        if (tree1.children.length !== tree2.children.length)
          return false;
        for (let i = 0; i < tree1.children.length; i++)
          if (!isSameTree(tree1.children[i], tree2.children[i]))
            return false;
        return true;
      }

      const replace = (newTree, oldTree) => {
        if (isSameTree(newTree, oldTree))
          return;
        if (!isSameNode(newTree, oldTree)) {
          newTree.mountTo(oldTree.range);
        } else {
          for (let i = 0, len = newTree.children.length; i < len; i++) {
            replace(newTree.children[i], oldTree.children[i]);
          }
        }
      }
      replace(vDom, this.oldVDom);

    } else {
      vDom.mountTo(this.range);
    }
    this.oldVDom = vDom;
  }
  appendChild (vChild) {
    this.children.push(vChild)
  }
  setState (state = {}) {
    const merge = (oldState, newState) => {
      for (let key in newState) {
        if (toTypeString(newState[key]) === '[object Object]') {
          if (toTypeString(oldState[key]) !== '[object Object]')
            oldState[key] = {};
          merge(oldState[key], newState[key]);
        } else if (toTypeString(newState[key]) === '[object Array]') {
          if (toTypeString(oldState[key]) !== '[object Array]')
            oldState[key] = [];
          merge(oldState[key], newState[key]);
        } else {
          oldState[key] = newState[key];
        }
      }
    }
    if (!this.state) this.state = state || {};
    merge(this.state, state);

    this.update();
  }
}