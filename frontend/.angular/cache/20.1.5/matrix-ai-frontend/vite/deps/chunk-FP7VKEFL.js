import {
  NzIconDirective,
  NzIconModule
} from "./chunk-TQ5FZKYH.js";
import {
  WithConfig
} from "./chunk-GQBHIW5X.js";
import {
  toCssPixel
} from "./chunk-MKTFS3GT.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  afterEveryRender,
  inject,
  input,
  numberAttribute,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  __esDecorate,
  __runInitializers
} from "./chunk-JU3XS6KG.js";
import {
  __publicField
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-avatar.mjs
var _c0 = ["textEl"];
var _c1 = ["*"];
function NzAvatarComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzType", ctx_r0.nzIcon);
  }
}
function NzAvatarComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "img", 4);
    ɵɵlistener("error", function NzAvatarComponent_Conditional_1_Template_img_error_0_listener($event) {
      ɵɵrestoreView(_r2);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.imgError($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("src", ctx_r0.nzSrc, ɵɵsanitizeUrl);
    ɵɵattribute("srcset", ctx_r0.nzSrcSet)("alt", ctx_r0.nzAlt)("loading", ctx_r0.nzLoading() || "eager")("fetchpriority", ctx_r0.nzFetchPriority() || "auto");
  }
}
function NzAvatarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 3, 0);
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.nzText);
  }
}
var NZ_CONFIG_MODULE_NAME = "avatar";
var NzAvatarComponent = (() => {
  var _a;
  let _nzShape_decorators;
  let _nzShape_initializers = [];
  let _nzShape_extraInitializers = [];
  let _nzSize_decorators;
  let _nzSize_initializers = [];
  let _nzSize_extraInitializers = [];
  let _nzGap_decorators;
  let _nzGap_initializers = [];
  let _nzGap_extraInitializers = [];
  return _a = class {
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    nzShape = __runInitializers(this, _nzShape_initializers, "circle");
    nzSize = (__runInitializers(this, _nzShape_extraInitializers), __runInitializers(this, _nzSize_initializers, "default"));
    nzGap = (__runInitializers(this, _nzSize_extraInitializers), __runInitializers(this, _nzGap_initializers, 4));
    nzText = __runInitializers(this, _nzGap_extraInitializers);
    nzSrc;
    nzSrcSet;
    nzAlt;
    nzIcon;
    nzLoading = input(...ngDevMode ? [void 0, {
      debugName: "nzLoading"
    }] : []);
    nzFetchPriority = input(...ngDevMode ? [void 0, {
      debugName: "nzFetchPriority"
    }] : []);
    nzError = new EventEmitter();
    hasText = false;
    hasSrc = true;
    hasIcon = false;
    customSize = null;
    textEl;
    el = inject(ElementRef).nativeElement;
    cdr = inject(ChangeDetectorRef);
    constructor() {
      afterEveryRender(() => this.calcStringSize());
    }
    imgError(event) {
      this.nzError.emit(event);
      if (!event.defaultPrevented) {
        this.hasSrc = false;
        this.hasIcon = false;
        this.hasText = false;
        if (this.nzIcon) {
          this.hasIcon = true;
        } else if (this.nzText) {
          this.hasText = true;
        }
        this.cdr.detectChanges();
        this.setSizeStyle();
        this.calcStringSize();
      }
    }
    ngOnChanges() {
      this.hasText = !this.nzSrc && !!this.nzText;
      this.hasIcon = !this.nzSrc && !!this.nzIcon;
      this.hasSrc = !!this.nzSrc;
      this.setSizeStyle();
      this.calcStringSize();
    }
    calcStringSize() {
      if (!this.hasText || !this.textEl) {
        return;
      }
      const textEl = this.textEl.nativeElement;
      const childrenWidth = textEl.offsetWidth;
      const avatarWidth = this.el.getBoundingClientRect?.().width ?? 0;
      const offset = this.nzGap * 2 < avatarWidth ? this.nzGap * 2 : 8;
      const scale = avatarWidth - offset < childrenWidth ? (avatarWidth - offset) / childrenWidth : 1;
      textEl.style.transform = `scale(${scale}) translateX(-50%)`;
      textEl.style.lineHeight = this.customSize || "";
    }
    setSizeStyle() {
      if (typeof this.nzSize === "number") {
        this.customSize = toCssPixel(this.nzSize);
      } else {
        this.customSize = null;
      }
      this.cdr.markForCheck();
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _nzShape_decorators = [WithConfig()];
    _nzSize_decorators = [WithConfig()];
    _nzGap_decorators = [WithConfig()];
    __esDecorate(null, null, _nzShape_decorators, {
      kind: "field",
      name: "nzShape",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzShape" in obj,
        get: (obj) => obj.nzShape,
        set: (obj, value) => {
          obj.nzShape = value;
        }
      },
      metadata: _metadata
    }, _nzShape_initializers, _nzShape_extraInitializers);
    __esDecorate(null, null, _nzSize_decorators, {
      kind: "field",
      name: "nzSize",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzSize" in obj,
        get: (obj) => obj.nzSize,
        set: (obj, value) => {
          obj.nzSize = value;
        }
      },
      metadata: _metadata
    }, _nzSize_initializers, _nzSize_extraInitializers);
    __esDecorate(null, null, _nzGap_decorators, {
      kind: "field",
      name: "nzGap",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzGap" in obj,
        get: (obj) => obj.nzGap,
        set: (obj, value) => {
          obj.nzGap = value;
        }
      },
      metadata: _metadata
    }, _nzGap_initializers, _nzGap_extraInitializers);
    if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _metadata
    });
  })(), __publicField(_a, "ɵfac", function NzAvatarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵcmp", ɵɵdefineComponent({
    type: _a,
    selectors: [["nz-avatar"]],
    viewQuery: function NzAvatarComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.textEl = _t.first);
      }
    },
    hostAttrs: [1, "ant-avatar"],
    hostVars: 20,
    hostBindings: function NzAvatarComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleProp("width", ctx.customSize)("height", ctx.customSize)("line-height", ctx.customSize)("font-size", ctx.hasIcon && ctx.customSize ? ctx.nzSize / 2 : null, "px");
        ɵɵclassProp("ant-avatar-lg", ctx.nzSize === "large")("ant-avatar-sm", ctx.nzSize === "small")("ant-avatar-square", ctx.nzShape === "square")("ant-avatar-circle", ctx.nzShape === "circle")("ant-avatar-icon", ctx.nzIcon)("ant-avatar-image", ctx.hasSrc);
      }
    },
    inputs: {
      nzShape: "nzShape",
      nzSize: "nzSize",
      nzGap: [2, "nzGap", "nzGap", numberAttribute],
      nzText: "nzText",
      nzSrc: "nzSrc",
      nzSrcSet: "nzSrcSet",
      nzAlt: "nzAlt",
      nzIcon: "nzIcon",
      nzLoading: [1, "nzLoading"],
      nzFetchPriority: [1, "nzFetchPriority"]
    },
    outputs: {
      nzError: "nzError"
    },
    exportAs: ["nzAvatar"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c1,
    decls: 4,
    vars: 1,
    consts: [["textEl", ""], [3, "nzType"], [3, "src"], [1, "ant-avatar-string"], [3, "error", "src"]],
    template: function NzAvatarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, NzAvatarComponent_Conditional_0_Template, 1, 1, "nz-icon", 1)(1, NzAvatarComponent_Conditional_1_Template, 1, 5, "img", 2)(2, NzAvatarComponent_Conditional_2_Template, 3, 1, "span", 3);
        ɵɵprojection(3);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.nzIcon && ctx.hasIcon ? 0 : ctx.nzSrc && ctx.hasSrc ? 1 : ctx.nzText && ctx.hasText ? 2 : -1);
      }
    },
    dependencies: [NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzAvatarComponent, [{
    type: Component,
    args: [{
      selector: "nz-avatar",
      exportAs: "nzAvatar",
      imports: [NzIconModule],
      template: `
    @if (nzIcon && hasIcon) {
      <nz-icon [nzType]="nzIcon" />
    } @else if (nzSrc && hasSrc) {
      <img
        [src]="nzSrc"
        [attr.srcset]="nzSrcSet"
        [attr.alt]="nzAlt"
        [attr.loading]="nzLoading() || 'eager'"
        [attr.fetchpriority]="nzFetchPriority() || 'auto'"
        (error)="imgError($event)"
      />
    } @else if (nzText && hasText) {
      <span class="ant-avatar-string" #textEl>{{ nzText }}</span>
    }
    <ng-content></ng-content>
  `,
      host: {
        class: "ant-avatar",
        "[class.ant-avatar-lg]": `nzSize === 'large'`,
        "[class.ant-avatar-sm]": `nzSize === 'small'`,
        "[class.ant-avatar-square]": `nzShape === 'square'`,
        "[class.ant-avatar-circle]": `nzShape === 'circle'`,
        "[class.ant-avatar-icon]": `nzIcon`,
        "[class.ant-avatar-image]": `hasSrc `,
        "[style.width]": "customSize",
        "[style.height]": "customSize",
        "[style.line-height]": "customSize",
        // nzSize type is number when customSize is true
        "[style.font-size.px]": "(hasIcon && customSize) ? $any(nzSize) / 2 : null"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], () => [], {
    nzShape: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    nzGap: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzText: [{
      type: Input
    }],
    nzSrc: [{
      type: Input
    }],
    nzSrcSet: [{
      type: Input
    }],
    nzAlt: [{
      type: Input
    }],
    nzIcon: [{
      type: Input
    }],
    nzError: [{
      type: Output
    }],
    textEl: [{
      type: ViewChild,
      args: ["textEl", {
        static: false
      }]
    }]
  });
})();
var NzAvatarGroupComponent = class _NzAvatarGroupComponent {
  static ɵfac = function NzAvatarGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzAvatarGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzAvatarGroupComponent,
    selectors: [["nz-avatar-group"]],
    hostAttrs: [1, "ant-avatar-group"],
    exportAs: ["nzAvatarGroup"],
    ngContentSelectors: _c1,
    decls: 1,
    vars: 0,
    template: function NzAvatarGroupComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzAvatarGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-avatar-group",
      exportAs: "nzAvatarGroup",
      template: `<ng-content></ng-content>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "ant-avatar-group"
      }
    }]
  }], null, null);
})();
var NzAvatarModule = class _NzAvatarModule {
  static ɵfac = function NzAvatarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzAvatarModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzAvatarModule,
    imports: [NzAvatarComponent, NzAvatarGroupComponent],
    exports: [NzAvatarComponent, NzAvatarGroupComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzAvatarComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzAvatarModule, [{
    type: NgModule,
    args: [{
      exports: [NzAvatarComponent, NzAvatarGroupComponent],
      imports: [NzAvatarComponent, NzAvatarGroupComponent]
    }]
  }], null, null);
})();

export {
  NzAvatarComponent,
  NzAvatarGroupComponent,
  NzAvatarModule
};
//# sourceMappingURL=chunk-FP7VKEFL.js.map
