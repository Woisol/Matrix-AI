import {
  ElementRef,
  TemplateRef,
  isDevMode,
  numberAttribute
} from "./chunk-WRF7LGAN.js";
import {
  fromEvent,
  isObservable
} from "./chunk-5ZA7WIRE.js";
import {
  EMPTY,
  Observable,
  Subject,
  of,
  take
} from "./chunk-JU3XS6KG.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-environments.mjs
var environment = {
  isTestMode: false
};

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-logger.mjs
var record = {};
var PREFIX = "[NG-ZORRO]:";
function notRecorded(...args) {
  const asRecord = args.reduce((acc, c) => acc + c.toString(), "");
  if (record[asRecord]) {
    return false;
  } else {
    record[asRecord] = true;
    return true;
  }
}
function consoleCommonBehavior(consoleFunc, ...args) {
  if (environment.isTestMode || isDevMode() && notRecorded(...args)) {
    consoleFunc(...args);
  }
}
var warn = (...args) => consoleCommonBehavior((...arg) => console.warn(PREFIX, ...arg), ...args);

// node_modules/.pnpm/@angular+cdk@20.1.5_@angula_cd3470c2f7c3a0954e1dd4ac59cbeb74/node_modules/@angular/cdk/fesm2022/element-x4z00URv.mjs
function coerceNumberProperty(value, fallbackValue = 0) {
  if (_isNumberValue(value)) {
    return Number(value);
  }
  return arguments.length === 2 ? fallbackValue : 0;
}
function _isNumberValue(value) {
  return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}
function coerceElement(elementOrRef) {
  return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}

// node_modules/.pnpm/@angular+cdk@20.1.5_@angula_cd3470c2f7c3a0954e1dd4ac59cbeb74/node_modules/@angular/cdk/fesm2022/css-pixel-value-C_HEqLhI.mjs
function coerceCssPixelValue(value) {
  if (value == null) {
    return "";
  }
  return typeof value === "string" ? value : `${value}px`;
}

// node_modules/.pnpm/@angular+cdk@20.1.5_@angula_cd3470c2f7c3a0954e1dd4ac59cbeb74/node_modules/@angular/cdk/fesm2022/array-I1yfCXUO.mjs
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}

