import {
  NzWaveModule
} from "./chunk-LML7QHTA.js";
import {
  NZ_SPACE_COMPACT_ITEM_TYPE,
  NZ_SPACE_COMPACT_SIZE,
  NzSpaceCompactItemDirective
} from "./chunk-2CAQ2F77.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  NzTransitionPatchModule
} from "./chunk-3LEDXWMQ.js";
import {
  NzIconDirective,
  NzIconModule
} from "./chunk-TQ5FZKYH.js";
import {
  WithConfig,
  onConfigChangeEventForComponent
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  fromEventOutsideAngular
} from "./chunk-MKTFS3GT.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Input,
  NgModule,
  Renderer2,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵHostDirectivesFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵloadQuery,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryRefresh
} from "./chunk-WRF7LGAN.js";
import {
  Subject,
  __esDecorate,
  __runInitializers,
  filter,
  startWith
} from "./chunk-JU3XS6KG.js";
import {
  __publicField
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-button.mjs
var _c0 = ["nz-button", ""];
var _c1 = ["*"];
function NzButtonComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 0);
  }
}
var NZ_CONFIG_MODULE_NAME = "button";
var NzButtonComponent = (() => {
  var _a;
  let _nzSize_decorators;
  let _nzSize_initializers = [];
  let _nzSize_extraInitializers = [];
  return _a = class {
    elementRef = inject(ElementRef);
    cdr = inject(ChangeDetectorRef);
    renderer = inject(Renderer2);
    directionality = inject(Directionality);
    destroyRef = inject(DestroyRef);
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    nzIconDirectiveElement;
    nzBlock = false;
    nzGhost = false;
    nzSearch = false;
    nzLoading = false;
    nzDanger = false;
    disabled = false;
    tabIndex = null;
    nzType = null;
    nzShape = null;
    nzSize = __runInitializers(this, _nzSize_initializers, "default");
    dir = (__runInitializers(this, _nzSize_extraInitializers), "ltr");
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
    compactSize = inject(NZ_SPACE_COMPACT_SIZE, {
      optional: true
    });
    loading$ = new Subject();
    insertSpan(nodes, renderer) {
      nodes.forEach((node) => {
        if (node.nodeName === "#text") {
          const span = renderer.createElement("span");
          const parent = renderer.parentNode(node);
          renderer.insertBefore(parent, span, node);
          renderer.appendChild(span, node);
        }
      });
    }
    get iconOnly() {
      const listOfNode = Array.from(this.elementRef?.nativeElement?.childNodes || []);
      const noText = listOfNode.every((node) => node.nodeName !== "#text");
      const noSpan = listOfNode.filter((node) => {
        return !(node.nodeName === "#comment" || !!node?.classList?.contains("anticon"));
      }).length == 0;
      return !!this.nzIconDirectiveElement && noSpan && noText;
    }
    constructor() {
      onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => {
        this.size.set(this.nzSize);
        this.cdr.markForCheck();
      });
    }
    ngOnInit() {
      this.size.set(this.nzSize);
      this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
      this.dir = this.directionality.value;
      fromEventOutsideAngular(this.elementRef.nativeElement, "click", {
        capture: true
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        if (this.disabled && event.target?.tagName === "A" || this.nzLoading) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
    }
    ngOnChanges({
      nzLoading,
      nzSize
    }) {
      if (nzLoading) {
        this.loading$.next(this.nzLoading);
      }
      if (nzSize) {
        this.size.set(nzSize.currentValue);
      }
    }
    ngAfterViewInit() {
      this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
    }
    ngAfterContentInit() {
      this.loading$.pipe(startWith(this.nzLoading), filter(() => !!this.nzIconDirectiveElement), takeUntilDestroyed(this.destroyRef)).subscribe((loading) => {
        const nativeElement = this.nzIconDirectiveElement.nativeElement;
        if (loading) {
          this.renderer.setStyle(nativeElement, "display", "none");
        } else {
          this.renderer.removeStyle(nativeElement, "display");
        }
      });
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
  })(), __publicField(_a, "ɵfac", function NzButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵcmp", ɵɵdefineComponent({
    type: _a,
    selectors: [["button", "nz-button", ""], ["a", "nz-button", ""]],
    contentQueries: function NzButtonComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzIconDirective, 5, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzIconDirectiveElement = _t.first);
      }
    },
    hostAttrs: [1, "ant-btn"],
    hostVars: 34,
    hostBindings: function NzButtonComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("tabindex", ctx.disabled ? -1 : ctx.tabIndex === null ? null : ctx.tabIndex)("disabled", ctx.disabled || null);
        ɵɵclassProp("ant-btn-default", ctx.nzType === "default")("ant-btn-primary", ctx.nzType === "primary")("ant-btn-dashed", ctx.nzType === "dashed")("ant-btn-link", ctx.nzType === "link")("ant-btn-text", ctx.nzType === "text")("ant-btn-circle", ctx.nzShape === "circle")("ant-btn-round", ctx.nzShape === "round")("ant-btn-lg", ctx.finalSize() === "large")("ant-btn-sm", ctx.finalSize() === "small")("ant-btn-dangerous", ctx.nzDanger)("ant-btn-loading", ctx.nzLoading)("ant-btn-background-ghost", ctx.nzGhost)("ant-btn-block", ctx.nzBlock)("ant-input-search-button", ctx.nzSearch)("ant-btn-rtl", ctx.dir === "rtl")("ant-btn-icon-only", ctx.iconOnly);
      }
    },
    inputs: {
      nzBlock: [2, "nzBlock", "nzBlock", booleanAttribute],
      nzGhost: [2, "nzGhost", "nzGhost", booleanAttribute],
      nzSearch: [2, "nzSearch", "nzSearch", booleanAttribute],
      nzLoading: [2, "nzLoading", "nzLoading", booleanAttribute],
      nzDanger: [2, "nzDanger", "nzDanger", booleanAttribute],
      disabled: [2, "disabled", "disabled", booleanAttribute],
      tabIndex: "tabIndex",
      nzType: "nzType",
      nzShape: "nzShape",
      nzSize: "nzSize"
    },
    exportAs: ["nzButton"],
    features: [ɵɵProvidersFeature([{
      provide: NZ_SPACE_COMPACT_ITEM_TYPE,
      useValue: "btn"
    }]), ɵɵHostDirectivesFeature([NzSpaceCompactItemDirective]), ɵɵNgOnChangesFeature],
    attrs: _c0,
    ngContentSelectors: _c1,
    decls: 2,
    vars: 1,
    consts: [["nzType", "loading"]],
    template: function NzButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, NzButtonComponent_Conditional_0_Template, 1, 0, "nz-icon", 0);
        ɵɵprojection(1);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.nzLoading ? 0 : -1);
      }
    },
    dependencies: [NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzButtonComponent, [{
    type: Component,
    args: [{
      selector: "button[nz-button], a[nz-button]",
      exportAs: "nzButton",
      imports: [NzIconModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
    @if (nzLoading) {
      <nz-icon nzType="loading" />
    }
    <ng-content></ng-content>
  `,
      host: {
        class: "ant-btn",
        "[class.ant-btn-default]": `nzType === 'default'`,
        "[class.ant-btn-primary]": `nzType === 'primary'`,
        "[class.ant-btn-dashed]": `nzType === 'dashed'`,
        "[class.ant-btn-link]": `nzType === 'link'`,
        "[class.ant-btn-text]": `nzType === 'text'`,
        "[class.ant-btn-circle]": `nzShape === 'circle'`,
        "[class.ant-btn-round]": `nzShape === 'round'`,
        "[class.ant-btn-lg]": `finalSize() === 'large'`,
        "[class.ant-btn-sm]": `finalSize() === 'small'`,
        "[class.ant-btn-dangerous]": `nzDanger`,
        "[class.ant-btn-loading]": `nzLoading`,
        "[class.ant-btn-background-ghost]": `nzGhost`,
        "[class.ant-btn-block]": `nzBlock`,
        "[class.ant-input-search-button]": `nzSearch`,
        "[class.ant-btn-rtl]": `dir === 'rtl'`,
        "[class.ant-btn-icon-only]": `iconOnly`,
        "[attr.tabindex]": "disabled ? -1 : (tabIndex === null ? null : tabIndex)",
        "[attr.disabled]": "disabled || null"
      },
      hostDirectives: [NzSpaceCompactItemDirective],
      providers: [{
        provide: NZ_SPACE_COMPACT_ITEM_TYPE,
        useValue: "btn"
      }]
    }]
  }], () => [], {
    nzIconDirectiveElement: [{
      type: ContentChild,
      args: [NzIconDirective, {
        read: ElementRef
      }]
    }],
    nzBlock: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzGhost: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzSearch: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzLoading: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzDanger: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input
    }],
    nzType: [{
      type: Input
    }],
    nzShape: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }]
  });
})();
var NzButtonModule = class _NzButtonModule {
  static ɵfac = function NzButtonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzButtonModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzButtonModule,
    imports: [NzButtonComponent],
    exports: [NzButtonComponent, NzTransitionPatchModule, NzWaveModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzButtonComponent, NzTransitionPatchModule, NzWaveModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzButtonModule, [{
    type: NgModule,
    args: [{
      imports: [NzButtonComponent],
      exports: [NzButtonComponent, NzTransitionPatchModule, NzWaveModule]
    }]
  }], null, null);
})();

export {
  NzButtonComponent,
  NzButtonModule
};
//# sourceMappingURL=chunk-QDDQBQIZ.js.map
