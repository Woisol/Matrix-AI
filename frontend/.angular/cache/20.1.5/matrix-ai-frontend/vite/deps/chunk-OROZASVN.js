// node_modules/.pnpm/@angular+cdk@20.1.5_@angula_cd3470c2f7c3a0954e1dd4ac59cbeb74/node_modules/@angular/cdk/fesm2022/keycodes-CpHkExLC.mjs
var BACKSPACE = 8;
var TAB = 9;
var ENTER = 13;
var SHIFT = 16;
var CONTROL = 17;
var ALT = 18;
var ESCAPE = 27;
var SPACE = 32;
var PAGE_UP = 33;
var PAGE_DOWN = 34;
var END = 35;
var HOME = 36;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var ZERO = 48;
var NINE = 57;
var A = 65;
var Z = 90;
var META = 91;
var MAC_META = 224;

// node_modules/.pnpm/@angular+cdk@20.1.5_@angula_cd3470c2f7c3a0954e1dd4ac59cbeb74/node_modules/@angular/cdk/fesm2022/keycodes.mjs
function hasModifierKey(event, ...modifiers) {
  if (modifiers.length) {
    return modifiers.some((modifier) => event[modifier]);
  }
  return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
}

export {
  BACKSPACE,
  TAB,
  ENTER,
  SHIFT,
  CONTROL,
  ALT,
  ESCAPE,
  SPACE,
  PAGE_UP,
  PAGE_DOWN,
  END,
  HOME,
  LEFT_ARROW,
  UP_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  ZERO,
  NINE,
  A,
  Z,
  META,
  MAC_META,
  hasModifierKey
};
//# sourceMappingURL=chunk-OROZASVN.js.map