// node_modules/.pnpm/@angular+cdk@20.1.5_@angula_cd3470c2f7c3a0954e1dd4ac59cbeb74/node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-util.mjs
function arraysEqual(array1, array2) {
  if (!array1 || !array2 || array1.length !== array2.length) {
    return false;
  }
  const len = array1.length;
  for (let i = 0; i < len; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
function isNotNil(value) {
  return typeof value !== "undefined" && value !== null;
}
function isNil(value) {
  return typeof value === "undefined" || value === null;
}
function isTemplateRef(value) {
  return value instanceof TemplateRef;
}
function toBoolean(value) {
  return coerceBooleanProperty(value);
}
function numberAttributeWithZeroFallback(value) {
  return numberAttribute(value, 0);
}
function numberAttributeWithInfinityFallback(value) {
  return numberAttribute(value, Infinity);
}
function toNumber(value, fallbackValue = 0) {
  return coerceNumberProperty(value, fallbackValue);
}
function toCssPixel(value) {
  return coerceCssPixelValue(value);
}
function valueFunctionProp(prop, ...args) {
  return typeof prop === "function" ? prop(...args) : prop;
}
function getElementOffset(elem) {
  if (!elem.getClientRects().length) {
    return { top: 0, left: 0 };
  }
  const rect = elem.getBoundingClientRect();
  const win = elem.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  };
}
function isTouchEvent(event) {
  return event.type.startsWith("touch");
}
function getEventPosition(event) {
  return isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
}
function isPromise(obj) {
  return !!obj && typeof obj.then === "function" && typeof obj.catch === "function";
}
function isNumberFinite(value) {
  return typeof value === "number" && isFinite(value);
}
function toDecimal(value, decimal) {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
}
function sum(input, initial = 0) {
  return input.reduce((previous, current) => previous + current, initial);
}
var isBrowser = typeof window !== "undefined";
var isFirefox = isBrowser && window.mozInnerScreenX != null;
var scrollbarVerticalSize;
var scrollbarHorizontalSize;
var scrollbarMeasure = {
  position: "absolute",
  top: "-9999px",
  width: "50px",
  height: "50px"
};
function measureScrollbar(direction = "vertical", prefix = "ant") {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return 0;
  }
  const isVertical = direction === "vertical";
  if (isVertical && scrollbarVerticalSize) {
    return scrollbarVerticalSize;
  } else if (!isVertical && scrollbarHorizontalSize) {
    return scrollbarHorizontalSize;
  }
  const scrollDiv = document.createElement("div");
  Object.keys(scrollbarMeasure).forEach((scrollProp) => {
    scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
  });
  scrollDiv.className = `${prefix}-hide-scrollbar scroll-div-append-to-body`;
  if (isVertical) {
    scrollDiv.style.overflowY = "scroll";
  } else {
    scrollDiv.style.overflowX = "scroll";
  }
  document.body.appendChild(scrollDiv);
  let size = 0;
  if (isVertical) {
    size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    scrollbarVerticalSize = size;
  } else {
    size = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    scrollbarHorizontalSize = size;
  }
  document.body.removeChild(scrollDiv);
  return size;
}
function ensureInBounds(value, boundValue) {
  return value ? value < boundValue ? value : boundValue : boundValue;
}
function inNextTick() {
  const timer = new Subject();
  Promise.resolve().then(() => timer.next());
  return timer.pipe(take(1));
}
function wrapIntoObservable(value) {
  if (isObservable(value)) {
    return value;
  }
  if (isPromise(value)) {
    return new Observable((subscriber) => {
      Promise.resolve(value).then((result) => {
        subscriber.next(result);
        subscriber.complete();
      }).catch((error) => subscriber.error(error));
    });
  }
  return of(value);
}
function canUseDom() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
var MARK_KEY = `rc-util-key`;
function getMark({ mark } = {}) {
  if (mark) {
    return mark.startsWith("data-") ? mark : `data-${mark}`;
  }
  return MARK_KEY;
}
function getContainer(option) {
  if (option.attachTo) {
    return option.attachTo;
  }
  const head = document.querySelector("head");
  return head || document.body;
}
function injectCSS(css, options = {}) {
  if (!canUseDom()) {
    return null;
  }
  const styleNode = document.createElement("style");
  if (options.cspNonce) {
    styleNode.nonce = options.cspNonce;
  }
  styleNode.innerHTML = css;
  const container = getContainer(options);
  const { firstChild } = container;
  if (options.prepend && container.prepend) {
    container.prepend(styleNode);
  } else if (options.prepend && firstChild) {
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }
  return styleNode;
}
var containerCache = /* @__PURE__ */ new Map();
function findExistNode(key, option = {}) {
  const container = getContainer(option);
  return Array.from(containerCache.get(container)?.children || []).find((node) => node.tagName === "STYLE" && node.getAttribute(getMark(option)) === key);
}
function updateCSS(css, key, options = {}) {
  const container = getContainer(options);
  if (!containerCache.has(container)) {
    const placeholderStyle = injectCSS("", options);
    const { parentNode } = placeholderStyle;
    containerCache.set(container, parentNode);
    parentNode.removeChild(placeholderStyle);
  }
  const existNode = findExistNode(key, options);
  if (existNode) {
    if (options.cspNonce && existNode.nonce !== options.cspNonce) {
      existNode.nonce = options.cspNonce;
    }
    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }
    return existNode;
  }
  const newNode = injectCSS(css, options);
  newNode?.setAttribute(getMark(options), key);
  return newNode;
}
function getStatusClassNames(prefixCls, status, hasFeedback) {
  return {
    [`${prefixCls}-status-success`]: status === "success",
    [`${prefixCls}-status-warning`]: status === "warning",
    [`${prefixCls}-status-error`]: status === "error",
    [`${prefixCls}-status-validating`]: status === "validating",
    [`${prefixCls}-has-feedback`]: hasFeedback
  };
}
function runOutsideAngular(fn) {
  return typeof Zone !== "undefined" ? Zone.root.run(fn) : fn();
}
function fromEventOutsideAngular(target, name, options) {
  if (!target) {
    return EMPTY;
  }
  return new Observable((subscriber) => {
    return runOutsideAngular(() => (
      // Casting because the inferred overload is incorrect :(
      fromEvent(target, name, options).subscribe(subscriber)
    ));
  });
}

export {
  environment,
  PREFIX,
  warn,
  coerceNumberProperty,
  coerceElement,
  coerceArray,
  coerceCssPixelValue,
  arraysEqual,
  isNotNil,
  isNil,
  isTemplateRef,
  toBoolean,
  numberAttributeWithZeroFallback,
  numberAttributeWithInfinityFallback,
  toNumber,
  toCssPixel,
  valueFunctionProp,
  getElementOffset,
  isTouchEvent,
  getEventPosition,
  isPromise,
  isNumberFinite,
  toDecimal,
  sum,
  measureScrollbar,
  ensureInBounds,
  inNextTick,
  wrapIntoObservable,
  canUseDom,
  updateCSS,
  getStatusClassNames,
  fromEventOutsideAngular
};
//# sourceMappingURL=chunk-MKTFS3GT.js.map
