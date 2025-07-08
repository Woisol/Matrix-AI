import {
  NZ_SPACE_COMPACT_ITEM_TYPE,
  NZ_SPACE_COMPACT_SIZE,
  NzSpaceCompactItemDirective
} from "./chunk-2CAQ2F77.js";
import {
  FocusMonitor
} from "./chunk-YCMEGHDE.js";
import {
  NzFormItemFeedbackIconComponent,
  NzFormNoStatusService,
  NzFormStatusService
} from "./chunk-5GDDE4XP.js";
import "./chunk-7MQL5S2Q.js";
import "./chunk-RNHKWUQU.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlDirective,
  MaxLengthValidator,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgControlStatus,
  ReactiveFormsModule,
  Validators
} from "./chunk-OSAHQ66W.js";
import {
  NzResizeService
} from "./chunk-CP5ADG5I.js";
import "./chunk-NX7BCYNZ.js";
import "./chunk-RZB7DMVY.js";
import {
  BACKSPACE,
  LEFT_ARROW,
  RIGHT_ARROW
} from "./chunk-OROZASVN.js";
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
import {
  Platform
} from "./chunk-3NNVUQIN.js";
import "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  getStatusClassNames,
  isNotNil
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
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  NgModule,
  NgZone,
  Renderer2,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  isDevMode,
  numberAttribute,
  setClassMetadata,
  signal,
  ɵɵHostDirectivesFeature,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  merge
} from "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import {
  EMPTY,
  Subject,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
  tap
} from "./chunk-JU3XS6KG.js";
import {
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-input.mjs
var _c0 = ["nz-input-group-slot", ""];
var _c1 = ["*"];
function NzInputGroupSlotComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzType", ctx_r0.icon);
  }
}
function NzInputGroupSlotComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.template);
  }
}
function NzInputGroupComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("icon", ctx_r0.nzAddOnBeforeIcon)("template", ctx_r0.nzAddOnBefore);
  }
}
function NzInputGroupComponent_Conditional_0_Conditional_2_ng_template_1_Template(rf, ctx) {
}
function NzInputGroupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 6);
    ɵɵtemplate(1, NzInputGroupComponent_Conditional_0_Conditional_2_ng_template_1_Template, 0, 0, "ng-template", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    const affixTemplate_r2 = ɵɵreference(3);
    ɵɵclassMap(ctx_r0.affixInGroupStatusCls);
    ɵɵclassProp("ant-input-affix-wrapper-disabled", ctx_r0.disabled)("ant-input-affix-wrapper-sm", ctx_r0.isSmall)("ant-input-affix-wrapper-lg", ctx_r0.isLarge)("ant-input-affix-wrapper-focused", ctx_r0.focused);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", affixTemplate_r2);
  }
}
function NzInputGroupComponent_Conditional_0_Conditional_3_ng_template_0_Template(rf, ctx) {
}
function NzInputGroupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzInputGroupComponent_Conditional_0_Conditional_3_ng_template_0_Template, 0, 0, "ng-template", 5);
  }
  if (rf & 2) {
    ɵɵnextContext(2);
    const contentTemplate_r3 = ɵɵreference(5);
    ɵɵproperty("ngTemplateOutlet", contentTemplate_r3);
  }
}
function NzInputGroupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("icon", ctx_r0.nzAddOnAfterIcon)("template", ctx_r0.nzAddOnAfter);
  }
}
function NzInputGroupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 2);
    ɵɵconditionalCreate(1, NzInputGroupComponent_Conditional_0_Conditional_1_Template, 1, 2, "span", 3);
    ɵɵconditionalCreate(2, NzInputGroupComponent_Conditional_0_Conditional_2_Template, 2, 11, "span", 4)(3, NzInputGroupComponent_Conditional_0_Conditional_3_Template, 1, 1, null, 5);
    ɵɵconditionalCreate(4, NzInputGroupComponent_Conditional_0_Conditional_4_Template, 1, 2, "span", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzAddOnBefore || ctx_r0.nzAddOnBeforeIcon ? 1 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.isAffix || ctx_r0.hasFeedback ? 2 : 3);
    ɵɵadvance(2);
    ɵɵconditional(ctx_r0.nzAddOnAfter || ctx_r0.nzAddOnAfterIcon ? 4 : -1);
  }
}
function NzInputGroupComponent_Conditional_1_Conditional_0_ng_template_0_Template(rf, ctx) {
}
function NzInputGroupComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzInputGroupComponent_Conditional_1_Conditional_0_ng_template_0_Template, 0, 0, "ng-template", 5);
  }
  if (rf & 2) {
    ɵɵnextContext(2);
    const affixTemplate_r2 = ɵɵreference(3);
    ɵɵproperty("ngTemplateOutlet", affixTemplate_r2);
  }
}
function NzInputGroupComponent_Conditional_1_Conditional_1_ng_template_0_Template(rf, ctx) {
}
function NzInputGroupComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzInputGroupComponent_Conditional_1_Conditional_1_ng_template_0_Template, 0, 0, "ng-template", 5);
  }
  if (rf & 2) {
    ɵɵnextContext(2);
    const contentTemplate_r3 = ɵɵreference(5);
    ɵɵproperty("ngTemplateOutlet", contentTemplate_r3);
  }
}
function NzInputGroupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzInputGroupComponent_Conditional_1_Conditional_0_Template, 1, 1, null, 5)(1, NzInputGroupComponent_Conditional_1_Conditional_1_Template, 1, 1, null, 5);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.isAffix ? 0 : 1);
  }
}
function NzInputGroupComponent_ng_template_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 7);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("icon", ctx_r0.nzPrefixIcon)("template", ctx_r0.nzPrefix);
  }
}
function NzInputGroupComponent_ng_template_2_ng_template_1_Template(rf, ctx) {
}
function NzInputGroupComponent_ng_template_2_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-form-item-feedback-icon", 9);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵproperty("status", ctx_r0.status);
  }
}
function NzInputGroupComponent_ng_template_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 8);
    ɵɵconditionalCreate(1, NzInputGroupComponent_ng_template_2_Conditional_2_Conditional_1_Template, 1, 1, "nz-form-item-feedback-icon", 9);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("icon", ctx_r0.nzSuffixIcon)("template", ctx_r0.nzSuffix);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.isFeedback ? 1 : -1);
  }
}
function NzInputGroupComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzInputGroupComponent_ng_template_2_Conditional_0_Template, 1, 2, "span", 7);
    ɵɵtemplate(1, NzInputGroupComponent_ng_template_2_ng_template_1_Template, 0, 0, "ng-template", 5);
    ɵɵconditionalCreate(2, NzInputGroupComponent_ng_template_2_Conditional_2_Template, 2, 3, "span", 8);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const contentTemplate_r3 = ɵɵreference(5);
    ɵɵconditional(ctx_r0.nzPrefix || ctx_r0.nzPrefixIcon ? 0 : -1);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", contentTemplate_r3);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzSuffix || ctx_r0.nzSuffixIcon || ctx_r0.isFeedback ? 2 : -1);
  }
}
function NzInputGroupComponent_ng_template_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 10);
    ɵɵelement(1, "nz-form-item-feedback-icon", 9);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("status", ctx_r0.status);
  }
}
function NzInputGroupComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
    ɵɵconditionalCreate(1, NzInputGroupComponent_ng_template_4_Conditional_1_Template, 2, 1, "span", 10);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(!ctx_r0.isAddOn && !ctx_r0.isAffix && ctx_r0.isFeedback ? 1 : -1);
  }
}
var _c2 = ["otpInput"];
function NzInputOtpComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "input", 2, 0);
    ɵɵlistener("input", function NzInputOtpComponent_For_1_Template_input_input_0_listener($event) {
      const $index_r2 = ɵɵrestoreView(_r1).$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onInput($index_r2, $event));
    })("focus", function NzInputOtpComponent_For_1_Template_input_focus_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onFocus($event));
    })("keydown", function NzInputOtpComponent_For_1_Template_input_keydown_0_listener($event) {
      const $index_r2 = ɵɵrestoreView(_r1).$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onKeyDown($index_r2, $event));
    })("paste", function NzInputOtpComponent_For_1_Template_input_paste_0_listener($event) {
      const $index_r2 = ɵɵrestoreView(_r1).$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onPaste($index_r2, $event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r2 = ɵɵnextContext();
    ɵɵproperty("nzSize", ctx_r2.nzSize)("formControl", item_r4)("nzStatus", ctx_r2.nzStatus);
  }
}
var _c3 = [[["textarea", "nz-input", ""]]];
var _c4 = ["textarea[nz-input]"];
var NzAutosizeDirective = class _NzAutosizeDirective {
  ngZone = inject(NgZone);
  platform = inject(Platform);
  destroyRef = inject(DestroyRef);
  resizeService = inject(NzResizeService);
  el = inject(ElementRef).nativeElement;
  autosize = false;
  cachedLineHeight;
  previousValue;
  previousMinRows;
  minRows;
  maxRows;
  maxHeight = null;
  minHeight = null;
  inputGap = 10;
  destroyed = false;
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });
  }
  set nzAutosize(value) {
    const isAutoSizeType = (data) => typeof data !== "string" && typeof data !== "boolean" && (!!data.maxRows || !!data.minRows);
    if (typeof value === "string" || value === true) {
      this.autosize = true;
    } else if (isAutoSizeType(value)) {
      this.autosize = true;
      this.minRows = value.minRows;
      this.maxRows = value.maxRows;
      this.maxHeight = this.setMaxHeight();
      this.minHeight = this.setMinHeight();
    }
  }
  resizeToFitContent(force = false) {
    this.cacheTextareaLineHeight();
    if (!this.cachedLineHeight) {
      return;
    }
    const textarea = this.el;
    const value = textarea.value;
    if (!force && this.minRows === this.previousMinRows && value === this.previousValue) {
      return;
    }
    const placeholderText = textarea.placeholder;
    textarea.classList.add("nz-textarea-autosize-measuring");
    textarea.placeholder = "";
    let height = Math.round((textarea.scrollHeight - this.inputGap) / this.cachedLineHeight) * this.cachedLineHeight + this.inputGap;
    if (this.maxHeight !== null && height > this.maxHeight) {
      height = this.maxHeight;
    }
    if (this.minHeight !== null && height < this.minHeight) {
      height = this.minHeight;
    }
    textarea.style.height = `${height}px`;
    textarea.classList.remove("nz-textarea-autosize-measuring");
    textarea.placeholder = placeholderText;
    if (typeof requestAnimationFrame !== "undefined") {
      this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => {
        const {
          selectionStart,
          selectionEnd
        } = textarea;
        if (!this.destroyed && document.activeElement === textarea) {
          textarea.setSelectionRange(selectionStart, selectionEnd);
        }
      }));
    }
    this.previousValue = value;
    this.previousMinRows = this.minRows;
  }
  cacheTextareaLineHeight() {
    if (this.cachedLineHeight >= 0 || !this.el.parentNode) {
      return;
    }
    const textareaClone = this.el.cloneNode(false);
    textareaClone.rows = 1;
    textareaClone.style.position = "absolute";
    textareaClone.style.visibility = "hidden";
    textareaClone.style.border = "none";
    textareaClone.style.padding = "0";
    textareaClone.style.height = "";
    textareaClone.style.minHeight = "";
    textareaClone.style.maxHeight = "";
    textareaClone.style.overflow = "hidden";
    this.el.parentNode.appendChild(textareaClone);
    this.cachedLineHeight = textareaClone.clientHeight - this.inputGap;
    this.el.parentNode.removeChild(textareaClone);
    this.maxHeight = this.setMaxHeight();
    this.minHeight = this.setMinHeight();
  }
  setMinHeight() {
    const minHeight = this.minRows && this.cachedLineHeight ? this.minRows * this.cachedLineHeight + this.inputGap : null;
    if (minHeight !== null) {
      this.el.style.minHeight = `${minHeight}px`;
    }
    return minHeight;
  }
  setMaxHeight() {
    const maxHeight = this.maxRows && this.cachedLineHeight ? this.maxRows * this.cachedLineHeight + this.inputGap : null;
    if (maxHeight !== null) {
      this.el.style.maxHeight = `${maxHeight}px`;
    }
    return maxHeight;
  }
  noopInputHandler() {
  }
  ngAfterViewInit() {
    if (this.autosize && this.platform.isBrowser) {
      this.resizeToFitContent();
      this.resizeService.connect().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.resizeToFitContent(true));
    }
  }
  ngDoCheck() {
    if (this.autosize && this.platform.isBrowser) {
      this.resizeToFitContent();
    }
  }
  static ɵfac = function NzAutosizeDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzAutosizeDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzAutosizeDirective,
    selectors: [["textarea", "nzAutosize", ""]],
    hostAttrs: ["rows", "1"],
    hostBindings: function NzAutosizeDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("input", function NzAutosizeDirective_input_HostBindingHandler() {
          return ctx.noopInputHandler();
        });
      }
    },
    inputs: {
      nzAutosize: "nzAutosize"
    },
    exportAs: ["nzAutosize"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzAutosizeDirective, [{
    type: Directive,
    args: [{
      selector: "textarea[nzAutosize]",
      exportAs: "nzAutosize",
      host: {
        // Textarea elements that have the directive applied should have a single row by default.
        // Browsers normally show two rows by default and therefore this limits the minRows binding.
        rows: "1",
        "(input)": "noopInputHandler()"
      }
    }]
  }], () => [], {
    nzAutosize: [{
      type: Input
    }]
  });
})();
var NzInputAddonBeforeDirective = class _NzInputAddonBeforeDirective {
  static ɵfac = function NzInputAddonBeforeDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputAddonBeforeDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzInputAddonBeforeDirective,
    selectors: [["", "nzInputAddonBefore", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputAddonBeforeDirective, [{
    type: Directive,
    args: [{
      selector: "[nzInputAddonBefore]"
    }]
  }], null, null);
})();
var NzInputAddonAfterDirective = class _NzInputAddonAfterDirective {
  static ɵfac = function NzInputAddonAfterDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputAddonAfterDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzInputAddonAfterDirective,
    selectors: [["", "nzInputAddonAfter", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputAddonAfterDirective, [{
    type: Directive,
    args: [{
      selector: "[nzInputAddonAfter]"
    }]
  }], null, null);
})();
var NzInputPrefixDirective = class _NzInputPrefixDirective {
  static ɵfac = function NzInputPrefixDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputPrefixDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzInputPrefixDirective,
    selectors: [["", "nzInputPrefix", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputPrefixDirective, [{
    type: Directive,
    args: [{
      selector: "[nzInputPrefix]"
    }]
  }], null, null);
})();
var NzInputSuffixDirective = class _NzInputSuffixDirective {
  static ɵfac = function NzInputSuffixDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputSuffixDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzInputSuffixDirective,
    selectors: [["", "nzInputSuffix", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputSuffixDirective, [{
    type: Directive,
    args: [{
      selector: "[nzInputSuffix]"
    }]
  }], null, null);
})();
var NzInputGroupSlotComponent = class _NzInputGroupSlotComponent {
  icon = null;
  type = null;
  template = null;
  static ɵfac = function NzInputGroupSlotComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputGroupSlotComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzInputGroupSlotComponent,
    selectors: [["", "nz-input-group-slot", ""]],
    hostVars: 6,
    hostBindings: function NzInputGroupSlotComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-input-group-addon", ctx.type === "addon")("ant-input-prefix", ctx.type === "prefix")("ant-input-suffix", ctx.type === "suffix");
      }
    },
    inputs: {
      icon: "icon",
      type: "type",
      template: "template"
    },
    attrs: _c0,
    ngContentSelectors: _c1,
    decls: 3,
    vars: 2,
    consts: [[3, "nzType"], [4, "nzStringTemplateOutlet"]],
    template: function NzInputGroupSlotComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, NzInputGroupSlotComponent_Conditional_0_Template, 1, 1, "nz-icon", 0);
        ɵɵtemplate(1, NzInputGroupSlotComponent_ng_container_1_Template, 2, 1, "ng-container", 1);
        ɵɵprojection(2);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.icon ? 0 : -1);
        ɵɵadvance();
        ɵɵproperty("nzStringTemplateOutlet", ctx.template);
      }
    },
    dependencies: [NzIconModule, NzIconDirective, NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputGroupSlotComponent, [{
    type: Component,
    args: [{
      selector: "[nz-input-group-slot]",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @if (icon) {
      <nz-icon [nzType]="icon" />
    }
    <ng-container *nzStringTemplateOutlet="template">{{ template }}</ng-container>
    <ng-content></ng-content>
  `,
      host: {
        "[class.ant-input-group-addon]": `type === 'addon'`,
        "[class.ant-input-prefix]": `type === 'prefix'`,
        "[class.ant-input-suffix]": `type === 'suffix'`
      },
      imports: [NzIconModule, NzOutletModule]
    }]
  }], null, {
    icon: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    template: [{
      type: Input
    }]
  });
})();
var NzInputDirective = class _NzInputDirective {
  renderer = inject(Renderer2);
  elementRef = inject(ElementRef);
  hostView = inject(ViewContainerRef);
  directionality = inject(Directionality);
  compactSize = inject(NZ_SPACE_COMPACT_SIZE, {
    optional: true
  });
  destroyRef = inject(DestroyRef);
  nzFormStatusService = inject(NzFormStatusService, {
    optional: true
  });
  nzFormNoStatusService = inject(NzFormNoStatusService, {
    optional: true
  });
  focusMonitor = inject(FocusMonitor);
  /**
   * @deprecated Will be removed in v21. It is recommended to use `nzVariant` instead.
   */
  nzBorderless = false;
  nzVariant = "outlined";
  nzSize = "default";
  nzStepperless = true;
  nzStatus = "";
  get disabled() {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  _disabled = false;
  disabled$ = new Subject();
  dir = "ltr";
  // status
  prefixCls = "ant-input";
  status = "";
  statusCls = {};
  hasFeedback = false;
  feedbackRef = null;
  components = [];
  ngControl = inject(NgControl, {
    self: true,
    optional: true
  });
  focused = signal(false, ...ngDevMode ? [{
    debugName: "focused"
  }] : []);
  finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.size();
  }, ...ngDevMode ? [{
    debugName: "finalSize"
  }] : []);
  size = signal(this.nzSize, ...ngDevMode ? [{
    debugName: "size"
  }] : []);
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.elementRef);
    });
  }
  ngOnInit() {
    this.nzFormStatusService?.formStatusChanges.pipe(distinctUntilChanged((pre, cur) => {
      return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
    }), takeUntilDestroyed(this.destroyRef)).subscribe(({
      status,
      hasFeedback
    }) => {
      this.setStatusStyles(status, hasFeedback);
    });
    if (this.ngControl) {
      this.ngControl.statusChanges?.pipe(filter(() => this.ngControl.disabled !== null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.disabled$.next(this.ngControl.disabled);
      });
    }
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
    });
    this.focusMonitor.monitor(this.elementRef, false).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((origin) => this.focused.set(!!origin));
  }
  ngOnChanges({
    disabled,
    nzStatus,
    nzSize
  }) {
    if (disabled) {
      this.disabled$.next(this.disabled);
    }
    if (nzStatus) {
      this.setStatusStyles(this.nzStatus, this.hasFeedback);
    }
    if (nzSize) {
      this.size.set(nzSize.currentValue);
    }
  }
  setStatusStyles(status, hasFeedback) {
    this.status = status;
    this.hasFeedback = hasFeedback;
    this.renderFeedbackIcon();
    this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
    Object.keys(this.statusCls).forEach((status2) => {
      if (this.statusCls[status2]) {
        this.renderer.addClass(this.elementRef.nativeElement, status2);
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, status2);
      }
    });
  }
  renderFeedbackIcon() {
    if (!this.status || !this.hasFeedback || !!this.nzFormNoStatusService) {
      this.hostView.clear();
      this.feedbackRef = null;
      return;
    }
    this.feedbackRef = this.feedbackRef || this.hostView.createComponent(NzFormItemFeedbackIconComponent);
    this.feedbackRef.location.nativeElement.classList.add("ant-input-suffix");
    this.feedbackRef.instance.status = this.status;
    this.feedbackRef.instance.updateIcon();
  }
  static ɵfac = function NzInputDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzInputDirective,
    selectors: [["input", "nz-input", ""], ["textarea", "nz-input", ""]],
    hostAttrs: [1, "ant-input"],
    hostVars: 19,
    hostBindings: function NzInputDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("disabled", ctx.disabled || null);
        ɵɵclassProp("ant-input-disabled", ctx.disabled)("ant-input-borderless", ctx.nzVariant === "borderless" || ctx.nzVariant === "outlined" && ctx.nzBorderless)("ant-input-filled", ctx.nzVariant === "filled")("ant-input-underlined", ctx.nzVariant === "underlined")("ant-input-lg", ctx.finalSize() === "large")("ant-input-sm", ctx.finalSize() === "small")("ant-input-rtl", ctx.dir === "rtl")("ant-input-stepperless", ctx.nzStepperless)("ant-input-focused", ctx.focused());
      }
    },
    inputs: {
      nzBorderless: [2, "nzBorderless", "nzBorderless", booleanAttribute],
      nzVariant: "nzVariant",
      nzSize: "nzSize",
      nzStepperless: [2, "nzStepperless", "nzStepperless", booleanAttribute],
      nzStatus: "nzStatus",
      disabled: [2, "disabled", "disabled", booleanAttribute]
    },
    exportAs: ["nzInput"],
    features: [ɵɵProvidersFeature([{
      provide: NZ_SPACE_COMPACT_ITEM_TYPE,
      useValue: "input"
    }]), ɵɵHostDirectivesFeature([NzSpaceCompactItemDirective]), ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputDirective, [{
    type: Directive,
    args: [{
      selector: "input[nz-input],textarea[nz-input]",
      exportAs: "nzInput",
      host: {
        class: "ant-input",
        "[class.ant-input-disabled]": "disabled",
        "[class.ant-input-borderless]": `nzVariant === 'borderless' || (nzVariant === 'outlined' && nzBorderless)`,
        "[class.ant-input-filled]": `nzVariant === 'filled'`,
        "[class.ant-input-underlined]": `nzVariant === 'underlined'`,
        "[class.ant-input-lg]": `finalSize() === 'large'`,
        "[class.ant-input-sm]": `finalSize() === 'small'`,
        "[attr.disabled]": "disabled || null",
        "[class.ant-input-rtl]": `dir=== 'rtl'`,
        "[class.ant-input-stepperless]": `nzStepperless`,
        "[class.ant-input-focused]": "focused()"
      },
      hostDirectives: [NzSpaceCompactItemDirective],
      providers: [{
        provide: NZ_SPACE_COMPACT_ITEM_TYPE,
        useValue: "input"
      }]
    }]
  }], () => [], {
    nzBorderless: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzVariant: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    nzStepperless: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzStatus: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzInputGroupWhitSuffixOrPrefixDirective = class _NzInputGroupWhitSuffixOrPrefixDirective {
  elementRef = inject(ElementRef);
  static ɵfac = function NzInputGroupWhitSuffixOrPrefixDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputGroupWhitSuffixOrPrefixDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzInputGroupWhitSuffixOrPrefixDirective,
    selectors: [["nz-input-group", "nzSuffix", ""], ["nz-input-group", "nzPrefix", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputGroupWhitSuffixOrPrefixDirective, [{
    type: Directive,
    args: [{
      selector: `nz-input-group[nzSuffix], nz-input-group[nzPrefix]`
    }]
  }], null, null);
})();
var NzInputGroupComponent = class _NzInputGroupComponent {
  focusMonitor = inject(FocusMonitor);
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  cdr = inject(ChangeDetectorRef);
  directionality = inject(Directionality);
  destroyRef = inject(DestroyRef);
  nzFormStatusService = inject(NzFormStatusService, {
    optional: true
  });
  nzFormNoStatusService = inject(NzFormNoStatusService, {
    optional: true
  });
  listOfNzInputDirective;
  nzAddOnBeforeIcon = null;
  nzAddOnAfterIcon = null;
  nzPrefixIcon = null;
  nzSuffixIcon = null;
  nzAddOnBefore;
  nzAddOnAfter;
  nzPrefix;
  nzStatus = "";
  nzSuffix;
  nzSize = "default";
  nzSearch = false;
  isLarge = false;
  isSmall = false;
  isAffix = false;
  isAddOn = false;
  isFeedback = false;
  focused = false;
  disabled = false;
  dir = "ltr";
  // status
  prefixCls = "ant-input";
  affixStatusCls = {};
  groupStatusCls = {};
  affixInGroupStatusCls = {};
  status = "";
  hasFeedback = false;
  constructor() {
    this.destroyRef.onDestroy(() => this.focusMonitor.stopMonitoring(this.elementRef));
  }
  updateChildrenInputSize() {
    if (this.listOfNzInputDirective) {
      this.listOfNzInputDirective.forEach((item) => item["size"].set(this.nzSize));
    }
  }
  ngOnInit() {
    this.nzFormStatusService?.formStatusChanges.pipe(distinctUntilChanged((pre, cur) => pre.status === cur.status && pre.hasFeedback === cur.hasFeedback), takeUntilDestroyed(this.destroyRef)).subscribe(({
      status,
      hasFeedback
    }) => {
      this.setStatusStyles(status, hasFeedback);
    });
    this.focusMonitor.monitor(this.elementRef, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((focusOrigin) => {
      this.focused = !!focusOrigin;
      this.cdr.markForCheck();
    });
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
    });
  }
  ngAfterContentInit() {
    this.updateChildrenInputSize();
    const listOfInputChange$ = this.listOfNzInputDirective.changes.pipe(startWith(this.listOfNzInputDirective));
    listOfInputChange$.pipe(switchMap((list) => merge(...[listOfInputChange$, ...list.map((input) => input.disabled$)])), mergeMap(() => listOfInputChange$), map((list) => list.some((input) => input.disabled)), takeUntilDestroyed(this.destroyRef)).subscribe((disabled) => {
      this.disabled = disabled;
      this.cdr.markForCheck();
    });
  }
  ngOnChanges(changes) {
    const {
      nzSize,
      nzSuffix,
      nzPrefix,
      nzPrefixIcon,
      nzSuffixIcon,
      nzAddOnAfter,
      nzAddOnBefore,
      nzAddOnAfterIcon,
      nzAddOnBeforeIcon,
      nzStatus
    } = changes;
    if (nzSize) {
      this.updateChildrenInputSize();
      this.isLarge = this.nzSize === "large";
      this.isSmall = this.nzSize === "small";
    }
    if (nzSuffix || nzPrefix || nzPrefixIcon || nzSuffixIcon) {
      this.isAffix = !!(this.nzSuffix || this.nzPrefix || this.nzPrefixIcon || this.nzSuffixIcon);
    }
    if (nzAddOnAfter || nzAddOnBefore || nzAddOnAfterIcon || nzAddOnBeforeIcon) {
      this.isAddOn = !!(this.nzAddOnAfter || this.nzAddOnBefore || this.nzAddOnAfterIcon || this.nzAddOnBeforeIcon);
      this.nzFormNoStatusService?.noFormStatus?.next(this.isAddOn);
    }
    if (nzStatus) {
      this.setStatusStyles(this.nzStatus, this.hasFeedback);
    }
  }
  setStatusStyles(status, hasFeedback) {
    this.status = status;
    this.hasFeedback = hasFeedback;
    this.isFeedback = !!status && hasFeedback;
    const baseAffix = !!(this.nzSuffix || this.nzPrefix || this.nzPrefixIcon || this.nzSuffixIcon);
    this.isAffix = baseAffix || !this.isAddOn && hasFeedback;
    this.affixInGroupStatusCls = this.isAffix || this.isFeedback ? this.affixStatusCls = getStatusClassNames(`${this.prefixCls}-affix-wrapper`, status, hasFeedback) : {};
    this.cdr.markForCheck();
    this.affixStatusCls = getStatusClassNames(`${this.prefixCls}-affix-wrapper`, this.isAddOn ? "" : status, this.isAddOn ? false : hasFeedback);
    this.groupStatusCls = getStatusClassNames(`${this.prefixCls}-group-wrapper`, this.isAddOn ? status : "", this.isAddOn ? hasFeedback : false);
    const statusCls = __spreadValues(__spreadValues({}, this.affixStatusCls), this.groupStatusCls);
    Object.keys(statusCls).forEach((status2) => {
      if (statusCls[status2]) {
        this.renderer.addClass(this.elementRef.nativeElement, status2);
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, status2);
      }
    });
  }
  static ɵfac = function NzInputGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzInputGroupComponent,
    selectors: [["nz-input-group"]],
    contentQueries: function NzInputGroupComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzInputDirective, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.listOfNzInputDirective = _t);
      }
    },
    hostVars: 38,
    hostBindings: function NzInputGroupComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-input-search-enter-button", ctx.nzSearch)("ant-input-search", ctx.nzSearch)("ant-input-search-rtl", ctx.dir === "rtl")("ant-input-search-sm", ctx.nzSearch && ctx.isSmall)("ant-input-search-large", ctx.nzSearch && ctx.isLarge)("ant-input-group-wrapper", ctx.isAddOn)("ant-input-group-wrapper-rtl", ctx.dir === "rtl")("ant-input-group-wrapper-lg", ctx.isAddOn && ctx.isLarge)("ant-input-group-wrapper-sm", ctx.isAddOn && ctx.isSmall)("ant-input-affix-wrapper", ctx.isAffix && !ctx.isAddOn)("ant-input-affix-wrapper-rtl", ctx.dir === "rtl")("ant-input-affix-wrapper-focused", ctx.isAffix && ctx.focused)("ant-input-affix-wrapper-disabled", ctx.isAffix && ctx.disabled)("ant-input-affix-wrapper-lg", ctx.isAffix && !ctx.isAddOn && ctx.isLarge)("ant-input-affix-wrapper-sm", ctx.isAffix && !ctx.isAddOn && ctx.isSmall)("ant-input-group", !ctx.isAffix && !ctx.isAddOn)("ant-input-group-rtl", ctx.dir === "rtl")("ant-input-group-lg", !ctx.isAffix && !ctx.isAddOn && ctx.isLarge)("ant-input-group-sm", !ctx.isAffix && !ctx.isAddOn && ctx.isSmall);
      }
    },
    inputs: {
      nzAddOnBeforeIcon: "nzAddOnBeforeIcon",
      nzAddOnAfterIcon: "nzAddOnAfterIcon",
      nzPrefixIcon: "nzPrefixIcon",
      nzSuffixIcon: "nzSuffixIcon",
      nzAddOnBefore: "nzAddOnBefore",
      nzAddOnAfter: "nzAddOnAfter",
      nzPrefix: "nzPrefix",
      nzStatus: "nzStatus",
      nzSuffix: "nzSuffix",
      nzSize: "nzSize",
      nzSearch: [2, "nzSearch", "nzSearch", booleanAttribute]
    },
    exportAs: ["nzInputGroup"],
    features: [ɵɵProvidersFeature([NzFormNoStatusService, {
      provide: NZ_SPACE_COMPACT_ITEM_TYPE,
      useValue: "input"
    }]), ɵɵHostDirectivesFeature([NzSpaceCompactItemDirective]), ɵɵNgOnChangesFeature],
    ngContentSelectors: _c1,
    decls: 6,
    vars: 1,
    consts: [["affixTemplate", ""], ["contentTemplate", ""], [1, "ant-input-wrapper", "ant-input-group"], ["nz-input-group-slot", "", "type", "addon", 3, "icon", "template"], [1, "ant-input-affix-wrapper", 3, "ant-input-affix-wrapper-disabled", "ant-input-affix-wrapper-sm", "ant-input-affix-wrapper-lg", "ant-input-affix-wrapper-focused", "class"], [3, "ngTemplateOutlet"], [1, "ant-input-affix-wrapper"], ["nz-input-group-slot", "", "type", "prefix", 3, "icon", "template"], ["nz-input-group-slot", "", "type", "suffix", 3, "icon", "template"], [3, "status"], ["nz-input-group-slot", "", "type", "suffix"]],
    template: function NzInputGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, NzInputGroupComponent_Conditional_0_Template, 5, 3, "span", 2)(1, NzInputGroupComponent_Conditional_1_Template, 2, 1);
        ɵɵtemplate(2, NzInputGroupComponent_ng_template_2_Template, 3, 3, "ng-template", null, 0, ɵɵtemplateRefExtractor)(4, NzInputGroupComponent_ng_template_4_Template, 2, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.isAddOn ? 0 : 1);
      }
    },
    dependencies: [NzInputGroupSlotComponent, NgTemplateOutlet, NzFormItemFeedbackIconComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-input-group",
      exportAs: "nzInputGroup",
      imports: [NzInputGroupSlotComponent, NgTemplateOutlet, NzFormItemFeedbackIconComponent],
      encapsulation: ViewEncapsulation.None,
      providers: [NzFormNoStatusService, {
        provide: NZ_SPACE_COMPACT_ITEM_TYPE,
        useValue: "input"
      }],
      template: `
    @if (isAddOn) {
      <span class="ant-input-wrapper ant-input-group">
        @if (nzAddOnBefore || nzAddOnBeforeIcon) {
          <span nz-input-group-slot type="addon" [icon]="nzAddOnBeforeIcon" [template]="nzAddOnBefore"></span>
        }

        @if (isAffix || hasFeedback) {
          <span
            class="ant-input-affix-wrapper"
            [class.ant-input-affix-wrapper-disabled]="disabled"
            [class.ant-input-affix-wrapper-sm]="isSmall"
            [class.ant-input-affix-wrapper-lg]="isLarge"
            [class.ant-input-affix-wrapper-focused]="focused"
            [class]="affixInGroupStatusCls"
          >
            <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
          </span>
        } @else {
          <ng-template [ngTemplateOutlet]="contentTemplate" />
        }
        @if (nzAddOnAfter || nzAddOnAfterIcon) {
          <span nz-input-group-slot type="addon" [icon]="nzAddOnAfterIcon" [template]="nzAddOnAfter"></span>
        }
      </span>
    } @else {
      @if (isAffix) {
        <ng-template [ngTemplateOutlet]="affixTemplate" />
      } @else {
        <ng-template [ngTemplateOutlet]="contentTemplate" />
      }
    }

    <!-- affix template -->
    <ng-template #affixTemplate>
      @if (nzPrefix || nzPrefixIcon) {
        <span nz-input-group-slot type="prefix" [icon]="nzPrefixIcon" [template]="nzPrefix"></span>
      }
      <ng-template [ngTemplateOutlet]="contentTemplate" />
      @if (nzSuffix || nzSuffixIcon || isFeedback) {
        <span nz-input-group-slot type="suffix" [icon]="nzSuffixIcon" [template]="nzSuffix">
          @if (isFeedback) {
            <nz-form-item-feedback-icon [status]="status" />
          }
        </span>
      }
    </ng-template>

    <!-- content template -->
    <ng-template #contentTemplate>
      <ng-content></ng-content>
      @if (!isAddOn && !isAffix && isFeedback) {
        <span nz-input-group-slot type="suffix">
          <nz-form-item-feedback-icon [status]="status" />
        </span>
      }
    </ng-template>
  `,
      host: {
        "[class.ant-input-search-enter-button]": `nzSearch`,
        "[class.ant-input-search]": `nzSearch`,
        "[class.ant-input-search-rtl]": `dir === 'rtl'`,
        "[class.ant-input-search-sm]": `nzSearch && isSmall`,
        "[class.ant-input-search-large]": `nzSearch && isLarge`,
        "[class.ant-input-group-wrapper]": `isAddOn`,
        "[class.ant-input-group-wrapper-rtl]": `dir === 'rtl'`,
        "[class.ant-input-group-wrapper-lg]": `isAddOn && isLarge`,
        "[class.ant-input-group-wrapper-sm]": `isAddOn && isSmall`,
        "[class.ant-input-affix-wrapper]": `isAffix && !isAddOn`,
        "[class.ant-input-affix-wrapper-rtl]": `dir === 'rtl'`,
        "[class.ant-input-affix-wrapper-focused]": `isAffix && focused`,
        "[class.ant-input-affix-wrapper-disabled]": `isAffix && disabled`,
        "[class.ant-input-affix-wrapper-lg]": `isAffix && !isAddOn && isLarge`,
        "[class.ant-input-affix-wrapper-sm]": `isAffix && !isAddOn && isSmall`,
        "[class.ant-input-group]": `!isAffix && !isAddOn`,
        "[class.ant-input-group-rtl]": `dir === 'rtl'`,
        "[class.ant-input-group-lg]": `!isAffix && !isAddOn && isLarge`,
        "[class.ant-input-group-sm]": `!isAffix && !isAddOn && isSmall`
      },
      hostDirectives: [NzSpaceCompactItemDirective],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], {
    listOfNzInputDirective: [{
      type: ContentChildren,
      args: [NzInputDirective]
    }],
    nzAddOnBeforeIcon: [{
      type: Input
    }],
    nzAddOnAfterIcon: [{
      type: Input
    }],
    nzPrefixIcon: [{
      type: Input
    }],
    nzSuffixIcon: [{
      type: Input
    }],
    nzAddOnBefore: [{
      type: Input
    }],
    nzAddOnAfter: [{
      type: Input
    }],
    nzPrefix: [{
      type: Input
    }],
    nzStatus: [{
      type: Input
    }],
    nzSuffix: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    nzSearch: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzInputOtpComponent = class _NzInputOtpComponent {
  formBuilder = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  otpInputs;
  nzLength = 6;
  nzSize = "default";
  disabled = false;
  nzStatus = "";
  nzFormatter = (value) => value;
  nzMask = null;
  otpArray;
  internalValue = [];
  onChangeCallback;
  onTouched = () => {
  };
  constructor() {
    this.createFormArray();
  }
  ngOnChanges(changes) {
    if (changes["nzLength"]?.currentValue) {
      this.createFormArray();
    }
    if (changes["disabled"]) {
      this.setDisabledState(this.disabled);
    }
  }
  onInput(index, event) {
    const inputElement = event.target;
    const nextInput = this.otpInputs.toArray()[index + 1];
    if (inputElement.value && nextInput) {
      nextInput.nativeElement.focus();
    } else if (!nextInput) {
      this.selectInputBox(index);
    }
  }
  onFocus(event) {
    const inputElement = event.target;
    inputElement.select();
  }
  onKeyDown(index, event) {
    const previousInput = this.otpInputs.toArray()[index - 1];
    if (event.keyCode === BACKSPACE) {
      event.preventDefault();
      this.internalValue[index] = "";
      this.otpArray.at(index).setValue("", {
        emitEvent: false
      });
      if (previousInput) {
        this.selectInputBox(index - 1);
      }
      this.emitValue();
    } else if (event.keyCode === LEFT_ARROW) {
      event.preventDefault();
      this.selectInputBox(index - 1);
    } else if (event.keyCode === RIGHT_ARROW) {
      event.preventDefault();
      this.selectInputBox(index + 1);
    }
  }
  writeValue(value) {
    if (!value) {
      this.otpArray.reset();
      return;
    }
    const controlValues = value.split("");
    this.internalValue = controlValues;
    controlValues.forEach((val, i) => {
      const formattedValue = this.nzFormatter(val);
      const value2 = this.nzMask ? this.nzMask : formattedValue;
      this.otpArray.at(i).setValue(value2, {
        emitEvent: false
      });
    });
  }
  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    if (isDisabled) {
      this.otpArray.disable();
    } else {
      this.otpArray.enable();
    }
  }
  onPaste(index, event) {
    const pastedText = event.clipboardData?.getData("text") || "";
    if (!pastedText) return;
    let currentIndex = index;
    for (const char of pastedText.split("")) {
      if (currentIndex < this.nzLength) {
        const formattedChar = this.nzFormatter(char);
        this.internalValue[currentIndex] = char;
        const maskedValue = this.nzMask ? this.nzMask : formattedChar;
        this.otpArray.at(currentIndex).setValue(maskedValue, {
          emitEvent: false
        });
        currentIndex++;
      } else {
        break;
      }
    }
    event.preventDefault();
    this.selectInputBox(currentIndex);
    this.emitValue();
  }
  createFormArray() {
    this.otpArray = this.formBuilder.array([]);
    this.internalValue = new Array(this.nzLength).fill("");
    for (let i = 0; i < this.nzLength; i++) {
      const control = this.formBuilder.nonNullable.control("", [Validators.required]);
      control.valueChanges.pipe(tap((value) => {
        const unmaskedValue = this.nzFormatter(value);
        this.internalValue[i] = unmaskedValue;
        control.setValue(this.nzMask ?? unmaskedValue, {
          emitEvent: false
        });
        this.emitValue();
      }), takeUntilDestroyed(this.destroyRef)).subscribe();
      this.otpArray.push(control);
    }
  }
  emitValue() {
    const result = this.internalValue.join("");
    if (this.onChangeCallback) {
      this.onChangeCallback(result);
    }
  }
  selectInputBox(index) {
    const otpInputArray = this.otpInputs.toArray();
    if (index <= 0) index = 0;
    if (index >= otpInputArray.length) index = otpInputArray.length - 1;
    otpInputArray[index].nativeElement.select();
  }
  static ɵfac = function NzInputOtpComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputOtpComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzInputOtpComponent,
    selectors: [["nz-input-otp"]],
    viewQuery: function NzInputOtpComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c2, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.otpInputs = _t);
      }
    },
    hostAttrs: [1, "ant-otp"],
    inputs: {
      nzLength: [2, "nzLength", "nzLength", numberAttribute],
      nzSize: "nzSize",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      nzStatus: "nzStatus",
      nzFormatter: "nzFormatter",
      nzMask: "nzMask"
    },
    exportAs: ["nzInputOtp"],
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _NzInputOtpComponent),
      multi: true
    }]), ɵɵNgOnChangesFeature],
    decls: 2,
    vars: 0,
    consts: [["otpInput", ""], ["nz-input", "", "type", "text", "maxlength", "1", "size", "1", 1, "ant-otp-input", 3, "nzSize", "formControl", "nzStatus"], ["nz-input", "", "type", "text", "maxlength", "1", "size", "1", 1, "ant-otp-input", 3, "input", "focus", "keydown", "paste", "nzSize", "formControl", "nzStatus"]],
    template: function NzInputOtpComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, NzInputOtpComponent_For_1_Template, 2, 3, "input", 1, ɵɵrepeaterTrackByIndex);
      }
      if (rf & 2) {
        ɵɵrepeater(ctx.otpArray.controls);
      }
    },
    dependencies: [NzInputDirective, ReactiveFormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, FormControlDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputOtpComponent, [{
    type: Component,
    args: [{
      selector: "nz-input-otp",
      exportAs: "nzInputOtp",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @for (item of otpArray.controls; track $index) {
      <input
        nz-input
        class="ant-otp-input"
        type="text"
        maxlength="1"
        size="1"
        [nzSize]="nzSize"
        [formControl]="item"
        [nzStatus]="nzStatus"
        (input)="onInput($index, $event)"
        (focus)="onFocus($event)"
        (keydown)="onKeyDown($index, $event)"
        (paste)="onPaste($index, $event)"
        #otpInput
      />
    }
  `,
      host: {
        class: "ant-otp"
      },
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NzInputOtpComponent),
        multi: true
      }],
      imports: [NzInputDirective, ReactiveFormsModule]
    }]
  }], () => [], {
    otpInputs: [{
      type: ViewChildren,
      args: ["otpInput"]
    }],
    nzLength: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzSize: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzStatus: [{
      type: Input
    }],
    nzFormatter: [{
      type: Input
    }],
    nzMask: [{
      type: Input
    }]
  });
})();
var NzTextareaCountComponent = class _NzTextareaCountComponent {
  renderer = inject(Renderer2);
  destroyRef = inject(DestroyRef);
  elementRef = inject(ElementRef);
  nzInputDirective;
  nzMaxCharacterCount = 0;
  nzComputeCharacterCount = (v) => v.length;
  nzFormatter = (c, m) => `${c}${m > 0 ? `/${m}` : ``}`;
  ngAfterContentInit() {
    if (!this.nzInputDirective && isDevMode()) {
      throw new Error("[nz-textarea-count]: Could not find matching textarea[nz-input] child.");
    }
    if (this.nzInputDirective.ngControl) {
      const valueChanges = this.nzInputDirective.ngControl.valueChanges || EMPTY;
      valueChanges.pipe(takeUntilDestroyed(this.destroyRef), map(() => this.nzInputDirective.ngControl.value), startWith(this.nzInputDirective.ngControl.value)).subscribe((value) => {
        this.setDataCount(value);
      });
    }
  }
  setDataCount(value) {
    const inputValue = isNotNil(value) ? String(value) : "";
    const currentCount = this.nzComputeCharacterCount(inputValue);
    const dataCount = this.nzFormatter(currentCount, this.nzMaxCharacterCount);
    this.renderer.setAttribute(this.elementRef.nativeElement, "data-count", dataCount);
  }
  static ɵfac = function NzTextareaCountComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTextareaCountComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzTextareaCountComponent,
    selectors: [["nz-textarea-count"]],
    contentQueries: function NzTextareaCountComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzInputDirective, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzInputDirective = _t.first);
      }
    },
    hostAttrs: [1, "ant-input-textarea-show-count"],
    inputs: {
      nzMaxCharacterCount: [2, "nzMaxCharacterCount", "nzMaxCharacterCount", numberAttribute],
      nzComputeCharacterCount: "nzComputeCharacterCount",
      nzFormatter: "nzFormatter"
    },
    ngContentSelectors: _c4,
    decls: 1,
    vars: 0,
    template: function NzTextareaCountComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c3);
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTextareaCountComponent, [{
    type: Component,
    args: [{
      selector: "nz-textarea-count",
      template: `<ng-content select="textarea[nz-input]"></ng-content>`,
      host: {
        class: "ant-input-textarea-show-count"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, {
    nzInputDirective: [{
      type: ContentChild,
      args: [NzInputDirective, {
        static: true
      }]
    }],
    nzMaxCharacterCount: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzComputeCharacterCount: [{
      type: Input
    }],
    nzFormatter: [{
      type: Input
    }]
  });
})();
var NzInputModule = class _NzInputModule {
  static ɵfac = function NzInputModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzInputModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzInputModule,
    imports: [NzTextareaCountComponent, NzInputDirective, NzInputGroupComponent, NzAutosizeDirective, NzInputGroupSlotComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzInputOtpComponent],
    exports: [NzTextareaCountComponent, NzInputDirective, NzInputGroupComponent, NzAutosizeDirective, NzInputGroupWhitSuffixOrPrefixDirective, NzInputOtpComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzInputGroupComponent, NzInputGroupSlotComponent, NzInputOtpComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzInputModule, [{
    type: NgModule,
    args: [{
      imports: [NzTextareaCountComponent, NzInputDirective, NzInputGroupComponent, NzAutosizeDirective, NzInputGroupSlotComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzInputOtpComponent],
      exports: [NzTextareaCountComponent, NzInputDirective, NzInputGroupComponent, NzAutosizeDirective, NzInputGroupWhitSuffixOrPrefixDirective, NzInputOtpComponent]
    }]
  }], null, null);
})();
export {
  NzAutosizeDirective,
  NzInputAddonAfterDirective,
  NzInputAddonBeforeDirective,
  NzInputDirective,
  NzInputGroupComponent,
  NzInputGroupSlotComponent,
  NzInputGroupWhitSuffixOrPrefixDirective,
  NzInputModule,
  NzInputOtpComponent,
  NzInputPrefixDirective,
  NzInputSuffixDirective,
  NzTextareaCountComponent
};
//# sourceMappingURL=ng-zorro-antd_input.js.map
