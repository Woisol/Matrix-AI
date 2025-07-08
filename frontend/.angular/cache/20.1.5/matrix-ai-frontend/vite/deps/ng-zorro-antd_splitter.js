import {
  NzResizeObserver
} from "./chunk-4TZLTVC3.js";
import {
  NzDestroyService
} from "./chunk-CP5ADG5I.js";
import "./chunk-NX7BCYNZ.js";
import "./chunk-RZB7DMVY.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  NzIconDirective,
  NzIconModule
} from "./chunk-TQ5FZKYH.js";
import "./chunk-UY6MFP5V.js";
import "./chunk-A4QG4M6R.js";
import {
  Platform,
  normalizePassiveListenerOptions
} from "./chunk-3NNVUQIN.js";
import "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed,
  toSignal
} from "./chunk-LTLJ7NNZ.js";
import {
  coerceCssPixelValue,
  ensureInBounds,
  fromEventOutsideAngular,
  isTouchEvent
} from "./chunk-MKTFS3GT.js";
import "./chunk-FCBQDLVS.js";
import "./chunk-57VL2GHP.js";
import "./chunk-RT4XOGP6.js";
import "./chunk-Z42XCBQA.js";
import {
  NgTemplateOutlet
} from "./chunk-QXKDNKXL.js";
import "./chunk-COW2F6L5.js";
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Output,
  Renderer2,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuerySignal
} from "./chunk-WRF7LGAN.js";
import {
  merge
} from "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import {
  Subject,
  filter,
  map,
  pairwise,
  startWith,
  takeUntil
} from "./chunk-JU3XS6KG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-resizable.mjs
var _c0 = ["*"];
function NzResizeHandlesComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-resize-handle", 0);
  }
  if (rf & 2) {
    const option_r1 = ctx.$implicit;
    ɵɵproperty("nzDirection", option_r1.direction)("nzCursorType", option_r1.cursorType);
  }
}
function getEventWithPoint(event) {
  return isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
}
var NzResizableService = class _NzResizableService {
  document = inject(DOCUMENT);
  ngZone = inject(NgZone);
  listeners = /* @__PURE__ */ new Map();
  /**
   * The `OutsideAngular` prefix means that the subject will emit events outside of the Angular zone,
   * so that becomes a bit more descriptive for those who'll maintain the code in the future:
   * ```ts
   * nzResizableService.handleMouseDownOutsideAngular$.subscribe(event => {
   *   console.log(Zone.current); // <root>
   *   console.log(NgZone.isInAngularZone()); // false
   * });
   * ```
   */
  handleMouseDownOutsideAngular$ = new Subject();
  documentMouseUpOutsideAngular$ = new Subject();
  documentMouseMoveOutsideAngular$ = new Subject();
  mouseEnteredOutsideAngular$ = new Subject();
  startResizing(event) {
    const _isTouchEvent = isTouchEvent(event);
    this.clearListeners();
    const moveEvent = _isTouchEvent ? "touchmove" : "mousemove";
    const upEvent = _isTouchEvent ? "touchend" : "mouseup";
    const moveEventHandler = (e) => {
      this.documentMouseMoveOutsideAngular$.next(e);
    };
    const upEventHandler = (e) => {
      this.documentMouseUpOutsideAngular$.next(e);
      this.clearListeners();
    };
    this.listeners.set(moveEvent, moveEventHandler);
    this.listeners.set(upEvent, upEventHandler);
    this.ngZone.runOutsideAngular(() => {
      this.listeners.forEach((handler, name) => {
        this.document.addEventListener(name, handler);
      });
    });
  }
  clearListeners() {
    this.listeners.forEach((handler, name) => {
      this.document.removeEventListener(name, handler);
    });
    this.listeners.clear();
  }
  ngOnDestroy() {
    this.handleMouseDownOutsideAngular$.complete();
    this.documentMouseUpOutsideAngular$.complete();
    this.documentMouseMoveOutsideAngular$.complete();
    this.mouseEnteredOutsideAngular$.complete();
    this.clearListeners();
  }
  static ɵfac = function NzResizableService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzResizableService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NzResizableService,
    factory: _NzResizableService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzResizableService, [{
    type: Injectable
  }], null, null);
})();
var NzResizableDirective = class _NzResizableDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  nzResizableService = inject(NzResizableService);
  platform = inject(Platform);
  ngZone = inject(NgZone);
  destroyRef = inject(DestroyRef);
  nzBounds = "parent";
  nzMaxHeight;
  nzMaxWidth;
  nzMinHeight = 40;
  nzMinWidth = 40;
  nzGridColumnCount = -1;
  nzMaxColumn = -1;
  nzMinColumn = -1;
  nzLockAspectRatio = false;
  nzPreview = false;
  nzDisabled = false;
  nzResize = new EventEmitter();
  nzResizeEnd = new EventEmitter();
  nzResizeStart = new EventEmitter();
  resizing = false;
  elRect;
  currentHandleEvent = null;
  ghostElement = null;
  el;
  sizeCache = null;
  constructor() {
    this.nzResizableService.handleMouseDownOutsideAngular$.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (this.nzDisabled) {
        return;
      }
      this.resizing = true;
      this.nzResizableService.startResizing(event.mouseEvent);
      this.currentHandleEvent = event;
      if (this.nzResizeStart.observers.length) {
        this.ngZone.run(() => this.nzResizeStart.emit({
          mouseEvent: event.mouseEvent,
          direction: event.direction
        }));
      }
      this.elRect = this.el.getBoundingClientRect();
    });
    this.nzResizableService.documentMouseUpOutsideAngular$.pipe(takeUntilDestroyed(), filter(Boolean)).subscribe((event) => {
      if (this.resizing) {
        this.resizing = false;
        this.nzResizableService.documentMouseUpOutsideAngular$.next(null);
        this.endResize(event);
      }
    });
    this.nzResizableService.documentMouseMoveOutsideAngular$.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (this.resizing) {
        this.resize(event);
      }
    });
  }
  setPosition() {
    const position = getComputedStyle(this.el).position;
    if (position === "static" || !position) {
      this.renderer.setStyle(this.el, "position", "relative");
    }
  }
  calcSize(width, height, ratio) {
    let newWidth;
    let newHeight;
    let maxWidth;
    let maxHeight;
    let col = 0;
    let spanWidth = 0;
    let minWidth = this.nzMinWidth;
    let boundWidth = Infinity;
    let boundHeight = Infinity;
    if (this.nzBounds === "parent") {
      const parent = this.renderer.parentNode(this.el);
      if (parent instanceof HTMLElement) {
        const parentRect = parent.getBoundingClientRect();
        boundWidth = parentRect.width;
        boundHeight = parentRect.height;
      }
    } else if (this.nzBounds === "window") {
      if (typeof window !== "undefined") {
        boundWidth = window.innerWidth;
        boundHeight = window.innerHeight;
      }
    } else if (this.nzBounds && this.nzBounds.nativeElement && this.nzBounds.nativeElement instanceof HTMLElement) {
      const boundsRect = this.nzBounds.nativeElement.getBoundingClientRect();
      boundWidth = boundsRect.width;
      boundHeight = boundsRect.height;
    }
    maxWidth = ensureInBounds(this.nzMaxWidth, boundWidth);
    maxHeight = ensureInBounds(this.nzMaxHeight, boundHeight);
    if (this.nzGridColumnCount !== -1) {
      spanWidth = maxWidth / this.nzGridColumnCount;
      minWidth = this.nzMinColumn !== -1 ? spanWidth * this.nzMinColumn : minWidth;
      maxWidth = this.nzMaxColumn !== -1 ? spanWidth * this.nzMaxColumn : maxWidth;
    }
    if (ratio !== -1) {
      if (/(left|right)/i.test(this.currentHandleEvent.direction)) {
        newWidth = Math.min(Math.max(width, minWidth), maxWidth);
        newHeight = Math.min(Math.max(newWidth / ratio, this.nzMinHeight), maxHeight);
        if (newHeight >= maxHeight || newHeight <= this.nzMinHeight) {
          newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
        }
      } else {
        newHeight = Math.min(Math.max(height, this.nzMinHeight), maxHeight);
        newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
        if (newWidth >= maxWidth || newWidth <= minWidth) {
          newHeight = Math.min(Math.max(newWidth / ratio, this.nzMinHeight), maxHeight);
        }
      }
    } else {
      newWidth = Math.min(Math.max(width, minWidth), maxWidth);
      newHeight = Math.min(Math.max(height, this.nzMinHeight), maxHeight);
    }
    if (this.nzGridColumnCount !== -1) {
      col = Math.round(newWidth / spanWidth);
      newWidth = col * spanWidth;
    }
    return {
      col,
      width: newWidth,
      height: newHeight
    };
  }
  resize(event) {
    const elRect = this.elRect;
    const resizeEvent = getEventWithPoint(event);
    const handleEvent = getEventWithPoint(this.currentHandleEvent.mouseEvent);
    let width = elRect.width;
    let height = elRect.height;
    const ratio = this.nzLockAspectRatio ? width / height : -1;
    switch (this.currentHandleEvent.direction) {
      case "bottomRight":
        width = resizeEvent.clientX - elRect.left;
        height = resizeEvent.clientY - elRect.top;
        break;
      case "bottomLeft":
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
        height = resizeEvent.clientY - elRect.top;
        break;
      case "topRight":
        width = resizeEvent.clientX - elRect.left;
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case "topLeft":
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case "top":
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case "right":
        width = resizeEvent.clientX - elRect.left;
        break;
      case "bottom":
        height = resizeEvent.clientY - elRect.top;
        break;
      case "left":
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
    }
    const size = this.calcSize(width, height, ratio);
    this.sizeCache = __spreadValues({}, size);
    if (this.nzResize.observers.length) {
      this.ngZone.run(() => {
        this.nzResize.emit(__spreadProps(__spreadValues({}, size), {
          mouseEvent: event,
          direction: this.currentHandleEvent.direction
        }));
      });
    }
    if (this.nzPreview) {
      this.previewResize(size);
    }
  }
  endResize(event) {
    this.removeGhostElement();
    const size = this.sizeCache ? __spreadValues({}, this.sizeCache) : {
      width: this.elRect.width,
      height: this.elRect.height
    };
    if (this.nzResizeEnd.observers.length) {
      this.ngZone.run(() => {
        this.nzResizeEnd.emit(__spreadProps(__spreadValues({}, size), {
          mouseEvent: event,
          direction: this.currentHandleEvent.direction
        }));
      });
    }
    this.sizeCache = null;
    this.currentHandleEvent = null;
  }
  previewResize({
    width,
    height
  }) {
    this.createGhostElement();
    this.renderer.setStyle(this.ghostElement, "width", `${width}px`);
    this.renderer.setStyle(this.ghostElement, "height", `${height}px`);
  }
  createGhostElement() {
    if (!this.ghostElement) {
      this.ghostElement = this.renderer.createElement("div");
      this.renderer.setAttribute(this.ghostElement, "class", "nz-resizable-preview");
    }
    this.renderer.appendChild(this.el, this.ghostElement);
  }
  removeGhostElement() {
    if (this.ghostElement) {
      this.renderer.removeChild(this.el, this.ghostElement);
    }
  }
  ngAfterViewInit() {
    if (!this.platform.isBrowser) {
      return;
    }
    this.el = this.elementRef.nativeElement;
    this.setPosition();
    fromEventOutsideAngular(this.el, "mouseenter").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.nzResizableService.mouseEnteredOutsideAngular$.next(true);
    });
    fromEventOutsideAngular(this.el, "mouseleave").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.nzResizableService.mouseEnteredOutsideAngular$.next(false);
    });
  }
  ngOnDestroy() {
    this.ghostElement = null;
    this.sizeCache = null;
  }
  static ɵfac = function NzResizableDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzResizableDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzResizableDirective,
    selectors: [["", "nz-resizable", ""]],
    hostAttrs: [1, "nz-resizable"],
    hostVars: 4,
    hostBindings: function NzResizableDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("nz-resizable-resizing", ctx.resizing)("nz-resizable-disabled", ctx.nzDisabled);
      }
    },
    inputs: {
      nzBounds: "nzBounds",
      nzMaxHeight: "nzMaxHeight",
      nzMaxWidth: "nzMaxWidth",
      nzMinHeight: [2, "nzMinHeight", "nzMinHeight", numberAttribute],
      nzMinWidth: [2, "nzMinWidth", "nzMinWidth", numberAttribute],
      nzGridColumnCount: [2, "nzGridColumnCount", "nzGridColumnCount", numberAttribute],
      nzMaxColumn: [2, "nzMaxColumn", "nzMaxColumn", numberAttribute],
      nzMinColumn: [2, "nzMinColumn", "nzMinColumn", numberAttribute],
      nzLockAspectRatio: [2, "nzLockAspectRatio", "nzLockAspectRatio", booleanAttribute],
      nzPreview: [2, "nzPreview", "nzPreview", booleanAttribute],
      nzDisabled: [2, "nzDisabled", "nzDisabled", booleanAttribute]
    },
    outputs: {
      nzResize: "nzResize",
      nzResizeEnd: "nzResizeEnd",
      nzResizeStart: "nzResizeStart"
    },
    exportAs: ["nzResizable"],
    features: [ɵɵProvidersFeature([NzResizableService])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzResizableDirective, [{
    type: Directive,
    args: [{
      selector: "[nz-resizable]",
      exportAs: "nzResizable",
      providers: [NzResizableService],
      host: {
        class: "nz-resizable",
        "[class.nz-resizable-resizing]": "resizing",
        "[class.nz-resizable-disabled]": "nzDisabled"
      }
    }]
  }], () => [], {
    nzBounds: [{
      type: Input
    }],
    nzMaxHeight: [{
      type: Input
    }],
    nzMaxWidth: [{
      type: Input
    }],
    nzMinHeight: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzMinWidth: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzGridColumnCount: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzMaxColumn: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzMinColumn: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzLockAspectRatio: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzPreview: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzDisabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzResize: [{
      type: Output
    }],
    nzResizeEnd: [{
      type: Output
    }],
    nzResizeStart: [{
      type: Output
    }]
  });
})();
var NzResizeHandleMouseDownEvent = class {
  direction;
  mouseEvent;
  constructor(direction, mouseEvent) {
    this.direction = direction;
    this.mouseEvent = mouseEvent;
  }
};
var passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true
});
var NzResizeHandleComponent = class _NzResizeHandleComponent {
  nzResizableService = inject(NzResizableService);
  renderer = inject(Renderer2);
  el = inject(ElementRef).nativeElement;
  destroyRef = inject(DestroyRef);
  nzDirection = "bottomRight";
  nzCursorType = "window";
  nzMouseDown = new EventEmitter();
  ngOnInit() {
    this.nzResizableService.mouseEnteredOutsideAngular$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((entered) => {
      if (entered) {
        this.renderer.addClass(this.el, "nz-resizable-handle-box-hover");
      } else {
        this.renderer.removeClass(this.el, "nz-resizable-handle-box-hover");
      }
    });
    merge(fromEventOutsideAngular(this.el, "mousedown", passiveEventListenerOptions), fromEventOutsideAngular(this.el, "touchstart", passiveEventListenerOptions)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.nzResizableService.handleMouseDownOutsideAngular$.next(new NzResizeHandleMouseDownEvent(this.nzDirection, event));
    });
  }
  onPointerDown(event) {
    event.target.setPointerCapture(event.pointerId);
  }
  onPointerUp(event) {
    event.target.releasePointerCapture(event.pointerId);
  }
  static ɵfac = function NzResizeHandleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzResizeHandleComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzResizeHandleComponent,
    selectors: [["nz-resize-handle"], ["", "nz-resize-handle", ""]],
    hostAttrs: [1, "nz-resizable-handle"],
    hostVars: 20,
    hostBindings: function NzResizeHandleComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("pointerdown", function NzResizeHandleComponent_pointerdown_HostBindingHandler($event) {
          return ctx.onPointerDown($event);
        })("pointerup", function NzResizeHandleComponent_pointerup_HostBindingHandler($event) {
          return ctx.onPointerUp($event);
        });
      }
      if (rf & 2) {
        ɵɵclassProp("nz-resizable-handle-top", ctx.nzDirection === "top")("nz-resizable-handle-right", ctx.nzDirection === "right")("nz-resizable-handle-bottom", ctx.nzDirection === "bottom")("nz-resizable-handle-left", ctx.nzDirection === "left")("nz-resizable-handle-topRight", ctx.nzDirection === "topRight")("nz-resizable-handle-bottomRight", ctx.nzDirection === "bottomRight")("nz-resizable-handle-bottomLeft", ctx.nzDirection === "bottomLeft")("nz-resizable-handle-topLeft", ctx.nzDirection === "topLeft")("nz-resizable-handle-cursor-type-grid", ctx.nzCursorType === "grid")("nz-resizable-handle-cursor-type-window", ctx.nzCursorType === "window");
      }
    },
    inputs: {
      nzDirection: "nzDirection",
      nzCursorType: "nzCursorType"
    },
    outputs: {
      nzMouseDown: "nzMouseDown"
    },
    exportAs: ["nzResizeHandle"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzResizeHandleComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzResizeHandleComponent, [{
    type: Component,
    args: [{
      selector: "nz-resize-handle, [nz-resize-handle]",
      exportAs: "nzResizeHandle",
      template: `<ng-content></ng-content>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "nz-resizable-handle",
        "[class.nz-resizable-handle-top]": `nzDirection === 'top'`,
        "[class.nz-resizable-handle-right]": `nzDirection === 'right'`,
        "[class.nz-resizable-handle-bottom]": `nzDirection === 'bottom'`,
        "[class.nz-resizable-handle-left]": `nzDirection === 'left'`,
        "[class.nz-resizable-handle-topRight]": `nzDirection === 'topRight'`,
        "[class.nz-resizable-handle-bottomRight]": `nzDirection === 'bottomRight'`,
        "[class.nz-resizable-handle-bottomLeft]": `nzDirection === 'bottomLeft'`,
        "[class.nz-resizable-handle-topLeft]": `nzDirection === 'topLeft'`,
        "[class.nz-resizable-handle-cursor-type-grid]": `nzCursorType === 'grid'`,
        "[class.nz-resizable-handle-cursor-type-window]": `nzCursorType === 'window'`,
        "(pointerdown)": "onPointerDown($event)",
        "(pointerup)": "onPointerUp($event)"
      }
    }]
  }], null, {
    nzDirection: [{
      type: Input
    }],
    nzCursorType: [{
      type: Input
    }],
    nzMouseDown: [{
      type: Output
    }]
  });
})();
var DEFAULT_RESIZE_DIRECTION = ["bottomRight", "topRight", "bottomLeft", "topLeft", "bottom", "right", "top", "left"];
function normalizeResizeHandleOptions(value) {
  return value.map((val) => {
    if (typeof val === "string") {
      return {
        direction: val,
        cursorType: "window"
      };
    }
    return val;
  });
}
var NzResizeHandlesComponent = class _NzResizeHandlesComponent {
  nzDirections = DEFAULT_RESIZE_DIRECTION;
  resizeHandleOptions = normalizeResizeHandleOptions(this.nzDirections);
  ngOnChanges(changes) {
    const {
      nzDirections
    } = changes;
    if (nzDirections) {
      this.resizeHandleOptions = normalizeResizeHandleOptions(nzDirections.currentValue);
    }
  }
  static ɵfac = function NzResizeHandlesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzResizeHandlesComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzResizeHandlesComponent,
    selectors: [["nz-resize-handles"]],
    inputs: {
      nzDirections: "nzDirections"
    },
    exportAs: ["nzResizeHandles"],
    features: [ɵɵNgOnChangesFeature],
    decls: 2,
    vars: 0,
    consts: [[3, "nzDirection", "nzCursorType"]],
    template: function NzResizeHandlesComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, NzResizeHandlesComponent_For_1_Template, 1, 2, "nz-resize-handle", 0, ɵɵrepeaterTrackByIdentity);
      }
      if (rf & 2) {
        ɵɵrepeater(ctx.resizeHandleOptions);
      }
    },
    dependencies: [NzResizeHandleComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzResizeHandlesComponent, [{
    type: Component,
    args: [{
      selector: "nz-resize-handles",
      exportAs: "nzResizeHandles",
      template: `
    @for (option of resizeHandleOptions; track option) {
      <nz-resize-handle [nzDirection]="option.direction" [nzCursorType]="option.cursorType" />
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NzResizeHandleComponent]
    }]
  }], null, {
    nzDirections: [{
      type: Input
    }]
  });
})();
var NzResizableModule = class _NzResizableModule {
  static ɵfac = function NzResizableModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzResizableModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzResizableModule,
    imports: [NzResizableDirective, NzResizeHandleComponent, NzResizeHandlesComponent],
    exports: [NzResizableDirective, NzResizeHandleComponent, NzResizeHandlesComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzResizableModule, [{
    type: NgModule,
    args: [{
      imports: [NzResizableDirective, NzResizeHandleComponent, NzResizeHandlesComponent],
      exports: [NzResizableDirective, NzResizeHandleComponent, NzResizeHandlesComponent]
    }]
  }], null, null);
})();

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-splitter.mjs
var _c02 = ["nz-splitter-bar", ""];
function NzSplitterBarComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 4);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const preview_r2 = ctx_r0.active() && !!ctx_r0.constrainedOffset();
    ɵɵstyleProp("transform", preview_r2 ? ctx_r0.previewTransform() : null);
    ɵɵclassProp("ant-splitter-bar-preview-active", preview_r2);
  }
}
function NzSplitterBarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 5);
    ɵɵlistener("click", function NzSplitterBarComponent_Conditional_2_Template_div_click_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.collapseEvent("start"));
    });
    ɵɵelement(1, "nz-icon", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("nzType", ctx_r0.vertical() ? "up" : "left");
  }
}
function NzSplitterBarComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 7);
    ɵɵlistener("click", function NzSplitterBarComponent_Conditional_3_Template_div_click_0_listener() {
      ɵɵrestoreView(_r4);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.collapseEvent("end"));
    });
    ɵɵelement(1, "nz-icon", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("nzType", ctx_r0.vertical() ? "down" : "right");
  }
}
var _c1 = ["contentTemplate"];
var _c2 = ["*"];
function NzSplitterPanelComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function NzSplitterComponent_For_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NzSplitterComponent_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 4);
    ɵɵlistener("offsetStart", function NzSplitterComponent_For_1_Conditional_2_Template_div_offsetStart_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ɵ$index_1_r2 = ɵɵnextContext().$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.startResize(ɵ$index_1_r2, $event));
    })("collapse", function NzSplitterComponent_For_1_Conditional_2_Template_div_collapse_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ɵ$index_1_r2 = ɵɵnextContext().$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.collapse(ɵ$index_1_r2, $event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_23_0;
    const ɵ$index_1_r2 = ɵɵnextContext().$index;
    const ctx_r2 = ɵɵnextContext();
    const resizableInfo_r4 = ctx_r2.resizableInfos()[ɵ$index_1_r2];
    const ariaInfo_r5 = ctx_r2.ariaInfos()[ɵ$index_1_r2];
    ɵɵproperty("ariaNow", ariaInfo_r5.ariaNow)("ariaMin", ariaInfo_r5.ariaMin)("ariaMax", ariaInfo_r5.ariaMax)("resizable", resizableInfo_r4.resizable)("collapsible", resizableInfo_r4.collapsible)("active", ((tmp_23_0 = ctx_r2.movingIndex()) == null ? null : tmp_23_0.index) === ɵ$index_1_r2)("vertical", ctx_r2.nzLayout() === "vertical")("lazy", ctx_r2.nzLazy())("constrainedOffset", ctx_r2.constrainedOffset());
  }
}
function NzSplitterComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, NzSplitterComponent_For_1_ng_container_1_Template, 1, 0, "ng-container", 2);
    ɵɵelementEnd();
    ɵɵconditionalCreate(2, NzSplitterComponent_For_1_Conditional_2_Template, 1, 9, "div", 3);
  }
  if (rf & 2) {
    const panel_r6 = ctx.$implicit;
    const ɵ$index_1_r2 = ctx.$index;
    const ɵ$count_1_r7 = ctx.$count;
    const size_r8 = ɵɵnextContext().sizes()[ɵ$index_1_r2];
    const flexBasis_r9 = !!size_r8.size ? size_r8.size : "auto";
    const flexGrow_r10 = !!size_r8.size ? 0 : 1;
    ɵɵstyleProp("flex-basis", flexBasis_r9)("flex-grow", flexGrow_r10);
    ɵɵclassProp("ant-splitter-panel-hidden", size_r8.postPxSize === 0);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", panel_r6.contentTemplate);
    ɵɵadvance();
    ɵɵconditional(!(ɵ$index_1_r2 === ɵ$count_1_r7 - 1) ? 2 : -1);
  }
}
function NzSplitterComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 5);
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassProp("ant-splitter-mask-horizontal", ctx_r2.nzLayout() === "horizontal")("ant-splitter-mask-vertical", ctx_r2.nzLayout() === "vertical");
  }
}
var NzSplitterBarComponent = class _NzSplitterBarComponent {
  ariaNow = input.required(...ngDevMode ? [{
    debugName: "ariaNow"
  }] : []);
  ariaMin = input.required(...ngDevMode ? [{
    debugName: "ariaMin"
  }] : []);
  ariaMax = input.required(...ngDevMode ? [{
    debugName: "ariaMax"
  }] : []);
  active = input(false, ...ngDevMode ? [{
    debugName: "active"
  }] : []);
  resizable = input(true, ...ngDevMode ? [{
    debugName: "resizable"
  }] : []);
  vertical = input(...ngDevMode ? [void 0, {
    debugName: "vertical"
  }] : []);
  lazy = input(false, ...ngDevMode ? [{
    debugName: "lazy"
  }] : []);
  collapsible = input(...ngDevMode ? [void 0, {
    debugName: "collapsible"
  }] : []);
  constrainedOffset = input(...ngDevMode ? [void 0, {
    debugName: "constrainedOffset"
  }] : []);
  offsetStart = output();
  collapse = output();
  previewTransform = computed(() => {
    const offset = coerceCssPixelValue(this.constrainedOffset());
    return this.vertical() ? `translateY(${offset})` : `translateX(${offset})`;
  }, ...ngDevMode ? [{
    debugName: "previewTransform"
  }] : []);
  resizeStartEvent(event) {
    if (this.resizable()) {
      const {
        pageX,
        pageY
      } = getEventWithPoint(event);
      this.offsetStart.emit([pageX, pageY]);
    }
  }
  collapseEvent(type) {
    this.collapse.emit(type);
  }
  getValidNumber(num) {
    return typeof num === "number" && !isNaN(num) ? Math.round(num) : 0;
  }
  static ɵfac = function NzSplitterBarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSplitterBarComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSplitterBarComponent,
    selectors: [["", "nz-splitter-bar", ""]],
    hostAttrs: ["role", "separator", 1, "ant-splitter-bar"],
    hostVars: 3,
    hostBindings: function NzSplitterBarComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("aria-valuenow", ctx.getValidNumber(ctx.ariaNow()))("aria-valuemin", ctx.getValidNumber(ctx.ariaMin()))("aria-valuemax", ctx.getValidNumber(ctx.ariaMax()));
      }
    },
    inputs: {
      ariaNow: [1, "ariaNow"],
      ariaMin: [1, "ariaMin"],
      ariaMax: [1, "ariaMax"],
      active: [1, "active"],
      resizable: [1, "resizable"],
      vertical: [1, "vertical"],
      lazy: [1, "lazy"],
      collapsible: [1, "collapsible"],
      constrainedOffset: [1, "constrainedOffset"]
    },
    outputs: {
      offsetStart: "offsetStart",
      collapse: "collapse"
    },
    attrs: _c02,
    decls: 4,
    vars: 7,
    consts: [[1, "ant-splitter-bar-preview", 3, "ant-splitter-bar-preview-active", "transform"], [1, "ant-splitter-bar-dragger", 3, "mousedown", "touchstart"], [1, "ant-splitter-bar-collapse-bar", "ant-splitter-bar-collapse-bar-start"], [1, "ant-splitter-bar-collapse-bar", "ant-splitter-bar-collapse-bar-end"], [1, "ant-splitter-bar-preview"], [1, "ant-splitter-bar-collapse-bar", "ant-splitter-bar-collapse-bar-start", 3, "click"], [1, "ant-splitter-bar-collapse-icon", "ant-splitter-bar-collapse-start", 3, "nzType"], [1, "ant-splitter-bar-collapse-bar", "ant-splitter-bar-collapse-bar-end", 3, "click"], [1, "ant-splitter-bar-collapse-icon", "ant-splitter-bar-collapse-end", 3, "nzType"]],
    template: function NzSplitterBarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzSplitterBarComponent_Conditional_0_Template, 1, 4, "div", 0);
        ɵɵelementStart(1, "div", 1);
        ɵɵlistener("mousedown", function NzSplitterBarComponent_Template_div_mousedown_1_listener($event) {
          return ctx.resizeStartEvent($event);
        })("touchstart", function NzSplitterBarComponent_Template_div_touchstart_1_listener($event) {
          return ctx.resizeStartEvent($event);
        });
        ɵɵelementEnd();
        ɵɵconditionalCreate(2, NzSplitterBarComponent_Conditional_2_Template, 2, 1, "div", 2);
        ɵɵconditionalCreate(3, NzSplitterBarComponent_Conditional_3_Template, 2, 1, "div", 3);
      }
      if (rf & 2) {
        let tmp_3_0;
        let tmp_4_0;
        ɵɵconditional(ctx.lazy() ? 0 : -1);
        ɵɵadvance();
        ɵɵclassProp("ant-splitter-bar-dragger-disabled", !ctx.resizable())("ant-splitter-bar-dragger-active", ctx.active());
        ɵɵadvance();
        ɵɵconditional(((tmp_3_0 = ctx.collapsible()) == null ? null : tmp_3_0.start) ? 2 : -1);
        ɵɵadvance();
        ɵɵconditional(((tmp_4_0 = ctx.collapsible()) == null ? null : tmp_4_0.end) ? 3 : -1);
      }
    },
    dependencies: [NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSplitterBarComponent, [{
    type: Component,
    args: [{
      selector: "[nz-splitter-bar]",
      imports: [NzIconModule],
      template: `
    @if (lazy()) {
      @let preview = active() && !!this.constrainedOffset();
      <div
        class="ant-splitter-bar-preview"
        [class.ant-splitter-bar-preview-active]="preview"
        [style.transform]="preview ? previewTransform() : null"
      ></div>
    }

    <div
      class="ant-splitter-bar-dragger"
      [class.ant-splitter-bar-dragger-disabled]="!resizable()"
      [class.ant-splitter-bar-dragger-active]="active()"
      (mousedown)="resizeStartEvent($event)"
      (touchstart)="resizeStartEvent($event)"
    ></div>

    @if (collapsible()?.start) {
      <div class="ant-splitter-bar-collapse-bar ant-splitter-bar-collapse-bar-start" (click)="collapseEvent('start')">
        <nz-icon
          [nzType]="vertical() ? 'up' : 'left'"
          class="ant-splitter-bar-collapse-icon ant-splitter-bar-collapse-start"
        />
      </div>
    }

    @if (collapsible()?.end) {
      <div class="ant-splitter-bar-collapse-bar ant-splitter-bar-collapse-bar-end" (click)="collapseEvent('end')">
        <nz-icon
          [nzType]="vertical() ? 'down' : 'right'"
          class="ant-splitter-bar-collapse-icon ant-splitter-bar-collapse-end"
        />
      </div>
    }
  `,
      host: {
        role: "separator",
        class: "ant-splitter-bar",
        "[attr.aria-valuenow]": "getValidNumber(ariaNow())",
        "[attr.aria-valuemin]": "getValidNumber(ariaMin())",
        "[attr.aria-valuemax]": "getValidNumber(ariaMax())"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var NzSplitterPanelComponent = class _NzSplitterPanelComponent {
  nzDefaultSize = input(...ngDevMode ? [void 0, {
    debugName: "nzDefaultSize"
  }] : []);
  nzMin = input(...ngDevMode ? [void 0, {
    debugName: "nzMin"
  }] : []);
  nzMax = input(...ngDevMode ? [void 0, {
    debugName: "nzMax"
  }] : []);
  nzSize = input(...ngDevMode ? [void 0, {
    debugName: "nzSize"
  }] : []);
  nzCollapsible = input(false, ...ngDevMode ? [{
    debugName: "nzCollapsible"
  }] : []);
  nzResizable = input(true, ...ngDevMode ? [{
    debugName: "nzResizable",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  contentTemplate = viewChild.required("contentTemplate");
  static ɵfac = function NzSplitterPanelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSplitterPanelComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSplitterPanelComponent,
    selectors: [["nz-splitter-panel"]],
    viewQuery: function NzSplitterPanelComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.contentTemplate, _c1, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    inputs: {
      nzDefaultSize: [1, "nzDefaultSize"],
      nzMin: [1, "nzMin"],
      nzMax: [1, "nzMax"],
      nzSize: [1, "nzSize"],
      nzCollapsible: [1, "nzCollapsible"],
      nzResizable: [1, "nzResizable"]
    },
    exportAs: ["nzSplitterPanel"],
    ngContentSelectors: _c2,
    decls: 2,
    vars: 0,
    consts: [["contentTemplate", ""]],
    template: function NzSplitterPanelComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomTemplate(0, NzSplitterPanelComponent_ng_template_0_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSplitterPanelComponent, [{
    type: Component,
    args: [{
      selector: "nz-splitter-panel",
      exportAs: "nzSplitterPanel",
      template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function getPercentValue(str) {
  return Number(str.slice(0, -1)) / 100;
}
function isPercent(size) {
  return typeof size === "string" && size.endsWith("%");
}
function coerceCollapsible(collapsible) {
  if (collapsible && typeof collapsible === "object") {
    return collapsible;
  }
  const mergedCollapsible = !!collapsible;
  return {
    start: mergedCollapsible,
    end: mergedCollapsible
  };
}
var passiveEventListenerOptions2 = normalizePassiveListenerOptions({
  passive: true
});
var NzSplitterComponent = class _NzSplitterComponent {
  /** ------------------- Props ------------------- */
  nzLayout = input("horizontal", ...ngDevMode ? [{
    debugName: "nzLayout"
  }] : []);
  nzLazy = input(false, ...ngDevMode ? [{
    debugName: "nzLazy",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  nzResizeStart = output();
  nzResize = output();
  nzResizeEnd = output();
  destroy$ = inject(NzDestroyService);
  elementRef = inject(ElementRef);
  directionality = inject(Directionality);
  resizeObserver = inject(NzResizeObserver);
  document = inject(DOCUMENT);
  dir = toSignal(this.directionality.change, {
    initialValue: this.directionality.value
  });
  /** ------------------- Panels ------------------- */
  // Get all panels from content children
  panels = contentChildren(NzSplitterPanelComponent, ...ngDevMode ? [{
    debugName: "panels"
  }] : []);
  // Subscribe to the change of properties
  panelProps = computed(() => this.panels().map((panel) => ({
    defaultSize: panel.nzDefaultSize(),
    size: panel.nzSize(),
    min: panel.nzMin(),
    max: panel.nzMax(),
    resizable: panel.nzResizable(),
    collapsible: coerceCollapsible(panel.nzCollapsible()),
    contentTemplate: panel.contentTemplate()
  })), ...ngDevMode ? [{
    debugName: "panelProps"
  }] : []);
  /** ------------------- Sizes ------------------- */
  /**
   * Observe the size of the container.
   */
  containerBox = toSignal(this.resizeObserver.observe(this.elementRef).pipe(map(([item]) => item.target), map((el) => ({
    width: el.clientWidth,
    height: el.clientHeight
  }))), {
    initialValue: {
      width: this.elementRef.nativeElement.clientWidth || 0,
      height: this.elementRef.nativeElement.clientHeight || 0
    }
  });
  /**
   * The size of the container, used to calculate the percentage size and flex basis of each panel.
   */
  containerSize = computed(() => this.nzLayout() === "horizontal" ? this.containerBox().width : this.containerBox().height, ...ngDevMode ? [{
    debugName: "containerSize"
  }] : []);
  /**
   * Derived from defaultSize of each panel.
   * After that it will be updated by the resize event with **real** size in pixels.
   */
  innerSizes = linkedSignal({
    source: this.panelProps,
    computation: (source) => source.map((panel) => panel.defaultSize)
  });
  /**
   * Calculate the size of each panel based on the container size and the percentage size.
   */
  sizes = computed(() => {
    let emptyCount = 0;
    const containerSize = this.containerSize();
    const innerSizes = this.innerSizes();
    const sizes = this.panelProps().map((panel, index) => {
      const size = panel.size ?? innerSizes[index];
      let percentage;
      if (isPercent(size)) {
        percentage = getPercentValue(size);
      } else if (size || size === 0) {
        const num = Number(size);
        if (!isNaN(num)) {
          percentage = num / containerSize;
        }
      } else {
        percentage = void 0;
        emptyCount++;
      }
      const minSize = panel.min;
      const maxSize = panel.max;
      const postPercentMinSize = isPercent(minSize) ? getPercentValue(minSize) : (minSize || 0) / containerSize;
      const postPercentMaxSize = isPercent(maxSize) ? getPercentValue(maxSize) : (maxSize || containerSize) / containerSize;
      return {
        size,
        percentage,
        min: minSize,
        max: maxSize,
        postPercentMinSize,
        postPercentMaxSize
      };
    });
    const totalPercentage = sizes.reduce((acc, {
      percentage
    }) => acc + (percentage ?? 0), 0);
    for (const size of sizes) {
      if (totalPercentage > 1 && !emptyCount) {
        const scale = 1 / totalPercentage;
        size.percentage = size.percentage === void 0 ? 0 : size.percentage * scale;
      } else {
        const averagePercentage = (1 - totalPercentage) / emptyCount;
        size.percentage = size.percentage === void 0 ? averagePercentage : size.percentage;
      }
      size.postPxSize = size.percentage * containerSize;
      size.size = containerSize ? coerceCssPixelValue(size.postPxSize) : size.size;
    }
    return sizes;
  }, ...ngDevMode ? [{
    debugName: "sizes"
  }] : []);
  ariaInfos = computed(() => {
    const stackSizes = [];
    const ariaInfos = [];
    const sizes = this.sizes();
    let stack = 0;
    for (const size of sizes) {
      stack += size.percentage;
      stackSizes.push(stack);
    }
    for (let i = 0; i < sizes.length - 1; i += 1) {
      const ariaMinStart = (stackSizes[i - 1] || 0) + sizes[i].postPercentMinSize;
      const ariaMinEnd = (stackSizes[i + 1] || 100) - sizes[i + 1].postPercentMaxSize;
      const ariaMaxStart = (stackSizes[i - 1] || 0) + sizes[i].postPercentMaxSize;
      const ariaMaxEnd = (stackSizes[i + 1] || 100) - sizes[i + 1].postPercentMinSize;
      ariaInfos.push({
        ariaNow: stackSizes[i] * 100,
        ariaMin: Math.max(ariaMinStart, ariaMinEnd) * 100,
        ariaMax: Math.min(ariaMaxStart, ariaMaxEnd) * 100
      });
    }
    return ariaInfos;
  }, ...ngDevMode ? [{
    debugName: "ariaInfos"
  }] : []);
  getPxSizes() {
    return this.sizes().map((s) => s.postPxSize);
  }
  /** ------------------ Resize ------------------ */
  /**
   * The index of the panel that is being resized.
   * @note Mark the moving splitter bar as activated to show the dragging effect even if the mouse is outside the
   * splitter container.
   */
  movingIndex = signal(null, ...ngDevMode ? [{
    debugName: "movingIndex"
  }] : []);
  /**
   * The offset of preview position (lazy mode) when dragging the splitter bar.
   * Constrained by the min and max size of the target panel.
   */
  constrainedOffset = signal(0, ...ngDevMode ? [{
    debugName: "constrainedOffset"
  }] : []);
  /**
   * The resizable information of each splitter bar.
   */
  resizableInfos = computed(() => {
    const items = this.panelProps();
    const pxSizes = this.getPxSizes();
    const resizeInfos = [];
    for (let i = 0; i < items.length - 1; i += 1) {
      const prevItem = items[i];
      const nextItem = items[i + 1];
      const prevSize = pxSizes[i];
      const nextSize = pxSizes[i + 1];
      const {
        resizable: prevResizable = true,
        min: prevMin,
        collapsible: prevCollapsible
      } = prevItem;
      const {
        resizable: nextResizable = true,
        min: nextMin,
        collapsible: nextCollapsible
      } = nextItem;
      const mergedResizable = (
        // Both need to be resizable
        prevResizable && nextResizable && // Prev is not collapsed and limit min size
        (prevSize !== 0 || !prevMin) && // Next is not collapsed and limit min size
        (nextSize !== 0 || !nextMin)
      );
      const startCollapsible = (
        // Self is collapsible
        prevCollapsible.end && prevSize > 0 || // Collapsed and can be collapsed
        nextCollapsible.start && nextSize === 0 && prevSize > 0
      );
      const endCollapsible = (
        // Self is collapsible
        nextCollapsible.start && nextSize > 0 || // Collapsed and can be collapsed
        prevCollapsible.end && prevSize === 0 && nextSize > 0
      );
      resizeInfos[i] = {
        resizable: mergedResizable,
        collapsible: {
          start: !!(this.dir() === "rtl" ? endCollapsible : startCollapsible),
          end: !!(this.dir() === "rtl" ? startCollapsible : endCollapsible)
        }
      };
    }
    return resizeInfos;
  }, ...ngDevMode ? [{
    debugName: "resizableInfos"
  }] : []);
  /**
   * Handle the resize start event for the specified panel.
   * @param index The index of the panel.
   * @param startPos The start position of the resize event.
   */
  startResize(index, startPos) {
    this.movingIndex.set({
      index,
      confirmed: false
    });
    this.nzResizeStart.emit(this.getPxSizes());
    const end$ = new Subject();
    const getConstrainedOffset = (rawOffset) => {
      const {
        percentage,
        postPercentMinSize,
        postPercentMaxSize
      } = this.sizes()[index];
      const [ariaNow, ariaMin, ariaMax] = [percentage, postPercentMinSize, postPercentMaxSize].map((p) => p * 100);
      const containerSize = this.containerSize();
      const currentPos = containerSize * ariaNow / 100;
      const newPos = currentPos + rawOffset;
      const minAllowed = Math.max(0, containerSize * ariaMin / 100);
      const maxAllowed = Math.min(containerSize, containerSize * ariaMax / 100);
      const clampedPos = Math.max(minAllowed, Math.min(maxAllowed, newPos));
      return clampedPos - currentPos;
    };
    const handleLazyMove = (offset) => {
      this.constrainedOffset.set(getConstrainedOffset(offset));
    };
    const handleLazyEnd = () => {
      this.updateOffset(index, this.constrainedOffset());
      this.constrainedOffset.set(0);
    };
    merge(fromEventOutsideAngular(this.document, "mousemove", passiveEventListenerOptions2), fromEventOutsideAngular(this.document, "touchmove", passiveEventListenerOptions2)).pipe(
      map((event) => getEventWithPoint(event)),
      map(({
        pageX,
        pageY
      }) => this.nzLayout() === "horizontal" ? pageX - startPos[0] : pageY - startPos[1]),
      // flip the offset if the direction is rtl
      map((offset) => this.nzLayout() === "horizontal" && this.dir() === "rtl" ? -offset : offset),
      startWith(0),
      pairwise(),
      takeUntil(merge(end$, this.destroy$))
    ).subscribe(([prev, next]) => {
      if (this.nzLazy() && next !== 0) {
        handleLazyMove(next);
      } else {
        const deltaOffset = next - prev;
        if (deltaOffset !== 0) {
          this.updateOffset(index, deltaOffset);
        }
      }
    });
    merge(fromEventOutsideAngular(this.document, "mouseup"), fromEventOutsideAngular(this.document, "touchend")).pipe(takeUntil(merge(end$, this.destroy$))).subscribe(() => {
      if (this.nzLazy()) {
        handleLazyEnd();
      }
      this.movingIndex.set(null);
      this.nzResizeEnd.emit(this.getPxSizes());
      end$.next();
    });
  }
  /**
   * Update the sizes of specified panels based on the move offset.
   * @param index The index of the panel.
   * @param offset The move offset in pixels.
   */
  updateOffset(index, offset) {
    const containerSize = this.containerSize();
    const limitSizes = this.sizes().map((p) => [p.min, p.max]);
    const pxSizes = this.sizes().map((p) => p.percentage * containerSize);
    const getLimitSize = (size, defaultLimit) => {
      if (typeof size === "string") {
        return getPercentValue(size) * containerSize;
      }
      return size ?? defaultLimit;
    };
    let confirmedIndex = null;
    const movingIndex = this.movingIndex();
    if ((!movingIndex || !movingIndex.confirmed) && offset !== 0) {
      if (offset > 0) {
        confirmedIndex = index;
        this.movingIndex.set({
          index,
          confirmed: true
        });
      } else {
        for (let i = index; i >= 0; i -= 1) {
          if (pxSizes[i] > 0 && this.resizableInfos()[i].resizable) {
            confirmedIndex = i;
            this.movingIndex.set({
              index: i,
              confirmed: true
            });
            break;
          }
        }
      }
    }
    const mergedIndex = confirmedIndex ?? index;
    const nextIndex = mergedIndex + 1;
    const startMinSize = getLimitSize(limitSizes[mergedIndex][0], 0);
    const endMinSize = getLimitSize(limitSizes[nextIndex][0], 0);
    const startMaxSize = getLimitSize(limitSizes[mergedIndex][1], containerSize);
    const endMaxSize = getLimitSize(limitSizes[nextIndex][1], containerSize);
    let mergedOffset = offset;
    if (pxSizes[mergedIndex] + mergedOffset < startMinSize) {
      mergedOffset = startMinSize - pxSizes[mergedIndex];
    }
    if (pxSizes[nextIndex] - mergedOffset < endMinSize) {
      mergedOffset = pxSizes[nextIndex] - endMinSize;
    }
    if (pxSizes[mergedIndex] + mergedOffset > startMaxSize) {
      mergedOffset = startMaxSize - pxSizes[mergedIndex];
    }
    if (pxSizes[nextIndex] - mergedOffset > endMaxSize) {
      mergedOffset = pxSizes[nextIndex] - endMaxSize;
    }
    pxSizes[mergedIndex] += mergedOffset;
    pxSizes[nextIndex] -= mergedOffset;
    this.innerSizes.set(pxSizes);
    this.nzResize.emit(pxSizes);
  }
  /** ------------------ Resize ------------------ */
  /**
   * Record the original size of the collapsed panel.
   * Used to restore the size when the panel is expanded back.
   */
  cacheCollapsedSize = [];
  /**
   * Collapse the specified panel.
   * @param index The index of the panel to collapse.
   * @param type The type of collapse, either `start` or `end`.
   */
  collapse(index, type) {
    const containerSize = this.containerSize();
    const limitSizes = this.sizes().map((p) => [p.min, p.max]);
    const currentSizes = this.sizes().map((p) => p.percentage * containerSize);
    const adjustedType = this.dir() === "rtl" ? type === "start" ? "end" : "start" : type;
    const currentIndex = adjustedType === "start" ? index : index + 1;
    const targetIndex = adjustedType == "start" ? index + 1 : index;
    const currentSize = currentSizes[currentIndex];
    const targetSize = currentSizes[targetIndex];
    const getLimitSize = (size, defaultLimit) => {
      if (typeof size === "string") {
        return getPercentValue(size) * containerSize;
      }
      return size ?? defaultLimit;
    };
    if (currentSize !== 0 && targetSize !== 0) {
      currentSizes[currentIndex] = 0;
      currentSizes[targetIndex] += currentSize;
      this.cacheCollapsedSize[index] = currentSize;
    } else {
      const totalSize = currentSize + targetSize;
      const currentSizeMin = getLimitSize(limitSizes[currentIndex][0], 0);
      const currentSizeMax = getLimitSize(limitSizes[currentIndex][1], containerSize);
      const targetSizeMin = getLimitSize(limitSizes[targetIndex][0], 0);
      const targetSizeMax = getLimitSize(limitSizes[targetIndex][1], containerSize);
      const limitStart = Math.max(currentSizeMin, totalSize - targetSizeMax);
      const limitEnd = Math.min(currentSizeMax, totalSize - targetSizeMin);
      const halfOffset = (limitEnd - limitStart) / 2;
      const targetCacheCollapsedSize = this.cacheCollapsedSize[index];
      const currentCacheCollapsedSize = totalSize - targetCacheCollapsedSize;
      const shouldUseCache = targetCacheCollapsedSize && targetCacheCollapsedSize <= targetSizeMax && targetCacheCollapsedSize >= targetSizeMin && currentCacheCollapsedSize <= currentSizeMax && currentCacheCollapsedSize >= currentSizeMin;
      if (shouldUseCache) {
        currentSizes[targetIndex] = targetCacheCollapsedSize;
        currentSizes[currentIndex] = currentCacheCollapsedSize;
      } else {
        currentSizes[currentIndex] -= halfOffset;
        currentSizes[targetIndex] += halfOffset;
      }
    }
    this.innerSizes.set(currentSizes);
    this.nzResize.emit(currentSizes);
    this.nzResizeEnd.emit(currentSizes);
  }
  static ɵfac = function NzSplitterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSplitterComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSplitterComponent,
    selectors: [["nz-splitter"]],
    contentQueries: function NzSplitterComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.panels, NzSplitterPanelComponent, 4);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: [1, "ant-splitter"],
    hostVars: 6,
    hostBindings: function NzSplitterComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-splitter-horizontal", ctx.nzLayout() === "horizontal")("ant-splitter-vertical", ctx.nzLayout() === "vertical")("ant-splitter-rtl", ctx.dir() === "rtl");
      }
    },
    inputs: {
      nzLayout: [1, "nzLayout"],
      nzLazy: [1, "nzLazy"]
    },
    outputs: {
      nzResizeStart: "nzResizeStart",
      nzResize: "nzResize",
      nzResizeEnd: "nzResizeEnd"
    },
    exportAs: ["nzSplitter"],
    features: [ɵɵProvidersFeature([NzDestroyService])],
    decls: 3,
    vars: 1,
    consts: [["aria-hidden", "", 1, "ant-splitter-mask", 3, "ant-splitter-mask-horizontal", "ant-splitter-mask-vertical"], [1, "ant-splitter-panel"], [4, "ngTemplateOutlet"], ["nz-splitter-bar", "", 3, "ariaNow", "ariaMin", "ariaMax", "resizable", "collapsible", "active", "vertical", "lazy", "constrainedOffset"], ["nz-splitter-bar", "", 3, "offsetStart", "collapse", "ariaNow", "ariaMin", "ariaMax", "resizable", "collapsible", "active", "vertical", "lazy", "constrainedOffset"], ["aria-hidden", "", 1, "ant-splitter-mask"]],
    template: function NzSplitterComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, NzSplitterComponent_For_1_Template, 3, 8, null, null, ɵɵrepeaterTrackByIndex);
        ɵɵconditionalCreate(2, NzSplitterComponent_Conditional_2_Template, 1, 4, "div", 0);
      }
      if (rf & 2) {
        ɵɵrepeater(ctx.panelProps());
        ɵɵadvance(2);
        ɵɵconditional(ctx.movingIndex() !== null ? 2 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, NzSplitterBarComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSplitterComponent, [{
    type: Component,
    args: [{
      selector: "nz-splitter",
      exportAs: "nzSplitter",
      template: `
    @for (panel of panelProps(); let i = $index; track i; let last = $last) {
      @let size = sizes()[i];
      @let flexBasis = !!size.size ? size.size : 'auto';
      @let flexGrow = !!size.size ? 0 : 1;
      <div
        class="ant-splitter-panel"
        [class.ant-splitter-panel-hidden]="size.postPxSize === 0"
        [style.flex-basis]="flexBasis"
        [style.flex-grow]="flexGrow"
      >
        <ng-container *ngTemplateOutlet="panel.contentTemplate"></ng-container>
      </div>

      @if (!last) {
        @let resizableInfo = resizableInfos()[i];
        @let ariaInfo = ariaInfos()[i];
        <div
          nz-splitter-bar
          [ariaNow]="ariaInfo.ariaNow"
          [ariaMin]="ariaInfo.ariaMin"
          [ariaMax]="ariaInfo.ariaMax"
          [resizable]="resizableInfo.resizable"
          [collapsible]="resizableInfo.collapsible"
          [active]="movingIndex()?.index === i"
          [vertical]="nzLayout() === 'vertical'"
          [lazy]="nzLazy()"
          [constrainedOffset]="constrainedOffset()"
          (offsetStart)="startResize(i, $event)"
          (collapse)="collapse(i, $event)"
        ></div>
      }
    }

    <!-- Fake mask for cursor -->
    @if (movingIndex() !== null) {
      <div
        aria-hidden
        class="ant-splitter-mask"
        [class.ant-splitter-mask-horizontal]="nzLayout() === 'horizontal'"
        [class.ant-splitter-mask-vertical]="nzLayout() === 'vertical'"
      ></div>
    }
  `,
      imports: [NgTemplateOutlet, NzSplitterBarComponent],
      providers: [NzDestroyService],
      host: {
        class: "ant-splitter",
        "[class.ant-splitter-horizontal]": 'nzLayout() === "horizontal"',
        "[class.ant-splitter-vertical]": 'nzLayout() === "vertical"',
        "[class.ant-splitter-rtl]": 'dir() === "rtl"'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var NzSplitterModule = class _NzSplitterModule {
  static ɵfac = function NzSplitterModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSplitterModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzSplitterModule,
    imports: [NzSplitterComponent, NzSplitterPanelComponent],
    exports: [NzSplitterComponent, NzSplitterPanelComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzSplitterComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSplitterModule, [{
    type: NgModule,
    args: [{
      imports: [NzSplitterComponent, NzSplitterPanelComponent],
      exports: [NzSplitterComponent, NzSplitterPanelComponent]
    }]
  }], null, null);
})();
export {
  NzSplitterComponent,
  NzSplitterModule,
  NzSplitterPanelComponent
};
//# sourceMappingURL=ng-zorro-antd_splitter.js.map
