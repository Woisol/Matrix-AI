import {
  NzStringTemplateOutletDirective
} from "./chunk-VCDKFDG2.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  NzConfigService,
  WithConfig
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed,
  toSignal
} from "./chunk-LTLJ7NNZ.js";
import {
  NgTemplateOutlet
} from "./chunk-QXKDNKXL.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  InjectionToken,
  Input,
  NgModule,
  TemplateRef,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-WRF7LGAN.js";
import {
  __esDecorate,
  __runInitializers
} from "./chunk-JU3XS6KG.js";
import {
  __publicField
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-space.mjs
var _c0 = ["*"];
var _c1 = (a0) => ({
  $implicit: a0
});
function NzSpaceComponent_For_2_Conditional_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵtextInterpolate(ctx_r0.nzSplit);
  }
}
function NzSpaceComponent_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 2);
    ɵɵtemplate(1, NzSpaceComponent_For_2_Conditional_2_ng_template_1_Template, 1, 1, "ng-template", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ɵ$index_2_r2 = ɵɵnextContext().$index;
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzSplit)("nzStringTemplateOutletContext", ɵɵpureFunction1(2, _c1, ɵ$index_2_r2));
  }
}
function NzSpaceComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵelementContainer(1, 1);
    ɵɵelementEnd();
    ɵɵconditionalCreate(2, NzSpaceComponent_For_2_Conditional_2_Template, 2, 4, "span", 2);
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ɵ$index_2_r2 = ctx.$index;
    const ɵ$count_2_r4 = ctx.$count;
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", item_r3);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzSplit && !(ɵ$index_2_r2 === ɵ$count_2_r4 - 1) ? 2 : -1);
  }
}
var NZ_SPACE_COMPACT_SIZE = new InjectionToken("NZ_SPACE_COMPACT_SIZE");
var NZ_SPACE_COMPACT_ITEMS = new InjectionToken("NZ_SPACE_COMPACT_ITEMS");
var NZ_SPACE_COMPACT_ITEM_TYPE = new InjectionToken("NZ_SPACE_COMPACT_ITEM_TYPE");
var NzSpaceCompactComponent = class _NzSpaceCompactComponent {
  nzBlock = input(false, ...ngDevMode ? [{
    debugName: "nzBlock",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  nzDirection = input("horizontal", ...ngDevMode ? [{
    debugName: "nzDirection"
  }] : []);
  nzSize = input("default", ...ngDevMode ? [{
    debugName: "nzSize"
  }] : []);
  elementRef = inject(ElementRef);
  static ɵfac = function NzSpaceCompactComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceCompactComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSpaceCompactComponent,
    selectors: [["nz-space-compact"]],
    hostAttrs: [1, "ant-space-compact"],
    hostVars: 4,
    hostBindings: function NzSpaceCompactComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-space-compact-block", ctx.nzBlock())("ant-space-compact-vertical", ctx.nzDirection() === "vertical");
      }
    },
    inputs: {
      nzBlock: [1, "nzBlock"],
      nzDirection: [1, "nzDirection"],
      nzSize: [1, "nzSize"]
    },
    exportAs: ["nzSpaceCompact"],
    features: [ɵɵProvidersFeature([{
      provide: NZ_SPACE_COMPACT_SIZE,
      useFactory: () => inject(_NzSpaceCompactComponent).nzSize
    }, {
      provide: NZ_SPACE_COMPACT_ITEMS,
      useFactory: () => signal([])
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzSpaceCompactComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceCompactComponent, [{
    type: Component,
    args: [{
      selector: "nz-space-compact",
      exportAs: "nzSpaceCompact",
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-space-compact",
        "[class.ant-space-compact-block]": `nzBlock()`,
        "[class.ant-space-compact-vertical]": `nzDirection() === 'vertical'`
      },
      providers: [{
        provide: NZ_SPACE_COMPACT_SIZE,
        useFactory: () => inject(NzSpaceCompactComponent).nzSize
      }, {
        provide: NZ_SPACE_COMPACT_ITEMS,
        useFactory: () => signal([])
      }],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var NzSpaceCompactItemDirective = class _NzSpaceCompactItemDirective {
  /**
   * Ancestor component injected from the parent.
   * Note that it is not necessarily the direct parent component.
   */
  spaceCompactCmp = inject(NzSpaceCompactComponent, {
    host: true,
    optional: true
  });
  items = inject(NZ_SPACE_COMPACT_ITEMS, {
    host: true,
    optional: true
  });
  type = inject(NZ_SPACE_COMPACT_ITEM_TYPE);
  elementRef = inject(ElementRef);
  directionality = inject(Directionality);
  dir = toSignal(this.directionality.change, {
    initialValue: this.directionality.value
  });
  get parentElement() {
    return this.elementRef.nativeElement?.parentElement;
  }
  class = computed(() => {
    if (!this.spaceCompactCmp || !this.items) return null;
    if (this.parentElement !== this.spaceCompactCmp.elementRef.nativeElement) return null;
    const items = this.items();
    const direction = this.spaceCompactCmp.nzDirection();
    const classes = [compactItemClassOf(this.type, direction, this.dir() === "rtl")];
    const index = items.indexOf(this);
    const firstIndex = items.findIndex((element) => element);
    if (index === firstIndex) {
      classes.push(compactFirstItemClassOf(this.type, direction));
    }
    if (index === items.length - 1) {
      classes.push(compactLastItemClassOf(this.type, direction));
    }
    return classes;
  }, ...ngDevMode ? [{
    debugName: "class"
  }] : []);
  constructor() {
    if (!this.spaceCompactCmp || !this.items) return;
    afterNextRender(() => {
      if (this.parentElement === this.spaceCompactCmp.elementRef.nativeElement) {
        const index = Array.from(this.parentElement.children).indexOf(this.elementRef.nativeElement);
        this.items.update((value) => {
          const newValue = value.slice();
          newValue.splice(index, 0, this);
          return newValue;
        });
      }
    });
    inject(DestroyRef).onDestroy(() => {
      this.items?.update((value) => value.filter((o) => o !== this));
    });
  }
  static ɵfac = function NzSpaceCompactItemDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceCompactItemDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzSpaceCompactItemDirective,
    hostVars: 2,
    hostBindings: function NzSpaceCompactItemDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.class());
      }
    },
    exportAs: ["nzSpaceCompactItem"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceCompactItemDirective, [{
    type: Directive,
    args: [{
      exportAs: "nzSpaceCompactItem",
      host: {
        "[class]": "class()"
      }
    }]
  }], () => [], null);
})();
function generateCompactClass(type, direction, position) {
  const directionPrefix = direction === "vertical" ? "vertical-" : "";
  return `ant-${type}-compact-${directionPrefix}${position}`;
}
function compactItemClassOf(type, direction, rtl) {
  const rtlSuffix = rtl ? "-rtl" : "";
  return `${generateCompactClass(type, direction, "item")}${rtlSuffix}`;
}
function compactFirstItemClassOf(type, direction) {
  return generateCompactClass(type, direction, "first-item");
}
function compactLastItemClassOf(type, direction) {
  return generateCompactClass(type, direction, "last-item");
}
var NzSpaceItemDirective = class _NzSpaceItemDirective {
  static ɵfac = function NzSpaceItemDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceItemDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzSpaceItemDirective,
    selectors: [["", "nzSpaceItem", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceItemDirective, [{
    type: Directive,
    args: [{
      selector: "[nzSpaceItem]"
    }]
  }], null, null);
})();
var NZ_CONFIG_MODULE_NAME = "space";
var SPACE_SIZE = {
  small: 8,
  middle: 16,
  large: 24
};
var NzSpaceComponent = (() => {
  var _a;
  let _nzSize_decorators;
  let _nzSize_initializers = [];
  let _nzSize_extraInitializers = [];
  return _a = class {
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    nzConfigService = inject(NzConfigService);
    cdr = inject(ChangeDetectorRef);
    destroyRef = inject(DestroyRef);
    nzDirection = "horizontal";
    nzAlign;
    nzSplit = null;
    nzWrap = false;
    nzSize = __runInitializers(this, _nzSize_initializers, "small");
    items = __runInitializers(this, _nzSize_extraInitializers);
    mergedAlign;
    horizontalSize;
    verticalSize;
    constructor() {
      this.updateSpaceSize();
    }
    ngOnChanges(changes) {
      const {
        nzSize
      } = changes;
      if (nzSize) {
        this.updateSpaceSize();
      }
      this.mergedAlign = this.nzAlign === void 0 && this.nzDirection === "horizontal" ? "center" : this.nzAlign;
    }
    ngAfterContentInit() {
      this.items.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.cdr.markForCheck();
      });
    }
    updateSpaceSize() {
      const {
        horizontalSize,
        verticalSize
      } = normalizeSpaceSize(this.nzSize);
      this.horizontalSize = horizontalSize;
      this.verticalSize = verticalSize;
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _nzSize_decorators = [WithConfig()];
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
    if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _metadata
    });
  })(), __publicField(_a, "ɵfac", function NzSpaceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵcmp", ɵɵdefineComponent({
    type: _a,
    selectors: [["nz-space"], ["", "nz-space", ""]],
    contentQueries: function NzSpaceComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzSpaceItemDirective, 4, TemplateRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.items = _t);
      }
    },
    hostAttrs: [1, "ant-space"],
    hostVars: 18,
    hostBindings: function NzSpaceComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleProp("flex-wrap", ctx.nzWrap ? "wrap" : null)("column-gap", ctx.horizontalSize, "px")("row-gap", ctx.verticalSize, "px");
        ɵɵclassProp("ant-space-horizontal", ctx.nzDirection === "horizontal")("ant-space-vertical", ctx.nzDirection === "vertical")("ant-space-align-start", ctx.mergedAlign === "start")("ant-space-align-end", ctx.mergedAlign === "end")("ant-space-align-center", ctx.mergedAlign === "center")("ant-space-align-baseline", ctx.mergedAlign === "baseline");
      }
    },
    inputs: {
      nzDirection: "nzDirection",
      nzAlign: "nzAlign",
      nzSplit: "nzSplit",
      nzWrap: [2, "nzWrap", "nzWrap", booleanAttribute],
      nzSize: "nzSize"
    },
    exportAs: ["nzSpace"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 3,
    vars: 0,
    consts: [[1, "ant-space-item"], [3, "ngTemplateOutlet"], [1, "ant-space-split"], [3, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"]],
    template: function NzSpaceComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
        ɵɵrepeaterCreate(1, NzSpaceComponent_For_2_Template, 3, 2, null, null, ɵɵrepeaterTrackByIdentity);
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵrepeater(ctx.items);
      }
    },
    dependencies: [NgTemplateOutlet, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceComponent, [{
    type: Component,
    args: [{
      selector: "nz-space, [nz-space]",
      exportAs: "nzSpace",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <ng-content></ng-content>
    @for (item of items; track item; let last = $last; let index = $index) {
      <div class="ant-space-item">
        <ng-container [ngTemplateOutlet]="item"></ng-container>
      </div>
      @if (nzSplit && !last) {
        <span class="ant-space-split">
          <ng-template [nzStringTemplateOutlet]="nzSplit" [nzStringTemplateOutletContext]="{ $implicit: index }">{{
            nzSplit
          }}</ng-template>
        </span>
      }
    }
  `,
      host: {
        class: "ant-space",
        "[class.ant-space-horizontal]": 'nzDirection === "horizontal"',
        "[class.ant-space-vertical]": 'nzDirection === "vertical"',
        "[class.ant-space-align-start]": 'mergedAlign === "start"',
        "[class.ant-space-align-end]": 'mergedAlign === "end"',
        "[class.ant-space-align-center]": 'mergedAlign === "center"',
        "[class.ant-space-align-baseline]": 'mergedAlign === "baseline"',
        "[style.flex-wrap]": 'nzWrap ? "wrap" : null',
        "[style.column-gap.px]": "horizontalSize",
        "[style.row-gap.px]": "verticalSize"
      },
      imports: [NgTemplateOutlet, NzStringTemplateOutletDirective]
    }]
  }], () => [], {
    nzDirection: [{
      type: Input
    }],
    nzAlign: [{
      type: Input
    }],
    nzSplit: [{
      type: Input
    }],
    nzWrap: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzSize: [{
      type: Input
    }],
    items: [{
      type: ContentChildren,
      args: [NzSpaceItemDirective, {
        read: TemplateRef
      }]
    }]
  });
})();
function normalizeSpaceSize(size) {
  const [horizontalSize, verticalSize] = (Array.isArray(size) ? size : [size, size]).map((s) => typeof s === "number" ? s : SPACE_SIZE[s]);
  return {
    horizontalSize,
    verticalSize
  };
}
var NzSpaceModule = class _NzSpaceModule {
  static ɵfac = function NzSpaceModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzSpaceModule,
    imports: [NzSpaceComponent, NzSpaceItemDirective, NzSpaceCompactComponent],
    exports: [NzSpaceComponent, NzSpaceItemDirective, NzSpaceCompactComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceModule, [{
    type: NgModule,
    args: [{
      imports: [NzSpaceComponent, NzSpaceItemDirective, NzSpaceCompactComponent],
      exports: [NzSpaceComponent, NzSpaceItemDirective, NzSpaceCompactComponent]
    }]
  }], null, null);
})();

export {
  NZ_SPACE_COMPACT_SIZE,
  NZ_SPACE_COMPACT_ITEMS,
  NZ_SPACE_COMPACT_ITEM_TYPE,
  NzSpaceCompactComponent,
  NzSpaceCompactItemDirective,
  NzSpaceItemDirective,
  NzSpaceComponent,
  NzSpaceModule
};
//# sourceMappingURL=chunk-2CAQ2F77.js.map
