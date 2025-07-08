import {
  NzIconDirective,
  NzIconModule
} from "./chunk-TQ5FZKYH.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  Input,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵnextContext,
  ɵɵproperty
} from "./chunk-WRF7LGAN.js";
import {
  BehaviorSubject,
  ReplaySubject
} from "./chunk-JU3XS6KG.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-form.mjs
function NzFormItemFeedbackIconComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzType", ctx_r0.iconType);
  }
}
var NzFormStatusService = class _NzFormStatusService {
  formStatusChanges = new ReplaySubject(1);
  static ɵfac = function NzFormStatusService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormStatusService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NzFormStatusService,
    factory: _NzFormStatusService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormStatusService, [{
    type: Injectable
  }], null, null);
})();
var NzFormNoStatusService = class _NzFormNoStatusService {
  noFormStatus = new BehaviorSubject(false);
  static ɵfac = function NzFormNoStatusService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormNoStatusService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NzFormNoStatusService,
    factory: _NzFormNoStatusService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormNoStatusService, [{
    type: Injectable
  }], null, null);
})();
var iconTypeMap = {
  error: "close-circle-fill",
  validating: "loading",
  success: "check-circle-fill",
  warning: "exclamation-circle-fill"
};
var NzFormItemFeedbackIconComponent = class _NzFormItemFeedbackIconComponent {
  cdr = inject(ChangeDetectorRef);
  status = "";
  iconType = null;
  ngOnChanges(_changes) {
    this.updateIcon();
  }
  updateIcon() {
    this.iconType = this.status ? iconTypeMap[this.status] : null;
    this.cdr.markForCheck();
  }
  static ɵfac = function NzFormItemFeedbackIconComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormItemFeedbackIconComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFormItemFeedbackIconComponent,
    selectors: [["nz-form-item-feedback-icon"]],
    hostAttrs: [1, "ant-form-item-feedback-icon"],
    hostVars: 8,
    hostBindings: function NzFormItemFeedbackIconComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-form-item-feedback-icon-error", ctx.status === "error")("ant-form-item-feedback-icon-warning", ctx.status === "warning")("ant-form-item-feedback-icon-success", ctx.status === "success")("ant-form-item-feedback-icon-validating", ctx.status === "validating");
      }
    },
    inputs: {
      status: "status"
    },
    exportAs: ["nzFormFeedbackIcon"],
    features: [ɵɵNgOnChangesFeature],
    decls: 1,
    vars: 1,
    consts: [[3, "nzType"]],
    template: function NzFormItemFeedbackIconComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzFormItemFeedbackIconComponent_Conditional_0_Template, 1, 1, "nz-icon", 0);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.iconType ? 0 : -1);
      }
    },
    dependencies: [NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormItemFeedbackIconComponent, [{
    type: Component,
    args: [{
      selector: "nz-form-item-feedback-icon",
      exportAs: "nzFormFeedbackIcon",
      imports: [NzIconModule],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @if (iconType) {
      <nz-icon [nzType]="iconType" />
    }
  `,
      host: {
        class: "ant-form-item-feedback-icon",
        "[class.ant-form-item-feedback-icon-error]": 'status==="error"',
        "[class.ant-form-item-feedback-icon-warning]": 'status==="warning"',
        "[class.ant-form-item-feedback-icon-success]": 'status==="success"',
        "[class.ant-form-item-feedback-icon-validating]": 'status==="validating"'
      }
    }]
  }], null, {
    status: [{
      type: Input
    }]
  });
})();

export {
  NzFormStatusService,
  NzFormNoStatusService,
  NzFormItemFeedbackIconComponent
};
//# sourceMappingURL=chunk-5GDDE4XP.js.map
