import {
  NzSpinComponent,
  NzSpinModule
} from "./chunk-SJPBC2KJ.js";
import {
  NzEmbedEmptyComponent,
  NzEmptyModule
} from "./chunk-4KIH4RME.js";
import "./chunk-NU44RYSI.js";
import {
  NzColDirective,
  NzGridModule,
  NzRowDirective
} from "./chunk-LIF7HDNM.js";
import "./chunk-BGJVKJD4.js";
import "./chunk-CP5ADG5I.js";
import "./chunk-NX7BCYNZ.js";
import "./chunk-RZB7DMVY.js";
import {
  NzOutletModule,
  NzStringTemplateOutletDirective
} from "./chunk-VCDKFDG2.js";
import {
  Directionality
} from "./chunk-Z3KNHBSE.js";
import {
  NzAvatarComponent,
  NzAvatarModule
} from "./chunk-FP7VKEFL.js";
import "./chunk-TQ5FZKYH.js";
import "./chunk-UY6MFP5V.js";
import "./chunk-A4QG4M6R.js";
import "./chunk-3NNVUQIN.js";
import "./chunk-GQBHIW5X.js";
import {
  takeUntilDestroyed
} from "./chunk-LTLJ7NNZ.js";
import "./chunk-MKTFS3GT.js";
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
  HostBinding,
  Input,
  NgModule,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-WRF7LGAN.js";
import {
  defer,
  merge
} from "./chunk-5ZA7WIRE.js";
import "./chunk-6Z4AXWPT.js";
import {
  BehaviorSubject,
  Subject,
  mergeMap,
  of,
  startWith
} from "./chunk-JU3XS6KG.js";
import "./chunk-5RPXVRYW.js";

