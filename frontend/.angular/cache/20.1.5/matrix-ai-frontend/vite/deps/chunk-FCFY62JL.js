import {
  NzEmbedEmptyComponent,
  NzEmptyModule
} from "./chunk-4KIH4RME.js";
import {
  NzConnectedOverlayDirective,
  NzOverlayModule,
  POSITION_MAP,
  getPlacementName
} from "./chunk-V6RO4VMH.js";
import {
  CdkConnectedOverlay,
  CdkFixedSizeVirtualScroll,
  CdkOverlayOrigin,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  OverlayModule
} from "./chunk-YLYPD5XX.js";
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
import {
  COMPOSITION_BUFFER_MODE,
  DefaultValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel
} from "./chunk-OSAHQ66W.js";
import {
  cancelAnimationFrame,
  requestAnimationFrame
} from "./chunk-NX7BCYNZ.js";
import {
  BACKSPACE,
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  SPACE,
  TAB,
  UP_ARROW
} from "./chunk-OROZASVN.js";
import {
  NzNoAnimationDirective
} from "./chunk-M3YYK6CE.js";
import {
  slideMotion
} from "./chunk-XB33FMDA.js";
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
import {
  Platform,
  _getEventTarget
} from "./chunk-3NNVUQIN.js";
import {
  WithConfig,
  onConfigChangeEventForComponent
} from "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import {
  fromEventOutsideAngular,
  getStatusClassNames,
  isNotNil,
  numberAttributeWithInfinityFallback
} from "./chunk-MKTFS3GT.js";
import {
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-QXKDNKXL.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  numberAttribute,
  output,
  setClassMetadata,
  signal,
  ɵɵHostDirectivesFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomTemplate,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  merge
} from "./chunk-5ZA7WIRE.js";
import {
  BehaviorSubject,
  Subject,
  __esDecorate,
  __runInitializers,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  withLatestFrom
} from "./chunk-JU3XS6KG.js";
import {
  __publicField,
  __spreadValues
} from "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-select.mjs
var _c0 = ["*"];
function NzOptionItemGroupComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzLabel);
  }
}
function NzOptionItemComponent_Conditional_1_ng_template_0_Template(rf, ctx) {
}
function NzOptionItemComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzOptionItemComponent_Conditional_1_ng_template_0_Template, 0, 0, "ng-template", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.template);
  }
}
function NzOptionItemComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵtextInterpolate1(" ", ctx_r0.label, " ");
  }
}
function NzOptionItemComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 3);
  }
}
function NzOptionItemComponent_Conditional_3_Conditional_2_ng_template_0_Template(rf, ctx) {
}
function NzOptionItemComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzOptionItemComponent_Conditional_3_Conditional_2_ng_template_0_Template, 0, 0, "ng-template", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngTemplateOutlet", ctx_r0.icon);
  }
}
function NzOptionItemComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵconditionalCreate(1, NzOptionItemComponent_Conditional_3_Conditional_1_Template, 1, 0, "nz-icon", 3)(2, NzOptionItemComponent_Conditional_3_Conditional_2_Template, 1, 1, null, 1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(!ctx_r0.icon ? 1 : 2);
  }
}
function NzOptionContainerComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵelement(1, "nz-embed-empty", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("specificContent", ctx_r0.notFoundContent);
  }
}
function NzOptionContainerComponent_ng_template_3_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-option-item-group", 5);
  }
  if (rf & 2) {
    const item_r2 = ɵɵnextContext().$implicit;
    ɵɵproperty("nzLabel", item_r2.groupLabel ?? null);
  }
}
function NzOptionContainerComponent_ng_template_3_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-option-item", 7);
    ɵɵlistener("itemHover", function NzOptionContainerComponent_ng_template_3_Case_1_Template_nz_option_item_itemHover_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r0 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r0.onItemHover($event));
    })("itemClick", function NzOptionContainerComponent_ng_template_3_Case_1_Template_nz_option_item_itemClick_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r0 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r0.onItemClick($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r2 = ɵɵnextContext().$implicit;
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("icon", ctx_r0.menuItemSelectedIcon)("customContent", item_r2.nzCustomContent)("template", item_r2.template ?? null)("grouped", !!item_r2.groupLabel)("disabled", item_r2.nzDisabled || ctx_r0.isMaxMultipleCountReached && !ctx_r0.listOfSelectedValue.includes(item_r2["nzValue"]))("showState", ctx_r0.mode === "tags" || ctx_r0.mode === "multiple")("title", item_r2.nzTitle)("label", item_r2.nzLabel)("compareWith", ctx_r0.compareWith)("activatedValue", ctx_r0.activatedValue)("listOfSelectedValue", ctx_r0.listOfSelectedValue)("value", item_r2.nzValue);
  }
}
function NzOptionContainerComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzOptionContainerComponent_ng_template_3_Case_0_Template, 1, 1, "nz-option-item-group", 5)(1, NzOptionContainerComponent_ng_template_3_Case_1_Template, 1, 12, "nz-option-item", 6);
  }
  if (rf & 2) {
    let tmp_2_0;
    const item_r2 = ctx.$implicit;
    ɵɵconditional((tmp_2_0 = item_r2.type) === "group" ? 0 : tmp_2_0 === "item" ? 1 : -1);
  }
}
function NzOptionContainerComponent_ng_template_4_Template(rf, ctx) {
}
function NzOptionComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function NzSelectArrowComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate2("", ctx_r0.listOfValue.length, " / ", ctx_r0.nzMaxMultipleCount);
  }
}
function NzSelectArrowComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 0);
  }
}
function NzSelectArrowComponent_Conditional_2_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 2);
  }
}
function NzSelectArrowComponent_Conditional_2_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 3);
  }
}
function NzSelectArrowComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzSelectArrowComponent_Conditional_2_Conditional_0_Conditional_0_Template, 1, 0, "nz-icon", 2)(1, NzSelectArrowComponent_Conditional_2_Conditional_0_Conditional_1_Template, 1, 0, "nz-icon", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵconditional(ctx_r0.search ? 0 : 1);
  }
}
function NzSelectArrowComponent_Conditional_2_Conditional_1_ng_container_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 4);
  }
  if (rf & 2) {
    const suffixIcon_r2 = ɵɵnextContext().$implicit;
    ɵɵproperty("nzType", suffixIcon_r2);
  }
}
function NzSelectArrowComponent_Conditional_2_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵconditionalCreate(1, NzSelectArrowComponent_Conditional_2_Conditional_1_ng_container_0_Conditional_1_Template, 1, 1, "nz-icon", 4);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const suffixIcon_r2 = ctx.$implicit;
    ɵɵadvance();
    ɵɵconditional(suffixIcon_r2 ? 1 : -1);
  }
}
function NzSelectArrowComponent_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzSelectArrowComponent_Conditional_2_Conditional_1_ng_container_0_Template, 2, 1, "ng-container", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.suffixIcon);
  }
}
function NzSelectArrowComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzSelectArrowComponent_Conditional_2_Conditional_0_Template, 2, 1)(1, NzSelectArrowComponent_Conditional_2_Conditional_1_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.showArrow && !ctx_r0.suffixIcon ? 0 : 1);
  }
}
function NzSelectArrowComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.feedbackIcon);
  }
}
function NzSelectClearComponent_Conditional_0_ng_template_0_Template(rf, ctx) {
}
function NzSelectClearComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzSelectClearComponent_Conditional_0_ng_template_0_Template, 0, 0, "ng-template", 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.clearIcon);
  }
}
function NzSelectClearComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 1);
  }
}
function NzSelectItemComponent_ng_container_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 4);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵclassProp("ant-select-selection-item-content", ctx_r0.deletable);
    ɵɵproperty("innerHTML", ctx_r0.label, ɵɵsanitizeHtml);
  }
}
function NzSelectItemComponent_ng_container_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵclassProp("ant-select-selection-item-content", ctx_r0.deletable);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.label);
  }
}
function NzSelectItemComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵconditionalCreate(1, NzSelectItemComponent_ng_container_0_Conditional_1_Template, 1, 3, "span", 2)(2, NzSelectItemComponent_ng_container_0_Conditional_2_Template, 2, 3, "span", 3);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(ctx_r0.displayLabelInHtml ? 1 : 2);
  }
}
function NzSelectItemComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 6);
  }
}
function NzSelectItemComponent_Conditional_1_Conditional_2_ng_template_0_Template(rf, ctx) {
}
function NzSelectItemComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzSelectItemComponent_Conditional_1_Conditional_2_ng_template_0_Template, 0, 0, "ng-template", 7);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngTemplateOutlet", ctx_r0.removeIcon);
  }
}
function NzSelectItemComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "span", 5);
    ɵɵlistener("click", function NzSelectItemComponent_Conditional_1_Template_span_click_0_listener($event) {
      ɵɵrestoreView(_r2);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.onDelete($event));
    });
    ɵɵconditionalCreate(1, NzSelectItemComponent_Conditional_1_Conditional_1_Template, 1, 0, "nz-icon", 6)(2, NzSelectItemComponent_Conditional_1_Conditional_2_Template, 1, 1, null, 7);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(!ctx_r0.removeIcon ? 1 : 2);
  }
}
function NzSelectPlaceholderComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.placeholder, " ");
  }
}
var _c1 = ["inputElement"];
var _c2 = ["mirrorElement"];
function NzSelectSearchComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 3, 1);
  }
}
var _forTrack0 = ($index, $item) => $item.nzValue;
function NzSelectTopControlComponent_Case_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-select-item", 2);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("removeIcon", ctx_r1.removeIcon)("label", ctx_r1.listOfTopItem[0].nzLabel)("contentTemplateOutlet", ctx_r1.customTemplate)("contentTemplateOutletContext", ctx_r1.listOfTopItem[0]);
  }
}
function NzSelectTopControlComponent_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-select-search", 1);
    ɵɵlistener("isComposingChange", function NzSelectTopControlComponent_Case_0_Template_nz_select_search_isComposingChange_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.isComposingChange($event));
    })("valueChange", function NzSelectTopControlComponent_Case_0_Template_nz_select_search_valueChange_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onInputValueChange($event));
    });
    ɵɵelementEnd();
    ɵɵconditionalCreate(1, NzSelectTopControlComponent_Case_0_Conditional_1_Template, 1, 4, "nz-select-item", 2);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("nzId", ctx_r1.nzId)("disabled", ctx_r1.disabled)("value", ctx_r1.inputValue)("showInput", ctx_r1.showSearch)("mirrorSync", false)("autofocus", ctx_r1.autofocus)("focusTrigger", ctx_r1.open);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.isShowSingleLabel ? 1 : -1);
  }
}
function NzSelectTopControlComponent_Case_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-select-item", 5);
    ɵɵlistener("delete", function NzSelectTopControlComponent_Case_1_For_1_Template_nz_select_item_delete_0_listener() {
      const item_r5 = ɵɵrestoreView(_r4).$implicit;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onDeleteItem(item_r5.contentTemplateOutletContext));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("removeIcon", ctx_r1.removeIcon)("label", item_r5.nzLabel)("disabled", item_r5.nzDisabled || ctx_r1.disabled)("contentTemplateOutlet", item_r5.contentTemplateOutlet)("contentTemplateOutletContext", item_r5.contentTemplateOutletContext);
  }
}
function NzSelectTopControlComponent_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵrepeaterCreate(0, NzSelectTopControlComponent_Case_1_For_1_Template, 1, 5, "nz-select-item", 3, _forTrack0);
    ɵɵelementStart(2, "nz-select-search", 4);
    ɵɵlistener("isComposingChange", function NzSelectTopControlComponent_Case_1_Template_nz_select_search_isComposingChange_2_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.isComposingChange($event));
    })("valueChange", function NzSelectTopControlComponent_Case_1_Template_nz_select_search_valueChange_2_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onInputValueChange($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵrepeater(ctx_r1.listOfSlicedItem);
    ɵɵadvance(2);
    ɵɵproperty("nzId", ctx_r1.nzId)("disabled", ctx_r1.disabled)("value", ctx_r1.inputValue)("autofocus", ctx_r1.autofocus)("showInput", true)("mirrorSync", true)("focusTrigger", ctx_r1.open);
  }
}
function NzSelectTopControlComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-select-placeholder", 0);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("placeholder", ctx_r1.placeHolder);
  }
}
function NzSelectComponent_Conditional_2_ng_template_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-form-item-feedback-icon", 6);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵproperty("status", ctx_r1.status);
  }
}
function NzSelectComponent_Conditional_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzSelectComponent_Conditional_2_ng_template_1_Conditional_0_Template, 1, 1, "nz-form-item-feedback-icon", 6);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵconditional(ctx_r1.hasFeedback && !!ctx_r1.status ? 0 : -1);
  }
}
function NzSelectComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-select-arrow", 3);
    ɵɵtemplate(1, NzSelectComponent_Conditional_2_ng_template_1_Template, 1, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const feedbackIconTpl_r3 = ɵɵreference(2);
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("showArrow", ctx_r1.nzShowArrow)("loading", ctx_r1.nzLoading)("search", ctx_r1.nzOpen && ctx_r1.nzShowSearch)("suffixIcon", ctx_r1.nzSuffixIcon)("feedbackIcon", feedbackIconTpl_r3)("nzMaxMultipleCount", ctx_r1.nzMaxMultipleCount)("listOfValue", ctx_r1.listOfValue)("isMaxMultipleCountSet", ctx_r1.isMaxMultipleCountSet);
  }
}
function NzSelectComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-select-clear", 7);
    ɵɵlistener("clear", function NzSelectComponent_Conditional_3_Template_nz_select_clear_clear_0_listener() {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onClearSelection());
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("clearIcon", ctx_r1.nzClearIcon);
  }
}
function NzSelectComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-option-container", 8);
    ɵɵlistener("keydown", function NzSelectComponent_ng_template_4_Template_nz_option_container_keydown_0_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onKeyDown($event));
    })("itemClick", function NzSelectComponent_ng_template_4_Template_nz_option_container_itemClick_0_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onItemClick($event));
    })("scrollToBottom", function NzSelectComponent_ng_template_4_Template_nz_option_container_scrollToBottom_0_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.nzScrollToBottom.emit());
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵstyleMap(ctx_r1.nzDropdownStyle);
    ɵɵclassProp("ant-select-dropdown-placement-bottomLeft", ctx_r1.dropdownPosition === "bottomLeft")("ant-select-dropdown-placement-topLeft", ctx_r1.dropdownPosition === "topLeft")("ant-select-dropdown-placement-bottomRight", ctx_r1.dropdownPosition === "bottomRight")("ant-select-dropdown-placement-topRight", ctx_r1.dropdownPosition === "topRight");
    ɵɵproperty("itemSize", ctx_r1.nzOptionHeightPx)("maxItemLength", ctx_r1.nzOptionOverflowSize)("matchWidth", ctx_r1.nzDropdownMatchSelectWidth)("@slideMotion", "enter")("@.disabled", !!(ctx_r1.noAnimation == null ? null : ctx_r1.noAnimation.nzNoAnimation))("nzNoAnimation", ctx_r1.noAnimation == null ? null : ctx_r1.noAnimation.nzNoAnimation)("listOfContainerItem", ctx_r1.listOfContainerItem)("menuItemSelectedIcon", ctx_r1.nzMenuItemSelectedIcon)("notFoundContent", ctx_r1.nzNotFoundContent)("activatedValue", ctx_r1.activatedValue)("listOfSelectedValue", ctx_r1.listOfValue)("dropdownRender", ctx_r1.nzDropdownRender)("compareWith", ctx_r1.compareWith)("mode", ctx_r1.nzMode)("isMaxMultipleCountReached", ctx_r1.isMaxMultipleCountReached);
  }
}
var NzOptionGroupComponent = class _NzOptionGroupComponent {
  nzLabel = null;
  changes = new Subject();
  ngOnChanges() {
    this.changes.next();
  }
  static ɵfac = function NzOptionGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOptionGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzOptionGroupComponent,
    selectors: [["nz-option-group"]],
    inputs: {
      nzLabel: "nzLabel"
    },
    exportAs: ["nzOptionGroup"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzOptionGroupComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOptionGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-option-group",
      exportAs: "nzOptionGroup",
      template: `<ng-content></ng-content>`,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, {
    nzLabel: [{
      type: Input
    }]
  });
})();
var NzOptionItemGroupComponent = class _NzOptionItemGroupComponent {
  nzLabel = null;
  static ɵfac = function NzOptionItemGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOptionItemGroupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzOptionItemGroupComponent,
    selectors: [["nz-option-item-group"]],
    hostAttrs: [1, "ant-select-item", "ant-select-item-group"],
    inputs: {
      nzLabel: "nzLabel"
    },
    decls: 1,
    vars: 1,
    consts: [[4, "nzStringTemplateOutlet"]],
    template: function NzOptionItemGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, NzOptionItemGroupComponent_ng_container_0_Template, 2, 1, "ng-container", 0);
      }
      if (rf & 2) {
        ɵɵproperty("nzStringTemplateOutlet", ctx.nzLabel);
      }
    },
    dependencies: [NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOptionItemGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-option-item-group",
      template: `<ng-container *nzStringTemplateOutlet="nzLabel">{{ nzLabel }}</ng-container>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-select-item ant-select-item-group"
      },
      imports: [NzOutletModule]
    }]
  }], null, {
    nzLabel: [{
      type: Input
    }]
  });
})();
var NzOptionItemComponent = class _NzOptionItemComponent {
  el = inject(ElementRef).nativeElement;
  ngZone = inject(NgZone);
  destroyRef = inject(DestroyRef);
  selected = false;
  activated = false;
  grouped = false;
  customContent = false;
  template = null;
  disabled = false;
  showState = false;
  title;
  label = null;
  value = null;
  activatedValue = null;
  listOfSelectedValue = [];
  icon = null;
  compareWith;
  itemClick = new EventEmitter();
  itemHover = new EventEmitter();
  ngOnChanges(changes) {
    const {
      value,
      activatedValue,
      listOfSelectedValue
    } = changes;
    if (value || listOfSelectedValue) {
      this.selected = this.listOfSelectedValue.some((v) => this.compareWith(v, this.value));
    }
    if (value || activatedValue) {
      this.activated = this.compareWith(this.activatedValue, this.value);
    }
  }
  ngOnInit() {
    fromEventOutsideAngular(this.el, "click").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.disabled) {
        this.ngZone.run(() => this.itemClick.emit(this.value));
      }
    });
    fromEventOutsideAngular(this.el, "mouseenter").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.disabled) {
        this.ngZone.run(() => this.itemHover.emit(this.value));
      }
    });
  }
  static ɵfac = function NzOptionItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOptionItemComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzOptionItemComponent,
    selectors: [["nz-option-item"]],
    hostAttrs: [1, "ant-select-item", "ant-select-item-option"],
    hostVars: 9,
    hostBindings: function NzOptionItemComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("title", ctx.title);
        ɵɵclassProp("ant-select-item-option-grouped", ctx.grouped)("ant-select-item-option-selected", ctx.selected && !ctx.disabled)("ant-select-item-option-disabled", ctx.disabled)("ant-select-item-option-active", ctx.activated && !ctx.disabled);
      }
    },
    inputs: {
      grouped: "grouped",
      customContent: [2, "customContent", "customContent", booleanAttribute],
      template: "template",
      disabled: "disabled",
      showState: "showState",
      title: "title",
      label: "label",
      value: "value",
      activatedValue: "activatedValue",
      listOfSelectedValue: "listOfSelectedValue",
      icon: "icon",
      compareWith: "compareWith"
    },
    outputs: {
      itemClick: "itemClick",
      itemHover: "itemHover"
    },
    features: [ɵɵNgOnChangesFeature],
    decls: 4,
    vars: 2,
    consts: [[1, "ant-select-item-option-content"], [3, "ngTemplateOutlet"], ["unselectable", "on", 1, "ant-select-item-option-state"], ["nzType", "check", 1, "ant-select-selected-icon"]],
    template: function NzOptionItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 0);
        ɵɵconditionalCreate(1, NzOptionItemComponent_Conditional_1_Template, 1, 1, null, 1)(2, NzOptionItemComponent_Conditional_2_Template, 1, 1);
        ɵɵelementEnd();
        ɵɵconditionalCreate(3, NzOptionItemComponent_Conditional_3_Template, 3, 1, "div", 2);
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵconditional(ctx.customContent ? 1 : 2);
        ɵɵadvance(2);
        ɵɵconditional(ctx.showState && ctx.selected ? 3 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOptionItemComponent, [{
    type: Component,
    args: [{
      selector: "nz-option-item",
      template: `
    <div class="ant-select-item-option-content">
      @if (customContent) {
        <ng-template [ngTemplateOutlet]="template"></ng-template>
      } @else {
        {{ label }}
      }
    </div>
    @if (showState && selected) {
      <div class="ant-select-item-option-state" unselectable="on">
        @if (!icon) {
          <nz-icon nzType="check" class="ant-select-selected-icon" />
        } @else {
          <ng-template [ngTemplateOutlet]="icon"></ng-template>
        }
      </div>
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-select-item ant-select-item-option",
        "[attr.title]": "title",
        "[class.ant-select-item-option-grouped]": "grouped",
        "[class.ant-select-item-option-selected]": "selected && !disabled",
        "[class.ant-select-item-option-disabled]": "disabled",
        "[class.ant-select-item-option-active]": "activated && !disabled"
      },
      imports: [NgTemplateOutlet, NzIconModule]
    }]
  }], null, {
    grouped: [{
      type: Input
    }],
    customContent: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    template: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    showState: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    activatedValue: [{
      type: Input
    }],
    listOfSelectedValue: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    compareWith: [{
      type: Input
    }],
    itemClick: [{
      type: Output
    }],
    itemHover: [{
      type: Output
    }]
  });
})();
var NzOptionContainerComponent = class _NzOptionContainerComponent {
  ngZone = inject(NgZone);
  platformId = inject(PLATFORM_ID);
  notFoundContent = void 0;
  menuItemSelectedIcon = null;
  dropdownRender = null;
  activatedValue = null;
  listOfSelectedValue = [];
  compareWith;
  mode = "default";
  matchWidth = true;
  itemSize = 32;
  maxItemLength = 8;
  isMaxMultipleCountReached = false;
  listOfContainerItem = [];
  itemClick = new EventEmitter();
  scrollToBottom = new EventEmitter();
  cdkVirtualScrollViewport;
  scrolledIndex = 0;
  onItemClick(value) {
    this.itemClick.emit(value);
  }
  onItemHover(value) {
    this.activatedValue = value;
  }
  trackValue(_index, option) {
    return option.key;
  }
  onScrolledIndexChange(index) {
    this.scrolledIndex = index;
    if (index === this.listOfContainerItem.length - this.maxItemLength - 1) {
      this.scrollToBottom.emit();
    }
  }
  scrollToActivatedValue() {
    const index = this.listOfContainerItem.findIndex((item) => this.compareWith(item.key, this.activatedValue));
    if (index < this.scrolledIndex || index >= this.scrolledIndex + this.maxItemLength) {
      this.cdkVirtualScrollViewport.scrollToIndex(index || 0);
    }
  }
  ngOnChanges(changes) {
    const {
      listOfContainerItem,
      activatedValue
    } = changes;
    if (listOfContainerItem || activatedValue) {
      this.scrollToActivatedValue();
    }
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => setTimeout(() => this.scrollToActivatedValue()));
    }
  }
  static ɵfac = function NzOptionContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOptionContainerComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzOptionContainerComponent,
    selectors: [["nz-option-container"]],
    viewQuery: function NzOptionContainerComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(CdkVirtualScrollViewport, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.cdkVirtualScrollViewport = _t.first);
      }
    },
    hostAttrs: [1, "ant-select-dropdown"],
    inputs: {
      notFoundContent: "notFoundContent",
      menuItemSelectedIcon: "menuItemSelectedIcon",
      dropdownRender: "dropdownRender",
      activatedValue: "activatedValue",
      listOfSelectedValue: "listOfSelectedValue",
      compareWith: "compareWith",
      mode: "mode",
      matchWidth: "matchWidth",
      itemSize: "itemSize",
      maxItemLength: "maxItemLength",
      isMaxMultipleCountReached: "isMaxMultipleCountReached",
      listOfContainerItem: "listOfContainerItem"
    },
    outputs: {
      itemClick: "itemClick",
      scrollToBottom: "scrollToBottom"
    },
    exportAs: ["nzOptionContainer"],
    features: [ɵɵNgOnChangesFeature],
    decls: 5,
    vars: 14,
    consts: [[1, "ant-select-item-empty"], [3, "scrolledIndexChange", "itemSize", "maxBufferPx", "minBufferPx"], ["cdkVirtualFor", "", 3, "cdkVirtualForOf", "cdkVirtualForTrackBy", "cdkVirtualForTemplateCacheSize"], [3, "ngTemplateOutlet"], ["nzComponentName", "select", 3, "specificContent"], [3, "nzLabel"], [3, "icon", "customContent", "template", "grouped", "disabled", "showState", "title", "label", "compareWith", "activatedValue", "listOfSelectedValue", "value"], [3, "itemHover", "itemClick", "icon", "customContent", "template", "grouped", "disabled", "showState", "title", "label", "compareWith", "activatedValue", "listOfSelectedValue", "value"]],
    template: function NzOptionContainerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div");
        ɵɵconditionalCreate(1, NzOptionContainerComponent_Conditional_1_Template, 2, 1, "div", 0);
        ɵɵelementStart(2, "cdk-virtual-scroll-viewport", 1);
        ɵɵlistener("scrolledIndexChange", function NzOptionContainerComponent_Template_cdk_virtual_scroll_viewport_scrolledIndexChange_2_listener($event) {
          return ctx.onScrolledIndexChange($event);
        });
        ɵɵtemplate(3, NzOptionContainerComponent_ng_template_3_Template, 2, 1, "ng-template", 2);
        ɵɵelementEnd();
        ɵɵtemplate(4, NzOptionContainerComponent_ng_template_4_Template, 0, 0, "ng-template", 3);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵconditional(ctx.listOfContainerItem.length === 0 ? 1 : -1);
        ɵɵadvance();
        ɵɵstyleProp("height", ctx.listOfContainerItem.length * ctx.itemSize, "px")("max-height", ctx.itemSize * ctx.maxItemLength, "px");
        ɵɵclassProp("full-width", !ctx.matchWidth);
        ɵɵproperty("itemSize", ctx.itemSize)("maxBufferPx", ctx.itemSize * ctx.maxItemLength)("minBufferPx", ctx.itemSize * ctx.maxItemLength);
        ɵɵadvance();
        ɵɵproperty("cdkVirtualForOf", ctx.listOfContainerItem)("cdkVirtualForTrackBy", ctx.trackValue)("cdkVirtualForTemplateCacheSize", 0);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.dropdownRender);
      }
    },
    dependencies: [NzEmptyModule, NzEmbedEmptyComponent, NzOptionItemGroupComponent, NzOptionItemComponent, NgTemplateOutlet, OverlayModule, CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport, NzOverlayModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOptionContainerComponent, [{
    type: Component,
    args: [{
      selector: "nz-option-container",
      exportAs: "nzOptionContainer",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
    <div>
      @if (listOfContainerItem.length === 0) {
        <div class="ant-select-item-empty">
          <nz-embed-empty nzComponentName="select" [specificContent]="notFoundContent!"></nz-embed-empty>
        </div>
      }
      <cdk-virtual-scroll-viewport
        [class.full-width]="!matchWidth"
        [itemSize]="itemSize"
        [maxBufferPx]="itemSize * maxItemLength"
        [minBufferPx]="itemSize * maxItemLength"
        (scrolledIndexChange)="onScrolledIndexChange($event)"
        [style.height.px]="listOfContainerItem.length * itemSize"
        [style.max-height.px]="itemSize * maxItemLength"
      >
        <ng-template
          cdkVirtualFor
          [cdkVirtualForOf]="listOfContainerItem"
          [cdkVirtualForTrackBy]="trackValue"
          [cdkVirtualForTemplateCacheSize]="0"
          let-item
        >
          @switch (item.type) {
            @case ('group') {
              <nz-option-item-group [nzLabel]="item.groupLabel ?? null"></nz-option-item-group>
            }
            @case ('item') {
              <nz-option-item
                [icon]="menuItemSelectedIcon"
                [customContent]="item.nzCustomContent"
                [template]="item.template ?? null"
                [grouped]="!!item.groupLabel"
                [disabled]="
                  item.nzDisabled || (isMaxMultipleCountReached && !listOfSelectedValue.includes(item['nzValue']))
                "
                [showState]="mode === 'tags' || mode === 'multiple'"
                [title]="item.nzTitle"
                [label]="item.nzLabel"
                [compareWith]="compareWith"
                [activatedValue]="activatedValue"
                [listOfSelectedValue]="listOfSelectedValue"
                [value]="item.nzValue"
                (itemHover)="onItemHover($event)"
                (itemClick)="onItemClick($event)"
              ></nz-option-item>
            }
          }
        </ng-template>
      </cdk-virtual-scroll-viewport>
      <ng-template [ngTemplateOutlet]="dropdownRender"></ng-template>
    </div>
  `,
      host: {
        class: "ant-select-dropdown"
      },
      imports: [NzEmptyModule, NzOptionItemGroupComponent, NzOptionItemComponent, NgTemplateOutlet, OverlayModule, NzOverlayModule]
    }]
  }], null, {
    notFoundContent: [{
      type: Input
    }],
    menuItemSelectedIcon: [{
      type: Input
    }],
    dropdownRender: [{
      type: Input
    }],
    activatedValue: [{
      type: Input
    }],
    listOfSelectedValue: [{
      type: Input
    }],
    compareWith: [{
      type: Input
    }],
    mode: [{
      type: Input
    }],
    matchWidth: [{
      type: Input
    }],
    itemSize: [{
      type: Input
    }],
    maxItemLength: [{
      type: Input
    }],
    isMaxMultipleCountReached: [{
      type: Input
    }],
    listOfContainerItem: [{
      type: Input
    }],
    itemClick: [{
      type: Output
    }],
    scrollToBottom: [{
      type: Output
    }],
    cdkVirtualScrollViewport: [{
      type: ViewChild,
      args: [CdkVirtualScrollViewport, {
        static: true
      }]
    }]
  });
})();
var NzOptionComponent = class _NzOptionComponent {
  destroyRef = inject(DestroyRef);
  nzOptionGroupComponent = inject(NzOptionGroupComponent, {
    optional: true
  });
  changes = new Subject();
  groupLabel = null;
  template;
  nzTitle;
  nzLabel = null;
  nzValue = null;
  nzKey;
  nzDisabled = false;
  nzHide = false;
  nzCustomContent = false;
  ngOnInit() {
    this.nzOptionGroupComponent?.changes.pipe(startWith(true), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.groupLabel = this.nzOptionGroupComponent?.nzLabel;
    });
  }
  ngOnChanges() {
    this.changes.next();
  }
  static ɵfac = function NzOptionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOptionComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzOptionComponent,
    selectors: [["nz-option"]],
    viewQuery: function NzOptionComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(TemplateRef, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.template = _t.first);
      }
    },
    inputs: {
      nzTitle: "nzTitle",
      nzLabel: "nzLabel",
      nzValue: "nzValue",
      nzKey: "nzKey",
      nzDisabled: [2, "nzDisabled", "nzDisabled", booleanAttribute],
      nzHide: [2, "nzHide", "nzHide", booleanAttribute],
      nzCustomContent: [2, "nzCustomContent", "nzCustomContent", booleanAttribute]
    },
    exportAs: ["nzOption"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzOptionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomTemplate(0, NzOptionComponent_ng_template_0_Template, 1, 0, "ng-template");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOptionComponent, [{
    type: Component,
    args: [{
      selector: "nz-option",
      exportAs: "nzOption",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `
    }]
  }], null, {
    template: [{
      type: ViewChild,
      args: [TemplateRef, {
        static: true
      }]
    }],
    nzTitle: [{
      type: Input
    }],
    nzLabel: [{
      type: Input
    }],
    nzValue: [{
      type: Input
    }],
    nzKey: [{
      type: Input
    }],
    nzDisabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzHide: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzCustomContent: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzSelectArrowComponent = class _NzSelectArrowComponent {
  listOfValue = [];
  loading = false;
  search = false;
  showArrow = false;
  isMaxMultipleCountSet = false;
  suffixIcon = null;
  feedbackIcon = null;
  nzMaxMultipleCount = Infinity;
  static ɵfac = function NzSelectArrowComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectArrowComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSelectArrowComponent,
    selectors: [["nz-select-arrow"]],
    hostAttrs: [1, "ant-select-arrow"],
    hostVars: 2,
    hostBindings: function NzSelectArrowComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-select-arrow-loading", ctx.loading);
      }
    },
    inputs: {
      listOfValue: "listOfValue",
      loading: "loading",
      search: "search",
      showArrow: "showArrow",
      isMaxMultipleCountSet: "isMaxMultipleCountSet",
      suffixIcon: "suffixIcon",
      feedbackIcon: "feedbackIcon",
      nzMaxMultipleCount: [2, "nzMaxMultipleCount", "nzMaxMultipleCount", numberAttributeWithInfinityFallback]
    },
    decls: 4,
    vars: 3,
    consts: [["nzType", "loading"], [4, "nzStringTemplateOutlet"], ["nzType", "search"], ["nzType", "down"], [3, "nzType"]],
    template: function NzSelectArrowComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzSelectArrowComponent_Conditional_0_Template, 2, 2, "span");
        ɵɵconditionalCreate(1, NzSelectArrowComponent_Conditional_1_Template, 1, 0, "nz-icon", 0)(2, NzSelectArrowComponent_Conditional_2_Template, 2, 1);
        ɵɵtemplate(3, NzSelectArrowComponent_ng_container_3_Template, 2, 1, "ng-container", 1);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.isMaxMultipleCountSet ? 0 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.loading ? 1 : 2);
        ɵɵadvance(2);
        ɵɵproperty("nzStringTemplateOutlet", ctx.feedbackIcon);
      }
    },
    dependencies: [NzIconModule, NzIconDirective, NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectArrowComponent, [{
    type: Component,
    args: [{
      selector: "nz-select-arrow",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @if (isMaxMultipleCountSet) {
      <span>{{ listOfValue.length }} / {{ nzMaxMultipleCount }}</span>
    }
    @if (loading) {
      <nz-icon nzType="loading" />
    } @else {
      @if (showArrow && !suffixIcon) {
        @if (search) {
          <nz-icon nzType="search" />
        } @else {
          <nz-icon nzType="down" />
        }
      } @else {
        <ng-container *nzStringTemplateOutlet="suffixIcon; let suffixIcon">
          @if (suffixIcon) {
            <nz-icon [nzType]="suffixIcon" />
          }
        </ng-container>
      }
    }
    <ng-container *nzStringTemplateOutlet="feedbackIcon">{{ feedbackIcon }}</ng-container>
  `,
      host: {
        class: "ant-select-arrow",
        "[class.ant-select-arrow-loading]": "loading"
      },
      imports: [NzIconModule, NzOutletModule]
    }]
  }], null, {
    listOfValue: [{
      type: Input
    }],
    loading: [{
      type: Input
    }],
    search: [{
      type: Input
    }],
    showArrow: [{
      type: Input
    }],
    isMaxMultipleCountSet: [{
      type: Input
    }],
    suffixIcon: [{
      type: Input
    }],
    feedbackIcon: [{
      type: Input
    }],
    nzMaxMultipleCount: [{
      type: Input,
      args: [{
        transform: numberAttributeWithInfinityFallback
      }]
    }]
  });
})();
var NzSelectClearComponent = class _NzSelectClearComponent {
  clearIcon = null;
  clear = new EventEmitter();
  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.clear.emit(e);
  }
  static ɵfac = function NzSelectClearComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectClearComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSelectClearComponent,
    selectors: [["nz-select-clear"]],
    hostAttrs: [1, "ant-select-clear"],
    hostBindings: function NzSelectClearComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function NzSelectClearComponent_click_HostBindingHandler($event) {
          return ctx.onClick($event);
        });
      }
    },
    inputs: {
      clearIcon: "clearIcon"
    },
    outputs: {
      clear: "clear"
    },
    decls: 2,
    vars: 1,
    consts: [[3, "ngTemplateOutlet"], ["nzType", "close-circle", "nzTheme", "fill", 1, "ant-select-close-icon"]],
    template: function NzSelectClearComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzSelectClearComponent_Conditional_0_Template, 1, 1, null, 0)(1, NzSelectClearComponent_Conditional_1_Template, 1, 0, "nz-icon", 1);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.clearIcon ? 0 : 1);
      }
    },
    dependencies: [NgTemplateOutlet, NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectClearComponent, [{
    type: Component,
    args: [{
      selector: "nz-select-clear",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @if (clearIcon) {
      <ng-template [ngTemplateOutlet]="clearIcon"></ng-template>
    } @else {
      <nz-icon nzType="close-circle" nzTheme="fill" class="ant-select-close-icon" />
    }
  `,
      host: {
        class: "ant-select-clear",
        "(click)": "onClick($event)"
      },
      imports: [NgTemplateOutlet, NzIconModule]
    }]
  }], null, {
    clearIcon: [{
      type: Input
    }],
    clear: [{
      type: Output
    }]
  });
})();
var NzSelectItemComponent = class _NzSelectItemComponent {
  disabled = false;
  label = null;
  /**
   * @internal Internally used, please do not use it directly.
   * @description Whether the label is in HTML format.
   */
  displayLabelInHtml = false;
  deletable = false;
  removeIcon = null;
  contentTemplateOutletContext = null;
  contentTemplateOutlet = null;
  delete = new EventEmitter();
  get templateOutletContext() {
    return __spreadValues({
      $implicit: this.contentTemplateOutletContext
    }, this.contentTemplateOutletContext);
  }
  onDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.disabled) {
      this.delete.next(e);
    }
  }
  static ɵfac = function NzSelectItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectItemComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSelectItemComponent,
    selectors: [["nz-select-item"]],
    hostAttrs: [1, "ant-select-selection-item"],
    hostVars: 3,
    hostBindings: function NzSelectItemComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("title", ctx.label);
        ɵɵclassProp("ant-select-selection-item-disabled", ctx.disabled);
      }
    },
    inputs: {
      disabled: [2, "disabled", "disabled", booleanAttribute],
      label: "label",
      displayLabelInHtml: [2, "displayLabelInHtml", "displayLabelInHtml", booleanAttribute],
      deletable: [2, "deletable", "deletable", booleanAttribute],
      removeIcon: "removeIcon",
      contentTemplateOutletContext: "contentTemplateOutletContext",
      contentTemplateOutlet: "contentTemplateOutlet"
    },
    outputs: {
      delete: "delete"
    },
    decls: 2,
    vars: 3,
    consts: [[4, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"], [1, "ant-select-selection-item-remove"], [3, "ant-select-selection-item-content", "innerHTML"], [3, "ant-select-selection-item-content"], [3, "innerHTML"], [1, "ant-select-selection-item-remove", 3, "click"], ["nzType", "close"], [3, "ngTemplateOutlet"]],
    template: function NzSelectItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, NzSelectItemComponent_ng_container_0_Template, 3, 1, "ng-container", 0);
        ɵɵconditionalCreate(1, NzSelectItemComponent_Conditional_1_Template, 3, 1, "span", 1);
      }
      if (rf & 2) {
        ɵɵproperty("nzStringTemplateOutlet", ctx.contentTemplateOutlet)("nzStringTemplateOutletContext", ctx.templateOutletContext);
        ɵɵadvance();
        ɵɵconditional(ctx.deletable && !ctx.disabled ? 1 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, NzOutletModule, NzStringTemplateOutletDirective, NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectItemComponent, [{
    type: Component,
    args: [{
      selector: "nz-select-item",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <ng-container *nzStringTemplateOutlet="contentTemplateOutlet; context: templateOutletContext">
      @if (displayLabelInHtml) {
        <span [class.ant-select-selection-item-content]="deletable" [innerHTML]="label"></span>
      } @else {
        <span [class.ant-select-selection-item-content]="deletable">{{ label }}</span>
      }
    </ng-container>
    @if (deletable && !disabled) {
      <span class="ant-select-selection-item-remove" (click)="onDelete($event)">
        @if (!removeIcon) {
          <nz-icon nzType="close" />
        } @else {
          <ng-template [ngTemplateOutlet]="removeIcon"></ng-template>
        }
      </span>
    }
  `,
      host: {
        class: "ant-select-selection-item",
        "[attr.title]": "label",
        "[class.ant-select-selection-item-disabled]": "disabled"
      },
      imports: [NgTemplateOutlet, NzOutletModule, NzIconModule]
    }]
  }], null, {
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    label: [{
      type: Input
    }],
    displayLabelInHtml: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    deletable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    removeIcon: [{
      type: Input
    }],
    contentTemplateOutletContext: [{
      type: Input
    }],
    contentTemplateOutlet: [{
      type: Input
    }],
    delete: [{
      type: Output
    }]
  });
})();
var NzSelectPlaceholderComponent = class _NzSelectPlaceholderComponent {
  placeholder = null;
  static ɵfac = function NzSelectPlaceholderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectPlaceholderComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSelectPlaceholderComponent,
    selectors: [["nz-select-placeholder"]],
    hostAttrs: [1, "ant-select-selection-placeholder"],
    inputs: {
      placeholder: "placeholder"
    },
    decls: 1,
    vars: 1,
    consts: [[4, "nzStringTemplateOutlet"]],
    template: function NzSelectPlaceholderComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, NzSelectPlaceholderComponent_ng_container_0_Template, 2, 1, "ng-container", 0);
      }
      if (rf & 2) {
        ɵɵproperty("nzStringTemplateOutlet", ctx.placeholder);
      }
    },
    dependencies: [NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectPlaceholderComponent, [{
    type: Component,
    args: [{
      selector: "nz-select-placeholder",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <ng-container *nzStringTemplateOutlet="placeholder">
      {{ placeholder }}
    </ng-container>
  `,
      host: {
        class: "ant-select-selection-placeholder"
      },
      imports: [NzOutletModule]
    }]
  }], null, {
    placeholder: [{
      type: Input
    }]
  });
})();
var NzSelectSearchComponent = class _NzSelectSearchComponent {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  focusMonitor = inject(FocusMonitor);
  nzId = null;
  disabled = false;
  mirrorSync = false;
  showInput = true;
  focusTrigger = false;
  value = "";
  autofocus = false;
  valueChange = new EventEmitter();
  isComposingChange = new EventEmitter();
  inputElement;
  mirrorElement;
  setCompositionState(isComposing) {
    this.isComposingChange.next(isComposing);
  }
  onValueChange(value) {
    this.value = value;
    this.valueChange.next(value);
    if (this.mirrorSync) {
      this.syncMirrorWidth();
    }
  }
  clearInputValue() {
    const inputDOM = this.inputElement.nativeElement;
    inputDOM.value = "";
    this.onValueChange("");
  }
  syncMirrorWidth() {
    requestAnimationFrame(() => {
      const mirrorDOM = this.mirrorElement.nativeElement;
      const hostDOM = this.elementRef.nativeElement;
      const inputDOM = this.inputElement.nativeElement;
      this.renderer.removeStyle(hostDOM, "width");
      this.renderer.setProperty(mirrorDOM, "textContent", `${inputDOM.value} `);
      this.renderer.setStyle(hostDOM, "width", `${mirrorDOM.scrollWidth}px`);
    });
  }
  focus() {
    this.focusMonitor.focusVia(this.inputElement, "keyboard");
  }
  blur() {
    this.inputElement.nativeElement.blur();
  }
  ngOnChanges(changes) {
    const inputDOM = this.inputElement.nativeElement;
    const {
      focusTrigger,
      showInput
    } = changes;
    if (showInput) {
      if (this.showInput) {
        this.renderer.removeAttribute(inputDOM, "readonly");
      } else {
        this.renderer.setAttribute(inputDOM, "readonly", "readonly");
      }
    }
    if (focusTrigger && focusTrigger.currentValue === true && focusTrigger.previousValue === false) {
      inputDOM.focus();
    }
  }
  ngAfterViewInit() {
    if (this.mirrorSync) {
      this.syncMirrorWidth();
    }
    if (this.autofocus) {
      this.focus();
    }
  }
  static ɵfac = function NzSelectSearchComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectSearchComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSelectSearchComponent,
    selectors: [["nz-select-search"]],
    viewQuery: function NzSelectSearchComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 7);
        ɵɵviewQuery(_c2, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.inputElement = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.mirrorElement = _t.first);
      }
    },
    hostAttrs: [1, "ant-select-selection-search"],
    inputs: {
      nzId: "nzId",
      disabled: "disabled",
      mirrorSync: "mirrorSync",
      showInput: "showInput",
      focusTrigger: "focusTrigger",
      value: "value",
      autofocus: "autofocus"
    },
    outputs: {
      valueChange: "valueChange",
      isComposingChange: "isComposingChange"
    },
    features: [ɵɵProvidersFeature([{
      provide: COMPOSITION_BUFFER_MODE,
      useValue: false
    }]), ɵɵNgOnChangesFeature],
    decls: 3,
    vars: 7,
    consts: [["inputElement", ""], ["mirrorElement", ""], ["autocomplete", "off", 1, "ant-select-selection-search-input", 3, "ngModelChange", "compositionstart", "compositionend", "ngModel", "disabled"], [1, "ant-select-selection-search-mirror"]],
    template: function NzSelectSearchComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "input", 2, 0);
        ɵɵlistener("ngModelChange", function NzSelectSearchComponent_Template_input_ngModelChange_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onValueChange($event));
        })("compositionstart", function NzSelectSearchComponent_Template_input_compositionstart_0_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.setCompositionState(true));
        })("compositionend", function NzSelectSearchComponent_Template_input_compositionend_0_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.setCompositionState(false));
        });
        ɵɵelementEnd();
        ɵɵconditionalCreate(2, NzSelectSearchComponent_Conditional_2_Template, 2, 0, "span", 3);
      }
      if (rf & 2) {
        ɵɵstyleProp("opacity", ctx.showInput ? null : 0);
        ɵɵproperty("ngModel", ctx.value)("disabled", ctx.disabled);
        ɵɵattribute("id", ctx.nzId)("autofocus", ctx.autofocus ? "autofocus" : null);
        ɵɵadvance(2);
        ɵɵconditional(ctx.mirrorSync ? 2 : -1);
      }
    },
    dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectSearchComponent, [{
    type: Component,
    args: [{
      selector: "nz-select-search",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <input
      #inputElement
      [attr.id]="nzId"
      autocomplete="off"
      class="ant-select-selection-search-input"
      [ngModel]="value"
      [attr.autofocus]="autofocus ? 'autofocus' : null"
      [disabled]="disabled"
      [style.opacity]="showInput ? null : 0"
      (ngModelChange)="onValueChange($event)"
      (compositionstart)="setCompositionState(true)"
      (compositionend)="setCompositionState(false)"
    />
    @if (mirrorSync) {
      <span #mirrorElement class="ant-select-selection-search-mirror"></span>
    }
  `,
      host: {
        class: "ant-select-selection-search"
      },
      providers: [{
        provide: COMPOSITION_BUFFER_MODE,
        useValue: false
      }],
      imports: [FormsModule]
    }]
  }], null, {
    nzId: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    mirrorSync: [{
      type: Input
    }],
    showInput: [{
      type: Input
    }],
    focusTrigger: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    autofocus: [{
      type: Input
    }],
    valueChange: [{
      type: Output
    }],
    isComposingChange: [{
      type: Output
    }],
    inputElement: [{
      type: ViewChild,
      args: ["inputElement", {
        static: true
      }]
    }],
    mirrorElement: [{
      type: ViewChild,
      args: ["mirrorElement", {
        static: false
      }]
    }]
  });
})();
var NzSelectTopControlComponent = class _NzSelectTopControlComponent {
  destroyRef = inject(DestroyRef);
  elementRef = inject(ElementRef);
  ngZone = inject(NgZone);
  noAnimation = inject(NzNoAnimationDirective, {
    host: true,
    optional: true
  });
  nzId = null;
  showSearch = false;
  placeHolder = null;
  open = false;
  maxTagCount = Infinity;
  autofocus = false;
  disabled = false;
  mode = "default";
  customTemplate = null;
  maxTagPlaceholder = null;
  removeIcon = null;
  listOfTopItem = [];
  tokenSeparators = [];
  tokenize = new EventEmitter();
  inputValueChange = new EventEmitter();
  deleteItem = new EventEmitter();
  nzSelectSearchComponent;
  listOfSlicedItem = [];
  isShowPlaceholder = true;
  isShowSingleLabel = false;
  isComposing = false;
  inputValue = null;
  updateTemplateVariable() {
    const isSelectedValueEmpty = this.listOfTopItem.length === 0;
    this.isShowPlaceholder = isSelectedValueEmpty && !this.isComposing && !this.inputValue;
    this.isShowSingleLabel = !isSelectedValueEmpty && !this.isComposing && !this.inputValue;
  }
  isComposingChange(isComposing) {
    this.isComposing = isComposing;
    this.updateTemplateVariable();
  }
  onInputValueChange(value) {
    if (value !== this.inputValue) {
      this.inputValue = value;
      this.updateTemplateVariable();
      this.inputValueChange.emit(value);
      this.tokenSeparate(value, this.tokenSeparators);
    }
  }
  tokenSeparate(inputValue, tokenSeparators) {
    const includesSeparators = (str, separators) => {
      for (let i = 0; i < separators.length; ++i) {
        if (str.lastIndexOf(separators[i]) > 0) {
          return true;
        }
      }
      return false;
    };
    const splitBySeparators = (str, separators) => {
      const reg = new RegExp(`[${separators.join()}]`);
      const array = str.split(reg).filter((token) => token);
      return [...new Set(array)];
    };
    if (inputValue && inputValue.length && tokenSeparators.length && this.mode !== "default" && includesSeparators(inputValue, tokenSeparators)) {
      const listOfLabel = splitBySeparators(inputValue, tokenSeparators);
      this.tokenize.next(listOfLabel);
    }
  }
  clearInputValue() {
    if (this.nzSelectSearchComponent) {
      this.nzSelectSearchComponent.clearInputValue();
    }
  }
  focus() {
    if (this.nzSelectSearchComponent) {
      this.nzSelectSearchComponent.focus();
    }
  }
  blur() {
    if (this.nzSelectSearchComponent) {
      this.nzSelectSearchComponent.blur();
    }
  }
  onDeleteItem(item) {
    if (!this.disabled && !item.nzDisabled) {
      this.deleteItem.next(item);
    }
  }
  ngOnChanges(changes) {
    const {
      listOfTopItem,
      maxTagCount,
      customTemplate,
      maxTagPlaceholder
    } = changes;
    if (listOfTopItem) {
      this.updateTemplateVariable();
    }
    if (listOfTopItem || maxTagCount || customTemplate || maxTagPlaceholder) {
      const listOfSlicedItem = this.listOfTopItem.slice(0, this.maxTagCount).map((o) => ({
        nzLabel: o.nzLabel,
        nzValue: o.nzValue,
        nzDisabled: o.nzDisabled,
        contentTemplateOutlet: this.customTemplate,
        contentTemplateOutletContext: o
      }));
      if (this.listOfTopItem.length > this.maxTagCount) {
        const exceededLabel = `+ ${this.listOfTopItem.length - this.maxTagCount} ...`;
        const listOfSelectedValue = this.listOfTopItem.map((item) => item.nzValue);
        const exceededItem = {
          nzLabel: exceededLabel,
          nzValue: "$$__nz_exceeded_item",
          nzDisabled: true,
          contentTemplateOutlet: this.maxTagPlaceholder,
          contentTemplateOutletContext: listOfSelectedValue.slice(this.maxTagCount)
        };
        listOfSlicedItem.push(exceededItem);
      }
      this.listOfSlicedItem = listOfSlicedItem;
    }
  }
  ngOnInit() {
    fromEventOutsideAngular(this.elementRef.nativeElement, "click").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event.target !== this.nzSelectSearchComponent.inputElement.nativeElement) {
        this.nzSelectSearchComponent.focus();
      }
    });
    fromEventOutsideAngular(this.elementRef.nativeElement, "keydown").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event.target instanceof HTMLInputElement) {
        const inputValue = event.target.value;
        if (event.keyCode === BACKSPACE && this.mode !== "default" && !inputValue && this.listOfTopItem.length > 0) {
          event.preventDefault();
          this.ngZone.run(() => this.onDeleteItem(this.listOfTopItem[this.listOfTopItem.length - 1]));
        }
      }
    });
  }
  static ɵfac = function NzSelectTopControlComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectTopControlComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSelectTopControlComponent,
    selectors: [["nz-select-top-control"]],
    viewQuery: function NzSelectTopControlComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(NzSelectSearchComponent, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzSelectSearchComponent = _t.first);
      }
    },
    hostAttrs: [1, "ant-select-selector"],
    inputs: {
      nzId: "nzId",
      showSearch: "showSearch",
      placeHolder: "placeHolder",
      open: "open",
      maxTagCount: [2, "maxTagCount", "maxTagCount", numberAttribute],
      autofocus: "autofocus",
      disabled: "disabled",
      mode: "mode",
      customTemplate: "customTemplate",
      maxTagPlaceholder: "maxTagPlaceholder",
      removeIcon: "removeIcon",
      listOfTopItem: "listOfTopItem",
      tokenSeparators: "tokenSeparators"
    },
    outputs: {
      tokenize: "tokenize",
      inputValueChange: "inputValueChange",
      deleteItem: "deleteItem"
    },
    exportAs: ["nzSelectTopControl"],
    features: [ɵɵNgOnChangesFeature],
    decls: 3,
    vars: 2,
    consts: [[3, "placeholder"], [3, "isComposingChange", "valueChange", "nzId", "disabled", "value", "showInput", "mirrorSync", "autofocus", "focusTrigger"], [3, "removeIcon", "label", "contentTemplateOutlet", "contentTemplateOutletContext"], ["deletable", "", 3, "removeIcon", "label", "disabled", "contentTemplateOutlet", "contentTemplateOutletContext"], [3, "isComposingChange", "valueChange", "nzId", "disabled", "value", "autofocus", "showInput", "mirrorSync", "focusTrigger"], ["deletable", "", 3, "delete", "removeIcon", "label", "disabled", "contentTemplateOutlet", "contentTemplateOutletContext"]],
    template: function NzSelectTopControlComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzSelectTopControlComponent_Case_0_Template, 2, 8)(1, NzSelectTopControlComponent_Case_1_Template, 3, 7);
        ɵɵconditionalCreate(2, NzSelectTopControlComponent_Conditional_2_Template, 1, 1, "nz-select-placeholder", 0);
      }
      if (rf & 2) {
        let tmp_0_0;
        ɵɵconditional((tmp_0_0 = ctx.mode) === "default" ? 0 : 1);
        ɵɵadvance(2);
        ɵɵconditional(ctx.isShowPlaceholder ? 2 : -1);
      }
    },
    dependencies: [NzSelectSearchComponent, NzSelectItemComponent, NzSelectPlaceholderComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectTopControlComponent, [{
    type: Component,
    args: [{
      selector: "nz-select-top-control",
      exportAs: "nzSelectTopControl",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
    <!--single mode-->
    @switch (mode) {
      @case ('default') {
        <nz-select-search
          [nzId]="nzId"
          [disabled]="disabled"
          [value]="inputValue!"
          [showInput]="showSearch"
          [mirrorSync]="false"
          [autofocus]="autofocus"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></nz-select-search>
        @if (isShowSingleLabel) {
          <nz-select-item
            [removeIcon]="removeIcon"
            [label]="listOfTopItem[0].nzLabel"
            [contentTemplateOutlet]="customTemplate"
            [contentTemplateOutletContext]="listOfTopItem[0]"
          ></nz-select-item>
        }
      }
      @default {
        <!--multiple or tags mode-->
        @for (item of listOfSlicedItem; track item.nzValue) {
          <nz-select-item
            [removeIcon]="removeIcon"
            [label]="item.nzLabel"
            [disabled]="item.nzDisabled || disabled"
            [contentTemplateOutlet]="item.contentTemplateOutlet"
            deletable
            [contentTemplateOutletContext]="item.contentTemplateOutletContext"
            (delete)="onDeleteItem(item.contentTemplateOutletContext)"
          ></nz-select-item>
        }
        <nz-select-search
          [nzId]="nzId"
          [disabled]="disabled"
          [value]="inputValue!"
          [autofocus]="autofocus"
          [showInput]="true"
          [mirrorSync]="true"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></nz-select-search>
      }
    }
    @if (isShowPlaceholder) {
      <nz-select-placeholder [placeholder]="placeHolder"></nz-select-placeholder>
    }
  `,
      host: {
        class: "ant-select-selector"
      },
      imports: [NzSelectSearchComponent, NzSelectItemComponent, NzSelectPlaceholderComponent]
    }]
  }], null, {
    nzId: [{
      type: Input
    }],
    showSearch: [{
      type: Input
    }],
    placeHolder: [{
      type: Input
    }],
    open: [{
      type: Input
    }],
    maxTagCount: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    autofocus: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    mode: [{
      type: Input
    }],
    customTemplate: [{
      type: Input
    }],
    maxTagPlaceholder: [{
      type: Input
    }],
    removeIcon: [{
      type: Input
    }],
    listOfTopItem: [{
      type: Input
    }],
    tokenSeparators: [{
      type: Input
    }],
    tokenize: [{
      type: Output
    }],
    inputValueChange: [{
      type: Output
    }],
    deleteItem: [{
      type: Output
    }],
    nzSelectSearchComponent: [{
      type: ViewChild,
      args: [NzSelectSearchComponent]
    }]
  });
})();
var defaultFilterOption = (searchValue, item) => {
  if (item && item.nzLabel) {
    return item.nzLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
};
var NZ_CONFIG_MODULE_NAME = "select";
var NzSelectComponent = (() => {
  var _a;
  let _nzVariant_decorators;
  let _nzVariant_initializers = [];
  let _nzVariant_extraInitializers = [];
  let _nzOptionHeightPx_decorators;
  let _nzOptionHeightPx_initializers = [];
  let _nzOptionHeightPx_extraInitializers = [];
  let _nzSuffixIcon_decorators;
  let _nzSuffixIcon_initializers = [];
  let _nzSuffixIcon_extraInitializers = [];
  let _nzBorderless_decorators;
  let _nzBorderless_initializers = [];
  let _nzBorderless_extraInitializers = [];
  let _nzBackdrop_decorators;
  let _nzBackdrop_initializers = [];
  let _nzBackdrop_extraInitializers = [];
  return _a = class {
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    ngZone = inject(NgZone);
    cdr = inject(ChangeDetectorRef);
    host = inject(ElementRef);
    renderer = inject(Renderer2);
    platform = inject(Platform);
    focusMonitor = inject(FocusMonitor);
    directionality = inject(Directionality);
    destroyRef = inject(DestroyRef);
    nzId = null;
    nzSize = "default";
    nzStatus = "";
    nzVariant = __runInitializers(this, _nzVariant_initializers, "outlined");
    nzOptionHeightPx = (__runInitializers(this, _nzVariant_extraInitializers), __runInitializers(this, _nzOptionHeightPx_initializers, 32));
    nzOptionOverflowSize = (__runInitializers(this, _nzOptionHeightPx_extraInitializers), 8);
    nzDropdownClassName = null;
    nzDropdownMatchSelectWidth = true;
    nzDropdownStyle = null;
    nzNotFoundContent = void 0;
    nzPlaceHolder = null;
    nzPlacement = null;
    nzMaxTagCount = Infinity;
    nzDropdownRender = null;
    nzCustomTemplate = null;
    nzSuffixIcon = __runInitializers(this, _nzSuffixIcon_initializers, null);
    nzClearIcon = (__runInitializers(this, _nzSuffixIcon_extraInitializers), null);
    nzRemoveIcon = null;
    nzMenuItemSelectedIcon = null;
    nzTokenSeparators = [];
    nzMaxTagPlaceholder = null;
    nzMaxMultipleCount = Infinity;
    nzMode = "default";
    nzFilterOption = defaultFilterOption;
    compareWith = (o1, o2) => o1 === o2;
    nzAllowClear = false;
    /**
     * @deprecated Will be removed in v21. It is recommended to use `nzVariant` instead.
     */
    nzBorderless = __runInitializers(this, _nzBorderless_initializers, false);
    nzShowSearch = (__runInitializers(this, _nzBorderless_extraInitializers), false);
    nzLoading = false;
    nzAutoFocus = false;
    nzAutoClearSearchValue = true;
    nzServerSearch = false;
    nzDisabled = false;
    nzOpen = false;
    nzSelectOnTab = false;
    nzBackdrop = __runInitializers(this, _nzBackdrop_initializers, false);
    nzOptions = (__runInitializers(this, _nzBackdrop_extraInitializers), []);
    set nzShowArrow(value) {
      this._nzShowArrow = value;
    }
    get nzShowArrow() {
      return this._nzShowArrow === void 0 ? this.nzMode === "default" : this._nzShowArrow;
    }
    get isMultiple() {
      return this.nzMode === "multiple" || this.nzMode === "tags";
    }
    get isMaxMultipleCountSet() {
      return this.isMultiple && this.nzMaxMultipleCount !== Infinity;
    }
    get isMaxMultipleCountReached() {
      return this.nzMaxMultipleCount !== Infinity && this.listOfValue.length === this.nzMaxMultipleCount;
    }
    nzOnSearch = new EventEmitter();
    nzScrollToBottom = new EventEmitter();
    nzOpenChange = new EventEmitter();
    nzBlur = new EventEmitter();
    nzFocus = new EventEmitter();
    nzOnClear = output();
    originElement;
    cdkConnectedOverlay;
    nzSelectTopControlComponent;
    listOfNzOptionComponent;
    listOfNzOptionGroupComponent;
    nzOptionGroupComponentElement;
    nzSelectTopControlComponentElement;
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
    listOfValue$ = new BehaviorSubject([]);
    listOfTemplateItem$ = new BehaviorSubject([]);
    listOfTagAndTemplateItem = [];
    searchValue = "";
    isReactiveDriven = false;
    value;
    _nzShowArrow;
    requestId = -1;
    isNzDisableFirstChange = true;
    onChange = () => {
    };
    onTouched = () => {
    };
    dropdownPosition = "bottomLeft";
    triggerWidth = null;
    listOfContainerItem = [];
    listOfTopItem = [];
    activatedValue = null;
    listOfValue = [];
    focused = false;
    dir = "ltr";
    positions = [];
    // status
    prefixCls = "ant-select";
    statusCls = {};
    status = "";
    hasFeedback = false;
    generateTagItem(value) {
      return {
        nzValue: value,
        nzLabel: value,
        type: "item"
      };
    }
    onItemClick(value) {
      this.activatedValue = value;
      if (this.nzMode === "default") {
        if (this.listOfValue.length === 0 || !this.compareWith(this.listOfValue[0], value)) {
          this.updateListOfValue([value]);
        }
        this.setOpenState(false);
      } else {
        const targetIndex = this.listOfValue.findIndex((o) => this.compareWith(o, value));
        if (targetIndex !== -1) {
          const listOfValueAfterRemoved = this.listOfValue.filter((_, i) => i !== targetIndex);
          this.updateListOfValue(listOfValueAfterRemoved);
        } else if (this.listOfValue.length < this.nzMaxMultipleCount) {
          const listOfValueAfterAdded = [...this.listOfValue, value];
          this.updateListOfValue(listOfValueAfterAdded);
        }
        this.focus();
        if (this.nzAutoClearSearchValue) {
          this.clearInput();
        }
      }
    }
    onItemDelete(item) {
      const listOfSelectedValue = this.listOfValue.filter((v) => !this.compareWith(v, item.nzValue));
      this.updateListOfValue(listOfSelectedValue);
      this.clearInput();
    }
    updateListOfContainerItem() {
      let listOfContainerItem = this.listOfTagAndTemplateItem.filter((item) => !item.nzHide).filter((item) => {
        if (!this.nzServerSearch && this.searchValue) {
          return this.nzFilterOption(this.searchValue, item);
        } else {
          return true;
        }
      });
      if (this.nzMode === "tags" && this.searchValue) {
        const matchedItem = this.listOfTagAndTemplateItem.find((item) => item.nzLabel === this.searchValue);
        if (!matchedItem) {
          const tagItem = this.generateTagItem(this.searchValue);
          listOfContainerItem = [tagItem, ...listOfContainerItem];
          this.activatedValue = tagItem.nzValue;
        } else {
          this.activatedValue = matchedItem.nzValue;
        }
      }
      const activatedItem = listOfContainerItem.find((item) => item.nzLabel === this.searchValue) || listOfContainerItem.find((item) => this.compareWith(item.nzValue, this.activatedValue)) || listOfContainerItem.find((item) => this.compareWith(item.nzValue, this.listOfValue[0])) || listOfContainerItem[0];
      this.activatedValue = activatedItem && activatedItem.nzValue || null;
      let listOfGroupLabel = [];
      if (this.isReactiveDriven) {
        listOfGroupLabel = [...new Set(this.nzOptions.filter((o) => o.groupLabel).map((o) => o.groupLabel))];
      } else {
        if (this.listOfNzOptionGroupComponent) {
          listOfGroupLabel = this.listOfNzOptionGroupComponent.map((o) => o.nzLabel);
        }
      }
      listOfGroupLabel.forEach((label) => {
        const index = listOfContainerItem.findIndex((item) => label === item.groupLabel);
        if (index > -1) {
          const groupItem = {
            groupLabel: label,
            type: "group",
            key: label
          };
          listOfContainerItem.splice(index, 0, groupItem);
        }
      });
      this.listOfContainerItem = [...listOfContainerItem];
      this.updateCdkConnectedOverlayPositions();
    }
    clearInput() {
      this.nzSelectTopControlComponent.clearInputValue();
    }
    updateListOfValue(listOfValue) {
      const covertListToModel = (list, mode) => {
        if (mode === "default") {
          if (list.length > 0) {
            return list[0];
          } else {
            return null;
          }
        } else {
          return list;
        }
      };
      const model = covertListToModel(listOfValue, this.nzMode);
      if (this.value !== model) {
        this.listOfValue = listOfValue;
        this.listOfValue$.next(listOfValue);
        this.value = model;
        this.onChange(this.value);
      }
    }
    onTokenSeparate(listOfLabel) {
      const listOfMatchedValue = this.listOfTagAndTemplateItem.filter((item) => listOfLabel.findIndex((label) => label === item.nzLabel) !== -1).map((item) => item.nzValue).filter((item) => this.listOfValue.findIndex((v) => this.compareWith(v, item)) === -1);
      const limitWithinMaxCount = (value) => this.isMaxMultipleCountSet ? value.slice(0, this.nzMaxMultipleCount) : value;
      if (this.nzMode === "multiple") {
        const updateValue = limitWithinMaxCount([...this.listOfValue, ...listOfMatchedValue]);
        this.updateListOfValue(updateValue);
      } else if (this.nzMode === "tags") {
        const listOfUnMatchedLabel = listOfLabel.filter((label) => this.listOfTagAndTemplateItem.findIndex((item) => item.nzLabel === label) === -1);
        const updateValue = limitWithinMaxCount([...this.listOfValue, ...listOfMatchedValue, ...listOfUnMatchedLabel]);
        this.updateListOfValue(updateValue);
      }
      this.clearInput();
    }
    onKeyDown(e) {
      if (this.nzDisabled) {
        return;
      }
      const listOfFilteredOptionNotDisabled = this.listOfContainerItem.filter((item) => item.type === "item").filter((item) => !item.nzDisabled);
      const activatedIndex = listOfFilteredOptionNotDisabled.findIndex((item) => this.compareWith(item.nzValue, this.activatedValue));
      switch (e.keyCode) {
        case UP_ARROW:
          e.preventDefault();
          if (this.nzOpen && listOfFilteredOptionNotDisabled.length > 0) {
            const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionNotDisabled.length - 1;
            this.activatedValue = listOfFilteredOptionNotDisabled[preIndex].nzValue;
          }
          break;
        case DOWN_ARROW:
          e.preventDefault();
          if (this.nzOpen && listOfFilteredOptionNotDisabled.length > 0) {
            const nextIndex = activatedIndex < listOfFilteredOptionNotDisabled.length - 1 ? activatedIndex + 1 : 0;
            this.activatedValue = listOfFilteredOptionNotDisabled[nextIndex].nzValue;
          } else {
            this.setOpenState(true);
          }
          break;
        case ENTER:
          e.preventDefault();
          if (this.nzOpen) {
            if (isNotNil(this.activatedValue) && activatedIndex !== -1) {
              this.onItemClick(this.activatedValue);
            }
          } else {
            this.setOpenState(true);
          }
          break;
        case SPACE:
          if (!this.nzOpen) {
            this.setOpenState(true);
            e.preventDefault();
          }
          break;
        case TAB:
          if (this.nzSelectOnTab) {
            if (this.nzOpen) {
              e.preventDefault();
              if (isNotNil(this.activatedValue)) {
                this.onItemClick(this.activatedValue);
              }
            }
          } else {
            this.setOpenState(false);
          }
          break;
        case ESCAPE:
          break;
        default:
          if (!this.nzOpen) {
            this.setOpenState(true);
          }
      }
    }
    setOpenState(value) {
      if (this.nzOpen !== value) {
        this.nzOpen = value;
        this.nzOpenChange.emit(value);
        this.onOpenChange();
        this.cdr.markForCheck();
      }
    }
    onOpenChange() {
      this.updateCdkConnectedOverlayStatus();
      if (this.nzAutoClearSearchValue) {
        this.clearInput();
      }
    }
    onInputValueChange(value) {
      this.searchValue = value;
      this.updateListOfContainerItem();
      this.nzOnSearch.emit(value);
      this.updateCdkConnectedOverlayPositions();
    }
    onClearSelection() {
      this.updateListOfValue([]);
      this.nzOnClear.emit();
    }
    onClickOutside(event) {
      const target = _getEventTarget(event);
      if (!this.host.nativeElement.contains(target)) {
        this.setOpenState(false);
      }
    }
    focus() {
      this.nzSelectTopControlComponent.focus();
    }
    blur() {
      this.nzSelectTopControlComponent.blur();
    }
    onPositionChange(position) {
      const placement = getPlacementName(position);
      this.dropdownPosition = placement;
    }
    updateCdkConnectedOverlayStatus() {
      if (this.platform.isBrowser && this.originElement.nativeElement) {
        const triggerWidth = this.triggerWidth;
        cancelAnimationFrame(this.requestId);
        this.requestId = requestAnimationFrame(() => {
          this.triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
          if (triggerWidth !== this.triggerWidth) {
            this.cdr.detectChanges();
          }
        });
      }
    }
    updateCdkConnectedOverlayPositions() {
      requestAnimationFrame(() => {
        this.cdkConnectedOverlay?.overlayRef?.updatePosition();
      });
    }
    noAnimation = inject(NzNoAnimationDirective, {
      host: true,
      optional: true
    });
    nzFormStatusService = inject(NzFormStatusService, {
      optional: true
    });
    nzFormNoStatusService = inject(NzFormNoStatusService, {
      optional: true
    });
    constructor() {
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.requestId);
        this.focusMonitor.stopMonitoring(this.host);
      });
      onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => {
        this.size.set(this.nzSize);
        this.cdr.markForCheck();
      });
    }
    writeValue(modelValue) {
      if (this.value !== modelValue) {
        this.value = modelValue;
        const covertModelToList = (model, mode) => {
          if (model === null || model === void 0) {
            return [];
          } else if (mode === "default") {
            return [model];
          } else {
            return model;
          }
        };
        const listOfValue = covertModelToList(modelValue, this.nzMode);
        this.listOfValue = listOfValue;
        this.listOfValue$.next(listOfValue);
        this.cdr.markForCheck();
      }
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
      if (this.nzDisabled) {
        this.setOpenState(false);
      }
      this.cdr.markForCheck();
    }
    ngOnChanges({
      nzOpen,
      nzDisabled,
      nzOptions,
      nzStatus,
      nzPlacement,
      nzSize
    }) {
      if (nzOpen) {
        this.onOpenChange();
      }
      if (nzDisabled && this.nzDisabled) {
        this.setOpenState(false);
      }
      if (nzOptions) {
        this.isReactiveDriven = true;
        const listOfOptions = this.nzOptions || [];
        const listOfTransformedItem = listOfOptions.map((item) => {
          return {
            template: item.label instanceof TemplateRef ? item.label : null,
            nzTitle: this.getTitle(item.title, item.label),
            nzLabel: typeof item.label === "string" || typeof item.label === "number" ? item.label : null,
            nzValue: item.value,
            nzDisabled: item.disabled || false,
            nzHide: item.hide || false,
            nzCustomContent: item.label instanceof TemplateRef,
            groupLabel: item.groupLabel || null,
            type: "item",
            key: item.key === void 0 ? item.value : item.key
          };
        });
        this.listOfTemplateItem$.next(listOfTransformedItem);
      }
      if (nzStatus) {
        this.setStatusStyles(this.nzStatus, this.hasFeedback);
      }
      if (nzPlacement) {
        const {
          currentValue
        } = nzPlacement;
        this.dropdownPosition = currentValue;
        const listOfPlacement = ["bottomLeft", "topLeft", "bottomRight", "topRight"];
        if (currentValue && listOfPlacement.includes(currentValue)) {
          this.positions = [POSITION_MAP[currentValue]];
        } else {
          this.positions = listOfPlacement.map((e) => POSITION_MAP[e]);
        }
      }
      if (nzSize) {
        this.size.set(nzSize.currentValue);
      }
    }
    ngOnInit() {
      this.nzFormStatusService?.formStatusChanges.pipe(distinctUntilChanged((pre, cur) => {
        return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
      }), withLatestFrom(this.nzFormNoStatusService ? this.nzFormNoStatusService.noFormStatus : of(false)), map(([{
        status,
        hasFeedback
      }, noStatus]) => ({
        status: noStatus ? "" : status,
        hasFeedback
      })), takeUntilDestroyed(this.destroyRef)).subscribe(({
        status,
        hasFeedback
      }) => {
        this.setStatusStyles(status, hasFeedback);
      });
      this.focusMonitor.monitor(this.host, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((focusOrigin) => {
        if (!focusOrigin) {
          this.focused = false;
          this.cdr.markForCheck();
          this.nzBlur.emit();
          Promise.resolve().then(() => {
            this.onTouched();
          });
        } else {
          this.focused = true;
          this.cdr.markForCheck();
          this.nzFocus.emit();
        }
      });
      combineLatest([this.listOfValue$, this.listOfTemplateItem$]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
        const listOfTagItem = listOfSelectedValue.filter(() => this.nzMode === "tags").filter((value) => listOfTemplateItem.findIndex((o) => this.compareWith(o.nzValue, value)) === -1).map((value) => this.listOfTopItem.find((o) => this.compareWith(o.nzValue, value)) || this.generateTagItem(value));
        this.listOfTagAndTemplateItem = [...listOfTemplateItem, ...listOfTagItem];
        this.listOfTopItem = this.listOfValue.map((v) => [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find((item) => this.compareWith(v, item.nzValue))).filter((item) => !!item);
        this.updateListOfContainerItem();
      });
      this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
      this.dir = this.directionality.value;
      fromEventOutsideAngular(this.host.nativeElement, "click").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (this.nzOpen && this.nzShowSearch || this.nzDisabled) {
          return;
        }
        this.ngZone.run(() => this.setOpenState(!this.nzOpen));
      });
      this.cdkConnectedOverlay.overlayKeydown.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        if (event.keyCode === ESCAPE) {
          this.setOpenState(false);
        }
      });
    }
    ngAfterContentInit() {
      if (!this.isReactiveDriven) {
        merge(this.listOfNzOptionGroupComponent.changes, this.listOfNzOptionComponent.changes).pipe(startWith(true), switchMap(() => merge(...[this.listOfNzOptionComponent.changes, this.listOfNzOptionGroupComponent.changes, ...this.listOfNzOptionComponent.map((option) => option.changes), ...this.listOfNzOptionGroupComponent.map((option) => option.changes)]).pipe(startWith(true))), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          const listOfOptionInterface = this.listOfNzOptionComponent.toArray().map((item) => {
            const {
              template,
              nzLabel,
              nzValue,
              nzKey,
              nzDisabled,
              nzHide,
              nzCustomContent,
              groupLabel
            } = item;
            return {
              template,
              nzLabel,
              nzValue,
              nzDisabled,
              nzHide,
              nzCustomContent,
              groupLabel,
              nzTitle: this.getTitle(item.nzTitle, item.nzLabel),
              type: "item",
              key: nzKey === void 0 ? nzValue : nzKey
            };
          });
          this.listOfTemplateItem$.next(listOfOptionInterface);
          this.cdr.markForCheck();
        });
      }
    }
    setStatusStyles(status, hasFeedback) {
      this.status = status;
      this.hasFeedback = hasFeedback;
      this.cdr.markForCheck();
      this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
      Object.keys(this.statusCls).forEach((status2) => {
        if (this.statusCls[status2]) {
          this.renderer.addClass(this.host.nativeElement, status2);
        } else {
          this.renderer.removeClass(this.host.nativeElement, status2);
        }
      });
    }
    getTitle(title, label) {
      let rawTitle = void 0;
      if (title === void 0) {
        if (typeof label === "string" || typeof label === "number") {
          rawTitle = label.toString();
        }
      } else if (typeof title === "string" || typeof title === "number") {
        rawTitle = title.toString();
      }
      return rawTitle;
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _nzVariant_decorators = [WithConfig()];
    _nzOptionHeightPx_decorators = [WithConfig()];
    _nzSuffixIcon_decorators = [WithConfig()];
    _nzBorderless_decorators = [WithConfig()];
    _nzBackdrop_decorators = [WithConfig()];
    __esDecorate(null, null, _nzVariant_decorators, {
      kind: "field",
      name: "nzVariant",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzVariant" in obj,
        get: (obj) => obj.nzVariant,
        set: (obj, value) => {
          obj.nzVariant = value;
        }
      },
      metadata: _metadata
    }, _nzVariant_initializers, _nzVariant_extraInitializers);
    __esDecorate(null, null, _nzOptionHeightPx_decorators, {
      kind: "field",
      name: "nzOptionHeightPx",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzOptionHeightPx" in obj,
        get: (obj) => obj.nzOptionHeightPx,
        set: (obj, value) => {
          obj.nzOptionHeightPx = value;
        }
      },
      metadata: _metadata
    }, _nzOptionHeightPx_initializers, _nzOptionHeightPx_extraInitializers);
    __esDecorate(null, null, _nzSuffixIcon_decorators, {
      kind: "field",
      name: "nzSuffixIcon",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzSuffixIcon" in obj,
        get: (obj) => obj.nzSuffixIcon,
        set: (obj, value) => {
          obj.nzSuffixIcon = value;
        }
      },
      metadata: _metadata
    }, _nzSuffixIcon_initializers, _nzSuffixIcon_extraInitializers);
    __esDecorate(null, null, _nzBorderless_decorators, {
      kind: "field",
      name: "nzBorderless",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzBorderless" in obj,
        get: (obj) => obj.nzBorderless,
        set: (obj, value) => {
          obj.nzBorderless = value;
        }
      },
      metadata: _metadata
    }, _nzBorderless_initializers, _nzBorderless_extraInitializers);
    __esDecorate(null, null, _nzBackdrop_decorators, {
      kind: "field",
      name: "nzBackdrop",
      static: false,
      private: false,
      access: {
        has: (obj) => "nzBackdrop" in obj,
        get: (obj) => obj.nzBackdrop,
        set: (obj, value) => {
          obj.nzBackdrop = value;
        }
      },
      metadata: _metadata
    }, _nzBackdrop_initializers, _nzBackdrop_extraInitializers);
    if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _metadata
    });
  })(), __publicField(_a, "ɵfac", function NzSelectComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _a)();
  }), __publicField(_a, "ɵcmp", ɵɵdefineComponent({
    type: _a,
    selectors: [["nz-select"]],
    contentQueries: function NzSelectComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzOptionComponent, 5);
        ɵɵcontentQuery(dirIndex, NzOptionGroupComponent, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.listOfNzOptionComponent = _t);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.listOfNzOptionGroupComponent = _t);
      }
    },
    viewQuery: function NzSelectComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(CdkOverlayOrigin, 7, ElementRef);
        ɵɵviewQuery(CdkConnectedOverlay, 7);
        ɵɵviewQuery(NzSelectTopControlComponent, 7);
        ɵɵviewQuery(NzOptionGroupComponent, 7, ElementRef);
        ɵɵviewQuery(NzSelectTopControlComponent, 7, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.originElement = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.cdkConnectedOverlay = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzSelectTopControlComponent = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzOptionGroupComponentElement = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzSelectTopControlComponentElement = _t.first);
      }
    },
    hostAttrs: [1, "ant-select"],
    hostVars: 30,
    hostBindings: function NzSelectComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-select-in-form-item", !!ctx.nzFormStatusService)("ant-select-lg", ctx.finalSize() === "large")("ant-select-sm", ctx.finalSize() === "small")("ant-select-show-arrow", ctx.nzShowArrow)("ant-select-disabled", ctx.nzDisabled)("ant-select-show-search", (ctx.nzShowSearch || ctx.nzMode !== "default") && !ctx.nzDisabled)("ant-select-allow-clear", ctx.nzAllowClear)("ant-select-borderless", ctx.nzVariant === "borderless" || ctx.nzVariant === "outlined" && ctx.nzBorderless)("ant-select-filled", ctx.nzVariant === "filled")("ant-select-underlined", ctx.nzVariant === "underlined")("ant-select-open", ctx.nzOpen)("ant-select-focused", ctx.nzOpen || ctx.focused)("ant-select-single", ctx.nzMode === "default")("ant-select-multiple", ctx.nzMode !== "default")("ant-select-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzId: "nzId",
      nzSize: "nzSize",
      nzStatus: "nzStatus",
      nzVariant: "nzVariant",
      nzOptionHeightPx: "nzOptionHeightPx",
      nzOptionOverflowSize: "nzOptionOverflowSize",
      nzDropdownClassName: "nzDropdownClassName",
      nzDropdownMatchSelectWidth: "nzDropdownMatchSelectWidth",
      nzDropdownStyle: "nzDropdownStyle",
      nzNotFoundContent: "nzNotFoundContent",
      nzPlaceHolder: "nzPlaceHolder",
      nzPlacement: "nzPlacement",
      nzMaxTagCount: "nzMaxTagCount",
      nzDropdownRender: "nzDropdownRender",
      nzCustomTemplate: "nzCustomTemplate",
      nzSuffixIcon: "nzSuffixIcon",
      nzClearIcon: "nzClearIcon",
      nzRemoveIcon: "nzRemoveIcon",
      nzMenuItemSelectedIcon: "nzMenuItemSelectedIcon",
      nzTokenSeparators: "nzTokenSeparators",
      nzMaxTagPlaceholder: "nzMaxTagPlaceholder",
      nzMaxMultipleCount: [2, "nzMaxMultipleCount", "nzMaxMultipleCount", numberAttributeWithInfinityFallback],
      nzMode: "nzMode",
      nzFilterOption: "nzFilterOption",
      compareWith: "compareWith",
      nzAllowClear: [2, "nzAllowClear", "nzAllowClear", booleanAttribute],
      nzBorderless: [2, "nzBorderless", "nzBorderless", booleanAttribute],
      nzShowSearch: [2, "nzShowSearch", "nzShowSearch", booleanAttribute],
      nzLoading: [2, "nzLoading", "nzLoading", booleanAttribute],
      nzAutoFocus: [2, "nzAutoFocus", "nzAutoFocus", booleanAttribute],
      nzAutoClearSearchValue: [2, "nzAutoClearSearchValue", "nzAutoClearSearchValue", booleanAttribute],
      nzServerSearch: [2, "nzServerSearch", "nzServerSearch", booleanAttribute],
      nzDisabled: [2, "nzDisabled", "nzDisabled", booleanAttribute],
      nzOpen: [2, "nzOpen", "nzOpen", booleanAttribute],
      nzSelectOnTab: [2, "nzSelectOnTab", "nzSelectOnTab", booleanAttribute],
      nzBackdrop: [2, "nzBackdrop", "nzBackdrop", booleanAttribute],
      nzOptions: "nzOptions",
      nzShowArrow: [2, "nzShowArrow", "nzShowArrow", booleanAttribute]
    },
    outputs: {
      nzOnSearch: "nzOnSearch",
      nzScrollToBottom: "nzScrollToBottom",
      nzOpenChange: "nzOpenChange",
      nzBlur: "nzBlur",
      nzFocus: "nzFocus",
      nzOnClear: "nzOnClear"
    },
    exportAs: ["nzSelect"],
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _a),
      multi: true
    }, {
      provide: NZ_SPACE_COMPACT_ITEM_TYPE,
      useValue: "select"
    }]), ɵɵHostDirectivesFeature([NzSpaceCompactItemDirective]), ɵɵNgOnChangesFeature],
    decls: 5,
    vars: 25,
    consts: [["origin", "cdkOverlayOrigin"], ["feedbackIconTpl", ""], ["cdkOverlayOrigin", "", 3, "inputValueChange", "tokenize", "deleteItem", "keydown", "nzId", "open", "disabled", "mode", "nzNoAnimation", "maxTagPlaceholder", "removeIcon", "placeHolder", "maxTagCount", "customTemplate", "tokenSeparators", "showSearch", "autofocus", "listOfTopItem"], [3, "showArrow", "loading", "search", "suffixIcon", "feedbackIcon", "nzMaxMultipleCount", "listOfValue", "isMaxMultipleCountSet"], [3, "clearIcon"], ["cdkConnectedOverlay", "", "nzConnectedOverlay", "", 3, "overlayOutsideClick", "detach", "positionChange", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayWidth", "cdkConnectedOverlayOrigin", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayOpen", "cdkConnectedOverlayPositions"], [3, "status"], [3, "clear", "clearIcon"], [3, "keydown", "itemClick", "scrollToBottom", "itemSize", "maxItemLength", "matchWidth", "nzNoAnimation", "listOfContainerItem", "menuItemSelectedIcon", "notFoundContent", "activatedValue", "listOfSelectedValue", "dropdownRender", "compareWith", "mode", "isMaxMultipleCountReached"]],
    template: function NzSelectComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "nz-select-top-control", 2, 0);
        ɵɵlistener("inputValueChange", function NzSelectComponent_Template_nz_select_top_control_inputValueChange_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onInputValueChange($event));
        })("tokenize", function NzSelectComponent_Template_nz_select_top_control_tokenize_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onTokenSeparate($event));
        })("deleteItem", function NzSelectComponent_Template_nz_select_top_control_deleteItem_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onItemDelete($event));
        })("keydown", function NzSelectComponent_Template_nz_select_top_control_keydown_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onKeyDown($event));
        });
        ɵɵelementEnd();
        ɵɵconditionalCreate(2, NzSelectComponent_Conditional_2_Template, 3, 8, "nz-select-arrow", 3);
        ɵɵconditionalCreate(3, NzSelectComponent_Conditional_3_Template, 1, 1, "nz-select-clear", 4);
        ɵɵtemplate(4, NzSelectComponent_ng_template_4_Template, 1, 25, "ng-template", 5);
        ɵɵlistener("overlayOutsideClick", function NzSelectComponent_Template_ng_template_overlayOutsideClick_4_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onClickOutside($event));
        })("detach", function NzSelectComponent_Template_ng_template_detach_4_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.setOpenState(false));
        })("positionChange", function NzSelectComponent_Template_ng_template_positionChange_4_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onPositionChange($event));
        });
      }
      if (rf & 2) {
        const origin_r6 = ɵɵreference(1);
        ɵɵproperty("nzId", ctx.nzId)("open", ctx.nzOpen)("disabled", ctx.nzDisabled)("mode", ctx.nzMode)("@.disabled", !!(ctx.noAnimation == null ? null : ctx.noAnimation.nzNoAnimation))("nzNoAnimation", ctx.noAnimation == null ? null : ctx.noAnimation.nzNoAnimation)("maxTagPlaceholder", ctx.nzMaxTagPlaceholder)("removeIcon", ctx.nzRemoveIcon)("placeHolder", ctx.nzPlaceHolder)("maxTagCount", ctx.nzMaxTagCount)("customTemplate", ctx.nzCustomTemplate)("tokenSeparators", ctx.nzTokenSeparators)("showSearch", ctx.nzShowSearch)("autofocus", ctx.nzAutoFocus)("listOfTopItem", ctx.listOfTopItem);
        ɵɵadvance(2);
        ɵɵconditional(ctx.nzShowArrow || ctx.hasFeedback && !!ctx.status || ctx.isMaxMultipleCountSet ? 2 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.nzAllowClear && !ctx.nzDisabled && ctx.listOfValue.length ? 3 : -1);
        ɵɵadvance();
        ɵɵproperty("cdkConnectedOverlayHasBackdrop", ctx.nzBackdrop)("cdkConnectedOverlayMinWidth", ctx.nzDropdownMatchSelectWidth ? null : ctx.triggerWidth)("cdkConnectedOverlayWidth", ctx.nzDropdownMatchSelectWidth ? ctx.triggerWidth : null)("cdkConnectedOverlayOrigin", origin_r6)("cdkConnectedOverlayTransformOriginOn", ".ant-select-dropdown")("cdkConnectedOverlayPanelClass", ctx.nzDropdownClassName)("cdkConnectedOverlayOpen", ctx.nzOpen)("cdkConnectedOverlayPositions", ctx.positions);
      }
    },
    dependencies: [NzSelectTopControlComponent, CdkOverlayOrigin, NzNoAnimationDirective, NzSelectArrowComponent, NzFormItemFeedbackIconComponent, NzSelectClearComponent, CdkConnectedOverlay, NzOverlayModule, NzConnectedOverlayDirective, NzOptionContainerComponent],
    encapsulation: 2,
    data: {
      animation: [slideMotion]
    },
    changeDetection: 0
  })), _a;
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectComponent, [{
    type: Component,
    args: [{
      selector: "nz-select",
      exportAs: "nzSelect",
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NzSelectComponent),
        multi: true
      }, {
        provide: NZ_SPACE_COMPACT_ITEM_TYPE,
        useValue: "select"
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      animations: [slideMotion],
      template: `
    <nz-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [nzId]="nzId"
      [open]="nzOpen"
      [disabled]="nzDisabled"
      [mode]="nzMode"
      [@.disabled]="!!noAnimation?.nzNoAnimation"
      [nzNoAnimation]="noAnimation?.nzNoAnimation"
      [maxTagPlaceholder]="nzMaxTagPlaceholder"
      [removeIcon]="nzRemoveIcon"
      [placeHolder]="nzPlaceHolder"
      [maxTagCount]="nzMaxTagCount"
      [customTemplate]="nzCustomTemplate"
      [tokenSeparators]="nzTokenSeparators"
      [showSearch]="nzShowSearch"
      [autofocus]="nzAutoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
    ></nz-select-top-control>
    @if (nzShowArrow || (hasFeedback && !!status) || isMaxMultipleCountSet) {
      <nz-select-arrow
        [showArrow]="nzShowArrow"
        [loading]="nzLoading"
        [search]="nzOpen && nzShowSearch"
        [suffixIcon]="nzSuffixIcon"
        [feedbackIcon]="feedbackIconTpl"
        [nzMaxMultipleCount]="nzMaxMultipleCount"
        [listOfValue]="listOfValue"
        [isMaxMultipleCountSet]="isMaxMultipleCountSet"
      >
        <ng-template #feedbackIconTpl>
          @if (hasFeedback && !!status) {
            <nz-form-item-feedback-icon [status]="status"></nz-form-item-feedback-icon>
          }
        </ng-template>
      </nz-select-arrow>
    }

    @if (nzAllowClear && !nzDisabled && listOfValue.length) {
      <nz-select-clear [clearIcon]="nzClearIcon" (clear)="onClearSelection()"></nz-select-clear>
    }
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="nzBackdrop"
      [cdkConnectedOverlayMinWidth]="$any(nzDropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(nzDropdownMatchSelectWidth ? triggerWidth : null)"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-dropdown'"
      [cdkConnectedOverlayPanelClass]="nzDropdownClassName!"
      [cdkConnectedOverlayOpen]="nzOpen"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
    >
      <nz-option-container
        [style]="nzDropdownStyle"
        [itemSize]="nzOptionHeightPx"
        [maxItemLength]="nzOptionOverflowSize"
        [matchWidth]="nzDropdownMatchSelectWidth"
        [class.ant-select-dropdown-placement-bottomLeft]="dropdownPosition === 'bottomLeft'"
        [class.ant-select-dropdown-placement-topLeft]="dropdownPosition === 'topLeft'"
        [class.ant-select-dropdown-placement-bottomRight]="dropdownPosition === 'bottomRight'"
        [class.ant-select-dropdown-placement-topRight]="dropdownPosition === 'topRight'"
        [@slideMotion]="'enter'"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="nzMenuItemSelectedIcon"
        [notFoundContent]="nzNotFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="nzDropdownRender"
        [compareWith]="compareWith"
        [mode]="nzMode"
        [isMaxMultipleCountReached]="isMaxMultipleCountReached"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (scrollToBottom)="nzScrollToBottom.emit()"
      ></nz-option-container>
    </ng-template>
  `,
      host: {
        class: "ant-select",
        "[class.ant-select-in-form-item]": "!!nzFormStatusService",
        "[class.ant-select-lg]": 'finalSize() === "large"',
        "[class.ant-select-sm]": 'finalSize() === "small"',
        "[class.ant-select-show-arrow]": `nzShowArrow`,
        "[class.ant-select-disabled]": "nzDisabled",
        "[class.ant-select-show-search]": `(nzShowSearch || nzMode !== 'default') && !nzDisabled`,
        "[class.ant-select-allow-clear]": "nzAllowClear",
        "[class.ant-select-borderless]": `nzVariant === 'borderless' || (nzVariant === 'outlined' && nzBorderless)`,
        "[class.ant-select-filled]": `nzVariant === 'filled'`,
        "[class.ant-select-underlined]": `nzVariant === 'underlined'`,
        "[class.ant-select-open]": "nzOpen",
        "[class.ant-select-focused]": "nzOpen || focused",
        "[class.ant-select-single]": `nzMode === 'default'`,
        "[class.ant-select-multiple]": `nzMode !== 'default'`,
        "[class.ant-select-rtl]": `dir === 'rtl'`
      },
      hostDirectives: [NzSpaceCompactItemDirective],
      imports: [NzSelectTopControlComponent, CdkOverlayOrigin, NzNoAnimationDirective, NzSelectArrowComponent, NzFormItemFeedbackIconComponent, NzSelectClearComponent, CdkConnectedOverlay, NzOverlayModule, NzOptionContainerComponent]
    }]
  }], () => [], {
    nzId: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    nzStatus: [{
      type: Input
    }],
    nzVariant: [{
      type: Input
    }],
    nzOptionHeightPx: [{
      type: Input
    }],
    nzOptionOverflowSize: [{
      type: Input
    }],
    nzDropdownClassName: [{
      type: Input
    }],
    nzDropdownMatchSelectWidth: [{
      type: Input
    }],
    nzDropdownStyle: [{
      type: Input
    }],
    nzNotFoundContent: [{
      type: Input
    }],
    nzPlaceHolder: [{
      type: Input
    }],
    nzPlacement: [{
      type: Input
    }],
    nzMaxTagCount: [{
      type: Input
    }],
    nzDropdownRender: [{
      type: Input
    }],
    nzCustomTemplate: [{
      type: Input
    }],
    nzSuffixIcon: [{
      type: Input
    }],
    nzClearIcon: [{
      type: Input
    }],
    nzRemoveIcon: [{
      type: Input
    }],
    nzMenuItemSelectedIcon: [{
      type: Input
    }],
    nzTokenSeparators: [{
      type: Input
    }],
    nzMaxTagPlaceholder: [{
      type: Input
    }],
    nzMaxMultipleCount: [{
      type: Input,
      args: [{
        transform: numberAttributeWithInfinityFallback
      }]
    }],
    nzMode: [{
      type: Input
    }],
    nzFilterOption: [{
      type: Input
    }],
    compareWith: [{
      type: Input
    }],
    nzAllowClear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzBorderless: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzShowSearch: [{
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
    nzAutoFocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzAutoClearSearchValue: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzServerSearch: [{
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
    nzOpen: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzSelectOnTab: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzBackdrop: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzOptions: [{
      type: Input
    }],
    nzShowArrow: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzOnSearch: [{
      type: Output
    }],
    nzScrollToBottom: [{
      type: Output
    }],
    nzOpenChange: [{
      type: Output
    }],
    nzBlur: [{
      type: Output
    }],
    nzFocus: [{
      type: Output
    }],
    originElement: [{
      type: ViewChild,
      args: [CdkOverlayOrigin, {
        static: true,
        read: ElementRef
      }]
    }],
    cdkConnectedOverlay: [{
      type: ViewChild,
      args: [CdkConnectedOverlay, {
        static: true
      }]
    }],
    nzSelectTopControlComponent: [{
      type: ViewChild,
      args: [NzSelectTopControlComponent, {
        static: true
      }]
    }],
    listOfNzOptionComponent: [{
      type: ContentChildren,
      args: [NzOptionComponent, {
        descendants: true
      }]
    }],
    listOfNzOptionGroupComponent: [{
      type: ContentChildren,
      args: [NzOptionGroupComponent, {
        descendants: true
      }]
    }],
    nzOptionGroupComponentElement: [{
      type: ViewChild,
      args: [NzOptionGroupComponent, {
        static: true,
        read: ElementRef
      }]
    }],
    nzSelectTopControlComponentElement: [{
      type: ViewChild,
      args: [NzSelectTopControlComponent, {
        static: true,
        read: ElementRef
      }]
    }]
  });
})();
var NzSelectModule = class _NzSelectModule {
  static ɵfac = function NzSelectModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSelectModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzSelectModule,
    imports: [NzOptionComponent, NzSelectComponent, NzOptionContainerComponent, NzOptionGroupComponent, NzOptionItemComponent, NzSelectTopControlComponent, NzSelectSearchComponent, NzSelectItemComponent, NzSelectClearComponent, NzSelectArrowComponent, NzSelectPlaceholderComponent, NzOptionItemGroupComponent],
    exports: [NzOptionComponent, NzSelectComponent, NzOptionGroupComponent, NzSelectArrowComponent, NzSelectClearComponent, NzSelectItemComponent, NzSelectPlaceholderComponent, NzSelectSearchComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzSelectComponent, NzOptionContainerComponent, NzOptionItemComponent, NzSelectTopControlComponent, NzSelectSearchComponent, NzSelectItemComponent, NzSelectClearComponent, NzSelectArrowComponent, NzSelectPlaceholderComponent, NzOptionItemGroupComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSelectModule, [{
    type: NgModule,
    args: [{
      imports: [NzOptionComponent, NzSelectComponent, NzOptionContainerComponent, NzOptionGroupComponent, NzOptionItemComponent, NzSelectTopControlComponent, NzSelectSearchComponent, NzSelectItemComponent, NzSelectClearComponent, NzSelectArrowComponent, NzSelectPlaceholderComponent, NzOptionItemGroupComponent],
      exports: [NzOptionComponent, NzSelectComponent, NzOptionGroupComponent, NzSelectArrowComponent, NzSelectClearComponent, NzSelectItemComponent, NzSelectPlaceholderComponent, NzSelectSearchComponent]
    }]
  }], null, null);
})();

export {
  NzOptionGroupComponent,
  NzOptionItemGroupComponent,
  NzOptionItemComponent,
  NzOptionContainerComponent,
  NzOptionComponent,
  NzSelectArrowComponent,
  NzSelectClearComponent,
  NzSelectItemComponent,
  NzSelectPlaceholderComponent,
  NzSelectSearchComponent,
  NzSelectTopControlComponent,
  NzSelectComponent,
  NzSelectModule
};
//# sourceMappingURL=chunk-FCFY62JL.js.map
