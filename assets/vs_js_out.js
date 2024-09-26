(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/vidstack/prod/chunks/vidstack-CRlI3Mh7.js
  function flushEffects() {
    scheduledEffects = true;
    queueMicrotask(runEffects);
  }
  function runEffects() {
    if (!effects.length) {
      scheduledEffects = false;
      return;
    }
    runningEffects = true;
    for (let i4 = 0; i4 < effects.length; i4++) {
      if (effects[i4].$st !== STATE_CLEAN)
        runTop(effects[i4]);
    }
    effects = [];
    scheduledEffects = false;
    runningEffects = false;
  }
  function runTop(node) {
    let ancestors = [node];
    while (node = node[SCOPE]) {
      if (node.$e && node.$st !== STATE_CLEAN)
        ancestors.push(node);
    }
    for (let i4 = ancestors.length - 1; i4 >= 0; i4--) {
      updateCheck(ancestors[i4]);
    }
  }
  function root(init) {
    const scope = createScope();
    return compute(scope, !init.length ? init : init.bind(null, dispose.bind(scope)), null);
  }
  function peek(fn) {
    return compute(currentScope, fn, null);
  }
  function untrack(fn) {
    return compute(null, fn, null);
  }
  function tick() {
    if (!runningEffects)
      runEffects();
  }
  function getScope() {
    return currentScope;
  }
  function scoped(run, scope) {
    try {
      return compute(scope, run, null);
    } catch (error) {
      handleError(scope, error);
      return;
    }
  }
  function getContext(key2, scope = currentScope) {
    return scope?.$cx[key2];
  }
  function setContext(key2, value, scope = currentScope) {
    if (scope)
      scope.$cx = { ...scope.$cx, [key2]: value };
  }
  function onDispose(disposable) {
    if (!disposable || !currentScope)
      return disposable || NOOP;
    const node = currentScope;
    if (!node.$d) {
      node.$d = disposable;
    } else if (Array.isArray(node.$d)) {
      node.$d.push(disposable);
    } else {
      node.$d = [node.$d, disposable];
    }
    return function removeDispose() {
      if (node.$st === STATE_DISPOSED)
        return;
      disposable.call(null);
      if (isFunction$1(node.$d)) {
        node.$d = null;
      } else if (Array.isArray(node.$d)) {
        node.$d.splice(node.$d.indexOf(disposable), 1);
      }
    };
  }
  function dispose(self = true) {
    if (this.$st === STATE_DISPOSED)
      return;
    if (this.$h) {
      if (Array.isArray(this.$h)) {
        for (let i4 = this.$h.length - 1; i4 >= 0; i4--) {
          dispose.call(this.$h[i4]);
        }
      } else {
        dispose.call(this.$h);
      }
    }
    if (self) {
      const parent = this[SCOPE];
      if (parent) {
        if (Array.isArray(parent.$h)) {
          parent.$h.splice(parent.$h.indexOf(this), 1);
        } else {
          parent.$h = null;
        }
      }
      disposeNode(this);
    }
  }
  function disposeNode(node) {
    node.$st = STATE_DISPOSED;
    if (node.$d)
      emptyDisposal(node);
    if (node.$s)
      removeSourceObservers(node, 0);
    node[SCOPE] = null;
    node.$s = null;
    node.$o = null;
    node.$h = null;
    node.$cx = defaultContext;
    node.$eh = null;
  }
  function emptyDisposal(scope) {
    try {
      if (Array.isArray(scope.$d)) {
        for (let i4 = scope.$d.length - 1; i4 >= 0; i4--) {
          const callable = scope.$d[i4];
          callable.call(callable);
        }
      } else {
        scope.$d.call(scope.$d);
      }
      scope.$d = null;
    } catch (error) {
      handleError(scope, error);
    }
  }
  function compute(scope, compute2, observer) {
    const prevScope = currentScope, prevObserver = currentObserver;
    currentScope = scope;
    currentObserver = observer;
    try {
      return compute2.call(scope);
    } finally {
      currentScope = prevScope;
      currentObserver = prevObserver;
    }
  }
  function handleError(scope, error) {
    if (!scope || !scope.$eh)
      throw error;
    let i4 = 0, len = scope.$eh.length, currentError = error;
    for (i4 = 0; i4 < len; i4++) {
      try {
        scope.$eh[i4](currentError);
        break;
      } catch (error2) {
        currentError = error2;
      }
    }
    if (i4 === len)
      throw currentError;
  }
  function read() {
    if (this.$st === STATE_DISPOSED)
      return this.$v;
    if (currentObserver && !this.$e) {
      if (!currentObservers && currentObserver.$s && currentObserver.$s[currentObserversIndex] == this) {
        currentObserversIndex++;
      } else if (!currentObservers)
        currentObservers = [this];
      else
        currentObservers.push(this);
    }
    if (this.$c)
      updateCheck(this);
    return this.$v;
  }
  function write(newValue) {
    const value = isFunction$1(newValue) ? newValue(this.$v) : newValue;
    if (this.$ch(this.$v, value)) {
      this.$v = value;
      if (this.$o) {
        for (let i4 = 0; i4 < this.$o.length; i4++) {
          notify(this.$o[i4], STATE_DIRTY);
        }
      }
    }
    return this.$v;
  }
  function createScope() {
    return new ScopeNode();
  }
  function createComputation(initialValue, compute2, options) {
    return new ComputeNode(initialValue, compute2, options);
  }
  function isNotEqual(a3, b2) {
    return a3 !== b2;
  }
  function isFunction$1(value) {
    return typeof value === "function";
  }
  function updateCheck(node) {
    if (node.$st === STATE_CHECK) {
      for (let i4 = 0; i4 < node.$s.length; i4++) {
        updateCheck(node.$s[i4]);
        if (node.$st === STATE_DIRTY) {
          break;
        }
      }
    }
    if (node.$st === STATE_DIRTY)
      update(node);
    else
      node.$st = STATE_CLEAN;
  }
  function cleanup(node) {
    if (node.$h)
      dispose.call(node, false);
    if (node.$d)
      emptyDisposal(node);
    node.$eh = node[SCOPE] ? node[SCOPE].$eh : null;
  }
  function update(node) {
    let prevObservers = currentObservers, prevObserversIndex = currentObserversIndex;
    currentObservers = null;
    currentObserversIndex = 0;
    try {
      cleanup(node);
      const result = compute(node, node.$c, node);
      updateObservers(node);
      if (!node.$e && node.$i) {
        write.call(node, result);
      } else {
        node.$v = result;
        node.$i = true;
      }
    } catch (error) {
      updateObservers(node);
      handleError(node, error);
    } finally {
      currentObservers = prevObservers;
      currentObserversIndex = prevObserversIndex;
      node.$st = STATE_CLEAN;
    }
  }
  function updateObservers(node) {
    if (currentObservers) {
      if (node.$s)
        removeSourceObservers(node, currentObserversIndex);
      if (node.$s && currentObserversIndex > 0) {
        node.$s.length = currentObserversIndex + currentObservers.length;
        for (let i4 = 0; i4 < currentObservers.length; i4++) {
          node.$s[currentObserversIndex + i4] = currentObservers[i4];
        }
      } else {
        node.$s = currentObservers;
      }
      let source;
      for (let i4 = currentObserversIndex; i4 < node.$s.length; i4++) {
        source = node.$s[i4];
        if (!source.$o)
          source.$o = [node];
        else
          source.$o.push(node);
      }
    } else if (node.$s && currentObserversIndex < node.$s.length) {
      removeSourceObservers(node, currentObserversIndex);
      node.$s.length = currentObserversIndex;
    }
  }
  function notify(node, state) {
    if (node.$st >= state)
      return;
    if (node.$e && node.$st === STATE_CLEAN) {
      effects.push(node);
      if (!scheduledEffects)
        flushEffects();
    }
    node.$st = state;
    if (node.$o) {
      for (let i4 = 0; i4 < node.$o.length; i4++) {
        notify(node.$o[i4], STATE_CHECK);
      }
    }
  }
  function removeSourceObservers(node, index) {
    let source, swap;
    for (let i4 = index; i4 < node.$s.length; i4++) {
      source = node.$s[i4];
      if (source.$o) {
        swap = source.$o.indexOf(node);
        source.$o[swap] = source.$o[source.$o.length - 1];
        source.$o.pop();
      }
    }
  }
  function noop(...args) {
  }
  function isNull(value) {
    return value === null;
  }
  function isUndefined(value) {
    return typeof value === "undefined";
  }
  function isNil(value) {
    return isNull(value) || isUndefined(value);
  }
  function isObject(value) {
    return value?.constructor === Object;
  }
  function isNumber(value) {
    return typeof value === "number" && !Number.isNaN(value);
  }
  function isString(value) {
    return typeof value === "string";
  }
  function isBoolean(value) {
    return typeof value === "boolean";
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isArray(value) {
    return Array.isArray(value);
  }
  function isDOMEvent(event2) {
    return !!event2?.[DOM_EVENT];
  }
  function listenEvent(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    return onDispose(() => target.removeEventListener(type, handler, options));
  }
  function anySignal(...signals) {
    const controller = new AbortController(), options = { signal: controller.signal };
    function onAbort(event2) {
      controller.abort(event2.target.reason);
    }
    for (const signal2 of signals) {
      if (signal2.aborted) {
        controller.abort(signal2.reason);
        break;
      }
      signal2.addEventListener("abort", onAbort, options);
    }
    return controller.signal;
  }
  function isPointerEvent(event2) {
    return !!event2?.type.startsWith("pointer");
  }
  function isTouchEvent(event2) {
    return !!event2?.type.startsWith("touch");
  }
  function isMouseEvent(event2) {
    return /^(click|mouse)/.test(event2?.type ?? "");
  }
  function isKeyboardEvent(event2) {
    return !!event2?.type.startsWith("key");
  }
  function wasEnterKeyPressed(event2) {
    return isKeyboardEvent(event2) && event2.key === "Enter";
  }
  function isKeyboardClick(event2) {
    return isKeyboardEvent(event2) && (event2.key === "Enter" || event2.key === " ");
  }
  function isDOMNode(node) {
    return node instanceof Node;
  }
  function setAttribute(host, name, value) {
    if (!host) return;
    else if (!value && value !== "" && value !== 0) {
      host.removeAttribute(name);
    } else {
      const attrValue = value === true ? "" : value + "";
      if (host.getAttribute(name) !== attrValue) {
        host.setAttribute(name, attrValue);
      }
    }
  }
  function setStyle(host, property, value) {
    if (!host) return;
    else if (!value && value !== 0) {
      host.style.removeProperty(property);
    } else {
      host.style.setProperty(property, value + "");
    }
  }
  function toggleClass(host, name, value) {
    host.classList[value ? "add" : "remove"](name);
  }
  function signal(initialValue, options) {
    const node = createComputation(initialValue, null, options), signal2 = read.bind(node);
    signal2[SCOPE] = true;
    signal2.set = write.bind(node);
    return signal2;
  }
  function isReadSignal(fn) {
    return isFunction$1(fn) && SCOPE in fn;
  }
  function computed(compute2, options) {
    const node = createComputation(
      options?.initial,
      compute2,
      options
    ), signal2 = read.bind(node);
    signal2[SCOPE] = true;
    return signal2;
  }
  function effect$1(effect2, options) {
    const signal2 = createComputation(
      null,
      function runEffect() {
        let effectResult = effect2();
        isFunction$1(effectResult) && onDispose(effectResult);
        return null;
      },
      void 0
    );
    signal2.$e = true;
    update(signal2);
    return dispose.bind(signal2, true);
  }
  function isWriteSignal(fn) {
    return isReadSignal(fn) && "set" in fn;
  }
  function createContext(provide) {
    return { id: Symbol(), provide };
  }
  function provideContext(context, value, scope = getScope()) {
    const hasProvidedValue = !isUndefined(value);
    setContext(context.id, hasProvidedValue ? value : context.provide?.(), scope);
  }
  function useContext(context) {
    const value = getContext(context.id);
    return value;
  }
  function hasProvidedContext(context) {
    return !isUndefined(getContext(context.id));
  }
  function createInstanceProps(props) {
    const $props = {};
    for (const name of Object.keys(props)) {
      const def = props[name];
      $props[name] = signal(def, def);
    }
    return $props;
  }
  function createComponent(Component2, init) {
    return root(() => {
      currentInstance.$$ = new Instance(Component2, getScope(), init);
      const component = new Component2();
      currentInstance.$$.component = component;
      currentInstance.$$ = null;
      return component;
    });
  }
  function prop(target, propertyKey, descriptor) {
    if (!target[PROPS]) target[PROPS] = /* @__PURE__ */ new Set();
    target[PROPS].add(propertyKey);
  }
  function method(target, propertyKey, descriptor) {
    if (!target[METHODS]) target[METHODS] = /* @__PURE__ */ new Set();
    target[METHODS].add(propertyKey);
  }
  function useState(state) {
    return useContext(state);
  }
  function runAll(fns, arg) {
    for (const fn of fns) fn(arg);
  }
  function camelToKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function kebabToCamelCase(str) {
    return str.replace(/-./g, (x2) => x2[1].toUpperCase());
  }
  function uppercaseFirstChar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function unwrap(fn) {
    return isFunction(fn) ? fn() : fn;
  }
  function ariaBool(value) {
    return value ? "true" : "false";
  }
  function keysOf(obj) {
    return Object.keys(obj);
  }
  function deferredPromise() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  function waitTimeout(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  function animationFrameThrottle(func) {
    let id3 = -1, lastArgs;
    function throttle2(...args) {
      lastArgs = args;
      if (id3 >= 0) return;
      id3 = window.requestAnimationFrame(() => {
        func.apply(this, lastArgs);
        id3 = -1;
        lastArgs = void 0;
      });
    }
    return throttle2;
  }
  function waitIdlePeriod(callback, options) {
    return new Promise((resolve) => {
      requestIdleCallback((deadline) => {
        callback?.(deadline);
        resolve();
      }, options);
    });
  }
  function throttle(fn, interval, options) {
    var timeoutId = null;
    var throttledFn = null;
    var leading = options && options.leading;
    var trailing = options && options.trailing;
    if (leading == null) {
      leading = true;
    }
    if (trailing == null) {
      trailing = !leading;
    }
    if (leading == true) {
      trailing = false;
    }
    var cancel = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    var flush = function() {
      var call = throttledFn;
      cancel();
      if (call) {
        call();
      }
    };
    var throttleWrapper = function() {
      var callNow = leading && !timeoutId;
      var context = this;
      var args = arguments;
      throttledFn = function() {
        return fn.apply(context, args);
      };
      if (!timeoutId) {
        timeoutId = setTimeout(function() {
          timeoutId = null;
          if (trailing) {
            return throttledFn();
          }
        }, interval);
      }
      if (callNow) {
        callNow = false;
        return throttledFn();
      }
    };
    throttleWrapper.cancel = cancel;
    throttleWrapper.flush = flush;
    return throttleWrapper;
  }
  function debounce(fn, wait, callFirst) {
    var timeout = null;
    var debouncedFn = null;
    var clear = function() {
      if (timeout) {
        clearTimeout(timeout);
        debouncedFn = null;
        timeout = null;
      }
    };
    var flush = function() {
      var call = debouncedFn;
      clear();
      if (call) {
        call();
      }
    };
    var debounceWrapper = function() {
      if (!wait) {
        return fn.apply(this, arguments);
      }
      var context = this;
      var args = arguments;
      var callNow = callFirst && !timeout;
      clear();
      debouncedFn = function() {
        fn.apply(context, args);
      };
      timeout = setTimeout(function() {
        timeout = null;
        if (!callNow) {
          var call = debouncedFn;
          debouncedFn = null;
          return call();
        }
      }, wait);
      if (callNow) {
        return debouncedFn();
      }
    };
    debounceWrapper.cancel = clear;
    debounceWrapper.flush = flush;
    return debounceWrapper;
  }
  function inferAttributeConverter(value) {
    if (value === null) return NULLABLE_STRING;
    switch (typeof value) {
      case "undefined":
        return STRING;
      case "string":
        return STRING;
      case "boolean":
        return BOOLEAN;
      case "number":
        return NUMBER;
      case "function":
        return FUNCTION;
      case "object":
        return isArray(value) ? ARRAY : OBJECT;
      default:
        return STRING;
    }
  }
  function Host(Super, Component2) {
    class MaverickElement extends Super {
      static attrs;
      static [ATTRS] = null;
      static get observedAttributes() {
        if (!this[ATTRS] && Component2.props) {
          const map = /* @__PURE__ */ new Map();
          for (const propName of Object.keys(Component2.props)) {
            let attr = this.attrs?.[propName], attrName = isString(attr) ? attr : !attr ? attr : attr?.attr;
            if (attrName === false) continue;
            if (!attrName) attrName = camelToKebabCase(propName);
            map.set(attrName, {
              prop: propName,
              converter: attr && !isString(attr) && attr?.converter || inferAttributeConverter(Component2.props[propName])
            });
          }
          this[ATTRS] = map;
        }
        return this[ATTRS] ? Array.from(this[ATTRS].keys()) : [];
      }
      $;
      [SETUP_STATE] = SetupState.Idle;
      [SETUP_CALLBACKS] = null;
      keepAlive = false;
      forwardKeepAlive = true;
      get scope() {
        return this.$.$$.scope;
      }
      get attachScope() {
        return this.$.$$.attachScope;
      }
      get connectScope() {
        return this.$.$$.connectScope;
      }
      get $props() {
        return this.$.$$.props;
      }
      get $state() {
        return this.$.$$.$state;
      }
      get state() {
        return this.$.state;
      }
      constructor(...args) {
        super(...args);
        this.$ = scoped(() => createComponent(Component2), null);
        this.$.$$.addHooks(this);
        if (Component2.props) {
          const props = this.$props, descriptors = Object.getOwnPropertyDescriptors(this);
          for (const prop2 of Object.keys(descriptors)) {
            if (prop2 in Component2.props) {
              props[prop2].set(this[prop2]);
              delete this[prop2];
            }
          }
        }
      }
      attributeChangedCallback(name, _2, newValue) {
        const Ctor = this.constructor;
        if (!Ctor[ATTRS]) {
          super.attributeChangedCallback?.(name, _2, newValue);
          return;
        }
        const def = Ctor[ATTRS].get(name);
        if (def) this[def.prop] = def.converter(newValue);
      }
      connectedCallback() {
        const instance = this.$?.$$;
        if (!instance || instance.destroyed) return;
        if (this[SETUP_STATE] !== SetupState.Ready) {
          setup.call(this);
          return;
        }
        if (!this.isConnected) return;
        if (this.hasAttribute("keep-alive")) {
          this.keepAlive = true;
        }
        instance.connect();
        if (isArray(this[SETUP_CALLBACKS])) runAll(this[SETUP_CALLBACKS], this);
        this[SETUP_CALLBACKS] = null;
        const callback = super.connectedCallback;
        if (callback) scoped(() => callback.call(this), this.connectScope);
        return;
      }
      disconnectedCallback() {
        const instance = this.$?.$$;
        if (!instance || instance.destroyed) return;
        instance.disconnect();
        const callback = super.disconnectedCallback;
        if (callback) callback.call(this);
        if (!this.keepAlive && !this.hasAttribute("keep-alive")) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              if (!this.isConnected) instance.destroy();
            });
          }, 0);
        }
      }
      [SETUP]() {
        const instance = this.$.$$, Ctor = this.constructor;
        if (instance.destroyed) return;
        const attrs = Ctor[ATTRS];
        if (attrs) {
          for (const attr of this.attributes) {
            let def = attrs.get(attr.name);
            if (def && def.converter) {
              instance.props[def.prop].set(def.converter(this.getAttribute(attr.name)));
            }
          }
        }
        instance.setup();
        instance.attach(this);
        this[SETUP_STATE] = SetupState.Ready;
        this.connectedCallback();
      }
      // @ts-expect-error
      subscribe(callback) {
        return this.$.subscribe(callback);
      }
      destroy() {
        this.disconnectedCallback();
        this.$.destroy();
      }
    }
    extendProto(MaverickElement, Component2);
    return MaverickElement;
  }
  function extendProto(Element2, Component2) {
    const ElementProto = Element2.prototype, ComponentProto = Component2.prototype;
    if (Component2.props) {
      for (const prop2 of Object.keys(Component2.props)) {
        Object.defineProperty(ElementProto, prop2, {
          enumerable: true,
          configurable: true,
          get() {
            return this.$props[prop2]();
          },
          set(value) {
            this.$props[prop2].set(value);
          }
        });
      }
    }
    if (ComponentProto[PROPS]) {
      for (const name of ComponentProto[PROPS]) {
        Object.defineProperty(ElementProto, name, {
          enumerable: true,
          configurable: true,
          get() {
            return this.$[name];
          },
          set(value) {
            this.$[name] = value;
          }
        });
      }
    }
    if (ComponentProto[METHODS]) {
      for (const name of ComponentProto[METHODS]) {
        ElementProto[name] = function(...args) {
          return this.$[name](...args);
        };
      }
    }
  }
  function setup() {
    if (this[SETUP_STATE] !== SetupState.Idle) return;
    this[SETUP_STATE] = SetupState.Pending;
    const parent = findParent(this), isParentRegistered = parent && window.customElements.get(parent.localName), isParentSetup = parent && parent[SETUP_STATE] === SetupState.Ready;
    if (parent && (!isParentRegistered || !isParentSetup)) {
      waitForParent.call(this, parent);
      return;
    }
    attach.call(this, parent);
  }
  async function waitForParent(parent) {
    await window.customElements.whenDefined(parent.localName);
    if (parent[SETUP_STATE] !== SetupState.Ready) {
      await new Promise((res) => (parent[SETUP_CALLBACKS] ??= []).push(res));
    }
    attach.call(this, parent);
  }
  function attach(parent) {
    if (!this.isConnected) return;
    if (parent) {
      if (parent.keepAlive && parent.forwardKeepAlive) {
        this.keepAlive = true;
        this.setAttribute("keep-alive", "");
      }
      const scope = this.$.$$.scope;
      if (scope) parent.$.$$.attachScope.append(scope);
    }
    this[SETUP]();
  }
  function findParent(host) {
    let node = host.parentNode, prefix = host.localName.split("-", 1)[0] + "-";
    while (node) {
      if (node.nodeType === 1 && node.localName.startsWith(prefix)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }
  function defineCustomElement(element, throws = false) {
    if (throws || !window.customElements.get(element.tagName)) {
      window.customElements.define(element.tagName, element);
    }
  }
  var SCOPE, scheduledEffects, runningEffects, currentScope, currentObserver, currentObservers, currentObserversIndex, effects, defaultContext, NOOP, STATE_CLEAN, STATE_CHECK, STATE_DIRTY, STATE_DISPOSED, ScopeNode, ScopeProto, ComputeNode, ComputeProto, EVENT, DOM_EVENT, DOMEvent, EventTriggers, EventsTarget, EventsController, effect, PROPS, METHODS, ON_DISPATCH, EMPTY_PROPS, Instance, currentInstance, ViewController, Component, State, requestIdleCallback, key, webkit, moz, ms, document$1, vendor, fscreen, functionThrottle, functionDebounce, t, e, n, o, l, r, STRING, NULLABLE_STRING, NUMBER, BOOLEAN, FUNCTION, ARRAY, OBJECT, ATTRS, SETUP, SETUP_STATE, SETUP_CALLBACKS, SetupState, Icon$24, Icon$0, Icon$5, Icon$8, Icon$11, Icon$13, Icon$16, Icon$19, Icon$22, Icon$26, Icon$27, Icon$31, Icon$33, Icon$34, Icon$35, Icon$39, Icon$40, Icon$53, Icon$54, Icon$56, Icon$59, Icon$60, Icon$61, Icon$62, Icon$63, Icon$74, Icon$77, Icon$81, Icon$88, Icon$104, Icon$105;
  var init_vidstack_CRlI3Mh7 = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-CRlI3Mh7.js"() {
      SCOPE = Symbol(0);
      scheduledEffects = false;
      runningEffects = false;
      currentScope = null;
      currentObserver = null;
      currentObservers = null;
      currentObserversIndex = 0;
      effects = [];
      defaultContext = {};
      NOOP = () => {
      };
      STATE_CLEAN = 0;
      STATE_CHECK = 1;
      STATE_DIRTY = 2;
      STATE_DISPOSED = 3;
      ScopeNode = function Scope() {
        this[SCOPE] = null;
        this.$h = null;
        if (currentScope)
          currentScope.append(this);
      };
      ScopeProto = ScopeNode.prototype;
      ScopeProto.$cx = defaultContext;
      ScopeProto.$eh = null;
      ScopeProto.$c = null;
      ScopeProto.$d = null;
      ScopeProto.append = function(child) {
        child[SCOPE] = this;
        if (!this.$h) {
          this.$h = child;
        } else if (Array.isArray(this.$h)) {
          this.$h.push(child);
        } else {
          this.$h = [this.$h, child];
        }
        child.$cx = child.$cx === defaultContext ? this.$cx : { ...this.$cx, ...child.$cx };
        if (this.$eh) {
          child.$eh = !child.$eh ? this.$eh : [...child.$eh, ...this.$eh];
        }
      };
      ScopeProto.dispose = function() {
        dispose.call(this);
      };
      ComputeNode = function Computation(initialValue, compute2, options) {
        ScopeNode.call(this);
        this.$st = compute2 ? STATE_DIRTY : STATE_CLEAN;
        this.$i = false;
        this.$e = false;
        this.$s = null;
        this.$o = null;
        this.$v = initialValue;
        if (compute2)
          this.$c = compute2;
        if (options && options.dirty)
          this.$ch = options.dirty;
      };
      ComputeProto = ComputeNode.prototype;
      Object.setPrototypeOf(ComputeProto, ScopeProto);
      ComputeProto.$ch = isNotEqual;
      ComputeProto.call = read;
      EVENT = Event;
      DOM_EVENT = Symbol("DOM_EVENT");
      DOMEvent = class extends EVENT {
        [DOM_EVENT] = true;
        /**
         * The event detail.
         */
        detail;
        /**
         * The event trigger chain.
         */
        triggers = new EventTriggers();
        /**
         * The preceding event that was responsible for this event being fired.
         */
        get trigger() {
          return this.triggers.source;
        }
        /**
         * The origin event that lead to this event being fired.
         */
        get originEvent() {
          return this.triggers.origin;
        }
        /**
         * Whether the origin event was triggered by the user.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted}
         */
        get isOriginTrusted() {
          return this.triggers.origin?.isTrusted ?? false;
        }
        constructor(type, ...init) {
          super(type, init[0]);
          this.detail = init[0]?.detail;
          const trigger = init[0]?.trigger;
          if (trigger) this.triggers.add(trigger);
        }
      };
      EventTriggers = class {
        chain = [];
        get source() {
          return this.chain[0];
        }
        get origin() {
          return this.chain[this.chain.length - 1];
        }
        /**
         * Appends the event to the end of the chain.
         */
        add(event2) {
          this.chain.push(event2);
          if (isDOMEvent(event2)) {
            this.chain.push(...event2.triggers);
          }
        }
        /**
         * Removes the event from the chain and returns it (if found).
         */
        remove(event2) {
          return this.chain.splice(this.chain.indexOf(event2), 1)[0];
        }
        /**
         * Returns whether the chain contains the given `event`.
         */
        has(event2) {
          return this.chain.some((e6) => e6 === event2);
        }
        /**
         * Returns whether the chain contains the given event type.
         */
        hasType(type) {
          return !!this.findType(type);
        }
        /**
         * Returns the first event with the given `type` found in the chain.
         */
        findType(type) {
          return this.chain.find((e6) => e6.type === type);
        }
        /**
         * Walks an event chain on a given `event`, and invokes the given `callback` for each trigger event.
         */
        walk(callback) {
          for (const event2 of this.chain) {
            const returnValue = callback(event2);
            if (returnValue) return [event2, returnValue];
          }
        }
        [Symbol.iterator]() {
          return this.chain.values();
        }
      };
      EventsTarget = class extends EventTarget {
        /** @internal type only */
        $ts__events;
        addEventListener(type, callback, options) {
          return super.addEventListener(type, callback, options);
        }
        removeEventListener(type, callback, options) {
          return super.removeEventListener(type, callback, options);
        }
      };
      EventsController = class {
        #target;
        #controller;
        get signal() {
          return this.#controller.signal;
        }
        constructor(target) {
          this.#target = target;
          this.#controller = new AbortController();
          onDispose(this.abort.bind(this));
        }
        add(type, handler, options) {
          if (this.signal.aborted) throw Error("aborted");
          this.#target.addEventListener(type, handler, {
            ...options,
            signal: options?.signal ? anySignal(this.signal, options.signal) : this.signal
          });
          return this;
        }
        remove(type, handler) {
          this.#target.removeEventListener(type, handler);
          return this;
        }
        abort(reason) {
          this.#controller.abort(reason);
        }
      };
      effect = effect$1;
      PROPS = /* @__PURE__ */ Symbol(0);
      METHODS = /* @__PURE__ */ Symbol(0);
      ON_DISPATCH = /* @__PURE__ */ Symbol(0);
      EMPTY_PROPS = {};
      Instance = class {
        /** @internal type only */
        $ts__events;
        /** @internal type only */
        $ts__vars;
        /* @internal */
        [ON_DISPATCH] = null;
        $el = signal(null);
        el = null;
        scope = null;
        attachScope = null;
        connectScope = null;
        component = null;
        destroyed = false;
        props = EMPTY_PROPS;
        attrs = null;
        styles = null;
        state;
        $state;
        #setupCallbacks = [];
        #attachCallbacks = [];
        #connectCallbacks = [];
        #destroyCallbacks = [];
        constructor(Component2, scope, init) {
          this.scope = scope;
          if (init?.scope) init.scope.append(scope);
          let stateFactory = Component2.state, props = Component2.props;
          if (stateFactory) {
            this.$state = stateFactory.create();
            this.state = new Proxy(this.$state, {
              get: (_2, prop2) => this.$state[prop2]()
            });
            provideContext(stateFactory, this.$state);
          }
          if (props) {
            this.props = createInstanceProps(props);
            if (init?.props) {
              for (const prop2 of Object.keys(init.props)) {
                this.props[prop2]?.set(init.props[prop2]);
              }
            }
          }
          onDispose(this.destroy.bind(this));
        }
        setup() {
          scoped(() => {
            for (const callback of this.#setupCallbacks) callback();
          }, this.scope);
        }
        attach(el) {
          if (this.el) return;
          this.el = el;
          this.$el.set(el);
          scoped(() => {
            this.attachScope = createScope();
            scoped(() => {
              for (const callback of this.#attachCallbacks) callback(this.el);
              this.#attachAttrs();
              this.#attachStyles();
            }, this.attachScope);
          }, this.scope);
          el.dispatchEvent(new Event("attached"));
        }
        detach() {
          this.attachScope?.dispose();
          this.attachScope = null;
          this.connectScope = null;
          this.el = null;
          this.$el.set(null);
        }
        connect() {
          if (!this.el || !this.attachScope || !this.#connectCallbacks.length) return;
          scoped(() => {
            this.connectScope = createScope();
            scoped(() => {
              for (const callback of this.#connectCallbacks) callback(this.el);
            }, this.connectScope);
          }, this.attachScope);
        }
        disconnect() {
          this.connectScope?.dispose();
          this.connectScope = null;
        }
        destroy() {
          if (this.destroyed) return;
          this.destroyed = true;
          scoped(() => {
            for (const callback of this.#destroyCallbacks) callback(this.el);
          }, this.scope);
          const el = this.el;
          this.detach();
          this.scope.dispose();
          this.#setupCallbacks.length = 0;
          this.#attachCallbacks.length = 0;
          this.#connectCallbacks.length = 0;
          this.#destroyCallbacks.length = 0;
          this.component = null;
          this.attrs = null;
          this.styles = null;
          this.props = EMPTY_PROPS;
          this.scope = null;
          this.state = EMPTY_PROPS;
          this.$state = null;
          if (el) delete el.$;
        }
        addHooks(target) {
          if (target.onSetup) this.#setupCallbacks.push(target.onSetup.bind(target));
          if (target.onAttach) this.#attachCallbacks.push(target.onAttach.bind(target));
          if (target.onConnect) this.#connectCallbacks.push(target.onConnect.bind(target));
          if (target.onDestroy) this.#destroyCallbacks.push(target.onDestroy.bind(target));
        }
        #attachAttrs() {
          if (!this.attrs) return;
          for (const name of Object.keys(this.attrs)) {
            if (isFunction(this.attrs[name])) {
              effect(this.#setAttr.bind(this, name));
            } else {
              setAttribute(this.el, name, this.attrs[name]);
            }
          }
        }
        #attachStyles() {
          if (!this.styles) return;
          for (const name of Object.keys(this.styles)) {
            if (isFunction(this.styles[name])) {
              effect(this.#setStyle.bind(this, name));
            } else {
              setStyle(this.el, name, this.styles[name]);
            }
          }
        }
        #setAttr(name) {
          setAttribute(this.el, name, this.attrs[name].call(this.component));
        }
        #setStyle(name) {
          setStyle(this.el, name, this.styles[name].call(this.component));
        }
      };
      currentInstance = { $$: null };
      ViewController = class extends EventTarget {
        /** @internal */
        $$;
        get el() {
          return this.$$.el;
        }
        get $el() {
          return this.$$.$el();
        }
        get scope() {
          return this.$$.scope;
        }
        get attachScope() {
          return this.$$.attachScope;
        }
        get connectScope() {
          return this.$$.connectScope;
        }
        /** @internal */
        get $props() {
          return this.$$.props;
        }
        /** @internal */
        get $state() {
          return this.$$.$state;
        }
        get state() {
          return this.$$.state;
        }
        constructor() {
          super();
          if (currentInstance.$$) this.attach(currentInstance);
        }
        attach({ $$ }) {
          this.$$ = $$;
          $$.addHooks(this);
          return this;
        }
        addEventListener(type, callback, options) {
          this.listen(type, callback, options);
        }
        removeEventListener(type, callback, options) {
          this.el?.removeEventListener(type, callback, options);
        }
        /**
         * The given callback is invoked when the component is ready to be set up.
         *
         * - This hook will run once.
         * - This hook is called both client-side and server-side.
         * - It's safe to use context inside this hook.
         * - The host element has not attached yet - wait for `onAttach`.
         */
        /**
         * This method can be used to specify attributes that should be set on the host element. Any
         * attributes that are assigned to a function will be considered a signal and updated accordingly.
         */
        setAttributes(attributes) {
          if (!this.$$.attrs) this.$$.attrs = {};
          Object.assign(this.$$.attrs, attributes);
        }
        /**
         * This method can be used to specify styles that should set be set on the host element. Any
         * styles that are assigned to a function will be considered a signal and updated accordingly.
         */
        setStyles(styles) {
          if (!this.$$.styles) this.$$.styles = {};
          Object.assign(this.$$.styles, styles);
        }
        /**
         * This method is used to satisfy the CSS variables contract specified on the current
         * component. Other CSS variables can be set via the `setStyles` method.
         */
        setCSSVars(vars) {
          this.setStyles(vars);
        }
        /**
         * Type-safe utility for creating component DOM events.
         */
        createEvent(type, ...init) {
          return new DOMEvent(type, init[0]);
        }
        /**
         * Creates a `DOMEvent` and dispatches it from the host element. This method is typed to
         * match all component events.
         */
        dispatch(type, ...init) {
          if (!this.el) return false;
          const event2 = type instanceof Event ? type : new DOMEvent(type, init[0]);
          Object.defineProperty(event2, "target", {
            get: () => this.$$.component
          });
          return untrack(() => {
            this.$$[ON_DISPATCH]?.(event2);
            return this.el.dispatchEvent(event2);
          });
        }
        dispatchEvent(event2) {
          return this.dispatch(event2);
        }
        /**
         * Adds an event listener for the given `type` and returns a function which can be invoked to
         * remove the event listener.
         *
         * - The listener is removed if the current scope is disposed.
         * - This method is safe to use on the server (noop).
         */
        listen(type, handler, options) {
          if (!this.el) return noop;
          return listenEvent(this.el, type, handler, options);
        }
      };
      Component = class extends ViewController {
        subscribe(callback) {
          return scoped(() => effect(() => callback(this.state)), this.$$.scope);
        }
        destroy() {
          this.$$.destroy();
        }
      };
      State = class {
        id = Symbol(0);
        record;
        #descriptors;
        constructor(record) {
          this.record = record;
          this.#descriptors = Object.getOwnPropertyDescriptors(record);
        }
        create() {
          const store = {}, state = new Proxy(store, { get: (_2, prop2) => store[prop2]() });
          for (const name of Object.keys(this.record)) {
            const getter = this.#descriptors[name].get;
            store[name] = getter ? computed(getter.bind(state)) : signal(this.record[name]);
          }
          return store;
        }
        reset(record, filter) {
          for (const name of Object.keys(record)) {
            if (!this.#descriptors[name].get && (!filter || filter(name))) {
              record[name].set(this.record[name]);
            }
          }
        }
      };
      requestIdleCallback = typeof window !== "undefined" ? "requestIdleCallback" in window ? window.requestIdleCallback : (cb) => window.setTimeout(cb, 1) : noop;
      key = {
        fullscreenEnabled: 0,
        fullscreenElement: 1,
        requestFullscreen: 2,
        exitFullscreen: 3,
        fullscreenchange: 4,
        fullscreenerror: 5,
        fullscreen: 6
      };
      webkit = [
        "webkitFullscreenEnabled",
        "webkitFullscreenElement",
        "webkitRequestFullscreen",
        "webkitExitFullscreen",
        "webkitfullscreenchange",
        "webkitfullscreenerror",
        "-webkit-full-screen"
      ];
      moz = [
        "mozFullScreenEnabled",
        "mozFullScreenElement",
        "mozRequestFullScreen",
        "mozCancelFullScreen",
        "mozfullscreenchange",
        "mozfullscreenerror",
        "-moz-full-screen"
      ];
      ms = [
        "msFullscreenEnabled",
        "msFullscreenElement",
        "msRequestFullscreen",
        "msExitFullscreen",
        "MSFullscreenChange",
        "MSFullscreenError",
        "-ms-fullscreen"
      ];
      document$1 = typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};
      vendor = "fullscreenEnabled" in document$1 && Object.keys(key) || webkit[0] in document$1 && webkit || moz[0] in document$1 && moz || ms[0] in document$1 && ms || [];
      fscreen = {
        requestFullscreen: function(element) {
          return element[vendor[key.requestFullscreen]]();
        },
        requestFullscreenFunction: function(element) {
          return element[vendor[key.requestFullscreen]];
        },
        get exitFullscreen() {
          return document$1[vendor[key.exitFullscreen]].bind(document$1);
        },
        get fullscreenPseudoClass() {
          return ":" + vendor[key.fullscreen];
        },
        addEventListener: function(type, handler, options) {
          return document$1.addEventListener(vendor[key[type]], handler, options);
        },
        removeEventListener: function(type, handler, options) {
          return document$1.removeEventListener(vendor[key[type]], handler, options);
        },
        get fullscreenEnabled() {
          return Boolean(document$1[vendor[key.fullscreenEnabled]]);
        },
        set fullscreenEnabled(val) {
        },
        get fullscreenElement() {
          return document$1[vendor[key.fullscreenElement]];
        },
        set fullscreenElement(val) {
        },
        get onfullscreenchange() {
          return document$1[("on" + vendor[key.fullscreenchange]).toLowerCase()];
        },
        set onfullscreenchange(handler) {
          return document$1[("on" + vendor[key.fullscreenchange]).toLowerCase()] = handler;
        },
        get onfullscreenerror() {
          return document$1[("on" + vendor[key.fullscreenerror]).toLowerCase()];
        },
        set onfullscreenerror(handler) {
          return document$1[("on" + vendor[key.fullscreenerror]).toLowerCase()] = handler;
        }
      };
      functionThrottle = throttle;
      functionDebounce = debounce;
      t = (t22) => "object" == typeof t22 && null != t22 && 1 === t22.nodeType;
      e = (t22, e22) => (!e22 || "hidden" !== t22) && ("visible" !== t22 && "clip" !== t22);
      n = (t22, n22) => {
        if (t22.clientHeight < t22.scrollHeight || t22.clientWidth < t22.scrollWidth) {
          const o22 = getComputedStyle(t22, null);
          return e(o22.overflowY, n22) || e(o22.overflowX, n22) || ((t32) => {
            const e22 = ((t42) => {
              if (!t42.ownerDocument || !t42.ownerDocument.defaultView) return null;
              try {
                return t42.ownerDocument.defaultView.frameElement;
              } catch (t5) {
                return null;
              }
            })(t32);
            return !!e22 && (e22.clientHeight < t32.scrollHeight || e22.clientWidth < t32.scrollWidth);
          })(t22);
        }
        return false;
      };
      o = (t22, e22, n22, o22, l22, r22, i4, s4) => r22 < t22 && i4 > e22 || r22 > t22 && i4 < e22 ? 0 : r22 <= t22 && s4 <= n22 || i4 >= e22 && s4 >= n22 ? r22 - t22 - o22 : i4 > e22 && s4 < n22 || r22 < t22 && s4 > n22 ? i4 - e22 + l22 : 0;
      l = (t22) => {
        const e22 = t22.parentElement;
        return null == e22 ? t22.getRootNode().host || null : e22;
      };
      r = (e22, r22) => {
        var i4, s4, d2, h4;
        if ("undefined" == typeof document) return [];
        const { scrollMode: c3, block: f2, inline: u2, boundary: a3, skipOverflowHiddenElements: g2 } = r22, p2 = "function" == typeof a3 ? a3 : (t22) => t22 !== a3;
        if (!t(e22)) throw new TypeError("Invalid target");
        const m2 = document.scrollingElement || document.documentElement, w2 = [];
        let W = e22;
        for (; t(W) && p2(W); ) {
          if (W = l(W), W === m2) {
            w2.push(W);
            break;
          }
          null != W && W === document.body && n(W) && !n(document.documentElement) || null != W && n(W, g2) && w2.push(W);
        }
        const b2 = null != (s4 = null == (i4 = window.visualViewport) ? void 0 : i4.width) ? s4 : innerWidth, H2 = null != (h4 = null == (d2 = window.visualViewport) ? void 0 : d2.height) ? h4 : innerHeight, { scrollX: y2, scrollY: M2 } = window, { height: v2, width: E2, top: x2, right: C2, bottom: I2, left: R2 } = e22.getBoundingClientRect(), { top: T2, right: B2, bottom: F, left: V2 } = ((t22) => {
          const e32 = window.getComputedStyle(t22);
          return { top: parseFloat(e32.scrollMarginTop) || 0, right: parseFloat(e32.scrollMarginRight) || 0, bottom: parseFloat(e32.scrollMarginBottom) || 0, left: parseFloat(e32.scrollMarginLeft) || 0 };
        })(e22);
        let k2 = "start" === f2 || "nearest" === f2 ? x2 - T2 : "end" === f2 ? I2 + F : x2 + v2 / 2 - T2 + F, D2 = "center" === u2 ? R2 + E2 / 2 - V2 + B2 : "end" === u2 ? C2 + B2 : R2 - V2;
        const L2 = [];
        for (let t22 = 0; t22 < w2.length; t22++) {
          const e32 = w2[t22], { height: n22, width: l22, top: r32, right: i22, bottom: s22, left: d22 } = e32.getBoundingClientRect();
          if ("if-needed" === c3 && x2 >= 0 && R2 >= 0 && I2 <= H2 && C2 <= b2 && x2 >= r32 && I2 <= s22 && R2 >= d22 && C2 <= i22) return L2;
          const h22 = getComputedStyle(e32), a22 = parseInt(h22.borderLeftWidth, 10), g22 = parseInt(h22.borderTopWidth, 10), p22 = parseInt(h22.borderRightWidth, 10), W2 = parseInt(h22.borderBottomWidth, 10);
          let T22 = 0, B22 = 0;
          const F2 = "offsetWidth" in e32 ? e32.offsetWidth - e32.clientWidth - a22 - p22 : 0, V22 = "offsetHeight" in e32 ? e32.offsetHeight - e32.clientHeight - g22 - W2 : 0, S2 = "offsetWidth" in e32 ? 0 === e32.offsetWidth ? 0 : l22 / e32.offsetWidth : 0, X = "offsetHeight" in e32 ? 0 === e32.offsetHeight ? 0 : n22 / e32.offsetHeight : 0;
          if (m2 === e32) T22 = "start" === f2 ? k2 : "end" === f2 ? k2 - H2 : "nearest" === f2 ? o(M2, M2 + H2, H2, g22, W2, M2 + k2, M2 + k2 + v2, v2) : k2 - H2 / 2, B22 = "start" === u2 ? D2 : "center" === u2 ? D2 - b2 / 2 : "end" === u2 ? D2 - b2 : o(y2, y2 + b2, b2, a22, p22, y2 + D2, y2 + D2 + E2, E2), T22 = Math.max(0, T22 + M2), B22 = Math.max(0, B22 + y2);
          else {
            T22 = "start" === f2 ? k2 - r32 - g22 : "end" === f2 ? k2 - s22 + W2 + V22 : "nearest" === f2 ? o(r32, s22, n22, g22, W2 + V22, k2, k2 + v2, v2) : k2 - (r32 + n22 / 2) + V22 / 2, B22 = "start" === u2 ? D2 - d22 - a22 : "center" === u2 ? D2 - (d22 + l22 / 2) + F2 / 2 : "end" === u2 ? D2 - i22 + p22 + F2 : o(d22, i22, l22, a22, p22 + F2, D2, D2 + E2, E2);
            const { scrollLeft: t32, scrollTop: h32 } = e32;
            T22 = 0 === X ? 0 : Math.max(0, Math.min(h32 + T22 / X, e32.scrollHeight - n22 / X + V22)), B22 = 0 === S2 ? 0 : Math.max(0, Math.min(t32 + B22 / S2, e32.scrollWidth - l22 / S2 + F2)), k2 += h32 - T22, D2 += t32 - B22;
          }
          L2.push({ el: e32, top: T22, left: B22 });
        }
        return L2;
      };
      STRING = (v2) => v2 === null ? "" : v2 + "";
      NULLABLE_STRING = (v2) => v2 === null ? null : v2 + "";
      NUMBER = (v2) => v2 === null ? 0 : Number(v2);
      BOOLEAN = (v2) => v2 !== null;
      FUNCTION = () => null;
      ARRAY = (v2) => v2 === null ? [] : JSON.parse(v2);
      OBJECT = (v2) => v2 === null ? {} : JSON.parse(v2);
      ATTRS = /* @__PURE__ */ Symbol(0);
      SETUP = /* @__PURE__ */ Symbol(0);
      SETUP_STATE = /* @__PURE__ */ Symbol(0);
      SETUP_CALLBACKS = /* @__PURE__ */ Symbol(0);
      (function(SetupState2) {
        const Idle = 0;
        SetupState2[SetupState2["Idle"] = Idle] = "Idle";
        const Pending = 1;
        SetupState2[SetupState2["Pending"] = Pending] = "Pending";
        const Ready = 2;
        SetupState2[SetupState2["Ready"] = Ready] = "Ready";
      })(SetupState || (SetupState = {}));
      Icon$24 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M6 7C5.63181 7 5.33333 7.29848 5.33333 7.66667V14.8667C5.33333 14.9403 5.39361 14.9999 5.46724 15.0009C10.8844 15.0719 15.2614 19.449 15.3325 24.8661C15.3334 24.9397 15.393 25 15.4667 25H26C26.3682 25 26.6667 24.7015 26.6667 24.3333V7.66667C26.6667 7.29848 26.3682 7 26 7H6ZM17.0119 22.2294C17.0263 22.29 17.0802 22.3333 17.1425 22.3333H23.3333C23.7015 22.3333 24 22.0349 24 21.6667V10.3333C24 9.96514 23.7015 9.66667 23.3333 9.66667H8.66667C8.29848 9.66667 8 9.96514 8 10.3333V13.1909C8 13.2531 8.04332 13.3071 8.10392 13.3214C12.5063 14.3618 15.9715 17.827 17.0119 22.2294Z" fill="currentColor"/> <path d="M13.2 25C13.2736 25 13.3334 24.9398 13.3322 24.8661C13.2615 20.5544 9.77889 17.0718 5.46718 17.0011C5.39356 16.9999 5.33333 17.0597 5.33333 17.1333V18.8667C5.33333 18.9403 5.39348 18.9999 5.4671 19.0015C8.67465 19.0716 11.2617 21.6587 11.3319 24.8662C11.3335 24.9399 11.393 25 11.4667 25H13.2Z" fill="currentColor"/> <path d="M5.33333 21.1333C5.33333 21.0597 5.39332 20.9998 5.46692 21.0022C7.57033 21.0712 9.26217 22.763 9.33114 24.8664C9.33356 24.94 9.27364 25 9.2 25H6C5.63181 25 5.33333 24.7015 5.33333 24.3333V21.1333Z" fill="currentColor"/>`;
      Icon$0 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0007 28.7923C15.0007 29.0152 14.9774 29.096 14.9339 29.1775C14.8903 29.259 14.8263 29.323 14.7449 29.3665C14.6634 29.4101 14.5826 29.4333 14.3597 29.4333H12.575C12.3521 29.4333 12.2713 29.4101 12.1898 29.3665C12.1083 29.323 12.0443 29.259 12.0008 29.1775C11.9572 29.096 11.934 29.0152 11.934 28.7923V12.2993L5.97496 12.3C5.75208 12.3 5.67125 12.2768 5.58977 12.2332C5.50829 12.1896 5.44434 12.1257 5.40077 12.0442C5.35719 11.9627 5.33398 11.8819 5.33398 11.659V9.87429C5.33398 9.65141 5.35719 9.57059 5.40077 9.48911C5.44434 9.40762 5.50829 9.34368 5.58977 9.3001C5.67125 9.25652 5.75208 9.23332 5.97496 9.23332H26.0263C26.2492 9.23332 26.33 9.25652 26.4115 9.3001C26.493 9.34368 26.557 9.40762 26.6005 9.48911C26.6441 9.57059 26.6673 9.65141 26.6673 9.87429V11.659C26.6673 11.8819 26.6441 11.9627 26.6005 12.0442C26.557 12.1257 26.493 12.1896 26.4115 12.2332C26.33 12.2768 26.2492 12.3 26.0263 12.3L20.067 12.2993L20.0673 28.7923C20.0673 29.0152 20.0441 29.096 20.0005 29.1775C19.957 29.259 19.893 29.323 19.8115 29.3665C19.73 29.4101 19.6492 29.4333 19.4263 29.4333H17.6416C17.4187 29.4333 17.3379 29.4101 17.2564 29.3665C17.175 29.323 17.111 29.259 17.0674 29.1775C17.0239 29.096 17.0007 29.0152 17.0007 28.7923L17 22.7663H15L15.0007 28.7923Z" fill="currentColor"/> <path d="M16.0007 7.89998C17.4734 7.89998 18.6673 6.70608 18.6673 5.23332C18.6673 3.76056 17.4734 2.56665 16.0007 2.56665C14.5279 2.56665 13.334 3.76056 13.334 5.23332C13.334 6.70608 14.5279 7.89998 16.0007 7.89998Z" fill="currentColor"/>`;
      Icon$5 = `<path d="M5.33334 6.00001C5.33334 5.63182 5.63181 5.33334 6 5.33334H26C26.3682 5.33334 26.6667 5.63182 26.6667 6.00001V20.6667C26.6667 21.0349 26.3682 21.3333 26 21.3333H23.7072C23.4956 21.3333 23.2966 21.233 23.171 21.0628L22.1859 19.7295C21.8607 19.2894 22.1749 18.6667 22.7221 18.6667H23.3333C23.7015 18.6667 24 18.3682 24 18V8.66668C24 8.29849 23.7015 8.00001 23.3333 8.00001H8.66667C8.29848 8.00001 8 8.29849 8 8.66668V18C8 18.3682 8.29848 18.6667 8.66667 18.6667H9.29357C9.84072 18.6667 10.1549 19.2894 9.82976 19.7295L8.84467 21.0628C8.71898 21.233 8.52 21.3333 8.30848 21.3333H6C5.63181 21.3333 5.33334 21.0349 5.33334 20.6667V6.00001Z" fill="currentColor"/> <path d="M8.78528 25.6038C8.46013 26.0439 8.77431 26.6667 9.32147 26.6667L22.6785 26.6667C23.2256 26.6667 23.5398 26.0439 23.2146 25.6038L16.5358 16.5653C16.2693 16.2046 15.73 16.2047 15.4635 16.5653L8.78528 25.6038Z" fill="currentColor"/>`;
      Icon$8 = `<path d="M17.4853 18.9093C17.4853 19.0281 17.6289 19.0875 17.7129 19.0035L22.4185 14.2979C22.6788 14.0376 23.1009 14.0376 23.3613 14.2979L24.7755 15.7122C25.0359 15.9725 25.0359 16.3946 24.7755 16.655L16.2902 25.1403C16.0299 25.4006 15.6078 25.4006 15.3474 25.1403L13.9332 23.726L13.9319 23.7247L6.86189 16.6547C6.60154 16.3944 6.60154 15.9723 6.86189 15.7119L8.2761 14.2977C8.53645 14.0373 8.95856 14.0373 9.21891 14.2977L13.9243 19.0031C14.0083 19.0871 14.1519 19.0276 14.1519 18.9088L14.1519 6.00004C14.1519 5.63185 14.4504 5.33337 14.8186 5.33337L16.8186 5.33337C17.1868 5.33337 17.4853 5.63185 17.4853 6.00004L17.4853 18.9093Z" fill="currentColor"/>`;
      Icon$11 = `<path d="M13.0908 14.3334C12.972 14.3334 12.9125 14.1898 12.9965 14.1058L17.7021 9.40022C17.9625 9.13987 17.9625 8.71776 17.7021 8.45741L16.2879 7.04319C16.0275 6.78284 15.6054 6.78284 15.3451 7.04319L6.8598 15.5285C6.59945 15.7888 6.59945 16.2109 6.8598 16.4713L8.27401 17.8855L8.27536 17.8868L15.3453 24.9568C15.6057 25.2172 16.0278 25.2172 16.2881 24.9568L17.7024 23.5426C17.9627 23.2822 17.9627 22.8601 17.7024 22.5998L12.9969 17.8944C12.9129 17.8104 12.9724 17.6668 13.0912 17.6668L26 17.6668C26.3682 17.6668 26.6667 17.3683 26.6667 17.0001V15.0001C26.6667 14.6319 26.3682 14.3334 26 14.3334L13.0908 14.3334Z" fill="currentColor"/>`;
      Icon$13 = `<path d="M14.1521 13.0929C14.1521 12.9741 14.0085 12.9147 13.9245 12.9987L9.21891 17.7043C8.95856 17.9646 8.53645 17.9646 8.2761 17.7043L6.86189 16.29C6.60154 16.0297 6.60154 15.6076 6.86189 15.3472L15.3472 6.86195C15.6075 6.6016 16.0296 6.6016 16.29 6.86195L17.7042 8.27616L17.7055 8.27751L24.7755 15.3475C25.0359 15.6078 25.0359 16.0299 24.7755 16.2903L23.3613 17.7045C23.1009 17.9649 22.6788 17.9649 22.4185 17.7045L17.7131 12.9991C17.6291 12.9151 17.4855 12.9746 17.4855 13.0934V26.0022C17.4855 26.3704 17.187 26.6688 16.8188 26.6688H14.8188C14.4506 26.6688 14.1521 26.3704 14.1521 26.0022L14.1521 13.0929Z" fill="currentColor"/>`;
      Icon$16 = `<path d="M16.6927 25.3346C16.3245 25.3346 16.026 25.0361 16.026 24.6679L16.026 7.3346C16.026 6.96641 16.3245 6.66794 16.6927 6.66794L18.6927 6.66794C19.0609 6.66794 19.3594 6.96642 19.3594 7.3346L19.3594 24.6679C19.3594 25.0361 19.0609 25.3346 18.6927 25.3346H16.6927Z" fill="currentColor"/> <path d="M24.026 25.3346C23.6578 25.3346 23.3594 25.0361 23.3594 24.6679L23.3594 7.3346C23.3594 6.96641 23.6578 6.66794 24.026 6.66794L26.026 6.66794C26.3942 6.66794 26.6927 6.96642 26.6927 7.3346V24.6679C26.6927 25.0361 26.3942 25.3346 26.026 25.3346H24.026Z" fill="currentColor"/> <path d="M5.48113 23.9407C5.38584 24.2963 5.59689 24.6619 5.95254 24.7572L7.88439 25.2748C8.24003 25.3701 8.60559 25.159 8.70089 24.8034L13.1871 8.06067C13.2824 7.70503 13.0713 7.33947 12.7157 7.24417L10.7838 6.72654C10.4282 6.63124 10.0626 6.8423 9.96733 7.19794L5.48113 23.9407Z" fill="currentColor"/>`;
      Icon$19 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M24.9266 7.57992C25.015 7.60672 25.0886 7.64746 25.2462 7.80506L26.956 9.51488C27.1136 9.67248 27.1543 9.74604 27.1811 9.83447C27.2079 9.9229 27.2079 10.0133 27.1811 10.1018C27.1543 10.1902 27.1136 10.2638 26.956 10.4214L13.1822 24.1951C13.0246 24.3527 12.951 24.3935 12.8626 24.4203C12.797 24.4402 12.7304 24.4453 12.6642 24.4357L12.7319 24.4203C12.6435 24.4471 12.553 24.4471 12.4646 24.4203C12.3762 24.3935 12.3026 24.3527 12.145 24.1951L5.04407 17.0942C4.88647 16.9366 4.84573 16.863 4.81893 16.7746C4.79213 16.6862 4.79213 16.5957 4.81893 16.5073C4.84573 16.4189 4.88647 16.3453 5.04407 16.1877L6.7539 14.4779C6.9115 14.3203 6.98506 14.2796 7.07349 14.2528C7.16191 14.226 7.25235 14.226 7.34078 14.2528C7.42921 14.2796 7.50277 14.3203 7.66037 14.4779L12.6628 19.4808L24.3397 7.80506C24.4973 7.64746 24.5709 7.60672 24.6593 7.57992C24.7477 7.55311 24.8382 7.55311 24.9266 7.57992Z" fill="currentColor"/>`;
      Icon$22 = `<path d="M17.947 16.095C17.999 16.043 17.999 15.9585 17.947 15.9065L11.6295 9.58899C11.3691 9.32864 11.3691 8.90653 11.6295 8.64618L13.2323 7.04341C13.4926 6.78306 13.9147 6.78306 14.1751 7.04341L21.0289 13.8973C21.0392 13.9064 21.0493 13.9158 21.0591 13.9257L22.6619 15.5285C22.9223 15.7888 22.9223 16.2109 22.6619 16.4713L14.1766 24.9565C13.9163 25.2169 13.4942 25.2169 13.2338 24.9565L11.631 23.3538C11.3707 23.0934 11.3707 22.6713 11.631 22.411L17.947 16.095Z" fill="currentColor"/>`;
      Icon$26 = `<path d="M8 28.0003C8 27.6321 8.29848 27.3336 8.66667 27.3336H23.3333C23.7015 27.3336 24 27.6321 24 28.0003V29.3336C24 29.7018 23.7015 30.0003 23.3333 30.0003H8.66667C8.29848 30.0003 8 29.7018 8 29.3336V28.0003Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66602 6.66699C4.29783 6.66699 3.99935 6.96547 3.99935 7.33366V24.667C3.99935 25.0352 4.29783 25.3337 4.66602 25.3337H27.3327C27.7009 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.7009 6.66699 27.3327 6.66699H4.66602ZM8.66659 21.3333C8.2984 21.3333 7.99992 21.0349 7.99992 20.6667V11.3333C7.99992 10.9651 8.2984 10.6667 8.66659 10.6667H13.9999C14.3681 10.6667 14.6666 10.9651 14.6666 11.3333V12.6667C14.6666 13.0349 14.3681 13.3333 13.9999 13.3333H10.7999C10.7263 13.3333 10.6666 13.393 10.6666 13.4667V18.5333C10.6666 18.607 10.7263 18.6667 10.7999 18.6667H13.9999C14.3681 18.6667 14.6666 18.9651 14.6666 19.3333V20.6667C14.6666 21.0349 14.3681 21.3333 13.9999 21.3333H8.66659ZM17.9999 21.3333C17.6317 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6317 10.6667 17.9999 10.6667H23.3333C23.7014 10.6667 23.9999 10.9651 23.9999 11.3333V12.6667C23.9999 13.0349 23.7014 13.3333 23.3333 13.3333H20.1333C20.0596 13.3333 19.9999 13.393 19.9999 13.4667V18.5333C19.9999 18.607 20.0596 18.6667 20.1333 18.6667H23.3333C23.7014 18.6667 23.9999 18.9651 23.9999 19.3333V20.6667C23.9999 21.0349 23.7014 21.3333 23.3333 21.3333H17.9999Z" fill="currentColor"/>`;
      Icon$27 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z" fill="currentColor"/>`;
      Icon$31 = `<path d="M14.2225 13.7867C14.3065 13.8706 14.4501 13.8112 14.4501 13.6924V5.99955C14.4501 5.63136 14.7486 5.33289 15.1167 5.33289H16.8501C17.2183 5.33289 17.5167 5.63136 17.5167 5.99955V13.6916C17.5167 13.8104 17.6604 13.8699 17.7444 13.7859L19.9433 11.5869C20.2037 11.3266 20.6258 11.3266 20.8861 11.5869L22.1118 12.8126C22.3722 13.0729 22.3722 13.4951 22.1118 13.7554L16.4549 19.4123C16.1946 19.6726 15.772 19.6731 15.5116 19.4128L9.85479 13.7559C9.59444 13.4956 9.59444 13.0734 9.85479 12.8131L11.0804 11.5874C11.3408 11.3271 11.7629 11.3271 12.0233 11.5874L14.2225 13.7867Z" fill="currentColor"/> <path d="M5.99998 20.267C5.63179 20.267 5.33331 20.5654 5.33331 20.9336V25.9997C5.33331 26.3678 5.63179 26.6663 5.99998 26.6663H26C26.3682 26.6663 26.6666 26.3678 26.6666 25.9997V20.9336C26.6666 20.5654 26.3682 20.267 26 20.267H24.2666C23.8985 20.267 23.6 20.5654 23.6 20.9336V22.9333C23.6 23.3014 23.3015 23.5999 22.9333 23.5999H9.06638C8.69819 23.5999 8.39972 23.3014 8.39972 22.9333V20.9336C8.39972 20.5654 8.10124 20.267 7.73305 20.267H5.99998Z" fill="currentColor"/>`;
      Icon$33 = `<path d="M16 20C18.2091 20 20 18.2092 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2092 13.7909 20 16 20Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M28 16.0058C28 18.671 23.5 25.3334 16 25.3334C8.5 25.3334 4 18.6762 4 16.0058C4 13.3354 8.50447 6.66669 16 6.66669C23.4955 6.66669 28 13.3406 28 16.0058ZM25.3318 15.9934C25.3328 16.0017 25.3328 16.0099 25.3318 16.0182C25.3274 16.0571 25.3108 16.1728 25.2485 16.3708C25.1691 16.6229 25.0352 16.9462 24.8327 17.3216C24.4264 18.0749 23.7969 18.9398 22.9567 19.754C21.2791 21.3798 18.9148 22.6667 16 22.6667C13.0845 22.6667 10.7202 21.3805 9.04298 19.7557C8.20295 18.9419 7.57362 18.0773 7.16745 17.3241C6.96499 16.9486 6.83114 16.6252 6.75172 16.3729C6.67942 16.1431 6.66856 16.0243 6.66695 16.0066L6.66695 16.005C6.66859 15.9871 6.67951 15.8682 6.75188 15.6383C6.83145 15.3854 6.96554 15.0614 7.16831 14.6853C7.57507 13.9306 8.20514 13.0644 9.04577 12.249C10.7245 10.6208 13.0886 9.33335 16 9.33335C18.9108 9.33335 21.2748 10.6215 22.9539 12.2507C23.7947 13.0664 24.4249 13.933 24.8318 14.6877C25.0346 15.0639 25.1688 15.3878 25.2483 15.6404C25.3107 15.8386 25.3274 15.9545 25.3318 15.9934Z" fill="currentColor"/>`;
      Icon$34 = `<path d="M15.8747 8.11857C16.3148 7.79342 16.9375 8.10759 16.9375 8.65476V14.2575C16.9375 14.3669 17.0621 14.4297 17.1501 14.3647L25.6038 8.11857C26.0439 7.79342 26.6667 8.10759 26.6667 8.65476V23.3451C26.6667 23.8923 26.0439 24.2064 25.6038 23.8813L17.1501 17.6346C17.0621 17.5695 16.9375 17.6324 16.9375 17.7418L16.9375 23.3451C16.9375 23.8923 16.3147 24.2064 15.8747 23.8813L5.93387 16.5358C5.57322 16.2693 5.57323 15.7299 5.93389 15.4634L15.8747 8.11857Z" fill="currentColor"/>`;
      Icon$35 = `<path d="M16.1253 8.11866C15.6852 7.7935 15.0625 8.10768 15.0625 8.65484V14.2576C15.0625 14.367 14.9379 14.4298 14.8499 14.3648L6.39615 8.11866C5.95607 7.7935 5.33331 8.10768 5.33331 8.65484V23.3452C5.33331 23.8923 5.9561 24.2065 6.39617 23.8813L14.8499 17.6347C14.9379 17.5696 15.0625 17.6325 15.0625 17.7419L15.0625 23.3452C15.0625 23.8923 15.6853 24.2065 16.1253 23.8813L26.0661 16.5358C26.4268 16.2694 26.4268 15.73 26.0661 15.4635L16.1253 8.11866Z" fill="currentColor"/>`;
      Icon$39 = `<path d="M19.3334 13.3333C18.9652 13.3333 18.6667 13.0349 18.6667 12.6667L18.6667 7.33333C18.6667 6.96514 18.9652 6.66666 19.3334 6.66666H21.3334C21.7015 6.66666 22 6.96514 22 7.33333V9.86666C22 9.9403 22.0597 10 22.1334 10L24.6667 10C25.0349 10 25.3334 10.2985 25.3334 10.6667V12.6667C25.3334 13.0349 25.0349 13.3333 24.6667 13.3333L19.3334 13.3333Z" fill="currentColor"/> <path d="M13.3334 19.3333C13.3334 18.9651 13.0349 18.6667 12.6667 18.6667H7.33335C6.96516 18.6667 6.66669 18.9651 6.66669 19.3333V21.3333C6.66669 21.7015 6.96516 22 7.33335 22H9.86669C9.94032 22 10 22.0597 10 22.1333L10 24.6667C10 25.0349 10.2985 25.3333 10.6667 25.3333H12.6667C13.0349 25.3333 13.3334 25.0349 13.3334 24.6667L13.3334 19.3333Z" fill="currentColor"/> <path d="M18.6667 24.6667C18.6667 25.0349 18.9652 25.3333 19.3334 25.3333H21.3334C21.7015 25.3333 22 25.0349 22 24.6667V22.1333C22 22.0597 22.0597 22 22.1334 22H24.6667C25.0349 22 25.3334 21.7015 25.3334 21.3333V19.3333C25.3334 18.9651 25.0349 18.6667 24.6667 18.6667L19.3334 18.6667C18.9652 18.6667 18.6667 18.9651 18.6667 19.3333L18.6667 24.6667Z" fill="currentColor"/> <path d="M10.6667 13.3333H12.6667C13.0349 13.3333 13.3334 13.0349 13.3334 12.6667L13.3334 10.6667V7.33333C13.3334 6.96514 13.0349 6.66666 12.6667 6.66666H10.6667C10.2985 6.66666 10 6.96514 10 7.33333L10 9.86666C10 9.9403 9.94033 10 9.86669 10L7.33335 10C6.96516 10 6.66669 10.2985 6.66669 10.6667V12.6667C6.66669 13.0349 6.96516 13.3333 7.33335 13.3333L10.6667 13.3333Z" fill="currentColor"/>`;
      Icon$40 = `<path d="M25.3299 7.26517C25.2958 6.929 25.0119 6.66666 24.6667 6.66666H19.3334C18.9652 6.66666 18.6667 6.96514 18.6667 7.33333V9.33333C18.6667 9.70152 18.9652 10 19.3334 10L21.8667 10C21.9403 10 22 10.0597 22 10.1333V12.6667C22 13.0349 22.2985 13.3333 22.6667 13.3333H24.6667C25.0349 13.3333 25.3334 13.0349 25.3334 12.6667V7.33333C25.3334 7.31032 25.3322 7.28758 25.3299 7.26517Z" fill="currentColor"/> <path d="M22 21.8667C22 21.9403 21.9403 22 21.8667 22L19.3334 22C18.9652 22 18.6667 22.2985 18.6667 22.6667V24.6667C18.6667 25.0349 18.9652 25.3333 19.3334 25.3333L24.6667 25.3333C25.0349 25.3333 25.3334 25.0349 25.3334 24.6667V19.3333C25.3334 18.9651 25.0349 18.6667 24.6667 18.6667H22.6667C22.2985 18.6667 22 18.9651 22 19.3333V21.8667Z" fill="currentColor"/> <path d="M12.6667 22H10.1334C10.0597 22 10 21.9403 10 21.8667V19.3333C10 18.9651 9.70154 18.6667 9.33335 18.6667H7.33335C6.96516 18.6667 6.66669 18.9651 6.66669 19.3333V24.6667C6.66669 25.0349 6.96516 25.3333 7.33335 25.3333H12.6667C13.0349 25.3333 13.3334 25.0349 13.3334 24.6667V22.6667C13.3334 22.2985 13.0349 22 12.6667 22Z" fill="currentColor"/> <path d="M10 12.6667V10.1333C10 10.0597 10.0597 10 10.1334 10L12.6667 10C13.0349 10 13.3334 9.70152 13.3334 9.33333V7.33333C13.3334 6.96514 13.0349 6.66666 12.6667 6.66666H7.33335C6.96516 6.66666 6.66669 6.96514 6.66669 7.33333V12.6667C6.66669 13.0349 6.96516 13.3333 7.33335 13.3333H9.33335C9.70154 13.3333 10 13.0349 10 12.6667Z" fill="currentColor"/>`;
      Icon$53 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M26.6667 5.99998C26.6667 5.63179 26.3682 5.33331 26 5.33331H11.3333C10.9651 5.33331 10.6667 5.63179 10.6667 5.99998V17.5714C10.6667 17.6694 10.5644 17.7342 10.4741 17.6962C9.91823 17.4625 9.30754 17.3333 8.66667 17.3333C6.08934 17.3333 4 19.4226 4 22C4 24.5773 6.08934 26.6666 8.66667 26.6666C11.244 26.6666 13.3333 24.5773 13.3333 22V8.66665C13.3333 8.29846 13.6318 7.99998 14 7.99998L23.3333 7.99998C23.7015 7.99998 24 8.29846 24 8.66665V14.9048C24 15.0027 23.8978 15.0675 23.8075 15.0296C23.2516 14.7958 22.6409 14.6666 22 14.6666C19.4227 14.6666 17.3333 16.756 17.3333 19.3333C17.3333 21.9106 19.4227 24 22 24C24.5773 24 26.6667 21.9106 26.6667 19.3333V5.99998ZM22 21.3333C23.1046 21.3333 24 20.4379 24 19.3333C24 18.2287 23.1046 17.3333 22 17.3333C20.8954 17.3333 20 18.2287 20 19.3333C20 20.4379 20.8954 21.3333 22 21.3333ZM8.66667 24C9.77124 24 10.6667 23.1045 10.6667 22C10.6667 20.8954 9.77124 20 8.66667 20C7.5621 20 6.66667 20.8954 6.66667 22C6.66667 23.1045 7.5621 24 8.66667 24Z" fill="currentColor"/>`;
      Icon$54 = `<path d="M17.5091 24.6594C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3325V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.8036C16.8863 6.47842 17.5091 6.79259 17.5091 7.33977L17.5091 24.6594Z" fill="currentColor"/> <path d="M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z" fill="currentColor"/>`;
      Icon$56 = `<path d="M26.6009 16.0725C26.6009 16.424 26.4302 17.1125 25.9409 18.0213C25.4676 18.8976 24.7542 19.8715 23.8182 20.7783C21.9489 22.5905 19.2662 24.0667 15.9342 24.0667C12.6009 24.0667 9.91958 22.5915 8.04891 20.78C7.11424 19.8736 6.40091 18.9 5.92758 18.0236C5.43824 17.1149 5.26758 16.4257 5.26758 16.0725C5.26758 15.7193 5.43824 15.0293 5.92891 14.1193C6.40224 13.2416 7.11558 12.2665 8.05158 11.3587C9.92224 9.54398 12.6049 8.06665 15.9342 8.06665C19.2636 8.06665 21.9449 9.54505 23.8169 11.3604C24.7529 12.2687 25.4662 13.2441 25.9396 14.1216C26.4302 15.0317 26.6009 15.7209 26.6009 16.0725Z" stroke="currentColor" stroke-width="3"/> <path d="M15.9336 20.0667C18.1427 20.0667 19.9336 18.2758 19.9336 16.0667C19.9336 13.8575 18.1427 12.0667 15.9336 12.0667C13.7245 12.0667 11.9336 13.8575 11.9336 16.0667C11.9336 18.2758 13.7245 20.0667 15.9336 20.0667Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M27.2323 25.0624L6.93878 4.76886C6.78118 4.61126 6.70762 4.57052 6.61919 4.54372C6.53077 4.51692 6.44033 4.51691 6.3519 4.54372C6.26347 4.57052 6.18991 4.61126 6.03231 4.76886L4.77032 6.03085C4.61272 6.18845 4.57198 6.26201 4.54518 6.35044C4.51838 6.43887 4.51838 6.5293 4.54518 6.61773C4.57198 6.70616 4.61272 6.77972 4.77032 6.93732L25.0639 27.2308C25.2215 27.3884 25.295 27.4292 25.3834 27.456C25.4719 27.4828 25.5623 27.4828 25.6507 27.456C25.7392 27.4292 25.8127 27.3885 25.9703 27.2309L27.2323 25.9689C27.3899 25.8113 27.4307 25.7377 27.4575 25.6493C27.4843 25.5608 27.4843 25.4704 27.4575 25.382C27.4307 25.2935 27.3899 25.22 27.2323 25.0624Z" fill="currentColor"/>`;
      Icon$59 = `<path d="M8.66667 6.66667C8.29848 6.66667 8 6.96514 8 7.33333V24.6667C8 25.0349 8.29848 25.3333 8.66667 25.3333H12.6667C13.0349 25.3333 13.3333 25.0349 13.3333 24.6667V7.33333C13.3333 6.96514 13.0349 6.66667 12.6667 6.66667H8.66667Z" fill="currentColor"/> <path d="M19.3333 6.66667C18.9651 6.66667 18.6667 6.96514 18.6667 7.33333V24.6667C18.6667 25.0349 18.9651 25.3333 19.3333 25.3333H23.3333C23.7015 25.3333 24 25.0349 24 24.6667V7.33333C24 6.96514 23.7015 6.66667 23.3333 6.66667H19.3333Z" fill="currentColor"/>`;
      Icon$60 = `<path d="M5.33334 26V19.4667C5.33334 19.393 5.39304 19.3333 5.46668 19.3333H7.86668C7.94031 19.3333 8.00001 19.393 8.00001 19.4667V23.3333C8.00001 23.7015 8.29849 24 8.66668 24H23.3333C23.7015 24 24 23.7015 24 23.3333V8.66666C24 8.29847 23.7015 7.99999 23.3333 7.99999H19.4667C19.393 7.99999 19.3333 7.9403 19.3333 7.86666V5.46666C19.3333 5.39302 19.393 5.33333 19.4667 5.33333H26C26.3682 5.33333 26.6667 5.63181 26.6667 5.99999V26C26.6667 26.3682 26.3682 26.6667 26 26.6667H6.00001C5.63182 26.6667 5.33334 26.3682 5.33334 26Z" fill="currentColor"/> <path d="M14.0098 8.42359H10.806C10.6872 8.42359 10.6277 8.56721 10.7117 8.6512L16.5491 14.4886C16.8094 14.7489 16.8094 15.171 16.5491 15.4314L15.3234 16.657C15.0631 16.9174 14.641 16.9174 14.3806 16.657L8.63739 10.9138C8.55339 10.8298 8.40978 10.8893 8.40978 11.0081V14.0236C8.40978 14.3918 8.1113 14.6903 7.74311 14.6903H6.00978C5.64159 14.6903 5.34311 14.3918 5.34311 14.0236L5.34311 6.02359C5.34311 5.6554 5.64159 5.35692 6.00978 5.35692L14.0098 5.35692C14.378 5.35692 14.6764 5.6554 14.6764 6.02359V7.75692C14.6764 8.12511 14.378 8.42359 14.0098 8.42359Z" fill="currentColor"/>`;
      Icon$61 = `<path d="M16 15.3333C15.6318 15.3333 15.3333 15.6318 15.3333 16V20C15.3333 20.3682 15.6318 20.6667 16 20.6667H21.3333C21.7015 20.6667 22 20.3682 22 20V16C22 15.6318 21.7015 15.3333 21.3333 15.3333H16Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.33333 7.33334C5.33333 6.96515 5.63181 6.66667 5.99999 6.66667H26C26.3682 6.66667 26.6667 6.96515 26.6667 7.33334V24.6667C26.6667 25.0349 26.3682 25.3333 26 25.3333H5.99999C5.63181 25.3333 5.33333 25.0349 5.33333 24.6667V7.33334ZM7.99999 10C7.99999 9.63182 8.29847 9.33334 8.66666 9.33334H23.3333C23.7015 9.33334 24 9.63182 24 10V22C24 22.3682 23.7015 22.6667 23.3333 22.6667H8.66666C8.29847 22.6667 7.99999 22.3682 7.99999 22V10Z" fill="currentColor"/>`;
      Icon$62 = `<path d="M10.6667 6.6548C10.6667 6.10764 11.2894 5.79346 11.7295 6.11862L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.3771 16.5357L11.7295 25.8813C11.2895 26.2065 10.6667 25.8923 10.6667 25.3451L10.6667 6.6548Z" fill="currentColor"/>`;
      Icon$63 = `<path d="M13.9213 5.53573C14.3146 5.45804 14.6666 5.76987 14.6666 6.17079V7.57215C14.6666 7.89777 14.4305 8.17277 14.114 8.24925C12.5981 8.61559 11.2506 9.41368 10.2091 10.506C9.98474 10.7414 9.62903 10.8079 9.34742 10.6453L8.14112 9.94885C7.79394 9.7484 7.69985 9.28777 7.96359 8.98585C9.48505 7.24409 11.5636 6.00143 13.9213 5.53573Z" fill="currentColor"/> <path d="M5.88974 12.5908C6.01805 12.2101 6.46491 12.0603 6.81279 12.2611L8.01201 12.9535C8.29379 13.1162 8.41396 13.4577 8.32238 13.7699C8.11252 14.4854 7.99998 15.2424 7.99998 16.0257C7.99998 16.809 8.11252 17.566 8.32238 18.2814C8.41396 18.5936 8.29378 18.9352 8.01201 19.0979L6.82742 19.7818C6.48051 19.9821 6.03488 19.8337 5.90521 19.4547C5.5345 18.3712 5.33331 17.2091 5.33331 16C5.33331 14.8078 5.5289 13.6613 5.88974 12.5908Z" fill="currentColor"/> <path d="M8.17106 22.0852C7.82291 22.2862 7.72949 22.7486 7.99532 23.0502C9.51387 24.773 11.5799 26.0017 13.9213 26.4642C14.3146 26.5419 14.6666 26.2301 14.6666 25.8291V24.4792C14.6666 24.1536 14.4305 23.8786 14.114 23.8021C12.5981 23.4358 11.2506 22.6377 10.2091 21.5453C9.98474 21.31 9.62903 21.2435 9.34742 21.4061L8.17106 22.0852Z" fill="currentColor"/> <path d="M17.3333 25.8291C17.3333 26.2301 17.6857 26.5418 18.079 26.4641C22.9748 25.4969 26.6666 21.1796 26.6666 16C26.6666 10.8204 22.9748 6.50302 18.079 5.5358C17.6857 5.4581 17.3333 5.76987 17.3333 6.17079V7.57215C17.3333 7.89777 17.5697 8.17282 17.8862 8.24932C21.3942 9.09721 24 12.2572 24 16.0257C24 19.7942 21.3942 22.9542 17.8862 23.802C17.5697 23.8785 17.3333 24.1536 17.3333 24.4792V25.8291Z" fill="currentColor"/> <path d="M14.3961 10.4163C13.9561 10.0911 13.3333 10.4053 13.3333 10.9525L13.3333 21.0474C13.3333 21.5946 13.9561 21.9087 14.3962 21.5836L21.2273 16.5359C21.5879 16.2694 21.5879 15.73 21.2273 15.4635L14.3961 10.4163Z" fill="currentColor"/>`;
      Icon$74 = `<path d="M15.6038 12.2147C16.0439 12.5399 16.6667 12.2257 16.6667 11.6786V10.1789C16.6667 10.1001 16.7351 10.0384 16.8134 10.0479C20.1116 10.4494 22.6667 13.2593 22.6667 16.6659C22.6667 20.3481 19.6817 23.3332 15.9995 23.3332C12.542 23.3332 9.69927 20.7014 9.36509 17.332C9.32875 16.9655 9.03371 16.6662 8.66548 16.6662L6.66655 16.6666C6.29841 16.6666 5.99769 16.966 6.02187 17.3334C6.36494 22.5454 10.7012 26.6667 16 26.6667C21.5228 26.6667 26 22.1895 26 16.6667C26 11.4103 21.9444 7.10112 16.7916 6.69757C16.7216 6.69209 16.6667 6.63396 16.6667 6.56372V4.98824C16.6667 4.44106 16.0439 4.12689 15.6038 4.45206L11.0765 7.79738C10.7159 8.06387 10.7159 8.60326 11.0766 8.86973L15.6038 12.2147Z" fill="currentColor"/>`;
      Icon$77 = `<path d="M16.6667 10.3452C16.6667 10.8924 16.0439 11.2066 15.6038 10.8814L11.0766 7.5364C10.7159 7.26993 10.7159 6.73054 11.0766 6.46405L15.6038 3.11873C16.0439 2.79356 16.6667 3.10773 16.6667 3.6549V5.22682C16.6667 5.29746 16.7223 5.35579 16.7927 5.36066C22.6821 5.76757 27.3333 10.674 27.3333 16.6667C27.3333 22.9259 22.2592 28 16 28C9.96483 28 5.03145 23.2827 4.68601 17.3341C4.66466 16.9665 4.96518 16.6673 5.33339 16.6673H7.3334C7.70157 16.6673 7.99714 16.9668 8.02743 17.3337C8.36638 21.4399 11.8064 24.6667 16 24.6667C20.4183 24.6667 24 21.085 24 16.6667C24 12.5225 20.8483 9.11428 16.8113 8.70739C16.7337 8.69957 16.6667 8.76096 16.6667 8.83893V10.3452Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0879 19.679C17.4553 19.9195 17.8928 20.0398 18.4004 20.0398C18.9099 20.0398 19.3474 19.9205 19.7129 19.6818C20.0803 19.4413 20.3635 19.0938 20.5623 18.6392C20.7612 18.1847 20.8606 17.6373 20.8606 16.9972C20.8625 16.3608 20.764 15.8192 20.5652 15.3722C20.3663 14.9252 20.0822 14.5853 19.7129 14.3523C19.3455 14.1175 18.908 14 18.4004 14C17.8928 14 17.4553 14.1175 17.0879 14.3523C16.7224 14.5853 16.4402 14.9252 16.2413 15.3722C16.0443 15.8173 15.9449 16.3589 15.943 16.9972C15.9411 17.6354 16.0396 18.1818 16.2385 18.6364C16.4373 19.089 16.7205 19.4366 17.0879 19.679ZM19.1362 18.4262C18.9487 18.7349 18.7034 18.8892 18.4004 18.8892C18.1996 18.8892 18.0226 18.8211 17.8691 18.6847C17.7157 18.5464 17.5964 18.3372 17.5112 18.0568C17.4279 17.7765 17.3871 17.4233 17.389 16.9972C17.3909 16.3684 17.4847 15.9025 17.6703 15.5995C17.8559 15.2945 18.0993 15.1421 18.4004 15.1421C18.603 15.1421 18.7801 15.2093 18.9316 15.3438C19.0832 15.4782 19.2015 15.6828 19.2868 15.9574C19.372 16.2301 19.4146 16.5767 19.4146 16.9972C19.4165 17.6392 19.3237 18.1156 19.1362 18.4262Z" fill="currentColor"/> <path d="M13.7746 19.8978C13.8482 19.8978 13.9079 19.8381 13.9079 19.7644V14.2129C13.9079 14.1393 13.8482 14.0796 13.7746 14.0796H12.642C12.6171 14.0796 12.5927 14.0865 12.5716 14.0997L11.2322 14.9325C11.1931 14.9568 11.1693 14.9996 11.1693 15.0457V15.9497C11.1693 16.0539 11.2833 16.1178 11.3722 16.0635L12.464 15.396C12.4682 15.3934 12.473 15.3921 12.4779 15.3921C12.4926 15.3921 12.5045 15.404 12.5045 15.4187V19.7644C12.5045 19.8381 12.5642 19.8978 12.6378 19.8978H13.7746Z" fill="currentColor"/>`;
      Icon$81 = `<path d="M15.3333 10.3452C15.3333 10.8924 15.9561 11.2066 16.3962 10.8814L20.9234 7.5364C21.2841 7.26993 21.2841 6.73054 20.9235 6.46405L16.3962 3.11873C15.9561 2.79356 15.3333 3.10773 15.3333 3.6549V5.22682C15.3333 5.29746 15.2778 5.35579 15.2073 5.36066C9.31791 5.76757 4.66667 10.674 4.66667 16.6667C4.66667 22.9259 9.74078 28 16 28C22.0352 28 26.9686 23.2827 27.314 17.3341C27.3354 16.9665 27.0348 16.6673 26.6666 16.6673H24.6666C24.2984 16.6673 24.0029 16.9668 23.9726 17.3337C23.6336 21.4399 20.1937 24.6667 16 24.6667C11.5817 24.6667 8 21.085 8 16.6667C8 12.5225 11.1517 9.11428 15.1887 8.70739C15.2663 8.69957 15.3333 8.76096 15.3333 8.83893V10.3452Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0879 19.679C17.4553 19.9195 17.8928 20.0398 18.4004 20.0398C18.9099 20.0398 19.3474 19.9205 19.7129 19.6818C20.0803 19.4413 20.3635 19.0938 20.5623 18.6392C20.7612 18.1847 20.8606 17.6373 20.8606 16.9972C20.8625 16.3608 20.764 15.8192 20.5652 15.3722C20.3663 14.9252 20.0822 14.5853 19.7129 14.3523C19.3455 14.1175 18.908 14 18.4004 14C17.8928 14 17.4553 14.1175 17.0879 14.3523C16.7224 14.5853 16.4402 14.9252 16.2413 15.3722C16.0443 15.8173 15.9449 16.3589 15.943 16.9972C15.9411 17.6354 16.0396 18.1818 16.2385 18.6364C16.4373 19.089 16.7205 19.4366 17.0879 19.679ZM19.1362 18.4262C18.9487 18.7349 18.7034 18.8892 18.4004 18.8892C18.1996 18.8892 18.0225 18.8211 17.8691 18.6847C17.7157 18.5464 17.5964 18.3372 17.5112 18.0568C17.4278 17.7765 17.3871 17.4233 17.389 16.9972C17.3909 16.3684 17.4847 15.9025 17.6703 15.5995C17.8559 15.2945 18.0992 15.1421 18.4004 15.1421C18.603 15.1421 18.7801 15.2093 18.9316 15.3438C19.0831 15.4782 19.2015 15.6828 19.2867 15.9574C19.372 16.2301 19.4146 16.5767 19.4146 16.9972C19.4165 17.6392 19.3237 18.1156 19.1362 18.4262Z" fill="currentColor"/> <path d="M13.7746 19.8978C13.8482 19.8978 13.9079 19.8381 13.9079 19.7644V14.2129C13.9079 14.1393 13.8482 14.0796 13.7746 14.0796H12.642C12.6171 14.0796 12.5927 14.0865 12.5716 14.0997L11.2322 14.9325C11.1931 14.9568 11.1693 14.9996 11.1693 15.0457V15.9497C11.1693 16.0539 11.2833 16.1178 11.3722 16.0635L12.464 15.396C12.4682 15.3934 12.473 15.3921 12.4779 15.3921C12.4926 15.3921 12.5045 15.404 12.5045 15.4187V19.7644C12.5045 19.8381 12.5642 19.8978 12.6378 19.8978H13.7746Z" fill="currentColor"/>`;
      Icon$88 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5722 5.33333C13.2429 5.33333 12.9629 5.57382 12.9132 5.89938L12.4063 9.21916C12.4 9.26058 12.3746 9.29655 12.3378 9.31672C12.2387 9.37118 12.1409 9.42779 12.0444 9.48648C12.0086 9.5083 11.9646 9.51242 11.9255 9.49718L8.79572 8.27692C8.48896 8.15732 8.14083 8.27958 7.9762 8.56472L5.5491 12.7686C5.38444 13.0538 5.45271 13.4165 5.70981 13.6223L8.33308 15.7225C8.3658 15.7487 8.38422 15.7887 8.38331 15.8306C8.38209 15.8867 8.38148 15.9429 8.38148 15.9993C8.38148 16.0558 8.3821 16.1121 8.38332 16.1684C8.38423 16.2102 8.36582 16.2503 8.33313 16.2765L5.7103 18.3778C5.45334 18.5836 5.38515 18.9462 5.54978 19.2314L7.97688 23.4352C8.14155 23.7205 8.48981 23.8427 8.79661 23.723L11.926 22.5016C11.9651 22.4864 12.009 22.4905 12.0449 22.5123C12.1412 22.5709 12.2388 22.6274 12.3378 22.6818C12.3745 22.7019 12.4 22.7379 12.4063 22.7793L12.9132 26.0993C12.9629 26.4249 13.2429 26.6654 13.5722 26.6654H18.4264C18.7556 26.6654 19.0356 26.425 19.0854 26.0995L19.5933 22.7801C19.5997 22.7386 19.6252 22.7027 19.6619 22.6825C19.7614 22.6279 19.8596 22.5711 19.9564 22.5121C19.9923 22.4903 20.0362 22.4862 20.0754 22.5015L23.2035 23.7223C23.5103 23.842 23.8585 23.7198 24.0232 23.4346L26.4503 19.2307C26.6149 18.9456 26.5467 18.583 26.2898 18.3771L23.6679 16.2766C23.6352 16.2504 23.6168 16.2104 23.6177 16.1685C23.619 16.1122 23.6196 16.0558 23.6196 15.9993C23.6196 15.9429 23.619 15.8866 23.6177 15.8305C23.6168 15.7886 23.6353 15.7486 23.668 15.7224L26.2903 13.623C26.5474 13.4172 26.6156 13.0544 26.451 12.7692L24.0239 8.56537C23.8592 8.28023 23.5111 8.15797 23.2043 8.27757L20.0758 9.49734C20.0367 9.51258 19.9927 9.50846 19.9569 9.48664C19.8599 9.42762 19.7616 9.37071 19.6618 9.31596C19.6251 9.2958 19.5997 9.25984 19.5933 9.21843L19.0854 5.89915C19.0356 5.57369 18.7556 5.33333 18.4264 5.33333H13.5722ZM16.0001 20.2854C18.3672 20.2854 20.2862 18.3664 20.2862 15.9993C20.2862 13.6322 18.3672 11.7132 16.0001 11.7132C13.6329 11.7132 11.714 13.6322 11.714 15.9993C11.714 18.3664 13.6329 20.2854 16.0001 20.2854Z" fill="currentColor"/>`;
      Icon$104 = `<path d="M17.5091 24.6595C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9992 9.36923 19.9992H4.66667C4.29848 19.9992 4 19.7007 4 19.3325V12.6658C4 12.2976 4.29848 11.9992 4.66667 11.9992H9.37115C9.39967 11.9992 9.42745 11.99 9.45039 11.9731L16.4463 6.80363C16.8863 6.47845 17.5091 6.79262 17.5091 7.3398L17.5091 24.6595Z" fill="currentColor"/> <path d="M27.5091 9.33336C27.8773 9.33336 28.1758 9.63184 28.1758 10V22C28.1758 22.3682 27.8773 22.6667 27.5091 22.6667H26.1758C25.8076 22.6667 25.5091 22.3682 25.5091 22V10C25.5091 9.63184 25.8076 9.33336 26.1758 9.33336L27.5091 9.33336Z" fill="currentColor"/> <path d="M22.1758 12C22.544 12 22.8424 12.2985 22.8424 12.6667V19.3334C22.8424 19.7016 22.544 20 22.1758 20H20.8424C20.4743 20 20.1758 19.7016 20.1758 19.3334V12.6667C20.1758 12.2985 20.4743 12 20.8424 12H22.1758Z" fill="currentColor"/>`;
      Icon$105 = `<path d="M17.5091 24.6594C17.5091 25.2066 16.8864 25.5207 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3324V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.80358C16.8863 6.4784 17.5091 6.79258 17.5091 7.33975L17.5091 24.6594Z" fill="currentColor"/> <path d="M22.8424 12.6667C22.8424 12.2985 22.544 12 22.1758 12H20.8424C20.4743 12 20.1758 12.2985 20.1758 12.6667V19.3333C20.1758 19.7015 20.4743 20 20.8424 20H22.1758C22.544 20 22.8424 19.7015 22.8424 19.3333V12.6667Z" fill="currentColor"/>`;
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-Cpte_fRf.js
  function useMediaContext() {
    return useContext(mediaContext);
  }
  function useMediaState() {
    return useMediaContext().$state;
  }
  var mediaContext;
  var init_vidstack_Cpte_fRf = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-Cpte_fRf.js"() {
      init_vidstack_CRlI3Mh7();
      mediaContext = createContext();
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-DwhHIY5e.js
  function canOrientScreen() {
    return canRotateScreen() && isFunction(screen.orientation.unlock);
  }
  function canRotateScreen() {
    return !isUndefined(window.screen.orientation) && !isUndefined(window.screen.orientation.lock);
  }
  function canPlayAudioType(audio, type) {
    if (!audio) audio = document.createElement("audio");
    return audio.canPlayType(type).length > 0;
  }
  function canPlayVideoType(video, type) {
    if (!video) video = document.createElement("video");
    return video.canPlayType(type).length > 0;
  }
  function canPlayHLSNatively(video) {
    if (!video) video = document.createElement("video");
    return video.canPlayType("application/vnd.apple.mpegurl").length > 0;
  }
  function canUsePictureInPicture(video) {
    return !!document.pictureInPictureEnabled && !video?.disablePictureInPicture;
  }
  function canUseVideoPresentation(video) {
    return isFunction(video?.webkitSupportsPresentationMode) && isFunction(video?.webkitSetPresentationMode);
  }
  async function canChangeVolume() {
    const video = document.createElement("video");
    video.volume = 0.5;
    await waitTimeout(0);
    return video.volume === 0.5;
  }
  function getMediaSource() {
    return window?.ManagedMediaSource ?? window?.MediaSource ?? window?.WebKitMediaSource;
  }
  function getSourceBuffer() {
    return window?.SourceBuffer ?? window?.WebKitSourceBuffer;
  }
  function isHLSSupported() {
    const MediaSource = getMediaSource();
    if (isUndefined(MediaSource)) return false;
    const isTypeSupported = MediaSource && isFunction(MediaSource.isTypeSupported) && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    const SourceBuffer = getSourceBuffer();
    const isSourceBufferValid = isUndefined(SourceBuffer) || !isUndefined(SourceBuffer.prototype) && isFunction(SourceBuffer.prototype.appendBuffer) && isFunction(SourceBuffer.prototype.remove);
    return !!isTypeSupported && !!isSourceBufferValid;
  }
  function isDASHSupported() {
    return isHLSSupported();
  }
  function isAudioSrc({ src, type }) {
    return isString(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
  }
  function isVideoSrc(src) {
    return isString(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && canPlayHLSNatively() : src.type === "video/object";
  }
  function isHLSSrc({ src, type }) {
    return isString(src) && HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type);
  }
  function isDASHSrc({ src, type }) {
    return isString(src) && DASH_VIDEO_EXTENSIONS.test(src) || DASH_VIDEO_TYPES.has(type);
  }
  function canGoogleCastSrc(src) {
    return isString(src.src) && (isAudioSrc(src) || isVideoSrc(src) || isHLSSrc(src));
  }
  function isMediaStream(src) {
    return typeof window.MediaStream !== "undefined" && src instanceof window.MediaStream;
  }
  var UA, IS_IOS, IS_IPHONE, IS_CHROME, IS_SAFARI, AUDIO_EXTENSIONS, AUDIO_TYPES, VIDEO_EXTENSIONS, VIDEO_TYPES, HLS_VIDEO_EXTENSIONS, DASH_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES, DASH_VIDEO_TYPES;
  var init_vidstack_DwhHIY5e = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-DwhHIY5e.js"() {
      init_vidstack_CRlI3Mh7();
      UA = navigator?.userAgent.toLowerCase() || "";
      IS_IOS = /iphone|ipad|ipod|ios|crios|fxios/i.test(UA);
      IS_IPHONE = /(iphone|ipod)/gi.test(navigator?.platform || "");
      IS_CHROME = !!window.chrome;
      IS_SAFARI = !!window.safari || IS_IOS;
      AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|flac)($|\?)/i;
      AUDIO_TYPES = /* @__PURE__ */ new Set([
        "audio/mpeg",
        "audio/ogg",
        "audio/3gp",
        "audio/mp3",
        "audio/webm",
        "audio/flac",
        "audio/m4a",
        "audio/m4b",
        "audio/mp4a",
        "audio/mp4"
      ]);
      VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
      VIDEO_TYPES = /* @__PURE__ */ new Set([
        "video/mp4",
        "video/webm",
        "video/3gp",
        "video/ogg",
        "video/avi",
        "video/mpeg"
      ]);
      HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;
      DASH_VIDEO_EXTENSIONS = /\.(mpd)($|\?)/i;
      HLS_VIDEO_TYPES = /* @__PURE__ */ new Set([
        // Apple sanctioned
        "application/vnd.apple.mpegurl",
        // Apple sanctioned for backwards compatibility
        "audio/mpegurl",
        // Very common
        "audio/x-mpegurl",
        // Very common
        "application/x-mpegurl",
        // Included for completeness
        "video/x-mpegurl",
        "video/mpegurl",
        "application/mpegurl"
      ]);
      DASH_VIDEO_TYPES = /* @__PURE__ */ new Set(["application/dash+xml"]);
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-BmMUBVGQ.js
  function getTimeRangesStart(range) {
    if (!range.length) return null;
    let min2 = range.start(0);
    for (let i4 = 1; i4 < range.length; i4++) {
      const value = range.start(i4);
      if (value < min2) min2 = value;
    }
    return min2;
  }
  function getTimeRangesEnd(range) {
    if (!range.length) return null;
    let max2 = range.end(0);
    for (let i4 = 1; i4 < range.length; i4++) {
      const value = range.end(i4);
      if (value > max2) max2 = value;
    }
    return max2;
  }
  function normalizeTimeIntervals(intervals) {
    if (intervals.length <= 1) {
      return intervals;
    }
    intervals.sort((a3, b2) => a3[0] - b2[0]);
    let normalized = [], current = intervals[0];
    for (let i4 = 1; i4 < intervals.length; i4++) {
      const next = intervals[i4];
      if (current[1] >= next[0] - 1) {
        current = [current[0], Math.max(current[1], next[1])];
      } else {
        normalized.push(current);
        current = next;
      }
    }
    normalized.push(current);
    return normalized;
  }
  function updateTimeIntervals(intervals, interval, value) {
    let start = interval[0], end = interval[1];
    if (value < start) {
      return [value, -1];
    } else if (value === start) {
      return interval;
    } else if (start === -1) {
      interval[0] = value;
      return interval;
    } else if (value > start) {
      interval[1] = value;
      if (end === -1) intervals.push(interval);
    }
    normalizeTimeIntervals(intervals);
    return interval;
  }
  var TimeRange;
  var init_vidstack_BmMUBVGQ = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-BmMUBVGQ.js"() {
      init_vidstack_CRlI3Mh7();
      TimeRange = class {
        #ranges;
        get length() {
          return this.#ranges.length;
        }
        constructor(start, end) {
          if (isArray(start)) {
            this.#ranges = start;
          } else if (!isUndefined(start) && !isUndefined(end)) {
            this.#ranges = [[start, end]];
          } else {
            this.#ranges = [];
          }
        }
        start(index) {
          return this.#ranges[index][0] ?? Infinity;
        }
        end(index) {
          return this.#ranges[index][1] ?? Infinity;
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-A9j--j6J.js
  function appendParamsToURL(baseUrl, params) {
    const url = new URL(baseUrl);
    for (const key2 of Object.keys(params)) {
      url.searchParams.set(key2, params[key2] + "");
    }
    return url.toString();
  }
  function preconnect(url, rel = "preconnect") {
    const exists = document.querySelector(`link[href="${url}"]`);
    if (!isNull(exists)) return true;
    const link = document.createElement("link");
    link.rel = rel;
    link.href = url;
    link.crossOrigin = "true";
    document.head.append(link);
    return true;
  }
  function loadScript(src) {
    if (pendingRequests[src]) return pendingRequests[src].promise;
    const promise = deferredPromise(), exists = document.querySelector(`script[src="${src}"]`);
    if (!isNull(exists)) {
      promise.resolve();
      return promise.promise;
    }
    pendingRequests[src] = promise;
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      promise.resolve();
      delete pendingRequests[src];
    };
    script.onerror = () => {
      promise.reject();
      delete pendingRequests[src];
    };
    setTimeout(() => document.head.append(script), 0);
    return promise.promise;
  }
  function getRequestCredentials(crossOrigin) {
    return crossOrigin === "use-credentials" ? "include" : isString(crossOrigin) ? "same-origin" : void 0;
  }
  function getDownloadFile({
    title,
    src,
    download
  }) {
    const url = isBoolean(download) || download === "" ? src.src : isString(download) ? download : download?.url;
    if (!isValidFileDownload({ url, src, download })) return null;
    return {
      url,
      name: !isBoolean(download) && !isString(download) && download?.filename || title.toLowerCase() || "media"
    };
  }
  function isValidFileDownload({
    url,
    src,
    download
  }) {
    return isString(url) && (download && download !== true || isAudioSrc(src) || isVideoSrc(src));
  }
  var pendingRequests;
  var init_vidstack_A9j_j6J = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-A9j--j6J.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_DwhHIY5e();
      pendingRequests = {};
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-DE4XvkHU.js
  function isCueActive(cue, time) {
    return time >= cue.startTime && time < cue.endTime;
  }
  function watchActiveTextTrack(tracks, kind, onChange) {
    let currentTrack = null, scope = getScope();
    function onModeChange() {
      const kinds = isString(kind) ? [kind] : kind, track = tracks.toArray().find((track2) => kinds.includes(track2.kind) && track2.mode === "showing");
      if (track === currentTrack) return;
      if (!track) {
        onChange(null);
        currentTrack = null;
        return;
      }
      if (track.readyState == 2) {
        onChange(track);
      } else {
        onChange(null);
        scoped(() => {
          const off = listenEvent(
            track,
            "load",
            () => {
              onChange(track);
              off();
            },
            { once: true }
          );
        }, scope);
      }
      currentTrack = track;
    }
    onModeChange();
    return listenEvent(tracks, "mode-change", onModeChange);
  }
  function watchCueTextChange(tracks, kind, callback) {
    watchActiveTextTrack(tracks, kind, (track) => {
      if (!track) {
        callback("");
        return;
      }
      const onCueChange = () => {
        const activeCue = track?.activeCues[0];
        callback(activeCue?.text || "");
      };
      onCueChange();
      listenEvent(track, "cue-change", onCueChange);
    });
  }
  var init_vidstack_DE4XvkHU = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-DE4XvkHU.js"() {
      init_vidstack_CRlI3Mh7();
    }
  });

  // node_modules/media-captions/dist/prod/srt-parser.js
  var srt_parser_exports = {};
  __export(srt_parser_exports, {
    SRTParser: () => SRTParser,
    default: () => createSRTParser
  });
  function createSRTParser() {
    return new SRTParser();
  }
  var MILLISECOND_SEP_RE, TIMESTAMP_SEP, SRTParser;
  var init_srt_parser = __esm({
    "node_modules/media-captions/dist/prod/srt-parser.js"() {
      init_prod();
      MILLISECOND_SEP_RE = /,/g;
      TIMESTAMP_SEP = "-->";
      SRTParser = class extends VTTParser {
        parse(line, lineCount) {
          if (line === "") {
            if (this.c) {
              this.l.push(this.c);
              this.h.onCue?.(this.c);
              this.c = null;
            }
            this.e = VTTBlock.None;
          } else if (this.e === VTTBlock.Cue) {
            this.c.text += (this.c.text ? "\n" : "") + line;
          } else if (line.includes(TIMESTAMP_SEP)) {
            const result = this.q(line, lineCount);
            if (result) {
              this.c = new VTTCue(result[0], result[1], result[2].join(" "));
              this.c.id = this.n;
              this.e = VTTBlock.Cue;
            }
          }
          this.n = line;
        }
        q(line, lineCount) {
          return super.q(line.replace(MILLISECOND_SEP_RE, "."), lineCount);
        }
      };
    }
  });

  // node_modules/media-captions/dist/prod/errors.js
  var errors_exports = {};
  __export(errors_exports, {
    ParseErrorBuilder: () => ParseErrorBuilder
  });
  var ParseErrorBuilder;
  var init_errors = __esm({
    "node_modules/media-captions/dist/prod/errors.js"() {
      init_prod();
      ParseErrorBuilder = {
        r() {
          return new ParseError({
            code: ParseErrorCode.BadSignature,
            reason: "missing WEBVTT file header",
            line: 1
          });
        },
        s(startTime, line) {
          return new ParseError({
            code: ParseErrorCode.BadTimestamp,
            reason: `cue start timestamp \`${startTime}\` is invalid on line ${line}`,
            line
          });
        },
        t(endTime, line) {
          return new ParseError({
            code: ParseErrorCode.BadTimestamp,
            reason: `cue end timestamp \`${endTime}\` is invalid on line ${line}`,
            line
          });
        },
        u(startTime, endTime, line) {
          return new ParseError({
            code: ParseErrorCode.BadTimestamp,
            reason: `cue end timestamp \`${endTime}\` is greater than start \`${startTime}\` on line ${line}`,
            line
          });
        },
        y(name, value, line) {
          return new ParseError({
            code: ParseErrorCode.BadSettingValue,
            reason: `invalid value for cue setting \`${name}\` on line ${line} (value: ${value})`,
            line
          });
        },
        x(name, value, line) {
          return new ParseError({
            code: ParseErrorCode.UnknownSetting,
            reason: `unknown cue setting \`${name}\` on line ${line} (value: ${value})`,
            line
          });
        },
        w(name, value, line) {
          return new ParseError({
            code: ParseErrorCode.BadSettingValue,
            reason: `invalid value for region setting \`${name}\` on line ${line} (value: ${value})`,
            line
          });
        },
        v(name, value, line) {
          return new ParseError({
            code: ParseErrorCode.UnknownSetting,
            reason: `unknown region setting \`${name}\` on line ${line} (value: ${value})`,
            line
          });
        },
        // SSA-specific errors
        T(type, line) {
          return new ParseError({
            code: ParseErrorCode.BadFormat,
            reason: `format missing for \`${type}\` block on line ${line}`,
            line
          });
        }
      };
    }
  });

  // node_modules/media-captions/dist/prod/ssa-parser.js
  var ssa_parser_exports = {};
  __export(ssa_parser_exports, {
    SSAParser: () => SSAParser,
    default: () => createSSAParser
  });
  function parseColor(color) {
    const abgr = parseInt(color.replace("&H", ""), 16);
    if (abgr >= 0) {
      const a3 = abgr >> 24 & 255 ^ 255;
      const alpha = a3 / 255;
      const b2 = abgr >> 16 & 255;
      const g2 = abgr >> 8 & 255;
      const r4 = abgr & 255;
      return "rgba(" + [r4, g2, b2, alpha].join(",") + ")";
    }
    return null;
  }
  function buildTextShadow(x2, y2, color) {
    const noOfShadows = Math.ceil(2 * Math.PI * x2);
    let textShadow = "";
    for (let i4 = 0; i4 < noOfShadows; i4++) {
      const theta = 2 * Math.PI * i4 / noOfShadows;
      textShadow += x2 * Math.cos(theta) + "px " + y2 * Math.sin(theta) + "px 0 " + color + (i4 == noOfShadows - 1 ? "" : ",");
    }
    return textShadow;
  }
  function createSSAParser() {
    return new SSAParser();
  }
  var FORMAT_START_RE, STYLE_START_RE, DIALOGUE_START_RE, FORMAT_SPLIT_RE, STYLE_FUNCTION_RE, NEW_LINE_RE, STYLES_SECTION_START_RE, EVENTS_SECTION_START_RE, SSAParser;
  var init_ssa_parser = __esm({
    "node_modules/media-captions/dist/prod/ssa-parser.js"() {
      init_prod();
      FORMAT_START_RE = /^Format:[\s\t]*/;
      STYLE_START_RE = /^Style:[\s\t]*/;
      DIALOGUE_START_RE = /^Dialogue:[\s\t]*/;
      FORMAT_SPLIT_RE = /[\s\t]*,[\s\t]*/;
      STYLE_FUNCTION_RE = /\{[^}]+\}/g;
      NEW_LINE_RE = /\\N/g;
      STYLES_SECTION_START_RE = /^\[(.*)[\s\t]?Styles\]$/;
      EVENTS_SECTION_START_RE = /^\[(.*)[\s\t]?Events\]$/;
      SSAParser = class {
        h;
        O = 0;
        c = null;
        l = [];
        m = [];
        N = null;
        f;
        P = {};
        async init(init) {
          this.h = init;
          if (init.errors)
            this.f = (await Promise.resolve().then(() => (init_errors(), errors_exports))).ParseErrorBuilder;
        }
        parse(line, lineCount) {
          if (this.O) {
            switch (this.O) {
              case 1:
                if (line === "") {
                  this.O = 0;
                } else if (STYLE_START_RE.test(line)) {
                  if (this.N) {
                    const styles = line.replace(STYLE_START_RE, "").split(FORMAT_SPLIT_RE);
                    this.S(styles);
                  } else {
                    this.g(this.f?.T("Style", lineCount));
                  }
                } else if (FORMAT_START_RE.test(line)) {
                  this.N = line.replace(FORMAT_START_RE, "").split(FORMAT_SPLIT_RE);
                } else if (EVENTS_SECTION_START_RE.test(line)) {
                  this.N = null;
                  this.O = 2;
                }
                break;
              case 2:
                if (line === "") {
                  this.Q();
                } else if (DIALOGUE_START_RE.test(line)) {
                  this.Q();
                  if (this.N) {
                    const dialogue = line.replace(DIALOGUE_START_RE, "").split(FORMAT_SPLIT_RE), cue = this.U(dialogue, lineCount);
                    if (cue)
                      this.c = cue;
                  } else {
                    this.g(this.f?.T("Dialogue", lineCount));
                  }
                } else if (this.c) {
                  this.c.text += "\n" + line.replace(STYLE_FUNCTION_RE, "").replace(NEW_LINE_RE, "\n");
                } else if (FORMAT_START_RE.test(line)) {
                  this.N = line.replace(FORMAT_START_RE, "").split(FORMAT_SPLIT_RE);
                } else if (STYLES_SECTION_START_RE.test(line)) {
                  this.N = null;
                  this.O = 1;
                } else if (EVENTS_SECTION_START_RE.test(line)) {
                  this.N = null;
                }
            }
          } else if (line === "") ;
          else if (STYLES_SECTION_START_RE.test(line)) {
            this.N = null;
            this.O = 1;
          } else if (EVENTS_SECTION_START_RE.test(line)) {
            this.N = null;
            this.O = 2;
          }
        }
        done() {
          return {
            metadata: {},
            cues: this.l,
            regions: [],
            errors: this.m
          };
        }
        Q() {
          if (!this.c)
            return;
          this.l.push(this.c);
          this.h.onCue?.(this.c);
          this.c = null;
        }
        S(values) {
          let name = "Default", styles = {}, outlineX, align = "center", vertical = "bottom", marginV, outlineY = 1.2, outlineColor, bgColor, borderStyle = 3, transform = [];
          for (let i4 = 0; i4 < this.N.length; i4++) {
            const field = this.N[i4], value = values[i4];
            switch (field) {
              case "Name":
                name = value;
                break;
              case "Fontname":
                styles["font-family"] = value;
                break;
              case "Fontsize":
                styles["font-size"] = `calc(${value} / var(--overlay-height))`;
                break;
              case "PrimaryColour":
                const color = parseColor(value);
                if (color)
                  styles["--cue-color"] = color;
                break;
              case "BorderStyle":
                borderStyle = parseInt(value, 10);
                break;
              case "BackColour":
                bgColor = parseColor(value);
                break;
              case "OutlineColour":
                const _outlineColor = parseColor(value);
                if (_outlineColor)
                  outlineColor = _outlineColor;
                break;
              case "Bold":
                if (parseInt(value))
                  styles["font-weight"] = "bold";
                break;
              case "Italic":
                if (parseInt(value))
                  styles["font-style"] = "italic";
                break;
              case "Underline":
                if (parseInt(value))
                  styles["text-decoration"] = "underline";
                break;
              case "StrikeOut":
                if (parseInt(value))
                  styles["text-decoration"] = "line-through";
                break;
              case "Spacing":
                styles["letter-spacing"] = value + "px";
                break;
              case "AlphaLevel":
                styles["opacity"] = parseFloat(value);
                break;
              case "ScaleX":
                transform.push(`scaleX(${parseFloat(value) / 100})`);
                break;
              case "ScaleY":
                transform.push(`scaleY(${parseFloat(value) / 100})`);
                break;
              case "Angle":
                transform.push(`rotate(${value}deg)`);
                break;
              case "Shadow":
                outlineY = parseInt(value, 10) * 1.2;
                break;
              case "MarginL":
                styles["--cue-width"] = "auto";
                styles["--cue-left"] = parseFloat(value) + "px";
                break;
              case "MarginR":
                styles["--cue-width"] = "auto";
                styles["--cue-right"] = parseFloat(value) + "px";
                break;
              case "MarginV":
                marginV = parseFloat(value);
                break;
              case "Outline":
                outlineX = parseInt(value, 10);
                break;
              case "Alignment":
                const alignment = parseInt(value, 10);
                if (alignment >= 4)
                  vertical = alignment >= 7 ? "top" : "center";
                switch (alignment % 3) {
                  case 1:
                    align = "start";
                    break;
                  case 2:
                    align = "center";
                    break;
                  case 3:
                    align = "end";
                    break;
                }
            }
          }
          styles.R = vertical;
          styles["--cue-white-space"] = "normal";
          styles["--cue-line-height"] = "normal";
          styles["--cue-text-align"] = align;
          if (vertical === "center") {
            styles[`--cue-top`] = "50%";
            transform.push("translateY(-50%)");
          } else {
            styles[`--cue-${vertical}`] = (marginV || 0) + "px";
          }
          if (borderStyle === 1) {
            styles["--cue-padding-y"] = "0";
          }
          if (borderStyle === 1 || bgColor) {
            styles["--cue-bg-color"] = borderStyle === 1 ? "none" : bgColor;
          }
          if (borderStyle === 3 && outlineColor) {
            styles["--cue-outline"] = `${outlineX}px solid ${outlineColor}`;
          }
          if (borderStyle === 1 && typeof outlineX === "number") {
            const color = bgColor ?? "#000";
            styles["--cue-text-shadow"] = [
              outlineColor && buildTextShadow(outlineX * 1.2, outlineY * 1.2, outlineColor),
              outlineColor ? buildTextShadow(outlineX * (outlineX / 2), outlineY * (outlineX / 2), color) : buildTextShadow(outlineX, outlineY, color)
            ].filter(Boolean).join(", ");
          }
          if (transform.length)
            styles["--cue-transform"] = transform.join(" ");
          this.P[name] = styles;
        }
        U(values, lineCount) {
          const fields = this.V(values);
          const timestamp = this.q(fields.Start, fields.End, lineCount);
          if (!timestamp)
            return;
          const cue = new VTTCue(timestamp[0], timestamp[1], ""), styles = { ...this.P[fields.Style] || {} }, voice = fields.Name ? `<v ${fields.Name}>` : "";
          const vertical = styles.R, marginLeft = fields.MarginL && parseFloat(fields.MarginL), marginRight = fields.MarginR && parseFloat(fields.MarginR), marginV = fields.MarginV && parseFloat(fields.MarginV);
          if (marginLeft) {
            styles["--cue-width"] = "auto";
            styles["--cue-left"] = marginLeft + "px";
          }
          if (marginRight) {
            styles["--cue-width"] = "auto";
            styles["--cue-right"] = marginRight + "px";
          }
          if (marginV && vertical !== "center") {
            styles[`--cue-${vertical}`] = marginV + "px";
          }
          cue.text = voice + values.slice(this.N.length - 1).join(", ").replace(STYLE_FUNCTION_RE, "").replace(NEW_LINE_RE, "\n");
          delete styles.R;
          if (Object.keys(styles).length)
            cue.style = styles;
          return cue;
        }
        V(values) {
          const fields = {};
          for (let i4 = 0; i4 < this.N.length; i4++) {
            fields[this.N[i4]] = values[i4];
          }
          return fields;
        }
        q(startTimeText, endTimeText, lineCount) {
          const startTime = parseVTTTimestamp(startTimeText), endTime = parseVTTTimestamp(endTimeText);
          if (startTime !== null && endTime !== null && endTime > startTime) {
            return [startTime, endTime];
          } else {
            if (startTime === null) {
              this.g(this.f?.s(startTimeText, lineCount));
            }
            if (endTime === null) {
              this.g(this.f?.t(endTimeText, lineCount));
            }
            if (startTime != null && endTime !== null && endTime > startTime) {
              this.g(this.f?.u(startTime, endTime, lineCount));
            }
          }
        }
        g(error) {
          if (!error)
            return;
          this.m.push(error);
          if (this.h.strict) {
            this.h.cancel();
            throw error;
          } else {
            this.h.onError?.(error);
          }
        }
      };
    }
  });

  // node_modules/media-captions/dist/prod/index.js
  async function parseText(text, options) {
    const stream = new ReadableStream({
      start(controller) {
        const lines = text.split(LINE_TERMINATOR_RE);
        for (const line of lines)
          controller.enqueue(line);
        controller.close();
      }
    });
    return parseTextStream(stream, options);
  }
  async function parseTextStream(stream, options) {
    const type = options?.type ?? "vtt";
    let factory;
    if (typeof type === "string") {
      switch (type) {
        case "srt":
          factory = (await Promise.resolve().then(() => (init_srt_parser(), srt_parser_exports))).default;
          break;
        case "ssa":
        case "ass":
          factory = (await Promise.resolve().then(() => (init_ssa_parser(), ssa_parser_exports))).default;
          break;
        default:
          factory = (await Promise.resolve().then(function() {
            return vttParser;
          })).default;
      }
    } else {
      factory = type;
    }
    let result;
    const reader = stream.getReader(), parser = factory(), errors = !!options?.strict || !!options?.errors;
    await parser.init({
      strict: false,
      ...options,
      errors,
      type,
      cancel() {
        reader.cancel();
        result = parser.done(true);
      }
    });
    let i4 = 1;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        parser.parse("", i4);
        result = parser.done(false);
        break;
      }
      parser.parse(value, i4);
      i4++;
    }
    return result;
  }
  async function parseResponse(response, options) {
    const res = await response;
    if (!res.ok || !res.body) {
      let error;
      return {
        metadata: {},
        cues: [],
        regions: [],
        errors: [error]
      };
    }
    const contentType = res.headers.get("content-type") || "", type = contentType.match(/text\/(.*?)(?:;|$)/)?.[1], encoding = contentType.match(/charset=(.*?)(?:;|$)/)?.[1];
    return parseByteStream(res.body, { type, encoding, ...options });
  }
  async function parseByteStream(stream, { encoding = "utf-8", ...options } = {}) {
    const textStream = stream.pipeThrough(new TextLineTransformStream(encoding));
    return parseTextStream(textStream, options);
  }
  function toNumber(text) {
    const num = parseInt(text, 10);
    return !Number.isNaN(num) ? num : null;
  }
  function toPercentage(text) {
    const num = parseInt(text.replace(PERCENT_SIGN$1, ""), 10);
    return !Number.isNaN(num) && num >= 0 && num <= 100 ? num : null;
  }
  function toCoords(text) {
    if (!text.includes(COMMA$1))
      return null;
    const [x2, y2] = text.split(COMMA$1).map(toPercentage);
    return x2 !== null && y2 !== null ? [x2, y2] : null;
  }
  function toFloat(text) {
    const num = parseFloat(text);
    return !Number.isNaN(num) ? num : null;
  }
  function parseVTTTimestamp(timestamp) {
    const match = timestamp.match(TIMESTAMP_RE);
    if (!match)
      return null;
    const hours = match[1] ? parseInt(match[1], 10) : 0, minutes = parseInt(match[2], 10), seconds = parseInt(match[3], 10), milliseconds = match[4] ? parseInt(match[4].padEnd(3, "0"), 10) : 0, total = hours * 3600 + minutes * 60 + seconds + milliseconds / 1e3;
    if (hours < 0 || minutes < 0 || seconds < 0 || milliseconds < 0 || minutes > 59 || seconds > 59) {
      return null;
    }
    return total;
  }
  function createVTTParser() {
    return new VTTParser();
  }
  function tokenizeVTTCue(cue) {
    let buffer = "", mode = 1, result = [], stack = [], node;
    for (let i4 = 0; i4 < cue.text.length; i4++) {
      const char = cue.text[i4];
      switch (mode) {
        case 1:
          if (char === "<") {
            addText();
            mode = 2;
          } else {
            buffer += char;
          }
          break;
        case 2:
          switch (char) {
            case "\n":
            case "	":
            case " ":
              addNode();
              mode = 4;
              break;
            case ".":
              addNode();
              mode = 3;
              break;
            case "/":
              mode = 5;
              break;
            case ">":
              addNode();
              mode = 1;
              break;
            default:
              if (!buffer && DIGIT_RE.test(char))
                mode = 6;
              buffer += char;
              break;
          }
          break;
        case 3:
          switch (char) {
            case "	":
            case " ":
            case "\n":
              addClass();
              if (node)
                node.class?.trim();
              mode = 4;
              break;
            case ".":
              addClass();
              break;
            case ">":
              addClass();
              if (node)
                node.class?.trim();
              mode = 1;
              break;
            default:
              buffer += char;
          }
          break;
        case 4:
          if (char === ">") {
            buffer = buffer.replace(MULTI_SPACE_RE, " ");
            if (node?.type === "v")
              node.voice = replaceHTMLEntities(buffer);
            else if (node?.type === "lang")
              node.lang = replaceHTMLEntities(buffer);
            buffer = "";
            mode = 1;
          } else {
            buffer += char;
          }
          break;
        case 5:
          if (char === ">") {
            buffer = "";
            node = stack.pop();
            mode = 1;
          }
          break;
        case 6:
          if (char === ">") {
            const time = parseVTTTimestamp(buffer);
            if (time !== null && time >= cue.startTime && time <= cue.endTime) {
              buffer = "timestamp";
              addNode();
              node.time = time;
            }
            buffer = "";
            mode = 1;
          } else {
            buffer += char;
          }
          break;
      }
    }
    function addNode() {
      if (BLOCK_TYPES.has(buffer)) {
        const parent = node;
        node = createBlockNode(buffer);
        if (parent) {
          if (stack[stack.length - 1] !== parent)
            stack.push(parent);
          parent.children.push(node);
        } else
          result.push(node);
      }
      buffer = "";
      mode = 1;
    }
    function addClass() {
      if (node && buffer) {
        const color = buffer.replace("bg_", "");
        if (COLORS.has(color)) {
          node[buffer.startsWith("bg_") ? "bgColor" : "color"] = color;
        } else {
          node.class = !node.class ? buffer : node.class + " " + buffer;
        }
      }
      buffer = "";
    }
    function addText() {
      if (!buffer)
        return;
      const text = { type: "text", data: replaceHTMLEntities(buffer) };
      node ? node.children.push(text) : result.push(text);
      buffer = "";
    }
    if (mode === 1)
      addText();
    return result;
  }
  function createBlockNode(type) {
    return {
      tagName: TAG_NAME[type],
      type,
      children: []
    };
  }
  function replaceHTMLEntities(text) {
    return text.replace(HTML_ENTITY_RE, (entity) => HTML_ENTITIES[entity] || "'");
  }
  function setCSSVar(el, name, value) {
    el.style.setProperty(`--${name}`, value + "");
  }
  function setDataAttr(el, name, value = true) {
    el.setAttribute(`data-${name}`, value === true ? "" : value + "");
  }
  function setPartAttr(el, name) {
    el.setAttribute("data-part", name);
  }
  function getLineHeight(el) {
    return parseFloat(getComputedStyle(el).lineHeight) || 0;
  }
  function createVTTCueTemplate(cue) {
    if (IS_SERVER) {
      throw Error(
        "[media-captions] called `createVTTCueTemplate` on the server - use `renderVTTCueString`"
      );
    }
    const template = document.createElement("template");
    template.innerHTML = renderVTTCueString(cue);
    return { cue, content: template.content };
  }
  function renderVTTCueString(cue, currentTime = 0) {
    return renderVTTTokensString(tokenizeVTTCue(cue), currentTime);
  }
  function renderVTTTokensString(tokens, currentTime = 0) {
    let attrs, result = "";
    for (const token of tokens) {
      if (token.type === "text") {
        result += token.data;
      } else {
        const isTimestamp = token.type === "timestamp";
        attrs = {};
        attrs.class = token.class;
        attrs.title = token.type === "v" && token.voice;
        attrs.lang = token.type === "lang" && token.lang;
        attrs["data-part"] = token.type === "v" && "voice";
        if (isTimestamp) {
          attrs["data-part"] = "timed";
          attrs["data-time"] = token.time;
          attrs["data-future"] = token.time > currentTime;
          attrs["data-past"] = token.time < currentTime;
        }
        attrs.style = `${token.color ? `color: ${token.color};` : ""}${token.bgColor ? `background-color: ${token.bgColor};` : ""}`;
        const attributes = Object.entries(attrs).filter((v2) => v2[1]).map((v2) => `${v2[0]}="${v2[1] === true ? "" : v2[1]}"`).join(" ");
        result += `<${token.tagName}${attributes ? " " + attributes : ""}>${renderVTTTokensString(
          token.children
        )}</${token.tagName}>`;
      }
    }
    return result;
  }
  function updateTimedVTTCueNodes(root2, currentTime) {
    if (IS_SERVER)
      return;
    for (const el of root2.querySelectorAll('[data-part="timed"]')) {
      const time = Number(el.getAttribute("data-time"));
      if (Number.isNaN(time))
        continue;
      if (time > currentTime)
        setDataAttr(el, "future");
      else
        el.removeAttribute("data-future");
      if (time < currentTime)
        setDataAttr(el, "past");
      else
        el.removeAttribute("data-past");
    }
  }
  function debounce2(fn, delay) {
    let timeout = null, args;
    function run() {
      clear();
      fn(...args);
      args = void 0;
    }
    function clear() {
      clearTimeout(timeout);
      timeout = null;
    }
    function debounce22() {
      args = [].slice.call(arguments);
      clear();
      timeout = setTimeout(run, delay);
    }
    return debounce22;
  }
  function createBox(box) {
    if (box instanceof HTMLElement) {
      return {
        top: box.offsetTop,
        width: box.clientWidth,
        height: box.clientHeight,
        left: box.offsetLeft,
        right: box.offsetLeft + box.clientWidth,
        bottom: box.offsetTop + box.clientHeight
      };
    }
    return { ...box };
  }
  function moveBox(box, axis, delta) {
    switch (axis) {
      case "+x":
        box.left += delta;
        box.right += delta;
        break;
      case "-x":
        box.left -= delta;
        box.right -= delta;
        break;
      case "+y":
        box.top += delta;
        box.bottom += delta;
        break;
      case "-y":
        box.top -= delta;
        box.bottom -= delta;
        break;
    }
  }
  function isBoxCollision(a3, b2) {
    return a3.left <= b2.right && a3.right >= b2.left && a3.top <= b2.bottom && a3.bottom >= b2.top;
  }
  function isAnyBoxCollision(box, boxes) {
    for (let i4 = 0; i4 < boxes.length; i4++)
      if (isBoxCollision(box, boxes[i4]))
        return boxes[i4];
    return null;
  }
  function isWithinBox(container, box) {
    return box.top >= 0 && box.bottom <= container.height && box.left >= 0 && box.right <= container.width;
  }
  function isBoxOutOfBounds(container, box, axis) {
    switch (axis) {
      case "+x":
        return box.left < 0;
      case "-x":
        return box.right > container.width;
      case "+y":
        return box.top < 0;
      case "-y":
        return box.bottom > container.height;
    }
  }
  function calcBoxIntersectPercentage(container, box) {
    const x2 = Math.max(0, Math.min(container.width, box.right) - Math.max(0, box.left)), y2 = Math.max(0, Math.min(container.height, box.bottom) - Math.max(0, box.top)), intersectArea = x2 * y2;
    return intersectArea / (container.height * container.width);
  }
  function createCSSBox(container, box) {
    return {
      top: box.top / container.height,
      left: box.left / container.width,
      right: (container.width - box.right) / container.width,
      bottom: (container.height - box.bottom) / container.height
    };
  }
  function resolveRelativeBox(container, box) {
    box.top = box.top * container.height;
    box.left = box.left * container.width;
    box.right = container.width - box.right * container.width;
    box.bottom = container.height - box.bottom * container.height;
    return box;
  }
  function setBoxCSSVars(el, container, box, prefix) {
    const cssBox = createCSSBox(container, box);
    for (const side of BOX_SIDES) {
      setCSSVar(el, `${prefix}-${side}`, cssBox[side] * 100 + "%");
    }
  }
  function avoidBoxCollisions(container, box, boxes, axis) {
    let percentage = 1, positionedBox, startBox = { ...box };
    for (let i4 = 0; i4 < axis.length; i4++) {
      while (isBoxOutOfBounds(container, box, axis[i4]) || isWithinBox(container, box) && isAnyBoxCollision(box, boxes)) {
        moveBox(box, axis[i4], 1);
      }
      if (isWithinBox(container, box))
        return box;
      const intersection = calcBoxIntersectPercentage(container, box);
      if (percentage > intersection) {
        positionedBox = { ...box };
        percentage = intersection;
      }
      box = { ...startBox };
    }
    return positionedBox || startBox;
  }
  function positionCue(container, cue, displayEl, boxes) {
    let cueEl = displayEl.firstElementChild, line = computeCueLine(cue), displayBox, axis = [];
    if (!displayEl[STARTING_BOX]) {
      displayEl[STARTING_BOX] = createStartingBox(container, displayEl);
    }
    displayBox = resolveRelativeBox(container, { ...displayEl[STARTING_BOX] });
    if (displayEl[POSITION_OVERRIDE]) {
      axis = [displayEl[POSITION_OVERRIDE] === "top" ? "+y" : "-y", "+x", "-x"];
    } else if (cue.snapToLines) {
      let size2;
      switch (cue.vertical) {
        case "":
          axis = ["+y", "-y"];
          size2 = "height";
          break;
        case "rl":
          axis = ["+x", "-x"];
          size2 = "width";
          break;
        case "lr":
          axis = ["-x", "+x"];
          size2 = "width";
          break;
      }
      let step = getLineHeight(cueEl), position = step * Math.round(line), maxPosition = container[size2] + step, initialAxis = axis[0];
      if (Math.abs(position) > maxPosition) {
        position = position < 0 ? -1 : 1;
        position *= Math.ceil(maxPosition / step) * step;
      }
      if (line < 0) {
        position += cue.vertical === "" ? container.height : container.width;
        axis = axis.reverse();
      }
      moveBox(displayBox, initialAxis, position);
    } else {
      const isHorizontal = cue.vertical === "", posAxis = isHorizontal ? "+y" : "+x", size2 = isHorizontal ? displayBox.height : displayBox.width;
      moveBox(
        displayBox,
        posAxis,
        (isHorizontal ? container.height : container.width) * line / 100
      );
      moveBox(
        displayBox,
        posAxis,
        cue.lineAlign === "center" ? size2 / 2 : cue.lineAlign === "end" ? size2 : 0
      );
      axis = isHorizontal ? ["-y", "+y", "-x", "+x"] : ["-x", "+x", "-y", "+y"];
    }
    displayBox = avoidBoxCollisions(container, displayBox, boxes, axis);
    setBoxCSSVars(displayEl, container, displayBox, "cue");
    return displayBox;
  }
  function createStartingBox(container, cueEl) {
    const box = createBox(cueEl), pos = getStyledPositions(cueEl);
    cueEl[POSITION_OVERRIDE] = false;
    if (pos.top) {
      box.top = pos.top;
      box.bottom = pos.top + box.height;
      cueEl[POSITION_OVERRIDE] = "top";
    }
    if (pos.bottom) {
      const bottom = container.height - pos.bottom;
      box.top = bottom - box.height;
      box.bottom = bottom;
      cueEl[POSITION_OVERRIDE] = "bottom";
    }
    if (pos.left)
      box.left = pos.left;
    if (pos.right)
      box.right = container.width - pos.right;
    return createCSSBox(container, box);
  }
  function getStyledPositions(el) {
    const positions = {};
    for (const side of BOX_SIDES) {
      positions[side] = parseFloat(el.style.getPropertyValue(`--cue-${side}`));
    }
    return positions;
  }
  function computeCueLine(cue) {
    if (cue.line === "auto") {
      if (!cue.snapToLines) {
        return 100;
      } else {
        return -1;
      }
    }
    return cue.line;
  }
  function computeCuePosition(cue) {
    if (cue.position === "auto") {
      switch (cue.align) {
        case "start":
        case "left":
          return 0;
        case "right":
        case "end":
          return 100;
        default:
          return 50;
      }
    }
    return cue.position;
  }
  function computeCuePositionAlignment(cue, dir) {
    if (cue.positionAlign === "auto") {
      switch (cue.align) {
        case "start":
          return dir === "ltr" ? "line-left" : "line-right";
        case "end":
          return dir === "ltr" ? "line-right" : "line-left";
        case "center":
          return "center";
        default:
          return `line-${cue.align}`;
      }
    }
    return cue.positionAlign;
  }
  function positionRegion(container, region, regionEl, boxes) {
    let cues = Array.from(regionEl.querySelectorAll('[data-part="cue-display"]')), height = 0, limit = Math.max(0, cues.length - region.lines);
    for (let i4 = cues.length - 1; i4 >= limit; i4--) {
      height += cues[i4].offsetHeight;
    }
    setCSSVar(regionEl, "region-height", height + "px");
    if (!regionEl[STARTING_BOX]) {
      regionEl[STARTING_BOX] = createCSSBox(container, createBox(regionEl));
    }
    let box = { ...regionEl[STARTING_BOX] };
    box = resolveRelativeBox(container, box);
    box.width = regionEl.clientWidth;
    box.height = height;
    box.right = box.left + box.width;
    box.bottom = box.top + height;
    box = avoidBoxCollisions(container, box, boxes, REGION_AXIS);
    setBoxCSSVars(regionEl, container, box, "region");
    return box;
  }
  var ParseErrorCode, ParseError, LINE_TERMINATOR_RE, TextLineTransformStream, TextStreamLineIterator, TextCue, IS_SERVER, CueBase, VTTCue, VTTRegion, COMMA$1, PERCENT_SIGN$1, HEADER_MAGIC, COMMA, PERCENT_SIGN, SETTING_SEP_RE, SETTING_LINE_RE, NOTE_BLOCK_START, REGION_BLOCK_START, REGION_BLOCK_START_RE, SPACE_RE, TIMESTAMP_SEP2, TIMESTAMP_SEP_RE, ALIGN_RE, LINE_ALIGN_RE, POS_ALIGN_RE, TIMESTAMP_RE, VTTBlock, VTTParser, vttParser, DIGIT_RE, MULTI_SPACE_RE, TAG_NAME, HTML_ENTITIES, HTML_ENTITY_RE, COLORS, BLOCK_TYPES, STARTING_BOX, BOX_SIDES, POSITION_OVERRIDE, REGION_AXIS, CaptionsRenderer;
  var init_prod = __esm({
    "node_modules/media-captions/dist/prod/index.js"() {
      ParseErrorCode = {
        LoadFail: 0,
        BadSignature: 1,
        BadTimestamp: 2,
        BadSettingValue: 3,
        BadFormat: 4,
        UnknownSetting: 5
      };
      ParseError = class extends Error {
        code;
        line;
        constructor(init) {
          super(init.reason);
          this.code = init.code;
          this.line = init.line;
        }
      };
      LINE_TERMINATOR_RE = /\r?\n|\r/gm;
      TextLineTransformStream = class {
        writable;
        readable;
        constructor(encoding) {
          const transformer = new TextStreamLineIterator(encoding);
          this.writable = new WritableStream({
            write(chunk) {
              transformer.transform(chunk);
            },
            close() {
              transformer.close();
            }
          });
          this.readable = new ReadableStream({
            start(controller) {
              transformer.onLine = (line) => controller.enqueue(line);
              transformer.onClose = () => controller.close();
            }
          });
        }
      };
      TextStreamLineIterator = class {
        a = "";
        b;
        onLine;
        onClose;
        constructor(encoding) {
          this.b = new TextDecoder(encoding);
        }
        transform(chunk) {
          this.a += this.b.decode(chunk, { stream: true });
          const lines = this.a.split(LINE_TERMINATOR_RE);
          this.a = lines.pop() || "";
          for (let i4 = 0; i4 < lines.length; i4++)
            this.onLine(lines[i4].trim());
        }
        close() {
          if (this.a)
            this.onLine(this.a.trim());
          this.a = "";
          this.onClose();
        }
      };
      TextCue = class extends EventTarget {
        /**
         * A string that identifies the cue.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue/id}
         */
        id = "";
        /**
         * A `double` that represents the video time that the cue will start being displayed, in seconds.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue/startTime}
         */
        startTime;
        /**
         * A `double` that represents the video time that the cue will stop being displayed, in seconds.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue/endTime}
         */
        endTime;
        /**
         * Returns a string with the contents of the cue.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/text}
         */
        text;
        /**
         * A `boolean` for whether the video will pause when this cue stops being displayed.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue/pauseOnExit}
         */
        pauseOnExit = false;
        constructor(startTime, endTime, text) {
          super();
          this.startTime = startTime;
          this.endTime = endTime;
          this.text = text;
        }
        addEventListener(type, listener, options) {
          super.addEventListener(type, listener, options);
        }
        removeEventListener(type, listener, options) {
          super.removeEventListener(type, listener, options);
        }
      };
      IS_SERVER = typeof document === "undefined";
      CueBase = IS_SERVER ? TextCue : window.VTTCue;
      VTTCue = class extends CueBase {
        /**
         * A `VTTRegion` object describing the video's sub-region that the cue will be drawn onto,
         * or `null` if none is assigned.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/region}
         */
        region = null;
        /**
         * The cue writing direction.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/vertical}
         */
        vertical = "";
        /**
         * Returns `true` if the `VTTCue.line` attribute is an integer number of lines or a percentage
         * of the video size.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/snapToLines}
         */
        snapToLines = true;
        /**
         * Returns the line positioning of the cue. This can be the string `'auto'` or a number whose
         * interpretation depends on the value of `VTTCue.snapToLines`.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/line}
         */
        line = "auto";
        /**
         * Returns an enum representing the alignment of the `VTTCue.line`.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/lineAlign}
         */
        lineAlign = "start";
        /**
         * Returns the indentation of the cue within the line. This can be the string `'auto'` or a
         * number representing the percentage of the `VTTCue.region`, or the video size if `VTTCue`.region`
         * is `null`.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/position}
         */
        position = "auto";
        /**
         * Returns an enum representing the alignment of the cue. This is used to determine what
         * the `VTTCue.position` is anchored to. The default is `'auto'`.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/positionAlign}
         */
        positionAlign = "auto";
        /**
         * Returns a double representing the size of the cue, as a percentage of the video size.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/size}
         */
        size = 100;
        /**
         * Returns an enum representing the alignment of all the lines of text within the cue box.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/VTTCue/align}
         */
        align = "center";
        /**
         * Additional styles associated with the cue.
         */
        style;
      };
      VTTRegion = class {
        /**
         * A string that identifies the region.
         */
        id = "";
        /**
         * A `double` representing the width of the region, as a percentage of the video.
         */
        width = 100;
        /**
         * A `double` representing the height of the region, in number of lines.
         */
        lines = 3;
        /**
         * A `double` representing the region anchor X offset, as a percentage of the region.
         */
        regionAnchorX = 0;
        /**
         * A `double` representing the region anchor Y offset, as a percentage of the region.
         */
        regionAnchorY = 100;
        /**
         * A `double` representing the viewport anchor X offset, as a percentage of the video.
         */
        viewportAnchorX = 0;
        /**
         * A `double` representing the viewport anchor Y offset, as a percentage of the video.
         */
        viewportAnchorY = 100;
        /**
         * An enum representing how adding new cues will move existing cues.
         */
        scroll = "";
      };
      COMMA$1 = ",";
      PERCENT_SIGN$1 = "%";
      HEADER_MAGIC = "WEBVTT";
      COMMA = ",";
      PERCENT_SIGN = "%";
      SETTING_SEP_RE = /[:=]/;
      SETTING_LINE_RE = /^[\s\t]*(region|vertical|line|position|size|align)[:=]/;
      NOTE_BLOCK_START = "NOTE";
      REGION_BLOCK_START = "REGION";
      REGION_BLOCK_START_RE = /^REGION:?[\s\t]+/;
      SPACE_RE = /[\s\t]+/;
      TIMESTAMP_SEP2 = "-->";
      TIMESTAMP_SEP_RE = /[\s\t]*-->[\s\t]+/;
      ALIGN_RE = /start|center|end|left|right/;
      LINE_ALIGN_RE = /start|center|end/;
      POS_ALIGN_RE = /line-(?:left|right)|center|auto/;
      TIMESTAMP_RE = /^(?:(\d{1,2}):)?(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;
      VTTBlock = /* @__PURE__ */ ((VTTBlock2) => {
        VTTBlock2[VTTBlock2["None"] = 0] = "None";
        VTTBlock2[VTTBlock2["Header"] = 1] = "Header";
        VTTBlock2[VTTBlock2["Cue"] = 2] = "Cue";
        VTTBlock2[VTTBlock2["Region"] = 3] = "Region";
        VTTBlock2[VTTBlock2["Note"] = 4] = "Note";
        return VTTBlock2;
      })(VTTBlock || {});
      VTTParser = class {
        h;
        e = 0;
        i = {};
        j = {};
        l = [];
        c = null;
        d = null;
        m = [];
        f;
        n = "";
        async init(init) {
          this.h = init;
          if (init.strict)
            this.e = 1;
          if (init.errors)
            this.f = (await Promise.resolve().then(() => (init_errors(), errors_exports))).ParseErrorBuilder;
        }
        parse(line, lineCount) {
          if (line === "") {
            if (this.c) {
              this.l.push(this.c);
              this.h.onCue?.(this.c);
              this.c = null;
            } else if (this.d) {
              this.j[this.d.id] = this.d;
              this.h.onRegion?.(this.d);
              this.d = null;
            } else if (this.e === 1) {
              this.k(line, lineCount);
              this.h.onHeaderMetadata?.(this.i);
            }
            this.e = 0;
          } else if (this.e) {
            switch (this.e) {
              case 1:
                this.k(line, lineCount);
                break;
              case 2:
                if (this.c) {
                  const hasText = this.c.text.length > 0;
                  if (!hasText && SETTING_LINE_RE.test(line)) {
                    this.o(line.split(SPACE_RE), lineCount);
                  } else {
                    this.c.text += (hasText ? "\n" : "") + line;
                  }
                }
                break;
              case 3:
                this.p(line.split(SPACE_RE), lineCount);
                break;
            }
          } else if (line.startsWith(NOTE_BLOCK_START)) {
            this.e = 4;
          } else if (line.startsWith(REGION_BLOCK_START)) {
            this.e = 3;
            this.d = new VTTRegion();
            this.p(line.replace(REGION_BLOCK_START_RE, "").split(SPACE_RE), lineCount);
          } else if (line.includes(TIMESTAMP_SEP2)) {
            const result = this.q(line, lineCount);
            if (result) {
              this.c = new VTTCue(result[0], result[1], "");
              this.c.id = this.n;
              this.o(result[2], lineCount);
            }
            this.e = 2;
          } else if (lineCount === 1) {
            this.k(line, lineCount);
          }
          this.n = line;
        }
        done() {
          return {
            metadata: this.i,
            cues: this.l,
            regions: Object.values(this.j),
            errors: this.m
          };
        }
        k(line, lineCount) {
          if (lineCount > 1) {
            if (SETTING_SEP_RE.test(line)) {
              const [key2, value] = line.split(SETTING_SEP_RE);
              if (key2)
                this.i[key2] = (value || "").replace(SPACE_RE, "");
            }
          } else if (line.startsWith(HEADER_MAGIC)) {
            this.e = 1;
          } else {
            this.g(this.f?.r());
          }
        }
        q(line, lineCount) {
          const [startTimeText, trailingText = ""] = line.split(TIMESTAMP_SEP_RE), [endTimeText, ...settingsText] = trailingText.split(SPACE_RE), startTime = parseVTTTimestamp(startTimeText), endTime = parseVTTTimestamp(endTimeText);
          if (startTime !== null && endTime !== null && endTime > startTime) {
            return [startTime, endTime, settingsText];
          } else {
            if (startTime === null) {
              this.g(this.f?.s(startTimeText, lineCount));
            }
            if (endTime === null) {
              this.g(this.f?.t(endTimeText, lineCount));
            }
            if (startTime != null && endTime !== null && endTime > startTime) {
              this.g(this.f?.u(startTime, endTime, lineCount));
            }
          }
        }
        /**
         * @see {@link https://www.w3.org/TR/webvtt1/#region-settings-parsing}
         */
        p(settings, line) {
          let badValue;
          for (let i4 = 0; i4 < settings.length; i4++) {
            if (SETTING_SEP_RE.test(settings[i4])) {
              badValue = false;
              const [name, value] = settings[i4].split(SETTING_SEP_RE);
              switch (name) {
                case "id":
                  this.d.id = value;
                  break;
                case "width":
                  const width = toPercentage(value);
                  if (width !== null)
                    this.d.width = width;
                  else
                    badValue = true;
                  break;
                case "lines":
                  const lines = toNumber(value);
                  if (lines !== null)
                    this.d.lines = lines;
                  else
                    badValue = true;
                  break;
                case "regionanchor":
                  const region = toCoords(value);
                  if (region !== null) {
                    this.d.regionAnchorX = region[0];
                    this.d.regionAnchorY = region[1];
                  } else
                    badValue = true;
                  break;
                case "viewportanchor":
                  const viewport = toCoords(value);
                  if (viewport !== null) {
                    this.d.viewportAnchorX = viewport[0];
                    this.d.viewportAnchorY = viewport[1];
                  } else
                    badValue = true;
                  break;
                case "scroll":
                  if (value === "up")
                    this.d.scroll = "up";
                  else
                    badValue = true;
                  break;
                default:
                  this.g(this.f?.v(name, value, line));
              }
              if (badValue) {
                this.g(this.f?.w(name, value, line));
              }
            }
          }
        }
        /**
         * @see {@link https://www.w3.org/TR/webvtt1/#cue-timings-and-settings-parsing}
         */
        o(settings, line) {
          let badValue;
          for (let i4 = 0; i4 < settings.length; i4++) {
            badValue = false;
            if (SETTING_SEP_RE.test(settings[i4])) {
              const [name, value] = settings[i4].split(SETTING_SEP_RE);
              switch (name) {
                case "region":
                  const region = this.j[value];
                  if (region)
                    this.c.region = region;
                  break;
                case "vertical":
                  if (value === "lr" || value === "rl") {
                    this.c.vertical = value;
                    this.c.region = null;
                  } else
                    badValue = true;
                  break;
                case "line":
                  const [linePos, lineAlign] = value.split(COMMA);
                  if (linePos.includes(PERCENT_SIGN)) {
                    const percentage = toPercentage(linePos);
                    if (percentage !== null) {
                      this.c.line = percentage;
                      this.c.snapToLines = false;
                    } else
                      badValue = true;
                  } else {
                    const number = toFloat(linePos);
                    if (number !== null)
                      this.c.line = number;
                    else
                      badValue = true;
                  }
                  if (LINE_ALIGN_RE.test(lineAlign)) {
                    this.c.lineAlign = lineAlign;
                  } else if (lineAlign) {
                    badValue = true;
                  }
                  if (this.c.line !== "auto")
                    this.c.region = null;
                  break;
                case "position":
                  const [colPos, colAlign] = value.split(COMMA), position = toPercentage(colPos);
                  if (position !== null)
                    this.c.position = position;
                  else
                    badValue = true;
                  if (colAlign && POS_ALIGN_RE.test(colAlign)) {
                    this.c.positionAlign = colAlign;
                  } else if (colAlign) {
                    badValue = true;
                  }
                  break;
                case "size":
                  const size2 = toPercentage(value);
                  if (size2 !== null) {
                    this.c.size = size2;
                    if (size2 < 100)
                      this.c.region = null;
                  } else {
                    badValue = true;
                  }
                  break;
                case "align":
                  if (ALIGN_RE.test(value)) {
                    this.c.align = value;
                  } else {
                    badValue = true;
                  }
                  break;
                default:
                  this.g(this.f?.x(name, value, line));
              }
              if (badValue) {
                this.g(this.f?.y(name, value, line));
              }
            }
          }
        }
        g(error) {
          if (!error)
            return;
          this.m.push(error);
          if (this.h.strict) {
            this.h.cancel();
            throw error;
          } else {
            this.h.onError?.(error);
          }
        }
      };
      vttParser = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        VTTBlock,
        VTTParser,
        default: createVTTParser,
        parseVTTTimestamp
      });
      DIGIT_RE = /[0-9]/;
      MULTI_SPACE_RE = /[\s\t]+/;
      TAG_NAME = {
        c: "span",
        i: "i",
        b: "b",
        u: "u",
        ruby: "ruby",
        rt: "rt",
        v: "span",
        lang: "span",
        timestamp: "span"
      };
      HTML_ENTITIES = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&nbsp;": "\xA0",
        "&lrm;": "\u200E",
        "&rlm;": "\u200F"
      };
      HTML_ENTITY_RE = /&(?:amp|lt|gt|quot|#(0+)?39|nbsp|lrm|rlm);/g;
      COLORS = /* @__PURE__ */ new Set([
        "white",
        "lime",
        "cyan",
        "red",
        "yellow",
        "magenta",
        "blue",
        "black"
      ]);
      BLOCK_TYPES = /* @__PURE__ */ new Set(Object.keys(TAG_NAME));
      STARTING_BOX = Symbol(0);
      BOX_SIDES = ["top", "left", "right", "bottom"];
      POSITION_OVERRIDE = Symbol(0);
      REGION_AXIS = ["-y", "+y", "-x", "+x"];
      CaptionsRenderer = class {
        overlay;
        z;
        A = 0;
        C = "ltr";
        B = [];
        D = false;
        E;
        j = /* @__PURE__ */ new Map();
        l = /* @__PURE__ */ new Map();
        /* Text direction. */
        get dir() {
          return this.C;
        }
        set dir(dir) {
          this.C = dir;
          setDataAttr(this.overlay, "dir", dir);
        }
        get currentTime() {
          return this.A;
        }
        set currentTime(time) {
          this.A = time;
          this.update();
        }
        constructor(overlay, init) {
          this.overlay = overlay;
          this.dir = init?.dir ?? "ltr";
          overlay.setAttribute("translate", "yes");
          overlay.setAttribute("aria-live", "off");
          overlay.setAttribute("aria-atomic", "true");
          setPartAttr(overlay, "captions");
          this.G();
          this.E = new ResizeObserver(this.I.bind(this));
          this.E.observe(overlay);
        }
        changeTrack({ regions, cues }) {
          this.reset();
          this.J(regions);
          for (const cue of cues)
            this.l.set(cue, null);
          this.update();
        }
        addCue(cue) {
          this.l.set(cue, null);
          this.update();
        }
        removeCue(cue) {
          this.l.delete(cue);
          this.update();
        }
        update(forceUpdate = false) {
          this.H(forceUpdate);
        }
        reset() {
          this.l.clear();
          this.j.clear();
          this.B = [];
          this.overlay.textContent = "";
        }
        destroy() {
          this.reset();
          this.E.disconnect();
        }
        I() {
          this.D = true;
          this.K();
        }
        K = debounce2(() => {
          this.D = false;
          this.G();
          for (const el of this.j.values()) {
            el[STARTING_BOX] = null;
          }
          for (const el of this.l.values()) {
            if (el)
              el[STARTING_BOX] = null;
          }
          this.H(true);
        }, 50);
        G() {
          this.z = createBox(this.overlay);
          setCSSVar(this.overlay, "overlay-width", this.z.width + "px");
          setCSSVar(this.overlay, "overlay-height", this.z.height + "px");
        }
        H(forceUpdate = false) {
          if (!this.l.size || this.D)
            return;
          let cue, activeCues = [...this.l.keys()].filter((cue2) => this.A >= cue2.startTime && this.A <= cue2.endTime).sort(
            (cueA, cueB) => cueA.startTime !== cueB.startTime ? cueA.startTime - cueB.startTime : cueA.endTime - cueB.endTime
          ), activeRegions = activeCues.map((cue2) => cue2.region);
          for (let i4 = 0; i4 < this.B.length; i4++) {
            cue = this.B[i4];
            if (activeCues[i4] === cue)
              continue;
            if (cue.region && !activeRegions.includes(cue.region)) {
              const regionEl = this.j.get(cue.region.id);
              if (regionEl) {
                regionEl.removeAttribute("data-active");
                forceUpdate = true;
              }
            }
            const cueEl = this.l.get(cue);
            if (cueEl) {
              cueEl.remove();
              forceUpdate = true;
            }
          }
          for (let i4 = 0; i4 < activeCues.length; i4++) {
            cue = activeCues[i4];
            let cueEl = this.l.get(cue);
            if (!cueEl)
              this.l.set(cue, cueEl = this.L(cue));
            const regionEl = this.F(cue) && this.j.get(cue.region.id);
            if (regionEl && !regionEl.hasAttribute("data-active")) {
              requestAnimationFrame(() => setDataAttr(regionEl, "active"));
              forceUpdate = true;
            }
            if (!cueEl.isConnected) {
              (regionEl || this.overlay).append(cueEl);
              forceUpdate = true;
            }
          }
          if (forceUpdate) {
            const boxes = [], seen = /* @__PURE__ */ new Set();
            for (let i4 = activeCues.length - 1; i4 >= 0; i4--) {
              cue = activeCues[i4];
              if (seen.has(cue.region || cue))
                continue;
              const isRegion = this.F(cue), el = isRegion ? this.j.get(cue.region.id) : this.l.get(cue);
              if (isRegion) {
                boxes.push(positionRegion(this.z, cue.region, el, boxes));
              } else {
                boxes.push(positionCue(this.z, cue, el, boxes));
              }
              seen.add(isRegion ? cue.region : cue);
            }
          }
          updateTimedVTTCueNodes(this.overlay, this.A);
          this.B = activeCues;
        }
        J(regions) {
          if (!regions)
            return;
          for (const region of regions) {
            const el = this.M(region);
            this.j.set(region.id, el);
            this.overlay.append(el);
          }
        }
        M(region) {
          const el = document.createElement("div");
          setPartAttr(el, "region");
          setDataAttr(el, "id", region.id);
          setDataAttr(el, "scroll", region.scroll);
          setCSSVar(el, "region-width", region.width + "%");
          setCSSVar(el, "region-anchor-x", region.regionAnchorX);
          setCSSVar(el, "region-anchor-y", region.regionAnchorY);
          setCSSVar(el, "region-viewport-anchor-x", region.viewportAnchorX);
          setCSSVar(el, "region-viewport-anchor-y", region.viewportAnchorY);
          setCSSVar(el, "region-lines", region.lines);
          return el;
        }
        L(cue) {
          const display = document.createElement("div"), position = computeCuePosition(cue), positionAlignment = computeCuePositionAlignment(cue, this.C);
          setPartAttr(display, "cue-display");
          if (cue.vertical !== "")
            setDataAttr(display, "vertical");
          setCSSVar(display, "cue-text-align", cue.align);
          if (cue.style) {
            for (const prop2 of Object.keys(cue.style)) {
              display.style.setProperty(prop2, cue.style[prop2]);
            }
          }
          if (!this.F(cue)) {
            setCSSVar(
              display,
              "cue-writing-mode",
              cue.vertical === "" ? "horizontal-tb" : cue.vertical === "lr" ? "vertical-lr" : "vertical-rl"
            );
            if (!cue.style?.["--cue-width"]) {
              let maxSize = position;
              if (positionAlignment === "line-left") {
                maxSize = 100 - position;
              } else if (positionAlignment === "center" && position <= 50) {
                maxSize = position * 2;
              } else if (positionAlignment === "center" && position > 50) {
                maxSize = (100 - position) * 2;
              }
              const size2 = cue.size < maxSize ? cue.size : maxSize;
              if (cue.vertical === "")
                setCSSVar(display, "cue-width", size2 + "%");
              else
                setCSSVar(display, "cue-height", size2 + "%");
            }
          } else {
            setCSSVar(
              display,
              "cue-offset",
              `${position - (positionAlignment === "line-right" ? 100 : positionAlignment === "center" ? 50 : 0)}%`
            );
          }
          const el = document.createElement("div");
          setPartAttr(el, "cue");
          if (cue.id)
            setDataAttr(el, "id", cue.id);
          el.innerHTML = renderVTTCueString(cue);
          display.append(el);
          return display;
        }
        F(cue) {
          return cue.region && cue.size === 100 && cue.vertical === "" && cue.line === "auto";
        }
      };
    }
  });

  // node_modules/media-captions/dist/prod.js
  var prod_exports = {};
  __export(prod_exports, {
    CaptionsRenderer: () => CaptionsRenderer,
    ParseError: () => ParseError,
    ParseErrorCode: () => ParseErrorCode,
    TextCue: () => TextCue,
    VTTCue: () => VTTCue,
    VTTRegion: () => VTTRegion,
    createVTTCueTemplate: () => createVTTCueTemplate,
    parseByteStream: () => parseByteStream,
    parseResponse: () => parseResponse,
    parseText: () => parseText,
    parseTextStream: () => parseTextStream,
    parseVTTTimestamp: () => parseVTTTimestamp,
    renderVTTCueString: () => renderVTTCueString,
    renderVTTTokensString: () => renderVTTTokensString,
    tokenizeVTTCue: () => tokenizeVTTCue,
    updateTimedVTTCueNodes: () => updateTimedVTTCueNodes
  });
  var init_prod2 = __esm({
    "node_modules/media-captions/dist/prod.js"() {
      init_prod();
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-oyBGi0R4.js
  function isTrackCaptionKind(track) {
    return captionRE.test(track.kind);
  }
  function parseJSONCaptionsFile(json, Cue, Region) {
    const content = isString(json) ? JSON.parse(json) : json;
    let regions = [], cues = [];
    if (content.regions && Region) {
      regions = content.regions.map((region) => Object.assign(new Region(), region));
    }
    if (content.cues || isArray(content)) {
      cues = (isArray(content) ? content : content.cues).filter((content2) => isNumber(content2.startTime) && isNumber(content2.endTime)).map((cue) => Object.assign(new Cue(0, 0, ""), cue));
    }
    return { regions, cues };
  }
  var CROSS_ORIGIN, READY_STATE, UPDATE_ACTIVE_CUES, CAN_LOAD, ON_MODE_CHANGE, NATIVE, NATIVE_HLS, TextTrackSymbol, TextTrack, captionRE;
  var init_vidstack_oyBGi0R4 = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-oyBGi0R4.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_A9j_j6J();
      init_vidstack_DE4XvkHU();
      CROSS_ORIGIN = Symbol(0);
      READY_STATE = Symbol(0);
      UPDATE_ACTIVE_CUES = Symbol(0);
      CAN_LOAD = Symbol(0);
      ON_MODE_CHANGE = Symbol(0);
      NATIVE = Symbol(0);
      NATIVE_HLS = Symbol(0);
      TextTrackSymbol = {
        crossOrigin: CROSS_ORIGIN,
        readyState: READY_STATE,
        updateActiveCues: UPDATE_ACTIVE_CUES,
        canLoad: CAN_LOAD,
        onModeChange: ON_MODE_CHANGE,
        native: NATIVE,
        nativeHLS: NATIVE_HLS
      };
      TextTrack = class extends EventsTarget {
        static createId(track) {
          return `vds-${track.type}-${track.kind}-${track.src ?? track.label ?? "?"}`;
        }
        src;
        content;
        type;
        encoding;
        id = "";
        label = "";
        language = "";
        kind;
        default = false;
        #canLoad = false;
        #currentTime = 0;
        #mode = "disabled";
        #metadata = {};
        #regions = [];
        #cues = [];
        #activeCues = [];
        /** @internal */
        [TextTrackSymbol.readyState] = 0;
        /** @internal */
        [TextTrackSymbol.crossOrigin];
        /** @internal */
        [TextTrackSymbol.onModeChange] = null;
        /** @internal */
        [TextTrackSymbol.native] = null;
        get metadata() {
          return this.#metadata;
        }
        get regions() {
          return this.#regions;
        }
        get cues() {
          return this.#cues;
        }
        get activeCues() {
          return this.#activeCues;
        }
        /**
         * - 0: Not Loading
         * - 1: Loading
         * - 2: Ready
         * - 3: Error
         */
        get readyState() {
          return this[TextTrackSymbol.readyState];
        }
        get mode() {
          return this.#mode;
        }
        set mode(mode) {
          this.setMode(mode);
        }
        constructor(init) {
          super();
          for (const prop2 of Object.keys(init)) this[prop2] = init[prop2];
          if (!this.type) this.type = "vtt";
          if (init.content) {
            this.#parseContent(init);
          } else if (!init.src) {
            this[TextTrackSymbol.readyState] = 2;
          }
        }
        addCue(cue, trigger) {
          let i4 = 0, length = this.#cues.length;
          for (i4 = 0; i4 < length; i4++) if (cue.endTime <= this.#cues[i4].startTime) break;
          if (i4 === length) this.#cues.push(cue);
          else this.#cues.splice(i4, 0, cue);
          if (!(cue instanceof TextTrackCue)) {
            this[TextTrackSymbol.native]?.track.addCue(cue);
          }
          this.dispatchEvent(new DOMEvent("add-cue", { detail: cue, trigger }));
          if (isCueActive(cue, this.#currentTime)) {
            this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
          }
        }
        removeCue(cue, trigger) {
          const index = this.#cues.indexOf(cue);
          if (index >= 0) {
            const isActive = this.#activeCues.includes(cue);
            this.#cues.splice(index, 1);
            this[TextTrackSymbol.native]?.track.removeCue(cue);
            this.dispatchEvent(new DOMEvent("remove-cue", { detail: cue, trigger }));
            if (isActive) {
              this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
            }
          }
        }
        setMode(mode, trigger) {
          if (this.#mode === mode) return;
          this.#mode = mode;
          if (mode === "disabled") {
            this.#activeCues = [];
            this.#activeCuesChanged();
          } else if (this.readyState === 2) {
            this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
          } else {
            this.#load();
          }
          this.dispatchEvent(new DOMEvent("mode-change", { detail: this, trigger }));
          this[TextTrackSymbol.onModeChange]?.();
        }
        /** @internal */
        [TextTrackSymbol.updateActiveCues](currentTime, trigger) {
          this.#currentTime = currentTime;
          if (this.mode === "disabled" || !this.#cues.length) return;
          const activeCues = [];
          for (let i4 = 0, length = this.#cues.length; i4 < length; i4++) {
            const cue = this.#cues[i4];
            if (isCueActive(cue, currentTime)) activeCues.push(cue);
          }
          let changed = activeCues.length !== this.#activeCues.length;
          if (!changed) {
            for (let i4 = 0; i4 < activeCues.length; i4++) {
              if (!this.#activeCues.includes(activeCues[i4])) {
                changed = true;
                break;
              }
            }
          }
          this.#activeCues = activeCues;
          if (changed) this.#activeCuesChanged(trigger);
        }
        /** @internal */
        [TextTrackSymbol.canLoad]() {
          this.#canLoad = true;
          if (this.#mode !== "disabled") this.#load();
        }
        #parseContent(init) {
          Promise.resolve().then(() => (init_prod2(), prod_exports)).then(({ parseText: parseText2, VTTCue: VTTCue2, VTTRegion: VTTRegion2 }) => {
            if (!isString(init.content) || init.type === "json") {
              this.#parseJSON(init.content, VTTCue2, VTTRegion2);
              if (this.readyState !== 3) this.#ready();
            } else {
              parseText2(init.content, { type: init.type }).then(({ cues, regions }) => {
                this.#cues = cues;
                this.#regions = regions;
                this.#ready();
              });
            }
          });
        }
        async #load() {
          if (!this.#canLoad || this[TextTrackSymbol.readyState] > 0) return;
          this[TextTrackSymbol.readyState] = 1;
          this.dispatchEvent(new DOMEvent("load-start"));
          if (!this.src) {
            this.#ready();
            return;
          }
          try {
            const { parseResponse: parseResponse2, VTTCue: VTTCue2, VTTRegion: VTTRegion2 } = await Promise.resolve().then(() => (init_prod2(), prod_exports)), crossOrigin = this[TextTrackSymbol.crossOrigin]?.();
            const response = fetch(this.src, {
              headers: this.type === "json" ? { "Content-Type": "application/json" } : void 0,
              credentials: getRequestCredentials(crossOrigin)
            });
            if (this.type === "json") {
              this.#parseJSON(await (await response).text(), VTTCue2, VTTRegion2);
            } else {
              const { errors, metadata, regions, cues } = await parseResponse2(response, {
                type: this.type,
                encoding: this.encoding
              });
              if (errors[0]?.code === 0) {
                throw errors[0];
              } else {
                this.#metadata = metadata;
                this.#regions = regions;
                this.#cues = cues;
              }
            }
            this.#ready();
          } catch (error) {
            this.#error(error);
          }
        }
        #ready() {
          this[TextTrackSymbol.readyState] = 2;
          if (!this.src || this.type !== "vtt") {
            const native = this[TextTrackSymbol.native];
            if (native && !native.managed) {
              for (const cue of this.#cues) native.track.addCue(cue);
            }
          }
          const loadEvent = new DOMEvent("load");
          this[TextTrackSymbol.updateActiveCues](this.#currentTime, loadEvent);
          this.dispatchEvent(loadEvent);
        }
        #error(error) {
          this[TextTrackSymbol.readyState] = 3;
          this.dispatchEvent(new DOMEvent("error", { detail: error }));
        }
        #parseJSON(json, VTTCue2, VTTRegion2) {
          try {
            const { regions, cues } = parseJSONCaptionsFile(json, VTTCue2, VTTRegion2);
            this.#regions = regions;
            this.#cues = cues;
          } catch (error) {
            this.#error(error);
          }
        }
        #activeCuesChanged(trigger) {
          this.dispatchEvent(new DOMEvent("cue-change", { trigger }));
        }
      };
      captionRE = /captions|subtitles/;
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-D5EzK014.js
  var ADD, REMOVE, RESET, SELECT, READONLY, SET_READONLY, ON_RESET, ON_REMOVE, ON_USER_SELECT, ListSymbol;
  var init_vidstack_D5EzK014 = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-D5EzK014.js"() {
      ADD = Symbol(0);
      REMOVE = Symbol(0);
      RESET = Symbol(0);
      SELECT = Symbol(0);
      READONLY = Symbol(0);
      SET_READONLY = Symbol(0);
      ON_RESET = Symbol(0);
      ON_REMOVE = Symbol(0);
      ON_USER_SELECT = Symbol(0);
      ListSymbol = {
        add: ADD,
        remove: REMOVE,
        reset: RESET,
        select: SELECT,
        readonly: READONLY,
        setReadonly: SET_READONLY,
        onReset: ON_RESET,
        onRemove: ON_REMOVE,
        onUserSelect: ON_USER_SELECT
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-B01xzxC4.js
  var SET_AUTO, ENABLE_AUTO, QualitySymbol;
  var init_vidstack_B01xzxC4 = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-B01xzxC4.js"() {
      SET_AUTO = Symbol(0);
      ENABLE_AUTO = Symbol(0);
      QualitySymbol = {
        setAuto: SET_AUTO,
        enableAuto: ENABLE_AUTO
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-C9vIqaYT.js
  function coerceToError(error) {
    return error instanceof Error ? error : Error(typeof error === "string" ? error : JSON.stringify(error));
  }
  function assert(condition, message) {
    if (!condition) {
      throw Error("Assertion failed.");
    }
  }
  var init_vidstack_C9vIqaYT = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-C9vIqaYT.js"() {
    }
  });

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
  }
  function getSideList(side, isStart, rtl) {
    const lr = ["left", "right"];
    const rl = ["right", "left"];
    const tb = ["top", "bottom"];
    const bt = ["bottom", "top"];
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rl : lr;
        return isStart ? lr : rl;
      case "left":
      case "right":
        return isStart ? tb : bt;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x: x2,
      y: y2,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y2,
      left: x2,
      right: x2 + width,
      bottom: y2 + height,
      x: x2,
      y: y2
    };
  }
  var min, max, round, floor, createCoords, oppositeSideMap, oppositeAlignmentMap;
  var init_floating_ui_utils = __esm({
    "node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs"() {
      min = Math.min;
      max = Math.max;
      round = Math.round;
      floor = Math.floor;
      createCoords = (v2) => ({
        x: v2,
        y: v2
      });
      oppositeSideMap = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
      };
      oppositeAlignmentMap = {
        start: "end",
        end: "start"
      };
    }
  });

  // node_modules/@floating-ui/core/dist/floating-ui.core.mjs
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x: x2,
      y: y2,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x2,
      y: y2,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  var computePosition, flip, shift;
  var init_floating_ui_core = __esm({
    "node_modules/@floating-ui/core/dist/floating-ui.core.mjs"() {
      init_floating_ui_utils();
      init_floating_ui_utils();
      computePosition = async (reference, floating, config) => {
        const {
          placement = "bottom",
          strategy = "absolute",
          middleware = [],
          platform: platform2
        } = config;
        const validMiddleware = middleware.filter(Boolean);
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
        let rects = await platform2.getElementRects({
          reference,
          floating,
          strategy
        });
        let {
          x: x2,
          y: y2
        } = computeCoordsFromPlacement(rects, placement, rtl);
        let statefulPlacement = placement;
        let middlewareData = {};
        let resetCount = 0;
        for (let i4 = 0; i4 < validMiddleware.length; i4++) {
          const {
            name,
            fn
          } = validMiddleware[i4];
          const {
            x: nextX,
            y: nextY,
            data,
            reset
          } = await fn({
            x: x2,
            y: y2,
            initialPlacement: placement,
            placement: statefulPlacement,
            strategy,
            middlewareData,
            rects,
            platform: platform2,
            elements: {
              reference,
              floating
            }
          });
          x2 = nextX != null ? nextX : x2;
          y2 = nextY != null ? nextY : y2;
          middlewareData = {
            ...middlewareData,
            [name]: {
              ...middlewareData[name],
              ...data
            }
          };
          if (reset && resetCount <= 50) {
            resetCount++;
            if (typeof reset === "object") {
              if (reset.placement) {
                statefulPlacement = reset.placement;
              }
              if (reset.rects) {
                rects = reset.rects === true ? await platform2.getElementRects({
                  reference,
                  floating,
                  strategy
                }) : reset.rects;
              }
              ({
                x: x2,
                y: y2
              } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
            }
            i4 = -1;
          }
        }
        return {
          x: x2,
          y: y2,
          placement: statefulPlacement,
          strategy,
          middlewareData
        };
      };
      flip = function(options) {
        if (options === void 0) {
          options = {};
        }
        return {
          name: "flip",
          options,
          async fn(state) {
            var _middlewareData$arrow, _middlewareData$flip;
            const {
              placement,
              middlewareData,
              rects,
              initialPlacement,
              platform: platform2,
              elements
            } = state;
            const {
              mainAxis: checkMainAxis = true,
              crossAxis: checkCrossAxis = true,
              fallbackPlacements: specifiedFallbackPlacements,
              fallbackStrategy = "bestFit",
              fallbackAxisSideDirection = "none",
              flipAlignment = true,
              ...detectOverflowOptions
            } = evaluate(options, state);
            if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
              return {};
            }
            const side = getSide(placement);
            const initialSideAxis = getSideAxis(initialPlacement);
            const isBasePlacement = getSide(initialPlacement) === initialPlacement;
            const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
            const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
            const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
            if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
              fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
            }
            const placements2 = [initialPlacement, ...fallbackPlacements];
            const overflow = await detectOverflow(state, detectOverflowOptions);
            const overflows = [];
            let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
            if (checkMainAxis) {
              overflows.push(overflow[side]);
            }
            if (checkCrossAxis) {
              const sides2 = getAlignmentSides(placement, rects, rtl);
              overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
            }
            overflowsData = [...overflowsData, {
              placement,
              overflows
            }];
            if (!overflows.every((side2) => side2 <= 0)) {
              var _middlewareData$flip2, _overflowsData$filter;
              const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
              const nextPlacement = placements2[nextIndex];
              if (nextPlacement) {
                return {
                  data: {
                    index: nextIndex,
                    overflows: overflowsData
                  },
                  reset: {
                    placement: nextPlacement
                  }
                };
              }
              let resetPlacement = (_overflowsData$filter = overflowsData.filter((d2) => d2.overflows[0] <= 0).sort((a3, b2) => a3.overflows[1] - b2.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
              if (!resetPlacement) {
                switch (fallbackStrategy) {
                  case "bestFit": {
                    var _overflowsData$filter2;
                    const placement2 = (_overflowsData$filter2 = overflowsData.filter((d2) => {
                      if (hasFallbackAxisSideDirection) {
                        const currentSideAxis = getSideAxis(d2.placement);
                        return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                        // reading directions favoring greater width.
                        currentSideAxis === "y";
                      }
                      return true;
                    }).map((d2) => [d2.placement, d2.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a3, b2) => a3[1] - b2[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                    if (placement2) {
                      resetPlacement = placement2;
                    }
                    break;
                  }
                  case "initialPlacement":
                    resetPlacement = initialPlacement;
                    break;
                }
              }
              if (placement !== resetPlacement) {
                return {
                  reset: {
                    placement: resetPlacement
                  }
                };
              }
            }
            return {};
          }
        };
      };
      shift = function(options) {
        if (options === void 0) {
          options = {};
        }
        return {
          name: "shift",
          options,
          async fn(state) {
            const {
              x: x2,
              y: y2,
              placement
            } = state;
            const {
              mainAxis: checkMainAxis = true,
              crossAxis: checkCrossAxis = false,
              limiter = {
                fn: (_ref) => {
                  let {
                    x: x3,
                    y: y3
                  } = _ref;
                  return {
                    x: x3,
                    y: y3
                  };
                }
              },
              ...detectOverflowOptions
            } = evaluate(options, state);
            const coords = {
              x: x2,
              y: y2
            };
            const overflow = await detectOverflow(state, detectOverflowOptions);
            const crossAxis = getSideAxis(getSide(placement));
            const mainAxis = getOppositeAxis(crossAxis);
            let mainAxisCoord = coords[mainAxis];
            let crossAxisCoord = coords[crossAxis];
            if (checkMainAxis) {
              const minSide = mainAxis === "y" ? "top" : "left";
              const maxSide = mainAxis === "y" ? "bottom" : "right";
              const min2 = mainAxisCoord + overflow[minSide];
              const max2 = mainAxisCoord - overflow[maxSide];
              mainAxisCoord = clamp(min2, mainAxisCoord, max2);
            }
            if (checkCrossAxis) {
              const minSide = crossAxis === "y" ? "top" : "left";
              const maxSide = crossAxis === "y" ? "bottom" : "right";
              const min2 = crossAxisCoord + overflow[minSide];
              const max2 = crossAxisCoord - overflow[maxSide];
              crossAxisCoord = clamp(min2, crossAxisCoord, max2);
            }
            const limitedCoords = limiter.fn({
              ...state,
              [mainAxis]: mainAxisCoord,
              [crossAxis]: crossAxisCoord
            });
            return {
              ...limitedCoords,
              data: {
                x: limitedCoords.x - x2,
                y: limitedCoords.y - y2,
                enabled: {
                  [mainAxis]: checkMainAxis,
                  [crossAxis]: checkCrossAxis
                }
              }
            };
          }
        };
      };
    }
  });

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
  }
  function isTableElement(element) {
    return ["table", "td", "th"].includes(getNodeName(element));
  }
  function isTopLayer(element) {
    return [":popover-open", ":modal"].some((selector) => {
      try {
        return element.matches(selector);
      } catch (e6) {
        return false;
      }
    });
  }
  function isContainingBlock(elementOrCss) {
    const webkit2 = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit2 && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit2 && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  function isLastTraversableNode(node) {
    return ["html", "body", "#document"].includes(getNodeName(node));
  }
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  var init_floating_ui_utils_dom = __esm({
    "node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs"() {
    }
  });

  // node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
  function getCssDimensions(element) {
    const css = getComputedStyle2(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $: $2
    } = getCssDimensions(domElement);
    let x2 = ($2 ? round(rect.width) : rect.width) / width;
    let y2 = ($2 ? round(rect.height) : rect.height) / height;
    if (!x2 || !Number.isFinite(x2)) {
      x2 = 1;
    }
    if (!y2 || !Number.isFinite(y2)) {
      y2 = 1;
    }
    return {
      x: x2,
      y: y2
    };
  }
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x2 = (clientRect.left + visualOffsets.x) / scale.x;
    let y2 = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x2 *= iframeScale.x;
        y2 *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x2 += left;
        y2 += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x: x2,
      y: y2
    });
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y2 = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x2 += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x2 = 0;
    let y2 = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y2 = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x2 = left * scale.x;
    const y2 = top * scale.y;
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        ...clippingAncestor,
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache2) {
    const cachedResult = cache2.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache2.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    let htmlX = 0;
    let htmlY = 0;
    if (documentElement && !isOffsetParentAnElement && !isFixed) {
      const htmlRect = documentElement.getBoundingClientRect();
      htmlY = htmlRect.top + scroll.scrollTop;
      htmlX = htmlRect.left + scroll.scrollLeft - // RTL <body> scrollbar.
      getWindowScrollBarX(documentElement, htmlRect);
    }
    const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlX;
    const y2 = rect.top + scroll.scrollTop - offsets.y - htmlY;
    return {
      x: x2,
      y: y2,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle2(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  function isRTL(element) {
    return getComputedStyle2(element).direction === "rtl";
  }
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root2 = getDocumentElement(element);
    function cleanup2() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup2();
      const {
        left,
        top,
        width,
        height
      } = element.getBoundingClientRect();
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root2.clientWidth - (left + width));
      const insetBottom = floor(root2.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root2.ownerDocument
        });
      } catch (e6) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup2;
  }
  function autoUpdate(reference, floating, update2, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update2, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update2);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update2) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update2();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
        update2();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update2();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update2);
        ancestorResize && ancestor.removeEventListener("resize", update2);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  var noOffsets, getElementRects, platform, shift2, flip2, computePosition2;
  var init_floating_ui_dom = __esm({
    "node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs"() {
      init_floating_ui_core();
      init_floating_ui_utils();
      init_floating_ui_utils_dom();
      noOffsets = /* @__PURE__ */ createCoords(0);
      getElementRects = async function(data) {
        const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
        const getDimensionsFn = this.getDimensions;
        const floatingDimensions = await getDimensionsFn(data.floating);
        return {
          reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
          floating: {
            x: 0,
            y: 0,
            width: floatingDimensions.width,
            height: floatingDimensions.height
          }
        };
      };
      platform = {
        convertOffsetParentRelativeRectToViewportRelativeRect,
        getDocumentElement,
        getClippingRect,
        getOffsetParent,
        getElementRects,
        getClientRects,
        getDimensions,
        getScale,
        isElement,
        isRTL
      };
      shift2 = shift;
      flip2 = flip;
      computePosition2 = (reference, floating, options) => {
        const cache2 = /* @__PURE__ */ new Map();
        const mergedOptions = {
          platform,
          ...options
        };
        const platformWithCache = {
          ...mergedOptions.platform,
          _c: cache2
        };
        return computePosition(reference, floating, {
          ...mergedOptions,
          platform: platformWithCache
        });
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-Ds_q5BGO.js
  function isEventInside(el, event2) {
    const target = event2.composedPath()[0];
    return isDOMNode(target) && el.contains(target);
  }
  function scheduleRafJob(job) {
    rafJobs.add(job);
    return () => rafJobs.delete(job);
  }
  function setAttributeIfEmpty(target, name, value) {
    if (!target.hasAttribute(name)) target.setAttribute(name, value);
  }
  function setARIALabel(target, $label) {
    if (target.hasAttribute("aria-label") || target.hasAttribute("data-no-label")) return;
    if (!isFunction($label)) {
      setAttribute(target, "aria-label", $label);
      return;
    }
    function updateAriaDescription() {
      setAttribute(target, "aria-label", $label());
    }
    effect(updateAriaDescription);
  }
  function isElementVisible(el) {
    const style = getComputedStyle(el);
    return style.display !== "none" && parseInt(style.opacity) > 0;
  }
  function checkVisibility(el) {
    return !!el && ("checkVisibility" in el ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : isElementVisible(el));
  }
  function observeVisibility(el, callback) {
    return scheduleRafJob(() => callback(checkVisibility(el)));
  }
  function isElementParent(owner, node, test) {
    while (node) {
      if (node === owner) {
        return true;
      } else if (test?.(node)) {
        break;
      } else {
        node = node.parentElement;
      }
    }
    return false;
  }
  function onPress(target, handler) {
    return new EventsController(target).add("pointerup", (event2) => {
      if (event2.button === 0 && !event2.defaultPrevented) handler(event2);
    }).add("keydown", (event2) => {
      if (isKeyboardClick(event2)) handler(event2);
    });
  }
  function isTouchPinchEvent(event2) {
    return isTouchEvent(event2) && (event2.touches.length > 1 || event2.changedTouches.length > 1);
  }
  function requestScopedAnimationFrame(callback) {
    let scope = getScope(), id3 = window.requestAnimationFrame(() => {
      scoped(callback, scope);
      id3 = -1;
    });
    return () => void window.cancelAnimationFrame(id3);
  }
  function cloneTemplate(template, length, onCreate) {
    let current, prev = template, parent = template.parentElement, content = template.content.firstElementChild, elements = [];
    if (!content && template.firstElementChild) {
      template.innerHTML = template.firstElementChild.outerHTML;
      template.firstElementChild.remove();
      content = template.content.firstElementChild;
    }
    for (let i4 = 0; i4 < length; i4++) {
      current = document.importNode(content, true);
      onCreate?.(current, i4);
      parent.insertBefore(current, prev.nextSibling);
      elements.push(current);
      prev = current;
    }
    onDispose(() => {
      for (let i4 = 0; i4 < elements.length; i4++) elements[i4].remove();
    });
    return elements;
  }
  function createTemplate(content) {
    const template = document.createElement("template");
    template.innerHTML = content;
    return template.content;
  }
  function cloneTemplateContent(content) {
    const fragment = content.cloneNode(true);
    return fragment.firstElementChild;
  }
  function autoPlacement2(el, trigger, placement, {
    offsetVarName,
    xOffset,
    yOffset,
    ...options
  }) {
    if (!el) return;
    const floatingPlacement = placement.replace(" ", "-").replace("-center", "");
    setStyle(el, "visibility", !trigger ? "hidden" : null);
    if (!trigger) return;
    let isTop = placement.includes("top");
    const negateX = (x2) => placement.includes("left") ? `calc(-1 * ${x2})` : x2, negateY = (y2) => isTop ? `calc(-1 * ${y2})` : y2;
    return autoUpdate(trigger, el, () => {
      computePosition2(trigger, el, {
        placement: floatingPlacement,
        middleware: [
          ...options.middleware ?? [],
          flip2({ fallbackAxisSideDirection: "start", crossAxis: false }),
          shift2()
        ],
        ...options
      }).then(({ x: x2, y: y2, middlewareData }) => {
        const hasFlipped = !!middlewareData.flip?.index;
        isTop = placement.includes(hasFlipped ? "bottom" : "top");
        el.setAttribute(
          "data-placement",
          hasFlipped ? placement.startsWith("top") ? placement.replace("top", "bottom") : placement.replace("bottom", "top") : placement
        );
        Object.assign(el.style, {
          top: `calc(${y2 + "px"} + ${negateY(
            yOffset ? yOffset + "px" : `var(--${offsetVarName}-y-offset, 0px)`
          )})`,
          left: `calc(${x2 + "px"} + ${negateX(
            xOffset ? xOffset + "px" : `var(--${offsetVarName}-x-offset, 0px)`
          )})`
        });
      });
    });
  }
  function hasAnimation(el) {
    const styles = getComputedStyle(el);
    return styles.animationName !== "none";
  }
  function createSlot(name) {
    const slot = document.createElement("slot");
    slot.name = name;
    return slot;
  }
  function useTransitionActive($el) {
    const $active = signal(false);
    effect(() => {
      const el = $el();
      if (!el) return;
      new EventsController(el).add("transitionstart", () => $active.set(true)).add("transitionend", () => $active.set(false));
    });
    return $active;
  }
  function useResizeObserver($el, onResize) {
    function onElementChange() {
      const el = $el();
      if (!el) return;
      onResize();
      const observer = new ResizeObserver(animationFrameThrottle(onResize));
      observer.observe(el);
      return () => observer.disconnect();
    }
    effect(onElementChange);
  }
  function useActive($el) {
    const $isMouseEnter = useMouseEnter($el), $isFocusedIn = useFocusIn($el);
    let prevMouseEnter = false;
    return computed(() => {
      const isMouseEnter = $isMouseEnter();
      if (prevMouseEnter && !isMouseEnter) return false;
      prevMouseEnter = isMouseEnter;
      return isMouseEnter || $isFocusedIn();
    });
  }
  function useMouseEnter($el) {
    const $isMouseEnter = signal(false);
    effect(() => {
      const el = $el();
      if (!el) {
        $isMouseEnter.set(false);
        return;
      }
      new EventsController(el).add("mouseenter", () => $isMouseEnter.set(true)).add("mouseleave", () => $isMouseEnter.set(false));
    });
    return $isMouseEnter;
  }
  function useFocusIn($el) {
    const $isFocusIn = signal(false);
    effect(() => {
      const el = $el();
      if (!el) {
        $isFocusIn.set(false);
        return;
      }
      new EventsController(el).add("focusin", () => $isFocusIn.set(true)).add("focusout", () => $isFocusIn.set(false));
    });
    return $isFocusIn;
  }
  function isHTMLElement2(el) {
    return el instanceof HTMLElement;
  }
  function useColorSchemePreference() {
    const colorScheme = signal("dark");
    const media = window.matchMedia("(prefers-color-scheme: light)");
    function onChange() {
      colorScheme.set(media.matches ? "light" : "dark");
    }
    onChange();
    listenEvent(media, "change", onChange);
    return colorScheme;
  }
  function watchColorScheme(el, colorScheme) {
    effect(() => {
      const scheme = colorScheme();
      if (scheme === "system") {
        const preference = useColorSchemePreference();
        effect(() => updateColorScheme(preference()));
        return;
      }
      updateColorScheme(scheme);
    });
    function updateColorScheme(scheme) {
      toggleClass(el, "light", scheme === "light");
      toggleClass(el, "dark", scheme === "dark");
    }
  }
  var rafJobs;
  var init_vidstack_Ds_q5BGO = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-Ds_q5BGO.js"() {
      init_floating_ui_dom();
      init_vidstack_CRlI3Mh7();
      rafJobs = /* @__PURE__ */ new Set();
      {
        let processJobs = function() {
          for (const job of rafJobs) {
            try {
              job();
            } catch (e6) {
            }
          }
          window.requestAnimationFrame(processJobs);
        };
        processJobs();
      }
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-Dihypf8P.js
  function round2(num, decimalPlaces = 2) {
    return Number(num.toFixed(decimalPlaces));
  }
  function getNumberOfDecimalPlaces(num) {
    return String(num).split(".")[1]?.length ?? 0;
  }
  function clampNumber(min2, value, max2) {
    return Math.max(min2, Math.min(max2, value));
  }
  var init_vidstack_Dihypf8P = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-Dihypf8P.js"() {
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-DXXgp8ue.js
  function updateFocusAttr(el, isFocused) {
    setAttribute(el, "data-focus", isFocused);
    setAttribute(el, "data-hocus", isFocused);
  }
  function updateHoverAttr(el, isHovering) {
    setAttribute(el, "data-hocus", isHovering);
    setAttribute(el, "data-hover", isHovering);
  }
  var $keyboard, FocusVisibleController;
  var init_vidstack_DXXgp8ue = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-DXXgp8ue.js"() {
      init_vidstack_CRlI3Mh7();
      $keyboard = signal(false);
      {
        listenEvent(document, "pointerdown", () => {
          $keyboard.set(false);
        });
        listenEvent(document, "keydown", (e6) => {
          if (e6.metaKey || e6.altKey || e6.ctrlKey) return;
          $keyboard.set(true);
        });
      }
      FocusVisibleController = class extends ViewController {
        #focused = signal(false);
        onConnect(el) {
          effect(() => {
            const events = new EventsController(el);
            if (!$keyboard()) {
              this.#focused.set(false);
              updateFocusAttr(el, false);
              events.add("pointerenter", this.#onPointerEnter.bind(this)).add("pointerleave", this.#onPointerLeave.bind(this));
              return;
            }
            const active = document.activeElement === el;
            this.#focused.set(active);
            updateFocusAttr(el, active);
            events.add("focus", this.#onFocus.bind(this)).add("blur", this.#onBlur.bind(this));
          });
        }
        focused() {
          return this.#focused();
        }
        #onFocus() {
          this.#focused.set(true);
          updateFocusAttr(this.el, true);
        }
        #onBlur() {
          this.#focused.set(false);
          updateFocusAttr(this.el, false);
        }
        #onPointerEnter() {
          updateHoverAttr(this.el, true);
        }
        #onPointerLeave() {
          updateHoverAttr(this.el, false);
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-DSYpsFWk.js
  var RAFLoop;
  var init_vidstack_DSYpsFWk = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-DSYpsFWk.js"() {
      init_vidstack_CRlI3Mh7();
      RAFLoop = class {
        #id;
        #callback;
        constructor(callback) {
          this.#callback = callback;
        }
        start() {
          if (!isUndefined(this.#id)) return;
          this.#loop();
        }
        stop() {
          if (isNumber(this.#id)) window.cancelAnimationFrame(this.#id);
          this.#id = void 0;
        }
        #loop() {
          this.#id = window.requestAnimationFrame(() => {
            if (isUndefined(this.#id)) return;
            this.#callback();
            this.#loop();
          });
        }
      };
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-html.js
  function getOrCreateAudioCtx() {
    return audioContext ??= new AudioContext();
  }
  function createGainNode() {
    const audioCtx = getOrCreateAudioCtx(), gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNodes.push(gainNode);
    return gainNode;
  }
  function createElementSource(el, gainNode) {
    const audioCtx = getOrCreateAudioCtx(), src = audioCtx.createMediaElementSource(el);
    if (gainNode) {
      src.connect(gainNode);
    }
    elAudioSources.push(src);
    return src;
  }
  function destroyGainNode(node) {
    const idx = gainNodes.indexOf(node);
    if (idx !== -1) {
      gainNodes.splice(idx, 1);
      node.disconnect();
      freeAudioCtxWhenAllResourcesFreed();
    }
  }
  function destroyElementSource(src) {
    const idx = elAudioSources.indexOf(src);
    if (idx !== -1) {
      elAudioSources.splice(idx, 1);
      src.disconnect();
      freeAudioCtxWhenAllResourcesFreed();
    }
  }
  function freeAudioCtxWhenAllResourcesFreed() {
    if (audioContext && gainNodes.length === 0 && elAudioSources.length === 0) {
      audioContext.close().then(() => {
        audioContext = null;
      });
    }
  }
  function determinePageState(event2) {
    if (event2?.type === "blur" || document.visibilityState === "hidden") return "hidden";
    if (document.hasFocus()) return "active";
    return "passive";
  }
  var audioContext, gainNodes, elAudioSources, AudioGain, PAGE_EVENTS, PageVisibility, HTMLMediaEvents, NativeAudioTracks, HTMLMediaProvider;
  var init_vidstack_html = __esm({
    "node_modules/vidstack/prod/providers/vidstack-html.js"() {
      init_vidstack_DwhHIY5e();
      init_vidstack_CRlI3Mh7();
      init_vidstack_DSYpsFWk();
      init_vidstack_Dihypf8P();
      init_vidstack_D5EzK014();
      audioContext = null;
      gainNodes = [];
      elAudioSources = [];
      AudioGain = class {
        #media;
        #onChange;
        #gainNode = null;
        #srcAudioNode = null;
        get currentGain() {
          return this.#gainNode?.gain?.value ?? null;
        }
        get supported() {
          return true;
        }
        constructor(media, onChange) {
          this.#media = media;
          this.#onChange = onChange;
        }
        setGain(gain) {
          const currGain = this.currentGain;
          if (gain === this.currentGain) {
            return;
          }
          if (gain === 1 && currGain !== 1) {
            this.removeGain();
            return;
          }
          if (!this.#gainNode) {
            this.#gainNode = createGainNode();
            if (this.#srcAudioNode) {
              this.#srcAudioNode.connect(this.#gainNode);
            }
          }
          if (!this.#srcAudioNode) {
            this.#srcAudioNode = createElementSource(this.#media, this.#gainNode);
          }
          this.#gainNode.gain.value = gain;
          this.#onChange(gain);
        }
        removeGain() {
          if (!this.#gainNode) return;
          if (this.#srcAudioNode) {
            this.#srcAudioNode.connect(getOrCreateAudioCtx().destination);
          }
          this.#destroyGainNode();
          this.#onChange(null);
        }
        destroy() {
          this.#destroySrcNode();
          this.#destroyGainNode();
        }
        #destroySrcNode() {
          if (!this.#srcAudioNode) return;
          try {
            destroyElementSource(this.#srcAudioNode);
          } catch (e6) {
          } finally {
            this.#srcAudioNode = null;
          }
        }
        #destroyGainNode() {
          if (!this.#gainNode) return;
          try {
            destroyGainNode(this.#gainNode);
          } catch (e6) {
          } finally {
            this.#gainNode = null;
          }
        }
      };
      PAGE_EVENTS = ["focus", "blur", "visibilitychange", "pageshow", "pagehide"];
      PageVisibility = class {
        #state = signal(determinePageState());
        #visibility = signal(document.visibilityState);
        #safariBeforeUnloadTimeout;
        connect() {
          const events = new EventsController(window), handlePageEvent = this.#handlePageEvent.bind(this);
          for (const eventType of PAGE_EVENTS) {
            events.add(eventType, handlePageEvent);
          }
          if (IS_SAFARI) {
            events.add("beforeunload", (event2) => {
              this.#safariBeforeUnloadTimeout = setTimeout(() => {
                if (!(event2.defaultPrevented || event2.returnValue.length > 0)) {
                  this.#state.set("hidden");
                  this.#visibility.set("hidden");
                }
              }, 0);
            });
          }
        }
        /**
         * The current page state. Important to note we only account for a subset of page states, as
         * the rest aren't valuable to the player at the moment.
         *
         * - **active:** A page is in the active state if it is visible and has input focus.
         * - **passive:** A page is in the passive state if it is visible and does not have input focus.
         * - **hidden:** A page is in the hidden state if it is not visible.
         *
         * @see https://developers.google.com/web/updates/2018/07/page-lifecycle-api#states
         */
        get pageState() {
          return this.#state();
        }
        /**
         * The current document visibility state.
         *
         * - **visible:** The page content may be at least partially visible. In practice, this means that
         * the page is the foreground tab of a non-minimized window.
         * - **hidden:** The page content is not visible to the user. In practice this means that the
         * document is either a background tab or part of a minimized window, or the OS screen lock is
         * active.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
         */
        get visibility() {
          return this.#visibility();
        }
        #handlePageEvent(event2) {
          if (IS_SAFARI) window.clearTimeout(this.#safariBeforeUnloadTimeout);
          if (event2.type !== "blur" || this.#state() === "active") {
            this.#state.set(determinePageState(event2));
            this.#visibility.set(document.visibilityState == "hidden" ? "hidden" : "visible");
          }
        }
      };
      HTMLMediaEvents = class {
        #provider;
        #ctx;
        #waiting = false;
        #attachedLoadStart = false;
        #attachedCanPlay = false;
        #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
        #pageVisibility = new PageVisibility();
        #events;
        get #media() {
          return this.#provider.media;
        }
        constructor(provider, ctx) {
          this.#provider = provider;
          this.#ctx = ctx;
          this.#events = new EventsController(provider.media);
          this.#attachInitialListeners();
          this.#pageVisibility.connect();
          effect(this.#attachTimeUpdate.bind(this));
          onDispose(this.#onDispose.bind(this));
        }
        #onDispose() {
          this.#attachedLoadStart = false;
          this.#attachedCanPlay = false;
          this.#timeRAF.stop();
          this.#events.abort();
          this.#devHandlers?.clear();
        }
        /**
         * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
         * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
         * resolve that by retrieving time updates in a request animation frame loop.
         */
        #lastSeenTime = 0;
        #seekedTo = -1;
        #onAnimationFrame() {
          const newTime = this.#media.currentTime;
          const didStutter = IS_SAFARI && newTime - this.#seekedTo < 0.35;
          if (!didStutter && this.#lastSeenTime !== newTime) {
            this.#updateCurrentTime(newTime);
            this.#lastSeenTime = newTime;
          }
        }
        #attachInitialListeners() {
          this.#attachEventListener("loadstart", this.#onLoadStart);
          this.#attachEventListener("abort", this.#onAbort);
          this.#attachEventListener("emptied", this.#onEmptied);
          this.#attachEventListener("error", this.#onError);
          this.#attachEventListener("volumechange", this.#onVolumeChange);
        }
        #attachLoadStartListeners() {
          if (this.#attachedLoadStart) return;
          this.#attachEventListener("loadeddata", this.#onLoadedData);
          this.#attachEventListener("loadedmetadata", this.#onLoadedMetadata);
          this.#attachEventListener("canplay", this.#onCanPlay);
          this.#attachEventListener("canplaythrough", this.#onCanPlayThrough);
          this.#attachEventListener("durationchange", this.#onDurationChange);
          this.#attachEventListener("play", this.#onPlay);
          this.#attachEventListener("progress", this.#onProgress);
          this.#attachEventListener("stalled", this.#onStalled);
          this.#attachEventListener("suspend", this.#onSuspend);
          this.#attachEventListener("ratechange", this.#onRateChange);
          this.#attachedLoadStart = true;
        }
        #attachCanPlayListeners() {
          if (this.#attachedCanPlay) return;
          this.#attachEventListener("pause", this.#onPause);
          this.#attachEventListener("playing", this.#onPlaying);
          this.#attachEventListener("seeked", this.#onSeeked);
          this.#attachEventListener("seeking", this.#onSeeking);
          this.#attachEventListener("ended", this.#onEnded);
          this.#attachEventListener("waiting", this.#onWaiting);
          this.#attachedCanPlay = true;
        }
        #devHandlers = void 0;
        #handleDevEvent = void 0;
        #attachEventListener(eventType, handler) {
          this.#events.add(eventType, handler.bind(this));
        }
        #onDevEvent(event2) {
          return;
        }
        #updateCurrentTime(time, trigger) {
          const newTime = Math.min(time, this.#ctx.$state.seekableEnd());
          this.#ctx.notify("time-change", newTime, trigger);
        }
        #onLoadStart(event2) {
          if (this.#media.networkState === 3) {
            this.#onAbort(event2);
            return;
          }
          this.#attachLoadStartListeners();
          this.#ctx.notify("load-start", void 0, event2);
        }
        #onAbort(event2) {
          this.#ctx.notify("abort", void 0, event2);
        }
        #onEmptied() {
          this.#ctx.notify("emptied", void 0, event);
        }
        #onLoadedData(event2) {
          this.#ctx.notify("loaded-data", void 0, event2);
        }
        #onLoadedMetadata(event2) {
          this.#lastSeenTime = 0;
          this.#seekedTo = -1;
          this.#attachCanPlayListeners();
          this.#ctx.notify("loaded-metadata", void 0, event2);
          if (IS_IOS || IS_SAFARI && isHLSSrc(this.#ctx.$state.source())) {
            this.#ctx.delegate.ready(this.#getCanPlayDetail(), event2);
          }
        }
        #getCanPlayDetail() {
          return {
            provider: peek(this.#ctx.$provider),
            duration: this.#media.duration,
            buffered: this.#media.buffered,
            seekable: this.#media.seekable
          };
        }
        #onPlay(event2) {
          if (!this.#ctx.$state.canPlay) return;
          this.#ctx.notify("play", void 0, event2);
        }
        #onPause(event2) {
          if (this.#media.readyState === 1 && !this.#waiting) return;
          this.#waiting = false;
          this.#timeRAF.stop();
          this.#ctx.notify("pause", void 0, event2);
        }
        #onCanPlay(event2) {
          this.#ctx.delegate.ready(this.#getCanPlayDetail(), event2);
        }
        #onCanPlayThrough(event2) {
          if (this.#ctx.$state.started()) return;
          this.#ctx.notify("can-play-through", this.#getCanPlayDetail(), event2);
        }
        #onPlaying(event2) {
          if (this.#media.paused) return;
          this.#waiting = false;
          this.#ctx.notify("playing", void 0, event2);
          this.#timeRAF.start();
        }
        #onStalled(event2) {
          this.#ctx.notify("stalled", void 0, event2);
          if (this.#media.readyState < 3) {
            this.#waiting = true;
            this.#ctx.notify("waiting", void 0, event2);
          }
        }
        #onWaiting(event2) {
          if (this.#media.readyState < 3) {
            this.#waiting = true;
            this.#ctx.notify("waiting", void 0, event2);
          }
        }
        #onEnded(event2) {
          this.#timeRAF.stop();
          this.#updateCurrentTime(this.#media.duration, event2);
          this.#ctx.notify("end", void 0, event2);
          if (this.#ctx.$state.loop()) {
            const hasCustomControls = isNil(this.#media.controls);
            if (hasCustomControls) this.#media.controls = false;
          }
        }
        #attachTimeUpdate() {
          const isPaused = this.#ctx.$state.paused(), isPageHidden = this.#pageVisibility.visibility === "hidden", shouldListenToTimeUpdates = isPaused || isPageHidden;
          if (shouldListenToTimeUpdates) {
            listenEvent(this.#media, "timeupdate", this.#onTimeUpdate.bind(this));
          }
        }
        #onTimeUpdate(event2) {
          this.#updateCurrentTime(this.#media.currentTime, event2);
        }
        #onDurationChange(event2) {
          if (this.#ctx.$state.ended()) {
            this.#updateCurrentTime(this.#media.duration, event2);
          }
          this.#ctx.notify("duration-change", this.#media.duration, event2);
        }
        #onVolumeChange(event2) {
          const detail = {
            volume: this.#media.volume,
            muted: this.#media.muted
          };
          this.#ctx.notify("volume-change", detail, event2);
        }
        #onSeeked(event2) {
          this.#seekedTo = this.#media.currentTime;
          this.#updateCurrentTime(this.#media.currentTime, event2);
          this.#ctx.notify("seeked", this.#media.currentTime, event2);
          if (Math.trunc(this.#media.currentTime) === Math.trunc(this.#media.duration) && getNumberOfDecimalPlaces(this.#media.duration) > getNumberOfDecimalPlaces(this.#media.currentTime)) {
            this.#updateCurrentTime(this.#media.duration, event2);
            if (!this.#media.ended) {
              this.#ctx.player.dispatch(
                new DOMEvent("media-play-request", {
                  trigger: event2
                })
              );
            }
          }
        }
        #onSeeking(event2) {
          this.#ctx.notify("seeking", this.#media.currentTime, event2);
        }
        #onProgress(event2) {
          const detail = {
            buffered: this.#media.buffered,
            seekable: this.#media.seekable
          };
          this.#ctx.notify("progress", detail, event2);
        }
        #onSuspend(event2) {
          this.#ctx.notify("suspend", void 0, event2);
        }
        #onRateChange(event2) {
          this.#ctx.notify("rate-change", this.#media.playbackRate, event2);
        }
        #onError(event2) {
          const error = this.#media.error;
          if (!error) return;
          const detail = {
            message: error.message,
            code: error.code,
            mediaError: error
          };
          this.#ctx.notify("error", detail, event2);
        }
      };
      NativeAudioTracks = class {
        #provider;
        #ctx;
        get #nativeTracks() {
          return this.#provider.media.audioTracks;
        }
        constructor(provider, ctx) {
          this.#provider = provider;
          this.#ctx = ctx;
          this.#nativeTracks.onaddtrack = this.#onAddNativeTrack.bind(this);
          this.#nativeTracks.onremovetrack = this.#onRemoveNativeTrack.bind(this);
          this.#nativeTracks.onchange = this.#onChangeNativeTrack.bind(this);
          listenEvent(this.#ctx.audioTracks, "change", this.#onChangeTrack.bind(this));
        }
        #onAddNativeTrack(event2) {
          const nativeTrack = event2.track;
          if (nativeTrack.label === "") return;
          const id3 = nativeTrack.id.toString() || `native-audio-${this.#ctx.audioTracks.length}`, audioTrack = {
            id: id3,
            label: nativeTrack.label,
            language: nativeTrack.language,
            kind: nativeTrack.kind,
            selected: false
          };
          this.#ctx.audioTracks[ListSymbol.add](audioTrack, event2);
          if (nativeTrack.enabled) audioTrack.selected = true;
        }
        #onRemoveNativeTrack(event2) {
          const track = this.#ctx.audioTracks.getById(event2.track.id);
          if (track) this.#ctx.audioTracks[ListSymbol.remove](track, event2);
        }
        #onChangeNativeTrack(event2) {
          let enabledTrack = this.#getEnabledNativeTrack();
          if (!enabledTrack) return;
          const track = this.#ctx.audioTracks.getById(enabledTrack.id);
          if (track) this.#ctx.audioTracks[ListSymbol.select](track, true, event2);
        }
        #getEnabledNativeTrack() {
          return Array.from(this.#nativeTracks).find((track) => track.enabled);
        }
        #onChangeTrack(event2) {
          const { current } = event2.detail;
          if (!current) return;
          const track = this.#nativeTracks.getTrackById(current.id);
          if (track) {
            const prev = this.#getEnabledNativeTrack();
            if (prev) prev.enabled = false;
            track.enabled = true;
          }
        }
      };
      HTMLMediaProvider = class {
        constructor(media, ctx) {
          this.media = media;
          this.ctx = ctx;
          this.audioGain = new AudioGain(media, (gain) => {
            this.ctx.notify("audio-gain-change", gain);
          });
        }
        scope = createScope();
        currentSrc = null;
        audioGain;
        setup() {
          new HTMLMediaEvents(this, this.ctx);
          if ("audioTracks" in this.media) new NativeAudioTracks(this, this.ctx);
          onDispose(() => {
            this.audioGain.destroy();
            this.media.srcObject = null;
            this.media.removeAttribute("src");
            for (const source of this.media.querySelectorAll("source")) source.remove();
            this.media.load();
          });
        }
        get type() {
          return "";
        }
        setPlaybackRate(rate) {
          this.media.playbackRate = rate;
        }
        async play() {
          return this.media.play();
        }
        async pause() {
          return this.media.pause();
        }
        setMuted(muted) {
          this.media.muted = muted;
        }
        setVolume(volume) {
          this.media.volume = volume;
        }
        setCurrentTime(time) {
          this.media.currentTime = time;
        }
        setPlaysInline(inline2) {
          setAttribute(this.media, "playsinline", inline2);
        }
        async loadSource({ src, type }, preload) {
          this.media.preload = preload || "";
          if (isMediaStream(src)) {
            this.removeSource();
            this.media.srcObject = src;
          } else {
            this.media.srcObject = null;
            if (isString(src)) {
              if (type !== "?") {
                this.appendSource({ src, type });
              } else {
                this.removeSource();
                this.media.src = this.#appendMediaFragment(src);
              }
            } else {
              this.removeSource();
              this.media.src = window.URL.createObjectURL(src);
            }
          }
          this.media.load();
          this.currentSrc = { src, type };
        }
        /**
         * Append source so it works when requesting AirPlay since hls.js will remove it.
         */
        appendSource(src, defaultType) {
          const prevSource = this.media.querySelector("source[data-vds]"), source = prevSource ?? document.createElement("source");
          setAttribute(source, "src", this.#appendMediaFragment(src.src));
          setAttribute(source, "type", src.type !== "?" ? src.type : defaultType);
          setAttribute(source, "data-vds", "");
          if (!prevSource) this.media.append(source);
        }
        removeSource() {
          this.media.querySelector("source[data-vds]")?.remove();
        }
        #appendMediaFragment(src) {
          const { clipStartTime, clipEndTime } = this.ctx.$state, startTime = clipStartTime(), endTime = clipEndTime();
          if (startTime > 0 && endTime > 0) {
            return `${src}#t=${startTime},${endTime}`;
          } else if (startTime > 0) {
            return `${src}#t=${startTime}`;
          } else if (endTime > 0) {
            return `${src}#t=0,${endTime}`;
          }
          return src;
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-CGXAe0PE.js
  var HTMLRemotePlaybackAdapter, HTMLAirPlayAdapter;
  var init_vidstack_CGXAe0PE = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-CGXAe0PE.js"() {
      init_vidstack_CRlI3Mh7();
      HTMLRemotePlaybackAdapter = class {
        #media;
        #ctx;
        #state;
        #supported = signal(false);
        get supported() {
          return this.#supported();
        }
        constructor(media, ctx) {
          this.#media = media;
          this.#ctx = ctx;
          this.#setup();
        }
        #setup() {
          if (!this.#media?.remote || !this.canPrompt) return;
          this.#media.remote.watchAvailability((available) => {
            this.#supported.set(available);
          }).catch(() => {
            this.#supported.set(false);
          });
          effect(this.#watchSupported.bind(this));
        }
        #watchSupported() {
          if (!this.#supported()) return;
          const events = ["connecting", "connect", "disconnect"], onStateChange = this.#onStateChange.bind(this);
          onStateChange();
          listenEvent(this.#media, "playing", onStateChange);
          const remoteEvents = new EventsController(this.#media.remote);
          for (const type of events) {
            remoteEvents.add(type, onStateChange);
          }
        }
        async prompt() {
          if (!this.supported) throw Error("Not supported on this platform.");
          if (this.type === "airplay" && this.#media.webkitShowPlaybackTargetPicker) {
            return this.#media.webkitShowPlaybackTargetPicker();
          }
          return this.#media.remote.prompt();
        }
        #onStateChange(event2) {
          const state = this.#media.remote.state;
          if (state === this.#state) return;
          const detail = { type: this.type, state };
          this.#ctx.notify("remote-playback-change", detail, event2);
          this.#state = state;
        }
      };
      HTMLAirPlayAdapter = class extends HTMLRemotePlaybackAdapter {
        type = "airplay";
        get canPrompt() {
          return "WebKitPlaybackTargetAvailabilityEvent" in window;
        }
      };
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-audio.js
  var vidstack_audio_exports = {};
  __export(vidstack_audio_exports, {
    AudioProvider: () => AudioProvider
  });
  var AudioProvider;
  var init_vidstack_audio = __esm({
    "node_modules/vidstack/prod/providers/vidstack-audio.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_html();
      init_vidstack_CGXAe0PE();
      AudioProvider = class extends HTMLMediaProvider {
        $$PROVIDER_TYPE = "AUDIO";
        get type() {
          return "audio";
        }
        airPlay;
        constructor(audio, ctx) {
          super(audio, ctx);
          scoped(() => {
            this.airPlay = new HTMLAirPlayAdapter(this.media, ctx);
          }, this.scope);
        }
        setup() {
          super.setup();
          if (this.type === "audio") this.ctx.notify("provider-setup", this);
        }
        /**
         * The native HTML `<audio>` element.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
         */
        get audio() {
          return this.media;
        }
      };
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-video.js
  var vidstack_video_exports = {};
  __export(vidstack_video_exports, {
    VideoProvider: () => VideoProvider
  });
  function findTextTrackElement(video, track) {
    return Array.from(video.children).find((el) => el.track === track);
  }
  var NativeHLSTextTracks, VideoPictureInPicture, VideoPresentation, FullscreenPresentationAdapter, PIPPresentationAdapter, VideoProvider;
  var init_vidstack_video = __esm({
    "node_modules/vidstack/prod/providers/vidstack-video.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_DwhHIY5e();
      init_vidstack_html();
      init_vidstack_CGXAe0PE();
      init_vidstack_oyBGi0R4();
      NativeHLSTextTracks = class {
        #video;
        #ctx;
        constructor(video, ctx) {
          this.#video = video;
          this.#ctx = ctx;
          video.textTracks.onaddtrack = this.#onAddTrack.bind(this);
          onDispose(this.#onDispose.bind(this));
        }
        #onAddTrack(event2) {
          const nativeTrack = event2.track;
          if (!nativeTrack || findTextTrackElement(this.#video, nativeTrack)) return;
          const track = new TextTrack({
            id: nativeTrack.id,
            kind: nativeTrack.kind,
            label: nativeTrack.label ?? "",
            language: nativeTrack.language,
            type: "vtt"
          });
          track[TextTrackSymbol.native] = { track: nativeTrack };
          track[TextTrackSymbol.readyState] = 2;
          track[TextTrackSymbol.nativeHLS] = true;
          let lastIndex = 0;
          const onCueChange = (event22) => {
            if (!nativeTrack.cues) return;
            for (let i4 = lastIndex; i4 < nativeTrack.cues.length; i4++) {
              track.addCue(nativeTrack.cues[i4], event22);
              lastIndex++;
            }
          };
          onCueChange(event2);
          nativeTrack.oncuechange = onCueChange;
          this.#ctx.textTracks.add(track, event2);
          track.setMode(nativeTrack.mode, event2);
        }
        #onDispose() {
          this.#video.textTracks.onaddtrack = null;
          for (const track of this.#ctx.textTracks) {
            const nativeTrack = track[TextTrackSymbol.native]?.track;
            if (nativeTrack?.oncuechange) nativeTrack.oncuechange = null;
          }
        }
      };
      VideoPictureInPicture = class {
        #video;
        #media;
        constructor(video, media) {
          this.#video = video;
          this.#media = media;
          new EventsController(video).add("enterpictureinpicture", this.#onEnter.bind(this)).add("leavepictureinpicture", this.#onExit.bind(this));
        }
        get active() {
          return document.pictureInPictureElement === this.#video;
        }
        get supported() {
          return canUsePictureInPicture(this.#video);
        }
        async enter() {
          return this.#video.requestPictureInPicture();
        }
        exit() {
          return document.exitPictureInPicture();
        }
        #onEnter(event2) {
          this.#onChange(true, event2);
        }
        #onExit(event2) {
          this.#onChange(false, event2);
        }
        #onChange = (active, event2) => {
          this.#media.notify("picture-in-picture-change", active, event2);
        };
      };
      VideoPresentation = class {
        #video;
        #media;
        #mode = "inline";
        get mode() {
          return this.#mode;
        }
        constructor(video, media) {
          this.#video = video;
          this.#media = media;
          listenEvent(video, "webkitpresentationmodechanged", this.#onModeChange.bind(this));
        }
        get supported() {
          return canUseVideoPresentation(this.#video);
        }
        async setPresentationMode(mode) {
          if (this.#mode === mode) return;
          this.#video.webkitSetPresentationMode(mode);
        }
        #onModeChange(event2) {
          const prevMode = this.#mode;
          this.#mode = this.#video.webkitPresentationMode;
          this.#media.player?.dispatch(
            new DOMEvent("video-presentation-change", {
              detail: this.#mode,
              trigger: event2
            })
          );
          ["fullscreen", "picture-in-picture"].forEach((type) => {
            if (this.#mode === type || prevMode === type) {
              this.#media.notify(`${type}-change`, this.#mode === type, event2);
            }
          });
        }
      };
      FullscreenPresentationAdapter = class {
        #presentation;
        get active() {
          return this.#presentation.mode === "fullscreen";
        }
        get supported() {
          return this.#presentation.supported;
        }
        constructor(presentation) {
          this.#presentation = presentation;
        }
        async enter() {
          this.#presentation.setPresentationMode("fullscreen");
        }
        async exit() {
          this.#presentation.setPresentationMode("inline");
        }
      };
      PIPPresentationAdapter = class {
        #presentation;
        get active() {
          return this.#presentation.mode === "picture-in-picture";
        }
        get supported() {
          return this.#presentation.supported;
        }
        constructor(presentation) {
          this.#presentation = presentation;
        }
        async enter() {
          this.#presentation.setPresentationMode("picture-in-picture");
        }
        async exit() {
          this.#presentation.setPresentationMode("inline");
        }
      };
      VideoProvider = class extends HTMLMediaProvider {
        $$PROVIDER_TYPE = "VIDEO";
        get type() {
          return "video";
        }
        airPlay;
        fullscreen;
        pictureInPicture;
        constructor(video, ctx) {
          super(video, ctx);
          scoped(() => {
            this.airPlay = new HTMLAirPlayAdapter(video, ctx);
            if (canUseVideoPresentation(video)) {
              const presentation = new VideoPresentation(video, ctx);
              this.fullscreen = new FullscreenPresentationAdapter(presentation);
              this.pictureInPicture = new PIPPresentationAdapter(presentation);
            } else if (canUsePictureInPicture(video)) {
              this.pictureInPicture = new VideoPictureInPicture(video, ctx);
            }
          }, this.scope);
        }
        setup() {
          super.setup();
          if (canPlayHLSNatively(this.video)) {
            new NativeHLSTextTracks(this.video, this.ctx);
          }
          this.ctx.textRenderers.attachVideo(this.video);
          onDispose(() => {
            this.ctx.textRenderers.attachVideo(null);
          });
          if (this.type === "video") this.ctx.notify("provider-setup", this);
        }
        /**
         * The native HTML `<video>` element.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
         */
        get video() {
          return this.media;
        }
      };
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-hls.js
  var vidstack_hls_exports = {};
  __export(vidstack_hls_exports, {
    HLSProvider: () => HLSProvider
  });
  async function importHLS(loader, callbacks = {}) {
    if (isUndefined(loader)) return void 0;
    callbacks.onLoadStart?.();
    if (loader.prototype && loader.prototype !== Function) {
      callbacks.onLoaded?.(loader);
      return loader;
    }
    try {
      const ctor = (await loader())?.default;
      if (ctor && !!ctor.isSupported) {
        callbacks.onLoaded?.(ctor);
      } else {
        throw Error(
          false ? "[vidstack] failed importing `hls.js`. Dynamic import returned invalid constructor." : ""
        );
      }
      return ctor;
    } catch (err) {
      callbacks.onLoadError?.(err);
    }
    return void 0;
  }
  async function loadHLSScript(src, callbacks = {}) {
    if (!isString(src)) return void 0;
    callbacks.onLoadStart?.();
    try {
      await loadScript(src);
      if (!isFunction(window.Hls)) {
        throw Error(
          false ? "[vidstack] failed loading `hls.js`. Could not find a valid `Hls` constructor on window" : ""
        );
      }
      const ctor = window.Hls;
      callbacks.onLoaded?.(ctor);
      return ctor;
    } catch (err) {
      callbacks.onLoadError?.(err);
    }
    return void 0;
  }
  var toDOMEventType, HLSController, HLSLibLoader, JS_DELIVR_CDN, HLSProvider;
  var init_vidstack_hls = __esm({
    "node_modules/vidstack/prod/providers/vidstack-hls.js"() {
      init_vidstack_A9j_j6J();
      init_vidstack_DwhHIY5e();
      init_vidstack_video();
      init_vidstack_CRlI3Mh7();
      init_vidstack_B01xzxC4();
      init_vidstack_oyBGi0R4();
      init_vidstack_D5EzK014();
      init_vidstack_DSYpsFWk();
      init_vidstack_C9vIqaYT();
      toDOMEventType = (type) => camelToKebabCase(type);
      HLSController = class {
        #video;
        #ctx;
        #instance = null;
        #stopLiveSync = null;
        config = {};
        #callbacks = /* @__PURE__ */ new Set();
        get instance() {
          return this.#instance;
        }
        constructor(video, ctx) {
          this.#video = video;
          this.#ctx = ctx;
        }
        setup(ctor) {
          const { streamType } = this.#ctx.$state;
          const isLive = peek(streamType).includes("live"), isLiveLowLatency = peek(streamType).includes("ll-");
          this.#instance = new ctor({
            lowLatencyMode: isLiveLowLatency,
            backBufferLength: isLiveLowLatency ? 4 : isLive ? 8 : void 0,
            renderTextTracksNatively: false,
            ...this.config
          });
          const dispatcher = this.#dispatchHLSEvent.bind(this);
          for (const event2 of Object.values(ctor.Events)) this.#instance.on(event2, dispatcher);
          this.#instance.on(ctor.Events.ERROR, this.#onError.bind(this));
          for (const callback of this.#callbacks) callback(this.#instance);
          this.#ctx.player.dispatch("hls-instance", {
            detail: this.#instance
          });
          this.#instance.attachMedia(this.#video);
          this.#instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, this.#onAudioSwitch.bind(this));
          this.#instance.on(ctor.Events.LEVEL_SWITCHED, this.#onLevelSwitched.bind(this));
          this.#instance.on(ctor.Events.LEVEL_LOADED, this.#onLevelLoaded.bind(this));
          this.#instance.on(ctor.Events.LEVEL_UPDATED, this.#onLevelUpdated.bind(this));
          this.#instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, this.#onTracksFound.bind(this));
          this.#instance.on(ctor.Events.CUES_PARSED, this.#onCuesParsed.bind(this));
          this.#ctx.qualities[QualitySymbol.enableAuto] = this.#enableAutoQuality.bind(this);
          listenEvent(this.#ctx.qualities, "change", this.#onUserQualityChange.bind(this));
          listenEvent(this.#ctx.audioTracks, "change", this.#onUserAudioChange.bind(this));
          this.#stopLiveSync = effect(this.#liveSync.bind(this));
        }
        #createDOMEvent(type, data) {
          return new DOMEvent(toDOMEventType(type), { detail: data });
        }
        #liveSync() {
          if (!this.#ctx.$state.live()) return;
          const raf = new RAFLoop(this.#liveSyncPosition.bind(this));
          raf.start();
          return raf.stop.bind(raf);
        }
        #liveSyncPosition() {
          this.#ctx.$state.liveSyncPosition.set(this.#instance?.liveSyncPosition ?? Infinity);
        }
        #dispatchHLSEvent(type, data) {
          this.#ctx.player?.dispatch(this.#createDOMEvent(type, data));
        }
        #onTracksFound(eventType, data) {
          const event2 = this.#createDOMEvent(eventType, data);
          let currentTrack = -1;
          for (let i4 = 0; i4 < data.tracks.length; i4++) {
            const nonNativeTrack = data.tracks[i4], init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions, track = new TextTrack({
              id: `hls-${nonNativeTrack.kind}-${i4}`,
              src: init?.url,
              label: nonNativeTrack.label,
              language: init?.lang,
              kind: nonNativeTrack.kind,
              default: nonNativeTrack.default
            });
            track[TextTrackSymbol.readyState] = 2;
            track[TextTrackSymbol.onModeChange] = () => {
              if (track.mode === "showing") {
                this.#instance.subtitleTrack = i4;
                currentTrack = i4;
              } else if (currentTrack === i4) {
                this.#instance.subtitleTrack = -1;
                currentTrack = -1;
              }
            };
            this.#ctx.textTracks.add(track, event2);
          }
        }
        #onCuesParsed(eventType, data) {
          const index = this.#instance?.subtitleTrack, track = this.#ctx.textTracks.getById(`hls-${data.type}-${index}`);
          if (!track) return;
          const event2 = this.#createDOMEvent(eventType, data);
          for (const cue of data.cues) {
            cue.positionAlign = "auto";
            track.addCue(cue, event2);
          }
        }
        #onAudioSwitch(eventType, data) {
          const track = this.#ctx.audioTracks[data.id];
          if (track) {
            const trigger = this.#createDOMEvent(eventType, data);
            this.#ctx.audioTracks[ListSymbol.select](track, true, trigger);
          }
        }
        #onLevelSwitched(eventType, data) {
          const quality = this.#ctx.qualities[data.level];
          if (quality) {
            const trigger = this.#createDOMEvent(eventType, data);
            this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
          }
        }
        #onLevelUpdated(eventType, data) {
          if (data.details.totalduration > 0) {
            this.#ctx.$state.inferredLiveDVRWindow.set(data.details.totalduration);
          }
        }
        #onLevelLoaded(eventType, data) {
          if (this.#ctx.$state.canPlay()) return;
          const { type, live, totalduration: duration, targetduration } = data.details, trigger = this.#createDOMEvent(eventType, data);
          this.#ctx.notify(
            "stream-type-change",
            live ? type === "EVENT" && Number.isFinite(duration) && targetduration >= 10 ? "live:dvr" : "live" : "on-demand",
            trigger
          );
          this.#ctx.notify("duration-change", duration, trigger);
          const media = this.#instance.media;
          if (this.#instance.currentLevel === -1) {
            this.#ctx.qualities[QualitySymbol.setAuto](true, trigger);
          }
          for (const remoteTrack of this.#instance.audioTracks) {
            const localTrack = {
              id: remoteTrack.id.toString(),
              label: remoteTrack.name,
              language: remoteTrack.lang || "",
              kind: "main"
            };
            this.#ctx.audioTracks[ListSymbol.add](localTrack, trigger);
          }
          for (const level of this.#instance.levels) {
            const videoQuality = {
              id: level.id?.toString() ?? level.height + "p",
              width: level.width,
              height: level.height,
              codec: level.codecSet,
              bitrate: level.bitrate
            };
            this.#ctx.qualities[ListSymbol.add](videoQuality, trigger);
          }
          media.dispatchEvent(new DOMEvent("canplay", { trigger }));
        }
        #onError(eventType, data) {
          if (data.fatal) {
            switch (data.type) {
              case "mediaError":
                this.#instance?.recoverMediaError();
                break;
              default:
                this.#onFatalError(data.error);
                break;
            }
          }
        }
        #onFatalError(error) {
          this.#ctx.notify("error", {
            message: error.message,
            code: 1,
            error
          });
        }
        #enableAutoQuality() {
          if (this.#instance) this.#instance.currentLevel = -1;
        }
        #onUserQualityChange() {
          const { qualities } = this.#ctx;
          if (!this.#instance || qualities.auto) return;
          this.#instance[qualities.switch + "Level"] = qualities.selectedIndex;
          if (IS_CHROME) {
            this.#video.currentTime = this.#video.currentTime;
          }
        }
        #onUserAudioChange() {
          const { audioTracks } = this.#ctx;
          if (this.#instance && this.#instance.audioTrack !== audioTracks.selectedIndex) {
            this.#instance.audioTrack = audioTracks.selectedIndex;
          }
        }
        onInstance(callback) {
          this.#callbacks.add(callback);
          return () => this.#callbacks.delete(callback);
        }
        loadSource(src) {
          if (!isString(src.src)) return;
          this.#instance?.loadSource(src.src);
        }
        destroy() {
          this.#instance?.destroy();
          this.#instance = null;
          this.#stopLiveSync?.();
          this.#stopLiveSync = null;
        }
      };
      HLSLibLoader = class {
        #lib;
        #ctx;
        #callback;
        constructor(lib, ctx, callback) {
          this.#lib = lib;
          this.#ctx = ctx;
          this.#callback = callback;
          this.#startLoading();
        }
        async #startLoading() {
          const callbacks = {
            onLoadStart: this.#onLoadStart.bind(this),
            onLoaded: this.#onLoaded.bind(this),
            onLoadError: this.#onLoadError.bind(this)
          };
          let ctor = await loadHLSScript(this.#lib, callbacks);
          if (isUndefined(ctor) && !isString(this.#lib)) ctor = await importHLS(this.#lib, callbacks);
          if (!ctor) return null;
          if (!ctor.isSupported()) {
            const message = "[vidstack] `hls.js` is not supported in this environment";
            this.#ctx.player.dispatch(new DOMEvent("hls-unsupported"));
            this.#ctx.notify("error", { message, code: 4 });
            return null;
          }
          return ctor;
        }
        #onLoadStart() {
          this.#ctx.player.dispatch(new DOMEvent("hls-lib-load-start"));
        }
        #onLoaded(ctor) {
          this.#ctx.player.dispatch(
            new DOMEvent("hls-lib-loaded", {
              detail: ctor
            })
          );
          this.#callback(ctor);
        }
        #onLoadError(e6) {
          const error = coerceToError(e6);
          this.#ctx.player.dispatch(
            new DOMEvent("hls-lib-load-error", {
              detail: error
            })
          );
          this.#ctx.notify("error", {
            message: error.message,
            code: 4,
            error
          });
        }
      };
      JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
      HLSProvider = class extends VideoProvider {
        $$PROVIDER_TYPE = "HLS";
        #ctor = null;
        #controller = new HLSController(this.video, this.ctx);
        /**
         * The `hls.js` constructor.
         */
        get ctor() {
          return this.#ctor;
        }
        /**
         * The current `hls.js` instance.
         */
        get instance() {
          return this.#controller.instance;
        }
        /**
         * Whether `hls.js` is supported in this environment.
         */
        static supported = isHLSSupported();
        get type() {
          return "hls";
        }
        get canLiveSync() {
          return true;
        }
        #library = `${JS_DELIVR_CDN}/npm/hls.js@^1.5.0/dist/hls${".min.js"}`;
        /**
         * The `hls.js` configuration object.
         *
         * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
         */
        get config() {
          return this.#controller.config;
        }
        set config(config) {
          this.#controller.config = config;
        }
        /**
         * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
         *
         * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
         */
        get library() {
          return this.#library;
        }
        set library(library) {
          this.#library = library;
        }
        preconnect() {
          if (!isString(this.#library)) return;
          preconnect(this.#library);
        }
        setup() {
          super.setup();
          new HLSLibLoader(this.#library, this.ctx, (ctor) => {
            this.#ctor = ctor;
            this.#controller.setup(ctor);
            this.ctx.notify("provider-setup", this);
            const src = peek(this.ctx.$state.source);
            if (src) this.loadSource(src);
          });
        }
        async loadSource(src, preload) {
          if (!isString(src.src)) {
            this.removeSource();
            return;
          }
          this.media.preload = preload || "";
          this.appendSource(src, "application/x-mpegurl");
          this.#controller.loadSource(src);
          this.currentSrc = src;
        }
        /**
         * The given callback is invoked when a new `hls.js` instance is created and right before it's
         * attached to media.
         */
        onInstance(callback) {
          const instance = this.#controller.instance;
          if (instance) callback(instance);
          return this.#controller.onInstance(callback);
        }
        destroy() {
          this.#controller.destroy();
        }
      };
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-dash.js
  var vidstack_dash_exports = {};
  __export(vidstack_dash_exports, {
    DASHProvider: () => DASHProvider
  });
  function getLangName(langCode) {
    try {
      const displayNames = new Intl.DisplayNames(navigator.languages, { type: "language" });
      const languageName = displayNames.of(langCode);
      return languageName ?? null;
    } catch (err) {
      return null;
    }
  }
  async function importDASH(loader, callbacks = {}) {
    if (isUndefined(loader)) return void 0;
    callbacks.onLoadStart?.();
    if (isDASHConstructor(loader)) {
      callbacks.onLoaded?.(loader);
      return loader;
    }
    if (isDASHNamespace(loader)) {
      const ctor = loader.MediaPlayer;
      callbacks.onLoaded?.(ctor);
      return ctor;
    }
    try {
      const ctor = (await loader())?.default;
      if (isDASHNamespace(ctor)) {
        callbacks.onLoaded?.(ctor.MediaPlayer);
        return ctor.MediaPlayer;
      }
      if (ctor) {
        callbacks.onLoaded?.(ctor);
      } else {
        throw Error(
          false ? "[vidstack] failed importing `dash.js`. Dynamic import returned invalid object." : ""
        );
      }
      return ctor;
    } catch (err) {
      callbacks.onLoadError?.(err);
    }
    return void 0;
  }
  async function loadDASHScript(src, callbacks = {}) {
    if (!isString(src)) return void 0;
    callbacks.onLoadStart?.();
    try {
      await loadScript(src);
      if (!isFunction(window.dashjs.MediaPlayer)) {
        throw Error(
          false ? "[vidstack] failed loading `dash.js`. Could not find a valid `Dash` constructor on window" : ""
        );
      }
      const ctor = window.dashjs.MediaPlayer;
      callbacks.onLoaded?.(ctor);
      return ctor;
    } catch (err) {
      callbacks.onLoadError?.(err);
    }
    return void 0;
  }
  function isDASHConstructor(value) {
    return value && value.prototype && value.prototype !== Function;
  }
  function isDASHNamespace(value) {
    return value && "MediaPlayer" in value;
  }
  var toDOMEventType2, DASHController, DASHLibLoader, JS_DELIVR_CDN2, DASHProvider;
  var init_vidstack_dash = __esm({
    "node_modules/vidstack/prod/providers/vidstack-dash.js"() {
      init_vidstack_A9j_j6J();
      init_vidstack_DwhHIY5e();
      init_vidstack_video();
      init_vidstack_CRlI3Mh7();
      init_vidstack_B01xzxC4();
      init_vidstack_oyBGi0R4();
      init_vidstack_D5EzK014();
      init_vidstack_DSYpsFWk();
      init_vidstack_C9vIqaYT();
      toDOMEventType2 = (type) => `dash-${camelToKebabCase(type)}`;
      DASHController = class {
        #video;
        #ctx;
        #instance = null;
        #callbacks = /* @__PURE__ */ new Set();
        #stopLiveSync = null;
        config = {};
        get instance() {
          return this.#instance;
        }
        constructor(video, ctx) {
          this.#video = video;
          this.#ctx = ctx;
        }
        setup(ctor) {
          this.#instance = ctor().create();
          const dispatcher = this.#dispatchDASHEvent.bind(this);
          for (const event2 of Object.values(ctor.events)) this.#instance.on(event2, dispatcher);
          this.#instance.on(ctor.events.ERROR, this.#onError.bind(this));
          for (const callback of this.#callbacks) callback(this.#instance);
          this.#ctx.player.dispatch("dash-instance", {
            detail: this.#instance
          });
          this.#instance.initialize(this.#video, void 0, false);
          this.#instance.updateSettings({
            streaming: {
              text: {
                // Disabling text rendering by dash.
                defaultEnabled: false,
                dispatchForManualRendering: true
              },
              buffer: {
                /// Enables buffer replacement when switching bitrates for faster switching.
                fastSwitchEnabled: true
              }
            },
            ...this.config
          });
          this.#instance.on(ctor.events.FRAGMENT_LOADING_STARTED, this.#onFragmentLoadStart.bind(this));
          this.#instance.on(
            ctor.events.FRAGMENT_LOADING_COMPLETED,
            this.#onFragmentLoadComplete.bind(this)
          );
          this.#instance.on(ctor.events.MANIFEST_LOADED, this.#onManifestLoaded.bind(this));
          this.#instance.on(ctor.events.QUALITY_CHANGE_RENDERED, this.#onQualityChange.bind(this));
          this.#instance.on(ctor.events.TEXT_TRACKS_ADDED, this.#onTextTracksAdded.bind(this));
          this.#instance.on(ctor.events.TRACK_CHANGE_RENDERED, this.#onTrackChange.bind(this));
          this.#ctx.qualities[QualitySymbol.enableAuto] = this.#enableAutoQuality.bind(this);
          listenEvent(this.#ctx.qualities, "change", this.#onUserQualityChange.bind(this));
          listenEvent(this.#ctx.audioTracks, "change", this.#onUserAudioChange.bind(this));
          this.#stopLiveSync = effect(this.#liveSync.bind(this));
        }
        #createDOMEvent(event2) {
          return new DOMEvent(toDOMEventType2(event2.type), { detail: event2 });
        }
        #liveSync() {
          if (!this.#ctx.$state.live()) return;
          const raf = new RAFLoop(this.#liveSyncPosition.bind(this));
          raf.start();
          return raf.stop.bind(raf);
        }
        #liveSyncPosition() {
          if (!this.#instance) return;
          const position = this.#instance.duration() - this.#instance.time();
          this.#ctx.$state.liveSyncPosition.set(!isNaN(position) ? position : Infinity);
        }
        #dispatchDASHEvent(event2) {
          this.#ctx.player?.dispatch(this.#createDOMEvent(event2));
        }
        #currentTrack = null;
        #cueTracker = {};
        #onTextFragmentLoaded(event2) {
          const native = this.#currentTrack?.[TextTrackSymbol.native], cues = (native?.track).cues;
          if (!native || !cues) return;
          const id3 = this.#currentTrack.id, startIndex = this.#cueTracker[id3] ?? 0, trigger = this.#createDOMEvent(event2);
          for (let i4 = startIndex; i4 < cues.length; i4++) {
            const cue = cues[i4];
            if (!cue.positionAlign) cue.positionAlign = "auto";
            this.#currentTrack.addCue(cue, trigger);
          }
          this.#cueTracker[id3] = cues.length;
        }
        #onTextTracksAdded(event2) {
          if (!this.#instance) return;
          const data = event2.tracks, nativeTextTracks = [...this.#video.textTracks].filter((track) => "manualMode" in track), trigger = this.#createDOMEvent(event2);
          for (let i4 = 0; i4 < nativeTextTracks.length; i4++) {
            const textTrackInfo = data[i4], nativeTextTrack = nativeTextTracks[i4];
            const id3 = `dash-${textTrackInfo.kind}-${i4}`, track = new TextTrack({
              id: id3,
              label: textTrackInfo?.label ?? textTrackInfo.labels.find((t5) => t5.text)?.text ?? (textTrackInfo?.lang && getLangName(textTrackInfo.lang)) ?? textTrackInfo?.lang ?? void 0,
              language: textTrackInfo.lang ?? void 0,
              kind: textTrackInfo.kind,
              default: textTrackInfo.defaultTrack
            });
            track[TextTrackSymbol.native] = {
              managed: true,
              track: nativeTextTrack
            };
            track[TextTrackSymbol.readyState] = 2;
            track[TextTrackSymbol.onModeChange] = () => {
              if (!this.#instance) return;
              if (track.mode === "showing") {
                this.#instance.setTextTrack(i4);
                this.#currentTrack = track;
              } else {
                this.#instance.setTextTrack(-1);
                this.#currentTrack = null;
              }
            };
            this.#ctx.textTracks.add(track, trigger);
          }
        }
        #onTrackChange(event2) {
          const { mediaType, newMediaInfo } = event2;
          if (mediaType === "audio") {
            const track = this.#ctx.audioTracks.getById(`dash-audio-${newMediaInfo.index}`);
            if (track) {
              const trigger = this.#createDOMEvent(event2);
              this.#ctx.audioTracks[ListSymbol.select](track, true, trigger);
            }
          }
        }
        #onQualityChange(event2) {
          if (event2.mediaType !== "video") return;
          const quality = this.#ctx.qualities[event2.newQuality];
          if (quality) {
            const trigger = this.#createDOMEvent(event2);
            this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
          }
        }
        #onManifestLoaded(event2) {
          if (this.#ctx.$state.canPlay() || !this.#instance) return;
          const { type, mediaPresentationDuration } = event2.data, trigger = this.#createDOMEvent(event2);
          this.#ctx.notify("stream-type-change", type !== "static" ? "live" : "on-demand", trigger);
          this.#ctx.notify("duration-change", mediaPresentationDuration, trigger);
          this.#ctx.qualities[QualitySymbol.setAuto](true, trigger);
          const media = this.#instance.getVideoElement();
          const videoQualities = this.#instance.getTracksForTypeFromManifest(
            "video",
            event2.data
          );
          const supportedVideoMimeType = [...new Set(videoQualities.map((e6) => e6.mimeType))].find(
            (type2) => type2 && canPlayVideoType(media, type2)
          );
          const videoQuality = videoQualities.filter(
            (track) => supportedVideoMimeType === track.mimeType
          )[0];
          let audioTracks = this.#instance.getTracksForTypeFromManifest(
            "audio",
            event2.data
          );
          const supportedAudioMimeType = [...new Set(audioTracks.map((e6) => e6.mimeType))].find(
            (type2) => type2 && canPlayAudioType(media, type2)
          );
          audioTracks = audioTracks.filter((track) => supportedAudioMimeType === track.mimeType);
          videoQuality.bitrateList.forEach((bitrate, index) => {
            const quality = {
              id: bitrate.id?.toString() ?? `dash-bitrate-${index}`,
              width: bitrate.width ?? 0,
              height: bitrate.height ?? 0,
              bitrate: bitrate.bandwidth ?? 0,
              codec: videoQuality.codec,
              index
            };
            this.#ctx.qualities[ListSymbol.add](quality, trigger);
          });
          if (isNumber(videoQuality.index)) {
            const quality = this.#ctx.qualities[videoQuality.index];
            if (quality) this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
          }
          audioTracks.forEach((audioTrack, index) => {
            const matchingLabel = audioTrack.labels.find((label2) => {
              return navigator.languages.some((language) => {
                return label2.lang && language.toLowerCase().startsWith(label2.lang.toLowerCase());
              });
            });
            const label = matchingLabel || audioTrack.labels[0];
            const localTrack = {
              id: `dash-audio-${audioTrack?.index}`,
              label: label?.text ?? (audioTrack.lang && getLangName(audioTrack.lang)) ?? audioTrack.lang ?? "",
              language: audioTrack.lang ?? "",
              kind: "main",
              mimeType: audioTrack.mimeType,
              codec: audioTrack.codec,
              index
            };
            this.#ctx.audioTracks[ListSymbol.add](localTrack, trigger);
          });
          media.dispatchEvent(new DOMEvent("canplay", { trigger }));
        }
        #onError(event2) {
          const { type: eventType, error: data } = event2;
          switch (data.code) {
            case 27:
              this.#onNetworkError(data);
              break;
            default:
              this.#onFatalError(data);
              break;
          }
        }
        #onFragmentLoadStart() {
          if (this.#retryLoadingTimer >= 0) this.#clearRetryTimer();
        }
        #onFragmentLoadComplete(event2) {
          const mediaType = event2.mediaType;
          if (mediaType === "text") {
            requestAnimationFrame(this.#onTextFragmentLoaded.bind(this, event2));
          }
        }
        #retryLoadingTimer = -1;
        #onNetworkError(error) {
          this.#clearRetryTimer();
          this.#instance?.play();
          this.#retryLoadingTimer = window.setTimeout(() => {
            this.#retryLoadingTimer = -1;
            this.#onFatalError(error);
          }, 5e3);
        }
        #clearRetryTimer() {
          clearTimeout(this.#retryLoadingTimer);
          this.#retryLoadingTimer = -1;
        }
        #onFatalError(error) {
          this.#ctx.notify("error", {
            message: error.message ?? "",
            code: 1,
            error
          });
        }
        #enableAutoQuality() {
          this.#switchAutoBitrate("video", true);
          const { qualities } = this.#ctx;
          this.#instance?.setQualityFor("video", qualities.selectedIndex, true);
        }
        #switchAutoBitrate(type, auto) {
          this.#instance?.updateSettings({
            streaming: { abr: { autoSwitchBitrate: { [type]: auto } } }
          });
        }
        #onUserQualityChange() {
          const { qualities } = this.#ctx;
          if (!this.#instance || qualities.auto || !qualities.selected) return;
          this.#switchAutoBitrate("video", false);
          this.#instance.setQualityFor("video", qualities.selectedIndex, qualities.switch === "current");
          if (IS_CHROME) {
            this.#video.currentTime = this.#video.currentTime;
          }
        }
        #onUserAudioChange() {
          if (!this.#instance) return;
          const { audioTracks } = this.#ctx, selectedTrack = this.#instance.getTracksFor("audio").find(
            (track) => audioTracks.selected && audioTracks.selected.id === `dash-audio-${track.index}`
          );
          if (selectedTrack) this.#instance.setCurrentTrack(selectedTrack);
        }
        #reset() {
          this.#clearRetryTimer();
          this.#currentTrack = null;
          this.#cueTracker = {};
        }
        onInstance(callback) {
          this.#callbacks.add(callback);
          return () => this.#callbacks.delete(callback);
        }
        loadSource(src) {
          this.#reset();
          if (!isString(src.src)) return;
          this.#instance?.attachSource(src.src);
        }
        destroy() {
          this.#reset();
          this.#instance?.destroy();
          this.#instance = null;
          this.#stopLiveSync?.();
          this.#stopLiveSync = null;
        }
      };
      DASHLibLoader = class {
        #lib;
        #ctx;
        #callback;
        constructor(lib, ctx, callback) {
          this.#lib = lib;
          this.#ctx = ctx;
          this.#callback = callback;
          this.#startLoading();
        }
        async #startLoading() {
          const callbacks = {
            onLoadStart: this.#onLoadStart.bind(this),
            onLoaded: this.#onLoaded.bind(this),
            onLoadError: this.#onLoadError.bind(this)
          };
          let ctor = await loadDASHScript(this.#lib, callbacks);
          if (isUndefined(ctor) && !isString(this.#lib)) ctor = await importDASH(this.#lib, callbacks);
          if (!ctor) return null;
          if (!window.dashjs.supportsMediaSource()) {
            const message = "[vidstack] `dash.js` is not supported in this environment";
            this.#ctx.player.dispatch(new DOMEvent("dash-unsupported"));
            this.#ctx.notify("error", { message, code: 4 });
            return null;
          }
          return ctor;
        }
        #onLoadStart() {
          this.#ctx.player.dispatch(new DOMEvent("dash-lib-load-start"));
        }
        #onLoaded(ctor) {
          this.#ctx.player.dispatch(
            new DOMEvent("dash-lib-loaded", {
              detail: ctor
            })
          );
          this.#callback(ctor);
        }
        #onLoadError(e6) {
          const error = coerceToError(e6);
          this.#ctx.player.dispatch(
            new DOMEvent("dash-lib-load-error", {
              detail: error
            })
          );
          this.#ctx.notify("error", {
            message: error.message,
            code: 4,
            error
          });
        }
      };
      JS_DELIVR_CDN2 = "https://cdn.jsdelivr.net";
      DASHProvider = class extends VideoProvider {
        $$PROVIDER_TYPE = "DASH";
        #ctor = null;
        #controller = new DASHController(this.video, this.ctx);
        /**
         * The `dash.js` constructor.
         */
        get ctor() {
          return this.#ctor;
        }
        /**
         * The current `dash.js` instance.
         */
        get instance() {
          return this.#controller.instance;
        }
        /**
         * Whether `dash.js` is supported in this environment.
         */
        static supported = isDASHSupported();
        get type() {
          return "dash";
        }
        get canLiveSync() {
          return true;
        }
        #library = `${JS_DELIVR_CDN2}/npm/dashjs@4.7.4/dist/dash${".all.min.js"}`;
        /**
         * The `dash.js` configuration object.
         *
         * @see {@link https://cdn.dashjs.org/latest/jsdoc/module-Settings.html}
         */
        get config() {
          return this.#controller.config;
        }
        set config(config) {
          this.#controller.config = config;
        }
        /**
         * The `dash.js` constructor (supports dynamic imports) or a URL of where it can be found.
         *
         * @defaultValue `https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js`
         */
        get library() {
          return this.#library;
        }
        set library(library) {
          this.#library = library;
        }
        preconnect() {
          if (!isString(this.#library)) return;
          preconnect(this.#library);
        }
        setup() {
          super.setup();
          new DASHLibLoader(this.#library, this.ctx, (ctor) => {
            this.#ctor = ctor;
            this.#controller.setup(ctor);
            this.ctx.notify("provider-setup", this);
            const src = peek(this.ctx.$state.source);
            if (src) this.loadSource(src);
          });
        }
        async loadSource(src, preload) {
          if (!isString(src.src)) {
            this.removeSource();
            return;
          }
          this.media.preload = preload || "";
          this.appendSource(src, "application/x-mpegurl");
          this.#controller.loadSource(src);
          this.currentSrc = src;
        }
        /**
         * The given callback is invoked when a new `dash.js` instance is created and right before it's
         * attached to media.
         */
        onInstance(callback) {
          const instance = this.#controller.instance;
          if (instance) callback(instance);
          return this.#controller.onInstance(callback);
        }
        destroy() {
          this.#controller.destroy();
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-BePVaxm4.js
  var EmbedProvider;
  var init_vidstack_BePVaxm4 = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-BePVaxm4.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_A9j_j6J();
      EmbedProvider = class {
        #iframe;
        src = signal("");
        /**
         * Defines which referrer is sent when fetching the resource.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy}
         */
        referrerPolicy = null;
        get iframe() {
          return this.#iframe;
        }
        constructor(iframe) {
          this.#iframe = iframe;
          iframe.setAttribute("frameBorder", "0");
          iframe.setAttribute("aria-hidden", "true");
          iframe.setAttribute(
            "allow",
            "autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"
          );
          if (this.referrerPolicy !== null) {
            iframe.setAttribute("referrerpolicy", this.referrerPolicy);
          }
        }
        setup() {
          listenEvent(window, "message", this.#onWindowMessage.bind(this));
          listenEvent(this.#iframe, "load", this.onLoad.bind(this));
          effect(this.#watchSrc.bind(this));
        }
        #watchSrc() {
          const src = this.src();
          if (!src.length) {
            this.#iframe.setAttribute("src", "");
            return;
          }
          const params = peek(() => this.buildParams());
          this.#iframe.setAttribute("src", appendParamsToURL(src, params));
        }
        postMessage(message, target) {
          this.#iframe.contentWindow?.postMessage(JSON.stringify(message), target ?? "*");
        }
        #onWindowMessage(event2) {
          const origin = this.getOrigin(), isOriginMatch = (event2.source === null || event2.source === this.#iframe?.contentWindow) && (!isString(origin) || origin === event2.origin);
          if (!isOriginMatch) return;
          try {
            const message = JSON.parse(event2.data);
            if (message) this.onMessage(message, event2);
            return;
          } catch (e6) {
          }
          if (event2.data) this.onMessage(event2.data, event2);
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-krOAtKMi.js
  var vidstack_krOAtKMi_exports = {};
  __export(vidstack_krOAtKMi_exports, {
    getVimeoVideoInfo: () => getVimeoVideoInfo,
    resolveVimeoVideoId: () => resolveVimeoVideoId
  });
  function resolveVimeoVideoId(src) {
    const matches = src.match(videoIdRE);
    return { videoId: matches?.[1], hash: matches?.[2] };
  }
  async function getVimeoVideoInfo(videoId, abort, videoHash) {
    if (infoCache.has(videoId)) return infoCache.get(videoId);
    if (pendingFetch.has(videoId)) return pendingFetch.get(videoId);
    let oembedSrc = `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${videoId}`;
    if (videoHash) {
      oembedSrc = oembedSrc.concat(`?h=${videoHash}`);
    }
    const promise = window.fetch(oembedSrc, {
      mode: "cors",
      signal: abort.signal
    }).then((response) => response.json()).then((data) => {
      const thumnailRegex = /vimeocdn.com\/video\/(.*)?_/, thumbnailId = data?.thumbnail_url?.match(thumnailRegex)?.[1], poster = thumbnailId ? `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.webp` : "", info = {
        title: data?.title ?? "",
        duration: data?.duration ?? 0,
        poster,
        pro: data.account_type !== "basic"
      };
      infoCache.set(videoId, info);
      return info;
    }).finally(() => pendingFetch.delete(videoId));
    pendingFetch.set(videoId, promise);
    return promise;
  }
  var videoIdRE, infoCache, pendingFetch;
  var init_vidstack_krOAtKMi = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-krOAtKMi.js"() {
      videoIdRE = /(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:(?:\?hash=|\?h=|\/)(.*))?/;
      infoCache = /* @__PURE__ */ new Map();
      pendingFetch = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-vimeo.js
  var vidstack_vimeo_exports = {};
  __export(vidstack_vimeo_exports, {
    VimeoProvider: () => VimeoProvider
  });
  var trackedVimeoEvents, VimeoProvider;
  var init_vidstack_vimeo = __esm({
    "node_modules/vidstack/prod/providers/vidstack-vimeo.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_B01xzxC4();
      init_vidstack_BmMUBVGQ();
      init_vidstack_oyBGi0R4();
      init_vidstack_D5EzK014();
      init_vidstack_DSYpsFWk();
      init_vidstack_A9j_j6J();
      init_vidstack_BePVaxm4();
      init_vidstack_krOAtKMi();
      trackedVimeoEvents = [
        "bufferend",
        "bufferstart",
        // 'cuechange',
        "durationchange",
        "ended",
        "enterpictureinpicture",
        "error",
        "fullscreenchange",
        "leavepictureinpicture",
        "loaded",
        // 'loadeddata',
        // 'loadedmetadata',
        // 'loadstart',
        "playProgress",
        "loadProgress",
        "pause",
        "play",
        "playbackratechange",
        // 'progress',
        "qualitychange",
        "seeked",
        "seeking",
        // 'texttrackchange',
        "timeupdate",
        "volumechange",
        "waiting"
        // 'adstarted',
        // 'adcompleted',
        // 'aderror',
        // 'adskipped',
        // 'adallcompleted',
        // 'adclicked',
        // 'chapterchange',
        // 'chromecastconnected',
        // 'remoteplaybackavailabilitychange',
        // 'remoteplaybackconnecting',
        // 'remoteplaybackconnect',
        // 'remoteplaybackdisconnect',
        // 'liveeventended',
        // 'liveeventstarted',
        // 'livestreamoffline',
        // 'livestreamonline',
      ];
      VimeoProvider = class extends EmbedProvider {
        $$PROVIDER_TYPE = "VIMEO";
        scope = createScope();
        fullscreen;
        #ctx;
        #videoId = signal("");
        #pro = signal(false);
        #hash = null;
        #currentSrc = null;
        #fullscreenActive = false;
        #seekableRange = new TimeRange(0, 0);
        #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
        #currentCue = null;
        #chaptersTrack = null;
        #promises = /* @__PURE__ */ new Map();
        #videoInfoPromise = null;
        constructor(iframe, ctx) {
          super(iframe);
          this.#ctx = ctx;
          const self = this;
          this.fullscreen = {
            get active() {
              return self.#fullscreenActive;
            },
            supported: true,
            enter: () => this.#remote("requestFullscreen"),
            exit: () => this.#remote("exitFullscreen")
          };
        }
        /**
         * Whether tracking session data should be enabled on the embed, including cookies and analytics.
         * This is turned off by default to be GDPR-compliant.
         *
         * @defaultValue `false`
         */
        cookies = false;
        title = true;
        byline = true;
        portrait = true;
        color = "00ADEF";
        get type() {
          return "vimeo";
        }
        get currentSrc() {
          return this.#currentSrc;
        }
        get videoId() {
          return this.#videoId();
        }
        get hash() {
          return this.#hash;
        }
        get isPro() {
          return this.#pro();
        }
        preconnect() {
          preconnect(this.getOrigin());
        }
        setup() {
          super.setup();
          effect(this.#watchVideoId.bind(this));
          effect(this.#watchVideoInfo.bind(this));
          effect(this.#watchPro.bind(this));
          this.#ctx.notify("provider-setup", this);
        }
        destroy() {
          this.#reset();
          this.fullscreen = void 0;
          const message = "provider destroyed";
          for (const promises of this.#promises.values()) {
            for (const { reject } of promises) reject(message);
          }
          this.#promises.clear();
          this.#remote("destroy");
        }
        async play() {
          return this.#remote("play");
        }
        async pause() {
          return this.#remote("pause");
        }
        setMuted(muted) {
          this.#remote("setMuted", muted);
        }
        setCurrentTime(time) {
          this.#remote("seekTo", time);
          this.#ctx.notify("seeking", time);
        }
        setVolume(volume) {
          this.#remote("setVolume", volume);
          this.#remote("setMuted", peek(this.#ctx.$state.muted));
        }
        setPlaybackRate(rate) {
          this.#remote("setPlaybackRate", rate);
        }
        async loadSource(src) {
          if (!isString(src.src)) {
            this.#currentSrc = null;
            this.#hash = null;
            this.#videoId.set("");
            return;
          }
          const { videoId, hash } = resolveVimeoVideoId(src.src);
          this.#videoId.set(videoId ?? "");
          this.#hash = hash ?? null;
          this.#currentSrc = src;
        }
        #watchVideoId() {
          this.#reset();
          const videoId = this.#videoId();
          if (!videoId) {
            this.src.set("");
            return;
          }
          this.src.set(`${this.getOrigin()}/video/${videoId}`);
          this.#ctx.notify("load-start");
        }
        #watchVideoInfo() {
          const videoId = this.#videoId();
          if (!videoId) return;
          const promise = deferredPromise(), abort = new AbortController();
          this.#videoInfoPromise = promise;
          getVimeoVideoInfo(videoId, abort, this.#hash).then((info) => {
            promise.resolve(info);
          }).catch((e6) => {
            promise.reject();
          });
          return () => {
            promise.reject();
            abort.abort();
          };
        }
        #watchPro() {
          const isPro = this.#pro(), { $state, qualities } = this.#ctx;
          $state.canSetPlaybackRate.set(isPro);
          qualities[ListSymbol.setReadonly](!isPro);
          if (isPro) {
            return listenEvent(qualities, "change", () => {
              if (qualities.auto) return;
              const id3 = qualities.selected?.id;
              if (id3) this.#remote("setQuality", id3);
            });
          }
        }
        getOrigin() {
          return "https://player.vimeo.com";
        }
        buildParams() {
          const { keyDisabled } = this.#ctx.$props, { playsInline, nativeControls } = this.#ctx.$state, showControls = nativeControls();
          return {
            title: this.title,
            byline: this.byline,
            color: this.color,
            portrait: this.portrait,
            controls: showControls,
            h: this.hash,
            keyboard: showControls && !keyDisabled(),
            transparent: true,
            playsinline: playsInline(),
            dnt: !this.cookies
          };
        }
        #onAnimationFrame() {
          this.#remote("getCurrentTime");
        }
        // Embed will sometimes dispatch 0 at end of playback.
        #preventTimeUpdates = false;
        #onTimeUpdate(time, trigger) {
          if (this.#preventTimeUpdates && time === 0) return;
          const { realCurrentTime, paused, bufferedEnd, seekableEnd, live } = this.#ctx.$state;
          if (realCurrentTime() === time) return;
          const prevTime = realCurrentTime();
          this.#ctx.notify("time-change", time, trigger);
          if (Math.abs(prevTime - time) > 1.5) {
            this.#ctx.notify("seeking", time, trigger);
            if (!paused() && bufferedEnd() < time) {
              this.#ctx.notify("waiting", void 0, trigger);
            }
          }
          if (!live() && seekableEnd() - time < 0.01) {
            this.#ctx.notify("end", void 0, trigger);
            this.#preventTimeUpdates = true;
            setTimeout(() => {
              this.#preventTimeUpdates = false;
            }, 500);
          }
        }
        #onSeeked(time, trigger) {
          this.#ctx.notify("seeked", time, trigger);
        }
        #onLoaded(trigger) {
          const videoId = this.#videoId();
          this.#videoInfoPromise?.promise.then((info) => {
            if (!info) return;
            const { title, poster, duration, pro } = info;
            this.#pro.set(pro);
            this.#ctx.notify("title-change", title, trigger);
            this.#ctx.notify("poster-change", poster, trigger);
            this.#ctx.notify("duration-change", duration, trigger);
            this.#onReady(duration, trigger);
          }).catch(() => {
            if (videoId !== this.#videoId()) return;
            this.#remote("getVideoTitle");
            this.#remote("getDuration");
          });
        }
        #onReady(duration, trigger) {
          const { nativeControls } = this.#ctx.$state, showEmbedControls = nativeControls();
          this.#seekableRange = new TimeRange(0, duration);
          const detail = {
            buffered: new TimeRange(0, 0),
            seekable: this.#seekableRange,
            duration
          };
          this.#ctx.delegate.ready(detail, trigger);
          if (!showEmbedControls) {
            this.#remote("_hideOverlay");
          }
          this.#remote("getQualities");
          this.#remote("getChapters");
        }
        #onMethod(method2, data, trigger) {
          switch (method2) {
            case "getVideoTitle":
              const videoTitle = data;
              this.#ctx.notify("title-change", videoTitle, trigger);
              break;
            case "getDuration":
              const duration = data;
              if (!this.#ctx.$state.canPlay()) {
                this.#onReady(duration, trigger);
              } else {
                this.#ctx.notify("duration-change", duration, trigger);
              }
              break;
            case "getCurrentTime":
              this.#onTimeUpdate(data, trigger);
              break;
            case "getBuffered":
              if (isArray(data) && data.length) {
                this.#onLoadProgress(data[data.length - 1][1], trigger);
              }
              break;
            case "setMuted":
              this.#onVolumeChange(peek(this.#ctx.$state.volume), data, trigger);
              break;
            case "getChapters":
              this.#onChaptersChange(data);
              break;
            case "getQualities":
              this.#onQualitiesChange(data, trigger);
              break;
          }
          this.#getPromise(method2)?.resolve();
        }
        #attachListeners() {
          for (const type of trackedVimeoEvents) {
            this.#remote("addEventListener", type);
          }
        }
        #onPause(trigger) {
          this.#timeRAF.stop();
          this.#ctx.notify("pause", void 0, trigger);
        }
        #onPlay(trigger) {
          this.#timeRAF.start();
          this.#ctx.notify("play", void 0, trigger);
        }
        #onPlayProgress(trigger) {
          const { paused } = this.#ctx.$state;
          if (!paused() && !this.#preventTimeUpdates) {
            this.#ctx.notify("playing", void 0, trigger);
          }
        }
        #onLoadProgress(buffered, trigger) {
          const detail = {
            buffered: new TimeRange(0, buffered),
            seekable: this.#seekableRange
          };
          this.#ctx.notify("progress", detail, trigger);
        }
        #onBufferStart(trigger) {
          this.#ctx.notify("waiting", void 0, trigger);
        }
        #onBufferEnd(trigger) {
          const { paused } = this.#ctx.$state;
          if (!paused()) this.#ctx.notify("playing", void 0, trigger);
        }
        #onWaiting(trigger) {
          const { paused } = this.#ctx.$state;
          if (paused()) {
            this.#ctx.notify("play", void 0, trigger);
          }
          this.#ctx.notify("waiting", void 0, trigger);
        }
        #onVolumeChange(volume, muted, trigger) {
          const detail = { volume, muted };
          this.#ctx.notify("volume-change", detail, trigger);
        }
        // #onTextTrackChange(track: VimeoTextTrack, trigger: Event) {
        //   const textTrack = this.#ctx.textTracks.toArray().find((t) => t.language === track.language);
        //   if (textTrack) textTrack.mode = track.mode;
        // }
        // #onTextTracksChange(tracks: VimeoTextTrack[], trigger: Event) {
        //   for (const init of tracks) {
        //     const textTrack = new TextTrack({
        //       ...init,
        //       label: init.label.replace('auto-generated', 'auto'),
        //     });
        //     textTrack[TextTrackSymbol.readyState] = 2;
        //     this.#ctx.textTracks.add(textTrack, trigger);
        //     textTrack.setMode(init.mode, trigger);
        //   }
        // }
        // #onCueChange(cue: VimeoTextCue, trigger: Event) {
        //   const { textTracks, $state } = this.#ctx,
        //     { currentTime } = $state,
        //     track = textTracks.selected;
        //   if (this.#currentCue) track?.removeCue(this.#currentCue, trigger);
        //   this.#currentCue = new window.VTTCue(currentTime(), Number.MAX_SAFE_INTEGER, cue.text);
        //   track?.addCue(this.#currentCue, trigger);
        // }
        #onChaptersChange(chapters) {
          this.#removeChapters();
          if (!chapters.length) return;
          const track = new TextTrack({
            kind: "chapters",
            default: true
          }), { seekableEnd } = this.#ctx.$state;
          for (let i4 = 0; i4 < chapters.length; i4++) {
            const chapter = chapters[i4], nextChapter = chapters[i4 + 1];
            track.addCue(
              new window.VTTCue(
                chapter.startTime,
                nextChapter?.startTime ?? seekableEnd(),
                chapter.title
              )
            );
          }
          this.#chaptersTrack = track;
          this.#ctx.textTracks.add(track);
        }
        #removeChapters() {
          if (!this.#chaptersTrack) return;
          this.#ctx.textTracks.remove(this.#chaptersTrack);
          this.#chaptersTrack = null;
        }
        #onQualitiesChange(qualities, trigger) {
          this.#ctx.qualities[QualitySymbol.enableAuto] = qualities.some((q) => q.id === "auto") ? () => this.#remote("setQuality", "auto") : void 0;
          for (const quality of qualities) {
            if (quality.id === "auto") continue;
            const height = +quality.id.slice(0, -1);
            if (isNaN(height)) continue;
            this.#ctx.qualities[ListSymbol.add](
              {
                id: quality.id,
                width: height * (16 / 9),
                height,
                codec: "avc1,h.264",
                bitrate: -1
              },
              trigger
            );
          }
          this.#onQualityChange(
            qualities.find((q) => q.active),
            trigger
          );
        }
        #onQualityChange({ id: id3 } = {}, trigger) {
          if (!id3) return;
          const isAuto = id3 === "auto", newQuality = this.#ctx.qualities.getById(id3);
          if (isAuto) {
            this.#ctx.qualities[QualitySymbol.setAuto](isAuto, trigger);
            this.#ctx.qualities[ListSymbol.select](void 0, true, trigger);
          } else {
            this.#ctx.qualities[ListSymbol.select](newQuality ?? void 0, true, trigger);
          }
        }
        #onEvent(event2, payload, trigger) {
          switch (event2) {
            case "ready":
              this.#attachListeners();
              break;
            case "loaded":
              this.#onLoaded(trigger);
              break;
            case "play":
              this.#onPlay(trigger);
              break;
            case "playProgress":
              this.#onPlayProgress(trigger);
              break;
            case "pause":
              this.#onPause(trigger);
              break;
            case "loadProgress":
              this.#onLoadProgress(payload.seconds, trigger);
              break;
            case "waiting":
              this.#onWaiting(trigger);
              break;
            case "bufferstart":
              this.#onBufferStart(trigger);
              break;
            case "bufferend":
              this.#onBufferEnd(trigger);
              break;
            case "volumechange":
              this.#onVolumeChange(payload.volume, peek(this.#ctx.$state.muted), trigger);
              break;
            case "durationchange":
              this.#seekableRange = new TimeRange(0, payload.duration);
              this.#ctx.notify("duration-change", payload.duration, trigger);
              break;
            case "playbackratechange":
              this.#ctx.notify("rate-change", payload.playbackRate, trigger);
              break;
            case "qualitychange":
              this.#onQualityChange(payload, trigger);
              break;
            case "fullscreenchange":
              this.#fullscreenActive = payload.fullscreen;
              this.#ctx.notify("fullscreen-change", payload.fullscreen, trigger);
              break;
            case "enterpictureinpicture":
              this.#ctx.notify("picture-in-picture-change", true, trigger);
              break;
            case "leavepictureinpicture":
              this.#ctx.notify("picture-in-picture-change", false, trigger);
              break;
            case "ended":
              this.#ctx.notify("end", void 0, trigger);
              break;
            case "error":
              this.#onError(payload, trigger);
              break;
            case "seek":
            case "seeked":
              this.#onSeeked(payload.seconds, trigger);
              break;
          }
        }
        #onError(error, trigger) {
          const { message, method: method2 } = error;
          if (method2 === "setPlaybackRate") {
            this.#pro.set(false);
          }
          if (method2) {
            this.#getPromise(method2)?.reject(message);
          }
        }
        onMessage(message, event2) {
          if (message.event) {
            this.#onEvent(message.event, message.data, event2);
          } else if (message.method) {
            this.#onMethod(message.method, message.value, event2);
          }
        }
        onLoad() {
        }
        async #remote(command, arg) {
          let promise = deferredPromise(), promises = this.#promises.get(command);
          if (!promises) this.#promises.set(command, promises = []);
          promises.push(promise);
          this.postMessage({
            method: command,
            value: arg
          });
          return promise.promise;
        }
        #reset() {
          this.#timeRAF.stop();
          this.#seekableRange = new TimeRange(0, 0);
          this.#videoInfoPromise = null;
          this.#currentCue = null;
          this.#pro.set(false);
          this.#removeChapters();
        }
        #getPromise(command) {
          return this.#promises.get(command)?.shift();
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-Zc3I7oOd.js
  var vidstack_Zc3I7oOd_exports = {};
  __export(vidstack_Zc3I7oOd_exports, {
    findYouTubePoster: () => findYouTubePoster,
    resolveYouTubeVideoId: () => resolveYouTubeVideoId
  });
  function resolveYouTubeVideoId(src) {
    return src.match(videoIdRE2)?.[1];
  }
  async function findYouTubePoster(videoId, abort) {
    if (posterCache.has(videoId)) return posterCache.get(videoId);
    if (pendingFetch2.has(videoId)) return pendingFetch2.get(videoId);
    const pending2 = new Promise(async (resolve) => {
      const sizes = ["maxresdefault", "sddefault", "hqdefault"];
      for (const size2 of sizes) {
        for (const webp of [true, false]) {
          const url = resolveYouTubePosterURL(videoId, size2, webp), response = await fetch(url, {
            mode: "no-cors",
            signal: abort.signal
          });
          if (response.status < 400) {
            posterCache.set(videoId, url);
            resolve(url);
            return;
          }
        }
      }
    }).catch(() => "").finally(() => pendingFetch2.delete(videoId));
    pendingFetch2.set(videoId, pending2);
    return pending2;
  }
  function resolveYouTubePosterURL(videoId, size2, webp) {
    const type = webp ? "webp" : "jpg";
    return `https://i.ytimg.com/${webp ? "vi_webp" : "vi"}/${videoId}/${size2}.${type}`;
  }
  var videoIdRE2, posterCache, pendingFetch2;
  var init_vidstack_Zc3I7oOd = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-Zc3I7oOd.js"() {
      videoIdRE2 = /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;
      posterCache = /* @__PURE__ */ new Map();
      pendingFetch2 = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-youtube.js
  var vidstack_youtube_exports = {};
  __export(vidstack_youtube_exports, {
    YouTubeProvider: () => YouTubeProvider
  });
  var YouTubePlayerState, YouTubeProvider;
  var init_vidstack_youtube = __esm({
    "node_modules/vidstack/prod/providers/vidstack-youtube.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_BmMUBVGQ();
      init_vidstack_A9j_j6J();
      init_vidstack_BePVaxm4();
      init_vidstack_Zc3I7oOd();
      YouTubePlayerState = {
        Unstarted: -1,
        Ended: 0,
        Playing: 1,
        Paused: 2,
        Buffering: 3,
        Cued: 5
      };
      YouTubeProvider = class extends EmbedProvider {
        $$PROVIDER_TYPE = "YOUTUBE";
        scope = createScope();
        #ctx;
        #videoId = signal("");
        #state = -1;
        #currentSrc = null;
        #seekingTimer = -1;
        #invalidPlay = false;
        #promises = /* @__PURE__ */ new Map();
        constructor(iframe, ctx) {
          super(iframe);
          this.#ctx = ctx;
        }
        /**
         * Sets the player's interface language. The parameter value is an ISO 639-1 two-letter
         * language code or a fully specified locale. For example, fr and fr-ca are both valid values.
         * Other language input codes, such as IETF language tags (BCP 47) might also be handled properly.
         *
         * The interface language is used for tooltips in the player and also affects the default caption
         * track. Note that YouTube might select a different caption track language for a particular
         * user based on the user's individual language preferences and the availability of caption tracks.
         *
         * @defaultValue 'en'
         */
        language = "en";
        color = "red";
        /**
         * Whether cookies should be enabled on the embed. This is turned off by default to be
         * GDPR-compliant.
         *
         * @defaultValue `false`
         */
        cookies = false;
        get currentSrc() {
          return this.#currentSrc;
        }
        get type() {
          return "youtube";
        }
        get videoId() {
          return this.#videoId();
        }
        preconnect() {
          preconnect(this.getOrigin());
        }
        setup() {
          super.setup();
          effect(this.#watchVideoId.bind(this));
          this.#ctx.notify("provider-setup", this);
        }
        destroy() {
          this.#reset();
          const message = "provider destroyed";
          for (const promises of this.#promises.values()) {
            for (const { reject } of promises) reject(message);
          }
          this.#promises.clear();
        }
        async play() {
          return this.#remote("playVideo");
        }
        #playFail(message) {
          this.#getPromise("playVideo")?.reject(message);
        }
        async pause() {
          return this.#remote("pauseVideo");
        }
        #pauseFail(message) {
          this.#getPromise("pauseVideo")?.reject(message);
        }
        setMuted(muted) {
          if (muted) this.#remote("mute");
          else this.#remote("unMute");
        }
        setCurrentTime(time) {
          this.#remote("seekTo", time);
          this.#ctx.notify("seeking", time);
        }
        setVolume(volume) {
          this.#remote("setVolume", volume * 100);
        }
        setPlaybackRate(rate) {
          this.#remote("setPlaybackRate", rate);
        }
        async loadSource(src) {
          if (!isString(src.src)) {
            this.#currentSrc = null;
            this.#videoId.set("");
            return;
          }
          const videoId = resolveYouTubeVideoId(src.src);
          this.#videoId.set(videoId ?? "");
          this.#currentSrc = src;
        }
        getOrigin() {
          return !this.cookies ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
        }
        #watchVideoId() {
          this.#reset();
          const videoId = this.#videoId();
          if (!videoId) {
            this.src.set("");
            return;
          }
          this.src.set(`${this.getOrigin()}/embed/${videoId}`);
          this.#ctx.notify("load-start");
        }
        buildParams() {
          const { keyDisabled } = this.#ctx.$props, { muted, playsInline, nativeControls } = this.#ctx.$state, showControls = nativeControls();
          return {
            autoplay: 0,
            cc_lang_pref: this.language,
            cc_load_policy: showControls ? 1 : void 0,
            color: this.color,
            controls: showControls ? 1 : 0,
            disablekb: !showControls || keyDisabled() ? 1 : 0,
            enablejsapi: 1,
            fs: 1,
            hl: this.language,
            iv_load_policy: showControls ? 1 : 3,
            mute: muted() ? 1 : 0,
            playsinline: playsInline() ? 1 : 0
          };
        }
        #remote(command, arg) {
          let promise = deferredPromise(), promises = this.#promises.get(command);
          if (!promises) this.#promises.set(command, promises = []);
          promises.push(promise);
          this.postMessage({
            event: "command",
            func: command,
            args: arg ? [arg] : void 0
          });
          return promise.promise;
        }
        onLoad() {
          window.setTimeout(() => this.postMessage({ event: "listening" }), 100);
        }
        #onReady(trigger) {
          this.#ctx.notify("loaded-metadata");
          this.#ctx.notify("loaded-data");
          this.#ctx.delegate.ready(void 0, trigger);
        }
        #onPause(trigger) {
          this.#getPromise("pauseVideo")?.resolve();
          this.#ctx.notify("pause", void 0, trigger);
        }
        #onTimeUpdate(time, trigger) {
          const { duration, realCurrentTime } = this.#ctx.$state, hasEnded = this.#state === YouTubePlayerState.Ended, boundTime2 = hasEnded ? duration() : time;
          this.#ctx.notify("time-change", boundTime2, trigger);
          if (!hasEnded && Math.abs(boundTime2 - realCurrentTime()) > 1) {
            this.#ctx.notify("seeking", boundTime2, trigger);
          }
        }
        #onProgress(buffered, seekable, trigger) {
          const detail = {
            buffered: new TimeRange(0, buffered),
            seekable
          };
          this.#ctx.notify("progress", detail, trigger);
          const { seeking, realCurrentTime } = this.#ctx.$state;
          if (seeking() && buffered > realCurrentTime()) {
            this.#onSeeked(trigger);
          }
        }
        #onSeeked(trigger) {
          const { paused, realCurrentTime } = this.#ctx.$state;
          window.clearTimeout(this.#seekingTimer);
          this.#seekingTimer = window.setTimeout(
            () => {
              this.#ctx.notify("seeked", realCurrentTime(), trigger);
              this.#seekingTimer = -1;
            },
            paused() ? 100 : 0
          );
        }
        #onEnded(trigger) {
          const { seeking } = this.#ctx.$state;
          if (seeking()) this.#onSeeked(trigger);
          this.#ctx.notify("pause", void 0, trigger);
          this.#ctx.notify("end", void 0, trigger);
        }
        #onStateChange(state, trigger) {
          const { paused, seeking } = this.#ctx.$state, isPlaying = state === YouTubePlayerState.Playing, isBuffering = state === YouTubePlayerState.Buffering, isPendingPlay = this.#isPending("playVideo"), isPlay = paused() && (isBuffering || isPlaying);
          if (isBuffering) this.#ctx.notify("waiting", void 0, trigger);
          if (seeking() && isPlaying) {
            this.#onSeeked(trigger);
          }
          if (this.#invalidPlay && isPlaying) {
            this.pause();
            this.#invalidPlay = false;
            this.setMuted(this.#ctx.$state.muted());
            return;
          }
          if (!isPendingPlay && isPlay) {
            this.#invalidPlay = true;
            this.setMuted(true);
            return;
          }
          if (isPlay) {
            this.#getPromise("playVideo")?.resolve();
            this.#ctx.notify("play", void 0, trigger);
          }
          switch (state) {
            case YouTubePlayerState.Cued:
              this.#onReady(trigger);
              break;
            case YouTubePlayerState.Playing:
              this.#ctx.notify("playing", void 0, trigger);
              break;
            case YouTubePlayerState.Paused:
              this.#onPause(trigger);
              break;
            case YouTubePlayerState.Ended:
              this.#onEnded(trigger);
              break;
          }
          this.#state = state;
        }
        onMessage({ info }, event2) {
          if (!info) return;
          const { title, intrinsicDuration, playbackRate } = this.#ctx.$state;
          if (isObject(info.videoData) && info.videoData.title !== title()) {
            this.#ctx.notify("title-change", info.videoData.title, event2);
          }
          if (isNumber(info.duration) && info.duration !== intrinsicDuration()) {
            if (isNumber(info.videoLoadedFraction)) {
              const buffered = info.progressState?.loaded ?? info.videoLoadedFraction * info.duration, seekable = new TimeRange(0, info.duration);
              this.#onProgress(buffered, seekable, event2);
            }
            this.#ctx.notify("duration-change", info.duration, event2);
          }
          if (isNumber(info.playbackRate) && info.playbackRate !== playbackRate()) {
            this.#ctx.notify("rate-change", info.playbackRate, event2);
          }
          if (info.progressState) {
            const { current, seekableStart, seekableEnd, loaded, duration } = info.progressState;
            this.#onTimeUpdate(current, event2);
            this.#onProgress(loaded, new TimeRange(seekableStart, seekableEnd), event2);
            if (duration !== intrinsicDuration()) {
              this.#ctx.notify("duration-change", duration, event2);
            }
          }
          if (isNumber(info.volume) && isBoolean(info.muted) && !this.#invalidPlay) {
            const detail = {
              muted: info.muted,
              volume: info.volume / 100
            };
            this.#ctx.notify("volume-change", detail, event2);
          }
          if (isNumber(info.playerState) && info.playerState !== this.#state) {
            this.#onStateChange(info.playerState, event2);
          }
        }
        #reset() {
          this.#state = -1;
          this.#seekingTimer = -1;
          this.#invalidPlay = false;
        }
        #getPromise(command) {
          return this.#promises.get(command)?.shift();
        }
        #isPending(command) {
          return Boolean(this.#promises.get(command)?.length);
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-IHrfMzpQ.js
  function getCastFrameworkURL() {
    return "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
  }
  function hasLoadedCastFramework() {
    return !!window.cast?.framework;
  }
  function isCastAvailable() {
    return !!window.chrome?.cast?.isAvailable;
  }
  function isCastConnected() {
    return getCastContext().getCastState() === cast.framework.CastState.CONNECTED;
  }
  function getCastContext() {
    return window.cast.framework.CastContext.getInstance();
  }
  function getCastSession() {
    return getCastContext().getCurrentSession();
  }
  function getCastSessionMedia() {
    return getCastSession()?.getSessionObj().media[0];
  }
  function hasActiveCastSession(src) {
    const contentId = getCastSessionMedia()?.media.contentId;
    return contentId === src?.src;
  }
  function getDefaultCastOptions() {
    return {
      language: "en-US",
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      resumeSavedSession: true,
      androidReceiverCompatible: true
    };
  }
  function getCastErrorMessage(code) {
    const defaultMessage = `Google Cast Error Code: ${code}`;
    return defaultMessage;
  }
  function listenCastContextEvent(type, handler) {
    return listenEvent(getCastContext(), type, handler);
  }
  var init_vidstack_IHrfMzpQ = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-IHrfMzpQ.js"() {
      init_vidstack_CRlI3Mh7();
    }
  });

  // node_modules/vidstack/prod/providers/vidstack-google-cast.js
  var vidstack_google_cast_exports = {};
  __export(vidstack_google_cast_exports, {
    GoogleCastProvider: () => GoogleCastProvider
  });
  var GoogleCastMediaInfoBuilder, REMOTE_TRACK_TEXT_TYPE, REMOTE_TRACK_AUDIO_TYPE, GoogleCastTracksManager, GoogleCastProvider;
  var init_vidstack_google_cast = __esm({
    "node_modules/vidstack/prod/providers/vidstack-google-cast.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_BmMUBVGQ();
      init_vidstack_DSYpsFWk();
      init_vidstack_D5EzK014();
      init_vidstack_IHrfMzpQ();
      GoogleCastMediaInfoBuilder = class {
        #info;
        constructor(src) {
          this.#info = new chrome.cast.media.MediaInfo(src.src, src.type);
        }
        build() {
          return this.#info;
        }
        setStreamType(streamType) {
          if (streamType.includes("live")) {
            this.#info.streamType = chrome.cast.media.StreamType.LIVE;
          } else {
            this.#info.streamType = chrome.cast.media.StreamType.BUFFERED;
          }
          return this;
        }
        setTracks(tracks) {
          this.#info.tracks = tracks.map(this.#buildCastTrack);
          return this;
        }
        setMetadata(title, poster) {
          this.#info.metadata = new chrome.cast.media.GenericMediaMetadata();
          this.#info.metadata.title = title;
          this.#info.metadata.images = [{ url: poster }];
          return this;
        }
        #buildCastTrack(track, trackId) {
          const castTrack = new chrome.cast.media.Track(trackId, chrome.cast.media.TrackType.TEXT);
          castTrack.name = track.label;
          castTrack.trackContentId = track.src;
          castTrack.trackContentType = "text/vtt";
          castTrack.language = track.language;
          castTrack.subtype = track.kind.toUpperCase();
          return castTrack;
        }
      };
      REMOTE_TRACK_TEXT_TYPE = chrome.cast.media.TrackType.TEXT;
      REMOTE_TRACK_AUDIO_TYPE = chrome.cast.media.TrackType.AUDIO;
      GoogleCastTracksManager = class {
        #cast;
        #ctx;
        #onNewLocalTracks;
        constructor(cast2, ctx, onNewLocalTracks) {
          this.#cast = cast2;
          this.#ctx = ctx;
          this.#onNewLocalTracks = onNewLocalTracks;
        }
        setup() {
          const syncRemoteActiveIds = this.syncRemoteActiveIds.bind(this);
          listenEvent(this.#ctx.audioTracks, "change", syncRemoteActiveIds);
          listenEvent(this.#ctx.textTracks, "mode-change", syncRemoteActiveIds);
          effect(this.#syncLocalTracks.bind(this));
        }
        getLocalTextTracks() {
          return this.#ctx.$state.textTracks().filter((track) => track.src && track.type === "vtt");
        }
        #getLocalAudioTracks() {
          return this.#ctx.$state.audioTracks();
        }
        #getRemoteTracks(type) {
          const tracks = this.#cast.mediaInfo?.tracks ?? [];
          return type ? tracks.filter((track) => track.type === type) : tracks;
        }
        #getRemoteActiveIds() {
          const activeIds = [], activeLocalAudioTrack = this.#getLocalAudioTracks().find((track) => track.selected), activeLocalTextTracks = this.getLocalTextTracks().filter((track) => track.mode === "showing");
          if (activeLocalAudioTrack) {
            const remoteAudioTracks = this.#getRemoteTracks(REMOTE_TRACK_AUDIO_TYPE), remoteAudioTrack = this.#findRemoteTrack(remoteAudioTracks, activeLocalAudioTrack);
            if (remoteAudioTrack) activeIds.push(remoteAudioTrack.trackId);
          }
          if (activeLocalTextTracks?.length) {
            const remoteTextTracks = this.#getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
            if (remoteTextTracks.length) {
              for (const localTrack of activeLocalTextTracks) {
                const remoteTextTrack = this.#findRemoteTrack(remoteTextTracks, localTrack);
                if (remoteTextTrack) activeIds.push(remoteTextTrack.trackId);
              }
            }
          }
          return activeIds;
        }
        #syncLocalTracks() {
          const localTextTracks = this.getLocalTextTracks();
          if (!this.#cast.isMediaLoaded) return;
          const remoteTextTracks = this.#getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
          for (const localTrack of localTextTracks) {
            const hasRemoteTrack = this.#findRemoteTrack(remoteTextTracks, localTrack);
            if (!hasRemoteTrack) {
              untrack(() => this.#onNewLocalTracks?.());
              break;
            }
          }
        }
        syncRemoteTracks(event2) {
          if (!this.#cast.isMediaLoaded) return;
          const localAudioTracks = this.#getLocalAudioTracks(), localTextTracks = this.getLocalTextTracks(), remoteAudioTracks = this.#getRemoteTracks(REMOTE_TRACK_AUDIO_TYPE), remoteTextTracks = this.#getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
          for (const remoteAudioTrack of remoteAudioTracks) {
            const hasLocalTrack = this.#findLocalTrack(localAudioTracks, remoteAudioTrack);
            if (hasLocalTrack) continue;
            const localAudioTrack = {
              id: remoteAudioTrack.trackId.toString(),
              label: remoteAudioTrack.name,
              language: remoteAudioTrack.language,
              kind: remoteAudioTrack.subtype ?? "main",
              selected: false
            };
            this.#ctx.audioTracks[ListSymbol.add](localAudioTrack, event2);
          }
          for (const remoteTextTrack of remoteTextTracks) {
            const hasLocalTrack = this.#findLocalTrack(localTextTracks, remoteTextTrack);
            if (hasLocalTrack) continue;
            const localTextTrack = {
              id: remoteTextTrack.trackId.toString(),
              src: remoteTextTrack.trackContentId,
              label: remoteTextTrack.name,
              language: remoteTextTrack.language,
              kind: remoteTextTrack.subtype.toLowerCase()
            };
            this.#ctx.textTracks.add(localTextTrack, event2);
          }
        }
        syncRemoteActiveIds(event2) {
          if (!this.#cast.isMediaLoaded) return;
          const activeIds = this.#getRemoteActiveIds(), editRequest = new chrome.cast.media.EditTracksInfoRequest(activeIds);
          this.#editTracksInfo(editRequest).catch((error) => {
          });
        }
        #editTracksInfo(request) {
          const media = getCastSessionMedia();
          return new Promise((resolve, reject) => media?.editTracksInfo(request, resolve, reject));
        }
        #findLocalTrack(localTracks, remoteTrack) {
          return localTracks.find((localTrack) => this.#isMatch(localTrack, remoteTrack));
        }
        #findRemoteTrack(remoteTracks, localTrack) {
          return remoteTracks.find((remoteTrack) => this.#isMatch(localTrack, remoteTrack));
        }
        // Note: we can't rely on id matching because they will differ between local/remote. A local
        // track id might not even exist.
        #isMatch(localTrack, remoteTrack) {
          return remoteTrack.name === localTrack.label && remoteTrack.language === localTrack.language && remoteTrack.subtype.toLowerCase() === localTrack.kind.toLowerCase();
        }
      };
      GoogleCastProvider = class {
        $$PROVIDER_TYPE = "GOOGLE_CAST";
        scope = createScope();
        #player;
        #ctx;
        #tracks;
        #currentSrc = null;
        #state = "disconnected";
        #currentTime = 0;
        #played = 0;
        #seekableRange = new TimeRange(0, 0);
        #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
        #playerEventHandlers;
        #reloadInfo = null;
        #isIdle = false;
        constructor(player, ctx) {
          this.#player = player;
          this.#ctx = ctx;
          this.#tracks = new GoogleCastTracksManager(player, ctx, this.#onNewLocalTracks.bind(this));
        }
        get type() {
          return "google-cast";
        }
        get currentSrc() {
          return this.#currentSrc;
        }
        /**
         * The Google Cast remote player.
         *
         * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.RemotePlayer}
         */
        get player() {
          return this.#player;
        }
        /**
         * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
         */
        get cast() {
          return getCastContext();
        }
        /**
         * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastSession}
         */
        get session() {
          return getCastSession();
        }
        /**
         * @see {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media.Media}
         */
        get media() {
          return getCastSessionMedia();
        }
        /**
         * Whether the current Google Cast session belongs to this provider.
         */
        get hasActiveSession() {
          return hasActiveCastSession(this.#currentSrc);
        }
        setup() {
          this.#attachCastContextEventListeners();
          this.#attachCastPlayerEventListeners();
          this.#tracks.setup();
          this.#ctx.notify("provider-setup", this);
        }
        #attachCastContextEventListeners() {
          listenCastContextEvent(
            cast.framework.CastContextEventType.CAST_STATE_CHANGED,
            this.#onCastStateChange.bind(this)
          );
        }
        #attachCastPlayerEventListeners() {
          const Event2 = cast.framework.RemotePlayerEventType, handlers = {
            [Event2.IS_CONNECTED_CHANGED]: this.#onCastStateChange,
            [Event2.IS_MEDIA_LOADED_CHANGED]: this.#onMediaLoadedChange,
            [Event2.CAN_CONTROL_VOLUME_CHANGED]: this.#onCanControlVolumeChange,
            [Event2.CAN_SEEK_CHANGED]: this.#onCanSeekChange,
            [Event2.DURATION_CHANGED]: this.#onDurationChange,
            [Event2.IS_MUTED_CHANGED]: this.#onVolumeChange,
            [Event2.VOLUME_LEVEL_CHANGED]: this.#onVolumeChange,
            [Event2.IS_PAUSED_CHANGED]: this.#onPausedChange,
            [Event2.LIVE_SEEKABLE_RANGE_CHANGED]: this.#onProgress,
            [Event2.PLAYER_STATE_CHANGED]: this.#onPlayerStateChange
          };
          this.#playerEventHandlers = handlers;
          const handler = this.#onRemotePlayerEvent.bind(this);
          for (const type of keysOf(handlers)) {
            this.#player.controller.addEventListener(type, handler);
          }
          onDispose(() => {
            for (const type of keysOf(handlers)) {
              this.#player.controller.removeEventListener(type, handler);
            }
          });
        }
        async play() {
          if (!this.#player.isPaused && !this.#isIdle) return;
          if (this.#isIdle) {
            await this.#reload(false, 0);
            return;
          }
          this.#player.controller?.playOrPause();
        }
        async pause() {
          if (this.#player.isPaused) return;
          this.#player.controller?.playOrPause();
        }
        getMediaStatus(request) {
          return new Promise((resolve, reject) => {
            this.media?.getStatus(request, resolve, reject);
          });
        }
        setMuted(muted) {
          const hasChanged = muted && !this.#player.isMuted || !muted && this.#player.isMuted;
          if (hasChanged) this.#player.controller?.muteOrUnmute();
        }
        setCurrentTime(time) {
          this.#player.currentTime = time;
          this.#ctx.notify("seeking", time);
          this.#player.controller?.seek();
        }
        setVolume(volume) {
          this.#player.volumeLevel = volume;
          this.#player.controller?.setVolumeLevel();
        }
        async loadSource(src) {
          if (this.#reloadInfo?.src !== src) this.#reloadInfo = null;
          if (hasActiveCastSession(src)) {
            this.#resumeSession();
            this.#currentSrc = src;
            return;
          }
          this.#ctx.notify("load-start");
          const loadRequest = this.#buildLoadRequest(src), errorCode = await this.session.loadMedia(loadRequest);
          if (errorCode) {
            this.#currentSrc = null;
            this.#ctx.notify("error", Error(getCastErrorMessage(errorCode)));
            return;
          }
          this.#currentSrc = src;
        }
        destroy() {
          this.#reset();
          this.#endSession();
        }
        #reset() {
          if (!this.#reloadInfo) {
            this.#played = 0;
            this.#seekableRange = new TimeRange(0, 0);
          }
          this.#timeRAF.stop();
          this.#currentTime = 0;
          this.#reloadInfo = null;
        }
        #resumeSession() {
          const resumeSessionEvent = new DOMEvent("resume-session", { detail: this.session });
          this.#onMediaLoadedChange(resumeSessionEvent);
          const { muted, volume, savedState } = this.#ctx.$state, localState = savedState();
          this.setCurrentTime(Math.max(this.#player.currentTime, localState?.currentTime ?? 0));
          this.setMuted(muted());
          this.setVolume(volume());
          if (localState?.paused === false) this.play();
        }
        #endSession() {
          this.cast.endCurrentSession(true);
          const { remotePlaybackLoader } = this.#ctx.$state;
          remotePlaybackLoader.set(null);
        }
        #disconnectFromReceiver() {
          const { savedState } = this.#ctx.$state;
          savedState.set({
            paused: this.#player.isPaused,
            currentTime: this.#player.currentTime
          });
          this.#endSession();
        }
        #onAnimationFrame() {
          this.#onCurrentTimeChange();
        }
        #onRemotePlayerEvent(event2) {
          this.#playerEventHandlers[event2.type].call(this, event2);
        }
        #onCastStateChange(data) {
          const castState = this.cast.getCastState(), state = castState === cast.framework.CastState.CONNECTED ? "connected" : castState === cast.framework.CastState.CONNECTING ? "connecting" : "disconnected";
          if (this.#state === state) return;
          const detail = { type: "google-cast", state }, trigger = this.#createEvent(data);
          this.#state = state;
          this.#ctx.notify("remote-playback-change", detail, trigger);
          if (state === "disconnected") {
            this.#disconnectFromReceiver();
          }
        }
        #onMediaLoadedChange(event2) {
          const hasLoaded = !!this.#player.isMediaLoaded;
          if (!hasLoaded) return;
          const src = peek(this.#ctx.$state.source);
          Promise.resolve().then(() => {
            if (src !== peek(this.#ctx.$state.source) || !this.#player.isMediaLoaded) return;
            this.#reset();
            const duration = this.#player.duration;
            this.#seekableRange = new TimeRange(0, duration);
            const detail = {
              provider: this,
              duration,
              buffered: new TimeRange(0, 0),
              seekable: this.#getSeekableRange()
            }, trigger = this.#createEvent(event2);
            this.#ctx.notify("loaded-metadata", void 0, trigger);
            this.#ctx.notify("loaded-data", void 0, trigger);
            this.#ctx.notify("can-play", detail, trigger);
            this.#onCanControlVolumeChange();
            this.#onCanSeekChange(event2);
            const { volume, muted } = this.#ctx.$state;
            this.setVolume(volume());
            this.setMuted(muted());
            this.#timeRAF.start();
            this.#tracks.syncRemoteTracks(trigger);
            this.#tracks.syncRemoteActiveIds(trigger);
          });
        }
        #onCanControlVolumeChange() {
          this.#ctx.$state.canSetVolume.set(this.#player.canControlVolume);
        }
        #onCanSeekChange(event2) {
          const trigger = this.#createEvent(event2);
          this.#ctx.notify("stream-type-change", this.#getStreamType(), trigger);
        }
        #getStreamType() {
          const streamType = this.#player.mediaInfo?.streamType;
          return streamType === chrome.cast.media.StreamType.LIVE ? this.#player.canSeek ? "live:dvr" : "live" : "on-demand";
        }
        #onCurrentTimeChange() {
          if (this.#reloadInfo) return;
          const currentTime = this.#player.currentTime;
          if (currentTime === this.#currentTime) return;
          this.#ctx.notify("time-change", currentTime);
          if (currentTime > this.#played) {
            this.#played = currentTime;
            this.#onProgress();
          }
          if (this.#ctx.$state.seeking()) {
            this.#ctx.notify("seeked", currentTime);
          }
          this.#currentTime = currentTime;
        }
        #onDurationChange(event2) {
          if (!this.#player.isMediaLoaded || this.#reloadInfo) return;
          const duration = this.#player.duration, trigger = this.#createEvent(event2);
          this.#seekableRange = new TimeRange(0, duration);
          this.#ctx.notify("duration-change", duration, trigger);
        }
        #onVolumeChange(event2) {
          if (!this.#player.isMediaLoaded) return;
          const detail = {
            muted: this.#player.isMuted,
            volume: this.#player.volumeLevel
          }, trigger = this.#createEvent(event2);
          this.#ctx.notify("volume-change", detail, trigger);
        }
        #onPausedChange(event2) {
          const trigger = this.#createEvent(event2);
          if (this.#player.isPaused) {
            this.#ctx.notify("pause", void 0, trigger);
          } else {
            this.#ctx.notify("play", void 0, trigger);
          }
        }
        #onProgress(event2) {
          const detail = {
            seekable: this.#getSeekableRange(),
            buffered: new TimeRange(0, this.#played)
          }, trigger = event2 ? this.#createEvent(event2) : void 0;
          this.#ctx.notify("progress", detail, trigger);
        }
        #onPlayerStateChange(event2) {
          const state = this.#player.playerState, PlayerState = chrome.cast.media.PlayerState;
          this.#isIdle = state === PlayerState.IDLE;
          if (state === PlayerState.PAUSED) return;
          const trigger = this.#createEvent(event2);
          switch (state) {
            case PlayerState.PLAYING:
              this.#ctx.notify("playing", void 0, trigger);
              break;
            case PlayerState.BUFFERING:
              this.#ctx.notify("waiting", void 0, trigger);
              break;
            case PlayerState.IDLE:
              this.#timeRAF.stop();
              this.#ctx.notify("pause");
              this.#ctx.notify("end");
              break;
          }
        }
        #getSeekableRange() {
          return this.#player.liveSeekableRange ? new TimeRange(this.#player.liveSeekableRange.start, this.#player.liveSeekableRange.end) : this.#seekableRange;
        }
        #createEvent(detail) {
          return detail instanceof Event ? detail : new DOMEvent(detail.type, { detail });
        }
        #buildMediaInfo(src) {
          const { streamType, title, poster } = this.#ctx.$state;
          return new GoogleCastMediaInfoBuilder(src).setMetadata(title(), poster()).setStreamType(streamType()).setTracks(this.#tracks.getLocalTextTracks()).build();
        }
        #buildLoadRequest(src) {
          const mediaInfo = this.#buildMediaInfo(src), request = new chrome.cast.media.LoadRequest(mediaInfo), savedState = this.#ctx.$state.savedState();
          request.autoplay = (this.#reloadInfo?.paused ?? savedState?.paused) === false;
          request.currentTime = this.#reloadInfo?.time ?? savedState?.currentTime ?? 0;
          return request;
        }
        async #reload(paused, time) {
          const src = peek(this.#ctx.$state.source);
          this.#reloadInfo = { src, paused, time };
          await this.loadSource(src);
        }
        #onNewLocalTracks() {
          this.#reload(this.#player.isPaused, this.#player.currentTime).catch((error) => {
          });
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-CWDlegKy.js
  var vidstack_CWDlegKy_exports = {};
  __export(vidstack_CWDlegKy_exports, {
    GoogleCastLoader: () => GoogleCastLoader
  });
  var GoogleCastLoader;
  var init_vidstack_CWDlegKy = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-CWDlegKy.js"() {
      init_vidstack_DwhHIY5e();
      init_vidstack_A9j_j6J();
      init_vidstack_IHrfMzpQ();
      init_vidstack_CRlI3Mh7();
      GoogleCastLoader = class {
        name = "google-cast";
        target;
        #player;
        /**
         * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
         */
        get cast() {
          return getCastContext();
        }
        mediaType() {
          return "video";
        }
        canPlay(src) {
          return IS_CHROME && !IS_IOS && canGoogleCastSrc(src);
        }
        async prompt(ctx) {
          let loadEvent, openEvent, errorEvent;
          try {
            loadEvent = await this.#loadCastFramework(ctx);
            if (!this.#player) {
              this.#player = new cast.framework.RemotePlayer();
              new cast.framework.RemotePlayerController(this.#player);
            }
            openEvent = ctx.player.createEvent("google-cast-prompt-open", {
              trigger: loadEvent
            });
            ctx.player.dispatchEvent(openEvent);
            this.#notifyRemoteStateChange(ctx, "connecting", openEvent);
            await this.#showPrompt(peek(ctx.$props.googleCast));
            ctx.$state.remotePlaybackInfo.set({
              deviceName: getCastSession()?.getCastDevice().friendlyName
            });
            if (isCastConnected()) this.#notifyRemoteStateChange(ctx, "connected", openEvent);
          } catch (code) {
            const error = code instanceof Error ? code : this.#createError(
              (code + "").toUpperCase(),
              "Prompt failed."
            );
            errorEvent = ctx.player.createEvent("google-cast-prompt-error", {
              detail: error,
              trigger: openEvent ?? loadEvent,
              cancelable: true
            });
            ctx.player.dispatch(errorEvent);
            this.#notifyRemoteStateChange(
              ctx,
              isCastConnected() ? "connected" : "disconnected",
              errorEvent
            );
            throw error;
          } finally {
            ctx.player.dispatch("google-cast-prompt-close", {
              trigger: errorEvent ?? openEvent ?? loadEvent
            });
          }
        }
        async load(ctx) {
          if (!this.#player) {
            throw Error("[vidstack] google cast player was not initialized");
          }
          return new (await Promise.resolve().then(() => (init_vidstack_google_cast(), vidstack_google_cast_exports))).GoogleCastProvider(this.#player, ctx);
        }
        async #loadCastFramework(ctx) {
          if (hasLoadedCastFramework()) return;
          const loadStartEvent = ctx.player.createEvent("google-cast-load-start");
          ctx.player.dispatch(loadStartEvent);
          await loadScript(getCastFrameworkURL());
          await customElements.whenDefined("google-cast-launcher");
          const loadedEvent = ctx.player.createEvent("google-cast-loaded", { trigger: loadStartEvent });
          ctx.player.dispatch(loadedEvent);
          if (!isCastAvailable()) {
            throw this.#createError("CAST_NOT_AVAILABLE", "Google Cast not available on this platform.");
          }
          return loadedEvent;
        }
        async #showPrompt(options) {
          this.#setOptions(options);
          const errorCode = await this.cast.requestSession();
          if (errorCode) {
            throw this.#createError(
              errorCode.toUpperCase(),
              getCastErrorMessage(errorCode)
            );
          }
        }
        #setOptions(options) {
          this.cast?.setOptions({
            ...getDefaultCastOptions(),
            ...options
          });
        }
        #notifyRemoteStateChange(ctx, state, trigger) {
          const detail = { type: "google-cast", state };
          ctx.notify("remote-playback-change", detail, trigger);
        }
        #createError(code, message) {
          const error = Error(message);
          error.code = code;
          return error;
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-DJTshtlu.js
  var vidstack_DJTshtlu_exports = {};
  __export(vidstack_DJTshtlu_exports, {
    insertContent: () => insertContent
  });
  function insertContent(container, $state) {
    const icon = cloneTemplateContent(svgTemplate);
    icon.innerHTML = Icon$24;
    container.append(icon);
    const text = document.createElement("span");
    text.classList.add("vds-google-cast-info");
    container.append(text);
    const deviceName = document.createElement("span");
    deviceName.classList.add("vds-google-cast-device-name");
    effect(() => {
      const { remotePlaybackInfo } = $state, info = remotePlaybackInfo();
      if (info?.deviceName) {
        deviceName.textContent = info.deviceName;
        text.append("Google Cast on ", deviceName);
      }
      return () => {
        text.textContent = "";
      };
    });
  }
  var svgTemplate;
  var init_vidstack_DJTshtlu = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-DJTshtlu.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_Ds_q5BGO();
      svgTemplate = /* @__PURE__ */ createTemplate(
        `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>`
      );
    }
  });

  // node_modules/lit-html/lit-html.js
  function P(t5, i4) {
    if (!Array.isArray(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e2 ? e2.createHTML(i4) : i4;
  }
  function S(t5, i4, s4 = t5, e6) {
    var o6, n5, l6, h4;
    if (i4 === T) return i4;
    let r4 = void 0 !== e6 ? null === (o6 = s4._$Co) || void 0 === o6 ? void 0 : o6[e6] : s4._$Cl;
    const u2 = d(i4) ? void 0 : i4._$litDirective$;
    return (null == r4 ? void 0 : r4.constructor) !== u2 && (null === (n5 = null == r4 ? void 0 : r4._$AO) || void 0 === n5 || n5.call(r4, false), void 0 === u2 ? r4 = void 0 : (r4 = new u2(t5), r4._$AT(t5, s4, e6)), void 0 !== e6 ? (null !== (l6 = (h4 = s4)._$Co) && void 0 !== l6 ? l6 : h4._$Co = [])[e6] = r4 : s4._$Cl = r4), void 0 !== r4 && (i4 = S(t5, r4._$AS(t5, i4.values), r4, e6)), i4;
  }
  var t2, i, s, e2, o2, n2, l2, h, r2, u, d, c, v, a, f, _, m, p, g, $, y, w, x, b, T, A, E, C, V, N, M, R, k, H, I, L, z, Z, j, B, D;
  var init_lit_html = __esm({
    "node_modules/lit-html/lit-html.js"() {
      i = window;
      s = i.trustedTypes;
      e2 = s ? s.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
      o2 = "$lit$";
      n2 = `lit$${(Math.random() + "").slice(9)}$`;
      l2 = "?" + n2;
      h = `<${l2}>`;
      r2 = document;
      u = () => r2.createComment("");
      d = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
      c = Array.isArray;
      v = (t5) => c(t5) || "function" == typeof (null == t5 ? void 0 : t5[Symbol.iterator]);
      a = "[ 	\n\f\r]";
      f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
      _ = /-->/g;
      m = />/g;
      p = RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
      g = /'/g;
      $ = /"/g;
      y = /^(?:script|style|textarea|title)$/i;
      w = (t5) => (i4, ...s4) => ({ _$litType$: t5, strings: i4, values: s4 });
      x = w(1);
      b = w(2);
      T = Symbol.for("lit-noChange");
      A = Symbol.for("lit-nothing");
      E = /* @__PURE__ */ new WeakMap();
      C = r2.createTreeWalker(r2, 129, null, false);
      V = (t5, i4) => {
        const s4 = t5.length - 1, e6 = [];
        let l6, r4 = 2 === i4 ? "<svg>" : "", u2 = f;
        for (let i5 = 0; i5 < s4; i5++) {
          const s5 = t5[i5];
          let d2, c3, v2 = -1, a3 = 0;
          for (; a3 < s5.length && (u2.lastIndex = a3, c3 = u2.exec(s5), null !== c3); ) a3 = u2.lastIndex, u2 === f ? "!--" === c3[1] ? u2 = _ : void 0 !== c3[1] ? u2 = m : void 0 !== c3[2] ? (y.test(c3[2]) && (l6 = RegExp("</" + c3[2], "g")), u2 = p) : void 0 !== c3[3] && (u2 = p) : u2 === p ? ">" === c3[0] ? (u2 = null != l6 ? l6 : f, v2 = -1) : void 0 === c3[1] ? v2 = -2 : (v2 = u2.lastIndex - c3[2].length, d2 = c3[1], u2 = void 0 === c3[3] ? p : '"' === c3[3] ? $ : g) : u2 === $ || u2 === g ? u2 = p : u2 === _ || u2 === m ? u2 = f : (u2 = p, l6 = void 0);
          const w2 = u2 === p && t5[i5 + 1].startsWith("/>") ? " " : "";
          r4 += u2 === f ? s5 + h : v2 >= 0 ? (e6.push(d2), s5.slice(0, v2) + o2 + s5.slice(v2) + n2 + w2) : s5 + n2 + (-2 === v2 ? (e6.push(void 0), i5) : w2);
        }
        return [P(t5, r4 + (t5[s4] || "<?>") + (2 === i4 ? "</svg>" : "")), e6];
      };
      N = class _N {
        constructor({ strings: t5, _$litType$: i4 }, e6) {
          let h4;
          this.parts = [];
          let r4 = 0, d2 = 0;
          const c3 = t5.length - 1, v2 = this.parts, [a3, f2] = V(t5, i4);
          if (this.el = _N.createElement(a3, e6), C.currentNode = this.el.content, 2 === i4) {
            const t6 = this.el.content, i5 = t6.firstChild;
            i5.remove(), t6.append(...i5.childNodes);
          }
          for (; null !== (h4 = C.nextNode()) && v2.length < c3; ) {
            if (1 === h4.nodeType) {
              if (h4.hasAttributes()) {
                const t6 = [];
                for (const i5 of h4.getAttributeNames()) if (i5.endsWith(o2) || i5.startsWith(n2)) {
                  const s4 = f2[d2++];
                  if (t6.push(i5), void 0 !== s4) {
                    const t7 = h4.getAttribute(s4.toLowerCase() + o2).split(n2), i6 = /([.?@])?(.*)/.exec(s4);
                    v2.push({ type: 1, index: r4, name: i6[2], strings: t7, ctor: "." === i6[1] ? H : "?" === i6[1] ? L : "@" === i6[1] ? z : k });
                  } else v2.push({ type: 6, index: r4 });
                }
                for (const i5 of t6) h4.removeAttribute(i5);
              }
              if (y.test(h4.tagName)) {
                const t6 = h4.textContent.split(n2), i5 = t6.length - 1;
                if (i5 > 0) {
                  h4.textContent = s ? s.emptyScript : "";
                  for (let s4 = 0; s4 < i5; s4++) h4.append(t6[s4], u()), C.nextNode(), v2.push({ type: 2, index: ++r4 });
                  h4.append(t6[i5], u());
                }
              }
            } else if (8 === h4.nodeType) if (h4.data === l2) v2.push({ type: 2, index: r4 });
            else {
              let t6 = -1;
              for (; -1 !== (t6 = h4.data.indexOf(n2, t6 + 1)); ) v2.push({ type: 7, index: r4 }), t6 += n2.length - 1;
            }
            r4++;
          }
        }
        static createElement(t5, i4) {
          const s4 = r2.createElement("template");
          return s4.innerHTML = t5, s4;
        }
      };
      M = class {
        constructor(t5, i4) {
          this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i4;
        }
        get parentNode() {
          return this._$AM.parentNode;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        u(t5) {
          var i4;
          const { el: { content: s4 }, parts: e6 } = this._$AD, o6 = (null !== (i4 = null == t5 ? void 0 : t5.creationScope) && void 0 !== i4 ? i4 : r2).importNode(s4, true);
          C.currentNode = o6;
          let n5 = C.nextNode(), l6 = 0, h4 = 0, u2 = e6[0];
          for (; void 0 !== u2; ) {
            if (l6 === u2.index) {
              let i5;
              2 === u2.type ? i5 = new R(n5, n5.nextSibling, this, t5) : 1 === u2.type ? i5 = new u2.ctor(n5, u2.name, u2.strings, this, t5) : 6 === u2.type && (i5 = new Z(n5, this, t5)), this._$AV.push(i5), u2 = e6[++h4];
            }
            l6 !== (null == u2 ? void 0 : u2.index) && (n5 = C.nextNode(), l6++);
          }
          return C.currentNode = r2, o6;
        }
        v(t5) {
          let i4 = 0;
          for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i4), i4 += s4.strings.length - 2) : s4._$AI(t5[i4])), i4++;
        }
      };
      R = class _R {
        constructor(t5, i4, s4, e6) {
          var o6;
          this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i4, this._$AM = s4, this.options = e6, this._$Cp = null === (o6 = null == e6 ? void 0 : e6.isConnected) || void 0 === o6 || o6;
        }
        get _$AU() {
          var t5, i4;
          return null !== (i4 = null === (t5 = this._$AM) || void 0 === t5 ? void 0 : t5._$AU) && void 0 !== i4 ? i4 : this._$Cp;
        }
        get parentNode() {
          let t5 = this._$AA.parentNode;
          const i4 = this._$AM;
          return void 0 !== i4 && 11 === (null == t5 ? void 0 : t5.nodeType) && (t5 = i4.parentNode), t5;
        }
        get startNode() {
          return this._$AA;
        }
        get endNode() {
          return this._$AB;
        }
        _$AI(t5, i4 = this) {
          t5 = S(this, t5, i4), d(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== T && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : v(t5) ? this.T(t5) : this._(t5);
        }
        k(t5) {
          return this._$AA.parentNode.insertBefore(t5, this._$AB);
        }
        $(t5) {
          this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
        }
        _(t5) {
          this._$AH !== A && d(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r2.createTextNode(t5)), this._$AH = t5;
        }
        g(t5) {
          var i4;
          const { values: s4, _$litType$: e6 } = t5, o6 = "number" == typeof e6 ? this._$AC(t5) : (void 0 === e6.el && (e6.el = N.createElement(P(e6.h, e6.h[0]), this.options)), e6);
          if ((null === (i4 = this._$AH) || void 0 === i4 ? void 0 : i4._$AD) === o6) this._$AH.v(s4);
          else {
            const t6 = new M(o6, this), i5 = t6.u(this.options);
            t6.v(s4), this.$(i5), this._$AH = t6;
          }
        }
        _$AC(t5) {
          let i4 = E.get(t5.strings);
          return void 0 === i4 && E.set(t5.strings, i4 = new N(t5)), i4;
        }
        T(t5) {
          c(this._$AH) || (this._$AH = [], this._$AR());
          const i4 = this._$AH;
          let s4, e6 = 0;
          for (const o6 of t5) e6 === i4.length ? i4.push(s4 = new _R(this.k(u()), this.k(u()), this, this.options)) : s4 = i4[e6], s4._$AI(o6), e6++;
          e6 < i4.length && (this._$AR(s4 && s4._$AB.nextSibling, e6), i4.length = e6);
        }
        _$AR(t5 = this._$AA.nextSibling, i4) {
          var s4;
          for (null === (s4 = this._$AP) || void 0 === s4 || s4.call(this, false, true, i4); t5 && t5 !== this._$AB; ) {
            const i5 = t5.nextSibling;
            t5.remove(), t5 = i5;
          }
        }
        setConnected(t5) {
          var i4;
          void 0 === this._$AM && (this._$Cp = t5, null === (i4 = this._$AP) || void 0 === i4 || i4.call(this, t5));
        }
      };
      k = class {
        constructor(t5, i4, s4, e6, o6) {
          this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i4, this._$AM = e6, this.options = o6, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
        }
        get tagName() {
          return this.element.tagName;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(t5, i4 = this, s4, e6) {
          const o6 = this.strings;
          let n5 = false;
          if (void 0 === o6) t5 = S(this, t5, i4, 0), n5 = !d(t5) || t5 !== this._$AH && t5 !== T, n5 && (this._$AH = t5);
          else {
            const e7 = t5;
            let l6, h4;
            for (t5 = o6[0], l6 = 0; l6 < o6.length - 1; l6++) h4 = S(this, e7[s4 + l6], i4, l6), h4 === T && (h4 = this._$AH[l6]), n5 || (n5 = !d(h4) || h4 !== this._$AH[l6]), h4 === A ? t5 = A : t5 !== A && (t5 += (null != h4 ? h4 : "") + o6[l6 + 1]), this._$AH[l6] = h4;
          }
          n5 && !e6 && this.j(t5);
        }
        j(t5) {
          t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t5 ? t5 : "");
        }
      };
      H = class extends k {
        constructor() {
          super(...arguments), this.type = 3;
        }
        j(t5) {
          this.element[this.name] = t5 === A ? void 0 : t5;
        }
      };
      I = s ? s.emptyScript : "";
      L = class extends k {
        constructor() {
          super(...arguments), this.type = 4;
        }
        j(t5) {
          t5 && t5 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
        }
      };
      z = class extends k {
        constructor(t5, i4, s4, e6, o6) {
          super(t5, i4, s4, e6, o6), this.type = 5;
        }
        _$AI(t5, i4 = this) {
          var s4;
          if ((t5 = null !== (s4 = S(this, t5, i4, 0)) && void 0 !== s4 ? s4 : A) === T) return;
          const e6 = this._$AH, o6 = t5 === A && e6 !== A || t5.capture !== e6.capture || t5.once !== e6.once || t5.passive !== e6.passive, n5 = t5 !== A && (e6 === A || o6);
          o6 && this.element.removeEventListener(this.name, this, e6), n5 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
        }
        handleEvent(t5) {
          var i4, s4;
          "function" == typeof this._$AH ? this._$AH.call(null !== (s4 = null === (i4 = this.options) || void 0 === i4 ? void 0 : i4.host) && void 0 !== s4 ? s4 : this.element, t5) : this._$AH.handleEvent(t5);
        }
      };
      Z = class {
        constructor(t5, i4, s4) {
          this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s4;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(t5) {
          S(this, t5);
        }
      };
      j = { O: o2, P: n2, A: l2, C: 1, M: V, L: M, R: v, D: S, I: R, V: k, H: L, N: z, U: H, F: Z };
      B = i.litHtmlPolyfillSupport;
      null == B || B(N, R), (null !== (t2 = i.litHtmlVersions) && void 0 !== t2 ? t2 : i.litHtmlVersions = []).push("2.8.0");
      D = (t5, i4, s4) => {
        var e6, o6;
        const n5 = null !== (e6 = null == s4 ? void 0 : s4.renderBefore) && void 0 !== e6 ? e6 : i4;
        let l6 = n5._$litPart$;
        if (void 0 === l6) {
          const t6 = null !== (o6 = null == s4 ? void 0 : s4.renderBefore) && void 0 !== o6 ? o6 : null;
          n5._$litPart$ = l6 = new R(i4.insertBefore(u(), t6), t6, void 0, null != s4 ? s4 : {});
        }
        return l6._$AI(t5), l6;
      };
    }
  });

  // node_modules/lit-html/directives/if-defined.js
  var l3;
  var init_if_defined = __esm({
    "node_modules/lit-html/directives/if-defined.js"() {
      init_lit_html();
      l3 = (l6) => null != l6 ? l6 : A;
    }
  });

  // node_modules/lit-html/directive.js
  var t3, e3, i2;
  var init_directive = __esm({
    "node_modules/lit-html/directive.js"() {
      t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
      e3 = (t5) => (...e6) => ({ _$litDirective$: t5, values: e6 });
      i2 = class {
        constructor(t5) {
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AT(t5, e6, i4) {
          this._$Ct = t5, this._$AM = e6, this._$Ci = i4;
        }
        _$AS(t5, e6) {
          return this.update(t5, e6);
        }
        update(t5, e6) {
          return this.render(...e6);
        }
      };
    }
  });

  // node_modules/lit-html/directives/unsafe-html.js
  var e4, o3;
  var init_unsafe_html = __esm({
    "node_modules/lit-html/directives/unsafe-html.js"() {
      init_lit_html();
      init_directive();
      e4 = class extends i2 {
        constructor(i4) {
          if (super(i4), this.et = A, i4.type !== t3.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
        }
        render(r4) {
          if (r4 === A || null == r4) return this.ft = void 0, this.et = r4;
          if (r4 === T) return r4;
          if ("string" != typeof r4) throw Error(this.constructor.directiveName + "() called with a non-string value");
          if (r4 === this.et) return this.ft;
          this.et = r4;
          const s4 = [r4];
          return s4.raw = s4, this.ft = { _$litType$: this.constructor.resultType, strings: s4, values: [] };
        }
      };
      e4.directiveName = "unsafeHTML", e4.resultType = 1;
      o3 = e3(e4);
    }
  });

  // node_modules/lit-html/directives/unsafe-svg.js
  var t4, o4;
  var init_unsafe_svg = __esm({
    "node_modules/lit-html/directives/unsafe-svg.js"() {
      init_directive();
      init_unsafe_html();
      t4 = class extends e4 {
      };
      t4.directiveName = "unsafeSVG", t4.resultType = 2;
      o4 = e3(t4);
    }
  });

  // node_modules/lit-html/directive-helpers.js
  var l4, e5, s2, a2;
  var init_directive_helpers = __esm({
    "node_modules/lit-html/directive-helpers.js"() {
      init_lit_html();
      ({ I: l4 } = j);
      e5 = (o6) => void 0 === o6.strings;
      s2 = {};
      a2 = (o6, l6 = s2) => o6._$AH = l6;
    }
  });

  // node_modules/lit-html/async-directive.js
  function n3(i4) {
    void 0 !== this._$AN ? (o5(this), this._$AM = i4, r3(this)) : this._$AM = i4;
  }
  function h2(i4, t5 = false, e6 = 0) {
    const r4 = this._$AH, n5 = this._$AN;
    if (void 0 !== n5 && 0 !== n5.size) if (t5) if (Array.isArray(r4)) for (let i5 = e6; i5 < r4.length; i5++) s3(r4[i5], false), o5(r4[i5]);
    else null != r4 && (s3(r4, false), o5(r4));
    else s3(this, i4);
  }
  var s3, o5, r3, l5, c2;
  var init_async_directive = __esm({
    "node_modules/lit-html/async-directive.js"() {
      init_directive_helpers();
      init_directive();
      init_directive();
      s3 = (i4, t5) => {
        var e6, o6;
        const r4 = i4._$AN;
        if (void 0 === r4) return false;
        for (const i5 of r4) null === (o6 = (e6 = i5)._$AO) || void 0 === o6 || o6.call(e6, t5, false), s3(i5, t5);
        return true;
      };
      o5 = (i4) => {
        let t5, e6;
        do {
          if (void 0 === (t5 = i4._$AM)) break;
          e6 = t5._$AN, e6.delete(i4), i4 = t5;
        } while (0 === (null == e6 ? void 0 : e6.size));
      };
      r3 = (i4) => {
        for (let t5; t5 = i4._$AM; i4 = t5) {
          let e6 = t5._$AN;
          if (void 0 === e6) t5._$AN = e6 = /* @__PURE__ */ new Set();
          else if (e6.has(i4)) break;
          e6.add(i4), l5(t5);
        }
      };
      l5 = (i4) => {
        var t5, s4, o6, r4;
        i4.type == t3.CHILD && (null !== (t5 = (o6 = i4)._$AP) && void 0 !== t5 || (o6._$AP = h2), null !== (s4 = (r4 = i4)._$AQ) && void 0 !== s4 || (r4._$AQ = n3));
      };
      c2 = class extends i2 {
        constructor() {
          super(...arguments), this._$AN = void 0;
        }
        _$AT(i4, t5, e6) {
          super._$AT(i4, t5, e6), r3(this), this.isConnected = i4._$AU;
        }
        _$AO(i4, t5 = true) {
          var e6, r4;
          i4 !== this.isConnected && (this.isConnected = i4, i4 ? null === (e6 = this.reconnected) || void 0 === e6 || e6.call(this) : null === (r4 = this.disconnected) || void 0 === r4 || r4.call(this)), t5 && (s3(this, i4), o5(this));
        }
        setValue(t5) {
          if (e5(this._$Ct)) this._$Ct._$AI(t5, this);
          else {
            const i4 = [...this._$Ct._$AH];
            i4[this._$Ci] = t5, this._$Ct._$AI(i4, this, 0);
          }
        }
        disconnected() {
        }
        reconnected() {
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-7xep0lg7.js
  function $signal(compute2) {
    return e3(SignalDirective)(computed(compute2));
  }
  function Icon({ name, class: _class, state, paths, viewBox = "0 0 32 32" }) {
    return x`<svg
    class="${"vds-icon" + (_class ? ` ${_class}` : "")}"
    viewBox="${viewBox}"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${l3(name ?? state)}
  >
    ${!isString(paths) ? $signal(paths) : o4(paths)}
  </svg>`;
  }
  var SignalDirective, SlotObserver, id, slotIdAttr, SlotManager, IconsLoader, LayoutIconsLoader;
  var init_vidstack_7xep0lg7 = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-7xep0lg7.js"() {
      init_vidstack_CRlI3Mh7();
      init_lit_html();
      init_if_defined();
      init_unsafe_svg();
      init_async_directive();
      init_vidstack_Cpte_fRf();
      SignalDirective = class extends c2 {
        #signal = null;
        #isAttr = false;
        #stop = null;
        constructor(part) {
          super(part);
          this.#isAttr = part.type === t3.ATTRIBUTE || part.type === t3.BOOLEAN_ATTRIBUTE;
        }
        render(signal2) {
          if (signal2 !== this.#signal) {
            this.disconnected();
            this.#signal = signal2;
            if (this.isConnected) this.#watch();
          }
          return this.#signal ? this.#resolveValue(peek(this.#signal)) : A;
        }
        reconnected() {
          this.#watch();
        }
        disconnected() {
          this.#stop?.();
          this.#stop = null;
        }
        #watch() {
          if (!this.#signal) return;
          this.#stop = effect(this.#onValueChange.bind(this));
        }
        #resolveValue(value) {
          return this.#isAttr ? l3(value) : value;
        }
        #setValue(value) {
          this.setValue(this.#resolveValue(value));
        }
        #onValueChange() {
          {
            this.#setValue(this.#signal?.());
          }
        }
      };
      SlotObserver = class {
        #roots;
        #callback;
        elements = /* @__PURE__ */ new Set();
        constructor(roots, callback) {
          this.#roots = roots;
          this.#callback = callback;
        }
        connect() {
          this.#update();
          const observer = new MutationObserver(this.#onMutation);
          for (const root2 of this.#roots) observer.observe(root2, { childList: true, subtree: true });
          onDispose(() => observer.disconnect());
          onDispose(this.disconnect.bind(this));
        }
        disconnect() {
          this.elements.clear();
        }
        assign(template, slot) {
          if (isDOMNode(template)) {
            slot.textContent = "";
            slot.append(template);
          } else {
            D(null, slot);
            D(template, slot);
          }
          if (!slot.style.display) {
            slot.style.display = "contents";
          }
          const el = slot.firstElementChild;
          if (!el) return;
          const classList = slot.getAttribute("data-class");
          if (classList) el.classList.add(...classList.split(" "));
        }
        #onMutation = animationFrameThrottle(this.#update.bind(this));
        #update(entries) {
          if (entries && !entries.some((e6) => e6.addedNodes.length)) return;
          let changed = false, slots = this.#roots.flatMap((root2) => [...root2.querySelectorAll("slot")]);
          for (const slot of slots) {
            if (!slot.hasAttribute("name") || this.elements.has(slot)) continue;
            this.elements.add(slot);
            changed = true;
          }
          if (changed) this.#callback(this.elements);
        }
      };
      id = 0;
      slotIdAttr = "data-slot-id";
      SlotManager = class {
        #roots;
        slots;
        constructor(roots) {
          this.#roots = roots;
          this.slots = new SlotObserver(roots, this.#update.bind(this));
        }
        connect() {
          this.slots.connect();
          this.#update();
          const mutations = new MutationObserver(this.#onMutation);
          for (const root2 of this.#roots) mutations.observe(root2, { childList: true });
          onDispose(() => mutations.disconnect());
        }
        #onMutation = animationFrameThrottle(this.#update.bind(this));
        #update() {
          for (const root2 of this.#roots) {
            for (const node of root2.children) {
              if (node.nodeType !== 1) continue;
              const name = node.getAttribute("slot");
              if (!name) continue;
              node.style.display = "none";
              let slotId = node.getAttribute(slotIdAttr);
              if (!slotId) {
                node.setAttribute(slotIdAttr, slotId = ++id + "");
              }
              for (const slot of this.slots.elements) {
                if (slot.getAttribute("name") !== name || slot.getAttribute(slotIdAttr) === slotId) {
                  continue;
                }
                const clone = document.importNode(node, true);
                if (name.includes("-icon")) clone.classList.add("vds-icon");
                clone.style.display = "";
                clone.removeAttribute("slot");
                this.slots.assign(clone, slot);
                slot.setAttribute(slotIdAttr, slotId);
              }
            }
          }
        }
      };
      IconsLoader = class {
        #icons = {};
        #loaded = false;
        slots;
        constructor(roots) {
          this.slots = new SlotObserver(roots, this.#insertIcons.bind(this));
        }
        connect() {
          this.slots.connect();
        }
        load() {
          this.loadIcons().then((icons2) => {
            this.#icons = icons2;
            this.#loaded = true;
            this.#insertIcons();
          });
        }
        *#iterate() {
          for (const iconName of Object.keys(this.#icons)) {
            const slotName = `${iconName}-icon`;
            for (const slot of this.slots.elements) {
              if (slot.name !== slotName) continue;
              yield { icon: this.#icons[iconName], slot };
            }
          }
        }
        #insertIcons() {
          if (!this.#loaded) return;
          for (const { icon, slot } of this.#iterate()) {
            this.slots.assign(icon, slot);
          }
        }
      };
      LayoutIconsLoader = class extends IconsLoader {
        connect() {
          super.connect();
          const { player } = useMediaContext();
          if (!player.el) return;
          let dispose2, observer = new IntersectionObserver((entries) => {
            if (!entries[0]?.isIntersecting) return;
            dispose2?.();
            dispose2 = void 0;
            this.load();
          });
          observer.observe(player.el);
          dispose2 = onDispose(() => observer.disconnect());
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-BOTZD4tC.js
  function sortVideoQualities(qualities, desc) {
    return [...qualities].sort(desc ? compareVideoQualityDesc : compareVideoQualityAsc);
  }
  function compareVideoQualityAsc(a3, b2) {
    return a3.height === b2.height ? (a3.bitrate ?? 0) - (b2.bitrate ?? 0) : a3.height - b2.height;
  }
  function compareVideoQualityDesc(a3, b2) {
    return b2.height === a3.height ? (b2.bitrate ?? 0) - (a3.bitrate ?? 0) : b2.height - a3.height;
  }
  function ariaBool2(value) {
    return value ? "true" : "false";
  }
  function $ariaBool(signal2) {
    return () => ariaBool2(signal2());
  }
  var init_vidstack_BOTZD4tC = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-BOTZD4tC.js"() {
    }
  });

  // node_modules/lit-html/directives/ref.js
  var h3, n4;
  var init_ref = __esm({
    "node_modules/lit-html/directives/ref.js"() {
      init_lit_html();
      init_async_directive();
      init_directive();
      h3 = /* @__PURE__ */ new WeakMap();
      n4 = e3(class extends c2 {
        render(t5) {
          return A;
        }
        update(t5, [s4]) {
          var e6;
          const o6 = s4 !== this.G;
          return o6 && void 0 !== this.G && this.ot(void 0), (o6 || this.rt !== this.lt) && (this.G = s4, this.dt = null === (e6 = t5.options) || void 0 === e6 ? void 0 : e6.host, this.ot(this.lt = t5.element)), A;
        }
        ot(i4) {
          var t5;
          if ("function" == typeof this.G) {
            const s4 = null !== (t5 = this.dt) && void 0 !== t5 ? t5 : globalThis;
            let e6 = h3.get(s4);
            void 0 === e6 && (e6 = /* @__PURE__ */ new WeakMap(), h3.set(s4, e6)), void 0 !== e6.get(this.G) && this.G.call(this.dt, void 0), e6.set(this.G, i4), void 0 !== i4 && this.G.call(this.dt, i4);
          } else this.G.value = i4;
        }
        get rt() {
          var i4, t5, s4;
          return "function" == typeof this.G ? null === (t5 = h3.get(null !== (i4 = this.dt) && void 0 !== i4 ? i4 : globalThis)) || void 0 === t5 ? void 0 : t5.get(this.G) : null === (s4 = this.G) || void 0 === s4 ? void 0 : s4.value;
        }
        disconnected() {
          this.rt === this.lt && this.ot(void 0);
        }
        reconnected() {
          this.ot(this.lt);
        }
      });
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-H72EDyqs.js
  var vidstack_H72EDyqs_exports = {};
  __export(vidstack_H72EDyqs_exports, {
    icons: () => icons
  });
  var icons;
  var init_vidstack_H72EDyqs = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-H72EDyqs.js"() {
      init_vidstack_CRlI3Mh7();
      icons = {
        airplay: Icon$5,
        download: Icon$31,
        play: Icon$62,
        pause: Icon$59,
        replay: Icon$74,
        mute: Icon$54,
        "google-cast": Icon$24,
        "volume-low": Icon$105,
        "volume-high": Icon$104,
        "cc-on": Icon$26,
        "cc-off": Icon$27,
        "pip-enter": Icon$61,
        "pip-exit": Icon$60,
        "fs-enter": Icon$40,
        "fs-exit": Icon$39,
        "seek-forward": Icon$81,
        "seek-backward": Icon$77,
        "menu-chapters": Icon$16,
        "menu-settings": Icon$88,
        "menu-arrow-left": Icon$11,
        "menu-arrow-right": Icon$22,
        "menu-accessibility": Icon$0,
        "menu-audio": Icon$53,
        "menu-audio-boost-up": Icon$104,
        "menu-audio-boost-down": Icon$105,
        "menu-playback": Icon$63,
        "menu-speed-up": Icon$35,
        "menu-speed-down": Icon$34,
        "menu-captions": Icon$27,
        "menu-quality-up": Icon$13,
        "menu-quality-down": Icon$8,
        "menu-radio-check": Icon$19,
        "menu-font-size-up": Icon$13,
        "menu-font-size-down": Icon$8,
        "menu-opacity-up": Icon$33,
        "menu-opacity-down": Icon$56,
        "kb-play": Icon$62,
        "kb-pause": Icon$59,
        "kb-mute": Icon$54,
        "kb-volume-up": Icon$104,
        "kb-volume-down": Icon$105,
        "kb-fs-enter": Icon$40,
        "kb-fs-exit": Icon$39,
        "kb-pip-enter": Icon$61,
        "kb-pip-exit": Icon$60,
        "kb-cc-on": Icon$26,
        "kb-cc-off": Icon$27,
        "kb-seek-forward": Icon$35,
        "kb-seek-backward": Icon$34
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-C3gk-MR_.js
  function useDefaultLayoutContext() {
    return useContext(defaultLayoutContext);
  }
  function setLayoutName(name, isMatch) {
    effect(() => {
      const { player } = useMediaContext(), el = player.el;
      el && setAttribute(el, "data-layout", isMatch() && name);
      return () => el?.removeAttribute("data-layout");
    });
  }
  function i18n(translations, word) {
    return translations()?.[word] ?? word;
  }
  function DefaultAnnouncer() {
    return $signal(() => {
      const { translations, userPrefersAnnouncements } = useDefaultLayoutContext();
      if (!userPrefersAnnouncements()) return null;
      return x`<media-announcer .translations=${$signal(translations)}></media-announcer>`;
    });
  }
  function IconSlot(name, classes = "") {
    return x`<slot
    name=${`${name}-icon`}
    data-class=${`vds-icon vds-${name}-icon${classes ? ` ${classes}` : ""}`}
  ></slot>`;
  }
  function IconSlots(names) {
    return names.map((name) => IconSlot(name));
  }
  function $i18n(translations, word) {
    return $signal(() => i18n(translations, word));
  }
  function DefaultAirPlayButton({ tooltip }) {
    const { translations } = useDefaultLayoutContext(), { remotePlaybackState } = useMediaState(), $label = $signal(() => {
      const airPlayText = i18n(translations, "AirPlay"), stateText = uppercaseFirstChar(remotePlaybackState());
      return `${airPlayText} ${stateText}`;
    }), $airPlayText = $i18n(translations, "AirPlay");
    return x`
    <media-tooltip class="vds-airplay-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-airplay-button class="vds-airplay-button vds-button" aria-label=${$label}>
          ${IconSlot("airplay")}
        </media-airplay-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-airplay-tooltip-text">${$airPlayText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultGoogleCastButton({ tooltip }) {
    const { translations } = useDefaultLayoutContext(), { remotePlaybackState } = useMediaState(), $label = $signal(() => {
      const googleCastText = i18n(translations, "Google Cast"), stateText = uppercaseFirstChar(remotePlaybackState());
      return `${googleCastText} ${stateText}`;
    }), $googleCastText = $i18n(translations, "Google Cast");
    return x`
    <media-tooltip class="vds-google-cast-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-google-cast-button class="vds-google-cast-button vds-button" aria-label=${$label}>
          ${IconSlot("google-cast")}
        </media-google-cast-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-google-cast-tooltip-text">${$googleCastText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultPlayButton({ tooltip }) {
    const { translations } = useDefaultLayoutContext(), $playText = $i18n(translations, "Play"), $pauseText = $i18n(translations, "Pause");
    return x`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button
          class="vds-play-button vds-button"
          aria-label=${$i18n(translations, "Play")}
        >
          ${IconSlots(["play", "pause", "replay"])}
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-play-tooltip-text">${$playText}</span>
        <span class="vds-pause-tooltip-text">${$pauseText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultMuteButton({
    tooltip,
    ref: ref$1 = noop
  }) {
    const { translations } = useDefaultLayoutContext(), $muteText = $i18n(translations, "Mute"), $unmuteText = $i18n(translations, "Unmute");
    return x`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button
          class="vds-mute-button vds-button"
          aria-label=${$i18n(translations, "Mute")}
          ${n4(ref$1)}
        >
          ${IconSlots(["mute", "volume-low", "volume-high"])}
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-mute-tooltip-text">${$unmuteText}</span>
        <span class="vds-unmute-tooltip-text">${$muteText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultCaptionButton({ tooltip }) {
    const { translations } = useDefaultLayoutContext(), $ccOnText = $i18n(translations, "Closed-Captions On"), $ccOffText = $i18n(translations, "Closed-Captions Off");
    return x`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button
          class="vds-caption-button vds-button"
          aria-label=${$i18n(translations, "Captions")}
        >
          ${IconSlots(["cc-on", "cc-off"])}
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-cc-on-tooltip-text">${$ccOffText}</span>
        <span class="vds-cc-off-tooltip-text">${$ccOnText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultPIPButton() {
    const { translations } = useDefaultLayoutContext(), $enterText = $i18n(translations, "Enter PiP"), $exitText = $i18n(translations, "Exit PiP");
    return x`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button
          class="vds-pip-button vds-button"
          aria-label=${$i18n(translations, "PiP")}
        >
          ${IconSlots(["pip-enter", "pip-exit"])}
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${$enterText}</span>
        <span class="vds-pip-exit-tooltip-text">${$exitText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultFullscreenButton({ tooltip }) {
    const { translations } = useDefaultLayoutContext(), $enterText = $i18n(translations, "Enter Fullscreen"), $exitText = $i18n(translations, "Exit Fullscreen");
    return x`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button
          class="vds-fullscreen-button vds-button"
          aria-label=${$i18n(translations, "Fullscreen")}
        >
          ${IconSlots(["fs-enter", "fs-exit"])}
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-fs-enter-tooltip-text">${$enterText}</span>
        <span class="vds-fs-exit-tooltip-text">${$exitText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultSeekButton({
    backward,
    tooltip
  }) {
    const { translations, seekStep } = useDefaultLayoutContext(), seekText = !backward ? "Seek Forward" : "Seek Backward", $label = $i18n(translations, seekText), $seconds = () => (backward ? -1 : 1) * seekStep();
    return x`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${$signal($seconds)}
          aria-label=${$label}
        >
          ${!backward ? IconSlot("seek-forward") : IconSlot("seek-backward")}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        ${$i18n(translations, seekText)}
      </media-tooltip-content>
    </media-tooltip>
  `;
  }
  function DefaultLiveButton() {
    const { translations } = useDefaultLayoutContext(), { live } = useMediaState(), $label = $i18n(translations, "Skip To Live"), $liveText = $i18n(translations, "LIVE");
    return live() ? x`
        <media-live-button class="vds-live-button" aria-label=${$label}>
          <span class="vds-live-button-text">${$liveText}</span>
        </media-live-button>
      ` : null;
  }
  function DefaultDownloadButton() {
    return $signal(() => {
      const { download, translations } = useDefaultLayoutContext(), $download = download();
      if (isNil($download)) return null;
      const { source, title } = useMediaState(), $src = source(), file = getDownloadFile({
        title: title(),
        src: $src,
        download: $download
      });
      return isString(file?.url) ? x`
          <media-tooltip class="vds-download-tooltip vds-tooltip">
            <media-tooltip-trigger>
              <a
                role="button"
                class="vds-download-button vds-button"
                aria-label=${$i18n(translations, "Download")}
                href=${appendParamsToURL(file.url, { download: file.name })}
                download=${file.name}
                target="_blank"
              >
                <slot name="download-icon" data-class="vds-icon" />
              </a>
            </media-tooltip-trigger>
            <media-tooltip-content class="vds-tooltip-content" placement="top">
              ${$i18n(translations, "Download")}
            </media-tooltip-content>
          </media-tooltip>
        ` : null;
    });
  }
  function DefaultCaptions() {
    const { translations } = useDefaultLayoutContext();
    return x`
    <media-captions
      class="vds-captions"
      .exampleText=${$i18n(translations, "Captions look like this")}
    ></media-captions>
  `;
  }
  function DefaultControlsSpacer() {
    return x`<div class="vds-controls-spacer"></div>`;
  }
  function MenuPortal(container, template) {
    return x`
    <media-menu-portal .container=${$signal(container)} disabled="fullscreen">
      ${template}
    </media-menu-portal>
  `;
  }
  function createMenuContainer(layoutEl, rootSelector, className, isSmallLayout) {
    let root2 = isString(rootSelector) ? document.querySelector(rootSelector) : rootSelector;
    if (!root2) root2 = layoutEl?.closest("dialog");
    if (!root2) root2 = document.body;
    const container = document.createElement("div");
    container.style.display = "contents";
    container.classList.add(className);
    root2.append(container);
    effect(() => {
      if (!container) return;
      const { viewType } = useMediaState(), isSmall = isSmallLayout();
      setAttribute(container, "data-view-type", viewType());
      setAttribute(container, "data-sm", isSmall);
      setAttribute(container, "data-lg", !isSmall);
      setAttribute(container, "data-size", isSmall ? "sm" : "lg");
    });
    const { colorScheme } = useDefaultLayoutContext();
    watchColorScheme(container, colorScheme);
    return container;
  }
  function DefaultChaptersMenu({
    placement,
    tooltip,
    portal
  }) {
    const { textTracks } = useMediaContext(), { viewType, seekableStart, seekableEnd } = useMediaState(), {
      translations,
      thumbnails,
      menuPortal,
      noModal,
      menuGroup,
      smallWhen: smWhen
    } = useDefaultLayoutContext(), $disabled = computed(() => {
      const $startTime = seekableStart(), $endTime = seekableEnd(), $track = signal(null);
      watchActiveTextTrack(textTracks, "chapters", $track.set);
      const cues = $track()?.cues.filter(
        (cue) => cue.startTime <= $endTime && cue.endTime >= $startTime
      );
      return !cues?.length;
    });
    if ($disabled()) return null;
    const $placement = computed(
      () => noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null
    ), $offset = computed(
      () => !smWhen() && menuGroup() === "bottom" && viewType() === "video" ? 26 : 0
    ), $isOpen = signal(false);
    function onOpen() {
      $isOpen.set(true);
    }
    function onClose() {
      $isOpen.set(false);
    }
    const items = x`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      ${$signal(() => {
      if (!$isOpen()) return null;
      return x`
          <media-chapters-radio-group
            class="vds-chapters-radio-group vds-radio-group"
            .thumbnails=${$signal(thumbnails)}
          >
            <template>
              <media-radio class="vds-chapter-radio vds-radio">
                <media-thumbnail class="vds-thumbnail"></media-thumbnail>
                <div class="vds-chapter-radio-content">
                  <span class="vds-chapter-radio-label" data-part="label"></span>
                  <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
                  <span class="vds-chapter-radio-duration" data-part="duration"></span>
                </div>
              </media-radio>
            </template>
          </media-chapters-radio-group>
        `;
    })}
    </media-menu-items>
  `;
    return x`
    <media-menu class="vds-chapters-menu vds-menu" @open=${onOpen} @close=${onClose}>
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${$i18n(translations, "Chapters")}
          >
            ${IconSlot("menu-chapters")}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
        >
          ${$i18n(translations, "Chapters")}
        </media-tooltip-content>
      </media-tooltip>
      ${portal ? MenuPortal(menuPortal, items) : items}
    </media-menu>
  `;
  }
  function hexToRgb(hex) {
    const { style } = new Option();
    style.color = hex;
    return style.color.match(/\((.*?)\)/)[1].replace(/,/g, " ");
  }
  function onFontReset() {
    for (const type of Object.keys(FONT_SIGNALS)) {
      const defaultValue = FONT_DEFAULTS[type];
      FONT_SIGNALS[type].set(defaultValue);
    }
  }
  function updateFontCssVars() {
    const { player } = useMediaContext();
    players.add(player);
    onDispose(() => players.delete(player));
    if (!isWatchingVars) {
      scoped(() => {
        for (const type of keysOf(FONT_SIGNALS)) {
          const $value = FONT_SIGNALS[type], defaultValue = FONT_DEFAULTS[type], varName = `--media-user-${camelToKebabCase(type)}`, storageKey = `vds-player:${camelToKebabCase(type)}`;
          effect(() => {
            const value = $value(), isDefaultVarValue = value === defaultValue, varValue = !isDefaultVarValue ? getCssVarValue(player, type, value) : null;
            for (const player2 of players) {
              player2.el?.style.setProperty(varName, varValue);
            }
            if (isDefaultVarValue) {
              localStorage.removeItem(storageKey);
            } else {
              localStorage.setItem(storageKey, value);
            }
          });
        }
      }, null);
      isWatchingVars = true;
    }
  }
  function getCssVarValue(player, type, value) {
    switch (type) {
      case "fontFamily":
        const fontVariant = value === "capitals" ? "small-caps" : "";
        player.el?.style.setProperty("--media-user-font-variant", fontVariant);
        return getFontFamilyCSSVarValue(value);
      case "fontSize":
      case "textOpacity":
      case "textBgOpacity":
      case "displayBgOpacity":
        return percentToRatio(value);
      case "textColor":
        return `rgb(${hexToRgb(value)} / var(--media-user-text-opacity, 1))`;
      case "textShadow":
        return getTextShadowCssVarValue(value);
      case "textBg":
        return `rgb(${hexToRgb(value)} / var(--media-user-text-bg-opacity, 1))`;
      case "displayBg":
        return `rgb(${hexToRgb(value)} / var(--media-user-display-bg-opacity, 1))`;
    }
  }
  function percentToRatio(value) {
    return (parseInt(value) / 100).toString();
  }
  function getFontFamilyCSSVarValue(value) {
    switch (value) {
      case "mono-serif":
        return '"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace';
      case "mono-sans":
        return '"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace';
      case "pro-sans":
        return 'Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif';
      case "casual":
        return '"Comic Sans MS", Impact, Handlee, fantasy';
      case "cursive":
        return '"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive';
      case "capitals":
        return '"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps';
      default:
        return '"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif';
    }
  }
  function getTextShadowCssVarValue(value) {
    switch (value) {
      case "drop shadow":
        return "rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px";
      case "raised":
        return "rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px";
      case "depressed":
        return "rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px";
      case "outline":
        return "rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px";
      default:
        return "";
    }
  }
  function DefaultMenuSection({ label = "", value = "", children }) {
    if (!label) {
      return x`
      <div class="vds-menu-section">
        <div class="vds-menu-section-body">${children}</div>
      </div>
    `;
    }
    const id3 = `vds-menu-section-${++sectionId}`;
    return x`
    <section class="vds-menu-section" role="group" aria-labelledby=${id3}>
      <div class="vds-menu-section-title">
        <header id=${id3}>${label}</header>
        ${value ? x`<div class="vds-menu-section-value">${value}</div>` : null}
      </div>
      <div class="vds-menu-section-body">${children}</div>
    </section>
  `;
  }
  function DefaultMenuItem({ label, children }) {
    return x`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${label}</div>
      ${children}
    </div>
  `;
  }
  function DefaultMenuButton({
    label,
    icon,
    hint
  }) {
    return x`
    <media-menu-button class="vds-menu-item">
      ${IconSlot("menu-arrow-left", "vds-menu-close-icon")}
      ${icon ? IconSlot(icon, "vds-menu-item-icon") : null}
      <span class="vds-menu-item-label">${$signal(label)}</span>
      <span class="vds-menu-item-hint" data-part="hint">${hint ? $signal(hint) : null} </span>
      ${IconSlot("menu-arrow-right", "vds-menu-open-icon")}
    </media-menu-button>
  `;
  }
  function DefaultRadioGroup({
    value = null,
    options,
    hideLabel = false,
    children = null,
    onChange = null
  }) {
    function renderRadio(option) {
      const { value: value2, label: content } = option;
      return x`
      <media-radio class="vds-radio" value=${value2}>
        ${IconSlot("menu-radio-check")}
        ${!hideLabel ? x`
              <span class="vds-radio-label" data-part="label">
                ${isString(content) ? content : $signal(content)}
              </span>
            ` : null}
        ${isFunction(children) ? children(option) : children}
      </media-radio>
    `;
    }
    return x`
    <media-radio-group
      class="vds-radio-group"
      value=${isString(value) ? value : value ? $signal(value) : ""}
      @change=${onChange}
    >
      ${isArray(options) ? options.map(renderRadio) : $signal(() => options().map(renderRadio))}
    </media-radio-group>
  `;
  }
  function createRadioOptions(entries) {
    return isArray(entries) ? entries.map((entry) => ({ label: entry, value: entry.toLowerCase() })) : Object.keys(entries).map((label) => ({ label, value: entries[label] }));
  }
  function DefaultSliderParts() {
    return x`
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <div class="vds-slider-thumb"></div>
  `;
  }
  function DefaultSliderSteps() {
    return x`
    <media-slider-steps class="vds-slider-steps">
      <template>
        <div class="vds-slider-step"></div>
      </template>
    </media-slider-steps>
  `;
  }
  function DefaultMenuSliderItem({
    label = null,
    value = null,
    upIcon = "",
    downIcon = "",
    children,
    isMin,
    isMax
  }) {
    const hasTitle = label || value, content = [
      downIcon ? IconSlot(downIcon, "down") : null,
      children,
      upIcon ? IconSlot(upIcon, "up") : null
    ];
    return x`
    <div
      class=${`vds-menu-item vds-menu-slider-item${hasTitle ? " group" : ""}`}
      data-min=${$signal(() => isMin() ? "" : null)}
      data-max=${$signal(() => isMax() ? "" : null)}
    >
      ${hasTitle ? x`
            <div class="vds-menu-slider-title">
              ${[
      label ? x`<div>${label}</div>` : null,
      value ? x`<div>${value}</div>` : null
    ]}
            </div>
            <div class="vds-menu-slider-body">${content}</div>
          ` : content}
    </div>
  `;
  }
  function DefaultFontMenu() {
    return $signal(() => {
      const { hasCaptions } = useMediaState(), { translations } = useDefaultLayoutContext();
      if (!hasCaptions()) return null;
      return x`
      <media-menu class="vds-font-menu vds-menu">
        ${DefaultMenuButton({
        label: () => i18n(translations, "Caption Styles")
      })}
        <media-menu-items class="vds-menu-items">
          ${[
        DefaultMenuSection({
          label: $i18n(translations, "Font"),
          children: [DefaultFontFamilyMenu(), DefaultFontSizeSlider()]
        }),
        DefaultMenuSection({
          label: $i18n(translations, "Text"),
          children: [
            DefaultTextColorInput(),
            DefaultTextShadowMenu(),
            DefaultTextOpacitySlider()
          ]
        }),
        DefaultMenuSection({
          label: $i18n(translations, "Text Background"),
          children: [DefaultTextBgInput(), DefaultTextBgOpacitySlider()]
        }),
        DefaultMenuSection({
          label: $i18n(translations, "Display Background"),
          children: [DefaultDisplayBgInput(), DefaultDisplayOpacitySlider()]
        }),
        DefaultMenuSection({
          children: [DefaultResetMenuItem()]
        })
      ]}
        </media-menu-items>
      </media-menu>
    `;
    });
  }
  function DefaultFontFamilyMenu() {
    return DefaultFontSetting({
      label: "Family",
      option: FONT_FAMILY_OPTION,
      type: "fontFamily"
    });
  }
  function DefaultFontSizeSlider() {
    return DefaultFontSetting({
      label: "Size",
      option: FONT_SIZE_OPTION_WITH_ICONS,
      type: "fontSize"
    });
  }
  function DefaultTextColorInput() {
    return DefaultFontSetting({
      label: "Color",
      option: FONT_COLOR_OPTION,
      type: "textColor"
    });
  }
  function DefaultTextOpacitySlider() {
    return DefaultFontSetting({
      label: "Opacity",
      option: FONT_OPACITY_OPTION_WITH_ICONS,
      type: "textOpacity"
    });
  }
  function DefaultTextShadowMenu() {
    return DefaultFontSetting({
      label: "Shadow",
      option: FONT_TEXT_SHADOW_OPTION,
      type: "textShadow"
    });
  }
  function DefaultTextBgInput() {
    return DefaultFontSetting({
      label: "Color",
      option: FONT_COLOR_OPTION,
      type: "textBg"
    });
  }
  function DefaultTextBgOpacitySlider() {
    return DefaultFontSetting({
      label: "Opacity",
      option: FONT_OPACITY_OPTION_WITH_ICONS,
      type: "textBgOpacity"
    });
  }
  function DefaultDisplayBgInput() {
    return DefaultFontSetting({
      label: "Color",
      option: FONT_COLOR_OPTION,
      type: "displayBg"
    });
  }
  function DefaultDisplayOpacitySlider() {
    return DefaultFontSetting({
      label: "Opacity",
      option: FONT_OPACITY_OPTION_WITH_ICONS,
      type: "displayBgOpacity"
    });
  }
  function DefaultResetMenuItem() {
    const { translations } = useDefaultLayoutContext(), $label = () => i18n(translations, "Reset");
    return x`
    <button class="vds-menu-item" role="menuitem" @click=${onFontReset}>
      <span class="vds-menu-item-label">${$signal($label)}</span>
    </button>
  `;
  }
  function DefaultFontSetting({ label, option, type }) {
    const { player } = useMediaContext(), { translations } = useDefaultLayoutContext(), $currentValue = FONT_SIGNALS[type], $label = () => i18n(translations, label);
    function notify2() {
      tick();
      player.dispatchEvent(new Event("vds-font-change"));
    }
    if (option.type === "color") {
      let onColorChange2 = function(event2) {
        $currentValue.set(event2.target.value);
        notify2();
      };
      return DefaultMenuItem({
        label: $signal($label),
        children: x`
        <input
          class="vds-color-picker"
          type="color"
          .value=${$signal($currentValue)}
          @input=${onColorChange2}
        />
      `
      });
    }
    if (option.type === "slider") {
      let onSliderValueChange2 = function(event2) {
        $currentValue.set(event2.detail + "%");
        notify2();
      };
      const { min: min2, max: max2, step, upIcon, downIcon } = option;
      return DefaultMenuSliderItem({
        label: $signal($label),
        value: $signal($currentValue),
        upIcon,
        downIcon,
        isMin: () => $currentValue() === min2 + "%",
        isMax: () => $currentValue() === max2 + "%",
        children: x`
        <media-slider
          class="vds-slider"
          min=${min2}
          max=${max2}
          step=${step}
          key-step=${step}
          .value=${$signal(() => parseInt($currentValue()))}
          aria-label=${$signal($label)}
          @value-change=${onSliderValueChange2}
          @drag-value-change=${onSliderValueChange2}
        >
          ${DefaultSliderParts()}${DefaultSliderSteps()}
        </media-slider>
      `
      });
    }
    const radioOptions = createRadioOptions(option.values), $hint = () => {
      const value = $currentValue(), label2 = radioOptions.find((radio) => radio.value === value)?.label || "";
      return i18n(translations, isString(label2) ? label2 : label2());
    };
    return x`
    <media-menu class=${`vds-${camelToKebabCase(type)}-menu vds-menu`}>
      ${DefaultMenuButton({ label: $label, hint: $hint })}
      <media-menu-items class="vds-menu-items">
        ${DefaultRadioGroup({
      value: $currentValue,
      options: radioOptions,
      onChange({ detail: value }) {
        $currentValue.set(value);
        notify2();
      }
    })}
      </media-menu-items>
    </media-menu>
  `;
  }
  function DefaultMenuCheckbox({
    label,
    checked,
    defaultChecked = false,
    storageKey,
    onChange
  }) {
    const { translations } = useDefaultLayoutContext(), savedValue = storageKey ? localStorage.getItem(storageKey) : null, $checked = signal(!!(savedValue ?? defaultChecked)), $active = signal(false), $ariaChecked = $signal($ariaBool($checked)), $label = $i18n(translations, label);
    if (storageKey) onChange(peek($checked));
    if (checked) {
      effect(() => void $checked.set(checked()));
    }
    function onPress2(event2) {
      if (event2?.button === 1) return;
      $checked.set((checked2) => !checked2);
      if (storageKey) localStorage.setItem(storageKey, $checked() ? "1" : "");
      onChange($checked(), event2);
      $active.set(false);
    }
    function onKeyDown(event2) {
      if (isKeyboardClick(event2)) onPress2();
    }
    function onActive(event2) {
      if (event2.button !== 0) return;
      $active.set(true);
    }
    return x`
    <div
      class="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      aria-label=${$label}
      aria-checked=${$ariaChecked}
      data-active=${$signal(() => $active() ? "" : null)}
      @pointerup=${onPress2}
      @pointerdown=${onActive}
      @keydown=${onKeyDown}
    ></div>
  `;
  }
  function DefaultAccessibilityMenu() {
    return $signal(() => {
      const { translations } = useDefaultLayoutContext();
      return x`
      <media-menu class="vds-accessibility-menu vds-menu">
        ${DefaultMenuButton({
        label: () => i18n(translations, "Accessibility"),
        icon: "menu-accessibility"
      })}
        <media-menu-items class="vds-menu-items">
          ${[
        DefaultMenuSection({
          children: [
            DefaultAnnouncementsMenuCheckbox(),
            DefaultKeyboardAnimationsMenuCheckbox()
          ]
        }),
        DefaultMenuSection({
          children: [DefaultFontMenu()]
        })
      ]}
        </media-menu-items>
      </media-menu>
    `;
    });
  }
  function DefaultAnnouncementsMenuCheckbox() {
    const { userPrefersAnnouncements, translations } = useDefaultLayoutContext(), label = "Announcements";
    return DefaultMenuItem({
      label: $i18n(translations, label),
      children: DefaultMenuCheckbox({
        label,
        storageKey: "vds-player::announcements",
        onChange(checked) {
          userPrefersAnnouncements.set(checked);
        }
      })
    });
  }
  function DefaultKeyboardAnimationsMenuCheckbox() {
    return $signal(() => {
      const { translations, userPrefersKeyboardAnimations, noKeyboardAnimations } = useDefaultLayoutContext(), { viewType } = useMediaState(), $disabled = computed(() => viewType() !== "video" || noKeyboardAnimations());
      if ($disabled()) return null;
      const label = "Keyboard Animations";
      return DefaultMenuItem({
        label: $i18n(translations, label),
        children: DefaultMenuCheckbox({
          label,
          defaultChecked: true,
          storageKey: "vds-player::keyboard-animations",
          onChange(checked) {
            userPrefersKeyboardAnimations.set(checked);
          }
        })
      });
    });
  }
  function DefaultAudioMenu() {
    return $signal(() => {
      const { noAudioGain, translations } = useDefaultLayoutContext(), { audioTracks, canSetAudioGain } = useMediaState(), $disabled = computed(() => {
        const hasGainSlider = canSetAudioGain() && !noAudioGain();
        return !hasGainSlider && audioTracks().length <= 1;
      });
      if ($disabled()) return null;
      return x`
      <media-menu class="vds-audio-menu vds-menu">
        ${DefaultMenuButton({
        label: () => i18n(translations, "Audio"),
        icon: "menu-audio"
      })}
        <media-menu-items class="vds-menu-items">
          ${[DefaultAudioTracksMenu(), DefaultAudioBoostSection()]}
        </media-menu-items>
      </media-menu>
    `;
    });
  }
  function DefaultAudioTracksMenu() {
    return $signal(() => {
      const { translations } = useDefaultLayoutContext(), { audioTracks } = useMediaState(), $defaultText = $i18n(translations, "Default"), $disabled = computed(() => audioTracks().length <= 1);
      if ($disabled()) return null;
      return DefaultMenuSection({
        children: x`
        <media-menu class="vds-audio-tracks-menu vds-menu">
          ${DefaultMenuButton({
          label: () => i18n(translations, "Track")
        })}
          <media-menu-items class="vds-menu-items">
            <media-audio-radio-group
              class="vds-audio-track-radio-group vds-radio-group"
              empty-label=${$defaultText}
            >
              <template>
                <media-radio class="vds-audio-track-radio vds-radio">
                  <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                  <span class="vds-radio-label" data-part="label"></span>
                </media-radio>
              </template>
            </media-audio-radio-group>
          </media-menu-items>
        </media-menu>
      `
      });
    });
  }
  function DefaultAudioBoostSection() {
    return $signal(() => {
      const { noAudioGain, translations } = useDefaultLayoutContext(), { canSetAudioGain } = useMediaState(), $disabled = computed(() => !canSetAudioGain() || noAudioGain());
      if ($disabled()) return null;
      const { audioGain } = useMediaState();
      return DefaultMenuSection({
        label: $i18n(translations, "Boost"),
        value: $signal(() => Math.round(((audioGain() ?? 1) - 1) * 100) + "%"),
        children: [
          DefaultMenuSliderItem({
            upIcon: "menu-audio-boost-up",
            downIcon: "menu-audio-boost-down",
            children: DefaultAudioGainSlider(),
            isMin: () => ((audioGain() ?? 1) - 1) * 100 <= getGainMin(),
            isMax: () => ((audioGain() ?? 1) - 1) * 100 === getGainMax()
          })
        ]
      });
    });
  }
  function DefaultAudioGainSlider() {
    const { translations } = useDefaultLayoutContext(), $label = $i18n(translations, "Boost"), $min = getGainMin, $max = getGainMax, $step = getGainStep;
    return x`
    <media-audio-gain-slider
      class="vds-audio-gain-slider vds-slider"
      aria-label=${$label}
      min=${$signal($min)}
      max=${$signal($max)}
      step=${$signal($step)}
      key-step=${$signal($step)}
    >
      ${DefaultSliderParts()}${DefaultSliderSteps()}
    </media-audio-gain-slider>
  `;
  }
  function getGainMin() {
    const { audioGains } = useDefaultLayoutContext(), gains = audioGains();
    return isArray(gains) ? gains[0] ?? 0 : gains.min;
  }
  function getGainMax() {
    const { audioGains } = useDefaultLayoutContext(), gains = audioGains();
    return isArray(gains) ? gains[gains.length - 1] ?? 300 : gains.max;
  }
  function getGainStep() {
    const { audioGains } = useDefaultLayoutContext(), gains = audioGains();
    return isArray(gains) ? gains[1] - gains[0] || 25 : gains.step;
  }
  function DefaultCaptionsMenu() {
    return $signal(() => {
      const { translations } = useDefaultLayoutContext(), { hasCaptions } = useMediaState(), $offText = $i18n(translations, "Off");
      if (!hasCaptions()) return null;
      return x`
      <media-menu class="vds-captions-menu vds-menu">
        ${DefaultMenuButton({
        label: () => i18n(translations, "Captions"),
        icon: "menu-captions"
      })}
        <media-menu-items class="vds-menu-items">
          <media-captions-radio-group
            class="vds-captions-radio-group vds-radio-group"
            off-label=${$offText}
          >
            <template>
              <media-radio class="vds-caption-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
              </media-radio>
            </template>
          </media-captions-radio-group>
        </media-menu-items>
      </media-menu>
    `;
    });
  }
  function DefaultPlaybackMenu() {
    return $signal(() => {
      const { translations } = useDefaultLayoutContext();
      return x`
      <media-menu class="vds-playback-menu vds-menu">
        ${DefaultMenuButton({
        label: () => i18n(translations, "Playback"),
        icon: "menu-playback"
      })}
        <media-menu-items class="vds-menu-items">
          ${[
        DefaultMenuSection({
          children: DefaultLoopCheckbox()
        }),
        DefaultSpeedMenuSection(),
        DefaultQualityMenuSection()
      ]}
        </media-menu-items>
      </media-menu>
    `;
    });
  }
  function DefaultLoopCheckbox() {
    const { remote } = useMediaContext(), { translations } = useDefaultLayoutContext(), label = "Loop";
    return DefaultMenuItem({
      label: $i18n(translations, label),
      children: DefaultMenuCheckbox({
        label,
        storageKey: "vds-player::user-loop",
        onChange(checked, trigger) {
          remote.userPrefersLoopChange(checked, trigger);
        }
      })
    });
  }
  function DefaultSpeedMenuSection() {
    return $signal(() => {
      const { translations } = useDefaultLayoutContext(), { canSetPlaybackRate, playbackRate } = useMediaState();
      if (!canSetPlaybackRate()) return null;
      return DefaultMenuSection({
        label: $i18n(translations, "Speed"),
        value: $signal(
          () => playbackRate() === 1 ? i18n(translations, "Normal") : playbackRate() + "x"
        ),
        children: [
          DefaultMenuSliderItem({
            upIcon: "menu-speed-up",
            downIcon: "menu-speed-down",
            children: DefaultSpeedSlider(),
            isMin: () => playbackRate() === getSpeedMin(),
            isMax: () => playbackRate() === getSpeedMax()
          })
        ]
      });
    });
  }
  function getSpeedMin() {
    const { playbackRates } = useDefaultLayoutContext(), rates = playbackRates();
    return isArray(rates) ? rates[0] ?? 0 : rates.min;
  }
  function getSpeedMax() {
    const { playbackRates } = useDefaultLayoutContext(), rates = playbackRates();
    return isArray(rates) ? rates[rates.length - 1] ?? 2 : rates.max;
  }
  function getSpeedStep() {
    const { playbackRates } = useDefaultLayoutContext(), rates = playbackRates();
    return isArray(rates) ? rates[1] - rates[0] || 0.25 : rates.step;
  }
  function DefaultSpeedSlider() {
    const { translations } = useDefaultLayoutContext(), $label = $i18n(translations, "Speed"), $min = getSpeedMin, $max = getSpeedMax, $step = getSpeedStep;
    return x`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${$label}
      min=${$signal($min)}
      max=${$signal($max)}
      step=${$signal($step)}
      key-step=${$signal($step)}
    >
      ${DefaultSliderParts()}${DefaultSliderSteps()}
    </media-speed-slider>
  `;
  }
  function DefaultAutoQualityCheckbox() {
    const { remote, qualities } = useMediaContext(), { autoQuality, canSetQuality, qualities: $qualities } = useMediaState(), { translations } = useDefaultLayoutContext(), label = "Auto", $disabled = computed(() => !canSetQuality() || $qualities().length <= 1);
    if ($disabled()) return null;
    return DefaultMenuItem({
      label: $i18n(translations, label),
      children: DefaultMenuCheckbox({
        label,
        checked: autoQuality,
        onChange(checked, trigger) {
          if (checked) {
            remote.requestAutoQuality(trigger);
          } else {
            remote.changeQuality(qualities.selectedIndex, trigger);
          }
        }
      })
    });
  }
  function DefaultQualityMenuSection() {
    return $signal(() => {
      const { hideQualityBitrate, translations } = useDefaultLayoutContext(), { canSetQuality, qualities, quality } = useMediaState(), $disabled = computed(() => !canSetQuality() || qualities().length <= 1), $sortedQualities = computed(() => sortVideoQualities(qualities()));
      if ($disabled()) return null;
      return DefaultMenuSection({
        label: $i18n(translations, "Quality"),
        value: $signal(() => {
          const height = quality()?.height, bitrate = !hideQualityBitrate() ? quality()?.bitrate : null, bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null, autoText = i18n(translations, "Auto");
          return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : autoText;
        }),
        children: [
          DefaultMenuSliderItem({
            upIcon: "menu-quality-up",
            downIcon: "menu-quality-down",
            children: DefaultQualitySlider(),
            isMin: () => $sortedQualities()[0] === quality(),
            isMax: () => $sortedQualities().at(-1) === quality()
          }),
          DefaultAutoQualityCheckbox()
        ]
      });
    });
  }
  function DefaultQualitySlider() {
    const { translations } = useDefaultLayoutContext(), $label = $i18n(translations, "Quality");
    return x`
    <media-quality-slider class="vds-quality-slider vds-slider" aria-label=${$label}>
      ${DefaultSliderParts()}${DefaultSliderSteps()}
    </media-quality-slider>
  `;
  }
  function DefaultSettingsMenu({
    placement,
    portal,
    tooltip
  }) {
    return $signal(() => {
      const { viewType } = useMediaState(), {
        translations,
        menuPortal,
        noModal,
        menuGroup,
        smallWhen: smWhen
      } = useDefaultLayoutContext(), $placement = computed(
        () => noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null
      ), $offset = computed(
        () => !smWhen() && menuGroup() === "bottom" && viewType() === "video" ? 26 : 0
      ), $isOpen = signal(false);
      updateFontCssVars();
      function onOpen() {
        $isOpen.set(true);
      }
      function onClose() {
        $isOpen.set(false);
      }
      const items = x`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${$signal($placement)}
        offset=${$signal($offset)}
      >
        ${$signal(() => {
        if (!$isOpen()) {
          return null;
        }
        return [
          DefaultPlaybackMenu(),
          DefaultAccessibilityMenu(),
          DefaultAudioMenu(),
          DefaultCaptionsMenu()
        ];
      })}
      </media-menu-items>
    `;
      return x`
      <media-menu class="vds-settings-menu vds-menu" @open=${onOpen} @close=${onClose}>
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${$i18n(translations, "Settings")}
            >
              ${IconSlot("menu-settings", "vds-rotate-icon")}
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
          >
            ${$i18n(translations, "Settings")}
          </media-tooltip-content>
        </media-tooltip>
        ${portal ? MenuPortal(menuPortal, items) : items}
      </media-menu>
    `;
    });
  }
  function DefaultVolumePopup({
    orientation,
    tooltip
  }) {
    return $signal(() => {
      const { pointer, muted, canSetVolume } = useMediaState();
      if (pointer() === "coarse" && !muted()) return null;
      if (!canSetVolume()) {
        return DefaultMuteButton({ tooltip });
      }
      const $rootRef = signal(void 0), $isRootActive = useActive($rootRef);
      return x`
      <div class="vds-volume" ?data-active=${$signal($isRootActive)} ${n4($rootRef.set)}>
        ${DefaultMuteButton({ tooltip })}
        <div class="vds-volume-popup">${DefaultVolumeSlider({ orientation })}</div>
      </div>
    `;
    });
  }
  function DefaultVolumeSlider({ orientation } = {}) {
    const { translations } = useDefaultLayoutContext(), $label = $i18n(translations, "Volume");
    return x`
    <media-volume-slider
      class="vds-volume-slider vds-slider"
      aria-label=${$label}
      orientation=${l3(orientation)}
    >
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `;
  }
  function DefaultTimeSlider() {
    const $ref = signal(void 0), $width = signal(0), {
      thumbnails,
      translations,
      sliderChaptersMinWidth,
      disableTimeSlider,
      seekStep,
      noScrubGesture
    } = useDefaultLayoutContext(), $label = $i18n(translations, "Seek"), $isDisabled = $signal(disableTimeSlider), $isChaptersDisabled = $signal(() => $width() < sliderChaptersMinWidth()), $thumbnails = $signal(thumbnails);
    useResizeObserver($ref, () => {
      const el = $ref();
      el && $width.set(el.clientWidth);
    });
    return x`
    <media-time-slider
      class="vds-time-slider vds-slider"
      aria-label=${$label}
      key-step=${$signal(seekStep)}
      ?disabled=${$isDisabled}
      ?no-swipe-gesture=${$signal(noScrubGesture)}
      ${n4($ref.set)}
    >
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${$isChaptersDisabled}>
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </media-slider-chapters>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail
          class="vds-slider-thumbnail vds-thumbnail"
          .src=${$thumbnails}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `;
  }
  function DefaultTimeGroup() {
    return x`
    <div class="vds-time-group">
      ${$signal(() => {
      const { duration } = useMediaState();
      if (!duration()) return null;
      return [
        x`<media-time class="vds-time" type="current"></media-time>`,
        x`<div class="vds-time-divider">/</div>`,
        x`<media-time class="vds-time" type="duration"></media-time>`
      ];
    })}
    </div>
  `;
  }
  function DefaultTimeInvert() {
    return $signal(() => {
      const { live, duration } = useMediaState();
      return live() ? DefaultLiveButton() : duration() ? x`<media-time class="vds-time" type="current" toggle remainder></media-time>` : null;
    });
  }
  function DefaultTimeInfo() {
    return $signal(() => {
      const { live } = useMediaState();
      return live() ? DefaultLiveButton() : DefaultTimeGroup();
    });
  }
  function DefaultTitle() {
    return $signal(() => {
      const { textTracks } = useMediaContext(), { title, started } = useMediaState(), $hasChapters = signal(null);
      watchActiveTextTrack(textTracks, "chapters", $hasChapters.set);
      return $hasChapters() && (started() || !title()) ? DefaultChapterTitle() : x`<media-title class="vds-chapter-title"></media-title>`;
    });
  }
  function DefaultChapterTitle() {
    return x`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`;
  }
  var defaultLayoutContext, defaultLayoutProps, DefaultLayout, defaultlayout__proto, FONT_COLOR_OPTION, FONT_FAMILY_OPTION, FONT_SIZE_OPTION, FONT_OPACITY_OPTION, FONT_TEXT_SHADOW_OPTION, FONT_DEFAULTS, FONT_SIGNALS, isWatchingVars, players, sectionId, FONT_SIZE_OPTION_WITH_ICONS, FONT_OPACITY_OPTION_WITH_ICONS, DefaultLayoutIconsLoader;
  var init_vidstack_C3gk_MR = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-C3gk-MR_.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_Cpte_fRf();
      init_vidstack_Ds_q5BGO();
      init_lit_html();
      init_vidstack_7xep0lg7();
      init_vidstack_DE4XvkHU();
      init_vidstack_BOTZD4tC();
      init_if_defined();
      init_ref();
      init_vidstack_A9j_j6J();
      defaultLayoutContext = createContext();
      defaultLayoutProps = {
        colorScheme: "system",
        download: null,
        customIcons: false,
        disableTimeSlider: false,
        menuContainer: null,
        menuGroup: "bottom",
        noAudioGain: false,
        noGestures: false,
        noKeyboardAnimations: false,
        noModal: false,
        noScrubGesture: false,
        playbackRates: { min: 0, max: 2, step: 0.25 },
        audioGains: { min: 0, max: 300, step: 25 },
        seekStep: 10,
        sliderChaptersMinWidth: 325,
        hideQualityBitrate: false,
        smallWhen: false,
        thumbnails: null,
        translations: null,
        when: false
      };
      DefaultLayout = class extends Component {
        static props = defaultLayoutProps;
        #media;
        #when = computed(() => {
          const when = this.$props.when();
          return this.#matches(when);
        });
        #smallWhen = computed(() => {
          const when = this.$props.smallWhen();
          return this.#matches(when);
        });
        get isMatch() {
          return this.#when();
        }
        get isSmallLayout() {
          return this.#smallWhen();
        }
        onSetup() {
          this.#media = useMediaContext();
          this.setAttributes({
            "data-match": this.#when,
            "data-sm": () => this.#smallWhen() ? "" : null,
            "data-lg": () => !this.#smallWhen() ? "" : null,
            "data-size": () => this.#smallWhen() ? "sm" : "lg",
            "data-no-scrub-gesture": this.$props.noScrubGesture
          });
          provideContext(defaultLayoutContext, {
            ...this.$props,
            when: this.#when,
            smallWhen: this.#smallWhen,
            userPrefersAnnouncements: signal(true),
            userPrefersKeyboardAnimations: signal(true),
            menuPortal: signal(null)
          });
        }
        onAttach(el) {
          watchColorScheme(el, this.$props.colorScheme);
        }
        #matches(query) {
          return query !== "never" && (isBoolean(query) ? query : computed(() => query(this.#media.player.state))());
        }
      };
      defaultlayout__proto = DefaultLayout.prototype;
      prop(defaultlayout__proto, "isMatch");
      prop(defaultlayout__proto, "isSmallLayout");
      FONT_COLOR_OPTION = {
        type: "color"
      };
      FONT_FAMILY_OPTION = {
        type: "radio",
        values: {
          "Monospaced Serif": "mono-serif",
          "Proportional Serif": "pro-serif",
          "Monospaced Sans-Serif": "mono-sans",
          "Proportional Sans-Serif": "pro-sans",
          Casual: "casual",
          Cursive: "cursive",
          "Small Capitals": "capitals"
        }
      };
      FONT_SIZE_OPTION = {
        type: "slider",
        min: 0,
        max: 400,
        step: 25,
        upIcon: null,
        downIcon: null
      };
      FONT_OPACITY_OPTION = {
        type: "slider",
        min: 0,
        max: 100,
        step: 5,
        upIcon: null,
        downIcon: null
      };
      FONT_TEXT_SHADOW_OPTION = {
        type: "radio",
        values: ["None", "Drop Shadow", "Raised", "Depressed", "Outline"]
      };
      FONT_DEFAULTS = {
        fontFamily: "pro-sans",
        fontSize: "100%",
        textColor: "#ffffff",
        textOpacity: "100%",
        textShadow: "none",
        textBg: "#000000",
        textBgOpacity: "100%",
        displayBg: "#000000",
        displayBgOpacity: "0%"
      };
      FONT_SIGNALS = Object.keys(FONT_DEFAULTS).reduce(
        (prev, type) => ({
          ...prev,
          [type]: signal(FONT_DEFAULTS[type])
        }),
        {}
      );
      {
        for (const type of Object.keys(FONT_SIGNALS)) {
          const value = localStorage.getItem(`vds-player:${camelToKebabCase(type)}`);
          if (isString(value)) FONT_SIGNALS[type].set(value);
        }
      }
      isWatchingVars = false;
      players = /* @__PURE__ */ new Set();
      sectionId = 0;
      FONT_SIZE_OPTION_WITH_ICONS = {
        ...FONT_SIZE_OPTION,
        upIcon: "menu-opacity-up",
        downIcon: "menu-opacity-down"
      };
      FONT_OPACITY_OPTION_WITH_ICONS = {
        ...FONT_OPACITY_OPTION,
        upIcon: "menu-opacity-up",
        downIcon: "menu-opacity-down"
      };
      DefaultLayoutIconsLoader = class extends LayoutIconsLoader {
        async loadIcons() {
          const paths = (await Promise.resolve().then(() => (init_vidstack_H72EDyqs(), vidstack_H72EDyqs_exports))).icons, icons2 = {};
          for (const iconName of Object.keys(paths)) {
            icons2[iconName] = Icon({ name: iconName, paths: paths[iconName] });
          }
          return icons2;
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-CwTj4H1w.js
  var LitElement;
  var init_vidstack_CwTj4H1w = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-CwTj4H1w.js"() {
      init_lit_html();
      LitElement = class extends HTMLElement {
        rootPart = null;
        connectedCallback() {
          this.rootPart = D(this.render(), this, {
            renderBefore: this.firstChild
          });
          this.rootPart.setConnected(true);
        }
        disconnectedCallback() {
          this.rootPart?.setConnected(false);
          this.rootPart = null;
          D(null, this);
        }
      };
    }
  });

  // node_modules/vidstack/prod/define/templates/vidstack-audio-layout.js
  function DefaultAudioLayout2() {
    return [
      DefaultAnnouncer(),
      DefaultCaptions(),
      x`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[
        DefaultSeekButton({ backward: true, tooltip: "top start" }),
        DefaultPlayButton({ tooltip: "top" }),
        DefaultSeekButton({ tooltip: "top" }),
        DefaultAudioTitle(),
        DefaultTimeSlider(),
        DefaultTimeInvert(),
        DefaultVolumePopup({ orientation: "vertical", tooltip: "top" }),
        DefaultCaptionButton({ tooltip: "top" }),
        DefaultDownloadButton(),
        DefaultAirPlayButton({ tooltip: "top" }),
        DefaultAudioMenus()
      ]}
        </media-controls-group>
      </media-controls>
    `
    ];
  }
  function DefaultAudioTitle() {
    return $signal(() => {
      let $ref = signal(void 0), $isTextOverflowing = signal(false), media = useMediaContext(), { title, started, currentTime, ended } = useMediaState(), { translations } = useDefaultLayoutContext(), $isTransitionActive = useTransitionActive($ref), $isContinued = () => started() || currentTime() > 0;
      const $title = () => {
        const word = ended() ? "Replay" : $isContinued() ? "Continue" : "Play";
        return `${i18n(translations, word)}: ${title()}`;
      };
      effect(() => {
        if ($isTransitionActive() && document.activeElement === document.body) {
          media.player.el?.focus({ preventScroll: true });
        }
      });
      function onResize() {
        const el = $ref(), isOverflowing = !!el && !$isTransitionActive() && el.clientWidth < el.children[0].clientWidth;
        el && toggleClass(el, "vds-marquee", isOverflowing);
        $isTextOverflowing.set(isOverflowing);
      }
      function Title2() {
        return x`
        <span class="vds-title-text">
          ${$signal($title)}${$signal(() => $isContinued() ? DefaultChapterTitle() : null)}
        </span>
      `;
      }
      useResizeObserver($ref, onResize);
      return title() ? x`
          <span class="vds-title" title=${$signal($title)} ${n4($ref.set)}>
            ${[
        Title2(),
        $signal(() => $isTextOverflowing() && !$isTransitionActive() ? Title2() : null)
      ]}
          </span>
        ` : DefaultControlsSpacer();
    });
  }
  function DefaultAudioMenus() {
    const placement = "top end";
    return [
      DefaultChaptersMenu({ tooltip: "top", placement, portal: true }),
      DefaultSettingsMenu({ tooltip: "top end", placement, portal: true })
    ];
  }
  var DefaultAudioLayout$1, MediaAudioLayoutElement;
  var init_vidstack_audio_layout = __esm({
    "node_modules/vidstack/prod/define/templates/vidstack-audio-layout.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_C3gk_MR();
      init_vidstack_Cpte_fRf();
      init_vidstack_Ds_q5BGO();
      init_vidstack_7xep0lg7();
      init_vidstack_CwTj4H1w();
      init_lit_html();
      init_ref();
      init_if_defined();
      init_unsafe_svg();
      init_async_directive();
      DefaultAudioLayout$1 = class DefaultAudioLayout extends DefaultLayout {
        static props = {
          ...super.props,
          when: ({ viewType }) => viewType === "audio",
          smallWhen: ({ width }) => width < 576
        };
      };
      MediaAudioLayoutElement = class extends Host(LitElement, DefaultAudioLayout$1) {
        static tagName = "media-audio-layout";
        static attrs = {
          smallWhen: {
            converter(value) {
              return value !== "never" && !!value;
            }
          }
        };
        #media;
        #scrubbing = signal(false);
        onSetup() {
          this.forwardKeepAlive = false;
          this.#media = useMediaContext();
          this.classList.add("vds-audio-layout");
          this.#setupWatchScrubbing();
        }
        onConnect() {
          setLayoutName("audio", () => this.isMatch);
          this.#setupMenuContainer();
        }
        render() {
          return $signal(this.#render.bind(this));
        }
        #render() {
          return this.isMatch ? DefaultAudioLayout2() : null;
        }
        #setupMenuContainer() {
          const { menuPortal } = useDefaultLayoutContext();
          effect(() => {
            if (!this.isMatch) return;
            const container = createMenuContainer(
              this,
              this.menuContainer,
              "vds-audio-layout",
              () => this.isSmallLayout
            ), roots = container ? [this, container] : [this];
            const iconsManager = this.$props.customIcons() ? new SlotManager(roots) : new DefaultLayoutIconsLoader(roots);
            iconsManager.connect();
            menuPortal.set(container);
            return () => {
              container.remove();
              menuPortal.set(null);
            };
          });
        }
        #setupWatchScrubbing() {
          const { pointer } = this.#media.$state;
          effect(() => {
            if (pointer() !== "coarse") return;
            effect(this.#watchScrubbing.bind(this));
          });
        }
        #watchScrubbing() {
          if (!this.#scrubbing()) {
            listenEvent(this, "pointerdown", this.#onStartScrubbing.bind(this), { capture: true });
            return;
          }
          listenEvent(this, "pointerdown", (e6) => e6.stopPropagation());
          listenEvent(window, "pointerdown", this.#onStopScrubbing.bind(this));
        }
        #onStartScrubbing(event2) {
          const { target } = event2, hasTimeSlider = !!(isHTMLElement2(target) && target.closest(".vds-time-slider"));
          if (!hasTimeSlider) return;
          event2.stopImmediatePropagation();
          this.setAttribute("data-scrubbing", "");
          this.#scrubbing.set(true);
        }
        #onStopScrubbing() {
          this.#scrubbing.set(false);
          this.removeAttribute("data-scrubbing");
        }
      };
    }
  });

  // node_modules/lit-html/directives/keyed.js
  var i3;
  var init_keyed = __esm({
    "node_modules/lit-html/directives/keyed.js"() {
      init_lit_html();
      init_directive();
      init_directive_helpers();
      i3 = e3(class extends i2 {
        constructor() {
          super(...arguments), this.key = A;
        }
        render(r4, t5) {
          return this.key = r4, t5;
        }
        update(r4, [t5, e6]) {
          return t5 !== this.key && (a2(r4), this.key = t5), e6;
        }
      });
    }
  });

  // node_modules/vidstack/prod/define/templates/vidstack-video-layout.js
  function DefaultKeyboardDisplay() {
    return $signal(() => {
      const media = useMediaContext(), { noKeyboardAnimations, userPrefersKeyboardAnimations } = useDefaultLayoutContext(), $disabled = computed(() => noKeyboardAnimations() || !userPrefersKeyboardAnimations());
      if ($disabled()) {
        return null;
      }
      const visible = signal(false), { lastKeyboardAction } = media.$state;
      effect(() => {
        visible.set(!!lastKeyboardAction());
        const id3 = setTimeout(() => visible.set(false), 500);
        return () => {
          visible.set(false);
          window.clearTimeout(id3);
        };
      });
      const $actionDataAttr = computed(() => {
        const action = lastKeyboardAction()?.action;
        return action && visible() ? camelToKebabCase(action) : null;
      });
      const $classList = computed(() => `vds-kb-action${!visible() ? " hidden" : ""}`), $text = computed(getText), $iconSlot = computed(() => {
        const name = getIconName();
        return name ? createSlot(name) : null;
      });
      function Icon2() {
        const $slot = $iconSlot();
        if (!$slot) return null;
        return x`
        <div class="vds-kb-bezel">
          <div class="vds-kb-icon">${$slot}</div>
        </div>
      `;
      }
      return x`
      <div class=${$signal($classList)} data-action=${$signal($actionDataAttr)}>
        <div class="vds-kb-text-wrapper">
          <div class="vds-kb-text">${$signal($text)}</div>
        </div>
        ${$signal(() => i3(lastKeyboardAction(), Icon2()))}
      </div>
    `;
    });
  }
  function getText() {
    const { $state } = useMediaContext(), action = $state.lastKeyboardAction()?.action, audioGain = $state.audioGain() ?? 1;
    switch (action) {
      case "toggleMuted":
        return $state.muted() ? "0%" : getVolumeText($state.volume(), audioGain);
      case "volumeUp":
      case "volumeDown":
        return getVolumeText($state.volume(), audioGain);
      default:
        return "";
    }
  }
  function getVolumeText(volume, gain) {
    return `${Math.round(volume * gain * 100)}%`;
  }
  function getIconName() {
    const { $state } = useMediaContext(), action = $state.lastKeyboardAction()?.action;
    switch (action) {
      case "togglePaused":
        return !$state.paused() ? "kb-play-icon" : "kb-pause-icon";
      case "toggleMuted":
        return $state.muted() || $state.volume() === 0 ? "kb-mute-icon" : $state.volume() >= 0.5 ? "kb-volume-up-icon" : "kb-volume-down-icon";
      case "toggleFullscreen":
        return `kb-fs-${$state.fullscreen() ? "enter" : "exit"}-icon`;
      case "togglePictureInPicture":
        return `kb-pip-${$state.pictureInPicture() ? "enter" : "exit"}-icon`;
      case "toggleCaptions":
        return $state.hasCaptions() ? `kb-cc-${$state.textTrack() ? "on" : "off"}-icon` : null;
      case "volumeUp":
        return "kb-volume-up-icon";
      case "volumeDown":
        return "kb-volume-down-icon";
      case "seekForward":
        return "kb-seek-forward-icon";
      case "seekBackward":
        return "kb-seek-backward-icon";
      default:
        return null;
    }
  }
  function DefaultVideoLayoutLarge() {
    return [
      DefaultAnnouncer(),
      DefaultVideoGestures(),
      DefaultBufferingIndicator(),
      DefaultKeyboardDisplay(),
      DefaultCaptions(),
      x`<div class="vds-scrim"></div>`,
      x`
      <media-controls class="vds-controls">
        ${[
        DefaultControlsGroupTop(),
        DefaultControlsSpacer(),
        x`<media-controls-group class="vds-controls-group"></media-controls-group>`,
        DefaultControlsSpacer(),
        x`
            <media-controls-group class="vds-controls-group">
              ${DefaultTimeSlider()}
            </media-controls-group>
          `,
        x`
            <media-controls-group class="vds-controls-group">
              ${[
          DefaultPlayButton({ tooltip: "top start" }),
          DefaultVolumePopup({ orientation: "horizontal", tooltip: "top" }),
          DefaultTimeInfo(),
          DefaultTitle(),
          DefaultCaptionButton({ tooltip: "top" }),
          DefaultBottomMenuGroup(),
          DefaultAirPlayButton({ tooltip: "top" }),
          DefaultGoogleCastButton({ tooltip: "top" }),
          DefaultDownloadButton(),
          DefaultPIPButton(),
          DefaultFullscreenButton({ tooltip: "top end" })
        ]}
            </media-controls-group>
          `
      ]}
      </media-controls>
    `
    ];
  }
  function DefaultBottomMenuGroup() {
    return $signal(() => {
      const { menuGroup } = useDefaultLayoutContext();
      return menuGroup() === "bottom" ? DefaultVideoMenus() : null;
    });
  }
  function DefaultControlsGroupTop() {
    return x`
    <media-controls-group class="vds-controls-group">
      ${$signal(() => {
      const { menuGroup } = useDefaultLayoutContext();
      return menuGroup() === "top" ? [DefaultControlsSpacer(), DefaultVideoMenus()] : null;
    })}
    </media-controls-group>
  `;
  }
  function DefaultVideoLayoutSmall() {
    return [
      DefaultAnnouncer(),
      DefaultVideoGestures(),
      DefaultBufferingIndicator(),
      DefaultCaptions(),
      DefaultKeyboardDisplay(),
      x`<div class="vds-scrim"></div>`,
      x`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[
        DefaultAirPlayButton({ tooltip: "top start" }),
        DefaultGoogleCastButton({ tooltip: "bottom start" }),
        DefaultControlsSpacer(),
        DefaultCaptionButton({ tooltip: "bottom" }),
        DefaultDownloadButton(),
        DefaultVideoMenus(),
        DefaultVolumePopup({ orientation: "vertical", tooltip: "bottom end" })
      ]}
        </media-controls-group>

        ${DefaultControlsSpacer()}

        <media-controls-group class="vds-controls-group" style="pointer-events: none;">
          ${[
        DefaultControlsSpacer(),
        DefaultPlayButton({ tooltip: "top" }),
        DefaultControlsSpacer()
      ]}
        </media-controls-group>

        ${DefaultControlsSpacer()}

        <media-controls-group class="vds-controls-group">
          ${[DefaultTimeInfo(), DefaultTitle(), DefaultFullscreenButton({ tooltip: "top end" })]}
        </media-controls-group>

        <media-controls-group class="vds-controls-group">
          ${DefaultTimeSlider()}
        </media-controls-group>
      </media-controls>
    `,
      StartDuration()
    ];
  }
  function DefaultVideoLoadLayout() {
    return x`
    <div class="vds-load-container">
      ${[DefaultBufferingIndicator(), DefaultPlayButton({ tooltip: "top" })]}
    </div>
  `;
  }
  function StartDuration() {
    return $signal(() => {
      const { duration } = useMediaState();
      if (duration() === 0) return null;
      return x`
      <div class="vds-start-duration">
        <media-time class="vds-time" type="duration"></media-time>
      </div>
    `;
    });
  }
  function DefaultBufferingIndicator() {
    return x`
    <div class="vds-buffering-indicator">
      <media-spinner class="vds-buffering-spinner"></media-spinner>
    </div>
  `;
  }
  function DefaultVideoMenus() {
    const { menuGroup, smallWhen: smWhen } = useDefaultLayoutContext(), $side = () => menuGroup() === "top" || smWhen() ? "bottom" : "top", $tooltip = computed(() => `${$side()} ${menuGroup() === "top" ? "end" : "center"}`), $placement = computed(() => `${$side()} end`);
    return [
      DefaultChaptersMenu({ tooltip: $tooltip, placement: $placement, portal: true }),
      DefaultSettingsMenu({ tooltip: $tooltip, placement: $placement, portal: true })
    ];
  }
  function DefaultVideoGestures() {
    return $signal(() => {
      const { noGestures } = useDefaultLayoutContext();
      if (noGestures()) return null;
      return x`
      <div class="vds-gestures">
        <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="pointerup"
          action="toggle:controls"
        ></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="dblpointerup"
          action="toggle:fullscreen"
        ></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
      </div>
    `;
    });
  }
  var DefaultVideoLayout, MediaVideoLayoutElement;
  var init_vidstack_video_layout = __esm({
    "node_modules/vidstack/prod/define/templates/vidstack-video-layout.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_C3gk_MR();
      init_vidstack_Cpte_fRf();
      init_vidstack_7xep0lg7();
      init_vidstack_CwTj4H1w();
      init_lit_html();
      init_keyed();
      init_vidstack_Ds_q5BGO();
      init_if_defined();
      init_ref();
      init_unsafe_svg();
      init_async_directive();
      DefaultVideoLayout = class extends DefaultLayout {
        static props = {
          ...super.props,
          when: ({ viewType }) => viewType === "video",
          smallWhen: ({ width, height }) => width < 576 || height < 380
        };
      };
      MediaVideoLayoutElement = class extends Host(LitElement, DefaultVideoLayout) {
        static tagName = "media-video-layout";
        static attrs = {
          smallWhen: {
            converter(value) {
              return value !== "never" && !!value;
            }
          }
        };
        #media;
        onSetup() {
          this.forwardKeepAlive = false;
          this.#media = useMediaContext();
          this.classList.add("vds-video-layout");
        }
        onConnect() {
          setLayoutName("video", () => this.isMatch);
          this.#setupMenuContainer();
        }
        render() {
          return $signal(this.#render.bind(this));
        }
        #setupMenuContainer() {
          const { menuPortal } = useDefaultLayoutContext();
          effect(() => {
            if (!this.isMatch) return;
            const container = createMenuContainer(
              this,
              this.menuContainer,
              "vds-video-layout",
              () => this.isSmallLayout
            ), roots = container ? [this, container] : [this];
            const iconsManager = this.$props.customIcons() ? new SlotManager(roots) : new DefaultLayoutIconsLoader(roots);
            iconsManager.connect();
            menuPortal.set(container);
            return () => {
              container.remove();
              menuPortal.set(null);
            };
          });
        }
        #render() {
          const { load } = this.#media.$props, { canLoad, streamType, nativeControls } = this.#media.$state;
          return !nativeControls() && this.isMatch ? load() === "play" && !canLoad() ? DefaultVideoLoadLayout() : streamType() === "unknown" ? DefaultBufferingIndicator() : this.isSmallLayout ? DefaultVideoLayoutSmall() : DefaultVideoLayoutLarge() : null;
        }
      };
    }
  });

  // node_modules/vidstack/prod/define/vidstack-player-default-layout.js
  var vidstack_player_default_layout_exports = {};
  var init_vidstack_player_default_layout = __esm({
    "node_modules/vidstack/prod/define/vidstack-player-default-layout.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_audio_layout();
      init_vidstack_video_layout();
      init_lit_html();
      init_if_defined();
      init_unsafe_svg();
      init_async_directive();
      init_ref();
      init_keyed();
      defineCustomElement(MediaAudioLayoutElement);
      defineCustomElement(MediaVideoLayoutElement);
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-B6fvfDkI.js
  function padNumberWithZeroes(num, expectedLength) {
    const str = String(num);
    const actualLength = str.length;
    const shouldPad = actualLength < expectedLength;
    if (shouldPad) {
      const padLength = expectedLength - actualLength;
      const padding = `0`.repeat(padLength);
      return `${padding}${num}`;
    }
    return str;
  }
  function parseTime(duration) {
    const hours = Math.trunc(duration / 3600);
    const minutes = Math.trunc(duration % 3600 / 60);
    const seconds = Math.trunc(duration % 60);
    const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
    return {
      hours,
      minutes,
      seconds,
      fraction
    };
  }
  function formatTime(duration, { padHrs = null, padMins = null, showHrs = false, showMs = false } = {}) {
    const { hours, minutes, seconds, fraction } = parseTime(duration), paddedHours = padHrs ? padNumberWithZeroes(hours, 2) : hours, paddedMinutes = padMins || isNull(padMins) && duration >= 3600 ? padNumberWithZeroes(minutes, 2) : minutes, paddedSeconds = padNumberWithZeroes(seconds, 2), paddedMs = showMs && fraction > 0 ? `.${String(fraction).replace(/^0?\./, "")}` : "", time = `${paddedMinutes}:${paddedSeconds}${paddedMs}`;
    return hours > 0 || showHrs ? `${paddedHours}:${time}` : time;
  }
  function formatSpokenTime(duration) {
    const spokenParts = [];
    const { hours, minutes, seconds } = parseTime(duration);
    if (hours > 0) {
      spokenParts.push(`${hours} hour`);
    }
    if (minutes > 0) {
      spokenParts.push(`${minutes} min`);
    }
    if (seconds > 0 || spokenParts.length === 0) {
      spokenParts.push(`${seconds} sec`);
    }
    return spokenParts.join(" ");
  }
  function calcRate(min2, max2, value) {
    const range = max2 - min2, offset2 = value - min2;
    return range > 0 ? offset2 / range : 0;
  }
  function getClampedValue(min2, max2, value, step) {
    return clampNumber(min2, round2(value, getNumberOfDecimalPlaces(step)), max2);
  }
  function getValueFromRate(min2, max2, rate, step) {
    const boundRate = clampNumber(0, rate, 1), range = max2 - min2, fill = range * boundRate, stepRatio = fill / step, steps = step * Math.round(stepRatio);
    return min2 + steps;
  }
  function updateSliderPreviewPlacement(el, {
    clamp: clamp2,
    offset: offset2,
    orientation
  }) {
    const computedStyle = getComputedStyle(el), width = parseFloat(computedStyle.width), height = parseFloat(computedStyle.height), styles = {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
    styles[orientation === "horizontal" ? "bottom" : "left"] = `calc(100% + var(--media-slider-preview-offset, ${offset2}px))`;
    if (orientation === "horizontal") {
      const widthHalf = width / 2;
      if (!clamp2) {
        styles.left = `calc(var(--slider-pointer) - ${widthHalf}px)`;
      } else {
        const leftClamp = `max(0px, calc(var(--slider-pointer) - ${widthHalf}px))`, rightClamp = `calc(100% - ${width}px)`;
        styles.left = `min(${leftClamp}, ${rightClamp})`;
      }
    } else {
      const heightHalf = height / 2;
      if (!clamp2) {
        styles.bottom = `calc(var(--slider-pointer) - ${heightHalf}px)`;
      } else {
        const topClamp = `max(${heightHalf}px, calc(var(--slider-pointer) - ${heightHalf}px))`, bottomClamp = `calc(100% - ${height}px)`;
        styles.bottom = `min(${topClamp}, ${bottomClamp})`;
      }
    }
    Object.assign(el.style, styles);
  }
  function scrollIntoView(el, options) {
    const scrolls = r(el, options);
    for (const { el: el2, top, left } of scrolls) {
      el2.scroll({ top, left, behavior: options.behavior });
    }
  }
  function scrollIntoCenter(el, options = {}) {
    scrollIntoView(el, {
      scrollMode: "if-needed",
      block: "center",
      inline: "center",
      ...options
    });
  }
  var ARIAKeyShortcuts, Popper, ToggleButtonController, AirPlayButton, PlayButton, CaptionButton, FullscreenButton, MuteButton, PIPButton, SeekButton, LiveButton, sliderState, IntersectionObserverController, sliderContext, sliderObserverContext, SliderKeyDirection, SliderEventsController, sliderValueFormatContext, SliderController, Slider, cache, pending, ThumbnailsLoader, Thumbnail, SliderValue, slidervalue__proto, SliderPreview, VolumeSlider, TimeSlider, menuContext, FOCUSABLE_ELEMENTS_SELECTOR, VALID_KEYS, MenuFocusController, __defProp2, __getOwnPropDesc, __decorateClass, idCount, Menu, MenuButton, menubutton__proto, MenuItem, MenuPortal2, menuPortalContext, MenuItems, radioControllerContext, RadioGroupController, Radio, radio__proto, AudioRadioGroup, audioradiogroup__proto, CaptionsRadioGroup, captionsradiogroup__proto, DEFAULT_PLAYBACK_RATES, SpeedRadioGroup, speedradiogroup__proto, QualityRadioGroup, qualityradiogroup__proto, Time;
  var init_vidstack_B6fvfDkI = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-B6fvfDkI.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_Cpte_fRf();
      init_vidstack_BOTZD4tC();
      init_vidstack_Ds_q5BGO();
      init_vidstack_oyBGi0R4();
      init_vidstack_DXXgp8ue();
      init_vidstack_Dihypf8P();
      init_vidstack_C9vIqaYT();
      init_vidstack_A9j_j6J();
      init_vidstack_DE4XvkHU();
      ARIAKeyShortcuts = class extends ViewController {
        #shortcut;
        constructor(shortcut) {
          super();
          this.#shortcut = shortcut;
        }
        onAttach(el) {
          const { $props, ariaKeys } = useMediaContext(), keys = el.getAttribute("aria-keyshortcuts");
          if (keys) {
            ariaKeys[this.#shortcut] = keys;
            {
              onDispose(() => {
                delete ariaKeys[this.#shortcut];
              });
            }
            return;
          }
          const shortcuts = $props.keyShortcuts()[this.#shortcut];
          if (shortcuts) {
            const keys2 = isArray(shortcuts) ? shortcuts.join(" ") : isString(shortcuts) ? shortcuts : shortcuts?.keys;
            el.setAttribute("aria-keyshortcuts", isArray(keys2) ? keys2.join(" ") : keys2);
          }
        }
      };
      Popper = class extends ViewController {
        #delegate;
        constructor(delegate) {
          super();
          this.#delegate = delegate;
          effect(this.#watchTrigger.bind(this));
        }
        onDestroy() {
          this.#stopAnimationEndListener?.();
          this.#stopAnimationEndListener = null;
        }
        #watchTrigger() {
          const trigger = this.#delegate.trigger();
          if (!trigger) {
            this.hide();
            return;
          }
          const show = this.show.bind(this), hide2 = this.hide.bind(this);
          this.#delegate.listen(trigger, show, hide2);
        }
        #showTimerId = -1;
        #hideRafId = -1;
        #stopAnimationEndListener = null;
        show(trigger) {
          this.#cancelShowing();
          window.cancelAnimationFrame(this.#hideRafId);
          this.#hideRafId = -1;
          this.#stopAnimationEndListener?.();
          this.#stopAnimationEndListener = null;
          this.#showTimerId = window.setTimeout(() => {
            this.#showTimerId = -1;
            const content = this.#delegate.content();
            if (content) content.style.removeProperty("display");
            peek(() => this.#delegate.onChange(true, trigger));
          }, this.#delegate.showDelay?.() ?? 0);
        }
        hide(trigger) {
          this.#cancelShowing();
          peek(() => this.#delegate.onChange(false, trigger));
          this.#hideRafId = requestAnimationFrame(() => {
            this.#cancelShowing();
            this.#hideRafId = -1;
            const content = this.#delegate.content();
            if (content) {
              const onHide = () => {
                content.style.display = "none";
                this.#stopAnimationEndListener = null;
              };
              const isAnimated = hasAnimation(content);
              if (isAnimated) {
                this.#stopAnimationEndListener?.();
                const stop = listenEvent(content, "animationend", onHide, { once: true });
                this.#stopAnimationEndListener = stop;
              } else {
                onHide();
              }
            }
          });
        }
        #cancelShowing() {
          window.clearTimeout(this.#showTimerId);
          this.#showTimerId = -1;
        }
      };
      ToggleButtonController = class extends ViewController {
        static props = {
          disabled: false
        };
        #delegate;
        constructor(delegate) {
          super();
          this.#delegate = delegate;
          new FocusVisibleController();
          if (delegate.keyShortcut) {
            new ARIAKeyShortcuts(delegate.keyShortcut);
          }
        }
        onSetup() {
          const { disabled } = this.$props;
          this.setAttributes({
            "data-pressed": this.#delegate.isPresssed,
            "aria-pressed": this.#isARIAPressed.bind(this),
            "aria-disabled": () => disabled() ? "true" : null
          });
        }
        onAttach(el) {
          setAttributeIfEmpty(el, "tabindex", "0");
          setAttributeIfEmpty(el, "role", "button");
          setAttributeIfEmpty(el, "type", "button");
        }
        onConnect(el) {
          const events = onPress(el, this.#onMaybePress.bind(this));
          for (const type of ["click", "touchstart"]) {
            events.add(type, this.#onInteraction.bind(this), {
              passive: true
            });
          }
        }
        #isARIAPressed() {
          return ariaBool(this.#delegate.isPresssed());
        }
        #onPressed(event2) {
          if (isWriteSignal(this.#delegate.isPresssed)) {
            this.#delegate.isPresssed.set((p2) => !p2);
          }
        }
        #onMaybePress(event2) {
          const disabled = this.$props.disabled() || this.el.hasAttribute("data-disabled");
          if (disabled) {
            event2.preventDefault();
            event2.stopImmediatePropagation();
            return;
          }
          event2.preventDefault();
          (this.#delegate.onPress ?? this.#onPressed).call(this, event2);
        }
        #onInteraction(event2) {
          if (this.$props.disabled()) {
            event2.preventDefault();
            event2.stopImmediatePropagation();
          }
        }
      };
      AirPlayButton = class extends Component {
        static props = ToggleButtonController.props;
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          const { canAirPlay, isAirPlayConnected } = this.#media.$state;
          this.setAttributes({
            "data-active": isAirPlayConnected,
            "data-supported": canAirPlay,
            "data-state": this.#getState.bind(this),
            "aria-hidden": $ariaBool(() => !canAirPlay())
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-tooltip", "airplay");
          setARIALabel(el, this.#getDefaultLabel.bind(this));
        }
        #onPress(event2) {
          const remote = this.#media.remote;
          remote.requestAirPlay(event2);
        }
        #isPressed() {
          const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
          return remotePlaybackType() === "airplay" && remotePlaybackState() !== "disconnected";
        }
        #getState() {
          const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
          return remotePlaybackType() === "airplay" && remotePlaybackState();
        }
        #getDefaultLabel() {
          const { remotePlaybackState } = this.#media.$state;
          return `AirPlay ${remotePlaybackState()}`;
        }
      };
      PlayButton = class extends Component {
        static props = ToggleButtonController.props;
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            keyShortcut: "togglePaused",
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          const { paused, ended } = this.#media.$state;
          this.setAttributes({
            "data-paused": paused,
            "data-ended": ended
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-tooltip", "play");
          setARIALabel(el, "Play");
        }
        #onPress(event2) {
          const remote = this.#media.remote;
          this.#isPressed() ? remote.pause(event2) : remote.play(event2);
        }
        #isPressed() {
          const { paused } = this.#media.$state;
          return !paused();
        }
      };
      CaptionButton = class extends Component {
        static props = ToggleButtonController.props;
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            keyShortcut: "toggleCaptions",
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          this.setAttributes({
            "data-active": this.#isPressed.bind(this),
            "data-supported": () => !this.#isHidden(),
            "aria-hidden": $ariaBool(this.#isHidden.bind(this))
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-tooltip", "caption");
          setARIALabel(el, "Captions");
        }
        #onPress(event2) {
          this.#media.remote.toggleCaptions(event2);
        }
        #isPressed() {
          const { textTrack } = this.#media.$state, track = textTrack();
          return !!track && isTrackCaptionKind(track);
        }
        #isHidden() {
          const { hasCaptions } = this.#media.$state;
          return !hasCaptions();
        }
      };
      FullscreenButton = class extends Component {
        static props = {
          ...ToggleButtonController.props,
          target: "prefer-media"
        };
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            keyShortcut: "toggleFullscreen",
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          const { fullscreen } = this.#media.$state, isSupported = this.#isSupported.bind(this);
          this.setAttributes({
            "data-active": fullscreen,
            "data-supported": isSupported,
            "aria-hidden": $ariaBool(() => !isSupported())
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-tooltip", "fullscreen");
          setARIALabel(el, "Fullscreen");
        }
        #onPress(event2) {
          const remote = this.#media.remote, target = this.$props.target();
          this.#isPressed() ? remote.exitFullscreen(target, event2) : remote.enterFullscreen(target, event2);
        }
        #isPressed() {
          const { fullscreen } = this.#media.$state;
          return fullscreen();
        }
        #isSupported() {
          const { canFullscreen } = this.#media.$state;
          return canFullscreen();
        }
      };
      MuteButton = class extends Component {
        static props = ToggleButtonController.props;
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            keyShortcut: "toggleMuted",
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          this.setAttributes({
            "data-muted": this.#isPressed.bind(this),
            "data-state": this.#getState.bind(this)
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-mute-button", "");
          el.setAttribute("data-media-tooltip", "mute");
          setARIALabel(el, "Mute");
        }
        #onPress(event2) {
          const remote = this.#media.remote;
          this.#isPressed() ? remote.unmute(event2) : remote.mute(event2);
        }
        #isPressed() {
          const { muted, volume } = this.#media.$state;
          return muted() || volume() === 0;
        }
        #getState() {
          const { muted, volume } = this.#media.$state, $volume = volume();
          if (muted() || $volume === 0) return "muted";
          else if ($volume >= 0.5) return "high";
          else if ($volume < 0.5) return "low";
        }
      };
      PIPButton = class extends Component {
        static props = ToggleButtonController.props;
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            keyShortcut: "togglePictureInPicture",
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          const { pictureInPicture } = this.#media.$state, isSupported = this.#isSupported.bind(this);
          this.setAttributes({
            "data-active": pictureInPicture,
            "data-supported": isSupported,
            "aria-hidden": $ariaBool(() => !isSupported())
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-tooltip", "pip");
          setARIALabel(el, "PiP");
        }
        #onPress(event2) {
          const remote = this.#media.remote;
          this.#isPressed() ? remote.exitPictureInPicture(event2) : remote.enterPictureInPicture(event2);
        }
        #isPressed() {
          const { pictureInPicture } = this.#media.$state;
          return pictureInPicture();
        }
        #isSupported() {
          const { canPictureInPicture } = this.#media.$state;
          return canPictureInPicture();
        }
      };
      SeekButton = class extends Component {
        static props = {
          disabled: false,
          seconds: 30
        };
        #media;
        constructor() {
          super();
          new FocusVisibleController();
        }
        onSetup() {
          this.#media = useMediaContext();
          const { seeking } = this.#media.$state, { seconds } = this.$props, isSupported = this.#isSupported.bind(this);
          this.setAttributes({
            seconds,
            "data-seeking": seeking,
            "data-supported": isSupported,
            "aria-hidden": $ariaBool(() => !isSupported())
          });
        }
        onAttach(el) {
          setAttributeIfEmpty(el, "tabindex", "0");
          setAttributeIfEmpty(el, "role", "button");
          setAttributeIfEmpty(el, "type", "button");
          el.setAttribute("data-media-tooltip", "seek");
          setARIALabel(el, this.#getDefaultLabel.bind(this));
        }
        onConnect(el) {
          onPress(el, this.#onPress.bind(this));
        }
        #isSupported() {
          const { canSeek } = this.#media.$state;
          return canSeek();
        }
        #getDefaultLabel() {
          const { seconds } = this.$props;
          return `Seek ${seconds() > 0 ? "forward" : "backward"} ${seconds()} seconds`;
        }
        #onPress(event2) {
          const { seconds, disabled } = this.$props;
          if (disabled()) return;
          const { currentTime } = this.#media.$state, seekTo = currentTime() + seconds();
          this.#media.remote.seek(seekTo, event2);
        }
      };
      LiveButton = class extends Component {
        static props = {
          disabled: false
        };
        #media;
        constructor() {
          super();
          new FocusVisibleController();
        }
        onSetup() {
          this.#media = useMediaContext();
          const { disabled } = this.$props, { live, liveEdge } = this.#media.$state, isHidden = () => !live();
          this.setAttributes({
            "data-edge": liveEdge,
            "data-hidden": isHidden,
            "aria-disabled": $ariaBool(() => disabled() || liveEdge()),
            "aria-hidden": $ariaBool(isHidden)
          });
        }
        onAttach(el) {
          setAttributeIfEmpty(el, "tabindex", "0");
          setAttributeIfEmpty(el, "role", "button");
          setAttributeIfEmpty(el, "type", "button");
          el.setAttribute("data-media-tooltip", "live");
        }
        onConnect(el) {
          onPress(el, this.#onPress.bind(this));
        }
        #onPress(event2) {
          const { disabled } = this.$props, { liveEdge } = this.#media.$state;
          if (disabled() || liveEdge()) return;
          this.#media.remote.seekToLiveEdge(event2);
        }
      };
      sliderState = new State({
        min: 0,
        max: 100,
        value: 0,
        step: 1,
        pointerValue: 0,
        focused: false,
        dragging: false,
        pointing: false,
        hidden: false,
        get active() {
          return this.dragging || this.focused || this.pointing;
        },
        get fillRate() {
          return calcRate(this.min, this.max, this.value);
        },
        get fillPercent() {
          return this.fillRate * 100;
        },
        get pointerRate() {
          return calcRate(this.min, this.max, this.pointerValue);
        },
        get pointerPercent() {
          return this.pointerRate * 100;
        }
      });
      IntersectionObserverController = class extends ViewController {
        #init;
        #observer;
        constructor(init) {
          super();
          this.#init = init;
        }
        onConnect(el) {
          this.#observer = new IntersectionObserver((entries) => {
            this.#init.callback?.(entries, this.#observer);
          }, this.#init);
          this.#observer.observe(el);
          onDispose(this.#onDisconnect.bind(this));
        }
        /**
         * Disconnect any active intersection observers.
         */
        #onDisconnect() {
          this.#observer?.disconnect();
          this.#observer = void 0;
        }
      };
      sliderContext = createContext();
      sliderObserverContext = createContext();
      SliderKeyDirection = {
        Left: -1,
        ArrowLeft: -1,
        Up: 1,
        ArrowUp: 1,
        Right: 1,
        ArrowRight: 1,
        Down: -1,
        ArrowDown: -1
      };
      SliderEventsController = class extends ViewController {
        #delegate;
        #media;
        #observer;
        constructor(delegate, media) {
          super();
          this.#delegate = delegate;
          this.#media = media;
        }
        onSetup() {
          if (hasProvidedContext(sliderObserverContext)) {
            this.#observer = useContext(sliderObserverContext);
          }
        }
        onConnect(el) {
          effect(this.#attachEventListeners.bind(this, el));
          effect(this.#attachPointerListeners.bind(this, el));
          if (this.#delegate.swipeGesture) effect(this.#watchSwipeGesture.bind(this));
        }
        #watchSwipeGesture() {
          const { pointer } = this.#media.$state;
          if (pointer() !== "coarse" || !this.#delegate.swipeGesture()) {
            this.#provider = null;
            return;
          }
          this.#provider = this.#media.player.el?.querySelector(
            "media-provider,[data-media-provider]"
          );
          if (!this.#provider) return;
          new EventsController(this.#provider).add("touchstart", this.#onTouchStart.bind(this), {
            passive: true
          }).add("touchmove", this.#onTouchMove.bind(this), { passive: false });
        }
        #provider = null;
        #touch = null;
        #touchStartValue = null;
        #onTouchStart(event2) {
          this.#touch = event2.touches[0];
        }
        #onTouchMove(event2) {
          if (isNull(this.#touch) || isTouchPinchEvent(event2)) return;
          const touch = event2.touches[0], xDiff = touch.clientX - this.#touch.clientX, yDiff = touch.clientY - this.#touch.clientY, isDragging = this.$state.dragging();
          if (!isDragging && Math.abs(yDiff) > 5) {
            return;
          }
          if (isDragging) return;
          event2.preventDefault();
          if (Math.abs(xDiff) > 20) {
            this.#touch = touch;
            this.#touchStartValue = this.$state.value();
            this.#onStartDragging(this.#touchStartValue, event2);
          }
        }
        #attachEventListeners(el) {
          const { hidden } = this.$props;
          listenEvent(el, "focus", this.#onFocus.bind(this));
          if (hidden() || this.#delegate.isDisabled()) return;
          new EventsController(el).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this)).add("pointerenter", this.#onPointerEnter.bind(this)).add("pointermove", this.#onPointerMove.bind(this)).add("pointerleave", this.#onPointerLeave.bind(this)).add("pointerdown", this.#onPointerDown.bind(this));
        }
        #attachPointerListeners(el) {
          if (this.#delegate.isDisabled() || !this.$state.dragging()) return;
          new EventsController(document).add("pointerup", this.#onDocumentPointerUp.bind(this), { capture: true }).add("pointermove", this.#onDocumentPointerMove.bind(this)).add("touchmove", this.#onDocumentTouchMove.bind(this), {
            passive: false
          });
        }
        #onFocus() {
          this.#updatePointerValue(this.$state.value());
        }
        #updateValue(newValue, trigger) {
          const { value, min: min2, max: max2, dragging } = this.$state;
          const clampedValue = Math.max(min2(), Math.min(newValue, max2()));
          value.set(clampedValue);
          const event2 = this.createEvent("value-change", { detail: clampedValue, trigger });
          this.dispatch(event2);
          this.#delegate.onValueChange?.(event2);
          if (dragging()) {
            const event22 = this.createEvent("drag-value-change", { detail: clampedValue, trigger });
            this.dispatch(event22);
            this.#delegate.onDragValueChange?.(event22);
          }
        }
        #updatePointerValue(value, trigger) {
          const { pointerValue, dragging } = this.$state;
          pointerValue.set(value);
          this.dispatch("pointer-value-change", { detail: value, trigger });
          if (dragging()) {
            this.#updateValue(value, trigger);
          }
        }
        #getPointerValue(event2) {
          let thumbPositionRate, rect = this.el.getBoundingClientRect(), { min: min2, max: max2 } = this.$state;
          if (this.$props.orientation() === "vertical") {
            const { bottom: trackBottom, height: trackHeight } = rect;
            thumbPositionRate = (trackBottom - event2.clientY) / trackHeight;
          } else {
            if (this.#touch && isNumber(this.#touchStartValue)) {
              const { width } = this.#provider.getBoundingClientRect(), rate = (event2.clientX - this.#touch.clientX) / width, range = max2() - min2(), diff = range * Math.abs(rate);
              thumbPositionRate = (rate < 0 ? this.#touchStartValue - diff : this.#touchStartValue + diff) / range;
            } else {
              const { left: trackLeft, width: trackWidth } = rect;
              thumbPositionRate = (event2.clientX - trackLeft) / trackWidth;
            }
          }
          return Math.max(
            min2(),
            Math.min(
              max2(),
              this.#delegate.roundValue(
                getValueFromRate(min2(), max2(), thumbPositionRate, this.#delegate.getStep())
              )
            )
          );
        }
        #onPointerEnter(event2) {
          this.$state.pointing.set(true);
        }
        #onPointerMove(event2) {
          const { dragging } = this.$state;
          if (dragging()) return;
          this.#updatePointerValue(this.#getPointerValue(event2), event2);
        }
        #onPointerLeave(event2) {
          this.$state.pointing.set(false);
        }
        #onPointerDown(event2) {
          if (event2.button !== 0) return;
          const value = this.#getPointerValue(event2);
          this.#onStartDragging(value, event2);
          this.#updatePointerValue(value, event2);
        }
        #onStartDragging(value, trigger) {
          const { dragging } = this.$state;
          if (dragging()) return;
          dragging.set(true);
          this.#media.remote.pauseControls(trigger);
          const event2 = this.createEvent("drag-start", { detail: value, trigger });
          this.dispatch(event2);
          this.#delegate.onDragStart?.(event2);
          this.#observer?.onDragStart?.();
        }
        #onStopDragging(value, trigger) {
          const { dragging } = this.$state;
          if (!dragging()) return;
          dragging.set(false);
          this.#media.remote.resumeControls(trigger);
          const event2 = this.createEvent("drag-end", { detail: value, trigger });
          this.dispatch(event2);
          this.#delegate.onDragEnd?.(event2);
          this.#touch = null;
          this.#touchStartValue = null;
          this.#observer?.onDragEnd?.();
        }
        // -------------------------------------------------------------------------------------------
        // Keyboard Events
        // -------------------------------------------------------------------------------------------
        #lastDownKey;
        #repeatedKeys = false;
        #onKeyDown(event2) {
          const isValidKey = Object.keys(SliderKeyDirection).includes(event2.key);
          if (!isValidKey) return;
          const { key: key2 } = event2, jumpValue = this.#calcJumpValue(event2);
          if (!isNull(jumpValue)) {
            this.#updatePointerValue(jumpValue, event2);
            this.#updateValue(jumpValue, event2);
            return;
          }
          const newValue = this.#calcNewKeyValue(event2);
          if (!this.#repeatedKeys) {
            this.#repeatedKeys = key2 === this.#lastDownKey;
            if (!this.$state.dragging() && this.#repeatedKeys) {
              this.#onStartDragging(newValue, event2);
            }
          }
          this.#updatePointerValue(newValue, event2);
          this.#lastDownKey = key2;
        }
        #onKeyUp(event2) {
          const isValidKey = Object.keys(SliderKeyDirection).includes(event2.key);
          if (!isValidKey || !isNull(this.#calcJumpValue(event2))) return;
          const newValue = this.#repeatedKeys ? this.$state.pointerValue() : this.#calcNewKeyValue(event2);
          this.#updateValue(newValue, event2);
          this.#onStopDragging(newValue, event2);
          this.#lastDownKey = "";
          this.#repeatedKeys = false;
        }
        #calcJumpValue(event2) {
          let key2 = event2.key, { min: min2, max: max2 } = this.$state;
          if (key2 === "Home" || key2 === "PageUp") {
            return min2();
          } else if (key2 === "End" || key2 === "PageDown") {
            return max2();
          } else if (!event2.metaKey && /^[0-9]$/.test(key2)) {
            return (max2() - min2()) / 10 * Number(key2);
          }
          return null;
        }
        #calcNewKeyValue(event2) {
          const { key: key2, shiftKey } = event2;
          event2.preventDefault();
          event2.stopPropagation();
          const { shiftKeyMultiplier } = this.$props;
          const { min: min2, max: max2, value, pointerValue } = this.$state, step = this.#delegate.getStep(), keyStep = this.#delegate.getKeyStep();
          const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key2]), diff = modifiedStep * direction, currentValue = this.#repeatedKeys ? pointerValue() : this.#delegate.getValue?.() ?? value(), steps = (currentValue + diff) / step;
          return Math.max(min2(), Math.min(max2(), Number((step * steps).toFixed(3))));
        }
        // -------------------------------------------------------------------------------------------
        // Document (Pointer Events)
        // -------------------------------------------------------------------------------------------
        #onDocumentPointerUp(event2) {
          if (event2.button !== 0) return;
          event2.preventDefault();
          event2.stopImmediatePropagation();
          const value = this.#getPointerValue(event2);
          this.#updatePointerValue(value, event2);
          this.#onStopDragging(value, event2);
        }
        #onDocumentTouchMove(event2) {
          event2.preventDefault();
        }
        #onDocumentPointerMove = functionThrottle(
          (event2) => {
            this.#updatePointerValue(this.#getPointerValue(event2), event2);
          },
          20,
          { leading: true }
        );
      };
      sliderValueFormatContext = createContext(() => ({}));
      SliderController = class extends ViewController {
        static props = {
          hidden: false,
          disabled: false,
          step: 1,
          keyStep: 1,
          orientation: "horizontal",
          shiftKeyMultiplier: 5
        };
        #media;
        #delegate;
        #isVisible = signal(true);
        #isIntersecting = signal(true);
        constructor(delegate) {
          super();
          this.#delegate = delegate;
        }
        onSetup() {
          this.#media = useMediaContext();
          const focus = new FocusVisibleController();
          focus.attach(this);
          this.$state.focused = focus.focused.bind(focus);
          if (!hasProvidedContext(sliderValueFormatContext)) {
            provideContext(sliderValueFormatContext, {
              default: "value"
            });
          }
          provideContext(sliderContext, {
            orientation: this.$props.orientation,
            disabled: this.#delegate.isDisabled,
            preview: signal(null)
          });
          effect(this.#watchValue.bind(this));
          effect(this.#watchStep.bind(this));
          effect(this.#watchDisabled.bind(this));
          this.#setupAttrs();
          new SliderEventsController(this.#delegate, this.#media).attach(this);
          new IntersectionObserverController({
            callback: this.#onIntersectionChange.bind(this)
          }).attach(this);
        }
        onAttach(el) {
          setAttributeIfEmpty(el, "role", "slider");
          setAttributeIfEmpty(el, "tabindex", "0");
          setAttributeIfEmpty(el, "autocomplete", "off");
          effect(this.#watchCSSVars.bind(this));
        }
        onConnect(el) {
          onDispose(observeVisibility(el, this.#isVisible.set));
          effect(this.#watchHidden.bind(this));
        }
        #onIntersectionChange(entries) {
          this.#isIntersecting.set(entries[0].isIntersecting);
        }
        // -------------------------------------------------------------------------------------------
        // Watch
        // -------------------------------------------------------------------------------------------
        #watchHidden() {
          const { hidden } = this.$props;
          this.$state.hidden.set(hidden() || !this.#isVisible() || !this.#isIntersecting.bind(this));
        }
        #watchValue() {
          const { dragging, value, min: min2, max: max2 } = this.$state;
          if (peek(dragging)) return;
          value.set(getClampedValue(min2(), max2(), value(), this.#delegate.getStep()));
        }
        #watchStep() {
          this.$state.step.set(this.#delegate.getStep());
        }
        #watchDisabled() {
          if (!this.#delegate.isDisabled()) return;
          const { dragging, pointing } = this.$state;
          dragging.set(false);
          pointing.set(false);
        }
        // -------------------------------------------------------------------------------------------
        // ARIA
        // -------------------------------------------------------------------------------------------
        #getARIADisabled() {
          return ariaBool(this.#delegate.isDisabled());
        }
        // -------------------------------------------------------------------------------------------
        // Attributes
        // -------------------------------------------------------------------------------------------
        #setupAttrs() {
          const { orientation } = this.$props, { dragging, active, pointing } = this.$state;
          this.setAttributes({
            "data-dragging": dragging,
            "data-pointing": pointing,
            "data-active": active,
            "aria-disabled": this.#getARIADisabled.bind(this),
            "aria-valuemin": this.#delegate.aria.valueMin ?? this.$state.min,
            "aria-valuemax": this.#delegate.aria.valueMax ?? this.$state.max,
            "aria-valuenow": this.#delegate.aria.valueNow,
            "aria-valuetext": this.#delegate.aria.valueText,
            "aria-orientation": orientation
          });
        }
        #watchCSSVars() {
          const { fillPercent, pointerPercent } = this.$state;
          this.#updateSliderVars(round2(fillPercent(), 3), round2(pointerPercent(), 3));
        }
        #updateSliderVars = animationFrameThrottle((fillPercent, pointerPercent) => {
          this.el?.style.setProperty("--slider-fill", fillPercent + "%");
          this.el?.style.setProperty("--slider-pointer", pointerPercent + "%");
        });
      };
      Slider = class extends Component {
        static props = {
          ...SliderController.props,
          min: 0,
          max: 100,
          value: 0
        };
        static state = sliderState;
        constructor() {
          super();
          new SliderController({
            getStep: this.$props.step,
            getKeyStep: this.$props.keyStep,
            roundValue: Math.round,
            isDisabled: this.$props.disabled,
            aria: {
              valueNow: this.#getARIAValueNow.bind(this),
              valueText: this.#getARIAValueText.bind(this)
            }
          });
        }
        onSetup() {
          effect(this.#watchValue.bind(this));
          effect(this.#watchMinMax.bind(this));
        }
        // -------------------------------------------------------------------------------------------
        // Props
        // -------------------------------------------------------------------------------------------
        #getARIAValueNow() {
          const { value } = this.$state;
          return Math.round(value());
        }
        #getARIAValueText() {
          const { value, max: max2 } = this.$state;
          return round2(value() / max2() * 100, 2) + "%";
        }
        // -------------------------------------------------------------------------------------------
        // Watch
        // -------------------------------------------------------------------------------------------
        #watchValue() {
          const { value } = this.$props;
          this.$state.value.set(value());
        }
        #watchMinMax() {
          const { min: min2, max: max2 } = this.$props;
          this.$state.min.set(min2());
          this.$state.max.set(max2());
        }
      };
      cache = /* @__PURE__ */ new Map();
      pending = /* @__PURE__ */ new Map();
      ThumbnailsLoader = class _ThumbnailsLoader {
        #media;
        #src;
        #crossOrigin;
        $images = signal([]);
        static create(src, crossOrigin) {
          const media = useMediaContext();
          return new _ThumbnailsLoader(src, crossOrigin, media);
        }
        constructor(src, crossOrigin, media) {
          this.#src = src;
          this.#crossOrigin = crossOrigin;
          this.#media = media;
          effect(this.#onLoadCues.bind(this));
        }
        #onLoadCues() {
          const { canLoad } = this.#media.$state;
          if (!canLoad()) return;
          const src = this.#src();
          if (!src) return;
          if (isString(src) && cache.has(src)) {
            const cues = cache.get(src);
            cache.delete(src);
            cache.set(src, cues);
            if (cache.size > 99) {
              const firstKey = cache.keys().next().value;
              cache.delete(firstKey);
            }
            this.$images.set(cache.get(src));
          } else if (isString(src)) {
            const crossOrigin = this.#crossOrigin(), currentKey = src + "::" + crossOrigin;
            if (!pending.has(currentKey)) {
              const promise = new Promise(async (resolve, reject) => {
                try {
                  const response = await fetch(src, {
                    credentials: getRequestCredentials(crossOrigin)
                  }), isJSON = response.headers.get("content-type") === "application/json";
                  if (isJSON) {
                    const json = await response.json();
                    if (isArray(json)) {
                      if (json[0] && "text" in json[0]) {
                        resolve(this.#processVTTCues(json));
                      } else {
                        for (let i4 = 0; i4 < json.length; i4++) {
                          const image = json[i4];
                          assert(isObject(image), false);
                          assert(
                            "url" in image && isString(image.url),
                            false
                          );
                          assert(
                            "startTime" in image && isNumber(image.startTime),
                            false
                          );
                        }
                        resolve(json);
                      }
                    } else {
                      resolve(this.#processStoryboard(json));
                    }
                    return;
                  }
                  Promise.resolve().then(() => (init_prod2(), prod_exports)).then(async ({ parseResponse: parseResponse2 }) => {
                    try {
                      const { cues } = await parseResponse2(response);
                      resolve(this.#processVTTCues(cues));
                    } catch (e6) {
                      reject(e6);
                    }
                  });
                } catch (e6) {
                  reject(e6);
                }
              }).then((images) => {
                cache.set(currentKey, images);
                return images;
              }).catch((error) => {
                this.#onError(src, error);
              }).finally(() => {
                if (isString(currentKey)) pending.delete(currentKey);
              });
              pending.set(currentKey, promise);
            }
            pending.get(currentKey)?.then((images) => {
              this.$images.set(images || []);
            });
          } else if (isArray(src)) {
            try {
              this.$images.set(this.#processImages(src));
            } catch (error) {
              this.#onError(src, error);
            }
          } else {
            try {
              this.$images.set(this.#processStoryboard(src));
            } catch (error) {
              this.#onError(src, error);
            }
          }
          return () => {
            this.$images.set([]);
          };
        }
        #processImages(images) {
          const baseURL = this.#resolveBaseUrl();
          return images.map((img, i4) => {
            assert(
              img.url && isString(img.url)
            );
            assert(
              "startTime" in img && isNumber(img.startTime)
            );
            return {
              ...img,
              url: isString(img.url) ? this.#resolveURL(img.url, baseURL) : img.url
            };
          });
        }
        #processStoryboard(board) {
          assert(isString(board.url));
          assert(isArray(board.tiles) && board.tiles?.length);
          const url = new URL(board.url), images = [];
          const tileWidth = "tile_width" in board ? board.tile_width : board.tileWidth, tileHeight = "tile_height" in board ? board.tile_height : board.tileHeight;
          for (const tile of board.tiles) {
            images.push({
              url,
              startTime: "start" in tile ? tile.start : tile.startTime,
              width: tileWidth,
              height: tileHeight,
              coords: { x: tile.x, y: tile.y }
            });
          }
          return images;
        }
        #processVTTCues(cues) {
          for (let i4 = 0; i4 < cues.length; i4++) {
            const cue = cues[i4];
            assert(
              "startTime" in cue && isNumber(cue.startTime)
            );
            assert(
              "text" in cue && isString(cue.text)
            );
          }
          const images = [], baseURL = this.#resolveBaseUrl();
          for (const cue of cues) {
            const [url, hash] = cue.text.split("#"), data = this.#resolveData(hash);
            images.push({
              url: this.#resolveURL(url, baseURL),
              startTime: cue.startTime,
              endTime: cue.endTime,
              width: data?.w,
              height: data?.h,
              coords: data && isNumber(data.x) && isNumber(data.y) ? { x: data.x, y: data.y } : void 0
            });
          }
          return images;
        }
        #resolveBaseUrl() {
          let baseURL = peek(this.#src);
          if (!isString(baseURL) || !/^https?:/.test(baseURL)) {
            return location.href;
          }
          return baseURL;
        }
        #resolveURL(src, baseURL) {
          return /^https?:/.test(src) ? new URL(src) : new URL(src, baseURL);
        }
        #resolveData(hash) {
          if (!hash) return {};
          const [hashProps, values] = hash.split("="), hashValues = values?.split(","), data = {};
          if (!hashProps || !hashValues) {
            return null;
          }
          for (let i4 = 0; i4 < hashProps.length; i4++) {
            const value = +hashValues[i4];
            if (!isNaN(value)) data[hashProps[i4]] = value;
          }
          return data;
        }
        #onError(src, error) {
          return;
        }
      };
      Thumbnail = class extends Component {
        static props = {
          src: null,
          time: 0,
          crossOrigin: null
        };
        static state = new State({
          src: "",
          img: null,
          thumbnails: [],
          activeThumbnail: null,
          crossOrigin: null,
          loading: false,
          error: null,
          hidden: false
        });
        media;
        #loader;
        #styleResets = [];
        onSetup() {
          this.media = useMediaContext();
          this.#loader = ThumbnailsLoader.create(this.$props.src, this.$state.crossOrigin);
          this.#watchCrossOrigin();
          this.setAttributes({
            "data-loading": this.#isLoading.bind(this),
            "data-error": this.#hasError.bind(this),
            "data-hidden": this.$state.hidden,
            "aria-hidden": $ariaBool(this.$state.hidden)
          });
        }
        onConnect(el) {
          effect(this.#watchImg.bind(this));
          effect(this.#watchHidden.bind(this));
          effect(this.#watchCrossOrigin.bind(this));
          effect(this.#onLoadStart.bind(this));
          effect(this.#onFindActiveThumbnail.bind(this));
          effect(this.#resize.bind(this));
        }
        #watchImg() {
          const img = this.$state.img();
          if (!img) return;
          new EventsController(img).add("load", this.#onLoaded.bind(this)).add("error", this.#onError.bind(this));
        }
        #watchCrossOrigin() {
          const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
          crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
        }
        #onLoadStart() {
          const { src, loading, error } = this.$state;
          if (src()) {
            loading.set(true);
            error.set(null);
          }
          return () => {
            this.#resetStyles();
            loading.set(false);
            error.set(null);
          };
        }
        #onLoaded() {
          const { loading, error } = this.$state;
          this.#resize();
          loading.set(false);
          error.set(null);
        }
        #onError(event2) {
          const { loading, error } = this.$state;
          loading.set(false);
          error.set(event2);
        }
        #isLoading() {
          const { loading, hidden } = this.$state;
          return !hidden() && loading();
        }
        #hasError() {
          const { error } = this.$state;
          return !isNull(error());
        }
        #watchHidden() {
          const { hidden } = this.$state, { duration } = this.media.$state, images = this.#loader.$images();
          hidden.set(this.#hasError() || !Number.isFinite(duration()) || images.length === 0);
        }
        getTime() {
          return this.$props.time();
        }
        #onFindActiveThumbnail() {
          let images = this.#loader.$images();
          if (!images.length) return;
          let time = this.getTime(), { src, activeThumbnail } = this.$state, activeIndex = -1, activeImage = null;
          for (let i4 = images.length - 1; i4 >= 0; i4--) {
            const image = images[i4];
            if (time >= image.startTime && (!image.endTime || time < image.endTime)) {
              activeIndex = i4;
              break;
            }
          }
          if (images[activeIndex]) {
            activeImage = images[activeIndex];
          }
          activeThumbnail.set(activeImage);
          src.set(activeImage?.url.href || "");
        }
        #resize() {
          if (!this.scope || this.$state.hidden()) return;
          const rootEl = this.el, imgEl = this.$state.img(), thumbnail = this.$state.activeThumbnail();
          if (!imgEl || !thumbnail || !rootEl) return;
          let width = thumbnail.width ?? imgEl.naturalWidth, height = thumbnail?.height ?? imgEl.naturalHeight, {
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
            width: elWidth,
            height: elHeight
          } = getComputedStyle(this.el);
          if (minWidth === "100%") minWidth = parseFloat(elWidth) + "";
          if (minHeight === "100%") minHeight = parseFloat(elHeight) + "";
          let minRatio = Math.max(parseInt(minWidth) / width, parseInt(minHeight) / height), maxRatio = Math.min(
            Math.max(parseInt(minWidth), parseInt(maxWidth)) / width,
            Math.max(parseInt(minHeight), parseInt(maxHeight)) / height
          ), scale = !isNaN(maxRatio) && maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;
          this.#style(rootEl, "--thumbnail-width", `${width * scale}px`);
          this.#style(rootEl, "--thumbnail-height", `${height * scale}px`);
          this.#style(rootEl, "--thumbnail-aspect-ratio", String(round2(width / height, 5)));
          this.#style(imgEl, "width", `${imgEl.naturalWidth * scale}px`);
          this.#style(imgEl, "height", `${imgEl.naturalHeight * scale}px`);
          this.#style(
            imgEl,
            "transform",
            thumbnail.coords ? `translate(-${thumbnail.coords.x * scale}px, -${thumbnail.coords.y * scale}px)` : ""
          );
          this.#style(imgEl, "max-width", "none");
        }
        #style(el, name, value) {
          el.style.setProperty(name, value);
          this.#styleResets.push(() => el.style.removeProperty(name));
        }
        #resetStyles() {
          for (const reset of this.#styleResets) reset();
          this.#styleResets = [];
        }
      };
      SliderValue = class extends Component {
        static props = {
          type: "pointer",
          format: null,
          showHours: false,
          showMs: false,
          padHours: null,
          padMinutes: null,
          decimalPlaces: 2
        };
        #format;
        #text;
        #slider;
        onSetup() {
          this.#slider = useState(Slider.state);
          this.#format = useContext(sliderValueFormatContext);
          this.#text = computed(this.getValueText.bind(this));
        }
        /**
         * Returns the current value formatted as text based on prop settings.
         */
        getValueText() {
          const {
            type,
            format: $format,
            decimalPlaces,
            padHours,
            padMinutes,
            showHours,
            showMs
          } = this.$props, { value: sliderValue, pointerValue, min: min2, max: max2 } = this.#slider, format = $format?.() ?? this.#format.default;
          const value = type() === "current" ? sliderValue() : pointerValue();
          if (format === "percent") {
            const range = max2() - min2();
            const percent = value / range * 100;
            return (this.#format.percent ?? round2)(percent, decimalPlaces()) + "%";
          } else if (format === "time") {
            return (this.#format.time ?? formatTime)(value, {
              padHrs: padHours(),
              padMins: padMinutes(),
              showHrs: showHours(),
              showMs: showMs()
            });
          } else {
            return (this.#format.value?.(value) ?? value.toFixed(2)) + "";
          }
        }
      };
      slidervalue__proto = SliderValue.prototype;
      method(slidervalue__proto, "getValueText");
      SliderPreview = class extends Component {
        static props = {
          offset: 0,
          noClamp: false
        };
        #slider;
        onSetup() {
          this.#slider = useContext(sliderContext);
          const { active } = useState(Slider.state);
          this.setAttributes({
            "data-visible": active
          });
        }
        onAttach(el) {
          Object.assign(el.style, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "max-content"
          });
        }
        onConnect(el) {
          const { preview } = this.#slider;
          preview.set(el);
          onDispose(() => preview.set(null));
          effect(this.#updatePlacement.bind(this));
          const resize = new ResizeObserver(this.#updatePlacement.bind(this));
          resize.observe(el);
          onDispose(() => resize.disconnect());
        }
        #updatePlacement = animationFrameThrottle(() => {
          const { disabled, orientation } = this.#slider;
          if (disabled()) return;
          const el = this.el, { offset: offset2, noClamp } = this.$props;
          if (!el) return;
          updateSliderPreviewPlacement(el, {
            clamp: !noClamp(),
            offset: offset2(),
            orientation: orientation()
          });
        });
      };
      VolumeSlider = class extends Component {
        static props = {
          ...SliderController.props,
          keyStep: 5,
          shiftKeyMultiplier: 2
        };
        static state = sliderState;
        #media;
        onSetup() {
          this.#media = useMediaContext();
          const { audioGain } = this.#media.$state;
          provideContext(sliderValueFormatContext, {
            default: "percent",
            value(value) {
              return (value * (audioGain() ?? 1)).toFixed(2);
            },
            percent(value) {
              return Math.round(value * (audioGain() ?? 1));
            }
          });
          new SliderController({
            getStep: this.$props.step,
            getKeyStep: this.$props.keyStep,
            roundValue: Math.round,
            isDisabled: this.#isDisabled.bind(this),
            aria: {
              valueMax: this.#getARIAValueMax.bind(this),
              valueNow: this.#getARIAValueNow.bind(this),
              valueText: this.#getARIAValueText.bind(this)
            },
            onDragValueChange: this.#onDragValueChange.bind(this),
            onValueChange: this.#onValueChange.bind(this)
          }).attach(this);
          effect(this.#watchVolume.bind(this));
        }
        onAttach(el) {
          el.setAttribute("data-media-volume-slider", "");
          setAttributeIfEmpty(el, "aria-label", "Volume");
          const { canSetVolume } = this.#media.$state;
          this.setAttributes({
            "data-supported": canSetVolume,
            "aria-hidden": $ariaBool(() => !canSetVolume())
          });
        }
        #getARIAValueNow() {
          const { value } = this.$state, { audioGain } = this.#media.$state;
          return Math.round(value() * (audioGain() ?? 1));
        }
        #getARIAValueText() {
          const { value, max: max2 } = this.$state, { audioGain } = this.#media.$state;
          return round2(value() / max2() * (audioGain() ?? 1) * 100, 2) + "%";
        }
        #getARIAValueMax() {
          const { audioGain } = this.#media.$state;
          return this.$state.max() * (audioGain() ?? 1);
        }
        #isDisabled() {
          const { disabled } = this.$props, { canSetVolume } = this.#media.$state;
          return disabled() || !canSetVolume();
        }
        #watchVolume() {
          const { muted, volume } = this.#media.$state;
          const newValue = muted() ? 0 : volume() * 100;
          this.$state.value.set(newValue);
          this.dispatch("value-change", { detail: newValue });
        }
        #throttleVolumeChange = functionThrottle(this.#onVolumeChange.bind(this), 25);
        #onVolumeChange(event2) {
          if (!event2.trigger) return;
          const mediaVolume = round2(event2.detail / 100, 3);
          this.#media.remote.changeVolume(mediaVolume, event2);
        }
        #onValueChange(event2) {
          this.#throttleVolumeChange(event2);
        }
        #onDragValueChange(event2) {
          this.#throttleVolumeChange(event2);
        }
      };
      TimeSlider = class extends Component {
        static props = {
          ...SliderController.props,
          step: 0.1,
          keyStep: 5,
          shiftKeyMultiplier: 2,
          pauseWhileDragging: false,
          noSwipeGesture: false,
          seekingRequestThrottle: 100
        };
        static state = sliderState;
        #media;
        #dispatchSeeking;
        #chapter = signal(null);
        constructor() {
          super();
          const { noSwipeGesture } = this.$props;
          new SliderController({
            swipeGesture: () => !noSwipeGesture(),
            getValue: this.#getValue.bind(this),
            getStep: this.#getStep.bind(this),
            getKeyStep: this.#getKeyStep.bind(this),
            roundValue: this.#roundValue,
            isDisabled: this.#isDisabled.bind(this),
            aria: {
              valueNow: this.#getARIAValueNow.bind(this),
              valueText: this.#getARIAValueText.bind(this)
            },
            onDragStart: this.#onDragStart.bind(this),
            onDragValueChange: this.#onDragValueChange.bind(this),
            onDragEnd: this.#onDragEnd.bind(this),
            onValueChange: this.#onValueChange.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          provideContext(sliderValueFormatContext, {
            default: "time",
            value: this.#formatValue.bind(this),
            time: this.#formatTime.bind(this)
          });
          this.setAttributes({
            "data-chapters": this.#hasChapters.bind(this)
          });
          this.setStyles({
            "--slider-progress": this.#calcBufferedPercent.bind(this)
          });
          effect(this.#watchCurrentTime.bind(this));
          effect(this.#watchSeekingThrottle.bind(this));
        }
        onAttach(el) {
          el.setAttribute("data-media-time-slider", "");
          setAttributeIfEmpty(el, "aria-label", "Seek");
        }
        onConnect(el) {
          effect(this.#watchPreviewing.bind(this));
          watchActiveTextTrack(this.#media.textTracks, "chapters", this.#chapter.set);
        }
        #calcBufferedPercent() {
          const { bufferedEnd, duration } = this.#media.$state;
          return round2(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + "%";
        }
        #hasChapters() {
          const { duration } = this.#media.$state;
          return this.#chapter()?.cues.length && Number.isFinite(duration()) && duration() > 0;
        }
        #watchSeekingThrottle() {
          this.#dispatchSeeking = functionThrottle(
            this.#seeking.bind(this),
            this.$props.seekingRequestThrottle()
          );
        }
        #watchCurrentTime() {
          if (this.$state.hidden()) return;
          const { value, dragging } = this.$state, newValue = this.#getValue();
          if (!peek(dragging)) {
            value.set(newValue);
            this.dispatch("value-change", { detail: newValue });
          }
        }
        #watchPreviewing() {
          const player = this.#media.player.el, { preview } = useContext(sliderContext);
          player && preview() && setAttribute(player, "data-preview", this.$state.active());
        }
        #seeking(time, event2) {
          this.#media.remote.seeking(time, event2);
        }
        #seek(time, percent, event2) {
          this.#dispatchSeeking.cancel();
          const { live } = this.#media.$state;
          if (live() && percent >= 99) {
            this.#media.remote.seekToLiveEdge(event2);
            return;
          }
          this.#media.remote.seek(time, event2);
        }
        #playingBeforeDragStart = false;
        #onDragStart(event2) {
          const { pauseWhileDragging } = this.$props;
          if (pauseWhileDragging()) {
            const { paused } = this.#media.$state;
            this.#playingBeforeDragStart = !paused();
            this.#media.remote.pause(event2);
          }
        }
        #onDragValueChange(event2) {
          this.#dispatchSeeking(this.#percentToTime(event2.detail), event2);
        }
        #onDragEnd(event2) {
          const { seeking } = this.#media.$state;
          if (!peek(seeking)) this.#seeking(this.#percentToTime(event2.detail), event2);
          const percent = event2.detail;
          this.#seek(this.#percentToTime(percent), percent, event2);
          const { pauseWhileDragging } = this.$props;
          if (pauseWhileDragging() && this.#playingBeforeDragStart) {
            this.#media.remote.play(event2);
            this.#playingBeforeDragStart = false;
          }
        }
        #onValueChange(event2) {
          const { dragging } = this.$state;
          if (dragging() || !event2.trigger) return;
          this.#onDragEnd(event2);
        }
        // -------------------------------------------------------------------------------------------
        // Props
        // -------------------------------------------------------------------------------------------
        #getValue() {
          const { currentTime } = this.#media.$state;
          return this.#timeToPercent(currentTime());
        }
        #getStep() {
          const value = this.$props.step() / this.#media.$state.duration() * 100;
          return Number.isFinite(value) ? value : 1;
        }
        #getKeyStep() {
          const value = this.$props.keyStep() / this.#media.$state.duration() * 100;
          return Number.isFinite(value) ? value : 1;
        }
        #roundValue(value) {
          return round2(value, 3);
        }
        #isDisabled() {
          const { disabled } = this.$props, { canSeek } = this.#media.$state;
          return disabled() || !canSeek();
        }
        // -------------------------------------------------------------------------------------------
        // ARIA
        // -------------------------------------------------------------------------------------------
        #getARIAValueNow() {
          const { value } = this.$state;
          return Math.round(value());
        }
        #getARIAValueText() {
          const time = this.#percentToTime(this.$state.value()), { duration } = this.#media.$state;
          return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}` : "live";
        }
        // -------------------------------------------------------------------------------------------
        // Format
        // -------------------------------------------------------------------------------------------
        #percentToTime(percent) {
          const { duration } = this.#media.$state;
          return round2(percent / 100 * duration(), 5);
        }
        #timeToPercent(time) {
          const { liveEdge, duration } = this.#media.$state, rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
          return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
        }
        #formatValue(percent) {
          const time = this.#percentToTime(percent), { live, duration } = this.#media.$state;
          return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : "LIVE";
        }
        #formatTime(percent, options) {
          const time = this.#percentToTime(percent), { live, duration } = this.#media.$state, value = live() ? time - duration() : time;
          return Number.isFinite(time) ? `${value < 0 ? "-" : ""}${formatTime(Math.abs(value), options)}` : "LIVE";
        }
      };
      menuContext = createContext();
      FOCUSABLE_ELEMENTS_SELECTOR = /* @__PURE__ */ [
        "a[href]",
        "[tabindex]",
        "input",
        "select",
        "button"
      ].map((selector) => `${selector}:not([aria-hidden='true'])`).join(",");
      VALID_KEYS = /* @__PURE__ */ new Set([
        "Escape",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "PageUp",
        "End",
        "PageDown",
        "Enter",
        " "
      ]);
      MenuFocusController = class {
        #index = -1;
        #el = null;
        #elements = [];
        #delegate;
        get items() {
          return this.#elements;
        }
        constructor(delegate) {
          this.#delegate = delegate;
        }
        attachMenu(el) {
          listenEvent(el, "focus", this.#onFocus.bind(this));
          this.#el = el;
          onDispose(() => {
            this.#el = null;
          });
        }
        listen() {
          if (!this.#el) return;
          this.update();
          new EventsController(this.#el).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this));
          onDispose(() => {
            this.#index = -1;
            this.#elements = [];
          });
        }
        update() {
          this.#index = 0;
          this.#elements = this.#getFocusableElements();
        }
        scroll(index = this.#findActiveIndex()) {
          const element = this.#elements[index];
          if (element) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                scrollIntoCenter(element, {
                  behavior: "smooth",
                  boundary: (el) => {
                    return !el.hasAttribute("data-root");
                  }
                });
              });
            });
          }
        }
        focusActive(scroll = true) {
          const index = this.#findActiveIndex();
          this.#focusAt(index >= 0 ? index : 0, scroll);
        }
        #focusAt(index, scroll = true) {
          this.#index = index;
          if (this.#elements[index]) {
            this.#elements[index].focus({ preventScroll: true });
            if (scroll) this.scroll(index);
          } else {
            this.#el?.focus({ preventScroll: true });
          }
        }
        #findActiveIndex() {
          return this.#elements.findIndex(
            (el) => document.activeElement === el || el.getAttribute("role") === "menuitemradio" && el.getAttribute("aria-checked") === "true"
          );
        }
        #onFocus() {
          if (this.#index >= 0) return;
          this.update();
          this.focusActive();
        }
        #validateKeyEvent(event2) {
          const el = event2.target;
          if (wasEnterKeyPressed(event2) && el instanceof Element) {
            const role = el.getAttribute("role");
            return !/a|input|select|button/.test(el.localName) && !role;
          }
          return VALID_KEYS.has(event2.key);
        }
        #onKeyUp(event2) {
          if (!this.#validateKeyEvent(event2)) return;
          event2.stopPropagation();
          event2.preventDefault();
        }
        #onKeyDown(event2) {
          if (!this.#validateKeyEvent(event2)) return;
          event2.stopPropagation();
          event2.preventDefault();
          switch (event2.key) {
            case "Escape":
              this.#delegate.closeMenu(event2);
              break;
            case "Tab":
              this.#focusAt(this.#nextIndex(event2.shiftKey ? -1 : 1));
              break;
            case "ArrowUp":
              this.#focusAt(this.#nextIndex(-1));
              break;
            case "ArrowDown":
              this.#focusAt(this.#nextIndex(1));
              break;
            case "Home":
            case "PageUp":
              this.#focusAt(0);
              break;
            case "End":
            case "PageDown":
              this.#focusAt(this.#elements.length - 1);
              break;
          }
        }
        #nextIndex(delta) {
          let index = this.#index;
          do {
            index = (index + delta + this.#elements.length) % this.#elements.length;
          } while (this.#elements[index]?.offsetParent === null);
          return index;
        }
        #getFocusableElements() {
          if (!this.#el) return [];
          const focusableElements = this.#el.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR), elements = [];
          const is = (node) => {
            return node.getAttribute("role") === "menu";
          };
          for (const el of focusableElements) {
            if (isHTMLElement2(el) && el.offsetParent !== null && // does not have display: none
            isElementParent(this.#el, el, is)) {
              elements.push(el);
            }
          }
          return elements;
        }
      };
      __defProp2 = Object.defineProperty;
      __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      __decorateClass = (decorators, target, key2, kind) => {
        var result = __getOwnPropDesc(target, key2);
        for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
          if (decorator = decorators[i4])
            result = decorator(target, key2, result) || result;
        if (result) __defProp2(target, key2, result);
        return result;
      };
      idCount = 0;
      Menu = class extends Component {
        static props = {
          showDelay: 0
        };
        #media;
        #menuId;
        #menuButtonId;
        #expanded = signal(false);
        #disabled = signal(false);
        #trigger = signal(null);
        #content = signal(null);
        #parentMenu;
        #submenus = /* @__PURE__ */ new Set();
        #menuObserver = null;
        #popper;
        #focus;
        #isSliderActive = false;
        #isTriggerDisabled = signal(false);
        #transitionCallbacks = /* @__PURE__ */ new Set();
        get triggerElement() {
          return this.#trigger();
        }
        get contentElement() {
          return this.#content();
        }
        get isSubmenu() {
          return !!this.#parentMenu;
        }
        constructor() {
          super();
          const { showDelay } = this.$props;
          this.#popper = new Popper({
            trigger: this.#trigger,
            content: this.#content,
            showDelay,
            listen: (trigger, show, hide2) => {
              onPress(trigger, (event2) => {
                if (this.#expanded()) hide2(event2);
                else show(event2);
              });
              const closeTarget = this.#getCloseTarget();
              if (closeTarget) {
                onPress(closeTarget, (event2) => {
                  event2.stopPropagation();
                  hide2(event2);
                });
              }
            },
            onChange: this.#onExpandedChange.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          const currentIdCount = ++idCount;
          this.#menuId = `media-menu-${currentIdCount}`;
          this.#menuButtonId = `media-menu-button-${currentIdCount}`;
          this.#focus = new MenuFocusController({
            closeMenu: this.close.bind(this)
          });
          if (hasProvidedContext(menuContext)) {
            this.#parentMenu = useContext(menuContext);
          }
          this.#observeSliders();
          this.setAttributes({
            "data-open": this.#expanded,
            "data-root": !this.isSubmenu,
            "data-submenu": this.isSubmenu,
            "data-disabled": this.#isDisabled.bind(this)
          });
          provideContext(menuContext, {
            button: this.#trigger,
            content: this.#content,
            expanded: this.#expanded,
            hint: signal(""),
            submenu: !!this.#parentMenu,
            disable: this.#disable.bind(this),
            attachMenuButton: this.#attachMenuButton.bind(this),
            attachMenuItems: this.#attachMenuItems.bind(this),
            attachObserver: this.#attachObserver.bind(this),
            disableMenuButton: this.#disableMenuButton.bind(this),
            addSubmenu: this.#addSubmenu.bind(this),
            onTransitionEvent: (callback) => {
              this.#transitionCallbacks.add(callback);
              onDispose(() => {
                this.#transitionCallbacks.delete(callback);
              });
            }
          });
        }
        onAttach(el) {
          el.style.setProperty("display", "contents");
        }
        onConnect(el) {
          effect(this.#watchExpanded.bind(this));
          if (this.isSubmenu) {
            this.#parentMenu?.addSubmenu(this);
          }
        }
        onDestroy() {
          this.#trigger.set(null);
          this.#content.set(null);
          this.#menuObserver = null;
          this.#transitionCallbacks.clear();
        }
        #observeSliders() {
          let sliderActiveTimer = -1, parentSliderObserver = hasProvidedContext(sliderObserverContext) ? useContext(sliderObserverContext) : null;
          provideContext(sliderObserverContext, {
            onDragStart: () => {
              parentSliderObserver?.onDragStart?.();
              window.clearTimeout(sliderActiveTimer);
              sliderActiveTimer = -1;
              this.#isSliderActive = true;
            },
            onDragEnd: () => {
              parentSliderObserver?.onDragEnd?.();
              sliderActiveTimer = window.setTimeout(() => {
                this.#isSliderActive = false;
                sliderActiveTimer = -1;
              }, 300);
            }
          });
        }
        #watchExpanded() {
          const expanded = this.#isExpanded();
          if (!this.isSubmenu) this.#onResize();
          this.#updateMenuItemsHidden(expanded);
          if (!expanded) return;
          effect(() => {
            const { height } = this.#media.$state, content = this.#content();
            content && setStyle(content, "--player-height", height() + "px");
          });
          this.#focus.listen();
          this.listen("pointerup", this.#onPointerUp.bind(this));
          listenEvent(window, "pointerup", this.#onWindowPointerUp.bind(this));
        }
        #attachMenuButton(button) {
          const el = button.el, isMenuItem = this.isSubmenu, isARIADisabled = $ariaBool(this.#isDisabled.bind(this));
          setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
          setAttributeIfEmpty(el, "role", isMenuItem ? "menuitem" : "button");
          setAttribute(el, "id", this.#menuButtonId);
          setAttribute(el, "aria-haspopup", "menu");
          setAttribute(el, "aria-expanded", "false");
          setAttribute(el, "data-root", !this.isSubmenu);
          setAttribute(el, "data-submenu", this.isSubmenu);
          const watchAttrs = () => {
            setAttribute(el, "data-open", this.#expanded());
            setAttribute(el, "aria-disabled", isARIADisabled());
          };
          effect(watchAttrs);
          this.#trigger.set(el);
          onDispose(() => {
            this.#trigger.set(null);
          });
        }
        #attachMenuItems(items) {
          const el = items.el;
          el.style.setProperty("display", "none");
          setAttribute(el, "id", this.#menuId);
          setAttributeIfEmpty(el, "role", "menu");
          setAttributeIfEmpty(el, "tabindex", "-1");
          setAttribute(el, "data-root", !this.isSubmenu);
          setAttribute(el, "data-submenu", this.isSubmenu);
          this.#content.set(el);
          onDispose(() => this.#content.set(null));
          const watchAttrs = () => setAttribute(el, "data-open", this.#expanded());
          effect(watchAttrs);
          this.#focus.attachMenu(el);
          this.#updateMenuItemsHidden(false);
          const onTransition = this.#onResizeTransition.bind(this);
          if (!this.isSubmenu) {
            items.listen("transitionstart", onTransition);
            items.listen("transitionend", onTransition);
            items.listen("animationend", this.#onResize);
            items.listen("vds-menu-resize", this.#onResize);
          } else {
            this.#parentMenu?.onTransitionEvent(onTransition);
          }
        }
        #attachObserver(observer) {
          this.#menuObserver = observer;
        }
        #updateMenuItemsHidden(expanded) {
          const content = peek(this.#content);
          if (content) setAttribute(content, "aria-hidden", ariaBool(!expanded));
        }
        #disableMenuButton(disabled) {
          this.#isTriggerDisabled.set(disabled);
        }
        #wasKeyboardExpand = false;
        #onExpandedChange(isExpanded, event2) {
          this.#wasKeyboardExpand = isKeyboardEvent(event2);
          event2?.stopPropagation();
          if (this.#expanded() === isExpanded) return;
          if (this.#isDisabled()) {
            if (isExpanded) this.#popper.hide(event2);
            return;
          }
          this.el?.dispatchEvent(
            new Event("vds-menu-resize", {
              bubbles: true,
              composed: true
            })
          );
          const trigger = this.#trigger(), content = this.#content();
          if (trigger) {
            setAttribute(trigger, "aria-controls", isExpanded && this.#menuId);
            setAttribute(trigger, "aria-expanded", ariaBool(isExpanded));
          }
          if (content) setAttribute(content, "aria-labelledby", isExpanded && this.#menuButtonId);
          this.#expanded.set(isExpanded);
          this.#toggleMediaControls(event2);
          tick();
          if (this.#wasKeyboardExpand) {
            if (isExpanded) content?.focus();
            else trigger?.focus();
            for (const el of [this.el, content]) {
              el && el.setAttribute("data-keyboard", "");
            }
          } else {
            for (const el of [this.el, content]) {
              el && el.removeAttribute("data-keyboard");
            }
          }
          this.dispatch(isExpanded ? "open" : "close", { trigger: event2 });
          if (isExpanded) {
            if (!this.isSubmenu && this.#media.activeMenu !== this) {
              this.#media.activeMenu?.close(event2);
              this.#media.activeMenu = this;
            }
            this.#menuObserver?.onOpen?.(event2);
          } else {
            if (this.isSubmenu) {
              for (const el of this.#submenus) el.close(event2);
            } else {
              this.#media.activeMenu = null;
            }
            this.#menuObserver?.onClose?.(event2);
          }
          if (isExpanded) {
            requestAnimationFrame(this.#updateFocus.bind(this));
          }
        }
        #updateFocus() {
          if (this.#isTransitionActive || this.#isSubmenuOpen) return;
          this.#focus.update();
          requestAnimationFrame(() => {
            if (this.#wasKeyboardExpand) {
              this.#focus.focusActive();
            } else {
              this.#focus.scroll();
            }
          });
        }
        #isExpanded() {
          return !this.#isDisabled() && this.#expanded();
        }
        #isDisabled() {
          return this.#disabled() || this.#isTriggerDisabled();
        }
        #disable(disabled) {
          this.#disabled.set(disabled);
        }
        #onPointerUp(event2) {
          const content = this.#content();
          if (this.#isSliderActive || content && isEventInside(content, event2)) {
            return;
          }
          event2.stopPropagation();
        }
        #onWindowPointerUp(event2) {
          const content = this.#content();
          if (this.#isSliderActive || content && isEventInside(content, event2)) {
            return;
          }
          this.close(event2);
        }
        #getCloseTarget() {
          const target = this.el?.querySelector('[data-part="close-target"]');
          return this.el && target && isElementParent(this.el, target, (node) => node.getAttribute("role") === "menu") ? target : null;
        }
        #toggleMediaControls(trigger) {
          if (this.isSubmenu) return;
          if (this.#expanded()) this.#media.remote.pauseControls(trigger);
          else this.#media.remote.resumeControls(trigger);
        }
        #addSubmenu(menu) {
          this.#submenus.add(menu);
          new EventsController(menu).add("open", this.#onSubmenuOpenBind).add("close", this.#onSubmenuCloseBind);
          onDispose(this.#removeSubmenuBind);
        }
        #removeSubmenuBind = this.#removeSubmenu.bind(this);
        #removeSubmenu(menu) {
          this.#submenus.delete(menu);
        }
        #isSubmenuOpen = false;
        #onSubmenuOpenBind = this.#onSubmenuOpen.bind(this);
        #onSubmenuOpen(event2) {
          this.#isSubmenuOpen = true;
          const content = this.#content();
          if (this.isSubmenu) {
            this.triggerElement?.setAttribute("aria-hidden", "true");
          }
          for (const target of this.#submenus) {
            if (target !== event2.target) {
              for (const el of [target.el, target.triggerElement]) {
                el?.setAttribute("aria-hidden", "true");
              }
            }
          }
          if (content) {
            const el = event2.target.el;
            for (const child of content.children) {
              if (child.contains(el)) {
                child.setAttribute("data-open", "");
              } else if (child !== el) {
                child.setAttribute("data-hidden", "");
              }
            }
          }
        }
        #onSubmenuCloseBind = this.#onSubmenuClose.bind(this);
        #onSubmenuClose(event2) {
          this.#isSubmenuOpen = false;
          const content = this.#content();
          if (this.isSubmenu) {
            this.triggerElement?.setAttribute("aria-hidden", "false");
          }
          for (const target of this.#submenus) {
            for (const el of [target.el, target.triggerElement]) {
              el?.setAttribute("aria-hidden", "false");
            }
          }
          if (content) {
            for (const child of content.children) {
              child.removeAttribute("data-open");
              child.removeAttribute("data-hidden");
            }
          }
        }
        #onResize = animationFrameThrottle(() => {
          const content = peek(this.#content);
          if (!content || false) return;
          let height = 0, styles = getComputedStyle(content), children = [...content.children];
          for (const prop2 of ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]) {
            height += parseFloat(styles[prop2]) || 0;
          }
          for (const child of children) {
            if (isHTMLElement2(child) && child.style.display === "contents") {
              children.push(...child.children);
            } else if (child.nodeType === 3) {
              height += parseFloat(getComputedStyle(child).fontSize);
            } else if (isHTMLElement2(child)) {
              if (!isElementVisible(child)) continue;
              const style = getComputedStyle(child);
              height += child.offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
            }
          }
          setStyle(content, "--menu-height", height + "px");
        });
        #isTransitionActive = false;
        #onResizeTransition(event2) {
          const content = this.#content();
          if (content && event2.propertyName === "height") {
            this.#isTransitionActive = event2.type === "transitionstart";
            setAttribute(content, "data-transition", this.#isTransitionActive ? "height" : null);
            if (this.#expanded()) this.#updateFocus();
          }
          for (const callback of this.#transitionCallbacks) callback(event2);
        }
        open(trigger) {
          if (peek(this.#expanded)) return;
          this.#popper.show(trigger);
          tick();
        }
        close(trigger) {
          if (!peek(this.#expanded)) return;
          this.#popper.hide(trigger);
          tick();
        }
      };
      __decorateClass([
        prop
      ], Menu.prototype, "triggerElement");
      __decorateClass([
        prop
      ], Menu.prototype, "contentElement");
      __decorateClass([
        prop
      ], Menu.prototype, "isSubmenu");
      __decorateClass([
        method
      ], Menu.prototype, "open");
      __decorateClass([
        method
      ], Menu.prototype, "close");
      MenuButton = class extends Component {
        static props = {
          disabled: false
        };
        #menu;
        #hintEl = signal(null);
        get expanded() {
          return this.#menu?.expanded() ?? false;
        }
        constructor() {
          super();
          new FocusVisibleController();
        }
        onSetup() {
          this.#menu = useContext(menuContext);
        }
        onAttach(el) {
          this.#menu.attachMenuButton(this);
          effect(this.#watchDisabled.bind(this));
          setAttributeIfEmpty(el, "type", "button");
        }
        onConnect(el) {
          effect(this.#watchHintEl.bind(this));
          this.#onMutation();
          const mutations = new MutationObserver(this.#onMutation.bind(this));
          mutations.observe(el, { attributeFilter: ["data-part"], childList: true, subtree: true });
          onDispose(() => mutations.disconnect());
          onPress(el, (trigger) => {
            this.dispatch("select", { trigger });
          });
        }
        #watchDisabled() {
          this.#menu.disableMenuButton(this.$props.disabled());
        }
        #watchHintEl() {
          const el = this.#hintEl();
          if (!el) return;
          effect(() => {
            const text = this.#menu.hint();
            if (text) el.textContent = text;
          });
        }
        #onMutation() {
          const hintEl = this.el?.querySelector('[data-part="hint"]');
          this.#hintEl.set(hintEl ?? null);
        }
      };
      menubutton__proto = MenuButton.prototype;
      prop(menubutton__proto, "expanded");
      MenuItem = class extends MenuButton {
      };
      MenuPortal2 = class extends Component {
        static props = {
          container: null,
          disabled: false
        };
        #target = null;
        #media;
        onSetup() {
          this.#media = useMediaContext();
          provideContext(menuPortalContext, {
            attach: this.#attachElement.bind(this)
          });
        }
        onAttach(el) {
          el.style.setProperty("display", "contents");
        }
        // Need this so connect scope is defined.
        onConnect(el) {
        }
        onDestroy() {
          this.#target?.remove();
          this.#target = null;
        }
        #attachElement(el) {
          this.#portal(false);
          this.#target = el;
          requestScopedAnimationFrame(() => {
            requestScopedAnimationFrame(() => {
              if (!this.connectScope) return;
              effect(this.#watchDisabled.bind(this));
            });
          });
        }
        #watchDisabled() {
          const { fullscreen } = this.#media.$state, { disabled } = this.$props;
          this.#portal(disabled() === "fullscreen" ? !fullscreen() : !disabled());
        }
        #portal(shouldPortal) {
          if (!this.#target) return;
          let container = this.#getContainer(this.$props.container());
          if (!container) return;
          const isPortalled = this.#target.parentElement === container;
          setAttribute(this.#target, "data-portal", shouldPortal);
          if (shouldPortal) {
            if (!isPortalled) {
              this.#target.remove();
              container.append(this.#target);
            }
          } else if (isPortalled && this.#target.parentElement === container) {
            this.#target.remove();
            this.el?.append(this.#target);
          }
        }
        #getContainer(selector) {
          if (isHTMLElement2(selector)) return selector;
          return selector ? document.querySelector(selector) : document.body;
        }
      };
      menuPortalContext = createContext();
      MenuItems = class extends Component {
        static props = {
          placement: null,
          offset: 0,
          alignOffset: 0
        };
        #menu;
        constructor() {
          super();
          new FocusVisibleController();
          const { placement } = this.$props;
          this.setAttributes({
            "data-placement": placement
          });
        }
        onAttach(el) {
          this.#menu = useContext(menuContext);
          this.#menu.attachMenuItems(this);
          if (hasProvidedContext(menuPortalContext)) {
            const portal = useContext(menuPortalContext);
            if (portal) {
              provideContext(menuPortalContext, null);
              portal.attach(el);
              onDispose(() => portal.attach(null));
            }
          }
        }
        onConnect(el) {
          effect(this.#watchPlacement.bind(this));
        }
        #watchPlacement() {
          const { expanded } = this.#menu;
          if (!this.el || !expanded()) return;
          const placement = this.$props.placement();
          if (!placement) return;
          Object.assign(this.el.style, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "max-content"
          });
          const { offset: mainOffset, alignOffset } = this.$props;
          onDispose(
            autoPlacement2(this.el, this.#getButton(), placement, {
              offsetVarName: "media-menu",
              xOffset: alignOffset(),
              yOffset: mainOffset()
            })
          );
          onDispose(this.#hide.bind(this));
        }
        #hide() {
          if (!this.el) return;
          this.el.removeAttribute("style");
          this.el.style.display = "none";
        }
        #getButton() {
          return this.#menu.button();
        }
      };
      radioControllerContext = createContext();
      RadioGroupController = class extends ViewController {
        #group = /* @__PURE__ */ new Set();
        #value = signal("");
        #controller = null;
        onValueChange;
        get values() {
          return Array.from(this.#group).map((radio) => radio.value());
        }
        get value() {
          return this.#value();
        }
        set value(value) {
          this.#onChange(value);
        }
        onSetup() {
          provideContext(radioControllerContext, {
            add: this.#addRadio.bind(this),
            remove: this.#removeRadio.bind(this)
          });
        }
        onAttach(el) {
          const isMenuItem = hasProvidedContext(menuContext);
          if (!isMenuItem) setAttributeIfEmpty(el, "role", "radiogroup");
          this.setAttributes({ value: this.#value });
        }
        onDestroy() {
          this.#group.clear();
        }
        #addRadio(radio) {
          if (this.#group.has(radio)) return;
          this.#group.add(radio);
          radio.onCheck = this.#onChangeBind;
          radio.check(radio.value() === this.#value());
        }
        #removeRadio(radio) {
          radio.onCheck = null;
          this.#group.delete(radio);
        }
        #onChangeBind = this.#onChange.bind(this);
        #onChange(newValue, trigger) {
          const currentValue = peek(this.#value);
          if (!newValue || newValue === currentValue) return;
          const currentRadio = this.#findRadio(currentValue), newRadio = this.#findRadio(newValue);
          currentRadio?.check(false, trigger);
          newRadio?.check(true, trigger);
          this.#value.set(newValue);
          this.onValueChange?.(newValue, trigger);
        }
        #findRadio(newValue) {
          for (const radio of this.#group) {
            if (newValue === peek(radio.value)) return radio;
          }
          return null;
        }
      };
      Radio = class extends Component {
        static props = {
          value: ""
        };
        #checked = signal(false);
        #controller = {
          value: this.$props.value,
          check: this.#check.bind(this),
          onCheck: null
        };
        /**
         * Whether this radio is currently checked.
         */
        get checked() {
          return this.#checked();
        }
        constructor() {
          super();
          new FocusVisibleController();
        }
        onSetup() {
          this.setAttributes({
            value: this.$props.value,
            "data-checked": this.#checked,
            "aria-checked": $ariaBool(this.#checked)
          });
        }
        onAttach(el) {
          const isMenuItem = hasProvidedContext(menuContext);
          setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
          setAttributeIfEmpty(el, "role", isMenuItem ? "menuitemradio" : "radio");
          effect(this.#watchValue.bind(this));
        }
        onConnect(el) {
          this.#addToGroup();
          onPress(el, this.#onPress.bind(this));
          onDispose(this.#onDisconnect.bind(this));
        }
        #onDisconnect() {
          scoped(() => {
            const group = useContext(radioControllerContext);
            group.remove(this.#controller);
          }, this.connectScope);
        }
        #addToGroup() {
          const group = useContext(radioControllerContext);
          group.add(this.#controller);
        }
        #watchValue() {
          const { value } = this.$props, newValue = value();
          if (peek(this.#checked)) {
            this.#controller.onCheck?.(newValue);
          }
        }
        #onPress(event2) {
          if (peek(this.#checked)) return;
          this.#onChange(true, event2);
          this.#onSelect(event2);
          this.#controller.onCheck?.(peek(this.$props.value), event2);
        }
        #check(value, trigger) {
          if (peek(this.#checked) === value) return;
          this.#onChange(value, trigger);
        }
        #onChange(value, trigger) {
          this.#checked.set(value);
          this.dispatch("change", { detail: value, trigger });
        }
        #onSelect(trigger) {
          this.dispatch("select", { trigger });
        }
      };
      radio__proto = Radio.prototype;
      prop(radio__proto, "checked");
      AudioRadioGroup = class extends Component {
        static props = {
          emptyLabel: "Default"
        };
        #menu;
        #media;
        #controller;
        get value() {
          return this.#controller.value;
        }
        get disabled() {
          const { audioTracks } = this.#media.$state;
          return audioTracks().length <= 1;
        }
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          this.#media = useMediaContext();
          if (hasProvidedContext(menuContext)) {
            this.#menu = useContext(menuContext);
          }
        }
        onConnect(el) {
          effect(this.#watchValue.bind(this));
          effect(this.#watchControllerDisabled.bind(this));
          effect(this.#watchHintText.bind(this));
        }
        getOptions() {
          const { audioTracks } = this.#media.$state;
          return audioTracks().map((track) => ({
            track,
            label: track.label,
            value: track.label.toLowerCase()
          }));
        }
        #watchValue() {
          this.#controller.value = this.#getValue();
        }
        #watchHintText() {
          const { emptyLabel } = this.$props, { audioTrack } = this.#media.$state, track = audioTrack();
          this.#menu?.hint.set(track?.label ?? emptyLabel());
        }
        #watchControllerDisabled() {
          this.#menu?.disable(this.disabled);
        }
        #getValue() {
          const { audioTrack } = this.#media.$state;
          const track = audioTrack();
          return track ? track.label.toLowerCase() : "";
        }
        #onValueChange(value, trigger) {
          if (this.disabled) return;
          const index = this.#media.audioTracks.toArray().findIndex((track) => track.label.toLowerCase() === value);
          if (index >= 0) {
            const track = this.#media.audioTracks[index];
            this.#media.remote.changeAudioTrack(index, trigger);
            this.dispatch("change", { detail: track, trigger });
          }
        }
      };
      audioradiogroup__proto = AudioRadioGroup.prototype;
      prop(audioradiogroup__proto, "value");
      prop(audioradiogroup__proto, "disabled");
      method(audioradiogroup__proto, "getOptions");
      CaptionsRadioGroup = class extends Component {
        static props = {
          offLabel: "Off"
        };
        #media;
        #menu;
        #controller;
        get value() {
          return this.#controller.value;
        }
        get disabled() {
          const { hasCaptions } = this.#media.$state;
          return !hasCaptions();
        }
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          this.#media = useMediaContext();
          if (hasProvidedContext(menuContext)) {
            this.#menu = useContext(menuContext);
          }
        }
        onConnect(el) {
          super.onConnect?.(el);
          effect(this.#watchValue.bind(this));
          effect(this.#watchControllerDisabled.bind(this));
          effect(this.#watchHintText.bind(this));
        }
        getOptions() {
          const { offLabel } = this.$props, { textTracks } = this.#media.$state;
          return [
            { value: "off", label: offLabel },
            ...textTracks().filter(isTrackCaptionKind).map((track) => ({
              track,
              label: track.label,
              value: this.#getTrackValue(track)
            }))
          ];
        }
        #watchValue() {
          this.#controller.value = this.#getValue();
        }
        #watchHintText() {
          const { offLabel } = this.$props, { textTrack } = this.#media.$state, track = textTrack();
          this.#menu?.hint.set(
            track && isTrackCaptionKind(track) && track.mode === "showing" ? track.label : offLabel()
          );
        }
        #watchControllerDisabled() {
          this.#menu?.disable(this.disabled);
        }
        #getValue() {
          const { textTrack } = this.#media.$state, track = textTrack();
          return track && isTrackCaptionKind(track) && track.mode === "showing" ? this.#getTrackValue(track) : "off";
        }
        #onValueChange(value, trigger) {
          if (this.disabled) return;
          if (value === "off") {
            const track = this.#media.textTracks.selected;
            if (track) {
              const index2 = this.#media.textTracks.indexOf(track);
              this.#media.remote.changeTextTrackMode(index2, "disabled", trigger);
              this.dispatch("change", { detail: null, trigger });
            }
            return;
          }
          const index = this.#media.textTracks.toArray().findIndex((track) => this.#getTrackValue(track) === value);
          if (index >= 0) {
            const track = this.#media.textTracks[index];
            this.#media.remote.changeTextTrackMode(index, "showing", trigger);
            this.dispatch("change", { detail: track, trigger });
          }
        }
        #getTrackValue(track) {
          return track.id + ":" + track.kind + "-" + track.label.toLowerCase();
        }
      };
      captionsradiogroup__proto = CaptionsRadioGroup.prototype;
      prop(captionsradiogroup__proto, "value");
      prop(captionsradiogroup__proto, "disabled");
      method(captionsradiogroup__proto, "getOptions");
      DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      SpeedRadioGroup = class extends Component {
        static props = {
          normalLabel: "Normal",
          rates: DEFAULT_PLAYBACK_RATES
        };
        #media;
        #menu;
        #controller;
        get value() {
          return this.#controller.value;
        }
        get disabled() {
          const { rates } = this.$props, { canSetPlaybackRate } = this.#media.$state;
          return !canSetPlaybackRate() || rates().length === 0;
        }
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          this.#media = useMediaContext();
          if (hasProvidedContext(menuContext)) {
            this.#menu = useContext(menuContext);
          }
        }
        onConnect(el) {
          effect(this.#watchValue.bind(this));
          effect(this.#watchHintText.bind(this));
          effect(this.#watchControllerDisabled.bind(this));
        }
        getOptions() {
          const { rates, normalLabel } = this.$props;
          return rates().map((rate) => ({
            label: rate === 1 ? normalLabel : rate + "\xD7",
            value: rate.toString()
          }));
        }
        #watchValue() {
          this.#controller.value = this.#getValue();
        }
        #watchHintText() {
          const { normalLabel } = this.$props, { playbackRate } = this.#media.$state, rate = playbackRate();
          this.#menu?.hint.set(rate === 1 ? normalLabel() : rate + "\xD7");
        }
        #watchControllerDisabled() {
          this.#menu?.disable(this.disabled);
        }
        #getValue() {
          const { playbackRate } = this.#media.$state;
          return playbackRate().toString();
        }
        #onValueChange(value, trigger) {
          if (this.disabled) return;
          const rate = +value;
          this.#media.remote.changePlaybackRate(rate, trigger);
          this.dispatch("change", { detail: rate, trigger });
        }
      };
      speedradiogroup__proto = SpeedRadioGroup.prototype;
      prop(speedradiogroup__proto, "value");
      prop(speedradiogroup__proto, "disabled");
      method(speedradiogroup__proto, "getOptions");
      QualityRadioGroup = class extends Component {
        static props = {
          autoLabel: "Auto",
          hideBitrate: false,
          sort: "descending"
        };
        #media;
        #menu;
        #controller;
        get value() {
          return this.#controller.value;
        }
        get disabled() {
          const { canSetQuality, qualities } = this.#media.$state;
          return !canSetQuality() || qualities().length <= 1;
        }
        #sortedQualities = computed(() => {
          const { sort } = this.$props, { qualities } = this.#media.$state;
          return sortVideoQualities(qualities(), sort() === "descending");
        });
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          this.#media = useMediaContext();
          if (hasProvidedContext(menuContext)) {
            this.#menu = useContext(menuContext);
          }
        }
        onConnect(el) {
          effect(this.#watchValue.bind(this));
          effect(this.#watchControllerDisabled.bind(this));
          effect(this.#watchHintText.bind(this));
        }
        getOptions() {
          const { autoLabel, hideBitrate } = this.$props;
          return [
            { value: "auto", label: autoLabel },
            ...this.#sortedQualities().map((quality) => {
              const bitrate = quality.bitrate && quality.bitrate >= 0 ? `${round2(quality.bitrate / 1e6, 2)} Mbps` : null;
              return {
                quality,
                label: quality.height + "p",
                value: this.#getQualityId(quality),
                bitrate: () => !hideBitrate() ? bitrate : null
              };
            })
          ];
        }
        #watchValue() {
          this.#controller.value = this.#getValue();
        }
        #watchHintText() {
          const { autoLabel } = this.$props, { autoQuality, quality } = this.#media.$state, qualityText = quality() ? quality().height + "p" : "";
          this.#menu?.hint.set(
            !autoQuality() ? qualityText : autoLabel() + (qualityText ? ` (${qualityText})` : "")
          );
        }
        #watchControllerDisabled() {
          this.#menu?.disable(this.disabled);
        }
        #onValueChange(value, trigger) {
          if (this.disabled) return;
          if (value === "auto") {
            this.#media.remote.changeQuality(-1, trigger);
            this.dispatch("change", { detail: "auto", trigger });
            return;
          }
          const { qualities } = this.#media.$state, index = peek(qualities).findIndex((quality) => this.#getQualityId(quality) === value);
          if (index >= 0) {
            const quality = peek(qualities)[index];
            this.#media.remote.changeQuality(index, trigger);
            this.dispatch("change", { detail: quality, trigger });
          }
        }
        #getValue() {
          const { quality, autoQuality } = this.#media.$state;
          if (autoQuality()) return "auto";
          const currentQuality = quality();
          return currentQuality ? this.#getQualityId(currentQuality) : "auto";
        }
        #getQualityId(quality) {
          return quality.height + "_" + quality.bitrate;
        }
      };
      qualityradiogroup__proto = QualityRadioGroup.prototype;
      prop(qualityradiogroup__proto, "value");
      prop(qualityradiogroup__proto, "disabled");
      method(qualityradiogroup__proto, "getOptions");
      Time = class extends Component {
        static props = {
          type: "current",
          showHours: false,
          padHours: null,
          padMinutes: null,
          remainder: false,
          toggle: false,
          hidden: false
        };
        static state = new State({
          timeText: "",
          hidden: false
        });
        #media;
        #invert = signal(null);
        #isVisible = signal(true);
        #isIntersecting = signal(true);
        onSetup() {
          this.#media = useMediaContext();
          this.#watchTime();
          const { type } = this.$props;
          this.setAttributes({
            "data-type": type,
            "data-remainder": this.#shouldInvert.bind(this)
          });
          new IntersectionObserverController({
            callback: this.#onIntersectionChange.bind(this)
          }).attach(this);
        }
        onAttach(el) {
          if (!el.hasAttribute("role")) effect(this.#watchRole.bind(this));
          effect(this.#watchTime.bind(this));
        }
        onConnect(el) {
          onDispose(observeVisibility(el, this.#isVisible.set));
          effect(this.#watchHidden.bind(this));
          effect(this.#watchToggle.bind(this));
        }
        #onIntersectionChange(entries) {
          this.#isIntersecting.set(entries[0].isIntersecting);
        }
        #watchHidden() {
          const { hidden } = this.$props;
          this.$state.hidden.set(hidden() || !this.#isVisible() || !this.#isIntersecting());
        }
        #watchToggle() {
          if (!this.$props.toggle()) {
            this.#invert.set(null);
            return;
          }
          if (this.el) {
            onPress(this.el, this.#onToggle.bind(this));
          }
        }
        #watchTime() {
          const { hidden, timeText } = this.$state, { duration } = this.#media.$state;
          if (hidden()) return;
          const { type, padHours, padMinutes, showHours } = this.$props, seconds = this.#getSeconds(type()), $duration = duration(), shouldInvert = this.#shouldInvert();
          if (!Number.isFinite(seconds + $duration)) {
            timeText.set("LIVE");
            return;
          }
          const time = shouldInvert ? Math.max(0, $duration - seconds) : seconds, formattedTime = formatTime(time, {
            padHrs: padHours(),
            padMins: padMinutes(),
            showHrs: showHours()
          });
          timeText.set((shouldInvert ? "-" : "") + formattedTime);
        }
        #watchRole() {
          if (!this.el) return;
          const { toggle } = this.$props;
          setAttribute(this.el, "role", toggle() ? "timer" : null);
          setAttribute(this.el, "tabindex", toggle() ? 0 : null);
        }
        #getSeconds(type) {
          const { bufferedEnd, duration, currentTime } = this.#media.$state;
          switch (type) {
            case "buffered":
              return bufferedEnd();
            case "duration":
              return duration();
            default:
              return currentTime();
          }
        }
        #shouldInvert() {
          return this.$props.remainder() && this.#invert() !== false;
        }
        #onToggle(event2) {
          event2.preventDefault();
          if (this.#invert() === null) {
            this.#invert.set(!this.$props.remainder());
            return;
          }
          this.#invert.set((v2) => !v2);
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-BligRjsM.js
  var MediaAnnouncer, Controls, ControlsGroup, tooltipContext, id2, Tooltip, TooltipTrigger, TooltipContent, ToggleButton, togglebutton__proto, GoogleCastButton, SliderVideo, slidervideo__proto, AudioGainSlider, SpeedSlider, QualitySlider, SliderChapters, sliderchapters__proto, RadioGroup, radiogroup__proto, __defProp3, __getOwnPropDesc2, __decorateClass2, ChaptersRadioGroup, DEFAULT_AUDIO_GAINS, AudioGainRadioGroup, audiogainradiogroup__proto, Gesture, CaptionsTextRenderer, Captions;
  var init_vidstack_BligRjsM = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-BligRjsM.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_Cpte_fRf();
      init_vidstack_Ds_q5BGO();
      init_vidstack_B6fvfDkI();
      init_vidstack_DXXgp8ue();
      init_vidstack_BOTZD4tC();
      init_vidstack_Dihypf8P();
      init_vidstack_DE4XvkHU();
      init_vidstack_oyBGi0R4();
      MediaAnnouncer = class extends Component {
        static props = {
          translations: null
        };
        static state = new State({
          label: null,
          busy: false
        });
        #media;
        #initializing = false;
        onSetup() {
          this.#media = useMediaContext();
        }
        onAttach(el) {
          el.style.display = "contents";
        }
        onConnect(el) {
          el.setAttribute("data-media-announcer", "");
          setAttributeIfEmpty(el, "role", "status");
          setAttributeIfEmpty(el, "aria-live", "polite");
          const { busy } = this.$state;
          this.setAttributes({
            "aria-busy": () => busy() ? "true" : null
          });
          this.#initializing = true;
          effect(this.#watchPaused.bind(this));
          effect(this.#watchVolume.bind(this));
          effect(this.#watchCaptions.bind(this));
          effect(this.#watchFullscreen.bind(this));
          effect(this.#watchPiP.bind(this));
          effect(this.#watchSeeking.bind(this));
          effect(this.#watchLabel.bind(this));
          tick();
          this.#initializing = false;
        }
        #watchPaused() {
          const { paused } = this.#media.$state;
          this.#setLabel(!paused() ? "Play" : "Pause");
        }
        #watchFullscreen() {
          const { fullscreen } = this.#media.$state;
          this.#setLabel(fullscreen() ? "Enter Fullscreen" : "Exit Fullscreen");
        }
        #watchPiP() {
          const { pictureInPicture } = this.#media.$state;
          this.#setLabel(pictureInPicture() ? "Enter PiP" : "Exit PiP");
        }
        #watchCaptions() {
          const { textTrack } = this.#media.$state;
          this.#setLabel(textTrack() ? "Closed-Captions On" : "Closed-Captions Off");
        }
        #watchVolume() {
          const { muted, volume, audioGain } = this.#media.$state;
          this.#setLabel(
            muted() || volume() === 0 ? "Mute" : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this.#translate("Volume")}`
          );
        }
        #startedSeekingAt = -1;
        #seekTimer = -1;
        #watchSeeking() {
          const { seeking, currentTime } = this.#media.$state, isSeeking = seeking();
          if (this.#startedSeekingAt > 0) {
            window.clearTimeout(this.#seekTimer);
            this.#seekTimer = window.setTimeout(() => {
              if (!this.scope) return;
              const newTime = peek(currentTime), seconds = Math.abs(newTime - this.#startedSeekingAt);
              if (seconds >= 1) {
                const isForward = newTime >= this.#startedSeekingAt, spokenTime = formatSpokenTime(seconds);
                this.#setLabel(
                  `${this.#translate(isForward ? "Seek Forward" : "Seek Backward")} ${spokenTime}`
                );
              }
              this.#startedSeekingAt = -1;
              this.#seekTimer = -1;
            }, 300);
          } else if (isSeeking) {
            this.#startedSeekingAt = peek(currentTime);
          }
        }
        #translate(word) {
          const { translations } = this.$props;
          return translations?.()?.[word || ""] ?? word;
        }
        #watchLabel() {
          const { label, busy } = this.$state, $label = this.#translate(label());
          if (this.#initializing) return;
          busy.set(true);
          const id3 = window.setTimeout(() => void busy.set(false), 150);
          this.el && setAttribute(this.el, "aria-label", $label);
          if (isString($label)) {
            this.dispatch("change", { detail: $label });
          }
          return () => window.clearTimeout(id3);
        }
        #setLabel(word) {
          const { label } = this.$state;
          label.set(word);
        }
      };
      Controls = class extends Component {
        static props = {
          hideDelay: 2e3,
          hideOnMouseLeave: false
        };
        #media;
        onSetup() {
          this.#media = useMediaContext();
          effect(this.#watchProps.bind(this));
        }
        onAttach(el) {
          const { pictureInPicture, fullscreen } = this.#media.$state;
          setStyle(el, "pointer-events", "none");
          setAttributeIfEmpty(el, "role", "group");
          this.setAttributes({
            "data-visible": this.#isShowing.bind(this),
            "data-fullscreen": fullscreen,
            "data-pip": pictureInPicture
          });
          effect(() => {
            this.dispatch("change", { detail: this.#isShowing() });
          });
          effect(this.#hideControls.bind(this));
          effect(() => {
            const isFullscreen2 = fullscreen();
            for (const side of ["top", "right", "bottom", "left"]) {
              setStyle(el, `padding-${side}`, isFullscreen2 && `env(safe-area-inset-${side})`);
            }
          });
        }
        #hideControls() {
          if (!this.el) return;
          const { nativeControls } = this.#media.$state, isHidden = nativeControls();
          setAttribute(this.el, "aria-hidden", isHidden ? "true" : null);
          setStyle(this.el, "display", isHidden ? "none" : null);
        }
        #watchProps() {
          const { controls } = this.#media.player, { hideDelay, hideOnMouseLeave } = this.$props;
          controls.defaultDelay = hideDelay() === 2e3 ? this.#media.$props.controlsDelay() : hideDelay();
          controls.hideOnMouseLeave = hideOnMouseLeave();
        }
        #isShowing() {
          const { controlsVisible } = this.#media.$state;
          return controlsVisible();
        }
      };
      ControlsGroup = class extends Component {
        onAttach(el) {
          if (!el.style.pointerEvents) setStyle(el, "pointer-events", "auto");
        }
      };
      tooltipContext = createContext();
      id2 = 0;
      Tooltip = class extends Component {
        static props = {
          showDelay: 700
        };
        #id = `media-tooltip-${++id2}`;
        #trigger = signal(null);
        #content = signal(null);
        #showing = signal(false);
        constructor() {
          super();
          new FocusVisibleController();
          const { showDelay } = this.$props;
          new Popper({
            trigger: this.#trigger,
            content: this.#content,
            showDelay,
            listen(trigger, show, hide2) {
              effect(() => {
                if ($keyboard()) listenEvent(trigger, "focus", show);
                listenEvent(trigger, "blur", hide2);
              });
              new EventsController(trigger).add("touchstart", (e6) => e6.preventDefault(), { passive: false }).add("mouseenter", show).add("mouseleave", hide2);
            },
            onChange: this.#onShowingChange.bind(this)
          });
        }
        onAttach(el) {
          el.style.setProperty("display", "contents");
        }
        onSetup() {
          provideContext(tooltipContext, {
            trigger: this.#trigger,
            content: this.#content,
            showing: this.#showing,
            attachTrigger: this.#attachTrigger.bind(this),
            detachTrigger: this.#detachTrigger.bind(this),
            attachContent: this.#attachContent.bind(this),
            detachContent: this.#detachContent.bind(this)
          });
        }
        #attachTrigger(el) {
          this.#trigger.set(el);
          let tooltipName = el.getAttribute("data-media-tooltip");
          if (tooltipName) {
            this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, "");
          }
          setAttribute(el, "data-describedby", this.#id);
        }
        #detachTrigger(el) {
          el.removeAttribute("data-describedby");
          el.removeAttribute("aria-describedby");
          this.#trigger.set(null);
        }
        #attachContent(el) {
          el.setAttribute("id", this.#id);
          el.style.display = "none";
          setAttributeIfEmpty(el, "role", "tooltip");
          this.#content.set(el);
        }
        #detachContent(el) {
          el.removeAttribute("id");
          el.removeAttribute("role");
          this.#content.set(null);
        }
        #onShowingChange(isShowing) {
          const trigger = this.#trigger(), content = this.#content();
          if (trigger) {
            setAttribute(trigger, "aria-describedby", isShowing ? this.#id : null);
          }
          for (const el of [this.el, trigger, content]) {
            el && setAttribute(el, "data-visible", isShowing);
          }
          this.#showing.set(isShowing);
        }
      };
      TooltipTrigger = class extends Component {
        constructor() {
          super();
          new FocusVisibleController();
        }
        onConnect(el) {
          onDispose(
            requestScopedAnimationFrame(() => {
              if (!this.connectScope) return;
              this.#attach();
              const tooltip = useContext(tooltipContext);
              onDispose(() => {
                const button = this.#getButton();
                button && tooltip.detachTrigger(button);
              });
            })
          );
        }
        #attach() {
          const button = this.#getButton(), tooltip = useContext(tooltipContext);
          button && tooltip.attachTrigger(button);
        }
        #getButton() {
          const candidate = this.el.firstElementChild;
          return candidate?.localName === "button" || candidate?.getAttribute("role") === "button" ? candidate : this.el;
        }
      };
      TooltipContent = class extends Component {
        static props = {
          placement: "top center",
          offset: 0,
          alignOffset: 0
        };
        constructor() {
          super();
          new FocusVisibleController();
          const { placement } = this.$props;
          this.setAttributes({
            "data-placement": placement
          });
        }
        onAttach(el) {
          this.#attach(el);
          Object.assign(el.style, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "max-content"
          });
        }
        onConnect(el) {
          this.#attach(el);
          const tooltip = useContext(tooltipContext);
          onDispose(() => tooltip.detachContent(el));
          onDispose(
            requestScopedAnimationFrame(() => {
              if (!this.connectScope) return;
              effect(this.#watchPlacement.bind(this));
            })
          );
        }
        #attach(el) {
          const tooltip = useContext(tooltipContext);
          tooltip.attachContent(el);
        }
        #watchPlacement() {
          const { showing } = useContext(tooltipContext);
          if (!showing()) return;
          const { placement, offset: mainOffset, alignOffset } = this.$props;
          return autoPlacement2(this.el, this.#getTrigger(), placement(), {
            offsetVarName: "media-tooltip",
            xOffset: alignOffset(),
            yOffset: mainOffset()
          });
        }
        #getTrigger() {
          return useContext(tooltipContext).trigger();
        }
      };
      ToggleButton = class extends Component {
        static props = {
          disabled: false,
          defaultPressed: false
        };
        #pressed = signal(false);
        /**
         * Whether the toggle is currently in a `pressed` state.
         */
        get pressed() {
          return this.#pressed();
        }
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#pressed
          });
        }
      };
      togglebutton__proto = ToggleButton.prototype;
      prop(togglebutton__proto, "pressed");
      GoogleCastButton = class extends Component {
        static props = ToggleButtonController.props;
        #media;
        constructor() {
          super();
          new ToggleButtonController({
            isPresssed: this.#isPressed.bind(this),
            onPress: this.#onPress.bind(this)
          });
        }
        onSetup() {
          this.#media = useMediaContext();
          const { canGoogleCast, isGoogleCastConnected } = this.#media.$state;
          this.setAttributes({
            "data-active": isGoogleCastConnected,
            "data-supported": canGoogleCast,
            "data-state": this.#getState.bind(this),
            "aria-hidden": $ariaBool(() => !canGoogleCast())
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-tooltip", "google-cast");
          setARIALabel(el, this.#getDefaultLabel.bind(this));
        }
        #onPress(event2) {
          const remote = this.#media.remote;
          remote.requestGoogleCast(event2);
        }
        #isPressed() {
          const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
          return remotePlaybackType() === "google-cast" && remotePlaybackState() !== "disconnected";
        }
        #getState() {
          const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
          return remotePlaybackType() === "google-cast" && remotePlaybackState();
        }
        #getDefaultLabel() {
          const { remotePlaybackState } = this.#media.$state;
          return `Google Cast ${remotePlaybackState()}`;
        }
      };
      SliderVideo = class extends Component {
        static props = {
          src: null,
          crossOrigin: null
        };
        static state = new State({
          video: null,
          src: null,
          crossOrigin: null,
          canPlay: false,
          error: null,
          hidden: false
        });
        #media;
        #slider;
        get video() {
          return this.$state.video();
        }
        onSetup() {
          this.#media = useMediaContext();
          this.#slider = useState(Slider.state);
          this.#watchCrossOrigin();
          this.setAttributes({
            "data-loading": this.#isLoading.bind(this),
            "data-hidden": this.$state.hidden,
            "data-error": this.#hasError.bind(this),
            "aria-hidden": $ariaBool(this.$state.hidden)
          });
        }
        onAttach(el) {
          effect(this.#watchVideo.bind(this));
          effect(this.#watchSrc.bind(this));
          effect(this.#watchCrossOrigin.bind(this));
          effect(this.#watchHidden.bind(this));
          effect(this.#onSrcChange.bind(this));
          effect(this.#onUpdateTime.bind(this));
        }
        #watchVideo() {
          const video = this.$state.video();
          if (!video) return;
          if (video.readyState >= 2) this.#onCanPlay();
          new EventsController(video).add("canplay", this.#onCanPlay.bind(this)).add("error", this.#onError.bind(this));
        }
        #watchSrc() {
          const { src } = this.$state, { canLoad } = this.#media.$state;
          src.set(canLoad() ? this.$props.src() : null);
        }
        #watchCrossOrigin() {
          const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.#media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
          crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
        }
        #isLoading() {
          const { canPlay, hidden } = this.$state;
          return !canPlay() && !hidden();
        }
        #hasError() {
          const { error } = this.$state;
          return !isNull(error);
        }
        #watchHidden() {
          const { src, hidden } = this.$state, { canLoad, duration } = this.#media.$state;
          hidden.set(canLoad() && (!src() || this.#hasError() || !Number.isFinite(duration())));
        }
        #onSrcChange() {
          const { src, canPlay, error } = this.$state;
          src();
          canPlay.set(false);
          error.set(null);
        }
        #onCanPlay(event2) {
          const { canPlay, error } = this.$state;
          canPlay.set(true);
          error.set(null);
          this.dispatch("can-play", { trigger: event2 });
        }
        #onError(event2) {
          const { canPlay, error } = this.$state;
          canPlay.set(false);
          error.set(event2);
          this.dispatch("error", { trigger: event2 });
        }
        #onUpdateTime() {
          const { video, canPlay } = this.$state, { duration } = this.#media.$state, { pointerRate } = this.#slider, media = video(), canUpdate = canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());
          if (canUpdate) {
            media.currentTime = pointerRate() * duration();
          }
        }
      };
      slidervideo__proto = SliderVideo.prototype;
      prop(slidervideo__proto, "video");
      AudioGainSlider = class extends Component {
        static props = {
          ...SliderController.props,
          step: 25,
          keyStep: 25,
          shiftKeyMultiplier: 2,
          min: 0,
          max: 300
        };
        static state = sliderState;
        #media;
        onSetup() {
          this.#media = useMediaContext();
          provideContext(sliderValueFormatContext, {
            default: "percent",
            percent: (_2, decimalPlaces) => {
              return round2(this.$state.value(), decimalPlaces) + "%";
            }
          });
          new SliderController({
            getStep: this.$props.step,
            getKeyStep: this.$props.keyStep,
            roundValue: Math.round,
            isDisabled: this.#isDisabled.bind(this),
            aria: {
              valueNow: this.#getARIAValueNow.bind(this),
              valueText: this.#getARIAValueText.bind(this)
            },
            onDragValueChange: this.#onDragValueChange.bind(this),
            onValueChange: this.#onValueChange.bind(this)
          }).attach(this);
          effect(this.#watchMinMax.bind(this));
          effect(this.#watchAudioGain.bind(this));
        }
        onAttach(el) {
          el.setAttribute("data-media-audio-gain-slider", "");
          setAttributeIfEmpty(el, "aria-label", "Audio Boost");
          const { canSetAudioGain } = this.#media.$state;
          this.setAttributes({
            "data-supported": canSetAudioGain,
            "aria-hidden": $ariaBool(() => !canSetAudioGain())
          });
        }
        #getARIAValueNow() {
          const { value } = this.$state;
          return Math.round(value());
        }
        #getARIAValueText() {
          const { value } = this.$state;
          return value() + "%";
        }
        #watchMinMax() {
          const { min: min2, max: max2 } = this.$props;
          this.$state.min.set(min2());
          this.$state.max.set(max2());
        }
        #watchAudioGain() {
          const { audioGain } = this.#media.$state, value = ((audioGain() ?? 1) - 1) * 100;
          this.$state.value.set(value);
          this.dispatch("value-change", { detail: value });
        }
        #isDisabled() {
          const { disabled } = this.$props, { canSetAudioGain } = this.#media.$state;
          return disabled() || !canSetAudioGain();
        }
        #onAudioGainChange(event2) {
          if (!event2.trigger) return;
          const gain = round2(1 + event2.detail / 100, 2);
          this.#media.remote.changeAudioGain(gain, event2);
        }
        #onValueChange(event2) {
          this.#onAudioGainChange(event2);
        }
        #onDragValueChange(event2) {
          this.#onAudioGainChange(event2);
        }
      };
      SpeedSlider = class extends Component {
        static props = {
          ...SliderController.props,
          step: 0.25,
          keyStep: 0.25,
          shiftKeyMultiplier: 2,
          min: 0,
          max: 2
        };
        static state = sliderState;
        #media;
        onSetup() {
          this.#media = useMediaContext();
          new SliderController({
            getStep: this.$props.step,
            getKeyStep: this.$props.keyStep,
            roundValue: this.#roundValue,
            isDisabled: this.#isDisabled.bind(this),
            aria: {
              valueNow: this.#getARIAValueNow.bind(this),
              valueText: this.#getARIAValueText.bind(this)
            },
            onDragValueChange: this.#onDragValueChange.bind(this),
            onValueChange: this.#onValueChange.bind(this)
          }).attach(this);
          effect(this.#watchMinMax.bind(this));
          effect(this.#watchPlaybackRate.bind(this));
        }
        onAttach(el) {
          el.setAttribute("data-media-speed-slider", "");
          setAttributeIfEmpty(el, "aria-label", "Speed");
          const { canSetPlaybackRate } = this.#media.$state;
          this.setAttributes({
            "data-supported": canSetPlaybackRate,
            "aria-hidden": $ariaBool(() => !canSetPlaybackRate())
          });
        }
        #getARIAValueNow() {
          const { value } = this.$state;
          return value();
        }
        #getARIAValueText() {
          const { value } = this.$state;
          return value() + "x";
        }
        #watchMinMax() {
          const { min: min2, max: max2 } = this.$props;
          this.$state.min.set(min2());
          this.$state.max.set(max2());
        }
        #watchPlaybackRate() {
          const { playbackRate } = this.#media.$state;
          const newValue = playbackRate();
          this.$state.value.set(newValue);
          this.dispatch("value-change", { detail: newValue });
        }
        #roundValue(value) {
          return round2(value, 2);
        }
        #isDisabled() {
          const { disabled } = this.$props, { canSetPlaybackRate } = this.#media.$state;
          return disabled() || !canSetPlaybackRate();
        }
        #throttledSpeedChange = functionThrottle(this.#onPlaybackRateChange.bind(this), 25);
        #onPlaybackRateChange(event2) {
          if (!event2.trigger) return;
          const rate = event2.detail;
          this.#media.remote.changePlaybackRate(rate, event2);
        }
        #onValueChange(event2) {
          this.#throttledSpeedChange(event2);
        }
        #onDragValueChange(event2) {
          this.#throttledSpeedChange(event2);
        }
      };
      QualitySlider = class extends Component {
        static props = {
          ...SliderController.props,
          step: 1,
          keyStep: 1,
          shiftKeyMultiplier: 1
        };
        static state = sliderState;
        #media;
        #sortedQualities = computed(() => {
          const { qualities } = this.#media.$state;
          return sortVideoQualities(qualities());
        });
        onSetup() {
          this.#media = useMediaContext();
          new SliderController({
            getStep: this.$props.step,
            getKeyStep: this.$props.keyStep,
            roundValue: Math.round,
            isDisabled: this.#isDisabled.bind(this),
            aria: {
              valueNow: this.#getARIAValueNow.bind(this),
              valueText: this.#getARIAValueText.bind(this)
            },
            onDragValueChange: this.#onDragValueChange.bind(this),
            onValueChange: this.#onValueChange.bind(this)
          }).attach(this);
          effect(this.#watchMax.bind(this));
          effect(this.#watchQuality.bind(this));
        }
        onAttach(el) {
          el.setAttribute("data-media-quality-slider", "");
          setAttributeIfEmpty(el, "aria-label", "Video Quality");
          const { qualities, canSetQuality } = this.#media.$state, $supported = computed(() => canSetQuality() && qualities().length > 0);
          this.setAttributes({
            "data-supported": $supported,
            "aria-hidden": $ariaBool(() => !$supported())
          });
        }
        #getARIAValueNow() {
          const { value } = this.$state;
          return value();
        }
        #getARIAValueText() {
          const { quality } = this.#media.$state;
          if (!quality()) return "";
          const { height, bitrate } = quality(), bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null;
          return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : "Auto";
        }
        #watchMax() {
          const $qualities = this.#sortedQualities();
          this.$state.max.set(Math.max(0, $qualities.length - 1));
        }
        #watchQuality() {
          let { quality } = this.#media.$state, $qualities = this.#sortedQualities(), value = Math.max(0, $qualities.indexOf(quality()));
          this.$state.value.set(value);
          this.dispatch("value-change", { detail: value });
        }
        #isDisabled() {
          const { disabled } = this.$props, { canSetQuality, qualities } = this.#media.$state;
          return disabled() || qualities().length <= 1 || !canSetQuality();
        }
        #throttledQualityChange = functionThrottle(this.#onQualityChange.bind(this), 25);
        #onQualityChange(event2) {
          if (!event2.trigger) return;
          const { qualities } = this.#media, quality = peek(this.#sortedQualities)[event2.detail];
          this.#media.remote.changeQuality(qualities.indexOf(quality), event2);
        }
        #onValueChange(event2) {
          this.#throttledQualityChange(event2);
        }
        #onDragValueChange(event2) {
          this.#throttledQualityChange(event2);
        }
      };
      SliderChapters = class extends Component {
        static props = {
          disabled: false
        };
        #media;
        #sliderState;
        #updateScope;
        #titleRef = null;
        #refs = [];
        #$track = signal(null);
        #$cues = signal([]);
        #activeIndex = signal(-1);
        #activePointerIndex = signal(-1);
        #bufferedIndex = 0;
        get cues() {
          return this.#$cues();
        }
        get activeCue() {
          return this.#$cues()[this.#activeIndex()] || null;
        }
        get activePointerCue() {
          return this.#$cues()[this.#activePointerIndex()] || null;
        }
        onSetup() {
          this.#media = useMediaContext();
          this.#sliderState = useState(TimeSlider.state);
        }
        onAttach(el) {
          watchActiveTextTrack(this.#media.textTracks, "chapters", this.#setTrack.bind(this));
          effect(this.#watchSource.bind(this));
        }
        onConnect() {
          onDispose(() => this.#reset.bind(this));
        }
        onDestroy() {
          this.#setTrack(null);
        }
        setRefs(refs) {
          this.#refs = refs;
          this.#updateScope?.dispose();
          if (this.#refs.length === 1) {
            const el = this.#refs[0];
            el.style.width = "100%";
            el.style.setProperty("--chapter-fill", "var(--slider-fill)");
            el.style.setProperty("--chapter-progress", "var(--slider-progress)");
          } else if (this.#refs.length > 0) {
            scoped(() => this.#watch(), this.#updateScope = createScope());
          }
        }
        #setTrack(track) {
          if (peek(this.#$track) === track) return;
          this.#reset();
          this.#$track.set(track);
        }
        #reset() {
          this.#refs = [];
          this.#$cues.set([]);
          this.#activeIndex.set(-1);
          this.#activePointerIndex.set(-1);
          this.#bufferedIndex = 0;
          this.#updateScope?.dispose();
        }
        #watch() {
          if (!this.#refs.length) return;
          effect(this.#watchUpdates.bind(this));
        }
        #watchUpdates() {
          const { hidden } = this.#sliderState;
          if (hidden()) return;
          effect(this.#watchContainerWidths.bind(this));
          effect(this.#watchFillPercent.bind(this));
          effect(this.#watchPointerPercent.bind(this));
          effect(this.#watchBufferedPercent.bind(this));
        }
        #watchContainerWidths() {
          const cues = this.#$cues();
          if (!cues.length) return;
          let cue, { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd() || cues[cues.length - 1].endTime, duration = endTime - startTime, remainingWidth = 100;
          for (let i4 = 0; i4 < cues.length; i4++) {
            cue = cues[i4];
            if (this.#refs[i4]) {
              const width = i4 === cues.length - 1 ? remainingWidth : round2((cue.endTime - Math.max(startTime, cue.startTime)) / duration * 100, 3);
              this.#refs[i4].style.width = width + "%";
              remainingWidth -= width;
            }
          }
        }
        #watchFillPercent() {
          let { liveEdge, seekableStart, seekableEnd } = this.#media.$state, { fillPercent, value } = this.#sliderState, cues = this.#$cues(), isLiveEdge = liveEdge(), prevActiveIndex = peek(this.#activeIndex), currentChapter = cues[prevActiveIndex];
          let currentActiveIndex = isLiveEdge ? this.#$cues.length - 1 : this.#findActiveChapterIndex(
            currentChapter ? currentChapter.startTime / seekableEnd() * 100 <= peek(value) ? prevActiveIndex : 0 : 0,
            fillPercent()
          );
          if (isLiveEdge || !currentChapter) {
            this.#updateFillPercents(0, cues.length, 100);
          } else if (currentActiveIndex > prevActiveIndex) {
            this.#updateFillPercents(prevActiveIndex, currentActiveIndex, 100);
          } else if (currentActiveIndex < prevActiveIndex) {
            this.#updateFillPercents(currentActiveIndex + 1, prevActiveIndex + 1, 0);
          }
          const percent = isLiveEdge ? 100 : this.#calcPercent(
            cues[currentActiveIndex],
            fillPercent(),
            seekableStart(),
            this.#getEndTime(cues)
          );
          this.#updateFillPercent(this.#refs[currentActiveIndex], percent);
          this.#activeIndex.set(currentActiveIndex);
        }
        #watchPointerPercent() {
          let { pointing, pointerPercent } = this.#sliderState;
          if (!pointing()) {
            this.#activePointerIndex.set(-1);
            return;
          }
          const activeIndex = this.#findActiveChapterIndex(0, pointerPercent());
          this.#activePointerIndex.set(activeIndex);
        }
        #updateFillPercents(start, end, percent) {
          for (let i4 = start; i4 < end; i4++) this.#updateFillPercent(this.#refs[i4], percent);
        }
        #updateFillPercent(ref, percent) {
          if (!ref) return;
          ref.style.setProperty("--chapter-fill", percent + "%");
          setAttribute(ref, "data-active", percent > 0 && percent < 100);
          setAttribute(ref, "data-ended", percent === 100);
        }
        #findActiveChapterIndex(startIndex, percent) {
          let chapterPercent = 0, cues = this.#$cues();
          if (percent === 0) return 0;
          else if (percent === 100) return cues.length - 1;
          let { seekableStart } = this.#media.$state, startTime = seekableStart(), endTime = this.#getEndTime(cues);
          for (let i4 = startIndex; i4 < cues.length; i4++) {
            chapterPercent = this.#calcPercent(cues[i4], percent, startTime, endTime);
            if (chapterPercent >= 0 && chapterPercent < 100) return i4;
          }
          return 0;
        }
        #watchBufferedPercent() {
          this.#updateBufferedPercent(this.#bufferedPercent());
        }
        #updateBufferedPercent = animationFrameThrottle((bufferedPercent) => {
          let percent, cues = this.#$cues(), { seekableStart } = this.#media.$state, startTime = seekableStart(), endTime = this.#getEndTime(cues);
          for (let i4 = this.#bufferedIndex; i4 < this.#refs.length; i4++) {
            percent = this.#calcPercent(cues[i4], bufferedPercent, startTime, endTime);
            this.#refs[i4]?.style.setProperty("--chapter-progress", percent + "%");
            if (percent < 100) {
              this.#bufferedIndex = i4;
              break;
            }
          }
        });
        #bufferedPercent = computed(this.#calcMediaBufferedPercent.bind(this));
        #calcMediaBufferedPercent() {
          const { bufferedEnd, duration } = this.#media.$state;
          return round2(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
        }
        #getEndTime(cues) {
          const { seekableEnd } = this.#media.$state, endTime = seekableEnd();
          return Number.isFinite(endTime) ? endTime : cues[cues.length - 1]?.endTime || 0;
        }
        #calcPercent(cue, percent, startTime, endTime) {
          if (!cue) return 0;
          const cues = this.#$cues();
          if (cues.length === 0) return 0;
          const duration = endTime - startTime, cueStartTime = Math.max(0, cue.startTime - startTime), cueEndTime = Math.min(endTime, cue.endTime) - startTime;
          const startRatio = cueStartTime / duration, startPercent = startRatio * 100, endPercent = Math.min(1, startRatio + (cueEndTime - cueStartTime) / duration) * 100;
          return Math.max(
            0,
            round2(
              percent >= endPercent ? 100 : (percent - startPercent) / (endPercent - startPercent) * 100,
              3
            )
          );
        }
        #fillGaps(cues) {
          let chapters = [], { seekableStart, seekableEnd, duration } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
          cues = cues.filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime);
          const firstCue = cues[0];
          if (firstCue && firstCue.startTime > startTime) {
            chapters.push(new window.VTTCue(startTime, firstCue.startTime, ""));
          }
          for (let i4 = 0; i4 < cues.length - 1; i4++) {
            const currentCue = cues[i4], nextCue = cues[i4 + 1];
            chapters.push(currentCue);
            if (nextCue) {
              const timeDiff = nextCue.startTime - currentCue.endTime;
              if (timeDiff > 0) {
                chapters.push(new window.VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ""));
              }
            }
          }
          const lastCue = cues[cues.length - 1];
          if (lastCue) {
            chapters.push(lastCue);
            const endTime2 = duration();
            if (endTime2 >= 0 && endTime2 - lastCue.endTime > 1) {
              chapters.push(new window.VTTCue(lastCue.endTime, duration(), ""));
            }
          }
          return chapters;
        }
        #watchSource() {
          const { source } = this.#media.$state;
          source();
          this.#onTrackChange();
        }
        #onTrackChange() {
          if (!this.scope) return;
          const { disabled } = this.$props;
          if (disabled()) {
            this.#$cues.set([]);
            this.#activeIndex.set(0);
            this.#bufferedIndex = 0;
            return;
          }
          const track = this.#$track();
          if (track) {
            const onCuesChange = this.#onCuesChange.bind(this);
            onCuesChange();
            new EventsController(track).add("add-cue", onCuesChange).add("remove-cue", onCuesChange);
            effect(this.#watchMediaDuration.bind(this));
          }
          this.#titleRef = this.#findChapterTitleRef();
          if (this.#titleRef) effect(this.#onChapterTitleChange.bind(this));
          return () => {
            if (this.#titleRef) {
              this.#titleRef.textContent = "";
              this.#titleRef = null;
            }
          };
        }
        #watchMediaDuration() {
          this.#media.$state.duration();
          this.#onCuesChange();
        }
        #onCuesChange = functionDebounce(
          () => {
            const track = peek(this.#$track);
            if (!this.scope || !track || !track.cues.length) return;
            this.#$cues.set(this.#fillGaps(track.cues));
            this.#activeIndex.set(0);
            this.#bufferedIndex = 0;
          },
          150,
          true
        );
        #onChapterTitleChange() {
          const cue = this.activePointerCue || this.activeCue;
          if (this.#titleRef) this.#titleRef.textContent = cue?.text || "";
        }
        #findParentSlider() {
          let node = this.el;
          while (node && node.getAttribute("role") !== "slider") {
            node = node.parentElement;
          }
          return node;
        }
        #findChapterTitleRef() {
          const slider = this.#findParentSlider();
          return slider ? slider.querySelector('[data-part="chapter-title"]') : null;
        }
      };
      sliderchapters__proto = SliderChapters.prototype;
      prop(sliderchapters__proto, "cues");
      prop(sliderchapters__proto, "activeCue");
      prop(sliderchapters__proto, "activePointerCue");
      method(sliderchapters__proto, "setRefs");
      RadioGroup = class extends Component {
        static props = {
          value: ""
        };
        #controller;
        /**
         * A list of radio values that belong this group.
         */
        get values() {
          return this.#controller.values;
        }
        /**
         * The radio value that is checked in this group.
         */
        get value() {
          return this.#controller.value;
        }
        set value(newValue) {
          this.#controller.value = newValue;
        }
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          effect(this.#watchValue.bind(this));
        }
        #watchValue() {
          this.#controller.value = this.$props.value();
        }
        #onValueChange(value, trigger) {
          const event2 = this.createEvent("change", { detail: value, trigger });
          this.dispatch(event2);
        }
      };
      radiogroup__proto = RadioGroup.prototype;
      prop(radiogroup__proto, "values");
      prop(radiogroup__proto, "value");
      __defProp3 = Object.defineProperty;
      __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      __decorateClass2 = (decorators, target, key2, kind) => {
        var result = __getOwnPropDesc2(target, key2);
        for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
          if (decorator = decorators[i4])
            result = decorator(target, key2, result) || result;
        if (result) __defProp3(target, key2, result);
        return result;
      };
      ChaptersRadioGroup = class extends Component {
        static props = {
          thumbnails: null
        };
        #media;
        #menu;
        #controller;
        #track = signal(null);
        #cues = signal([]);
        get value() {
          return this.#controller.value;
        }
        get disabled() {
          return !this.#cues()?.length;
        }
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          this.#media = useMediaContext();
          if (hasProvidedContext(menuContext)) {
            this.#menu = useContext(menuContext);
          }
          const { thumbnails } = this.$props;
          this.setAttributes({
            "data-thumbnails": () => !!thumbnails()
          });
        }
        onAttach(el) {
          this.#menu?.attachObserver({
            onOpen: this.#onOpen.bind(this)
          });
        }
        getOptions() {
          const { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
          return this.#cues().map((cue, i4) => ({
            cue,
            value: i4.toString(),
            label: cue.text,
            startTime: formatTime(Math.max(0, cue.startTime - startTime)),
            duration: formatSpokenTime(
              Math.min(endTime, cue.endTime) - Math.max(startTime, cue.startTime)
            )
          }));
        }
        #onOpen() {
          peek(() => this.#watchCurrentTime());
        }
        onConnect(el) {
          effect(this.#watchCurrentTime.bind(this));
          effect(this.#watchControllerDisabled.bind(this));
          effect(this.#watchTrack.bind(this));
          watchActiveTextTrack(this.#media.textTracks, "chapters", this.#track.set);
        }
        #watchTrack() {
          const track = this.#track();
          if (!track) return;
          const onCuesChange = this.#onCuesChange.bind(this, track);
          onCuesChange();
          new EventsController(track).add("add-cue", onCuesChange).add("remove-cue", onCuesChange);
          return () => {
            this.#cues.set([]);
          };
        }
        #onCuesChange(track) {
          const { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
          this.#cues.set(
            [...track.cues].filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime)
          );
        }
        #watchCurrentTime() {
          if (!this.#menu?.expanded()) return;
          const track = this.#track();
          if (!track) {
            this.#controller.value = "-1";
            return;
          }
          const { realCurrentTime, seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd(), time = realCurrentTime(), activeCueIndex = this.#cues().findIndex((cue) => isCueActive(cue, time));
          this.#controller.value = activeCueIndex.toString();
          if (activeCueIndex >= 0) {
            requestScopedAnimationFrame(() => {
              if (!this.connectScope) return;
              const cue = this.#cues()[activeCueIndex], radio = this.el.querySelector(`[aria-checked='true']`), cueStartTime = Math.max(startTime, cue.startTime), duration = Math.min(endTime, cue.endTime) - cueStartTime, playedPercent = Math.max(0, time - cueStartTime) / duration * 100;
              radio && setStyle(radio, "--progress", round2(playedPercent, 3) + "%");
            });
          }
        }
        #watchControllerDisabled() {
          this.#menu?.disable(this.disabled);
        }
        #onValueChange(value, trigger) {
          if (this.disabled || !trigger) return;
          const index = +value, cues = this.#cues(), { clipStartTime } = this.#media.$state;
          if (isNumber(index) && cues?.[index]) {
            this.#controller.value = index.toString();
            this.#media.remote.seek(cues[index].startTime - clipStartTime(), trigger);
            this.dispatch("change", { detail: cues[index], trigger });
          }
        }
      };
      __decorateClass2([
        prop
      ], ChaptersRadioGroup.prototype, "value");
      __decorateClass2([
        prop
      ], ChaptersRadioGroup.prototype, "disabled");
      __decorateClass2([
        method
      ], ChaptersRadioGroup.prototype, "getOptions");
      DEFAULT_AUDIO_GAINS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
      AudioGainRadioGroup = class extends Component {
        static props = {
          normalLabel: "Disabled",
          gains: DEFAULT_AUDIO_GAINS
        };
        #media;
        #menu;
        #controller;
        get value() {
          return this.#controller.value;
        }
        get disabled() {
          const { gains } = this.$props, { canSetAudioGain } = this.#media.$state;
          return !canSetAudioGain() || gains().length === 0;
        }
        constructor() {
          super();
          this.#controller = new RadioGroupController();
          this.#controller.onValueChange = this.#onValueChange.bind(this);
        }
        onSetup() {
          this.#media = useMediaContext();
          if (hasProvidedContext(menuContext)) {
            this.#menu = useContext(menuContext);
          }
        }
        onConnect(el) {
          effect(this.#watchValue.bind(this));
          effect(this.#watchHintText.bind(this));
          effect(this.#watchControllerDisabled.bind(this));
        }
        getOptions() {
          const { gains, normalLabel } = this.$props;
          return gains().map((gain) => ({
            label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + "%",
            value: gain.toString()
          }));
        }
        #watchValue() {
          this.#controller.value = this.#getValue();
        }
        #watchHintText() {
          const { normalLabel } = this.$props, { audioGain } = this.#media.$state, gain = audioGain();
          this.#menu?.hint.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + "%");
        }
        #watchControllerDisabled() {
          this.#menu?.disable(this.disabled);
        }
        #getValue() {
          const { audioGain } = this.#media.$state;
          return audioGain()?.toString() ?? "1";
        }
        #onValueChange(value, trigger) {
          if (this.disabled) return;
          const gain = +value;
          this.#media.remote.changeAudioGain(gain, trigger);
          this.dispatch("change", { detail: gain, trigger });
        }
      };
      audiogainradiogroup__proto = AudioGainRadioGroup.prototype;
      prop(audiogainradiogroup__proto, "value");
      prop(audiogainradiogroup__proto, "disabled");
      method(audiogainradiogroup__proto, "getOptions");
      Gesture = class extends Component {
        static props = {
          disabled: false,
          event: void 0,
          action: void 0
        };
        #media;
        #provider = null;
        onSetup() {
          this.#media = useMediaContext();
          const { event: event2, action } = this.$props;
          this.setAttributes({
            event: event2,
            action
          });
        }
        onAttach(el) {
          el.setAttribute("data-media-gesture", "");
          el.style.setProperty("pointer-events", "none");
        }
        onConnect(el) {
          this.#provider = this.#media.player.el?.querySelector(
            "[data-media-provider]"
          );
          effect(this.#attachListener.bind(this));
        }
        #attachListener() {
          let eventType = this.$props.event(), disabled = this.$props.disabled();
          if (!this.#provider || !eventType || disabled) return;
          if (/^dbl/.test(eventType)) {
            eventType = eventType.split(/^dbl/)[1];
          }
          if (eventType === "pointerup" || eventType === "pointerdown") {
            const pointer = this.#media.$state.pointer();
            if (pointer === "coarse") {
              eventType = eventType === "pointerup" ? "touchend" : "touchstart";
            }
          }
          listenEvent(
            this.#provider,
            eventType,
            this.#acceptEvent.bind(this),
            { passive: false }
          );
        }
        #presses = 0;
        #pressTimerId = -1;
        #acceptEvent(event2) {
          if (this.$props.disabled() || isPointerEvent(event2) && (event2.button !== 0 || this.#media.activeMenu) || isTouchEvent(event2) && this.#media.activeMenu || isTouchPinchEvent(event2) || !this.#inBounds(event2)) {
            return;
          }
          event2.MEDIA_GESTURE = true;
          event2.preventDefault();
          const eventType = peek(this.$props.event), isDblEvent = eventType?.startsWith("dbl");
          if (!isDblEvent) {
            if (this.#presses === 0) {
              setTimeout(() => {
                if (this.#presses === 1) this.#handleEvent(event2);
              }, 250);
            }
          } else if (this.#presses === 1) {
            queueMicrotask(() => this.#handleEvent(event2));
            clearTimeout(this.#pressTimerId);
            this.#presses = 0;
            return;
          }
          if (this.#presses === 0) {
            this.#pressTimerId = window.setTimeout(() => {
              this.#presses = 0;
            }, 275);
          }
          this.#presses++;
        }
        #handleEvent(event2) {
          this.el.setAttribute("data-triggered", "");
          requestAnimationFrame(() => {
            if (this.#isTopLayer()) {
              this.#performAction(peek(this.$props.action), event2);
            }
            requestAnimationFrame(() => {
              this.el.removeAttribute("data-triggered");
            });
          });
        }
        /** Validate event occurred in gesture bounds. */
        #inBounds(event2) {
          if (!this.el) return false;
          if (isPointerEvent(event2) || isMouseEvent(event2) || isTouchEvent(event2)) {
            const touch = isTouchEvent(event2) ? event2.changedTouches[0] ?? event2.touches[0] : void 0;
            const clientX = touch?.clientX ?? event2.clientX;
            const clientY = touch?.clientY ?? event2.clientY;
            const rect = this.el.getBoundingClientRect();
            const inBounds = clientY >= rect.top && clientY <= rect.bottom && clientX >= rect.left && clientX <= rect.right;
            return event2.type.includes("leave") ? !inBounds : inBounds;
          }
          return true;
        }
        /** Validate gesture has the highest z-index in this triggered group. */
        #isTopLayer() {
          const gestures = this.#media.player.el.querySelectorAll(
            "[data-media-gesture][data-triggered]"
          );
          return Array.from(gestures).sort(
            (a3, b2) => +getComputedStyle(b2).zIndex - +getComputedStyle(a3).zIndex
          )[0] === this.el;
        }
        #performAction(action, trigger) {
          if (!action) return;
          const willTriggerEvent = new DOMEvent("will-trigger", {
            detail: action,
            cancelable: true,
            trigger
          });
          this.dispatchEvent(willTriggerEvent);
          if (willTriggerEvent.defaultPrevented) return;
          const [method2, value] = action.replace(/:([a-z])/, "-$1").split(":");
          if (action.includes(":fullscreen")) {
            this.#media.remote.toggleFullscreen("prefer-media", trigger);
          } else if (action.includes("seek:")) {
            this.#media.remote.seek(peek(this.#media.$state.currentTime) + (+value || 0), trigger);
          } else {
            this.#media.remote[kebabToCamelCase(method2)](trigger);
          }
          this.dispatch("trigger", {
            detail: action,
            trigger
          });
        }
      };
      CaptionsTextRenderer = class {
        priority = 10;
        #track = null;
        #renderer;
        #events;
        constructor(renderer) {
          this.#renderer = renderer;
        }
        attach() {
        }
        canRender() {
          return true;
        }
        detach() {
          this.#events?.abort();
          this.#events = void 0;
          this.#renderer.reset();
          this.#track = null;
        }
        changeTrack(track) {
          if (!track || this.#track === track) return;
          this.#events?.abort();
          this.#events = new EventsController(track);
          if (track.readyState < 2) {
            this.#renderer.reset();
            this.#events.add("load", () => this.#changeTrack(track), { once: true });
          } else {
            this.#changeTrack(track);
          }
          this.#events.add("add-cue", (event2) => {
            this.#renderer.addCue(event2.detail);
          }).add("remove-cue", (event2) => {
            this.#renderer.removeCue(event2.detail);
          });
          this.#track = track;
        }
        #changeTrack(track) {
          this.#renderer.changeTrack({
            cues: [...track.cues],
            regions: [...track.regions]
          });
        }
      };
      Captions = class _Captions extends Component {
        static props = {
          textDir: "ltr",
          exampleText: "Captions look like this."
        };
        #media;
        static lib = signal(null);
        onSetup() {
          this.#media = useMediaContext();
          this.setAttributes({
            "aria-hidden": $ariaBool(this.#isHidden.bind(this))
          });
        }
        onAttach(el) {
          el.style.setProperty("pointer-events", "none");
        }
        onConnect(el) {
          if (!_Captions.lib()) {
            Promise.resolve().then(() => (init_prod2(), prod_exports)).then((lib) => _Captions.lib.set(lib));
          }
          effect(this.#watchViewType.bind(this));
        }
        #isHidden() {
          const { textTrack, remotePlaybackState, iOSControls } = this.#media.$state, track = textTrack();
          return iOSControls() || remotePlaybackState() === "connected" || !track || !isTrackCaptionKind(track);
        }
        #watchViewType() {
          if (!_Captions.lib()) return;
          const { viewType } = this.#media.$state;
          if (viewType() === "audio") {
            return this.#setupAudioView();
          } else {
            return this.#setupVideoView();
          }
        }
        #setupAudioView() {
          effect(this.#onTrackChange.bind(this));
          this.#listenToFontStyleChanges(null);
          return () => {
            this.el.textContent = "";
          };
        }
        #onTrackChange() {
          if (this.#isHidden()) return;
          this.#onCueChange();
          const { textTrack } = this.#media.$state;
          listenEvent(textTrack(), "cue-change", this.#onCueChange.bind(this));
          effect(this.#onUpdateTimedNodes.bind(this));
        }
        #onCueChange() {
          this.el.textContent = "";
          if (this.#hideExampleTimer >= 0) {
            this.#removeExample();
          }
          const { realCurrentTime, textTrack } = this.#media.$state, { renderVTTCueString: renderVTTCueString2 } = _Captions.lib(), time = peek(realCurrentTime), activeCues = peek(textTrack).activeCues;
          for (const cue of activeCues) {
            const displayEl = this.#createCueDisplayElement(), cueEl = this.#createCueElement();
            cueEl.innerHTML = renderVTTCueString2(cue, time);
            displayEl.append(cueEl);
            this.el.append(cueEl);
          }
        }
        #onUpdateTimedNodes() {
          const { realCurrentTime } = this.#media.$state, { updateTimedVTTCueNodes: updateTimedVTTCueNodes2 } = _Captions.lib();
          updateTimedVTTCueNodes2(this.el, realCurrentTime());
        }
        #setupVideoView() {
          const { CaptionsRenderer: CaptionsRenderer2 } = _Captions.lib(), renderer = new CaptionsRenderer2(this.el), textRenderer = new CaptionsTextRenderer(renderer);
          this.#media.textRenderers.add(textRenderer);
          effect(this.#watchTextDirection.bind(this, renderer));
          effect(this.#watchMediaTime.bind(this, renderer));
          this.#listenToFontStyleChanges(renderer);
          return () => {
            this.el.textContent = "";
            this.#media.textRenderers.remove(textRenderer);
            renderer.destroy();
          };
        }
        #watchTextDirection(renderer) {
          renderer.dir = this.$props.textDir();
        }
        #watchMediaTime(renderer) {
          if (this.#isHidden()) return;
          const { realCurrentTime, textTrack } = this.#media.$state;
          renderer.currentTime = realCurrentTime();
          if (this.#hideExampleTimer >= 0 && textTrack()?.activeCues[0]) {
            this.#removeExample();
          }
        }
        #listenToFontStyleChanges(renderer) {
          const player = this.#media.player;
          if (!player) return;
          const onChange = this.#onFontStyleChange.bind(this, renderer);
          listenEvent(player, "vds-font-change", onChange);
        }
        #onFontStyleChange(renderer) {
          if (this.#hideExampleTimer >= 0) {
            this.#hideExample();
            return;
          }
          const { textTrack } = this.#media.$state;
          if (!textTrack()?.activeCues[0]) {
            this.#showExample();
          } else {
            renderer?.update(true);
          }
        }
        #showExample() {
          const display = this.#createCueDisplayElement();
          setAttribute(display, "data-example", "");
          const cue = this.#createCueElement();
          setAttribute(cue, "data-example", "");
          cue.textContent = this.$props.exampleText();
          display?.append(cue);
          this.el?.append(display);
          this.el?.setAttribute("data-example", "");
          this.#hideExample();
        }
        #hideExampleTimer = -1;
        #hideExample() {
          window.clearTimeout(this.#hideExampleTimer);
          this.#hideExampleTimer = window.setTimeout(this.#removeExample.bind(this), 2500);
        }
        #removeExample() {
          this.el?.removeAttribute("data-example");
          if (this.el?.querySelector("[data-example]")) this.el.textContent = "";
          this.#hideExampleTimer = -1;
        }
        #createCueDisplayElement() {
          const el = document.createElement("div");
          setAttribute(el, "data-part", "cue-display");
          return el;
        }
        #createCueElement() {
          const el = document.createElement("div");
          setAttribute(el, "data-part", "cue");
          return el;
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-D_DrbzHZ.js
  function renderMenuItemsTemplate(el, onCreate) {
    requestScopedAnimationFrame(() => {
      if (!el.connectScope) return;
      const template = el.querySelector("template");
      if (!template) return;
      effect(() => {
        const options = el.getOptions();
        cloneTemplate(template, options.length, (radio, i4) => {
          const { label, value } = options[i4], labelEl = radio.querySelector(`[data-part="label"]`);
          radio.setAttribute("value", value);
          if (labelEl) {
            if (isString(label)) {
              labelEl.textContent = label;
            } else {
              effect(() => {
                labelEl.textContent = label();
              });
            }
          }
          onCreate?.(radio, options[i4], i4);
        });
      });
    });
  }
  var imgTemplate, MediaThumbnailElement, MediaTimeElement, MediaAirPlayButtonElement, MediaCaptionButtonElement, MediaFullscreenButtonElement, MediaLiveButtonElement, MediaMuteButtonElement, MediaPIPButtonElement, MediaPlayButtonElement, MediaSeekButtonElement, MediaAudioRadioGroupElement, MediaCaptionsRadioGroupElement, MediaMenuElement, MediaMenuButtonElement, MediaMenuItemElement, MediaMenuItemsElement, MediaSpeedRadioGroupElement, MediaQualityRadioGroupElement, MediaRadioElement, MediaSliderThumbnailElement, MediaSliderValueElement, MediaTimeSliderElement, MediaSliderPreviewElement, MediaVolumeSliderElement;
  var init_vidstack_D_DrbzHZ = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-D_DrbzHZ.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_B6fvfDkI();
      init_vidstack_Ds_q5BGO();
      init_vidstack_Cpte_fRf();
      imgTemplate = /* @__PURE__ */ createTemplate(
        '<img loading="eager" decoding="async" aria-hidden="true">'
      );
      MediaThumbnailElement = class extends Host(HTMLElement, Thumbnail) {
        static tagName = "media-thumbnail";
        static attrs = {
          crossOrigin: "crossorigin"
        };
        #media;
        #img = this.#createImg();
        onSetup() {
          this.#media = useMediaContext();
          this.$state.img.set(this.#img);
        }
        onConnect() {
          const { src, crossOrigin } = this.$state;
          if (this.#img.parentNode !== this) {
            this.prepend(this.#img);
          }
          effect(() => {
            setAttribute(this.#img, "src", src());
            setAttribute(this.#img, "crossorigin", crossOrigin());
          });
        }
        #createImg() {
          return cloneTemplateContent(imgTemplate);
        }
      };
      MediaTimeElement = class extends Host(HTMLElement, Time) {
        static tagName = "media-time";
        onConnect() {
          effect(() => {
            this.textContent = this.$state.timeText();
          });
        }
      };
      MediaAirPlayButtonElement = class extends Host(HTMLElement, AirPlayButton) {
        static tagName = "media-airplay-button";
      };
      MediaCaptionButtonElement = class extends Host(HTMLElement, CaptionButton) {
        static tagName = "media-caption-button";
      };
      MediaFullscreenButtonElement = class extends Host(HTMLElement, FullscreenButton) {
        static tagName = "media-fullscreen-button";
      };
      MediaLiveButtonElement = class extends Host(HTMLElement, LiveButton) {
        static tagName = "media-live-button";
      };
      MediaMuteButtonElement = class extends Host(HTMLElement, MuteButton) {
        static tagName = "media-mute-button";
      };
      MediaPIPButtonElement = class extends Host(HTMLElement, PIPButton) {
        static tagName = "media-pip-button";
      };
      MediaPlayButtonElement = class extends Host(HTMLElement, PlayButton) {
        static tagName = "media-play-button";
      };
      MediaSeekButtonElement = class extends Host(HTMLElement, SeekButton) {
        static tagName = "media-seek-button";
      };
      MediaAudioRadioGroupElement = class extends Host(HTMLElement, AudioRadioGroup) {
        static tagName = "media-audio-radio-group";
        onConnect() {
          renderMenuItemsTemplate(this);
        }
      };
      MediaCaptionsRadioGroupElement = class extends Host(HTMLElement, CaptionsRadioGroup) {
        static tagName = "media-captions-radio-group";
        onConnect() {
          renderMenuItemsTemplate(this);
        }
      };
      MediaMenuElement = class extends Host(HTMLElement, Menu) {
        static tagName = "media-menu";
      };
      MediaMenuButtonElement = class extends Host(HTMLElement, MenuButton) {
        static tagName = "media-menu-button";
      };
      MediaMenuItemElement = class extends Host(HTMLElement, MenuItem) {
        static tagName = "media-menu-item";
      };
      MediaMenuItemsElement = class extends Host(HTMLElement, MenuItems) {
        static tagName = "media-menu-items";
      };
      MediaSpeedRadioGroupElement = class extends Host(HTMLElement, SpeedRadioGroup) {
        static tagName = "media-speed-radio-group";
        onConnect() {
          renderMenuItemsTemplate(this);
        }
      };
      MediaQualityRadioGroupElement = class extends Host(HTMLElement, QualityRadioGroup) {
        static tagName = "media-quality-radio-group";
        onConnect() {
          renderMenuItemsTemplate(this, (el, option) => {
            const bitrate = option.bitrate, bitrateEl = el.querySelector('[data-part="bitrate"]');
            if (bitrate && bitrateEl) {
              effect(() => {
                bitrateEl.textContent = bitrate() || "";
              });
            }
          });
        }
      };
      MediaRadioElement = class extends Host(HTMLElement, Radio) {
        static tagName = "media-radio";
      };
      MediaSliderThumbnailElement = class extends MediaThumbnailElement {
        static tagName = "media-slider-thumbnail";
        #media;
        #slider;
        onSetup() {
          super.onSetup();
          this.#media = useMediaContext();
          this.#slider = useState(Slider.state);
        }
        onConnect() {
          super.onConnect();
          effect(this.#watchTime.bind(this));
        }
        #watchTime() {
          const { duration, clipStartTime } = this.#media.$state;
          this.time = clipStartTime() + this.#slider.pointerRate() * duration();
        }
      };
      MediaSliderValueElement = class extends Host(HTMLElement, SliderValue) {
        static tagName = "media-slider-value";
        static attrs = {
          padMinutes: {
            converter: BOOLEAN
          }
        };
        onConnect() {
          effect(() => {
            this.textContent = this.getValueText();
          });
        }
      };
      MediaTimeSliderElement = class extends Host(HTMLElement, TimeSlider) {
        static tagName = "media-time-slider";
      };
      MediaSliderPreviewElement = class extends Host(HTMLElement, SliderPreview) {
        static tagName = "media-slider-preview";
      };
      MediaVolumeSliderElement = class extends Host(HTMLElement, VolumeSlider) {
        static tagName = "media-volume-slider";
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-C2AxipBR.js
  var MediaCaptionsElement, MediaGestureElement, MediaAnnouncerElement, MediaControlsElement, MediaControlsGroupElement, Title, MediaTitleElement, ChapterTitle, MediaChapterTitleElement, Spinner, MediaSpinnerElement, MediaLayout, MediaLayoutElement, MediaGoogleCastButtonElement, MediaToggleButtonElement, MediaTooltipElement, MediaTooltipTriggerElement, MediaTooltipContentElement, MediaMenuPortalElement, MediaChaptersRadioGroupElement, MediaAudioGainRadioGroupElement, MediaRadioGroupElement, MediaSliderElement, videoTemplate, MediaSliderVideoElement, MediaAudioGainSliderElement, MediaSpeedSliderElement, MediaQualitySliderElement, MediaSliderChaptersElement, SliderSteps, MediaSliderStepsElement;
  var init_vidstack_C2AxipBR = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-C2AxipBR.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_BligRjsM();
      init_vidstack_Cpte_fRf();
      init_vidstack_DE4XvkHU();
      init_lit_html();
      init_vidstack_Ds_q5BGO();
      init_vidstack_CwTj4H1w();
      init_vidstack_B6fvfDkI();
      init_vidstack_D_DrbzHZ();
      MediaCaptionsElement = class extends Host(HTMLElement, Captions) {
        static tagName = "media-captions";
      };
      MediaGestureElement = class extends Host(HTMLElement, Gesture) {
        static tagName = "media-gesture";
      };
      MediaAnnouncerElement = class extends Host(HTMLElement, MediaAnnouncer) {
        static tagName = "media-announcer";
      };
      MediaControlsElement = class extends Host(HTMLElement, Controls) {
        static tagName = "media-controls";
      };
      MediaControlsGroupElement = class extends Host(HTMLElement, ControlsGroup) {
        static tagName = "media-controls-group";
      };
      Title = class extends Component {
      };
      MediaTitleElement = class extends Host(HTMLElement, Title) {
        static tagName = "media-title";
        #media;
        onSetup() {
          this.#media = useMediaContext();
        }
        onConnect() {
          effect(this.#watchTitle.bind(this));
        }
        #watchTitle() {
          const { title } = this.#media.$state;
          this.textContent = title();
        }
      };
      ChapterTitle = class extends Component {
        static props = {
          defaultText: ""
        };
      };
      MediaChapterTitleElement = class extends Host(HTMLElement, ChapterTitle) {
        static tagName = "media-chapter-title";
        #media;
        #chapterTitle;
        onSetup() {
          this.#media = useMediaContext();
          this.#chapterTitle = signal("");
        }
        onConnect() {
          const tracks = this.#media.textTracks;
          watchCueTextChange(tracks, "chapters", this.#chapterTitle.set);
          effect(this.#watchChapterTitle.bind(this));
        }
        #watchChapterTitle() {
          const { defaultText } = this.$props;
          this.textContent = this.#chapterTitle() || defaultText();
        }
      };
      Spinner = class extends Component {
        static props = {
          size: 96,
          trackWidth: 8,
          fillPercent: 50
        };
        onConnect(el) {
          requestScopedAnimationFrame(() => {
            if (!this.connectScope) return;
            const root2 = el.querySelector("svg"), track = root2.firstElementChild, trackFill = track.nextElementSibling;
            effect(this.#update.bind(this, root2, track, trackFill));
          });
        }
        #update(root2, track, trackFill) {
          const { size: size2, trackWidth, fillPercent } = this.$props;
          setAttribute(root2, "width", size2());
          setAttribute(root2, "height", size2());
          setAttribute(track, "stroke-width", trackWidth());
          setAttribute(trackFill, "stroke-width", trackWidth());
          setAttribute(trackFill, "stroke-dashoffset", 100 - fillPercent());
        }
      };
      MediaSpinnerElement = class extends Host(LitElement, Spinner) {
        static tagName = "media-spinner";
        render() {
          return x`
      <svg fill="none" viewBox="0 0 120 120" aria-hidden="true" data-part="root">
        <circle cx="60" cy="60" r="54" stroke="currentColor" data-part="track"></circle>
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          pathLength="100"
          stroke-dasharray="100"
          data-part="track-fill"
        ></circle>
      </svg>
    `;
        }
      };
      MediaLayout = class extends Component {
        static props = {
          when: false
        };
      };
      MediaLayoutElement = class extends Host(HTMLElement, MediaLayout) {
        static tagName = "media-layout";
        #media;
        onSetup() {
          this.#media = useMediaContext();
        }
        onConnect() {
          effect(this.#watchWhen.bind(this));
        }
        #watchWhen() {
          const root2 = this.firstElementChild, isTemplate = root2?.localName === "template", when = this.$props.when(), matches = isBoolean(when) ? when : computed(() => when(this.#media.player.state))();
          if (!matches) {
            if (isTemplate) {
              this.textContent = "";
              this.appendChild(root2);
            } else if (isHTMLElement2(root2)) {
              root2.style.display = "none";
            }
            return;
          }
          if (isTemplate) {
            this.append(root2.content.cloneNode(true));
          } else if (isHTMLElement2(root2)) {
            root2.style.display = "";
          }
        }
      };
      MediaGoogleCastButtonElement = class extends Host(HTMLElement, GoogleCastButton) {
        static tagName = "media-google-cast-button";
      };
      MediaToggleButtonElement = class extends Host(HTMLElement, ToggleButton) {
        static tagName = "media-toggle-button";
      };
      MediaTooltipElement = class extends Host(HTMLElement, Tooltip) {
        static tagName = "media-tooltip";
      };
      MediaTooltipTriggerElement = class extends Host(HTMLElement, TooltipTrigger) {
        static tagName = "media-tooltip-trigger";
        onConnect() {
          this.style.display = "contents";
        }
      };
      MediaTooltipContentElement = class extends Host(HTMLElement, TooltipContent) {
        static tagName = "media-tooltip-content";
      };
      MediaMenuPortalElement = class extends Host(HTMLElement, MenuPortal2) {
        static tagName = "media-menu-portal";
        static attrs = {
          disabled: {
            converter(value) {
              if (isString(value)) return value;
              return value !== null;
            }
          }
        };
      };
      MediaChaptersRadioGroupElement = class extends Host(HTMLElement, ChaptersRadioGroup) {
        static tagName = "media-chapters-radio-group";
        onConnect() {
          renderMenuItemsTemplate(this, (el, option) => {
            const { cue, startTime, duration } = option, thumbnailEl = el.querySelector(".vds-thumbnail,media-thumbnail"), startEl = el.querySelector('[data-part="start-time"]'), durationEl = el.querySelector('[data-part="duration"]');
            if (startEl) startEl.textContent = startTime;
            if (durationEl) durationEl.textContent = duration;
            if (thumbnailEl) {
              thumbnailEl.setAttribute("time", cue.startTime + "");
              effect(() => {
                const thumbnails = this.$props.thumbnails();
                if ("src" in thumbnailEl) {
                  thumbnailEl.src = thumbnails;
                } else if (isString(thumbnails)) {
                  thumbnailEl.setAttribute("src", thumbnails);
                }
              });
            }
          });
        }
      };
      MediaAudioGainRadioGroupElement = class extends Host(HTMLElement, AudioGainRadioGroup) {
        static tagName = "media-audio-gain-radio-group";
        onConnect() {
          renderMenuItemsTemplate(this);
        }
      };
      MediaRadioGroupElement = class extends Host(HTMLElement, RadioGroup) {
        static tagName = "media-radio-group";
      };
      MediaSliderElement = class extends Host(HTMLElement, Slider) {
        static tagName = "media-slider";
      };
      videoTemplate = /* @__PURE__ */ createTemplate(
        `<video muted playsinline preload="none" style="max-width: unset;"></video>`
      );
      MediaSliderVideoElement = class extends Host(HTMLElement, SliderVideo) {
        static tagName = "media-slider-video";
        #media;
        #video = this.#createVideo();
        onSetup() {
          this.#media = useMediaContext();
          this.$state.video.set(this.#video);
        }
        onConnect() {
          const { canLoad } = this.#media.$state, { src, crossOrigin } = this.$state;
          if (this.#video.parentNode !== this) {
            this.prepend(this.#video);
          }
          effect(() => {
            setAttribute(this.#video, "crossorigin", crossOrigin());
            setAttribute(this.#video, "preload", canLoad() ? "auto" : "none");
            setAttribute(this.#video, "src", src());
          });
        }
        #createVideo() {
          return cloneTemplateContent(videoTemplate);
        }
      };
      MediaAudioGainSliderElement = class extends Host(HTMLElement, AudioGainSlider) {
        static tagName = "media-audio-gain-slider";
      };
      MediaSpeedSliderElement = class extends Host(HTMLElement, SpeedSlider) {
        static tagName = "media-speed-slider";
      };
      MediaQualitySliderElement = class extends Host(HTMLElement, QualitySlider) {
        static tagName = "media-quality-slider";
      };
      MediaSliderChaptersElement = class extends Host(HTMLElement, SliderChapters) {
        static tagName = "media-slider-chapters";
        #template = null;
        onConnect() {
          requestScopedAnimationFrame(() => {
            if (!this.connectScope) return;
            const template = this.querySelector("template");
            if (template) {
              this.#template = template;
              effect(this.#renderTemplate.bind(this));
            }
          });
        }
        #renderTemplate() {
          if (!this.#template) return;
          const elements = cloneTemplate(this.#template, this.cues.length || 1);
          this.setRefs(elements);
        }
      };
      SliderSteps = class extends Component {
      };
      MediaSliderStepsElement = class extends Host(HTMLElement, SliderSteps) {
        static tagName = "media-slider-steps";
        #template = null;
        onConnect(el) {
          requestScopedAnimationFrame(() => {
            if (!this.connectScope) return;
            this.#template = el.querySelector("template");
            if (this.#template) effect(this.#render.bind(this));
          });
        }
        #render() {
          if (!this.#template) return;
          const { min: min2, max: max2, step } = useState(sliderState), steps = (max2() - min2()) / step();
          cloneTemplate(this.#template, Math.floor(steps) + 1);
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-DGstw8fa.js
  var Poster;
  var init_vidstack_DGstw8fa = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-DGstw8fa.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_Cpte_fRf();
      init_vidstack_A9j_j6J();
      Poster = class extends Component {
        static props = {
          src: null,
          alt: null,
          crossOrigin: null
        };
        static state = new State({
          img: null,
          src: null,
          alt: null,
          crossOrigin: null,
          loading: true,
          error: null,
          hidden: false
        });
        #media;
        onSetup() {
          this.#media = useMediaContext();
          this.#watchSrc();
          this.#watchAlt();
          this.#watchCrossOrigin();
          this.#watchHidden();
        }
        onAttach(el) {
          el.style.setProperty("pointer-events", "none");
          effect(this.#watchImg.bind(this));
          effect(this.#watchSrc.bind(this));
          effect(this.#watchAlt.bind(this));
          effect(this.#watchCrossOrigin.bind(this));
          effect(this.#watchHidden.bind(this));
          const { started } = this.#media.$state;
          this.setAttributes({
            "data-visible": () => !started() && !this.$state.hidden(),
            "data-loading": this.#isLoading.bind(this),
            "data-error": this.#hasError.bind(this),
            "data-hidden": this.$state.hidden
          });
        }
        onConnect(el) {
          effect(this.#onPreconnect.bind(this));
          effect(this.#onLoadStart.bind(this));
        }
        #hasError() {
          const { error } = this.$state;
          return !isNull(error());
        }
        #onPreconnect() {
          const { canLoadPoster, poster } = this.#media.$state;
          if (!canLoadPoster() && poster()) preconnect(poster(), "preconnect");
        }
        #watchHidden() {
          const { src } = this.$props, { poster, nativeControls } = this.#media.$state;
          this.el && setAttribute(this.el, "display", nativeControls() ? "none" : null);
          this.$state.hidden.set(this.#hasError() || !(src() || poster()) || nativeControls());
        }
        #isLoading() {
          const { loading, hidden } = this.$state;
          return !hidden() && loading();
        }
        #watchImg() {
          const img = this.$state.img();
          if (!img) return;
          new EventsController(img).add("load", this.#onLoad.bind(this)).add("error", this.#onError.bind(this));
          if (img.complete) this.#onLoad();
        }
        #prevSrc = "";
        #watchSrc() {
          const { poster: defaultPoster } = this.#media.$props, { canLoadPoster, providedPoster, inferredPoster } = this.#media.$state;
          const src = this.$props.src() || "", poster = src || defaultPoster() || inferredPoster();
          if (this.#prevSrc === providedPoster()) {
            providedPoster.set(src);
          }
          this.$state.src.set(canLoadPoster() && poster.length ? poster : null);
          this.#prevSrc = src;
        }
        #watchAlt() {
          const { src } = this.$props, { alt } = this.$state, { poster } = this.#media.$state;
          alt.set(src() || poster() ? this.$props.alt() : null);
        }
        #watchCrossOrigin() {
          const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin, poster: src } = this.#media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
          crossOriginState.set(
            /ytimg\.com|vimeo/.test(src() || "") ? null : crossOrigin === true ? "anonymous" : crossOrigin
          );
        }
        #onLoadStart() {
          const { loading, error } = this.$state, { canLoadPoster, poster } = this.#media.$state;
          loading.set(canLoadPoster() && !!poster());
          error.set(null);
        }
        #onLoad() {
          const { loading, error } = this.$state;
          loading.set(false);
          error.set(null);
        }
        #onError(event2) {
          const { loading, error } = this.$state;
          loading.set(false);
          error.set(event2);
        }
      };
    }
  });

  // node_modules/vidstack/prod/chunks/vidstack-QR8zGkwr.js
  var vidstack_QR8zGkwr_exports = {};
  __export(vidstack_QR8zGkwr_exports, {
    MediaPosterElement: () => MediaPosterElement
  });
  var MediaPosterElement;
  var init_vidstack_QR8zGkwr = __esm({
    "node_modules/vidstack/prod/chunks/vidstack-QR8zGkwr.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_DGstw8fa();
      MediaPosterElement = class extends Host(HTMLElement, Poster) {
        static tagName = "media-poster";
        static attrs = {
          crossOrigin: "crossorigin"
        };
        #img = document.createElement("img");
        onSetup() {
          this.$state.img.set(this.#img);
        }
        onConnect() {
          const { src, alt, crossOrigin } = this.$state;
          effect(() => {
            const { loading, hidden } = this.$state;
            this.#img.style.display = loading() || hidden() ? "none" : "";
          });
          effect(() => {
            setAttribute(this.#img, "alt", alt());
            setAttribute(this.#img, "crossorigin", crossOrigin());
            setAttribute(this.#img, "src", src());
          });
          if (this.#img.parentNode !== this) {
            this.prepend(this.#img);
          }
        }
      };
    }
  });

  // node_modules/vidstack/prod/define/vidstack-player-ui.js
  var vidstack_player_ui_exports = {};
  var init_vidstack_player_ui = __esm({
    "node_modules/vidstack/prod/define/vidstack-player-ui.js"() {
      init_vidstack_CRlI3Mh7();
      init_vidstack_C2AxipBR();
      init_vidstack_D_DrbzHZ();
      init_vidstack_QR8zGkwr();
      init_lit_html();
      defineCustomElement(MediaLayoutElement);
      defineCustomElement(MediaControlsElement);
      defineCustomElement(MediaControlsGroupElement);
      defineCustomElement(MediaPosterElement);
      defineCustomElement(MediaAnnouncerElement);
      defineCustomElement(MediaTooltipElement);
      defineCustomElement(MediaTooltipTriggerElement);
      defineCustomElement(MediaTooltipContentElement);
      defineCustomElement(MediaPlayButtonElement);
      defineCustomElement(MediaMuteButtonElement);
      defineCustomElement(MediaCaptionButtonElement);
      defineCustomElement(MediaFullscreenButtonElement);
      defineCustomElement(MediaPIPButtonElement);
      defineCustomElement(MediaSeekButtonElement);
      defineCustomElement(MediaAirPlayButtonElement);
      defineCustomElement(MediaGoogleCastButtonElement);
      defineCustomElement(MediaToggleButtonElement);
      defineCustomElement(MediaSliderElement);
      defineCustomElement(MediaAudioGainSliderElement);
      defineCustomElement(MediaVolumeSliderElement);
      defineCustomElement(MediaTimeSliderElement);
      defineCustomElement(MediaSpeedSliderElement);
      defineCustomElement(MediaQualitySliderElement);
      defineCustomElement(MediaSliderChaptersElement);
      defineCustomElement(MediaSliderStepsElement);
      defineCustomElement(MediaSliderPreviewElement);
      defineCustomElement(MediaSliderValueElement);
      defineCustomElement(MediaSliderThumbnailElement);
      defineCustomElement(MediaSliderVideoElement);
      defineCustomElement(MediaMenuElement);
      defineCustomElement(MediaMenuButtonElement);
      defineCustomElement(MediaMenuPortalElement);
      defineCustomElement(MediaMenuItemsElement);
      defineCustomElement(MediaMenuItemElement);
      defineCustomElement(MediaAudioRadioGroupElement);
      defineCustomElement(MediaCaptionsRadioGroupElement);
      defineCustomElement(MediaSpeedRadioGroupElement);
      defineCustomElement(MediaAudioGainRadioGroupElement);
      defineCustomElement(MediaQualityRadioGroupElement);
      defineCustomElement(MediaChaptersRadioGroupElement);
      defineCustomElement(MediaRadioGroupElement);
      defineCustomElement(MediaRadioElement);
      defineCustomElement(MediaGestureElement);
      defineCustomElement(MediaThumbnailElement);
      defineCustomElement(MediaCaptionsElement);
      defineCustomElement(MediaLiveButtonElement);
      defineCustomElement(MediaTimeElement);
      defineCustomElement(MediaTitleElement);
      defineCustomElement(MediaChapterTitleElement);
      defineCustomElement(MediaSpinnerElement);
    }
  });

  // node_modules/vidstack/prod/define/vidstack-player.js
  init_vidstack_CRlI3Mh7();

  // node_modules/vidstack/prod/chunks/vidstack-DF9tOn_S.js
  init_vidstack_CRlI3Mh7();

  // node_modules/vidstack/prod/chunks/vidstack-Dvnit1xI.js
  init_vidstack_CRlI3Mh7();
  init_vidstack_Cpte_fRf();
  init_vidstack_DwhHIY5e();
  init_vidstack_BmMUBVGQ();
  init_vidstack_oyBGi0R4();
  init_vidstack_D5EzK014();
  init_vidstack_B01xzxC4();
  init_vidstack_C9vIqaYT();
  init_vidstack_A9j_j6J();
  init_vidstack_Ds_q5BGO();
  init_vidstack_Dihypf8P();
  init_vidstack_DXXgp8ue();
  var List = class extends EventsTarget {
    items = [];
    /** @internal */
    [ListSymbol.readonly] = false;
    get length() {
      return this.items.length;
    }
    get readonly() {
      return this[ListSymbol.readonly];
    }
    /**
     * Returns the index of the first occurrence of the given item, or -1 if it is not present.
     */
    indexOf(item) {
      return this.items.indexOf(item);
    }
    /**
     * Returns an item matching the given `id`, or `null` if not present.
     */
    getById(id3) {
      if (id3 === "") return null;
      return this.items.find((item) => item.id === id3) ?? null;
    }
    /**
     * Transform list to an array.
     */
    toArray() {
      return [...this.items];
    }
    [Symbol.iterator]() {
      return this.items.values();
    }
    /** @internal */
    [ListSymbol.add](item, trigger) {
      const index = this.items.length;
      if (!("" + index in this)) {
        Object.defineProperty(this, index, {
          get() {
            return this.items[index];
          }
        });
      }
      if (this.items.includes(item)) return;
      this.items.push(item);
      this.dispatchEvent(new DOMEvent("add", { detail: item, trigger }));
    }
    /** @internal */
    [ListSymbol.remove](item, trigger) {
      const index = this.items.indexOf(item);
      if (index >= 0) {
        this[ListSymbol.onRemove]?.(item, trigger);
        this.items.splice(index, 1);
        this.dispatchEvent(new DOMEvent("remove", { detail: item, trigger }));
      }
    }
    /** @internal */
    [ListSymbol.reset](trigger) {
      for (const item of [...this.items]) this[ListSymbol.remove](item, trigger);
      this.items = [];
      this[ListSymbol.setReadonly](false, trigger);
      this[ListSymbol.onReset]?.();
    }
    /** @internal */
    [ListSymbol.setReadonly](readonly, trigger) {
      if (this[ListSymbol.readonly] === readonly) return;
      this[ListSymbol.readonly] = readonly;
      this.dispatchEvent(new DOMEvent("readonly-change", { detail: readonly, trigger }));
    }
  };
  var CAN_FULLSCREEN = fscreen.fullscreenEnabled;
  var FullscreenController = class extends ViewController {
    /**
     * Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
     * listened to globally on the document so we need to know if they relate to the current host
     * element or not.
     */
    #listening = false;
    #active = false;
    get active() {
      return this.#active;
    }
    get supported() {
      return CAN_FULLSCREEN;
    }
    onConnect() {
      new EventsController(fscreen).add("fullscreenchange", this.#onChange.bind(this)).add("fullscreenerror", this.#onError.bind(this));
      onDispose(this.#onDisconnect.bind(this));
    }
    async #onDisconnect() {
      if (CAN_FULLSCREEN) await this.exit();
    }
    #onChange(event2) {
      const active = isFullscreen(this.el);
      if (active === this.#active) return;
      if (!active) this.#listening = false;
      this.#active = active;
      this.dispatch("fullscreen-change", { detail: active, trigger: event2 });
    }
    #onError(event2) {
      if (!this.#listening) return;
      this.dispatch("fullscreen-error", { detail: null, trigger: event2 });
      this.#listening = false;
    }
    async enter() {
      try {
        this.#listening = true;
        if (!this.el || isFullscreen(this.el)) return;
        assertFullscreenAPI();
        return fscreen.requestFullscreen(this.el);
      } catch (error) {
        this.#listening = false;
        throw error;
      }
    }
    async exit() {
      if (!this.el || !isFullscreen(this.el)) return;
      assertFullscreenAPI();
      return fscreen.exitFullscreen();
    }
  };
  function isFullscreen(host) {
    if (fscreen.fullscreenElement === host) return true;
    try {
      return host.matches(
        // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
        fscreen.fullscreenPseudoClass
      );
    } catch (error) {
      return false;
    }
  }
  function assertFullscreenAPI() {
    if (CAN_FULLSCREEN) return;
    throw Error(
      "[vidstack] no fullscreen API"
    );
  }
  var ScreenOrientationController = class _ScreenOrientationController extends ViewController {
    #type = signal(this.#getScreenOrientation());
    #locked = signal(false);
    #currentLock;
    /**
     * The current screen orientation type.
     *
     * @signal
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
     * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
     */
    get type() {
      return this.#type();
    }
    /**
     * Whether the screen orientation is currently locked.
     *
     * @signal
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
     * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
     */
    get locked() {
      return this.#locked();
    }
    /**
     * Whether the viewport is in a portrait orientation.
     *
     * @signal
     */
    get portrait() {
      return this.#type().startsWith("portrait");
    }
    /**
     * Whether the viewport is in a landscape orientation.
     *
     * @signal
     */
    get landscape() {
      return this.#type().startsWith("landscape");
    }
    /**
     * Whether the native Screen Orientation API is available.
     */
    static supported = canOrientScreen();
    /**
     * Whether the native Screen Orientation API is available.
     */
    get supported() {
      return _ScreenOrientationController.supported;
    }
    onConnect() {
      if (this.supported) {
        listenEvent(screen.orientation, "change", this.#onOrientationChange.bind(this));
      } else {
        const query = window.matchMedia("(orientation: landscape)");
        query.onchange = this.#onOrientationChange.bind(this);
        onDispose(() => query.onchange = null);
      }
      onDispose(this.#onDisconnect.bind(this));
    }
    async #onDisconnect() {
      if (this.supported && this.#locked()) await this.unlock();
    }
    #onOrientationChange(event2) {
      this.#type.set(this.#getScreenOrientation());
      this.dispatch("orientation-change", {
        detail: {
          orientation: peek(this.#type),
          lock: this.#currentLock
        },
        trigger: event2
      });
    }
    /**
     * Locks the orientation of the screen to the desired orientation type using the
     * Screen Orientation API.
     *
     * @param lockType - The screen lock orientation type.
     * @throws Error - If screen orientation API is unavailable.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
     * @see {@link https://w3c.github.io/screen-orientation}
     */
    async lock(lockType) {
      if (peek(this.#locked) || this.#currentLock === lockType) return;
      this.#assertScreenOrientationAPI();
      await screen.orientation.lock(lockType);
      this.#locked.set(true);
      this.#currentLock = lockType;
    }
    /**
     * Unlocks the orientation of the screen to it's default state using the Screen Orientation
     * API. This method will throw an error if the API is unavailable.
     *
     * @throws Error - If screen orientation API is unavailable.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
     * @see {@link https://w3c.github.io/screen-orientation}
     */
    async unlock() {
      if (!peek(this.#locked)) return;
      this.#assertScreenOrientationAPI();
      this.#currentLock = void 0;
      await screen.orientation.unlock();
      this.#locked.set(false);
    }
    #assertScreenOrientationAPI() {
      if (this.supported) return;
      throw Error(
        "[vidstack] no orientation API"
      );
    }
    #getScreenOrientation() {
      if (this.supported) return window.screen.orientation.type;
      return window.innerWidth >= window.innerHeight ? "landscape-primary" : "portrait-primary";
    }
  };
  function isVideoQualitySrc(src) {
    return !isString(src) && "width" in src && "height" in src && isNumber(src.width) && isNumber(src.height);
  }
  var mediaState = new State({
    artist: "",
    artwork: null,
    audioTrack: null,
    audioTracks: [],
    autoPlay: false,
    autoPlayError: null,
    audioGain: null,
    buffered: new TimeRange(),
    canLoad: false,
    canLoadPoster: false,
    canFullscreen: false,
    canOrientScreen: canOrientScreen(),
    canPictureInPicture: false,
    canPlay: false,
    clipStartTime: 0,
    clipEndTime: 0,
    controls: false,
    get iOSControls() {
      return IS_IPHONE && this.mediaType === "video" && (!this.playsInline || !fscreen.fullscreenEnabled && this.fullscreen);
    },
    get nativeControls() {
      return this.controls || this.iOSControls;
    },
    controlsVisible: false,
    get controlsHidden() {
      return !this.controlsVisible;
    },
    crossOrigin: null,
    ended: false,
    error: null,
    fullscreen: false,
    get loop() {
      return this.providedLoop || this.userPrefersLoop;
    },
    logLevel: "silent",
    mediaType: "unknown",
    muted: false,
    paused: true,
    played: new TimeRange(),
    playing: false,
    playsInline: false,
    pictureInPicture: false,
    preload: "metadata",
    playbackRate: 1,
    qualities: [],
    quality: null,
    autoQuality: false,
    canSetQuality: true,
    canSetPlaybackRate: true,
    canSetVolume: false,
    canSetAudioGain: false,
    seekable: new TimeRange(),
    seeking: false,
    source: { src: "", type: "" },
    sources: [],
    started: false,
    textTracks: [],
    textTrack: null,
    get hasCaptions() {
      return this.textTracks.filter(isTrackCaptionKind).length > 0;
    },
    volume: 1,
    waiting: false,
    realCurrentTime: 0,
    get currentTime() {
      return this.ended ? this.duration : this.clipStartTime > 0 ? Math.max(0, Math.min(this.realCurrentTime - this.clipStartTime, this.duration)) : this.realCurrentTime;
    },
    providedDuration: -1,
    intrinsicDuration: 0,
    get duration() {
      return this.seekableWindow;
    },
    get title() {
      return this.providedTitle || this.inferredTitle;
    },
    get poster() {
      return this.providedPoster || this.inferredPoster;
    },
    get viewType() {
      return this.providedViewType !== "unknown" ? this.providedViewType : this.inferredViewType;
    },
    get streamType() {
      return this.providedStreamType !== "unknown" ? this.providedStreamType : this.inferredStreamType;
    },
    get currentSrc() {
      return this.source;
    },
    get bufferedStart() {
      const start = getTimeRangesStart(this.buffered) ?? 0;
      return Math.max(start, this.clipStartTime);
    },
    get bufferedEnd() {
      const end = getTimeRangesEnd(this.buffered) ?? 0;
      return Math.min(this.seekableEnd, Math.max(0, end - this.clipStartTime));
    },
    get bufferedWindow() {
      return Math.max(0, this.bufferedEnd - this.bufferedStart);
    },
    get seekableStart() {
      if (this.isLiveDVR && this.liveDVRWindow > 0) {
        return Math.max(0, this.seekableEnd - this.liveDVRWindow);
      }
      const start = getTimeRangesStart(this.seekable) ?? 0;
      return Math.max(start, this.clipStartTime);
    },
    get seekableEnd() {
      if (this.providedDuration > 0) return this.providedDuration;
      const end = this.liveSyncPosition > 0 ? this.liveSyncPosition : this.canPlay ? getTimeRangesEnd(this.seekable) ?? Infinity : 0;
      return this.clipEndTime > 0 ? Math.min(this.clipEndTime, end) : end;
    },
    get seekableWindow() {
      const window2 = this.seekableEnd - this.seekableStart;
      return !isNaN(window2) ? Math.max(0, window2) : Infinity;
    },
    // ~~ remote playback ~~
    canAirPlay: false,
    canGoogleCast: false,
    remotePlaybackState: "disconnected",
    remotePlaybackType: "none",
    remotePlaybackLoader: null,
    remotePlaybackInfo: null,
    get isAirPlayConnected() {
      return this.remotePlaybackType === "airplay" && this.remotePlaybackState === "connected";
    },
    get isGoogleCastConnected() {
      return this.remotePlaybackType === "google-cast" && this.remotePlaybackState === "connected";
    },
    // ~~ responsive design ~~
    pointer: "fine",
    orientation: "landscape",
    width: 0,
    height: 0,
    mediaWidth: 0,
    mediaHeight: 0,
    lastKeyboardAction: null,
    // ~~ user props ~~
    userBehindLiveEdge: false,
    // ~~ live props ~~
    liveEdgeTolerance: 10,
    minLiveDVRWindow: 60,
    get canSeek() {
      return /unknown|on-demand|:dvr/.test(this.streamType) && Number.isFinite(this.duration) && (!this.isLiveDVR || this.duration >= this.liveDVRWindow);
    },
    get live() {
      return this.streamType.includes("live") || !Number.isFinite(this.duration);
    },
    get liveEdgeStart() {
      return this.live && Number.isFinite(this.seekableEnd) ? Math.max(0, this.seekableEnd - this.liveEdgeTolerance) : 0;
    },
    get liveEdge() {
      return this.live && (!this.canSeek || !this.userBehindLiveEdge && this.currentTime >= this.liveEdgeStart);
    },
    get liveEdgeWindow() {
      return this.live && Number.isFinite(this.seekableEnd) ? this.seekableEnd - this.liveEdgeStart : 0;
    },
    get isLiveDVR() {
      return /:dvr/.test(this.streamType);
    },
    get liveDVRWindow() {
      return Math.max(this.inferredLiveDVRWindow, this.minLiveDVRWindow);
    },
    // ~~ internal props ~~
    autoPlaying: false,
    providedTitle: "",
    inferredTitle: "",
    providedLoop: false,
    userPrefersLoop: false,
    providedPoster: "",
    inferredPoster: "",
    inferredViewType: "unknown",
    providedViewType: "unknown",
    providedStreamType: "unknown",
    inferredStreamType: "unknown",
    liveSyncPosition: null,
    inferredLiveDVRWindow: 0,
    savedState: null
  });
  var RESET_ON_SRC_QUALITY_CHANGE = /* @__PURE__ */ new Set([
    "autoPlayError",
    "autoPlaying",
    "buffered",
    "canPlay",
    "error",
    "paused",
    "played",
    "playing",
    "seekable",
    "seeking",
    "waiting"
  ]);
  var RESET_ON_SRC_CHANGE = /* @__PURE__ */ new Set([
    ...RESET_ON_SRC_QUALITY_CHANGE,
    "ended",
    "inferredPoster",
    "inferredStreamType",
    "inferredTitle",
    "intrinsicDuration",
    "inferredLiveDVRWindow",
    "liveSyncPosition",
    "realCurrentTime",
    "savedState",
    "started",
    "userBehindLiveEdge"
  ]);
  function softResetMediaState($media, isSourceQualityChange = false) {
    const filter = isSourceQualityChange ? RESET_ON_SRC_QUALITY_CHANGE : RESET_ON_SRC_CHANGE;
    mediaState.reset($media, (prop2) => filter.has(prop2));
    tick();
  }
  function boundTime(time, store) {
    const clippedTime = time + store.clipStartTime(), isStart = Math.floor(time) === Math.floor(store.seekableStart()), isEnd = Math.floor(clippedTime) === Math.floor(store.seekableEnd());
    if (isStart) {
      return store.seekableStart();
    }
    if (isEnd) {
      return store.seekableEnd();
    }
    if (store.isLiveDVR() && store.liveDVRWindow() > 0 && clippedTime < store.seekableEnd() - store.liveDVRWindow()) {
      return store.bufferedStart();
    }
    return Math.min(Math.max(store.seekableStart() + 0.1, clippedTime), store.seekableEnd() - 0.1);
  }
  var MediaRemoteControl = class {
    #target = null;
    #player = null;
    #prevTrackIndex = -1;
    #logger;
    constructor(logger = void 0) {
      this.#logger = logger;
    }
    /**
     * Set the target from which to dispatch media requests events from. The events should bubble
     * up from this target to the player element.
     *
     * @example
     * ```ts
     * const button = document.querySelector('button');
     * remote.setTarget(button);
     * ```
     */
    setTarget(target) {
      this.#target = target;
    }
    /**
     * Returns the current player element. This method will attempt to find the player by
     * searching up from either the given `target` or default target set via `remote.setTarget`.
     *
     * @example
     * ```ts
     * const player = remote.getPlayer();
     * ```
     */
    getPlayer(target) {
      if (this.#player) return this.#player;
      (target ?? this.#target)?.dispatchEvent(
        new DOMEvent("find-media-player", {
          detail: (player) => void (this.#player = player),
          bubbles: true,
          composed: true
        })
      );
      return this.#player;
    }
    /**
     * Set the current player element so the remote can support toggle methods such as
     * `togglePaused` as they rely on the current media state.
     */
    setPlayer(player) {
      this.#player = player;
    }
    /**
     * Dispatch a request to start the media loading process. This will only work if the media
     * player has been initialized with a custom loading strategy `load="custom">`.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
     */
    startLoading(trigger) {
      this.#dispatchRequest("media-start-loading", trigger);
    }
    /**
     * Dispatch a request to start the poster loading process. This will only work if the media
     * player has been initialized with a custom poster loading strategy `posterLoad="custom">`.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
     */
    startLoadingPoster(trigger) {
      this.#dispatchRequest("media-poster-start-loading", trigger);
    }
    /**
     * Dispatch a request to connect to AirPlay.
     *
     * @see {@link https://www.apple.com/au/airplay}
     */
    requestAirPlay(trigger) {
      this.#dispatchRequest("media-airplay-request", trigger);
    }
    /**
     * Dispatch a request to connect to Google Cast.
     *
     * @see {@link https://developers.google.com/cast/docs/overview}
     */
    requestGoogleCast(trigger) {
      this.#dispatchRequest("media-google-cast-request", trigger);
    }
    /**
     * Dispatch a request to begin/resume media playback.
     */
    play(trigger) {
      this.#dispatchRequest("media-play-request", trigger);
    }
    /**
     * Dispatch a request to pause media playback.
     */
    pause(trigger) {
      this.#dispatchRequest("media-pause-request", trigger);
    }
    /**
     * Dispatch a request to set the media volume to mute (0).
     */
    mute(trigger) {
      this.#dispatchRequest("media-mute-request", trigger);
    }
    /**
     * Dispatch a request to unmute the media volume and set it back to it's previous state.
     */
    unmute(trigger) {
      this.#dispatchRequest("media-unmute-request", trigger);
    }
    /**
     * Dispatch a request to enter fullscreen.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
     */
    enterFullscreen(target, trigger) {
      this.#dispatchRequest("media-enter-fullscreen-request", trigger, target);
    }
    /**
     * Dispatch a request to exit fullscreen.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
     */
    exitFullscreen(target, trigger) {
      this.#dispatchRequest("media-exit-fullscreen-request", trigger, target);
    }
    /**
     * Dispatch a request to lock the screen orientation.
     *
     * @docs {@link https://www.vidstack.io/docs/player/screen-orientation#remote-control}
     */
    lockScreenOrientation(lockType, trigger) {
      this.#dispatchRequest("media-orientation-lock-request", trigger, lockType);
    }
    /**
     * Dispatch a request to unlock the screen orientation.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/screen-orientation#remote-control}
     */
    unlockScreenOrientation(trigger) {
      this.#dispatchRequest("media-orientation-unlock-request", trigger);
    }
    /**
     * Dispatch a request to enter picture-in-picture mode.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
     */
    enterPictureInPicture(trigger) {
      this.#dispatchRequest("media-enter-pip-request", trigger);
    }
    /**
     * Dispatch a request to exit picture-in-picture mode.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
     */
    exitPictureInPicture(trigger) {
      this.#dispatchRequest("media-exit-pip-request", trigger);
    }
    /**
     * Notify the media player that a seeking process is happening and to seek to the given `time`.
     */
    seeking(time, trigger) {
      this.#dispatchRequest("media-seeking-request", trigger, time);
    }
    /**
     * Notify the media player that a seeking operation has completed and to seek to the given `time`.
     * This is generally called after a series of `remote.seeking()` calls.
     */
    seek(time, trigger) {
      this.#dispatchRequest("media-seek-request", trigger, time);
    }
    seekToLiveEdge(trigger) {
      this.#dispatchRequest("media-live-edge-request", trigger);
    }
    /**
     * Dispatch a request to update the length of the media in seconds.
     *
     * @example
     * ```ts
     * remote.changeDuration(100); // 100 seconds
     * ```
     */
    changeDuration(duration, trigger) {
      this.#dispatchRequest("media-duration-change-request", trigger, duration);
    }
    /**
     * Dispatch a request to update the clip start time. This is the time at which media playback
     * should start at.
     *
     * @example
     * ```ts
     * remote.changeClipStart(100); // start at 100 seconds
     * ```
     */
    changeClipStart(startTime, trigger) {
      this.#dispatchRequest("media-clip-start-change-request", trigger, startTime);
    }
    /**
     * Dispatch a request to update the clip end time. This is the time at which media playback
     * should end at.
     *
     * @example
     * ```ts
     * remote.changeClipEnd(100); // end at 100 seconds
     * ```
     */
    changeClipEnd(endTime, trigger) {
      this.#dispatchRequest("media-clip-end-change-request", trigger, endTime);
    }
    /**
     * Dispatch a request to update the media volume to the given `volume` level which is a value
     * between 0 and 1.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/audio-gain#remote-control}
     * @example
     * ```ts
     * remote.changeVolume(0); // 0%
     * remote.changeVolume(0.05); // 5%
     * remote.changeVolume(0.5); // 50%
     * remote.changeVolume(0.75); // 70%
     * remote.changeVolume(1); // 100%
     * ```
     */
    changeVolume(volume, trigger) {
      this.#dispatchRequest("media-volume-change-request", trigger, Math.max(0, Math.min(1, volume)));
    }
    /**
     * Dispatch a request to change the current audio track.
     *
     * @example
     * ```ts
     * remote.changeAudioTrack(1); // track at index 1
     * ```
     */
    changeAudioTrack(index, trigger) {
      this.#dispatchRequest("media-audio-track-change-request", trigger, index);
    }
    /**
     * Dispatch a request to change the video quality. The special value `-1` represents auto quality
     * selection.
     *
     * @example
     * ```ts
     * remote.changeQuality(-1); // auto
     * remote.changeQuality(1); // quality at index 1
     * ```
     */
    changeQuality(index, trigger) {
      this.#dispatchRequest("media-quality-change-request", trigger, index);
    }
    /**
     * Request auto quality selection.
     */
    requestAutoQuality(trigger) {
      this.changeQuality(-1, trigger);
    }
    /**
     * Dispatch a request to change the mode of the text track at the given index.
     *
     * @example
     * ```ts
     * remote.changeTextTrackMode(1, 'showing'); // track at index 1
     * ```
     */
    changeTextTrackMode(index, mode, trigger) {
      this.#dispatchRequest("media-text-track-change-request", trigger, {
        index,
        mode
      });
    }
    /**
     * Dispatch a request to change the media playback rate.
     *
     * @example
     * ```ts
     * remote.changePlaybackRate(0.5); // Half the normal speed
     * remote.changePlaybackRate(1); // Normal speed
     * remote.changePlaybackRate(1.5); // 50% faster than normal
     * remote.changePlaybackRate(2); // Double the normal speed
     * ```
     */
    changePlaybackRate(rate, trigger) {
      this.#dispatchRequest("media-rate-change-request", trigger, rate);
    }
    /**
     * Dispatch a request to change the media audio gain.
     *
     * @example
     * ```ts
     * remote.changeAudioGain(1); // Disable audio gain
     * remote.changeAudioGain(1.5); // 50% louder
     * remote.changeAudioGain(2); // 100% louder
     * ```
     */
    changeAudioGain(gain, trigger) {
      this.#dispatchRequest("media-audio-gain-change-request", trigger, gain);
    }
    /**
     * Dispatch a request to resume idle tracking on controls.
     */
    resumeControls(trigger) {
      this.#dispatchRequest("media-resume-controls-request", trigger);
    }
    /**
     * Dispatch a request to pause controls idle tracking. Pausing tracking will result in the
     * controls being visible until `remote.resumeControls()` is called. This method
     * is generally used when building custom controls and you'd like to prevent the UI from
     * disappearing.
     *
     * @example
     * ```ts
     * // Prevent controls hiding while menu is being interacted with.
     * function onSettingsOpen() {
     *   remote.pauseControls();
     * }
     *
     * function onSettingsClose() {
     *   remote.resumeControls();
     * }
     * ```
     */
    pauseControls(trigger) {
      this.#dispatchRequest("media-pause-controls-request", trigger);
    }
    /**
     * Dispatch a request to toggle the media playback state.
     */
    togglePaused(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      if (player.state.paused) this.play(trigger);
      else this.pause(trigger);
    }
    /**
     * Dispatch a request to toggle the controls visibility.
     */
    toggleControls(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      if (!player.controls.showing) {
        player.controls.show(0, trigger);
      } else {
        player.controls.hide(0, trigger);
      }
    }
    /**
     * Dispatch a request to toggle the media muted state.
     */
    toggleMuted(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      if (player.state.muted) this.unmute(trigger);
      else this.mute(trigger);
    }
    /**
     * Dispatch a request to toggle the media fullscreen state.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
     */
    toggleFullscreen(target, trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      if (player.state.fullscreen) this.exitFullscreen(target, trigger);
      else this.enterFullscreen(target, trigger);
    }
    /**
     * Dispatch a request to toggle the media picture-in-picture mode.
     *
     * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
     */
    togglePictureInPicture(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      if (player.state.pictureInPicture) this.exitPictureInPicture(trigger);
      else this.enterPictureInPicture(trigger);
    }
    /**
     * Show captions.
     */
    showCaptions(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      let tracks = player.state.textTracks, index = this.#prevTrackIndex;
      if (!tracks[index] || !isTrackCaptionKind(tracks[index])) {
        index = -1;
      }
      if (index === -1) {
        index = tracks.findIndex((track) => isTrackCaptionKind(track) && track.default);
      }
      if (index === -1) {
        index = tracks.findIndex((track) => isTrackCaptionKind(track));
      }
      if (index >= 0) this.changeTextTrackMode(index, "showing", trigger);
      this.#prevTrackIndex = -1;
    }
    /**
     * Turn captions off.
     */
    disableCaptions(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      const tracks = player.state.textTracks, track = player.state.textTrack;
      if (track) {
        const index = tracks.indexOf(track);
        this.changeTextTrackMode(index, "disabled", trigger);
        this.#prevTrackIndex = index;
      }
    }
    /**
     * Dispatch a request to toggle the current captions mode.
     */
    toggleCaptions(trigger) {
      const player = this.getPlayer(trigger?.target);
      if (!player) {
        return;
      }
      if (player.state.textTrack) {
        this.disableCaptions();
      } else {
        this.showCaptions();
      }
    }
    userPrefersLoopChange(prefersLoop, trigger) {
      this.#dispatchRequest("media-user-loop-change-request", trigger, prefersLoop);
    }
    #dispatchRequest(type, trigger, detail) {
      const request = new DOMEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail,
        trigger
      });
      let target = trigger?.target || null;
      if (target && target instanceof Component) target = target.el;
      const shouldUsePlayer = !target || target === document || target === window || target === document.body || this.#player?.el && target instanceof Node && !this.#player.el.contains(target);
      target = shouldUsePlayer ? this.#target ?? this.getPlayer()?.el : target ?? this.#target;
      if (this.#player) {
        if (type === "media-play-request" && !this.#player.state.canLoad) {
          target?.dispatchEvent(request);
        } else {
          this.#player.canPlayQueue.enqueue(type, () => target?.dispatchEvent(request));
        }
      } else {
        target?.dispatchEvent(request);
      }
    }
    #noPlayerWarning(method2) {
    }
  };
  var LocalMediaStorage = class {
    playerId = "vds-player";
    mediaId = null;
    #data = {
      volume: null,
      muted: null,
      audioGain: null,
      time: null,
      lang: null,
      captions: null,
      rate: null,
      quality: null
    };
    async getVolume() {
      return this.#data.volume;
    }
    async setVolume(volume) {
      this.#data.volume = volume;
      this.save();
    }
    async getMuted() {
      return this.#data.muted;
    }
    async setMuted(muted) {
      this.#data.muted = muted;
      this.save();
    }
    async getTime() {
      return this.#data.time;
    }
    async setTime(time, ended) {
      const shouldClear = time < 0;
      this.#data.time = !shouldClear ? time : null;
      if (shouldClear || ended) this.saveTime();
      else this.saveTimeThrottled();
    }
    async getLang() {
      return this.#data.lang;
    }
    async setLang(lang) {
      this.#data.lang = lang;
      this.save();
    }
    async getCaptions() {
      return this.#data.captions;
    }
    async setCaptions(enabled) {
      this.#data.captions = enabled;
      this.save();
    }
    async getPlaybackRate() {
      return this.#data.rate;
    }
    async setPlaybackRate(rate) {
      this.#data.rate = rate;
      this.save();
    }
    async getAudioGain() {
      return this.#data.audioGain;
    }
    async setAudioGain(gain) {
      this.#data.audioGain = gain;
      this.save();
    }
    async getVideoQuality() {
      return this.#data.quality;
    }
    async setVideoQuality(quality) {
      this.#data.quality = quality;
      this.save();
    }
    onChange(src, mediaId, playerId = "vds-player") {
      const savedData = playerId ? localStorage.getItem(playerId) : null, savedTime = mediaId ? localStorage.getItem(mediaId) : null;
      this.playerId = playerId;
      this.mediaId = mediaId;
      this.#data = {
        volume: null,
        muted: null,
        audioGain: null,
        lang: null,
        captions: null,
        rate: null,
        quality: null,
        ...savedData ? JSON.parse(savedData) : {},
        time: savedTime ? +savedTime : null
      };
    }
    save() {
      if (!this.playerId) return;
      const data = JSON.stringify({ ...this.#data, time: void 0 });
      localStorage.setItem(this.playerId, data);
    }
    saveTimeThrottled = functionThrottle(this.saveTime.bind(this), 1e3);
    saveTime() {
      if (!this.mediaId) return;
      const data = (this.#data.time ?? 0).toString();
      localStorage.setItem(this.mediaId, data);
    }
  };
  var SELECTED = Symbol(0);
  var SelectList = class extends List {
    get selected() {
      return this.items.find((item) => item.selected) ?? null;
    }
    get selectedIndex() {
      return this.items.findIndex((item) => item.selected);
    }
    /** @internal */
    [ListSymbol.onRemove](item, trigger) {
      this[ListSymbol.select](item, false, trigger);
    }
    /** @internal */
    [ListSymbol.add](item, trigger) {
      item[SELECTED] = false;
      Object.defineProperty(item, "selected", {
        get() {
          return this[SELECTED];
        },
        set: (selected) => {
          if (this.readonly) return;
          this[ListSymbol.onUserSelect]?.();
          this[ListSymbol.select](item, selected);
        }
      });
      super[ListSymbol.add](item, trigger);
    }
    /** @internal */
    [ListSymbol.select](item, selected, trigger) {
      if (selected === item?.[SELECTED]) return;
      const prev = this.selected;
      if (item) item[SELECTED] = selected;
      const changed = !selected ? prev === item : prev !== item;
      if (changed) {
        if (prev) prev[SELECTED] = false;
        this.dispatchEvent(
          new DOMEvent("change", {
            detail: {
              prev,
              current: this.selected
            },
            trigger
          })
        );
      }
    }
  };
  var AudioTrackList = class extends SelectList {
  };
  var NativeTextRenderer = class {
    priority = 0;
    #display = true;
    #video = null;
    #track = null;
    #tracks = /* @__PURE__ */ new Set();
    canRender(_2, video) {
      return !!video;
    }
    attach(video) {
      this.#video = video;
      if (video) video.textTracks.onchange = this.#onChange.bind(this);
    }
    addTrack(track) {
      this.#tracks.add(track);
      this.#attachTrack(track);
    }
    removeTrack(track) {
      track[TextTrackSymbol.native]?.remove?.();
      track[TextTrackSymbol.native] = null;
      this.#tracks.delete(track);
    }
    changeTrack(track) {
      const current = track?.[TextTrackSymbol.native];
      if (current && current.track.mode !== "showing") {
        current.track.mode = "showing";
      }
      this.#track = track;
    }
    setDisplay(display) {
      this.#display = display;
      this.#onChange();
    }
    detach() {
      if (this.#video) this.#video.textTracks.onchange = null;
      for (const track of this.#tracks) this.removeTrack(track);
      this.#tracks.clear();
      this.#video = null;
      this.#track = null;
    }
    #attachTrack(track) {
      if (!this.#video) return;
      const el = track[TextTrackSymbol.native] ??= this.#createTrackElement(track);
      if (isHTMLElement2(el)) {
        this.#video.append(el);
        el.track.mode = el.default ? "showing" : "disabled";
      }
    }
    #createTrackElement(track) {
      const el = document.createElement("track"), isDefault = track.default || track.mode === "showing", isSupported = track.src && track.type === "vtt";
      el.id = track.id;
      el.src = isSupported ? track.src : "";
      el.label = track.label;
      el.kind = track.kind;
      el.default = isDefault;
      track.language && (el.srclang = track.language);
      if (isDefault && !isSupported) {
        this.#copyCues(track, el.track);
      }
      return el;
    }
    #copyCues(track, native) {
      if (track.src && track.type === "vtt" || native.cues?.length) return;
      for (const cue of track.cues) native.addCue(cue);
    }
    #onChange(event2) {
      for (const track of this.#tracks) {
        const native = track[TextTrackSymbol.native];
        if (!native) continue;
        if (!this.#display) {
          native.track.mode = native.managed ? "hidden" : "disabled";
          continue;
        }
        const isShowing = native.track.mode === "showing";
        if (isShowing) this.#copyCues(track, native.track);
        track.setMode(isShowing ? "showing" : "disabled", event2);
      }
    }
  };
  var TextRenderers = class {
    #video = null;
    #textTracks;
    #renderers = [];
    #media;
    #nativeDisplay = false;
    #nativeRenderer = null;
    #customRenderer = null;
    constructor(media) {
      this.#media = media;
      const textTracks = media.textTracks;
      this.#textTracks = textTracks;
      effect(this.#watchControls.bind(this));
      onDispose(this.#detach.bind(this));
      new EventsController(textTracks).add("add", this.#onAddTrack.bind(this)).add("remove", this.#onRemoveTrack.bind(this)).add("mode-change", this.#update.bind(this));
    }
    #watchControls() {
      const { nativeControls } = this.#media.$state;
      this.#nativeDisplay = nativeControls();
      this.#update();
    }
    add(renderer) {
      this.#renderers.push(renderer);
      untrack(this.#update.bind(this));
    }
    remove(renderer) {
      renderer.detach();
      this.#renderers.splice(this.#renderers.indexOf(renderer), 1);
      untrack(this.#update.bind(this));
    }
    /** @internal */
    attachVideo(video) {
      requestAnimationFrame(() => {
        this.#video = video;
        if (video) {
          this.#nativeRenderer = new NativeTextRenderer();
          this.#nativeRenderer.attach(video);
          for (const track of this.#textTracks) this.#addNativeTrack(track);
        }
        this.#update();
      });
    }
    #addNativeTrack(track) {
      if (!isTrackCaptionKind(track)) return;
      this.#nativeRenderer?.addTrack(track);
    }
    #removeNativeTrack(track) {
      if (!isTrackCaptionKind(track)) return;
      this.#nativeRenderer?.removeTrack(track);
    }
    #onAddTrack(event2) {
      this.#addNativeTrack(event2.detail);
    }
    #onRemoveTrack(event2) {
      this.#removeNativeTrack(event2.detail);
    }
    #update() {
      const currentTrack = this.#textTracks.selected;
      if (this.#video && (this.#nativeDisplay || currentTrack?.[TextTrackSymbol.nativeHLS])) {
        this.#customRenderer?.changeTrack(null);
        this.#nativeRenderer?.setDisplay(true);
        this.#nativeRenderer?.changeTrack(currentTrack);
        return;
      }
      this.#nativeRenderer?.setDisplay(false);
      this.#nativeRenderer?.changeTrack(null);
      if (!currentTrack) {
        this.#customRenderer?.changeTrack(null);
        return;
      }
      const customRenderer = this.#renderers.sort((a3, b2) => a3.priority - b2.priority).find((renderer) => renderer.canRender(currentTrack, this.#video));
      if (this.#customRenderer !== customRenderer) {
        this.#customRenderer?.detach();
        customRenderer?.attach(this.#video);
        this.#customRenderer = customRenderer ?? null;
      }
      customRenderer?.changeTrack(currentTrack);
    }
    #detach() {
      this.#nativeRenderer?.detach();
      this.#nativeRenderer = null;
      this.#customRenderer?.detach();
      this.#customRenderer = null;
    }
  };
  var TextTrackList = class extends List {
    #canLoad = false;
    #defaults = {};
    #storage = null;
    #preferredLang = null;
    /** @internal */
    [TextTrackSymbol.crossOrigin];
    constructor() {
      super();
    }
    get selected() {
      const track = this.items.find((t5) => t5.mode === "showing" && isTrackCaptionKind(t5));
      return track ?? null;
    }
    get selectedIndex() {
      const selected = this.selected;
      return selected ? this.indexOf(selected) : -1;
    }
    get preferredLang() {
      return this.#preferredLang;
    }
    set preferredLang(lang) {
      this.#preferredLang = lang;
      this.#saveLang(lang);
    }
    add(init, trigger) {
      const isTrack = init instanceof TextTrack, track = isTrack ? init : new TextTrack(init), kind = init.kind === "captions" || init.kind === "subtitles" ? "captions" : init.kind;
      if (this.#defaults[kind] && init.default) delete init.default;
      track.addEventListener("mode-change", this.#onTrackModeChangeBind);
      this[ListSymbol.add](track, trigger);
      track[TextTrackSymbol.crossOrigin] = this[TextTrackSymbol.crossOrigin];
      if (this.#canLoad) track[TextTrackSymbol.canLoad]();
      if (init.default) this.#defaults[kind] = track;
      this.#selectTracks();
      return this;
    }
    remove(track, trigger) {
      this.#pendingRemoval = track;
      if (!this.items.includes(track)) return;
      if (track === this.#defaults[track.kind]) delete this.#defaults[track.kind];
      track.mode = "disabled";
      track[TextTrackSymbol.onModeChange] = null;
      track.removeEventListener("mode-change", this.#onTrackModeChangeBind);
      this[ListSymbol.remove](track, trigger);
      this.#pendingRemoval = null;
      return this;
    }
    clear(trigger) {
      for (const track of [...this.items]) {
        this.remove(track, trigger);
      }
      return this;
    }
    getByKind(kind) {
      const kinds = Array.isArray(kind) ? kind : [kind];
      return this.items.filter((track) => kinds.includes(track.kind));
    }
    /** @internal */
    [TextTrackSymbol.canLoad]() {
      if (this.#canLoad) return;
      for (const track of this.items) track[TextTrackSymbol.canLoad]();
      this.#canLoad = true;
      this.#selectTracks();
    }
    #selectTracks = functionDebounce(async () => {
      if (!this.#canLoad) return;
      if (!this.#preferredLang && this.#storage) {
        this.#preferredLang = await this.#storage.getLang();
      }
      const showCaptions = await this.#storage?.getCaptions(), kinds = [
        ["captions", "subtitles"],
        "chapters",
        "descriptions",
        "metadata"
      ];
      for (const kind of kinds) {
        const tracks = this.getByKind(kind);
        if (tracks.find((t5) => t5.mode === "showing")) continue;
        const preferredTrack = this.#preferredLang ? tracks.find((track2) => track2.language === this.#preferredLang) : null;
        const defaultTrack = isArray(kind) ? this.#defaults[kind.find((kind2) => this.#defaults[kind2]) || ""] : this.#defaults[kind];
        const track = preferredTrack ?? defaultTrack, isCaptionsKind = track && isTrackCaptionKind(track);
        if (track && (!isCaptionsKind || showCaptions !== false)) {
          track.mode = "showing";
          if (isCaptionsKind) this.#saveCaptionsTrack(track);
        }
      }
    }, 300);
    #pendingRemoval = null;
    #onTrackModeChangeBind = this.#onTrackModeChange.bind(this);
    #onTrackModeChange(event2) {
      const track = event2.detail;
      if (this.#storage && isTrackCaptionKind(track) && track !== this.#pendingRemoval) {
        this.#saveCaptionsTrack(track);
      }
      if (track.mode === "showing") {
        const kinds = isTrackCaptionKind(track) ? ["captions", "subtitles"] : [track.kind];
        for (const t5 of this.items) {
          if (t5.mode === "showing" && t5 != track && kinds.includes(t5.kind)) {
            t5.mode = "disabled";
          }
        }
      }
      this.dispatchEvent(
        new DOMEvent("mode-change", {
          detail: event2.detail,
          trigger: event2
        })
      );
    }
    #saveCaptionsTrack(track) {
      if (track.mode !== "disabled") {
        this.#saveLang(track.language);
      }
      this.#storage?.setCaptions?.(track.mode === "showing");
    }
    #saveLang(lang) {
      this.#storage?.setLang?.(this.#preferredLang = lang);
    }
    setStorage(storage) {
      this.#storage = storage;
    }
  };
  var VideoQualityList = class extends SelectList {
    #auto = false;
    /**
     * Configures quality switching:
     *
     * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
     * request if any, flush the whole buffer, and fetch fragment matching with current position
     * and requested quality level.
     *
     * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
     * already buffered next fragment.
     *
     * - `load`: Set quality level for next loaded fragment.
     *
     * @see {@link https://www.vidstack.io/docs/player/api/video-quality#switch}
     * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
     */
    switch = "current";
    /**
     * Whether automatic quality selection is enabled.
     */
    get auto() {
      return this.#auto || this.readonly;
    }
    /** @internal */
    [QualitySymbol.enableAuto];
    /** @internal */
    [ListSymbol.onUserSelect]() {
      this[QualitySymbol.setAuto](false);
    }
    /** @internal */
    [ListSymbol.onReset](trigger) {
      this[QualitySymbol.enableAuto] = void 0;
      this[QualitySymbol.setAuto](false, trigger);
    }
    /**
     * Request automatic quality selection (if supported). This will be a no-op if the list is
     * `readonly` as that already implies auto-selection.
     */
    autoSelect(trigger) {
      if (this.readonly || this.#auto || !this[QualitySymbol.enableAuto]) return;
      this[QualitySymbol.enableAuto]?.(trigger);
      this[QualitySymbol.setAuto](true, trigger);
    }
    getBySrc(src) {
      return this.items.find((quality) => quality.src === src);
    }
    /** @internal */
    [QualitySymbol.setAuto](auto, trigger) {
      if (this.#auto === auto) return;
      this.#auto = auto;
      this.dispatchEvent(
        new DOMEvent("auto-change", {
          detail: auto,
          trigger
        })
      );
    }
  };
  function isHTMLAudioElement(element) {
    return element instanceof HTMLAudioElement;
  }
  function isHTMLVideoElement(element) {
    return element instanceof HTMLVideoElement;
  }
  function isHTMLMediaElement(element) {
    return isHTMLAudioElement(element) || isHTMLVideoElement(element);
  }
  function isHTMLIFrameElement(element) {
    return element instanceof HTMLIFrameElement;
  }
  var MediaPlayerController = class extends ViewController {
  };
  var MEDIA_KEY_SHORTCUTS = {
    togglePaused: "k Space",
    toggleMuted: "m",
    toggleFullscreen: "f",
    togglePictureInPicture: "i",
    toggleCaptions: "c",
    seekBackward: "j J ArrowLeft",
    seekForward: "l L ArrowRight",
    volumeUp: "ArrowUp",
    volumeDown: "ArrowDown",
    speedUp: ">",
    slowDown: "<"
  };
  var MODIFIER_KEYS = /* @__PURE__ */ new Set(["Shift", "Alt", "Meta", "Ctrl"]);
  var BUTTON_SELECTORS = 'button, [role="button"]';
  var IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"], [role="timer"]';
  var MediaKeyboardController = class extends MediaPlayerController {
    #media;
    constructor(media) {
      super();
      this.#media = media;
    }
    onConnect() {
      effect(this.#onTargetChange.bind(this));
    }
    #onTargetChange() {
      const { keyDisabled, keyTarget } = this.$props;
      if (keyDisabled()) return;
      const target = keyTarget() === "player" ? this.el : document, $active = signal(false);
      if (target === this.el) {
        new EventsController(this.el).add("focusin", () => $active.set(true)).add("focusout", (event2) => {
          if (!this.el.contains(event2.target)) $active.set(false);
        });
      } else {
        if (!peek($active)) $active.set(document.querySelector("[data-media-player]") === this.el);
        listenEvent(document, "focusin", (event2) => {
          const activePlayer = event2.composedPath().find((el) => el instanceof Element && el.localName === "media-player");
          if (activePlayer !== void 0) $active.set(this.el === activePlayer);
        });
      }
      effect(() => {
        if (!$active()) return;
        new EventsController(target).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this)).add("keydown", this.#onPreventVideoKeys.bind(this), { capture: true });
      });
    }
    #onKeyUp(event2) {
      const focusedEl = document.activeElement;
      if (!event2.key || !this.$state.canSeek() || focusedEl?.matches(IGNORE_SELECTORS)) {
        return;
      }
      let { method: method2, value } = this.#getMatchingMethod(event2);
      if (!isString(value) && !isArray(value)) {
        value?.onKeyUp?.({
          event: event2,
          player: this.#media.player,
          remote: this.#media.remote
        });
        value?.callback?.(event2, this.#media.remote);
        return;
      }
      if (method2?.startsWith("seek")) {
        event2.preventDefault();
        event2.stopPropagation();
        if (this.#timeSlider) {
          this.#forwardTimeKeyboardEvent(event2, method2 === "seekForward");
          this.#timeSlider = null;
        } else {
          this.#media.remote.seek(this.#seekTotal, event2);
          this.#seekTotal = void 0;
        }
      }
      if (method2?.startsWith("volume")) {
        const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
        volumeSlider?.dispatchEvent(
          new KeyboardEvent("keyup", {
            key: method2 === "volumeUp" ? "Up" : "Down",
            shiftKey: event2.shiftKey,
            trigger: event2
          })
        );
      }
    }
    #onKeyDown(event2) {
      if (!event2.key || MODIFIER_KEYS.has(event2.key)) return;
      const focusedEl = document.activeElement;
      if (focusedEl?.matches(IGNORE_SELECTORS) || isKeyboardClick(event2) && focusedEl?.matches(BUTTON_SELECTORS)) {
        return;
      }
      let { method: method2, value } = this.#getMatchingMethod(event2), isNumberPress = !event2.metaKey && /^[0-9]$/.test(event2.key);
      if (!isString(value) && !isArray(value) && !isNumberPress) {
        value?.onKeyDown?.({
          event: event2,
          player: this.#media.player,
          remote: this.#media.remote
        });
        value?.callback?.(event2, this.#media.remote);
        return;
      }
      if (!method2 && isNumberPress) {
        event2.preventDefault();
        event2.stopPropagation();
        this.#media.remote.seek(this.$state.duration() / 10 * Number(event2.key), event2);
        return;
      }
      if (!method2) return;
      event2.preventDefault();
      event2.stopPropagation();
      switch (method2) {
        case "seekForward":
        case "seekBackward":
          this.#seeking(event2, method2, method2 === "seekForward");
          break;
        case "volumeUp":
        case "volumeDown":
          const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
          if (volumeSlider) {
            volumeSlider.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: method2 === "volumeUp" ? "Up" : "Down",
                shiftKey: event2.shiftKey,
                trigger: event2
              })
            );
          } else {
            const value2 = event2.shiftKey ? 0.1 : 0.05;
            this.#media.remote.changeVolume(
              this.$state.volume() + (method2 === "volumeUp" ? +value2 : -value2),
              event2
            );
          }
          break;
        case "toggleFullscreen":
          this.#media.remote.toggleFullscreen("prefer-media", event2);
          break;
        case "speedUp":
        case "slowDown":
          const playbackRate = this.$state.playbackRate();
          this.#media.remote.changePlaybackRate(
            Math.max(0.25, Math.min(2, playbackRate + (method2 === "speedUp" ? 0.25 : -0.25))),
            event2
          );
          break;
        default:
          this.#media.remote[method2]?.(event2);
      }
      this.$state.lastKeyboardAction.set({
        action: method2,
        event: event2
      });
    }
    #onPreventVideoKeys(event2) {
      if (isHTMLMediaElement(event2.target) && this.#getMatchingMethod(event2).method) {
        event2.preventDefault();
      }
    }
    #getMatchingMethod(event2) {
      const keyShortcuts = {
        ...this.$props.keyShortcuts(),
        ...this.#media.ariaKeys
      };
      const method2 = Object.keys(keyShortcuts).find((method22) => {
        const value = keyShortcuts[method22], keys = isArray(value) ? value.join(" ") : isString(value) ? value : value?.keys;
        const combinations = (isArray(keys) ? keys : keys?.split(" "))?.map(
          (key2) => replaceSymbolKeys(key2).replace(/Control/g, "Ctrl").split("+")
        );
        return combinations?.some((combo) => {
          const modifierKeys = new Set(combo.filter((key2) => MODIFIER_KEYS.has(key2)));
          for (const modKey of MODIFIER_KEYS) {
            const modKeyProp = modKey.toLowerCase() + "Key";
            if (!modifierKeys.has(modKey) && event2[modKeyProp]) {
              return false;
            }
          }
          return combo.every((key2) => {
            return MODIFIER_KEYS.has(key2) ? event2[key2.toLowerCase() + "Key"] : event2.key === key2.replace("Space", " ");
          });
        });
      });
      return {
        method: method2,
        value: method2 ? keyShortcuts[method2] : null
      };
    }
    #seekTotal;
    #calcSeekAmount(event2, type) {
      const seekBy = event2.shiftKey ? 10 : 5;
      return this.#seekTotal = Math.max(
        0,
        Math.min(
          (this.#seekTotal ?? this.$state.currentTime()) + (type === "seekForward" ? +seekBy : -seekBy),
          this.$state.duration()
        )
      );
    }
    #timeSlider = null;
    #forwardTimeKeyboardEvent(event2, forward) {
      this.#timeSlider?.dispatchEvent(
        new KeyboardEvent(event2.type, {
          key: !forward ? "Left" : "Right",
          shiftKey: event2.shiftKey,
          trigger: event2
        })
      );
    }
    #seeking(event2, type, forward) {
      if (!this.$state.canSeek()) return;
      if (!this.#timeSlider) {
        this.#timeSlider = this.el.querySelector("[data-media-time-slider]");
      }
      if (this.#timeSlider) {
        this.#forwardTimeKeyboardEvent(event2, forward);
      } else {
        this.#media.remote.seeking(this.#calcSeekAmount(event2, type), event2);
      }
    }
  };
  var SYMBOL_KEY_MAP = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
  function replaceSymbolKeys(key2) {
    return key2.replace(/Shift\+(\d)/g, (_2, num) => SYMBOL_KEY_MAP[num - 1]);
  }
  var MediaControls = class extends MediaPlayerController {
    #idleTimer = -2;
    #pausedTracking = false;
    #hideOnMouseLeave = signal(false);
    #isMouseOutside = signal(false);
    #focusedItem = null;
    #canIdle = signal(true);
    /**
     * The default amount of delay in milliseconds while media playback is progressing without user
     * activity to indicate an idle state (i.e., hide controls).
     *
     * @defaultValue 2000
     */
    defaultDelay = 2e3;
    /**
     * Whether controls can hide after a delay in user interaction. If this is false, controls will
     * not hide and be user controlled.
     */
    get canIdle() {
      return this.#canIdle();
    }
    set canIdle(canIdle) {
      this.#canIdle.set(canIdle);
    }
    /**
     * Whether controls visibility should be toggled when the mouse enters and leaves the player
     * container.
     *
     * @defaultValue false
     */
    get hideOnMouseLeave() {
      const { hideControlsOnMouseLeave } = this.$props;
      return this.#hideOnMouseLeave() || hideControlsOnMouseLeave();
    }
    set hideOnMouseLeave(hide2) {
      this.#hideOnMouseLeave.set(hide2);
    }
    /**
     * Whether media controls are currently visible.
     */
    get showing() {
      return this.$state.controlsVisible();
    }
    /**
     * Show controls.
     */
    show(delay = 0, trigger) {
      this.#clearIdleTimer();
      if (!this.#pausedTracking) {
        this.#changeVisibility(true, delay, trigger);
      }
    }
    /**
     * Hide controls.
     */
    hide(delay = this.defaultDelay, trigger) {
      this.#clearIdleTimer();
      if (!this.#pausedTracking) {
        this.#changeVisibility(false, delay, trigger);
      }
    }
    /**
     * Whether all idle tracking on controls should be paused until resumed again.
     */
    pause(trigger) {
      this.#pausedTracking = true;
      this.#clearIdleTimer();
      this.#changeVisibility(true, 0, trigger);
    }
    resume(trigger) {
      this.#pausedTracking = false;
      if (this.$state.paused()) return;
      this.#changeVisibility(false, this.defaultDelay, trigger);
    }
    onConnect() {
      effect(this.#init.bind(this));
    }
    #init() {
      const { viewType } = this.$state;
      if (!this.el || !this.#canIdle()) return;
      if (viewType() === "audio") {
        this.show();
        return;
      }
      effect(this.#watchMouse.bind(this));
      effect(this.#watchPaused.bind(this));
      const onPlay = this.#onPlay.bind(this), onPause = this.#onPause.bind(this), onEnd = this.#onEnd.bind(this);
      new EventsController(this.el).add("can-play", (event2) => this.show(0, event2)).add("play", onPlay).add("pause", onPause).add("end", onEnd).add("auto-play-fail", onPause);
    }
    #watchMouse() {
      if (!this.el) return;
      const { started, pointer, paused } = this.$state;
      if (!started() || pointer() !== "fine") return;
      const events = new EventsController(this.el), shouldHideOnMouseLeave = this.hideOnMouseLeave;
      if (!shouldHideOnMouseLeave || !this.#isMouseOutside()) {
        effect(() => {
          if (!paused()) events.add("pointermove", this.#onStopIdle.bind(this));
        });
      }
      if (shouldHideOnMouseLeave) {
        events.add("mouseenter", this.#onMouseEnter.bind(this)).add("mouseleave", this.#onMouseLeave.bind(this));
      }
    }
    #watchPaused() {
      const { paused, started, autoPlayError } = this.$state;
      if (paused() || autoPlayError() && !started()) return;
      const onStopIdle = this.#onStopIdle.bind(this);
      effect(() => {
        if (!this.el) return;
        const pointer = this.$state.pointer(), isTouch = pointer === "coarse", events = new EventsController(this.el), eventTypes = [isTouch ? "touchend" : "pointerup", "keydown"];
        for (const eventType of eventTypes) {
          events.add(eventType, onStopIdle, { passive: false });
        }
      });
    }
    #onPlay(event2) {
      if (event2.triggers.hasType("ended")) return;
      this.show(0, event2);
      this.hide(void 0, event2);
    }
    #onPause(event2) {
      this.show(0, event2);
    }
    #onEnd(event2) {
      const { loop } = this.$state;
      if (loop()) this.hide(0, event2);
    }
    #onMouseEnter(event2) {
      this.#isMouseOutside.set(false);
      this.show(0, event2);
      this.hide(void 0, event2);
    }
    #onMouseLeave(event2) {
      this.#isMouseOutside.set(true);
      this.hide(0, event2);
    }
    #clearIdleTimer() {
      window.clearTimeout(this.#idleTimer);
      this.#idleTimer = -1;
    }
    #onStopIdle(event2) {
      if (
        // @ts-expect-error
        event2.MEDIA_GESTURE || this.#pausedTracking || isTouchPinchEvent(event2)
      ) {
        return;
      }
      if (isKeyboardEvent(event2)) {
        if (event2.key === "Escape") {
          this.el?.focus();
          this.#focusedItem = null;
        } else if (this.#focusedItem) {
          event2.preventDefault();
          requestAnimationFrame(() => {
            this.#focusedItem?.focus();
            this.#focusedItem = null;
          });
        }
      }
      this.show(0, event2);
      this.hide(this.defaultDelay, event2);
    }
    #changeVisibility(visible, delay, trigger) {
      if (delay === 0) {
        this.#onChange(visible, trigger);
        return;
      }
      this.#idleTimer = window.setTimeout(() => {
        if (!this.scope) return;
        this.#onChange(visible && !this.#pausedTracking, trigger);
      }, delay);
    }
    #onChange(visible, trigger) {
      if (this.$state.controlsVisible() === visible) return;
      this.$state.controlsVisible.set(visible);
      if (!visible && document.activeElement && this.el?.contains(document.activeElement)) {
        this.#focusedItem = document.activeElement;
        requestAnimationFrame(() => {
          this.el?.focus({ preventScroll: true });
        });
      }
      this.dispatch("controls-change", {
        detail: visible,
        trigger
      });
    }
  };
  var AudioProviderLoader = class {
    name = "audio";
    target;
    canPlay(src) {
      if (!isAudioSrc(src)) return false;
      return !isString(src.src) || src.type === "?" || canPlayAudioType(this.target, src.type);
    }
    mediaType() {
      return "audio";
    }
    async load(ctx) {
      return new (await Promise.resolve().then(() => (init_vidstack_audio(), vidstack_audio_exports))).AudioProvider(this.target, ctx);
    }
  };
  var VideoProviderLoader = class {
    name = "video";
    target;
    canPlay(src) {
      if (!isVideoSrc(src)) return false;
      return !isString(src.src) || src.type === "?" || canPlayVideoType(this.target, src.type);
    }
    mediaType() {
      return "video";
    }
    async load(ctx) {
      return new (await Promise.resolve().then(() => (init_vidstack_video(), vidstack_video_exports))).VideoProvider(this.target, ctx);
    }
  };
  var HLSProviderLoader = class _HLSProviderLoader extends VideoProviderLoader {
    static supported = isHLSSupported();
    name = "hls";
    canPlay(src) {
      return _HLSProviderLoader.supported && isHLSSrc(src);
    }
    async load(context) {
      return new (await Promise.resolve().then(() => (init_vidstack_hls(), vidstack_hls_exports))).HLSProvider(this.target, context);
    }
  };
  var DASHProviderLoader = class _DASHProviderLoader extends VideoProviderLoader {
    static supported = isDASHSupported();
    name = "dash";
    canPlay(src) {
      return _DASHProviderLoader.supported && isDASHSrc(src);
    }
    async load(context) {
      return new (await Promise.resolve().then(() => (init_vidstack_dash(), vidstack_dash_exports))).DASHProvider(this.target, context);
    }
  };
  var VimeoProviderLoader = class {
    name = "vimeo";
    target;
    preconnect() {
      const connections = [
        "https://i.vimeocdn.com",
        "https://f.vimeocdn.com",
        "https://fresnel.vimeocdn.com"
      ];
      for (const url of connections) {
        preconnect(url);
      }
    }
    canPlay(src) {
      return isString(src.src) && src.type === "video/vimeo";
    }
    mediaType() {
      return "video";
    }
    async load(ctx) {
      return new (await Promise.resolve().then(() => (init_vidstack_vimeo(), vidstack_vimeo_exports))).VimeoProvider(this.target, ctx);
    }
    async loadPoster(src, ctx, abort) {
      const { resolveVimeoVideoId: resolveVimeoVideoId2, getVimeoVideoInfo: getVimeoVideoInfo2 } = await Promise.resolve().then(() => (init_vidstack_krOAtKMi(), vidstack_krOAtKMi_exports));
      if (!isString(src.src)) return null;
      const { videoId, hash } = resolveVimeoVideoId2(src.src);
      if (videoId) {
        return getVimeoVideoInfo2(videoId, abort, hash).then((info) => info ? info.poster : null);
      }
      return null;
    }
  };
  var YouTubeProviderLoader = class {
    name = "youtube";
    target;
    preconnect() {
      const connections = [
        // Botguard script.
        "https://www.google.com",
        // Posters.
        "https://i.ytimg.com",
        // Ads.
        "https://googleads.g.doubleclick.net",
        "https://static.doubleclick.net"
      ];
      for (const url of connections) {
        preconnect(url);
      }
    }
    canPlay(src) {
      return isString(src.src) && src.type === "video/youtube";
    }
    mediaType() {
      return "video";
    }
    async load(ctx) {
      return new (await Promise.resolve().then(() => (init_vidstack_youtube(), vidstack_youtube_exports))).YouTubeProvider(this.target, ctx);
    }
    async loadPoster(src, ctx, abort) {
      const { findYouTubePoster: findYouTubePoster2, resolveYouTubeVideoId: resolveYouTubeVideoId2 } = await Promise.resolve().then(() => (init_vidstack_Zc3I7oOd(), vidstack_Zc3I7oOd_exports));
      const videoId = isString(src.src) && resolveYouTubeVideoId2(src.src);
      if (videoId) return findYouTubePoster2(videoId, abort);
      return null;
    }
  };
  var MEDIA_ATTRIBUTES = Symbol(0);
  var mediaAttributes = [
    "autoPlay",
    "canAirPlay",
    "canFullscreen",
    "canGoogleCast",
    "canLoad",
    "canLoadPoster",
    "canPictureInPicture",
    "canPlay",
    "canSeek",
    "ended",
    "fullscreen",
    "isAirPlayConnected",
    "isGoogleCastConnected",
    "live",
    "liveEdge",
    "loop",
    "mediaType",
    "muted",
    "paused",
    "pictureInPicture",
    "playing",
    "playsInline",
    "remotePlaybackState",
    "remotePlaybackType",
    "seeking",
    "started",
    "streamType",
    "viewType",
    "waiting"
  ];
  var mediaPlayerProps = {
    artist: "",
    artwork: null,
    autoplay: false,
    autoPlay: false,
    clipStartTime: 0,
    clipEndTime: 0,
    controls: false,
    currentTime: 0,
    crossorigin: null,
    crossOrigin: null,
    duration: -1,
    fullscreenOrientation: "landscape",
    googleCast: {},
    load: "visible",
    posterLoad: "visible",
    logLevel: "silent",
    loop: false,
    muted: false,
    paused: true,
    playsinline: false,
    playsInline: false,
    playbackRate: 1,
    poster: "",
    preload: "metadata",
    preferNativeHLS: false,
    src: "",
    title: "",
    controlsDelay: 2e3,
    hideControlsOnMouseLeave: false,
    viewType: "unknown",
    streamType: "unknown",
    volume: 1,
    liveEdgeTolerance: 10,
    minLiveDVRWindow: 60,
    keyDisabled: false,
    keyTarget: "player",
    keyShortcuts: MEDIA_KEY_SHORTCUTS,
    storage: null
  };
  var MediaLoadController = class extends MediaPlayerController {
    #type;
    #callback;
    constructor(type, callback) {
      super();
      this.#type = type;
      this.#callback = callback;
    }
    async onAttach(el) {
      const load = this.$props[this.#type]();
      if (load === "eager") {
        requestAnimationFrame(this.#callback);
      } else if (load === "idle") {
        waitIdlePeriod(this.#callback);
      } else if (load === "visible") {
        let dispose2, observer = new IntersectionObserver((entries) => {
          if (!this.scope) return;
          if (entries[0].isIntersecting) {
            dispose2?.();
            dispose2 = void 0;
            this.#callback();
          }
        });
        observer.observe(el);
        dispose2 = onDispose(() => observer.disconnect());
      }
    }
  };
  var MediaPlayerDelegate = class {
    #handle;
    #media;
    constructor(handle, media) {
      this.#handle = handle;
      this.#media = media;
    }
    notify(type, ...init) {
      this.#handle(
        new DOMEvent(type, {
          detail: init?.[0],
          trigger: init?.[1]
        })
      );
    }
    async ready(info, trigger) {
      return untrack(async () => {
        this.#media;
        const {
          autoPlay,
          canPlay,
          started,
          duration,
          seekable,
          buffered,
          remotePlaybackInfo,
          playsInline,
          savedState,
          source
        } = this.#media.$state;
        if (canPlay()) return;
        const detail = {
          duration: info?.duration ?? duration(),
          seekable: info?.seekable ?? seekable(),
          buffered: info?.buffered ?? buffered(),
          provider: this.#media.$provider()
        };
        this.notify("can-play", detail, trigger);
        tick();
        let provider = this.#media.$provider(), { storage, qualities } = this.#media, { muted, volume, clipStartTime, playbackRate } = this.#media.$props;
        await storage?.onLoad?.(source());
        const savedPlaybackTime = savedState()?.currentTime, savedPausedState = savedState()?.paused, storageTime = await storage?.getTime(), startTime = savedPlaybackTime ?? storageTime ?? clipStartTime(), shouldAutoPlay = savedPausedState === false || savedPausedState !== true && !started() && autoPlay();
        if (provider) {
          provider.setVolume(await storage?.getVolume() ?? volume());
          provider.setMuted(muted() || !!await storage?.getMuted());
          const audioGain = await storage?.getAudioGain() ?? 1;
          if (audioGain > 1) provider.audioGain?.setGain?.(audioGain);
          provider.setPlaybackRate?.(await storage?.getPlaybackRate() ?? playbackRate());
          provider.setPlaysInline?.(playsInline());
          if (startTime > 0) provider.setCurrentTime(startTime);
        }
        const prefQuality = await storage?.getVideoQuality();
        if (prefQuality && qualities.length) {
          let currentQuality = null, currentScore = Infinity;
          for (const quality of qualities) {
            const score = Math.abs(prefQuality.width - quality.width) + Math.abs(prefQuality.height - quality.height) + (prefQuality.bitrate ? Math.abs(prefQuality.bitrate - (quality.bitrate ?? 0)) : 0);
            if (score < currentScore) {
              currentQuality = quality;
              currentScore = score;
            }
          }
          if (currentQuality) currentQuality.selected = true;
        }
        if (canPlay() && shouldAutoPlay) {
          await this.#attemptAutoplay(trigger);
        } else if (storageTime && storageTime > 0) {
          this.notify("started", void 0, trigger);
        }
        remotePlaybackInfo.set(null);
      });
    }
    async #attemptAutoplay(trigger) {
      const {
        player,
        $state: { autoPlaying, muted }
      } = this.#media;
      autoPlaying.set(true);
      const attemptEvent = new DOMEvent("auto-play-attempt", { trigger });
      try {
        await player.play(attemptEvent);
      } catch (error) {
      }
    }
  };
  var Queue = class {
    #queue = /* @__PURE__ */ new Map();
    /**
     * Queue the given `item` under the given `key` to be processed at a later time by calling
     * `serve(key)`.
     */
    enqueue(key2, item) {
      this.#queue.set(key2, item);
    }
    /**
     * Process item in queue for the given `key`.
     */
    serve(key2) {
      const value = this.peek(key2);
      this.#queue.delete(key2);
      return value;
    }
    /**
     * Peek at item in queue for the given `key`.
     */
    peek(key2) {
      return this.#queue.get(key2);
    }
    /**
     * Removes queued item under the given `key`.
     */
    delete(key2) {
      this.#queue.delete(key2);
    }
    /**
     * Clear all items in the queue.
     */
    clear() {
      this.#queue.clear();
    }
  };
  var RequestQueue = class {
    #serving = false;
    #pending = deferredPromise();
    #queue = /* @__PURE__ */ new Map();
    /**
     * The number of callbacks that are currently in queue.
     */
    get size() {
      return this.#queue.size;
    }
    /**
     * Whether items in the queue are being served immediately, otherwise they're queued to
     * be processed later.
     */
    get isServing() {
      return this.#serving;
    }
    /**
     * Waits for the queue to be flushed (ie: start serving).
     */
    async waitForFlush() {
      if (this.#serving) return;
      await this.#pending.promise;
    }
    /**
     * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
     * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
     * then the callback will be invoked immediately.
     *
     * @param key - Uniquely identifies this callback so duplicates are ignored.
     * @param callback - The function to call when this item in the queue is being served.
     */
    enqueue(key2, callback) {
      if (this.#serving) {
        callback();
        return;
      }
      this.#queue.delete(key2);
      this.#queue.set(key2, callback);
    }
    /**
     * Invokes the callback with the given `key` in the queue (if it exists).
     */
    serve(key2) {
      this.#queue.get(key2)?.();
      this.#queue.delete(key2);
    }
    /**
     * Flush all queued items and start serving future requests immediately until `stop()` is called.
     */
    start() {
      this.#flush();
      this.#serving = true;
      if (this.#queue.size > 0) this.#flush();
    }
    /**
     * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
     */
    stop() {
      this.#serving = false;
    }
    /**
     * Stop serving requests, empty the request queue, and release any promises waiting for the
     * queue to flush.
     */
    reset() {
      this.stop();
      this.#queue.clear();
      this.#release();
    }
    #flush() {
      for (const key2 of this.#queue.keys()) this.serve(key2);
      this.#release();
    }
    #release() {
      this.#pending.resolve();
      this.#pending = deferredPromise();
    }
  };
  var MediaRequestManager = class extends MediaPlayerController {
    #stateMgr;
    #request;
    #media;
    controls;
    #fullscreen;
    #orientation;
    #$provider;
    #providerQueue = new RequestQueue();
    constructor(stateMgr, request, media) {
      super();
      this.#stateMgr = stateMgr;
      this.#request = request;
      this.#media = media;
      this.#$provider = media.$provider;
      this.controls = new MediaControls();
      this.#fullscreen = new FullscreenController();
      this.#orientation = new ScreenOrientationController();
    }
    onAttach() {
      this.listen("fullscreen-change", this.#onFullscreenChange.bind(this));
    }
    onConnect(el) {
      const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), events = new EventsController(el), handleRequest = this.#handleRequest.bind(this);
      for (const name of names) {
        if (name.startsWith("media-")) {
          events.add(name, handleRequest);
        }
      }
      this.#attachLoadPlayListener();
      effect(this.#watchProvider.bind(this));
      effect(this.#watchControlsDelayChange.bind(this));
      effect(this.#watchAudioGainSupport.bind(this));
      effect(this.#watchAirPlaySupport.bind(this));
      effect(this.#watchGoogleCastSupport.bind(this));
      effect(this.#watchFullscreenSupport.bind(this));
      effect(this.#watchPiPSupport.bind(this));
    }
    onDestroy() {
      try {
        const destroyEvent = this.createEvent("destroy"), { pictureInPicture, fullscreen } = this.$state;
        if (fullscreen()) this.exitFullscreen("prefer-media", destroyEvent);
        if (pictureInPicture()) this.exitPictureInPicture(destroyEvent);
      } catch (e6) {
      }
      this.#providerQueue.reset();
    }
    #attachLoadPlayListener() {
      const { load } = this.$props, { canLoad } = this.$state;
      if (load() !== "play" || canLoad()) return;
      const off = this.listen("media-play-request", (event2) => {
        this.#handleLoadPlayStrategy(event2);
        off();
      });
    }
    #watchProvider() {
      const provider = this.#$provider(), canPlay = this.$state.canPlay();
      if (provider && canPlay) {
        this.#providerQueue.start();
      }
      return () => {
        this.#providerQueue.stop();
      };
    }
    #handleRequest(event2) {
      event2.stopPropagation();
      if (event2.defaultPrevented) return;
      if (!this[event2.type]) return;
      if (peek(this.#$provider)) {
        this[event2.type](event2);
      } else {
        this.#providerQueue.enqueue(event2.type, () => {
          if (peek(this.#$provider)) this[event2.type](event2);
        });
      }
    }
    async play(trigger) {
      const { canPlay, paused, autoPlaying } = this.$state;
      if (this.#handleLoadPlayStrategy(trigger)) return;
      if (!peek(paused)) return;
      if (trigger) this.#request.queue.enqueue("media-play-request", trigger);
      const isAutoPlaying = peek(autoPlaying);
      try {
        const provider = peek(this.#$provider);
        throwIfNotReadyForPlayback(provider, peek(canPlay));
        return await provider.play();
      } catch (error) {
        const errorEvent = this.createEvent("play-fail", {
          detail: coerceToError(error),
          trigger
        });
        errorEvent.autoPlay = isAutoPlaying;
        this.#stateMgr.handle(errorEvent);
        throw error;
      }
    }
    #handleLoadPlayStrategy(trigger) {
      const { load } = this.$props, { canLoad } = this.$state;
      if (load() === "play" && !canLoad()) {
        const event2 = this.createEvent("media-start-loading", { trigger });
        this.dispatchEvent(event2);
        this.#providerQueue.enqueue("media-play-request", async () => {
          try {
            await this.play(event2);
          } catch (error) {
          }
        });
        return true;
      }
      return false;
    }
    async pause(trigger) {
      const { canPlay, paused } = this.$state;
      if (peek(paused)) return;
      if (trigger) {
        this.#request.queue.enqueue("media-pause-request", trigger);
      }
      try {
        const provider = peek(this.#$provider);
        throwIfNotReadyForPlayback(provider, peek(canPlay));
        return await provider.pause();
      } catch (error) {
        this.#request.queue.delete("media-pause-request");
        throw error;
      }
    }
    setAudioGain(gain, trigger) {
      const { audioGain, canSetAudioGain } = this.$state;
      if (audioGain() === gain) return;
      const provider = this.#$provider();
      if (!provider?.audioGain || !canSetAudioGain()) {
        throw Error("[vidstack] audio gain api not available");
      }
      if (trigger) {
        this.#request.queue.enqueue("media-audio-gain-change-request", trigger);
      }
      provider.audioGain.setGain(gain);
    }
    seekToLiveEdge(trigger) {
      const { canPlay, live, liveEdge, canSeek, liveSyncPosition, seekableEnd, userBehindLiveEdge } = this.$state;
      userBehindLiveEdge.set(false);
      if (peek(() => !live() || liveEdge() || !canSeek())) return;
      const provider = peek(this.#$provider);
      throwIfNotReadyForPlayback(provider, peek(canPlay));
      if (trigger) this.#request.queue.enqueue("media-seek-request", trigger);
      const end = seekableEnd() - 2;
      provider.setCurrentTime(Math.min(end, liveSyncPosition() ?? end));
    }
    #wasPIPActive = false;
    async enterFullscreen(target = "prefer-media", trigger) {
      const adapter = this.#getFullscreenAdapter(target);
      throwIfFullscreenNotSupported(target, adapter);
      if (adapter.active) return;
      if (peek(this.$state.pictureInPicture)) {
        this.#wasPIPActive = true;
        await this.exitPictureInPicture(trigger);
      }
      if (trigger) {
        this.#request.queue.enqueue("media-enter-fullscreen-request", trigger);
      }
      return adapter.enter();
    }
    async exitFullscreen(target = "prefer-media", trigger) {
      const adapter = this.#getFullscreenAdapter(target);
      throwIfFullscreenNotSupported(target, adapter);
      if (!adapter.active) return;
      if (trigger) {
        this.#request.queue.enqueue("media-exit-fullscreen-request", trigger);
      }
      try {
        const result = await adapter.exit();
        if (this.#wasPIPActive && peek(this.$state.canPictureInPicture)) {
          await this.enterPictureInPicture();
        }
        return result;
      } finally {
        this.#wasPIPActive = false;
      }
    }
    #getFullscreenAdapter(target) {
      const provider = peek(this.#$provider);
      return target === "prefer-media" && this.#fullscreen.supported || target === "media" ? this.#fullscreen : provider?.fullscreen;
    }
    async enterPictureInPicture(trigger) {
      this.#throwIfPIPNotSupported();
      if (this.$state.pictureInPicture()) return;
      if (trigger) {
        this.#request.queue.enqueue("media-enter-pip-request", trigger);
      }
      return await this.#$provider().pictureInPicture.enter();
    }
    async exitPictureInPicture(trigger) {
      this.#throwIfPIPNotSupported();
      if (!this.$state.pictureInPicture()) return;
      if (trigger) {
        this.#request.queue.enqueue("media-exit-pip-request", trigger);
      }
      return await this.#$provider().pictureInPicture.exit();
    }
    #throwIfPIPNotSupported() {
      if (this.$state.canPictureInPicture()) return;
      throw Error(
        "[vidstack] no pip support"
      );
    }
    #watchControlsDelayChange() {
      this.controls.defaultDelay = this.$props.controlsDelay();
    }
    #watchAudioGainSupport() {
      const { canSetAudioGain } = this.$state, supported = !!this.#$provider()?.audioGain?.supported;
      canSetAudioGain.set(supported);
    }
    #watchAirPlaySupport() {
      const { canAirPlay } = this.$state, supported = !!this.#$provider()?.airPlay?.supported;
      canAirPlay.set(supported);
    }
    #watchGoogleCastSupport() {
      const { canGoogleCast, source } = this.$state, supported = IS_CHROME && !IS_IOS && canGoogleCastSrc(source());
      canGoogleCast.set(supported);
    }
    #watchFullscreenSupport() {
      const { canFullscreen } = this.$state, supported = this.#fullscreen.supported || !!this.#$provider()?.fullscreen?.supported;
      canFullscreen.set(supported);
    }
    #watchPiPSupport() {
      const { canPictureInPicture } = this.$state, supported = !!this.#$provider()?.pictureInPicture?.supported;
      canPictureInPicture.set(supported);
    }
    async ["media-airplay-request"](event2) {
      try {
        await this.requestAirPlay(event2);
      } catch (error) {
      }
    }
    async requestAirPlay(trigger) {
      try {
        const adapter = this.#$provider()?.airPlay;
        if (!adapter?.supported) {
          throw Error(false ? "AirPlay adapter not available on provider." : "No AirPlay adapter.");
        }
        if (trigger) {
          this.#request.queue.enqueue("media-airplay-request", trigger);
        }
        return await adapter.prompt();
      } catch (error) {
        this.#request.queue.delete("media-airplay-request");
        throw error;
      }
    }
    async ["media-google-cast-request"](event2) {
      try {
        await this.requestGoogleCast(event2);
      } catch (error) {
      }
    }
    #googleCastLoader;
    async requestGoogleCast(trigger) {
      try {
        const { canGoogleCast } = this.$state;
        if (!peek(canGoogleCast)) {
          const error = Error(
            false ? "Google Cast not available on this platform." : "Cast not available."
          );
          error.code = "CAST_NOT_AVAILABLE";
          throw error;
        }
        preconnect("https://www.gstatic.com");
        if (!this.#googleCastLoader) {
          const $module = await Promise.resolve().then(() => (init_vidstack_CWDlegKy(), vidstack_CWDlegKy_exports));
          this.#googleCastLoader = new $module.GoogleCastLoader();
        }
        await this.#googleCastLoader.prompt(this.#media);
        if (trigger) {
          this.#request.queue.enqueue("media-google-cast-request", trigger);
        }
        const isConnecting = peek(this.$state.remotePlaybackState) !== "disconnected";
        if (isConnecting) {
          this.$state.savedState.set({
            paused: peek(this.$state.paused),
            currentTime: peek(this.$state.currentTime)
          });
        }
        this.$state.remotePlaybackLoader.set(isConnecting ? this.#googleCastLoader : null);
      } catch (error) {
        this.#request.queue.delete("media-google-cast-request");
        throw error;
      }
    }
    ["media-clip-start-change-request"](event2) {
      const { clipStartTime } = this.$state;
      clipStartTime.set(event2.detail);
    }
    ["media-clip-end-change-request"](event2) {
      const { clipEndTime } = this.$state;
      clipEndTime.set(event2.detail);
      this.dispatch("duration-change", {
        detail: event2.detail,
        trigger: event2
      });
    }
    ["media-duration-change-request"](event2) {
      const { providedDuration, clipEndTime } = this.$state;
      providedDuration.set(event2.detail);
      if (clipEndTime() <= 0) {
        this.dispatch("duration-change", {
          detail: event2.detail,
          trigger: event2
        });
      }
    }
    ["media-audio-track-change-request"](event2) {
      const { logger, audioTracks } = this.#media;
      if (audioTracks.readonly) {
        return;
      }
      const index = event2.detail, track = audioTracks[index];
      if (track) {
        const key2 = event2.type;
        this.#request.queue.enqueue(key2, event2);
        track.selected = true;
      }
    }
    async ["media-enter-fullscreen-request"](event2) {
      try {
        await this.enterFullscreen(event2.detail, event2);
      } catch (error) {
        this.#onFullscreenError(error, event2);
      }
    }
    async ["media-exit-fullscreen-request"](event2) {
      try {
        await this.exitFullscreen(event2.detail, event2);
      } catch (error) {
        this.#onFullscreenError(error, event2);
      }
    }
    async #onFullscreenChange(event2) {
      const lockType = peek(this.$props.fullscreenOrientation), isFullscreen2 = event2.detail;
      if (isUndefined(lockType) || lockType === "none" || !this.#orientation.supported) return;
      if (isFullscreen2) {
        if (this.#orientation.locked) return;
        this.dispatch("media-orientation-lock-request", {
          detail: lockType,
          trigger: event2
        });
      } else if (this.#orientation.locked) {
        this.dispatch("media-orientation-unlock-request", {
          trigger: event2
        });
      }
    }
    #onFullscreenError(error, request) {
      this.#stateMgr.handle(
        this.createEvent("fullscreen-error", {
          detail: coerceToError(error)
        })
      );
    }
    async ["media-orientation-lock-request"](event2) {
      const key2 = event2.type;
      try {
        this.#request.queue.enqueue(key2, event2);
        await this.#orientation.lock(event2.detail);
      } catch (error) {
        this.#request.queue.delete(key2);
      }
    }
    async ["media-orientation-unlock-request"](event2) {
      const key2 = event2.type;
      try {
        this.#request.queue.enqueue(key2, event2);
        await this.#orientation.unlock();
      } catch (error) {
        this.#request.queue.delete(key2);
      }
    }
    async ["media-enter-pip-request"](event2) {
      try {
        await this.enterPictureInPicture(event2);
      } catch (error) {
        this.#onPictureInPictureError(error, event2);
      }
    }
    async ["media-exit-pip-request"](event2) {
      try {
        await this.exitPictureInPicture(event2);
      } catch (error) {
        this.#onPictureInPictureError(error, event2);
      }
    }
    #onPictureInPictureError(error, request) {
      this.#stateMgr.handle(
        this.createEvent("picture-in-picture-error", {
          detail: coerceToError(error)
        })
      );
    }
    ["media-live-edge-request"](event2) {
      const { live, liveEdge, canSeek } = this.$state;
      if (!live() || liveEdge() || !canSeek()) return;
      this.#request.queue.enqueue("media-seek-request", event2);
      try {
        this.seekToLiveEdge();
      } catch (error) {
        this.#request.queue.delete("media-seek-request");
      }
    }
    async ["media-loop-request"](event2) {
      try {
        this.#request.looping = true;
        this.#request.replaying = true;
        await this.play(event2);
      } catch (error) {
        this.#request.looping = false;
      }
    }
    ["media-user-loop-change-request"](event2) {
      this.$state.userPrefersLoop.set(event2.detail);
    }
    async ["media-pause-request"](event2) {
      if (this.$state.paused()) return;
      try {
        await this.pause(event2);
      } catch (error) {
      }
    }
    async ["media-play-request"](event2) {
      if (!this.$state.paused()) return;
      try {
        await this.play(event2);
      } catch (e6) {
      }
    }
    ["media-rate-change-request"](event2) {
      const { playbackRate, canSetPlaybackRate } = this.$state;
      if (playbackRate() === event2.detail || !canSetPlaybackRate()) return;
      const provider = this.#$provider();
      if (!provider?.setPlaybackRate) return;
      this.#request.queue.enqueue("media-rate-change-request", event2);
      provider.setPlaybackRate(event2.detail);
    }
    ["media-audio-gain-change-request"](event2) {
      try {
        this.setAudioGain(event2.detail, event2);
      } catch (e6) {
      }
    }
    ["media-quality-change-request"](event2) {
      const { qualities, storage, logger } = this.#media;
      if (qualities.readonly) {
        return;
      }
      this.#request.queue.enqueue("media-quality-change-request", event2);
      const index = event2.detail;
      if (index < 0) {
        qualities.autoSelect(event2);
        if (event2.isOriginTrusted) storage?.setVideoQuality?.(null);
      } else {
        const quality = qualities[index];
        if (quality) {
          quality.selected = true;
          if (event2.isOriginTrusted) {
            storage?.setVideoQuality?.({
              id: quality.id,
              width: quality.width,
              height: quality.height,
              bitrate: quality.bitrate
            });
          }
        }
      }
    }
    ["media-pause-controls-request"](event2) {
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.controls.pause(event2);
    }
    ["media-resume-controls-request"](event2) {
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.controls.resume(event2);
    }
    ["media-seek-request"](event2) {
      const { canSeek, ended, live, seekableEnd, userBehindLiveEdge } = this.$state, seekTime = event2.detail;
      if (ended()) this.#request.replaying = true;
      const key2 = event2.type;
      this.#request.seeking = false;
      this.#request.queue.delete(key2);
      const boundedTime = boundTime(seekTime, this.$state);
      if (!Number.isFinite(boundedTime) || !canSeek()) return;
      this.#request.queue.enqueue(key2, event2);
      this.#$provider().setCurrentTime(boundedTime);
      if (live() && event2.isOriginTrusted && Math.abs(seekableEnd() - boundedTime) >= 2) {
        userBehindLiveEdge.set(true);
      }
    }
    ["media-seeking-request"](event2) {
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.$state.seeking.set(true);
      this.#request.seeking = true;
    }
    ["media-start-loading"](event2) {
      if (this.$state.canLoad()) return;
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.#stateMgr.handle(this.createEvent("can-load"));
    }
    ["media-poster-start-loading"](event2) {
      if (this.$state.canLoadPoster()) return;
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.#stateMgr.handle(this.createEvent("can-load-poster"));
    }
    ["media-text-track-change-request"](event2) {
      const { index, mode } = event2.detail, track = this.#media.textTracks[index];
      if (track) {
        const key2 = event2.type;
        this.#request.queue.enqueue(key2, event2);
        track.setMode(mode, event2);
      }
    }
    ["media-mute-request"](event2) {
      if (this.$state.muted()) return;
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.#$provider().setMuted(true);
    }
    ["media-unmute-request"](event2) {
      const { muted, volume } = this.$state;
      if (!muted()) return;
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.#media.$provider().setMuted(false);
      if (volume() === 0) {
        this.#request.queue.enqueue(key2, event2);
        this.#$provider().setVolume(0.25);
      }
    }
    ["media-volume-change-request"](event2) {
      const { muted, volume } = this.$state;
      const newVolume = event2.detail;
      if (volume() === newVolume) return;
      const key2 = event2.type;
      this.#request.queue.enqueue(key2, event2);
      this.#$provider().setVolume(newVolume);
      if (newVolume > 0 && muted()) {
        this.#request.queue.enqueue(key2, event2);
        this.#$provider().setMuted(false);
      }
    }
    #logError(title, error, request) {
      return;
    }
  };
  function throwIfNotReadyForPlayback(provider, canPlay) {
    if (provider && canPlay) return;
    throw Error(
      "[vidstack] media not ready"
    );
  }
  function throwIfFullscreenNotSupported(target, fullscreen) {
    if (fullscreen?.supported) return;
    throw Error(
      "[vidstack] no fullscreen support"
    );
  }
  var MediaRequestContext = class {
    seeking = false;
    looping = false;
    replaying = false;
    queue = new Queue();
  };
  var TRACKED_EVENT = /* @__PURE__ */ new Set([
    "auto-play",
    "auto-play-fail",
    "can-load",
    "sources-change",
    "source-change",
    "load-start",
    "abort",
    "error",
    "loaded-metadata",
    "loaded-data",
    "can-play",
    "play",
    "play-fail",
    "pause",
    "playing",
    "seeking",
    "seeked",
    "waiting"
  ]);
  var MediaStateManager = class extends MediaPlayerController {
    #request;
    #media;
    #trackedEvents = /* @__PURE__ */ new Map();
    #clipEnded = false;
    #playedIntervals = [];
    #playedInterval = [-1, -1];
    #firingWaiting = false;
    #waitingTrigger;
    constructor(request, media) {
      super();
      this.#request = request;
      this.#media = media;
    }
    onAttach(el) {
      el.setAttribute("aria-busy", "true");
      new EventsController(this).add("fullscreen-change", this["fullscreen-change"].bind(this)).add("fullscreen-error", this["fullscreen-error"].bind(this)).add("orientation-change", this["orientation-change"].bind(this));
    }
    onConnect(el) {
      effect(this.#watchCanSetVolume.bind(this));
      this.#addTextTrackListeners();
      this.#addQualityListeners();
      this.#addAudioTrackListeners();
      this.#resumePlaybackOnConnect();
      onDispose(this.#pausePlaybackOnDisconnect.bind(this));
    }
    onDestroy() {
      const { audioTracks, qualities, textTracks } = this.#media;
      audioTracks[ListSymbol.reset]();
      qualities[ListSymbol.reset]();
      textTracks[ListSymbol.reset]();
      this.#stopWatchingQualityResize();
    }
    handle(event2) {
      if (!this.scope) return;
      const type = event2.type;
      untrack(() => this[event2.type]?.(event2));
      {
        if (TRACKED_EVENT.has(type)) this.#trackedEvents.set(type, event2);
        this.dispatch(event2);
      }
    }
    #isPlayingOnDisconnect = false;
    #resumePlaybackOnConnect() {
      if (!this.#isPlayingOnDisconnect) return;
      requestAnimationFrame(() => {
        if (!this.scope) return;
        this.#media.remote.play(new DOMEvent("dom-connect"));
      });
      this.#isPlayingOnDisconnect = false;
    }
    #pausePlaybackOnDisconnect() {
      if (this.#isPlayingOnDisconnect) return;
      this.#isPlayingOnDisconnect = !this.$state.paused();
      this.#media.$provider()?.pause();
    }
    #resetTracking() {
      this.#stopWaiting();
      this.#clipEnded = false;
      this.#request.replaying = false;
      this.#request.looping = false;
      this.#firingWaiting = false;
      this.#waitingTrigger = void 0;
      this.#trackedEvents.clear();
    }
    #satisfyRequest(request, event2) {
      const requestEvent = this.#request.queue.serve(request);
      if (!requestEvent) return;
      event2.request = requestEvent;
      event2.triggers.add(requestEvent);
    }
    #addTextTrackListeners() {
      this.#onTextTracksChange();
      this.#onTextTrackModeChange();
      const textTracks = this.#media.textTracks;
      new EventsController(textTracks).add("add", this.#onTextTracksChange.bind(this)).add("remove", this.#onTextTracksChange.bind(this)).add("mode-change", this.#onTextTrackModeChange.bind(this));
    }
    #addQualityListeners() {
      const qualities = this.#media.qualities;
      new EventsController(qualities).add("add", this.#onQualitiesChange.bind(this)).add("remove", this.#onQualitiesChange.bind(this)).add("change", this.#onQualityChange.bind(this)).add("auto-change", this.#onAutoQualityChange.bind(this)).add("readonly-change", this.#onCanSetQualityChange.bind(this));
    }
    #addAudioTrackListeners() {
      const audioTracks = this.#media.audioTracks;
      new EventsController(audioTracks).add("add", this.#onAudioTracksChange.bind(this)).add("remove", this.#onAudioTracksChange.bind(this)).add("change", this.#onAudioTrackChange.bind(this));
    }
    #onTextTracksChange(event2) {
      const { textTracks } = this.$state;
      textTracks.set(this.#media.textTracks.toArray());
      this.dispatch("text-tracks-change", {
        detail: textTracks(),
        trigger: event2
      });
    }
    #onTextTrackModeChange(event2) {
      if (event2) this.#satisfyRequest("media-text-track-change-request", event2);
      const current = this.#media.textTracks.selected, { textTrack } = this.$state;
      if (textTrack() !== current) {
        textTrack.set(current);
        this.dispatch("text-track-change", {
          detail: current,
          trigger: event2
        });
      }
    }
    #onAudioTracksChange(event2) {
      const { audioTracks } = this.$state;
      audioTracks.set(this.#media.audioTracks.toArray());
      this.dispatch("audio-tracks-change", {
        detail: audioTracks(),
        trigger: event2
      });
    }
    #onAudioTrackChange(event2) {
      const { audioTrack } = this.$state;
      audioTrack.set(this.#media.audioTracks.selected);
      if (event2) this.#satisfyRequest("media-audio-track-change-request", event2);
      this.dispatch("audio-track-change", {
        detail: audioTrack(),
        trigger: event2
      });
    }
    #onQualitiesChange(event2) {
      const { qualities } = this.$state;
      qualities.set(this.#media.qualities.toArray());
      this.dispatch("qualities-change", {
        detail: qualities(),
        trigger: event2
      });
    }
    #onQualityChange(event2) {
      const { quality } = this.$state;
      quality.set(this.#media.qualities.selected);
      if (event2) this.#satisfyRequest("media-quality-change-request", event2);
      this.dispatch("quality-change", {
        detail: quality(),
        trigger: event2
      });
    }
    #onAutoQualityChange() {
      const { qualities } = this.#media, isAuto = qualities.auto;
      this.$state.autoQuality.set(isAuto);
      if (!isAuto) this.#stopWatchingQualityResize();
    }
    #stopQualityResizeEffect = null;
    #watchQualityResize() {
      this.#stopWatchingQualityResize();
      this.#stopQualityResizeEffect = effect(() => {
        const { qualities } = this.#media, { mediaWidth, mediaHeight } = this.$state, w2 = mediaWidth(), h4 = mediaHeight();
        if (w2 === 0 || h4 === 0) return;
        let selectedQuality = null, minScore = Infinity;
        for (const quality of qualities) {
          const score = Math.abs(quality.width - w2) + Math.abs(quality.height - h4);
          if (score < minScore) {
            minScore = score;
            selectedQuality = quality;
          }
        }
        if (selectedQuality) {
          qualities[ListSymbol.select](
            selectedQuality,
            true,
            new DOMEvent("resize", { detail: { width: w2, height: h4 } })
          );
        }
      });
    }
    #stopWatchingQualityResize() {
      this.#stopQualityResizeEffect?.();
      this.#stopQualityResizeEffect = null;
    }
    #onCanSetQualityChange() {
      this.$state.canSetQuality.set(!this.#media.qualities.readonly);
    }
    #watchCanSetVolume() {
      const { canSetVolume, isGoogleCastConnected } = this.$state;
      if (isGoogleCastConnected()) {
        canSetVolume.set(false);
        return;
      }
      canChangeVolume().then(canSetVolume.set);
    }
    ["provider-change"](event2) {
      const prevProvider = this.#media.$provider(), newProvider = event2.detail;
      if (prevProvider?.type === newProvider?.type) return;
      prevProvider?.destroy?.();
      prevProvider?.scope?.dispose();
      this.#media.$provider.set(event2.detail);
      if (prevProvider && event2.detail === null) {
        this.#resetMediaState(event2);
      }
    }
    ["provider-loader-change"](event2) {
    }
    ["auto-play"](event2) {
      this.$state.autoPlayError.set(null);
    }
    ["auto-play-fail"](event2) {
      this.$state.autoPlayError.set(event2.detail);
      this.#resetTracking();
    }
    ["can-load"](event2) {
      this.$state.canLoad.set(true);
      this.#trackedEvents.set("can-load", event2);
      this.#media.textTracks[TextTrackSymbol.canLoad]();
      this.#satisfyRequest("media-start-loading", event2);
    }
    ["can-load-poster"](event2) {
      this.$state.canLoadPoster.set(true);
      this.#trackedEvents.set("can-load-poster", event2);
      this.#satisfyRequest("media-poster-start-loading", event2);
    }
    ["media-type-change"](event2) {
      const sourceChangeEvent = this.#trackedEvents.get("source-change");
      if (sourceChangeEvent) event2.triggers.add(sourceChangeEvent);
      const viewType = this.$state.viewType();
      this.$state.mediaType.set(event2.detail);
      const providedViewType = this.$state.providedViewType(), currentViewType = providedViewType === "unknown" ? event2.detail : providedViewType;
      if (viewType !== currentViewType) {
        {
          setTimeout(() => {
            requestAnimationFrame(() => {
              if (!this.scope) return;
              this.$state.inferredViewType.set(event2.detail);
              this.dispatch("view-type-change", {
                detail: currentViewType,
                trigger: event2
              });
            });
          }, 0);
        }
      }
    }
    ["stream-type-change"](event2) {
      const sourceChangeEvent = this.#trackedEvents.get("source-change");
      if (sourceChangeEvent) event2.triggers.add(sourceChangeEvent);
      const { streamType, inferredStreamType } = this.$state;
      inferredStreamType.set(event2.detail);
      event2.detail = streamType();
    }
    ["rate-change"](event2) {
      const { storage } = this.#media, { canPlay } = this.$state;
      this.$state.playbackRate.set(event2.detail);
      this.#satisfyRequest("media-rate-change-request", event2);
      if (canPlay()) {
        storage?.setPlaybackRate?.(event2.detail);
      }
    }
    ["remote-playback-change"](event2) {
      const { remotePlaybackState, remotePlaybackType } = this.$state, { type, state } = event2.detail, isConnected = state === "connected";
      remotePlaybackType.set(type);
      remotePlaybackState.set(state);
      const key2 = type === "airplay" ? "media-airplay-request" : "media-google-cast-request";
      if (isConnected) {
        this.#satisfyRequest(key2, event2);
      } else {
        const requestEvent = this.#request.queue.peek(key2);
        if (requestEvent) {
          event2.request = requestEvent;
          event2.triggers.add(requestEvent);
        }
      }
    }
    ["sources-change"](event2) {
      const prevSources = this.$state.sources(), newSources = event2.detail;
      this.$state.sources.set(newSources);
      this.#onSourceQualitiesChange(prevSources, newSources, event2);
    }
    #onSourceQualitiesChange(prevSources, newSources, trigger) {
      let { qualities } = this.#media, added = false, removed = false;
      for (const prevSrc of prevSources) {
        if (!isVideoQualitySrc(prevSrc)) continue;
        const exists = newSources.some((s4) => s4.src === prevSrc.src);
        if (!exists) {
          const quality = qualities.getBySrc(prevSrc.src);
          if (quality) {
            qualities[ListSymbol.remove](quality, trigger);
            removed = true;
          }
        }
      }
      if (removed && !qualities.length) {
        this.$state.savedState.set(null);
        qualities[ListSymbol.reset](trigger);
      }
      for (const src of newSources) {
        if (!isVideoQualitySrc(src) || qualities.getBySrc(src.src)) continue;
        const quality = {
          id: src.id ?? src.height + "p",
          bitrate: null,
          codec: null,
          ...src,
          selected: false
        };
        qualities[ListSymbol.add](quality, trigger);
        added = true;
      }
      if (added && !qualities[QualitySymbol.enableAuto]) {
        this.#watchQualityResize();
        qualities[QualitySymbol.enableAuto] = this.#watchQualityResize.bind(this);
        qualities[QualitySymbol.setAuto](true, trigger);
      }
    }
    ["source-change"](event2) {
      event2.isQualityChange = event2.originEvent?.type === "quality-change";
      const source = event2.detail;
      this.#resetMediaState(event2, event2.isQualityChange);
      this.#trackedEvents.set(event2.type, event2);
      this.$state.source.set(source);
      this.el?.setAttribute("aria-busy", "true");
    }
    #resetMediaState(event2, isSourceQualityChange = false) {
      const { audioTracks, qualities } = this.#media;
      if (!isSourceQualityChange) {
        this.#playedIntervals = [];
        this.#playedInterval = [-1, -1];
        audioTracks[ListSymbol.reset](event2);
        qualities[ListSymbol.reset](event2);
        softResetMediaState(this.$state, isSourceQualityChange);
        this.#resetTracking();
        return;
      }
      softResetMediaState(this.$state, isSourceQualityChange);
      this.#resetTracking();
    }
    ["abort"](event2) {
      const sourceChangeEvent = this.#trackedEvents.get("source-change");
      if (sourceChangeEvent) event2.triggers.add(sourceChangeEvent);
      const canLoadEvent = this.#trackedEvents.get("can-load");
      if (canLoadEvent && !event2.triggers.hasType("can-load")) {
        event2.triggers.add(canLoadEvent);
      }
    }
    ["load-start"](event2) {
      const sourceChangeEvent = this.#trackedEvents.get("source-change");
      if (sourceChangeEvent) event2.triggers.add(sourceChangeEvent);
    }
    ["error"](event2) {
      this.$state.error.set(event2.detail);
      const abortEvent = this.#trackedEvents.get("abort");
      if (abortEvent) event2.triggers.add(abortEvent);
    }
    ["loaded-metadata"](event2) {
      const loadStartEvent = this.#trackedEvents.get("load-start");
      if (loadStartEvent) event2.triggers.add(loadStartEvent);
    }
    ["loaded-data"](event2) {
      const loadStartEvent = this.#trackedEvents.get("load-start");
      if (loadStartEvent) event2.triggers.add(loadStartEvent);
    }
    ["can-play"](event2) {
      const loadedMetadata = this.#trackedEvents.get("loaded-metadata");
      if (loadedMetadata) event2.triggers.add(loadedMetadata);
      this.#onCanPlayDetail(event2.detail);
      this.el?.setAttribute("aria-busy", "false");
    }
    ["can-play-through"](event2) {
      this.#onCanPlayDetail(event2.detail);
      const canPlay = this.#trackedEvents.get("can-play");
      if (canPlay) event2.triggers.add(canPlay);
    }
    #onCanPlayDetail(detail) {
      const { seekable, buffered, intrinsicDuration, canPlay } = this.$state;
      canPlay.set(true);
      buffered.set(detail.buffered);
      seekable.set(detail.seekable);
      const seekableEnd = getTimeRangesEnd(detail.seekable) ?? Infinity;
      intrinsicDuration.set(seekableEnd);
    }
    ["duration-change"](event2) {
      const { live, intrinsicDuration, providedDuration, clipEndTime, ended } = this.$state, time = event2.detail;
      if (!live()) {
        const duration = !Number.isNaN(time) ? time : 0;
        intrinsicDuration.set(duration);
        if (ended()) this.#onEndPrecisionChange(event2);
      }
      if (providedDuration() > 0 || clipEndTime() > 0) {
        event2.stopImmediatePropagation();
      }
    }
    ["progress"](event2) {
      const { buffered, seekable } = this.$state, { buffered: newBuffered, seekable: newSeekable } = event2.detail, newBufferedEnd = getTimeRangesEnd(newBuffered), hasBufferedLengthChanged = newBuffered.length !== buffered().length, hasBufferedEndChanged = newBufferedEnd !== getTimeRangesEnd(buffered()), newSeekableEnd = getTimeRangesEnd(newSeekable), hasSeekableLengthChanged = newSeekable.length !== seekable().length, hasSeekableEndChanged = newSeekableEnd !== getTimeRangesEnd(seekable());
      if (hasBufferedLengthChanged || hasBufferedEndChanged) {
        buffered.set(newBuffered);
      }
      if (hasSeekableLengthChanged || hasSeekableEndChanged) {
        seekable.set(newSeekable);
      }
    }
    ["play"](event2) {
      const {
        paused,
        autoPlayError,
        ended,
        autoPlaying,
        playsInline,
        pointer,
        muted,
        viewType,
        live,
        userBehindLiveEdge
      } = this.$state;
      this.#resetPlaybackIfNeeded();
      if (!paused()) {
        event2.stopImmediatePropagation();
        return;
      }
      event2.autoPlay = autoPlaying();
      const waitingEvent = this.#trackedEvents.get("waiting");
      if (waitingEvent) event2.triggers.add(waitingEvent);
      this.#satisfyRequest("media-play-request", event2);
      this.#trackedEvents.set("play", event2);
      paused.set(false);
      autoPlayError.set(null);
      if (event2.autoPlay) {
        this.handle(
          this.createEvent("auto-play", {
            detail: { muted: muted() },
            trigger: event2
          })
        );
        autoPlaying.set(false);
      }
      if (ended() || this.#request.replaying) {
        this.#request.replaying = false;
        ended.set(false);
        this.handle(this.createEvent("replay", { trigger: event2 }));
      }
      if (!playsInline() && viewType() === "video" && pointer() === "coarse") {
        this.#media.remote.enterFullscreen("prefer-media", event2);
      }
      if (live() && !userBehindLiveEdge()) {
        this.#media.remote.seekToLiveEdge(event2);
      }
    }
    #resetPlaybackIfNeeded(trigger) {
      const provider = peek(this.#media.$provider);
      if (!provider) return;
      const { ended, seekableStart, clipEndTime, currentTime, realCurrentTime, duration } = this.$state;
      const shouldReset = ended() || realCurrentTime() < seekableStart() || clipEndTime() > 0 && realCurrentTime() >= clipEndTime() || Math.abs(currentTime() - duration()) < 0.1;
      if (shouldReset) {
        this.dispatch("media-seek-request", {
          detail: seekableStart(),
          trigger
        });
      }
      return shouldReset;
    }
    ["play-fail"](event2) {
      const { muted, autoPlaying } = this.$state;
      const playEvent = this.#trackedEvents.get("play");
      if (playEvent) event2.triggers.add(playEvent);
      this.#satisfyRequest("media-play-request", event2);
      const { paused, playing } = this.$state;
      paused.set(true);
      playing.set(false);
      this.#resetTracking();
      this.#trackedEvents.set("play-fail", event2);
      if (event2.autoPlay) {
        this.handle(
          this.createEvent("auto-play-fail", {
            detail: {
              muted: muted(),
              error: event2.detail
            },
            trigger: event2
          })
        );
        autoPlaying.set(false);
      }
    }
    ["playing"](event2) {
      const playEvent = this.#trackedEvents.get("play"), seekedEvent = this.#trackedEvents.get("seeked");
      if (playEvent) event2.triggers.add(playEvent);
      else if (seekedEvent) event2.triggers.add(seekedEvent);
      setTimeout(() => this.#resetTracking(), 0);
      const {
        paused,
        playing,
        live,
        liveSyncPosition,
        seekableEnd,
        started,
        currentTime,
        seeking,
        ended
      } = this.$state;
      paused.set(false);
      playing.set(true);
      seeking.set(false);
      ended.set(false);
      if (this.#request.looping) {
        this.#request.looping = false;
        return;
      }
      if (live() && !started() && currentTime() === 0) {
        const end = liveSyncPosition() ?? seekableEnd() - 2;
        if (Number.isFinite(end)) this.#media.$provider().setCurrentTime(end);
      }
      this["started"](event2);
    }
    ["started"](event2) {
      const { started } = this.$state;
      if (!started()) {
        started.set(true);
        this.handle(this.createEvent("started", { trigger: event2 }));
      }
    }
    ["pause"](event2) {
      if (!this.el?.isConnected) {
        this.#isPlayingOnDisconnect = true;
      }
      this.#satisfyRequest("media-pause-request", event2);
      const seekedEvent = this.#trackedEvents.get("seeked");
      if (seekedEvent) event2.triggers.add(seekedEvent);
      const { paused, playing } = this.$state;
      paused.set(true);
      playing.set(false);
      if (this.#clipEnded) {
        setTimeout(() => {
          this.handle(this.createEvent("end", { trigger: event2 }));
          this.#clipEnded = false;
        }, 0);
      }
      this.#resetTracking();
    }
    ["time-change"](event2) {
      if (this.#request.looping) {
        event2.stopImmediatePropagation();
        return;
      }
      let { waiting, played, clipEndTime, realCurrentTime, currentTime } = this.$state, newTime = event2.detail, endTime = clipEndTime();
      realCurrentTime.set(newTime);
      this.#updatePlayed();
      waiting.set(false);
      for (const track of this.#media.textTracks) {
        track[TextTrackSymbol.updateActiveCues](newTime, event2);
      }
      if (endTime > 0 && newTime >= endTime) {
        this.#clipEnded = true;
        this.dispatch("media-pause-request", { trigger: event2 });
      }
      this.#saveTime();
      this.dispatch("time-update", {
        detail: { currentTime: currentTime(), played: played() },
        trigger: event2
      });
    }
    #updatePlayed() {
      const { currentTime, played, paused } = this.$state;
      if (paused()) return;
      this.#playedInterval = updateTimeIntervals(
        this.#playedIntervals,
        this.#playedInterval,
        currentTime()
      );
      played.set(new TimeRange(this.#playedIntervals));
    }
    // Called to update time again incase duration precision has changed.
    #onEndPrecisionChange(trigger) {
      const { clipStartTime, clipEndTime, duration } = this.$state, isClipped = clipStartTime() > 0 || clipEndTime() > 0;
      if (isClipped) return;
      this.handle(
        this.createEvent("time-change", {
          detail: duration(),
          trigger
        })
      );
    }
    #saveTime() {
      const { storage } = this.#media, { canPlay, realCurrentTime } = this.$state;
      if (canPlay()) {
        storage?.setTime?.(realCurrentTime());
      }
    }
    ["audio-gain-change"](event2) {
      const { storage } = this.#media, { canPlay, audioGain } = this.$state;
      audioGain.set(event2.detail);
      this.#satisfyRequest("media-audio-gain-change-request", event2);
      if (canPlay()) storage?.setAudioGain?.(audioGain());
    }
    ["volume-change"](event2) {
      const { storage } = this.#media, { volume, muted, canPlay } = this.$state, detail = event2.detail;
      volume.set(detail.volume);
      muted.set(detail.muted || detail.volume === 0);
      this.#satisfyRequest("media-volume-change-request", event2);
      this.#satisfyRequest(detail.muted ? "media-mute-request" : "media-unmute-request", event2);
      if (canPlay()) {
        storage?.setVolume?.(volume());
        storage?.setMuted?.(muted());
      }
    }
    ["seeking"] = functionThrottle(
      (event2) => {
        const { seeking, realCurrentTime, paused } = this.$state;
        seeking.set(true);
        realCurrentTime.set(event2.detail);
        this.#satisfyRequest("media-seeking-request", event2);
        if (paused()) {
          this.#waitingTrigger = event2;
          this.#fireWaiting();
        }
        this.#playedInterval = [-1, -1];
      },
      150,
      { leading: true }
    );
    ["seeked"](event2) {
      const { seeking, currentTime, realCurrentTime, paused, seekableEnd, ended, live } = this.$state;
      if (this.#request.seeking) {
        seeking.set(true);
        event2.stopImmediatePropagation();
      } else if (seeking()) {
        const waitingEvent = this.#trackedEvents.get("waiting");
        if (waitingEvent) event2.triggers.add(waitingEvent);
        const seekingEvent = this.#trackedEvents.get("seeking");
        if (seekingEvent && !event2.triggers.has(seekingEvent)) {
          event2.triggers.add(seekingEvent);
        }
        if (paused()) this.#stopWaiting();
        seeking.set(false);
        realCurrentTime.set(event2.detail);
        this.#satisfyRequest("media-seek-request", event2);
        const origin = event2?.originEvent;
        if (origin?.isTrusted && !(origin instanceof MessageEvent) && !/seek/.test(origin.type)) {
          this["started"](event2);
        }
      }
      if (!live()) {
        if (Math.floor(currentTime()) !== Math.floor(seekableEnd())) {
          ended.set(false);
        } else {
          this.end(event2);
        }
      }
    }
    ["waiting"](event2) {
      if (this.#firingWaiting || this.#request.seeking) return;
      event2.stopImmediatePropagation();
      this.#waitingTrigger = event2;
      this.#fireWaiting();
    }
    #fireWaiting = functionDebounce(() => {
      if (!this.#waitingTrigger) return;
      this.#firingWaiting = true;
      const { waiting, playing } = this.$state;
      waiting.set(true);
      playing.set(false);
      const event2 = this.createEvent("waiting", { trigger: this.#waitingTrigger });
      this.#trackedEvents.set("waiting", event2);
      this.dispatch(event2);
      this.#waitingTrigger = void 0;
      this.#firingWaiting = false;
    }, 300);
    ["end"](event2) {
      const { loop, ended } = this.$state;
      if (!loop() && ended()) return;
      if (loop()) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            this.#resetPlaybackIfNeeded(event2);
            this.dispatch("media-loop-request", { trigger: event2 });
          });
        }, 10);
        return;
      }
      setTimeout(() => this.#onEnded(event2), 0);
    }
    #onEnded(event2) {
      const { storage } = this.#media, { paused, seeking, ended, duration } = this.$state;
      this.#onEndPrecisionChange(event2);
      if (!paused()) {
        this.dispatch("pause", { trigger: event2 });
      }
      if (seeking()) {
        this.dispatch("seeked", {
          detail: duration(),
          trigger: event2
        });
      }
      ended.set(true);
      this.#resetTracking();
      storage?.setTime?.(duration(), true);
      this.dispatch("ended", {
        trigger: event2
      });
    }
    #stopWaiting() {
      this.#fireWaiting.cancel();
      this.$state.waiting.set(false);
    }
    ["fullscreen-change"](event2) {
      const isFullscreen2 = event2.detail;
      this.$state.fullscreen.set(isFullscreen2);
      this.#satisfyRequest(
        isFullscreen2 ? "media-enter-fullscreen-request" : "media-exit-fullscreen-request",
        event2
      );
    }
    ["fullscreen-error"](event2) {
      this.#satisfyRequest("media-enter-fullscreen-request", event2);
      this.#satisfyRequest("media-exit-fullscreen-request", event2);
    }
    ["orientation-change"](event2) {
      const isLocked = event2.detail.lock;
      this.#satisfyRequest(
        isLocked ? "media-orientation-lock-request" : "media-orientation-unlock-request",
        event2
      );
    }
    ["picture-in-picture-change"](event2) {
      const isPiP = event2.detail;
      this.$state.pictureInPicture.set(isPiP);
      this.#satisfyRequest(isPiP ? "media-enter-pip-request" : "media-exit-pip-request", event2);
    }
    ["picture-in-picture-error"](event2) {
      this.#satisfyRequest("media-enter-pip-request", event2);
      this.#satisfyRequest("media-exit-pip-request", event2);
    }
    ["title-change"](event2) {
      if (!event2.trigger) return;
      event2.stopImmediatePropagation();
      this.$state.inferredTitle.set(event2.detail);
    }
    ["poster-change"](event2) {
      if (!event2.trigger) return;
      event2.stopImmediatePropagation();
      this.$state.inferredPoster.set(event2.detail);
    }
  };
  var MediaStateSync = class extends MediaPlayerController {
    onSetup() {
      this.#init();
      const effects2 = [
        this.#watchMetadata,
        this.#watchAutoplay,
        this.#watchClipStartTime,
        this.#watchClipEndTime,
        this.#watchControls,
        this.#watchCrossOrigin,
        this.#watchDuration,
        this.#watchLive,
        this.#watchLiveEdge,
        this.#watchLiveTolerance,
        this.#watchLoop,
        this.#watchPlaysInline,
        this.#watchPoster,
        this.#watchProvidedTypes,
        this.#watchTitle
      ];
      for (const callback of effects2) {
        effect(callback.bind(this));
      }
    }
    #init() {
      const providedProps = {
        duration: "providedDuration",
        loop: "providedLoop",
        poster: "providedPoster",
        streamType: "providedStreamType",
        title: "providedTitle",
        viewType: "providedViewType"
      };
      const skip = /* @__PURE__ */ new Set([
        "currentTime",
        "paused",
        "playbackRate",
        "volume"
      ]);
      for (const prop2 of Object.keys(this.$props)) {
        if (skip.has(prop2)) continue;
        this.$state[providedProps[prop2] ?? prop2]?.set(this.$props[prop2]());
      }
      this.$state.muted.set(this.$props.muted() || this.$props.volume() === 0);
    }
    // Sync "provided" props with internal state. Provided props are used to differentiate from
    // provider inferred values.
    #watchProvidedTypes() {
      const { viewType, streamType, title, poster, loop } = this.$props, $state = this.$state;
      $state.providedPoster.set(poster());
      $state.providedStreamType.set(streamType());
      $state.providedViewType.set(viewType());
      $state.providedTitle.set(title());
      $state.providedLoop.set(loop());
    }
    #watchLogLevel() {
      return;
    }
    #watchMetadata() {
      const { artist, artwork } = this.$props;
      this.$state.artist.set(artist());
      this.$state.artwork.set(artwork());
    }
    #watchTitle() {
      const { title } = this.$state;
      this.dispatch("title-change", { detail: title() });
    }
    #watchAutoplay() {
      const autoPlay = this.$props.autoPlay() || this.$props.autoplay();
      this.$state.autoPlay.set(autoPlay);
      this.dispatch("auto-play-change", { detail: autoPlay });
    }
    #watchLoop() {
      const loop = this.$state.loop();
      this.dispatch("loop-change", { detail: loop });
    }
    #watchControls() {
      const controls = this.$props.controls();
      this.$state.controls.set(controls);
    }
    #watchPoster() {
      const { poster } = this.$state;
      this.dispatch("poster-change", { detail: poster() });
    }
    #watchCrossOrigin() {
      const crossOrigin = this.$props.crossOrigin() ?? this.$props.crossorigin(), value = crossOrigin === true ? "" : crossOrigin;
      this.$state.crossOrigin.set(value);
    }
    #watchDuration() {
      const { duration } = this.$props;
      this.dispatch("media-duration-change-request", {
        detail: duration()
      });
    }
    #watchPlaysInline() {
      const inline2 = this.$props.playsInline() || this.$props.playsinline();
      this.$state.playsInline.set(inline2);
      this.dispatch("plays-inline-change", { detail: inline2 });
    }
    #watchClipStartTime() {
      const { clipStartTime } = this.$props;
      this.dispatch("media-clip-start-change-request", {
        detail: clipStartTime()
      });
    }
    #watchClipEndTime() {
      const { clipEndTime } = this.$props;
      this.dispatch("media-clip-end-change-request", {
        detail: clipEndTime()
      });
    }
    #watchLive() {
      this.dispatch("live-change", { detail: this.$state.live() });
    }
    #watchLiveTolerance() {
      this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
      this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
    }
    #watchLiveEdge() {
      this.dispatch("live-edge-change", { detail: this.$state.liveEdge() });
    }
  };
  var actions = ["play", "pause", "seekforward", "seekbackward", "seekto"];
  var NavigatorMediaSession = class extends MediaPlayerController {
    onConnect() {
      effect(this.#onMetadataChange.bind(this));
      effect(this.#onPlaybackStateChange.bind(this));
      const handleAction = this.#handleAction.bind(this);
      for (const action of actions) {
        navigator.mediaSession.setActionHandler(action, handleAction);
      }
      onDispose(this.#onDisconnect.bind(this));
    }
    #onDisconnect() {
      for (const action of actions) {
        navigator.mediaSession.setActionHandler(action, null);
      }
    }
    #onMetadataChange() {
      const { title, artist, artwork, poster } = this.$state;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title(),
        artist: artist(),
        artwork: artwork() ?? [{ src: poster() }]
      });
    }
    #onPlaybackStateChange() {
      const { canPlay, paused } = this.$state;
      navigator.mediaSession.playbackState = !canPlay() ? "none" : paused() ? "paused" : "playing";
    }
    #handleAction(details) {
      const trigger = new DOMEvent(`media-session-action`, { detail: details });
      switch (details.action) {
        case "play":
          this.dispatch("media-play-request", { trigger });
          break;
        case "pause":
          this.dispatch("media-pause-request", { trigger });
          break;
        case "seekto":
        case "seekforward":
        case "seekbackward":
          this.dispatch("media-seek-request", {
            detail: isNumber(details.seekTime) ? details.seekTime : this.$state.currentTime() + (details.seekOffset ?? (details.action === "seekforward" ? 10 : -10)),
            trigger
          });
          break;
      }
    }
  };
  var MediaPlayer = class _MediaPlayer extends Component {
    static props = mediaPlayerProps;
    static state = mediaState;
    #media;
    #stateMgr;
    #requestMgr;
    canPlayQueue = new RequestQueue();
    remoteControl;
    get #provider() {
      return this.#media.$provider();
    }
    get #props() {
      return this.$props;
    }
    constructor() {
      super();
      new MediaStateSync();
      const context = {
        player: this,
        qualities: new VideoQualityList(),
        audioTracks: new AudioTrackList(),
        storage: null,
        $provider: signal(null),
        $providerSetup: signal(false),
        $props: this.$props,
        $state: this.$state
      };
      context.remote = this.remoteControl = new MediaRemoteControl(
        void 0
      );
      context.remote.setPlayer(this);
      context.textTracks = new TextTrackList();
      context.textTracks[TextTrackSymbol.crossOrigin] = this.$state.crossOrigin;
      context.textRenderers = new TextRenderers(context);
      context.ariaKeys = {};
      this.#media = context;
      provideContext(mediaContext, context);
      this.orientation = new ScreenOrientationController();
      new FocusVisibleController();
      new MediaKeyboardController(context);
      const request = new MediaRequestContext();
      this.#stateMgr = new MediaStateManager(request, context);
      this.#requestMgr = new MediaRequestManager(this.#stateMgr, request, context);
      context.delegate = new MediaPlayerDelegate(this.#stateMgr.handle.bind(this.#stateMgr), context);
      context.notify = context.delegate.notify.bind(context.delegate);
      if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
        new NavigatorMediaSession();
      }
      new MediaLoadController("load", this.startLoading.bind(this));
      new MediaLoadController("posterLoad", this.startLoadingPoster.bind(this));
    }
    onSetup() {
      this.#setupMediaAttributes();
      effect(this.#watchCanPlay.bind(this));
      effect(this.#watchMuted.bind(this));
      effect(this.#watchPaused.bind(this));
      effect(this.#watchVolume.bind(this));
      effect(this.#watchCurrentTime.bind(this));
      effect(this.#watchPlaysInline.bind(this));
      effect(this.#watchPlaybackRate.bind(this));
    }
    onAttach(el) {
      el.setAttribute("data-media-player", "");
      setAttributeIfEmpty(el, "tabindex", "0");
      setAttributeIfEmpty(el, "role", "region");
      effect(this.#watchStorage.bind(this));
      effect(this.#watchTitle.bind(this));
      effect(this.#watchOrientation.bind(this));
      listenEvent(el, "find-media-player", this.#onFindPlayer.bind(this));
    }
    onConnect(el) {
      if (IS_IPHONE) setAttribute(el, "data-iphone", "");
      const pointerQuery = window.matchMedia("(pointer: coarse)");
      this.#onPointerChange(pointerQuery);
      pointerQuery.onchange = this.#onPointerChange.bind(this);
      const resize = new ResizeObserver(animationFrameThrottle(this.#onResize.bind(this)));
      resize.observe(el);
      effect(this.#onResize.bind(this));
      this.dispatch("media-player-connect", {
        detail: this,
        bubbles: true,
        composed: true
      });
      onDispose(() => {
        resize.disconnect();
        pointerQuery.onchange = null;
      });
    }
    onDestroy() {
      this.#media.player = null;
      this.canPlayQueue.reset();
    }
    #skipTitleUpdate = false;
    #watchTitle() {
      const el = this.$el, { title, live, viewType, providedTitle } = this.$state, isLive = live(), type = uppercaseFirstChar(viewType()), typeText = type !== "Unknown" ? `${isLive ? "Live " : ""}${type}` : isLive ? "Live" : "Media", currentTitle = title();
      setAttribute(
        this.el,
        "aria-label",
        `${typeText} Player` + (currentTitle ? ` - ${currentTitle}` : "")
      );
      if (el?.hasAttribute("title")) {
        this.#skipTitleUpdate = true;
        el?.removeAttribute("title");
      }
    }
    #watchOrientation() {
      const orientation = this.orientation.landscape ? "landscape" : "portrait";
      this.$state.orientation.set(orientation);
      setAttribute(this.el, "data-orientation", orientation);
      this.#onResize();
    }
    #watchCanPlay() {
      if (this.$state.canPlay() && this.#provider) this.canPlayQueue.start();
      else this.canPlayQueue.stop();
    }
    #setupMediaAttributes() {
      if (_MediaPlayer[MEDIA_ATTRIBUTES]) {
        this.setAttributes(_MediaPlayer[MEDIA_ATTRIBUTES]);
        return;
      }
      const $attrs = {
        "data-load": function() {
          return this.$props.load();
        },
        "data-captions": function() {
          const track = this.$state.textTrack();
          return !!track && isTrackCaptionKind(track);
        },
        "data-ios-controls": function() {
          return this.$state.iOSControls();
        },
        "data-controls": function() {
          return this.controls.showing;
        },
        "data-buffering": function() {
          const { canLoad, canPlay, waiting } = this.$state;
          return canLoad() && (!canPlay() || waiting());
        },
        "data-error": function() {
          const { error } = this.$state;
          return !!error();
        },
        "data-autoplay-error": function() {
          const { autoPlayError } = this.$state;
          return !!autoPlayError();
        }
      };
      const alias = {
        autoPlay: "autoplay",
        canAirPlay: "can-airplay",
        canPictureInPicture: "can-pip",
        pictureInPicture: "pip",
        playsInline: "playsinline",
        remotePlaybackState: "remote-state",
        remotePlaybackType: "remote-type",
        isAirPlayConnected: "airplay",
        isGoogleCastConnected: "google-cast"
      };
      for (const prop2 of mediaAttributes) {
        const attrName = "data-" + (alias[prop2] ?? camelToKebabCase(prop2));
        $attrs[attrName] = function() {
          return this.$state[prop2]();
        };
      }
      delete $attrs.title;
      _MediaPlayer[MEDIA_ATTRIBUTES] = $attrs;
      this.setAttributes($attrs);
    }
    #onFindPlayer(event2) {
      event2.detail(this);
    }
    #onResize() {
      if (!this.el) return;
      const width = this.el.clientWidth, height = this.el.clientHeight;
      this.$state.width.set(width);
      this.$state.height.set(height);
      setStyle(this.el, "--player-width", width + "px");
      setStyle(this.el, "--player-height", height + "px");
    }
    #onPointerChange(queryList) {
      const pointer = queryList.matches ? "coarse" : "fine";
      setAttribute(this.el, "data-pointer", pointer);
      this.$state.pointer.set(pointer);
      this.#onResize();
    }
    /**
     * The current media provider.
     */
    get provider() {
      return this.#provider;
    }
    /**
     * Media controls settings.
     */
    get controls() {
      return this.#requestMgr.controls;
    }
    set controls(controls) {
      this.#props.controls.set(controls);
    }
    /**
     * Controls the screen orientation of the current browser window and dispatches orientation
     * change events on the player.
     */
    orientation;
    /**
     * The title of the current media.
     */
    get title() {
      return peek(this.$state.title);
    }
    set title(newTitle) {
      if (this.#skipTitleUpdate) {
        this.#skipTitleUpdate = false;
        return;
      }
      this.#props.title.set(newTitle);
    }
    /**
     * A list of all `VideoQuality` objects representing the set of available video renditions.
     *
     * @see {@link https://vidstack.io/docs/player/api/video-quality}
     */
    get qualities() {
      return this.#media.qualities;
    }
    /**
     * A list of all `AudioTrack` objects representing the set of available audio tracks.
     *
     * @see {@link https://vidstack.io/docs/player/api/audio-tracks}
     */
    get audioTracks() {
      return this.#media.audioTracks;
    }
    /**
     * A list of all `TextTrack` objects representing the set of available text tracks.
     *
     * @see {@link https://vidstack.io/docs/player/api/text-tracks}
     */
    get textTracks() {
      return this.#media.textTracks;
    }
    /**
     * Contains text renderers which are responsible for loading, parsing, and rendering text
     * tracks.
     */
    get textRenderers() {
      return this.#media.textRenderers;
    }
    get duration() {
      return this.$state.duration();
    }
    set duration(duration) {
      this.#props.duration.set(duration);
    }
    get paused() {
      return peek(this.$state.paused);
    }
    set paused(paused) {
      this.#queuePausedUpdate(paused);
    }
    #watchPaused() {
      this.#queuePausedUpdate(this.$props.paused());
    }
    #queuePausedUpdate(paused) {
      if (paused) {
        this.canPlayQueue.enqueue("paused", () => this.#requestMgr.pause());
      } else this.canPlayQueue.enqueue("paused", () => this.#requestMgr.play());
    }
    get muted() {
      return peek(this.$state.muted);
    }
    set muted(muted) {
      this.#queueMutedUpdate(muted);
    }
    #watchMuted() {
      this.#queueMutedUpdate(this.$props.muted());
    }
    #queueMutedUpdate(muted) {
      this.canPlayQueue.enqueue("muted", () => {
        if (this.#provider) this.#provider.setMuted(muted);
      });
    }
    get currentTime() {
      return peek(this.$state.currentTime);
    }
    set currentTime(time) {
      this.#queueCurrentTimeUpdate(time);
    }
    #watchCurrentTime() {
      this.#queueCurrentTimeUpdate(this.$props.currentTime());
    }
    #queueCurrentTimeUpdate(time) {
      this.canPlayQueue.enqueue("currentTime", () => {
        const { currentTime } = this.$state;
        if (time === peek(currentTime)) return;
        peek(() => {
          if (!this.#provider) return;
          const boundedTime = boundTime(time, this.$state);
          if (Number.isFinite(boundedTime)) {
            this.#provider.setCurrentTime(boundedTime);
          }
        });
      });
    }
    get volume() {
      return peek(this.$state.volume);
    }
    set volume(volume) {
      this.#queueVolumeUpdate(volume);
    }
    #watchVolume() {
      this.#queueVolumeUpdate(this.$props.volume());
    }
    #queueVolumeUpdate(volume) {
      const clampedVolume = clampNumber(0, volume, 1);
      this.canPlayQueue.enqueue("volume", () => {
        if (this.#provider) this.#provider.setVolume(clampedVolume);
      });
    }
    get playbackRate() {
      return peek(this.$state.playbackRate);
    }
    set playbackRate(rate) {
      this.#queuePlaybackRateUpdate(rate);
    }
    #watchPlaybackRate() {
      this.#queuePlaybackRateUpdate(this.$props.playbackRate());
    }
    #queuePlaybackRateUpdate(rate) {
      this.canPlayQueue.enqueue("rate", () => {
        if (this.#provider) this.#provider.setPlaybackRate?.(rate);
      });
    }
    #watchPlaysInline() {
      this.#queuePlaysInlineUpdate(this.$props.playsInline());
    }
    #queuePlaysInlineUpdate(inline2) {
      this.canPlayQueue.enqueue("playsinline", () => {
        if (this.#provider) this.#provider.setPlaysInline?.(inline2);
      });
    }
    #watchStorage() {
      let storageValue = this.$props.storage(), storage = isString(storageValue) ? new LocalMediaStorage() : storageValue;
      if (storage?.onChange) {
        const { source } = this.$state, playerId = isString(storageValue) ? storageValue : this.el?.id, mediaId = computed(this.#computeMediaId.bind(this));
        effect(() => storage.onChange(source(), mediaId(), playerId || void 0));
      }
      this.#media.storage = storage;
      this.#media.textTracks.setStorage(storage);
      onDispose(() => {
        storage?.onDestroy?.();
        this.#media.storage = null;
        this.#media.textTracks.setStorage(null);
      });
    }
    #computeMediaId() {
      const { clipStartTime, clipEndTime } = this.$props, { source } = this.$state, src = source();
      return src.src ? `${src.src}:${clipStartTime()}:${clipEndTime()}` : null;
    }
    /**
     * Begins/resumes playback of the media. If this method is called programmatically before the
     * user has interacted with the player, the promise may be rejected subject to the browser's
     * autoplay policies. This method will throw if called before media is ready for playback.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
     */
    async play(trigger) {
      return this.#requestMgr.play(trigger);
    }
    /**
     * Pauses playback of the media. This method will throw if called before media is ready for
     * playback.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
     */
    async pause(trigger) {
      return this.#requestMgr.pause(trigger);
    }
    /**
     * Attempts to display the player in fullscreen. The promise will resolve if successful, and
     * reject if not. This method will throw if any fullscreen API is _not_ currently available.
     *
     * @see {@link https://vidstack.io/docs/player/api/fullscreen}
     */
    async enterFullscreen(target, trigger) {
      return this.#requestMgr.enterFullscreen(target, trigger);
    }
    /**
     * Attempts to display the player inline by exiting fullscreen. This method will throw if any
     * fullscreen API is _not_ currently available.
     *
     * @see {@link https://vidstack.io/docs/player/api/fullscreen}
     */
    async exitFullscreen(target, trigger) {
      return this.#requestMgr.exitFullscreen(target, trigger);
    }
    /**
     * Attempts to display the player in picture-in-picture mode. This method will throw if PIP is
     * not supported. This method will also return a `PictureInPictureWindow` if the current
     * provider supports it.
     *
     * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
     */
    enterPictureInPicture(trigger) {
      return this.#requestMgr.enterPictureInPicture(trigger);
    }
    /**
     * Attempts to display the player in inline by exiting picture-in-picture mode. This method
     * will throw if not supported.
     *
     * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
     */
    exitPictureInPicture(trigger) {
      return this.#requestMgr.exitPictureInPicture(trigger);
    }
    /**
     * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
     * streams and will throw if called before media is ready for playback.
     *
     * @see {@link https://vidstack.io/docs/player/api/live}
     */
    seekToLiveEdge(trigger) {
      this.#requestMgr.seekToLiveEdge(trigger);
    }
    /**
     * Called when media can begin loading. Calling this method will trigger the initial provider
     * loading process. Calling it more than once has no effect.
     *
     * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
     */
    startLoading(trigger) {
      this.#media.notify("can-load", void 0, trigger);
    }
    /**
     * Called when the poster image can begin loading. Calling it more than once has no effect.
     *
     * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
     */
    startLoadingPoster(trigger) {
      this.#media.notify("can-load-poster", void 0, trigger);
    }
    /**
     * Request Apple AirPlay picker to open.
     */
    requestAirPlay(trigger) {
      return this.#requestMgr.requestAirPlay(trigger);
    }
    /**
     * Request Google Cast device picker to open. The Google Cast framework will be loaded if it
     * hasn't yet.
     */
    requestGoogleCast(trigger) {
      return this.#requestMgr.requestGoogleCast(trigger);
    }
    /**
     * Set the audio gain, amplifying volume and enabling a maximum volume above 100%.
     *
     * @see {@link https://vidstack.io/docs/player/api/audio-gain}
     */
    setAudioGain(gain, trigger) {
      return this.#requestMgr.setAudioGain(gain, trigger);
    }
    destroy() {
      super.destroy();
      this.#media.remote.setPlayer(null);
      this.dispatch("destroy");
    }
  };
  var mediaplayer__proto = MediaPlayer.prototype;
  prop(mediaplayer__proto, "canPlayQueue");
  prop(mediaplayer__proto, "remoteControl");
  prop(mediaplayer__proto, "provider");
  prop(mediaplayer__proto, "controls");
  prop(mediaplayer__proto, "orientation");
  prop(mediaplayer__proto, "title");
  prop(mediaplayer__proto, "qualities");
  prop(mediaplayer__proto, "audioTracks");
  prop(mediaplayer__proto, "textTracks");
  prop(mediaplayer__proto, "textRenderers");
  prop(mediaplayer__proto, "duration");
  prop(mediaplayer__proto, "paused");
  prop(mediaplayer__proto, "muted");
  prop(mediaplayer__proto, "currentTime");
  prop(mediaplayer__proto, "volume");
  prop(mediaplayer__proto, "playbackRate");
  method(mediaplayer__proto, "play");
  method(mediaplayer__proto, "pause");
  method(mediaplayer__proto, "enterFullscreen");
  method(mediaplayer__proto, "exitFullscreen");
  method(mediaplayer__proto, "enterPictureInPicture");
  method(mediaplayer__proto, "exitPictureInPicture");
  method(mediaplayer__proto, "seekToLiveEdge");
  method(mediaplayer__proto, "startLoading");
  method(mediaplayer__proto, "startLoadingPoster");
  method(mediaplayer__proto, "requestAirPlay");
  method(mediaplayer__proto, "requestGoogleCast");
  method(mediaplayer__proto, "setAudioGain");
  function resolveStreamTypeFromDASHManifest(manifestSrc, requestInit) {
    return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
      return /type="static"/.test(manifest) ? "on-demand" : "live";
    });
  }
  function resolveStreamTypeFromHLSManifest(manifestSrc, requestInit) {
    return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
      const renditionURI = resolveHLSRenditionURI(manifest);
      if (renditionURI) {
        return resolveStreamTypeFromHLSManifest(
          /^https?:/.test(renditionURI) ? renditionURI : new URL(renditionURI, manifestSrc).href,
          requestInit
        );
      }
      const streamType = /EXT-X-PLAYLIST-TYPE:\s*VOD/.test(manifest) ? "on-demand" : "live";
      if (streamType === "live" && resolveTargetDuration(manifest) >= 10 && (/#EXT-X-DVR-ENABLED:\s*true/.test(manifest) || manifest.includes("#EXT-X-DISCONTINUITY"))) {
        return "live:dvr";
      }
      return streamType;
    });
  }
  function resolveHLSRenditionURI(manifest) {
    const matches = manifest.match(/#EXT-X-STREAM-INF:[^\n]+(\n[^\n]+)*/g);
    return matches ? matches[0].split("\n")[1].trim() : null;
  }
  function resolveTargetDuration(manifest) {
    const lines = manifest.split("\n");
    for (const line of lines) {
      if (line.startsWith("#EXT-X-TARGETDURATION")) {
        const duration = parseFloat(line.split(":")[1]);
        if (!isNaN(duration)) {
          return duration;
        }
      }
    }
    return -1;
  }
  var sourceTypes = /* @__PURE__ */ new Map();
  var SourceSelection = class {
    #initialize = false;
    #loaders;
    #domSources;
    #media;
    #loader;
    constructor(domSources, media, loader, customLoaders = []) {
      this.#domSources = domSources;
      this.#media = media;
      this.#loader = loader;
      const DASH_LOADER = new DASHProviderLoader(), HLS_LOADER = new HLSProviderLoader(), VIDEO_LOADER = new VideoProviderLoader(), AUDIO_LOADER = new AudioProviderLoader(), YOUTUBE_LOADER = new YouTubeProviderLoader(), VIMEO_LOADER = new VimeoProviderLoader(), EMBED_LOADERS = [YOUTUBE_LOADER, VIMEO_LOADER];
      this.#loaders = computed(() => {
        const remoteLoader = media.$state.remotePlaybackLoader();
        const loaders = media.$props.preferNativeHLS() ? [VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, HLS_LOADER, ...EMBED_LOADERS, ...customLoaders] : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, ...EMBED_LOADERS, ...customLoaders];
        return remoteLoader ? [remoteLoader, ...loaders] : loaders;
      });
      const { $state } = media;
      $state.sources.set(normalizeSrc(media.$props.src()));
      for (const src of $state.sources()) {
        const loader2 = this.#loaders().find((loader3) => loader3.canPlay(src));
        if (!loader2) continue;
        const mediaType = loader2.mediaType(src);
        media.$state.source.set(src);
        media.$state.mediaType.set(mediaType);
        media.$state.inferredViewType.set(mediaType);
        this.#loader.set(loader2);
        this.#initialize = true;
        break;
      }
    }
    connect() {
      const loader = this.#loader();
      if (this.#initialize) {
        this.#notifySourceChange(this.#media.$state.source(), loader);
        this.#notifyLoaderChange(loader);
        this.#initialize = false;
      }
      effect(this.#onSourcesChange.bind(this));
      effect(this.#onSourceChange.bind(this));
      effect(this.#onSetup.bind(this));
      effect(this.#onLoadSource.bind(this));
      effect(this.#onLoadPoster.bind(this));
    }
    #onSourcesChange() {
      this.#media.notify("sources-change", [
        ...normalizeSrc(this.#media.$props.src()),
        ...this.#domSources()
      ]);
    }
    #onSourceChange() {
      const { $state } = this.#media;
      const sources = $state.sources(), currentSource = peek($state.source), newSource = this.#findNewSource(currentSource, sources), noMatch = sources[0]?.src && !newSource.src && !newSource.type;
      if (noMatch) {
        const { crossOrigin } = $state, credentials = getRequestCredentials(crossOrigin()), abort = new AbortController();
        Promise.all(
          sources.map(
            (source) => isString(source.src) && source.type === "?" ? fetch(source.src, {
              method: "HEAD",
              credentials,
              signal: abort.signal
            }).then((res) => {
              source.type = res.headers.get("content-type") || "??";
              sourceTypes.set(source.src, source.type);
              return source;
            }).catch(() => source) : source
          )
        ).then((sources2) => {
          if (abort.signal.aborted) return;
          const newSource2 = this.#findNewSource(peek($state.source), sources2);
          tick();
          if (!newSource2.src) {
            this.#media.notify("error", {
              message: "Failed to load resource.",
              code: 4
            });
          }
        });
        return () => abort.abort();
      }
      tick();
    }
    #findNewSource(currentSource, sources) {
      let newSource = { src: "", type: "" }, newLoader = null, triggerEvent = new DOMEvent("sources-change", { detail: { sources } }), loaders = this.#loaders(), { started, paused, currentTime, quality, savedState } = this.#media.$state;
      for (const src of sources) {
        const loader = loaders.find((loader2) => loader2.canPlay(src));
        if (loader) {
          newSource = src;
          newLoader = loader;
          break;
        }
      }
      if (isVideoQualitySrc(newSource)) {
        const currentQuality = quality(), sourceQuality = sources.find((s4) => s4.src === currentQuality?.src);
        if (peek(started)) {
          savedState.set({
            paused: peek(paused),
            currentTime: peek(currentTime)
          });
        } else {
          savedState.set(null);
        }
        if (sourceQuality) {
          newSource = sourceQuality;
          triggerEvent = new DOMEvent("quality-change", {
            detail: { quality: currentQuality }
          });
        }
      }
      if (!isSameSrc(currentSource, newSource)) {
        this.#notifySourceChange(newSource, newLoader, triggerEvent);
      }
      if (newLoader !== peek(this.#loader)) {
        this.#notifyLoaderChange(newLoader, triggerEvent);
      }
      return newSource;
    }
    #notifySourceChange(src, loader, trigger) {
      this.#media.notify("source-change", src, trigger);
      this.#media.notify("media-type-change", loader?.mediaType(src) || "unknown", trigger);
    }
    #notifyLoaderChange(loader, trigger) {
      this.#media.$providerSetup.set(false);
      this.#media.notify("provider-change", null, trigger);
      loader && peek(() => loader.preconnect?.(this.#media));
      this.#loader.set(loader);
      this.#media.notify("provider-loader-change", loader, trigger);
    }
    #onSetup() {
      const provider = this.#media.$provider();
      if (!provider || peek(this.#media.$providerSetup)) return;
      if (this.#media.$state.canLoad()) {
        scoped(() => provider.setup(), provider.scope);
        this.#media.$providerSetup.set(true);
        return;
      }
      peek(() => provider.preconnect?.());
    }
    #onLoadSource() {
      if (!this.#media.$providerSetup()) return;
      const provider = this.#media.$provider(), source = this.#media.$state.source(), crossOrigin = peek(this.#media.$state.crossOrigin), preferNativeHLS = peek(this.#media.$props.preferNativeHLS);
      if (isSameSrc(provider?.currentSrc, source)) {
        return;
      }
      if (this.#media.$state.canLoad()) {
        const abort = new AbortController();
        if (isHLSSrc(source)) {
          if (preferNativeHLS || !isHLSSupported()) {
            resolveStreamTypeFromHLSManifest(source.src, {
              credentials: getRequestCredentials(crossOrigin),
              signal: abort.signal
            }).then((streamType) => {
              this.#media.notify("stream-type-change", streamType);
            }).catch(noop);
          }
        } else if (isDASHSrc(source)) {
          resolveStreamTypeFromDASHManifest(source.src, {
            credentials: getRequestCredentials(crossOrigin),
            signal: abort.signal
          }).then((streamType) => {
            this.#media.notify("stream-type-change", streamType);
          }).catch(noop);
        } else {
          this.#media.notify("stream-type-change", "on-demand");
        }
        peek(() => {
          const preload = peek(this.#media.$state.preload);
          return provider?.loadSource(source, preload).catch((error) => {
          });
        });
        return () => abort.abort();
      }
      try {
        isString(source.src) && preconnect(new URL(source.src).origin);
      } catch (error) {
      }
    }
    #onLoadPoster() {
      const loader = this.#loader(), { providedPoster, source, canLoadPoster } = this.#media.$state;
      if (!loader || !loader.loadPoster || !source() || !canLoadPoster() || providedPoster()) return;
      const abort = new AbortController(), trigger = new DOMEvent("source-change", { detail: source });
      loader.loadPoster(source(), this.#media, abort).then((url) => {
        this.#media.notify("poster-change", url || "", trigger);
      }).catch(() => {
        this.#media.notify("poster-change", "", trigger);
      });
      return () => {
        abort.abort();
      };
    }
  };
  function normalizeSrc(src) {
    return (isArray(src) ? src : [src]).map((src2) => {
      if (isString(src2)) {
        return { src: src2, type: inferType(src2) };
      } else {
        return { ...src2, type: inferType(src2.src, src2.type) };
      }
    });
  }
  function inferType(src, type) {
    if (isString(type) && type.length) {
      return type;
    } else if (isString(src) && sourceTypes.has(src)) {
      return sourceTypes.get(src);
    } else if (!type && isHLSSrc({ src, type: "" })) {
      return "application/x-mpegurl";
    } else if (!type && isDASHSrc({ src, type: "" })) {
      return "application/dash+xml";
    } else if (!isString(src) || src.startsWith("blob:")) {
      return "video/object";
    } else if (src.includes("youtube") || src.includes("youtu.be")) {
      return "video/youtube";
    } else if (src.includes("vimeo") && !src.includes("progressive_redirect") && !src.includes(".m3u8")) {
      return "video/vimeo";
    }
    return "?";
  }
  function isSameSrc(a3, b2) {
    return a3?.src === b2?.src && a3?.type === b2?.type;
  }
  var Tracks = class {
    #domTracks;
    #media;
    #prevTracks = [];
    constructor(domTracks, media) {
      this.#domTracks = domTracks;
      this.#media = media;
      effect(this.#onTracksChange.bind(this));
    }
    #onTracksChange() {
      const newTracks = this.#domTracks();
      for (const oldTrack of this.#prevTracks) {
        if (!newTracks.some((t5) => t5.id === oldTrack.id)) {
          const track = oldTrack.id && this.#media.textTracks.getById(oldTrack.id);
          if (track) this.#media.textTracks.remove(track);
        }
      }
      for (const newTrack of newTracks) {
        const id3 = newTrack.id || TextTrack.createId(newTrack);
        if (!this.#media.textTracks.getById(id3)) {
          newTrack.id = id3;
          this.#media.textTracks.add(newTrack);
        }
      }
      this.#prevTracks = newTracks;
    }
  };
  var MediaProvider = class extends Component {
    static props = {
      loaders: []
    };
    static state = new State({
      loader: null
    });
    #media;
    #sources;
    #domSources = signal([]);
    #domTracks = signal([]);
    #loader = null;
    onSetup() {
      this.#media = useMediaContext();
      this.#sources = new SourceSelection(
        this.#domSources,
        this.#media,
        this.$state.loader,
        this.$props.loaders()
      );
    }
    onAttach(el) {
      el.setAttribute("data-media-provider", "");
    }
    onConnect(el) {
      this.#sources.connect();
      new Tracks(this.#domTracks, this.#media);
      const resize = new ResizeObserver(animationFrameThrottle(this.#onResize.bind(this)));
      resize.observe(el);
      const mutations = new MutationObserver(this.#onMutation.bind(this));
      mutations.observe(el, { attributes: true, childList: true });
      this.#onResize();
      this.#onMutation();
      onDispose(() => {
        resize.disconnect();
        mutations.disconnect();
      });
    }
    #loadRafId = -1;
    load(target) {
      target?.setAttribute("aria-hidden", "true");
      window.cancelAnimationFrame(this.#loadRafId);
      this.#loadRafId = requestAnimationFrame(() => this.#runLoader(target));
      onDispose(() => {
        window.cancelAnimationFrame(this.#loadRafId);
      });
    }
    #runLoader(target) {
      if (!this.scope) return;
      const loader = this.$state.loader(), { $provider } = this.#media;
      if (this.#loader === loader && loader?.target === target && peek($provider)) return;
      this.#destroyProvider();
      this.#loader = loader;
      if (loader) loader.target = target || null;
      if (!loader || !target) return;
      loader.load(this.#media).then((provider) => {
        if (!this.scope) return;
        if (peek(this.$state.loader) !== loader) return;
        this.#media.notify("provider-change", provider);
      });
    }
    onDestroy() {
      this.#loader = null;
      this.#destroyProvider();
    }
    #destroyProvider() {
      this.#media?.notify("provider-change", null);
    }
    #onResize() {
      if (!this.el) return;
      const { player, $state } = this.#media, width = this.el.offsetWidth, height = this.el.offsetHeight;
      if (!player) return;
      $state.mediaWidth.set(width);
      $state.mediaHeight.set(height);
      if (player.el) {
        setStyle(player.el, "--media-width", width + "px");
        setStyle(player.el, "--media-height", height + "px");
      }
    }
    #onMutation() {
      const sources = [], tracks = [], children = this.el.children;
      for (const el of children) {
        if (el.hasAttribute("data-vds")) continue;
        if (el instanceof HTMLSourceElement) {
          const src = {
            id: el.id,
            src: el.src,
            type: el.type
          };
          for (const prop2 of ["id", "src", "width", "height", "bitrate", "codec"]) {
            const value = el.getAttribute(`data-${prop2}`);
            if (isString(value)) src[prop2] = /id|src|codec/.test(prop2) ? value : Number(value);
          }
          sources.push(src);
        } else if (el instanceof HTMLTrackElement) {
          const track = {
            src: el.src,
            kind: el.track.kind,
            language: el.srclang,
            label: el.label,
            default: el.default,
            type: el.getAttribute("data-type")
          };
          tracks.push({
            id: el.id || TextTrack.createId(track),
            ...track
          });
        }
      }
      this.#domSources.set(sources);
      this.#domTracks.set(tracks);
      tick();
    }
  };
  var mediaprovider__proto = MediaProvider.prototype;
  method(mediaprovider__proto, "load");

  // node_modules/vidstack/prod/chunks/vidstack-DF9tOn_S.js
  init_vidstack_Cpte_fRf();
  var MediaProviderElement = class extends Host(HTMLElement, MediaProvider) {
    static tagName = "media-provider";
    #media;
    #target = null;
    #blocker = null;
    onSetup() {
      this.#media = useMediaContext();
      this.setAttribute("keep-alive", "");
    }
    onDestroy() {
      this.#blocker?.remove();
      this.#blocker = null;
      this.#target?.remove();
      this.#target = null;
    }
    onConnect() {
      effect(() => {
        const loader = this.$state.loader(), isYouTubeEmbed = loader?.name === "youtube", isVimeoEmbed = loader?.name === "vimeo", isEmbed = isYouTubeEmbed || isVimeoEmbed, isGoogleCast = loader?.name === "google-cast";
        const target = loader ? isGoogleCast ? this.#createGoogleCastContainer() : isEmbed ? this.#createIFrame() : loader.mediaType() === "audio" ? this.#createAudio() : this.#createVideo() : null;
        if (this.#target !== target) {
          const parent = this.#target?.parentElement ?? this;
          this.#target?.remove();
          this.#target = target;
          if (target) parent.prepend(target);
          if (isEmbed && target) {
            effect(() => {
              const { nativeControls, viewType } = this.#media.$state, showNativeControls = nativeControls(), isAudioView = viewType() === "audio", showBlocker = !showNativeControls && !isAudioView;
              if (showBlocker) {
                this.#blocker = this.querySelector(".vds-blocker");
                if (!this.#blocker) {
                  this.#blocker = document.createElement("div");
                  this.#blocker.classList.add("vds-blocker");
                  target.after(this.#blocker);
                }
              } else {
                this.#blocker?.remove();
                this.#blocker = null;
              }
              setAttribute(target, "data-no-controls", !showNativeControls);
            });
          }
        }
        if (isYouTubeEmbed) target?.classList.add("vds-youtube");
        else if (isVimeoEmbed) target?.classList.add("vds-vimeo");
        if (!isEmbed) {
          this.#blocker?.remove();
          this.#blocker = null;
        }
        this.load(target);
      });
    }
    #createAudio() {
      const audio = this.#target instanceof HTMLAudioElement ? this.#target : document.createElement("audio");
      const { controls, crossOrigin } = this.#media.$state;
      effect(() => {
        setAttribute(audio, "controls", controls());
        setAttribute(audio, "crossorigin", crossOrigin());
      });
      return audio;
    }
    #createVideo() {
      const video = this.#target instanceof HTMLVideoElement ? this.#target : document.createElement("video");
      const { crossOrigin, poster, nativeControls } = this.#media.$state, $controls = computed(() => nativeControls() ? "true" : null), $poster = computed(() => poster() && nativeControls() ? poster() : null);
      effect(() => {
        setAttribute(video, "controls", $controls());
        setAttribute(video, "crossorigin", crossOrigin());
        setAttribute(video, "poster", $poster());
      });
      return video;
    }
    #createIFrame() {
      const iframe = this.#target instanceof HTMLIFrameElement ? this.#target : document.createElement("iframe"), { nativeControls } = this.#media.$state;
      effect(() => setAttribute(iframe, "tabindex", !nativeControls() ? -1 : null));
      return iframe;
    }
    #createGoogleCastContainer() {
      if (this.#target?.classList.contains("vds-google-cast")) {
        return this.#target;
      }
      const container = document.createElement("div");
      container.classList.add("vds-google-cast");
      Promise.resolve().then(() => (init_vidstack_DJTshtlu(), vidstack_DJTshtlu_exports)).then(({ insertContent: insertContent2 }) => {
        insertContent2(container, this.#media.$state);
      });
      return container;
    }
  };
  var MediaPlayerElement = class extends Host(HTMLElement, MediaPlayer) {
    static tagName = "media-player";
    static attrs = {
      autoPlay: "autoplay",
      crossOrigin: "crossorigin",
      playsInline: "playsinline",
      preferNativeHLS: "prefer-native-hls",
      minLiveDVRWindow: "min-live-dvr-window"
    };
  };

  // node_modules/vidstack/prod/define/vidstack-player.js
  defineCustomElement(MediaPlayerElement);
  defineCustomElement(MediaProviderElement);

  // node_modules/vidstack/prod/global/vidstack-player.js
  init_vidstack_CRlI3Mh7();
  init_vidstack_Ds_q5BGO();
  var VidstackPlayerLayout = class {
    constructor(props) {
      this.props = props;
    }
    name = "vidstack";
    async load() {
      await Promise.resolve().then(() => (init_vidstack_player_default_layout(), vidstack_player_default_layout_exports));
      await Promise.resolve().then(() => (init_vidstack_player_ui(), vidstack_player_ui_exports));
    }
    create() {
      const layouts = [
        document.createElement("media-audio-layout"),
        document.createElement("media-video-layout")
      ];
      if (this.props) {
        for (const [prop2, value] of Object.entries(this.props)) {
          for (const el of layouts) el[prop2] = value;
        }
      }
      return layouts;
    }
  };
  var LAYOUT_LOADED = Symbol();
  var VidstackPlayer = class {
    static async create({ target, layout, tracks, ...props }) {
      if (isString(target)) {
        target = document.querySelector(target);
      }
      if (!isHTMLElement2(target)) {
        throw Error(`[vidstack] target must be of type \`HTMLElement\`, found \`${typeof target}\``);
      }
      let player = document.createElement("media-player"), provider = document.createElement("media-provider"), layouts, isTargetContainer = !isHTMLAudioElement(target) && !isHTMLVideoElement(target) && !isHTMLIFrameElement(target);
      player.setAttribute("keep-alive", "");
      if (props.poster && layout?.name !== "plyr") {
        if (!customElements.get("media-poster")) {
          const { MediaPosterElement: MediaPosterElement2 } = await Promise.resolve().then(() => (init_vidstack_QR8zGkwr(), vidstack_QR8zGkwr_exports));
          defineCustomElement(MediaPosterElement2);
        }
        const poster = document.createElement("media-poster");
        if (layout?.name === "vidstack") poster.classList.add("vds-poster");
        provider.append(poster);
      }
      if (layout) {
        target.removeAttribute("controls");
        if (!layout[LAYOUT_LOADED]) {
          await layout.load();
          layout[LAYOUT_LOADED] = true;
        }
        layouts = await layout.create();
      }
      const title = target.getAttribute("title");
      if (title) player.setAttribute("title", title);
      const width = target.getAttribute("width"), height = target.getAttribute("height");
      if (width || height) {
        if (width) player.style.width = width;
        if (height) player.style.height = height;
        player.style.aspectRatio = "unset";
      }
      for (const attr of target.attributes) {
        const name = attr.name.replace("data-", ""), propName = kebabToCamelCase(name);
        if (propName in player) {
          player.setAttribute(name, attr.value);
        } else if (layouts?.length) {
          for (const layout2 of layouts) {
            if (propName in layout2) {
              layout2.setAttribute(name, attr.value);
            }
          }
        }
      }
      for (const [prop2, value] of Object.entries(props)) {
        player[prop2] = value;
      }
      if (tracks) {
        for (const track of tracks) player.textTracks.add(track);
      }
      player.append(provider);
      if (layouts) {
        for (const layout2 of layouts) player.append(layout2);
      }
      if (isTargetContainer) {
        target.append(player);
      } else {
        for (const child of [...target.children]) provider.append(child);
        target.replaceWith(player);
      }
      return player;
    }
  };

  // config/vs_js.js
  window.VidstackPlayer = VidstackPlayer;
  window.VidstackPlayerLayout = VidstackPlayerLayout;
})();
/*! Bundled license information:

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-svg.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
