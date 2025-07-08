import {
  CdkDrag,
  CdkDragHandle
} from "./chunk-WN2QJL5L.js";
import {
  Overlay,
  OverlayConfig,
  OverlayRef
} from "./chunk-YLYPD5XX.js";
import {
  ComponentPortal
} from "./chunk-BGJVKJD4.js";
import "./chunk-7MQL5S2Q.js";
import "./chunk-RNHKWUQU.js";
import {
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  hasModifierKey
} from "./chunk-OROZASVN.js";
import {
  fadeMotion
} from "./chunk-XB33FMDA.js";
import "./chunk-SDXIEBBY.js";
import "./chunk-CNWZ5YNB.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  NzIconDirective,
  NzIconModule
} from "./chunk-TQ5FZKYH.js";
import "./chunk-UY6MFP5V.js";
import "./chunk-A4QG4M6R.js";
import "./chunk-3NNVUQIN.js";
import {
  NzConfigService,
  WithConfig
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  fromEventOutsideAngular,
  isNotNil
} from "./chunk-MKTFS3GT.js";
import {
  DomSanitizer
} from "./chunk-FCBQDLVS.js";
import "./chunk-57VL2GHP.js";
import "./chunk-RT4XOGP6.js";
import "./chunk-Z42XCBQA.js";
import "./chunk-QXKDNKXL.js";
import "./chunk-COW2F6L5.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  Injector,
  Input,
  NgModule,
  NgZone,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵsyntheticHostListener,
  ɵɵsyntheticHostProperty,
  ɵɵtext,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  fromEvent
} from "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import {
  Subject,
  __esDecorate,
  __runInitializers,
  filter,
  switchMap,
  take,
  takeUntil
} from "./chunk-JU3XS6KG.js";
import {
  __publicField,
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-image.mjs
var _c0 = ["*"];
var _c1 = ["imgRef"];
var _c2 = ["imagePreviewWrapper"];
function NzImagePreviewComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 13);
    ɵɵlistener("click", function NzImagePreviewComponent_Conditional_2_Template_div_click_0_listener($event) {
      ɵɵrestoreView(_r2);
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onSwitchLeft($event));
    });
    ɵɵelement(1, "nz-icon", 14);
    ɵɵelementEnd();
    ɵɵelementStart(2, "div", 15);
    ɵɵlistener("click", function NzImagePreviewComponent_Conditional_2_Template_div_click_2_listener($event) {
      ɵɵrestoreView(_r2);
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onSwitchRight($event));
    });
    ɵɵelement(3, "nz-icon", 16);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassProp("ant-image-preview-switch-left-disabled", ctx_r2.index <= 0);
    ɵɵadvance(2);
    ɵɵclassProp("ant-image-preview-switch-right-disabled", ctx_r2.index >= ctx_r2.images.length - 1);
  }
}
function NzImagePreviewComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "li", 5);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate2("", ctx_r2.index + 1, " / ", ctx_r2.images.length);
  }
}
function NzImagePreviewComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "li", 17);
    ɵɵlistener("click", function NzImagePreviewComponent_For_6_Template_li_click_0_listener() {
      const option_r5 = ɵɵrestoreView(_r4).$implicit;
      return ɵɵresetView(option_r5.onClick());
    });
    ɵɵelement(1, "nz-icon", 18);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const option_r5 = ctx.$implicit;
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassProp("ant-image-preview-operations-operation-disabled", ctx_r2.zoomOutDisabled && option_r5.type === "zoomOut");
    ɵɵadvance();
    ɵɵproperty("nzType", option_r5.icon)("nzRotate", option_r5.rotate ?? 0);
  }
}
function NzImagePreviewComponent_For_15_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "img", 20, 1);
  }
  if (rf & 2) {
    const image_r6 = ɵɵnextContext().$implicit;
    const ctx_r2 = ɵɵnextContext();
    ɵɵstyleProp("width", image_r6.width)("height", image_r6.height)("transform", ctx_r2.previewImageTransform);
    ɵɵattribute("src", ctx_r2.sanitizerResourceUrl(image_r6.src), ɵɵsanitizeUrl)("srcset", image_r6.srcset)("alt", image_r6.alt);
  }
}
function NzImagePreviewComponent_For_15_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzImagePreviewComponent_For_15_Conditional_0_Template, 2, 9, "img", 19);
  }
  if (rf & 2) {
    const ɵ$index_37_r7 = ctx.$index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵconditional(ɵ$index_37_r7 === ctx_r2.index ? 0 : -1);
  }
}
var NzImageGroupComponent = class _NzImageGroupComponent {
  nzScaleStep = null;
  images = [];
  addImage(image) {
    this.images.push(image);
  }
  static ɵfac = function NzImageGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzImageGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzImageGroupComponent,
    selectors: [["nz-image-group"]],
    inputs: {
      nzScaleStep: "nzScaleStep"
    },
    exportAs: ["nzImageGroup"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzImageGroupComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzImageGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-image-group",
      exportAs: "nzImageGroup",
      template: "<ng-content></ng-content>",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], null, {
    nzScaleStep: [{
      type: Input
    }]
  });
})();
var NZ_CONFIG_MODULE_NAME$1 = "image";
var NzImagePreviewOptions = class {
  nzKeyboard = true;
  nzNoAnimation = false;
  nzMaskClosable = true;
  nzCloseOnNavigation = true;
  nzZIndex;
  nzZoom;
  nzRotate;
  nzFlipHorizontally;
  nzFlipVertically;
  nzScaleStep;
  nzDirection;
};
function getFitContentPosition(params) {
  let fixPos = {};
  if (params.width <= params.clientWidth && params.height <= params.clientHeight) {
    fixPos = {
      x: 0,
      y: 0
    };
  }
  if (params.width > params.clientWidth || params.height > params.clientHeight) {
    fixPos = {
      x: fitPoint(params.left, params.width, params.clientWidth),
      y: fitPoint(params.top, params.height, params.clientHeight)
    };
  }
  return fixPos;
}
function getOffset(node) {
  const box = node.getBoundingClientRect();
  const docElem = document.documentElement;
  return {
    left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || document.body.clientLeft || 0),
    top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || document.body.clientTop || 0)
  };
}
function getClientSize() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height
  };
}
function fitPoint(start, size, clientSize) {
  const startAddSize = start + size;
  const offsetStart = (size - clientSize) / 2;
  let distance = null;
  if (size > clientSize) {
    if (start > 0) {
      distance = offsetStart;
    }
    if (start < 0 && startAddSize < clientSize) {
      distance = -offsetStart;
    }
  } else {
    if (start < 0 || startAddSize > clientSize) {
      distance = start < 0 ? offsetStart : -offsetStart;
    }
  }
  return distance;
}
var initialPosition = {
  x: 0,
  y: 0
};
var NZ_DEFAULT_SCALE_STEP = 0.5;
var NZ_DEFAULT_ZOOM = 1;
var NZ_DEFAULT_ROTATE = 0;
var NzImagePreviewComponent = class _NzImagePreviewComponent {
  document = inject(DOCUMENT);
  ngZone = inject(NgZone);
  cdr = inject(ChangeDetectorRef);
  nzConfigService = inject(NzConfigService);
  config = inject(NzImagePreviewOptions);
  sanitizer = inject(DomSanitizer);
  destroyRef = inject(DestroyRef);
  _defaultNzZoom = NZ_DEFAULT_ZOOM;
  _defaultNzScaleStep = NZ_DEFAULT_SCALE_STEP;
  _defaultNzRotate = NZ_DEFAULT_ROTATE;
  images = [];
  index = 0;
  isDragging = false;
  visible = true;
  animationStateChanged = new EventEmitter();
  scaleStepMap = /* @__PURE__ */ new Map();
  previewImageTransform = "";
  previewImageWrapperTransform = "";
  operations = [{
    icon: "close",
    onClick: () => {
      this.onClose();
    },
    type: "close"
  }, {
    icon: "zoom-in",
    onClick: () => {
      this.onZoomIn();
    },
    type: "zoomIn"
  }, {
    icon: "zoom-out",
    onClick: () => {
      this.onZoomOut();
    },
    type: "zoomOut"
  }, {
    icon: "rotate-right",
    onClick: () => {
      this.onRotateRight();
    },
    type: "rotateRight"
  }, {
    icon: "rotate-left",
    onClick: () => {
      this.onRotateLeft();
    },
    type: "rotateLeft"
  }, {
    icon: "swap",
    onClick: () => {
      this.onHorizontalFlip();
    },
    type: "flipHorizontally"
  }, {
    icon: "swap",
    onClick: () => {
      this.onVerticalFlip();
    },
    type: "flipVertically",
    rotate: 90
  }];
  zoomOutDisabled = false;
  position = __spreadValues({}, initialPosition);
  previewRef;
  closeClick = new EventEmitter();
  imageRef;
  imagePreviewWrapper;
  zoom = this.config.nzZoom ?? this._defaultNzZoom;
  rotate = this.config.nzRotate ?? this._defaultNzRotate;
  scaleStep = this.config.nzScaleStep ?? this._defaultNzScaleStep;
  flipHorizontally = this.config.nzFlipHorizontally ?? false;
  flipVertically = this.config.nzFlipVertically ?? false;
  get animationDisabled() {
    return this.config.nzNoAnimation ?? false;
  }
  get maskClosable() {
    const defaultConfig = this.nzConfigService.getConfigForComponent(NZ_CONFIG_MODULE_NAME$1) || {};
    return this.config.nzMaskClosable ?? defaultConfig.nzMaskClosable ?? true;
  }
  constructor() {
    this.updateZoomOutDisabled();
    this.updatePreviewImageTransform();
    this.updatePreviewImageWrapperTransform();
  }
  ngOnInit() {
    fromEventOutsideAngular(this.imagePreviewWrapper.nativeElement, "mousedown").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isDragging = true;
    });
    fromEventOutsideAngular(this.imagePreviewWrapper.nativeElement, "wheel").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.ngZone.run(() => this.wheelZoomEventHandler(event));
    });
    fromEventOutsideAngular(this.document, "keydown").pipe(filter((event) => event.keyCode === ESCAPE), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.ngZone.run(() => {
        this.onClose();
        this.markForCheck();
      });
    });
  }
  setImages(images, scaleStepMap) {
    if (scaleStepMap) this.scaleStepMap = scaleStepMap;
    this.images = images;
    this.markForCheck();
  }
  switchTo(index) {
    this.index = index;
    this.markForCheck();
  }
  next() {
    if (this.index < this.images.length - 1) {
      this.reset();
      this.index++;
      this.updatePreviewImageTransform();
      this.updatePreviewImageWrapperTransform();
      this.updateZoomOutDisabled();
      this.markForCheck();
    }
  }
  prev() {
    if (this.index > 0) {
      this.reset();
      this.index--;
      this.updatePreviewImageTransform();
      this.updatePreviewImageWrapperTransform();
      this.updateZoomOutDisabled();
      this.markForCheck();
    }
  }
  markForCheck() {
    this.cdr.markForCheck();
  }
  onClose() {
    this.visible = false;
    this.closeClick.emit();
  }
  onZoomIn() {
    const zoomStep = this.scaleStepMap.get(this.images[this.index].src ?? this.images[this.index].srcset) ?? this.scaleStep;
    this.zoom += zoomStep;
    this.updatePreviewImageTransform();
    this.updateZoomOutDisabled();
  }
  onZoomOut() {
    if (this.zoom > 1) {
      const zoomStep = this.scaleStepMap.get(this.images[this.index].src ?? this.images[this.index].srcset) ?? this.scaleStep;
      this.zoom -= zoomStep;
      this.updatePreviewImageTransform();
      this.updateZoomOutDisabled();
      if (this.zoom <= 1) {
        this.reCenterImage();
      }
    }
  }
  onRotateRight() {
    this.rotate += 90;
    this.updatePreviewImageTransform();
  }
  onRotateLeft() {
    this.rotate -= 90;
    this.updatePreviewImageTransform();
  }
  onSwitchLeft(event) {
    event.preventDefault();
    event.stopPropagation();
    this.prev();
  }
  onSwitchRight(event) {
    event.preventDefault();
    event.stopPropagation();
    this.next();
  }
  onHorizontalFlip() {
    this.flipHorizontally = !this.flipHorizontally;
    this.updatePreviewImageTransform();
  }
  onVerticalFlip() {
    this.flipVertically = !this.flipVertically;
    this.updatePreviewImageTransform();
  }
  wheelZoomEventHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this.handlerImageTransformationWhileZoomingWithMouse(event, event.deltaY);
    this.handleImageScaleWhileZoomingWithMouse(event.deltaY);
    this.updatePreviewImageWrapperTransform();
    this.updatePreviewImageTransform();
    this.markForCheck();
  }
  onAnimationStart(event) {
    this.animationStateChanged.emit(event);
  }
  onAnimationDone(event) {
    this.animationStateChanged.emit(event);
  }
  onDragEnd(event) {
    this.isDragging = false;
    const width = this.imageRef.nativeElement.offsetWidth * this.zoom;
    const height = this.imageRef.nativeElement.offsetHeight * this.zoom;
    const {
      left,
      top
    } = getOffset(this.imageRef.nativeElement);
    const {
      width: clientWidth,
      height: clientHeight
    } = getClientSize();
    const isRotate = this.rotate % 180 !== 0;
    const fitContentParams = {
      width: isRotate ? height : width,
      height: isRotate ? width : height,
      left,
      top,
      clientWidth,
      clientHeight
    };
    const fitContentPos = getFitContentPosition(fitContentParams);
    if (isNotNil(fitContentPos.x) || isNotNil(fitContentPos.y)) {
      this.position = __spreadValues(__spreadValues({}, this.position), fitContentPos);
    } else if (!isNotNil(fitContentPos.x) && !isNotNil(fitContentPos.y)) {
      this.position = {
        x: event.source.getFreeDragPosition().x,
        y: event.source.getFreeDragPosition().y
      };
    }
  }
  sanitizerResourceUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  updatePreviewImageTransform() {
    this.previewImageTransform = `scale3d(${this.zoom * (this.flipHorizontally ? -1 : 1)}, ${this.zoom * (this.flipVertically ? -1 : 1)}, 1) rotate(${this.rotate}deg)`;
  }
  updatePreviewImageWrapperTransform() {
    this.previewImageWrapperTransform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
  }
  updateZoomOutDisabled() {
    this.zoomOutDisabled = this.zoom <= 1;
  }
  handlerImageTransformationWhileZoomingWithMouse(event, deltaY) {
    let scaleValue;
    const imageElement = this.imageRef.nativeElement;
    const elementTransform = getComputedStyle(imageElement).transform;
    const matrixValue = elementTransform.match(/matrix.*\((.+)\)/);
    if (matrixValue) {
      scaleValue = +matrixValue[1].split(", ")[0];
    } else {
      scaleValue = this.zoom;
    }
    const x = (event.clientX - imageElement.getBoundingClientRect().x) / scaleValue;
    const y = (event.clientY - imageElement.getBoundingClientRect().y) / scaleValue;
    const halfOfScaleStepValue = deltaY < 0 ? this.scaleStep / 2 : -this.scaleStep / 2;
    this.position.x += -x * halfOfScaleStepValue * 2 + imageElement.offsetWidth * halfOfScaleStepValue;
    this.position.y += -y * halfOfScaleStepValue * 2 + imageElement.offsetHeight * halfOfScaleStepValue;
  }
  handleImageScaleWhileZoomingWithMouse(deltaY) {
    if (this.isZoomedInWithMouseWheel(deltaY)) {
      this.onZoomIn();
    } else {
      this.onZoomOut();
    }
    if (this.zoom <= 1) {
      this.reCenterImage();
    }
  }
  isZoomedInWithMouseWheel(delta) {
    return delta < 0;
  }
  reset() {
    this.zoom = this.config.nzZoom ?? this._defaultNzZoom;
    this.scaleStep = this.config.nzScaleStep ?? this._defaultNzScaleStep;
    this.rotate = this.config.nzRotate ?? this._defaultNzRotate;
    this.flipHorizontally = false;
    this.flipVertically = false;
    this.reCenterImage();
  }
  reCenterImage() {
    this.position = __spreadValues({}, initialPosition);
  }
  static ɵfac = function NzImagePreviewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzImagePreviewComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzImagePreviewComponent,
    selectors: [["nz-image-preview"]],
    viewQuery: function NzImagePreviewComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 5);
        ɵɵviewQuery(_c2, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.imageRef = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.imagePreviewWrapper = _t.first);
      }
    },
    hostAttrs: [1, "ant-image-preview-root"],
    hostVars: 6,
    hostBindings: function NzImagePreviewComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵsyntheticHostListener("@fadeMotion.start", function NzImagePreviewComponent_animation_fadeMotion_start_HostBindingHandler($event) {
          return ctx.onAnimationStart($event);
        })("@fadeMotion.done", function NzImagePreviewComponent_animation_fadeMotion_done_HostBindingHandler($event) {
          return ctx.onAnimationDone($event);
        });
      }
      if (rf & 2) {
        ɵɵsyntheticHostProperty("@.disabled", ctx.config.nzNoAnimation)("@fadeMotion", ctx.visible ? "enter" : "leave");
        ɵɵstyleProp("z-index", ctx.config.nzZIndex);
        ɵɵclassProp("ant-image-preview-moving", ctx.isDragging);
      }
    },
    exportAs: ["nzImagePreview"],
    decls: 17,
    vars: 5,
    consts: [["imagePreviewWrapper", ""], ["imgRef", ""], [1, "ant-image-preview-mask"], [1, "ant-image-preview-operations-wrapper"], [1, "ant-image-preview-operations"], [1, "ant-image-preview-operations-progress"], [1, "ant-image-preview-operations-operation", 3, "ant-image-preview-operations-operation-disabled"], ["tabindex", "-1", 1, "ant-image-preview-wrap", 3, "click"], ["role", "dialog", "aria-modal", "true", 1, "ant-image-preview"], ["tabindex", "0", "aria-hidden", "true", 1, "ant-image-preview-focus-trap"], [1, "ant-image-preview-content"], [1, "ant-image-preview-body"], ["cdkDrag", "", 1, "ant-image-preview-img-wrapper", 3, "cdkDragEnded", "cdkDragFreeDragPosition"], [1, "ant-image-preview-switch-left", 3, "click"], ["nzType", "left", "nzTheme", "outline"], [1, "ant-image-preview-switch-right", 3, "click"], ["nzType", "right", "nzTheme", "outline"], [1, "ant-image-preview-operations-operation", 3, "click"], ["nzTheme", "outline", 1, "ant-image-preview-operations-icon", 3, "nzType", "nzRotate"], ["cdkDragHandle", "", 1, "ant-image-preview-img", 3, "width", "height", "transform"], ["cdkDragHandle", "", 1, "ant-image-preview-img"]],
    template: function NzImagePreviewComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelement(0, "div", 2);
        ɵɵelementStart(1, "div", 3);
        ɵɵconditionalCreate(2, NzImagePreviewComponent_Conditional_2_Template, 4, 4);
        ɵɵelementStart(3, "ul", 4);
        ɵɵconditionalCreate(4, NzImagePreviewComponent_Conditional_4_Template, 2, 2, "li", 5);
        ɵɵrepeaterCreate(5, NzImagePreviewComponent_For_6_Template, 2, 4, "li", 6, ɵɵrepeaterTrackByIdentity);
        ɵɵelementEnd()();
        ɵɵelementStart(7, "div", 7);
        ɵɵlistener("click", function NzImagePreviewComponent_Template_div_click_7_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.maskClosable && $event.target === $event.currentTarget && ctx.onClose());
        });
        ɵɵelementStart(8, "div", 8);
        ɵɵelement(9, "div", 9);
        ɵɵelementStart(10, "div", 10)(11, "div", 11)(12, "div", 12, 0);
        ɵɵlistener("cdkDragEnded", function NzImagePreviewComponent_Template_div_cdkDragEnded_12_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onDragEnd($event));
        });
        ɵɵrepeaterCreate(14, NzImagePreviewComponent_For_15_Template, 1, 1, null, null, ɵɵrepeaterTrackByIdentity);
        ɵɵelementEnd()()();
        ɵɵelement(16, "div", 9);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵadvance(2);
        ɵɵconditional(ctx.images.length > 1 ? 2 : -1);
        ɵɵadvance(2);
        ɵɵconditional(ctx.images.length > 1 ? 4 : -1);
        ɵɵadvance();
        ɵɵrepeater(ctx.operations);
        ɵɵadvance(7);
        ɵɵstyleProp("transform", ctx.previewImageWrapperTransform);
        ɵɵproperty("cdkDragFreeDragPosition", ctx.position);
        ɵɵadvance(2);
        ɵɵrepeater(ctx.images);
      }
    },
    dependencies: [NzIconModule, NzIconDirective, CdkDragHandle, CdkDrag],
    encapsulation: 2,
    data: {
      animation: [fadeMotion]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzImagePreviewComponent, [{
    type: Component,
    args: [{
      selector: "nz-image-preview",
      exportAs: "nzImagePreview",
      animations: [fadeMotion],
      template: `
    <div class="ant-image-preview-mask"></div>

    <div class="ant-image-preview-operations-wrapper">
      @if (images.length > 1) {
        <div
          class="ant-image-preview-switch-left"
          [class.ant-image-preview-switch-left-disabled]="index <= 0"
          (click)="onSwitchLeft($event)"
        >
          <nz-icon nzType="left" nzTheme="outline" />
        </div>
        <div
          class="ant-image-preview-switch-right"
          [class.ant-image-preview-switch-right-disabled]="index >= images.length - 1"
          (click)="onSwitchRight($event)"
        >
          <nz-icon nzType="right" nzTheme="outline" />
        </div>
      }

      <ul class="ant-image-preview-operations">
        @if (images.length > 1) {
          <li class="ant-image-preview-operations-progress">{{ index + 1 }} / {{ images.length }}</li>
        }

        @for (option of operations; track option) {
          <li
            class="ant-image-preview-operations-operation"
            [class.ant-image-preview-operations-operation-disabled]="zoomOutDisabled && option.type === 'zoomOut'"
            (click)="option.onClick()"
          >
            <nz-icon
              class="ant-image-preview-operations-icon"
              [nzType]="option.icon"
              [nzRotate]="option.rotate ?? 0"
              nzTheme="outline"
            />
          </li>
        }
      </ul>
    </div>

    <div
      class="ant-image-preview-wrap"
      tabindex="-1"
      (click)="maskClosable && $event.target === $event.currentTarget && onClose()"
    >
      <div class="ant-image-preview" role="dialog" aria-modal="true">
        <div tabindex="0" aria-hidden="true" class="ant-image-preview-focus-trap"></div>
        <div class="ant-image-preview-content">
          <div class="ant-image-preview-body">
            <div
              class="ant-image-preview-img-wrapper"
              #imagePreviewWrapper
              cdkDrag
              [style.transform]="previewImageWrapperTransform"
              [cdkDragFreeDragPosition]="position"
              (cdkDragEnded)="onDragEnd($event)"
            >
              @for (image of images; track image; let imageIndex = $index) {
                @if (imageIndex === index) {
                  <img
                    cdkDragHandle
                    class="ant-image-preview-img"
                    #imgRef
                    [attr.src]="sanitizerResourceUrl(image.src)"
                    [attr.srcset]="image.srcset"
                    [attr.alt]="image.alt"
                    [style.width]="image.width"
                    [style.height]="image.height"
                    [style.transform]="previewImageTransform"
                  />
                }
              }
            </div>
          </div>
        </div>
        <div tabindex="0" aria-hidden="true" class="ant-image-preview-focus-trap"></div>
      </div>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-image-preview-root",
        "[class.ant-image-preview-moving]": "isDragging",
        "[style.zIndex]": "config.nzZIndex",
        "[@.disabled]": "config.nzNoAnimation",
        "[@fadeMotion]": `visible ? 'enter' : 'leave'`,
        "(@fadeMotion.start)": "onAnimationStart($event)",
        "(@fadeMotion.done)": "onAnimationDone($event)"
      },
      imports: [NzIconModule, CdkDragHandle, CdkDrag]
    }]
  }], () => [], {
    imageRef: [{
      type: ViewChild,
      args: ["imgRef"]
    }],
    imagePreviewWrapper: [{
      type: ViewChild,
      args: ["imagePreviewWrapper", {
        static: true
      }]
    }]
  });
})();
var NzImagePreviewRef = class {
  previewInstance;
  config;
  overlayRef;
  destroy$ = new Subject();
  constructor(previewInstance, config, overlayRef) {
    this.previewInstance = previewInstance;
    this.config = config;
    this.overlayRef = overlayRef;
    overlayRef.keydownEvents().pipe(filter((event) => this.config.nzKeyboard && (event.keyCode === ESCAPE || event.keyCode === LEFT_ARROW || event.keyCode === RIGHT_ARROW) && !hasModifierKey(event))).subscribe((event) => {
      event.preventDefault();
      if (event.keyCode === ESCAPE) {
        previewInstance.onClose();
      }
      if (event.keyCode === LEFT_ARROW) {
        this.prev();
      }
      if (event.keyCode === RIGHT_ARROW) {
        this.next();
      }
    });
    overlayRef.detachments().subscribe(() => {
      this.overlayRef.dispose();
    });
    previewInstance.closeClick.pipe(take(1), switchMap(() => previewInstance.animationStateChanged), filter((event) => event.phaseName === "done"), takeUntil(this.destroy$)).subscribe(() => {
      this.close();
    });
  }
  switchTo(index) {
    this.previewInstance.switchTo(index);
  }
  next() {
    this.previewInstance.next();
  }
  prev() {
    this.previewInstance.prev();
  }
  close() {
    this.destroy$.next();
    this.overlayRef.dispose();
  }
};
var NzImageService = class _NzImageService {
  overlay = inject(Overlay);
  injector = inject(Injector);
  nzConfigService = inject(NzConfigService);
  directionality = inject(Directionality);
  preview(images, options, zoomMap) {
    return this.display(images, options, zoomMap);
  }
  display(images, config, scaleStepMap) {
    const configMerged = __spreadValues(__spreadValues({}, new NzImagePreviewOptions()), config ?? {});
    const overlayRef = this.createOverlay(configMerged);
    const previewComponent = this.attachPreviewComponent(overlayRef, configMerged);
    previewComponent.setImages(images, scaleStepMap);
    const previewRef = new NzImagePreviewRef(previewComponent, configMerged, overlayRef);
    previewComponent.previewRef = previewRef;
    return previewRef;
  }
  attachPreviewComponent(overlayRef, config) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [{
        provide: OverlayRef,
        useValue: overlayRef
      }, {
        provide: NzImagePreviewOptions,
        useValue: config
      }]
    });
    const containerPortal = new ComponentPortal(NzImagePreviewComponent, null, injector);
    const containerRef = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }
  createOverlay(config) {
    const globalConfig = this.nzConfigService.getConfigForComponent(NZ_CONFIG_MODULE_NAME$1) || {};
    const overLayConfig = new OverlayConfig({
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global(),
      disposeOnNavigation: config.nzCloseOnNavigation ?? globalConfig.nzCloseOnNavigation ?? true,
      direction: config.nzDirection || globalConfig.nzDirection || this.directionality.value
    });
    return this.overlay.create(overLayConfig);
  }
  static ɵfac = function NzImageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzImageService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NzImageService,
    factory: _NzImageService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzImageService, [{
    type: Injectable
  }], null, null);
})();
var NZ_CONFIG_MODULE_NAME = "image";
var NzImageDirective = (() => {
  var _a;
  let _nzDisablePreview_decorators;
  let _nzDisablePreview_initializers = [];
  let _nzDisablePreview_extraInitializers = [];
  let _nzFallback_decorators;
  let _nzFallback_initializers = [];
  let _nzFallback_extraInitializers = [];
  let _nzPlaceholder_decorators;
  let _nzPlaceholder_initializers = [];
  let _nzPlaceholder_extraInitializers = [];
  let _nzScaleStep_decorators;
  let _nzScaleStep_initializers = [];
  let _nzScaleStep_extraInitializers = [];
  return _a = class {
    document = inject(DOCUMENT);
    nzConfigService = inject(NzConfigService);
    elementRef = inject(ElementRef);
    nzImageService = inject(NzImageService);
    cdr = inject(ChangeDetectorRef);
    directionality = inject(Directionality);
    destroyRef = inject(DestroyRef);
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    nzSrc = "";
    nzSrcset = "";
    nzDisablePreview = __runInitializers(this, _nzDisablePreview_initializers, false);
    nzFallback = (__runInitializers(this, _nzDisablePreview_extraInitializers), __runInitializers(this, _nzFallback_initializers, null));
    nzPlaceholder = (__runInitializers(this, _nzFallback_extraInitializers), __runInitializers(this, _nzPlaceholder_initializers, null));
    nzScaleStep = (__runInitializers(this, _nzPlaceholder_extraInitializers), __runInitializers(this, _nzScaleStep_initializers, null));
    dir = __runInitializers(this, _nzScaleStep_extraInitializers);
    backLoadImage;
    status = "normal";
    backLoadDestroy$ = new Subject();
    parentGroup = inject(NzImageGroupComponent, {
      optional: true
    });
    get previewable() {
      return !this.nzDisablePreview && this.status !== "error";
    }
    ngOnInit() {
      this.backLoad();
      if (this.parentGroup) {
        this.parentGroup.addImage(this);
      }
      if (this.directionality) {
        this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
          this.dir = direction;
          this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
      }
    }
    onPreview() {
      if (!this.previewable) {
        return;
      }
      if (this.parentGroup) {
        const previewAbleImages = this.parentGroup.images.filter((e) => e.previewable);
        const previewImages = previewAbleImages.map((e) => ({
          src: e.nzSrc,
          srcset: e.nzSrcset
        }));
        const previewIndex = previewAbleImages.findIndex((el) => this === el);
        const scaleStepMap = /* @__PURE__ */ new Map();
        previewAbleImages.forEach((imageDirective) => {
          scaleStepMap.set(imageDirective.nzSrc ?? imageDirective.nzSrcset, imageDirective.nzScaleStep ?? this.parentGroup.nzScaleStep ?? this.nzScaleStep ?? NZ_DEFAULT_SCALE_STEP);
        });
        const previewRef = this.nzImageService.preview(previewImages, {
          nzDirection: this.dir
        }, scaleStepMap);
        previewRef.switchTo(previewIndex);
      } else {
        const previewImages = [{
          src: this.nzSrc,
          srcset: this.nzSrcset
        }];
        this.nzImageService.preview(previewImages, {
          nzDirection: this.dir,
          nzScaleStep: this.nzScaleStep ?? NZ_DEFAULT_SCALE_STEP
        });
      }
    }
    getElement() {
      return this.elementRef;
    }
    ngOnChanges(changes) {
      const {
        nzSrc
      } = changes;
      if (nzSrc) {
        this.getElement().nativeElement.src = nzSrc.currentValue;
        this.backLoad();
      }
    }
    /**
     * use internal Image object handle fallback & placeholder
     *
     * @private
     */
    backLoad() {
      this.backLoadImage = this.document.createElement("img");
      this.backLoadImage.src = this.nzSrc;
      this.backLoadImage.srcset = this.nzSrcset;
      this.status = "loading";
      this.backLoadDestroy$.next();
      this.backLoadDestroy$.complete();
      this.backLoadDestroy$ = new Subject();
      if (this.backLoadImage.complete) {
        this.status = "normal";
        this.getElement().nativeElement.src = this.nzSrc;
        this.getElement().nativeElement.srcset = this.nzSrcset;
      } else {
        if (this.nzPlaceholder) {
          this.getElement().nativeElement.src = this.nzPlaceholder;
          this.getElement().nativeElement.srcset = "";
        } else {
          this.getElement().nativeElement.src = this.nzSrc;
          this.getElement().nativeElement.srcset = this.nzSrcset;
        }
        fromEvent(this.backLoadImage, "load").pipe(takeUntil(this.backLoadDestroy$), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.status = "normal";
          this.getElement().nativeElement.src = this.nzSrc;
          this.getElement().nativeElement.srcset = this.nzSrcset;
        });
        fromEvent(this.backLoadImage, "error").pipe(takeUntil(this.backLoadDestroy$), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.status = "error";
          if (this.nzFallback) {
            this.getElement().nativeElement.src = this.nzFallback;
            this.getElement().nativeElement.srcset = "";
          }
        });
      }
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _nzDisablePreview_decorators = [WithConfig()];
    _nzFallback_decorators = [WithConfig()];
    _nzPlaceholder_decorators = [WithConfig()];
    _nzScaleStep_decorators = [WithConfig()];
    __esDecorate(null, null, _nzDisablePreview_decorators, {
      kind: "field",
      name: "nzDisablePreview",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzDisablePreview" in obj,
        get: (obj) => obj.nzDisablePreview,
        set: (obj, value) => {
          obj.nzDisablePreview = value;
        }
      },
      metadata: _metadata
    }, _nzDisablePreview_initializers, _nzDisablePreview_extraInitializers);
    __esDecorate(null, null, _nzFallback_decorators, {
      kind: "field",
      name: "nzFallback",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzFallback" in obj,
        get: (obj) => obj.nzFallback,
        set: (obj, value) => {
          obj.nzFallback = value;
        }
      },
      metadata: _metadata
    }, _nzFallback_initializers, _nzFallback_extraInitializers);
    __esDecorate(null, null, _nzPlaceholder_decorators, {
      kind: "field",
      name: "nzPlaceholder",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzPlaceholder" in obj,
        get: (obj) => obj.nzPlaceholder,
        set: (obj, value) => {
          obj.nzPlaceholder = value;
        }
      },
      metadata: _metadata
    }, _nzPlaceholder_initializers, _nzPlaceholder_extraInitializers);
    __esDecorate(null, null, _nzScaleStep_decorators, {
      kind: "field",
      name: "nzScaleStep",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzScaleStep" in obj,
        get: (obj) => obj.nzScaleStep,
        set: (obj, value) => {
          obj.nzScaleStep = value;
        }
      },
      metadata: _metadata
    }, _nzScaleStep_initializers, _nzScaleStep_extraInitializers);
    if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _metadata
    });
  })(), __publicField(_a, "ɵfac", function NzImageDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵdir", ɵɵdefineDirective({
    type: _a,
    selectors: [["img", "nz-image", ""]],
    hostBindings: function NzImageDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function NzImageDirective_click_HostBindingHandler() {
          return ctx.onPreview();
        });
      }
    },
    inputs: {
      nzSrc: "nzSrc",
      nzSrcset: "nzSrcset",
      nzDisablePreview: [2, "nzDisablePreview", "nzDisablePreview", booleanAttribute],
      nzFallback: "nzFallback",
      nzPlaceholder: "nzPlaceholder",
      nzScaleStep: "nzScaleStep"
    },
    exportAs: ["nzImage"],
    features: [ɵɵNgOnChangesFeature]
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzImageDirective, [{
    type: Directive,
    args: [{
      selector: "img[nz-image]",
      exportAs: "nzImage",
      host: {
        "(click)": "onPreview()"
      }
    }]
  }], null, {
    nzSrc: [{
      type: Input
    }],
    nzSrcset: [{
      type: Input
    }],
    nzDisablePreview: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzFallback: [{
      type: Input
    }],
    nzPlaceholder: [{
      type: Input
    }],
    nzScaleStep: [{
      type: Input
    }]
  });
})();
var NzImageModule = class _NzImageModule {
  static ɵfac = function NzImageModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzImageModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzImageModule,
    imports: [NzImageDirective, NzImagePreviewComponent, NzImageGroupComponent],
    exports: [NzImageDirective, NzImagePreviewComponent, NzImageGroupComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [NzImageService],
    imports: [NzImagePreviewComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzImageModule, [{
    type: NgModule,
    args: [{
      imports: [NzImageDirective, NzImagePreviewComponent, NzImageGroupComponent],
      exports: [NzImageDirective, NzImagePreviewComponent, NzImageGroupComponent],
      providers: [NzImageService]
    }]
  }], null, null);
})();
export {
  NZ_CONFIG_MODULE_NAME$1 as NZ_CONFIG_MODULE_NAME,
  NZ_DEFAULT_SCALE_STEP,
  NzImageDirective,
  NzImageGroupComponent,
  NzImageModule,
  NzImagePreviewComponent,
  NzImagePreviewOptions,
  NzImagePreviewRef,
  NzImageService,
  getClientSize,
  getFitContentPosition,
  getOffset
};
//# sourceMappingURL=ng-zorro-antd_image.js.map
