import {
  ANIMATION_MODULE_TYPE,
  Directive,
  Input,
  NgModule,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵclassProp,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-WRF7LGAN.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-no-animation.mjs
var NzNoAnimationDirective = class _NzNoAnimationDirective {
  animationType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  nzNoAnimation = false;
  static ɵfac = function NzNoAnimationDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzNoAnimationDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzNoAnimationDirective,
    selectors: [["", "nzNoAnimation", ""]],
    hostVars: 2,
    hostBindings: function NzNoAnimationDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("nz-animate-disabled", ctx.nzNoAnimation || ctx.animationType === "NoopAnimations");
      }
    },
    inputs: {
      nzNoAnimation: [2, "nzNoAnimation", "nzNoAnimation", booleanAttribute]
    },
    exportAs: ["nzNoAnimation"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzNoAnimationDirective, [{
    type: Directive,
    args: [{
      selector: "[nzNoAnimation]",
      exportAs: "nzNoAnimation",
      host: {
        "[class.nz-animate-disabled]": `nzNoAnimation || animationType === 'NoopAnimations'`
      }
    }]
  }], null, {
    nzNoAnimation: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzNoAnimationModule = class _NzNoAnimationModule {
  static ɵfac = function NzNoAnimationModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzNoAnimationModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzNoAnimationModule,
    imports: [NzNoAnimationDirective],
    exports: [NzNoAnimationDirective]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzNoAnimationModule, [{
    type: NgModule,
    args: [{
      imports: [NzNoAnimationDirective],
      exports: [NzNoAnimationDirective]
    }]
  }], null, null);
})();

export {
  NzNoAnimationDirective
};
//# sourceMappingURL=chunk-M3YYK6CE.js.map
