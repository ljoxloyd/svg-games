const theSentinel = Symbol();
let theListener;

export const signal = (value) => {
  const observers = new Set();
  const cleanups = [];

  const get = () => {
    if (theListener != null) {
      observers.add(theListener);
    }
    return value;
  };

  const set = (next) => {
    if (typeof next == "function") {
      value = next(value);
    } else {
      value = next;
    }
    notify();
  };

  const notify = () => {
    while (cleanups.length) {
      cleanups.pop()();
    }
    for (let observer of observers) {
      const undo = observer();
      if (undo) cleanups.push(undo);
    }
  };

  return (next = theSentinel) => {
    if (next == theSentinel) {
      return get();
    } else {
      return set(next);
    }
  };
};

export const effect = (func) => {
  theListener = func;
  func();
  theListener = undefined;
};
