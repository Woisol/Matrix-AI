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
  isPresetColor,
  isStatusColor,
  presetColors,
  statusColors
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import "./chunk-MKTFS3GT.js";
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
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  Renderer2,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp
} from "./chunk-WRF7LGAN.js";
import "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import "./chunk-JU3XS6KG.js";
import "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-tag.mjs
var _c0 = ["*"];
function NzTagComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-icon", 1);
    ɵɵlistener("click", function NzTagComponent_Conditional_1_Template_nz_icon_click_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.closeTag($event));
    });
    ɵɵelementEnd();
  }
}
var NzTagComponent = class _NzTagComponent {
  cdr = inject(ChangeDetectorRef);
  renderer = inject(Renderer2);
  el = inject(ElementRef).nativeElement;
  directionality = inject(Directionality);
  destroyRef = inject(DestroyRef);
  nzMode = "default";
  nzColor;
  nzChecked = false;
  nzBordered = true;
  nzOnClose = new EventEmitter();
  nzCheckedChange = new EventEmitter();
  dir = "ltr";
  isPresetColor = false;
  updateCheckedStatus() {
    if (this.nzMode === "checkable") {
      this.nzChecked = !this.nzChecked;
      this.nzCheckedChange.emit(this.nzChecked);
    }
  }
  closeTag(e) {
    this.nzOnClose.emit(e);
    if (!e.defaultPrevented) {
      this.renderer.removeChild(this.renderer.parentNode(this.el), this.el);
    }
  }
  clearPresetColor() {
    const regexp = new RegExp(`(ant-tag-(?:${[...presetColors, ...statusColors].join("|")}))`, "g");
    const classname = this.el.classList.toString();
    const matches = [];
    let match = regexp.exec(classname);
    while (match !== null) {
      matches.push(match[1]);
      match = regexp.exec(classname);
    }
    this.el.classList.remove(...matches);
  }
  setPresetColor() {
    this.clearPresetColor();
    if (!this.nzColor) {
      this.isPresetColor = false;
    } else {
      this.isPresetColor = isPresetColor(this.nzColor) || isStatusColor(this.nzColor);
    }
    if (this.isPresetColor) {
      this.el.classList.add(`ant-tag-${this.nzColor}`);
    }
  }
  ngOnInit() {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }
  ngOnChanges(changes) {
    const {
      nzColor
    } = changes;
    if (nzColor) {
      this.setPresetColor();
    }
  }
  static ɵfac = function NzTagComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTagComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzTagComponent,
    selectors: [["nz-tag"]],
    hostAttrs: [1, "ant-tag"],
    hostVars: 12,
    hostBindings: function NzTagComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function NzTagComponent_click_HostBindingHandler() {
          return ctx.updateCheckedStatus();
        });
      }
      if (rf & 2) {
        ɵɵstyleProp("background-color", ctx.isPresetColor ? "" : ctx.nzColor);
        ɵɵclassProp("ant-tag-has-color", ctx.nzColor && !ctx.isPresetColor)("ant-tag-checkable", ctx.nzMode === "checkable")("ant-tag-checkable-checked", ctx.nzChecked)("ant-tag-rtl", ctx.dir === "rtl")("ant-tag-borderless", !ctx.nzBordered);
      }
    },
    inputs: {
      nzMode: "nzMode",
      nzColor: "nzColor",
      nzChecked: [2, "nzChecked", "nzChecked", booleanAttribute],
      nzBordered: [2, "nzBordered", "nzBordered", booleanAttribute]
    },
    outputs: {
      nzOnClose: "nzOnClose",
      nzCheckedChange: "nzCheckedChange"
    },
    exportAs: ["nzTag"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 1,
    consts: [["nzType", "close", "tabindex", "-1", 1, "ant-tag-close-icon"], ["nzType", "close", "tabindex", "-1", 1, "ant-tag-close-icon", 3, "click"]],
    template: function NzTagComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
        ɵɵconditionalCreate(1, NzTagComponent_Conditional_1_Template, 1, 0, "nz-icon", 0);
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵconditional(ctx.nzMode === "closeable" ? 1 : -1);
      }
    },
    dependencies: [NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTagComponent, [{
    type: Component,
    args: [{
      selector: "nz-tag",
      exportAs: "nzTag",
      template: `
    <ng-content></ng-content>
    @if (nzMode === 'closeable') {
      <nz-icon nzType="close" class="ant-tag-close-icon" tabindex="-1" (click)="closeTag($event)" />
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-tag",
        "[style.background-color]": `isPresetColor ? '' : nzColor`,
        "[class.ant-tag-has-color]": `nzColor && !isPresetColor`,
        "[class.ant-tag-checkable]": `nzMode === 'checkable'`,
        "[class.ant-tag-checkable-checked]": `nzChecked`,
        "[class.ant-tag-rtl]": `dir === 'rtl'`,
        "[class.ant-tag-borderless]": `!nzBordered`,
        "(click)": "updateCheckedStatus()"
      },
      imports: [NzIconModule]
    }]
  }], null, {
    nzMode: [{
      type: Input
    }],
    nzColor: [{
      type: Input
    }],
    nzChecked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzBordered: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzOnClose: [{
      type: Output
    }],
    nzCheckedChange: [{
      type: Output
    }]
  });
})();
var NzTagModule = class _NzTagModule {
  static ɵfac = function NzTagModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTagModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzTagModule,
    imports: [NzTagComponent],
    exports: [NzTagComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzTagComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTagModule, [{
    type: NgModule,
    args: [{
      imports: [NzTagComponent],
      exports: [NzTagComponent]
    }]
  }], null, null);
})();
export {
  NzTagComponent,
  NzTagModule
};
//# sourceMappingURL=ng-zorro-antd_tag.js.map
