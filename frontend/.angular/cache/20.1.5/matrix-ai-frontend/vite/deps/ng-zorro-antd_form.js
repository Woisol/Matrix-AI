import {
  NzTooltipDirective
} from "./chunk-5Y5V7TOA.js";
import {
  NzI18nService
} from "./chunk-NU44RYSI.js";
import "./chunk-V6RO4VMH.js";
import {
  NzGridModule
} from "./chunk-LIF7HDNM.js";
import "./chunk-YLYPD5XX.js";
import "./chunk-BGJVKJD4.js";
import {
  NzFormStatusService
} from "./chunk-5GDDE4XP.js";
import "./chunk-RNHKWUQU.js";
import {
  AbstractControl,
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel
} from "./chunk-OSAHQ66W.js";
import "./chunk-CP5ADG5I.js";
import "./chunk-NX7BCYNZ.js";
import "./chunk-RZB7DMVY.js";
import "./chunk-OROZASVN.js";
import "./chunk-M3YYK6CE.js";
import {
  helpMotion
} from "./chunk-XB33FMDA.js";
import "./chunk-SDXIEBBY.js";
import "./chunk-ANVRJE3Q.js";
import "./chunk-23X22IB6.js";
import "./chunk-CNWZ5YNB.js";
import {
  NzOutletModule,
  NzStringTemplateOutletDirective
} from "./chunk-VCDKFDG2.js";
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
  WithConfig
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  toBoolean
} from "./chunk-MKTFS3GT.js";
import "./chunk-FCBQDLVS.js";
import "./chunk-57VL2GHP.js";
import "./chunk-RT4XOGP6.js";
import "./chunk-Z42XCBQA.js";
import "./chunk-QXKDNKXL.js";
import "./chunk-COW2F6L5.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  Directive,
  Input,
  NgModule,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-WRF7LGAN.js";
