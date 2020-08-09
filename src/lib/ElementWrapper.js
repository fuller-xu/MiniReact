let childrenSymbol = Symbol('children');
/**
 * 虚拟节点
 */
export default class ElementWrapper {
  constructor(type) {
    // this.root = document.createElement(type);
    this.type = type;
    this.props = Object.create(null);
    this.children = [];
    this[childrenSymbol] = [];
  }

  setAttribute (name, value) {
    // if (name.match(/^on([\s\S]+)$/)) {
    //   this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase()), value);
    // }
    // if (name === 'className') name = 'class';
    // this.root.setAttribute(name, value);
    this.props[name] = value;
  }
  appendChild (vChild) {
    // let range = document.createRange();
    // if (this.root.children.length) {
    //   range.setStartAfter(this.root.lastChild);
    //   range.setEndAfter(this.root.lastChild);
    // } else {
    //   range.setStart(this.root, 0);
    //   range.setEnd(this.root, 0);
    // }
    // vChild.mountTo(range);
    this[childrenSymbol].push(vChild);
    this.children.push(vChild.vDom);
  }
  mountTo (range) {
    this.range = range;

    let placeholder = document.createComment('-------------------');
    let endRange = document.createRange();
    endRange.setStart(range.endContainer, range.endOffset);
    endRange.setEnd(range.endContainer, range.endOffset);
    endRange.insertNode(placeholder);

    range.deleteContents();
    let element = document.createElement(this.type);
    // set attributes
    for (let name in this.props) {
      let value = this.props[name];
      if (name.match(/^on([\s\S]+)$/)) {
        element.addEventListener(RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase()), value);
      }
      if (name === 'className') name = 'class';
      element.setAttribute(name, value);
    }

    // appendChild
    for (let vChild of this.children) {
      let range = document.createRange();
      if (element.children.length) {
        range.setStartAfter(element.lastChild);
        range.setEndAfter(element.lastChild);
      } else {
        range.setStart(element, 0);
        range.setEnd(element, 0);
      }
      vChild.mountTo(range);
    }
    // range.deleteContents();
    // range.insertNode(this.root);
    range.insertNode(element);
  }
  get vDom () {
    return this;
  }
}