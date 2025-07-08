import {
  Overlay
} from "./chunk-YLYPD5XX.js";
import {
  ComponentPortal
} from "./chunk-BGJVKJD4.js";
import {
  NzSingletonService
} from "./chunk-CP5ADG5I.js";
import {
  moveUpMotion
} from "./chunk-XB33FMDA.js";
import {
  NzOutletModule,
  NzStringTemplateOutletDirective
} from "./chunk-VCDKFDG2.js";
import {
  NzIconDirective,
  NzIconModule
} from "./chunk-TQ5FZKYH.js";
import {
  NzConfigService,
  onConfigChangeEventForComponent
} from "./chunk-GQBHIW5X.js";
import {
  toCssPixel
} from "./chunk-MKTFS3GT.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Directive,
  EventEmitter,
  Injectable,
  Injector,
  Input,
  Output,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtemplate
} from "./chunk-WRF7LGAN.js";
import {
  Subject,
  filter,
  take
} from "./chunk-JU3XS6KG.js";
import {
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-message.mjs
var _c0 = (a0, a1) => ({
  $implicit: a0,
  data: a1
});
function NzMessageComponent_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 3);
  }
}
function NzMessageComponent_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 4);
  }
}
function NzMessageComponent_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 5);
  }
}
function NzMessageComponent_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 6);
  }
}
function NzMessageComponent_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 7);
  }
}
function NzMessageComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelement(1, "span", 9);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("innerHTML", ctx_r0.instance.content, ɵɵsanitizeHtml);
  }
}
function NzMessageContainerComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-message", 2);
    ɵɵlistener("destroyed", function NzMessageContainerComponent_For_2_Template_nz_message_destroyed_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.remove($event.id, $event.userAction));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const instance_r3 = ctx.$implicit;
    ɵɵproperty("instance", instance_r3);
  }
}
var globalCounter = 0;
var NzMNService = class {
  container;
  nzSingletonService = inject(NzSingletonService);
  overlay = inject(Overlay);
  injector = inject(Injector);
  remove(id) {
    if (this.container) {
      if (id) {
        this.container.remove(id);
      } else {
        this.container.removeAll();
      }
    }
  }
  getInstanceId() {
    return `${this.componentPrefix}-${globalCounter++}`;
  }
  withContainer(ctor) {
    let containerInstance = this.nzSingletonService.getSingletonWithKey(this.componentPrefix);
    if (containerInstance) {
      return containerInstance;
    }
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global()
    });
    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);
    const overlayWrapper = overlayRef.hostElement;
    overlayWrapper.style.zIndex = "1010";
    if (!containerInstance) {
      this.container = containerInstance = componentRef.instance;
      this.nzSingletonService.registerSingletonWithKey(this.componentPrefix, containerInstance);
      this.container.afterAllInstancesRemoved.subscribe(() => {
        this.container = void 0;
        this.nzSingletonService.unregisterSingletonWithKey(this.componentPrefix);
        overlayRef.dispose();
      });
    }
    return containerInstance;
  }
};
var NzMNContainerComponent = class _NzMNContainerComponent {
  config;
  instances = [];
  _afterAllInstancesRemoved = new Subject();
  afterAllInstancesRemoved = this._afterAllInstancesRemoved.asObservable();
  cdr = inject(ChangeDetectorRef);
  nzConfigService = inject(NzConfigService);
  constructor() {
    this.subscribeConfigChange();
  }
  create(data) {
    const instance = this.onCreate(data);
    if (this.instances.length >= this.config.nzMaxStack) {
      this.instances = this.instances.slice(1);
    }
    this.instances = [...this.instances, instance];
    this.readyInstances();
    return instance;
  }
  remove(id, userAction = false) {
    this.instances.map((instance, index) => ({
      index,
      instance
    })).filter(({
      instance
    }) => instance.messageId === id).forEach(({
      index,
      instance
    }) => {
      this.instances.splice(index, 1);
      this.instances = [...this.instances];
      this.onRemove(instance, userAction);
      this.readyInstances();
    });
    if (!this.instances.length) {
      this.onAllInstancesRemoved();
    }
  }
  removeAll() {
    this.instances.forEach((i) => this.onRemove(i, false));
    this.instances = [];
    this.readyInstances();
    this.onAllInstancesRemoved();
  }
  onCreate(instance) {
    instance.options = this.mergeOptions(instance.options);
    instance.onClose = new Subject();
    return instance;
  }
  onRemove(instance, userAction) {
    instance.onClose.next(userAction);
    instance.onClose.complete();
  }
  onAllInstancesRemoved() {
    this._afterAllInstancesRemoved.next();
    this._afterAllInstancesRemoved.complete();
  }
  readyInstances() {
    this.cdr.detectChanges();
  }
  mergeOptions(options) {
    const {
      nzDuration,
      nzAnimate,
      nzPauseOnHover
    } = this.config;
    return __spreadValues({
      nzDuration,
      nzAnimate,
      nzPauseOnHover
    }, options);
  }
  static ɵfac = function NzMNContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMNContainerComponent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzMNContainerComponent
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMNContainerComponent, [{
    type: Directive
  }], () => [], null);
})();
var NzMNComponent = class _NzMNComponent {
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  animationStateChanged = new Subject();
  options;
  autoClose;
  closeTimer;
  userAction = false;
  eraseTimer;
  eraseTimingStart;
  eraseTTL;
  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.autoClose) {
        this.clearEraseTimeout();
      }
      this.animationStateChanged.complete();
    });
  }
  ngOnInit() {
    this.options = this.instance.options;
    if (this.options.nzAnimate) {
      this.instance.state = "enter";
      this.animationStateChanged.pipe(filter((event) => event.phaseName === "done" && event.toState === "leave"), take(1)).subscribe(() => {
        clearTimeout(this.closeTimer);
        this.destroyed.next({
          id: this.instance.messageId,
          userAction: this.userAction
        });
      });
    }
    this.autoClose = this.options.nzDuration > 0;
    if (this.autoClose) {
      this.initErase();
      this.startEraseTimeout();
    }
  }
  onEnter() {
    if (this.autoClose && this.options.nzPauseOnHover) {
      this.clearEraseTimeout();
      this.updateTTL();
    }
  }
  onLeave() {
    if (this.autoClose && this.options.nzPauseOnHover) {
      this.startEraseTimeout();
    }
  }
  destroy(userAction = false) {
    this.userAction = userAction;
    if (this.options.nzAnimate) {
      this.instance.state = "leave";
      this.cdr.detectChanges();
      this.closeTimer = setTimeout(() => {
        this.closeTimer = void 0;
        this.destroyed.next({
          id: this.instance.messageId,
          userAction
        });
      }, 200);
    } else {
      this.destroyed.next({
        id: this.instance.messageId,
        userAction
      });
    }
  }
  initErase() {
    this.eraseTTL = this.options.nzDuration;
    this.eraseTimingStart = Date.now();
  }
  updateTTL() {
    if (this.autoClose) {
      this.eraseTTL -= Date.now() - this.eraseTimingStart;
    }
  }
  startEraseTimeout() {
    if (this.eraseTTL > 0) {
      this.clearEraseTimeout();
      this.eraseTimer = setTimeout(() => this.destroy(), this.eraseTTL);
      this.eraseTimingStart = Date.now();
    } else {
      this.destroy();
    }
  }
  clearEraseTimeout() {
    if (this.eraseTimer !== null) {
      clearTimeout(this.eraseTimer);
      this.eraseTimer = void 0;
    }
  }
  static ɵfac = function NzMNComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMNComponent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzMNComponent
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMNComponent, [{
    type: Directive
  }], () => [], null);
})();
var NzMessageComponent = class _NzMessageComponent extends NzMNComponent {
  instance;
  destroyed = new EventEmitter();
  index;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵNzMessageComponent_BaseFactory;
    return function NzMessageComponent_Factory(__ngFactoryType__) {
      return (ɵNzMessageComponent_BaseFactory || (ɵNzMessageComponent_BaseFactory = ɵɵgetInheritedFactory(_NzMessageComponent)))(__ngFactoryType__ || _NzMessageComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _NzMessageComponent,
    selectors: [["nz-message"]],
    inputs: {
      instance: "instance"
    },
    outputs: {
      destroyed: "destroyed"
    },
    exportAs: ["nzMessage"],
    features: [ɵɵInheritDefinitionFeature],
    decls: 9,
    vars: 9,
    consts: [[1, "ant-message-notice", 3, "mouseenter", "mouseleave"], [1, "ant-message-notice-content"], [1, "ant-message-custom-content"], ["nzType", "check-circle"], ["nzType", "info-circle"], ["nzType", "exclamation-circle"], ["nzType", "close-circle"], ["nzType", "loading"], [4, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"], [3, "innerHTML"]],
    template: function NzMessageComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 0);
        ɵɵlistener("@moveUpMotion.done", function NzMessageComponent_Template_div_animation_moveUpMotion_done_0_listener($event) {
          return ctx.animationStateChanged.next($event);
        })("mouseenter", function NzMessageComponent_Template_div_mouseenter_0_listener() {
          return ctx.onEnter();
        })("mouseleave", function NzMessageComponent_Template_div_mouseleave_0_listener() {
          return ctx.onLeave();
        });
        ɵɵelementStart(1, "div", 1)(2, "div", 2);
        ɵɵconditionalCreate(3, NzMessageComponent_Case_3_Template, 1, 0, "nz-icon", 3)(4, NzMessageComponent_Case_4_Template, 1, 0, "nz-icon", 4)(5, NzMessageComponent_Case_5_Template, 1, 0, "nz-icon", 5)(6, NzMessageComponent_Case_6_Template, 1, 0, "nz-icon", 6)(7, NzMessageComponent_Case_7_Template, 1, 0, "nz-icon", 7);
        ɵɵtemplate(8, NzMessageComponent_ng_container_8_Template, 2, 1, "ng-container", 8);
        ɵɵelementEnd()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        ɵɵproperty("@moveUpMotion", ctx.instance.state);
        ɵɵadvance(2);
        ɵɵclassMap("ant-message-" + ctx.instance.type);
        ɵɵadvance();
        ɵɵconditional((tmp_2_0 = ctx.instance.type) === "success" ? 3 : tmp_2_0 === "info" ? 4 : tmp_2_0 === "warning" ? 5 : tmp_2_0 === "error" ? 6 : tmp_2_0 === "loading" ? 7 : -1);
        ɵɵadvance(5);
        ɵɵproperty("nzStringTemplateOutlet", ctx.instance.content)("nzStringTemplateOutletContext", ɵɵpureFunction2(6, _c0, ctx, ctx.instance.options == null ? null : ctx.instance.options.nzData));
      }
    },
    dependencies: [NzIconModule, NzIconDirective, NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    data: {
      animation: [moveUpMotion]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-message",
      exportAs: "nzMessage",
      animations: [moveUpMotion],
      template: `
    <div
      class="ant-message-notice"
      [@moveUpMotion]="instance.state"
      (@moveUpMotion.done)="animationStateChanged.next($event)"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <div class="ant-message-notice-content">
        <div class="ant-message-custom-content" [class]="'ant-message-' + instance.type">
          @switch (instance.type) {
            @case ('success') {
              <nz-icon nzType="check-circle" />
            }
            @case ('info') {
              <nz-icon nzType="info-circle" />
            }
            @case ('warning') {
              <nz-icon nzType="exclamation-circle" />
            }
            @case ('error') {
              <nz-icon nzType="close-circle" />
            }
            @case ('loading') {
              <nz-icon nzType="loading" />
            }
          }
          <ng-container
            *nzStringTemplateOutlet="instance.content; context: { $implicit: this, data: instance.options?.nzData }"
          >
            <span [innerHTML]="instance.content"></span>
          </ng-container>
        </div>
      </div>
    </div>
  `,
      imports: [NzIconModule, NzOutletModule]
    }]
  }], null, {
    instance: [{
      type: Input
    }],
    destroyed: [{
      type: Output
    }]
  });
})();
var NZ_CONFIG_COMPONENT_NAME = "message";
var NZ_MESSAGE_DEFAULT_CONFIG = {
  nzAnimate: true,
  nzDuration: 3e3,
  nzMaxStack: 7,
  nzPauseOnHover: true,
  nzTop: 24,
  nzDirection: "ltr"
};
var NzMessageContainerComponent = class _NzMessageContainerComponent extends NzMNContainerComponent {
  dir = this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)?.nzDirection || "ltr";
  top;
  constructor() {
    super();
    this.updateConfig();
  }
  subscribeConfigChange() {
    onConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME, () => {
      this.updateConfig();
      this.dir = this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)?.nzDirection || this.dir;
    });
  }
  updateConfig() {
    this.config = __spreadValues(__spreadValues(__spreadValues({}, NZ_MESSAGE_DEFAULT_CONFIG), this.config), this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME));
    this.top = toCssPixel(this.config.nzTop);
    this.cdr.markForCheck();
  }
  static ɵfac = function NzMessageContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMessageContainerComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzMessageContainerComponent,
    selectors: [["nz-message-container"]],
    exportAs: ["nzMessageContainer"],
    features: [ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 4,
    consts: [[1, "ant-message"], [3, "instance"], [3, "destroyed", "instance"]],
    template: function NzMessageContainerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 0);
        ɵɵrepeaterCreate(1, NzMessageContainerComponent_For_2_Template, 1, 1, "nz-message", 1, ɵɵrepeaterTrackByIdentity);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵstyleProp("top", ctx.top);
        ɵɵclassProp("ant-message-rtl", ctx.dir === "rtl");
        ɵɵadvance();
        ɵɵrepeater(ctx.instances);
      }
    },
    dependencies: [NzMessageComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageContainerComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-message-container",
      exportAs: "nzMessageContainer",
      template: `
    <div class="ant-message" [class.ant-message-rtl]="dir === 'rtl'" [style.top]="top">
      @for (instance of instances; track instance) {
        <nz-message [instance]="instance" (destroyed)="remove($event.id, $event.userAction)"></nz-message>
      }
    </div>
  `,
      imports: [NzMessageComponent]
    }]
  }], () => [], null);
})();
var NzMessageService = class _NzMessageService extends NzMNService {
  componentPrefix = "message-";
  success(content, options) {
    return this.createInstance({
      type: "success",
      content
    }, options);
  }
  error(content, options) {
    return this.createInstance({
      type: "error",
      content
    }, options);
  }
  info(content, options) {
    return this.createInstance({
      type: "info",
      content
    }, options);
  }
  warning(content, options) {
    return this.createInstance({
      type: "warning",
      content
    }, options);
  }
  loading(content, options) {
    return this.createInstance({
      type: "loading",
      content
    }, options);
  }
  create(type, content, options) {
    return this.createInstance({
      type,
      content
    }, options);
  }
  createInstance(message, options) {
    this.container = this.withContainer(NzMessageContainerComponent);
    return this.container.create(__spreadValues(__spreadValues({}, message), {
      createdAt: /* @__PURE__ */ new Date(),
      messageId: this.getInstanceId(),
      options
    }));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵNzMessageService_BaseFactory;
    return function NzMessageService_Factory(__ngFactoryType__) {
      return (ɵNzMessageService_BaseFactory || (ɵNzMessageService_BaseFactory = ɵɵgetInheritedFactory(_NzMessageService)))(__ngFactoryType__ || _NzMessageService);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _NzMessageService,
    factory: _NzMessageService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  NzMNService,
  NzMNContainerComponent,
  NzMNComponent,
  NzMessageComponent,
  NzMessageContainerComponent,
  NzMessageService
};
//# sourceMappingURL=chunk-7WECQDPH.js.map
