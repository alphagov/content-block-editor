import { m as Et } from "./content-block-editor-DPU20POg.js";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var Lt = Object.defineProperty, Ot = Object.getOwnPropertyDescriptor, Nt = Object.getOwnPropertyNames, Rt = Object.prototype.hasOwnProperty, Mt = (e, r, i, n) => {
  if (r && typeof r == "object" || typeof r == "function")
    for (let t of Nt(r))
      !Rt.call(e, t) && t !== i && Lt(e, t, { get: () => r[t], enumerable: !(n = Ot(r, t)) || n.enumerable });
  return e;
}, Dt = (e, r, i) => (Mt(e, r, "default"), i), f = {};
Dt(f, Et);
var Ft = 2 * 60 * 1e3, Ut = class {
  constructor(e) {
    this._defaults = e, this._worker = null, this._client = null, this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1e3), this._lastUsedTime = 0, this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
  }
  _stopWorker() {
    this._worker && (this._worker.dispose(), this._worker = null), this._client = null;
  }
  dispose() {
    clearInterval(this._idleCheckInterval), this._configChangeListener.dispose(), this._stopWorker();
  }
  _checkIfIdle() {
    if (!this._worker)
      return;
    Date.now() - this._lastUsedTime > Ft && this._stopWorker();
  }
  _getClient() {
    return this._lastUsedTime = Date.now(), this._client || (this._worker = f.editor.createWebWorker({
      // module that exports the create() method and returns a `JSONWorker` instance
      moduleId: "vs/language/json/jsonWorker",
      label: this._defaults.languageId,
      // passed in to the create() method
      createData: {
        languageSettings: this._defaults.diagnosticsOptions,
        languageId: this._defaults.languageId,
        enableSchemaRequest: this._defaults.diagnosticsOptions.enableSchemaRequest
      }
    }), this._client = this._worker.getProxy()), this._client;
  }
  getLanguageServiceWorker(...e) {
    let r;
    return this._getClient().then((i) => {
      r = i;
    }).then((i) => {
      if (this._worker)
        return this._worker.withSyncedResources(e);
    }).then((i) => r);
  }
}, le;
(function(e) {
  function r(i) {
    return typeof i == "string";
  }
  e.is = r;
})(le || (le = {}));
var Q;
(function(e) {
  function r(i) {
    return typeof i == "string";
  }
  e.is = r;
})(Q || (Q = {}));
var fe;
(function(e) {
  e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647;
  function r(i) {
    return typeof i == "number" && e.MIN_VALUE <= i && i <= e.MAX_VALUE;
  }
  e.is = r;
})(fe || (fe = {}));
var W;
(function(e) {
  e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647;
  function r(i) {
    return typeof i == "number" && e.MIN_VALUE <= i && i <= e.MAX_VALUE;
  }
  e.is = r;
})(W || (W = {}));
var O;
(function(e) {
  function r(n, t) {
    return n === Number.MAX_VALUE && (n = W.MAX_VALUE), t === Number.MAX_VALUE && (t = W.MAX_VALUE), { line: n, character: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.objectLiteral(t) && a.uinteger(t.line) && a.uinteger(t.character);
  }
  e.is = i;
})(O || (O = {}));
var m;
(function(e) {
  function r(n, t, o, s) {
    if (a.uinteger(n) && a.uinteger(t) && a.uinteger(o) && a.uinteger(s))
      return { start: O.create(n, t), end: O.create(o, s) };
    if (O.is(n) && O.is(t))
      return { start: n, end: t };
    throw new Error(`Range#create called with invalid arguments[${n}, ${t}, ${o}, ${s}]`);
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.objectLiteral(t) && O.is(t.start) && O.is(t.end);
  }
  e.is = i;
})(m || (m = {}));
var H;
(function(e) {
  function r(n, t) {
    return { uri: n, range: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.objectLiteral(t) && m.is(t.range) && (a.string(t.uri) || a.undefined(t.uri));
  }
  e.is = i;
})(H || (H = {}));
var de;
(function(e) {
  function r(n, t, o, s) {
    return { targetUri: n, targetRange: t, targetSelectionRange: o, originSelectionRange: s };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.objectLiteral(t) && m.is(t.targetRange) && a.string(t.targetUri) && m.is(t.targetSelectionRange) && (m.is(t.originSelectionRange) || a.undefined(t.originSelectionRange));
  }
  e.is = i;
})(de || (de = {}));
var Y;
(function(e) {
  function r(n, t, o, s) {
    return {
      red: n,
      green: t,
      blue: o,
      alpha: s
    };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && a.numberRange(t.red, 0, 1) && a.numberRange(t.green, 0, 1) && a.numberRange(t.blue, 0, 1) && a.numberRange(t.alpha, 0, 1);
  }
  e.is = i;
})(Y || (Y = {}));
var ge;
(function(e) {
  function r(n, t) {
    return {
      range: n,
      color: t
    };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && m.is(t.range) && Y.is(t.color);
  }
  e.is = i;
})(ge || (ge = {}));
var pe;
(function(e) {
  function r(n, t, o) {
    return {
      label: n,
      textEdit: t,
      additionalTextEdits: o
    };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && a.string(t.label) && (a.undefined(t.textEdit) || T.is(t)) && (a.undefined(t.additionalTextEdits) || a.typedArray(t.additionalTextEdits, T.is));
  }
  e.is = i;
})(pe || (pe = {}));
var P;
(function(e) {
  e.Comment = "comment", e.Imports = "imports", e.Region = "region";
})(P || (P = {}));
var ve;
(function(e) {
  function r(n, t, o, s, u, g) {
    const c = {
      startLine: n,
      endLine: t
    };
    return a.defined(o) && (c.startCharacter = o), a.defined(s) && (c.endCharacter = s), a.defined(u) && (c.kind = u), a.defined(g) && (c.collapsedText = g), c;
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && a.uinteger(t.startLine) && a.uinteger(t.startLine) && (a.undefined(t.startCharacter) || a.uinteger(t.startCharacter)) && (a.undefined(t.endCharacter) || a.uinteger(t.endCharacter)) && (a.undefined(t.kind) || a.string(t.kind));
  }
  e.is = i;
})(ve || (ve = {}));
var G;
(function(e) {
  function r(n, t) {
    return {
      location: n,
      message: t
    };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && H.is(t.location) && a.string(t.message);
  }
  e.is = i;
})(G || (G = {}));
var F;
(function(e) {
  e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
})(F || (F = {}));
var me;
(function(e) {
  e.Unnecessary = 1, e.Deprecated = 2;
})(me || (me = {}));
var he;
(function(e) {
  function r(i) {
    const n = i;
    return a.objectLiteral(n) && a.string(n.href);
  }
  e.is = r;
})(he || (he = {}));
var z;
(function(e) {
  function r(n, t, o, s, u, g) {
    let c = { range: n, message: t };
    return a.defined(o) && (c.severity = o), a.defined(s) && (c.code = s), a.defined(u) && (c.source = u), a.defined(g) && (c.relatedInformation = g), c;
  }
  e.create = r;
  function i(n) {
    var t;
    let o = n;
    return a.defined(o) && m.is(o.range) && a.string(o.message) && (a.number(o.severity) || a.undefined(o.severity)) && (a.integer(o.code) || a.string(o.code) || a.undefined(o.code)) && (a.undefined(o.codeDescription) || a.string((t = o.codeDescription) === null || t === void 0 ? void 0 : t.href)) && (a.string(o.source) || a.undefined(o.source)) && (a.undefined(o.relatedInformation) || a.typedArray(o.relatedInformation, G.is));
  }
  e.is = i;
})(z || (z = {}));
var U;
(function(e) {
  function r(n, t, ...o) {
    let s = { title: n, command: t };
    return a.defined(o) && o.length > 0 && (s.arguments = o), s;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.string(t.title) && a.string(t.command);
  }
  e.is = i;
})(U || (U = {}));
var T;
(function(e) {
  function r(o, s) {
    return { range: o, newText: s };
  }
  e.replace = r;
  function i(o, s) {
    return { range: { start: o, end: o }, newText: s };
  }
  e.insert = i;
  function n(o) {
    return { range: o, newText: "" };
  }
  e.del = n;
  function t(o) {
    const s = o;
    return a.objectLiteral(s) && a.string(s.newText) && m.is(s.range);
  }
  e.is = t;
})(T || (T = {}));
var Z;
(function(e) {
  function r(n, t, o) {
    const s = { label: n };
    return t !== void 0 && (s.needsConfirmation = t), o !== void 0 && (s.description = o), s;
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && a.string(t.label) && (a.boolean(t.needsConfirmation) || t.needsConfirmation === void 0) && (a.string(t.description) || t.description === void 0);
  }
  e.is = i;
})(Z || (Z = {}));
var j;
(function(e) {
  function r(i) {
    const n = i;
    return a.string(n);
  }
  e.is = r;
})(j || (j = {}));
var _e;
(function(e) {
  function r(o, s, u) {
    return { range: o, newText: s, annotationId: u };
  }
  e.replace = r;
  function i(o, s, u) {
    return { range: { start: o, end: o }, newText: s, annotationId: u };
  }
  e.insert = i;
  function n(o, s) {
    return { range: o, newText: "", annotationId: s };
  }
  e.del = n;
  function t(o) {
    const s = o;
    return T.is(s) && (Z.is(s.annotationId) || j.is(s.annotationId));
  }
  e.is = t;
})(_e || (_e = {}));
var K;
(function(e) {
  function r(n, t) {
    return { textDocument: n, edits: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && re.is(t.textDocument) && Array.isArray(t.edits);
  }
  e.is = i;
})(K || (K = {}));
var C;
(function(e) {
  function r(n, t, o) {
    let s = {
      kind: "create",
      uri: n
    };
    return t !== void 0 && (t.overwrite !== void 0 || t.ignoreIfExists !== void 0) && (s.options = t), o !== void 0 && (s.annotationId = o), s;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return t && t.kind === "create" && a.string(t.uri) && (t.options === void 0 || (t.options.overwrite === void 0 || a.boolean(t.options.overwrite)) && (t.options.ignoreIfExists === void 0 || a.boolean(t.options.ignoreIfExists))) && (t.annotationId === void 0 || j.is(t.annotationId));
  }
  e.is = i;
})(C || (C = {}));
var ee;
(function(e) {
  function r(n, t, o, s) {
    let u = {
      kind: "rename",
      oldUri: n,
      newUri: t
    };
    return o !== void 0 && (o.overwrite !== void 0 || o.ignoreIfExists !== void 0) && (u.options = o), s !== void 0 && (u.annotationId = s), u;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return t && t.kind === "rename" && a.string(t.oldUri) && a.string(t.newUri) && (t.options === void 0 || (t.options.overwrite === void 0 || a.boolean(t.options.overwrite)) && (t.options.ignoreIfExists === void 0 || a.boolean(t.options.ignoreIfExists))) && (t.annotationId === void 0 || j.is(t.annotationId));
  }
  e.is = i;
})(ee || (ee = {}));
var te;
(function(e) {
  function r(n, t, o) {
    let s = {
      kind: "delete",
      uri: n
    };
    return t !== void 0 && (t.recursive !== void 0 || t.ignoreIfNotExists !== void 0) && (s.options = t), o !== void 0 && (s.annotationId = o), s;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return t && t.kind === "delete" && a.string(t.uri) && (t.options === void 0 || (t.options.recursive === void 0 || a.boolean(t.options.recursive)) && (t.options.ignoreIfNotExists === void 0 || a.boolean(t.options.ignoreIfNotExists))) && (t.annotationId === void 0 || j.is(t.annotationId));
  }
  e.is = i;
})(te || (te = {}));
var ne;
(function(e) {
  function r(i) {
    let n = i;
    return n && (n.changes !== void 0 || n.documentChanges !== void 0) && (n.documentChanges === void 0 || n.documentChanges.every((t) => a.string(t.kind) ? C.is(t) || ee.is(t) || te.is(t) : K.is(t)));
  }
  e.is = r;
})(ne || (ne = {}));
var ke;
(function(e) {
  function r(n) {
    return { uri: n };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.string(t.uri);
  }
  e.is = i;
})(ke || (ke = {}));
var be;
(function(e) {
  function r(n, t) {
    return { uri: n, version: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.string(t.uri) && a.integer(t.version);
  }
  e.is = i;
})(be || (be = {}));
var re;
(function(e) {
  function r(n, t) {
    return { uri: n, version: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.string(t.uri) && (t.version === null || a.integer(t.version));
  }
  e.is = i;
})(re || (re = {}));
var we;
(function(e) {
  function r(n, t, o, s) {
    return { uri: n, languageId: t, version: o, text: s };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.string(t.uri) && a.string(t.languageId) && a.integer(t.version) && a.string(t.text);
  }
  e.is = i;
})(we || (we = {}));
var ie;
(function(e) {
  e.PlainText = "plaintext", e.Markdown = "markdown";
  function r(i) {
    const n = i;
    return n === e.PlainText || n === e.Markdown;
  }
  e.is = r;
})(ie || (ie = {}));
var S;
(function(e) {
  function r(i) {
    const n = i;
    return a.objectLiteral(i) && ie.is(n.kind) && a.string(n.value);
  }
  e.is = r;
})(S || (S = {}));
var h;
(function(e) {
  e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
})(h || (h = {}));
var oe;
(function(e) {
  e.PlainText = 1, e.Snippet = 2;
})(oe || (oe = {}));
var Ae;
(function(e) {
  e.Deprecated = 1;
})(Ae || (Ae = {}));
var Ie;
(function(e) {
  function r(n, t, o) {
    return { newText: n, insert: t, replace: o };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return t && a.string(t.newText) && m.is(t.insert) && m.is(t.replace);
  }
  e.is = i;
})(Ie || (Ie = {}));
var Ee;
(function(e) {
  e.asIs = 1, e.adjustIndentation = 2;
})(Ee || (Ee = {}));
var Le;
(function(e) {
  function r(i) {
    const n = i;
    return n && (a.string(n.detail) || n.detail === void 0) && (a.string(n.description) || n.description === void 0);
  }
  e.is = r;
})(Le || (Le = {}));
var Oe;
(function(e) {
  function r(i) {
    return { label: i };
  }
  e.create = r;
})(Oe || (Oe = {}));
var Ne;
(function(e) {
  function r(i, n) {
    return { items: i || [], isIncomplete: !!n };
  }
  e.create = r;
})(Ne || (Ne = {}));
var X;
(function(e) {
  function r(n) {
    return n.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  e.fromPlainText = r;
  function i(n) {
    const t = n;
    return a.string(t) || a.objectLiteral(t) && a.string(t.language) && a.string(t.value);
  }
  e.is = i;
})(X || (X = {}));
var Re;
(function(e) {
  function r(i) {
    let n = i;
    return !!n && a.objectLiteral(n) && (S.is(n.contents) || X.is(n.contents) || a.typedArray(n.contents, X.is)) && (i.range === void 0 || m.is(i.range));
  }
  e.is = r;
})(Re || (Re = {}));
var Me;
(function(e) {
  function r(i, n) {
    return n ? { label: i, documentation: n } : { label: i };
  }
  e.create = r;
})(Me || (Me = {}));
var De;
(function(e) {
  function r(i, n, ...t) {
    let o = { label: i };
    return a.defined(n) && (o.documentation = n), a.defined(t) ? o.parameters = t : o.parameters = [], o;
  }
  e.create = r;
})(De || (De = {}));
var V;
(function(e) {
  e.Text = 1, e.Read = 2, e.Write = 3;
})(V || (V = {}));
var Fe;
(function(e) {
  function r(i, n) {
    let t = { range: i };
    return a.number(n) && (t.kind = n), t;
  }
  e.create = r;
})(Fe || (Fe = {}));
var _;
(function(e) {
  e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
})(_ || (_ = {}));
var Ue;
(function(e) {
  e.Deprecated = 1;
})(Ue || (Ue = {}));
var Te;
(function(e) {
  function r(i, n, t, o, s) {
    let u = {
      name: i,
      kind: n,
      location: { uri: o, range: t }
    };
    return s && (u.containerName = s), u;
  }
  e.create = r;
})(Te || (Te = {}));
var je;
(function(e) {
  function r(i, n, t, o) {
    return o !== void 0 ? { name: i, kind: n, location: { uri: t, range: o } } : { name: i, kind: n, location: { uri: t } };
  }
  e.create = r;
})(je || (je = {}));
var xe;
(function(e) {
  function r(n, t, o, s, u, g) {
    let c = {
      name: n,
      detail: t,
      kind: o,
      range: s,
      selectionRange: u
    };
    return g !== void 0 && (c.children = g), c;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return t && a.string(t.name) && a.number(t.kind) && m.is(t.range) && m.is(t.selectionRange) && (t.detail === void 0 || a.string(t.detail)) && (t.deprecated === void 0 || a.boolean(t.deprecated)) && (t.children === void 0 || Array.isArray(t.children)) && (t.tags === void 0 || Array.isArray(t.tags));
  }
  e.is = i;
})(xe || (xe = {}));
var ye;
(function(e) {
  e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
})(ye || (ye = {}));
var q;
(function(e) {
  e.Invoked = 1, e.Automatic = 2;
})(q || (q = {}));
var Pe;
(function(e) {
  function r(n, t, o) {
    let s = { diagnostics: n };
    return t != null && (s.only = t), o != null && (s.triggerKind = o), s;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.typedArray(t.diagnostics, z.is) && (t.only === void 0 || a.typedArray(t.only, a.string)) && (t.triggerKind === void 0 || t.triggerKind === q.Invoked || t.triggerKind === q.Automatic);
  }
  e.is = i;
})(Pe || (Pe = {}));
var Ve;
(function(e) {
  function r(n, t, o) {
    let s = { title: n }, u = !0;
    return typeof t == "string" ? (u = !1, s.kind = t) : U.is(t) ? s.command = t : s.edit = t, u && o !== void 0 && (s.kind = o), s;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return t && a.string(t.title) && (t.diagnostics === void 0 || a.typedArray(t.diagnostics, z.is)) && (t.kind === void 0 || a.string(t.kind)) && (t.edit !== void 0 || t.command !== void 0) && (t.command === void 0 || U.is(t.command)) && (t.isPreferred === void 0 || a.boolean(t.isPreferred)) && (t.edit === void 0 || ne.is(t.edit));
  }
  e.is = i;
})(Ve || (Ve = {}));
var Se;
(function(e) {
  function r(n, t) {
    let o = { range: n };
    return a.defined(t) && (o.data = t), o;
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && m.is(t.range) && (a.undefined(t.command) || U.is(t.command));
  }
  e.is = i;
})(Se || (Se = {}));
var Be;
(function(e) {
  function r(n, t) {
    return { tabSize: n, insertSpaces: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && a.uinteger(t.tabSize) && a.boolean(t.insertSpaces);
  }
  e.is = i;
})(Be || (Be = {}));
var We;
(function(e) {
  function r(n, t, o) {
    return { range: n, target: t, data: o };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.defined(t) && m.is(t.range) && (a.undefined(t.target) || a.string(t.target));
  }
  e.is = i;
})(We || (We = {}));
var He;
(function(e) {
  function r(n, t) {
    return { range: n, parent: t };
  }
  e.create = r;
  function i(n) {
    let t = n;
    return a.objectLiteral(t) && m.is(t.range) && (t.parent === void 0 || e.is(t.parent));
  }
  e.is = i;
})(He || (He = {}));
var ze;
(function(e) {
  e.namespace = "namespace", e.type = "type", e.class = "class", e.enum = "enum", e.interface = "interface", e.struct = "struct", e.typeParameter = "typeParameter", e.parameter = "parameter", e.variable = "variable", e.property = "property", e.enumMember = "enumMember", e.event = "event", e.function = "function", e.method = "method", e.macro = "macro", e.keyword = "keyword", e.modifier = "modifier", e.comment = "comment", e.string = "string", e.number = "number", e.regexp = "regexp", e.operator = "operator", e.decorator = "decorator";
})(ze || (ze = {}));
var Xe;
(function(e) {
  e.declaration = "declaration", e.definition = "definition", e.readonly = "readonly", e.static = "static", e.deprecated = "deprecated", e.abstract = "abstract", e.async = "async", e.modification = "modification", e.documentation = "documentation", e.defaultLibrary = "defaultLibrary";
})(Xe || (Xe = {}));
var qe;
(function(e) {
  function r(i) {
    const n = i;
    return a.objectLiteral(n) && (n.resultId === void 0 || typeof n.resultId == "string") && Array.isArray(n.data) && (n.data.length === 0 || typeof n.data[0] == "number");
  }
  e.is = r;
})(qe || (qe = {}));
var Je;
(function(e) {
  function r(n, t) {
    return { range: n, text: t };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return t != null && m.is(t.range) && a.string(t.text);
  }
  e.is = i;
})(Je || (Je = {}));
var $e;
(function(e) {
  function r(n, t, o) {
    return { range: n, variableName: t, caseSensitiveLookup: o };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return t != null && m.is(t.range) && a.boolean(t.caseSensitiveLookup) && (a.string(t.variableName) || t.variableName === void 0);
  }
  e.is = i;
})($e || ($e = {}));
var Qe;
(function(e) {
  function r(n, t) {
    return { range: n, expression: t };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return t != null && m.is(t.range) && (a.string(t.expression) || t.expression === void 0);
  }
  e.is = i;
})(Qe || (Qe = {}));
var Ye;
(function(e) {
  function r(n, t) {
    return { frameId: n, stoppedLocation: t };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.defined(t) && m.is(n.stoppedLocation);
  }
  e.is = i;
})(Ye || (Ye = {}));
var se;
(function(e) {
  e.Type = 1, e.Parameter = 2;
  function r(i) {
    return i === 1 || i === 2;
  }
  e.is = r;
})(se || (se = {}));
var ae;
(function(e) {
  function r(n) {
    return { value: n };
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && (t.tooltip === void 0 || a.string(t.tooltip) || S.is(t.tooltip)) && (t.location === void 0 || H.is(t.location)) && (t.command === void 0 || U.is(t.command));
  }
  e.is = i;
})(ae || (ae = {}));
var Ge;
(function(e) {
  function r(n, t, o) {
    const s = { position: n, label: t };
    return o !== void 0 && (s.kind = o), s;
  }
  e.create = r;
  function i(n) {
    const t = n;
    return a.objectLiteral(t) && O.is(t.position) && (a.string(t.label) || a.typedArray(t.label, ae.is)) && (t.kind === void 0 || se.is(t.kind)) && t.textEdits === void 0 || a.typedArray(t.textEdits, T.is) && (t.tooltip === void 0 || a.string(t.tooltip) || S.is(t.tooltip)) && (t.paddingLeft === void 0 || a.boolean(t.paddingLeft)) && (t.paddingRight === void 0 || a.boolean(t.paddingRight));
  }
  e.is = i;
})(Ge || (Ge = {}));
var Ze;
(function(e) {
  function r(i) {
    return { kind: "snippet", value: i };
  }
  e.createSnippet = r;
})(Ze || (Ze = {}));
var Ke;
(function(e) {
  function r(i, n, t, o) {
    return { insertText: i, filterText: n, range: t, command: o };
  }
  e.create = r;
})(Ke || (Ke = {}));
var Ce;
(function(e) {
  function r(i) {
    return { items: i };
  }
  e.create = r;
})(Ce || (Ce = {}));
var et;
(function(e) {
  e.Invoked = 0, e.Automatic = 1;
})(et || (et = {}));
var tt;
(function(e) {
  function r(i, n) {
    return { range: i, text: n };
  }
  e.create = r;
})(tt || (tt = {}));
var nt;
(function(e) {
  function r(i, n) {
    return { triggerKind: i, selectedCompletionInfo: n };
  }
  e.create = r;
})(nt || (nt = {}));
var rt;
(function(e) {
  function r(i) {
    const n = i;
    return a.objectLiteral(n) && Q.is(n.uri) && a.string(n.name);
  }
  e.is = r;
})(rt || (rt = {}));
var it;
(function(e) {
  function r(o, s, u, g) {
    return new Tt(o, s, u, g);
  }
  e.create = r;
  function i(o) {
    let s = o;
    return !!(a.defined(s) && a.string(s.uri) && (a.undefined(s.languageId) || a.string(s.languageId)) && a.uinteger(s.lineCount) && a.func(s.getText) && a.func(s.positionAt) && a.func(s.offsetAt));
  }
  e.is = i;
  function n(o, s) {
    let u = o.getText(), g = t(s, (v, d) => {
      let k = v.range.start.line - d.range.start.line;
      return k === 0 ? v.range.start.character - d.range.start.character : k;
    }), c = u.length;
    for (let v = g.length - 1; v >= 0; v--) {
      let d = g[v], k = o.offsetAt(d.range.start), p = o.offsetAt(d.range.end);
      if (p <= c)
        u = u.substring(0, k) + d.newText + u.substring(p, u.length);
      else
        throw new Error("Overlapping edit");
      c = k;
    }
    return u;
  }
  e.applyEdits = n;
  function t(o, s) {
    if (o.length <= 1)
      return o;
    const u = o.length / 2 | 0, g = o.slice(0, u), c = o.slice(u);
    t(g, s), t(c, s);
    let v = 0, d = 0, k = 0;
    for (; v < g.length && d < c.length; )
      s(g[v], c[d]) <= 0 ? o[k++] = g[v++] : o[k++] = c[d++];
    for (; v < g.length; )
      o[k++] = g[v++];
    for (; d < c.length; )
      o[k++] = c[d++];
    return o;
  }
})(it || (it = {}));
var Tt = class {
  constructor(e, r, i, n) {
    this._uri = e, this._languageId = r, this._version = i, this._content = n, this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(e) {
    if (e) {
      let r = this.offsetAt(e.start), i = this.offsetAt(e.end);
      return this._content.substring(r, i);
    }
    return this._content;
  }
  update(e, r) {
    this._content = e.text, this._version = r, this._lineOffsets = void 0;
  }
  getLineOffsets() {
    if (this._lineOffsets === void 0) {
      let e = [], r = this._content, i = !0;
      for (let n = 0; n < r.length; n++) {
        i && (e.push(n), i = !1);
        let t = r.charAt(n);
        i = t === "\r" || t === `
`, t === "\r" && n + 1 < r.length && r.charAt(n + 1) === `
` && n++;
      }
      i && r.length > 0 && e.push(r.length), this._lineOffsets = e;
    }
    return this._lineOffsets;
  }
  positionAt(e) {
    e = Math.max(Math.min(e, this._content.length), 0);
    let r = this.getLineOffsets(), i = 0, n = r.length;
    if (n === 0)
      return O.create(0, e);
    for (; i < n; ) {
      let o = Math.floor((i + n) / 2);
      r[o] > e ? n = o : i = o + 1;
    }
    let t = i - 1;
    return O.create(t, e - r[t]);
  }
  offsetAt(e) {
    let r = this.getLineOffsets();
    if (e.line >= r.length)
      return this._content.length;
    if (e.line < 0)
      return 0;
    let i = r[e.line], n = e.line + 1 < r.length ? r[e.line + 1] : this._content.length;
    return Math.max(Math.min(i + e.character, n), i);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
}, a;
(function(e) {
  const r = Object.prototype.toString;
  function i(p) {
    return typeof p < "u";
  }
  e.defined = i;
  function n(p) {
    return typeof p > "u";
  }
  e.undefined = n;
  function t(p) {
    return p === !0 || p === !1;
  }
  e.boolean = t;
  function o(p) {
    return r.call(p) === "[object String]";
  }
  e.string = o;
  function s(p) {
    return r.call(p) === "[object Number]";
  }
  e.number = s;
  function u(p, N, J) {
    return r.call(p) === "[object Number]" && N <= p && p <= J;
  }
  e.numberRange = u;
  function g(p) {
    return r.call(p) === "[object Number]" && -2147483648 <= p && p <= 2147483647;
  }
  e.integer = g;
  function c(p) {
    return r.call(p) === "[object Number]" && 0 <= p && p <= 2147483647;
  }
  e.uinteger = c;
  function v(p) {
    return r.call(p) === "[object Function]";
  }
  e.func = v;
  function d(p) {
    return p !== null && typeof p == "object";
  }
  e.objectLiteral = d;
  function k(p, N) {
    return Array.isArray(p) && p.every(N);
  }
  e.typedArray = k;
})(a || (a = {}));
var jt = class {
  constructor(e, r, i) {
    this._languageId = e, this._worker = r, this._disposables = [], this._listener = /* @__PURE__ */ Object.create(null);
    const n = (o) => {
      let s = o.getLanguageId();
      if (s !== this._languageId)
        return;
      let u;
      this._listener[o.uri.toString()] = o.onDidChangeContent(() => {
        window.clearTimeout(u), u = window.setTimeout(() => this._doValidate(o.uri, s), 500);
      }), this._doValidate(o.uri, s);
    }, t = (o) => {
      f.editor.setModelMarkers(o, this._languageId, []);
      let s = o.uri.toString(), u = this._listener[s];
      u && (u.dispose(), delete this._listener[s]);
    };
    this._disposables.push(f.editor.onDidCreateModel(n)), this._disposables.push(f.editor.onWillDisposeModel(t)), this._disposables.push(
      f.editor.onDidChangeModelLanguage((o) => {
        t(o.model), n(o.model);
      })
    ), this._disposables.push(
      i((o) => {
        f.editor.getModels().forEach((s) => {
          s.getLanguageId() === this._languageId && (t(s), n(s));
        });
      })
    ), this._disposables.push({
      dispose: () => {
        f.editor.getModels().forEach(t);
        for (let o in this._listener)
          this._listener[o].dispose();
      }
    }), f.editor.getModels().forEach(n);
  }
  dispose() {
    this._disposables.forEach((e) => e && e.dispose()), this._disposables.length = 0;
  }
  _doValidate(e, r) {
    this._worker(e).then((i) => i.doValidation(e.toString())).then((i) => {
      const n = i.map((o) => yt(e, o));
      let t = f.editor.getModel(e);
      t && t.getLanguageId() === r && f.editor.setModelMarkers(t, r, n);
    }).then(void 0, (i) => {
      console.error(i);
    });
  }
};
function xt(e) {
  switch (e) {
    case F.Error:
      return f.MarkerSeverity.Error;
    case F.Warning:
      return f.MarkerSeverity.Warning;
    case F.Information:
      return f.MarkerSeverity.Info;
    case F.Hint:
      return f.MarkerSeverity.Hint;
    default:
      return f.MarkerSeverity.Info;
  }
}
function yt(e, r) {
  let i = typeof r.code == "number" ? String(r.code) : r.code;
  return {
    severity: xt(r.severity),
    startLineNumber: r.range.start.line + 1,
    startColumn: r.range.start.character + 1,
    endLineNumber: r.range.end.line + 1,
    endColumn: r.range.end.character + 1,
    message: r.message,
    code: i,
    source: r.source
  };
}
var Pt = class {
  constructor(e, r) {
    this._worker = e, this._triggerCharacters = r;
  }
  get triggerCharacters() {
    return this._triggerCharacters;
  }
  provideCompletionItems(e, r, i, n) {
    const t = e.uri;
    return this._worker(t).then((o) => o.doComplete(t.toString(), R(r))).then((o) => {
      if (!o)
        return;
      const s = e.getWordUntilPosition(r), u = new f.Range(
        r.lineNumber,
        s.startColumn,
        r.lineNumber,
        s.endColumn
      ), g = o.items.map((c) => {
        const v = {
          label: c.label,
          insertText: c.insertText || c.label,
          sortText: c.sortText,
          filterText: c.filterText,
          documentation: c.documentation,
          detail: c.detail,
          command: Bt(c.command),
          range: u,
          kind: St(c.kind)
        };
        return c.textEdit && (Vt(c.textEdit) ? v.range = {
          insert: w(c.textEdit.insert),
          replace: w(c.textEdit.replace)
        } : v.range = w(c.textEdit.range), v.insertText = c.textEdit.newText), c.additionalTextEdits && (v.additionalTextEdits = c.additionalTextEdits.map(B)), c.insertTextFormat === oe.Snippet && (v.insertTextRules = f.languages.CompletionItemInsertTextRule.InsertAsSnippet), v;
      });
      return {
        isIncomplete: o.isIncomplete,
        suggestions: g
      };
    });
  }
};
function R(e) {
  if (e)
    return { character: e.column - 1, line: e.lineNumber - 1 };
}
function pt(e) {
  if (e)
    return {
      start: {
        line: e.startLineNumber - 1,
        character: e.startColumn - 1
      },
      end: { line: e.endLineNumber - 1, character: e.endColumn - 1 }
    };
}
function w(e) {
  if (e)
    return new f.Range(
      e.start.line + 1,
      e.start.character + 1,
      e.end.line + 1,
      e.end.character + 1
    );
}
function Vt(e) {
  return typeof e.insert < "u" && typeof e.replace < "u";
}
function St(e) {
  const r = f.languages.CompletionItemKind;
  switch (e) {
    case h.Text:
      return r.Text;
    case h.Method:
      return r.Method;
    case h.Function:
      return r.Function;
    case h.Constructor:
      return r.Constructor;
    case h.Field:
      return r.Field;
    case h.Variable:
      return r.Variable;
    case h.Class:
      return r.Class;
    case h.Interface:
      return r.Interface;
    case h.Module:
      return r.Module;
    case h.Property:
      return r.Property;
    case h.Unit:
      return r.Unit;
    case h.Value:
      return r.Value;
    case h.Enum:
      return r.Enum;
    case h.Keyword:
      return r.Keyword;
    case h.Snippet:
      return r.Snippet;
    case h.Color:
      return r.Color;
    case h.File:
      return r.File;
    case h.Reference:
      return r.Reference;
  }
  return r.Property;
}
function B(e) {
  if (e)
    return {
      range: w(e.range),
      text: e.newText
    };
}
function Bt(e) {
  return e && e.command === "editor.action.triggerSuggest" ? { id: e.command, title: e.title, arguments: e.arguments } : void 0;
}
var Wt = class {
  constructor(e) {
    this._worker = e;
  }
  provideHover(e, r, i) {
    let n = e.uri;
    return this._worker(n).then((t) => t.doHover(n.toString(), R(r))).then((t) => {
      if (t)
        return {
          range: w(t.range),
          contents: zt(t.contents)
        };
    });
  }
};
function Ht(e) {
  return e && typeof e == "object" && typeof e.kind == "string";
}
function ot(e) {
  return typeof e == "string" ? {
    value: e
  } : Ht(e) ? e.kind === "plaintext" ? {
    value: e.value.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&")
  } : {
    value: e.value
  } : { value: "```" + e.language + `
` + e.value + "\n```\n" };
}
function zt(e) {
  if (e)
    return Array.isArray(e) ? e.map(ot) : [ot(e)];
}
var hn = class {
  constructor(e) {
    this._worker = e;
  }
  provideDocumentHighlights(e, r, i) {
    const n = e.uri;
    return this._worker(n).then((t) => t.findDocumentHighlights(n.toString(), R(r))).then((t) => {
      if (t)
        return t.map((o) => ({
          range: w(o.range),
          kind: Xt(o.kind)
        }));
    });
  }
};
function Xt(e) {
  switch (e) {
    case V.Read:
      return f.languages.DocumentHighlightKind.Read;
    case V.Write:
      return f.languages.DocumentHighlightKind.Write;
    case V.Text:
      return f.languages.DocumentHighlightKind.Text;
  }
  return f.languages.DocumentHighlightKind.Text;
}
var _n = class {
  constructor(e) {
    this._worker = e;
  }
  provideDefinition(e, r, i) {
    const n = e.uri;
    return this._worker(n).then((t) => t.findDefinition(n.toString(), R(r))).then((t) => {
      if (t)
        return [vt(t)];
    });
  }
};
function vt(e) {
  return {
    uri: f.Uri.parse(e.uri),
    range: w(e.range)
  };
}
var kn = class {
  constructor(e) {
    this._worker = e;
  }
  provideReferences(e, r, i, n) {
    const t = e.uri;
    return this._worker(t).then((o) => o.findReferences(t.toString(), R(r))).then((o) => {
      if (o)
        return o.map(vt);
    });
  }
}, bn = class {
  constructor(e) {
    this._worker = e;
  }
  provideRenameEdits(e, r, i, n) {
    const t = e.uri;
    return this._worker(t).then((o) => o.doRename(t.toString(), R(r), i)).then((o) => qt(o));
  }
};
function qt(e) {
  if (!e || !e.changes)
    return;
  let r = [];
  for (let i in e.changes) {
    const n = f.Uri.parse(i);
    for (let t of e.changes[i])
      r.push({
        resource: n,
        versionId: void 0,
        textEdit: {
          range: w(t.range),
          text: t.newText
        }
      });
  }
  return {
    edits: r
  };
}
var Jt = class {
  constructor(e) {
    this._worker = e;
  }
  provideDocumentSymbols(e, r) {
    const i = e.uri;
    return this._worker(i).then((n) => n.findDocumentSymbols(i.toString())).then((n) => {
      if (n)
        return n.map((t) => $t(t) ? mt(t) : {
          name: t.name,
          detail: "",
          containerName: t.containerName,
          kind: ht(t.kind),
          range: w(t.location.range),
          selectionRange: w(t.location.range),
          tags: []
        });
    });
  }
};
function $t(e) {
  return "children" in e;
}
function mt(e) {
  return {
    name: e.name,
    detail: e.detail ?? "",
    kind: ht(e.kind),
    range: w(e.range),
    selectionRange: w(e.selectionRange),
    tags: e.tags ?? [],
    children: (e.children ?? []).map((r) => mt(r))
  };
}
function ht(e) {
  let r = f.languages.SymbolKind;
  switch (e) {
    case _.File:
      return r.File;
    case _.Module:
      return r.Module;
    case _.Namespace:
      return r.Namespace;
    case _.Package:
      return r.Package;
    case _.Class:
      return r.Class;
    case _.Method:
      return r.Method;
    case _.Property:
      return r.Property;
    case _.Field:
      return r.Field;
    case _.Constructor:
      return r.Constructor;
    case _.Enum:
      return r.Enum;
    case _.Interface:
      return r.Interface;
    case _.Function:
      return r.Function;
    case _.Variable:
      return r.Variable;
    case _.Constant:
      return r.Constant;
    case _.String:
      return r.String;
    case _.Number:
      return r.Number;
    case _.Boolean:
      return r.Boolean;
    case _.Array:
      return r.Array;
  }
  return r.Function;
}
var wn = class {
  constructor(e) {
    this._worker = e;
  }
  provideLinks(e, r) {
    const i = e.uri;
    return this._worker(i).then((n) => n.findDocumentLinks(i.toString())).then((n) => {
      if (n)
        return {
          links: n.map((t) => ({
            range: w(t.range),
            url: t.target
          }))
        };
    });
  }
}, Qt = class {
  constructor(e) {
    this._worker = e;
  }
  provideDocumentFormattingEdits(e, r, i) {
    const n = e.uri;
    return this._worker(n).then((t) => t.format(n.toString(), null, _t(r)).then((o) => {
      if (!(!o || o.length === 0))
        return o.map(B);
    }));
  }
}, Yt = class {
  constructor(e) {
    this._worker = e, this.canFormatMultipleRanges = !1;
  }
  provideDocumentRangeFormattingEdits(e, r, i, n) {
    const t = e.uri;
    return this._worker(t).then((o) => o.format(t.toString(), pt(r), _t(i)).then((s) => {
      if (!(!s || s.length === 0))
        return s.map(B);
    }));
  }
};
function _t(e) {
  return {
    tabSize: e.tabSize,
    insertSpaces: e.insertSpaces
  };
}
var Gt = class {
  constructor(e) {
    this._worker = e;
  }
  provideDocumentColors(e, r) {
    const i = e.uri;
    return this._worker(i).then((n) => n.findDocumentColors(i.toString())).then((n) => {
      if (n)
        return n.map((t) => ({
          color: t.color,
          range: w(t.range)
        }));
    });
  }
  provideColorPresentations(e, r, i) {
    const n = e.uri;
    return this._worker(n).then(
      (t) => t.getColorPresentations(n.toString(), r.color, pt(r.range))
    ).then((t) => {
      if (t)
        return t.map((o) => {
          let s = {
            label: o.label
          };
          return o.textEdit && (s.textEdit = B(o.textEdit)), o.additionalTextEdits && (s.additionalTextEdits = o.additionalTextEdits.map(B)), s;
        });
    });
  }
}, Zt = class {
  constructor(e) {
    this._worker = e;
  }
  provideFoldingRanges(e, r, i) {
    const n = e.uri;
    return this._worker(n).then((t) => t.getFoldingRanges(n.toString(), r)).then((t) => {
      if (t)
        return t.map((o) => {
          const s = {
            start: o.startLine + 1,
            end: o.endLine + 1
          };
          return typeof o.kind < "u" && (s.kind = Kt(o.kind)), s;
        });
    });
  }
};
function Kt(e) {
  switch (e) {
    case P.Comment:
      return f.languages.FoldingRangeKind.Comment;
    case P.Imports:
      return f.languages.FoldingRangeKind.Imports;
    case P.Region:
      return f.languages.FoldingRangeKind.Region;
  }
}
var Ct = class {
  constructor(e) {
    this._worker = e;
  }
  provideSelectionRanges(e, r, i) {
    const n = e.uri;
    return this._worker(n).then(
      (t) => t.getSelectionRanges(
        n.toString(),
        r.map(R)
      )
    ).then((t) => {
      if (t)
        return t.map((o) => {
          const s = [];
          for (; o; )
            s.push({ range: w(o.range) }), o = o.parent;
          return s;
        });
    });
  }
};
function en(e, r = !1) {
  const i = e.length;
  let n = 0, t = "", o = 0, s = 16, u = 0, g = 0, c = 0, v = 0, d = 0;
  function k(l, A) {
    let L = 0, I = 0;
    for (; L < l; ) {
      let b = e.charCodeAt(n);
      if (b >= 48 && b <= 57)
        I = I * 16 + b - 48;
      else if (b >= 65 && b <= 70)
        I = I * 16 + b - 65 + 10;
      else if (b >= 97 && b <= 102)
        I = I * 16 + b - 97 + 10;
      else
        break;
      n++, L++;
    }
    return L < l && (I = -1), I;
  }
  function p(l) {
    n = l, t = "", o = 0, s = 16, d = 0;
  }
  function N() {
    let l = n;
    if (e.charCodeAt(n) === 48)
      n++;
    else
      for (n++; n < e.length && M(e.charCodeAt(n)); )
        n++;
    if (n < e.length && e.charCodeAt(n) === 46)
      if (n++, n < e.length && M(e.charCodeAt(n)))
        for (n++; n < e.length && M(e.charCodeAt(n)); )
          n++;
      else
        return d = 3, e.substring(l, n);
    let A = n;
    if (n < e.length && (e.charCodeAt(n) === 69 || e.charCodeAt(n) === 101))
      if (n++, (n < e.length && e.charCodeAt(n) === 43 || e.charCodeAt(n) === 45) && n++, n < e.length && M(e.charCodeAt(n))) {
        for (n++; n < e.length && M(e.charCodeAt(n)); )
          n++;
        A = n;
      } else
        d = 3;
    return e.substring(l, A);
  }
  function J() {
    let l = "", A = n;
    for (; ; ) {
      if (n >= i) {
        l += e.substring(A, n), d = 2;
        break;
      }
      const L = e.charCodeAt(n);
      if (L === 34) {
        l += e.substring(A, n), n++;
        break;
      }
      if (L === 92) {
        if (l += e.substring(A, n), n++, n >= i) {
          d = 2;
          break;
        }
        switch (e.charCodeAt(n++)) {
          case 34:
            l += '"';
            break;
          case 92:
            l += "\\";
            break;
          case 47:
            l += "/";
            break;
          case 98:
            l += "\b";
            break;
          case 102:
            l += "\f";
            break;
          case 110:
            l += `
`;
            break;
          case 114:
            l += "\r";
            break;
          case 116:
            l += "	";
            break;
          case 117:
            const b = k(4);
            b >= 0 ? l += String.fromCharCode(b) : d = 4;
            break;
          default:
            d = 5;
        }
        A = n;
        continue;
      }
      if (L >= 0 && L <= 31)
        if (x(L)) {
          l += e.substring(A, n), d = 2;
          break;
        } else
          d = 6;
      n++;
    }
    return l;
  }
  function ce() {
    if (t = "", d = 0, o = n, g = u, v = c, n >= i)
      return o = i, s = 17;
    let l = e.charCodeAt(n);
    if ($(l)) {
      do
        n++, t += String.fromCharCode(l), l = e.charCodeAt(n);
      while ($(l));
      return s = 15;
    }
    if (x(l))
      return n++, t += String.fromCharCode(l), l === 13 && e.charCodeAt(n) === 10 && (n++, t += `
`), u++, c = n, s = 14;
    switch (l) {
      case 123:
        return n++, s = 1;
      case 125:
        return n++, s = 2;
      case 91:
        return n++, s = 3;
      case 93:
        return n++, s = 4;
      case 58:
        return n++, s = 6;
      case 44:
        return n++, s = 5;
      case 34:
        return n++, t = J(), s = 10;
      case 47:
        const A = n - 1;
        if (e.charCodeAt(n + 1) === 47) {
          for (n += 2; n < i && !x(e.charCodeAt(n)); )
            n++;
          return t = e.substring(A, n), s = 12;
        }
        if (e.charCodeAt(n + 1) === 42) {
          n += 2;
          const L = i - 1;
          let I = !1;
          for (; n < L; ) {
            const b = e.charCodeAt(n);
            if (b === 42 && e.charCodeAt(n + 1) === 47) {
              n += 2, I = !0;
              break;
            }
            n++, x(b) && (b === 13 && e.charCodeAt(n) === 10 && n++, u++, c = n);
          }
          return I || (n++, d = 1), t = e.substring(A, n), s = 13;
        }
        return t += String.fromCharCode(l), n++, s = 16;
      case 45:
        if (t += String.fromCharCode(l), n++, n === i || !M(e.charCodeAt(n)))
          return s = 16;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return t += N(), s = 11;
      default:
        for (; n < i && At(l); )
          n++, l = e.charCodeAt(n);
        if (o !== n) {
          switch (t = e.substring(o, n), t) {
            case "true":
              return s = 8;
            case "false":
              return s = 9;
            case "null":
              return s = 7;
          }
          return s = 16;
        }
        return t += String.fromCharCode(l), n++, s = 16;
    }
  }
  function At(l) {
    if ($(l) || x(l))
      return !1;
    switch (l) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return !1;
    }
    return !0;
  }
  function It() {
    let l;
    do
      l = ce();
    while (l >= 12 && l <= 15);
    return l;
  }
  return {
    setPosition: p,
    getPosition: () => n,
    scan: r ? It : ce,
    getToken: () => s,
    getTokenValue: () => t,
    getTokenOffset: () => o,
    getTokenLength: () => n - o,
    getTokenStartLine: () => g,
    getTokenStartCharacter: () => o - v,
    getTokenError: () => d
  };
}
function $(e) {
  return e === 32 || e === 9;
}
function x(e) {
  return e === 10 || e === 13;
}
function M(e) {
  return e >= 48 && e <= 57;
}
var st;
(function(e) {
  e[e.lineFeed = 10] = "lineFeed", e[e.carriageReturn = 13] = "carriageReturn", e[e.space = 32] = "space", e[e._0 = 48] = "_0", e[e._1 = 49] = "_1", e[e._2 = 50] = "_2", e[e._3 = 51] = "_3", e[e._4 = 52] = "_4", e[e._5 = 53] = "_5", e[e._6 = 54] = "_6", e[e._7 = 55] = "_7", e[e._8 = 56] = "_8", e[e._9 = 57] = "_9", e[e.a = 97] = "a", e[e.b = 98] = "b", e[e.c = 99] = "c", e[e.d = 100] = "d", e[e.e = 101] = "e", e[e.f = 102] = "f", e[e.g = 103] = "g", e[e.h = 104] = "h", e[e.i = 105] = "i", e[e.j = 106] = "j", e[e.k = 107] = "k", e[e.l = 108] = "l", e[e.m = 109] = "m", e[e.n = 110] = "n", e[e.o = 111] = "o", e[e.p = 112] = "p", e[e.q = 113] = "q", e[e.r = 114] = "r", e[e.s = 115] = "s", e[e.t = 116] = "t", e[e.u = 117] = "u", e[e.v = 118] = "v", e[e.w = 119] = "w", e[e.x = 120] = "x", e[e.y = 121] = "y", e[e.z = 122] = "z", e[e.A = 65] = "A", e[e.B = 66] = "B", e[e.C = 67] = "C", e[e.D = 68] = "D", e[e.E = 69] = "E", e[e.F = 70] = "F", e[e.G = 71] = "G", e[e.H = 72] = "H", e[e.I = 73] = "I", e[e.J = 74] = "J", e[e.K = 75] = "K", e[e.L = 76] = "L", e[e.M = 77] = "M", e[e.N = 78] = "N", e[e.O = 79] = "O", e[e.P = 80] = "P", e[e.Q = 81] = "Q", e[e.R = 82] = "R", e[e.S = 83] = "S", e[e.T = 84] = "T", e[e.U = 85] = "U", e[e.V = 86] = "V", e[e.W = 87] = "W", e[e.X = 88] = "X", e[e.Y = 89] = "Y", e[e.Z = 90] = "Z", e[e.asterisk = 42] = "asterisk", e[e.backslash = 92] = "backslash", e[e.closeBrace = 125] = "closeBrace", e[e.closeBracket = 93] = "closeBracket", e[e.colon = 58] = "colon", e[e.comma = 44] = "comma", e[e.dot = 46] = "dot", e[e.doubleQuote = 34] = "doubleQuote", e[e.minus = 45] = "minus", e[e.openBrace = 123] = "openBrace", e[e.openBracket = 91] = "openBracket", e[e.plus = 43] = "plus", e[e.slash = 47] = "slash", e[e.formFeed = 12] = "formFeed", e[e.tab = 9] = "tab";
})(st || (st = {}));
new Array(20).fill(0).map((e, r) => " ".repeat(r));
var D = 200;
new Array(D).fill(0).map((e, r) => `
` + " ".repeat(r)), new Array(D).fill(0).map((e, r) => "\r" + " ".repeat(r)), new Array(D).fill(0).map((e, r) => `\r
` + " ".repeat(r)), new Array(D).fill(0).map((e, r) => `
` + "	".repeat(r)), new Array(D).fill(0).map((e, r) => "\r" + "	".repeat(r)), new Array(D).fill(0).map((e, r) => `\r
` + "	".repeat(r));
var at;
(function(e) {
  e.DEFAULT = {
    allowTrailingComma: !1
  };
})(at || (at = {}));
var tn = en, ut;
(function(e) {
  e[e.None = 0] = "None", e[e.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", e[e.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", e[e.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", e[e.InvalidUnicode = 4] = "InvalidUnicode", e[e.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", e[e.InvalidCharacter = 6] = "InvalidCharacter";
})(ut || (ut = {}));
var ct;
(function(e) {
  e[e.OpenBraceToken = 1] = "OpenBraceToken", e[e.CloseBraceToken = 2] = "CloseBraceToken", e[e.OpenBracketToken = 3] = "OpenBracketToken", e[e.CloseBracketToken = 4] = "CloseBracketToken", e[e.CommaToken = 5] = "CommaToken", e[e.ColonToken = 6] = "ColonToken", e[e.NullKeyword = 7] = "NullKeyword", e[e.TrueKeyword = 8] = "TrueKeyword", e[e.FalseKeyword = 9] = "FalseKeyword", e[e.StringLiteral = 10] = "StringLiteral", e[e.NumericLiteral = 11] = "NumericLiteral", e[e.LineCommentTrivia = 12] = "LineCommentTrivia", e[e.BlockCommentTrivia = 13] = "BlockCommentTrivia", e[e.LineBreakTrivia = 14] = "LineBreakTrivia", e[e.Trivia = 15] = "Trivia", e[e.Unknown = 16] = "Unknown", e[e.EOF = 17] = "EOF";
})(ct || (ct = {}));
var lt;
(function(e) {
  e[e.InvalidSymbol = 1] = "InvalidSymbol", e[e.InvalidNumberFormat = 2] = "InvalidNumberFormat", e[e.PropertyNameExpected = 3] = "PropertyNameExpected", e[e.ValueExpected = 4] = "ValueExpected", e[e.ColonExpected = 5] = "ColonExpected", e[e.CommaExpected = 6] = "CommaExpected", e[e.CloseBraceExpected = 7] = "CloseBraceExpected", e[e.CloseBracketExpected = 8] = "CloseBracketExpected", e[e.EndOfFileExpected = 9] = "EndOfFileExpected", e[e.InvalidCommentToken = 10] = "InvalidCommentToken", e[e.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", e[e.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", e[e.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", e[e.InvalidUnicode = 14] = "InvalidUnicode", e[e.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", e[e.InvalidCharacter = 16] = "InvalidCharacter";
})(lt || (lt = {}));
function nn(e) {
  return {
    getInitialState: () => new bt(null, null, !1, null),
    tokenize: (r, i) => gn(e, r, i)
  };
}
var ft = "delimiter.bracket.json", dt = "delimiter.array.json", rn = "delimiter.colon.json", on = "delimiter.comma.json", sn = "keyword.json", an = "keyword.json", un = "string.value.json", cn = "number.json", ln = "string.key.json", fn = "comment.block.json", dn = "comment.line.json", y = class kt {
  constructor(r, i) {
    this.parent = r, this.type = i;
  }
  static pop(r) {
    return r ? r.parent : null;
  }
  static push(r, i) {
    return new kt(r, i);
  }
  static equals(r, i) {
    if (!r && !i)
      return !0;
    if (!r || !i)
      return !1;
    for (; r && i; ) {
      if (r === i)
        return !0;
      if (r.type !== i.type)
        return !1;
      r = r.parent, i = i.parent;
    }
    return !0;
  }
}, bt = class ue {
  constructor(r, i, n, t) {
    this._state = r, this.scanError = i, this.lastWasColon = n, this.parents = t;
  }
  clone() {
    return new ue(this._state, this.scanError, this.lastWasColon, this.parents);
  }
  equals(r) {
    return r === this ? !0 : !r || !(r instanceof ue) ? !1 : this.scanError === r.scanError && this.lastWasColon === r.lastWasColon && y.equals(this.parents, r.parents);
  }
  getStateData() {
    return this._state;
  }
  setStateData(r) {
    this._state = r;
  }
};
function gn(e, r, i, n = 0) {
  let t = 0, o = !1;
  switch (i.scanError) {
    case 2:
      r = '"' + r, t = 1;
      break;
    case 1:
      r = "/*" + r, t = 2;
      break;
  }
  const s = tn(r);
  let u = i.lastWasColon, g = i.parents;
  const c = {
    tokens: [],
    endState: i.clone()
  };
  for (; ; ) {
    let v = n + s.getPosition(), d = "";
    const k = s.scan();
    if (k === 17)
      break;
    if (v === n + s.getPosition())
      throw new Error(
        "Scanner did not advance, next 3 characters are: " + r.substr(s.getPosition(), 3)
      );
    switch (o && (v -= t), o = t > 0, k) {
      case 1:
        g = y.push(
          g,
          0
          /* Object */
        ), d = ft, u = !1;
        break;
      case 2:
        g = y.pop(g), d = ft, u = !1;
        break;
      case 3:
        g = y.push(
          g,
          1
          /* Array */
        ), d = dt, u = !1;
        break;
      case 4:
        g = y.pop(g), d = dt, u = !1;
        break;
      case 6:
        d = rn, u = !0;
        break;
      case 5:
        d = on, u = !1;
        break;
      case 8:
      case 9:
        d = sn, u = !1;
        break;
      case 7:
        d = an, u = !1;
        break;
      case 10:
        const N = (g ? g.type : 0) === 1;
        d = u || N ? un : ln, u = !1;
        break;
      case 11:
        d = cn, u = !1;
        break;
    }
    switch (k) {
      case 12:
        d = dn;
        break;
      case 13:
        d = fn;
        break;
    }
    c.endState = new bt(
      i.getStateData(),
      s.getTokenError(),
      u,
      g
    ), c.tokens.push({
      startIndex: v,
      scopes: d
    });
  }
  return c;
}
var E;
function An() {
  return new Promise((e, r) => {
    if (!E)
      return r("JSON not registered!");
    e(E);
  });
}
var pn = class extends jt {
  constructor(e, r, i) {
    super(e, r, i.onDidChange), this._disposables.push(
      f.editor.onWillDisposeModel((n) => {
        this._resetSchema(n.uri);
      })
    ), this._disposables.push(
      f.editor.onDidChangeModelLanguage((n) => {
        this._resetSchema(n.model.uri);
      })
    );
  }
  _resetSchema(e) {
    this._worker().then((r) => {
      r.resetSchema(e.toString());
    });
  }
};
function In(e) {
  const r = [], i = [], n = new Ut(e);
  r.push(n), E = (...s) => n.getLanguageServiceWorker(...s);
  function t() {
    const { languageId: s, modeConfiguration: u } = e;
    wt(i), u.documentFormattingEdits && i.push(
      f.languages.registerDocumentFormattingEditProvider(
        s,
        new Qt(E)
      )
    ), u.documentRangeFormattingEdits && i.push(
      f.languages.registerDocumentRangeFormattingEditProvider(
        s,
        new Yt(E)
      )
    ), u.completionItems && i.push(
      f.languages.registerCompletionItemProvider(
        s,
        new Pt(E, [" ", ":", '"'])
      )
    ), u.hovers && i.push(
      f.languages.registerHoverProvider(s, new Wt(E))
    ), u.documentSymbols && i.push(
      f.languages.registerDocumentSymbolProvider(
        s,
        new Jt(E)
      )
    ), u.tokens && i.push(f.languages.setTokensProvider(s, nn(!0))), u.colors && i.push(
      f.languages.registerColorProvider(
        s,
        new Gt(E)
      )
    ), u.foldingRanges && i.push(
      f.languages.registerFoldingRangeProvider(
        s,
        new Zt(E)
      )
    ), u.diagnostics && i.push(new pn(s, E, e)), u.selectionRanges && i.push(
      f.languages.registerSelectionRangeProvider(
        s,
        new Ct(E)
      )
    );
  }
  t(), r.push(f.languages.setLanguageConfiguration(e.languageId, vn));
  let o = e.modeConfiguration;
  return e.onDidChange((s) => {
    s.modeConfiguration !== o && (o = s.modeConfiguration, t());
  }), r.push(gt(i)), gt(r);
}
function gt(e) {
  return { dispose: () => wt(e) };
}
function wt(e) {
  for (; e.length; )
    e.pop().dispose();
}
var vn = {
  wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}", notIn: ["string"] },
    { open: "[", close: "]", notIn: ["string"] },
    { open: '"', close: '"', notIn: ["string"] }
  ]
};
export {
  Pt as CompletionAdapter,
  _n as DefinitionAdapter,
  jt as DiagnosticsAdapter,
  Gt as DocumentColorAdapter,
  Qt as DocumentFormattingEditProvider,
  hn as DocumentHighlightAdapter,
  wn as DocumentLinkAdapter,
  Yt as DocumentRangeFormattingEditProvider,
  Jt as DocumentSymbolAdapter,
  Zt as FoldingRangeAdapter,
  Wt as HoverAdapter,
  kn as ReferenceAdapter,
  bn as RenameAdapter,
  Ct as SelectionRangeAdapter,
  Ut as WorkerManager,
  R as fromPosition,
  pt as fromRange,
  An as getWorker,
  In as setupMode,
  w as toRange,
  B as toTextEdit
};