// node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-list.mjs
var _c0 = ["*"];
function NzListItemMetaAvatarComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-avatar", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzSrc", ctx_r0.nzSrc);
  }
}
function NzListItemMetaAvatarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
var _c1 = [[["nz-list-item-meta-avatar"]], [["nz-list-item-meta-title"]], [["nz-list-item-meta-description"]]];
var _c2 = ["nz-list-item-meta-avatar", "nz-list-item-meta-title", "nz-list-item-meta-description"];
function NzListItemMetaComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-list-item-meta-avatar", 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzSrc", ctx_r0.avatarStr);
  }
}
function NzListItemMetaComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-item-meta-avatar");
    ɵɵelementContainer(1, 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.avatarTpl);
  }
}
function NzListItemMetaComponent_Conditional_3_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzTitle);
  }
}
function NzListItemMetaComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-item-meta-title");
    ɵɵtemplate(1, NzListItemMetaComponent_Conditional_3_Conditional_1_ng_container_1_Template, 2, 1, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzTitle);
  }
}
function NzListItemMetaComponent_Conditional_3_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzDescription);
  }
}
function NzListItemMetaComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-item-meta-description");
    ɵɵtemplate(1, NzListItemMetaComponent_Conditional_3_Conditional_2_ng_container_1_Template, 2, 1, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzDescription);
  }
}
function NzListItemMetaComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵconditionalCreate(1, NzListItemMetaComponent_Conditional_3_Conditional_1_Template, 2, 1, "nz-list-item-meta-title");
    ɵɵconditionalCreate(2, NzListItemMetaComponent_Conditional_3_Conditional_2_Template, 2, 1, "nz-list-item-meta-description");
    ɵɵprojection(3, 1);
    ɵɵprojection(4, 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzTitle && !ctx_r0.titleComponent ? 1 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzDescription && !ctx_r0.descriptionComponent ? 2 : -1);
  }
}
function NzListItemActionComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
var _c3 = ["nz-list-item-actions", ""];
function NzListItemActionsComponent_For_1_ng_template_1_Template(rf, ctx) {
}
function NzListItemActionsComponent_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "em", 1);
  }
}
function NzListItemActionsComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "li");
    ɵɵtemplate(1, NzListItemActionsComponent_For_1_ng_template_1_Template, 0, 0, "ng-template", 0);
    ɵɵconditionalCreate(2, NzListItemActionsComponent_For_1_Conditional_2_Template, 1, 0, "em", 1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const i_r1 = ctx.$implicit;
    const ɵ$index_1_r2 = ctx.$index;
    const ɵ$count_1_r3 = ctx.$count;
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", i_r1);
    ɵɵadvance();
    ɵɵconditional(!(ɵ$index_1_r2 === ɵ$count_1_r3 - 1) ? 2 : -1);
  }
}
var _c4 = [[["nz-list-header"]], [["nz-list-footer"], ["", "nz-list-footer", ""]], [["nz-list-load-more"], ["", "nz-list-load-more", ""]], [["nz-list-pagination"], ["", "nz-list-pagination", ""]], "*"];
var _c5 = ["nz-list-header", "nz-list-footer, [nz-list-footer]", "nz-list-load-more, [nz-list-load-more]", "nz-list-pagination, [nz-list-pagination]", "*"];
var _c6 = (a0, a1) => ({
  $implicit: a0,
  index: a1
});
function NzListComponent_Conditional_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzHeader);
  }
}
function NzListComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-header");
    ɵɵtemplate(1, NzListComponent_Conditional_0_ng_container_1_Template, 2, 1, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzHeader);
  }
}
function NzListComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div");
  }
  if (rf & 2) {
    ɵɵstyleProp("min-height", 53, "px");
  }
}
function NzListComponent_Conditional_5_For_2_ng_template_1_Template(rf, ctx) {
}
function NzListComponent_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 7);
    ɵɵtemplate(1, NzListComponent_Conditional_5_For_2_ng_template_1_Template, 0, 0, "ng-template", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ɵ$index_20_r3 = ctx.$index;
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("nzSpan", ctx_r0.nzGrid.span || null)("nzXs", ctx_r0.nzGrid.xs || null)("nzSm", ctx_r0.nzGrid.sm || null)("nzMd", ctx_r0.nzGrid.md || null)("nzLg", ctx_r0.nzGrid.lg || null)("nzXl", ctx_r0.nzGrid.xl || null)("nzXXl", ctx_r0.nzGrid.xxl || null);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.nzRenderItem)("ngTemplateOutletContext", ɵɵpureFunction2(9, _c6, item_r2, ɵ$index_20_r3));
  }
}
function NzListComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵrepeaterCreate(1, NzListComponent_Conditional_5_For_2_Template, 2, 12, "div", 7, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzGutter", ctx_r0.nzGrid.gutter || null);
    ɵɵadvance();
    ɵɵrepeater(ctx_r0.nzDataSource);
  }
}
function NzListComponent_Conditional_6_For_2_ng_template_1_Template(rf, ctx) {
}
function NzListComponent_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, NzListComponent_Conditional_6_For_2_ng_template_1_Template, 0, 0, "ng-template", 8);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ɵ$index_28_r5 = ctx.$index;
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.nzRenderItem)("ngTemplateOutletContext", ɵɵpureFunction2(2, _c6, item_r4, ɵ$index_28_r5));
  }
}
function NzListComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵrepeaterCreate(1, NzListComponent_Conditional_6_For_2_Template, 2, 5, "ng-container", null, ɵɵrepeaterTrackByIdentity);
    ɵɵprojection(3, 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵrepeater(ctx_r0.nzDataSource);
  }
}
function NzListComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-list-empty", 4);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("nzNoResult", ctx_r0.nzNoResult);
  }
}
function NzListComponent_Conditional_8_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzFooter);
  }
}
function NzListComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-footer");
    ɵɵtemplate(1, NzListComponent_Conditional_8_ng_container_1_Template, 2, 1, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzFooter);
  }
}
function NzListComponent_ng_template_10_Template(rf, ctx) {
}
function NzListComponent_Conditional_12_ng_template_1_Template(rf, ctx) {
}
function NzListComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-pagination");
    ɵɵtemplate(1, NzListComponent_Conditional_12_ng_template_1_Template, 0, 0, "ng-template", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.nzPagination);
  }
}
var _c7 = [[["nz-list-item-actions"], ["", "nz-list-item-actions", ""]], [["nz-list-item-meta"], ["", "nz-list-item-meta", ""]], "*", [["nz-list-item-extra"], ["", "nz-list-item-extra", ""]]];
var _c8 = ["nz-list-item-actions, [nz-list-item-actions]", "nz-list-item-meta, [nz-list-item-meta]", "*", "nz-list-item-extra, [nz-list-item-extra]"];
function NzListItemComponent_ng_template_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "ul", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("nzActions", ctx_r0.nzActions);
  }
}
function NzListItemComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzListItemComponent_ng_template_0_Conditional_0_Template, 1, 1, "ul", 3);
    ɵɵprojection(1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.nzActions && ctx_r0.nzActions.length > 0 ? 0 : -1);
  }
}
function NzListItemComponent_ng_template_2_Conditional_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzContent);
  }
}
function NzListItemComponent_ng_template_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzListItemComponent_ng_template_2_Conditional_2_ng_container_0_Template, 2, 1, "ng-container", 4);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzContent);
  }
}
function NzListItemComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
    ɵɵprojection(1, 2);
    ɵɵconditionalCreate(2, NzListItemComponent_ng_template_2_Conditional_2_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵconditional(ctx_r0.nzContent ? 2 : -1);
  }
}
function NzListItemComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 3);
  }
}
function NzListItemComponent_Conditional_6_ng_template_1_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_6_ng_template_2_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_6_Conditional_3_ng_template_1_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "nz-list-item-extra");
    ɵɵtemplate(1, NzListItemComponent_Conditional_6_Conditional_3_ng_template_1_Template, 0, 0, "ng-template", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.nzExtra);
  }
}
function NzListItemComponent_Conditional_6_ng_template_4_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 5);
    ɵɵtemplate(1, NzListItemComponent_Conditional_6_ng_template_1_Template, 0, 0, "ng-template", 6)(2, NzListItemComponent_Conditional_6_ng_template_2_Template, 0, 0, "ng-template", 6);
    ɵɵelementEnd();
    ɵɵconditionalCreate(3, NzListItemComponent_Conditional_6_Conditional_3_Template, 2, 1, "nz-list-item-extra");
    ɵɵtemplate(4, NzListItemComponent_Conditional_6_ng_template_4_Template, 0, 0, "ng-template", 6);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const actionsTpl_r2 = ɵɵreference(1);
    const contentTpl_r3 = ɵɵreference(3);
    const extraTpl_r4 = ɵɵreference(5);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", contentTpl_r3);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", actionsTpl_r2);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzExtra ? 3 : -1);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", extraTpl_r4);
  }
}
function NzListItemComponent_Conditional_7_ng_template_0_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_7_ng_template_1_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_7_ng_template_2_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_7_ng_template_3_Template(rf, ctx) {
}
function NzListItemComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, NzListItemComponent_Conditional_7_ng_template_0_Template, 0, 0, "ng-template", 6)(1, NzListItemComponent_Conditional_7_ng_template_1_Template, 0, 0, "ng-template", 6)(2, NzListItemComponent_Conditional_7_ng_template_2_Template, 0, 0, "ng-template", 6)(3, NzListItemComponent_Conditional_7_ng_template_3_Template, 0, 0, "ng-template", 6);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const actionsTpl_r2 = ɵɵreference(1);
    const contentTpl_r3 = ɵɵreference(3);
    const extraTpl_r4 = ɵɵreference(5);
    ɵɵproperty("ngTemplateOutlet", contentTpl_r3);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.nzExtra);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", extraTpl_r4);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", actionsTpl_r2);
  }
}
var NzListItemMetaTitleComponent = class _NzListItemMetaTitleComponent {
  static ɵfac = function NzListItemMetaTitleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemMetaTitleComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemMetaTitleComponent,
    selectors: [["nz-list-item-meta-title"]],
    exportAs: ["nzListItemMetaTitle"],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    consts: [[1, "ant-list-item-meta-title"]],
    template: function NzListItemMetaTitleComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomElementStart(0, "h4", 0);
        ɵɵprojection(1);
        ɵɵdomElementEnd();
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemMetaTitleComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item-meta-title",
      exportAs: "nzListItemMetaTitle",
      template: `
    <h4 class="ant-list-item-meta-title">
      <ng-content></ng-content>
    </h4>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var NzListItemMetaDescriptionComponent = class _NzListItemMetaDescriptionComponent {
  static ɵfac = function NzListItemMetaDescriptionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemMetaDescriptionComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemMetaDescriptionComponent,
    selectors: [["nz-list-item-meta-description"]],
    exportAs: ["nzListItemMetaDescription"],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    consts: [[1, "ant-list-item-meta-description"]],
    template: function NzListItemMetaDescriptionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomElementStart(0, "div", 0);
        ɵɵprojection(1);
        ɵɵdomElementEnd();
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemMetaDescriptionComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item-meta-description",
      exportAs: "nzListItemMetaDescription",
      template: `
    <div class="ant-list-item-meta-description">
      <ng-content></ng-content>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var NzListItemMetaAvatarComponent = class _NzListItemMetaAvatarComponent {
  nzSrc;
  static ɵfac = function NzListItemMetaAvatarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemMetaAvatarComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemMetaAvatarComponent,
    selectors: [["nz-list-item-meta-avatar"]],
    inputs: {
      nzSrc: "nzSrc"
    },
    exportAs: ["nzListItemMetaAvatar"],
    ngContentSelectors: _c0,
    decls: 3,
    vars: 1,
    consts: [[1, "ant-list-item-meta-avatar"], [3, "nzSrc"]],
    template: function NzListItemMetaAvatarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelementStart(0, "div", 0);
        ɵɵconditionalCreate(1, NzListItemMetaAvatarComponent_Conditional_1_Template, 1, 1, "nz-avatar", 1)(2, NzListItemMetaAvatarComponent_Conditional_2_Template, 1, 0);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵconditional(ctx.nzSrc ? 1 : 2);
      }
    },
    dependencies: [NzAvatarModule, NzAvatarComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemMetaAvatarComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item-meta-avatar",
      exportAs: "nzListItemMetaAvatar",
      template: `
    <div class="ant-list-item-meta-avatar">
      @if (nzSrc) {
        <nz-avatar [nzSrc]="nzSrc" />
      } @else {
        <ng-content />
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NzAvatarModule]
    }]
  }], null, {
    nzSrc: [{
      type: Input
    }]
  });
})();
var NzListItemMetaComponent = class _NzListItemMetaComponent {
  elementRef = inject(ElementRef);
  avatarStr = "";
  avatarTpl;
  set nzAvatar(value) {
    if (value instanceof TemplateRef) {
      this.avatarStr = "";
      this.avatarTpl = value;
    } else {
      this.avatarStr = value;
    }
  }
  nzTitle;
  nzDescription;
  descriptionComponent;
  titleComponent;
  static ɵfac = function NzListItemMetaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemMetaComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemMetaComponent,
    selectors: [["nz-list-item-meta"], ["", "nz-list-item-meta", ""]],
    contentQueries: function NzListItemMetaComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzListItemMetaDescriptionComponent, 5);
        ɵɵcontentQuery(dirIndex, NzListItemMetaTitleComponent, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.descriptionComponent = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.titleComponent = _t.first);
      }
    },
    hostAttrs: [1, "ant-list-item-meta"],
    inputs: {
      nzAvatar: "nzAvatar",
      nzTitle: "nzTitle",
      nzDescription: "nzDescription"
    },
    exportAs: ["nzListItemMeta"],
    ngContentSelectors: _c2,
    decls: 4,
    vars: 3,
    consts: [[3, "nzSrc"], [1, "ant-list-item-meta-content"], [3, "ngTemplateOutlet"], [4, "nzStringTemplateOutlet"]],
    template: function NzListItemMetaComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c1);
        ɵɵconditionalCreate(0, NzListItemMetaComponent_Conditional_0_Template, 1, 1, "nz-list-item-meta-avatar", 0);
        ɵɵconditionalCreate(1, NzListItemMetaComponent_Conditional_1_Template, 2, 1, "nz-list-item-meta-avatar");
        ɵɵprojection(2);
        ɵɵconditionalCreate(3, NzListItemMetaComponent_Conditional_3_Template, 5, 2, "div", 1);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.avatarStr ? 0 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.avatarTpl ? 1 : -1);
        ɵɵadvance(2);
        ɵɵconditional(ctx.nzTitle || ctx.nzDescription || ctx.descriptionComponent || ctx.titleComponent ? 3 : -1);
      }
    },
    dependencies: [NzListItemMetaAvatarComponent, NgTemplateOutlet, NzListItemMetaTitleComponent, NzOutletModule, NzStringTemplateOutletDirective, NzListItemMetaDescriptionComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemMetaComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item-meta, [nz-list-item-meta]",
      exportAs: "nzListItemMeta",
      template: `
    <!--Old API Start-->
    @if (avatarStr) {
      <nz-list-item-meta-avatar [nzSrc]="avatarStr" />
    }

    @if (avatarTpl) {
      <nz-list-item-meta-avatar>
        <ng-container [ngTemplateOutlet]="avatarTpl" />
      </nz-list-item-meta-avatar>
    }

    <!--Old API End-->

    <ng-content select="nz-list-item-meta-avatar" />

    @if (nzTitle || nzDescription || descriptionComponent || titleComponent) {
      <div class="ant-list-item-meta-content">
        <!--Old API Start-->

        @if (nzTitle && !titleComponent) {
          <nz-list-item-meta-title>
            <ng-container *nzStringTemplateOutlet="nzTitle">{{ nzTitle }}</ng-container>
          </nz-list-item-meta-title>
        }

        @if (nzDescription && !descriptionComponent) {
          <nz-list-item-meta-description>
            <ng-container *nzStringTemplateOutlet="nzDescription">{{ nzDescription }}</ng-container>
          </nz-list-item-meta-description>
        }
        <!--Old API End-->

        <ng-content select="nz-list-item-meta-title" />
        <ng-content select="nz-list-item-meta-description" />
      </div>
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-list-item-meta"
      },
      imports: [NzListItemMetaAvatarComponent, NgTemplateOutlet, NzListItemMetaTitleComponent, NzOutletModule, NzListItemMetaDescriptionComponent]
    }]
  }], null, {
    nzAvatar: [{
      type: Input
    }],
    nzTitle: [{
      type: Input
    }],
    nzDescription: [{
      type: Input
    }],
    descriptionComponent: [{
      type: ContentChild,
      args: [NzListItemMetaDescriptionComponent]
    }],
    titleComponent: [{
      type: ContentChild,
      args: [NzListItemMetaTitleComponent]
    }]
  });
})();
var NzListItemExtraComponent = class _NzListItemExtraComponent {
  static ɵfac = function NzListItemExtraComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemExtraComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemExtraComponent,
    selectors: [["nz-list-item-extra"], ["", "nz-list-item-extra", ""]],
    hostAttrs: [1, "ant-list-item-extra"],
    exportAs: ["nzListItemExtra"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzListItemExtraComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemExtraComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item-extra, [nz-list-item-extra]",
      exportAs: "nzListItemExtra",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-list-item-extra"
      }
    }]
  }], null, null);
})();
var NzListItemActionComponent = class _NzListItemActionComponent {
  templateRef;
  static ɵfac = function NzListItemActionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemActionComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemActionComponent,
    selectors: [["nz-list-item-action"]],
    viewQuery: function NzListItemActionComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(TemplateRef, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templateRef = _t.first);
      }
    },
    exportAs: ["nzListItemAction"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzListItemActionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomTemplate(0, NzListItemActionComponent_ng_template_0_Template, 1, 0, "ng-template");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemActionComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item-action",
      exportAs: "nzListItemAction",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-template><ng-content></ng-content></ng-template>`
    }]
  }], null, {
    templateRef: [{
      type: ViewChild,
      args: [TemplateRef, {
        static: true
      }]
    }]
  });
})();
var NzListItemActionsComponent = class _NzListItemActionsComponent {
  cdr = inject(ChangeDetectorRef);
  nzActions = [];
  nzListItemActions;
  actions = [];
  inputActionChanges$ = new Subject();
  contentChildrenChanges$ = defer(() => {
    if (this.nzListItemActions) {
      return of(null);
    }
    return this.initialized.pipe(mergeMap(() => this.nzListItemActions.changes.pipe(startWith(this.nzListItemActions))));
  });
  initialized = new Subject();
  constructor() {
    merge(this.contentChildrenChanges$, this.inputActionChanges$).pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.nzActions.length) {
        this.actions = this.nzActions;
      } else {
        this.actions = this.nzListItemActions.map((action) => action.templateRef);
      }
      this.cdr.detectChanges();
    });
  }
  ngOnChanges() {
    this.inputActionChanges$.next(null);
  }
  ngAfterContentInit() {
    this.initialized.next();
    this.initialized.complete();
  }
  static ɵfac = function NzListItemActionsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemActionsComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemActionsComponent,
    selectors: [["ul", "nz-list-item-actions", ""]],
    contentQueries: function NzListItemActionsComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzListItemActionComponent, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzListItemActions = _t);
      }
    },
    hostAttrs: [1, "ant-list-item-action"],
    inputs: {
      nzActions: "nzActions"
    },
    exportAs: ["nzListItemActions"],
    features: [ɵɵNgOnChangesFeature],
    attrs: _c3,
    decls: 2,
    vars: 0,
    consts: [[3, "ngTemplateOutlet"], [1, "ant-list-item-action-split"]],
    template: function NzListItemActionsComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵrepeaterCreate(0, NzListItemActionsComponent_For_1_Template, 3, 2, "li", null, ɵɵrepeaterTrackByIdentity);
      }
      if (rf & 2) {
        ɵɵrepeater(ctx.actions);
      }
    },
    dependencies: [NgTemplateOutlet],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemActionsComponent, [{
    type: Component,
    args: [{
      selector: "ul[nz-list-item-actions]",
      exportAs: "nzListItemActions",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @for (i of actions; track i) {
      <li>
        <ng-template [ngTemplateOutlet]="i" />
        @if (!$last) {
          <em class="ant-list-item-action-split"></em>
        }
      </li>
    }
  `,
      host: {
        class: "ant-list-item-action"
      },
      imports: [NgTemplateOutlet]
    }]
  }], () => [], {
    nzActions: [{
      type: Input
    }],
    nzListItemActions: [{
      type: ContentChildren,
      args: [NzListItemActionComponent]
    }]
  });
})();
var NzListEmptyComponent = class _NzListEmptyComponent {
  nzNoResult;
  static ɵfac = function NzListEmptyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListEmptyComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListEmptyComponent,
    selectors: [["nz-list-empty"]],
    hostAttrs: [1, "ant-list-empty-text"],
    inputs: {
      nzNoResult: "nzNoResult"
    },
    exportAs: ["nzListHeader"],
    decls: 1,
    vars: 2,
    consts: [[3, "nzComponentName", "specificContent"]],
    template: function NzListEmptyComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelement(0, "nz-embed-empty", 0);
      }
      if (rf & 2) {
        ɵɵproperty("nzComponentName", "list")("specificContent", ctx.nzNoResult);
      }
    },
    dependencies: [NzEmptyModule, NzEmbedEmptyComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListEmptyComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-empty",
      exportAs: "nzListHeader",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<nz-embed-empty [nzComponentName]="'list'" [specificContent]="nzNoResult"></nz-embed-empty>`,
      host: {
        class: "ant-list-empty-text"
      },
      imports: [NzEmptyModule]
    }]
  }], null, {
    nzNoResult: [{
      type: Input
    }]
  });
})();
var NzListHeaderComponent = class _NzListHeaderComponent {
  static ɵfac = function NzListHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListHeaderComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListHeaderComponent,
    selectors: [["nz-list-header"]],
    hostAttrs: [1, "ant-list-header"],
    exportAs: ["nzListHeader"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzListHeaderComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListHeaderComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-header",
      exportAs: "nzListHeader",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-list-header"
      }
    }]
  }], null, null);
})();
var NzListFooterComponent = class _NzListFooterComponent {
  static ɵfac = function NzListFooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListFooterComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListFooterComponent,
    selectors: [["nz-list-footer"]],
    hostAttrs: [1, "ant-list-footer"],
    exportAs: ["nzListFooter"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzListFooterComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListFooterComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-footer",
      exportAs: "nzListFooter",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-list-footer"
      }
    }]
  }], null, null);
})();
var NzListPaginationComponent = class _NzListPaginationComponent {
  static ɵfac = function NzListPaginationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListPaginationComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListPaginationComponent,
    selectors: [["nz-list-pagination"]],
    hostAttrs: [1, "ant-list-pagination"],
    exportAs: ["nzListPagination"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzListPaginationComponent_Template(rf, ctx) {
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListPaginationComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-pagination",
      exportAs: "nzListPagination",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-list-pagination"
      }
    }]
  }], null, null);
})();
var NzListLoadMoreDirective = class _NzListLoadMoreDirective {
  static ɵfac = function NzListLoadMoreDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListLoadMoreDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzListLoadMoreDirective,
    selectors: [["nz-list-load-more"]],
    exportAs: ["nzListLoadMoreDirective"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListLoadMoreDirective, [{
    type: Directive,
    args: [{
      selector: "nz-list-load-more",
      exportAs: "nzListLoadMoreDirective"
    }]
  }], null, null);
})();
var NzListGridDirective = class _NzListGridDirective {
  static ɵfac = function NzListGridDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListGridDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzListGridDirective,
    selectors: [["nz-list", "nzGrid", ""]],
    hostAttrs: [1, "ant-list-grid"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListGridDirective, [{
    type: Directive,
    args: [{
      selector: "nz-list[nzGrid]",
      host: {
        class: "ant-list-grid"
      }
    }]
  }], null, null);
})();
var NzListComponent = class _NzListComponent {
  directionality = inject(Directionality);
  destroyRef = inject(DestroyRef);
  nzDataSource;
  nzBordered = false;
  nzGrid = "";
  nzHeader;
  nzFooter;
  nzItemLayout = "horizontal";
  nzRenderItem = null;
  nzLoading = false;
  nzLoadMore = null;
  nzPagination;
  nzSize = "default";
  nzSplit = true;
  nzNoResult;
  nzListFooterComponent;
  nzListPaginationComponent;
  nzListLoadMoreDirective;
  hasSomethingAfterLastItem = false;
  dir = "ltr";
  itemLayoutNotifySource = new BehaviorSubject(this.nzItemLayout);
  get itemLayoutNotify$() {
    return this.itemLayoutNotifySource.asObservable();
  }
  constructor() {
    this.destroyRef.onDestroy(() => this.itemLayoutNotifySource.unsubscribe());
  }
  ngOnInit() {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
      this.dir = direction;
    });
  }
  getSomethingAfterLastItem() {
    return !!(this.nzLoadMore || this.nzPagination || this.nzFooter || this.nzListFooterComponent || this.nzListPaginationComponent || this.nzListLoadMoreDirective);
  }
  ngOnChanges(changes) {
    if (changes.nzItemLayout) {
      this.itemLayoutNotifySource.next(this.nzItemLayout);
    }
  }
  ngAfterContentInit() {
    this.hasSomethingAfterLastItem = this.getSomethingAfterLastItem();
  }
  static ɵfac = function NzListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListComponent,
    selectors: [["nz-list"], ["", "nz-list", ""]],
    contentQueries: function NzListComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzListFooterComponent, 5);
        ɵɵcontentQuery(dirIndex, NzListPaginationComponent, 5);
        ɵɵcontentQuery(dirIndex, NzListLoadMoreDirective, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzListFooterComponent = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzListPaginationComponent = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nzListLoadMoreDirective = _t.first);
      }
    },
    hostAttrs: [1, "ant-list"],
    hostVars: 16,
    hostBindings: function NzListComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-list-rtl", ctx.dir === "rtl")("ant-list-vertical", ctx.nzItemLayout === "vertical")("ant-list-lg", ctx.nzSize === "large")("ant-list-sm", ctx.nzSize === "small")("ant-list-split", ctx.nzSplit)("ant-list-bordered", ctx.nzBordered)("ant-list-loading", ctx.nzLoading)("ant-list-something-after-last-item", ctx.hasSomethingAfterLastItem);
      }
    },
    inputs: {
      nzDataSource: "nzDataSource",
      nzBordered: [2, "nzBordered", "nzBordered", booleanAttribute],
      nzGrid: "nzGrid",
      nzHeader: "nzHeader",
      nzFooter: "nzFooter",
      nzItemLayout: "nzItemLayout",
      nzRenderItem: "nzRenderItem",
      nzLoading: [2, "nzLoading", "nzLoading", booleanAttribute],
      nzLoadMore: "nzLoadMore",
      nzPagination: "nzPagination",
      nzSize: "nzSize",
      nzSplit: [2, "nzSplit", "nzSplit", booleanAttribute],
      nzNoResult: "nzNoResult"
    },
    exportAs: ["nzList"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c5,
    decls: 14,
    vars: 8,
    consts: [[3, "nzSpinning"], [3, "min-height"], ["nz-row", "", 3, "nzGutter"], [1, "ant-list-items"], [3, "nzNoResult"], [3, "ngTemplateOutlet"], [4, "nzStringTemplateOutlet"], ["nz-col", "", 3, "nzSpan", "nzXs", "nzSm", "nzMd", "nzLg", "nzXl", "nzXXl"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"]],
    template: function NzListComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c4);
        ɵɵconditionalCreate(0, NzListComponent_Conditional_0_Template, 2, 1, "nz-list-header");
        ɵɵprojection(1);
        ɵɵelementStart(2, "nz-spin", 0);
        ɵɵelementContainerStart(3);
        ɵɵconditionalCreate(4, NzListComponent_Conditional_4_Template, 1, 2, "div", 1);
        ɵɵconditionalCreate(5, NzListComponent_Conditional_5_Template, 3, 1, "div", 2)(6, NzListComponent_Conditional_6_Template, 4, 0, "div", 3);
        ɵɵconditionalCreate(7, NzListComponent_Conditional_7_Template, 1, 1, "nz-list-empty", 4);
        ɵɵelementContainerEnd();
        ɵɵelementEnd();
        ɵɵconditionalCreate(8, NzListComponent_Conditional_8_Template, 2, 1, "nz-list-footer");
        ɵɵprojection(9, 1);
        ɵɵtemplate(10, NzListComponent_ng_template_10_Template, 0, 0, "ng-template", 5);
        ɵɵprojection(11, 2);
        ɵɵconditionalCreate(12, NzListComponent_Conditional_12_Template, 2, 1, "nz-list-pagination");
        ɵɵprojection(13, 3);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.nzHeader ? 0 : -1);
        ɵɵadvance(2);
        ɵɵproperty("nzSpinning", ctx.nzLoading);
        ɵɵadvance(2);
        ɵɵconditional(ctx.nzLoading && ctx.nzDataSource && ctx.nzDataSource.length === 0 ? 4 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.nzGrid && ctx.nzDataSource ? 5 : 6);
        ɵɵadvance(2);
        ɵɵconditional(!ctx.nzLoading && ctx.nzDataSource && ctx.nzDataSource.length === 0 ? 7 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.nzFooter ? 8 : -1);
        ɵɵadvance(2);
        ɵɵproperty("ngTemplateOutlet", ctx.nzLoadMore);
        ɵɵadvance(2);
        ɵɵconditional(ctx.nzPagination ? 12 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, NzListHeaderComponent, NzOutletModule, NzStringTemplateOutletDirective, NzSpinModule, NzSpinComponent, NzGridModule, NzColDirective, NzRowDirective, NzListEmptyComponent, NzListFooterComponent, NzListPaginationComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListComponent, [{
    type: Component,
    args: [{
      selector: "nz-list, [nz-list]",
      exportAs: "nzList",
      template: `
    @if (nzHeader) {
      <nz-list-header>
        <ng-container *nzStringTemplateOutlet="nzHeader">{{ nzHeader }}</ng-container>
      </nz-list-header>
    }

    <ng-content select="nz-list-header" />

    <nz-spin [nzSpinning]="nzLoading">
      <ng-container>
        @if (nzLoading && nzDataSource && nzDataSource.length === 0) {
          <div [style.min-height.px]="53"></div>
        }
        @if (nzGrid && nzDataSource) {
          <div nz-row [nzGutter]="nzGrid.gutter || null">
            @for (item of nzDataSource; track item; let index = $index) {
              <div
                nz-col
                [nzSpan]="nzGrid.span || null"
                [nzXs]="nzGrid.xs || null"
                [nzSm]="nzGrid.sm || null"
                [nzMd]="nzGrid.md || null"
                [nzLg]="nzGrid.lg || null"
                [nzXl]="nzGrid.xl || null"
                [nzXXl]="nzGrid.xxl || null"
              >
                <ng-template
                  [ngTemplateOutlet]="nzRenderItem"
                  [ngTemplateOutletContext]="{ $implicit: item, index: index }"
                />
              </div>
            }
          </div>
        } @else {
          <div class="ant-list-items">
            @for (item of nzDataSource; track item; let index = $index) {
              <ng-container>
                <ng-template
                  [ngTemplateOutlet]="nzRenderItem"
                  [ngTemplateOutletContext]="{ $implicit: item, index: index }"
                />
              </ng-container>
            }
            <ng-content />
          </div>
        }

        @if (!nzLoading && nzDataSource && nzDataSource.length === 0) {
          <nz-list-empty [nzNoResult]="nzNoResult" />
        }
      </ng-container>
    </nz-spin>

    @if (nzFooter) {
      <nz-list-footer>
        <ng-container *nzStringTemplateOutlet="nzFooter">{{ nzFooter }}</ng-container>
      </nz-list-footer>
    }

    <ng-content select="nz-list-footer, [nz-list-footer]" />

    <ng-template [ngTemplateOutlet]="nzLoadMore"></ng-template>
    <ng-content select="nz-list-load-more, [nz-list-load-more]" />

    @if (nzPagination) {
      <nz-list-pagination>
        <ng-template [ngTemplateOutlet]="nzPagination" />
      </nz-list-pagination>
    }

    <ng-content select="nz-list-pagination, [nz-list-pagination]" />
  `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "ant-list",
        "[class.ant-list-rtl]": `dir === 'rtl'`,
        "[class.ant-list-vertical]": 'nzItemLayout === "vertical"',
        "[class.ant-list-lg]": 'nzSize === "large"',
        "[class.ant-list-sm]": 'nzSize === "small"',
        "[class.ant-list-split]": "nzSplit",
        "[class.ant-list-bordered]": "nzBordered",
        "[class.ant-list-loading]": "nzLoading",
        "[class.ant-list-something-after-last-item]": "hasSomethingAfterLastItem"
      },
      imports: [NgTemplateOutlet, NzListHeaderComponent, NzOutletModule, NzSpinModule, NzGridModule, NzListEmptyComponent, NzListFooterComponent, NzListPaginationComponent]
    }]
  }], () => [], {
    nzDataSource: [{
      type: Input
    }],
    nzBordered: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzGrid: [{
      type: Input
    }],
    nzHeader: [{
      type: Input
    }],
    nzFooter: [{
      type: Input
    }],
    nzItemLayout: [{
      type: Input
    }],
    nzRenderItem: [{
      type: Input
    }],
    nzLoading: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzLoadMore: [{
      type: Input
    }],
    nzPagination: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    nzSplit: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzNoResult: [{
      type: Input
    }],
    nzListFooterComponent: [{
      type: ContentChild,
      args: [NzListFooterComponent]
    }],
    nzListPaginationComponent: [{
      type: ContentChild,
      args: [NzListPaginationComponent]
    }],
    nzListLoadMoreDirective: [{
      type: ContentChild,
      args: [NzListLoadMoreDirective]
    }]
  });
})();
var NzListItemComponent = class _NzListItemComponent {
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  parentComp = inject(NzListComponent);
  nzActions = [];
  nzContent;
  nzExtra = null;
  nzNoFlex = false;
  listItemExtraDirective;
  itemLayout;
  get isVerticalAndExtra() {
    return this.itemLayout === "vertical" && (!!this.listItemExtraDirective || !!this.nzExtra);
  }
  ngAfterViewInit() {
    this.parentComp.itemLayoutNotify$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      this.itemLayout = val;
      this.cdr.detectChanges();
    });
  }
  static ɵfac = function NzListItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListItemComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzListItemComponent,
    selectors: [["nz-list-item"], ["", "nz-list-item", ""]],
    contentQueries: function NzListItemComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, NzListItemExtraComponent, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.listItemExtraDirective = _t.first);
      }
    },
    hostAttrs: [1, "ant-list-item"],
    hostVars: 2,
    hostBindings: function NzListItemComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-list-item-no-flex", ctx.nzNoFlex);
      }
    },
    inputs: {
      nzActions: "nzActions",
      nzContent: "nzContent",
      nzExtra: "nzExtra",
      nzNoFlex: [2, "nzNoFlex", "nzNoFlex", booleanAttribute]
    },
    exportAs: ["nzListItem"],
    ngContentSelectors: _c8,
    decls: 8,
    vars: 1,
    consts: [["actionsTpl", ""], ["contentTpl", ""], ["extraTpl", ""], ["nz-list-item-actions", "", 3, "nzActions"], [4, "nzStringTemplateOutlet"], [1, "ant-list-item-main"], [3, "ngTemplateOutlet"]],
    template: function NzListItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c7);
        ɵɵtemplate(0, NzListItemComponent_ng_template_0_Template, 2, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, NzListItemComponent_ng_template_2_Template, 3, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, NzListItemComponent_ng_template_4_Template, 1, 0, "ng-template", null, 2, ɵɵtemplateRefExtractor);
        ɵɵconditionalCreate(6, NzListItemComponent_Conditional_6_Template, 5, 4)(7, NzListItemComponent_Conditional_7_Template, 4, 4);
      }
      if (rf & 2) {
        ɵɵadvance(6);
        ɵɵconditional(ctx.isVerticalAndExtra ? 6 : 7);
      }
    },
    dependencies: [NzListItemActionsComponent, NzOutletModule, NzStringTemplateOutletDirective, NgTemplateOutlet, NzListItemExtraComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListItemComponent, [{
    type: Component,
    args: [{
      selector: "nz-list-item, [nz-list-item]",
      exportAs: "nzListItem",
      template: `
    <ng-template #actionsTpl>
      @if (nzActions && nzActions.length > 0) {
        <ul nz-list-item-actions [nzActions]="nzActions"></ul>
      }
      <ng-content select="nz-list-item-actions, [nz-list-item-actions]" />
    </ng-template>
    <ng-template #contentTpl>
      <ng-content select="nz-list-item-meta, [nz-list-item-meta]" />
      <ng-content />
      @if (nzContent) {
        <ng-container *nzStringTemplateOutlet="nzContent">{{ nzContent }}</ng-container>
      }
    </ng-template>
    <ng-template #extraTpl>
      <ng-content select="nz-list-item-extra, [nz-list-item-extra]" />
    </ng-template>

    @if (isVerticalAndExtra) {
      <div class="ant-list-item-main">
        <ng-template [ngTemplateOutlet]="contentTpl" />
        <ng-template [ngTemplateOutlet]="actionsTpl" />
      </div>
      @if (nzExtra) {
        <nz-list-item-extra>
          <ng-template [ngTemplateOutlet]="nzExtra" />
        </nz-list-item-extra>
      }
      <ng-template [ngTemplateOutlet]="extraTpl" />
    } @else {
      <ng-template [ngTemplateOutlet]="contentTpl" />
      <ng-template [ngTemplateOutlet]="nzExtra" />
      <ng-template [ngTemplateOutlet]="extraTpl" />
      <ng-template [ngTemplateOutlet]="actionsTpl" />
    }
  `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "ant-list-item"
      },
      imports: [NzListItemActionsComponent, NzOutletModule, NgTemplateOutlet, NzListItemExtraComponent]
    }]
  }], null, {
    nzActions: [{
      type: Input
    }],
    nzContent: [{
      type: Input
    }],
    nzExtra: [{
      type: Input
    }],
    nzNoFlex: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }, {
      type: HostBinding,
      args: ["class.ant-list-item-no-flex"]
    }],
    listItemExtraDirective: [{
      type: ContentChild,
      args: [NzListItemExtraComponent]
    }]
  });
})();
var DIRECTIVES = [NzListComponent, NzListHeaderComponent, NzListFooterComponent, NzListPaginationComponent, NzListEmptyComponent, NzListItemComponent, NzListItemMetaComponent, NzListItemMetaTitleComponent, NzListItemMetaDescriptionComponent, NzListItemMetaAvatarComponent, NzListItemActionsComponent, NzListItemActionComponent, NzListItemExtraComponent, NzListLoadMoreDirective, NzListGridDirective];
var NzListModule = class _NzListModule {
  static ɵfac = function NzListModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzListModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzListModule,
    imports: [NzListComponent, NzListHeaderComponent, NzListFooterComponent, NzListPaginationComponent, NzListEmptyComponent, NzListItemComponent, NzListItemMetaComponent, NzListItemMetaTitleComponent, NzListItemMetaDescriptionComponent, NzListItemMetaAvatarComponent, NzListItemActionsComponent, NzListItemActionComponent, NzListItemExtraComponent, NzListLoadMoreDirective, NzListGridDirective],
    exports: [NzListComponent, NzListHeaderComponent, NzListFooterComponent, NzListPaginationComponent, NzListEmptyComponent, NzListItemComponent, NzListItemMetaComponent, NzListItemMetaTitleComponent, NzListItemMetaDescriptionComponent, NzListItemMetaAvatarComponent, NzListItemActionsComponent, NzListItemActionComponent, NzListItemExtraComponent, NzListLoadMoreDirective, NzListGridDirective]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzListComponent, NzListEmptyComponent, NzListItemComponent, NzListItemMetaComponent, NzListItemMetaAvatarComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzListModule, [{
    type: NgModule,
    args: [{
      imports: [DIRECTIVES],
      exports: [DIRECTIVES]
    }]
  }], null, null);
})();
export {
  NzListComponent,
  NzListEmptyComponent,
  NzListFooterComponent,
  NzListGridDirective,
  NzListHeaderComponent,
  NzListItemActionComponent,
  NzListItemActionsComponent,
  NzListItemComponent,
  NzListItemExtraComponent,
  NzListItemMetaAvatarComponent,
  NzListItemMetaComponent,
  NzListItemMetaDescriptionComponent,
  NzListItemMetaTitleComponent,
  NzListLoadMoreDirective,
  NzListModule,
  NzListPaginationComponent
};
//# sourceMappingURL=ng-zorro-antd_list.js.map
