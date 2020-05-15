import { update } from "./DOMRenderer";

var renderingComponent;
function setRenderingComponent(comp) {
  renderingComponent = comp;
}

window.getRenderingComponent = () => renderingComponent;

class State extends EventTarget {
  on(eventType, listener) {
    return this.addEventListener(eventType, (e) => {
      listener(e.detail);
    });
  }
  notify(eventType, detail) {
    return this.dispatchEvent(new CustomEvent(eventType, { detail }));
  }
}

function observe(component, state, context) {
  observeState: {
    let stateChangeCounter = 0;
    for (let [key, value] of Object.entries(state)) {
      const fieldName = `__${key}__`;
      state[fieldName] = value;
      Object.defineProperty(state, key, {
        get() {
          return state[fieldName];
        },
        set(newValue) {
          state[fieldName] = newValue;
          stateChangeCounter++;
          /* Batch updates */
          if (stateChangeCounter === 1) {
            window.queueMicrotask(() => {
              stateChangeCounter = 0;
              component.__dirty__ = true;
              update(component);
            });
          }
        },
      });
    }
  }

  observeContext: {
    Object.getOwnPropertySymbols(context).forEach((key) => {
      let value = context[key];
      let stateChangeCounter = 0;
      const observers = new Set();

      Object.defineProperty(context, key, {
        get() {
          if (renderingComponent && !observers.has(renderingComponent)) {
            observers.add(renderingComponent);
            renderingComponent.__subscriptions__.push({
              context,
              key,
              cancel: () => observers.delete(renderingComponent),
            });
          }
          return value;
        },
        set(newValue) {
          value = newValue;
          stateChangeCounter++;
          /* Batch updates */
          if (stateChangeCounter === 1) {
            window.queueMicrotask(() => {
              stateChangeCounter = 0;
              for (let observer of observers) {
                observer.__dirty__ = true;
                update(observer, key);
              }
            });
          }
        },
      });
    });
  }

  state.notify("init");
}

export { State, observe, setRenderingComponent };
