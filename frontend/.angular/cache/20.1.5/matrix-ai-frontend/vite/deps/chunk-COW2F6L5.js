// node_modules/.pnpm/@angular+common@20.1.6_@ang_1660a228da4df96be88b2fa385a5db20/node_modules/@angular/common/fesm2022/xhr.mjs
function parseCookieValue(cookieStr, name) {
  name = encodeURIComponent(name);
  for (const cookie of cookieStr.split(";")) {
    const eqIndex = cookie.indexOf("=");
    const [cookieName, cookieValue] = eqIndex == -1 ? [cookie, ""] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)];
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
var XhrFactory = class {
};

export {
  parseCookieValue,
  XhrFactory
};
/*! Bundled license information:

@angular/common/fesm2022/xhr.mjs:
  (**
   * @license Angular v20.1.6
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-COW2F6L5.js.map
