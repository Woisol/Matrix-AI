import {
  isTemplateRef
} from "./chunk-MKTFS3GT.js";
import {
  Directive,
  Input,
  NgModule,
  TemplateRef,
  ViewContainerRef,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-WRF7LGAN.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-outlet.mjs
var NzStringTemplateOutletDirective = class _NzStringTemplateOutletDirective {
  viewContainer = inject(ViewContainerRef);
  templateRef = inject(TemplateRef);
  embeddedViewRef = null;
  context = new NzStringTemplateOutletContext();
  nzStringTemplateOutletContext = null;
  nzStringTemplateOutlet = null;
  static ngTemplateContextGuard(_dir, _ctx) {
    return true;
  }
  recreateView() {
    this.viewContainer.clear();
    if (isTemplateRef(this.nzStringTemplateOutlet)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.nzStringTemplateOutlet, this.nzStringTemplateOutletContext);
    } else {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }
  updateContext() {
    const newCtx = isTemplateRef(this.nzStringTemplateOutlet) ? this.nzStringTemplateOutletContext : this.context;
    const oldCtx = this.embeddedViewRef.context;
    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }
  ngOnChanges(changes) {
    const {
      nzStringTemplateOutletContext,
      nzStringTemplateOutlet
    } = changes;
    const shouldRecreateView = () => {
      let shouldOutletRecreate = false;
      if (nzStringTemplateOutlet) {
        shouldOutletRecreate = nzStringTemplateOutlet.firstChange || isTemplateRef(nzStringTemplateOutlet.previousValue) || isTemplateRef(nzStringTemplateOutlet.currentValue);
      }
      const hasContextShapeChanged = (ctxChange) => {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
          for (const propName of currCtxKeys) {
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };
      const shouldContextRecreate = nzStringTemplateOutletContext && hasContextShapeChanged(nzStringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };
    if (nzStringTemplateOutlet) {
      this.context.$implicit = nzStringTemplateOutlet.currentValue;
    }
    const recreateView = shouldRecreateView();
    if (recreateView) {
      this.recreateView();
    } else {
      this.updateContext();
    }
  }
  static ɵfac = function NzStringTemplateOutletDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzStringTemplateOutletDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzStringTemplateOutletDirective,
    selectors: [["", "nzStringTemplateOutlet", ""]],
    inputs: {
      nzStringTemplateOutletContext: "nzStringTemplateOutletContext",
      nzStringTemplateOutlet: "nzStringTemplateOutlet"
    },
    exportAs: ["nzStringTemplateOutlet"],
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzStringTemplateOutletDirective, [{
    type: Directive,
    args: [{
      selector: "[nzStringTemplateOutlet]",
      exportAs: "nzStringTemplateOutlet"
    }]
  }], null, {
    nzStringTemplateOutletContext: [{
      type: Input
    }],
    nzStringTemplateOutlet: [{
      type: Input
    }]
  });
})();
var NzStringTemplateOutletContext = class {
  $implicit;
};
var NzOutletModule = class _NzOutletModule {
  static ɵfac = function NzOutletModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOutletModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzOutletModule,
    imports: [NzStringTemplateOutletDirective],
    exports: [NzStringTemplateOutletDirective]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOutletModule, [{
    type: NgModule,
    args: [{
      imports: [NzStringTemplateOutletDirective],
      exports: [NzStringTemplateOutletDirective]
    }]
  }], null, null);
})();

export {
  NzStringTemplateOutletDirective,
  NzOutletModule
};
//# sourceMappingURL=chunk-VCDKFDG2.js.map
