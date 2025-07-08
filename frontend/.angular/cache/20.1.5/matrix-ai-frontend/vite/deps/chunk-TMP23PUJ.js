import {
  FocusMonitor
} from "./chunk-YCMEGHDE.js";
import {
  NzFormStatusService
} from "./chunk-5GDDE4XP.js";
import {
  CheckboxControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel
} from "./chunk-OSAHQ66W.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  takeUntilDestroyed,
  toSignal
} from "./chunk-LTLJ7NNZ.js";
import {
  fromEventOutsideAngular
} from "./chunk-MKTFS3GT.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  setClassMetadata,
  signal,
  untracked,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  Subject
} from "./chunk-JU3XS6KG.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-checkbox.mjs
var _c0 = ["*"];
var _c1 = ["inputElement"];
var _c2 = ["nz-checkbox", ""];
var _forTrack0 = ($index, $item) => $item.value;
function NzCheckboxGroupComponent_ProjectionFallback_0_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "label", 0);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("nzValue", option_r1.value)("nzName", ctx_r1.nzName())("nzDisabled", option_r1.disabled || ctx_r1.finalDisabled());
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", option_r1.label, " ");
  }
}
function NzCheckboxGroupComponent_ProjectionFallback_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, NzCheckboxGroupComponent_ProjectionFallback_0_For_1_Template, 2, 4, "label", 0, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵrepeater(ctx_r1.normalizedOptions());
  }
}
var NzCheckboxWrapperComponent = class _NzCheckboxWrapperComponent {
  nzOnChange = new EventEmitter();
  checkboxList = [];
  addCheckbox(value) {
    this.checkboxList.push(value);
  }
  removeCheckbox(value) {
    this.checkboxList.splice(this.checkboxList.indexOf(value), 1);
  }
  onChange() {
    const listOfCheckedValue = this.checkboxList.filter((item) => item.nzChecked).map((item) => item.nzValue);
    this.nzOnChange.emit(listOfCheckedValue);
  }
  static ɵfac = function NzCheckboxWrapperComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzCheckboxWrapperComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzCheckboxWrapperComponent,
    selectors: [["nz-checkbox-wrapper"]],
    hostAttrs: [1, "ant-checkbox-group"],
    outputs: {
      nzOnChange: "nzOnChange"
    },
    exportAs: ["nzCheckboxWrapper"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzCheckboxWrapperComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzCheckboxWrapperComponent, [{
    type: Component,
    args: [{
      selector: "nz-checkbox-wrapper",
      exportAs: "nzCheckboxWrapper",
      template: `<ng-content></ng-content>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-checkbox-group"
      }
    }]
  }], null, {
    nzOnChange: [{
      type: Output
    }]
  });
})();
var NZ_CHECKBOX_GROUP = new InjectionToken("NZ_CHECKBOX_GROUP");
var NzCheckboxComponent = class _NzCheckboxComponent {
  ngZone = inject(NgZone);
  elementRef = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);
  focusMonitor = inject(FocusMonitor);
  directionality = inject(Directionality);
  destroyRef = inject(DestroyRef);
  checkboxGroupComponent = inject(NZ_CHECKBOX_GROUP, {
    optional: true
  });
  nzFormStatusService = inject(NzFormStatusService, {
    optional: true
  });
  /** @deprecated */
  nzCheckboxWrapperComponent = inject(NzCheckboxWrapperComponent, {
    optional: true
  });
  dir = "ltr";
  destroy$ = new Subject();
  isNzDisableFirstChange = true;
  onChange = () => {
  };
  onTouched = () => {
  };
  inputElement;
  nzCheckedChange = new EventEmitter();
  nzValue = null;
  nzAutoFocus = false;
  nzDisabled = false;
  nzIndeterminate = false;
  nzChecked = false;
  nzId = null;
  nzName = null;
  innerCheckedChange(checked) {
    if (!this.nzDisabled && !this.checkboxGroupComponent?.finalDisabled()) {
      this.setValue(checked);
      this.nzCheckboxWrapperComponent?.onChange();
      this.checkboxGroupComponent?.onCheckedChange(this.nzValue, checked);
    }
  }
  writeValue(value) {
    this.nzChecked = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(disabled) {
    this.nzDisabled = this.isNzDisableFirstChange && this.nzDisabled || disabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }
  focus() {
    this.focusMonitor.focusVia(this.inputElement, "keyboard");
  }
  blur() {
    this.inputElement.nativeElement.blur();
  }
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.elementRef);
      this.nzCheckboxWrapperComponent?.removeCheckbox(this);
    });
    if (this.checkboxGroupComponent) {
      effect(() => {
        const values = this.checkboxGroupComponent.value() || [];
        this.setValue(values.includes(this.nzValue));
        this.cdr.markForCheck();
      });
    }
  }
  ngOnInit() {
    this.focusMonitor.monitor(this.elementRef, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((focusOrigin) => {
      if (!focusOrigin) {
        Promise.resolve().then(() => this.onTouched());
      }
    });
    this.nzCheckboxWrapperComponent?.addCheckbox(this);
    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
    fromEventOutsideAngular(this.elementRef.nativeElement, "click").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      event.preventDefault();
      this.focus();
      if (this.nzDisabled) {
        return;
      }
      this.ngZone.run(() => {
        this.innerCheckedChange(!this.nzChecked);
        this.cdr.markForCheck();
      });
    });
    fromEventOutsideAngular(this.inputElement.nativeElement, "click").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => event.stopPropagation());
  }
  ngAfterViewInit() {
    if (this.nzAutoFocus) {
      this.focus();
    }
  }
  setValue(value) {
    this.nzChecked = value;
    this.onChange(value);
    this.nzCheckedChange.emit(value);
  }
  static ɵfac = function NzCheckboxComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzCheckboxComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzCheckboxComponent,
    selectors: [["", "nz-checkbox", ""]],
    viewQuery: function NzCheckboxComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.inputElement = _t.first);
      }
    },
    hostAttrs: [1, "ant-checkbox-wrapper"],
    hostVars: 10,
    hostBindings: function NzCheckboxComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-checkbox-group-item", !!ctx.checkboxGroupComponent)("ant-checkbox-wrapper-in-form-item", !!ctx.nzFormStatusService)("ant-checkbox-wrapper-checked", ctx.nzChecked)("ant-checkbox-wrapper-disabled", ctx.nzDisabled || (ctx.checkboxGroupComponent == null ? null : ctx.checkboxGroupComponent.finalDisabled()))("ant-checkbox-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzValue: "nzValue",
      nzAutoFocus: [2, "nzAutoFocus", "nzAutoFocus", booleanAttribute],
      nzDisabled: [2, "nzDisabled", "nzDisabled", booleanAttribute],
      nzIndeterminate: [2, "nzIndeterminate", "nzIndeterminate", booleanAttribute],
      nzChecked: [2, "nzChecked", "nzChecked", booleanAttribute],
      nzId: "nzId",
      nzName: "nzName"
    },
    outputs: {
      nzCheckedChange: "nzCheckedChange"
    },
    exportAs: ["nzCheckbox"],
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _NzCheckboxComponent),
      multi: true
    }])],
    attrs: _c2,
    ngContentSelectors: _c0,
    decls: 6,
    vars: 12,
    consts: [["inputElement", ""], [1, "ant-checkbox"], ["type", "checkbox", 1, "ant-checkbox-input", 3, "ngModelChange", "checked", "ngModel", "disabled"], [1, "ant-checkbox-inner"]],
    template: function NzCheckboxComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵprojectionDef();
        ɵɵelementStart(0, "span", 1)(1, "input", 2, 0);
        ɵɵlistener("ngModelChange", function NzCheckboxComponent_Template_input_ngModelChange_1_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.innerCheckedChange($event));
        });
        ɵɵelementEnd();
        ɵɵelement(3, "span", 3);
        ɵɵelementEnd();
        ɵɵelementStart(4, "span");
        ɵɵprojection(5);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵclassProp("ant-checkbox-checked", ctx.nzChecked && !ctx.nzIndeterminate)("ant-checkbox-disabled", ctx.nzDisabled || (ctx.checkboxGroupComponent == null ? null : ctx.checkboxGroupComponent.finalDisabled()))("ant-checkbox-indeterminate", ctx.nzIndeterminate);
        ɵɵadvance();
        ɵɵproperty("checked", ctx.nzChecked)("ngModel", ctx.nzChecked)("disabled", ctx.nzDisabled || ((ctx.checkboxGroupComponent == null ? null : ctx.checkboxGroupComponent.finalDisabled()) ?? false));
        ɵɵattribute("autofocus", ctx.nzAutoFocus ? "autofocus" : null)("id", ctx.nzId)("name", ctx.nzName || (ctx.checkboxGroupComponent == null ? null : ctx.checkboxGroupComponent.nzName()));
      }
    },
    dependencies: [FormsModule, CheckboxControlValueAccessor, NgControlStatus, NgModel],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzCheckboxComponent, [{
    type: Component,
    args: [{
      selector: "[nz-checkbox]",
      exportAs: "nzCheckbox",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
    <span
      class="ant-checkbox"
      [class.ant-checkbox-checked]="nzChecked && !nzIndeterminate"
      [class.ant-checkbox-disabled]="nzDisabled || checkboxGroupComponent?.finalDisabled()"
      [class.ant-checkbox-indeterminate]="nzIndeterminate"
    >
      <input
        #inputElement
        type="checkbox"
        class="ant-checkbox-input"
        [attr.autofocus]="nzAutoFocus ? 'autofocus' : null"
        [attr.id]="nzId"
        [attr.name]="nzName || checkboxGroupComponent?.nzName()"
        [checked]="nzChecked"
        [ngModel]="nzChecked"
        [disabled]="nzDisabled || (checkboxGroupComponent?.finalDisabled() ?? false)"
        (ngModelChange)="innerCheckedChange($event)"
      />
      <span class="ant-checkbox-inner"></span>
    </span>
    <span><ng-content></ng-content></span>
  `,
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NzCheckboxComponent),
        multi: true
      }],
      host: {
        class: "ant-checkbox-wrapper",
        "[class.ant-checkbox-group-item]": "!!checkboxGroupComponent",
        "[class.ant-checkbox-wrapper-in-form-item]": "!!nzFormStatusService",
        "[class.ant-checkbox-wrapper-checked]": "nzChecked",
        "[class.ant-checkbox-wrapper-disabled]": "nzDisabled || checkboxGroupComponent?.finalDisabled()",
        "[class.ant-checkbox-rtl]": `dir === 'rtl'`
      },
      imports: [FormsModule]
    }]
  }], () => [], {
    inputElement: [{
      type: ViewChild,
      args: ["inputElement", {
        static: true
      }]
    }],
    nzCheckedChange: [{
      type: Output
    }],
    nzValue: [{
      type: Input
    }],
    nzAutoFocus: [{
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
    nzIndeterminate: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzChecked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzId: [{
      type: Input
    }],
    nzName: [{
      type: Input
    }]
  });
})();
var NzCheckboxGroupComponent = class _NzCheckboxGroupComponent {
  onChange = () => {
  };
  onTouched = () => {
  };
  isDisabledFirstChange = true;
  directionality = inject(Directionality);
  nzName = input(null, ...ngDevMode ? [{
    debugName: "nzName"
  }] : []);
  nzDisabled = input(false, ...ngDevMode ? [{
    debugName: "nzDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  nzOptions = input([], ...ngDevMode ? [{
    debugName: "nzOptions"
  }] : []);
  value = signal(null, ...ngDevMode ? [{
    debugName: "value"
  }] : []);
  finalDisabled = linkedSignal(() => this.nzDisabled());
  dir = toSignal(this.directionality.change, {
    initialValue: this.directionality.value
  });
  normalizedOptions = computed(() => normalizeOptions(this.nzOptions()), ...ngDevMode ? [{
    debugName: "normalizedOptions"
  }] : []);
  constructor() {
    const elementRef = inject(ElementRef);
    const focusMonitor = inject(FocusMonitor);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      focusMonitor.monitor(elementRef, true).pipe(takeUntilDestroyed(destroyRef)).subscribe((focusOrigin) => {
        if (!focusOrigin) {
          this.onTouched();
        }
      });
      destroyRef.onDestroy(() => {
        focusMonitor.stopMonitoring(elementRef);
      });
    });
  }
  writeValue(value) {
    untracked(() => {
      this.value.set(value);
    });
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(disabled) {
    untracked(() => {
      this.finalDisabled.set(this.isDisabledFirstChange && this.nzDisabled() || disabled);
    });
    this.isDisabledFirstChange = false;
  }
  onCheckedChange(optionValue, checked) {
    if (this.finalDisabled()) return;
    this.value.update((value) => {
      if (checked) {
        return value?.concat(optionValue) || [optionValue];
      } else {
        return value?.filter((val) => val !== optionValue) || [];
      }
    });
    this.onChange(this.value());
  }
  static ɵfac = function NzCheckboxGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzCheckboxGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzCheckboxGroupComponent,
    selectors: [["nz-checkbox-group"]],
    hostAttrs: [1, "ant-checkbox-group"],
    hostVars: 2,
    hostBindings: function NzCheckboxGroupComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-checkbox-group-rtl", ctx.dir() === "rtl");
      }
    },
    inputs: {
      nzName: [1, "nzName"],
      nzDisabled: [1, "nzDisabled"],
      nzOptions: [1, "nzOptions"]
    },
    exportAs: ["nzCheckboxGroup"],
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _NzCheckboxGroupComponent),
      multi: true
    }, {
      provide: NZ_CHECKBOX_GROUP,
      useExisting: forwardRef(() => _NzCheckboxGroupComponent)
    }])],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    consts: [["nz-checkbox", "", 3, "nzValue", "nzName", "nzDisabled"]],
    template: function NzCheckboxGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0, 0, null, NzCheckboxGroupComponent_ProjectionFallback_0_Template, 2, 0);
      }
    },
    dependencies: [NzCheckboxComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzCheckboxGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-checkbox-group",
      exportAs: "nzCheckboxGroup",
      imports: [NzCheckboxComponent],
      template: `
    <ng-content>
      @for (option of normalizedOptions(); track option.value) {
        <label
          nz-checkbox
          [nzValue]="option.value"
          [nzName]="nzName()"
          [nzDisabled]="option.disabled || finalDisabled()"
        >
          {{ option.label }}
        </label>
      }
    </ng-content>
  `,
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NzCheckboxGroupComponent),
        multi: true
      }, {
        provide: NZ_CHECKBOX_GROUP,
        useExisting: forwardRef(() => NzCheckboxGroupComponent)
      }],
      host: {
        class: "ant-checkbox-group",
        "[class.ant-checkbox-group-rtl]": `dir() === 'rtl'`
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], null);
})();
function normalizeOptions(value) {
  return value.map((item) => {
    if (typeof item === "string" || typeof item === "number") {
      return {
        label: `${item}`,
        value: item
      };
    }
    return item;
  });
}
var NzCheckboxModule = class _NzCheckboxModule {
  static ɵfac = function NzCheckboxModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzCheckboxModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzCheckboxModule,
    imports: [NzCheckboxComponent, NzCheckboxGroupComponent, NzCheckboxWrapperComponent],
    exports: [NzCheckboxComponent, NzCheckboxGroupComponent, NzCheckboxWrapperComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzCheckboxComponent, NzCheckboxGroupComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzCheckboxModule, [{
    type: NgModule,
    args: [{
      imports: [NzCheckboxComponent, NzCheckboxGroupComponent, NzCheckboxWrapperComponent],
      exports: [NzCheckboxComponent, NzCheckboxGroupComponent, NzCheckboxWrapperComponent]
    }]
  }], null, null);
})();

export {
  NzCheckboxWrapperComponent,
  NZ_CHECKBOX_GROUP,
  NzCheckboxComponent,
  NzCheckboxGroupComponent,
  NzCheckboxModule
};
//# sourceMappingURL=chunk-TMP23PUJ.js.map
