import {
  DEFAULT_TOOLTIP_POSITIONS,
  NzConnectedOverlayDirective,
  NzOverlayModule,
  POSITION_MAP,
  getPlacementName
} from "./chunk-V6RO4VMH.js";
import {
  CdkConnectedOverlay,
  OverlayModule
} from "./chunk-YLYPD5XX.js";
import {
  NzNoAnimationDirective
} from "./chunk-M3YYK6CE.js";
import {
  zoomBigMotion
} from "./chunk-XB33FMDA.js";
import {
  NzOutletModule,
  NzStringTemplateOutletDirective
} from "./chunk-VCDKFDG2.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  _getEventTarget
} from "./chunk-3NNVUQIN.js";
import {
  NzConfigService,
  isPresetColor
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  isNotNil,
  toBoolean
} from "./chunk-MKTFS3GT.js";
import {
  isPlatformBrowser
} from "./chunk-QXKDNKXL.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  asapScheduler
} from "./chunk-5ZA7WIRE.js";
import {
  Subject,
  delay,
  distinctUntilChanged,
  filter
} from "./chunk-JU3XS6KG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-tooltip.mjs
var _c0 = ["overlay"];
function NzTooltipComponent_ng_template_0_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.nzTitle);
  }
}
function NzTooltipComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4);
    ɵɵelement(3, "span", 5);
    ɵɵelementEnd();
    ɵɵelementStart(4, "div", 6);
    ɵɵtemplate(5, NzTooltipComponent_ng_template_0_ng_container_5_Template, 2, 1, "ng-container", 7);
    ɵɵelementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵstyleMap(ctx_r1.nzOverlayStyle);
    ɵɵclassMap(ctx_r1._classMap);
    ɵɵclassProp("ant-tooltip-rtl", ctx_r1.dir === "rtl");
    ɵɵproperty("@.disabled", !!(ctx_r1.noAnimation == null ? null : ctx_r1.noAnimation.nzNoAnimation))("nzNoAnimation", ctx_r1.noAnimation == null ? null : ctx_r1.noAnimation.nzNoAnimation)("@zoomBigMotion", "active");
    ɵɵadvance(3);
    ɵɵstyleMap(ctx_r1._contentStyleMap);
    ɵɵadvance();
    ɵɵstyleMap(ctx_r1._contentStyleMap);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r1.nzTitle)("nzStringTemplateOutletContext", ctx_r1.nzTitleContext);
  }
}
var NzTooltipBaseDirective = class _NzTooltipBaseDirective {
  componentType;
  config;
  cdkConnectedOverlayPush;
  visibleChange = new EventEmitter();
  /**
   * This true title that would be used in other parts on this component.
   */
  get _title() {
    return this.title || this.directiveTitle || null;
  }
  get _content() {
    return this.content || this.directiveContent || null;
  }
  get _trigger() {
    return typeof this.trigger !== "undefined" ? this.trigger : "hover";
  }
  get _placement() {
    const p = this.placement;
    return Array.isArray(p) && p.length > 0 ? p : typeof p === "string" && p ? [p] : ["top"];
  }
  get _visible() {
    return (typeof this.visible !== "undefined" ? this.visible : this.internalVisible) || false;
  }
  get _mouseEnterDelay() {
    return this.mouseEnterDelay || 0.15;
  }
  get _mouseLeaveDelay() {
    return this.mouseLeaveDelay || 0.1;
  }
  get _overlayClassName() {
    return this.overlayClassName || null;
  }
  get _overlayStyle() {
    return this.overlayStyle || null;
  }
  get _overlayClickable() {
    return this.overlayClickable ?? true;
  }
  internalVisible = false;
  getProxyPropertyMap() {
    return {
      noAnimation: ["noAnimation", () => !!this.noAnimation]
    };
  }
  component;
  destroy$ = new Subject();
  triggerDisposables = [];
  delayTimer;
  elementRef = inject(ElementRef);
  hostView = inject(ViewContainerRef);
  renderer = inject(Renderer2);
  noAnimation = inject(NzNoAnimationDirective, {
    host: true,
    optional: true
  });
  nzConfigService = inject(NzConfigService);
  destroyRef = inject(DestroyRef);
  platformId = inject(PLATFORM_ID);
  constructor(componentType) {
    this.componentType = componentType;
    this.destroyRef.onDestroy(() => {
      this.clearTogglingTimer();
      this.removeTriggerListeners();
    });
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createComponent();
      this.registerTriggers();
    }
  }
  ngOnChanges(changes) {
    const {
      trigger
    } = changes;
    if (trigger && !trigger.isFirstChange()) {
      this.registerTriggers();
    }
    if (this.component) {
      this.updatePropertiesByChanges(changes);
    }
  }
  show() {
    this.component?.show();
  }
  hide() {
    this.component?.hide();
  }
  /**
   * Force the component to update its position.
   */
  updatePosition() {
    if (this.component) {
      this.component.updatePosition();
    }
  }
  /**
   * Create a dynamic tooltip component. This method can be overridden.
   */
  createComponent() {
    const componentRef = this.hostView.createComponent(this.componentType);
    this.component = componentRef.instance;
    this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement), componentRef.location.nativeElement);
    this.component.setOverlayOrigin(this.origin || this.elementRef);
    this.initProperties();
    const visibleChange$ = this.component.nzVisibleChange.pipe(distinctUntilChanged());
    visibleChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((visible) => {
      this.internalVisible = visible;
      this.visibleChange.emit(visible);
    });
    visibleChange$.pipe(filter((visible) => visible), delay(0, asapScheduler), filter(() => Boolean(this.component?.overlay?.overlayRef)), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.component?.updatePosition();
    });
  }
  registerTriggers() {
    const el = this.elementRef.nativeElement;
    const trigger = this.trigger;
    this.removeTriggerListeners();
    if (trigger === "hover") {
      let overlayElement;
      this.triggerDisposables.push(this.renderer.listen(el, "mouseenter", () => {
        this.delayEnterLeave(true, true, this._mouseEnterDelay);
      }));
      this.triggerDisposables.push(this.renderer.listen(el, "mouseleave", () => {
        this.delayEnterLeave(true, false, this._mouseLeaveDelay);
        if (this.component?.overlay.overlayRef && !overlayElement) {
          overlayElement = this.component.overlay.overlayRef.overlayElement;
          this.triggerDisposables.push(this.renderer.listen(overlayElement, "mouseenter", () => {
            this.delayEnterLeave(false, true, this._mouseEnterDelay);
          }));
          this.triggerDisposables.push(this.renderer.listen(overlayElement, "mouseleave", () => {
            this.delayEnterLeave(false, false, this._mouseLeaveDelay);
          }));
        }
      }));
    } else if (trigger === "focus") {
      this.triggerDisposables.push(this.renderer.listen(el, "focusin", () => this.show()));
      this.triggerDisposables.push(this.renderer.listen(el, "focusout", () => this.hide()));
    } else if (trigger === "click") {
      this.triggerDisposables.push(this.renderer.listen(el, "click", (e) => {
        e.preventDefault();
        this.show();
      }));
    }
  }
  updatePropertiesByChanges(changes) {
    this.updatePropertiesByKeys(Object.keys(changes));
  }
  updatePropertiesByKeys(keys) {
    const mappingProperties = __spreadValues({
      // common mappings
      title: ["nzTitle", () => this._title],
      directiveTitle: ["nzTitle", () => this._title],
      content: ["nzContent", () => this._content],
      directiveContent: ["nzContent", () => this._content],
      trigger: ["nzTrigger", () => this._trigger],
      placement: ["nzPlacement", () => this._placement],
      visible: ["nzVisible", () => this._visible],
      mouseEnterDelay: ["nzMouseEnterDelay", () => this._mouseEnterDelay],
      mouseLeaveDelay: ["nzMouseLeaveDelay", () => this._mouseLeaveDelay],
      overlayClassName: ["nzOverlayClassName", () => this._overlayClassName],
      overlayStyle: ["nzOverlayStyle", () => this._overlayStyle],
      overlayClickable: ["nzOverlayClickable", () => this._overlayClickable],
      arrowPointAtCenter: ["nzArrowPointAtCenter", () => this.arrowPointAtCenter],
      cdkConnectedOverlayPush: ["cdkConnectedOverlayPush", () => this.cdkConnectedOverlayPush]
    }, this.getProxyPropertyMap());
    (keys || Object.keys(mappingProperties).filter((key) => !key.startsWith("directive"))).forEach((property) => {
      if (mappingProperties[property]) {
        const [name, valueFn] = mappingProperties[property];
        this.updateComponentValue(name, valueFn());
      }
    });
    this.component?.updateByDirective();
  }
  initProperties() {
    this.updatePropertiesByKeys();
  }
  updateComponentValue(key, value) {
    if (typeof value !== "undefined") {
      this.component[key] = value;
    }
  }
  delayEnterLeave(isOrigin, isEnter, delay2 = -1) {
    if (this.delayTimer) {
      this.clearTogglingTimer();
    } else if (delay2 > 0) {
      this.delayTimer = setTimeout(() => {
        this.delayTimer = void 0;
        isEnter ? this.show() : this.hide();
      }, delay2 * 1e3);
    } else {
      isEnter && isOrigin ? this.show() : this.hide();
    }
  }
  removeTriggerListeners() {
    this.triggerDisposables.forEach((dispose) => dispose());
    this.triggerDisposables.length = 0;
  }
  clearTogglingTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = void 0;
    }
  }
  static ɵfac = function NzTooltipBaseDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTooltipBaseDirective)(ɵɵdirectiveInject(Type));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzTooltipBaseDirective,
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTooltipBaseDirective, [{
    type: Directive
  }], () => [{
    type: Type
  }], null);
})();
var NzTooltipBaseComponent = class _NzTooltipBaseComponent {
  overlay;
  noAnimation = inject(NzNoAnimationDirective, {
    host: true,
    optional: true
  });
  directionality = inject(Directionality);
  cdr = inject(ChangeDetectorRef);
  elementRef = inject(ElementRef);
  destroyRef = inject(DestroyRef);
  nzTitle = null;
  nzContent = null;
  nzArrowPointAtCenter = false;
  nzOverlayClassName;
  nzOverlayStyle = {};
  nzOverlayClickable = true;
  nzBackdrop = false;
  nzMouseEnterDelay;
  nzMouseLeaveDelay;
  cdkConnectedOverlayPush = true;
  nzVisibleChange = new Subject();
  set nzVisible(value) {
    const visible = toBoolean(value);
    if (this._visible !== visible) {
      this._visible = visible;
      this.nzVisibleChange.next(visible);
    }
  }
  get nzVisible() {
    return this._visible;
  }
  _visible = false;
  set nzTrigger(value) {
    this._trigger = value;
  }
  get nzTrigger() {
    return this._trigger;
  }
  _trigger = "hover";
  set nzPlacement(value) {
    const preferredPosition = value.map((placement) => POSITION_MAP[placement]);
    this._positions = [...preferredPosition, ...DEFAULT_TOOLTIP_POSITIONS];
  }
  preferredPlacement = "top";
  origin;
  dir = "ltr";
  _classMap = {};
  _prefix = "ant-tooltip";
  _positions = [...DEFAULT_TOOLTIP_POSITIONS];
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.nzVisibleChange.complete();
    });
  }
  ngOnInit() {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }
  show() {
    if (this.nzVisible) {
      return;
    }
    if (!this.isEmpty()) {
      this.nzVisible = true;
      this.nzVisibleChange.next(true);
      this.cdr.detectChanges();
    }
    if (this.origin && this.overlay && this.overlay.overlayRef && this.overlay.overlayRef.getDirection() === "rtl") {
      this.overlay.overlayRef.setDirection("ltr");
    }
  }
  hide() {
    if (!this.nzVisible) {
      return;
    }
    this.nzVisible = false;
    this.nzVisibleChange.next(false);
    this.cdr.detectChanges();
  }
  updateByDirective() {
    this.updateStyles();
    this.cdr.detectChanges();
    Promise.resolve().then(() => {
      this.updatePosition();
      this.updateVisibilityByTitle();
    });
  }
  /**
   * Force the component to update its position.
   */
  updatePosition() {
    if (this.origin && this.overlay && this.overlay.overlayRef) {
      this.overlay.overlayRef.updatePosition();
    }
  }
  onPositionChange(position) {
    this.preferredPlacement = getPlacementName(position);
    this.updateStyles();
    this.cdr.detectChanges();
  }
  setOverlayOrigin(origin) {
    this.origin = origin;
    this.cdr.markForCheck();
  }
  onClickOutside(event) {
    if (!this.nzOverlayClickable) {
      return;
    }
    const target = _getEventTarget(event);
    if (!this.origin.nativeElement.contains(target) && this.nzTrigger !== null) {
      this.hide();
    }
  }
  /**
   * Hide the component while the content is empty.
   */
  updateVisibilityByTitle() {
    if (this.isEmpty()) {
      this.hide();
    }
  }
  updateStyles() {
    this._classMap = __spreadProps(__spreadValues({}, this.transformClassListToMap(this.nzOverlayClassName)), {
      [`${this._prefix}-placement-${this.preferredPlacement}`]: true
    });
  }
  transformClassListToMap(klass) {
    const result = {};
    const classes = klass !== null ? klass.split(/\s+/) : [];
    classes.forEach((className) => result[className] = true);
    return result;
  }
  static ɵfac = function NzTooltipBaseComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTooltipBaseComponent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzTooltipBaseComponent,
    viewQuery: function NzTooltipBaseComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overlay = _t.first);
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTooltipBaseComponent, [{
    type: Directive
  }], () => [], {
    overlay: [{
      type: ViewChild,
      args: ["overlay", {
        static: false
      }]
    }]
  });
})();
function isTooltipEmpty(value) {
  return value instanceof TemplateRef ? false : value === "" || !isNotNil(value);
}
var NzTooltipDirective = class _NzTooltipDirective extends NzTooltipBaseDirective {
  /* eslint-disable @angular-eslint/no-input-rename, @angular-eslint/no-output-rename */
  title;
  titleContext = null;
  directiveTitle;
  trigger = "hover";
  placement = "top";
  origin;
  visible;
  mouseEnterDelay;
  mouseLeaveDelay;
  overlayClassName;
  overlayStyle;
  arrowPointAtCenter;
  cdkConnectedOverlayPush = true;
  nzTooltipColor;
  directiveContent = null;
  content = null;
  overlayClickable;
  visibleChange = new EventEmitter();
  constructor() {
    super(NzTooltipComponent);
  }
  getProxyPropertyMap() {
    return __spreadProps(__spreadValues({}, super.getProxyPropertyMap()), {
      nzTooltipColor: ["nzColor", () => this.nzTooltipColor],
      titleContext: ["nzTitleContext", () => this.titleContext]
    });
  }
  static ɵfac = function NzTooltipDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTooltipDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzTooltipDirective,
    selectors: [["", "nz-tooltip", ""]],
    hostVars: 2,
    hostBindings: function NzTooltipDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-tooltip-open", ctx.visible);
      }
    },
    inputs: {
      title: [0, "nzTooltipTitle", "title"],
      titleContext: [0, "nzTooltipTitleContext", "titleContext"],
      directiveTitle: [0, "nz-tooltip", "directiveTitle"],
      trigger: [0, "nzTooltipTrigger", "trigger"],
      placement: [0, "nzTooltipPlacement", "placement"],
      origin: [0, "nzTooltipOrigin", "origin"],
      visible: [0, "nzTooltipVisible", "visible"],
      mouseEnterDelay: [0, "nzTooltipMouseEnterDelay", "mouseEnterDelay"],
      mouseLeaveDelay: [0, "nzTooltipMouseLeaveDelay", "mouseLeaveDelay"],
      overlayClassName: [0, "nzTooltipOverlayClassName", "overlayClassName"],
      overlayStyle: [0, "nzTooltipOverlayStyle", "overlayStyle"],
      arrowPointAtCenter: [2, "nzTooltipArrowPointAtCenter", "arrowPointAtCenter", booleanAttribute],
      cdkConnectedOverlayPush: [2, "cdkConnectedOverlayPush", "cdkConnectedOverlayPush", booleanAttribute],
      nzTooltipColor: "nzTooltipColor"
    },
    outputs: {
      visibleChange: "nzTooltipVisibleChange"
    },
    exportAs: ["nzTooltip"],
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTooltipDirective, [{
    type: Directive,
    args: [{
      selector: "[nz-tooltip]",
      exportAs: "nzTooltip",
      host: {
        "[class.ant-tooltip-open]": "visible"
      }
    }]
  }], () => [], {
    title: [{
      type: Input,
      args: ["nzTooltipTitle"]
    }],
    titleContext: [{
      type: Input,
      args: ["nzTooltipTitleContext"]
    }],
    directiveTitle: [{
      type: Input,
      args: ["nz-tooltip"]
    }],
    trigger: [{
      type: Input,
      args: ["nzTooltipTrigger"]
    }],
    placement: [{
      type: Input,
      args: ["nzTooltipPlacement"]
    }],
    origin: [{
      type: Input,
      args: ["nzTooltipOrigin"]
    }],
    visible: [{
      type: Input,
      args: ["nzTooltipVisible"]
    }],
    mouseEnterDelay: [{
      type: Input,
      args: ["nzTooltipMouseEnterDelay"]
    }],
    mouseLeaveDelay: [{
      type: Input,
      args: ["nzTooltipMouseLeaveDelay"]
    }],
    overlayClassName: [{
      type: Input,
      args: ["nzTooltipOverlayClassName"]
    }],
    overlayStyle: [{
      type: Input,
      args: ["nzTooltipOverlayStyle"]
    }],
    arrowPointAtCenter: [{
      type: Input,
      args: [{
        alias: "nzTooltipArrowPointAtCenter",
        transform: booleanAttribute
      }]
    }],
    cdkConnectedOverlayPush: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzTooltipColor: [{
      type: Input
    }],
    visibleChange: [{
      type: Output,
      args: ["nzTooltipVisibleChange"]
    }]
  });
})();
var NzTooltipComponent = class _NzTooltipComponent extends NzTooltipBaseComponent {
  nzTitle = null;
  nzTitleContext = null;
  nzColor;
  _contentStyleMap = {};
  isEmpty() {
    return isTooltipEmpty(this.nzTitle);
  }
  updateStyles() {
    const isColorPreset = this.nzColor && isPresetColor(this.nzColor);
    this._classMap = __spreadProps(__spreadValues({}, this.transformClassListToMap(this.nzOverlayClassName)), {
      [`${this._prefix}-placement-${this.preferredPlacement}`]: true,
      [`${this._prefix}-${this.nzColor}`]: isColorPreset
    });
    this._contentStyleMap = {
      backgroundColor: !!this.nzColor && !isColorPreset ? this.nzColor : null,
      "--antd-arrow-background-color": this.nzColor
    };
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵNzTooltipComponent_BaseFactory;
    return function NzTooltipComponent_Factory(__ngFactoryType__) {
      return (ɵNzTooltipComponent_BaseFactory || (ɵNzTooltipComponent_BaseFactory = ɵɵgetInheritedFactory(_NzTooltipComponent)))(__ngFactoryType__ || _NzTooltipComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _NzTooltipComponent,
    selectors: [["nz-tooltip"]],
    exportAs: ["nzTooltipComponent"],
    features: [ɵɵInheritDefinitionFeature],
    decls: 2,
    vars: 5,
    consts: [["overlay", "cdkConnectedOverlay"], ["cdkConnectedOverlay", "", "nzConnectedOverlay", "", 3, "overlayOutsideClick", "detach", "positionChange", "cdkConnectedOverlayOrigin", "cdkConnectedOverlayOpen", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPush", "nzArrowPointAtCenter"], [1, "ant-tooltip", 3, "nzNoAnimation"], [1, "ant-tooltip-content"], [1, "ant-tooltip-arrow"], [1, "ant-tooltip-arrow-content"], [1, "ant-tooltip-inner"], [4, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"]],
    template: function NzTooltipComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵtemplate(0, NzTooltipComponent_ng_template_0_Template, 6, 15, "ng-template", 1, 0, ɵɵtemplateRefExtractor);
        ɵɵlistener("overlayOutsideClick", function NzTooltipComponent_Template_ng_template_overlayOutsideClick_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onClickOutside($event));
        })("detach", function NzTooltipComponent_Template_ng_template_detach_0_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.hide());
        })("positionChange", function NzTooltipComponent_Template_ng_template_positionChange_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onPositionChange($event));
        });
      }
      if (rf & 2) {
        ɵɵproperty("cdkConnectedOverlayOrigin", ctx.origin)("cdkConnectedOverlayOpen", ctx._visible)("cdkConnectedOverlayPositions", ctx._positions)("cdkConnectedOverlayPush", ctx.cdkConnectedOverlayPush)("nzArrowPointAtCenter", ctx.nzArrowPointAtCenter);
      }
    },
    dependencies: [OverlayModule, CdkConnectedOverlay, NzNoAnimationDirective, NzOutletModule, NzStringTemplateOutletDirective, NzOverlayModule, NzConnectedOverlayDirective],
    encapsulation: 2,
    data: {
      animation: [zoomBigMotion]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTooltipComponent, [{
    type: Component,
    args: [{
      selector: "nz-tooltip",
      exportAs: "nzTooltipComponent",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      animations: [zoomBigMotion],
      template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayPush]="cdkConnectedOverlayPush"
      [nzArrowPointAtCenter]="nzArrowPointAtCenter"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="ant-tooltip"
        [class.ant-tooltip-rtl]="dir === 'rtl'"
        [class]="_classMap"
        [style]="nzOverlayStyle"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="ant-tooltip-content">
          <div class="ant-tooltip-arrow">
            <span class="ant-tooltip-arrow-content" [style]="_contentStyleMap"></span>
          </div>
          <div class="ant-tooltip-inner" [style]="_contentStyleMap">
            <ng-container *nzStringTemplateOutlet="nzTitle; context: nzTitleContext">{{ nzTitle }}</ng-container>
          </div>
        </div>
      </div>
    </ng-template>
  `,
      imports: [OverlayModule, NzNoAnimationDirective, NzOutletModule, NzOverlayModule]
    }]
  }], null, null);
})();
var NzToolTipComponent = NzTooltipComponent;
var NzTooltipModule = class _NzTooltipModule {
  static ɵfac = function NzTooltipModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTooltipModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzTooltipModule,
    imports: [NzTooltipComponent, NzTooltipDirective],
    exports: [NzTooltipComponent, NzTooltipDirective]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzTooltipComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTooltipModule, [{
    type: NgModule,
    args: [{
      imports: [NzTooltipComponent, NzTooltipDirective],
      exports: [NzTooltipComponent, NzTooltipDirective]
    }]
  }], null, null);
})();
var NzToolTipModule = NzTooltipModule;

export {
  NzTooltipBaseDirective,
  NzTooltipBaseComponent,
  isTooltipEmpty,
  NzTooltipDirective,
  NzTooltipComponent,
  NzToolTipComponent,
  NzTooltipModule,
  NzToolTipModule
};
//# sourceMappingURL=chunk-5Y5V7TOA.js.map