import "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import {
  Subject,
  Subscription,
  __esDecorate,
  __runInitializers,
  filter,
  map,
  startWith,
  tap
} from "./chunk-JU3XS6KG.js";
import {
  __publicField,
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-form.mjs
var _c0 = ["*"];
var _c1 = (a0) => [a0];
var _c2 = (a0) => ({
  $implicit: a0
});
function NzFormControlComponent_Conditional_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.innerTip);
  }
}
function NzFormControlComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2)(1, "div", 4);
    ɵɵtemplate(2, NzFormControlComponent_Conditional_3_ng_container_2_Template, 2, 1, "ng-container", 5);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("@helpMotion", void 0);
    ɵɵadvance();
    ɵɵclassMap(ɵɵpureFunction1(5, _c1, "ant-form-item-explain-" + ctx_r0.status));
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.innerTip)("nzStringTemplateOutletContext", ɵɵpureFunction1(7, _c2, ctx_r0.validateControl));
  }
}
function NzFormControlComponent_Conditional_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzExtra);
  }
}
function NzFormControlComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵtemplate(1, NzFormControlComponent_Conditional_4_ng_container_1_Template, 2, 1, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzExtra);
  }
}
function NzFormLabelComponent_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelement(1, "nz-icon", 2);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const tooltipIconType_r1 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzType", tooltipIconType_r1)("nzTheme", ctx_r1.tooltipIcon.theme);
  }
}
function NzFormLabelComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 0);
    ɵɵtemplate(1, NzFormLabelComponent_Conditional_2_ng_container_1_Template, 2, 2, "ng-container", 1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("nzTooltipTitle", ctx_r1.nzTooltipTitle);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r1.tooltipIcon.type);
  }
}
var NzFormItemComponent = class _NzFormItemComponent {
  cdr = inject(ChangeDetectorRef);
  status = "";
  hasFeedback = false;
  withHelpClass = false;
  setWithHelpViaTips(value) {
    this.withHelpClass = value;
    this.cdr.markForCheck();
  }
  setStatus(status) {
    this.status = status;
    this.cdr.markForCheck();
  }
  setHasFeedback(hasFeedback) {
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
  }
  static ɵfac = function NzFormItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormItemComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFormItemComponent,
    selectors: [["nz-form-item"]],
    hostAttrs: [1, "ant-form-item"],
    hostVars: 12,
    hostBindings: function NzFormItemComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-form-item-has-success", ctx.status === "success")("ant-form-item-has-warning", ctx.status === "warning")("ant-form-item-has-error", ctx.status === "error")("ant-form-item-is-validating", ctx.status === "validating")("ant-form-item-has-feedback", ctx.hasFeedback && ctx.status)("ant-form-item-with-help", ctx.withHelpClass);
      }
    },
    exportAs: ["nzFormItem"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzFormItemComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormItemComponent, [{
    type: Component,
    args: [{
      selector: "nz-form-item",
      exportAs: "nzFormItem",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-form-item",
        "[class.ant-form-item-has-success]": 'status === "success"',
        "[class.ant-form-item-has-warning]": 'status === "warning"',
        "[class.ant-form-item-has-error]": 'status === "error"',
        "[class.ant-form-item-is-validating]": 'status === "validating"',
        "[class.ant-form-item-has-feedback]": "hasFeedback && status",
        "[class.ant-form-item-with-help]": "withHelpClass"
      },
      template: `<ng-content></ng-content>`
    }]
  }], null, null);
})();
var NZ_CONFIG_MODULE_NAME = "form";
var DefaultTooltipIcon = {
  type: "question-circle",
  theme: "outline"
};
var NzFormDirective = (() => {
  var _a;
  let _nzNoColon_decorators;
  let _nzNoColon_initializers = [];
  let _nzNoColon_extraInitializers = [];
  let _nzAutoTips_decorators;
  let _nzAutoTips_initializers = [];
  let _nzAutoTips_extraInitializers = [];
  let _nzTooltipIcon_decorators;
  let _nzTooltipIcon_initializers = [];
  let _nzTooltipIcon_extraInitializers = [];
  let _nzLabelWrap_decorators;
  let _nzLabelWrap_initializers = [];
  let _nzLabelWrap_extraInitializers = [];
  return _a = class {
    destroyRef = inject(DestroyRef);
    directionality = inject(Directionality);
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    nzLayout = "horizontal";
    nzNoColon = __runInitializers(this, _nzNoColon_initializers, false);
    nzAutoTips = (__runInitializers(this, _nzNoColon_extraInitializers), __runInitializers(this, _nzAutoTips_initializers, {}));
    nzDisableAutoTips = (__runInitializers(this, _nzAutoTips_extraInitializers), false);
    nzTooltipIcon = __runInitializers(this, _nzTooltipIcon_initializers, DefaultTooltipIcon);
    nzLabelAlign = (__runInitializers(this, _nzTooltipIcon_extraInitializers), "right");
    nzLabelWrap = __runInitializers(this, _nzLabelWrap_initializers, false);
    dir = (__runInitializers(this, _nzLabelWrap_extraInitializers), "ltr");
    inputChanges$ = new Subject();
    getInputObservable(changeType) {
      return this.inputChanges$.pipe(filter((changes) => changeType in changes), map((value) => value[changeType]));
    }
    constructor() {
      this.dir = this.directionality.value;
      this.directionality.change?.pipe(takeUntilDestroyed()).subscribe((direction) => {
        this.dir = direction;
      });
      this.destroyRef.onDestroy(() => {
        this.inputChanges$.complete();
      });
    }
    ngOnChanges(changes) {
      this.inputChanges$.next(changes);
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _nzNoColon_decorators = [WithConfig()];
    _nzAutoTips_decorators = [WithConfig()];
    _nzTooltipIcon_decorators = [WithConfig()];
    _nzLabelWrap_decorators = [WithConfig()];
    __esDecorate(null, null, _nzNoColon_decorators, {
      kind: "field",
      name: "nzNoColon",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzNoColon" in obj,
        get: (obj) => obj.nzNoColon,
        set: (obj, value) => {
          obj.nzNoColon = value;
        }
      },
      metadata: _metadata
    }, _nzNoColon_initializers, _nzNoColon_extraInitializers);
    __esDecorate(null, null, _nzAutoTips_decorators, {
      kind: "field",
      name: "nzAutoTips",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzAutoTips" in obj,
        get: (obj) => obj.nzAutoTips,
        set: (obj, value) => {
          obj.nzAutoTips = value;
        }
      },
      metadata: _metadata
    }, _nzAutoTips_initializers, _nzAutoTips_extraInitializers);
    __esDecorate(null, null, _nzTooltipIcon_decorators, {
      kind: "field",
      name: "nzTooltipIcon",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzTooltipIcon" in obj,
        get: (obj) => obj.nzTooltipIcon,
        set: (obj, value) => {
          obj.nzTooltipIcon = value;
        }
      },
      metadata: _metadata
    }, _nzTooltipIcon_initializers, _nzTooltipIcon_extraInitializers);
    __esDecorate(null, null, _nzLabelWrap_decorators, {
      kind: "field",
      name: "nzLabelWrap",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzLabelWrap" in obj,
        get: (obj) => obj.nzLabelWrap,
        set: (obj, value) => {
          obj.nzLabelWrap = value;
        }
      },
      metadata: _metadata
    }, _nzLabelWrap_initializers, _nzLabelWrap_extraInitializers);
    if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _metadata
    });
  })(), __publicField(_a, "ɵfac", function NzFormDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵdir", ɵɵdefineDirective({
    type: _a,
    selectors: [["", "nz-form", ""]],
    hostAttrs: [1, "ant-form"],
    hostVars: 8,
    hostBindings: function NzFormDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-form-horizontal", ctx.nzLayout === "horizontal")("ant-form-vertical", ctx.nzLayout === "vertical")("ant-form-inline", ctx.nzLayout === "inline")("ant-form-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzLayout: "nzLayout",
      nzNoColon: [2, "nzNoColon", "nzNoColon", booleanAttribute],
      nzAutoTips: "nzAutoTips",
      nzDisableAutoTips: [2, "nzDisableAutoTips", "nzDisableAutoTips", booleanAttribute],
      nzTooltipIcon: "nzTooltipIcon",
      nzLabelAlign: "nzLabelAlign",
      nzLabelWrap: [2, "nzLabelWrap", "nzLabelWrap", booleanAttribute]
    },
    exportAs: ["nzForm"],
    features: [ɵɵNgOnChangesFeature]
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormDirective, [{
    type: Directive,
    args: [{
      selector: "[nz-form]",
      exportAs: "nzForm",
      host: {
        class: "ant-form",
        "[class.ant-form-horizontal]": `nzLayout === 'horizontal'`,
        "[class.ant-form-vertical]": `nzLayout === 'vertical'`,
        "[class.ant-form-inline]": `nzLayout === 'inline'`,
        "[class.ant-form-rtl]": `dir === 'rtl'`
      }
    }]
  }], () => [], {
    nzLayout: [{
      type: Input
    }],
    nzNoColon: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzAutoTips: [{
      type: Input
    }],
    nzDisableAutoTips: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzTooltipIcon: [{
      type: Input
    }],
    nzLabelAlign: [{
      type: Input
    }],
    nzLabelWrap: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzFormControlComponent = class _NzFormControlComponent {
  cdr = inject(ChangeDetectorRef);
  i18n = inject(NzI18nService);
  nzFormStatusService = inject(NzFormStatusService);
  destroyRef = inject(DestroyRef);
  _hasFeedback = false;
  validateChanges = Subscription.EMPTY;
  validateString = null;
  localeId;
  autoErrorTip;
  get disableAutoTips() {
    return this.nzDisableAutoTips !== void 0 ? toBoolean(this.nzDisableAutoTips) : !!this.nzFormDirective?.nzDisableAutoTips;
  }
  status = "";
  validateControl = null;
  innerTip = null;
  defaultValidateControl;
  nzSuccessTip;
  nzWarningTip;
  nzErrorTip;
  nzValidatingTip;
  nzExtra;
  nzAutoTips = {};
  nzDisableAutoTips;
  set nzHasFeedback(value) {
    this._hasFeedback = value;
    this.nzFormStatusService.formStatusChanges.next({
      status: this.status,
      hasFeedback: this._hasFeedback
    });
    if (this.nzFormItemComponent) {
      this.nzFormItemComponent.setHasFeedback(this._hasFeedback);
    }
  }
  get nzHasFeedback() {
    return this._hasFeedback;
  }
  set nzValidateStatus(value) {
    if (value instanceof AbstractControl || value instanceof NgModel) {
      this.validateControl = value;
      this.validateString = null;
      this.watchControl();
    } else if (value instanceof FormControlName) {
      this.validateControl = value.control;
      this.validateString = null;
      this.watchControl();
    } else {
      this.validateString = value;
      this.validateControl = null;
      this.setStatus();
    }
  }
  watchControl() {
    this.validateChanges.unsubscribe();
    if (this.validateControl && this.validateControl.statusChanges) {
      this.validateChanges = this.validateControl.statusChanges.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (!this.disableAutoTips) {
          this.updateAutoErrorTip();
        }
        this.setStatus();
        this.cdr.markForCheck();
      });
    }
  }
  setStatus() {
    this.status = this.getControlStatus(this.validateString);
    this.innerTip = this.getInnerTip(this.status);
    this.nzFormStatusService.formStatusChanges.next({
      status: this.status,
      hasFeedback: this.nzHasFeedback
    });
    if (this.nzFormItemComponent) {
      this.nzFormItemComponent.setWithHelpViaTips(!!this.innerTip);
      this.nzFormItemComponent.setStatus(this.status);
    }
  }
  getControlStatus(validateString) {
    let status;
    if (validateString === "warning" || this.validateControlStatus("INVALID", "warning")) {
      status = "warning";
    } else if (validateString === "error" || this.validateControlStatus("INVALID")) {
      status = "error";
    } else if (validateString === "validating" || validateString === "pending" || this.validateControlStatus("PENDING")) {
      status = "validating";
    } else if (validateString === "success" || this.validateControlStatus("VALID")) {
      status = "success";
    } else {
      status = "";
    }
    return status;
  }
  validateControlStatus(validStatus, statusType) {
    if (!this.validateControl) {
      return false;
    } else {
      const {
        dirty,
        touched,
        status
      } = this.validateControl;
      return (!!dirty || !!touched) && (statusType ? this.validateControl.hasError(statusType) : status === validStatus);
    }
  }
  getInnerTip(status) {
    switch (status) {
      case "error":
        return !this.disableAutoTips && this.autoErrorTip || this.nzErrorTip || null;
      case "validating":
        return this.nzValidatingTip || null;
      case "success":
        return this.nzSuccessTip || null;
      case "warning":
        return this.nzWarningTip || null;
      default:
        return null;
    }
  }
  updateAutoErrorTip() {
    if (this.validateControl) {
      const errors = this.validateControl.errors || {};
      let autoErrorTip = "";
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          autoErrorTip = errors[key]?.[this.localeId] ?? this.nzAutoTips?.[this.localeId]?.[key] ?? this.nzAutoTips.default?.[key] ?? this.nzFormDirective?.nzAutoTips?.[this.localeId]?.[key] ?? this.nzFormDirective?.nzAutoTips.default?.[key];
        }
        if (autoErrorTip) {
          break;
        }
      }
      this.autoErrorTip = autoErrorTip;
    }
  }
  subscribeAutoTips(observable) {
    observable?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.disableAutoTips) {
        this.updateAutoErrorTip();
        this.setStatus();
        this.cdr.markForCheck();
      }
    });
  }
  nzFormItemComponent = inject(NzFormItemComponent, {
    host: true,
    optional: true
  });
  nzFormDirective = inject(NzFormDirective, {
    optional: true
  });
  constructor() {
    this.subscribeAutoTips(this.i18n.localeChange.pipe(tap((locale) => this.localeId = locale.locale)));
    this.subscribeAutoTips(this.nzFormDirective?.getInputObservable("nzAutoTips"));
    this.subscribeAutoTips(this.nzFormDirective?.getInputObservable("nzDisableAutoTips").pipe(filter(() => this.nzDisableAutoTips === void 0)));
  }
  ngOnChanges(changes) {
    const {
      nzDisableAutoTips,
      nzAutoTips,
      nzSuccessTip,
      nzWarningTip,
      nzErrorTip,
      nzValidatingTip
    } = changes;
    if (nzDisableAutoTips || nzAutoTips) {
      this.updateAutoErrorTip();
      this.setStatus();
    } else if (nzSuccessTip || nzWarningTip || nzErrorTip || nzValidatingTip) {
      this.setStatus();
    }
  }
  ngOnInit() {
    this.setStatus();
  }
  ngAfterContentInit() {
    if (!this.validateControl && !this.validateString) {
      if (this.defaultValidateControl instanceof FormControlDirective) {
        this.nzValidateStatus = this.defaultValidateControl.control;
      } else {
        this.nzValidateStatus = this.defaultValidateControl;
      }
    }
  }
  static ɵfac = function NzFormControlComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormControlComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFormControlComponent,
    selectors: [["nz-form-control"]],
    contentQueries: function NzFormControlComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NgControl, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.defaultValidateControl = _t.first);
      }
    },
    hostAttrs: [1, "ant-form-item-control"],
    inputs: {
      nzSuccessTip: "nzSuccessTip",
      nzWarningTip: "nzWarningTip",
      nzErrorTip: "nzErrorTip",
      nzValidatingTip: "nzValidatingTip",
      nzExtra: "nzExtra",
      nzAutoTips: "nzAutoTips",
      nzDisableAutoTips: [2, "nzDisableAutoTips", "nzDisableAutoTips", booleanAttribute],
      nzHasFeedback: [2, "nzHasFeedback", "nzHasFeedback", booleanAttribute],
      nzValidateStatus: "nzValidateStatus"
    },
    exportAs: ["nzFormControl"],
    features: [ɵɵProvidersFeature([NzFormStatusService]), ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 5,
    vars: 2,
    consts: [[1, "ant-form-item-control-input"], [1, "ant-form-item-control-input-content"], [1, "ant-form-item-explain", "ant-form-item-explain-connected"], [1, "ant-form-item-extra"], ["role", "alert"], [4, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"], [4, "nzStringTemplateOutlet"]],
    template: function NzFormControlComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelementStart(0, "div", 0)(1, "div", 1);
        ɵɵprojection(2);
        ɵɵelementEnd()();
        ɵɵconditionalCreate(3, NzFormControlComponent_Conditional_3_Template, 3, 9, "div", 2);
        ɵɵconditionalCreate(4, NzFormControlComponent_Conditional_4_Template, 2, 1, "div", 3);
      }
      if (rf & 2) {
        ɵɵadvance(3);
        ɵɵconditional(ctx.innerTip ? 3 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.nzExtra ? 4 : -1);
      }
    },
    dependencies: [NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    data: {
      animation: [helpMotion]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormControlComponent, [{
    type: Component,
    args: [{
      selector: "nz-form-control",
      exportAs: "nzFormControl",
      animations: [helpMotion],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="ant-form-item-control-input">
      <div class="ant-form-item-control-input-content">
        <ng-content></ng-content>
      </div>
    </div>
    @if (innerTip) {
      <div @helpMotion class="ant-form-item-explain ant-form-item-explain-connected">
        <div role="alert" [class]="['ant-form-item-explain-' + status]">
          <ng-container *nzStringTemplateOutlet="innerTip; context: { $implicit: validateControl }">{{
            innerTip
          }}</ng-container>
        </div>
      </div>
    }

    @if (nzExtra) {
      <div class="ant-form-item-extra">
        <ng-container *nzStringTemplateOutlet="nzExtra">{{ nzExtra }}</ng-container>
      </div>
    }
  `,
      providers: [NzFormStatusService],
      host: {
        class: "ant-form-item-control"
      },
      imports: [NzOutletModule]
    }]
  }], () => [], {
    defaultValidateControl: [{
      type: ContentChild,
      args: [NgControl, {
        static: false
      }]
    }],
    nzSuccessTip: [{
      type: Input
    }],
    nzWarningTip: [{
      type: Input
    }],
    nzErrorTip: [{
      type: Input
    }],
    nzValidatingTip: [{
      type: Input
    }],
    nzExtra: [{
      type: Input
    }],
    nzAutoTips: [{
      type: Input
    }],
    nzDisableAutoTips: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzHasFeedback: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzValidateStatus: [{
      type: Input
    }]
  });
})();
function toTooltipIcon(value) {
  const icon = typeof value === "string" ? {
    type: value
  } : value;
  return __spreadValues(__spreadValues({}, DefaultTooltipIcon), icon);
}
var NzFormLabelComponent = class _NzFormLabelComponent {
  cdr = inject(ChangeDetectorRef);
  nzFor;
  nzRequired = false;
  set nzNoColon(value) {
    this.noColon = value;
  }
  get nzNoColon() {
    return this.noColon !== "default" ? this.noColon : !!this.nzFormDirective?.nzNoColon;
  }
  noColon = "default";
  nzTooltipTitle;
  set nzTooltipIcon(value) {
    this._tooltipIcon = toTooltipIcon(value);
  }
  // due to 'get' and 'set' accessor must have the same type, so it was renamed to `tooltipIcon`
  get tooltipIcon() {
    return this._tooltipIcon !== "default" ? this._tooltipIcon : toTooltipIcon(this.nzFormDirective?.nzTooltipIcon || DefaultTooltipIcon);
  }
  _tooltipIcon = "default";
  set nzLabelAlign(value) {
    this.labelAlign = value;
  }
  get nzLabelAlign() {
    return this.labelAlign !== "default" ? this.labelAlign : this.nzFormDirective?.nzLabelAlign || "right";
  }
  labelAlign = "default";
  set nzLabelWrap(value) {
    this.labelWrap = value;
  }
  get nzLabelWrap() {
    return this.labelWrap !== "default" ? this.labelWrap : !!this.nzFormDirective?.nzLabelWrap;
  }
  labelWrap = "default";
  nzFormDirective = inject(NzFormDirective, {
    skipSelf: true,
    optional: true
  });
  constructor() {
    if (this.nzFormDirective) {
      this.nzFormDirective.getInputObservable("nzNoColon").pipe(filter(() => this.noColon === "default"), takeUntilDestroyed()).subscribe(() => this.cdr.markForCheck());
      this.nzFormDirective.getInputObservable("nzTooltipIcon").pipe(filter(() => this._tooltipIcon === "default"), takeUntilDestroyed()).subscribe(() => this.cdr.markForCheck());
      this.nzFormDirective.getInputObservable("nzLabelAlign").pipe(filter(() => this.labelAlign === "default"), takeUntilDestroyed()).subscribe(() => this.cdr.markForCheck());
      this.nzFormDirective.getInputObservable("nzLabelWrap").pipe(filter(() => this.labelWrap === "default"), takeUntilDestroyed()).subscribe(() => this.cdr.markForCheck());
    }
  }
  static ɵfac = function NzFormLabelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormLabelComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFormLabelComponent,
    selectors: [["nz-form-label"]],
    hostAttrs: [1, "ant-form-item-label"],
    hostVars: 4,
    hostBindings: function NzFormLabelComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-form-item-label-left", ctx.nzLabelAlign === "left")("ant-form-item-label-wrap", ctx.nzLabelWrap);
      }
    },
    inputs: {
      nzFor: "nzFor",
      nzRequired: [2, "nzRequired", "nzRequired", booleanAttribute],
      nzNoColon: [2, "nzNoColon", "nzNoColon", booleanAttribute],
      nzTooltipTitle: "nzTooltipTitle",
      nzTooltipIcon: "nzTooltipIcon",
      nzLabelAlign: "nzLabelAlign",
      nzLabelWrap: [2, "nzLabelWrap", "nzLabelWrap", booleanAttribute]
    },
    exportAs: ["nzFormLabel"],
    ngContentSelectors: _c0,
    decls: 3,
    vars: 6,
    consts: [["nz-tooltip", "", 1, "ant-form-item-tooltip", 3, "nzTooltipTitle"], [4, "nzStringTemplateOutlet"], [3, "nzType", "nzTheme"]],
    template: function NzFormLabelComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelementStart(0, "label");
        ɵɵprojection(1);
        ɵɵconditionalCreate(2, NzFormLabelComponent_Conditional_2_Template, 2, 2, "span", 0);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵclassProp("ant-form-item-no-colon", ctx.nzNoColon)("ant-form-item-required", ctx.nzRequired);
        ɵɵattribute("for", ctx.nzFor);
        ɵɵadvance(2);
        ɵɵconditional(ctx.nzTooltipTitle ? 2 : -1);
      }
    },
    dependencies: [NzOutletModule, NzStringTemplateOutletDirective, NzTooltipDirective, NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormLabelComponent, [{
    type: Component,
    args: [{
      selector: "nz-form-label",
      exportAs: "nzFormLabel",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <label [attr.for]="nzFor" [class.ant-form-item-no-colon]="nzNoColon" [class.ant-form-item-required]="nzRequired">
      <ng-content></ng-content>
      @if (nzTooltipTitle) {
        <span class="ant-form-item-tooltip" nz-tooltip [nzTooltipTitle]="nzTooltipTitle">
          <ng-container *nzStringTemplateOutlet="tooltipIcon.type; let tooltipIconType">
            <nz-icon [nzType]="tooltipIconType" [nzTheme]="tooltipIcon.theme" />
          </ng-container>
        </span>
      }
    </label>
  `,
      host: {
        class: "ant-form-item-label",
        "[class.ant-form-item-label-left]": `nzLabelAlign === 'left'`,
        "[class.ant-form-item-label-wrap]": `nzLabelWrap`
      },
      imports: [NzOutletModule, NzTooltipDirective, NzIconModule]
    }]
  }], () => [], {
    nzFor: [{
      type: Input
    }],
    nzRequired: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzNoColon: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzTooltipTitle: [{
      type: Input
    }],
    nzTooltipIcon: [{
      type: Input
    }],
    nzLabelAlign: [{
      type: Input
    }],
    nzLabelWrap: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzFormSplitComponent = class _NzFormSplitComponent {
  static ɵfac = function NzFormSplitComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormSplitComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFormSplitComponent,
    selectors: [["nz-form-split"]],
    hostAttrs: [1, "ant-form-split"],
    exportAs: ["nzFormSplit"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzFormSplitComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormSplitComponent, [{
    type: Component,
    args: [{
      selector: "nz-form-split",
      exportAs: "nzFormSplit",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-form-split"
      }
    }]
  }], null, null);
})();
var NzFormTextComponent = class _NzFormTextComponent {
  static ɵfac = function NzFormTextComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormTextComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzFormTextComponent,
    selectors: [["nz-form-text"]],
    hostAttrs: [1, "ant-form-text"],
    exportAs: ["nzFormText"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzFormTextComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormTextComponent, [{
    type: Component,
    args: [{
      selector: "nz-form-text",
      exportAs: "nzFormText",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-form-text"
      }
    }]
  }], null, null);
})();
var NzFormModule = class _NzFormModule {
  static ɵfac = function NzFormModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzFormModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzFormModule,
    imports: [NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzFormTextComponent, NzFormSplitComponent],
    exports: [NzGridModule, NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzFormTextComponent, NzFormSplitComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzFormLabelComponent, NzFormControlComponent, NzGridModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzFormModule, [{
    type: NgModule,
    args: [{
      imports: [NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzFormTextComponent, NzFormSplitComponent],
      exports: [NzGridModule, NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzFormTextComponent, NzFormSplitComponent]
    }]
  }], null, null);
})();
export {
  DefaultTooltipIcon,
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
  NzFormSplitComponent,
  NzFormTextComponent
};
//# sourceMappingURL=ng-zorro-antd_form.js.map
