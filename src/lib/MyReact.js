import ElementWrapper from './ElementWrapper';
import TextWrapper from './TextWrapper';
import Component from '../components/Component';

export default class MyReact {
  static createElement (type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
      element = new ElementWrapper(type);
    } else {
      element = new type;
    }
    // set attribute
    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
    }
    // add children
    const recursion = (children) => {
      for (let child of children) {
        if (child === null || child === void 0)
          child = '';
        if (Array.isArray(child)) {
          recursion(child);
          return;
        } else {
          if (typeof child === 'string')
            child = new TextWrapper(child);
          else {
            if (!(child instanceof Component) &&
              !(child instanceof ElementWrapper) &&
              !(child instanceof TextWrapper)) {
              child = new TextWrapper(String(child));
            }
          }
          element.appendChild(child);
        }
      }
    }
    recursion(children, element);

    return element;
  }
  static render (vdom, element) {
    let range = document.createRange();
    if (element.children.length) {
      range.setStartAfter(element.lastChild);
      range.setEndAfter(element.lastChild);
    } else {
      range.setStart(element, 0);
      range.setEnd(element, 0);
    }
    vdom.mountTo(range);
  }
}