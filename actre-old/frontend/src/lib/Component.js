import { isVoidElement, toKebabCase } from "./Utilities";

function isComposite(component) {
  return typeof component.__type__ === "function";
}

function getComponentName(component) {
  return isComposite(component) ? component.__type__.name : component.__type__;
}

function DOMComponent(tag, node) {
  const element = node || document.createElement(tag);
  const __cache__ = { style: {} };

  function component(props) {
    for (let [name, value] of Object.entries(props)) {
      // If hydrating, don't trigger style recalculation and relayout
      if (node && (name === "className" || name === "style")) continue;

      if (name === "style") {
        for (let [styleName, styleValue] of Object.entries(value)) {
          styleName = toKebabCase(styleName);
          if (styleValue !== __cache__.style[styleName]) {
            element.style[styleName] = __cache__.style[styleName] = styleValue;
          }
        }
      } else {
        if (value !== __cache__[name]) {
          element[name] = __cache__[name] = value;
        }
      }
    }
  }

  component.__$node__ = element;
  if (!node && !isVoidElement(tag)) component.__$node__.append(new Text());
  component.__$first_child__ = component.__$node__.firstChild;

  return component;
}

const mountComponent = (component) => (cursor) => {
  cursor.after(component.__$node__);
};

const moveComponent = (component) => (cursor) => {
  if (isComposite(component)) {
    let cur = component.__$first__;
    while (cur !== component.__$last__) {
      cursor.after(cur);
      cursor = cursor.nextSibling;
      cur = cur.nextSibling;
    }
    cursor.after(cur);
  } else {
    cursor.after(component.__$node__);
  }
};

const unmountComponent = (component) => () => {
  if (isComposite(component)) {
    let cur = component.__$first__;
    while (cur !== component.__$last__) {
      let next = cur.nextSibling;
      cur.remove();
      cur = next;
    }
    cur.remove();
  } else {
    component.__$node__.remove();
  }
};

export {
  isComposite,
  getComponentName,
  DOMComponent,
  mountComponent,
  moveComponent,
  unmountComponent,
};
