import {
  NG_VALUE_ACCESSOR
} from "./chunk-OSAHQ66W.js";
import {
  CommonModule
} from "./chunk-QXKDNKXL.js";
import "./chunk-COW2F6L5.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Output,
  ViewChild,
  forwardRef,
  inject,
  makeEnvironmentProviders,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵgetInheritedFactory,
  ɵɵloadQuery,
  ɵɵqueryRefresh,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  fromEvent
} from "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import "./chunk-JU3XS6KG.js";
import "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ngx-monaco-editor-v2@20.0.0_b1f49953d839c9ffd3321cf0c9b80ed7/node_modules/ngx-monaco-editor-v2/fesm2022/ngx-monaco-editor-v2.mjs
var _c0 = ["editorContainer"];
var _c1 = "[_nghost-%COMP%]{display:block;height:200px}.editor-container[_ngcontent-%COMP%]{width:100%;height:98%}";
var NGX_MONACO_EDITOR_CONFIG = new InjectionToken("NGX_MONACO_EDITOR_CONFIG");
var loadedMonaco = false;
var loadPromise;
var _BaseEditor = class _BaseEditor {
  constructor() {
    this.config = inject(NGX_MONACO_EDITOR_CONFIG);
    this.onInit = new EventEmitter();
    this._insideNg = false;
  }
  set insideNg(insideNg) {
    this._insideNg = insideNg;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }
  get insideNg() {
    return this._insideNg;
  }
  ngAfterViewInit() {
    if (loadedMonaco) {
      loadPromise.then(() => {
        this.initMonaco(this._options, this.insideNg);
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise((resolve) => {
        let baseUrl = this.config.baseUrl;
        if (baseUrl === "assets" || !baseUrl) {
          baseUrl = "./assets/monaco/min/vs";
        }
        if (typeof window.monaco === "object") {
          this.initMonaco(this._options, this.insideNg);
          resolve();
          return;
        }
        const onGotAmdLoader = (require2) => {
          let usedRequire = require2 || window.require;
          let requireConfig = {
            paths: {
              vs: `${baseUrl}`
            }
          };
          Object.assign(requireConfig, this.config.requireConfig || {});
          usedRequire.config(requireConfig);
          usedRequire([`vs/editor/editor.main`], () => {
            if (typeof this.config.onMonacoLoad === "function") {
              this.config.onMonacoLoad();
            }
            this.initMonaco(this._options, this.insideNg);
            resolve();
          });
        };
        if (this.config.monacoRequire) {
          onGotAmdLoader(this.config.monacoRequire);
        } else if (!window.require) {
          const loaderScript = document.createElement("script");
          loaderScript.type = "text/javascript";
          loaderScript.src = `${baseUrl}/loader.js`;
          loaderScript.addEventListener("load", () => {
            onGotAmdLoader();
          });
          document.body.appendChild(loaderScript);
        } else if (!window.require.config) {
          var src = `${baseUrl}/loader.js`;
          var loaderRequest = new XMLHttpRequest();
          loaderRequest.addEventListener("load", () => {
            let scriptElem = document.createElement("script");
            scriptElem.type = "text/javascript";
            scriptElem.text = [
              // Monaco uses a custom amd loader that over-rides node's require.
              // Keep a reference to node's require so we can restore it after executing the amd loader file.
              "var nodeRequire = require;",
              loaderRequest.responseText.replace('"use strict";', ""),
              // Save Monaco's amd require and restore Node's require
              "var monacoAmdRequire = require;",
              "require = nodeRequire;",
              "require.nodeRequire = require;"
            ].join("\n");
            document.body.appendChild(scriptElem);
            onGotAmdLoader(window.monacoAmdRequire);
          });
          loaderRequest.open("GET", src);
          loaderRequest.send();
        } else {
          onGotAmdLoader();
        }
      });
    }
  }
  ngOnDestroy() {
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    if (this._editor) {
      this._editor.dispose();
      this._editor = void 0;
    }
  }
};
_BaseEditor.ɵfac = function BaseEditor_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BaseEditor)();
};
_BaseEditor.ɵcmp = ɵɵdefineComponent({
  type: _BaseEditor,
  selectors: [["ng-component"]],
  viewQuery: function BaseEditor_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c0, 7);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._editorContainer = _t.first);
    }
  },
  inputs: {
    insideNg: "insideNg"
  },
  outputs: {
    onInit: "onInit"
  },
  standalone: false,
  decls: 0,
  vars: 0,
  template: function BaseEditor_Template(rf, ctx) {
  },
  encapsulation: 2
});
var BaseEditor = _BaseEditor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseEditor, [{
    type: Component,
    args: [{
      template: "",
      standalone: false
    }]
  }], null, {
    insideNg: [{
      type: Input,
      args: ["insideNg"]
    }],
    _editorContainer: [{
      type: ViewChild,
      args: ["editorContainer", {
        static: true
      }]
    }],
    onInit: [{
      type: Output
    }]
  });
})();
var _EditorComponent = class _EditorComponent extends BaseEditor {
  constructor() {
    super(...arguments);
    this.zone = inject(NgZone);
    this._value = "";
    this.propagateChange = (_) => {
    };
    this.onTouched = () => {
    };
  }
  set options(options) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }
  get options() {
    return this._options;
  }
  set model(model) {
    this.options.model = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }
  writeValue(value) {
    this._value = value || "";
    setTimeout(() => {
      if (this._editor && !this.options.model) {
        this._editor.setValue(this._value);
      }
    });
  }
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(disabled) {
    this.options.readOnly = disabled;
  }
  initMonaco(options, insideNg) {
    const hasModel = !!options.model;
    if (hasModel) {
      const model = monaco.editor.getModel(options.model.uri || "");
      if (model) {
        options.model = model;
        options.model.setValue(this._value);
      } else {
        options.model = monaco.editor.createModel(options.model.value, options.model.language, options.model.uri);
      }
    }
    if (insideNg) {
      this._editor = monaco.editor.create(this._editorContainer.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.create(this._editorContainer.nativeElement, options);
      });
    }
    if (!hasModel) {
      this._editor.setValue(this._value);
    }
    this._editor.onDidChangeModelContent((e) => {
      const value = this._editor.getValue();
      this.zone.run(() => {
        this.propagateChange(value);
        this._value = value;
      });
    });
    this._editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });
    this._editor.setTheme = (themeName) => {
      this.options.theme = themeName;
      monaco.editor.setTheme(themeName);
    };
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, "resize").subscribe(() => this._editor.layout());
    this.onInit.emit(this._editor);
  }
};
_EditorComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵEditorComponent_BaseFactory;
  return function EditorComponent_Factory(__ngFactoryType__) {
    return (ɵEditorComponent_BaseFactory || (ɵEditorComponent_BaseFactory = ɵɵgetInheritedFactory(_EditorComponent)))(__ngFactoryType__ || _EditorComponent);
  };
})();
_EditorComponent.ɵcmp = ɵɵdefineComponent({
  type: _EditorComponent,
  selectors: [["ngx-monaco-editor"]],
  inputs: {
    options: "options",
    model: "model"
  },
  features: [ɵɵProvidersFeature([{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => _EditorComponent),
    multi: true
  }]), ɵɵInheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["editorContainer", ""], [1, "editor-container"]],
  template: function EditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵdomElement(0, "div", 1, 0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block;height:200px}.editor-container[_ngcontent-%COMP%]{width:100%;height:98%}"],
  changeDetection: 0
});
var EditorComponent = _EditorComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EditorComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "ngx-monaco-editor",
      template: '<div class="editor-container" #editorContainer></div>',
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorComponent),
        multi: true
      }],
      styles: [":host{display:block;height:200px}.editor-container{width:100%;height:98%}\n"]
    }]
  }], null, {
    options: [{
      type: Input,
      args: ["options"]
    }],
    model: [{
      type: Input,
      args: ["model"]
    }]
  });
})();
var _DiffEditorComponent = class _DiffEditorComponent extends BaseEditor {
  constructor() {
    super(...arguments);
    this.zone = inject(NgZone);
  }
  set options(options) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }
  get options() {
    return this._options;
  }
  set originalModel(model) {
    this._originalModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }
  set modifiedModel(model) {
    this._modifiedModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }
  initMonaco(options, insideNg) {
    if (!this._originalModel || !this._modifiedModel) {
      throw new Error("originalModel or modifiedModel not found for ngx-monaco-diff-editor");
    }
    this._originalModel.language = this._originalModel.language || options.language;
    this._modifiedModel.language = this._modifiedModel.language || options.language;
    let originalModel = monaco.editor.createModel(this._originalModel.code, this._originalModel.language);
    let modifiedModel = monaco.editor.createModel(this._modifiedModel.code, this._modifiedModel.language);
    this._editorContainer.nativeElement.innerHTML = "";
    const theme = options.theme;
    if (insideNg) {
      this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
      });
    }
    options.theme = theme;
    this._editor.setModel({
      original: originalModel,
      modified: modifiedModel
    });
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, "resize").subscribe(() => this._editor.layout());
    this.onInit.emit(this._editor);
  }
};
_DiffEditorComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵDiffEditorComponent_BaseFactory;
  return function DiffEditorComponent_Factory(__ngFactoryType__) {
    return (ɵDiffEditorComponent_BaseFactory || (ɵDiffEditorComponent_BaseFactory = ɵɵgetInheritedFactory(_DiffEditorComponent)))(__ngFactoryType__ || _DiffEditorComponent);
  };
})();
_DiffEditorComponent.ɵcmp = ɵɵdefineComponent({
  type: _DiffEditorComponent,
  selectors: [["ngx-monaco-diff-editor"]],
  inputs: {
    options: "options",
    originalModel: "originalModel",
    modifiedModel: "modifiedModel"
  },
  features: [ɵɵInheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["editorContainer", ""], [1, "editor-container"]],
  template: function DiffEditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵdomElement(0, "div", 1, 0);
    }
  },
  styles: [_c1],
  changeDetection: 0
});
var DiffEditorComponent = _DiffEditorComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DiffEditorComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "ngx-monaco-diff-editor",
      template: '<div class="editor-container" #editorContainer></div>',
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [":host{display:block;height:200px}.editor-container{width:100%;height:98%}\n"]
    }]
  }], null, {
    options: [{
      type: Input,
      args: ["options"]
    }],
    originalModel: [{
      type: Input,
      args: ["originalModel"]
    }],
    modifiedModel: [{
      type: Input,
      args: ["modifiedModel"]
    }]
  });
})();
var _MonacoEditorModule = class _MonacoEditorModule {
  static forRoot(config = {}) {
    return {
      ngModule: _MonacoEditorModule,
      providers: [{
        provide: NGX_MONACO_EDITOR_CONFIG,
        useValue: config
      }]
    };
  }
};
_MonacoEditorModule.ɵfac = function MonacoEditorModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _MonacoEditorModule)();
};
_MonacoEditorModule.ɵmod = ɵɵdefineNgModule({
  type: _MonacoEditorModule,
  imports: [CommonModule, EditorComponent, DiffEditorComponent],
  exports: [EditorComponent, DiffEditorComponent]
});
_MonacoEditorModule.ɵinj = ɵɵdefineInjector({
  imports: [CommonModule]
});
var MonacoEditorModule = _MonacoEditorModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MonacoEditorModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, EditorComponent, DiffEditorComponent],
      exports: [EditorComponent, DiffEditorComponent]
    }]
  }], null, null);
})();
function provideMonacoEditor(config = {}) {
  return makeEnvironmentProviders([{
    provide: NGX_MONACO_EDITOR_CONFIG,
    useValue: config
  }]);
}
export {
  DiffEditorComponent,
  EditorComponent,
  MonacoEditorModule,
  NGX_MONACO_EDITOR_CONFIG,
  provideMonacoEditor
};
//# sourceMappingURL=ngx-monaco-editor-v2.js.map
