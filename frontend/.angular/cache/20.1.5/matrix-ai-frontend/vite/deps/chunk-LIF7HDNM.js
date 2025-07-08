import {
  NzBreakpointService,
  gridResponsiveMap
} from "./chunk-CP5ADG5I.js";
import {
  MediaMatcher
} from "./chunk-RZB7DMVY.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  Platform
} from "./chunk-3NNVUQIN.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  isNotNil
} from "./chunk-MKTFS3GT.js";
import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  NgModule,
  NgZone,
  Renderer2,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵclassProp,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵstyleProp
} from "./chunk-WRF7LGAN.js";
import {
  ReplaySubject,
  Subject
} from "./chunk-JU3XS6KG.js";
import {
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-grid.mjs
var NzRowDirective = class _NzRowDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  mediaMatcher = inject(MediaMatcher);
  ngZone = inject(NgZone);
  platform = inject(Platform);
  breakpointService = inject(NzBreakpointService);
  directionality = inject(Directionality);
  destroyRef = inject(DestroyRef);
  nzAlign = null;
  nzJustify = null;
  nzGutter = null;
  actualGutter$ = new ReplaySubject(1);
  dir = "ltr";
  destroy$ = new Subject();
  getGutter() {
    const results = [null, null];
    const gutter = this.nzGutter || 0;
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, null];
    normalizedGutter.forEach((g, index) => {
      if (typeof g === "object" && g !== null) {
        results[index] = null;
        Object.keys(gridResponsiveMap).map((screen) => {
          const bp = screen;
          if (this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches && g[bp]) {
            results[index] = g[bp];
          }
        });
      } else {
        results[index] = Number(g) || null;
      }
    });
    return results;
  }
  setGutterStyle() {
    const [horizontalGutter, verticalGutter] = this.getGutter();
    this.actualGutter$.next([horizontalGutter, verticalGutter]);
    const renderGutter = (name, gutter) => {
      const nativeElement = this.elementRef.nativeElement;
      if (gutter !== null) {
        this.renderer.setStyle(nativeElement, name, `-${gutter / 2}px`);
      }
    };
    renderGutter("margin-left", horizontalGutter);
    renderGutter("margin-right", horizontalGutter);
    renderGutter("margin-top", verticalGutter);
    renderGutter("margin-bottom", verticalGutter);
  }
  ngOnInit() {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
    });
    this.setGutterStyle();
  }
  ngOnChanges(changes) {
    if (changes.nzGutter) {
      this.setGutterStyle();
    }
  }
  ngAfterViewInit() {
    if (this.platform.isBrowser) {
      this.breakpointService.subscribe(gridResponsiveMap).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.setGutterStyle();
      });
    }
  }
  static ɵfac = function NzRowDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzRowDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzRowDirective,
    selectors: [["", "nz-row", ""], ["nz-row"], ["nz-form-item"]],
    hostAttrs: [1, "ant-row"],
    hostVars: 20,
    hostBindings: function NzRowDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-row-top", ctx.nzAlign === "top")("ant-row-middle", ctx.nzAlign === "middle")("ant-row-bottom", ctx.nzAlign === "bottom")("ant-row-start", ctx.nzJustify === "start")("ant-row-end", ctx.nzJustify === "end")("ant-row-center", ctx.nzJustify === "center")("ant-row-space-around", ctx.nzJustify === "space-around")("ant-row-space-between", ctx.nzJustify === "space-between")("ant-row-space-evenly", ctx.nzJustify === "space-evenly")("ant-row-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzAlign: "nzAlign",
      nzJustify: "nzJustify",
      nzGutter: "nzGutter"
    },
    exportAs: ["nzRow"],
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzRowDirective, [{
    type: Directive,
    args: [{
      selector: "[nz-row],nz-row,nz-form-item",
      exportAs: "nzRow",
      host: {
        class: "ant-row",
        "[class.ant-row-top]": `nzAlign === 'top'`,
        "[class.ant-row-middle]": `nzAlign === 'middle'`,
        "[class.ant-row-bottom]": `nzAlign === 'bottom'`,
        "[class.ant-row-start]": `nzJustify === 'start'`,
        "[class.ant-row-end]": `nzJustify === 'end'`,
        "[class.ant-row-center]": `nzJustify === 'center'`,
        "[class.ant-row-space-around]": `nzJustify === 'space-around'`,
        "[class.ant-row-space-between]": `nzJustify === 'space-between'`,
        "[class.ant-row-space-evenly]": `nzJustify === 'space-evenly'`,
        "[class.ant-row-rtl]": `dir === "rtl"`
      }
    }]
  }], null, {
    nzAlign: [{
      type: Input
    }],
    nzJustify: [{
      type: Input
    }],
    nzGutter: [{
      type: Input
    }]
  });
})();
var NzColDirective = class _NzColDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  directionality = inject(Directionality);
  destroyRef = inject(DestroyRef);
  classMap = {};
  hostFlexStyle = null;
  dir = "ltr";
  nzFlex = null;
  nzSpan = null;
  nzOrder = null;
  nzOffset = null;
  nzPush = null;
  nzPull = null;
  nzXs = null;
  nzSm = null;
  nzMd = null;
  nzLg = null;
  nzXl = null;
  nzXXl = null;
  setHostClassMap() {
    const hostClassMap = __spreadValues({
      ["ant-col"]: true,
      [`ant-col-${this.nzSpan}`]: isNotNil(this.nzSpan),
      [`ant-col-order-${this.nzOrder}`]: isNotNil(this.nzOrder),
      [`ant-col-offset-${this.nzOffset}`]: isNotNil(this.nzOffset),
      [`ant-col-pull-${this.nzPull}`]: isNotNil(this.nzPull),
      [`ant-col-push-${this.nzPush}`]: isNotNil(this.nzPush),
      ["ant-col-rtl"]: this.dir === "rtl"
    }, this.generateClass());
    for (const i in this.classMap) {
      if (this.classMap.hasOwnProperty(i)) {
        this.renderer.removeClass(this.elementRef.nativeElement, i);
      }
    }
    this.classMap = __spreadValues({}, hostClassMap);
    for (const i in this.classMap) {
      if (this.classMap.hasOwnProperty(i) && this.classMap[i]) {
        this.renderer.addClass(this.elementRef.nativeElement, i);
      }
    }
  }
  setHostFlexStyle() {
    this.hostFlexStyle = this.parseFlex(this.nzFlex);
  }
  parseFlex(flex) {
    if (typeof flex === "number") {
      return `${flex} ${flex} auto`;
    } else if (typeof flex === "string") {
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
    }
    return flex;
  }
  generateClass() {
    const listOfSizeInputName = ["nzXs", "nzSm", "nzMd", "nzLg", "nzXl", "nzXXl"];
    const listClassMap = {};
    listOfSizeInputName.forEach((name) => {
      const sizeName = name.replace("nz", "").toLowerCase();
      if (isNotNil(this[name])) {
        if (typeof this[name] === "number" || typeof this[name] === "string") {
          listClassMap[`ant-col-${sizeName}-${this[name]}`] = true;
        } else {
          const embedded = this[name];
          const prefixArray = ["span", "pull", "push", "offset", "order"];
          prefixArray.forEach((prefix) => {
            const prefixClass = prefix === "span" ? "-" : `-${prefix}-`;
            listClassMap[`ant-col-${sizeName}${prefixClass}${embedded[prefix]}`] = embedded && isNotNil(embedded[prefix]);
          });
        }
      }
    });
    return listClassMap;
  }
  nzRowDirective = inject(NzRowDirective, {
    host: true,
    optional: true
  });
  ngOnInit() {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
      this.setHostClassMap();
    });
    this.setHostClassMap();
    this.setHostFlexStyle();
  }
  ngOnChanges(changes) {
    this.setHostClassMap();
    const {
      nzFlex
    } = changes;
    if (nzFlex) {
      this.setHostFlexStyle();
    }
  }
  ngAfterViewInit() {
    if (this.nzRowDirective) {
      this.nzRowDirective.actualGutter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([horizontalGutter, verticalGutter]) => {
        const renderGutter = (name, gutter) => {
          const nativeElement = this.elementRef.nativeElement;
          if (gutter !== null) {
            this.renderer.setStyle(nativeElement, name, `${gutter / 2}px`);
          }
        };
        renderGutter("padding-left", horizontalGutter);
        renderGutter("padding-right", horizontalGutter);
        renderGutter("padding-top", verticalGutter);
        renderGutter("padding-bottom", verticalGutter);
      });
    }
  }
  static ɵfac = function NzColDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzColDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzColDirective,
    selectors: [["", "nz-col", ""], ["nz-col"], ["nz-form-control"], ["nz-form-label"]],
    hostVars: 2,
    hostBindings: function NzColDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleProp("flex", ctx.hostFlexStyle);
      }
    },
    inputs: {
      nzFlex: "nzFlex",
      nzSpan: "nzSpan",
      nzOrder: "nzOrder",
      nzOffset: "nzOffset",
      nzPush: "nzPush",
      nzPull: "nzPull",
      nzXs: "nzXs",
      nzSm: "nzSm",
      nzMd: "nzMd",
      nzLg: "nzLg",
      nzXl: "nzXl",
      nzXXl: "nzXXl"
    },
    exportAs: ["nzCol"],
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzColDirective, [{
    type: Directive,
    args: [{
      selector: "[nz-col],nz-col,nz-form-control,nz-form-label",
      exportAs: "nzCol",
      host: {
        "[style.flex]": "hostFlexStyle"
      }
    }]
  }], null, {
    nzFlex: [{
      type: Input
    }],
    nzSpan: [{
      type: Input
    }],
    nzOrder: [{
      type: Input
    }],
    nzOffset: [{
      type: Input
    }],
    nzPush: [{
      type: Input
    }],
    nzPull: [{
      type: Input
    }],
    nzXs: [{
      type: Input
    }],
    nzSm: [{
      type: Input
    }],
    nzMd: [{
      type: Input
    }],
    nzLg: [{
      type: Input
    }],
    nzXl: [{
      type: Input
    }],
    nzXXl: [{
      type: Input
    }]
  });
})();
var NzGridModule = class _NzGridModule {
  static ɵfac = function NzGridModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzGridModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzGridModule,
    imports: [NzColDirective, NzRowDirective],
    exports: [NzColDirective, NzRowDirective]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzGridModule, [{
    type: NgModule,
    args: [{
      imports: [NzColDirective, NzRowDirective],
      exports: [NzColDirective, NzRowDirective]
    }]
  }], null, null);
})();

export {
  NzRowDirective,
  NzColDirective,
  NzGridModule
};
//# sourceMappingURL=chunk-LIF7HDNM.js.map
