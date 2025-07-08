import {
  NzButtonComponent,
  NzButtonModule
} from "./chunk-QDDQBQIZ.js";
import {
  NzWaveDirective
} from "./chunk-LML7QHTA.js";
import "./chunk-2CAQ2F77.js";
import {
  NzScrollService
} from "./chunk-CP5ADG5I.js";
import "./chunk-NX7BCYNZ.js";
import "./chunk-RZB7DMVY.js";
import {
  fadeMotion
} from "./chunk-XB33FMDA.js";
import "./chunk-SDXIEBBY.js";
import "./chunk-ANVRJE3Q.js";
import "./chunk-23X22IB6.js";
import "./chunk-CNWZ5YNB.js";
import {
  NzStringTemplateOutletDirective
} from "./chunk-VCDKFDG2.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  NzTransitionPatchDirective
} from "./chunk-3LEDXWMQ.js";
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
import {
  NzConfigService,
  WithConfig
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  fromEventOutsideAngular
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
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  DestroyRef,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  output,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import {
  Subject,
  Subscription,
  __esDecorate,
  __runInitializers,
  debounceTime,
  takeUntil
} from "./chunk-JU3XS6KG.js";
import {
  __publicField
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-float-button.mjs
function NzFloatButtonContentComponent_Conditional_2_Conditional_0_ng_template_1_Template(rf, ctx) {
}
function NzFloatButtonContentComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtemplate(1, NzFloatButtonContentComponent_Conditional_2_Conditional_0_ng_template_1_Template, 0, 0, "ng-template", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.nzIcon);
  }
}
function NzFloatButtonContentComponent_Conditional_2_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.nzDescription, " ");
  }
}
function NzFloatButtonContentComponent_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵtemplate(1, NzFloatButtonContentComponent_Conditional_2_Conditional_1_ng_container_1_Template, 2, 1, "ng-container", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzDescription);
  }
}
function NzFloatButtonContentComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzFloatButtonContentComponent_Conditional_2_Conditional_0_Template, 2, 1, "div", 2);
    ɵɵconditionalCreate(1, NzFloatButtonContentComponent_Conditional_2_Conditional_1_Template, 2, 1, "div", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.nzIcon ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzDescription && ctx_r0.nzShape === "square" ? 1 : -1);
  }
}
function NzFloatButtonContentComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵelement(1, "nz-icon", 6);
    ɵɵelementEnd();
  }
}
function NzFloatButtonComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 2);
    ɵɵlistener("click", function NzFloatButtonComponent_Conditional_0_Template_a_click_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.nzOnClick.emit(true));
    });
    ɵɵelement(1, "nz-float-button-content", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassProp("ant-float-btn-default", ctx_r1.nzType === "default");
    ɵɵproperty("target", ctx_r1.nzTarget)("href", ctx_r1.nzHref, ɵɵsanitizeUrl)("nzType", ctx_r1.nzType);
    ɵɵadvance();
    ɵɵproperty("nzIcon", ctx_r1.nzIcon)("nzDescription", ctx_r1.nzDescription)("nzShape", ctx_r1.nzShape);
  }
}
function NzFloatButtonComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 4);
    ɵɵlistener("click", function NzFloatButtonComponent_Conditional_1_Template_button_click_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.nzOnClick.emit(true));
    });
    ɵɵelement(1, "nz-float-button-content", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassProp("ant-float-btn-default", ctx_r1.nzType === "default");
    ɵɵproperty("nzType", ctx_r1.nzType);
    ɵɵadvance();
    ɵɵproperty("nzIcon", ctx_r1.nzIcon)("nzDescription", ctx_r1.nzDescription)("nzShape", ctx_r1.nzShape);
  }
}
var _c0 = ["backTop"];
function NzFloatButtonTopComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 3);
  }
}
var _c1 = ["*"];
function NzFloatButtonGroupComponent_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NzFloatButtonGroupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzFloatButtonGroupComponent_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 2);
  }
  if (rf & 2) {
    ɵɵnextContext();
    const menu_r1 = ɵɵreference(3);
    ɵɵproperty("ngTemplateOutlet", menu_r1);
  }
}
function NzFloatButtonGroupComponent_Conditional_1_Conditional_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NzFloatButtonGroupComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵtemplate(1, NzFloatButtonGroupComponent_Conditional_1_Conditional_0_ng_container_1_Template, 1, 0, "ng-container", 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    ɵɵnextContext(2);
    const menu_r1 = ɵɵreference(3);
    ɵɵproperty("@fadeMotion", void 0);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", menu_r1);
  }
}
function NzFloatButtonGroupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵconditionalCreate(0, NzFloatButtonGroupComponent_Conditional_1_Conditional_0_Template, 2, 2, "div", 3);
    ɵɵelementStart(1, "nz-float-button", 4);
    ɵɵlistener("nzOnClick", function NzFloatButtonGroupComponent_Conditional_1_Template_nz_float_button_nzOnClick_1_listener() {
      ɵɵrestoreView(_r2);
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.open() ? ctx_r2.clickCloseMenu() : ctx_r2.clickOpenMenu());
    })("mouseover", function NzFloatButtonGroupComponent_Conditional_1_Template_nz_float_button_mouseover_1_listener() {
      ɵɵrestoreView(_r2);
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.hoverOpenMenu());
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    const close_r4 = ɵɵreference(5);
    ɵɵconditional(ctx_r2.open() ? 0 : -1);
    ɵɵadvance();
    ɵɵproperty("nzType", ctx_r2.nzType())("nzIcon", ctx_r2.open() ? close_r4 : ctx_r2.nzIcon())("nzShape", ctx_r2.nzShape())("nzDescription", ctx_r2.open() ? null : ctx_r2.nzDescription());
  }
}
function NzFloatButtonGroupComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function NzFloatButtonGroupComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 5);
  }
}
var NzFloatButtonContentComponent = class _NzFloatButtonContentComponent {
  nzIcon = null;
  nzDescription = null;
  nzShape = "circle";
  static ɵfac = function NzFloatButtonContentComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFloatButtonContentComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFloatButtonContentComponent,
    selectors: [["nz-float-button-content"]],
    inputs: {
      nzIcon: "nzIcon",
      nzDescription: "nzDescription",
      nzShape: "nzShape"
    },
    exportAs: ["nzFloatButtonContent"],
    decls: 4,
    vars: 1,
    consts: [[1, "ant-float-btn-body"], [1, "ant-float-btn-content"], [1, "ant-float-btn-icon"], [1, "ant-float-btn-description"], [3, "ngTemplateOutlet"], [4, "nzStringTemplateOutlet"], ["nzType", "file-text", "nzTheme", "outline"]],
    template: function NzFloatButtonContentComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 0)(1, "div", 1);
        ɵɵconditionalCreate(2, NzFloatButtonContentComponent_Conditional_2_Template, 2, 2)(3, NzFloatButtonContentComponent_Conditional_3_Template, 2, 0, "div", 2);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵadvance(2);
        ɵɵconditional(ctx.nzDescription || ctx.nzIcon ? 2 : 3);
      }
    },
    dependencies: [NzIconModule, NzIconDirective, NgTemplateOutlet, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFloatButtonContentComponent, [{
    type: Component,
    args: [{
      selector: "nz-float-button-content",
      exportAs: "nzFloatButtonContent",
      imports: [NzIconModule, NgTemplateOutlet, NzStringTemplateOutletDirective],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="ant-float-btn-body">
      <div class="ant-float-btn-content">
        @if (nzDescription || nzIcon) {
          @if (nzIcon) {
            <div class="ant-float-btn-icon">
              <ng-template [ngTemplateOutlet]="nzIcon"></ng-template>
            </div>
          }
          @if (nzDescription && nzShape === 'square') {
            <div class="ant-float-btn-description">
              <ng-container *nzStringTemplateOutlet="nzDescription">
                {{ nzDescription }}
              </ng-container>
            </div>
          }
        } @else {
          <div class="ant-float-btn-icon">
            <nz-icon nzType="file-text" nzTheme="outline" />
          </div>
        }
      </div>
    </div>
  `
    }]
  }], null, {
    nzIcon: [{
      type: Input
    }],
    nzDescription: [{
      type: Input
    }],
    nzShape: [{
      type: Input
    }]
  });
})();
var NzFloatButtonComponent = class _NzFloatButtonComponent {
  directionality = inject(Directionality);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  nzHref = null;
  nzTarget = null;
  nzType = "default";
  nzShape = "circle";
  nzIcon = null;
  nzDescription = null;
  nzOnClick = new EventEmitter();
  dir = "ltr";
  constructor() {
    this.dir = this.directionality.value;
  }
  ngOnInit() {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }
  static ɵfac = function NzFloatButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFloatButtonComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFloatButtonComponent,
    selectors: [["nz-float-button"]],
    hostAttrs: [1, "ant-float-btn"],
    hostVars: 6,
    hostBindings: function NzFloatButtonComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-float-btn-circle", ctx.nzShape === "circle")("ant-float-btn-square", ctx.nzShape === "square")("ant-float-btn-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzHref: "nzHref",
      nzTarget: "nzTarget",
      nzType: "nzType",
      nzShape: "nzShape",
      nzIcon: "nzIcon",
      nzDescription: "nzDescription"
    },
    outputs: {
      nzOnClick: "nzOnClick"
    },
    exportAs: ["nzFloatButton"],
    decls: 2,
    vars: 1,
    consts: [["nz-button", "", 1, "ant-float-btn-inner", 3, "target", "href", "nzType", "ant-float-btn-default"], ["nz-button", "", 1, "ant-float-btn-inner", 3, "nzType", "ant-float-btn-default"], ["nz-button", "", 1, "ant-float-btn-inner", 3, "click", "target", "href", "nzType"], [3, "nzIcon", "nzDescription", "nzShape"], ["nz-button", "", 1, "ant-float-btn-inner", 3, "click", "nzType"]],
    template: function NzFloatButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzFloatButtonComponent_Conditional_0_Template, 2, 8, "a", 0)(1, NzFloatButtonComponent_Conditional_1_Template, 2, 6, "button", 1);
      }
      if (rf & 2) {
        ɵɵconditional(!!ctx.nzHref ? 0 : 1);
      }
    },
    dependencies: [NzButtonModule, NzButtonComponent, NzTransitionPatchDirective, NzWaveDirective, NzFloatButtonContentComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFloatButtonComponent, [{
    type: Component,
    args: [{
      selector: "nz-float-button",
      exportAs: "nzFloatButton",
      imports: [NzButtonModule, NzFloatButtonContentComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @if (!!nzHref) {
      <a
        [target]="nzTarget"
        [href]="nzHref"
        nz-button
        [nzType]="nzType"
        [class.ant-float-btn-default]="nzType === 'default'"
        class="ant-float-btn-inner"
        (click)="nzOnClick.emit(true)"
      >
        <nz-float-button-content
          [nzIcon]="nzIcon"
          [nzDescription]="nzDescription"
          [nzShape]="nzShape"
        ></nz-float-button-content>
      </a>
    } @else {
      <button
        nz-button
        [nzType]="nzType"
        [class.ant-float-btn-default]="nzType === 'default'"
        class="ant-float-btn-inner"
        (click)="nzOnClick.emit(true)"
      >
        <nz-float-button-content
          [nzIcon]="nzIcon"
          [nzDescription]="nzDescription"
          [nzShape]="nzShape"
        ></nz-float-button-content>
      </button>
    }
  `,
      host: {
        class: "ant-float-btn",
        "[class.ant-float-btn-circle]": `nzShape === 'circle'`,
        "[class.ant-float-btn-square]": `nzShape === 'square'`,
        "[class.ant-float-btn-rtl]": `dir === 'rtl'`
      }
    }]
  }], () => [], {
    nzHref: [{
      type: Input
    }],
    nzTarget: [{
      type: Input
    }],
    nzType: [{
      type: Input
    }],
    nzShape: [{
      type: Input
    }],
    nzIcon: [{
      type: Input
    }],
    nzDescription: [{
      type: Input
    }],
    nzOnClick: [{
      type: Output
    }]
  });
})();
var NZ_CONFIG_MODULE_NAME = "backTop";
var passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true
});
var NzFloatButtonTopComponent = (() => {
  var _a;
  let _nzVisibilityHeight_decorators;
  let _nzVisibilityHeight_initializers = [];
  let _nzVisibilityHeight_extraInitializers = [];
  return _a = class {
    nzConfigService = inject(NzConfigService);
    scrollSrv = inject(NzScrollService);
    platform = inject(Platform);
    ngZone = inject(NgZone);
    cdr = inject(ChangeDetectorRef);
    directionality = inject(Directionality);
    destroyRef = inject(DestroyRef);
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    scrollListenerDestroy$ = new Subject();
    target = null;
    visible = false;
    dir = "ltr";
    nzHref = null;
    nzType = "default";
    nzShape = "circle";
    nzIcon = null;
    nzDescription = null;
    nzTemplate;
    nzVisibilityHeight = __runInitializers(this, _nzVisibilityHeight_initializers, 400);
    nzTarget = __runInitializers(this, _nzVisibilityHeight_extraInitializers);
    nzDuration = 450;
    nzOnClick = new EventEmitter();
    set backTop(backTop) {
      if (backTop) {
        this.backTopClickSubscription.unsubscribe();
        this.backTopClickSubscription = fromEventOutsideAngular(backTop.nativeElement, "click").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.scrollSrv.scrollTo(this.getTarget(), 0, {
            duration: this.nzDuration
          });
          if (this.nzOnClick.observers.length) {
            this.ngZone.run(() => this.nzOnClick.emit(true));
          }
        });
      }
    }
    doc = inject(DOCUMENT);
    backTopClickSubscription = Subscription.EMPTY;
    constructor() {
      this.destroyRef.onDestroy(() => {
        this.scrollListenerDestroy$.next();
        this.scrollListenerDestroy$.complete();
      });
    }
    ngOnInit() {
      this.registerScrollEvent();
      this.dir = this.directionality.value;
      this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
    }
    getTarget() {
      return this.target || window;
    }
    handleScroll() {
      if (this.visible === this.scrollSrv.getScroll(this.getTarget()) > this.nzVisibilityHeight) {
        return;
      }
      this.visible = !this.visible;
      this.cdr.detectChanges();
    }
    registerScrollEvent() {
      if (!this.platform.isBrowser) {
        return;
      }
      this.scrollListenerDestroy$.next();
      this.handleScroll();
      fromEventOutsideAngular(this.getTarget(), "scroll", passiveEventListenerOptions).pipe(debounceTime(50), takeUntil(this.scrollListenerDestroy$)).subscribe(() => this.handleScroll());
    }
    detectChanges() {
      this.cdr.detectChanges();
    }
    ngOnChanges(changes) {
      const {
        nzTarget
      } = changes;
      if (nzTarget) {
        this.target = typeof this.nzTarget === "string" ? this.doc.querySelector(this.nzTarget) : this.nzTarget;
        this.registerScrollEvent();
      }
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _nzVisibilityHeight_decorators = [WithConfig()];
    __esDecorate(null, null, _nzVisibilityHeight_decorators, {
      kind: "field",
      name: "nzVisibilityHeight",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzVisibilityHeight" in obj,
        get: (obj) => obj.nzVisibilityHeight,
        set: (obj, value) => {
          obj.nzVisibilityHeight = value;
        }
      },
      metadata: _metadata
    }, _nzVisibilityHeight_initializers, _nzVisibilityHeight_extraInitializers);
    if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _metadata
    });
  })(), __publicField(_a, "ɵfac", function NzFloatButtonTopComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵcmp", ɵɵdefineComponent({
    type: _a,
    selectors: [["nz-float-button-top"]],
    viewQuery: function NzFloatButtonTopComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.backTop = _t.first);
      }
    },
    hostAttrs: [1, "ant-float-btn", "ant-float-btn-top"],
    hostVars: 8,
    hostBindings: function NzFloatButtonTopComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-float-btn-circle", ctx.nzShape === "circle")("ant-float-btn-hidden", !ctx.visible)("ant-float-btn-square", ctx.nzShape === "square")("ant-float-btn-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzHref: "nzHref",
      nzType: "nzType",
      nzShape: "nzShape",
      nzIcon: "nzIcon",
      nzDescription: "nzDescription",
      nzTemplate: "nzTemplate",
      nzVisibilityHeight: [2, "nzVisibilityHeight", "nzVisibilityHeight", numberAttribute],
      nzTarget: "nzTarget",
      nzDuration: [2, "nzDuration", "nzDuration", numberAttribute]
    },
    outputs: {
      nzOnClick: "nzOnClick"
    },
    exportAs: ["nzFloatButtonTop"],
    features: [ɵɵNgOnChangesFeature],
    decls: 5,
    vars: 6,
    consts: [["backTop", ""], ["top", ""], [3, "nzIcon", "nzDescription", "nzHref", "nzType", "nzShape"], ["nzType", "vertical-align-top", "nzTheme", "outline"]],
    template: function NzFloatButtonTopComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", null, 0);
        ɵɵelement(2, "nz-float-button", 2);
        ɵɵtemplate(3, NzFloatButtonTopComponent_ng_template_3_Template, 1, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        const top_r1 = ɵɵreference(4);
        ɵɵproperty("@fadeMotion", void 0);
        ɵɵadvance(2);
        ɵɵproperty("nzIcon", ctx.nzIcon || top_r1)("nzDescription", ctx.nzDescription)("nzHref", ctx.nzHref)("nzType", ctx.nzType)("nzShape", ctx.nzShape);
      }
    },
    dependencies: [NzFloatButtonComponent, NzIconModule, NzIconDirective],
    encapsulation: 2,
    data: {
      animation: [fadeMotion]
    },
    changeDetection: 0
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFloatButtonTopComponent, [{
    type: Component,
    args: [{
      selector: "nz-float-button-top",
      exportAs: "nzFloatButtonTop",
      imports: [NzFloatButtonComponent, NzIconModule],
      animations: [fadeMotion],
      template: `
    <div #backTop @fadeMotion>
      <nz-float-button
        [nzIcon]="nzIcon || top"
        [nzDescription]="nzDescription"
        [nzHref]="nzHref"
        [nzType]="nzType"
        [nzShape]="nzShape"
      ></nz-float-button>
      <ng-template #top>
        <nz-icon nzType="vertical-align-top" nzTheme="outline" />
      </ng-template>
    </div>
  `,
      host: {
        class: "ant-float-btn ant-float-btn-top",
        "[class.ant-float-btn-circle]": `nzShape === 'circle'`,
        "[class.ant-float-btn-hidden]": `!visible`,
        "[class.ant-float-btn-square]": `nzShape === 'square'`,
        "[class.ant-float-btn-rtl]": `dir === 'rtl'`
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], () => [], {
    nzHref: [{
      type: Input
    }],
    nzType: [{
      type: Input
    }],
    nzShape: [{
      type: Input
    }],
    nzIcon: [{
      type: Input
    }],
    nzDescription: [{
      type: Input
    }],
    nzTemplate: [{
      type: Input
    }],
    nzVisibilityHeight: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzTarget: [{
      type: Input
    }],
    nzDuration: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzOnClick: [{
      type: Output
    }],
    backTop: [{
      type: ViewChild,
      args: ["backTop", {
        static: false
      }]
    }]
  });
})();
var NzFloatButtonGroupComponent = class _NzFloatButtonGroupComponent {
  nzFloatButtonComponents = contentChildren(NzFloatButtonComponent, ...ngDevMode ? [{
    debugName: "nzFloatButtonComponents"
  }] : []);
  nzFloatButtonTopComponents = contentChildren(NzFloatButtonTopComponent, ...ngDevMode ? [{
    debugName: "nzFloatButtonTopComponents"
  }] : []);
  nzHref = input(null, ...ngDevMode ? [{
    debugName: "nzHref"
  }] : []);
  nzTarget = input(null, ...ngDevMode ? [{
    debugName: "nzTarget"
  }] : []);
  nzType = input("default", ...ngDevMode ? [{
    debugName: "nzType"
  }] : []);
  nzIcon = input(null, ...ngDevMode ? [{
    debugName: "nzIcon"
  }] : []);
  nzDescription = input(null, ...ngDevMode ? [{
    debugName: "nzDescription"
  }] : []);
  nzShape = input("circle", ...ngDevMode ? [{
    debugName: "nzShape"
  }] : []);
  nzTrigger = input(null, ...ngDevMode ? [{
    debugName: "nzTrigger"
  }] : []);
  nzOpen = input(null, ...ngDevMode ? [{
    debugName: "nzOpen"
  }] : []);
  nzPlacement = input("top", ...ngDevMode ? [{
    debugName: "nzPlacement"
  }] : []);
  nzOnOpenChange = output();
  dir = inject(Directionality).valueSignal;
  open = linkedSignal(() => !!this.nzOpen());
  isMenuMode = computed(() => !!this.nzTrigger() && ["click", "hover"].includes(this.nzTrigger()), ...ngDevMode ? [{
    debugName: "isMenuMode"
  }] : []);
  isControlledMode = computed(() => this.nzOpen() !== null, ...ngDevMode ? [{
    debugName: "isControlledMode"
  }] : []);
  class = computed(() => {
    const shape = this.nzShape();
    const dir = this.dir();
    const classes = ["ant-float-btn-group", this.generateClass(shape)];
    if (!this.isMenuMode()) {
      classes.push(this.generateClass(`${shape}-shadow`));
    } else {
      classes.push(this.generateClass(this.nzPlacement()));
    }
    if (dir === "rtl") {
      classes.push(this.generateClass(dir));
    }
    return classes;
  }, ...ngDevMode ? [{
    debugName: "class"
  }] : []);
  constructor() {
    effect(() => {
      if (this.nzFloatButtonComponents()) {
        this.nzFloatButtonComponents().forEach((item) => {
          item.nzShape = this.nzShape();
        });
      }
      if (this.nzFloatButtonTopComponents()) {
        this.nzFloatButtonTopComponents().forEach((item) => {
          item.nzShape = this.nzShape();
          item.detectChanges();
        });
      }
    });
  }
  clickOpenMenu() {
    this.handleEvent("click", true);
  }
  hoverOpenMenu() {
    this.handleEvent("hover", true);
  }
  clickCloseMenu() {
    this.handleEvent("click", false);
  }
  hoverCloseMenu() {
    this.handleEvent("hover", false);
  }
  handleEvent(type, isOpen) {
    if (this.nzTrigger() !== type || this.isControlledMode() || this.open() === isOpen) {
      return;
    }
    this.open.set(isOpen);
    this.nzOnOpenChange.emit(isOpen);
  }
  generateClass(suffix) {
    return `ant-float-btn-group-${suffix}`;
  }
  static ɵfac = function NzFloatButtonGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFloatButtonGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFloatButtonGroupComponent,
    selectors: [["nz-float-button-group"]],
    contentQueries: function NzFloatButtonGroupComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.nzFloatButtonComponents, NzFloatButtonComponent, 4);
        ɵɵcontentQuerySignal(dirIndex, ctx.nzFloatButtonTopComponents, NzFloatButtonTopComponent, 4);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(2);
      }
    },
    hostVars: 2,
    hostBindings: function NzFloatButtonGroupComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("mouseleave", function NzFloatButtonGroupComponent_mouseleave_HostBindingHandler() {
          return ctx.hoverCloseMenu();
        });
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.class());
      }
    },
    inputs: {
      nzHref: [1, "nzHref"],
      nzTarget: [1, "nzTarget"],
      nzType: [1, "nzType"],
      nzIcon: [1, "nzIcon"],
      nzDescription: [1, "nzDescription"],
      nzShape: [1, "nzShape"],
      nzTrigger: [1, "nzTrigger"],
      nzOpen: [1, "nzOpen"],
      nzPlacement: [1, "nzPlacement"]
    },
    outputs: {
      nzOnOpenChange: "nzOnOpenChange"
    },
    exportAs: ["nzFloatButtonGroup"],
    ngContentSelectors: _c1,
    decls: 6,
    vars: 1,
    consts: [["menu", ""], ["close", ""], [4, "ngTemplateOutlet"], [1, "ant-float-btn-group-wrap"], [1, "ant-float-btn-group-trigger", 3, "nzOnClick", "mouseover", "nzType", "nzIcon", "nzShape", "nzDescription"], ["nzType", "close", "nzTheme", "outline"]],
    template: function NzFloatButtonGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, NzFloatButtonGroupComponent_Conditional_0_Template, 1, 1, "ng-container")(1, NzFloatButtonGroupComponent_Conditional_1_Template, 2, 5);
        ɵɵtemplate(2, NzFloatButtonGroupComponent_ng_template_2_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor)(4, NzFloatButtonGroupComponent_ng_template_4_Template, 1, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor);
      }
      if (rf & 2) {
        ɵɵconditional(!ctx.isMenuMode() ? 0 : 1);
      }
    },
    dependencies: [NzFloatButtonComponent, NzIconModule, NzIconDirective, NgTemplateOutlet],
    encapsulation: 2,
    data: {
      animation: [fadeMotion]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFloatButtonGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-float-button-group",
      exportAs: "nzFloatButtonGroup",
      imports: [NzFloatButtonComponent, NzIconModule, NgTemplateOutlet],
      changeDetection: ChangeDetectionStrategy.OnPush,
      animations: [fadeMotion],
      template: `
    @if (!isMenuMode()) {
      <ng-container *ngTemplateOutlet="menu"></ng-container>
    } @else {
      @if (open()) {
        <div class="ant-float-btn-group-wrap" @fadeMotion><ng-container *ngTemplateOutlet="menu"></ng-container></div>
      }
      <nz-float-button
        class="ant-float-btn-group-trigger"
        [nzType]="nzType()"
        [nzIcon]="open() ? close : nzIcon()"
        [nzShape]="nzShape()"
        [nzDescription]="open() ? null : nzDescription()"
        (nzOnClick)="open() ? clickCloseMenu() : clickOpenMenu()"
        (mouseover)="hoverOpenMenu()"
      ></nz-float-button>
    }
    <ng-template #menu><ng-content></ng-content></ng-template>
    <ng-template #close>
      <nz-icon nzType="close" nzTheme="outline" />
    </ng-template>
  `,
      host: {
        "[class]": "class()",
        "(mouseleave)": "hoverCloseMenu()"
      }
    }]
  }], () => [], null);
})();
var NzFloatButtonModule = class _NzFloatButtonModule {
  static ɵfac = function NzFloatButtonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFloatButtonModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzFloatButtonModule,
    imports: [NzFloatButtonComponent, NzFloatButtonGroupComponent, NzFloatButtonTopComponent, NzFloatButtonContentComponent],
    exports: [NzFloatButtonComponent, NzFloatButtonGroupComponent, NzFloatButtonTopComponent, NzFloatButtonContentComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzFloatButtonComponent, NzFloatButtonGroupComponent, NzFloatButtonTopComponent, NzFloatButtonContentComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFloatButtonModule, [{
    type: NgModule,
    args: [{
      exports: [NzFloatButtonComponent, NzFloatButtonGroupComponent, NzFloatButtonTopComponent, NzFloatButtonContentComponent],
      imports: [NzFloatButtonComponent, NzFloatButtonGroupComponent, NzFloatButtonTopComponent, NzFloatButtonContentComponent]
    }]
  }], null, null);
})();
export {
  NzFloatButtonComponent,
  NzFloatButtonContentComponent,
  NzFloatButtonGroupComponent,
  NzFloatButtonModule,
  NzFloatButtonTopComponent
};
//# sourceMappingURL=ng-zorro-antd_float-button.js.map
